---
title: Java路径获取
comments: true
categories: java
abbrlink: 83ee
date: 2019-01-09 21:27:02
tags:
---

java项目获取系统各个目录的路径

<!-- more -->

```java
package unit02;

/**
 *
 * @time 2014年9月18日 下午10:29:48
 * @porject ThinkingInJava
 * @author Kiwi
 */
public class Test03 {

	private String getPathByPoint() {
		return this.getClass().getClassLoader().getResource(".").getPath();
	}

	private String getPathByNothing() {
		return this.getClass().getClassLoader().getResource("").getPath();
	}

	private String getResourcePath() {
		return this.getClass().getResource("").getPath();
	}

	private String getResourcePathByPoint() {
		return this.getClass().getResource(".").getPath();
	}

	private String getThreadPath() {
		return Thread.currentThread().getContextClassLoader().getResource("").getPath();
	}

	private String getThreadPathByPoint() {
		return Thread.currentThread().getContextClassLoader().getResource(".").getPath();
	}

	public static void main(String[] args) {
		Test03 test03 = new Test03();
		System.out.println("this.getClass().getClassLoader().getResource(\".\").getPath() = \n" + test03.getPathByPoint());
		System.out.println("this.getClass().getClassLoader().getResource(\"\").getPath() = \n" + test03.getPathByNothing());

		System.out.println("this.getClass().getResource(\"\").getPath() = \n" + test03.getResourcePath());
		System.out.println("this.getClass().getResource(\".\").getPath() = \n" + test03.getResourcePathByPoint());

		System.out.println("Thread.currentThread().getContextClassLoader().getResource(\"\").getPath() = \n" + test03.getThreadPath());
		System.out.println("Thread.currentThread().getContextClassLoader().getResource(\".\").getPath() = \n" + test03.getThreadPathByPoint());

		System.out.println(System.getProperty("user.dir"));
		System.out.println(System.getProperty("java.class.path"));
	}

}
```

运行结果：（注：测试环境：Eclipse； 项目名称：ThinkingInJava；包名称：unit02）

```shell
this.getClass().getClassLoader().getResource(".").getPath() = 
/F:/java/java_workspace/ThinkingInJava/bin/
this.getClass().getClassLoader().getResource("").getPath() = 
/F:/java/java_workspace/ThinkingInJava/bin/
this.getClass().getResource("").getPath() = 
/F:/java/java_workspace/ThinkingInJava/bin/unit02/
this.getClass().getResource(".").getPath() = 
/F:/java/java_workspace/ThinkingInJava/bin/unit02/
Thread.currentThread().getContextClassLoader().getResource("").getPath() = 
/F:/java/java_workspace/ThinkingInJava/bin/
Thread.currentThread().getContextClassLoader().getResource(".").getPath() = 
/F:/java/java_workspace/ThinkingInJava/bin/
F:\java\java_workspace\ThinkingInJava
F:\java\java_workspace\ThinkingInJava\bin;F:\java\java_workspace\code\mindview.jar
```
