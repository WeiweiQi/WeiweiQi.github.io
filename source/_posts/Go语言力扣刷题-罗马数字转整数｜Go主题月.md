---
title: Go语言力扣刷题-罗马数字转整数｜Go主题月
comments: true
date: 2021-04-06 10:29:01
categories: 后端
tags: Go
---

> #### [13. 罗马数字转整数](https://leetcode-cn.com/problems/roman-to-integer/)
>
> 罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。
>
> ```
> 字符          数值
> I             1
> V             5
> X             10
> L             50
> C             100
> D             500
> M             1000
> ```
>
>
> 例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。
>
> 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：
>
> I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
> X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 
> C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
> 给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/roman-to-integer
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

力扣给出了一种惊天地泣鬼神的解法，直接把IV,IX等形式替换为字符串a,b,c...等，然后再进行转换，我怎么就想不出来呢。o(╥﹏╥)o

本题涉及的Go语言知识包括：

1. Go中map的用法：[上题中](https://juejin.cn/post/6947862974891556872)我们列举了Go中map的用法，本题不多叙述。
2. Go中将字符串作为数组的使用：

```go
s := "abc"
fmt.Println(s[1]) // 98
fmt.Println(string(s[1])) // b
```

3. 字符串替换

```go
s := "abcabc"
a := strings.Replace(s, "a", "A", 1)
fmt.Println(s) // abcabc
fmt.Println(a) // Abcabc
b := strings.Replace(s, "a", "A", -1) // -1表示全部替换
fmt.Println(b) // AbcAbc
```



回到题目上，

一种解法，从右向左或从左向右，**每次判断两个字符**，来决定**数字大小和下标移动距离**。

另外一种解法是，直接将4,9等情况的两个字母转换为一个字母，对于每个字母直接在映射中寻找其匹配数字。

易错点包括：（1） map初始化时，最后一行仍然需要保留逗号；（2）map取值时，键为字符串，而字符串s取值s[i]类型为byte，因此，需要使用类型转换string(s[i])

```go
import "strings"
func romanToInt(s string) int {
	// 映射表
	romanMap := map[string]int {
		"I": 1,
		"V": 5,
		"X": 10,
		"L": 50,
		"C": 100,
		"D": 500,
		"M": 1000,
		"a": 4,
		"b": 9,
		"c": 40,
		"d": 90,
		"e": 400,
		"f": 900, // 该行的逗号不可省略
	}
	temp := strings.Replace(s, "IV", "a", -1)
	temp = strings.Replace(temp, "IX", "b", -1)
	temp = strings.Replace(temp, "XL", "c", -1)
	temp = strings.Replace(temp, "XC", "d", -1)
	temp = strings.Replace(temp, "CD", "e", -1)
	temp = strings.Replace(temp, "CM", "f", -1)
	result := 0
	// tempArray := []
	for i:= 0; i < len(temp); i++ {
		result += romanMap[string(temp[i])] // temp[i]类型为byte
	}
	return result
}
```



用Go刷题，Go的知识越多感觉有些凌乱了，可能是时候总结一波了。。。