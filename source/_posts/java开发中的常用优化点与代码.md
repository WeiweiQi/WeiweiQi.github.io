---
title: java开发中的常用优化点与代码
comments: true
date: 2021-05-07 16:57:25
categories: 后端
tags: Java
---

#### 1. 循环删除元素

```java
List list = ....
Iterator<T> it = list.iterator();
while(it.hasNext()) {
    T element = it.next()
	if(shouldBeDeletedObject(element)) {
        // 删除元素
        it.remove()
    }
}
```

#### 2. parallelStream代替foreach

parallelStream，并行处理流。

[When to use parallel streams](http://gee.cs.oswego.edu/dl/html/StreamParallelGuidance.html) 何时应该使用parallelStream，概述为：当操作是独立的并且计算量大或者应用于高效可拆分数据结构的许多元素时，或者考虑同时使用这两种方法时，请考虑使用`S.parallelStream().operation(F)`代替`S.stream().operation(F)`。

更详细地：

- **F**，每个元素的函数（通常为lambda）是独立的：每个元素的计算均不依赖于或不影响任何其他元素的计算。（有关使用无状态无干扰功能的更多指导，请参阅 [流包摘要](http://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)。）
- **S**，源集合可以有效地拆分。除了Collections之外，还有其他一些易于并行化的流源，例如java.util.SplittableRandom（可以使用该`stream.parallel()`方法来并行化）。但是大多数基于IO的源主要是为顺序使用而设计的。
- 执行*顺序*版本的总时间超过了最小阈值。**大多数平台的阈值大约为100微秒**（十分之一）。不过，您不需要精确地测量它。在实践中，您可以通过将**N**（元素数）乘以**Q**（**F的**每个元素的成本），然后将**Q表示**为操作数或代码行数，然后检查**N \* Q**在至少10000。因此，当 **F**是类似的微小函数时`x -> x + 1`，则需要**N> = 10000**并行执行的元素是值得的。相反，当**F**是一项庞大的计算，例如在国际象棋中找到最佳下一个动作时， **Q**因子是如此之高，以至于**N**无关紧要，只要集合可以完全拆分即可。

所以当每个任务相互之间互不影响，且耗时较大时（大于100微秒），则可以考虑使用parrallelStream来优化。

TODO 当parallelStream有一个任务发生异常会怎样？

#### 3. 调用第三方接口必须统一封装，必须获取所有可能的异常，最后的catch必须是 catch(Exception e) {...}

```Java
public Object getInfoFromOtherAPI() {
  try {
    //call API
  } catch (SpecialException e) {
    //TODO
  }
  ...
  catch (Exception e) {
    //最后的catch必须捕获所有可能的异常
    return null;
  }

}
```

