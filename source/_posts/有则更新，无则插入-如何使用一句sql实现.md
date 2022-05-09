---
title: 有则更新，无则插入-如何使用一句sql实现
comments: true
date: 2021-11-04 10:48:28
categories:
tags: 数据库，mysql
---

这是我参与11月更文挑战的第4天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)



## 问题起源

生产环境搭配nginx配置多台机器后，总担心出问题，例如定时任务重复执行的问题等等。最近有个需求，为避免透漏公司机密（嗯，就是懒而已），抽离业务，概况实现，大致为：

>  在接口拦截器中添加一段代码，记录用户的最近一次的操作时间！

目前生产环境多台机器，跑着同样的业务，首先想到的是这样的代码：

```java
if 数据库中没有该用户记录
    INSERT INTO table_name ....
else
    UPDATE table_name SET .....
```

如果按照以上代码执行，也不是不可以，但总担心因为异步同步问题导致数据库中会出现一个人两条甚至多条记录。例如一台机器上的一个接口因为机器问题/网络问题，导致延迟或者卡顿，从而可能出现：a， b两台机器，a,b同时执行到`if`判断语句，从而导致数据库中会插入两条数据。这个详细的逻辑相信大家都看得懂。

那么，一个sql语句是否可以即兼顾插入，又兼顾更新呢？即有则更新，无则插入。

## ON DUPLICATE KEY UPDATE

在搜索过程中，第一个映入眼帘的就是`ON DUPLICATE KEY UPDATE`，完整语句为：

```sql
INSERT INTO table_name (id, `col`) VALUES('unique_id', 'insert_value') 
ON DUPLICATE KEY UPDATE 
id = 'update_unique_id' col = 'update_value'
```

语句前面位正常的插入语句，后面则当相同唯一索引值或者主键已存在时，则按照之后的语句对数据进行更新。

按照我们的需求，语句应该这样写：

```mysql
INSERT INTO table_name1 (id, `col`) VALUES('unique_id', 'insert_value') 
ON DUPLICATE KEY UPDATE 
id = VALUES(id) col = VALUES(col)
```

## WHERE NOT EXIST

还搜索到一种骚操作，先“预插入”（可能失败，可能成功），然后再更新，代码大概是下面这样子。

```sql
# 预插入
INSERT INTO table_name1 (id, col)
SELECT 1, 'col_value' FROM DUAL 
WHERE NOT EXISTE (SELECT id FROM table_name1 WHERE id = 1) ;
UPDATE table_name1 SET id = col WHERE col = 'col_value';
```



