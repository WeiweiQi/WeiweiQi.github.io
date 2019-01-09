---
title: Java异步转同步———CountDownLatch
comments: true
abbrlink: 4cd8
date: 2019-01-09 20:32:00
categories:
  java
tags:
---

<!-- more -->

```java
package multi.thread.qiweiwei.com;

import java.util.concurrent.CountDownLatch;

public class CountDownLatchTest {

	public static void main(String[] args) {
		final CountDownLatch latch = new CountDownLatch(2);

        new Thread(){
            public void run() {
                try {
                    System.out.println("子线程"+Thread.currentThread().getName()+"正在执行");
                   Thread.sleep(3000);
                   System.out.println("子线程"+Thread.currentThread().getName()+"执行完毕");
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
                latch.countDown();
            };
        }.start();

        new Thread(){
            public void run() {
                try {
                    System.out.println("子线程"+Thread.currentThread().getName()+"正在执行");
                    Thread.sleep(3000);
                    System.out.println("子线程"+Thread.currentThread().getName()+"执行完毕");

               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
               latch.countDown();
            };
        }.start();

        try {
            System.out.println("等待2个子线程执行完毕...");
           latch.await();
           System.out.println("2个子线程已经执行完毕");
           System.out.println("继续执行主线程");
       } catch (InterruptedException e) {
           e.printStackTrace();
       }
    }

}
```

执行结果：

```shell
子线程Thread-0正在执行
等待2个子线程执行完毕...
子线程Thread-1正在执行
子线程Thread-0执行完毕
子线程Thread-1执行完毕
2个子线程已经执行完毕
继续执行主线程
```

CountDownLatch --异步转同步

【推荐】使用 CountDownLatch 进行异步转同步操作，每个线程退出前必须调用 countDown
方法，线程执行代码注意 catch 异常，确保 countDown 方法被执行到，避免主线程无法执行
至 await 方法，直到超时才返回结果。
说明： 注意，子线程抛出异常堆栈，不能在主线程 try-catch 到。
