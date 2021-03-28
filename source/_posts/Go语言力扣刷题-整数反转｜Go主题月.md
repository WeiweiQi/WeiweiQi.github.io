---
title: Go语言力扣刷题-整数反转｜Go主题月
comments: true
date: 2021-03-28 11:47:46
categories: 后端
tags: Go
---



> 整数反转
>
> 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
>
> 如果反转后整数超过 32 位的有符号整数的范围 :
> $$
> [-2^{31}, 2^{31}-1]
> $$
> ，就返回0.假设环境不允许存储 64 位整数（有符号或无符号）。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/reverse-integer
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



若用Go解决此问题，则我们需要知道：

1. Go求余数的运算符"**%**"与除法运算符"**/**"的区别。

2. Go中表示的整数的类型有哪些？

   Go中有int8， int16，int32，int64，显然，本题我们使用int32。经测试int32在计算2^31时会溢出。

   那么我们常用的不指定bit数的int是多少位的呢？[官方文档](https://golang.google.cn/ref/spec#Numeric_types)中，这是这样解释的：

   ```shell
   uint8       the set of all unsigned  8-bit integers (0 to 255)
   uint16      the set of all unsigned 16-bit integers (0 to 65535)
   uint32      the set of all unsigned 32-bit integers (0 to 4294967295)
   uint64      the set of all unsigned 64-bit integers (0 to 18446744073709551615)
   
   int8        the set of all signed  8-bit integers (-128 to 127)
   int16       the set of all signed 16-bit integers (-32768 to 32767)
   int32       the set of all signed 32-bit integers (-2147483648 to 2147483647)
   int64       the set of all signed 64-bit integers (-9223372036854775808 to 9223372036854775807)
   
   uint     either 32 or 64 bits
   int      same size as uint
   
   Explicit conversions are required when different numeric types are mixed in an expression or assignment. For instance, int32 and int are not the same type even though they may have the same size on a particular architecture.
   直译为：一个表达式或赋值中混合了不同数字类型时，需要显式类型转换。如int与int32尽管在某些特定的体系结构中具有相同的(占位)大小，它们也不是同一种类型，仍然需要显式类型转换。
   ```

3. Go中的数学包是哪个？如何表示两个极端的数字-2^31 与 2^31-1 呢？

   Go中的数学包是math: 

   `import math`

   math中表示x的y次方为：math.Pow(x, y)， 但是函数的定时为：`func Pow(x, y float64) float64`。即函数表示的是float64类型的运算。

   Go中并没有类似C语言的可以直接使用的INT_MAX，或者类似Java的Integer.MAX_INT的值，需要自己定义，这就又引出了Go中另一个知识：常量

4. 常量const：

   `const identifier [type] = value`

   有过前端开发经验的应该对这个词不会陌生。常量，按照定义，也自然是不可修改的。

   

   基础测试：

```go
package main
import "fmt"
const MAX_UINT32 = ^uint32(0)
const MIN_UINT32 = 0
// 最大无符号去掉符号位
const MAX_INT32 = int32(MAX_UINT32 >> 1)
const MIN_INT32 = - MAX_INT32 - 1

func main() {
  var s int = 1024*1024*1024*2*2
  fmt.Println(s) // 输出为4294967296，未溢出
  var s32 int32 = 1024 // 2^10
  fmt.Println(s32*s32*s32*2) // 2^32, 输出为-2147483648，溢出
  fmt.Println(MAX_INT32) // 2147483647, 未溢出
  fmt.Println(MIN_INT32) // -2147483648，未溢出
}
```



回到题目，我们求解算法为：依次弹出最高位数字，相加求和。

```
... result ....
popNum = popNum % 10 // 弹出高位数字
x = x / 10 // 剩余数字
result = result * 10 + popNum
```

**问题的关键在于如何判断溢出**：即如何判断`result*10 + popNum`是否溢出：因为我们知道最大数字为2147483647，所以分为两种情况，当popNum大于7和popNum<=7。同理，最小数为-2147483648，分popNum<-8和popNum>=-8来考虑。完整代码如下：

```go
func reverse(x int) int {
    const MAX_UINT32 = ^uint32(0)
	const MIN_UINT32 = 0
	// 最大无符号去掉符号位
	const MAX_INT32 = int(MAX_UINT32 >> 1)
	const MIN_INT32 = - MAX_INT32 - 1
	
	var result int = 0
	for ; x != 0; {
		popNum := x % 10
		x = x / 10
        // 一开始想类似java一样，希望格式化一些，每个||符号之前换行的，结果报错了。
		if (result > MAX_INT32/10) || (result == MAX_INT32/10 && popNum > 7) || (result < MIN_INT32/10) || (result == MIN_INT32/10 && popNum < -8) {
			return 0
		}
		result = result * 10 + popNum
	}
	return result
}
```




------

Go语言力扣刷题系列文章 ｜Go主题月

1. [Go语言力扣刷题-两数之和｜Go主题月](https://juejin.cn/post/6942846978107637767)
2. [Go语言力扣刷题-两数相加｜Go主题月](https://juejin.cn/post/6943102071000268814)
3. [Go语言力扣刷题-无重复字符的最长子串｜Go主题月](https://juejin.cn/post/6943487306988797982)
4. [Go语言力扣刷题-寻找两个正序数组的中位数｜Go主题月](https://juejin.cn/post/6943845806420000782)
5. [Go语言力扣刷题-最长回文子串｜Go主题月](https://juejin.cn/post/6944506513834639368)
6. [Go语言力扣刷题-Z字形变换｜Go主题月]()