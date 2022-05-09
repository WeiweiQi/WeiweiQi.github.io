---
title: 如何优雅的在Java中使用枚举enum
comments: true
date: 2021-05-31 18:40:12
categories: 后端
tags: Java
---



这是我参与更文挑战的第1天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

根据【Effective Java】[第三版]第六章，***枚举与注解*** 所述，枚举类型是指由一组固定的常量组成合法值的类型。

Talk is Cheap, Show me the Code!

##### 典型枚举模板

下面是一个个人常用的枚举enum模板。

代码分为n个部分：
1. 所有的枚举变量
    如代码所示的部分：
    ```java
        TO_PAY, TO_DELIVER, TO_RECEIVE, FINISHED;
    ```
2. 枚举的实例域
    ```java
    private final int val;
    private final String name;
    ```
    枚举天生不可变，因此，枚举的所有实例域均应该设置为final。
3. 其他类型与枚举类型相互转换的方法
    ```java
    /**
	 * 	枚举转int
	 * @return
	 */
	public int getVal() {
		return val;
	}
        
        /**
	 * 	int转枚举
	 * @param val
	 * @return
	 */
	public static OrderState getOrderState(int val) {
		for (OrderState orderState : OrderState.values()) {
			if (orderState.val == val) {
				return orderState;
			}
		}
		throw new RuntimeException("错误的订单状态");
	}
        
    ```
    其中特别注意：values()这个方法，该方法按顺序返回枚举的所有值数组。
4. 抽象方法
   
    通过抽象方法，我们可以避免使用switch-case语句，以避免在以后新增枚举值时，忘记给对应值添加相关特殊操作。
     枚举中也可以使用switch-case。
     【Effective Java】中：***“枚举中的switch-case语句适合于给外部的枚举类型增加特定于常量的行为”。*** 

```java
/**
 * 	订单状态
 */
public enum OrderState {
	TO_PAY("待付款", 0) {
		@Override
		public boolean deliver() {
			return false;
		}
	},
	TO_DELIVER("待发货", 1) {
		@Override
		public boolean deliver() {
			return true;
		}
	},
	TO_RECEIVE("待收货", 2) {
		@Override
		public boolean deliver() {
			return false;
		}
	},
	FINISHED("已完成", 3) {
		@Override
		public boolean deliver() {
			return false;
		}
	};
	
	/**
	 * 	枚举天生不可变，所有的域都应声明为final
	 */
	private final int val;
	private final String name;
	
	/**
	 * 	私有修饰，防止外部调用
	 * @param name
	 * @param val
	 */
	private OrderState(String name, int val) {
		this.name = name;
		this.val = val;
	}

	/**
	 * 	枚举转int
	 * @return
	 */
	public int getVal() {
		return val;
	}

	public String getName() {
		return name;
	}
	
	/**
	 * 	int转枚举
	 * @param val
	 * @return
	 */
	public static OrderState getOrderState(int val) {
		for (OrderState orderState : OrderState.values()) {
			if (orderState.val == val) {
				return orderState;
			}
		}
		throw new RuntimeException("错误的订单状态");
	}
	
	/**
	 * 	抽象方法：发货
	 * @return
	 */
	public abstract boolean deliver();
	
}

```

##### 何时应该使用枚举

每当需要一组固定常量并在编译时就知道其成员的时候，就应该使用枚举。
但是，枚举类型中的常量集并不一定要始终保持不变。

##### 枚举的小缺陷

装载和初始化枚举时，需要空间与时间成本，几乎可以忽略。
