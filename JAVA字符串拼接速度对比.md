---
title: JAVA字符串拼接速度对比
comments: true
abbrlink: 56a4
date: 2019-01-09 20:49:26
categories:
tags:
---

```java
    SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss:SSS");
		String string = "";
		StringBuilder stringBuilder = new StringBuilder();
		System.out.println("time before string+string "+formatter.format(new Date()));
		for (int i = 0; i < 1000000; i++) {
			string = string + "1";
		}
		System.out.println("time after string+string "+formatter.format(new Date()));
		System.out.println("time before stringBuilder.append "+formatter.format(new Date()));
		for (int i = 0; i < 1000000; i++) {
			stringBuilder.append("1");
		}
		System.out.println("time after stringBuilder.append "+formatter.format(new Date()));
```
试验结果：前者需要5分多钟，后者是毫秒级的。只知道速度有差异，没想到会差这么多，被惊到了！

```shell
time before string+string 29-五月-2018 22:33:35:347
time after string+string 29-五月-2018 22:38:53:943
time before stringBuilder.append 29-五月-2018 22:38:53:944
time after stringBuilder.append 29-五月-2018 22:38:53:955
```


注意，StringBuilder不是线程安全的（StringBuffer：线程安全）
