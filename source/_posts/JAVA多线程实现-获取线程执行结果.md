---
title: JAVA多线程实现-获取线程执行结果
comments: true
categories: java并发
abbrlink: 8d27
date: 2019-01-09 21:01:15
tags:
---

JAVA支持有返回值的线程是在JAVA5及之后的版本。

<!-- more -->

获取线程返回值需要实现Callable接口。

具体代码如下：
```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class GetResultOfThread {

	public static void main(String[] args) throws InterruptedException, ExecutionException {
		ExecutorService pool = Executors.newFixedThreadPool(3);

		Callable c1 = new GetResult("c1");
		Callable c2 = new GetResult("c2");

		Future f1 = pool.submit(c1);
		Future f2 = pool.submit(c2);

		System.out.println(f1.get().toString());
		System.out.println(f2.get().toString());

		pool.shutdown();

	}

}

class GetResult implements Callable {
	private String oid;

	public GetResult(String oid) {
		this.oid = oid;
	}

	@Override
	public Object call() throws Exception {
		// TODO Auto-generated method stub
		return oid + ":任务返回的内容";
	}


}
```
