---
title: Go语言力扣刷题-字符串转换整数｜Go主题月
comments: true
date: 2021-03-29 09:38:03
categories: 后端
tags: GO
---

发现掘金的一个小彩蛋：个人主页，鼠标放置在头像上，头像会转动，越转越快，调皮的程序员。

> 8. 字符串转整数
>
> 请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C/C++ 中的 atoi 函数）。
>
> 函数 myAtoi(string s) 的算法如下：
>
> - 读入字符串并丢弃无用的前导空格
> - 检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有）。 确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
> - 读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
> - 将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32）。如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
> - 如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被固定为 −231 ，大于 231 − 1 的整数应该被固定为 231 − 1 。
> - 返回整数作为最终结果。
>
> 注意：
>
> 本题中的空白字符只包括空格字符 ' ' 。
> 除前导空格或数字后的其余字符串外，请勿忽略 任何其他字符。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/string-to-integer-atoi
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



嗯，出个题连算法都给出来，就挺离谱~~另外，既然是解决文档，当然排除使用Go中的Atoi函数，即strconv包。

本题可以学到的Go知识包括：

1. Go中如何将字符转换为对应的数字，即'2'如何转换为数字2：

```go
package main
import (
    "bytes"
    "encoding/binary"
    "fmt"
)
func main()  {
	s := "0123"
	s_w1 := int(s[0]) // 直接显示转换
	fmt.Println(s_w1) // 48, 即'0'在ASCII中的10进制数字
	// 修正后我们采用如下方式可将字符'0'-'9'转换为对应的int数字
	s_w2 := int(s[0] - '0') 
	fmt.Println(s_w2)
    // 查找文档得出的方法：错误方法
	// fmt.Println(ByteToInt(s[0]))
}

/**
* 这个是我理解错误，这个是错误的，错误的!!!
*/
// func ByteToInt(bys byte) int {
// 	temp := make([]byte, 1)
// 	temp[0] = bys
//     bytebuff := bytes.NewBuffer(temp)
//     var data int64
//     binary.Read(bytebuff, binary.BigEndian, &data)
//     return int(data)
// }
```

为什么删除呢，因为我最初错误的理解为一个byte字节通过二进制操作可转换为int类型，并非如此。在我借鉴的程序中，ByteToInt的形参并非是一个byte，而是`[]byte`,即多个byte才能够转换为一个int才对，而'2'，ASCII码`0011 0010`转换为整数2，从本质上说，确实为'2'与'0'的差值。

~~代码中涉及到关于大小端模式：大端模式，数据的高字节保存在内存的低地址中，而数据的低字节保存在内存的高地址中。而小端模式则是数据的高字节保存在内存的高地址中，而数据的低字节保存在内存的低地址中。初学的我们不要纠结这些细节，暂时只需要记住“通常，golang中采用的是大端模式”~~

