---
title: 如何使用freemaker生成word文档｜ Java Debug 笔记
comments: true
date: 2021-05-11 10:35:15
categories: 后端
tags: Java
---

**本文正在参加「Java主题月 - Java Debug笔记活动」，详情查看 [活动链接](https://juejin.cn/post/6960478432744931364/) **

首先需要注意的是，使用freemaker生成的文档，其本质仍然为xml文档。

使用freemaker生成word文档主要实现步骤如下：

​	**添加依赖（第1步） -> 制作模板（第2,3,4,5,6步） -> 程序编写（第7,8,9,10步）**

详细步骤：

1. 下载导入freemaker-xx.jar包，或者 maven：pom.xml中添加freemaker依赖

2. 修改已有的"文档.doc"：将填充内容修改为 {{paranames}}

3. 文档另存为“xxx_template.xml”，建议复制备份一份“xxx_template-副本.xml”

4. 使用文本编辑器，notepad++/sublineText等打开xml文件，使用插件美化xml（notepadd++美化路径为：插件->XML Tools -> Pretty print），将其中的{{parames}}替换为 "${paranames}"，有些“{{”, "}}" 分开了记得合并或删除

5. 对于需要list, 格式为 

   ```xml
   <#list listitems as item> ...${item.para1} ... ${item.para2}... </#list>
   ```

6. 另存为"xxx_template.ftl"

7. 项目中建立模板文件路径包：....template.package, 你喜欢的包名都可以

8. 包中建立MDoc.java类：内容如下：

   

   ```java
   /***
   * MDoc类，根据模板与数据生成文件
   */
   package com.xxxxx.export.doc.template;
   
   import java.io.BufferedWriter;
   import java.io.File;
   import java.io.FileNotFoundException;
   import java.io.FileOutputStream;
   import java.io.IOException;
   import java.io.OutputStreamWriter;
   import java.io.UnsupportedEncodingException;
   import java.io.Writer;
   import java.util.Map;
   
   import freemarker.template.Configuration;
   import freemarker.template.Template;
   import freemarker.template.TemplateException;
   
   public class MDoc {
   	private Configuration configuration = null;
   	public MDoc() {
   		configuration = new Configuration(Configuration.getVersion());
   		configuration.setDefaultEncoding("utf-8");
   	}
   	
   	/**
   	 * 
   	 * @param dataMap 要填入模板的数据 
   	 * @param fileName 生成文档的路径
   	 * @param template 模板文件的名称，如"xxx.ftl"
   	 * @throws UnsupportedEncodingException
   	 */
   	public void createDoc(Map<String, Object> dataMap, String fileName, String template) throws UnsupportedEncodingException {
   		// dataMap 要填入模本的数据文件
   		// 这里我们的模板是放在与本类同一个包路径下
   		configuration.setClassForTemplateLoading(MDoc.class, "/" + MDoc.class.getPackage().getName().replace(".", "/"));
   		Template t = null;
   		try {
   			t = configuration.getTemplate(template);
   		} catch (IOException e) {
   			e.printStackTrace();
   		}
   		// 输出文档路径及名称
   		File outFile = new File(fileName);
   		Writer out = null;
   		FileOutputStream fos = null;
   		try {
   			fos = new FileOutputStream(outFile);
   			OutputStreamWriter oWriter = new OutputStreamWriter(fos, "UTF-8");
   			// 这个地方对流的编码不可或缺，使用main（）单独调用时，应该可以，但是如果是web请求导出时导出后word文档就会打不开，并且包XML文件错误。主要是编码格式不正确，无法解析。
   			out = new BufferedWriter(oWriter);
   		} catch (FileNotFoundException e1) {
   			e1.printStackTrace();
   		}
    
   		try {
   			t.process(dataMap, out);
   			out.close();
   			fos.close();
   		} catch (TemplateException e) {
   			e.printStackTrace();
   		} catch (IOException e) {
   			e.printStackTrace();
   		}
   	}
   }
   
   ```

   

9. 将 “xxx_template.ftl” 拷贝至同一包路径下。

   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a2312d5db0c4ede9c226154fcb9b747~tplv-k3u1fbpfcp-watermark.image)

10. 调用方法关键代码如下：

```java
String filepath = "D://..../filename.doc";
MDoc mdoc = new MDoc();
try {
	mdoc.createDoc(dataMap, filepath, "xxx_template.ftl");
} catch (UnsupportedEncodingException e) {
	LogKit.error("导出word错误：e = " + e.getMessage());
}
File outputfile = new File(filepath);
....
```

一些其他需求：

1. 插入图片：

   需要将图片链接转换为base64格式，并放置到到模板中。

   ```xml
   <!-- ${pic_index}表示取元素在列表中的下标index -->
   ...
   <!-- 资源索引 -->
   <#list picUrls as picUrl>
   	<Relationship Id="rId${picUrl_index}Png" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${memUrl_index}.png"/>
   </#list>
   ...
   <!-- base64资源 -->
   <#list picUrls as picUrl>
   	<pkg:part pkg:name="/word/media/image${picUrl_index}.png" pkg:contentType="image/png" pkg:compression="store">
   		<pkg:binaryData>${picUrl.imageBase64!''}</pkg:binaryData>
   	</pkg:part>
   </#list>
   ...
   <!-- 引用，仅放置关键处代码，具体需要使用模板来制作 -->
   <a:blip r:embed="rId${picUrl_index}Png" cstate="print">
   ...
   ```

2. 换行：

   ```java
   paraHaveLineBreak.replaceAll("/n", "<w:br/>")
   ```

   