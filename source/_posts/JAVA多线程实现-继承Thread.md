---
title: JAVA多线程实现-继承Thread
comments: true
categories: java并发
abbrlink: dbff
date: 2019-01-09 21:24:50
tags:
---

1. 继承Thread方法：

<!-- more -->

```java
extends Thread
```

2. 重写覆盖run()方法：

```java
@Override
public void run()
```

3. 通过start()方法启动线程。

```java
threadDemo01.start();
```

4. 若需要向线程中传递参数，可以采用在线程类（如例子中的ExtendThread)定义成员变量，成员变量可以是基本类型，也可以是其他类，例如，可以在run方法中回调成员变量的方法。

```java
public class ExtendThread extends Thread{

	public static int ii = 0;
	public MyPrint = new MyPrint()
	@Override
    public void run(){
        //编写自己的线程代码
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + ": i = " + ii++);
			try {
				sleep(Math.round(Math.random()*100));
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
    }


    public static void main(String[] args){
    	ExtendThread threadDemo01 = new ExtendThread();
    	ExtendThread threadDemo02 = new ExtendThread();
        threadDemo01.setName("线程1");
        threadDemo02.setName("线程2");
        threadDemo01.start();     
        threadDemo02.start();
    }
}
```

更简便的实现方式则是直接在插入线程的地方添加代码：


```java
final String string = ...;
final int ddd = ...;
new Thread(){
	public void run() {
             //TODO in the new Thread
	};
}.start();
```
