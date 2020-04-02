---
title: Head First Design Patterns HeadFirst 设计模式
tags:
  - 设计模式
categories:
  - 读书笔记
abbrlink: 20723
date: 2018-11-15 19:32:55
---

> OO原则是我们的目标，而设计模式是我们的做法。


<!-- more -->

---
## 策略模式 (Strategy)

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

## 观察者模式 (Observer)

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
## 装饰者模式 (Decorator)

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


## 工厂模式 (Factory)

> 除了new操作符之外，还有更多制造对象的方法。实例化这个活动不应该总是公开地进行，也会认识到初始化经常造成“耦合”问题。

> 理解关键点：工厂方法是将对象实例化延迟在具体子类中实现，返回不同的产品；抽象工厂模式（公共接口会抽象类）是为了创建产品家族，实现不同的工厂，制造出不同的产品、不同的区域、不同的操作系统、不同的外观及操作。

- ***工厂方法模式***：定义了一个创建对象的接口，但由子类决定要实例化的类是哪一个。工厂方法让类把实例化推迟到子类。
- ***依赖倒置原则：要依赖抽象，不要依赖具体类。***
- 几个避免你违反 ***依赖倒置*** 的指导方针
		- 变量不可以持有具体类的引用。（如果使用```new```，就会持有具体类的引用。你可以改用工厂来避开这样的做法。）
		- 不要让类派生自具体类。（如果派生自具体类，你就会依赖具体类。请派生自一个抽象——接口或抽象类）
		- 不要覆盖基类中已实现的方法。（如果覆盖基类已实现的方法，那么你的基类就不是一个真正适合被继承的抽象。基类中已实现的方法，应该由所有的子类共享）
- 不能让高层组件依赖低层组件，而且，不管高层或低层组件，“两者”都应该依赖于抽象。
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

- ***抽象工厂模式***：提供一个接口，用于创建相关或依赖对象的家族，而不需要明确指定具体类。
- 抽象工厂使用对象组合：对象的创建被实现在工厂接口所暴露出来的方法中。


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

## 单件模式 (Singleton)

> 用来创建独立无二的，只能有一个实例的对象的入场券

- 全局变量的缺点：必须在程序一开始就创建好对象，万一这个对象非常耗费资源，而程序在这次的执行过程中又一直没用到它，不就形成浪费了吗.(某些JVM在用到的时候才创建对象).
- 例如线程池、缓存、对话框、处理偏好设置和注册表的对象、日志对象，充当打印机、显卡等设备的驱动程序的对象，这些对象只能有一个。
- 单件模式常被用来管理共享资源，例如数据库连接或线程池。
- ***单件模式*** 确保一个类只有一个实例，并提供一个全局访问点。
- 在java中实现单件模式需要私有构造器、一个静态方法和一个静态变量。
- 确定在性能和资源上的限制，然后小心地选择适当的方案来实现单件，以解决多线程问题。
- 如果你使用多个 ***类加载器*** ，可能导致单件失效而产生多个实例。

```java
/**
* 未考虑并发的单件模式
*/
public class Singleton {
    private static Singleton uniqueInstance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (uniqueInstance == null) {
            uniqueInstance = new Singleton();
        }
        return  uniqueInstance;
    }
}
```

```Java
/**
* 考虑并发的单件模式
* 较好方式：双重检查加锁
* 注意：要使用volatile-synchronized(不适用于java1.4或更早之前的版本)
*
* 1. 采用“急切”创建实例，即在声明处就创建对象。如果对象在创建和运行时很繁重，不推荐此种方法。
* 2. 单纯使用synchronized设置整个方法为同步方法。性能较差
*/
public class SupportParrallSingleton {
    private volatile static SupportParrallSingleton uniqueInstance;
    public static SupportParrallSingleton getInstance(){
        if (uniqueInstance == null) {
            synchronized (SupportParrallSingleton.class) {
                if (uniqueInstance == null) {
                    uniqueInstance = new SupportParrallSingleton();
                }
            }
        }
        return uniqueInstance;
    }
}
```

## 命令模式 (Command)

> 把方法调用封装起来

