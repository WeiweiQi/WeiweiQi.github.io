---
title: Java注解的执行器
comments: true
date: 2022-04-19 21:41:18
categories:
tags:
---



## 问题起源

最近我们在研究注解，由注解引入，我们“被迫"去学习Java中的反射，反射学习的差不多了，我们再回过头来看看如何去处理注解。

今天，我们先说一下注解学习过程中的一点收获：注解，仅仅只是标注，具体让程序怎么理解注解，仍然需要我们自己来实现。

为了让问题和结论更清晰，我们来自己实现一个注解。

## 自定义注解

我们首先使用`@interface`定义了一个注解：我们内心给予这个注解的含义是，定义在类中属性域上，其值value表示转换为字符串时的名称，然而注解定义不包括执行解释，但从定义上看不到任何执行逻辑。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface SpName {
    public String value() default "";
}
```

重点在于注解的使用与执行：如下，我们定义了一个类`Animal`，其中给一个属性`name`标注了注解`@SpName("animal-name")`，然后，我们在其中toString方法中来解释注解，如下所示：

```java
package com.qw.anno;

import com.jfinal.kit.LogKit;

import java.lang.reflect.Field;

public class Animal {

    @SpName("animal-name")
    public String name;
    public int age;

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder();
        for (Field field: this.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                if (field.isAnnotationPresent(SpName.class)) {
                    String annotationValue = field.getAnnotation(SpName.class).value();
                    result.append(annotationValue).append(":").append(field.get(this)).append(";");
                } else {
                    result.append(field.getName()).append(":").append(field.get(this)).append(";");
                }
            } catch (IllegalAccessException e) {
                System.out.println("异常");
            }
        }
        return result.toString();
    }
}

```

代码编写完后，我们先来验证一下程序：

```java
Animal animal = new Animal();
animal.age = 15;
animal.name = "牛牛";
System.out.println(animal.toString());
```

执行结果：

```java
animal-name:牛牛;age:15;
```

成功执行！

## 关键代码

获得注解执行的关键代码在于，通过反射获取到类中所有的域：

```java
for (Field field: this.getClass().getDeclaredFields()) 
```

以及，遍历域的过程中，判断当前域是否被添加了`SpName`注解：

```java
if (field.isAnnotationPresent(SpName.class)) {
    ....
}
```

而获取注解的值的代码为：

```java
String annotationValue = field.getAnnotation(SpName.class).value();
```

如此，我们便能够按照自定义的方式来解释执行注解，从而达到自定义注解的方式。

## 我所一直纠结的地方

其实，我心理一直想要的注解形式是如下的形式：

```java
@BeforeOrAfterAction("")
public void method() {
    ....
}
```

其中，注解`BeforeOrAfterAction`表示在函数执行前后做某些指定工作，比如做方法执行的权限检查等等。其实在慢慢寻找答案的过程中，我们发现，这个问题并不属于注解的解决范畴，而确切的说法是AOP：面向切面编程来实现这种思路，常见的包括Spring AOP，以及各个程序中见到的拦截器都是这种实现思路。