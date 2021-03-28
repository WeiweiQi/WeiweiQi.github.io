---
title: Go语言力扣刷题-寻找两个正序数组的中位数｜Go主题月
comments: true
date: 2021-03-25 17:58:56
categories:	后端
tags: Go
---



> #### [4. 寻找两个正序数组的中位数](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)
>
> 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
>
> 示例 1：
>
> 输入：nums1 = [1,3], nums2 = [2]
> 输出：2.00000
> 解释：合并数组 = [1,2,3] ，中位数 2
>
> 示例 2：
>
> 输入：nums1 = [1,2], nums2 = [3,4]
> 输出：2.50000
> 解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/median-of-two-sorted-arrays
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



本题对Go语言来说，主要用到Go语言数组的知识：

1. 数组的声明与初始化

   ```go
   // 声明一个数组arr
   var arr [3] int
   arr := []int{1,2,3}
   ```

2. 访问数组元素，与C语言十分类似。

   ```go
   b := arr[1]
   ```

3. 函数中使用数组：

   这一点和之前学习的略有不同，Go语言中，[2]int 与 []int 类型是不同的，也就是说，当形参为[]int时，传递类型为[2]int的数组是无法编译通过的。例如下面代码是**不合法**的：

   ```go
   package main
   
   func main()  {
   	var arr [3] int
   	arr2 := []int{1,2,3}
       // 错误：cannot use arr (type [3]int) as type []int in argument to printArray1
   	printArray1(arr)
       // 错误：cannot use arr2 (type []int) as type [3]int in argument to printArray2
       printArray2(arr2)
   }
   
   func printArray1(arr []int) {
   	for _, v := range arr {
   		println(v)
   	}
   }
   func printArray2(arr [3]int) {
   	for _, v := range arr {
   		println(v)
   	}
   }
   ```

4. 动态长度数组

   ```go
   length := 3
   arr := make([]int, length)
   ```

   

回到题目上，我们使用4中方法来求解。

###### 解法1： 快速合并两个正序数组，然后求合并后数组的中位数。

```go
/**
* 解法1： 通过两个下标p1, p2，快速将两个数组合并为一个长度为(m+n)的大数组；
	若(m+n)为奇数，则下标(m+n)/2位置数即为中位数；
	若(m+n)为偶数，则下标(m+n)/2 - 1与(m+n)/2的平均数为中位数
*/
func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	mergeArray := mergeArray(nums1, nums2)
	for _, v := range mergeArray {
		println(v)
	}
	length := len(mergeArray)
	if length % 2 == 0 {
		// 偶数
		return float64((mergeArray[length/2-1] + mergeArray[length/2]))/2
	} else {
		// 奇数
		return float64(mergeArray[length/2])
	}

}

/**
* 合并字符串
*/
func mergeArray(nums1 []int, nums2 []int) []int {
	length1 := len(nums1)
	length2 := len(nums2)
	// 错误1：non-constant array bound length1 + length2
	// 原代码： mergeArray := [length1 + length2]int
	mergeArray := make([]int, length1 + length2)
	mergeArrayP := 0
	p1 := 0
	p2 := 0
	for ; p1 < length1 || p2 < length2 ; {
		if p1 >= length1 {
			mergeArray[mergeArrayP] = nums2[p2]
			p2++
			mergeArrayP ++
			continue
		}

		if p2 >= length1 {
			mergeArray[mergeArrayP] = nums1[p1]
			p1++
			mergeArrayP ++
			continue
		}

		if nums1[p1] < nums2[p2] {
			mergeArray[mergeArrayP] = nums1[p1]
			p1 ++
			mergeArrayP ++
		} else {
			mergeArray[mergeArrayP] = nums2[p2]
			p2 ++
			mergeArrayP ++
		}
	}
	return mergeArray
}
```

解法2：不合并数组，仅通过两个数组的指针移动。与解法1十分类似，此处便不写代码了。

解法3：将题目理解为“**寻找两个有序数组中的第k小的数，其中 k 为 (m+n)/2(m+n)/2 或 (m+n)/2+1**”

解法4：划分数组，这算是一种通过数学方法来降低时间控件复杂度的方法了。详解见力扣官网。

------

Go语言力扣刷题系列文章 ｜Go主题月

1. [Go语言力扣刷题-两数之和｜Go主题月](https://juejin.cn/post/6942846978107637767)

2. [Go语言力扣刷题-两数相加｜Go主题月](https://juejin.cn/post/6943102071000268814)

3. [Go语言力扣刷题-无重复字符的最长子串｜Go主题月](https://juejin.cn/post/6943487306988797982)

4. [Go语言力扣刷题-寻找两个正序数组的中位数｜Go主题月](https://juejin.cn/post/6943845806420000782)