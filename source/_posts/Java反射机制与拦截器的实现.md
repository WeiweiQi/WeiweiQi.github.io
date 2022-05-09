---
title: Java反射机制
comments: true
abbrlink: 304d
date: 2019-01-09 20:43:36
categories: java
tags:
---

## 问题起源

在Java中一个很便利的东西就是注解，而注解中最最核心就是注解执行器，而理解注解执行器就涉及到Java的反射原理。

为此，我们来通过简单的程序来了解Java反射是如何应用的。

## JDK中的反射包

Java是静态语言，但是Java的反射原理使得Java具有的动态性。

使用Java的反射，不需要引入任何额外的jar包或者是maven依赖，在其基本的JDK中就有，其路径为：`com.lang.reflect`。

## 反射的基本形式

如下所示，有一个简单的类：`Student`

```java
package com.qw.reflect;
public class Student {
    private String name;
    private int age;
}
```

我们现在通过反射获取其内部属性，并打印名称，程序如下：

```java
public static void main(String[] args) {
        Object s = new Student();
        Field[] fields = s.getClass().getDeclaredFields();
        for (Field f : fields) {
            System.out.println(f.getName());
        }
    }
```

而且，特别需要注意到的是，上述代码中，我们声明的参数`s`是一个父类型`Object`，还不是子类型。当然，设置`s`为子类型的时候也可以获取到。

## 反射中常用的类：

### `com.lang.reflect.Class`

先来熟悉一下反射中常用的方法：如获取类的全名，通过反射创建类的对象等等。

```java
Object o = new Student();
Class<?> clazz = o.getClass();
System.out.println(clazz.getName());
System.out.println(clazz.getSimpleName());
System.out.println(clazz.getCanonicalName());
System.out.println(clazz.getTypeName());
```

最终的输出结果为：

```shell
com.qw.reflect.Student
Student
com.qw.reflect.Student
com.qw.reflect.Student
```

`getSimpleName`返回了最简单的类名，而其他方法返回的均为包含“包”路径的类名，专业名称为：“完全限定类名”。

反过来，知道了类的完整类名，我们能否创建类的对象呢？方式如下所示：

```java
Class<?> clazz1 = Class.forName("com.qw.reflect.Student");
System.out.println(clazz1.getName());
System.out.println(clazz1.getSimpleName());
System.out.println(clazz1.getCanonicalName());
System.out.println(clazz1.getTypeName());
```

输出效果如下（实际上和上一端完全一样）

```console
com.qw.reflect.Student
Student
com.qw.reflect.Student
com.qw.reflect.Student
```

### `java.lang.reflect.Modifier`

Modifier为修饰符类，可以帮助我们获取类的修饰符，使用样例如下：

```java
Class<?> clazz1 = Class.forName("com.qw.reflect.Student");
System.out.println(Modifier.isPublic(clazz1.getModifiers())); // true
System.out.println(Modifier.isAbstract(clazz1.getModifiers())); // false
System.out.println(Modifier.isProtected(clazz1.getModifiers()));// false
System.out.println(Modifier.isPrivate(clazz1.getModifiers()));// false
```

借助反射包中的类，我们可以获取对象的包信息，父类信息，所实现的接口信息等等，也能够获取类的构造器Constructor，类中的属性域Field，以及类中的方法Method。

其中需要注意的一点是，在反射中，获取父类或所实现的接口时，仅限于其直接使用`implements`实现的接口，即在代码中直接写明的实现接口，而通过父类继承，实现的接口不会在反射中获取。

## 通过反射调用类中的方法

因为我本人更关心添加在方法上的注解，所以我也更关心在反射中对于方法的调用与获取。我们来看看如何通过反射调用类中的方法。

为此，我们给上面例子中的Student类添加一下方法：

```java
package com.qw.reflect;

public class Student {
    private String name;
    private int age;

    public boolean isYoung(int age) {
        if (age < 18) {
            System.out.println(age + "年纪是年轻");
            return true;
        } else {
            System.out.println(age + "早已青春不再");
            return false;
        }
    }
}
```

先来尝试获取一下类的方法：

```java
Class<?> clazz1 = Class.forName("com.qw.reflect.Student");
Method[] methods = clazz1.getMethods();
for (Method method : methods) {
    System.out.println(method.getName());
}
```

输出结果：

```console
isYoung
wait
wait
wait
equals
toString
hashCode
getClass
notify
notifyAll
```

我们发现，除了Student本身的方法外，其继承的Object类中的方法也都被打印了出来。为了规避Object类的方法，我们可以使用`getDeclaredMethods()`方法，如下：

```java
Class<?> clazz1 = Class.forName("com.qw.reflect.Student");
        Method[] methods = clazz1.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println(method.getName());
        }

// 输出：isYoung
```

或者直接获取指定方法：

```java
Class<?> clazz1 = Class.forName("com.qw.reflect.Student");
Method method = clazz1.getMethod("isYoung", int.class);
System.out.println(method.getName());
// 输出：isYoung
```

其中，getMethod的剩余参数表示获取方法所需要传参的类型。

接下来，重头戏，如何通过反射执行类中的方法呢：

```java
Class<?> clazz1 = Class.forName("com.qw.reflect.Student");
Method method = clazz1.getMethod("isYoung", int.class);
Object o = clazz1.newInstance();
method.invoke(o, 15);
method.invoke(o, 20);
```

输出结果：

```console
15年纪是年轻
20早已青春不再
```

需要注意的是，invoke方法的第一个参数是指定类的对象，因为`isYoung`不是静态方法，必须要用指定的实体对象类执行。



## 总结

至此，我们已经大致了解了java中反射的基本概念，知道了如何通过反射调用指定类中的方法了。

然而设计到注解的另一个问题是，我们并不想在反射处理器中实际执行方法，而仅仅是监视方法的执行，这就涉及到另一个概念：AOP。

