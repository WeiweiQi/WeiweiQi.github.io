---
title: 如何保证线程按照指定次序执行-Join函数的另一种用法
comments: true
date: 2022-03-10 11:18:38
categories:
tags:
---

1

在文章《[如何保证线程按照指定次序执行-Thread.join](https://bbs.huaweicloud.com/blogs/336215)》中，我们介绍了如何在主线程中使用Thread.join函数来保证线程的执行顺序，按照join函数的定义：

> Waits for this thread to die.
>
> An invocation of this method behaves in exactly the same way as the invocation
>
> 等待这个线程死亡。
>
> 调用此方法的行为方式与调用完全相同。

其可以让调用它的线程等待被调用线程执行完毕后才接着执行，因此，若我们有需要按照"A-B-C"的顺序来执行，则需要B中调用A.join()，C中调用B.join()，如此则可实现A先于B执行，而B先于C执行。我们来看看实现代码并测试一下。



### 正确的join调用方式

```java
public class ThreadJoinTest2 {

    public static void main(String[] args) throws InterruptedException {


        Thread A = new Thread(() -> {
            System.out.println("A线程执行...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        Thread B = new Thread(() -> {
            try {
                A.start();
                A.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("B线程执行...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        Thread C = new Thread(() -> {
            try {
                B.start();
                B.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("C线程执行...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        C.start();
        C.join();

    }
}

```

并且，根据join方法的源代码，`join`方法不会调用其线程，只是根据线程的执行状态判断是否继续`wait`，即是否继续阻塞调用进程的后续执行。因此join方法总是需要跟随`start`方法来执行。因此，一种**错误**的调用方式如下。



## 错误的join调用方式

```java
/**
* 注意，该调用方式是错误的保证线程执行顺序的方式
*/
public class ThreadJoinTest2 {

    public static void main(String[] args) throws InterruptedException {


        Thread A = new Thread(() -> {
            System.out.println("A线程执行...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        Thread B = new Thread(() -> {
            try {
                A.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("B线程执行...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        Thread C = new Thread(() -> {
            try {
                B.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("C线程执行...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        C.start();
        Thread.sleep(5000);
        B.start();
        A.start();
    }
}

```

这段代码的错误在于将join与start方法拆分开来，无法保证线程start之后可以阻塞其他线程的执行。例如上述代码在C线程执行后，主线程等待5秒钟，这5秒钟内B线程没有执行，因此`B.join()`无法实现执行B线程后再执行C线程。

多线程的问题测试始终是一个问题，一次运行成功不代表总是成功，一百次运行成功也不代表不存在错误的可能性，不知道是否存在良好的判断方式。

所以，笔者的判断也并不都是准确的，欢迎读者指正其中错误之处。

关于Thread类多说几句，Thread类成功的实现了将线程这一动态的抽象概念实现为面向对象中的一个可以操作中的类，实际上是有很多值得学习的东西的。



