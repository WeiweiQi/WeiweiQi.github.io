---
title: Go语言力扣刷题-电话号码的字母组合｜Go主题月
comments: true
date: 2021-04-10 14:43:57
categories: 后端
tags: Go
---



> #### [17. 电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)
>
> 一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
>
> 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



使用Go解决该问题涉及知识包括：

1. Go中map的初始化与使用

   [map官方文档](https://golang.google.cn/doc/effective_go#maps)

   map可以使用make或者常量来初始化：

   ```go
   a := make(map[string]string)
   a["key"] = "value"
   fmt.Println(a)
   b := map[string]string {
       "keyb": "valueb",
   }
   fmt.Println(b)
   ```

   

2. for 循环控制

   用习惯for-range后，真的比 for-i简洁好看好多。不仅可以遍历数组，切片，也可以遍历map，字符串。不需要某个参数时，可以将以`_`代替。

   对于数组而言： 第一个参数表示索引，第二参数表示取值。对于map而言：第一个参数表示键，第二参数表示取值。

   ```go
   for _, letter := range letters {
   	// loop
   }
   ```

   

3. append 切片添加元素

   [append](https://golang.google.cn/pkg/builtin/#append)可以向切片添加元素，并返回修改后的切片。

   ```go
   slice = append(slice, elem1, elem2)
   slice = append(slice, anotherSlice...)
   ```


4. Go的指针：

   这是我第一次使用Go的指针，按照C语言的方式使用，大概也就按照**&取地址，*取值**来操作。不多阐述。

回到题目上，这个题目个人认为官方将其复杂化了，或许是为了覆盖**回溯算法**这一考点吧。

**算法1**：三层循环，逐个追加。

其中的初始化 `result := []string{""}` 是我非常骄傲的一行代码 ^_^

```go
func letterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	numToLetterMap := map[string]string{
		"2": "abc",
		"3": "def",
		"4": "ghi",
		"5": "jkl",
		"6": "mno",
		"7": "pqrs",
		"8": "tuv",
		"9": "wxyz",
	}
	result := []string{""}
	for _, v := range digits {
		letters := numToLetterMap[string(v)]
		temp := make([]string, 0)
		for _, str := range result {
			for _, letter := range letters {
				temp = append(temp, str + string(letter))
			}
		}
		result = temp
	}
	return result
}
```

**算法2**： 回溯（递归）。借鉴了官方的算法逻辑。

```go
func letterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	numToLetterMap := map[string]string{
		"2": "abc",
		"3": "def",
		"4": "ghi",
		"5": "jkl",
		"6": "mno",
		"7": "pqrs",
		"8": "tuv",
		"9": "wxyz",
	}
	result := []string{}
	backtrack(digits, 0, "", &result, numToLetterMap)
	return result
}

func backtrack(d string, index int, combination string, result *[]string, m map[string]string)  {
	if index == len(d) {
		*result = append(*result, combination)
	} else {
		num := string(d[index])
		letters := m[num]
		for i := 0; i < len(letters); i++ {
			backtrack(d, index+1, combination+string(letters[i]), result, m)
		}
	}
}
```



使用Go刷了力扣17道题目，Go的基础知识了解的差不多了，但是完整的Go逻辑却还没有建立，因此想看一点Go书籍，把知识串起来，后续大概会发一下阅读笔记之类的。