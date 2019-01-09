---
title: JAVA使用第三方webservice wsdl接口
comments: true
categories: java
abbrlink: c22c
date: 2019-01-09 20:56:23
tags:
---



前提：安装JAVA jdk之后

<!-- more -->

在命令行中使用

```shell
wsimport -keep -p packageName http://..../service?wsdl
```



wsimport常用参数：

-d:生成class文件的存放目录
-s:生成.java源文件的存放目录
-p:定义生成类的包名

(关于命令的一些具体用法可以使用 wsimport -help命令查看相关参数 或 使用命令wsimport构建WebService客户端，更多请Google It)

将会下载一些.java文件。使用接口的方法如下：

```java
import java.net.MalformedURLException;
import java.net.URL;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;



public class Test {

	public static void main(String[] args) throws MalformedURLException {
		URL wsdlUrl = new URL("http://..../service?wsdl");
		UserLoginWSService userWSService = new UserLoginWSService(wsdlUrl);
		UserLoginWS userWS = userWSService.getUserLoginWSPort();
		String resultValue = userWS.getUserphone("12", "12", "12", "12"); //或者其他接口
		System.out.println(resultValue);
		//JsonArray bbb = new JsonParser().parse(retValue).getAsJsonArray();
		JsonObject obj = new JsonParser().parse(retValue).getAsJsonObject();
		System.out.println(obj.get("columnName2"));//取得json中相应的值
		System.out.println(obj.get("columnName2"));//取得json中相应的值

	}
```


如果对第三方库存在疑惑，或者代码运行报异常，可以使用SoapUI对接口进行测试。

下载SoapUI后，在Initial WSDL中粘贴第三方所给接口链接(以wsdl结尾)，可以很轻松的对接口进行测试。

![SoapUI](https://wx3.sinaimg.cn/mw690/733866e8ly1fz0mpruzpdj20g607o3zh.jpg)
