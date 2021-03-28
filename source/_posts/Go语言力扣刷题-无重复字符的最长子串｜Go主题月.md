---
title: Go语言力扣刷题-无重复字符的最长子串｜Go主题月
comments: true
date: 2021-03-25 07:34:41
categories: 后端
tags: Go
---





> #### [3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)
>
> 给定一个字符串，请你找出其中不含有重复字符的 **最长子串** 的长度。

> ```
> 输入: s = "abcabcbb"
> 输出: 3 
> 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
> ```

我们使用两种解法来解决，一种暴力求解，毕竟遍历是最基础的一种操作方式。另外一种通过map来实现的滑动窗口求解。

遍历所有子串，输出所有子串的最长长度。我们采用的遍历方式是所有子串的起始位置，所有可能长度的子串。

对于我初学Go语言，如果要解决这个问题，需要学到以下知识内容：

1. 如何获取字符串中某个位置的字符：string(s[1])
2. 如何获取某个字符串的子字符串: s[i:j]，s[:j]，s[i:]。涉及到切片的知识，如果有Python基础，会比较好理解。并且，经过测试，此切片只针对英文字符有效，即utf-8单个字节切片。
3. 如何获取字符串的长度: len([]rune(s))
4. Go处理字符串是否存在官方工具包：import strings

在查找Go资料的过程中，遇到一个十分陌生的关键字：rune。个人理解，可以把rune当做是Go中处理中文字符一个工具。

当然，最终解决并没有全部用到，例如没有用到strings包。单并不影响我学习这些go语言的知识。



暴力求解方法：

```go
func lengthOfLongestSubstring(s string) int {
	max := 0
	var runeS = []rune(s)
	length := len(runeS)
	for i :=0; i<length; i += 1 {
		for j := i+1; j <= length; j += 1 {
			temp := runeS[i:j]
			same := hasSame(string(temp))
			if !same {
				if max < (j - i) {
					max = j-i
				} 
			}
		}
	}
	return max
}

/**
* 判断一个字符串中是否有重复字符
*/
func hasSame(s string) bool {
	sMap := make(map[string]int) // 字符到index的映射表
	sr := []rune(s)
	for index, v := range sr {
		_, ok := sMap[string(v)]
		if ok {
			return true
		} else {
			sMap[string(v)] = index
		}
	}
	return false
}
```

最终在力扣上的运行结果是"超出时间限制"，所以最终是否有逻辑问题也无从验证了，欢迎小伙伴指正！

滑动窗口求解代码：

```
func lengthOfLongestSubstring(s string) int {
	strMap := make(map[rune]int)
	runeS := []rune(s)
	length := len(runeS)
	max := 0
	// start作为窗口左侧下标，end作为窗口右侧下标
	for start, end:= 0, 0; end < length; end ++ {
		index, ok:= strMap[runeS[end]]
		if ok {
			// 关键处1：end处字符已出现过
			start = maxNum(index, start)
		} 
		max = maxNum(max, end - start + 1)
		strMap[runeS[end]] = end + 1
		// fmt.Printf("after, is testing %s, start = %d, end = %d, index=%d, max = %d\n", string(runeS[end]), start, end, index, max)
	}
	return max
}

func maxNum(a int, b int) int {
    if a < b {
        return b
    } else {
        return a
    }
}
```



这段代码个人一直未能理解的地方在于注释标注的**关键处1**：一开始我理解index肯定是大于start的，但是index实际上表示的是窗口右侧字符之前出现过的下标，而此时左侧窗口可能已经超过那处字符。

滑动窗口值得仔细品味！！

