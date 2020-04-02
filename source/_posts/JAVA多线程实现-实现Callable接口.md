---
title: JAVA多线程实现-实现Callable接口
comments: true
categories: java并发
abbrlink: 9a8
date: 2019-01-09 21:22:10
tags:
---

1. 实现Callable接口

<!-- more -->

```java
public class ImplementsCallable implements Callable<Integer> {}
```

2. 重写接口call()方法，即线程执行内容。

```java
    @Override
    public Integer call() throws Exception {
	Thread.currentThread().setName("Thread in Callable");
	System.out.println(Thread.currentThread().getName() + " i = " + i);
	return null;
    }
```

3. 通过创建FutureTask来执行给定的Callable

```java
         Callable<Integer> oneCallable = new ImplementsCallable();
	//Creates a FutureTask that will, upon running, execute the given Callable.
	FutureTask<Integer> oneTask = new FutureTask<>(oneCallable);
	//注释：FutureTask<Integer>是一个包装器，它通过接受Callable<Integer>来创建，它同时实现了Future和Runnable接口。
```

4. 通过new Thread(oneTask)创建线程对象。通过start()方法启动线程。

```java
        //由FutureTask<Integer>创建一个Thread对象：
	Thread oneThread = new Thread(oneTask);
	oneThread.start();
```

完整代码：

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

public class ImplementsCallable implements Callable<Integer>{
	//尖括号中也可以是其他任意类
	public static int i = 0;

	public static void main(String[] args) {
		Thread.currentThread().setName("Thread main");

		Callable<Integer> oneCallable = new ImplementsCallable();
		//Creates a FutureTask that will, upon running, execute the given Callable.
		FutureTask<Integer> oneTask = new FutureTask<>(oneCallable);
		//注释：FutureTask<Integer>是一个包装器，它通过接受Callable<Integer>来创建，它同时实现了Future和Runnable接口。

		//由FutureTask<Integer>创建一个Thread对象：
		Thread oneThread = new Thread(oneTask);
		oneThread.start();
		print();



	}

	@Override
	public Integer call() throws Exception {
		Thread.currentThread().setName("Thread in Callable");
		System.out.println(Thread.currentThread().getName() + " i = " + i);
		return null;
	}

	public static void print() {
		i=0;
		for (i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + ":" + i);
		}
	}

}
```
