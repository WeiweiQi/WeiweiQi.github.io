---
title: JAVA多线程实现-实现Runnable接口
comments: true
categories: java并发
abbrlink: 737b
date: 2019-01-09 21:24:04
tags:
---

1. 实现Runnable接口 implements Runnable

<!-- more -->

2. 重写run()方法

@Override
public void run(){//TODO}

3. 创建线程对象：Thread thread1 = new Thread(new ImplementsRunnable());

4. 开启线程执行：thread1.start();


```java
public class ImplementsRunnable implements Runnable{
	public static int num = 0;

	@Override
	public void run() {
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + ": num = " + num++);
		}
	}
	public static void main(String[] args) {
		Thread thread1 = new Thread(new ImplementsRunnable());
		Thread thread2 = new Thread(new ImplementsRunnable());
		thread1.setName("线程1");
		thread2.setName("线程2");
		thread1.start();
		thread2.start();
	}
}
```
