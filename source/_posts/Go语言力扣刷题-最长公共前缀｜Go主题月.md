---
title: Go语言力扣刷题-最长公共前缀｜Go主题月
comments: true
date: 2021-04-06 14:07:26
categories: 后端
tags: Go
---

> #### [14. 最长公共前缀](https://leetcode-cn.com/problems/longest-common-prefix/)
>
> 编写一个函数来查找字符串数组中的最长公共前缀。
>
> 如果不存在公共前缀，返回空字符串 `""`
>
> ```
> 输入：strs = ["flower","flow","flight"]
> 输出："fl"
> 
> 输入：strs = ["dog","racecar","car"]
> 输出：""
> 解释：输入不存在公共前缀。
> ```
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/longest-common-prefix
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

第一想法，首先取最短子串Si，然后逐位递减，依次判断子串是否是公共前缀。

涉及到Go的知识包括：

1. Go数组基本操作：如何遍历数组查找最短子串？`for`的三种方式：我分别称呼为**正常for, 替换while的for，for-range**

   （1）正常for：

   ```go
   a := []int{0, 1, 2, 3, 4}
   for i := 0; i < len(a); i++ {
       fmt.Println(a[i])
   }
   ```

   （2）替换while的for：

   ```go
   numLessThan3 := 0
   for numLessThan3 < 3 {
       numLessThan3++
       fmt.Println(numLessThan3)
   }
   fmt.Println("over...")
   ```

   （3）for-range：可针对数组，切片，map等进行遍历操作，当不需要某个值时可用“_”代替。了解了一种新类型channel，暂略不表。

   对于数组而言： 第一个参数表示索引，第二参数表示取值。

   ```go
// 数组
   a := []int{034, 122, 222, 3222, 2234}
   for i, v := range a { 
       fmt.Println(i)
       fmt.Println(v)
   }
   for _, v := range a { 
       //fmt.Println(i)
       fmt.Println(v)
   }
   ```
   对于map而言：第一个参数表示键，第二参数表示取值。
   
   ```go
// map
   a := make(map[string]string, 2)
   a["k1"] = "value1"
   a["k2"] = "value2"
   for k, v := range a {
       fmt.Println(k)
       fmt.Println(v)
   }
   ```
   
2. 如何从一个字符串中截取部分作为一个新的字符串：切片，类似与python中的切片，又略有不同， Go不支持倒数切片。

   ```go
   a := []int{0, 1, 2, 3, 4}
   fmt.Println(a)  	// [0 1 2 3 4]
   fmt.Println(a[0:2]) // [0 1]
   fmt.Println(a[:2])  // [0 1]
   fmt.Println(a[2:4]) // [2 3]
   // fmt.Println(a[2:-1]) invalid slice index -1 (index must be non-negative)
   fmt.Println(a[2:])  // [2 3 4]
   
   // 倒数切片
   // fmt.Println(a[-2:]) invalid slice index -2 (index must be non-negative)
   ```

   

3. 如何判断一个字符串是另外一个字符串的前缀：

   我们可以通过循环判断字符串的每个字符是否相同，也可以通过strings.HasPrefix(s, prefix string)来判断。

回到问题上，实现代码如下：

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	strs := []string{"a", "a23", "abc"}
	fmt.Println(longestCommonPrefix(strs))
}

func longestCommonPrefix(strs []string) string {
    // 我第一次跑的时候遗忘了边界条件
    if len(strs) == 0 {
		return ""
	}

	// 查找最短子串
	shortestStr, shortestLength := strs[0], len(strs[0])
	for _, value := range strs {
		if len(value) < shortestLength {
			shortestLength = len(value)
			shortestStr = value
		}
	}


	for i := shortestLength; i > 0; i-- {
		if isCommonPrefix(shortestStr[:i], strs) {
			return shortestStr[:i]
		}
	}

	return ""
}


func isCommonPrefix(prefix string, strs []string) bool {
	// 逐位判断，或者使用strings.HasPrefix函数
	for _, value := range strs {
		if !strings.HasPrefix(value, prefix) {
			return false
		}
	}
	return true
}
```



最后问个问题：`fmt.Println(034)` 会输出什么？

提示一下：0-开头的数字会被认为是8进制。