---
title: Go语言力扣刷题-回文数｜Go主题月
comments: true
date: 2021-03-30 12:27:22
categories: 后端
tags: Go
---

>
>9. 回文数
>
>给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。
>回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。例如，121 是回文，而 123 不是。
>
>```
>输入：x = 121
>输出：true
>
>输入：x = -121
>输出：false
>解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
>```
>
>进阶：你能不将整数转为字符串来解决这个问题吗？
>
>来源：力扣（LeetCode）
>链接：https://leetcode-cn.com/problems/palindrome-number
>著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



最基本的算法：将数字转换为字符串 -> reverse -> 与原字符比较，相同则为true，不同则为false。其中最容易出错的点在于如何将整数转换为字符，即 `int to string`，单纯的显式转换string(x)并不会将x转换为字符串，而是将x当做ASCII编码转换为了对应字符。解法代码如下：

```go
import "strconv"

func isPalindrome(x int) bool {
	// 错误方式：该方法会将x认为是utf-8编码，得到莫名其妙的字符。
	// xStr := string(x)
    // 应使用此方法将整型转换为字符串
	xStr := strconv.Itoa(x)
	xBytes := []byte(xStr)
	length := len(xStr)
	reverseBytes := make([]byte, length)
	for index, _ := range xBytes {
		reverseBytes[length - index -1] = xBytes[index]
	}
	for index, v := range xBytes {
		if v != reverseBytes[index] {
			return false
		}
	}
	return true
}
```

第二种数学方法，将数字反转，与原数字比较。这种方法可能会导致数字越界溢出，因此可变形为依次比较数字的地位和高位，若均相同则返回true，否则返回false。实现逻辑与第三种类似。

第三种，也就是力扣官方给出的算法，取出尾部一半数字，反转，与剩余数字做比较，即

比如，1221，截取尾部21，反转为12，原数字去除尾部后变为12，12=12，则为回文数。

又比如，12321，截取尾部321，反转为123，原数字除去尾部为变为12，123 ！= 12，但是，123 / 10 = 12，所以原数字也是回文数。

```go
func isPalindrome(x int) bool {
	// 负数
	if x < 0 {
		return false
	}

	// 个位数都是回文数
	if x/10 == 0 {
		return true
	}

	// 即个位数为0，最高位不可能为0，所以一定不是回文数
	if x%10 == 0 {
		return false
	}

	var tailReverse int = 0
	for ; x > tailReverse ; x = x/10 {
		// 下一个最低位数字
		nextNum := x%10
		tailReverse = tailReverse*10 + nextNum
	}

	if x == tailReverse || x == tailReverse/10 {
		return true
	} else {
		return false
	}
}
```

------

Go语言力扣刷题系列文章 ｜Go主题月

1. [Go语言力扣刷题-两数之和｜Go主题月](https://juejin.cn/post/6942846978107637767)
2. [Go语言力扣刷题-两数相加｜Go主题月](https://juejin.cn/post/6943102071000268814)
3. [Go语言力扣刷题-无重复字符的最长子串｜Go主题月](https://juejin.cn/post/6943487306988797982)
4. [Go语言力扣刷题-寻找两个正序数组的中位数｜Go主题月](https://juejin.cn/post/6943845806420000782)
5. [Go语言力扣刷题-最长回文子串｜Go主题月](https://juejin.cn/post/6944506513834639368)
6. [Go语言力扣刷题-Z字形变换｜Go主题月](https://juejin.cn/post/6944860416417726500)
7. [Go语言力扣刷题-整数反转｜Go主题月](https://juejin.cn/post/6945220122323714055)
8. [Go语言力扣刷题-字符串转换整数｜Go主题月](https://juejin.cn/post/6945259722530848798)

