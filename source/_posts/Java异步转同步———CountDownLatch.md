---
title: Java异步转同步———CountDownLatch
comments: true
abbrlink: 4cd8
date: 2019-01-09 20:32:00
categories: 后端
tags: 后端
---

这是我参与更文挑战的第19天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

> 桃李不言，下自成蹊

## 事情起源

前一段时间学习Go语言，了解到Go中的关键字`go`可以开启协程`goroutine`从而实现并发并行。其中有一个`sync`包中的`WaitGroup`可以实现异步转同步的功能：等待一组线程的结束。父协程调用`Add`方法来设定等待的协程的数量，每个被等待的协程在结束任务执行时调用`Done`方法；同时，父协程调用`Wait`方法阻塞至所有线程结束。

例如，在另一篇文章：[Go缓存击穿方案-singleflight源码解读](https://juejin.cn/post/6971002900608712711)，其中的singleflight就用waitGroup实现了其他协程需等待执行数据库请求的协程程执行完毕后才可获取到数据。如图中的：`R2:call.wg.wait()`会等待 `R1: call.done()`执行完后才执行后续代码。

![singleflight4.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5274a0078fc34ce78a297feec238791c~tplv-k3u1fbpfcp-watermark.image)



问题来了，Java中异步转同步的方式又是如何呢？



## CountDownLatch

CountDownLatch是Java的包`java.util.concurrent`中的一个类，允许一个或多个线程等待其他线程完成操作后再执行，从而可以实现与Go中的`WaitGroup`相同的效果。

> Talk is Cheap, Show me the code!

## 代码

```java
package multi.thread.xxxxx.com;

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

需要注意的是，子线程抛出异常堆栈，不能在主线程 try-catch 到。所以，子线程注意catch 异常，确保 countDown 方法被执行到，避免主线程无法执行至 await 方法，直到超时才返回结果。
