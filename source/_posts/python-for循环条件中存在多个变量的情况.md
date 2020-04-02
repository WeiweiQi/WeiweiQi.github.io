---
title: python-for循环条件中存在多个变量的情况
comments: true
categories: python
abbrlink: fd6d
date: 2019-01-09 20:52:12
tags:
---

关键代码：
<!-- more -->

```
    for i,j in zip(range(5), range(4)):
        pass

	#另一种简单的形式:
	#enumerate将一个可遍历的数据对象(如列表、元组或字符串)组合为一个索引序列，同时列出数据和数据下标，一般用在 for 循环当中
	#2.6以上版本可添加start参数：enumerate(sequence, [start=0])
	for i, element in enumerate()
		pass

```
