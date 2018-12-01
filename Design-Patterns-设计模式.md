---
title: Head First Design Patterns HeadFirst 设计模式
date: 2018-11-15 19:32:55
tags:
	- 设计模式
categories:
- 读书笔记
---

> OO原则是我们的目标，而设计模式是我们的做法。


<!-- more -->

---
## 策略模式(Strategy)

> 在软件开发上，一直不变的真理是“change”。不管软件设计的多好，一段时间之后，总是要成长与改变，否则软件就会“死亡”。

- ***策略模式(Strategy)：定义算法族，分别封装起来，让它们之间可以互相替换，此模式让算法的变化独立于使用算法的客户。***
- 代码关键点：某个行为设计为接口，行为的具体实现由具体类来完成。
- 书中例子：鸭子与鸭子的行为，以组合的方式组织，鸭子的行为以接口表示，接口可能有多个具体的实现形式。具体的鸭子类可以动态的设置行为的具体方式。
- 封装变化：找出应用中可能需要变化之处，把它们独立出来，不要和那些不需要变化的代码混在一起。把会变化的部分取出并“封装”起来，好让其他部分不会受到影响。
- 针对“接口”编程，而不是针对实现编程。
- 多用组合，少用继承。
- 建立可维护的OO系统，要诀就在于随时想到系统以后可能需要的变化以及应付变化的原则。
- 良好的OO设计必须具备可复用、可扩充、可维护三个特性。
- 大多数的模式和原则，都着眼于软件变化的主题。  
- 大多数的模式都允许系统局部改变独立于其他部分。我们常把系统中会变化的部分抽出来封装。

----

## 观察者模式(Observer)

> 设计原则：为了交互对象之间的松耦合而努力

- ***观察者模式定义了对象之间的一对多依赖，这样一来，当一个对象改变状态时，它的所有依赖者都会收到通知并自动更新。***
- 被观察者是真正拥有数据，观察者是其依赖者，在数据变化时更新，这样比起让许多对象控制同一份数据，可以得到更干净的OO设计。
- 代码关键点：在被观察者类/数据类中加入了观察者类的注册list成员列表，在列表中的成员为注册成员，接收数据通知。“拉”数据的模式还要求观察者类中包含一个被观察者成员变量。
- ***推Push***与***拉Pull***：观察者获取数据的方式是通过notifyObserver(Object)进行传输，或观察者调用被观察者的getData()获取数据。一般认为“推的方式更正确” [观点：例如数据的变动很频繁，让观察者拉数据不一定能够满足要求，各个观察者所获取的数据也可能是不一致的]。
- 消息传递链条(方法调用步骤)
    - 数据源数据变化
    - 调用自身的setData(...);
    - 调用数据改变方法setChanged();//便于控制消息通知
    - 调用notifyObservers(Obj);//推与拉的关键仅仅在于Object是否传输
    - for each O in Observers , .o.update()
- 一对多，松耦合
- 若调用java.util.Observerable，不要依赖于观察者被通知的次序。
- 观察者和可观察者之间用松耦合方式结合，可观察者不知道观察者的细节，只知道观察者实现了观察者接口update()。
- 有多个观察者时，不可以依赖特定的通知次序。
- Java有多种观察者模式的实现，包括了通用的java.util.Observerable.
- 此模式被应用在许多地方，例如许多的GUI框架/Swing，JavaBeans、RMI。
```java
//被观察者
public class WeatherData implements Subject {
    private List observers;//关键点1
    private Object data;
    private boolean changed;

    public WeatherData() {
        observers = new ArrayList();
    }

    public void registerObserver(Observer o) {...}//注册
    public void removeObserver(Observer o) {...}//移除s

    public void setData(Object data) {//更新数据
        this.data = data;
        dataChanged();
    }

    public void dataChanged() {
        setChanged();
        if(是否达到推送更新数据条件) {
            notifyObservers();
        }
    }
    public void setChanged() {//数据已改变
        changed = true;
    }

    /**
    * arg即为所要传送的数据，如果为拉模式，arg=null, 数据在所传输的this被观察者对象中
    */
    public void notifyObservers(Object arg) {
        if(changed) {
            for(Observer observer : observers) {
                observer.update(this, arg);
            }
            changed = false;
        }
    }
}

public class OneObserver implements Observer {
    private Subject weatherData;//关键点2
    private Object data;

    public OneObserver(Subject s) {//构造器，注册
        this.weatherData = s;
        weatherData.registerObserver(this);
    }

    public void update(Object observerable, Object arg) {//更新数据接口
        this.data = arg;
    }
}
```

---
## 装饰者模式

> 给爱用继承的人一个全新的设计眼界

- ***开放-关闭原则***：类应该对扩展开放，对修改关闭。
- 装饰者模式：动态地将责任附加到对象上。若要扩展功能，装饰者提供了比继承更有弹性的替代方案。
    - 装饰者和被装饰对象有相同的超类型。在任何需要原始对象的场合，可以用装饰过的对象替代它。
    - 可以用一个或多个装饰者包装一个对象。
    - 用装饰来包裹一个对象，动态的扩展功能
    - ***装饰者可以在被委托装饰者的行为之前与/或之后，加上自己的行为，已达到特定的目的。***
	- 对象可以在任何时候被装饰，所以可以在运行时动态地、不限量地用你喜欢的装饰者来装饰对象。
