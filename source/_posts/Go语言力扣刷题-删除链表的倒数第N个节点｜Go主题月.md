---
title: Go语言力扣刷题-删除链表的倒数第N个节点｜Go主题月
comments: true
date: 2021-04-15 14:22:40
categories: 后端
tags: Go
---

> #### [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)
>
> 给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。
>
> **进阶：**你能尝试使用一趟扫描实现吗？

这个算是很经典的一道双指针题目了。目前为止我们见过的双指针题目包括：

第11题“盛最多水的容器”，以及第15题“三数之和”。第11题与第15题均属于通过双指针来**快速缩小搜索范围**。

本题算是双指针在链表上的基本操作了。

记得研究生面试的时候遇到过一个双指针问题，大概是判断一个链表有没有环的问题，当时没答出来，所以对链表的双指针印象深刻。

其实能想起使用双指针，这题就算解决了一半了。

本题涉及到Go的知识：

1. 自定义类型

   "结构？对象？"，whatever

   (1) 如何初始化：

   ```go
   type ListNode struct {
   	Val int
   	Next *ListNode
   }
   
   head := ListNode{13, nil}
   h := new(ListNode) // 返回的即是一个指针
   // head := make(ListNode, 1) // 编译不通过
   h1 := ListNode{Val: 14, Next: &ListNode{15, nil}}
   
   ```

   注意的是：**&ListNode 低层仍然会调用new(ListNode)**

   (2) 如何使用或取值：与Java, C类似，使用‘.’取值即可。

2. 指针

   这一个算是在测试的时候发现的，关键字**new返回的是结构体的指针**。

   指针与结构体的测试代码如下：

```go
func main()  {
	i := 12
	myprint(&i)

	// head := make(ListNode, 1) // 编译不通过
	head := ListNode{13, nil}
	myprintListNode(&head)

	h := new(ListNode) // 返回的即是一个指针
	h.Val = 14
	myprintListNode(h)

	h1 := ListNode{Val: 14, Next: &ListNode{15, nil}}
	myprintListNode(&h1)

	// &ListNode 低层仍然会调用new(ListNode)
}

func myprint(p *int) {
	fmt.Println("&p值为：", &p) // 0xc000154018
	fmt.Println("p值为：", p)   // 0xc000128058
	fmt.Println("*p值为：", *p) // 12 
}

func myprintListNode(listnode *ListNode)  {
	fmt.Println("&listNode值为：", &listnode) // 0xc000006040
	fmt.Println("listNode值为：", listnode)   // &{13 <nil>}
	fmt.Println("*listNode值为：", *listnode) // {13 <nil>}
}
```

回到题目上：

易错点：

(1) 链表有可能删除head节点，因此额外添加一个节点（你要抬杠不用添加当然也可以，但是需要额外的判断，判断链表为空并且判断链表的长度为n时的情况）

(2) 测试打印链表，其实如何初始化测试这个我有点疑虑，不知道如何快速初始化一个接口链表。除了for循环，想来没有方便的办法。

```go
package main

import "fmt"

func main() {
	h := new(ListNode)
	p := h
	for i := 1; i<6; i++ {
		temp := new(ListNode)
		temp.Val = i
		p.Next = temp
		p = p.Next
	}
	printList(h.Next)
	fmt.Println("-------")
	ll := removeNthFromEnd(h.Next, 2)
	printList(ll)
}

// 打印链表
func printList(head *ListNode) {
	for i := head; i != nil; i = i.Next {
		fmt.Println(i.Val)
	}
}

type ListNode struct {
	Val int
	Next *ListNode
}

/**
* 基本策略：双指针，两个指针的间隔为n+1，当后一个指针遍历到链表尾部时，则前一个指针的后面一个元素就是到处第n个元素
*/
func removeNthFromEnd(head *ListNode, n int) *ListNode {
	if head == nil {
		return head
	}

	/**
	* 最初没有设想到head被删除的所有情况，只想到n=1与链表长度为1的情况,
	* head被删除的所有情况是：链表长度为n
	* 在开始纠结了好久删除head的情况：其实额外添加一个节点能让问题简化
	*/
	h := new(ListNode)
	h.Next = head

	/**
	* 初始化
	*/
	p, tail := h, head
	/**
	* 之所以将i不作为临时变量，是通过判断i与tail，判断在tail指针移动n步的过程中，是先tail为空，还是i先为n
	*/
	i := 0
	for ; i < n && tail != nil; i++ {
		tail = tail.Next
	}
	if tail == nil && i == n {
		// 即链表长度为n
		return head.Next
	} else if tail == nil && i < n {
		// 链表长度大于n
		return head
	}

	/**
	* 这里的问题:循环终止条件应该是到了尾部
	*/
	for tail != nil  {
		tail = tail.Next
		p = p.Next	
	}

	// 移除p的下一个节点
	p.Next = p.Next.Next
	
	return h.Next
}
```



总结：

1. 链表head之前添加一个节点会方便许多，包括方便初始化与边界条件

