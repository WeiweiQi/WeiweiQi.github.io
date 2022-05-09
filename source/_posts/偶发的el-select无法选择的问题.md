---
title: 偶发的el-select无法选择的问题
comments: true
date: 2022-04-14 15:45:26
categories:
tags:
---



1

## 问题起源

最近借鉴开源管理系统若依（http://www.ruoyi.vip/）开发公司的管理系统，尤其是其使用VUE的前端。在借鉴若依用户管理时遇到一个很怪的BUG。这个bug不能准确复现，但是希望通过这次问题阐述帮助整理清楚问题原因。

## 问题定位

在开发用户管理界面，编辑已有用户账号时，其操作界面如下：

![image-20220414204621423](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220414204621423.png)

这次，我们遇到的问题是角色选项时，虽然返回的数据可以自动选中之前已经选择的角色，但是无法勾选新角色，也无法取消已选角色，这让我们陷入沉思，明明前端代码是一样的啊？为什么若依系统中可以，而自己的系统中就不可以呢？

## 关键代码

我们来看一下这个对话框的代码，

```vue
....
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                ></el-option>
              </el-select>
.....
```

我们剔除掉无关紧要或者与本次问题肯定无关的其他代码部分，出问题的便是上方这个`el-select`组件。el-select组件官网：https://element.eleme.cn/#/zh-CN/component/select。文档中也并没有特别著名什么。因此，我们也正常书写这段代码。其中的`form.roleIds`格式为数组，data中，有：

```javascript

data() {
    return {
      // 表单参数
      form: {}
	}
}
```

获取用户已有角色的接口方法：

```javascript
/** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
       // getUser为接口
      getUser(userId).then(response => {
        this.form = response.data; // 现有用户数据
        this.roleOptions = response.roles; // 获取所以角色权限
        this.form.roleIds = response.roleIds; // 获取用户已有选项
        this.open = true; // 打开对话框
        this.title = "修改用户"; // 对话框标题
        this.form.password = ""; // 不修改密码
      });
    },
   reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
```

我们获取用户数据方法也基本相同，准确的说，没有什么不同，但是我们的仍然是不可选的。

在网络检索“el-select”无法选中问题后，我们尝试了一种可行的方法。

### 解决问题

一种说法是在form初始化时，其中的roleIds并没有被添加到vue的自动监听机制中，所以其值变化并没有引起el-select的视图刷新。但是，经过我们对form数据进行watch监听，form也并没有发生改变。

尽管如此，我们仍然尝试了文中给出的解决办法：使用`this.$set(this.form, 'roleIds', newValue)`设置已有角色，如下所示：

```javascript
this.$set(this.form, 'roleIds', response.result.data.roleIds)
```

如此，竟然成功的解决了问题。

## 总结

最终，我们猜测，仍然是由于form.roleIds没有被vue自动监听机制发现，所以el-select无法做到视图与数据的更新。

我们可以手动使用this.$set来解决该问题。