- Java库中的装饰者模式：
    - Java I/O
    - Reader/Writer
![Java I/O](https://t1.picb.cc/uploads/2018/11/24/JFtkYv.png)
- 装饰者模式缺点：常常造成设计中有大量的小类，数量实在太多，可能造成使用此API程序员的困扰。
- 要点：
	- 继承属于扩展形式之一,但不见得是达到弹性设计的最佳方式。
	- 在我们的设计中，
```java
/**
 * 	被装饰者基类
 */
public abstract class BaseBeverage {
	String description = "Unknown Beverage";

	public String getDescription() {
		return description;
	}

	public abstract double cost();
}


/**
 * 	装饰者基类
 */
public abstract class BaseCondimentDecorator extends BaseBeverage {
	public abstract String getDescription();
}


/**
 * 	被装饰者实体类
 */
public class Espresso extends BaseBeverage {
	public Espresso() {
		description = "Espresso";
	}

	@Override
	public double cost() {
		return 1.99;
	}
}

/**
 *	装饰者实体类
 */
public class Mocha extends BaseCondimentDecorator {
	BaseBeverage beverage;

	public Mocha(BaseBeverage beverage) {
		this.beverage = beverage;
	}
	@Override
	public String getDescription() {
		return beverage.getDescription() + ", Mocha";
	}

	@Override
	public double cost() {
		return 0.2 + beverage.cost();
	}
}

/**
*  装饰者使用方法
*/
public class StarBuzzCoffee {
	public static void main(String[] args) {
		BaseBeverage beverage = new Espresso();
		System.out.println(beverage.getDescription() + "￥" + beverage.cost());

		BaseBeverage beverage2 = new Espresso();
		beverage2 = new Mocha(beverage2);
		beverage2 = new Mocha(beverage2);
		System.out.println(beverage2.getDescription() + "￥" + beverage2.cost());
	}
}
```


## 工厂模式(Factory)

> 除了new操作符之外，还有更多制造对象的方法。实例化这个活动不应该总是公开地进行，也会认识到初始化经常造成“耦合”问题。

> 理解关键点：工厂方法是将对象实例化延迟在具体子类中实现，返回不同的产品；抽象工厂模式（公共接口会抽象类）是为了创建产品家族，实现不同的工厂，制造出不同的产品、不同的区域、不同的操作系统、不同的外观及操作。

- ***工厂方法模式***：定义了一个创建对象的接口，但由子类决定要实例化的类是哪一个。工厂方法让类把实例化推迟到子类。
- ***依赖倒置原则：要依赖抽象，不要依赖具体类。***
- 几个避免你违反 ***依赖倒置*** 的指导方针
		- 变量不可以持有具体类的引用。（如果使用```new```，就会持有具体类的引用。你可以改用工厂来避开这样的做法。）
		- 不要让类派生自具体类。（如果派生自具体类，你就会依赖具体类。请派生自一个抽象——接口或抽象类）
		- 不要覆盖基类中已实现的方法。（如果覆盖基类已实现的方法，那么你的基类就不是一个真正适合被继承的抽象。基类中已实现的方法，应该由所有的子类共享）
- 不能让高层组件依赖低层组件，而且，不管高层或低层组件，“两者”都应该依赖于抽象。
- ***抽象工厂模式***：提供一个接口，用于创建相关或依赖对象的家族，而不需要明确指定具体类。
- 工厂方法用来处理对象的创建，并将这样的行为封装在子类中。这样，客户程序中关于超类超类的代码就和子类对象创建代码解耦了。
- 工厂方法模式通过让子类决定该创建的对象是什么，来达到将对象创建的过程封装的目的。

```java
/**
* 工厂方法模式
*/
public abstract class ProductFactory {
    //获取对象
    public Product getProduct(String type) {
        Product product;
        product = createProduct(type);

        //call product same method
        product.prepare();
        product.bake();
        product.cut();
        product.box();

        return product;
    }

    //工厂方法
    public abstract Product createProduct(String type);
}


public abstract class Product {
    String  name;
    void prepare() { }
    void bake() { }
    void cut() { }
    void box() { }
}

abstract Product factoryMethod(String);
/**
*	1. 工厂方法是抽象的，所以依赖子类来处理对象的创建；
* 2. 工厂方法必须返回一个产品。超类中定义的方法，通常使用到工厂方法的返回值。
*	3. 工厂方法将客户和实际创建具体产品的代码分隔开来。
*	4. 工厂方法可能需要参数来指定所要的产品。
*/

```

```Java
/**
* 抽象产品类
*/
public abstract class Product {
    String name;
    String source;
    abstract void prepare();
}

/**
* 抽象原料工厂
*/
public abstract class ProductIngredientFactory {
    void createSource() { }
}


/**
* 具体产品类
*/
public class RealProduct extends  Product {
    //生产产品所需的某种原料的工厂
    ProductIngredientFactory ingredientFactory;

    public RealProduct(ProductIngredientFactory ingredientFactory) {
        this.ingredientFactory = ingredientFactory;
    }

    @Override
    void prepare() {
        source = ingredientFactory.createSource();
    }
}


```



## 总结

- 封装变化
- 多用组合，少用继承
- 针对接口编程，不针对实现编程
- 为交互对象之间的松耦合而努力
- 对扩展开放，对修改关闭
