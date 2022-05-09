---
title: Go语言力扣刷题-盛最多水的容器｜Go主题月
comments: true
date: 2021-04-02 10:56:52
categories: 后端
tags: Go
---

> 11. #### [盛最多水的容器](https://leetcode-cn.com/problems/container-with-most-water/)
>
> 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
>
> 说明：你不能倾斜容器。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/container-with-most-water
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

明白题目搞了半天~~

转换为大白话：给n个长度分别为a1, a2, ..., an的线段，一端与x轴对齐，依次排开，求与其中两条线段与x轴组成的矩形的最大面积。

笨方法，也是第一直觉，两两求最大值，两个for循环。

进阶：官方名称叫，**双指针**。即左侧1个指针与右侧1个指针逐步想中间移动，每次移动计算最大面积。也很好理解，和生活直觉也一致。

经过了第10题的洗刷，这题通过测试用例后1次通过，开森^_^

涉及到Go语言知识主要包括：数组操作，数组求长度。

```go
a := []int{1,2,3} // 定义初始化, a的类型为[]int
b := [...]int{1,2,3,4,5,7} // 定义初始化，b的类型为[6]int， a与b类型不同
c := []
a[1] = 2 // 下标访问设置元素
length := len(a) // 求长度
fmt.Println(length) // 3
// fmt.Println(maxArea(b)) // 会报错，因为maxArea函数的形参类型为[]int
fmt.Println(b) // [1 2 3 4 5 7]
c := [3]int{0:1, 2:4} // 指定下标初始化
fmt.Println(c) // [1 0 4]
```

需要注意的两个点是：

1. Go语言没有`while`循环, 使用 `for  ;循环条件; {}` 来实现。
2. Go语言中没有三目运算符 `condition? true-valu1: false-value2`，因此需要另外定义`max`函数

实现代码如下：

```go
func maxArea(height []int) int {
	i, j := 0, len(height)-1
	result := 0
	// go中没有while
	for ;i < j; {
        if height[i] < height[j] {
            // Go 中也没有三目运算符
			result = max((j - i) * height[i], result)
			i++
		} else {
			result = max((j - i) * height[j], result)
			j--
		}
	}
	return result
}

func max(x, y int) int {
	if x > y {
		return x
	} else {
		return y
	}
} 
```



新学到Go中有三个点的用法，补充在下面：

1. 可变参数函数：

   即允许传递不定长个相同类型的参数。

```go
func myfunc(vals ...int) {
    fmt.Println(reflect.TypeOf(vals))
    for _, v := range vals {
    	fmt.Println(v)
    }
}
```

2. 调用可变参数函数

   通过三个点可将数组，切片等转换为可变参数形式调用。

```go
myfunc(9, 8)
myfunc(a...)
```

经过测试发现，在可变参数函数中，获取到可变函数的类型为[]Type。

```go
package main

import (
	"fmt"
	"reflect"
)

func main() {
	a := []int{1, 2, 3, 4}
	b := []int{5, 6, 7}
	fmt.Println(a)
	c := append(a, b...)
	fmt.Println(c)
	myfunc(9, 8)
	myfunc(a...)
}

func myfunc(vals ...int) {
	fmt.Println(reflect.TypeOf(vals))
	for _, v := range vals {
		fmt.Println(v)
	}
}
```

