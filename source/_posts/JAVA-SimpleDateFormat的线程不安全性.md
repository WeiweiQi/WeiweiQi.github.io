---
title: JAVA - SimpleDateFormat 的线程不安全性
comments: true
categories: java
abbrlink: dd65
date: 2019-01-09 20:39:39
tags:
---

SimpleDateFormat线程不安全验证实验

<!-- more -->

```JAVA
package cn.qiweiwei.concurrentdate;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ConcurrentDateTest {

	private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

	private static String date1String = "2010-03-04";
	//private static String date2String  = "2013-04-05";

	public static void main(String[] args) {


		for (int i = 0; i < 10; i++) {
			new Thread(new Runnable() {

				@Override
				public void run() {
					try {
						Date date1 = simpleDateFormat.parse(date1String);
						//String date1S = simpleDateFormat.format(date1);
						System.out.println(Thread.currentThread().getName() + ":" +date1);
					} catch (Exception e) {
						System.out.println("Thread error");
						 //throw new RuntimeException("parse failed", e);
					}
				}
			}).start();
		}

	}

}
```

输出结果：

```shell
Thread error
Thread error
Thread-1:Sat Mar 04 00:00:00 CST 2220
Thread-9:Thu Mar 04 00:00:00 CST 2010
Thread-6:Thu Mar 04 00:00:00 CST 2010
Thread-4:Thu Mar 04 00:00:00 CST 2010
Thread-3:Thu Mar 04 00:00:00 CST 2010
Thread-7:Thu Mar 04 00:00:00 CST 2010
Thread-8:Thu Mar 04 00:00:00 CST 2010
Thread-5:Thu Mar 04 00:00:00 CST 2010
```

日期要么是错的，要么发生了异常。



解决办法：

1. 加锁：线程内：synchronized(simpleDateFormat) { ..do parse and format. }

2. 定义线程局部变量：变量是同一个，但是每个线程使用同一个初始值，存取数据只在本线程内有效（内部通过一个Map(实际是内部类ThreadLocalMap)存取数据，存取数据只在同一线程有效）

```JAVA
private static final ThreadLocal<DateFormat> df = new ThreadLocal<DateFormat>(){
		@Override
		protected DateFormat initialValue(){
			return new SimpleDateFormat("yyyy-MM-dd");
		}
	};
```

使用方法：

```JAVA
new Thread(new Runnable() {

				@Override
				public void run() {
					try {
						Date date1 = df.get().parse(date1String);
						System.out.println(Thread.currentThread().getName() + ":" +date1);

					} catch (Exception e) {
						System.out.println("Thread error");
					}
				}
			}).start();
```

3. jdk8推荐方法：

使用 Instant 代替 Date， LocalDateTime 代替 Calendar，
DateTimeFormatter 代替 SimpleDateFormat，官方给出的解释： simple beautiful strong
immutable thread-safe。


变量转换如链接所示：

https://www.cnblogs.com/niceboat/p/7027394.html

https://blog.csdn.net/u013604031/article/details/49812941
