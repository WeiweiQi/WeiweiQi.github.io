---
title: Go语言冷知识-刷题遗漏知识补充iota｜Go主题月
comments: true
date: 2021-04-06 14:24:16
categories: 后端
tags: Go
---



只学过C，C++，Java，Python，JavaScript，一点点Rust，表示第一次见到这么个关键字，一头慌慌哒的雾水~~

个人是这么理解的：**const内部的递增行号，const每行复制上一行的表达形式**。我也在学习阶段，不一定准确。

官方给出的iota的测试用例链接为：https://golang.org/test/iota.go，熟悉这些测试用例，iota的知识点就应该算是掌握了。

例如，官方测试用例中的两个样例：**重点关注下述代码中的F**

```go
const (
	A = 1 << iota	 // iota = 0
	B 				// iota = 1,  1 << iota 即 1 << 1 = 2
	C 				// iota = 2,  1 << iota 即 1 << 2 = 4
	D 				// iota = 3,  1 << iota 即 1 << 3 = 8
	E = iota * iota  // iota = 4, 16
	F 				// iota = 5, 复制上一行的形式，iota * iota = 25
	G 				// iota = 6, 复制上一行的形式，iota * iota = 36
)


```

再比如：

```go
const (
	s = string(iota + 'a') // iota = 0, s = "a"
    t  					  // t = string(iota + 'a') // iota = 1, t = "b"
)
```

需要注意的几点：

1. iota表示当前内部的行号, 从0开始，即使第一行没有写明iota。

   ```go
   const (
   	a = 1 		// 1, iota = 0
   	b = iota 	// iota=1 
   )
   ```

   

2. iota复制上一行的表达式，除iota本身外，其他均为明确的数字：

   上述两点，可以看以下示例：重点关注示例中的**d**。

   ```go
   const (
   	a = 1 			// 1, iota = 0
   	b = iota << a 	 // iota=1, 实际表达式为 1 << 1 = 2 
   	c = iota << b 	 // iota=2, 实际表达式为 2 << 2 = 4
   	d 				// iota = 3, 模仿上一行的表达式为 iota << 2  即 3 << 2 = 12
   )
   ```

3. iota在下一行增长

   ```go
   const (
   	abit, amask = 1 << iota, 1<<iota - 1 // iota= 0, abit = 1, amask = 0
   	bbit, bmask = 1 << iota, 1<<iota - 1 // iota= 1, bbit = 2, bmask = 1
   	cbit, cmask = 1 << iota, 1<<iota - 1 // iota= 2, cbit = 4, cmask = 3
   )
   ```

   

PS: 我本地执行程序时，将文件名命名为了iota_test.go，执行 go run oita_test.go 报错为：go run: cannot run *_test.go files (iota_test.go)。

据说是因为_test后缀结尾的会被认为是测试文件。未涉及到这部分，暂且略过。

PS: 果然`//`对齐才好看。