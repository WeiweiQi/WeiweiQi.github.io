---
title: 深入理解ThreadLocal及使用
comments: true
date: 2022-04-29 16:57:50
categories:
tags:
---

1

## 学习起源

学习ThreadLocal起源于最近学习的两个框架：若依开源系统，以及权限验证的开源框架Shiro。

在若依开源系统中，其分页插件：PageHelper的部分核心代码中，有：

```java
package com.github.pagehelper.page;

public abstract class PageMethod {
    protected static final ThreadLocal<Page> LOCAL_PAGE = new ThreadLocal();

    public PageMethod() {
    }

    protected static void setLocalPage(Page page) {
        LOCAL_PAGE.set(page);
    }

    public static <T> Page<T> getLocalPage() {
        return (Page)LOCAL_PAGE.get();
    }

    public static void clearPage() {
        LOCAL_PAGE.remove();
    }
    
    // 省略的其他代码...
}
```

而shiro核心版块中有：

```java
public abstract class ThreadContext {
    private static final ThreadLocal<Map<Object, Object>> resources = new ThreadContext.InheritableThreadLocalMap();

    protected ThreadContext() {
    }

    public static Map<Object, Object> getResources() {
        return (Map)(resources.get() == null ? Collections.emptyMap() : new HashMap((Map)resources.get()));
    }

    public static void setResources(Map<Object, Object> newResources) {
        if (!CollectionUtils.isEmpty(newResources)) {
            ensureResourcesInitialized();
            ((Map)resources.get()).clear();
            ((Map)resources.get()).putAll(newResources);
        }
    }
}

```

其中，都用到一个非常强大的类：ThreadLocal。

在PageHelper中，使用TheadLocal来保存分页参数`Page`，在Shiro中，使用ThreadLocal保存了一个`map<Object, Object>`对象`Resources`，根据上下文可以看出shiro中的ThreadLocal保存了当前登录账号，或者说当前登录对象的信息，即shiro中的核心对象subject。

ThreadLocal给予了我们为当前线程局部保存变量的能力，换一个角度，ThreadLocal可以做到线程的数据隔离。

## ThreadLocal的原理

只有特定线程能取出特定线程的数据，这一点我们很容易联想到ThreadLocal的实现原理：构造一个Map映射对象，以Thread为键值key，以特定的值为存储的值，从而实现每次取值只能取当前线程保存的值。

ThreadLocal的两个重要的api为get，set，可以通过其源码看到这一原理的实现方式：

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}

public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

其中构造了一个特定的映射对象ThreadLocalMap，我们不再赘述。

ThreadLocal可以存储线程执行上下文信息，简化一些线程中方法调用栈参数逐层传递的问题，比如我们在文章《[拦截器中巧用ThreadLocal规避层层传值](https://bbs.huaweicloud.com/blogs/349743)》中提到的，使用ThreadLocal保存请求Request，从而在接口内部可以直接获取当前请求信息，利用这一点可以做很多事情，例如我们可以抛开shiro做自己定制的权限验证系统。

ThreadLocal也解决了某些线程不安全问题，例如时间日期格式化类SimpleDateFormate是非线程安全的，我们通过ThreadLocal来设置则规避了这一点：

```java
public static final ThreadLocal<DateFormat> df_yyyy_MM_dd = 
			ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
```

## 特别注意

当ThreadLocal与线程池一起使用时，便会有一个问题，当从线程池取出一个线程后并归还后，下次从线程池中取同样的线程，保存在ThreadLocal中的值是否会泄露？

不谈实验，根据我们查找的资料，对这个问题有两种看法，[一种说法](https://droidyue.com/blog/2016/03/13/learning-threadlocal-in-java/)是ThreadLocal中使用的键值并非是Thread，而是线程Thread的弱引用，当线程回收时会触发垃圾回收机制，并不会造成数据泄露；更多的资料反应存在内存泄露问题以及生产环境发生过的惨案，如[记一次Java线程池与ThreadLocal引发的血案](https://blog.csdn.net/u010597819/article/details/87351624)以及[An Introduction to ThreadLocal in Java](https://www.baeldung.com/java-threadlocal)。

更准确地说，当ThreadLocal的修饰符有static时，即强引用的ThreadLocal需要我们手动使用remove方法来释放数据，为了养成良好的习惯，建议还是当ThreadLocal使用结束后，就调用其remove方法。



