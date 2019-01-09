---
title: JAVA中Map的4种遍历方法对比
comments: true
categories: java
abbrlink: '4415'
date: 2019-01-09 20:44:52
tags:
---

```java
package cn.qiweiwei.iterator;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

/**
 * 遍历执行的操作方式是：将每一个key对应的value值取出，+1，存入原map。
 * @author qiweiwei
 *
 */
public class MapIteratorTest {
	private static int DATA_SIZE = 10000000;

	public static void main(String[] args) throws InterruptedException {

//		long startTime = System.currentTimeMillis();    //获取开始时间
//		//Thread.sleep(10000);//sleep是毫秒级别的
//		long endTime = System.currentTimeMillis();    //获取结束时间
//		System.out.println("程序运行时间：" + (endTime - startTime) + "ms");    //输出程序运行时间


		Map<String, Integer> map = new HashMap<>();
		for (int i = 1; i <= DATA_SIZE+1; i++) {
			map.put(String.valueOf(i), 0);
		}

		//遍历执行的操作方式是：将每一个key对应的value值取出，+1，存入原map。

		//第一种方法：keySet
		int i = 0;
		long startTime = System.currentTimeMillis();
		for (String key : map.keySet()) {
			map.put(key, map.get(key)+1);
		}
		long endTime = System.currentTimeMillis();
		System.out.println("keySet：程序运行时间：" + (endTime - startTime) + "ms");
		i = 1;
		for (String key : map.keySet()) {
			System.out.println(map.get(key));
			if (i >= 5) {
				break;
			}
			i ++ ;
		}

		//第二种方法：entrySet
		startTime = System.currentTimeMillis();
		for (Entry<String, Integer> entry : map.entrySet()) {
			entry.setValue(entry.getValue()+1);
		}
		endTime = System.currentTimeMillis();
		System.out.println("entrySet：程序运行时间：" + (endTime - startTime) + "ms");

		i = 1;
		for (String key : map.keySet()) {
			System.out.println(map.get(key));
			if (i >= 5) {
				break;
			}
			i ++ ;
		}

		//第三种方法：Iterator
		startTime = System.currentTimeMillis();
		Iterator<Map.Entry<String, Integer>> entries = map.entrySet().iterator();
		while (entries.hasNext()) {
			Map.Entry<String, Integer> entry = entries.next();
			entry.setValue(entry.getValue()+1);
		}
		endTime = System.currentTimeMillis();
		System.out.println("Iterator-entrySet：程序运行时间：" + (endTime - startTime) + "ms");

		i = 1;
		for (String key : map.keySet()) {
			System.out.println(map.get(key));
			if (i >= 5) {
				break;
			}
			i ++ ;
		}

		//第四种方法：jdk8以上：map.foreach()
		startTime = System.currentTimeMillis();
		map.forEach((k, v) -> {
			map.put(k, v + 1);
		});
		endTime = System.currentTimeMillis();
		System.out.println("jdk8-map.forEach:程序运行时间：" + (endTime - startTime) + "ms");

		i = 1;
		for (String key : map.keySet()) {
			System.out.println(map.get(key));
			if (i >= 5) {
				break;
			}
			i ++ ;
		}

	}

}
```

输出结果：

```shell
keySet：程序运行时间：418ms
entrySet：程序运行时间：242ms
Iterator-entrySet：程序运行时间：245ms
jdk8-map.forEach:程序运行时间：398ms
```

当数据规模更大时候，比如DATA_SIZE再扩大10倍，结果是....o(╯□╰)o

```java
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at java.lang.Integer.toString(Integer.java:401)
	at java.lang.String.valueOf(String.java:3099)
	at cn.qiweiwei.iterator.MapIteratorTest.main(MapIteratorTest.java:26)
```
