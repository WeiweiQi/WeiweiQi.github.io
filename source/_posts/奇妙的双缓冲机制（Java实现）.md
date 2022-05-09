---
title: 奇妙的双缓冲机制写日志（Java实现）
comments: true
date: 2022-01-08 15:40:30
categories:
tags:
---




## 写日志面临的问题

写日志在Web程序中是一个十分基础与常见的需求，其对性能的要求很高。主要需要处理以下问题：

1. 多线程并发，需要保证顺序性。
2. 高配IO操作，但IO操作相比其他指令耗时长，性能低。

即一方面需要面对程序端高配的日志写请求，一方面需要受限于系统磁盘相对缓慢写入文件，应该如何处理呢。

## 双缓冲区

因此，引入双缓冲区机制，一个缓冲区存储应用程序端发送的日志，按照时间顺序依次存储；另一个缓冲区负责向低层磁盘发送写文件请求。

写文件请求执行相对较慢，因此当写文件执行完毕后，通知管理程序，此时可以将另一个缓冲区内容写入磁盘了。

双缓冲区的奇妙之处就在于，两个缓冲区的交换，是通过交换指针来实现的，非常的高效。

部分实现代码如下（其他部分逻辑代码已省略）。

#### 双缓冲区代码，不使用Java现有的线程安全类，后续通过加锁保证数据安全。

```java
// 负责接收应用程序发来的日志
LinkedList<String> currentBuffer = new LinkedList<>();

// 负责将数据同步到磁盘
LinkedList<String> syncBuffer = new LinkedList<>();
```

#### 第一个缓冲区，接收应用程序高速写日志请求

```java

public void log(String content) {
    // 加锁保证第一个缓冲区
    synchronized(this) {
        // 将log写入内存缓冲中，这里不会直接刷入磁盘文件
        currentBuffer.add(content);
    }

    // 将缓冲区中的内容刷到磁盘
    logSync();
}
```

#### 第二缓冲区，向磁盘写日志，并在写入后交换缓冲区指针

```java
private void logSync() {
    synchronized(this) {
        // 当前在刷内存缓冲到磁盘中去
        if (isSyncRunning) {
            // 判断是否第二个缓冲区还在刷
            while (isSyncRunning) {
                try {
                    // 释放锁，即允许第一个缓冲区继续接收日志缓存, 然后等待被唤醒
                    wait(2000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            // 此时没有人在写磁盘
        }

        // 交换缓冲区指针
        setReadyToSync();

        // 设置当前正在同步到磁盘的标志位
        isSyncRunning = true;
    }

    // 刷磁盘,性能最低，不能加锁
    logBuffer.flush();

    synchronized(this) {
        // 同步完磁盘之后，将标志位复位
        isSyncRunning = false;
        // 唤醒其他等待刷磁盘的线程
        notifyAll();
    }
}
```

#### 交换缓冲区指针，功能变更

```java
public void setReadyToSync() {
    LinkedList<String> tmp = currentBuffer;
    currentBuffer = syncBuffer;
    syncBuffer = tmp;
}
```



## 奇妙之处

### 两个缓冲区各自处理，互不干扰

两个缓冲区很好的解决了应用程序的“**快速、多线程**”与IO操作的“**缓慢，单线程**”的矛盾。应该说，引入双缓冲区是一个显而易见的方式。

### 缓冲区交换

通过交换指针的方式实现两个缓冲区的功能互换，十分巧妙，令人称赞。



## 总结

你知道吗？电视机里也用着双缓冲机制呢

