---
title: Go语言控制CPU占用率呈正弦曲线｜Go主题月
comments: true
date: 2021-04-19 12:50:52
categories: 后端
tags: Go
---

### 题目来源

《编程之美》的第一道题目，原文中给出了C语言的解法、相关函数接口与工具。思考如何使用Go来实现这一目标？

> 写一个程序，让用户来决定Windows任务管理器的CPU占用率。可以实现下面三种情况：
>
> 1. CPU的占用率固定在50%，为一条直线；
> 2. CPU的占用率为条直线，但是具体占用率由命令行参数觉得（1~100）；
> 3. CPU的占用率状态是一个正弦曲线
> 4. 如果你的电脑是双核的，那么你的程序会有什么样的结果为什么？

### 解决思路：
思考：如何使CPU的占用率为50%呢？
我们认为大体上有两种思路：

1. CPU一直运行，但速率/频率是全速运行的50%。
2. CPU按时间来划分，50%的时间全速运行，50%的时间不运行。

  ##### 为什么放弃思路1：调节CPU频率

  ​	(1) CPU的频率是与CPU的时钟周期有关，需要获取更多的硬件支持，而非软件角度

  ​	(2) 不一定具有普适性，比如调节Intel CPU与其他品牌的CPU频率方法不同，不同系列CPU支持也不同，指令集也不同。

  ​	(3) 控制CPU频率需要程序较高的执行权限，比如root权限

  ​	(4) 当然并不能说这种思路完全不可行，Linux有 **cpufrequtils** 支持设置CPU的运行模式，其中有一种模式“userspace” ， 即用户自定义模式，供用户应用程序调节CPU运行频率，对这一思路感兴趣的同学可以尝试一下。

​	  (5) 最主要的原因是，当我们限制CPU频率为全速的50%时，CPU利用率会显示多少呢？也许此时，50%的频率又变成了CPU利用率的分母。

CPU利用率的计算公式：

RealTimeCPULoad=1-(RTCPUPerformance/CPUPerformanceBase)*100%。

  但如同不应该拿筷子喝粥一样，人不应该陷入一种思路而不自拔。




  ##### 思路2：控制运行与休眠时间比例

如果在一定时间范围内，控制程序运行与休眠时间的比例，也就控制了CPU的利用率。  

思路2的方式是可行的，且在短时间内是可以通过代码实现的。

比如我们在1秒内，让程序执行500毫秒，休眠500毫秒，则可以认为CPU的利用率为50%。

实现思路2，我们需要理清以下问题：

1. CPU利用率的统计周期是多久？是否有函数或方法可获取到CPU的周期数？
2. 如何让CPU “忙” 起来？
3. 如何让CPU “闲” 起来？
4. 多核心的CPU利用率统计规则？
5. 如何表达正弦曲线的X轴：时间？

### CPU利用率的统计周期

观察任务管理器，大致可推断出统计周期为1秒。实际在程序中需要通过不同的参数值来进行测试。


### 让CPU “忙” 起来
根据《编程之美》的叙述，当程序执行运算，做一些复杂操作，死循环等能够让CPU占用率上升。应该采用哪种方式呢？

根据解决思路，让CPU忙起来的时间段内，需要让CPU短暂利用率为100%。因此我们需要考察与测试，哪种方式能够让CPU的占用率达到100%。
感兴趣的同学可在稍后的程序中测试以下几种运算是否有差别：
(1) 计算MD5值
(2) 执行+1操作
(3) 执行空循环


### 让CPU “闲” 下来

类似C语言中的Sleep函数，Go中也有time.Sleep(time.Duration)函数，形参time.Duration表示休眠的时间段。

### 多核心的CPU利用率统计规则

假如CPU有两个核心，一个核心运行状态为100%利用率，另一个核心为空闲状态，CPU的利用率会使什么情况呢？

首先提出假设：Windows任务处理器的CPU占用率为多个核心的总占用率，即：N个核的CPU的占用率公式为：

    CPU占用率 = (Z_1 + Z_2 + ... + Z_N) / N

其中，Z_i表示第i个核的利用率。

在后续程序中，可通过配置不同的协程goroutine数目来测试如何达到理想目标。参考设置的值有1，2（内核数），4（逻辑处理器数量）。

### 如何表达X轴：时间

