---
title: Eclipse/Maven使用JUNIT进行单元测试
tags:
  - 敏捷开发之测试
categories:
  - 敏捷开发之测试
abbrlink: 47006
date: 2018-11-12 16:03:51
---

eclipse/maven使用junit部署测试

<!-- more -->

---
### eclipse如何使用junit部署测试
在要测试的类java文件上右键，选择New -> Junit Test Case/Suite
https://mvnrepository.com/artifact/org.junit/junit5-engine/5.0.0-ALPHA

在项目上右键 Run As Junit Test 或者 Maven Test即可运行全部的测试用例

---------

### junit5 = JUnit Platform + JUnit Jupiter + JUnit Vintage
- JUnit Platform是在JVM上启动测试框架的基础。
- JUnit Jupiter是JUnit5扩展的新的编程模型和扩展模型，用来编写测试用例。
- Jupiter子项目为在平台上运行Jupiter的测试提供了一个TestEngine （测试引擎）。
- JUnit Vintage提供了一个在平台上运行JUnit 3和JUnit 4的TestEngine。

> junit5 官方中文文档：https://www.ibm.com/developerworks/cn/java/j-introducing-junit5-part1-jupiter-api/index.html

----------

### 以下适用于junit4.12

#### 运行关系：
```
@BeforeClass - runOnceBeforeClass
@Before - runBeforeTestMethod
@Test - test_method_1
@After - runAfterTestMethod
@Before - runBeforeTestMethod
@Test - test_method_2
@After - runAfterTestMethod
@AfterClass - runOnceAfterClass
```
> https://blog.csdn.net/zixiao217/article/details/52951679



#### 捆绑测试类，一次执行多个测试类SuiteClass

> https://www.cnblogs.com/weilu2/p/junit_aggregating_tests_in_suites.html

核心代码如下
```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class) //要点1
@SuiteClasses({TestJunit.class, TestJunit2.class}) //要点2
public class YourTestSuite {} //右键运行该类(Junit Test)，对包裹的类依次进行测试
```

#### 测试套件：TestCase, TestSuite

> https://www.cnblogs.com/mengdd/archive/2013/04/07/3006265.html

##### 能够一次运行多个类，进行方法的重复测试

```java
package com.weiwei.test;

//要点1. 注意引入的包是junit.framework.*
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

//要点2. 继承TestCase
public class TestTestCaseWithTestSuite extends TestCase{
    ///setUp与tearDown在所有方法之前与之后执行
    @Override
    public void setUp() {
        //before all
    }

    @Override
    public void tearDown() {
        //after all
    }

    public static Test suite() {
        //创建一个测试套件
        TestSuite suite = new TestSuite();
        //增加测试类的class对象
        suite.addTestSuite(TestJunit.class);
        suite.addTestSuite(TestJunit2.class);
        /**要点3. void junit.framework.TestSuite
            .addTestSuite(Class<? extends TestCase> testClass)
            TestJuint.class与TestJunit2.class都是TestCase的子类
        */
        return suite;
    }
}

```
