---
title: mysql-主动退出存储过程：LEAVE
comments: true
date: 2019-01-17 11:03:30
categories:
  mysql
tags:
---

```sql
create procedure myproc()
MAIN_BLOCK: begin
declare v_panic bool default false
..
..
if v_panic then
leave MAIN_BLOCK;
end if;
..
..
end MAIN_BLOCK;
```

参考链接：[How do you exit a procedure](https://forums.mysql.com/read.php?98,62584,62848#msg-62848)
