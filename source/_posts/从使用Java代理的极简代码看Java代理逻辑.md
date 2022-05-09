---
title: 从使用Java代理的极简代码看Java代理逻辑
comments: true
date: 2022-04-20 19:56:36
categories:
tags:
---

## 问题起源

最近受到注解启发，学习了Java注解的实现方式，以及Java注解执行器中涉及到的Java反射的过程，但是笔者本人更关心的拦截器、过滤器等涉及到的Java AOP还没有涉及到。网上搜索到的很多关于AOP的实现都与Spring做了深度绑定，然而，我有个小癖好，不太喜欢与框架深度绑定的，所以，我们只是简简单单的学习一下AOP的实现方式，而不是Spring AOP的实现方式，因为“我们要做Java Developer，而不是Spring Developer”。

## 代理

想要实现AOP，先要学习Java中的代理。代理模式的含义是：

> 给某一个对象提供一个代理，并由代理对象控制对原对象的引用。

代理分为静态代理，动态代理。

### 静态代理

静态代理的例子代码如下所示，我们不做过多的叙述，具体可以看文中注释。（其实，自己把代码敲一遍就知道能够理解静态代理了。）

```java
public interface ApiCall {
    void call();
}

/**
* 具体的执行类
*/
public class SaleApiCall implements ApiCall {
    private String name;


    public SaleApiCall(String name) {
        this.name = name;
    }

    public void call() {
        System.out.println(name + "被调用");
    }
}

public class SaleApiCallProxy implements ApiCall {
    SaleApiCall saleApiCall;

    public SaleApiCallProxy(ApiCall api) {
        if (api.getClass() == SaleApiCall.class) {
            this.saleApiCall = (SaleApiCall) api;
        }
    }

    //代理执行，调用被代理接口的行为
    public void call() {
        // before 这里可以添加方法执行器的逻辑
        saleApiCall.call();
        // after 这里可以添加方法执行后的逻辑
    }
}

public class StaticProxyTest {
    public static void main(String[] args) {
        ApiCall qw = new SaleApiCall("订单接口");
        ApiCall proxy = new SaleApiCallProxy(qw);
        proxy.call();
    }
}
```

输出结果：

```shell
订单接口被调用
```

### 动态代理

动态代理分为JDK动态代理与使用cglib的动态代理，前者需要被代理对象实现接口，而后者不需要。我们先来看看如何使用JDK来完成动态代理。

理解下面代码代码“动态”的核心观念在于，我们没有修改所要代理的对象内部，而是通过外部代理类来获取对象与执行方法。

例如，原本有一个接口`Person`与一个实现接口的类`Programmer`：

```java
public interface Person {
    void work();
}

public class Programmer implements Person{
    String name;

    public Programmer(String name) {
        this.name = name;
    }

    @Override
    public void work() {
        System.out.println(name + "进行编程工作");
    }
}
```

现在，我们希望在不改变原内容的情况下，通过代理方式生成Programmer对象并对其执行前后插入指定的行为：

```java
public class ProgrammerInvocationHandler<T> implements InvocationHandler {
    T target;

    public ProgrammerInvocationHandler(T target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println(method.getName() + "方法执行前");
        Object result = method.invoke(target, args);
        System.out.println(method.getName() + "方法执行后");
        return result;
    }
}
```

上述类实现了接口`InvocationHandler`，这个接口中有一个方法invoke，我们可以从invoke的内部代码大致猜测到其执行逻辑，尤其是`method.invoke(...)`这一句。

```java
public class DynamicProxyTest {
    public static void main(String[] args) {
        Person realPerson = new Programmer("洛叶飘");
        InvocationHandler programmerInvocationHandler = new ProgrammerInvocationHandler<Person>(realPerson);
        Person lyp = (Person) Proxy.newProxyInstance(Person.class.getClassLoader(), new Class<?>[]{Person.class}, programmerInvocationHandler);
        lyp.work();
    }
}
```

如上所示，便通过Invocation与Proxy生成了监听的对象`lyp`，这个对象的所有方法执行，都会触发`ProgrammerInvocationHandler`中的invoke方法。

上述方法的执行结果如下：

```
work方法执行前
洛叶飘进行编程工作
work方法执行后
```

这种方法需要我们的类Programmer来实现一个接口Person，那么又没有更简单的方式呢？

有的，那就是使用cglib包。