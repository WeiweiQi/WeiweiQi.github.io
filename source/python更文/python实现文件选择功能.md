# python实现文件选择功能



为什么会需要实现这一个功能呢？

因为在我的日常工作中，python通常是作为一个快速的脚本来自动化一些任务的执行，但是有些任务需要的输入文件可能是不一样的，而每次去修改代码中的`D:/xxxx`就很头疼，所以我们想给脚本增加一个基本的选择文件的功能。

文件选择窗口就需要使用Python的GUI库，常用的GUI库有Tkinter，wxPython，PyQT。

这三个库的特点分别是：

> Tkinter是标准GUI库，适合小型的GUI程序编写，也特别适合初学者。
>
> wxPython比较流行，适合大型应用程序开发，功能比Tkinter强大，整体设计类似MFC。
>
> PyQT是开源的GUI库，是Qt工具包标准的Python实现，适合大型的GUI程序开发，可以使用Qt Desginer界面设计器快速开发GUI应用程序。

我们首先来看下如何使用Tkinter来实现我们的功能需求。

## 代码

先来看看全部的实现代码以及运行效果，

```python
import tkinter as tk
from tkinter import filedialog

root = tk.Tk()
root.title("选择文件或文件夹，得到路径")
# 初始化Entry控件的textvariable属性值
select_path = tk.StringVar()

def select_file():
    # 单个文件选择
    selected_file_path = filedialog.askopenfilename()  # 使用askopenfilename函数选择单个文件
    select_path.set(selected_file_path)
def select_files():
    # 多个文件选择
    selected_files_path = filedialog.askopenfilenames()  # askopenfilenames函数选择多个文件
    select_path.set(';'.join(selected_files_path))  # 多个文件的路径用换行符隔开
def select_folder():
    # 文件夹选择
    selected_folder = filedialog.askdirectory()  # 使用askdirectory函数选择文件夹
    select_path.set(selected_folder)

# 布局控件
tk.Label(root, text="文件路径：").grid(column=0, row=0, rowspan=3)
tk.Entry(root, textvariable = select_path).grid(column=1, row=0, rowspan=3)
tk.Button(root, text="选择单个文件", command=select_file).grid(row=0, column=2)
tk.Button(root, text="选择多个文件", command=select_files).grid(row=1, column=2)
tk.Button(root, text="选择文件夹", command=select_folder).grid(row=2, column=2)

# 进入消息循环
root.mainloop()
```

执行效果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ebb7e6af7ac49bb8b54f685c1ec1dd7~tplv-k3u1fbpfcp-watermark.image?)

## 代码分析

创建tkinter的GUI程序，需要：

1. 导入tkinter模块

   ```python
   import tkinter as tk
   from tkinter import filedialog
   ```

2. 创建主窗口对象

   ```python
   root = tk.Tk()
   ```

3. 添加控件，以及事件处理和布局

   ```python
   tk.Label(root, text="文件路径：").grid(column=0, row=0, rowspan=3)
   tk.Entry(root, textvariable = select_path).grid(column=1, row=0, rowspan=3)
   tk.Button(root, text="选择单个文件", command=select_file).grid(row=0, column=2)
   tk.Button(root, text="选择多个文件", command=select_files).grid(row=1, column=2)
   tk.Button(root, text="选择文件夹", command=select_folder).grid(row=2, column=2)
   ```

4. 进入事件循环

   ```python
   root.mainloop()
   ```



## 脚本中插入GUI

在一端可执行脚本中通过插入GUI来提高脚本的友好性和可适配性，则需要在通过GUI操作后关闭窗口，并继续执行，这种情况下，可以通过如下代码，关闭事件循环，但并不会退出整个程序。

```python
root.destroy()
```

## 文件选择功能

在代码一节，我们通过`command`参数实现按钮的功能与文件参数的获取，这里不再赘述。


















