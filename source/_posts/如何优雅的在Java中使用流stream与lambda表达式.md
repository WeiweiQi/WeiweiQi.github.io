---
title: 如何优雅的在Java中使用lambda表达式
comments: true
date: 2021-06-01 14:34:56
categories: 后端
tags: Java
---



这是我参与更文挑战的第2天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)


#### lambda表达式的使用

使用lambda表达式的目的是**解决匿名类的繁琐，以及Java中的函数式编程问题**，比如著名的策略模式。

我们使用lambda表达式的主要目的是为了**代码简洁**，如果使用lambda导致代码阅读与理解费力，不便于沟通，就得不偿失了。

我最早使用lambda表达式是在创建线程时。

对比使用lambda与不使用lambda的代码：

```java
/**
 * 	不使用lambda
*/
new Thread(new Runnable() {
    public void run() {
        System.out.println("无lambda：线程执行");
    }
}).start();

/**
* 	使用lambda
*/
new Thread(() -> {
    System.out.println("lambda：线程执行");
}).start();

```

lambda代码更简洁。

【Effective Java】[第三版]第42条，列举了排序的lambda写法，编译器利用**类型推导**，根据上下文推断出这些类型。代码如下所示：

```java
Collections.sort(words, (s1, s2) -> Integer.compare(s1.length(), s2.length()));
```

作者提到，应该**删除所有lambda参数的类型，除非它们的存在能够使程序变得更加清晰。**

在第43条，作者推荐：方法引用优先于lambda，即上述代码可以修改为：

```java
Collections.sort(words, comparingInt(String::length));
```

代码不光应该让编译器读懂，更应该让人读懂，如果一个参数，代码阅读者不能很快的推导出其类型，就要考虑lambda的写法是否合适了。**lambda没有名称和文档，如果一个计算本身不是自描述的，或者超出了几行，那就不要把它放在一个lambda中**。【Effective Java】[第三版]P166。

#### 自定义lambda接口

**只要标准的函数接口能够满足需求，通常应该优先考虑，而不是专门再构建一个新的函数接口。**【Effective Java】第44条P169。

只有你所需要的函数接口满足以下特征时，才考虑自己编写函数接口：

1. 通用，并且将受益与描述性名称。
2. 具有与其关联的严格的契约。
3. 将受益于定制的缺省方法。

必须始终用@FunctionalInterface注解对自己编写的函数接口进行标注。

一个自定义与使用样例如下：

```java
@FunctionalInterface
public interface Number<T> {
	T operate(T a, T b);
}

// 执行过程中
Number<Integer> add = (a, b) -> a + b;
Number<Integer> multi = (a, b) -> a * b;
System.out.println(add.operate(3, 4)); // 7
System.out.println(multi.operate(3, 4)); // 12
```



