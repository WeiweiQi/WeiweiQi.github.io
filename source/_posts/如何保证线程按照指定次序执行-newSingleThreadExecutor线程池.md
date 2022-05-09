---
title: 如何保证线程按照指定次序执行-newSingleThreadExecutor线程池
comments: true
date: 2022-03-09 18:01:38
categories:
tags:
---




在上一篇文章《[如何保证线程按照指定次序执行-Thread.join](https://bbs.huaweicloud.com/blogs/336215)》中，介绍了如何通过Thread.join()函数实现多个线程按照指定次序执行，今天我们来看另一种方式，通过线程池的方式来实现。

首先来看基础的例子：

```java
public class ThreadPoolTest {

    public static void main(String[] args) {

        Thread A = new Thread(() -> System.out.println("A"));
        Thread B = new Thread(() -> System.out.println("B"));
        Thread C = new Thread(() -> System.out.println("C"));

        A.start();
        B.start();
        C.start();

    }
}
```

上述代码无法保证程序的执行顺序，我们引入线程池。使用`newSingleThreadExecutor`方法。

`newSingleThreadExecutor`的官方释义如下：

> ```java
> public static ExecutorService newSingleThreadExecutor()
> ```
>
> 
>
> 创建一个使用从无界队列运行的单个工作线程的执行程序。 （请注意，如果这个单个线程由于在关闭之前的执行过程中发生故障而终止，则如果需要执行后续任务，则新的线程将占用它。）任务保证顺序执行，并且不超过一个任务将被激活在任何给定的时间。 与其他等效的newFixedThreadPool(1) 、newFixedThreadPool(1) ，返回的执行器保证不被重新配置以使用额外的线程。
>
> 



我们来看看实际编程运行的效果。

实现代码：

```java
public class ThreadPoolTest {

    public static void main(String[] args) throws InterruptedException {

        Thread A = new Thread(() -> System.out.println("A"));
        Thread B = new Thread(() -> System.out.println("B"));
        Thread C = new Thread(() -> System.out.println("C"));

        ExecutorService pool = Executors.newSingleThreadExecutor();
        pool.submit(A);
        pool.submit(B);
        pool.submit(C);
        pool.shutdown();
    }
}
```

运行结果：

![image-20220309182901611](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220309182901611.png)

根据文档，我们可以知道，还可以用newFixedThreadPool(1) 或者newFixedThreadPool(1) ，结果是一样的。

另外，线程池我们最常用的一个函数是`execute(Runnable command)`，在本例测试用，发现使用execute时，也能达到同样的效果，那么submit与execute有什么区别呢？

`execute`是接口`Executor`的方法，其含义为：

> ```java
> void execute(Runnable command)
> ```
>
> 在将来的某个时间执行给定的命令。 该命令可以在一个新线程，一个合并的线程中或在调用线程中执行，由`Executor`实现。

而`submit`是接口`ExecutorService`的方法，其含义为：

> ```java
> Future<?> submit(Runnable task)
> ```
>
> 提交一个可运行的任务执行，并返回一个表示该任务的未来。 未来的`get`方法将返回`null` *成功*完成时。

通过`newSingleThreadExecutor`的队列模式，从而保证了任务按照提交的顺序来执行。