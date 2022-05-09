---
title: Go语言并发基础与常用范式｜Go主题月
comments: true
date: 2021-04-15 17:29:45
categories: 后端
tags: Go
---



本文内容包括以下Go并发/并行的内容：

1.  go
2. chan
3. 锁

先来看一道并发同步问题：

> #### [1114. 按序打印](https://leetcode-cn.com/problems/print-in-order/)
>
> 我们提供了一个类：
>
> public class Foo {
>   public void first() { print("first"); }
>   public void second() { print("second"); }
>   public void third() { print("third"); }
> }
> 三个不同的线程 A、B、C 将会共用一个 Foo 实例。
>
> 一个将会调用 first() 方法
> 一个将会调用 second() 方法
> 还有一个将会调用 third() 方法
> 请设计修改程序，以确保 second() 方法在 first() 方法之后被执行，third() 方法在 second() 方法之后被执行。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/print-in-order
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

这个题目在力扣上并没有给出Go的提交选项！

类似定义class，我们定义一个Go的结构体：

```

```



### 关键字go

Go使用名为**goroutine**的方式来实现并发，`routine`的IT专业翻译为"例程，例行程序"，goroutine应该是一个Go诞生后的衍生词汇（嗯，我猜的）。**main函数也属于一个goroutine**

Go实现并发的方式非常的简单，**go + 并发语句**，代码如：

```go
package main

import (
	"fmt"
	"time"
)
func main()  {
	go first()
    go fmt.Println("second main") 
	time.Sleep(10) // 如果不添加词句，main协程完毕后其他协程会自动退出而不执行
}
func first() {
	fmt.Println("first")
}
func second() {
	fmt.Println("second")
}
func third() {
	fmt.Println("third")
}
```

多执行几次，会发现语句打印的顺序是随机的。另外，如果不喜欢使用time.Sleep(10)这种方式，也可以使用[sync.WaitGroup](https://golang.google.cn/pkg/sync/#WaitGroup)来保证其他协程的执行。

go大概有三种使用方式：

（1） go + 函数名/匿名函数

（3） go + 语句或语句块：

```go
go {
    /// 代码块
}
```



### chan

go设计者认为在并发模型中，消息机制优于共享内存机制，go中的这种机制被称为channel。

chan， **个人看法，其实并不能说是一种数据类型，因为在内建包（builtin）中并没有写 type chan**。chan作为goroutine之间的通信通道，遵循FIFO。一个chan只能传递一种类型，但声明为 **`chan interface{}`** 可以传递任意类型。

发送数据与接收数据使用 `<-`，并且通道是阻塞的，即如果接收方从通道获取数据时，发现通道无数据，则会等待发送方发送数据后才会执行，如：

```go
package main
/**
* 不能直接在函数体外使用 ch := make(chan int)， “:=”
* 可以使用var ch = make(chan int)
* 或者函数体外定义，函数体内使用make分配空间
* var ch chan int
* ...
* func ...{
*	ch = make(chan int)
* }
*/
var ch chan int

func main()  {
	ch = make(chan int) // 无缓冲的通道
	go parafunc(14)
    v := <- ch // 阻塞
	// 仍然会延迟5秒打印下述语句
	fmt.Println(" v = ", v)
}

func parafunc(i int)  {
	fmt.Println("test...")
	time.Sleep(5 * time.Second) // 延迟5秒
	ch <- i // 如果没有接收方，也会阻塞
	close(ch) // 关闭通道
}
```

chan创建时也可以分配长度，如

```go
ch := make(chan int, 2) // 此时，ch为缓冲区为2的通道
```

此时**ch为空时，取值阻塞；当ch填满两个元素时，放值阻塞**。如以下代码：

```go
var ch chan int

func main()  {
	ch = make(chan int, 1) 
	go parafunc(14)

	time.Sleep(10 * time.Second)

	fmt.Println("over")
}

func parafunc(i int)  {
	fmt.Println("test...")
	// time.Sleep(5 * time.Second)
	fmt.Println("before...")
    ch <- i // 因为容量为1，所以并不会阻塞；但是如果ch = make(chan int)时，则会阻塞
	fmt.Println("after....")
	close(ch)
}
```

### 锁

除消息机制外，Go也提供了共享资源加锁机制，包 `sync` 一些函数可对资源加锁操作。

包`atomic` 提供了一些原子函数：[官方链接](https://golang.google.cn/pkg/sync/atomic/)

```go
import "sync/atomic"
var count int64
atomic.AddInt64(&count, 1) // 原子操作+1
value := atomic.LoadInt64(&count) // 原子操作：取值
atomic.StoreInt64(&count, 1) // 设置值
```

sync 包提供了互斥锁：

```go
import "sync"

var mutex sync.Mutex

mutex.Lock()
.... // 临界区
mutext.Unlock()
```



### 解决同步问题

我们回到问题上，如何保持三个方法的同步呢，我们可以使用chan，代码如下。思路是使用两个通道，保持三个方法的同步。当然也可以用三个通道，告知外部程序，三个方法均执行完毕。

```go
package main

import "time"

type Foo struct {
	ch1 chan int
	ch2 chan int
}

func (f Foo) first() {
	print("first")
	f.ch1 <- 1 // 存入任何值均可
}

func (f Foo) second() {
	<- f.ch1
	print("second")
	f.ch2 <- 2 // 存入任何值均可

}

func (f Foo) third() {
	<- f.ch2
	print("third")
}

func main()  {
	f := Foo{make(chan int), make(chan int)}
	go f.first()
	go f.second()
	go f.third()
	time.Sleep(10 * time.Second)
}
```

补充：

1. 在默认情况下（不使用`sync.WaitGroup`, 不使用chan阻塞），main的goroutine在存在其他goroutine为执行的情况下也会自动退出，导致有的goroutine无法执行，即**所有 goroutine 在 main() 函数结束时会一同结束**。所以第一次执行的时候，不添加time.Sleep(10)会发生什么都打印不出来的情况。

2. `:=` 仅能在函数体内使用，函数外应用如下方式定义参数：

   ```GO
   var test = "testing"
   ```

最后的最后，我有个疑问，根据我看到的代码，结构体好像使用指针居多，即我声明方法的习惯是：

```go
func (f Foo) first() {
....
}
```

但是看到很多人都下面这样用：

```go
func (f *Foo) first() {
....
}
```

这样有什么好处吗？