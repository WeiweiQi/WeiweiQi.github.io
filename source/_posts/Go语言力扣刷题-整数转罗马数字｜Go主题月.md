---
title: Go语言力扣刷题-整数转罗马数字｜Go主题月
comments: true
date: 2021-04-02 18:16:00
categories: 后端
tags: Go
---

> #### [12. 整数转罗马数字](https://leetcode-cn.com/problems/integer-to-roman/)
>
> 罗马数字包含以下七种字符： `I`， `V`， `X`， `L`，`C`，`D` 和 `M`。
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
> 例如， 罗马数字 2 写做 `II` ，即为两个并列的 1。12 写做 `XII` ，即为 `X` + `II` 。 27写做 `XXVII`, 即为 `XX` + `V` + `II` 。
>
> 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 `IIII`，而是 `IV`。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 `IX`。这个特殊的规则只适用于以下六种情况：
> - `I` 可以放在 `V` (5) 和 `X` (10) 的左边，来表示 4 和 9。
> - `X` 可以放在 `L` (50) 和 `C` (100) 的左边，来表示 40 和 90。 
> - `C` 可以放在 `D` (500) 和 `M` (1000) 的左边，来表示 400 和 900。
>   给定一个整数，将其转为罗马数字。输入确保在 1 到 3999 的范围内。
>
>来源：力扣（LeetCode）
>链接：https://leetcode-cn.com/problems/integer-to-roman/
>著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

涉及到Go的知识包括：

1. map的使用：（一开始以为这题会用到map，Go中map的遍历顺序不随机的。。。）

```go
map1 := map[int]string{
    1000: "M",
    900: "CM",
    500: "D",
    400: "CD", // 注意，该处的逗号不能省略
}
fmt.Println(map1)
map2 := make(map[int]string) // 不指定长度
map2[1000] = "M"
map2[900] = "CM"
fmt.Println(map2)
// 第二个参数指定为1，但是设置两个元素
map3 := make(map[int]string, 1) 
map3[1000] = "M"
map3[900] = "CM"
fmt.Println(map3)
```

2. Go中的make，[官方文档](https://golang.org/pkg/builtin/#make)指出创建map时，第二个参数可能会被忽略而分配一个较小的初始空间。即上述代码的map3是允许的，并不表示限制map的size。这一点类似与Java对ArrayList的初始化。make可用于给切片slice/map/chan（channel 我目前还不知道这个类型是啥）来分配空间。

很多文档将make与new做对比。我们也来学习一下：

3. Go中的new

官方文档中是这样描述的：new返回一个对应类型零值的指针。

```
The new built-in function allocates memory. The first argument is a type, not a value, and the value returned is a pointer to a newly allocated zero value of that type.
新的内置函数分配内存。第一个实参是类型，而不是值，返回的值是一个指针，指向新分配的该类型的零值。
```

很容易将Go-new与Java-new联想起来，目前没怎么用过，不多说。

4. Go中字符串拼接：类比Java中的StringBuilder，Go中是否也有类似方法或接口呢？查找资料的时候查到可以使用`strings.Join`或者`bytes.Buffer.WriteString`或`strings.Builder.WriteString`



回到题目上，转换的规则应该是从左到右尽可能选择大的符号来表示。很明显适合使用贪心算法。

问题的难点是如何**处理4X与9X**这两种情况。我们可以将4X，9X对应的字母看作一个整体，即：IV = 4, IX = 9, XL=40, XC=90, CD= 400, CM = 900。将其余原映射表合并，形成总的数字映射表。

```Go
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(intToRoman(32))
}

func intToRoman(num int) string {
	nums := []int{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1}
	strs := []string{"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"}
	var result strings.Builder
	for i := 0; i < len(nums); i++ {
		// 每次查询剩余数字可以放置的最大值
		for ;num >= nums[i]; {
			num -= nums[i]
			result.WriteString(strs[i])
		}
	}
	return result.String()
}
```

力扣官方给出的硬编码倒是没想过这种算法，学到了(*^▽^*)。

