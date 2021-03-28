---
title: Go语言力扣刷题-两数相加｜Go主题月
comments: true
date: 2021-03-24 12:11:59
categories: 后端
tags: Go
---



第一次编写Go链表指针，顺利通过编译，开森！！！

> #### [2. 两数相加](https://leetcode-cn.com/problems/add-two-numbers/)
>
> 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
>
> 请你将两个数相加，并以相同形式返回一个表示和的链表。
>
> 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
>
> ```
> 输入：l1 = [2,4,3], l2 = [5,6,4]
> 输出：[7,0,8]
> 解释：342 + 465 = 807.
> ```
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/add-two-numbers
> 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

首次编译通过的代码

```go
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    if l1 == nil {
        return l2
    }
    if l2 == nil {
        return l1
    }
    var head = new(ListNode)
    var movePoint = head
    head.Val = 0
    carry := 0
    l1point:=l1
    l2point:=l2
    for ; l1point != nil || l2point != nil;  {
        sum := 0
        if l1point != nil {
            sum += l1point.Val
        }
        if l2point != nil {
            sum += l2point.Val
        }
        sum += carry
        movePoint.Val = sum % 10
        carry = sum / 10
        movePoint.Next  = new(ListNode)
        movePoint = movePoint.Next
        
        l1point = l1point.Next
        l2point = l2point.Next
    } 
    if carry > 0 {
        movePoint.Val = carry
    } else {
        /*第一处: 假如链表节点依次为a->b->c->d，并且movePoint指向d，此时令movePoint=nil并不会将最后的接点移除，而应设c.Next = nil*/
        movePoint = nil
    }

    return head
}
```

遇到的问题：

1.  编译通过：嗯，第一次写go 链表，就编译通过，开森！
2.  测试用例未通过：[2,4,3] + [5,6,4]，正确结果应为 [7, 0, 8]，但运行结果为 [7, 0, 8, 0]，即代码标注的**第一处：链表去除节点方式错误**

新增tail节点，移动指针始终在tail节点的下一个节点，修正第一处错误后，代码如下：

```go
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    if l1 == nil {
        return l2
    }
    if l2 == nil {
        return l1
    }
    var head = new(ListNode)
    var movePoint = head
    var tail = head
    head.Val = 0
    carry := 0
    l1point:=l1
    l2point:=l2
    for ; l1point != nil || l2point != nil;  {
        sum := 0
        if l1point != nil {
            sum += l1point.Val
        }
        if l2point != nil {
            sum += l2point.Val
        }
        sum += carry
        movePoint.Val = sum % 10
        carry = sum / 10
        movePoint.Next  = new(ListNode)
        tail = movePoint
        movePoint = movePoint.Next

        /*第二处错误：当len(l1)与len(l2)不等时，必然报错*/
        l1point = l1point.Next
        l2point = l2point.Next
    } 
    if carry > 0 {
        movePoint.Val = carry
        tail = movePoint
    } else {
        tail.Next = nil
    }

    return head
}
```

测试用例OK，但提交运行报错：[9,9,9,9,9,9,9]+ [9,9,9,9]，报错信息如下：

```shell
**Line 38: panic: runtime error: invalid memory address or nil pointer dereference**
```

程序逻辑错误：循环的条件是两条所给的链表均不为空，因此**获取下一个节点时应判空**。或者在获取数值时就判空。二次修改后，代码如下：

```go
type ListNode struct {
    Val int
    Next *ListNode
}

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    if l1 == nil {
        return l2
    }
    if l2 == nil {
        return l1
    }
    var head = new(ListNode)
    var movePoint = head
    var tail = head
    head.Val = 0
    carry := 0
    l1point:=l1
    l2point:=l2
    for ; l1point != nil || l2point != nil;  {
        sum := 0
        if l1point != nil {
            sum += l1point.Val
            /*此处向后移动节点l1point*/
            l1point = l1point.Next
        }
        if l2point != nil {
            sum += l2point.Val
            /*此处向后移动节点l2point*/
            l2point = l2point.Next
        }
        sum += carry
        movePoint.Val = sum % 10
        carry = sum / 10
        movePoint.Next  = new(ListNode)
        tail = movePoint
        movePoint = movePoint.Next
    } 
    if carry > 0 {
        /*进位保留*/
        movePoint.Val = carry
        tail = movePoint
    } else {
        /*舍弃最后一个节点*/
        tail.Next = nil
    }
    return head
}
```



感觉代码略繁琐，经过查看Go的基础语法，将部分语句移动到for的初始化语句(init版块)与循环执行语句（post版块），修改后的最终版：

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    if l1 == nil {
        return l2
    }
    if l2 == nil {
        return l1
    }
    var head = new(ListNode)
    var movePoint = head
    var tail = head
    head.Val = 0
    carry := 0
    for l1point, l2point :=l1, l2; l1point != nil || l2point != nil; tail, movePoint = movePoint, movePoint.Next {
        sum := 0
        if l1point != nil {
            sum += l1point.Val
            l1point = l1point.Next
        }
        if l2point != nil {
            sum += l2point.Val
            l2point = l2point.Next
        }
        sum += carry
        movePoint.Val = sum % 10
        carry = sum / 10
        movePoint.Next  = new(ListNode)
    } 
    if carry > 0 {
        movePoint.Val = carry
        tail = movePoint
    } else {
        tail.Next = nil
    }

    return head
}
```



