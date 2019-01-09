---
title: JAVA多线程实现-单线程化线程池newSingleThreadExecutor
comments: true
categories: java并发
abbrlink: affe
date: 2019-01-09 21:20:53
tags:
---

JAVA通过Executors提供了四种线程池，单线程化线程池(newSingleThreadExecutor)、可控最大并发数线程池(newFixedThreadPool)、可回收缓存线程池(newCachedThreadPool)、支持定时与周期性任务的线程池(newScheduledThreadPool)。本篇文章主要介绍newSingleThreadExecutor，其他三种线程池将在后续的文章中一一阐述。

<!-- more -->

单线程化线程池(newSingleThreadExecutor)的优点，串行执行所有任务。如果这个唯一的线程因为异常结束，那么会有一个新的线程来替代它。此线程池保证所有任务的执行顺序按照任务的提交顺序执行。（在后续阐述(newFixedThreadPool)时，我们会再做阐述）。



使用单线程化线程池(newSingleThreadExecutor)的一般方法下代码所示。

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ThreadPoolByNewSingleThreadExecutor {

	public static void main(String[] args) {
		/**
		 * 单线程化的线程池
		 */
		ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
		for (int i = 0; i < 10; i++) {
			final int index = i;
			singleThreadExecutor.execute(new Runnable() {
				@Override
				public void run() {
					Thread.currentThread().setName("Thread i = " + index);
					System.out.println(Thread.currentThread().getName() + " index = " + index);
					try {
						Thread.sleep(500);
					} catch (InterruptedException e) {
						System.out.println("ssss");
					}
				}
			});
		}
		singleThreadExecutor.shutdown();
		System.out.println("on the main thread...");

	}

}
```

后续的shutdown()方法用来关闭线程池，拒绝新任务。执行shutdown()方法后，线程池状态变为SHUTDOWN状态，此时，不能再往线程池中添加新任务，否则会抛出RejectedExecutionException异常。此时，线程池不会立刻退出，直到添加到线程池中的任务都已经处理完成，才会退出，即在终止前允许执行以前提交的任务。还有一个类似的方法shutdownNow()，执行shutdownNow()方法后，线程池状态会立刻变成STOP状态，并试图停止所有正在执行的线程，不再处理还在池队列中等待的任务，会返回那些未执行的任务。ShutdownNow()并不代表线程池就一定立即就能退出，它可能必须要等待所有正在执行的任务都执行完成了才能退出。

用ShutdownNow()关闭线程的代码示例

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ThreadPoolByNewSingleThreadExecutor {

	public static void main(String[] args) {
		/**
		 * 单线程化的线程池
		 */
		ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
		for (int i = 0; i < 10; i++) {
			final int index = i;
			singleThreadExecutor.execute(new Runnable() {
				@Override
				public void run() {
					Thread.currentThread().setName("Thread i = " + index);
					System.out.println(Thread.currentThread().getName() + " index = " + index);
					try {
						Thread.sleep(500);
					} catch (InterruptedException e) {
						System.out.println("ssss");
					}
				}
			});
		}
		try {
			if (!singleThreadExecutor.awaitTermination(2*1000, TimeUnit.MILLISECONDS)) {
				singleThreadExecutor.shutdownNow();
			}
		} catch (InterruptedException e) {
			// awaitTermination方法被中断的时候也中止线程池中全部的线程的执行。
			 System.out.println("awaitTermination interrupted: " + e);
			singleThreadExecutor.shutdownNow();
		}
		System.out.println("on the main thread...");

	}

}
```
