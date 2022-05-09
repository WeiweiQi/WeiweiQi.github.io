---
title: Go缓存击穿方案-singleflight源码解读
comments: true
date: 2021-06-07 09:14:21
categories: 后端
tags: Go
---



这是我参与更文挑战的第7天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

在[缓存击穿及解决方案](https://juejin.cn/post/6970484995211132958)中简单介绍了Go使用singleflight解决缓存击穿，查到了singleflight的源码，阅读感受只能说“**让我感觉自己不太适合干程序员这项工作**~”，今天下决心把singleflight源码搞懂，尤其是前几天一直困惑的singleflight何时存储，何时删除其内部缓存的问题。

而且，其中涉及到了很多Go的并发编程知识。很有必要学习一番。

## Go并发的一些知识

### WaitGroup 等待线程组

WaitGroup线程同步，指等待一组协程goroutine执行完成后才会继续向下执行。如下为简单的测试代码：

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var group sync.WaitGroup
	group.Add(2)
	for i := 0; i < 2; i++ {
		go func() {
			fmt.Println("other routine finish ")
			group.Done()
		}()
		fmt.Println("i = ", i)
	}
	group.Wait()
    // 将等待两个协程执行完毕后才执行下面语句
	fmt.Println("all group routine finish")
}
```

运行结果如下：

```shell
i =  0
other routine finish 
i =  1
other routine finish 
all group routine finish
```



### sync.Mutex 互斥锁

Mutex是一个互斥锁，可以创建为其他结构体的字段；零值为解锁状态。Mutex类型的锁和线程无关，可以由不同的线程加锁和解锁[2]。

注意以下几点：

1. 在一个 goroutine 获得 Mutex 后，其他 goroutine 只能等到这个 goroutine 释放该 Mutex[3]
2. 已加锁后只能解锁后再加锁
3. 解锁未加锁的会导致异常
4. 适用于读写不确定，并且只有一个读或者写的场景[3]

测试代码如下：

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	wait := sync.WaitGroup{}
	var m sync.Mutex
	fmt.Println("Main Routine Locked")
	m.Lock()

	for i := 0; i <=2 ; i++ {
		wait.Add(1)
		go func(i int) {
			fmt.Println(i, " not get lock, waiting...")
			m.Lock()
			fmt.Println(i, " get lock, doing...")
			time.Sleep(time.Second)
			fmt.Println(i, " Unlocked")
			m.Unlock()
			defer wait.Done()
		}(i)
	}

	time.Sleep(time.Second)
	fmt.Println("Main Routine Unlocked")
	m.Unlock()

	wait.Wait()
}

```

运行结果如下：

```shell
Main Routine Locked
2  not get lock, waiting...
0  not get lock, waiting...
1  not get lock, waiting...
Main Routine Unlocked
2  get lock, doing...
2  Unlocked
0  get lock, doing...
0  Unlocked
1  get lock, doing...
1  Unlocked
```

## singleflight的两个结构体

### cal

call保存当前调用对应的信息。

```go
// call is an in-flight or completed singleflight.Do call
type call struct {
	wg sync.WaitGroup

	// These fields are written once before the WaitGroup is done
	// and are only read after the WaitGroup is done.
    // 函数返回值，在wg.Done前只会写入一次，在wg.Done后是只读的。
	val interface{}
	err error

	// forgotten indicates whether Forget was called with this call's key
	// while the call was still in flight.
    // 标识Forget方法是否被调用
	forgotten bool

	// These fields are read and written with the singleflight
	// mutex held before the WaitGroup is done, and are read but
	// not written after the WaitGroup is done.
    // 统计调用次数
	dups  int
    // 返回的 channel
	chans []chan<- Result
}

```

### Group

```go
// Group represents a class of work and forms a namespace in
// which units of work can be executed with duplicate suppression.
type Group struct {
	// 互斥锁
	mu sync.Mutex       // protects m
	// 映射表，调用key->调用，懒加载，
	m  map[string]*call // lazily initialized
}
```



## Do方法

通过`group.mu`，`group.m` 确保某个时间点只有一个方法进入实际的执行。

通过`call.wg`确保实际执行的方法执行完毕后后，其他同样的方法可以从`call.val`获取到同样的数据。