- ***命令模式*** 将“请求”封装成对象，以便使用不同的请求、队列或者日志来参数化其他对象。命令模式也支持可撤销的操作。
- 命令模式将发出请求的对象和执行请求的对象解耦。
- 在被解耦的两者之间是通过命令对象进行沟通的。命令对象封装了接受者和一个或一组动作。
- 调用者通过调用命令对象的execute()发出请求，这会使得接受者的动作被调用。
- 调用者可以接受命令当做参数，甚至在运行时动态地进行。
- 命令可以支持撤销，做法是实现一个undo()方法来回到execute()被执行前的状态。
- 宏命令是命令的一个简单延伸，允许调用多个命令。宏方法可以支持撤销。
- 实际操作中，很常见使用“聪明”命令对象，也就是直接实现了请求，而不是将工作委托给接收者。
- 命令也可以用来实现日志和事务系统。
- 命令模式的更多用途：
	- ***队列请求*** 例如：日程安排、线程池、工作队列等。（想象有一个工作队列：你在一端添加命令，然后另一端则是线程。线程进行下面的动作：从队列中取出一个命令，然后调用它的execute()方法，等待这个调用完成，然后将此命令对象丢弃，再取出下一个命令……）
	- ***日志请求*** 例如：系统检查点后的一系列操作；事务处理（Transaction）


```java
/**
* 思考餐厅的下单过程：
*/
/**
*	接口：命令对象
* 例如，顾客交给服务员的订单，遥控器按钮所传输的对象
* 注意：命令对象是个接口，将请求的对象和执行请求的对象进行沟通（关联在实现中）
*/
public interface Command {
	public void execute();
}

/**
*	 注意：将请求的对象和执行请求的对象进行沟通（关联在实现中）
*/
public class LightOnCommand implements Command {
	Light light;//执行请求的对象

	public LightOnCommand(Light light) {
		this.light = light;
	}

	@Override
	public void execute() {//执行请求的对象调用的方法
		light.on();
	}
}

/**
 * 	执行请求的对象（类似：餐厅厨师）
 */
public class Light {
	public void on() {
		System.out.println("light on");
	}
}

/**
 * 	动作发起者：类似餐厅顾客
 */
public class SimpleRemoteControl {
	Command slot;

	public void setCommand(Command command) {//顾客下单
		this.slot = command;
	}

	public void buttonWasPressed() {//提交订单
		slot.execute();
	}
}

/**
* 执行流程
*/
public class CommandPatternTest {
	public static void main(String[] args) {
		SimpleRemoteControl remote = new SimpleRemoteControl();
		Light light = new Light();
		LightOnCommand lightOnCommand = new LightOnCommand(light);
		remote.setCommand(lightOnCommand);
		remote.buttonWasPressed();
	}
}
```

## 适配器模式 (Adapter) 与 外观模式

- ***适配器模式*** 将一个类的接口，转换成客户期望的另一个接口。适配器让原本接口不兼容的类可以合作无间。
- 对象适配器利用组合的方式将请求传送给被适配者。类适配器利用多重继承实现（这在java中是不可能实现的）。
- 适配器模式允许客户使用新的库和集合，无须改变“任何”代码，由适配器负责转换即可。
- ***外观模式*** 提供了一个统一的接口，用来访问子系统中的一群接口。外观定义了一个高层接口，让子系统更容易使用。
- ***装饰者*** 不改变接口，但加入责任；***外观模式*** 让接口更简单；***适配器*** 将一个接口转成另一个接口。
- ***外观*** 没有“封装”子系统的类，外观只提供简化的接口。
- ***外观*** 不只是简化接口，也将客户从组件中解耦。
- 外观和适配器可以包装许多类，但是外观的意图是简化接口，而适配器的意图是将接口转换成不同接口。
- ***“最少知识”*** 原则：只和你的密友谈话。这个原则希望我们在设计中，不要让太多的类耦合在一起，免得修改系统中一部分，会影响到其他部分。
- 在对象的方法内，我们只应该调用以下范围的方法：
	- 该对象本身
	- 被当做方法的参数而传递进来的对象
	- 此方法所创建或实例化的任何对象
	- 对象的任何组件
- 所有的设计都不免需要者衷：在抽象和速度之间取舍，在空间和时间之间平衡。
- 本章要点：
	- 当需要使用一个现有的类而其接口并不符合你的需要时，就使用适配器。
	- 当需要简化并统一一个很大的接口或一群复杂的接口时，使用外观。
	- 适配器改变接口以符合客户的期望。
	- 外观将客户从一个复杂的子系统中解耦。
	- 实现一个适配器可能需要一番功夫，也可能不费功夫，视模板接口的大小与复杂度而定。
	- 实现一个外观，需要将子系统组合进外观中，然后将工作委托给子系统执行。
	- 适配器模式有两种形式：对象适配器和类适配器。类适配器需要用到多重继承。
	- 你可以为一个子系统实现一个以上的外观。
	- 适配器将一个对象包装起来以改变其接口；装饰者将一个对象包装起来以增加新的行为和责任；而外观将一群对象“包装”起来以简化其接口。

