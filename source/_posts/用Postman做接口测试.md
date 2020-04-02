---
layout: w
title: 用Postman做接口测试
date: 2018-11-23 10:48:28
tags: 测试
categories:
  - 敏捷开发之测试
  
---

> The higher your test coverage, the more flexible and bug-resistant your code will be, and the less time you’ll spend debugging hot fixes in production.

> 测试覆盖率越高，代码就越灵活，生产中调试修补程序所花费的时间就越少。

<!-- more -->

首先，很遗憾的一点是，Postman不支持并发测试，但支持指定次数与间隔时间的串行测试。

官方文档链接：[Postman Test scripts](https://www.getpostman.com/docs/v6/postman/scripts/test_scripts)

## postman请求流程

![Postman请求流程图](https://img2018.cnblogs.com/blog/671355/201812/671355-20181203192231866-1191984666.png)

## postman test 配置

测试允许配置在Collections/Folder/Request中，配置在Collections/Folder中方便我们统一的对多接口进行测试。

***Postman Test 是在接受到请求响应Response后执行的一段JavaScript代码。在发送请求并从服务器收到响应后Postman将运行测试脚本。***。在Postman Request Builder中，请求部分包含一个Tests标签，返回部分包含一个Test Result标签。
在Tests标签右边，罗列了一些辅助编写的常用代码段。

## 使用PM API:pm.* API 编写测试代码

### pm.test()
- 使用```pm.test()```函数能够在***Postman test Sandbox***中编写测试规范。使用此函数允许你准确命名某个测试，并且确保测试脚本中的某个错误并不会阻塞其余部分的执行。
 - ```pm.test()```接受两个参数：(string testName, A Function witch resturn boolean value).


 ```javascript
 // example using pm.response.to.have
pm.test("response is ok", function () {
    pm.response.to.have.status(200);
});

// example using pm.expect()
pm.test("environment to be production", function () {
    pm.expect(pm.environment.get("env")).to.equal("production");
});

// example using response assertions
pm.test("response should be okay to process", function () {
    pm.response.to.not.be.error;
    pm.response.to.have.jsonBody("");
    pm.response.to.not.have.jsonBody("error");
});

// example using pm.response.to.be*
pm.test("response must be valid and have a body", function () {
     // assert that the status code is 200
     pm.response.to.be.ok; // info, success, redirection, clientError,  serverError, are other variants
     // assert that the response has a valid JSON body
     pm.response.to.be.withBody;
     pm.response.to.be.json; // this assertion also checks if a body  exists, so the above check is not needed
});
 ```

 ### pm.* 辅助函数

- pm.expect() 断言函数建立在流行的JavaScript测试库ChaiJS BDD的基础上，编写可读测试。
- pm.response.to.be.* 函数简化断言。使用此系列断言可简化对响应状态类型和主体变体的测试。

### After Test

- 执行请求后，在TestResutl标签下，可以查看测试是否通过。
- 使用Collection Runner可以实时查看请求是否通过测试。

### 自动化测试

需要命令行工具与持续集成工具或持续交付工具（如Jenkins或Travis CI）集成来自动化您的测试。

### 测试代码样例


```javascript
//设置环境变量
pm.environment.set("variable_key", "variable_value");

//将嵌套对象设置为环境变量
var array = [1, 2, 3, 4];
pm.environment.set("array", JSON.stringify(array, null, 2));

var obj = { a: [1, 2, 3, 4], b: { c: 'val' } };
pm.environment.set("obj", JSON.stringify(obj));

//获取环境变量
pm.environment.get("variable_key");

//获取环境变量（其值是字符串化对象）
// These statements should be wrapped in a try-catch block if the data is coming from an unknown source.
var array = JSON.parse(pm.environment.get("array"));
var obj = JSON.parse(pm.environment.get("obj"));

//清除环境变量
pm.environment.unset("variable_key");

//设置全局变量
pm.globals.set("variable_key", "variable_value");

//获取全局变量
pm.globals.get("variable_key");

//清除全局变量
pm.globals.unset("variable_key");

//获取变量:此函数在全局变量和活动环境中搜索变量
pm.variables.get("variable_key");

//检查响应主体是否包含字符串
pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include("string_you_want_to_search");
});

//检查响应主体是否等于字符串
pm.test("Body is correct", function () {
    pm.response.to.have.body("response_body_string");
});

//检查JSON值
pm.test("Your test name", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.value).to.eql(100);
});

//Content-Type是否存在
pm.test("Content-Type is present", function () {
    pm.response.to.have.header("Content-Type");
});

//响应时间小于200毫秒
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

//Code name contains a string: 检查Code name包含指定string。网络基础知识不好，不太理解这一句话Orz
pm.test("Status code name has string", function () {
    pm.response.to.have.status("Created");
});

//成功的POST请求状态代码
pm.test("Successful POST request", function () {
    pm.expect(pm.response.code).to.be.oneOf([201,202]);
});

//使用TinyValidator获取JSON数据
var schema = {
 "items": {
 "type": "boolean"
 }
};
var data1 = [true, false];
var data2 = [true, 123];
pm.test('Schema is valid', function() {
  pm.expect(tv4.validate(data1, schema)).to.be.true;
  pm.expect(tv4.validate(data2, schema)).to.be.true;
});

//解码base64编码数据
var intermediate,
	base64Content, // assume this has a base64 encoded value
	rawContent = base64Content.slice('data:application/octet-stream;base64,'.length);

intermediate = CryptoJS.enc.Base64.parse(base64content); // CryptoJS is an inbuilt object, documented here: https://www.npmjs.com/package/crypto-js
pm.test('Contents are valid', function() {
  pm.expect(CryptoJS.enc.Utf8.stringify(intermediate)).to.be.true; // a check for non-emptiness
});

//发送异步请求
pm.sendRequest("https://postman-echo.com/get", function (err, response) {
    console.log(response.json());
});

//将XML主体转换为JSON对象
var jsonObject = xml2Json(responseBody);




```
