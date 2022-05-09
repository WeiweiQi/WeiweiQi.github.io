---
title: Go语言力扣刷题-最接近的三数之和｜Go主题月
comments: true
date: 2021-04-09 14:51:30
categories: 后端
tags: Go
---

> #### [16. 最接近的三数之和](https://leetcode-cn.com/problems/3sum-closest/)
>
> 给定一个包括 n 个整数的数组 nums 和 一个目标值 target。找出 nums 中的三个整数，使得它们的和与 target 最接近。返回这三个数的和。假定每组输入只存在唯一答案。
>
> ```
> 输入：nums = [-1,2,1,-4], target = 1
> 输出：2
> 解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
> ```
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/3sum-closest
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

直接做这种近似的题目，我是比较虚的，还好，我们有[第15题](https://juejin.cn/post/6948962786378514440)的经验。

第15题三数之和为0的策略是：**对数组进行从小到大排序，对于每个元素，使用双指针查找此元素后是否有两个元素与它之和为0**。

因此，对于本题，我们修改为：**对数组进行从小到大排序，对于每个元素，使用双指针查找此元素后两个元素与它之和与target之差的绝对值最小**。

涉及到Go的小知识：

1. math包： Go中的数学工具包

   [math包](https://golang.google.cn/pkg/math) 是Go中的数学工具包，包括一些常用常量与数学函数，常量包括π，自然对数e，最大最小整数，绝对值函数，求sin/cos/tan/log函数等，如：

   ```go
   const (
       MaxInt8   = 1<<7 - 1
       MinInt8   = -1 << 7
       MaxInt16  = 1<<15 - 1
       MinInt16  = -1 << 15
       MaxInt32  = 1<<31 - 1
       MinInt32  = -1 << 31
       MaxInt64  = 1<<63 - 1
       MinInt64  = -1 << 63
       MaxUint8  = 1<<8 - 1
       MaxUint16 = 1<<16 - 1
       MaxUint32 = 1<<32 - 1
       MaxUint64 = 1<<64 - 1
   )
   ```

   我们之前是如何定义最大32位整数的呢：

   ```go
   const MAX_UINT32 = ^uint32(0)
   const MIN_UINT32 = 0
   // 最大无符号去掉符号位
   const MAX_INT32 = int(MAX_UINT32 >> 1)
   const MIN_INT32 = - MAX_INT32 - 1
   ```

   本题我们使用到了math中的32位最大整数，以及求绝对值的函数

2. sort对于数组排序的快捷用法：

   除第15题中，我们提到的sort.slice(slice []type, func)外，还有sort.Ints(x []int), sort.Float64(x []float64)等对数组便捷正序排序的函数。

回到题目上，容易出错的地方在

1. 使用math.Abs函数，该函数是针对类型float64的，所以传参与返回参数均需要显式类型转换。
2. 要看清题目最后返回的，并不是最小差距，而是三者之和

```go
func threeSumClosest(nums []int, target int) int {
	result := 0
	distance := math.MaxInt32
	sort.Ints(nums)
	// fmt.Println(nums)
	for i := 0; i < len(nums); i++ {
		l := i+1
		r := len(nums) - 1

		for l < r {
			sum := nums[i] + nums[l] + nums[r]
			temp := sum - target
			if temp == 0 {
				return sum
			}
			// fmt.Printf("%d, %d,  %d\n", nums[i], nums[l], nums[r])
			// fmt.Printf("a[%d] + a[%d] + a[%d] = %d, temp = %d\n", i, l, r, nums[i] + nums[l] + nums[r], temp)
			// math.Abs: func Abs(x float64) float64 参数与返回值均为float64，所以需要做显示类型转换
			tempAbs := int(math.Abs(float64(temp)))
			// fmt.Println(tempAbs)
			if tempAbs < distance {
				distance = tempAbs
				result = sum
				// fmt.Printf("after change, distance = %d, result = %d\n", distance, result)
			}
			if temp > 0 {
				r --
			}
			if temp < 0 {
				l ++
			}
		}
	}
	return result
}
```

