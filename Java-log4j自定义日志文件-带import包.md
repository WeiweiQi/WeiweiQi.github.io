---
title: Java-log4j自定义日志文件-带import包
comments: true
categories: java
abbrlink: '7804'
date: 2019-01-09 20:47:28
tags:
---

在网上找了一些关于log4j自定义包的方法，然而因为说明都没有带import说明，导致找到正确的包费了不少功夫。

<!-- more -->


```java
package com.yourpackage.littlepackage;

import org.nlpcn.commons.lang.util.logging.LogFactory; //这两行是重点
import org.nlpcn.commons.lang.util.logging.Log;        //这两行是重点

public class YourLogTest {

	private static Log logger = LogFactory.getLog(YourLogTest.class);

	public static void browseRecord(Invocation inv) {
		logger.info("your log test");
	}
}

	private static Log logger = LogFactory.getLog(YourLogTest.class);

	public static void browseRecord(Invocation inv) {
		logger.info("your log test");
	}
}
```

log4j.properties文件设置：

```java
log4j.logger.com.yourpackage.littlepackage= DEBUG, test
# Output to the File info
log4j.appender.test=org.apache.log4j.DailyRollingFileAppender
log4j.appender.test.DatePattern='_'yyyy-MM-dd'.log'
log4j.appender.test.File=${catalina.home}/userActionLog/AActionRecord.log
log4j.appender.test.layout=org.apache.log4j.PatternLayout
log4j.appender.test.layout.ConversionPattern=%n%-d{yyyy-MM-dd HH:mm:ss}| %m%n
```
