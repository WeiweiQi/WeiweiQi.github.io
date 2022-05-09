---
title: Go语言力扣刷题-正则表达式匹配｜Go主题月
comments: true
date: 2021-03-30 17:36:07
categories: 后端
tags: Go
---

> 10. 正则表达式匹配
>
> 给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。
>
> '.' 匹配任意单个字符
> '*' 匹配零个或多个前面的那一个元素
> 所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。
>
> ```
> 输入：s = "aa" p = "a"
> 输出：false
> 解释："a" 无法匹配 "aa" 整个字符串。
> 
> 输入：s = "aa" p = "a*"
> 输出：true
> 解释：因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
> 
> 输入：s = "ab" p = ".*"
> 输出：true
> 解释：".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
> ```
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/regular-expression-matching
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



涉及到Go中的知识包括：

1.  二维数组如何使用：

```
dp := make([][]bool, size)
```

2. 如何依次比较两个字符串的各个字符：切片。在考虑中文的情况下我认为应使用`[]rune(s)`后再进行比较。

```go
s := "abc"
s[0] == 'a' // true
```

3. 字符串拼接：在其中一种解法中，巧妙的拼接字符串以避免数组越界问题。

```go
s := "aaa"
b := s + "ddd"
```

查看资料后发现一种性能更高的字符串拼接方式：

```go
var b bytes.Buffer
b.WriteString("aaa")
b.WriteString("bbv")
s := b.String()
```

另外，从力扣官方示例代码中新学到的一种Go语言函数声明方式，函数内函数，像变量一样声明函数：

```go
func main() {
	// 可以类似变量一样声明函数
	inlineFunction := func() {
        fmt.Println("Hello")
	}
	// 函数调用
	inlineFunction()
}
```

这题的动态规划略复杂，搞了好久才搞懂。

仅仅一个点和一个星号的正则匹配都这么复杂，各个语言高效实现的完整的正则匹配功能真的厉害！根据《Effective Java》中在使用正则时的介绍，正则表达式最耗时的是按照正则表达式生成有限状态自动机的过程，因此我们**可以猜测，至少Java中是采用有限状态自动机来实现的正则匹配的**。

动态规划

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8de5c32f4f274ce5aea81c65b92bd4cd~tplv-k3u1fbpfcp-watermark.image)

定义状态：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6235c79837e84edcaa562244c057bfe5~tplv-k3u1fbpfcp-watermark.image)

状态转移方程：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5681bcc2a96140169364d4ca39aad060~tplv-k3u1fbpfcp-watermark.image)

问题的难点除了转移方程复杂外，初始化过程也比较难理解，空串与空串，空串与形式为a\*b\*c\*...的字符串也需要在初始化中指出。另外一种非常巧妙的避免这个过程的方法是通过在两个字符串的头部添加相同的特定字符来实现，我们不做过多阐述。

实现代码如下：

```go
func isMatch(s string, p string) bool {
	m, n := len(s), len(p)
	dp := make([][]bool, m + 1)
	for i := 0; i < len(dp); i ++ {
		dp[i] = make([]bool, n + 1)
	}

	// init
	dp[0][0] = true
	// how to init 
	for j := 1; j < n+1; j++ {
		// fmt.Println(p[j-1])
		if p[j-1] == '*' {
			// fmt.Println("j - 1 = ", j-1)
			dp[0][j] = dp[0][j-2]
		}
	}  
	// fmt.Println(dp)
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if p[j-1] == '*' {
				if j == 1 {
					// 即p以*号开头，按照题意不应出现这种情况，我们为了避免数组越界，增加这种判断
					dp[i][j] = false
				} else {
					if s[i-1] == p[j-2] || p[j-2] == '.' {
						dp[i][j] = dp[i-1][j] || dp[i][j-2]
					} else {
						dp[i][j] = dp[i][j-2]
					}
				}
			} else {
				if s[i-1] == p[j-1] || p[j-1] == '.' {
					dp[i][j] = dp[i-1][j-1]
				} else {
					dp[i][j] = false
				}
			}
			// fmt.Println("d[", i, "][", j, "] = ", dp[i][j])
		}
	}
	return dp[m][n]

}
```

因为这题耽误了不少时间，这周发的博客有点儿少，清明假期要赶一下了，o(╥﹏╥)o