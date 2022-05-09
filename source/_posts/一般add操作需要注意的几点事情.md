---
title: 一般add操作需要注意的几点事情
comments: true
date: 2022-04-12 10:39:42
categories:
tags:
---



## 问题起源

最近在从若依系统中研究其管理系统设计，例如，最近在学习其中的菜单管理功能，其中涉及到“添加”菜单功能，感觉其代码实现具有一定的参考意义，特来总结学习一下。

## 若依系统中的add操作

我们先来看看若依系统中添加add操作是如何设计的。

先来看看后端接口，以创建菜单为例，接口位置位于ruoyi-admin/src/main/java/com/ruoyi/web/controller/system/SysMenuController中

```java
/**
     * 新增菜单
     */
    @PreAuthorize("@ss.hasPermi('system:menu:add')")
    @Log(title = "菜单管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody SysMenu menu)
    {
        if (UserConstants.NOT_UNIQUE.equals(menuService.checkMenuNameUnique(menu)))
        {
            return AjaxResult.error("新增菜单'" + menu.getMenuName() + "'失败，菜单名称已存在");
        }
        else if (UserConstants.YES_FRAME.equals(menu.getIsFrame()) && !StringUtils.ishttp(menu.getPath()))
        {
            return AjaxResult.error("新增菜单'" + menu.getMenuName() + "'失败，地址必须以http(s)://开头");
        }
        menu.setCreateBy(getUsername());
        return toAjax(menuService.insertMenu(menu));
    }
```

1. 接口权限控制：

   注解部分权限控制，需要有权限`system:menu:add`

```java
 @PreAuthorize("@ss.hasPermi('system:menu:add')")
```

2. 日志记录

```java
@Log(title = "菜单管理", businessType = BusinessType.INSERT)
```

3. 接口映射：PostMapping，表明该方法承接默认的POST请求

```java
@PostMapping
```

我们再来看方法体内部，最后一句：

```java
return toAjax(menuService.insertMenu(menu));
```

其对应的方法体为：

```java
/**
     * 新增保存菜单信息
     * 
     * @param menu 菜单信息
     * @return 结果
     */
    @Override
    public int insertMenu(SysMenu menu)
    {
        return menuMapper.insertMenu(menu);
    }
```

即最后一句为实际插入的SQL执行语句。

我们更关心在执行插入前，数据做了哪些检查：

## 添加前的检查工作

1. name的唯一性

其代码为：

```java
if (UserConstants.NOT_UNIQUE.equals(menuService.checkMenuNameUnique(menu)))
        {
            return AjaxResult.error("新增菜单'" + menu.getMenuName() + "'失败，菜单名称已存在");
        }
```

见字知意，我们拆开其方法checkMenuNameUnique体内部：

```java
/**
     * 校验菜单名称是否唯一
     * 
     * @param menu 菜单信息
     * @return 结果
     */
    @Override
    public String checkMenuNameUnique(SysMenu menu)
    {
        Long menuId = StringUtils.isNull(menu.getMenuId()) ? -1L : menu.getMenuId();
        SysMenu info = menuMapper.checkMenuNameUnique(menu.getMenuName(), menu.getParentId());
        if (StringUtils.isNotNull(info) && info.getMenuId().longValue() != menuId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }
```

其判断重复的算法是：首先根据当前给定的名称与区域范围（我所指的是给定的parentId，即相当于在某个目录下添加菜单时，该目录下不应该有重名的菜单，而非目录下的菜单是允许重复的），查找是否有“menu”，再判断给定预创建的对象与查询出的结果的唯一标识是否一致或者查询出的结果为空，即语句：

```java
StringUtils.isNotNull(info) && info.getMenuId().longValue() != menuId.longValue()
```

2. 数据的合法性

除检查名称是否重复外，还需要检查给定的数据是否合法，例如下面这行代码：

```java
else if (UserConstants.YES_FRAME.equals(menu.getIsFrame()) && !StringUtils.ishttp(menu.getPath()))
        {
            return AjaxResult.error("新增菜单'" + menu.getMenuName() + "'失败，地址必须以http(s)://开头");
        }
```

即：在设定对象为外链时，则给定的地址就应该是以http开头，否则数据不合法，也不能创建成功。

3. 是否有相关联的操作

这里的关联操作，我以若依中编辑菜单为例：

```java
else if (menu.getMenuId().equals(menu.getParentId()))
        {
            return AjaxResult.error("修改菜单'" + menu.getMenuName() + "'失败，上级菜单不能选择自己");
        }
```

这个ParentId对应选择父级节点的操作，如图：

![image-20220412124336776](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220412124336776.png)

同样的，删除菜单时也会有相关联的数据，比如菜单或目录中有子节点，则该菜单就不允许直接删除：

```java
if (menuService.hasChildByMenuId(menuId))
        {
            return AjaxResult.error("存在子菜单,不允许删除");
        }
```



## 总结

因此，在插入/更新/删除数据时，至少要考虑这几个方面：

1. 某些字段的唯一性，比如名称；
2. 数据的合法性，或者相互关联的字段的合法性判断，这一点大概是很多程序中比较耗时耗力；
3. 数据的关联性，比如与其他数据有关联的数据不能删除，数据不能以自己为父节点等等逻辑。