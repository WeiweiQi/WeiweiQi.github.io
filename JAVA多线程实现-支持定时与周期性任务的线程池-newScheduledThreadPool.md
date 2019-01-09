---
title: JAVA多线程实现-支持定时与周期性任务的线程池(newScheduledThreadPool)
comments: true
categories: java并发
abbrlink: cf67
date: 2019-01-09 21:05:13
tags:
---

前几篇文章中分别介绍了

单线程化线程池(newSingleThreadExecutor)

可控最大并发数线程池(newFixedThreadPool)

可回收缓存线程池(newCachedThreadPool)

<!-- more -->

newScheduledThreadPool用于构造安排线程池，能够根据需要安排在给定延迟后运行命令或者定期地执行。

在JAVA文档的介绍

public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize);
创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。
参数：corePoolSize - 池中所保存的线程数，即使线程是空闲的也包括在内。
返回：新创建的安排线程池
需要注意的是，参数corePoolSize在这个方法中是没用意义的，详解见JAVA进阶----ThreadPoolExecutor机制。

具体实现：

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ThreadPoolByNewScheduledThreadPool {

	public static void main(String[] args) {

		Thread thread = new Thread(new Runnable() {
			@Override
			public void run() {
				System.out.println(Thread.currentThread().getName() + " : 延迟3秒");
			}
		});

		/**
		 * 定长线程池，支持定时及周期性任务执行
		 */
		ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(5);

		//延迟3s后运行
		scheduledThreadPool.schedule(thread, 3, TimeUnit.SECONDS);

		//首次执行延迟1s，每次间隔3秒
		//scheduledThreadPool.scheduleAtFixedRate(thread, 1, 3, TimeUnit.SECONDS);

		//每次执行结束，已固定时延开启下次执行
		//scheduledThreadPool.scheduleWithFixedDelay(thread, 1, 3, TimeUnit.SECONDS);

		System.out.println(Thread.currentThread().getName() + " : main thread");
		scheduledThreadPool.shutdown();
//		try {
//			Thread.sleep(12000);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
//		scheduledThreadPool.shutdownNow();
	}

}
```

后面注释掉的内容表示强制程序最大执行实际为12s，这通常是不切实际的，常常会需要在线程中设置标志位或标记系统时间来获取程序的终止时间。这就涉及到获取线程返回值的问题。将在后续文章中进行介绍。