```go
// Do executes and returns the results of the given function, making
// sure that only one execution is in-flight for a given key at a
// time. If a duplicate comes in, the duplicate caller waits for the
// original to complete and receives the same results.
// The return value shared indicates whether v was given to multiple callers.
// Do执行和返回给定函数的值，确保某一个时间只有一个方法被执行。如果一个重复的请求进入，则重复的请求会等待前一个执行完毕并获取相同的数据，返回值shared标识返回值v是否是传递给重复的调用的
func (g *Group) Do(key string, fn func() (interface{}, error)) (v interface{}, err error, shared bool) {
   g.mu.Lock()
   if g.m == nil {
       // 懒加载，初始化
      g.m = make(map[string]*call)
   }
    
    // 检查指定key是否已存在请求
   if c, ok := g.m[key]; ok {
      // 已存在则解锁，调用次数+1，
      c.dups++
      g.mu.Unlock()
       
       // 然后等待 call.wg（WaitGroup） 执行完毕，只要一执行完，所有的 wait 都会被唤醒
      c.wg.Wait()

       // 我的Go知识还没学到异常，暂且不表：
       // 这里区分 panic 错误和 runtime 的错误，避免出现死锁，后面可以看到为什么这么做[4] 
      if e, ok := c.err.(*panicError); ok {
         panic(e)
      } else if c.err == errGoexit {
         runtime.Goexit()
      }
      return c.val, c.err, true
   }
   // 如果我们没有找到这个 key 就 new call
   c := new(call)
    
   // 然后调用 waitgroup 这里只有第一次调用会 add 1，其他的都会调用 wait 阻塞掉
   // 所以只要这次调用返回，所有阻塞的调用都会被唤醒
   c.wg.Add(1)
   g.m[key] = c
   g.mu.Unlock()
   // 实际执行fn
   g.doCall(c, key, fn)
   return c.val, c.err, c.dups > 0
}
```



## doCall

由于本人Go的知识面还没有覆盖到Go的异常部分，其对异常的处理暂且不表，借用[文章](https://lailin.xyz/post/go-training-week5-singleflight.html)与代码中的注释的说法：使用了两个 defer 巧妙的将 runtime 的错误和我们传入 function 的 panic 区别开来避免了由于传入的 function panic 导致的死锁

```go
// doCall handles the single call for a key.
func (g *Group) doCall(c *call, key string, fn func() (interface{}, error)) {
    // 表示方法是否正常返回
	normalReturn := false
	recovered := false

	// use double-defer to distinguish panic from runtime.Goexit,
	// more details see https://golang.org/cl/134395
	defer func() {
		// the given function invoked runtime.Goexit
        // 如果既没有正常执行完毕，又没有 recover 那就说明需要直接退出了
		if !normalReturn && !recovered {
			c.err = errGoexit
		}

		c.wg.Done()
		g.mu.Lock()
		defer g.mu.Unlock()
         // 如果已经 forgot 过了，就不要重复删除这个 key 了
		if !c.forgotten {
			delete(g.m, key)
		}

        // 下面应该主要是异常处理的diamante
		if e, ok := c.err.(*panicError); ok {
			// In order to prevent the waiting channels from being blocked forever,
			// needs to ensure that this panic cannot be recovered.
			if len(c.chans) > 0 {
				go panic(e)
				select {} // Keep this goroutine around so that it will appear in the crash dump.
			} else {
				panic(e)
			}
		} else if c.err == errGoexit {
			// Already in the process of goexit, no need to call again
		} else {
			// Normal return
			for _, ch := range c.chans {
				ch <- Result{c.val, c.err, c.dups > 0}
			}
		}
	}()

	func() {
        // 使用一个匿名函数来执行实际的fn
		defer func() {
			if !normalReturn {
				// Ideally, we would wait to take a stack trace until we've determined
				// whether this is a panic or a runtime.Goexit.
				//
				// Unfortunately, the only way we can distinguish the two is to see
				// whether the recover stopped the goroutine from terminating, and by
				// the time we know that, the part of the stack trace relevant to the
				// panic has been discarded.
				if r := recover(); r != nil {
					c.err = newPanicError(r)
				}
			}
		}()
		
         // 方法实际执行，将值存在c.val中
		c.val, c.err = fn()
		normalReturn = true
	}()

	if !normalReturn {
		recovered = true
	}
}
```



## 流程概述图


![singleflight4.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5274a0078fc34ce78a297feec238791c~tplv-k3u1fbpfcp-watermark.image)



参考资料：

[1] 一篇带给你Go并发编程Singleflight https://developer.51cto.com/art/202103/652064.htm

[2] [package sync.Mutex](https://studygolang.com/static/pkgdoc/pkg/sync.htm#Mutex)

[3] [Go 标准库 —— sync.Mutex 互斥锁](https://segmentfault.com/a/1190000015177717)

[4] [Go并发编程(十二) Singleflight](https://lailin.xyz/post/go-training-week5-singleflight.html)

