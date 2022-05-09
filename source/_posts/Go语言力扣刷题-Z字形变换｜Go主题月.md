---
title: Go语言力扣刷题-Z字形变换｜Go主题月
comments: true
date: 2021-03-28 10:34:43
categories: 后端
tags: Go
---

> Z字形变换：
>
> 将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。
>
> 比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：
>
> P   A   H   N
> A P L S I I G
> Y   I   R
> 之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/zigzag-conversion
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

这个题目搞了半天才搞懂Z变换是怎么回事，就是将一个字符串的字符，按照指定行依次按照下图方式进行排列，最终再按照行进行依次读取形成新的字符串：

<font size=72>↓↗↓↗↓...</font>

本题设计到Go语言中知识包括：

1. 字符串与字符的相互转换：

```go
// s 为string时，s[i]类型为byte，可通过string(s[i])将其转换为字符
```

2. List的使用： 

```go
package main
import (
    "container/list" // 需引入import "container/list"
    "fmt"
)
func main()  {
	myList := list.New()
    myList.PushBack(1) // 其他添加元素方法包括：PushBackList， PushFront， PushFrontList， InsertAfter， InsertBefore
    myList.PushBack("abc") // 同一个list可以放置不同类型的元素
    myList.PushBack(3)
    for e := myList.Front(); e != nil; e = e.Next() { // 遍历有Next(), Prev()
		fmt.Println(e.Value)
		println(e.Value) // 会打印出地址串，而非内容
	}	
}

// list移动元素的方法包括：MoveAfter，MoveBefore，MoveToBack，MoveToFront
// 访问元素：Front(), Back(), 注意访问元素值应为Front().Value, Back().Value
// 获取列表长度Len()
// 删除元素：Remove(e)
// 清空：Init
```

前面的题目把我给绕进去了，一直再总结归纳Z字形变换的数学规律，其实使用模拟方法更容易求解，也更好理解：即一步一步的模拟字符串的Z字形变换，然后依次输出各行字符。

原本因为不熟悉Go的字符串与字符转换，想学习一下Go的List类型，发现有点复杂，最终使用了[]string来实现，开森！

```go
func convert(s string, numRows int) string {
	if numRows > len(s) || numRows == 1 {
		return s
	}
	// 初始化
	// result := make([]list.List, numRows)
	result := make([]string, numRows)
	down := true // 字符添加方向
	sIndex := 0
	// 模拟Z编号
	for i:= 0; sIndex < len(s); sIndex++ {
        /**
        * 每一次：
        * 1. 先将该字符放置进去
        * 2. 根据移动方向判断下一个字符放置的位置
        * 3. 根据位置判断下一步是否需要修改移动方向
        */
		// println("向第", i, "行添加", string(s[sIndex]), "字符")
		result[i] += string(s[sIndex])
		if down { // 向下添加时，每添加一个，行数+1
			// result[i+1] += string(s[sIndex])
			i++
		} else { // 非向下时，每添加一个，行数-1
			// result[i-1] += string(s[sIndex])
			i--
		}
		if i % (numRows - 1) == 0 { // 到达每行的下端顶点或上端顶点
			down =  !down // 变化添加方向
		}
	}

	// 输出
	ss := ""
	for i := 0; i < len(result); i++ {
		ss += result[i]
	}
	return string(ss)
}
```



------

Go语言力扣刷题系列文章 ｜Go主题月

1. [Go语言力扣刷题-两数之和｜Go主题月](https://juejin.cn/post/6942846978107637767)
2. [Go语言力扣刷题-两数相加｜Go主题月](https://juejin.cn/post/6943102071000268814)
3. [Go语言力扣刷题-无重复字符的最长子串｜Go主题月](https://juejin.cn/post/6943487306988797982)
4. [Go语言力扣刷题-寻找两个正序数组的中位数｜Go主题月](https://juejin.cn/post/6943845806420000782)
5. [Go语言力扣刷题-最长回文子串｜Go主题月](https://juejin.cn/post/6944506513834639368)