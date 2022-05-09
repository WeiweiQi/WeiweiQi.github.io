---
title: Go语言力扣刷题-三数之和｜Go主题月
comments: true
date: 2021-04-08 14:22:02
categories: 后端
tags: Go
---

> #### [15. 三数之和](https://leetcode-cn.com/problems/3sum/)
>
> 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
>
> 注意：答案中不可以包含重复的三元组。
>
> ```
> 输入：nums = [-1,0,1,2,-1,-4]
> 输出：[[-1,-1,2],[-1,0,1]]
> ```
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/3sum
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



1. Go中的包-sort

   [sort包官网](https://golang.org/pkg/sort/)

   talk is cheap， show me the code，先看最基础的代码示例：

   ```go
   import (
   	"fmt"
   	"sort" // 需引入包
   )
   
   a := []int{-1,0,1,2,-1,-4}
   sort.Slice(a, func (i, j int) bool  { // 最基础的使用方式
   	return a[i] < a[j]
   })
   fmt.Println(a)
   ```

   熟悉Java排序的小伙伴应该不会陌生，使用方式与Java中的Collection.sort类似，第二参数为func，定义数组元素之间的大小关系。因此，Go也可以对**结构**体数组进行排序。

2. 结构体 struct：

   有C语言基础与面向对象基础的开发者应该很容易理解，比如我们可以将一个“人”包装为一个结构体：

   定义：

   ```go
   type Person struct {
   	name string
   	age int
   }
   ```

   初始化：

   ```go
   p := Person{"kevinQ", 30}
   fmt.Println(p) // {kevinQ 30}
   p2 := Person{name: "kevinQw"}
   fmt.Println(p2) // {kevinQw 0}
   ```

   结构体的使用：

   ```go
   p.age = 20
   fmt.Println(p) // {kevinQ 20}
   ```

   sort如何对结构体数组进行排序呢，比如如何按照年龄对人员进行排序：

   ```go
   type SortByAge []Person
   func (array SortByAge) Len() int           { return len(array) }
   func (array SortByAge) Swap(i, j int)      { array[i], array[j] = array[j], array[i] }
   func (array SortByAge) Less(i, j int) bool { return array[i].age < array[j].age }
   
   func main()  {
   	p := Person{"old", 30}
   	// fmt.Println(p)
   	p2 := Person{name: "young", age: 20}
   	pArray := []Person{p, p2}
   	fmt.Println(pArray) // [{old 30} {young 20}]
   
   	sort.Sort(SortByAge(pArray))
   	fmt.Println(pArray) // [{young 20} {old 30}]
   }
   ```

   sort[官方示例](https://golang.org/pkg/sort/)中还有另外三种包括SortKeys, SortMutiKeys, SortWrapper技术，以及各个方法示例，建议大家多code几遍，理解一下。

3. append：添加元素

   append[官方](https://golang.org/pkg/builtin/#append)解释：给切片添加元素。

   ```go
   slice = append(slice, elem1, elem2)
   slice = append(slice, anotherSlice...)
   slice = append([]byte("hello "), "world"...)
   ```

   

回到题目上，我们采用的策略是，**对数组进行从小到大排序，对于每个元素，使用双指针查找此元素后是否有两个元素与它之和为0**。

```go
import "sort"

func threeSum(nums []int) [][]int {
	result := make([][]int, 0)
	if nums == nil || len(nums) < 3 {
		return result
	}
	// 排序，后来查看答案可以更简便的使用sort.Ints
	sort.Slice(nums, func (i, j int) bool  {
		return nums[i] < nums[j]
	})
	// fmt.Println(nums)
	for i := 0; i < len(nums); i++ {
		if nums[i] > 0 {
			break
		}
		if i > 0 && nums[i] == nums[i-1] {
			// 下一个数字与此数字相同
			continue
		}
		// fmt.Printf("正在检查：a[%d]= %d\n", i, nums[i])
		// fmt.Printf
		l := i+1
		r := len(nums) - 1
		// fmt.Printf("l = %d, r = %d, a[l] = %d, a[r] = %d\n", l, r, nums[l], nums[r])
		for l < r {
			sum := nums[i] + nums[l] + nums[r]
			if sum == 0 {
				temp := []int{nums[i], nums[l], nums[r]}
				result = append(result, temp)
				// 查找下一个
				for l < r && nums[l] == nums[l+1] {
					l ++
				}
				l ++
				for l < r && nums[r] == nums[r-1] {
					r --
				}
				r --
			}
			if sum > 0 {
				r --
			}
			if sum < 0 {
				l ++
			}
			
		}
	}
	return result
}
```