> ~~比如对于数据:0x12345678，从高字节到低字节为：12345678，从低字节到高字节为:78563412。~~
> ~~按照大端模式从低位buf[0]到高位buf[3]则应该为： 12， 34， 56， 78。~~
> ~~按照小端模式从低位buf[0]到高位buf[3]则应该为: 78，56，34，12。~~
>
> ~~[go语言中大小端模式的个人理解](https://studygolang.com/articles/30272)~~

2. Go中如何表示数字边界：在[整数反转]()中我们详细介绍了Go中的整数类型，以及如何表示32位整数的数字边界。

```go
const MAX_UINT32 = ^uint32(0)
const MIN_UINT32 = 0
// 最大无符号去掉符号位
const MAX_INT32 = int(MAX_UINT32 >> 1)
const MIN_INT32 = - MAX_INT32 - 1
```

3. Go中如何使用正则表达式：关于正则表达式详细可参考Google关于正则表达式的[RE2语法文档](https://github.com/google/re2/wiki/Syntax)，以及维基百科[正则表达式](https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F)。Go常用的正则方法可参考掘金文章：[Go正则表达式使用](https://juejin.cn/post/6844904078204633101)，示例代码如下

```go
package main
import (
    "fmt"
    "regexp"
)
func main() {
    buf := "weialfidnd8930232jdjfkdjka09232"
    //解析正则表达式，如果成功返回解释器
    reg1 := regexp.MustCompile(`\d.\d`)
    if reg1 == nil {
        fmt.Println("regexp err")
        return
    }

    //提取，第二个参数表示只查找前n个匹配项，如果n<0， 则查找所有匹配内容
    result1 := reg1.FindAllStringSubmatch(buf, -1)
	// result1 := reg1.FindAllString(buf, -1)
	fmt.Println("result1 = ", result1)
	for _, v := range result1 {
		fmt.Println("find = ", v[0])
	}

	// 第二个参数返回的error，无错误时返回nil
	match, _ := regexp.MatchString("p([a-z]+)ch", "peach")
    fmt.Println(match)
}
```

个人认为，**能够熟练使用正则表达式，网络API，处理集合与列表，是“精通一门语言”的前提**，Java也应该包括熟练使用stream库。

查看力扣官网给出的有限状态自动机来解决，也容易理解，不多阐述。我们给出Go语言的正则表达式的解法，参考了力扣中的一个python解法：

```GO
import (
	"regexp"
	"strings"
)

const MAX_UINT32 = ^uint32(0)	
	const MIN_UINT32 = 0
	// 最大无符号去掉符号位
	const MAX_INT32 = int(MAX_UINT32 >> 1)
	const MIN_INT32 = - MAX_INT32 - 1


func stringToInt(s string) int  {

	i, num := 0, 0
	if s[0] == '-' || s[0] == '+' {
		i = 1
	}

	for ; i < len(s); i++ {
		popNum := int(s[i] - '0')
		if (num > MAX_INT32/10) || (num == MAX_INT32/10 && popNum > 7) || (num < MIN_INT32/10) || (num == MIN_INT32/10 && popNum < -8) {
			if s[0] == '-' {
				return MIN_INT32
			} else {
				return MAX_INT32
			}
		}
		num = num*10 + popNum
	}

	if s[0] == '-' {
		return -num
	} else {
		return num
	}
}


func myAtoi(s string) int {

	// 去除空格
	str := strings.TrimSpace(s)
	//  # 解释器：^表示子串开始，\d表示数字。表示子串以‘+’，‘-’或数字开头并跟后续至少一个数字
	reg1 := regexp.MustCompile(`^[\+\-]?\d+`)
	// 查找第一个匹配上的子串

	numArray := reg1.FindAllStringSubmatch(str, 1)
	if len(numArray) == 0 {
		return 0
	}
	num := stringToInt(numArray[0][0])
	// num = int(*num) #由于返回的是个列表，解包并且转换成整数
	return max(min(num,MAX_INT32), MIN_INT32)    //#返回值
	// return num
}

func min(num1, num2 int) int  {
	if num1 < num2 {
		return num1
	}
	return num2
}

func max(num1, num2 int) int  {
	if num1 < num2 {
		return num2
	}
	return num1
}
```



代码比想象中复杂o(╥﹏╥)o

------

Go语言力扣刷题系列文章 ｜Go主题月

1. [Go语言力扣刷题-两数之和｜Go主题月](https://juejin.cn/post/6942846978107637767)
2. [Go语言力扣刷题-两数相加｜Go主题月](https://juejin.cn/post/6943102071000268814)
3. [Go语言力扣刷题-无重复字符的最长子串｜Go主题月](https://juejin.cn/post/6943487306988797982)
4. [Go语言力扣刷题-寻找两个正序数组的中位数｜Go主题月](https://juejin.cn/post/6943845806420000782)
5. [Go语言力扣刷题-最长回文子串｜Go主题月](https://juejin.cn/post/6944506513834639368)
6. [Go语言力扣刷题-Z字形变换｜Go主题月](https://juejin.cn/post/6944860416417726500)
7. [Go语言力扣刷题-整数反转｜Go主题月](https://juejin.cn/post/6945220122323714055)