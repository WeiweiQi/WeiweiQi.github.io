---
title: Effective Java 3rd 阅读笔记
comments: true
date: 2019-06-24 11:18:28
categories:
tags:
---

> 发生错误之后应该尽快检测出错误
> 尽量让错误/警告在编译的时候就出现
> 尽量异常，不要试图隐藏错误

<!-- more -->

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

	- [第二章：创建和销毁对象](#第二章创建和销毁对象)
		- [第1条：用静态工厂方法代替构造器](#第1条用静态工厂方法代替构造器)
		- [第2条：遇到多个构造器参数时要考虑使用构建器](#第2条遇到多个构造器参数时要考虑使用构建器)
		- [第3条：用私有构造器或者枚举类型强化Singleton属性](#第3条用私有构造器或者枚举类型强化singleton属性)
		- [第4条：通过私有构造器强化不可实例化的能力](#第4条通过私有构造器强化不可实例化的能力)
		- [第5条：优先考虑依赖注入来引用资源](#第5条优先考虑依赖注入来引用资源)
		- [第6条：避免创建不必要的对象](#第6条避免创建不必要的对象)
		- [第7条 消除过期对象的引用](#第7条-消除过期对象的引用)
		- [第8条 避免使用终结方法和清除方法](#第8条-避免使用终结方法和清除方法)
		- [第9条 try-with-resources优先于try-finally](#第9条-try-with-resources优先于try-finally)
	- [第三章 对于所有对象都通用的方法](#第三章-对于所有对象都通用的方法)
		- [第10条 覆盖equals时请遵守通用约定](#第10条-覆盖equals时请遵守通用约定)
		- [第11条 覆盖equals时总要覆盖hashCode](#第11条-覆盖equals时总要覆盖hashcode)
		- [第12条 始终要覆盖toString](#第12条-始终要覆盖tostring)
		- [第13条 谨慎地覆盖clone](#第13条-谨慎地覆盖clone)
		- [第14条 考虑实现Comparable接口](#第14条-考虑实现comparable接口)
	- [第四章 类和接口](#第四章-类和接口)
		- [第15条 使类和成员的可访问性最小化](#第15条-使类和成员的可访问性最小化)
		- [第16条 要在公有类而非公有域中使用访问方法](#第16条-要在公有类而非公有域中使用访问方法)
		- [第17条 使可变性最小化](#第17条-使可变性最小化)
		- [第18条 复合优先于继承](#第18条-复合优先于继承)
		- [第19条 要么设计继承并提供文档说明，要么禁止继承](#第19条-要么设计继承并提供文档说明要么禁止继承)
		- [第20条 接口优于抽象类](#第20条-接口优于抽象类)
		- [第21条 为后代设计接口](#第21条-为后代设计接口)
		- [第22条 接口只用于定义类型](#第22条-接口只用于定义类型)
		- [第23条 类层次优于标签类](#第23条-类层次优于标签类)
		- [第24条 静态成员类优于非静态成员类](#第24条-静态成员类优于非静态成员类)
		- [第25条 限制源文件为单个顶级类](#第25条-限制源文件为单个顶级类)
	- [第五章 泛型](#第五章-泛型)
		- [第26条 请不要使用原生态类型](#第26条-请不要使用原生态类型)
		- [第27条 消除非受检的警告](#第27条-消除非受检的警告)
		- [第28条 列表优于数组](#第28条-列表优于数组)
		- [第29条 优先考虑泛型](#第29条-优先考虑泛型)
		- [第30条 优先考虑泛型方法](#第30条-优先考虑泛型方法)
		- [第31条 利用有限制通配符来提升API的灵活性](#第31条-利用有限制通配符来提升api的灵活性)
		- [第32条 谨慎并用泛型和可变参数](#第32条-谨慎并用泛型和可变参数)
		- [第33条 优先考虑类型安全的异构容器](#第33条-优先考虑类型安全的异构容器)
	- [第六章 枚举和注解](#第六章-枚举和注解)
		- [第34条 用enum代替int常量](#第34条-用enum代替int常量)
		- [第35条 用实例域代替序数](#第35条-用实例域代替序数)
		- [第36条 用EnumSet代替位域](#第36条-用enumset代替位域)
		- [第37条 用EnumMap代替序数索引](#第37条-用enummap代替序数索引)
		- [第38条 用接口模拟可扩展的枚举](#第38条-用接口模拟可扩展的枚举)
		- [第39条 注解优先于命名模式](#第39条-注解优先于命名模式)
		- [第40条 坚持使用Override注解](#第40条-坚持使用override注解)
		- [第41条 用标记接口定义类型](#第41条-用标记接口定义类型)
	- [第七章 Lambda和Stream](#第七章-lambda和stream)
		- [第42条 Lambda优先于匿名类](#第42条-lambda优先于匿名类)
		- [第43条 方法引用优先于Lambda](#第43条-方法引用优先于lambda)
		- [第44条 坚持使用标准的函数接口](#第44条-坚持使用标准的函数接口)
		- [第45条 谨慎使用Stream](#第45条-谨慎使用stream)
		- [第46条 优先选择Stream中无副作用的函数](#第46条-优先选择stream中无副作用的函数)
		- [第47条 Stream要优先用Collection作为返回类型](#第47条-stream要优先用collection作为返回类型)
		- [第48条 谨慎使用Stream并行](#第48条-谨慎使用stream并行)
	- [第八章 方法](#第八章-方法)
		- [第49条 检查参数的有效性](#第49条-检查参数的有效性)
		- [第50条 必要时进行保护性拷贝](#第50条-必要时进行保护性拷贝)
		- [第51条 谨慎设计方法签名](#第51条-谨慎设计方法签名)
		- [第52条 慎用重载](#第52条-慎用重载)
		- [第53条 慎用可变参数](#第53条-慎用可变参数)
		- [第54条 返回零长度的数组或集合，而不是null](#第54条-返回零长度的数组或集合而不是null)
		- [第55条 谨慎返回optional](#第55条-谨慎返回optional)
		- [第56条 为所有导出的API元素编写文档注释](#第56条-为所有导出的api元素编写文档注释)
	- [第九章 通用编程](#第九章-通用编程)
		- [第57条 将局部变量的作用域最小化](#第57条-将局部变量的作用域最小化)
		- [第58条 for-each循环优先于传统的for循环](#第58条-for-each循环优先于传统的for循环)
		- [第59条 了解和使用类库](#第59条-了解和使用类库)
		- [第60条 如果需要精确的答案，请避免使用float和double](#第60条-如果需要精确的答案请避免使用float和double)
		- [第61条 基本类型优先于装箱基本类型](#第61条-基本类型优先于装箱基本类型)
		- [第62条 如果其他类型更合适，则尽量避免使用字符串](#第62条-如果其他类型更合适则尽量避免使用字符串)
		- [第63条 了解字符串连接的性能](#第63条-了解字符串连接的性能)
		- [第64条 通过接口引用对象](#第64条-通过接口引用对象)
		- [第65条 接口优先于反射机制](#第65条-接口优先于反射机制)
		- [第66条 谨慎地使用本地方法](#第66条-谨慎地使用本地方法)
		- [第67条 谨慎地进行优化](#第67条-谨慎地进行优化)
		- [第68条 遵守普遍接受的命名惯例](#第68条-遵守普遍接受的命名惯例)
	- [第十章 异常](#第十章-异常)
		- [第69条 只针对异常的情况才使用异常](#第69条-只针对异常的情况才使用异常)
		- [第70条 对可恢复的情况使用受检异常，对编程错误使用运行时异常](#第70条-对可恢复的情况使用受检异常对编程错误使用运行时异常)
		- [第71条 避免不必要地使用受检异常](#第71条-避免不必要地使用受检异常)
		- [第72条 优先使用标准的异常](#第72条-优先使用标准的异常)
		- [第73条 抛出与抽象对应的异常](#第73条-抛出与抽象对应的异常)
		- [第74条 每个方法抛出的所有异常都要建立文档](#第74条-每个方法抛出的所有异常都要建立文档)
		- [第75条 在细节消息中包含失败-捕获信息](#第75条-在细节消息中包含失败-捕获信息)
		- [第76条 努力使失败保持原子性](#第76条-努力使失败保持原子性)
		- [第77条 不要忽略异常](#第77条-不要忽略异常)
	- [第十一章 并发](#第十一章-并发)
		- [第78条 同步访问共享的可变数据](#第78条-同步访问共享的可变数据)
		- [第79条 避免过度同步](#第79条-避免过度同步)
		- [第80条 executor， task和stream优先于线程](#第80条-executor-task和stream优先于线程)
		- [第81条 并发工具优先于wait和notify](#第81条-并发工具优先于wait和notify)
		- [第82条 线程安全性的文档化](#第82条-线程安全性的文档化)
		- [第83条 慎用延迟初始化](#第83条-慎用延迟初始化)
		- [第84条 不要依赖于线程调度器](#第84条-不要依赖于线程调度器)
	- [第十二章 序列化](#第十二章-序列化)
		- [第85条 其他方法优先于Java序列化](#第85条-其他方法优先于java序列化)
		- [第86条 谨慎地实现Serializable接口](#第86条-谨慎地实现serializable接口)
		- [第87条 考虑使用自定义的序列化形式](#第87条-考虑使用自定义的序列化形式)
		- [第88条 保护性地编写readObject方法](#第88条-保护性地编写readobject方法)
		- [第89条 对于实例控制，枚举类型优先于readResolve](#第89条-对于实例控制枚举类型优先于readresolve)
		- [第90条 考虑用序列化代理代替序列化实例](#第90条-考虑用序列化代理代替序列化实例)

<!-- /TOC -->

## 第二章：创建和销毁对象

### 第1条：用静态工厂方法代替构造器
- 静态工厂方法相比构造器的优势：
  前四点比较容易理解，第5点：静态工厂方法返回的对象所属的类，在编写包含该静态工厂方法的类时可以不存在。后文又提到服务提供者框架。服务提供者框架类图如图所示。
![服务提供者框架类图1](https://wx3.sinaimg.cn/mw690/733866e8ly1g4cbwdvm99j20l80hktas.jpg)

![服务提供者框架类图2](https://wx3.sinaimg.cn/mw690/733866e8ly1g4cbwr16q1j20q109dmy4.jpg)
  典型的服务提供者框架应用JDBC。

- 静态工厂方法的缺点：
  1. 类如果不含公有的或者受保护的构造器，就不能被子类实例化。这一点可以通过复合来解决。
  2. 程序员很难发现他们。因此，需要遵守标准的命名习惯。
- 常见命名:
  - from 类型转换方法
  - of 聚合方法
  - valueof
  - instance/getInstance
  - create/newInstance
  - getTYPE: 例如：Files.getFileStore(path);
  - newTYPE: 例如：Files.newBufferedReader(path);
  - TYPE: 例如 Collections.list(..);

### 第2条：遇到多个构造器参数时要考虑使用构建器
- 类多个属性时，构造对象有三种选择：
  1. 重叠构造器：客户端代码很难编写
  2. JavaBeans模式：构造过程被分到了几个调用中，在构造过程中，JavaBean可能处于不一致的状态。JavaBeans模式使得把类做成不可变性的可能性不复存在。
  3. 建造者(Builder)模式：如果类的构造器或者静态工厂中具有多个参数，设计这种类，Builder模式就是一种不错的选择。

```Java
/**建造者模式创建对象样例*/
NutritionFacts fact = new NutritionFacts.Builder(140, 40).calories(100).sodium(35).carbohydrate(27).build();
//---------------------------------
public class NutritionFacts {
	private final int servingSize;
	private final int servings;
	private final int calories;
	private final int fat;
	private final int sodium;
	private final int carbohydrate;

	public static class Builder {
		private final int servingSize;
		private final int servings;

		private int calories = 0;
		private int fat = 0;
		private int sodium = 0;
		private int carbohydrate = 0;

		public Builder(int servingSize, int servings) {
			this.servingSize = servingSize;
			this.servings = servings;
		}

		public Builder calories(int val) {
			calories = val;
			return this;
		}

		public Builder fat(int val) {
			fat = val;
			return this;
		}

		public Builder sodium(int val) {
			sodium = val;
			return this;
		}

		public Builder carbohydrate(int val) {
			carbohydrate = val;
			return this;
		}

		public NutritionFacts build() {
			return new NutritionFacts(this);
		}
	}

	private NutritionFacts(Builder builder) {
		servingSize = builder.servingSize;
		servings = builder.servings;
		calories = builder.calories;
		fat = builder.fat;
		sodium = builder.sodium;
		carbohydrate = builder.carbohydrate;
	}
}
```

### 第3条：用私有构造器或者枚举类型强化Singleton属性

- 单元素的枚举类型经常成为实现Singleton的最佳方法。
  - 规避反射攻击
  - 规避序列化问题
  - 博客 [为什么要用枚举实现单例模式（避免反射、序列化问题）](https://www.cnblogs.com/chiclee/p/9097772.html)

```Java
public enum SingletonEnum {
	INSTANCE;
	private String content;
  private SingletonEnum() {}
	public String getContent() {
      return content;
  }
  public void setContent(String content) {
      this.content = content;
  }

	public SingletonEnum getInstance() {
		return INSTANCE;
	}
}
```

### 第4条：通过私有构造器强化不可实例化的能力

- 让这个类包含一个私有构造器，它就不能被实例化

```java
public class UtilityClass {
	//suppress default constructor for noninstantiability
	//抑制默认构造函数的非实例化
	private UtilityClass() {
		throw new AssertionError();
	}
}
```

### 第5条：优先考虑依赖注入来引用资源

- 静态工具类和Singleton类不适合与需要应用底层资源的类。
  - 笨拙，易出错，无法并行工作
- 需要能够支持类的多个实例，每一个实例都使用客户端指定的资源。当创建一个新的实例时，就将该资源传到构造器中。依赖注入的对象资源具有不可变性。
- 总而言之，不要用Singleton和静态工具类来实现依赖一个或多个底层资源的类，且该资源的行为会影响到该类的行为；也不要直接用这个类来创建这些资源。这个实践就被称作依赖注入，它极大地提升了类的灵活性、可重用性和可测试性。

```java
/**
 * 	拼写检查器
 * @author qiweiwei
 * @date 2019年7月1日-下午4:47:02
 * @describle
 *
 */
public class SpellChecker {
	private final String dictionary;
	public SpellChecker(String dictionary) {
		this.dictionary = Objects.requireNonNull(dictionary);
	}
	public boolean isVlid(String word) {
		//TODO
		return false;
	}
	public List<String> suggestions(String typo) {
		//TODO
		return null;
	}
}
```

### 第6条：避免创建不必要的对象

- 虽然String.matches方法最易于查看一个字符串是否与正则表达式相匹配，但并不适合在注重性能的情形中重复使用。问题在于，它在内部为正则表达式创建了一个Pattern实例，却只用了一次，之后就可以进行垃圾回收了。创建Pattern实例的成本很高，因为需要将正则表达式编译成一个有限状态机。

```java
public static Map<String, Pattern> patterns = new HashMap<String, Pattern>();

public static Pattern getPattern(String regex) {
  if (patterns.containsKey(regex)) {
    return patterns.get(regex);
  } else {
    Pattern pattern = Pattern.compile(regex);
    patterns.put(regex, pattern);
    return pattern;
  }
}
```

- 自动装箱使得基本类型和装箱基本类型之间的差别变得模糊起来，但是并没有完全消除。他们在语义上有着微妙的差别，在性能上有着比较明显的差别。
- 要优先使用基本类型而不是装箱基本类型，要当心无意识的自动装箱。
- 不要错误的认为“创建对象的代价非常昂贵，我们应该要尽可能地避免创建对象”，相反，由于小对象的构造器只做很少量的显示工作，所以小对象的创建和回收动作是非常廉价的，特别是在现代的JVM实现上更是如此。通过创建附加的对象，提升程序的清晰性、简洁性和功能性，这通常是件好事。
- 反之，通过维护自己的对象池来避免创建对象并不是一种好的做法，除非池中的对象是非常重要级的。正确使用对象池的典型对象示例就是数据库连接池。

### 第7条 消除过期对象的引用

- 在支持垃圾回收的语言中，内存泄露是很隐蔽的。如果一个对象引用被无意识地保留下来了，那么垃圾回收机制不仅不会处理这个对象，而且也不会处理被这个对象所引用的所有其他对象。
- 清空过期引用的另一个好处是，如果它们以后又被错误地接触引用，程序就会立即抛出NullPointerException异常，而不是悄悄地错误运行下去。
- 清空对象引用应该是一种例外，而不是一种规范行为。
- 消除过期引用最好的方法是让包含该引用的变量结束其生命周期。如果你是在紧凑的作用域范围内定义每一个变量，这种情形就会自然而然地发生。
- 一般来说，只要类是自己管理内存，程序员就应该警惕内存泄露问题。（栈Stack类是自己管理内存）
- 内存泄露的另一个常见来源是缓存。WeakHashMap：只要在缓存之外存在对某个项的键的引用，该项就有意义，那么就可以用WeakHashMap代表缓存；当缓存中的项过期之后，它们就会自动被删除。记住只有当所要的缓存项的生命周期是由该键的外部引用而不是由值决定时，WeakHashMap才有用处。“缓存项的声明周期是否有意义”并不是很容易确定。随着时间的推移，其中的项会变得越来越没有价值。在这种情况下，缓存应该时不时地清楚掉没用的项。
- 内存泄露的第三个常见来源是监听器和其他回调。如果你实现了一个API，客户端在这个API中注册回调，却没有显式地取消注册，那么除非你采取这些动作，否则它们就会不断地堆积起来。确保回调立即被垃圾回收的最佳方法是只保存它们的弱引用，例如，只将它们保存成WeakHashMap中的键。
- 内存泄露问题通常不会表现成明显的失败，往往只有通过仔细检查代码，或者借助于Heap剖析工具(Heap Profiler)才能发现内存泄露问题。

### 第8条 避免使用终结方法和清除方法

- 终结方法(finalizer)通常是不可预测的，也是很危险的，一般情况下是不必要的。使用终结方法会导致行为不稳定、性能降低，以及可移植性问题。
- 在Java9中，用清除方法代替了终结方法。清除方法没有终结方法那么危险，但仍然是不可预测、运行缓慢，一般情况下也是不必要的。
- 终结方法和清除方法的缺点在于不能保证会被及时执行。注重时间的任务不应该由终结方法或者清楚方法来完成。
- 永远不应该依赖终结方法或者清除方法来更新重要的持久状态。
- 使用终结方法的另一个问题是：如果忽略在终结过程中被抛出来的未被捕获的异常，该对象的终结过程也会终止。
- 使用终结方法和清除方法有一个非常严重的性能损失。
- 终结方法有一个严重的安全问题：它们为终结方法共计(finalizer attack)打开了类的大门。终结方法攻击背后的思想很简单：如果从构造器或者它的序列化对等体抛出异常，恶意子类的终结方法就可以在构造了一部分的应该已经半途夭折的对象上运行。从构造器抛出的异常，应该足以放置对象继续存在；有了终结方法的存在，这一点就做不到了。为了防止非final类受到终结方法攻击，要编写一个空的final的finalize方法。
- 如果类的对象中封装的资源确实需要终止，只需让类实现AutoCloseable，并要求其客户端在每个实例不再需要的时候调用close方法。
- 总而言之，除非是作为安全网，或者是为了终止非关键的本地资源，否则请不要使用清除方法，对于在Java9之前的发行版本，则尽量不要使用终结方法。

### 第9条 try-with-resources优先于try-finally

- try-finally语句存在些许不足，因为在try和finally块中的代码，都会抛出异常。
- Java7引入try-with-resource。要使用这个构造的资源，必须先实现AutoCloseable接口，其中包含了单个返回void的close方法。

```java
try (ObjectOutputStream outputStream = new  ObjectOutputStream(new FileOutputStream("D://singletonEnum.obj"))) {
			outputStream.writeObject(s);
			outputStream.flush();
}

try (ObjectInputStream inputStream2 = new ObjectInputStream(new FileInputStream("D://singletonEnum.obj"))){
			SingletonEnum s1 = (SingletonEnum)inputStream2.readObject();
}
```
## 第三章 对于所有对象都通用的方法

本章将讲述何时以及如何覆盖这些非final的Object方法。本章也对Comparable.compareTo方法进行讨论，因为它具有类似的特征。

### 第10条 覆盖equals时请遵守通用约定

- 不宜覆盖equals方法的情形：
  - 类的每个实例本质上都是唯一的，对于代表活动实体而不是值的类来说，确实如此
  - 类没有必要提供“逻辑相等”的测试功能
  - 超类已经覆盖了equals，超类的行为对于这个类也是合适的
  - 类是私有的，或者是包级私有的，可以确定它的equals方法永远不会被调用

```java
    @Override
	public boolean equals(Object o) {
		//method is never called
		throw new AssertionError();
	}
```

- 如果类具有自己特有的“逻辑相等”(logitical equality)概念，而且超类还没有覆盖equals。这样做也使得这个类的实例可以被用作映射表(map)的键，或者集合(set)的元素，使映射或者集合表现出预期的行为。
- 有一种“值”不需要覆盖equals方法，即用实例受控确保“每个值至多只存在一个对象”的类。枚举类型就属于这种类。对于这样的类而言，逻辑相同与对象等同是一回事。
- equals约定：等价关系
  - 自反性(reflexive):对于任何非null的引用值x, x.equals(x)必须返回true。
  - 对称性(symmetric):对于任何非null的引用值x和y，当且仅当y.equals(x)返回true时，x.equals必须返回true。
  - 传递性(transitive):对于任何非null的引用值x, y和z，如果x.equals(y)返回true，并且y.equals(z)也返回true, 那么x.equals(z)也必须返回true。
  - 一致性(consistent):对于任何非null的引用值x和y，只要equals的比较操作在对象中所用的信息没有被修改，多次调用x.equals(y)就会移植地返回true，或者一致地返回false。
  - 非空性：对于任何非null的引用值x，x.equals(null)必须返回false。
- 我们无法在扩展可实例化的类的同时，既增加新的值组件，同时又保留equals约定，除非愿意放弃面向对象的抽象所带来的优势。
  - 一种权益之计：复合优先于继承

```java
/**
* 复合优先于继承
*/
public class ColorPoint {

	private final Point point;
	private final String color;

	public ColorPoint(int x, int y, String color) {
		point = new Point(x, y);
		this.color = Objects.requireNonNull(color);
	}

	public Point asPoint() {
		return point;
	}

	@Override
	public boolean equals(Object object) {
		if (!(object instanceof ColorPoint)) {
			return false;
		}
		ColorPoint cp = (ColorPoint)object;
		return cp.point.equals(point) && cp.color.equals(color);
	}
}
```

- 高质量equals方法的诀窍：
  - 使用 "==" 操作符检查“参数是否为这个对象的引用”，如果是，则返回true。
  - 使用 "instanceof" 操作符检查“参数是否为正确的类型”：一般情况下是指equals方法所在的那个类，某些情况下是指该类所实现的某个接口，如Set， List， Map，Map.Entry。
  - 把参数转换为正确的类型
  - 对于该类中的每个“关键”域，检查参数中的域是否与该对象中对应的域相匹配。
  - 对于既不是float也不是double类型的基本类型域，可以使用==操作符进行比较；对于对象引用域，可以递归地调用equals方法；对于float域，可以使用静态Float.compare(float, float)方法；对于double域，则使用Double.compare(double, double)。对于数组域，则要把以上这些指导原则应用到每一个元素上。如果数组域中的每个元素都很重要，就可以使用其中一个Arrays.equals方法；有些对象引用域包含null可能是合法的，则使用Objects.equals(Object, Object)来检查这类域的等同性；
  - 为了获取最佳性能，应该最先比较最有可能不一致的域，或者是开销最低的域
- 在编写完equals方法之后，应该问自己三个问题：它是否是对称的，传递的、一致的？
- 覆盖equals时总要覆盖hashCode
- 不要企图让equals方法过于智能。例如：File类不应试图把指向同一个文件的符号链接当作相等的对象来看待。
- 不要将equals声明中的Object对象替换为其他的类型。
- 代替手工编写和测试这些方法的最佳途径，是使用Google开源的AutoValue框架，它会自动替你生成这些方法，通过类中的单个注解(@AutoValue)就能触发（生成的.java文件在class路径下）。IDE也有工具可以生成equals和hashCode方法，但得到的源代码比使用Auto-Value的更加冗长，可读性也更差，它无法追踪类中的变化，因此需要进行测试。
- 总而言之，不要轻易覆盖equals方法，除非迫不得已。


### 第11条 覆盖equals时总要覆盖hashCode

- 在每个覆盖了equals方法的类中，都必须覆盖hashCode方法
- 约定：
  - 只要对象的equals方法的比较操作所用到的信息没有被修改，那么对同一个对象的多次调用，hashCode方法都必须始终返回同一个值
  - equals(Object)是相等的，那么hashCode必须相同；即 **相等的对象必须具有相等的散列码**
  - 如果equals不等，不要求hashCode不同；但是给不相等的对象产生不同的整数结果，有可能提高散列表的性能
  - 如果一个类是不可变的，并且计算散列码的开销也比较大，就应该考虑把散列码缓存在对象内部，而不是每次请求的时候都重新计算散列码。或“延迟初始化”散列码，即一直到hashCode被第一次调用的时候才初始化。
  - 不要试图从散列码计算中排除掉一个对象的关键域来提高性能。
  - 不要对hashCode方法的返回值做出具体的规定，因此客户端无法理所当然地依赖它，这样可以为修改提供灵活性。

### 第12条 始终要覆盖toString

- 提供好的toString实现可以使类用起来更加舒适，使用了这个类的系统也更易于调试。
- toString方法应该返回对象中包含的所有值得关注的信息，或者对象太大时应返回摘要信息。
- 无论是否决定指定格式，都应该在文档中明确地表明你的意图
- 总而言之，toString方法应该以美观的格式返回一个关于对象的简洁、有用的描述。

### 第13条 谨慎地覆盖clone

- 事实上，实现Cloneable接口的类是为了提供一个功能适当的公有clone方法。
- 不可变的类用于都不应该提供clone方法
- 实际上，clone方法就是另一个构造器；必须确保它不会伤害到原始的对象，并确保正确地创建被克隆对象中的约束条件
- Cloneable架构与引用可变对象的final域的正常用法是不相兼容的。
- 克隆复杂对象的一种方法：先调用super.clone方法，然后把结果对象中的所有域都设置成它们的初始状态，然后调用高层的方法来重新产生对象的状态。
- clone方法不应该在构造的过程中调用可以覆盖的方法（子类覆盖方法有可能修改对象中的状态）
- 公有的clone方法应该省略throws声明
- 如果你编写线程安全的类准备实现Cloneable接口，要记住它的clone方法必须得到严格的同步，就像其他任何方法一样，即 synchronized clone()。
- 简而言之，所有实现Cloneable接口的类都应该覆盖clone方法，并且是公有的方法，它的返回类型为类本身。该方法应该先调用super.clone， 然后修正任何需要修正的域。
- **对象拷贝的更好方法是提供一个拷贝构造器或拷贝工厂**
- 数组例外，最好利用clone方法复制数组

```java
public Yum(Yum yum) {...}
```

```java
public static Yum newInstance(Yum yum) {...}
```

### 第14条 考虑实现Comparable接口

- 违反compareTo约定的类会破坏其他依赖于比较关系的类，例如有序集合类TreeSet和TreeMap，以及工具类Collections和Arrays，它们内部包含有搜索和排序算法。
- 同equals一样，无法在用新的值组件扩展可实例化的类时，同时保持compareTo约定，除非愿意放弃面向对象的抽象优势
- 强烈建议(x.compareTo(y) == 0) == (x.equals(y))，但这并非绝对必要。
  - 例如，BigDecimal，它的compareTo与equals不一致，new BigDecimal("1.0")与new BigDecimal("1.00")通过equals比较是不等的，而通过compareTo比较是相等的。若使用HashSet，会保存两个元素。而使用TreeSet则只会包含一个元素。
- java7版本中，已经在Java的所有装箱基本类型的类中增加了静态的compare方法。
- 从最关键的域开始，逐步比较所有的重要域。如果某个域的比较产生了非零的结果，则整个比较操作结束，并返回该结果。
- 总而言之，每当实现一个对排序敏感的类时，都应该让这个类实现Comparable接口，以便其实例可以轻松地被分类、搜索，以及用在基于比较的集合中。在compareTo方法中比较域值时，都要避免使用<和>操作符，而应该在装箱基本类型的类中使用静态的compare方法，或者在Comparator接口中使用比较器构造方法。

## 第四章 类和接口

### 第15条 使类和成员的可访问性最小化

- **信息隐藏/封装**：区分一个组件设计的好不好，唯一重要的因素在于，它对于外部的其他组件而言，是否隐藏了其内部数据和其他实现细节。
- 规则：尽可能地使每个类或者成员不被外界访问。
- 公有类是包API的一部分，包级私有的顶层类则已经是这个包的实现的一部分。
- 公有类的实例域决不能是公有的。包含公有可变域的类通常并不是线程安全的。
- 长度非零的数组总是可变的，所以让类具有公有的静态final数组域，或者返回这种域的访问方法，这是错误的。(安全漏洞的常见根源)
- 总而言之，应该始终尽可能（合理）地降低程序元素的可访问性。

```java
//Potential security hole! 潜在的安全漏洞
public static final Thing[] VALUES = {...};

//修正方法1：
private static final Thing[] PRIVATE_VALUES = {...};
public static final List<Thing> VALUES = Collections.unmodifiableList(Arrays.asList(PRIVATE_VALUES));

//修正方法2：
private static final Thing[] PRIVATE_VALUES = {...}
public static final Thing[] value() {
	return PRIVATE_VALUES.clone();
}
```

### 第16条 要在公有类而非公有域中使用访问方法

- 如果类可以在它所在的包之外进行访问，就提供访问方法，以保留将来改变该类的内部表示法的灵活性。
- 如果类是包级私有的，或者是私有的嵌套类，直接暴露它的数据域并没有本质的错误。
- 简而言之，公有类永远都不应该暴露可变的域。

### 第17条 使可变性最小化

- 不可变类是指其实例不能被修改的类。
- 使类成为不可变类，要遵循下面5条规则：
	- 不要提供任何会修改对象状态的方法（也称为设值方法）
	- 保证类不会被扩展：一般做法是声明这个类成为final的
	- 声明所有的域都是final的
	- 声明所有的域都为私有的
	- 确保对于任何可变组件的互斥访问：如果类具有指向可变对象的域，则必须确保该类的客户端无法获得指向这些对象的引用。在构造器、访问方法和readObject方法中请使用保护性拷贝技术。
- 不可变对象本质上是线程安全的，它们不要求同步，可以被自由地共享。
- 不可变类可以提供一些静态工厂，它们把频繁被请求的实例缓存起来，从而当现有实例可以符合请求的时候，就不必创建新的实例。
- 不需要，也不应该为不可变类提供clone方法或者拷贝构造器。
- 不仅可以共享不可变对象，甚至也可以共享它们的内部信息。
- 不可变对象为其他对象提供了大量的构件，无论是可变的还是不可变的对象：这条原则的一种特例在于，不可变对象构成了大量的映射建和集合元素。
- 不可变对象无偿地提供了失败的原子性。
- 不可变类真正唯一的缺点是，对于每个不同的值都需要一个单独的对象。创建这些对象的代价可能很高，特别是大型的对象。
- 如果能够精确地预测出客户端将要在不可变的类上执行哪些复杂的多阶段操作，这种包级私有的可变配套类的方法就可以工作得很好。如果无法预测，最好的方法是提供一个公有的可变配套类。例如String的配套StringBuilder。
- 不可变的类变成final的另一种方法就是，让类的所有构造器都变成私有的或者包级私有的，并且添加公有的静态工厂来代替公有的构造器。这种方法还使得有可能通过改善静态工厂的对象缓存能力，在后续的发行版本中改进该类的性能。
- 不可变类：没有一个方法能够对对象的状态产生外部可见的改变，然后许多不可变类拥有一个或者多个非final的域，它们在第一次被请求执行这些计算的时候，把一些开销昂贵的计算结果缓存在这些域中。
- 如果你选择让自己的不可变类实现Serializable接口，并且它包含一个或多个指向可变对象的域，就必须提供一个显示的readObject或者readResolve方法，或者使用ObjectOutputStream.writeUnshared和ObjectInputStream.readUnshared方法，即便默认的序列化形式是可以接受的，也是如此。否则，攻击者可能从不可变的类创建可变的实例。
- 除非有很好的理由要让类成为可变的类，否则它就应该是不可变的。
- 如果类不能被做成不可变的，仍然应该尽可能地显示它的可变性。
- 除非有令人信服的理由要使域变成是非final的，否则要使每个域都是private final的。
- 构造器应该创建完全初始化的对象，并建立起所有的约束关系。不要在构造器或者静态工厂之外再提供公有的初始化方法，除非有令人信服的理由必须这么做。同样的，也不应该提供“重新初始化”方法。

```java
public class Complex {
	private final double re;
	private final double im;

	private Complex(double re, double im) {
		this.re = re;
		this.im = im;
	}

	public static Complex valueOf(double re, double im) {
		return new Complex(re, im);
	}
}
```

### 第18条 复合优先于继承

- 在包的内部实现继承是十分安全的，在那里子类和超类的实现都处在同一个程序员控制之下。
- 与方法调用不同的是，继承打破了封装性。换句话说，子类依赖于其超类中特定功能的实现细节。超类的实现有可能会随着发行版本的不同而有所变化，如果真的发生了变化，子类可能会遭到破坏。它们的超类在后续的发行版本中可以获得新的方法。
- 有一种方法可以避免前面的问题：不扩展现有的类，而是在新的类中增加一个私有域，它引用现有类的一个实例。这种设计被称为“复合”。（Decorator 修饰者模式）
- 包装类几乎没有什么缺点，需要注意的一点是，包装类不适合用于回调框架：在回调框架中，对象把自身的引用传递给其他的对象，用于后续的调用（“回调”）
- 只有当子类真正是超类的子类型时，才适合用继承。换句话说，对于两个类A和B，只有当两者之间确实存在“is-a”关系的时候，类B才应该扩展类A。
- 继承机制会把超类API中的所有缺陷传播到子类中，而复合则允许设计新的API来隐藏这些缺陷。
- 简而言之，继承的功能非常强大，但是也存在诸多问题，因为它违背了封装原则。

### 第19条 要么设计继承并提供文档说明，要么禁止继承

- 对于专门为了继承而设计并且具有良好文档说明的类来说：这个类会有一些实质性的限制。
	- 首先，该类的文档必须精确地覆盖每个方法所带来的影响。换句话说，该类必须有文档说明它可覆盖的方法的自用性。
	- 类必须以精心挑选的受保护的方法的形式，提供适当的钩子（hook），以便进入其内部工作中。
	- 对于为了继承而设计的类，唯一的测试方法就是编写子类。经验表明，3个子类通常就足以测试一个可扩展类。
	- 为了继承而设计并有可能被广泛使用的类时，必须意识到，对于文档中声明的自用模式，你实际上已经做出了永久的承诺。因此必须在发布类之前编写子类对类进行测试。
	- 构造器决不能调用可被覆盖的方法，无论是直接调用还是间接调用。（超类的构造器在子类的构造器之前运行，如果子类覆盖方法，将会在子类构造器运行之前先被调用）
	- 无论是clone还是readObject，都不可以调用可覆盖的方法，不管是以直接还是间接的方式。
	- 若你决定在一个为了继承而设计的类中实现Serializable接口，并且该类有一个readResolve或者writeReplace方法，就必须使readResolve或者writeReplace成为受保护的方法，而不是私有的方法。
- 好的API文档应该描述一个给定的方法，做了什么工作，而不是描述它是如何做到的。
- 对于那些并非为了安全进行子类化而设计和编写文档的类，要禁止子类化：一种方法是声明类为final的；另一种方法是把所有的构造器都变成私有的，或者包级私有的，并增加一些公有的静态工厂来替代构造器。
- 完全消除这个类中可覆盖方法的自用特性，就可以创建“能够安全地进行子类化”的类。
- 简而言之，专门为了继承而设计类是一件很辛苦的工作。除非知道真正需要子类，否则最好通过将类声明为final，或者确保没有可访问的构造器来禁止类被继承。


### 第20条 接口优于抽象类

- 接口、抽象类都可以用来定义允许多个实现的类型。区别在于抽象类，类必须成为抽象类的一个子类。
- 现有的类可以很容易被更新，以实现新的接口。
- 接口是定义mixin（混合类型）的理想选择。
- 接口允许构造非层次结构的类型框架。
- 通过第18条的包装类模式，接口使得安全地增强类的功能成为可能。
- 通过对接口提供一个抽象的骨架实现类，可以把接口和抽象类的优点结合起来。接口负责定义类型，或者还提供一些缺省方法，而骨架实现类则负责实现除基本类型接口方法之外，剩下的非基本类型接口方法。扩展骨架实现占了实现接口之外的大部分工作。这就是模板方法模式。
- 骨架实现类的美妙之处在于，他们为抽象类提供了实现上的帮助，但又不强加“抽象类被用作类型定义时”所持有的严格限制。
- 骨架实现类的编写：确定哪些方法是最为基本的，其他的方法则可以根据它们来实现。这些基本方法将成为骨架实现类中的抽象方法；在接口中未所有可以在基本方法之上直接实现的方法提供缺省方法，但要记住，不能为Object方法提供缺省方法。
- 骨架实现类是为了继承的目的而设计的，对于骨架实现类而言，好的文档绝对是非常必要的。
- 总而言之，接口通常是定义允许多个实现的类型的最佳途径。如果你导出了一个重要的接口，就应该坚决考虑同时提供骨架实现类。而且，还应该尽可能地通过缺省方法在接口中提供骨架实现，以便接口的所有实现类都能使用。


### 第21条 为后代设计接口

- 尽管缺省方法现在已经是Java平台的组成部分，但谨慎设计接口仍然是至关重要的。
- 在发布程序之前，测试每一个新的接口就显得尤其重要。程序员应该以不同的方法实现每一个接口，最起码不应少于三种实现。

### 第22条 接口只用于定义类型

- 类实现接口，接口就充当可以应用这个类的实例的类型。为了任何其他目的而定义接口是不恰当的。
- 有一种接口被称为常量接口，不满足上述条件。
- 常量接口模式是对接口的不良使用。
- 常量的几种方案：
	- 与某个类或接口紧密相关，就应该把常量添加到类或接口中，如Integer.MAX_VALUE与MIN_VALUE
	- 如果常量最好被看做枚举类型的成员，就应该用枚举类型
	- 不可实例化的工具类：如果大量利用工具类导出的常量，可以通过利用静态导入机制，避免用类名来修饰常量名。

### 第23条 类层次优于标签类

- 标签类：例如一个类根据某个字段决定表示一个圆还是一个矩形。
- 标签类过于冗长，容易出错，并且效率低下。
- 子类型化：能表示多种风格对象的单个数据类型。


### 第24条 静态成员类优于非静态成员类

- 嵌套类是指定义在另一个类内部的类。
- 嵌套类有四种：静态成员类，非静态成员类，匿名类，局部类。除了第一种外，其他三种都称为内部类。
- 静态成员类是外围类的一个静态成员，可以访问外围类的所有成员，包括那些声明为私有的成员。静态成员类是外围类的一个静态成员，与其他的静态成员一样，也遵守同样的可访问性规则。
- 静态成员类的一种常见用法是作为公有的辅助类，只有与外部类一起使用才有意义。
- 语法上，静态成员类与非静态成员类只差一个static。
- 非静态成员的每个实例都隐含地与外围类的一个外围实例相关联。
- 如果声明成员类不要求访问外围实例，就要始终把修饰符static放在它的声明中，使它成为静态成员类。
- 私有静态成员类的一种常见用法是代表外围类所代表对象的组件。
- 匿名类是在使用时同时被声明和实例化。匿名类必须保持简短（大约10行或更少）。否则会影响程序的可读性。
- 在Java中增加lambda之前，匿名类是动态地创建小型函数对象和过程对象的最佳方式。
- 局部类很少使用，在任何“可以声明局部变量”的地方，都可以声明局部类。必须非常简短。局部类有名字。
- 总而言之，如果一个嵌套类需要在单个方法之外仍然可见，就应该使用成员类；如果成员类的每个实例都需要一个指向其外围实例的引用，就要把成员类做成非静态的；否则，就做成静态的。假设这个嵌套类属于一个方法内部，如果你只需要在一个地方创建实例，并且已经有一个预置的类型可以说明这个类的特征，就把它做成匿名类，否则，就做成局部类。

### 第25条 限制源文件为单个顶级类

- 一个文件中只定义一个顶级类
- 永远不要把多个顶级类或者接口放在一个源文件中


## 第五章 泛型

### 第26条 请不要使用原生态类型

- 原生态类型指的是没有类型参数的泛型，例如List是原生态类型，List<String>不是。
- 如果使用原生态类型，就失掉了泛型在安全性和描述性方面的所有优势。
- 不能将任何元素放到Collection<?>中。
- 使用原生态类型的几个例外：
	- 必须在类文字中使用源生态类型，即List.class, String[].class合法，但是List<String.class>和List<?>.class不合法。
	- instanceof 操作符：
- 总而言之：Set<Object>是个参数化类型，表示可以包含任何对象类型的一个集合；Set<?>则是一个通配符类型，表示只能包含某种未知对象类型的一个集合；Set是一个原生态类型，它脱离了泛型系统。前两种是安全的，最后一种不安全。

```java
		if(o instanceof Set) {
			Set<?> s = (Set<?>)o;
		}
```

### 第27条 消除非受检的警告

- 要尽可能地消除每一个非受检警告。
- 如果无法消除警告，同时可以证明引起警告的代码是类型安全的，只有在这种情况下，才可以用一个@SuppressWarnings("unchecked")注解来禁止这条警告。
- 应该始终在尽可能小的范围内使用SuppressWarnings注解。
- 永远不要在整个类上使用SuppressWarnings注解
- 每当使用SuppressWarnings("unchecked")注解时，都要添加一条注释，说明为什么这么做是安全的。
- 总而言之，非受检警告很重要，不要忽略它们。

### 第28条 列表优于数组

- 数组域泛型不同点：
	- 数组是协变，泛型是可变的：Object[] a = new Long[1]; a[1] = "232"; 编译不错，运行出错。
	- 数组是具体化的，泛型是通过擦除来实现的：数组会在运行时强化它们的元素类型，泛型只在编译时强化它们的类型信息，并在运行时丢弃它们的类型信息。
- 数组和泛型不能很好地混合使用
- 发生编译时错误或警告，第一反应应该是用列表代替数组。

### 第29条 优先考虑泛型

- 值得花些时间去学习如何编写自己的泛型
- 总而言之，使用泛型比使用需要在客户端代码中进行转换的类型来的更加安全，也更加容易。

### 第30条 优先考虑泛型方法

- 静态工具方法尤其适合泛型化
- 泛型单例工厂
- 递归类型限制
- 总而言之，泛型方法就像泛型一样，使用起来比要求客户端输入参数并返回值的方法来得更加安全，也更加容易。就像类型一样，你应该确保方法不用转换就能使用。这通常意味着要将它们泛型化。

```java
public static <E> Set<E> union(Set<E> s1, Set<E> s2) {
		Set<E> result = new HashSet<E>(s1);
		result.addAll(s2);
		return result;
	}
```

```java
/**
* 泛型单例工厂
*/
private static UnaryOperator<Object> IDENTITY_FN = (t) -> t;

@SuppressWarnings("unchecked")
	public static <T> UnaryOperator<T> identityFunction() {
		return (UnaryOperator<T>) IDENTITY_FN;
	}
```

```java
/**
	 * 递归类型限制
	 */
	public static <E extends Comparable<E>> E max(Collection<E> c) {
		if (c.isEmpty()) {
			throw new IllegalArgumentException("Empty Collection");
		}
		E result = null;
		for (E e : c) {
			if (e == null || e.compareTo(result) >0) {
				result = Objects.requireNonNull(e);
			}
		}

		return result;

	}
```

### 第31条 利用有限制通配符来提升API的灵活性

- 每个类型都是自身的子类型
- 为了获得最大限度的灵活性，要在表示生产者或者消费者的输入参数上使用通配符类型。
- PECS: producer-extends, consumer-super， Comparator与comparable都是消费者
- 不要用通配符类型作为返回类型
- 通配符对类的用户来说几乎是无形的。如果类的用户必须考虑通配符类型，类的API或许就会出错
- 如果类型参数只在方法声明中出现一次，就可以用通配符取代它，如果是无限制的类型参数，就用无限制的通配符取代它；如果是有限制的类型参数，就用有限制的通配符取代它
- 总而言之，在API中使用通配符比较需要技巧，但是会使API变得灵活得多。

```java
Iterable<? extends E> d;
Iterable<? super E> dd;
```

```java
public static <E> Set<E> union(Set<? extends E> s1, Set<? extends E> s2) {
		Set<E> result = new HashSet<E>(s1);
		result.addAll(s2);
		return result;
	}
```

```java
public static <E extends Comparable<? super E>> E max(Collection<? extends E> c) {
	if (c.isEmpty()) {
		throw new IllegalArgumentException("Empty Collection");
	}
	E result = null;
	for (E e : c) {
		if (e == null || e.compareTo(result) >0) {
			result = Objects.requireNonNull(e);
		}
	}

	return result;
}
```

```java
/**
* 第二种更好
*/
public static <E> void swap(List<E> list, int i, int j);
public static void swap(List<?> list, int i, int j);
```

```java
/**
* 通配符方法可能需要编写辅助方法
*/
public static void swap(List<?> list, int i, int j) {
		swapHelp(list, i, j);
	}

	public static <E> void swapHelp(List<E> list, int i, int j) {
		list.set(i, list.set(j, list.get(i)));
	}
```

### 第32条 谨慎并用泛型和可变参数

- 允许另一个方法访问一个泛型可变参数数组是不安全的。两种例外情况
	- 将数组传给另一个用@SafeVarags正确注解过的可变参数方法是安全的。
	- 将数组传给只计算数组内容部分函数的非可变参数方法也是安全的。
- @SafeVarrags 注解
- 总而言之，可变参数和泛型不能良好地合作，这是因为可变参数设施是构建在顶级数组之上的一个技术露底，泛型数组有不同的类型规则。

### 第33条 优先考虑类型安全的异构容器

- C语言中使用\n的地方，在Java中应该使用%n。这个%n会产生适用于特定平台的行分隔符，在许多平台上是\n，但并非所有平台都是如此。
- Favorites是类型安全的异构容器：异构在于favorites中键值中使用通配符Class<?>

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Favorites {
	private Map<Class<?>, Object> favorites = new HashMap<Class<?>, Object>();
	public <T> void putFavorite(Class<T> type, T instance) {
		favorites.put(Objects.requireNonNull(type), type.cast(instance));
	}
	public <T> T getFavorite(Class<T> type) {
		return type.cast(favorites.get(type));
	}

	public static void main(String[] args) {
		Favorites f = new Favorites();
		f.putFavorite(String.class, "java");
		f.putFavorite(Integer.class, 0xcafebabe);
		f.putFavorite(Class.class, Favorites.class);
		String favoriteString = f.getFavorite(String.class);
		int favoriteInt = f.getFavorite(Integer.class);
		Class<?> favoriteClass = f.getFavorite(Class.class);
		System.out.printf("%s %x %s %n", favoriteString, favoriteInt, favoriteClass);
	}
}
```

## 第六章 枚举和注解

### 第34条 用enum代替int常量

- 枚举类型是指由一组固定的常量组成合法值的类型，例如一年中的季节、太阳系中的行星或者一副牌中的花色。
- 枚举类型是实例受控的，它们是单例的泛型化，本质上，是单元素的枚举。
- 为了将数据与枚举常量关联起来，得声明实例域，并编写一个带有数据并将数据保存在域中的构造器。
- 枚举天生就是不可变的，因此，所有的域都应该为final的。
- 枚举构造器不可以访问枚举的静态域：因为构造器运行时，这些静态域还没有被初始化。唯一的特例是：枚举常量无法通过其构造器访问另一个构造器。
- 枚举中的switch语句适合于给外部的枚举类型增加特定于常量的行为。
- 与int常量相比，枚举有个性能缺点：即装载和初始化枚举时会需要空间和时间成本，但在实践中几乎注意不到这个问题。
- 什么时候应该使用枚举：每当需要一组固定常量，并且在编译时就知道其成员的时候，就应该使用枚举。
- 枚举类型中的常量集并不一定要始终保持不变。
- 总而言之，与int常量相比，枚举类型的优势是不言而喻：可读性，更安全，功能更加强大。


### 第35条 用实例域代替序数

- 枚举天生就与一个单独的int值相关联
- 永远不要根据枚举的序数导出与它关联的值，而是要将它保存在一个实例域中。

```java
/**
 * 	用实例域代替序数
 * @author qiweiwei
 * @date 2019年7月19日-上午9:34:53
 * @describle
 */
public enum Ensemble {
	SOLO(1),
	DUET(2),
	TRIO(3),
	QUARTET(4),
	QUINTET(5),
	SEXTET(6),
	SEPTET(7),
	OCTET(8),
	DOUBLE_QUARTET(8),
	NONET(9),
	DECTET(10),
	TRIPLE_QUARTET(12);

	private final int numberOfMusicians;
	Ensemble(int size) {
		this.numberOfMusicians = size;
	}

	public int numberOfMusicians() {
		return numberOfMusicians;
	}
}
```

### 第36条 用EnumSet代替位域

- EnumSet类来有效地表示从单个枚举类型中提取的多个值的多个集合。
- 总而言之，正是因为枚举类型要用在集合中，所以没有理由用位域来表示它。EnumSet类集位域的简洁性和性能优势以及枚举的所有优点。

```java
/**
 * NOT USE THIS
 * int 枚举模式的text
 * @author qiweiwei
 * @date 2019年7月19日-上午11:11:50
 * @describle
 */
public class Text {
	//加粗
	public static final int STYLE_BOLD = 1 << 0;//1
	//斜体
	public static final int STYLE_ITALIC = 1 << 1;//2
	//下划线
	public static final int STYLE_UNDERLINE = 1 << 2;//4
	//删除线
	public static final int STYLE_STRIKETHROUGH = 1 << 3;//8

	public void applyStyles(int styles) {
		//TODO
	}
	public static void main(String[] args) {
		Text text = new Text();
		text.applyStyles(STYLE_BOLD | STYLE_ITALIC);
	}
}
```
```java
/**
 * 使用EnumSet代替位域
 * @author qiweiwei
 * @date 2019年7月19日-上午11:19:24
 * @describle
 */
public class TextApplayEnumSet {
	public enum Style {
		BOLD, ITALIC, UNDERLINE, STRIKETROUGH
	}

	public void applyStyles(Set<Style> styles) {
		//TODO
	}

	public static void main(String[] args) {
		TextApplayEnumSet text = new TextApplayEnumSet();
		text.applyStyles(EnumSet.of(Style.BOLD, Style.ITALIC));
	}
}
```

### 第37条 用EnumMap代替序数索引

- EnumMap实现专门用于枚举键
- 最好不要用序数来索引数组，而要使用EnumMap。如果你所表示的这种关系是多维的，就使用EnumMap<..., EnumMap<...>>。
- 一般情况下不使用Enum.ordinal

```java
public class Plant {

	enum LifeCycle {
		ANNUAL, PERENNIAL, BIENNIAL
	}

	final String name;
	final LifeCycle lifeCycle;

	Plant(String name, LifeCycle lifeCycle) {
		this.name = name;
		this.lifeCycle = lifeCycle;
	}

	@Override
	public String toString() {
		return name;
	}

	public static void main(String[] args) {
		Plant[] garden = new Plant[3];
		garden[0] = new Plant("annual", LifeCycle.ANNUAL);
		garden[1] = new Plant("perennial", LifeCycle.PERENNIAL);
		garden[2] = new Plant("biennial", LifeCycle.BIENNIAL);

		//不稳健的方法
		Set<Plant>[] plantsByLifeCycle = (Set<Plant>[])new Set[Plant.LifeCycle.values().length];
		for (int i = 0; i < plantsByLifeCycle.length; i++) {
			plantsByLifeCycle[i] = new HashSet<Plant>();
		}
		for (Plant p : garden) {
			int s = p.lifeCycle.ordinal();
			plantsByLifeCycle[s].add(p);
		}
		for (int i = 0; i < plantsByLifeCycle.length; i++) {
			System.out.printf("%s: %s%n", Plant.LifeCycle.values()[i], plantsByLifeCycle[i]);
		}
		System.out.println("----------------");
		//使用EnumMap的方法
		Map<Plant.LifeCycle, Set<Plant>> plantsByLifeCycleMap = new EnumMap<Plant.LifeCycle, Set<Plant>>(Plant.LifeCycle.class);
		for (Plant.LifeCycle lifeCycle : Plant.LifeCycle.values()) {
			plantsByLifeCycleMap.put(lifeCycle, new HashSet<Plant>());
		}
		for (Plant p : garden) {
			plantsByLifeCycleMap.get(p.lifeCycle).add(p);
		}
		System.out.println(plantsByLifeCycleMap);
		System.out.println("----------------");
		//选择自己的映射实现，空间与时间不吻合
		System.out.println(Arrays.stream(garden).collect(Collectors.groupingBy(p -> p.lifeCycle)));
		System.out.println("----------------");
		//指定实现
		System.out.println(Arrays.stream(garden).collect(
				Collectors.groupingBy(p -> p.lifeCycle, () -> new EnumMap<>(LifeCycle.class), Collectors.toSet())));
	}

}
```

### 第38条 用接口模拟可扩展的枚举

- 虽然无法编写可扩展的枚举类型，却可以通过编写接口以及实现该接口的基础枚举类型来对它进行模拟。

```java
//接口
public interface Operation {
	double apply(double x, double y);
}

//基础操作
public enum BasicOperation implements Operation {
	PLUS("+") {
		@Override
		public double apply(double x, double y) {
			return x + y;
		}
	},
	MINUS("-") {
		@Override
		public double apply(double x, double y) {
			return x - y;
		}
	},
	TIMES("*") {
		@Override
		public double apply(double x, double y) {
			return x * y;
		}
	},
	DIVIDE("/") {
		@Override
		public double apply(double x, double y) {
			return x / y;
		}
	};

	private final String symbol;

	private BasicOperation(String symbol) {
		this.symbol = symbol;
	}

	@Override
	public String toString() {
		return symbol;
	}
}

//扩展
public enum ExtendedOperation implements Operation {
	EXP("^") {
		@Override
		public double apply(double x, double y) {
			return Math.pow(x, y);
		}
	},
	REMAINDER("%") {
		@Override
		public double apply(double x, double y) {
			return x % y;
		}
	};

	private final String symbol;

	private ExtendedOperation(String symbol) {
		this.symbol = symbol;
	}

	@Override
	public String toString() {
		return symbol;
	}
}

//两种用法
import java.util.Arrays;
import java.util.Collection;

public class Test {

	public static void main(String[] args) {
		double x = 4d;
		double y = 2d;
		test(ExtendedOperation.class, x, y);
		System.out.println("--------");
		test(Arrays.asList(ExtendedOperation.values()), x, y);
	}

	private static <T extends Enum<T> & Operation> void test(
			Class<T> opEnumType, double x, double y) {
		for (Operation operation : opEnumType.getEnumConstants()) {
			System.out.printf("%f %s %f = %f%n", x, operation, y, operation.apply(x, y));
		}
	}

	private static void test(Collection<? extends Operation> opSet, double x, double y) {
		for (Operation operation : opSet) {
			System.out.printf("%f %s %f = %f%n", x, operation, y, operation.apply(x, y));
		}
	}
}
```

### 第39条 注解优先于命名模式

- 命名模式（要求方法或类或参数名称已什么样的格式命名，例如JUnit4之前的版本，要求方法以test开头）的三个缺点：
	- 文字拼写错误会导致失败，且没有任何提示
	- 无法确保它们只用于相应的程序元素上。
	- 它们没有提供将参数值与程序元素关联起来的好方法。
- 注解很好的解决了以上问题
- 注解永远不会改变被注解代码的语义，但是使它可以通过工具进行特殊的处理。
- 既然有了注解，就完全没有理由再使用命名模式了。
- 除了“工具铁匠”（平台框架程序员）之外，大多数程序员都不必定义注解类型。但是所有的程序员都应该使用Java平台所提供的预定义的注解类型（第40条和第27条）。还要考虑使用IDE或者静态分析工具所提供的任何注解。


### 第40条 坚持使用Override注解

- 在你想要覆盖超类声明的每个方法声明中使用Override注解，编译器就可以替你防止大量的错误。

### 第41条 用标记接口定义类型

- 标记接口是不包含方法声明的接口，它只指明一个类实现了具有某种属性的接口。例如，考虑Serializable接口，通过实现这个接口，类表明它的实例可以被写到ObjectOutputStream中（或被序列化）。
- 标记接口定义的类型是由被标记类的实例实现的；标记注解则没有定义这样的类型。
- 标记接口胜过标记注解的另一个优点是，它们可以被更加精确地进行锁定。
- 标记注解胜过标记接口的最大优点在于，它们是更大的注解机制的一部分。
- 何时用标记注解？何时用标记接口？
	- 如果标记是应用于任何程序元素而不是类或者接口，就必须使用注解，因为只有类和接口可以用来实现或者扩展接口

## 第七章 Lambda和Stream

### 第42条 Lambda优先于匿名类

- 在Java8中，形成了“带有单个抽象方法的接口是特殊的，值得特殊对待”的观念。这些接口现在被称作函数接口，Java允许利用Lambda表达式创建这些接口的实例。
- 删除所有Lambda参数的类型吧，除非它们的存在能够使程序变得更加清晰
- 与方法和类不同的是，Lambda没有名称和文档；如果一个计算本身不是自描述的，或者超出了几行，那就不要把它放在一个Lambda中。
- 对于Lambda而言，一行是最理想的，三行是合理的极限，如果违背这个原则，可能对程序的可读性造成严重的危害。
- 在Lambda中，this指的是外围实例，在匿名类中，this指匿名类实例。
- 尽可能不要序列化一个Lambda。
- 千万不要给函数对象使用匿名类，除非必须创建非函数接口的类型的实例。

```java
		//匿名类
		List<String> aStrings = new ArrayList<String>();
		Collections.sort(aStrings, new Comparator<String>() {
			@Override
			public int compare(String o1, String o2) {
				return Integer.compare(o1.length(), o2.length());
			}
		});

		//Lambda表达式
		Collections.sort(aStrings, (s1, s2) -> Integer.compare(s1.length(), s2.length()));
		//Lambda表达式代替比较器构造方法
		Collections.sort(aStrings, Comparator.comparingInt(String::length));
		//List中的sort方法
		aStrings.sort(Comparator.comparingInt(String::length));
```

### 第43条 方法引用优先于Lambda

- 只要方法引用更加简洁，清晰，就用方法应用；如果方法引用并不简洁，就坚持使用Lambda

```java
//lambda
map.merge(key, 1, (count, incr) -> count + incr);

//方法引用
map.merge(key, 1, Integer::sum);

//方法引用
sevice.execute(GoshThisClassNameIsHumongous::action);

//lambda
service.execute(() -> action());
```

### 第44条 坚持使用标准的函数接口

- java.util.function
- 只要标准的函数接口能够满足需求，通常应该优先考虑，而不是专门再构建一个新的函数接口。
- 6个基础接口
	- UnaryOperator
	- Operator接口代表其结果与参数类型一致的函数
	- Predicate接口代表带有一个参数并返回一个boolean的函数
	- Function接口代表其参数与返回类型不一致的函数
	- Supplier接口代表没有参数并返回（或提供）一个值的函数
	- Consumer代表的是一个函数但不返回任何值的函数，相当于消费掉了其参数。

接口 | 函数签名 | 范例
:-: | :-: | :-:
UnaryOperator<T> | T apply(T t) | String::toLowerCase
BinaryOperator<T> | T apply(T t1, T t2) | BigInteger::add
Predicate<T> | boolean test(T t) | Collection::isEmpty
Function<T, R> | R apply(T t) | Arrays::asList
Supplier<T> | T get() | Instant::now
Consumer<T> | void accept(T t) | System.out::println

- 千万不要用带包装类型的基础函数接口来代替基本函数接口。（使用装箱基本类型进行批量操作处理，最终会导致致命的性能问题）
- 如果你所需要的函数接口具有一项或者多项以下特征，则必须认真考虑自己编写专用的函数接口，而不是使用标准的函数接口：
	- 通用，并且将受益于描述性的名称
	- 具有与其关联的严格的契约
	- 将受益于定制的缺省方法
- 必须始终用@FunctionInterface注解对自己编写的函数接口进行标注。
- 总而言之，既然Java有了Lambda，就必须时刻谨记用Lambda来设计API。

### 第45条 谨慎使用Stream

- Stream中的数据元素可以是对象引用，或者基本类型值。它支持三种基本类型：int，long，double。
- 一个Stream pipeline中包含一个源Stream，接着是0个或多个中间操作和一个终止操作。
	- 每个中间操作都会通过某种方式对Stream进行转换，例如将每个元素映射到该元素的函数，或者过滤掉不满足某些条件的所有元素。所有的中间操作都是将一个Stream转换成另一个Stream，其元素类型可能与输入的Stream一样，也可能不同。
	- 终止操作会在最后一个中间操作产生的Stream上执行一个最终的计算，例如将其元素保存到一个集合中，并返回某一个元素，或者打印出所有元素等。
	- Stream pipeline是lazy的：对于完成终止操作不需要的数据元素，将永远都不会被计算
	- Stream API是流式的：所有包含pipeline的调用可以链接成一个表达式；多个pipeline也可以链接在一起成为一个表达式。
	- 要使pipeline并发执行，只需在该pipeline的任何stream上调用parallel方法即可，但是通常不建议这么做。
- 滥用Stream会使得程序代码更难以读懂和维护。
- 在没有显示类型的情况下，仔细命名Lambda参数，这对于Stream pipeline的可读性至关重要。
- 最好避免利用Stream来处理char值。
- 重构现有代码来使用Stream，并且只在必要的时候才在新代码中使用。
- 不适合Stream的方法：
	- 可以读取或修改范围内的任意局部变量
	- 可以从外围方法中return，break或continue外围循环
- Stream可以使完成这些工作变得易如反掌：
	- 统一转换元素的序列
	- 过滤元素的序列
	- 利用单个操作（如添加、连接或者计算其最小值）合并元素的顺序
	- 将元素的序列存放到一个集合中，比如根据某些公共属性进行分组
	- 搜索满足某些条件的元素的序列
- 如果实在不确定用Stream还是用迭代比较好，那么就两种都试试，看看哪一种更好用吧。

### 第46条 优先选择Stream中无副作用的函数

- 静态导入Collectors的所有成员是惯例也是明智的，因为这样可以提升Stream pipleline的可读性。

```java
import static java.util.stream.Collectors.*;
//结果转换为list, Set, Map
.collect(toList());
.collect(toSet());
.collect(toMap(Object::toString, e -> e));

//水果名到数量的映射
.groupingBy(Fruit::getName, Collectors.counting());

```
- collect:将Stream的元素集中到一个真正的Collection中
- toMap的两参数，三参数，四参数
- groupingBy 返回收集器以生成映射，根据分类函数将元素分门别类。
- 总而言之，编写Stream pipeline的本质是无副作用的函数对象。这适用于传入Stream及相关对象的所有函数对象。终止操作中的forEach应该只用来报告由Stream执行的计算结果，而不是让它执行计算。为了正确地使用Stream，必须了解收集器。最重要的收集器工厂是toList、 toSet、toMap、groupingBy和joining。

### 第47条 Stream要优先用Collection作为返回类型

- java8之前：优先级：Collection > Iterable > 数组(基本类型)
- 对于公共的、返回序列的方法，Collection或者适当的子类型通常是最佳的返回类型。
- 千万别在内存中保存巨大的序列，将它作为集合返回即可。

```java
/**
	 * stream对象转可迭代对象
	 * @param stream
	 * @return
	 */
	public static <E> Iterable<E> iterableOf(Stream<E> stream) {
		return stream::iterator;
	}

	/**
	 * 	可迭代对象转stream
	 * @param iterable
	 * @return
	 */
	public static <E> Stream<E> streamOf(Iterable<E> iterable) {
		return StreamSupport.stream(iterable.spliterator(), false);
	}
```

### 第48条 谨慎使用Stream并行

- 如果源头是来自Stream.iterate，或者使用了中间操作的limit，那么并行pipeline也不可能提升性能。这个pipeline必须同时满足这两个条件。
- 千万不要任意地并行Stream pipeline。
- 在Stream上通过并行获得的性能，最好是通过ArrayList、HashMap、HashSet和ConcurrentHashMap实例，数组，int范围和long范围等。（都可以被精确、轻松地分成任意大小的子范围，使并行线程中的分工变得更加轻松；优异的引用局部性）
- Stream pipeline的终止操作本质上影响并发执行的效率。并行的最佳终止操作是reduction，例如reduce，min，max，count，sum， anyMathc， allMatch， noneMatch。由collect方法执行的操作都是可变的减法，不是并行的最好选择，因为合并集合的成本非常高。
- 并行Stream不仅可能降低性能，包括活性失败，还可能导致结果出错，以及难以预计的行为。
- 在适当的条件下，给Stream pipeline添加parallel调用，确实可以在多处理器核的情况下实现近乎线性的倍增。某些域如机器学习和数据处理，尤其适用于这样的提速。
- 总而言之，尽量不要并行Stream pipeline。

## 第八章 方法

### 第49条 检查参数的有效性

- 在方法体的开头处检查参数有效性，抛出IllegalArgumentException、IndexOutOfBoundsException或NullPointerException。
- 由于无效的参数值而导致计算过程抛出的异常，与文档中标明这个方法将抛出的异常并不相符。在这种情况下，应该使用异常转换技术，将计算过程抛出的异常转换为正确的异常。
- 简而言之，每当编写方法或者构造器的时候，应该考虑它的参数有哪些限制。应该把这些限制写到文档中，并且在这个方法体的开头处，通过显示的检查来实施这些限制。只要有效性检查有一次失败，你为必要的有效性检查所付出的努力便都可以连本带利得到偿还了。

### 第50条 必要时进行保护性拷贝

- java对于缓冲区溢出、数组越界、非法指针以及其他的内存破坏错误都自动免疫
- 假设类的客户端会尽其所能来破坏这个类的约束条件，因此你必须保护性地设计程序
- **java.util.Date已经过时了，不应该在新代码中使用。**
- 对于构造器的每个可变参数进行保护性拷贝是必要的。
- 保护性拷贝是在检查参数的有效性之前进行的，并且有效性检查是针对拷贝之后的对象，而不是针对原始的对象。（这样做可以避免在“危险阶段”期间从另一个线程改变类的参数，这里的危险阶段是指从检查参数开始，直到拷贝参数之间的时间段，在计算机安全社区中，这被称作Time-Of-Check/Time-Of-Use或TOCTOU攻击）
- 对于参数类型可以被不可信任方子类化的参数，请不要使用clone方法进行保护性拷贝
- 应该返回保护性拷贝
- 只要有可能都应该使用不可变的对象作为对象内部的组件，这样就不必再为保护性拷贝操心。
- 简而言之，如果一个类包含有从客户端得到或者返回到客户端的可变组件，这个类就必须保护性地拷贝这些组件。如果拷贝的成本受到限制，并且类信任它的客户端不会不恰当地修改组件，就可以在文档中指明客户端的职责是不得修改受到影响的组件，一次来代替保护性拷贝。

### 第51条 谨慎设计方法签名

- 谨慎地选择方法的名称
- 不要过于追求提供便利的方法。如果不能确定，最好不要提供快捷方式。
- 避免过长的参数列表。模板是四个参数或者更少。相同类型的长参数序列格外有害。
- 三种缩短过长的参数列表的技巧
	- 把一个方法分解成多个方法，每个方法只需要这些参数的一个子集
	- 创建辅助类，用来保存参数的分组：如果一个频繁出现的参数序列可以被看作诗代表了某个独特的实体，则建议使用这种方法。
	- 从对象构建到方法调用都采用Builder模式，如果方法带有多个参数，尤其是当他们中有些是可选的时候，最好定义一个对象来表示所有参数，并允许客户端在这个对象上进行多次setter调用，每次调用都设置一个参数，或者设置一个较小的相关集合。
- 对于参数类型，要优先使用接口而不是类。
- 对于boolean参数，要优先使用两个元素的枚举类型。它使代码更易于阅读和编写，尤其是当你在使用支持自动完成功能的IDE时。

### 第52条 慎用重载

- 要调用哪个重载方法是在 **编译** 时做出决定的。
- 对于 **重载** 方法的选择是静态的，而对于被 **覆盖** 的方法的选择则是动态的（子类覆盖父类方法）。
- 应该避免胡乱地使用重载机制。
- 安全而保守的策略是，永远不要导出两个具有相同参数数目的重载方法。始终可以给方法起不同的名称，而不使用重载机制。
- 不要在相同的参数位置调用带有不同函数接口的方法。
- 重载方法执行的功能应该是相同的，让更具体化的重载方法把调用转发给更一般化的重载方法
- 简而言之，“能够重载方法”并不意味着就“应该重载方法”。

### 第53条 慎用可变参数

- 每次调用可变参数都会导致一次数组分配和初始化。（文中提出了一种优化方法）
- 简而言之，在定义参数数目不定的方法时，可变参数方法是一种很方便的方式。在使用可变参数之前，要先包含所有必要的参数，并且要关注使用可变参数所带来的性能影响。

### 第54条 返回零长度的数组或集合，而不是null

- 有助于减少客户端代码
- 简而言之，永远不要返回null，而不返回一个零长度的数组或集合

### 第55条 谨慎返回optional

- 创建异常时会捕捉整个堆栈轨迹，因此抛出异常的开销很高。
- Optional<T> 类代表的是一个不可变的容器，它可以存放单个非null的T引用，或者什么内容都没有。不包含任何内容的optional称为空。非空的optional中的值称作存在。optional本质上是一个不可变的集合，最多只能存放一个元素。
- 永远不要通过返回Optional的方法返回null：因为它彻底违背了optional的本意。
- 容器类型包括集合、映射、Stream、数组和optional，都不应该被包装在optional中。
- 何时应该声明一个方法来返回Optional<T>而不是返回T呢？规则是：如果无法返回结果并且当没有返回结果时客户端必须执行特殊的处理，那么就应该声明该方法返回Optional<T>。
- optional不适用于一些注重性能的情况。
- 永远不应该返回基本包装类型的optional，“小型的基本类型”(Boolean, Byte, Character, Short和Float)除外。
- 几乎永远都不适合用optional作为键，值，或者集合或数组中的元素。
- 总而言之，如果发现自己在编写的方法始终无法返回值，并且相信该方法的用户每次在调用它时都要考虑到这种可能性，那么或许就应该返回一个optional。
- 尽量不要讲optional用作返回值以外的任何其他用途。

```java
public static <E extends Comparable<E>> Optional<E> max2(Collection<E> c) {
		if (c.isEmpty()) {
			return Optional.empty();
		}
		E result = null;
		for (E e : c) {
			if (result == null || e.compareTo(result) > 0) {
				result = Objects.requireNonNull(e);
			}
		}
		return Optional.of(result);
	}

/**
* 使用stream的方式
*/
	public static <E extends Comparable<E>> Optional<E> max3(Collection<E> c) {
		return c.stream().max(Comparator.naturalOrder());
	}

	//客户端代码样例
	List<String> words = new ArrayList<String>();
		//确定会有值
		String maxWord2 = max3(words).get();
		//缺省值
		String maxWord = max3(words).orElse("No Words");
		//抛出异常
		String word2 = max3(words).orElseThrow(NullPointerException::new);
```

### 第56条 为所有导出的API元素编写文档注释

- 为了正确地编写API文档，必须在每个被导出的类、接口、构造器、方法和域声明之前增加一个文档注释。
- 方法的文档应该简洁地描述出它和客户端之间的约定：应该说明这个方法做了什么，而不是说明它是如何完成这项工作的
- 通则：文档注释在源代码和产生的文档中都应该是易于阅读的。
- 为了避免混淆，同一个类或者接口中的两个成员或者构造器，不应该具有同样的概要描述
- 当为泛型或者方法编写文档时，确保要在文档中说明所有的类型参数
- 当为枚举类型编写文档时，要确保在文档中说明常量
- 为注解类型编写文档时，要确保在文档中说明所有成员。
- 类或者静态方法是否线程安全，应该在文档中对它的线程安全级别进行说明
- 唯一确定了解的方式，就是去阅读由Javadoc工具生成的网页

## 第九章 通用编程

### 第57条 将局部变量的作用域最小化

- 要使局部变量的作用域最小化，最有力的方法就是在第一次要使用它的地方进行声明
- 几乎每一个局部变量的声明都应该包含一个初始化表达式。如果你还没有足够的信息来对一个变量进行有意义的初始化，就应该推迟这个声明，知道可以初始化为止。
- 因此，如果在循环终止之后不再需要循环变量的内容，for循环就优先于while循环。
- 最后一种“将局部变量的作用域最小化”的方法是使方法小而集中。

```java
Collection<String> strings = new ArrayList<String>();
		for (String string : strings) {
			//do something
		}

		for(Iterator<String> i = strings.iterator(); i.hasNext();) {
			String e = i.next();
			//do something, maybe remove
		}
```

### 第58条 for-each循环优先于传统的for循环

- 简化代码，减少出错
- 三种无法使用for-each循环的情况：
	- 解构过滤：例如需要调用remove。java8可以尝试collection的removeif方法
	- 转换：如果需要遍历列表或者数组，并取代它的部分或全部元素的值，就需要列表迭代器或者数组索引，以便设定元素的值
	- 平行迭代：如果需要并行地遍历多个集合，就需要显式地控制迭代器或者索引变量
- 总而言之，与传统的for循环相比，for-each循环在简洁性、灵活性以及出错预防性方面都占有绝对优势，并且没有性能惩罚的问题。

### 第59条 了解和使用类库

- 通过使用标准类库，可以充分利用这些编写标准类库的专家的知识，以及在你之前的其他人的使用经验。
- 例如，现在选择随机数生成器时，大多使用 ThreadLocalRandom 。对于Fork Join Pool和并行Stream，则使用SplittableRandom。（安全性高的SecureRandom）
- 每个程序员都应该熟悉java.lang, java.util, java.io及其子包中的内容。
- java.util.concurrent, Collections Framework（集合框架），Strema类库
- 如果你在java类库中找不到所需要的功能，下一个选择应该是在高级的第三方类库中寻找，比如Google优秀的开源Guava类库
- 总而言之，不要重复发明轮子

### 第60条 如果需要精确的答案，请避免使用float和double

- float和double类型尤其不适合用于货币计算，因为要让一个float或者double精确地表示0.1（或者10的任何其他负数次方值）是不可能的
- 使用BigDecimal，int或者long进行货币计算
- BigDecimal有两个缺点：很不方便，而且速度很慢。优点是可以完全控制舍入，有8种舍入模式可供选择。
- 如果数值范围没有超过9位十进制数字，就可以使用int；如果不超过18位数字，就可以使用long；如果数值可能超过18位数字，就必须使用BigDecimal。

### 第61条 基本类型优先于装箱基本类型

- 基本类型和装箱基本类型之间有三个主要区别：
	- 基本类型只有值，而装箱基本类型则具有与他们的值不同的同一性
	- 基本类型只有函数值，而每个装箱基本类型则都有一个非函数值，除了它对应基本类型的所有函数值外，还有一个null
	- 基本类型通常比装箱基本类型更节省时间和空间。
- 对装箱基本类型运用 == 操作符几乎总是错误的
- 当在一项操作中混合使用基本类型和装箱基本类型时，装箱基本类型就会自动拆箱
- 应该使用装箱基本类型的时候：
	- 作为集合中的元素、键和值
	- 在参数化类型和方法中，必须使用装箱基本类型作为类型参数，因为Java不允许使用基本类型
	- 在进行反射调用时，必须使用装箱基本类型
- 总而言之，当可以选择时，基本类型要优先于装箱基本类型，要注意装箱的风险以及性能损耗，以及拆箱的NPE异常。

### 第62条 如果其他类型更合适，则尽量避免使用字符串

- 字符串不适合代替其他的值类型
- 字符串不适合代替枚举类型
- 字符串不适合代替聚合类型
- 字符串不适合代替能力表
- 总而言之，如果可以使用更加合适的数据类型，或者编写更加适当的数据类型，就应该避免用字符串来表示对象。

### 第63条 了解字符串连接的性能

- 为了获得接受的性能，请用StringBuilder代替String
- 不要使用字符串连接操作符来合并多个字符串

### 第64条 通过接口引用对象

- 如果有合适的接口类型存在，那么对于参数，返回值、变量和域来说，就都应该使用接口类型进行声明
- 如果养成了用接口作为类型的习惯，程序将会更加灵活
- 如果没有合适的接口存在，完全可以用类而不是接口来引用对象，例如值类型
- 不存在适当接口类型的第二种情形是，对象属于一个框架，而框架的基本类型是类。此时应该用相关的基类来应用这个对象。
- 最后一种情形是，类实现了接口但它也提供了接口中不存在的额外方法——例如PriorityQueue中提供了没有出现在Queue中的comparator方法
- 如果没有合适的接口，就用类层次结构中提供了必要功能的最小的具体类来引用对象吧。

### 第65条 接口优先于反射机制

- 核心反射机制，java.lang.reflect包，提供了“通过程序来访问任意类”的能力。给定一个Class对象，可以获得Constructor、Method和Field实例，它们分别代表了该Class实例所表示的类的构造器、方法和域。这些对象提供了“通过程序来访问类的成员名称、域类型、方法签名等信息”的能力。
- 反射机制的代价：
	- 损失了编译时类型检查的优势，包括异常检查
	- 执行反射访问所需要的代码非常笨拙和冗长
	- 性能损失
- 如果你会怀疑自己的应用程序是否也需要反射机制，它很有可能是不需要的。
- 如果只是以非常有限的形式使用反射机制，虽然也要付出代价，但是可以获得许多好处。许多程序必须用到的类在编译时是不可用的，但是在编译时存在适当的接口或者超类，通过它们可以引用这个类。如果是这种情况，就可以用反射方式创建实例，然后通过它们的接口或者超类，以正常的方式访问这些实例。
- 类对于在运行时可能不存在的其他类、方法或者域的依赖性，用反射法进行管理是合理的，但是很少使用。
- 总而言之，反射机制是一种强大的机制，对于特定的复杂系统编程任务，它是非常必要的，但它也有一些缺点。

### 第66条 谨慎地使用本地方法

- Java Native Interface (JNI) 允许java应用程序调用本地方法，所谓本地方法是指用本地编程语言（比如C或者C++）来编写的方法。
- 使用本地方法来提高性能的做法不值得提倡：目前JVM的实现变得越来越快。
- 使用本地方法有一些严重的缺陷：
	- 本地语言不是安全的，不能免收内存损坏错误
	- 本地语言与平台相关，使用本地方法的应用程序也不在是可自由移植的
	- 使用本地方法的应用程序更难调试
- 总而言之，在使用本地方法之前务必三思。

### 第67条 谨慎地进行优化

> 很多计算上的过失都被归咎于效率（没有达到必要的效率），而不是任何其他原因——甚至包括盲目地做傻事。——Wiliam A. Wulf
> 不要去计较效率上的一些小小的得失，在97%的情况下，不成熟的优化才是一切问题的根源。 —— Donald E. Knuth
> 在优化方面，我们应该遵守两条规则：规则1：不要进行优化； 规则2（近针对专家）：还是不要进行优化——也就是说，在你还没有绝对清晰的未优化方案之前，请不要进行优化。——M. A. Jackson

- 优化的弊大于利，特别是不成熟的优化。在优化过程中，产生的软件可能既不快速，也不正确，而且还不容易修正。
- 不要为了性能而牺牲合理的结构。要努力编写好的程序而不是快的程序。
- 必须在设计过程中考虑到性能问题。
- 要努力避免那些限制性能的设计决策。当一个系统设计完成之后，其中最难以更改的组件是那些指定了模块之间交互关系以及模块与外界交互关系的组件。在这些设计组件中，最主要的是API，交互层协议以及永久数据格式。
- 要考虑API设计决策的性能后果。
- 为了获得好的性能而对API进行包装，这是一种非常不好的想法。
- 一旦精心设计了程序，并且产生二楼一个清晰、简明、结构良好的实现，那么就到了该考虑优化的时候了，假定此时你对于程序的性能还不满意。
- 在每次试图做优化之前和之后，要对性能进行测量。
- 性能剖析工具有助于决定应该把优化的重点放在哪里。（jmh不是一个性能剖析器，而是微基准测试框架）
- 总而言之，不要费力去编写快速的程序——应该努力编写好的程序，速度自然会随之而来。但在设计系统的时候，特别是在设计API、交互层协议和永久数据格式的时候，一定要考虑性能的因素。

### 第68条 遵守普遍接受的命名惯例

- 命名惯例分为两大类：字面的和语法的
- 类型参数名称通常由单个字母组成：T表示任意类型，E表示结合的元素类型，K和V表示映射的键和值类型，X表示异常。函数的返回类型通常是R。任何类型的序列可以是T、U、V或者T1、T2、T3
- 总而言之，把标准的命名惯例当做一种内在的机制来看待，并且学着用它们作为第二特性。

## 第十章 异常

### 第69条 只针对异常的情况才使用异常

- 异常应该只用于异常的情况；它们永远不应该用于正常的控制流。
- 设计良好的API不应该强迫它的客户端为了正常的控制流而使用异常。


### 第70条 对可恢复的情况使用受检异常，对编程错误使用运行时异常

- java的三种可抛出异常：
	- 受检异常（Checked Exception）
	- 运行时异常（Runtime Exception）
	- 错误（Error）
- 如果期望调用者能够适当地恢复，对于这种情况就应该使用受检异常。方法中声明要抛出的每个受检异常，都是对API用户的一种潜在提示：与异常相关联的条件式调用这个方法的一种可能的结果。
- 两种未受检异常的可抛出结构：运行时异常和错误。在行为上两者是等同的：它们都是不需要也不应该被捕获的可抛出结果。如果程序抛出未受检的异常或者错误，往往就属于不可恢复的情形，继续执行下去有害无益。
- **用运行时异常来表明编程错误**
- 如果你相信一种情况可能允许恢复，就使用受检异常；如果不是，则使用运行时异常。
- 你实现的所有未受检的抛出结构都应该是RuntimeException的子类。不仅不应该定义Error子类，甚至也不应该抛出AssertionError异常。
- 异常也是个完全意义上的对象，可以在它上面定义任意的方法。这些方法的主要用途是为捕获异常的代码而提供额外的信息，特别是关于引发这个异常条件的信息。
- 总而言之，对于可恢复的情况，要抛出受检异常；对于程序错误，要抛出运行时异常。不确定是否可恢复，则抛出未受检异常。不要定义任何既不是受检异常也不是运行时异常的抛出类型。要在受检异常上提供方法，以便协助恢复。

### 第71条 避免不必要地使用受检异常

- 受检异常强迫程序员处理异常的条件，大大增强了可靠性，也使API使用起来非常不方便，并且抛出受检异常的方法不能直接在Stream中使用
- 如果正确地使用API并不能阻止这种异常条件的产生，并且一旦产生异常，使用API的程序员可以立即采取有用的动作，这种负担就被认为是正当的。除非这两个条件都成立，否则更适合于使用未受检异常。
- 消除受检异常最容易的方法是，返回所要的结果类型的一个Optional。
- 把受检异常变成未受检异常的一种方法是，把这个抛出异常的方法分成两个方法，其中，第一个方法返回boolean值，表明是否应该抛出异常。
- 总而言之，在谨慎使用的前提下，受检异常可以提升程序的可读性；如果过度使用，将会使API使用起来非常痛苦。

```java
try {
	obj.action(args);
} catch(TheCheckedException e) {
	//handle exception condition
}

重构为

if (obj.actionPermited(args)) {
	obj.action(args);
} else {
	// handle exception condition
}
```

### 第72条 优先使用标准的异常

- 专家追求并且通常也能够实现高度的代码重用
- 最经常被重用的异常类型是IllegalArgumentException，表示参数值不合适
- 另一个经常被重用的异常是IllegalStateException，表示因为接受对象的状态而使调用非法，例如未完成初始化对象的调用
- 常用异常：NullPointerException, IndexOutOfBoundsException, ConcurrentModificationException, UnsupportedOptionException
- 不要直接重用Exception， RuntimeException， Throwable或者Error，这是超类，无法可靠的测试
- 如果希望稍微增加更多的失败-捕获信息，可以放心地子类化标准异常

### 第73条 抛出与抽象对应的异常

- 更高层的实现应该捕获低层的异常，同时抛出可以按照高层抽象进行解释的异常
- 异常链：如果低层异常对于调试导致高层异常的问题非常有帮助，使用异常链就很合适。如代码所示。
- 尽管异常转译与不加选择地从低层传递异常的做法相比有所改进，但是也不能滥用它。
- 如有可能，处理来自低层异常的最好做法是，在调用低层方法之前确保他们会成功执行，从而避免他们抛出异常。
- 总而言之，如果不能阻止或者处理来自更低层的异常，一般的做法是使用异常转译，只有在低层方法的规范碰巧可以保证“它所抛出的所有异常对于更高层也是合适的”情况下，才可以将异常从低层传播到高层。异常链对高层和低层异常都提供了最佳的功能：它允许抛出适当的高层异常，同时又能捕获低层的原因进行失败分析。

```java
try {
	//
} catch(LowerLevelException cause) {
		throw new HigherLevelException(cause);
}

```

### 第74条 每个方法抛出的所有异常都要建立文档

- 始终要单独地声明受检异常
- 准确地记录下抛出每个异常的条件
- 使用 javadoc 的 @throws 标签记录下一个方法可能抛出的每个未受检异常，但是不要使用throws关键字将未受检的异常包含在方法的声明中。
- 如果一个类中的许多方法出于同样的原因而抛出同一个异常，在该类的文档注释中对这个异常建立文档，这是可以接受的。
- 总而言之，要为你编写的每个方法所能抛出的每个异常建立文档。

### 第75条 在细节消息中包含失败-捕获信息

- 为了捕获失败，异常的细节信息应该包含“对该异常有贡献”的所有参数和域的值。
- 千万不要在细节消息中包含密码，密钥以及类似的信息。
- 为异常的失败-捕获信息提供一些访问方法是合适的

### 第76条 努力使失败保持原子性

- 一般而言，失败的方法调用应该使对象保持在被调用之前的状态，具有这种属性的方法被称为具有 **失败原子性**
- 最简单的方法莫过于设计一个不可变对象
- 对于可变对象，获得失败原子性的最常见方法是，在执行操作之前检查参数的有效性。
- 一种类似的获得失败原子性的方法是，调整计算处理的熟悉怒，使得任何可能会失败的计算部分都在对象状态被修改之前发生。
- 第三种获得失败原子性的方法是，在对象的一份临时拷贝上执行操作
- 最后一种获得失败原子性的方法是，编写一段恢复代码，由它来拦截操作过程中发生的失败，以及使对象回滚到操作开始之前的状态上
- 总而言之，作为方法规范的一部分，它产生的任何异常都应该让对象保持在调用该方法之前的状态。或者在文档中声明异常时对象处于什么样的状态


### 第77条 不要忽略异常

- 空的catch快会使异常达不到应有的目的，即强迫你处理异常的情况。
- 如果选择忽略异常，catch块中应该包含一条注释，说明为什么可以这么做，并且变量应该命名为ignored。


## 第十一章 并发

### 第78条 同步访问共享的可变数据

- 关键字 **synchronized** 可以保证同一时刻，只有一个线程可以执行某一个方法，或者某一个代码块。
- 如果没有同步，一个线程的变化就不能被其他线程看到。同步不仅可以组织一个线程看到对象处于不一致的状态之中，它还可以保证进入同步方法或者同步代码块的每个线程，都能看到由同一个锁保护的之前所有的修改结果。
- Java语言规范保证读或者写一个变量是原子的，除非这个变量的类型为long或者double。
- 为了在线程之间进行通信，也为了互斥访问，同步是必要的。
- 千万不要使用 Thread.stop()方法。
- 除非读和写操作都被同步，否则无法保证同步能起作用。
- volatile不执行互斥访问，它可以保证任何一个线程在读取域的时候都将看到最近刚刚被写入的值。
- 避免本条所讨论的问题的最佳方法是不共享可变的数据。要么共享不可变的数据，要么压根不共享。**将可变数据限制在单个线程中**
- 总而言之，当多个线程共享可变数据的时候，每个读或者写数据的线程都必须执行同步。

### 第79条 避免过度同步

- 为了避免活性失败和安全性失败，在一个被同步的方法或者代码块中，永远不要放弃对客户端的控制。
- java类库：并发集合CopyOnWriteArrayList
- 通常来说，应该在同步区域内做尽可能少的工作
- 过度同步的实际成本是指失去了并行的机会；限制虚拟机优化代码执行的能力
- 总而言之，为了避免死锁和数据破坏，千万不要从同步区域内部调用外来方法。要尽量将同步区域内部的工作量限制到最少。

### 第80条 executor， task和stream优先于线程

> Executor Framework所做的工作是执行，Collections Framework所做的工作是聚合

- java.util.concurrent.Executors类包含了静态工厂，能为你提供所需的大多数executor。如果你想来点特别的，可以直接使用ThreadPoolExecutor类，这个类允许你控制线程池操作的几乎每个方面。
- Executor Framework中，工作单元和执行机制是分开的。现在的关键抽象是工作单元，称作任务(task)。任务有两种Runnable及其近亲Callable（与Runnable类似，但它会返回值，并且能够抛出任意的异常）
- 扩展内容：fork-join池，ForkJoinTask实例

### 第81条 并发工具优先于wait和notify

- 既然正确的使用wait和notify比较困难，就应该用更高级的并发工具来代替。
- java.util.concurrent中更高级的工具分成三类：Executor Framework、并发集合（Concurrent Collection）以及同步器(Synchronizer)。
- 并发集合为标准的集合接口提供了高性能的并发实现
- 同步器是使线程能够等待另一个线程的对象，允许它们协调动作。最长用的同步器是CountDownLatch和Semaphore，较不常用的是CyclicBarrier和Exchangr，功能最强大的同步器是Phaser。
- 对于间歇性的定时，始终应该优先使用System.nanoTime，而不是使用System.currentTimeMillis。因为nanoTime更准确，也更精确
- wait方法被用来使线程等待某个条件，它必须在同步区域内部被调用，这个同步区域将对象锁定在了调用wait方法的对象上。始终应该使用wait循环模式来调用wait方法；永远不要在循环之外调用wait方法。
- notify方法唤醒的是单个正在等待的线程，假设有这样的线程存在，而notifyAll方法唤醒的则是所有正在等待的线程。
- 一种常见的说法是，应该始终使用notifyAll方法，这是合理而保守的建议。它总会产生正确的结果，因为它可以保证你将会唤醒所有需要被唤醒的线程。它总是产生正确的结果，因为它可以保证你将会唤醒所有需要被唤醒的线程，你可能也会唤醒其他一些线程，但是这不会影响程序的正确性。这些线程醒来之后，会检查它们正在等待的条件，如果发现条件并不满足，就会继续等待。
- 如果处于等待状态的所有线程都在等待同一个条件，而每次只有一个线程可以从这个条件中被唤醒，那么你就应该选择调用notify方法，而不是notifyAll方法
- 简而言之，直接使用wait方法和notify方法就像用“并发汇编语言”进行编程一样，而java.util.concurrent则提供了更高级的语言。没有理由在新代码中使用wait方法和notify方法，即使有，也是极少的。

### 第82条 线程安全性的文档化

- 线程安全性的几个级别：
	- @Immutable 不可变的(immutable):例如String, Long, BigInteger。
	- @ThreadSafe 无条件的线程安全(unconditionally thread-safe)：这个类的实例时可变的，但是这个类有足够的内部同步，所以它的实例可以被并发使用，无须任何外部同步。例如AtomicLong， ConcurrentHashMap
	- @ThreadSafe 有条件的线程安全(conditionally thread-safe): 除了有些方法为进行安全的并发使用而需要外部同步之外，这种线程安全级别与无条件的线程安全相同。例如Collections.synchronized包装返回的集合，它们的迭代器要求外部同步。
	- @ThreadSafe 非线程安全(not thread-safe): 这个类的实例是可变的，为了并发地使用它们，客户端必须利用自己选择的外部同步包围每个方法调用
	- @NotThreadSafe 线程对立的(thread-hostile): 这种类不能安全地被多个线程并发使用，即使所有的方法调用都被外部包围。线程对立的根源通常在于，没有同步地修改静态数据。
- 把锁对象封装在它所同步的对象中。
- **lock域应该始终声明为final。**
- 简而言之，每个类都应该字斟句酌的说明或者线程安全注解，清楚地在文档中说明它的线程安全属性。


### 第83条 慎用延迟初始化

- 延迟初始化是指延迟到需要域的值时才将它初始化的行为。
- 对于延迟初始化，最好建议“除非绝对必要，否则就不要这么做”
- 在大多数的情况下，正常的初始化要优先于延迟初始化。
- 如果利用延迟优化来破坏初始化的循环，就要使用同步访问方法。

```java
private FieldType field;

private synchronized FieldType getFeild() {
	if (field == null) {
		field = computeFieldValue();
	}
	return field;
}
```

- 如果出于性能的考虑而需要对静态域使用延迟初始化，就使用lazy initialization holder class模式。

```java
private static class FieldHolder {
	static final FieldType field = computeFieldValue();
}

private static FieldType getFeild() {
	return FieldHolder.field;
}
```

- 如果出于性能的考虑而需要对实例域使用延迟初始化，就使用双重检查模式。

```java
private volatile FieldType field;
private FieldType getField() {
	FieldType result = field;
	if (result == null) { //首次检查（不加锁）
		synchronized(this) {
			if (field == null) { //二次检查（加锁）
				field = result = computeFieldValue();
			}
		}
	}
	return result;
}
```

- 总而言之，大多数的域应该正常地进行初始化，而不是延迟初始化。


### 第84条 不要依赖于线程调度器

- 任何依赖于线程调度器来达到正确性或者性能要求的程序，很有可能都是不可移植的。
- 要编写出健壮、响应良好、可移植的多线程应用程序，最好的方法是确保 **可运行线程** 的平均数量不明显多于处理器的数量。
- 如果线程没有在做有意义的工作，就不应该运行。
- 不要企图通过调用Thread.yield来“修正”该程序。
- 线程优先级是Java平台上最不可移植的特征了。
- 总而言之，不要让应用程序的正确性依赖于线程调度器。


## 第十二章 序列化

> 对象序列化：用来将对象编码成字节流（序列化），并从字节流编码中重新构建对象（反序列化）。

### 第85条 其他方法优先于Java序列化

- 序列化弊大于利。
- 序列化的根本问题在于，其攻击面过于庞大，无法进行防护，并且它还在不断地扩展：对象图是通过ObjectInputStream上调用readObject方法方法进行反序列化的。这个方法其实是个神奇的构造器，它可以将类路径上几乎任何类型的对象都实例化，只要该类型实现了Serializable接口。
- 攻击面包括：java平台类库中类、第三方类库如Apache Commons Collecitons中的类，以及应用本身的类。
- **避免反序列化攻击的最佳方式是永远不要反序列化任何东西。**
- **在新编写的任何新系统中都没有理由再使用Java序列化。**
- 其他可以完成对象和字节序列之间的转化方式：**跨平台的结构化数据表示法** 跨平台支持、高性能、一个大型的工具生态系统，以及一个广阔的专家社区。
- 最前沿的跨平台结构化数据表示法是JSON和Protocol Buffers(protobuf)。
	- JSON和protobuf之间最明显的区别在于，JSON是基于文本的，人类可以阅读，而protobuf是二进制的，从根本上来说更有效；JSON纯粹就是一个数据表示法，而protobuf则提供模型(类型)，建立文档，强制正确的用法。
	- 虽然protobuf比JSON更加有效，但JSON对于基于文本的表示法却非常高效。
	- protobuf虽然是一个二进制表示法，但它提供了可以替代的另一种文本表示法(pbtxt)，当人类需要读懂它的时候可以使用。
- 如果无法避免Java序列化，最好永远 **不要反序列化不被信任的数据**，尤其是永远不应该接受来自不信任资源的RMI通信。

> 对于不信任数据的反序列化，从本质上来说是危险的，应该予以避免。

- 如果无法避免序列化，有不能绝对确保反序列化的数据的安全性，就应利用Java 9中新增的对象反序列化过滤，这一功能也已经移植到了Java较早的版本（Java.io.ObjectInputFilter）。
- 如果维护的系统是基于Java序列化的，一定要认真考虑将它迁移到跨平台的结构化数据表示法，尽管这项工作费时费力。
- 总而言之，序列化是危险的，应该与以避免。

### 第86条 谨慎地实现Serializable接口

- 实现Serializable接口而付出的最大代价是，一旦一个类被发布，就大大降低了“改变这个类的实现”的灵活。
- 应该仔细地设计一种高质量的序列化形式，并且在很长时间内都愿意使用这种形式。
- 实现Serializable的第二个代价是，它增加了出现Bug和安全漏洞的可能性。
- 实现Serializable的第三个代价是，随着类发行新的版本，相关的测试负担也会增加。当类被修订，要检查“在新版本中序列化一个实例，在旧版本中反序列化”，反之亦然。测试工作量与“可序列化的类和发行版本号”的乘积成正比。
- 实现Serializable接口并不是一个很轻松就可以做出的决定。根据经验，值类、大多数集合类应该实现Serializable接口；代表互动实体的类一般不应实现Serializable接口。
- 为了继承而设计的类应该尽可能少的实现Serializable接口，用户的接口也应该尽可能少继承Serializable接口。
	- 为了继承而设计的类中，真正实现了Serializable接口的有Throwable类和Component类。
- 内部类不应实现Serializable接口。

### 第87条 考虑使用自定义的序列化形式

- 如果事先没有认真考虑默认的序列化形式是否合适，则不要贸然接受。一般来讲，只有当自行设计的自定义序列化形式与默认的序列化形式基本相同时，才能接受默认的序列化形式。
- 如果一个对象的物理表示法等同于它的逻辑内容，可能就适合于使用默认的序列化形式。
- 即使你确定了默认的序列化形式是合适的，通常还必须提供一个readObject方法以保证约束关系和安全性。
- 当一个对象的物理表示法与它的逻辑数据内容有实质性的区别时，使用默认序列化形式会有以下4个缺点：
	- 它使这个类的导出API永远地束缚在该类的内部表示法上
	- 它会消耗过多的的空间
	- 它会消耗过多的时间
	- 它会引起栈溢出
- 序列化规范要求你不管怎样都要调用它们，这样得到的序列化形式允许在以后的发行版本中增加非瞬时（非transient）的实例域，并且还能保持向前或向后的兼容性。
- 对于散列表而言，接受默认的序列化形式将会构成一个严重的Bug。
- 在决定将一个域做成非瞬时的之前，请一定要确信它的值将是该对象逻辑状态的一部分。如果你正在使用一种自定义的序列化形式，大多数实例域，或者所有的实例域都应该被标记为transient。
- 如果你使用默认的序列化形式，并且把一个或多个域标记为transient，则要记住，当一个实例被反序列化的时候，这些域将被初始化为它们的默认值: null, 0, false。
- 无论你是否使用默认的序列化形式，如果在读取整个对象状态的任何其他方法上强制任何同步，则也必须在对象序列化上强制这种同步。
- 不管你选择了哪种序列化形式，都要为自己编写的每个可序列化的类声明一个显式的序列版本UID。这样可避免序列版本UID成为潜在的不兼容根源。
- 不要修改序列版本UID，否则将会破坏类现有的已被序列化实例的兼容性。
- 总而言之，当你决定要将一个类做成可序列化的时候，请仔细考虑应该采用什么样的序列化形式。

```java

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class StringList implements Serializable {

	private transient int size = 0;
	private transient Entry head = null;

	private static class Entry {
		String data;
		Entry next;
		Entry previous;
	}

	public final void add(String s) {
		//TODO
	}

	private void writeObject(ObjectOutputStream s) throws IOException{
		s.defaultWriteObject();
		s.writeInt(size);

		for (Entry e = head; e != null; e = e.next) {
			s.writeObject(e.data);
		}
	}

	private void readObject(ObjectInputStream s) throws ClassNotFoundException, IOException {
		s.defaultReadObject();
		int numElements = s.readInt();
		for (int i = 0; i < numElements; i++) {
			add((String)s.readObject());
		}
	}
}

```

### 第88条 保护性地编写readObject方法

- readObject方法实际上相当于另一个公有的构造器，是一个“用字节流作为唯一参数”的构造器
- 当一个对象被反序列化的时候，对于客户端不应该拥有的对象引用，如果哪个域包含了这样的对象引用，就必须要做保护性拷贝，这是非常重要的。
- readObject方法不可以调用可被覆盖的方法，无论是直接调用还是间接调用都不可以。
- 指导方针：
	- 对于对象引用域必须保持为私有的类，要保护性的拷贝这些域中的每个对象。不可变类的可变组件就属于这一类别。
	- 对于任何约束条件，如果检查失败，则抛出一个InvalidObjectException异常。这些检查动作应该跟在所有的保护性拷贝之后。
	- 如果整个对象图在被反序列化之后必须进行验证，就应该使用ObjectInputVlidation接口（本书不讨论）
	- 无论是直接方式还是间接方式，都不要调用类中任何可被覆盖的方法。

### 第89条 对于实例控制，枚举类型优先于readResolve

- readResolve特性允许你用readObject创建的实例代替另一个实例。对于一个正在被反序列化的对象，如果它的类定义了一个readResolve方法，并且具备正确的声明，那么在反序列化之后，新建对象上的readResolve方法就会被调用。然后，该方法返回的对象引用将会被返回，取代新建的对象。在这个特性的绝大多数用法中，指向新建对象的引用不需要再被保留，因此立即成为垃圾回收的对象。

```java
private Object readResolve() {
		return INSTANCE;
}
```

- 如果依赖readResolve进行实例控制，带有对象引用类型的所有实例域则都必须声明为transient。
- 单元素的枚举类型是单例模式的最佳实现方式
- readResolve的可访问性(accessibility)很重要。
- 总而言之，应该尽可能地使用枚举类型来实施实例控制的约束条件。如果做不到，同时又需要一个既可序列化又是实例受控的类，就必须提供一个readResolver方法，并确保该类的所有实例域都为基本类型，或者是瞬时的(transient关键字)。

### 第90条 考虑用序列化代理代替序列化实例

- 序列化代理模式：首先为可序列化的类设计一个私有的静态嵌套类，精确地表示外围类的实例的逻辑状态。这个嵌套类被称作序列化代理（serialization proxy），它应该有一个单独的构造器，其参数类型就是那个外围类。这个构造器只从它的参数中复制数据：它不需要进行任何一致性检查或者保护性拷贝。从设计的角度来看，序列化代理的默认序列化形式是外围类最好的序列化形式。外围类及其序列化代理都必须声明实现Serializable接口。
- 序列化代理模式的局限性：不能与可以被客户端扩展的类相兼容；不能与对象图中包含循环的某些类相兼容。
- 总而言之，当你发现自己必须在一个不能被客户端扩展的类上编写readObject或者writeObject方法时，就应该考虑使用序列化代理模式。