![e61190ef76c6a7ef00b9298bf7faaf51f2de6684.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48c9cc10bf9c451f89e8e80bd18aef7d~tplv-k3u1fbpfcp-watermark.image)

如图，正弦曲线如图所示。

正弦函数sin(X)的取值范围为区间[-1, 1]，CPU利用率区间为[0, 100%]，做一个sin(X) -> CPU利用率的映射，很容易得出：
                            CPU利用率 = (sin(x) + 1) / 2， 其中x为程序运行时间
任务管理器展示CPU占用率时间窗口为60秒，正弦函数一个周期为区间[0, 2π]，做 [0, 60] -> [0, 2π] 的映射；即随着时间从0~60秒变化，x的变化为0~2π；即通过设置x的每秒步长为2π/60 ≈ 0.1，则60秒的窗口可绘制一个完整的正弦曲线。
即程序运行x秒时，程序的利用率 y = ( sin(0.1x) + 1 )/ 2。

以下代码实现了CPU利用率呈现正弦函数：

```go

package main

import (
	"fmt"
	"math"
	"time"
)

func main() {
    // 通过设置不同的coreNum测试多核心CPU利用率
	coreNum := 4
	for i := 0; i < coreNum; i++ {
		go task(i)
	}
    // 通过等待输入实现main-goroutine不会终止
	a := ""
	fmt.Scan(&a)

}

func task(id int) {
	var j float64 = 0.0
    // 通过设置step来决定一个60秒的统计窗口展示几个正弦函数周期
    var step float64 = 0.1
	for j = 0.0; j < 8*2*math.Pi; j += step {
		compute(1000.0, math.Sin(j)/2.0+0.5, id)
	}
}

/**
* t 一个总的CPU利用率的统计周期，1000毫秒，感兴趣的可以测试一下时间段小于1000毫秒与大于1000毫秒的情况下曲线如何
* percent [0, 1], CPU利用率百分比
*/
func compute(t, percent float64, id int) {
	// t 总时间，转换为纳秒
	var r int64 = 1000 * 1000
	totalNanoTime := t * (float64)(r)               // 纳秒
	runtime := totalNanoTime * percent              // 纳秒
	sleeptime := totalNanoTime - runtime            // 纳秒
	starttime := time.Now().UnixNano()              // 当前的纳秒数
	d := time.Duration(sleeptime) * time.Nanosecond // 休眠时间
	fmt.Println("id:", id, ", totaltime = ", t, ", runtime = ", runtime, ", sleeptime = ", sleeptime, " sleep-duration=", d, ", nano = ", time.Now().UnixNano())
	for float64(time.Now().UnixNano())-float64(starttime) < runtime {
		// 此处易出错：只能用UnixNano而不能使用Now().Unix()
		// 因为Unix()的单位是秒，而整个运行周期
	}
	time.Sleep(d)
}

```

留几个问题给小伙伴们思考：

1. **compute函数中为什么要转换为纳秒？**

答↑：因为一个周期是1000毫秒，也就是1秒，你不能用秒级单位来执行循环。当然，也可以用Millisecond或者Microsecond，但是不能用秒，而我只找到了两个熟悉的函数，time.Now().UnixNano()，time.Now().Unix()，所以只能选用第一个纳秒，小伙们可以可以尝试一下用秒回有什么现象

2. **多个逻辑处理器，运行一段时间后，各个协程之间的执行进度不同了，这是为什么？如何保持同步？**
答↑：进度不同，1是可能受其他程序影响，2是各个核心的速度略有差异。可以通过在`compute`中传递从程序开始运行到当前时刻的时间差，而非传递1000毫秒来实现同步；或者使用其他同步方法

3. **让部分核心始终“闲”，让部分核心始终“忙”会有什么现象？循环中执行各种不同运算有何种差别？**

答↑：自行测试吧

4. **能否消除其他程序占用CPU的影响呢？**

答↑：**我不知道**。
尝试获取cpu利用率：`github/shirou/gopsutil/cpu`，并在每次进入`compute`函数时通过在原百分比percent中移除其他程序执行所占百分比，但是后来发现，受限于gopsutil/cpu获取CPU利用率的方法，`cpu.Percent(duration time.Duration, percpu bool)`获取cpu利用率方法本身就需要1秒，所以你会得到一个十分跳跃的曲线。我暂时没有找到其他方法。欢迎知道的小伙伴在评论去留言指教