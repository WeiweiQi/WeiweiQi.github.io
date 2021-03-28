---
title: Go语言力扣刷题-最长回文子串｜Go主题月
comments: true
date: 2021-03-26 15:53:13
categories: 后端
tags: Go
---



> 最长回文子串
>
> 给你一个字符串 `s`，找到 `s` 中最长的回文子串。
>
> 输入：s = "babad"
> 输出："bab"
> 解释："aba" 同样是符合题意的答案。
>
> 输入：s = "cbbd"
> 输出："bb"
>
> 输入：s = "a"
> 输出："a"
>
> 输入：s = "ac"
> 输出："a"
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/longest-palindromic-substring
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



本题解法涉及到Go语言数组，字符串的知识包括：

1. Go中如何定义多维数组：

```go
var s = [][]int{{1,2,3}, {4,5,6}}
var s1 = [2][3]int{{1,2,3}, {4,5,6}}
var s2 = [3][3]int{{1,2,3}, {4,5,6}}
println(len(s)) // 2
println(len(s1)) // 2
println(len(s2)) // 3
```

2. Go中如何定义动态二维数组：

```go
	n, m := 2, 3
	arr := make([][]int, n)
	for i := 0; i < len(arr); i++ {
		arr[i] = make([]int, m)
	}
	for i := 0; i < len(arr); i++ {
		for j := 0; j < len(arr[i]); j++ {
			println(arr[i][j])
		}
	}
```

3. 新学到可以使用append给数组添加元素

```gO
刚学到Go中可以使用append给数组添加元素
var a []int
a = append(a, 1)
var arr [][]int
row1 := []int{1,2,3}
row2 := []int{4,5,6}
arr = append(arr, row1)
arr = append(arr, row2)
```

4. Go中字符串与数组如何转换：

```go
// 确认没有中文字符时，可以用byte
en := "124"
enArray := []byte(en)
// 有中文或特殊字符时，应用rune
ch := "你好abc"
chArray := []rune(ch)
chByteArray := []byte(ch)
println(len(enArray)) // 3
println(len(chArray)) // 5
println(len(chByteArray)) // 9, 一个中文字符占用3个字节
```

本文使用Go语言实现动态规划算法。

在检索资料的过程中，看到一句很有意思的动态规划理解方式：

> Dynamic Programming is just a fancy way to say 'remember stuff to save time later'

定义动态规划最优解的状态特征：is_palindrome[i] [j] 等于true或false， 表示字符串 s 的第 i 到 j 个字母组成的串是否为回文串。

动态规划状态转移方程/递推公式：**从长度较短的字符串向长度较长的字符串进行转移**

动态规划边界条件/初始化：当i=j时，is_palindrome[i] [j]= true， is_palindrome[i] [i + 1] = s[i] == s[i + 1]。

动态规划代码实现如下：

```go
func longestPalindrome(s string) string {
	runeS := []rune(s)
	length := len(runeS)
	/**
	* dp := make([length][length]bool)
	* 编译报错：non-constant array bound length
	* Go中如何定义二维数组？
	*/
	dp := make([][]bool, len(runeS))
	for i := 0; i < len(runeS); i++ {
		dp[i] = make([]bool, len(runeS))
	}
	targetLeft := 0
	targetLength := 1


	for right := 0; right < length; right++ {
		// 代码错误注意事项：首次条件为left < right，导致无法执行left==right为true的情况
		for left := 0; left <= right; left++ {
			// println("left = ", left, ", runeS[left] = " + string(runeS[left]))
			// println("right = ", right, ", runeS[right] = " + string(runeS[right]))
			if left == right {
				// println("left === right")
				dp[left][right] = true
			} else if right -left == 1 {
				// println("right - left = 1")
				dp[left][right] = (runeS[left] == runeS[right])
			} else {
				// println("test...")
				dp[left][right] = dp[left+1][right-1] && runeS[left] == runeS[right]
			}

			if dp[left][right] && (right - left + 1) > targetLength {
				targetLength = right - left + 1
				targetLeft = left
				
				// println("s[left][right] = " + string(runeS[targetLeft:targetLeft+targetLength-1]))
			}
			
		}
	}

	return string(runeS[targetLeft:targetLeft+targetLength])
}
```

尴尬的是，第一次没有屏蔽掉println，竟然超时了，看来以后生产环境下还是尽量去掉print！！！



补充Manacher算法代码解析：搞了半天算法，还是代码更容易懂：

```go
/**
* Manacher
*/
func longestPalindrome(s string) string {
	start, end := 0, -1
	t := "#"
	for i := 0; i < len(s); i++ {
		t += string(s[i]) + "#"
	}
	t += "#"
	s = t
	println(s)
	// 存储各个位置的最大臂长
	arm_len := []int{}
	// right表示搜索到的最右边界
	right, j := -1, -1
	for i := 0; i < len(s); i++ {
		// 对于每一个i点
		var cur_arm_len int
		if right >= i { // i点在right点的左侧
			// i_sym为i相对于j的对称点
			i_sym := j*2-i
			// i点的最短臂长
			min_arm_len := min(arm_len[i_sym], right-i)
			// 从最短臂长向外搜索
			cur_arm_len = expand(s, i-min_arm_len, 	i+min_arm_len)
		} else { // i点在right点右侧，一无所知
			cur_arm_len = expand(s, i, i)
		}
		// 记录i点最大臂长
		arm_len = append(arm_len, cur_arm_len)
		if i + cur_arm_len > right {
            // 更新中心j的位置
            j = i
			// 更新right的位置
			right = i +  cur_arm_len
		}
		if cur_arm_len*2+1 > end - start {
			// 最大臂长更新
			start = i - cur_arm_len
			end = i + cur_arm_len
		}
	}
	ans := ""
	for i := start; i <= end; i++ {
		if s[i] != '#' {
			ans += string(s[i])
		}
	}
	return ans
}

func expand(s string, left, right int) int {
	for ;left>=0&&right<len(s)&&s[left]==s[right]; left, right = left-1, right + 1{}
	// 要求的是臂长，所以要除2
	return (right - left -2) / 2
}

func min(x, y int) int {
	if x < y {
		return x
	}
	return y
}
```



------

Go语言力扣刷题系列文章 ｜Go主题月

1. [Go语言力扣刷题-两数之和｜Go主题月](https://juejin.cn/post/6942846978107637767)

2. [Go语言力扣刷题-两数相加｜Go主题月](https://juejin.cn/post/6943102071000268814)

3. [Go语言力扣刷题-无重复字符的最长子串｜Go主题月](https://juejin.cn/post/6943487306988797982)

4. [Go语言力扣刷题-寻找两个正序数组的中位数｜Go主题月](https://juejin.cn/post/6943845806420000782)