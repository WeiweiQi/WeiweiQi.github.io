---
title: 如何保证线程按照指定次序执行-Thread.join
comments: true
date: 2022-03-08 18:28:55
categories:
tags:
---



1

现在的编程语言大多数是支持并发编程，多线程的，当实现多线程时，如何保证各个线程的执行次序呢？

比如现在有线程A，线程B，线程C，如何保证线程按照A->B->C的顺序执行呢？



如下代码所示：

```java
public class ThreadJoinTest {

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

通过测试，此时，执行结果是不一定的，A,B,C的次序是随机的，如下图两次执行结果就分别是B-C-A，C-B-A。

![image-20220308183525031](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220308183525031.png)

![image-20220308183555076](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220308183555076.png)

那么，如何保证线程按照指定的次序A-B-C来执行呢？

### Thread.join函数

通过调用Thread.join函数我们可以实现按照指定次序执行。我们先来看一下Thread.join函数的解释：

> Waits for this thread to die.
>
> An invocation of this method behaves in exactly the same way as the invocation
>
> 等待这个线程死亡。
>
> 调用此方法的行为方式与调用完全相同。

解释有些看不懂。我们可以这样理解，线程调用join时，会造成主线程等待调用线程死亡后才接着执行后续代码。

我们来看看修改后的代码：

```java
public class ThreadJoinTest {
    public static void main(String[] args) throws InterruptedException {
        Thread A = new Thread(() -> System.out.println("A"));
        Thread B = new Thread(() -> System.out.println("B"));
        Thread C = new Thread(() -> System.out.println("C"));

        A.start();
        A.join();
        B.start();
        B.join();
        C.start();
        C.join();

    }
}
```

执行结果：

![image-20220308185102613](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220308185102613.png)

而且，不管该程序执行多少次，执行结果总是一定的，一定是按照次序A-B-C来执行。

我们来看一下join函数做了什么？

```java
public final void join() throws InterruptedException {
        join(0);
    }
```

join()函数调用实际是调用join(0)，我们继续看：

```java
public final synchronized void join(long millis)
    throws InterruptedException {
        long base = System.currentTimeMillis();
        long now = 0;

        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }

        if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            while (isAlive()) {
                long delay = millis - now;
                if (delay <= 0) {
                    break;
                }
                wait(delay);
                now = System.currentTimeMillis() - base;
            }
        }
    }
```

调用join函数时，millis=0，即我们实际执行的重要代码主要是下面这一部分：

```java
while (isAlive()) {
    wait(0);
}
```

其中isAlive()方法判断线程是否仍然在执行而没有die，如果仍然在执行，则主线程执行wait，直到线程结束才继续执行后续代码。



除了Join函数外，是否有其他方式保证执行顺序呢？我们之后介绍