## 模板方法模式

- ***模板方法模式*** 在一个方法中定义一个算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以在不改变算法结构的情况下，重新定义算法中的某些步骤。
- 更具体的说，这个方法将算法定义成一组步骤，其中的任何步骤都可以是抽象的，由子类负责。这可以确保算法的结构保持不变，同时由子类提供部分实现。
- 模板方法的抽象类可以定义具体方法，抽象方法和钩子
- 为了防止子类改变模板方法中的算法，可以将模板方法声明为final
- 模板方法中可以分为（hook）钩子方法和抽象方法，抽象方法子类必须自己实现，而钩子方法父类会给出默认的，子类可以覆盖，也可以不覆盖
- 钩子可以让子类实现算法中可选的部分，或让子类能够有机会对模板方法中某些即将发生的步骤做出反应
- 保持父类中的抽象方法越少越好
- ***好莱坞原则*** 别调用（打电话）我们，我们会调用（打电话给）你
- 好莱坞原则：允许低层组件将自己挂钩到系统上，但是高层组件会决定什么时候和怎样使用这些低层组价。即，高层组件对待低层组件的方式是“别调用我们，我们会调用你”
- 模板方法样例：如java: Arrays.sort()

## 迭代器(Iterator)与组合模式

- ***迭代器模式*** 提供了一种方法顺序访问一个聚合对象中的各个元素，而又不暴露其内部的表示.
- 设计原则:一个类应该只有一个引起变化的原因.
- ***组合模式*** 允许你将对象组合成树形结构来表现“整体/部分”层次结构。组合能让客户以一致的方式处理个别对象以及对象组合。
- 组合模式以单一责任设计原则换取透明性：一个元素究竟是组合还是叶节点，对客户是透明的。
- 实现组合模式时，有许多设计上的折衷。根据需要平衡透明性和安全性。

## 状态模式

- 将每个状态的行为局部化到它自己的类中
- 状态模式允许对象在内部状态改变时改变它的行为，对象看起来好像修改了它的类。

