---
title: 吴恩达机器学习——使用Octave实现线性回归
comments: true
date: 2022-01-28 09:12:05
categories:
tags:
---



## 课后作业部分

在讲述完Octave的基础操作之后，吴恩达老师给出了一个线性回归的编程作业。并给出了明确的指导文件，可以让我们一步一步的来按照提示实现。

## 单变量线性回归

本例中使用单变量线性回归预测餐车利润。

数据ex1data1.txt数据截图如下，两列数据分别表示：第一列表示对应城市的人口，第二列表示在该城市的一个餐车的利润。负数表示餐车亏损。

![image-20220128100714689](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128100714689.png)

### Octave数据加载

```octave
data = load('ex1data1.txt');
X = data(:, 1);
y = data(:, 2);
m = length(y);
```

执行截图如下，可以发现通过load函数以及矩阵操作，将X与y值已分别导入到了工作空间。

![image-20220128101637300](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128101637300.png)

### 数据预览

我们首先通过绘图预览一下数据：

```octave
plot(X, y, 'rx', 'MarkerSize', 10);
ylabel('Profit in $10,000s');
xlabel('Population of City in 10,000s');
```

执行截图如下：

![image-20220128102039012](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128102039012.png)

### 梯度下降算法

代价函数J(θ)与假设函数h<sub>θ</sub>(x)：

![image-20220128103022245](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128103022245.png)

迭代更新值：

![image-20220128102936148](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128102936148.png)

从而逐步使得θ<sub>j</sub>接近使得代价函数去的最小值的最优解。

### 增加θ<sub>0</sub>

给数据X增加θ<sub>0</sub>列，设置学习率α为0.01，设定初始查找位置为θ<sub>0</sub> = 0，θ<sub>1</sub> = 0

```octave
X = [ones(m, 1), data(:,1)];
theta = zeros(2, 1);
iterations = 1500;
alpha = 0.01;
```

### 计算代价函数

在迭代过程中计算代价函数能够更好的监控梯度下降的过程。

```octave
function J = computeCost(X, y, theta)
m = length(y);
J = sum((X * theta - y).^2) / (2*m);
end
```

并通过`gradientDescent`函数逐步迭代，并且在每一步中保存代价函数的值：

```octave
function [theta, J_history] = gradientDescent(X, y, theta, alpha, num_iters)
m = length(y);
J_history = zeros(num_iters, 1);
theta_s=theta;
for iter = 1:num_iters
    theta(1) = theta(1) - alpha * sum(X * theta_s - y) / m;       
    theta(2) = theta(2) - alpha * sum((X * theta_s - y) .* X(:,2)) / m;     
    theta_s=theta;    
    J_history(iter) = computeCost(X, y, theta);
end
J_history
end
```

继续执行ex1.m，执行结果截图：

![image-20220128112629425](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128112629425.png)

![image-20220128113042370](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128113042370.png)

绘制的完整代价函数3D图像与等高线图像如下所示。

![image-20220128112843030](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220128112843030.png)



完整的ex1.m代码如下：

```octave

data = load('ex1data1.txt');
X = data(:, 1); y = data(:, 2);
m = length(y); % number of training examples

% Plot Data
% Note: You have to complete the code in plotData.m
plotData(X, y);

fprintf('Program paused. Press enter to continue.\n');
pause;

%% =================== Part 3: Cost and Gradient descent ===================

X = [ones(m, 1), data(:,1)]; % Add a column of ones to x
theta = zeros(2, 1); % initialize fitting parameters

% Some gradient descent settings
iterations = 1500;
alpha = 0.01;

fprintf('\nTesting the cost function ...\n')
% compute and display initial cost
J = computeCost(X, y, theta);
fprintf('With theta = [0 ; 0]\nCost computed = %f\n', J);
fprintf('Expected cost value (approx) 32.07\n');

% further testing of the cost function
J = computeCost(X, y, [-1 ; 2]);
fprintf('\nWith theta = [-1 ; 2]\nCost computed = %f\n', J);
fprintf('Expected cost value (approx) 54.24\n');

fprintf('Program paused. Press enter to continue.\n');
pause;

fprintf('\nRunning Gradient Descent ...\n')
% run gradient descent
theta = gradientDescent(X, y, theta, alpha, iterations);

% print theta to screen
fprintf('Theta found by gradient descent:\n');
fprintf('%f\n', theta);
fprintf('Expected theta values (approx)\n');
fprintf(' -3.6303\n  1.1664\n\n');

% Plot the linear fit
hold on; % keep previous plot visible
plot(X(:,2), X*theta, '-')
legend('Training data', 'Linear regression')
hold off % don't overlay any more plots on this figure

% Predict values for population sizes of 35,000 and 70,000
predict1 = [1, 3.5] *theta;
fprintf('For population = 35,000, we predict a profit of %f\n',...
    predict1*10000);
predict2 = [1, 7] * theta;
fprintf('For population = 70,000, we predict a profit of %f\n',...
    predict2*10000);

fprintf('Program paused. Press enter to continue.\n');
pause;

%% ============= Part 4: Visualizing J(theta_0, theta_1) =============
fprintf('Visualizing J(theta_0, theta_1) ...\n')

% Grid over which we will calculate J
theta0_vals = linspace(-10, 10, 100);
theta1_vals = linspace(-1, 4, 100);

% initialize J_vals to a matrix of 0's
J_vals = zeros(length(theta0_vals), length(theta1_vals));

% Fill out J_vals
for i = 1:length(theta0_vals)
    for j = 1:length(theta1_vals)
	  t = [theta0_vals(i); theta1_vals(j)];
	  J_vals(i,j) = computeCost(X, y, t);
    end
end


% Because of the way meshgrids work in the surf command, we need to
% transpose J_vals before calling surf, or else the axes will be flipped
J_vals = J_vals';
% Surface plot
figure;
surf(theta0_vals, theta1_vals, J_vals)
xlabel('\theta_0'); ylabel('\theta_1');

% Contour plot
figure;
% Plot J_vals as 15 contours spaced logarithmically between 0.01 and 100
contour(theta0_vals, theta1_vals, J_vals, logspace(-2, 3, 20))
xlabel('\theta_0'); ylabel('\theta_1');
hold on;
plot(theta(1), theta(2), 'rx', 'MarkerSize', 10, 'LineWidth', 2);

```

