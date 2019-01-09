---
title: JAVA多线程实现-可回收缓存线程池(newCachedThreadPool)
comments: true
categories: java并发
abbrlink: c03a
date: 2019-01-09 21:06:38
tags:
---

在前两篇博客中介绍了单线程化线程池(newSingleThreadExecutor)、可控最大并发数线程池(newFixedThreadPool)。下面介绍的是第三种newCachedThreadPool——可回收缓存线程池。

<!-- more -->

- 在JAVA文档中是这样介绍可回收缓存线程池的：创建一个可根据需要创建新线程的线程池，但是在以前构造的线程可用时将重用它们。对于执行很多短期异步任务的程序而言，这些线程池通常可提高程序性能。调用 execute 将重用以前构造的线程（如果线程可用）。如果现有线程没有可用的，则创建一个新线程并添加到池中。终止并从缓存中移除那些已有 60 秒钟(默认)未被使用的线程。因此，长时间保持空闲的线程池不会使用任何资源。（可以通过java.util.concurrent.ThreadPoolExecutor类的构造方法构造更加具体的类，例如指定时间参数）。
- 创建线程本身需要很多资源，包括内存，记录线程状态，以及控制阻塞等等。因此，相比另外两种线程池，在需要频繁创建短期异步线程的场景下，newCachedThreadPool能够复用已完成而未关闭的线程来提高程序性能。

newCachedThreadPool使用方法与其他两种线程池使用方法类似，基本使用代码如下所示：

```
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class NewCachedThreadPoolExecutor {

	public static void main(String[] args) {
		ExecutorService cachedThreadExecutor = Executors.newCachedThreadPool();
		for (int i = 0; i < 10; i++) {
			final int index = i;
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e1) {
				e1.printStackTrace();
			}
			cachedThreadExecutor.execute(new Runnable() {
				@Override
				public void run() {
					System.out.println(Thread.currentThread().getName() + ": index = " + index);
				}
			});
		}
		cachedThreadExecutor.shutdown();

	}

}
```

执行结果如下图，会发现线程的名字都一样，因为在执行后续任务的时候，上一个任务已经完成，会复用上一个任务的线程资源来执行。
![执行结果图](https://wx2.sinaimg.cn/mw690/733866e8ly1fz0n0g4if9g20dm078wp9.gif)