![状态模式类图](https://wx4.sinaimg.cn/mw690/733866e8ly1g1bpugzc3jj20wi0gz799.jpg)

- 状态模式允许一个对象基于内部状态而拥有不同的行为
- 和程序状态机（PSM）不同，**状态模式用类代表状态**
- Context会将行为委托给当前状态对象
- 通过将每个状态封装进一个类，我们把以后需要做的任何改变局部化了。
- 状态模式和策略模式有相同的类图，但是它们的意图不同
- 策略模式通常会用行为或算法配置Context类
- 状态模式允许Context随着状态的改变而改变行为
- 状态转换可以由State类或Context类控制
- 使用状态模式通常会导致设计中类的数目大量增加
- 状态类可以被多个Context实例共享

## 代理模式

- 控制和管理对象访问
- **代理模式** 为另一个对象提供一个替身或占位符以控制对这个对象的访问
> 远程方法调用：
> 1. 客户对象调用客户辅助对象的doBigThing()方法。
> 2. 客户辅助对象打包调用信息（变量、方法名称等），然后通过网络将它运给服务辅助对象。
> 3. 服务辅助对象把来自客户辅助对象的信息解包，找出被调用的方法（以及在哪个对象内），然后调用真正的服务对象上的真正方法。
> 4. 服务对象上的方法被调用，将结果返回给服务辅助对象。
> 5. 服务辅助对象把调用的返回信息打包，然后通过网络运回给客户辅助对象。
> 6. 客户辅助对象把返回值解包，返回给客户对象。对于客户来说，这是完全透明的。

- 代理模式为另一个对象提供代表，以便控制客户对对象的访问，管理访问的方式有许多种。
- 远程代理控制访问远程对象；虚拟代理控制访问创建开销大的资源；保护代理基于权限控制对资源的访问。
- 代理模式有许多变体，例如：缓存代理、同步代理、防火墙代理和写入时复制代理
- 代理在结构上类似装饰者，但是目的不同。装饰者模式为对象加上行为，而代理则是控制访问。
- Java内置的代理支持，可以根据需要建立动态代理，并将所有调用分配到所选的处理器。
- 就和其他的包装者一样，代理会造成你的设计中类的数目增加。

```java
/**
* 保护代理
**/
public interface PersonBean {
	String getName();
	String getGender();
	String getInterests();
	int getHotOrNotRating();

	void setName(String name);
	void setGender(String gender);
	void setInterests(String interests);
	void setHotOrNotRating(int rating);
}


/**
 * 	实际操作的类
 */
public class PersonBeanImpl implements PersonBean {
	String name;
	String gender;
	String interests;
	int rating;
	int ratingCount = 0;

	public PersonBeanImpl(String name, String gender, String interests) {
		this.name = name;
		this.gender = gender;
		this.interests = interests;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public String getGender() {
		return gender;
	}

	@Override
	public String getInterests() {
		return interests;
	}

	@Override
	public int getHotOrNotRating() {
		if (ratingCount == 0) {
			return 0;
		}
		return (rating/ratingCount);
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public void setGender(String gender) {
		this.gender = gender;
	}

	@Override
	public void setInterests(String interests) {
		this.interests = interests;
	}

	@Override
	public void setHotOrNotRating(int rating) {
		this.rating += rating;
		ratingCount++;
	}
}

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
* 所有者访问控制
*/
public class OwnerInvocationHandler implements InvocationHandler {

	PersonBean person;

	public OwnerInvocationHandler(PersonBean person) {
		this.person = person;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		try {
			if (method.getName().startsWith("get") || method.getName().startsWith("set")) {
				return method.invoke(person, args);
			} else if (method.getName().equals("setHotOrNotRating")) {
				throw new IllegalAccessException();
			}
		} catch (Exception e) {
			System.out.println();
		}
		return null;
	}

}


package com.designpattern.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
* 非所有者的访问控制
*/
public class NonOwnerInvocationHandler implements InvocationHandler {

	PersonBean person;

	public NonOwnerInvocationHandler(PersonBean person) {
		this.person = person;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		try {
			if (method.getName().startsWith("get")) {
				return method.invoke(person, args);
			} else if (method.getName().equals("setHotOrNotRating")) {
				method.invoke(person, args);
			} else if (method.getName().startsWith("set")) {
				throw new IllegalAccessException();
			}
		} catch (Exception e) {
			System.out.println();
		}
		return null;
	}

}


/**
* 使用保护代理访问
*/
package com.designpattern.proxy;

import java.lang.reflect.Proxy;

public class MatchMakingTestDrive {

	public static void main(String[] args) {
		MatchMakingTestDrive test = new MatchMakingTestDrive();
		test.drive();
	}

	public void drive() {
		PersonBean joe = new PersonBeanImpl("Joe", "Male", "Programming");
		PersonBean ownerProxy = getOwernerProxy(joe);
		System.out.println("Name is " + ownerProxy.getName());
		ownerProxy.setInterests("bowling, Go");
		System.out.println("Interests set from owner proxy");
		try {
			ownerProxy.setHotOrNotRating(10);
		} catch (Exception e) {
			System.out.println("Can't set rating from owner proxy");
		}
		System.out.println("Rating is " + ownerProxy.getHotOrNotRating());

		PersonBean nonOwernerProxy = getNonOwnerProxy(joe);
		System.out.println("Name is " + nonOwernerProxy.getName());
		try {
			nonOwernerProxy.setInterests("Bowling, Go");
		} catch (Exception ee) {
			System.out.println("Can't set interests from non owner proxy");
		}
		nonOwernerProxy.setHotOrNotRating(3);
		System.out.println("Rating set from non owner proxy");
		System.out.println("Rating is " + nonOwernerProxy.getHotOrNotRating());

	}

	public PersonBean getOwernerProxy(PersonBean person) {
		return (PersonBean)Proxy.newProxyInstance(
				person.getClass().getClassLoader(),
				person.getClass().getInterfaces(),
				new OwnerInvocationHandler(person));
	}

	public PersonBean getNonOwnerProxy(PersonBean person) {
		return (PersonBean)Proxy.newProxyInstance(
				person.getClass().getClassLoader(),
				person.getClass().getInterfaces(),
				new NonOwnerInvocationHandler(person));
	}
}

```


-

## 总结

- 封装变化
- 多用组合，少用继承
- 针对接口编程，不针对实现编程
- 为交互对象之间的松耦合而努力
- 类应该对扩展开放，对修改关闭
- 依赖抽象，不要依赖具体类
- “最少知识”原则：只和你的密友谈话
- 好莱坞原则：别调用（打电话）我们，我们会调用（打电话给）你
- 一个类应该只有一个引起变化的原因.
