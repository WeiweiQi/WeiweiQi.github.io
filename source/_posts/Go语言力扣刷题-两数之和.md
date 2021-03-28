---
title: Go语言力扣刷题-两数之和｜Go主题月
comments: true
date: 2021-03-23 15:18:36
categories:
tags: 后端-Go
---





原发于掘金：https://juejin.cn/post/6942846978107637767

编程语言是写给计算机的语言，一定与人类之间的语言有些许的共通之处，也都将是一项未来生活必不可少的基本技能。

快速学习一项技能的几个关键点：

1. 明确的目标：切实可行的驱动。
2. 快速获得反馈： 知道自己做的对或者不对，及时纠正。
3. 创造深的理解：能够使用或者进行说明。
4. 高强度的学习：刻意练习与广泛练习。

刷题学语言正有这样的特点：

1. 明确、清晰而无歧义的问题，即实现目标。
2. 在线或本地的编译器，清晰的编译错误或测试用例错误，便于及时纠正语法、程序逻辑错误。
3. 题目一般有一定难度，需要深刻的理解。
4. 力扣题目经典，值得去做这样的练习，仅仅是思维练习也是有很多好处的。

当然，在刷题之前过一遍Go的基础语法还是很有必要的。

从最简单的题目出发：

> #### [1. 两数之和](https://leetcode-cn.com/problems/two-sum/)
>
> 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。
>
> 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
>
> 你可以按任意顺序返回答案。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/two-sum
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

结题思路是：**通过（值->索引）的映射表，来快速查找是否存在目标值。**

我的Go首次执行：当然编译没有通过o(╥﹏╥)o

```Go
func twoSum(nums []int, target int) []int {
    var numsMap map[int]int
    for i:=0; i <= len(nums); i++ {
        val, ok := numsMap[target - nums[i]]
        if (ok) {
            return {i, val}
        }
        numsMap[nums[i]] = i
    }
    return nil
}
```

这里面有几个错误：

1. go中map需要初始化才可以使用

2. 返回的数组不能这样写

   ```
   {i, val}
   ```

3. 当然，最后返回nil还是空数组也纠结了好久

修正后的代码：

```go
func twoSum(nums []int, target int) []int {
    numsMap := make(map[int]int)
    for i:=0; i <= len(nums); i++ {
        val, ok := numsMap[target - nums[i]]
        if (ok) {
            return []int{i, val}
        }
        numsMap[nums[i]] = i
    }
    return nil
}
```



进一步，使用range的语法修改后：

```go
func twoSum(nums []int, target int) []int {
    numsMap := make(map[int]int)
    for index, value := range nums {
        val, ok := numsMap[target - value]
        if (ok) {
            return []int{index, val}
        }
        numsMap[nums[index]] = index
    }
    return nil
}
```



涉及Go知识：数组，集合map，range， nil等用法。