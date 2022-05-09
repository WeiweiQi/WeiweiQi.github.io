---
title: 如何保证线程按照指定次序执行-CountDownLatch
comments: true
date: 2022-03-10 16:54:55
categories:
tags:
---

1

在前几篇文章

《[如何保证线程按照指定次序执行-Thread.join](https://bbs.huaweicloud.com/blogs/336215)》

《[如何保证线程按照指定次序执行-newSingleThreadExecutor线程池](https://bbs.huaweicloud.com/blogs/336498)》

《[如何保证线程按照指定次序执行-Join函数的另一种用法](https://bbs.huaweicloud.com/blogs/336551)》中，

我们阐述了如何使用Thread.join()函数，单容量的线程池来保证多个线程的执行顺序，今天我们来尝试用另一种方式，通过CountDownLatch来实现。

CountDownLatch的官方文档如下所述：

> 允许一个或多个线程等待直到在其他线程中执行的一组操作完成的同步辅助。

其中，主要的两个方法是`await`与`countDown`

> 
> await()
> 导致当前线程等到锁存器计数到零
> 
> countDown()
> 减少锁存器的计数，如果计数达到零，释放所有等待的线程。

即按照CountDownLatch的思路来实现线程顺序执行，需要阐述为：

> 在C线程之前前，要先执行B线程；在B线程执行前，先执行A线程。

C线程中调用await方法等待B线程执行完毕，B线程执行完毕后调用countDown从而唤起C线程继续执行。

同样的，B线程中调用await方法等待A线程执行完毕，A线程执行完毕后调用countDown从而唤起B线程继续执行。

实现代码如下所示：需要使用两个CountDownLatch对象，分别来控制A线程先于B线程执行，以及B线程先于C线程执行。

```java
package com.qiweiwei.thread;

import java.util.concurrent.CountDownLatch;

public class ThreadCountDownLatchDemo {

    public static void main(String[] args) throws InterruptedException {
        final CountDownLatch latchA = new CountDownLatch(1);
        final CountDownLatch latchB = new CountDownLatch(1);

        Thread A = new Thread(() -> {
            System.out.println("A线程执行");
            latchA.countDown();
        });
        Thread B = new Thread(() -> {
            try {
                System.out.println("等待A线程执行...");
                latchA.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("B线程执行");
            latchB.countDown();
        });
        Thread C = new Thread(() -> {
            try {
                System.out.println("等待B线程执行...");
                latchB.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("C线程执行");
        });

        C.start();
        B.start();
        A.start();
    }
}

```

执行结果如下所示：

> 等待B线程执行...
> 等待A线程执行...
> A线程执行
> B线程执行
> C线程执行

注意，通过try-catch来确保子线程中的countDown得到执行，从而保证后续线程可以被成功唤醒。