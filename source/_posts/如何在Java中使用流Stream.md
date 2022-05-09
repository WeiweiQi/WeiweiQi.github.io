---
title: 如何在Java中使用流Stream
comments: true
date: 2021-06-03 09:17:39
categories:
tags:
---



这是我参与更文挑战的第3天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

微博上看到的一个关于`javascript`的集合操作函数解释，很有意思。

```javascript
[■,■,■,■].map(■→●) => [●,●,●,●]
[■,●,■,▲].filter(■→true) => [■,■]
[■,●,■,▲].find(●→true) => ●
[■,●,■,▲].findIndex(●→true) => 1
[■,●,■,▲].fill(●) => [●,●,●,●]
[■,●,■,▲].some(●→true) => true
[■,●,■,▲].every(●→true) => false 
```



Stream的操作分为中间操作与终止操作。

每个中间操作都通过某种方式对Stream进行转换（映射，过滤等等），将一个Stream转换成另一个Stream，其元素类型可能相同，也可能不同。

终止操作会在最后一个中间操作产生的Stream上执行一个最终计算，如打印，保存到集合中，或返回某个元素。

Stream流管道操作通常是lazy的，直到调用终止操作时才会开始计算，对于完成终止操作不需要的数据元素，将永远都不会被计算。这使得无限Stream成为可能。

无限Stream的一个样例：

```java
/**
* 	无限Stream。
* 	该方法返回无限素数Stream
* @return
*/
static Stream<BigInteger> primes() {
    return Stream.iterate(BigInteger.ONE.add(BigInteger.ONE), BigInteger::nextProbablePrime);
}

/**
* 打印出前20个素数
*/
primes().limit(20).forEach(System.out::println);

```



【Effective Java】[第三版]第45条，**谨慎使用Stream**，滥用Stream会使程序代码难以读懂和维护。

Stream支持对象引用和int，long与double。不支持char。最好避免利用Stream来处理char。

Stream适合以下工作：

1. 统一转换元素的序列
2. 过滤元素的序列
3. 利用单个操作（如添加、连接或者计算其最小值）合并元素的顺序
4. 将元素的序列存放到一个集合中，比如根据某些公共属性进行分组
5. 搜索满足某些条件的元素的序列

类似文章开头的JavaScript，我们列举一下Stream中的一些操作：

```java
[■,■,■,■].map(■→●) => [●,●,●,●]
[[■, ■], [■, ■]].flatMap([■, ■] -> stream([■, ■])) => [■, ■, ■, ■]
[■,■,■,■].forEach(■→●) => [●,●,●,●]
[■,●,■,▲].filter(■→true) => [■,■]
[■,●,■,▲].limit(2) => [■,●]
[4,5,2,1].sorted() => [1,2,4,5]
[■,●,■,▲].filter(■→true) => [■,■]
[■,●,■,▲].collect(groupingBy(type)) => [[■,■], [●], [▲]]
[.......].collect(Collectors.toList()) // 各种聚合操作, 具体查看Collectors

// 欢迎补充


```



不管是lambda，还是Stream，都是为了让代码更加易读，代码最终还是写给人看的。
