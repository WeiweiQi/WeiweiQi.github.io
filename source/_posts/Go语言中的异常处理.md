---
title: Go语言中的异常处理
comments: true
date: 2021-06-08 08:53:13
categories: 后端
tags: 后端
---

这是我参与更文挑战的第8天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

> 不积跬步，无以至千里；不积小流，无以成江海。骐骥一跃，不能十步，驽马十驾，功在不舍。锲而舍之，朽木不折；锲而不舍，金石可镂。

在[上篇](https://juejin.cn/post/6971002900608712711)分析singleflight的相关资料中，看到有文章说“doCall方法巧妙的使用两个defer来区分调用函数异常与系统异常”。今天查找资料，学习一下Go的异常处理机制，目前的大概印象，只知道一个关键字`panic`。

## 异常与错误

在Go语言中，**错误**被认为是一种可以预期的结果；而**异常**则是一种非预期的结果，发生异常可能表示程序中存在BUG或发生了其它不可控的问题。

**Go 中主要通过 error 和 panic 分别表示错误和异常**[2]

例如，从一个`map`查询一个结果时，可以通过额外的布尔值判断是否成功，属于一种预期的结果。

```go
if v, ok := m["key"]; ok {
    return v
}
```

## 错误

Go中的错误类型：`error`

```go
type error interface {
    Error() string
}
```

内置的 error 接口使得开发人员可以为错误添加任何所需的信息，error 可以是实现 Error() 方法的任何类型，具体例子可参考[2]。


Go中[errors包](https://golang.org/pkg/errors/)提供了几个常用的函数，包括`errors.New, errors.Is, errors.As, errors.Unwrap` ，以及使用`fmt.Errorf`。

`erros.Is`判断两个`error`是否相等，`error.As`判断`error`是否为特定类型。

### 使用实例

函数通常可在最后一个返回值中返回错误信息，一个简单的应用实例：

```go
package main

import (
	"errors"
	"fmt"
)

func myF(f float64) (float64, error) {
	if f < 0 {
		return 0, errors.New("Not legal input ")
	}
	// 实现
	return 0.0, nil
}

func main() {
	var m map[string]string
	m = make(map[string]string)
	m["a"] = "2"
	_, ok := m["a"]
	_, ok2 := m["b"]
	fmt.Println(ok) // true
	fmt.Println(ok2) // false

	_, e := myF(-1)
	_, e2 := myF(2)
	fmt.Println(e) // Not legal input
	fmt.Println(e2) // <nil>
}
```



## 异常

defer,panic recover搭配可以处理异常。

### defer

当程序出现异常，如数组访问越界这类“意料之外”的错误时，它能够导致程序运行崩溃，此时就需要开发人员捕获异常并恢复程序的正常运行流程。捕获异常不是最终的目的。如果异常不可预测，直接输出异常信息是最好的处理方式[1]。

`defer`是Go提供的一种延迟执行机制，每次执行 defer，都会将对应的函数压入栈中。在函数返回或者 panic 异常结束时，Go 会依次从栈中取出延迟函数执行。

### panic

`panic`用于主动抛出程序执行的异常，会终止其后将要执行的代码，并依次逆序执行 panic 所在函数可能存在的 defer 函数列表。

### recover

`recover` 关键字主要用于捕获异常，将程序状态从严重的错误中恢复到正常状态。 必须在 defer 函数中才能生效。

下面是一个defer+panic+recover的代码样例，可以看到，在手动panic后，执行了defer中的输出，并且，`a`的值为0，所以如果函数中有panic语句，name函数应该需要返回一个`error`。

```go
package main

import "fmt"

func main() {
	for i := 0; i < 10; i++ {
		a := my(i)
		fmt.Println(a)
	}
}

func my(i int) int {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("发生了异常", err)
		}
	}()
	if i != 5 {
		return i
	} else {
		panic("panic")
	}
	return -1
}

```

代码输出结果：

```shell
0
1
2
发生了异常 panic
0
4
```



### 一个处理极端

超级健壮的代码，每个函数开始的地方都添加如下代码：

```go
func myfunc() {
    defer func() {
       if err := recover(); err != nil {
          fmt.Println(err)
      } 
    }()
    // 函数实现....
}
```

当然，不要总这么做~~~



[1] [错误和异常](https://chai2010.cn/advanced-go-programming-book/ch1-basic/ch1-07-error-and-panic.html)

[2] [没有 try-catch，该如何处理 Go 错误异常](https://bbs.huaweicloud.com/blogs/227948)

[3] [Go语言中defer的一些坑](https://juejin.cn/post/6844903679519096846)

[4] [Go 语言踩坑记——panic 与 recover](https://xiaomi-info.github.io/2020/01/20/go-trample-panic-recover/)

[5] [[译] Part 31: golang 中的自定义 error](https://juejin.cn/post/6844903810943418375)
