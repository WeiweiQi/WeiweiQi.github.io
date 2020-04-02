---
title: SELECT * 与 SELECT id 性能对比
comments: true
abbrlink: 69d6
date: 2018-12-26 09:00:54
categories:
tags:
---

时间差主要在 "Sending data" 上，其操作包括 “收集+发送 数据”。


<!-- more -->



### 实验环境：

- mysql 5.6.42 远程数据库
- navcat 11.2.7
- a_table 有约100个字段，约10万行数据
- id 唯一主键

### 实验步骤

#### 对比SELECT * 与 SELECT id 的性能

```sql
  SELECT * FROM a_table
```

![SELECT * ](https://wx4.sinaimg.cn/mw690/733866e8ly1fysdevd2cnj20by055t8s.jpg)


```sql
  SELECT id FROM a_table
```

![SELECT * ](https://wx2.sinaimg.cn/mw690/733866e8ly1fysdm2mfwfj20co05w0sx.jpg)

#### 结果
  - SELECT * 总计用时 53.744s
  - SELECT id 总计用时 0.936s


### 结论

- 时间差主要在```Sending data```上，其操作包括 “收集+发送 数据”。
收集数据的原因是：mysql使用“索引”完成查询结束后，mysql得到了一堆的行id，如果有的列并不在索引中，mysql需要重新到“数据行”上将需要返回的数据读取出来返回给客户端。
