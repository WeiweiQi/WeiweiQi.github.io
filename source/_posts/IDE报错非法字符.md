---
title: IDE报错非法字符'\feff', 'fffe' | UTF8与UTF8-BOM，大端与小端等编码到底有何不同
comments: true
date: 2021-12-23 18:19:37
categories:
tags:
---



## 解决问题速看

解决的思路是将文件编码格式由**UTF-8-BOM**变为**UTF-8**格式。

第一种方式：

第一步：打开报错文件，点击IDEA右下角“FILE ENCODING”标识：如下图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/928678e1aa7f4a958ef114e40b409dc6~tplv-k3u1fbpfcp-watermark.image?)

选择一个其他编码，如GBK。（我选的是GBK）。

第二步：重复步骤一，再将编码选择回来，即第二次选择UTF-8编码。

第三步：嗯，没有第三步，这时候问题应该已经解决了。

第二种方式：

使用编辑器软件/IDE（windows记事本程序除外）将文件内容复制一份重新保存，并删除旧文件。

## 起因

之前项目使用的均为eclipse进行项目开发，最近团队大多数都在转IDEA，从短期的使用来看，IDEA相比eclipse目前个人最后的一点是“搜索”，其他部分使用上还没有太大的感觉。

之前使用idea导入maven项目使用均正常，最近使用idea打开传统的非maven web项目总是报出来各种奇怪的错误，路径找不到是最广泛的一类，但大多也知道怎么解决了。

今天遇到了一个奇怪的错误：

![image-20211230180716299](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230180716299.png)

红色文字为：

```bash
Java: 非法字符： '\\ufeff'
```

一个奇怪的错误。而且点击错误文件链接，打开文件，光标锁定在文件的开头位置。

## BOM

出于好奇，我们查一下这个编码`\\ufeff`是个什么东东。

这个涉及到一个名词：BOM。

BOM：**Byte Order Mark，**中文名译作“字节顺序标记”。我们知道一个UNICODE编码中一个汉字大多数占用2个字节，那个这两个字节哪个存储在存储地址高位，哪个存储在低位呢？

Unicode编码中，FEFF表明字节流是Big-Endian（大端序，内存低地址存放高位数据），FFFE则表明字节流是Little- Endian（小端序，内存的低地址存放低位数据）。

(可以巧妙区分为：内存低地址存的是低位就是小端序，内存低地址存的是高位就是大端序)

如“0x11223344”，这个变量的高字节是”0x11“，最低字节是为”0x44“，大端存储时为：

| 内存地址 | 数据 |                      |
| -------- | ---- | -------------------- |
| 0x0010   | 0x11 | 低内存地址，高位数据 |
| 0x0011   | 0x22 |                      |
| 0x0012   | 0x33 |                      |
| 0x0013   | 0x44 | 高内存地址           |

而小端时数据的顺序则是相反的：

| 内存地址 | 数据 |                      |
| -------- | ---- | -------------------- |
| 0x0010   | 0x44 | 低内存地址，低位数据 |
| 0x0011   | 0x33 |                      |
| 0x0012   | 0x22 |                      |
| 0x0013   | 0x11 | 高内存地址           |



## UTF-8-BOM与UTF-8

而UTF-8实际上不需要使用BOM来标识字节顺序。

在使用常用编辑器，如Notepad++时，在编码一栏下拉列表中，我们可以发现，除UTF-8编码外，还有一个UTF-8-BOM编码，而实际是，UTF-8-BOM文件就是比UTF-8文件多出文件头中的三个字节。

![image-20211230173212406](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230173212406.png)

![image-20211230173534434](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230173534434.png)

我们可以在自己电脑上实验一下，新建TXT文件，然后使用编辑器软件查看分别将其设置为UTF-8与UTF-8-BOM文件时的大小，如上图所示。

Windows基于其历史原因，在使用其记事本工具打开文件时，总是会将文件设置为UTF-8-BOM格式。

所以出现问题的文件大概率是曾经使用windows记事本打开过或者创建的。

借助一些工具，我们可以更直观的理解这一点。

## HEX-Editor插件

Notepadd++中的插件HEX-Editor插件可以辅助我们查看文件的十六进制编码，进而帮助理解大端小端。UTF8与UTF-8-BOM等编码格式。

### HEX-Editor插件安装

点击Notepadd++菜单栏“插件”->插件管理，查找或搜索"HEX-Editor"，勾选之后，点击右侧“安装”，安装完成之后重启Notepadd++，此时再点击“插件”，可以看到“HEX-Editor”选项，鼠标移动上去之后，可以看到“View in HEX”选项，点击即可查看文件的十六进制编码。

![image-20211230173648339](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230173648339.png)

### 纯数字或字母的UTF-8与UTF-8-BOM

通过Notepadd++我们编辑一个文件，简单的输入“012”，通过操作栏“编码”分别设置为大端，小端，UTF-8，UTF-8-BOM，其十六进制编码分贝如下：

大端：

![image-20211230180304094](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230180304094.png)

小端：012

![image-20211230180348512](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230180348512.png)

UTF-8：012

![image-20211230180430326](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230180430326.png)

UTF-8-BOM：012

![image-20211230180456561](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230180456561.png)

在笔者的机器上，一个数字使用Unicode编码时占用两个字节，也就需要约定地位地址到底是存高位数据还是地位数据，此时约定是必要的；而使用UTF-8时，可以看出，其只占用一个字节，约定顺序是没有意义的。

问题来了，一个字节，8位数据肯定是不能表达出所有的中文字符的，那么中文字符又是如何在UTF-8中编码的呢？此时BOM是否需要呢？

### 中文的UTF-8编码有约定大小端的必要吗

“你好”的**UTF-8**字节信息：

![image-20211230181219116](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230181219116.png)

“你好”的**UTF-8-BOM**字节信息：

![image-20211230181725585](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20211230181725585.png)

我们通过查询“你”和“好”的UTF-8编码，发现他们分别占用三个字节：“0xE4BDA0”（你）,“0xE5A5BD”（好），编码必然是完整而次序一致的，也就是说，0xE4BDA0不能按照字节逆序成“0xA0BDE4”，这样只会增加解码的计算量。所以，即使多字节情况下，UTF-8仍然不需要去约定大小端。
