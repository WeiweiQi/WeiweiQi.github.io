---
title: 吴恩达机器学习——Octave常用操作指令
comments: true
date: 2022-01-27 17:23:54
categories:
tags:
---



## 为什么使用Octave

构建大规模机器学习项目，大多数使用octave/matlab构建算法原型，快速实现算法。

机器学习最常用语言：Octave（开源）/matlab/python、numpy/R。

Octave是开源免费的，而matlab是非常昂贵的。Python是高级编程语言，实现复杂度较高。



## Octave的基础操作



| 指令                         | 含义                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| pi                           | π                                                            |
| disp()                       | 显示                                                         |
| Sprint(‘…’)                  | 转换成字符串                                                 |
| format long/short            | 修改浮点数默认显示格式，多小数/少小数                        |
| v=[1 2 3]与v=[1;2;3]         | 分号换行                                                     |
| v=1:0.1:2                    | 从1开始，步长为0.1，一直增加到2                              |
| v=1:6                        | 默认步长为1                                                  |
| ones(2,3)                    | 2*3矩阵，所有元素都为1                                       |
| zeros(2,3)                   | 2*3矩阵，所有元素都为0                                       |
| w=rand(1,3)                  | 1*3矩阵，随机数，介于0~1之间                                 |
| randn(1,3)                   | 1*3矩阵，随机数服从高斯分布，均值为0，标准差或方差为1        |
| -6+sqrt(10)*(randn(1,10000)) | 均值为-6，随机变量的方差为10，标准差为![img](file:///C:\Users\lenovo\AppData\Local\Temp\ksohtml22820\wps2.jpg) |
| eye(4)                       | 单位矩阵                                                     |
| help 需要帮助的指令          |                                                              |



## Octave移动数据

| 指令                        | 含义                                |
| --------------------------- | ----------------------------------- |
| sz=size(A)                  | 返回矩阵的行数与列数，作为一个矩阵  |
| length(V)                   | 返回向量/矩阵的最大维度的大小       |
| pwd                         | 查看当前路径                        |
| dir,   ls                   | 显示当前路径下的文件                |
| load filename.dat           | 加载数据                            |
| load(‘filaname.dat’)        | 加载数据                            |
| who                         | 显示所有变量名                      |
| whos                        | 显示所有变量名及详细信息            |
| clear 变量名                | 删除某个变量                        |
| v=priceY(1:10)              | 将priceY的前10个元素赋值给v         |
| save filename.mat v;        | 保存矩阵到文件，mat格式(压缩程度高) |
| save filename.txt v –ascii; | 保存矩阵到文件，txt格式             |
| A(2,:)                      | 冒号表示某一行或某一列的全部元素    |
| A([1,3],:)                  | A第一行与第三行的全部元素           |
| A=[A, [10;100;1000]]        | A增加一列                           |
| A=[A; [7,8]]                | A增加一行                           |
| A(:)                        | 将A所有内容拼接为一个列向量         |
| C=[A B]                     |                                     |
| C=[A; B]                    |                                     |



## octave 计算数据

| A*B                   | 矩阵乘法                                                    |
| --------------------- | ----------------------------------------------------------- |
| A.*B                  | 元素分别相乘                                                |
| exp(A)                | e为底数，A中的元素为指数的幂运算                            |
| log(A)                | 返回自然对数，相当于ln(A)                                   |
| abs(A)                | 求绝对值                                                    |
| A+1                   | A中的每个元素都+1                                           |
| A’                    | 转置                                                        |
| [val, ind]=max(A)     | 数组中的最大元素，若A为矩阵，则返回每一列的最大值的行向量。 |
| [row, col]=find(A<3)  | 返回索引                                                    |
| A=magic(3)            | 幻方矩阵（任意行、列，对角线和相当等）                      |
| sum(A)                | 求和                                                        |
| prod(A)               | 求乘积                                                      |
| floor(A)              | 向下取整                                                    |
| ceil(A)               | 向上取整                                                    |
| rand(rows, cols)      | 随机数                                                      |
| max(rand(3), rand(3)) | 两个随机数矩阵，求最大值后构成的矩阵                        |
| max(A, [], 1)         | A的第一个维度（每一列）上的最大值(结果为行向量)             |
| max(A, [], 2)         | A的第二个维度（每一行）上的最大值(结果为列向量)             |
| flipud(A)             | 矩阵垂直反转                                                |
| pinv(A)               | 逆矩阵                                                      |



## 数据绘制

| plot(t, y, ‘r’)                                              | 绘图                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| hold on                                                      | 在旧图像的基础上绘图                                         |
| axis([XMIN XMAX YMIN YMAX]) 设置二维图的x-y坐标范围axis([XMIN XMAX YMIN YMAX ZMIN ZMAX]) 设置三维图的x-y-z坐标范围 | 设置坐标轴范围                                               |
| title(‘myplot’)                                              | 图的标题                                                     |
| legend(‘sin’, ’cos’)                                         | 图线标记![image-20220127174236022](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220127174236022.png) |
| close                                                        | 关闭图像窗口                                                 |
| figure(1)                                                    | 标记图像窗口                                                 |
| subplot(1,2,1)![image-20220127174303565](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220127174303565.png) ![image-20220127174313917](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220127174313917.png) | 前两个参数表示将图像窗口划分为1*2个格子，第三个参数表示使用第一个格子 |
| clf                                                          | 清楚一个图像                                                 |
| A=magic(5);imagesc(A);imagesc(A), colorbar, colormap gray;   |                                                              |
