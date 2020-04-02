---
title: maven添加本地jar包
comments: true
categories: maven
abbrlink: 97fb
date: 2019-02-27 14:59:02
tags:
---


1. pom.xml添加一个自定义的本地仓库

```xml
...
<repositories>
  ...
  <repository>
      <id>ProjectRepo</id>
      <name>ProjectRepo</name>
   <url>file://${project.basedir}/src/main/webapp/lib</url>
  </repository>
  ...
</repositories>
...
```


2. 修改jar包路径到本地仓库目录
${repo-dir}/groupid/artifactid/version/artifactid-version.jar

3. pom.xml中添加依赖

```xml
<dependency>
    <groupId>yourgroupid</groupId>
    <artifactId>your-artifactid</artifactId>
    <version>versioncode</version>
</dependency>
```
