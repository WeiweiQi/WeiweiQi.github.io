---
title: 记一次mysql关联查询格式冲突问题
comments: true
date: 2022-05-20 17:41:36
categories:
tags:
---

## 问题起源

作为CRUD程序员，最常用的功能当然是数据库查询了。

前些天一个很简单的SQL报了一个不常见的错误：

```
Illegal mix of collations (utf8mb4_general_ci,IMPLICIT) and (utf8mb4_unicode_ci,IMPLICIT) for operation '='
```

今天我们就来看看mysql的utf8mb4的两种格式问题，以及如何解决这个问题？

## mysql的utf8格式与排序规则

### 字符集uft8与uft8mb4

在mysql中创建表并添加字段的时候，想选utf8字符集时会有两个选择：

1. utf8
2. utf8mb4

这两个有什么区别呢？

MySQL是在5.5.3之后才有utf8mb4的字符集可选，mb4的意思是：Most Bytes 4，可以兼容unicode。

而utf8最多支持3个字节，比如3个字节的uft8无法支持Emoji表情和不常用的汉字，以及任何新增的Unicode字符等，因此才引入了uft8mb4。

### 排序规则

我们这次的问题是排序规则冲突引起的：

查询语句：

```mysql
SELECT * FROM table1 t1 
left join table2 on t1.username = t2.username
```

关联字段的编码字符集均为utf8mb4，但是t1.username的排序规则是`utf8mb4_general_ci`，而t2.username的排序规则是`utf8mb4_unicode_ci`。

两种排序规则的区别与特点是什么呢？

#### 特点

utf8mb4_unicode_ci 是基于标准的 Unicode 来排序和比较，即能够支持所有Unicode字符的精确排序；
而utf8mb4_general_ci没有实现Unicode排序规则，在遇到特殊字符时，排序可能不同。

#### 区别

也因此，uft8mb4_general_ci相比utf8mb4_unicode_ci，前者的准确性虽然打了折扣，但是比较和排序执行的速度更快，并且，通常遇到特殊字符的顺序并不重要。

## 排序规则不兼容的解决方案

在mysql中，排序规则不兼容的解决方案有两种：

1. 第一种，修改表字段的格式一致。
    
即修改表的排序规则统一为utf8mb4_unicode_ci，或者另一种。官方更推荐使用utf8mb4_unicode_ci的排序规则，借用StackOverflow上的一段话：

> There is almost certainly no reason to use utf8mb4_general_ci anymore, as we have left behind the point where CPU speed is low enough that the performance difference would be important. Your database will almost certainly be limited by other bottlenecks than this.

    
大概意思是说，当前CPU的运行速度已经快到可以让我们不再将此排序作为一个考虑参数，而更应该开了其他开销。

2. 另一种方式则是借助关键字，`COLLATE`

通过COLLATE属性，可以指定列的排序和比较方式。

我们在使用时，将它放在关联查询需要修改排序规则的地方：

```mysql
SELECT
	u.guid
FROM
	`test`  t
LEFT JOIN user u ON u.guid = t.guid COLLATE utf8mb4_unicode_ci
WHERE t.state = 1
```

如此，使用COLLATE属性，可以让使用不同排序规则的字段进行关联查询。

但是，经过测试，这样会减慢SQL查询的速度。

具体采用哪种方式，需要细细考量。





