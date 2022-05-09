---
title: Java中Stream使用样例
comments: true
date: 2021-06-03 14:50:54
categories:
tags:
---





```java
package cn.kevinq.article.stream;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;
import java.util.stream.IntStream;
import java.util.stream.LongStream;
import java.util.stream.Stream;

public class SteamTest {

	public static void main(String[] args) {
		// 辅助初始化
		List<String> list = new ArrayList<String>();
		list.add("a");
		list.add("b");
		String[] array = new String[] {"a", "b", "c"};
		
		
//		https://www.baeldung.com/java-8-streams
		/**
		 * Stream初始化
		 */
		// 空流
		Stream<String> emptyStream = Stream.empty(); // []
		// Collection(List等), Array（数组）转为Stream 
		Stream<String> listToStream = list.stream(); // [a, b]
		Stream<String> arrayToStream = Stream.of(array); // [a, b, c]
		Stream<String> arrayToStream2 = Stream.of("a", "b", "c"); // [a, b, c]
		// 取数组的一部分，[1, 3)
		Stream<String> arrayToStream3 = Arrays.stream(array, 1, 3); // [b, c]
		// builder()创建
		Stream<String> streamBuilder = Stream.<String>builder().add("a").add("b").add("c").build(); // [a, b, c]
		// generate(func)，无限顺序无序流，使用时需要指定长度，否则会一直生成知道占满内存
		Stream<String> streamGenrated = Stream.<String>generate(() -> {
			Random random = new Random();
			return "" + random.nextInt(100);
		}).limit(10); // [45, 44, 51, 60, 62, 3, 57, 48, 80, 27]
		// iterate(Element(1), Element(n) -> Element(n+1))), 有序无限连续流，指定第一元素与生成后续元素的方法
		Stream<String> streamIterate = Stream.<String>iterate("a", e -> {
			return (char) (e.charAt(e.length()-1) + 1) + "";
		}).limit(26); // [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z]
		// int,long,double有各自的封装良好的流IntStream, LongStream, DoubleStream
		IntStream intStream = IntStream.rangeClosed(1, 10);// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		LongStream longStream = LongStream.range(1, 5); // [1, 2, 3, 4]
		Random random = new Random();
		DoubleStream doubleStream = random.doubles(3); // [0.8078472890889652, 0.33210715318105766, 0.9277914692743904]
		DoubleStream doubleStream2 = DoubleStream.iterate(1l, n -> n + 1l).limit(10); //[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]
		
		System.out.println(emptyStream.collect(Collectors.toList()));
//		System.out.println(listToStream.collect(Collectors.toList()));
		// Stream无法复用，下面一行代码会报错：java.lang.IllegalStateException: stream has already been operated upon or closed
		// System.out.println(listToStream.collect(Collectors.toList()));
		System.out.println(arrayToStream.collect(Collectors.toList()));
		System.out.println(arrayToStream2.collect(Collectors.toList()));
		System.out.println(arrayToStream3.collect(Collectors.toList()));
		System.out.println(streamBuilder.collect(Collectors.toList()));
		System.out.println(streamGenrated.collect(Collectors.toList()));
		System.out.println(streamIterate.collect(Collectors.toList()));
		System.out.println(intStream.boxed().collect(Collectors.toList()));
		System.out.println(longStream.boxed().collect(Collectors.toList()));
		System.out.println(doubleStream.boxed().collect(Collectors.toList()));
		System.out.println(doubleStream2.boxed().collect(Collectors.toList()));
		
		// 中间操作
		// distinct()
		// filter 
		// skip
		// limit(long maxSize)
		// map 给定函数应用于此流的元素的结果组成的流
		// flatMap 通过将提供的映射函数应用于每个元素而产生的映射流的内容来替换该流的每个元素的结果的流。
		// sorted

		
		
		// 终止操作
		// reduce
		
		// 其他操作
		// count() 此流中的元素数
		// findAny() 返回某个元素的Optional
		// findFirst() 返回第一个元素的Optional
		// forEach(element -> action) 对此流的每个元素执行操作
		
		
		System.out.println(listToStream.findFirst().orel);
		
	}
	
	/**
	 * 	无限Stream。
	 * 	该方法返回无限素数Stream
	 * // 前20个素数
		primes().limit(20).forEach(System.out::println);
	 * @return
	 */
	static Stream<BigInteger> primes() {
		return Stream.iterate(BigInteger.ONE.add(BigInteger.ONE), BigInteger::nextProbablePrime);
	}

}

```

