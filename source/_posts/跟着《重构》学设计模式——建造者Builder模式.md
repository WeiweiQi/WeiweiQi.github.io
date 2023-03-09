---
title: 跟着《重构》学设计模式———建造者Builder模式
comments: true
date: 2022-08-09 15:19:36
categories:
tags:
---



## 意图

将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

## 适用性

当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时。

当构造过程必须允许被构造对象有不同的表示时。

## UML

![image-20220809155520533](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220809155520533.png)

## 效果

它使你可以改变一个产品的内部表示

它将构造代码和表示代码分开

它使你可对构造过程进行更精细的控制

## 链式调用Builder模式

我们更常用的起始是原始Builder模式的链式调用Builder模式。比如gson使用中的创建一个Gson对象：

```java
Gson gson = new GsonBuilder()
			.setDateFormat("yyyy-MM-dd HH:mm:ss")
			.serializeNulls()
			.create();
```

## 链式调用Builder实现

```java
package com.builder;

/**
 * @author qww
 * 2022/8/13 11:06
 * 参考链接：https://blog.csdn.net/qq_37334150/article/details/122698906
 */
public class Man {
    private final String name;
    private final String head;
    private final String hand;
    private String computer;
    private String phone;
    private String book;

    //必选构建属性
    public Man(Builder builder){
        this.name = builder.name;
        this.head = builder.head;
        this.hand = builder.hand;
    }

    public static class Builder{
        private String name;
        private String head;
        private String hand;
        private String computer;
        private String phone;
        private String book;

        public Builder(String name , String head , String hand){
            this.name = name;
            this.head = head;
            this.hand = hand;
        }

        //将属性作为步骤
        public Builder setComputer(String computer) {
            this.computer = computer;
            return this;
        }

        public Builder setPhone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder setBook(String book) {
            this.book = book;
            return this;
        }

        //定义build方法最终返回，属性步骤后的结果
        public Man  build(){
            return new Man(this);
        }

    }

    public static void main(String[] args) {
        Man man = new Man.Builder("cbry" , "Smart Brain" , "Nimble Hand")
                .setBook("effective java")
                .setPhone("MEIZU")
                .setComputer("Dell")
                .build();
    }
}


```



