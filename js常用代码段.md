title: js常用代码片段
date: 2018-12-12
categories:
    - javascript
tag:
    - javascript
----

## dialog的刷新，关闭

```javascript
  $.pdialog.closeCurrent();//关闭当前活动层。
  $.pdialog.close(dialog); //参数dialog可以是弹出层jQuery对象或者是打开dialog层时的dlgId.
  $.pdialog.reload(url,data,dlid); //刷新dlid指定的dialog，url：刷新时可重新指定加载数据的url, data：为加载数据时所需的参数  
```

# navTab的刷新

```javascript
  navTab.reloadFlag("navTabName");//navTab的名称
```

## ajax发送请求示例

```javascript
$.ajax({
      type: 'POST',
      url: "url?para="+para,
      dataType: "json",
      success: function(data) {
                  if(data.code == 0) {
                      alertMsg.correct(data.msg);
                    } else {
                      alertMsg.error("操作失败");
                    }
                }
     });
```

## js获取复选框选择内容字符串

```javascript
/**
* 通常最后会多一个','
*/
function getChoosenIds() {
	obj = document.getElementsByName("ids");
	var check_val = "";
	for(k in obj) {
		if(obj[k].checked) {
			check_val = check_val + "," + obj[k].value;
		}
	}
	return check_val;
}
```
