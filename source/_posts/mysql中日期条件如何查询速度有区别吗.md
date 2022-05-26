---
title: mysql中日期条件如何查询速度有区别吗
comments: true
date: 2022-05-24 18:20:22
categories:
tags:
---


持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第1天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468)

## 问题起源

在mysql查询条件中，经常遇到时间限制的查询，比如查询一个时间段内的数据，或者查询某一天的数据：

```sql
SELECT * FROM table WHERE createtime >  '2019-01-01 00:00:00' AND createtime < '2019-01-01 23:59:59'
```

还有另外一种查询方法是：

```sql
SELECT * FROM table WHERE TO_DAYS(createtime) = TO_DAYS('2019-01-01 00:00:00')
```

两种查询方式是否有区别呢？TO_DAYS的查询方式是否比较快呢？


## 文档查看

1. 关于`DATETIME`字段类型，官网是这么解释的：


> The DATETIME type is used for values that contain both date and time parts. MySQL retrieves and displays DATETIME values in 'YYYY-MM-DD hh:mm:ss' format. The supported range is '1000-01-01 00:00:00' to '9999-12-31 23:59:59'.

即datetime包括日期与时间两部分，以格式为`YYYY-MM-DD hh:mm:ss`的来检索与显示，表示范围为：`1000-01-01 00:00:00`到`9999-12-31 23:59:59`。


2. 关于函数`TO_DAYS(DATE)`：

> 
> TO_DAYS()
> 返回日期和年份0之间的天数，注：只能用于公历中的日期
> 例如：
> 
> ```sql
> SELECT TO_DAYS("0000-01-01") 
> ```
> 执行结果为：1。
> 



## 实际测试

我们创建一个含有700万数据的表进行实际的测试：

现在我们已经有了一个表test_table，但是这个表里没有时间字段，我们添加字段，并设置随机日期值：

```sql
UPDATE `test_table`
SET createtime = FROM_UNIXTIME(
			1672502399 - (
				FLOOR(1 +(RAND() * 12)) * 2678400
			) - (FLOOR(1 +(RAND() * 31)) * 86400) - FLOOR(1 +(RAND() * 86400)),
			'%Y-%m-%d %H:%i:%s'
	)
```

其中，部分日期的随机结果如下:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2660c1f350e7435597ccd5f21c81becc~tplv-k3u1fbpfcp-watermark.image?)

我们首先通过Group by 来看看日期的年份数据范围：

```sql
SELECT
	DATE_FORMAT(createtime, '%Y'),
	COUNT(*)
FROM
	`test_table`
GROUP BY
	DATE_FORMAT(createtime, '%Y')
```

执行结果为：

| 年份 | 数据量  |
| --- | --- |
| 2021 | 749087 |
| 2022 | 6392067 |

按照月份统计：

```sql
SELECT
    DATE_FORMAT(createtime, '%Y-%m') as month,
    COUNT(*)
FROM
    `test_table`
GROUP BY    
    DATE_FORMAT(createtime, '%Y-%m')
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ed89af0d2974b0c9ca0e1ea14122001~tplv-k3u1fbpfcp-watermark.image?)


因为我们测试的是TO_DAYS，所以我们还需要查看具体日期的分布情况，以便于比较：

```sql
SELECT
    DATE_FORMAT(createtime, '%Y-%m-%d'),
    COUNT(*)
FROM
    `test_table`
GROUP BY
    DATE_FORMAT(createtime, '%Y-%m-%d')
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1147555b6cd446ceb6e1b22a3c564ca2~tplv-k3u1fbpfcp-watermark.image?)


### 无索引

测试同一天查询速度：

使用日期直接比较：

```sql
SELECT
    *
FROM
    `test_table`
WHERE
    createtime > '2021-11-24 00:00:00'
AND createtime < '2021-11-24 23:59:59'
```

上述语句执行时间3次的实际执行结果分别为：2.358s， 2.361s，2.369s

使用TO_DAYS判等：

```sql
SELECT
    *
FROM
    `test_table`
WHERE
    TO_DAYS(createtime) = TO_DAYS('2021-11-24 00:00:00')
```


使用TO_DAYS执行3次，执行时间分别为：1.944s，1.954s，1.929s

在对比列没有添加索引的情况下，通过时间对比函数TO_DAYS速度更快！

我们分别使用Explain来看一下两句SQL:

直接比较：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1da37e961c514aa8a69c2c6f87030844~tplv-k3u1fbpfcp-watermark.image?)


TO_DAYS判等：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c46450d7f4a840d78d7c3bb81624707f~tplv-k3u1fbpfcp-watermark.image?)

两者的区别在于filtered，filtered小于100表示可以通过添加索引来优化，即直接的时间比较可以通过索引来优化。

### 添加索引

我们给字段添加索引。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53654ea0c00f40b989513bfe4acec1ed~tplv-k3u1fbpfcp-watermark.image?)

然后再次使用上述两条语句查询：

直接进行时间比较，执行时间分别为：0.335s，0.301s，0.299s

使用TO_DAYS比较，执行时间分别为：1.897s，1.919s，1.893s

可以发现，在添加索引的情况下，直接比较时间更快！



## 结论

在对应时间字段不添加索引的情况下，TO_DAYS函数比直接比较时间更快！

但是在使用索引的情况下，直接比较时间更快！
