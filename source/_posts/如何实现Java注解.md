---
title: 如何实现Java注解
comments: true
date: 2022-04-16 18:55:22
categories:
tags:
---



## 问题起源

最近在学习shiro，shiro中一个很便利很优雅的地方便是可以给方法添加注解，以便控制当前接口内部是否能够被当前登录用户访问。

shiro控制样例代码如下：

```java
	@RequiresPermissions("all")
	public void test() {
		renderText("测试");
	}
```

这行代码的作用是：限制只有拥有all权限的用户才可以访问该接口，否则会抛出异常。

那么问题来了，如何实现Java中非常优雅的注解这种形式呢？

## 注解的实现原理

注解的实现是基于反射原理的。

> Talk is Cheap, Show me your Code!

## 一个注解的实现过程

下面我们将逐步尝试实现一个我们自己的注解，比如我们叫它MyAnno，他的作用就是在其注解的方法执行前输出一段指定的文字。

实现注解，首先需要有一个被标记为@interface的接口。

```java
public @interface MyAnno {

}
```

在Java中还有四种注解被称为元注解，即Java库帮助我们实现的注解，分别有`Target`， `Retention`，`Documented`，`Inherited `

分别表示：

### @Target 

修改其他注解类，标注当前注解会被用在什么地方，使用样例如：`@Target({ElementType.TYPE, ElementType.METHOD})`。括号中可选的参数可以参考`java.lang.annotation.ElementType`，我们说几个例子：

`ElementType.TYPE`：表示类注解，类型注解
`ElementType.FIELD`：字段注解
`ElementType.METHOD`：方法注解
`ElementType.PARAMETER`：参数注解
`ElementType.CONSTRUCTOR`：构造方法注解
`ElementType.LOCAL_VARIABLE`：局部变量注解
`ElementType.ANNOTATION_TYPE`：注解的注解
`ElementType.PACKAGE`：包注解

比如，我们准备定义的MyAnno为方法注解，则有：

```java
@Target(ElementType.METHOD)
public @interface MyAnno {
    
}
```

### @Rentention

表示当前注解的运行状态，可取值参见`java.lang.annotation.RetentionPolicy`：

`RetentionPolicy.SOURCE`：其注释为将被编译器丢弃，只在源码运行；

`RetentionPolicy.CLASS`：编译类文件是运行；

`RetentionPolicy.RUNTIME`：运行时运行。

比如，我们定义的MyAnno，需要添加代码如下：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyAnno {

}
```

### @Documented

该注解为生成说明文档，添加类的解释，不多说，我们暂且略过。

### @Inherited

表示允许子类继承父类中的继承，我们也暂且略过。

到这里我们的注解就定义完了。我们来尝试使用以下，仅仅是使用，还没到运行的时候。

```java
public class TestAnno {

    @MyAnno
    public void testAnno() {
        System.out.println("testAnno方法内部");
    }

    public static void main(String[] args) {
        new TestAnno().testAnno();
    }
}
```

这段代码可以编译通过，没有报错，并且执行也没有问题，当然，现在我们的注解还没有添加动作。

那么，怎么给注解添加指定动作呢？

## 最最关键的内容：注解执行器

注解执行器才是注解中最关键的内容，上面的代码仅仅是告诉我们，告诉编译器与jvm，这个方法被我们标记了。但是具体怎么执行，还是要看注解执行器的。但是执行器设计到反射，复杂的执行器还涉及到AOP编程，我们慢慢展开来讲。













