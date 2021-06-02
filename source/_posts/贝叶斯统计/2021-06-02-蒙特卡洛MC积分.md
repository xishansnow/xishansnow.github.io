---
layout:     post
title:      "  蒙特卡洛MC积分  "
description:   "  蒙特卡洛MC积分  "
date:       2021-06-02 14:00:00
author:     "西山晴雪"
mathjax:    true
categories: 
    - [贝叶斯统计, 概率图模型]
tags:
    - 贝叶斯统计
    - 概率图模型
    - 蒙特卡洛积分
    - MC积分
---

# 蒙特卡洛积分



## 1 引言

蒙特卡洛积分，并不是指一种名叫蒙特卡洛的积分，而是采用蒙特卡洛法来估计积分。蒙特卡洛是一类算法的统称，估计积分只是其中的一个应用，而积分计算在图形渲染起到非常重要的作用，本篇文章只介绍蒙特卡洛在积分估计上的应用。

“背景知识”部分会概述蒙特卡洛法用到的数学理论知识，内容在《概率论与数理统计》中都有涉及，以便你更好的理解后面介绍的原理。

“算法初识”部分主要是抛砖引玉，会通过一个例子来解释蒙特卡洛的核心思想，

在“积分估计”部分会详细阐述蒙特卡洛估计积分的方法及其数学原理。蒙特卡洛法中重要的一点是生成指定概率分布的随机数，“随机数”部分会阐述怎么生成符合指定分布的随机数。蒙特卡洛积分估计的优点在于它很简单，很容易扩展到多维的情况，但问题在于收敛速度较慢，而重要性采样和拟蒙特卡洛就是要了加速估计的收敛速度，直观的结果就是在相同的采样数下误差更小。“重要性采样”解决的是怎么设计最优的概率分布的问题。“拟蒙特卡洛”解决的是如何消除随机数产生的聚集问题，以缩减误差。

为了方便读者的理解，本篇文章会统一符号描述，被积函数采用 $f(x)$ 小写形式，被积函数的积分采用 $F(x)$ 大写形式，概率密度函数采用 $pdf(x)$ ，累积概率分布函数采用 $cdf(x)$ ，大写的 $X,Y$ 等表示随机变量，小写的 $x,y$ 等表示具体的实数，$N$ 表示样本数，  $p$ 表示维度。

```
推荐阅读《概率论与数理统计，浙江大学第4版》[2] 这本书，以及 https://www.scratchapixel.com/[3]中对蒙特卡洛积分估计部分的内容，很详尽。
```

## 2 背景知识

自然界中有一类现象在一定条件下必然会发生，例如向上抛一石子、同性电荷互相排斥等，这类现象称为**确定性现象**。还有一类现象在大量重复试验下，呈现出某种规律，例如多次重复抛一枚硬币得到正面朝上大致有一半等，这种大量重复试验中所呈现出的固有规律性，就是**统计规律性**。这种在个别试验中结果呈现不确定性，在大量重复试验中结果有统计规律性的现象，就称之为**随机现象**。

在随机试验中，尽管每次试验之前不能预知结果，但试验的所有可能结果组成的集合是已知的，随机试验的所有可能结果组成的集合称为**样本空间**（Sample Space），样本空间中的元素称为**样本点**。

一般称试验样本空间的子集为样本空间的**随机事件**，简称为**事件**（Event），例如规定某种灯泡的寿命小于500小时的为次品，那么满足这一条件的样本点组成的子集，就称为事件。当且仅当这一子集中的一个样本点出现时，称为**事件发生**。

在相同条件下进行了 $n$ 次试验，事件 $A$ 发生的次数 $n_A$ 称为事件 $A$ 发生的**频数**，比值 $\frac{n_A}{n}$ 称为事件 $A$ 发生的**频率**。

频数和频率是通过试验观察得到的数据，当重复试验的次数 $n$ 逐渐增大时，频率呈现出稳定性，逐渐收敛于某个常数，这种 `频率稳定性` 即通常所说的统计规律性，用来表征事件 $A$ 发生的可能性大小，即所谓的`概率`。

概率的数学定义：设 $E$ 是随机试验，$S$ 是它的样本空间，对于 $E$ 的每一事件 $A$ 赋予一个实数，记为 $P(A)$ ，称为事件 $A$ 的**概率**，它表征事件发生的可能性的大小。

以抛掷硬币为例，它的样本空间是{正面，反面}，这样就比较难记录和研究。所有引入一个法则，将随机试验的每一个结果与一个实数对应起来，这就有了随机变量的概念。设随机试验的样本空间为 $S={e},X=X(e)$ 是定义在样本空间 $S$ 上的实数单值函数，就称 $X$ 为**随机变量**。就如抛硬币试验为例，它的随机变量可以定义为，$X (正面)=0，X(反面)=1$，那么样本空间就可以表示为 ${0, 1}$ 。这里的的 0 和 1 是随机变量 $X$ 映射出来的值，**注意随机变量 $X$ 本质是函数**。

有些随机变量，它全部可能取到的值是有限个或可列无限多个，这种随机变量称为**离散随机变量**。还有些随机变量，它可能取的值充满一个区间，无法按一定次序一一列举出来，因而它是一个非离散型的随机变量，例如一个设备的寿命的概率模型，你无法例举所有的可能性，但是可以限定在一个区间范围内。

设![[公式]](https://www.zhihu.com/equation?tex=X)是一个随机变量，![[公式]](https://www.zhihu.com/equation?tex=x)是任意实数，函数![[公式]](https://www.zhihu.com/equation?tex=cdf%5Cleft%28+x+%5Cright%29%3DP%5Cleft%5C%7B+X%5Cle+x+%5Cright%5C%7D%2C-%5Cinfty+%5Cprec+x%5Cprec+%2B%5Cinfty)称为![[公式]](https://www.zhihu.com/equation?tex=X)的**累积分布函数**（Cumulative Distribution Function, **CDF**）。

如果对于随机变量![[公式]](https://www.zhihu.com/equation?tex=X)的累积分布函数![[公式]](https://www.zhihu.com/equation?tex=cdf%5Cleft%28+x+%5Cright%29)，存在非负函数![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)，使对于任意实数![[公式]](https://www.zhihu.com/equation?tex=x)，有

![[公式]](https://www.zhihu.com/equation?tex=cdf%5Cleft%28+x+%5Cright%29%3D%5Cint_%7B-%5Cinfty+%7D%5E%7Bx%7D%7Bpdf%5Cleft%28+t+%5Cright%29dt%7D+%5Ctag%7B1%7D)

则称X为**连续型随机变量**，其中函数![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)称为![[公式]](https://www.zhihu.com/equation?tex=X)的**概率密度函数**，简称**概率密度**（The Probability Distribution Function，**PDF**）。概率密度![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)具有以下几个性质：

-   ![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29%5Cge+0)；
-   ![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B-%5Cinfty+%7D%5E%7B%2B%5Cinfty+%7D%7Bpdf%5Cleft%28+t+%5Cright%29dt%7D%3D1)；
-   对于任意实数![[公式]](https://www.zhihu.com/equation?tex=%7B%7Bx%7D_%7B1%7D%7D%2C%7B%7Bx%7D_%7B2%7D%7D%5Cleft%28+%7B%7Bx%7D_%7B1%7D%7D%5Cle+%7B%7Bx%7D_%7B2%7D%7D+%5Cright%29)，有![[公式]](https://www.zhihu.com/equation?tex=P%5Cleft%5C%7B+%7B%7Bx%7D_%7B1%7D%7D%5Cprec+X%5Cle+%7B%7Bx%7D_%7B2%7D%7D+%5Cright%5C%7D%3D%5Cint_%7B%7B%7Bx%7D_%7B1%7D%7D%7D%5E%7B%7B%7Bx%7D_%7B2%7D%7D%7D%7Bpdf%5Cleft%28+t+%5Cright%29dt%7D)；
-   若![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)在点![[公式]](https://www.zhihu.com/equation?tex=x)处连续，则有![[公式]](https://www.zhihu.com/equation?tex=cdf%27%5Cleft%28+x+%5Cright%29%3Dpdf%5Cleft%28+x+%5Cright%29)。

有三种重要的连续型随机变量：

-   均匀分布；
-   指数分布；
-   正态分布。

由于内容限制，这里只介绍均匀分布，若连续型随机变量![[公式]](https://www.zhihu.com/equation?tex=X)具有概率密度：

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29%3D%5Cleft%5C%7B+%5Cbegin%7Bmatrix%7D++++%5Cfrac%7B1%7D%7Bb-a%7D+%26+a%5Cprec+x%5Cprec+b++%5C%5C++++%5Ctext%7B0%7D+%26+others++%5C%5C+%5Cend%7Bmatrix%7D+%5Cright.+%5Ctag%7B2%7D)

则称![[公式]](https://www.zhihu.com/equation?tex=X)在区间(a, b)上服从**均匀分布**。

对于连续型随机变量![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%28+X%2CY+%5Cright%29)，设它的概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x%2Cy+%5Cright%29)，![[公式]](https://www.zhihu.com/equation?tex=X)是一个连续型随机变量，其概率密度函数表示为：

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B%5Ctext%7BX%7D%7D%7D%5Cleft%28+x+%5Cright%29%3D%5Cint_%7B-%5Cinfty+%7D%5E%7B%2B%5Cinfty+%7D%7Bpdf%5Cleft%28+x%2Cy+%5Cright%29dy%7D%5C%5C)

类似的，![[公式]](https://www.zhihu.com/equation?tex=Y)也是一个连续型随机变量，其概率密度函数表示为：

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%3D%5Cint_%7B-%5Cinfty+%7D%5E%7B%2B%5Cinfty+%7D%7Bpdf%5Cleft%28+x%2Cy+%5Cright%29dx%7D%5C%5C)

分别称![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B%5Ctext%7BX%7D%7D%7D%5Cleft%28+x+%5Cright%29)，![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B%5Ctext%7BX%7D%7D%7D%5Cleft%28+x+%5Cright%29)为![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%28+X%2CY+%5Cright%29)关于![[公式]](https://www.zhihu.com/equation?tex=X)与关于![[公式]](https://www.zhihu.com/equation?tex=Y)的**边缘概率密度函数**。

设二维随机变量![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%28+X%2CY+%5Cright%29)的概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)，![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%28+X%2CY+%5Cright%29)关于![[公式]](https://www.zhihu.com/equation?tex=Y)的边缘概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=%7B%7Bpdf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29)，若对于固定的![[公式]](https://www.zhihu.com/equation?tex=y)，![[公式]](https://www.zhihu.com/equation?tex=%7B%7Bpdf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%5Csucc+0)，则称![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x%2Cy+%5Cright%29%2F%7B%7Bpdf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29)为在![[公式]](https://www.zhihu.com/equation?tex=Y%3Dy)的条件下![[公式]](https://www.zhihu.com/equation?tex=X)的条件概率密度，记为：

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x%7Cy+%5Cright%29%3D%5Cfrac%7Bpdf%5Cleft%28+x%2Cy+%5Cright%29%7D%7B%7B%7Bpdf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%7D+%5Ctag%7B3%7D)

设连续型随机变量![[公式]](https://www.zhihu.com/equation?tex=X)的概率密度为![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)，若积分![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B-%5Cinfty+%7D%5E%7B%2B%5Cinfty+%7D%7Bx%5Ccdot+pdf%5Cleft%28+x+%5Cright%29dx%7D)绝对收敛，则称积分![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B-%5Cinfty+%7D%5E%7B%2B%5Cinfty+%7D%7Bx%5Ccdot+pdf%5Cleft%28+x+%5Cright%29dx%7D)的值为随机变量![[公式]](https://www.zhihu.com/equation?tex=X)的数学期望，记为![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+X+%5Cright%29)，简称为期望，记为：

![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+X+%5Cright%29%3D%5Cint_%7B-%5Cinfty+%7D%5E%7B%2B%5Cinfty+%7D%7Bxf%5Cleft%28+x+%5Cright%29dx%7D+%5Ctag%7B4%7D)

期望是随机试验下所有那些可能结果的平均值，它有几个重要的性质：

-   设![[公式]](https://www.zhihu.com/equation?tex=C)是常数，则有![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+C+%5Cright%29%3DC)；
-   设![[公式]](https://www.zhihu.com/equation?tex=X)是一个随机变量，![[公式]](https://www.zhihu.com/equation?tex=C)是常数，则有![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+CX+%5Cright%29%3DCE%5Cleft%28+X+%5Cright%29)；
-   设![[公式]](https://www.zhihu.com/equation?tex=X)，![[公式]](https://www.zhihu.com/equation?tex=Y)是两个随机变量，则有:![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+X%2BY+%5Cright%29%3DE%5Cleft%28+X+%5Cright%29%2BE%5Cleft%28+Y+%5Cright%29)；
-   设![[公式]](https://www.zhihu.com/equation?tex=X)，![[公式]](https://www.zhihu.com/equation?tex=Y)是互相独立的随机变量，则有![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+XY+%5Cright%29%3DE%5Cleft%28+X+%5Cright%29E%5Cleft%28+Y+%5Cright%29)。

设![[公式]](https://www.zhihu.com/equation?tex=X)是一个随机变量，若![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%5C%7B+%7B%7B%5Cleft%5B+X-E%5Cleft%28+X+%5Cright%29+%5Cright%5D%7D%5E%7B2%7D%7D+%5Cright%5C%7D)存在，则称它的值为![[公式]](https://www.zhihu.com/equation?tex=X)的方差，记为![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+X+%5Cright%29)，即：

![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+X+%5Cright%29%3DE%5Cleft%5C%7B+%7B%7B%5Cleft%5B+X-E%5Cleft%28+X+%5Cright%29+%5Cright%5D%7D%5E%7B2%7D%7D+%5Cright%5C%7D+%5Ctag%7B5%7D)

在应用上还引入量![[公式]](https://www.zhihu.com/equation?tex=%5Csqrt%7BD%5Cleft%28+X+%5Cright%29%7D)，记为![[公式]](https://www.zhihu.com/equation?tex=%5Csigma+%5Cleft%28+X+%5Cright%29)，称为标准差或均方差。

方差表示的是随机变量与其均值的偏移程度，随机变量![[公式]](https://www.zhihu.com/equation?tex=X)的方差可按下列公式计算:

![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+X+%5Cright%29%3DE%5Cleft%28+%7B%7BX%7D%5E%7B2%7D%7D+%5Cright%29-%7B%7B%5Cleft%5B+E%5Cleft%28+X+%5Cright%29+%5Cright%5D%7D%5E%7B2%7D%7D+%5Ctag%7B6%7D)

方差也有几个重要的性质：

-   设![[公式]](https://www.zhihu.com/equation?tex=C)是常数，则![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+C+%5Cright%29%3D0)；
-   设![[公式]](https://www.zhihu.com/equation?tex=X)是随机变量，![[公式]](https://www.zhihu.com/equation?tex=C)是常数，则有![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+CX+%5Cright%29%3D%7B%7BC%7D%5E%7B2%7D%7DD%5Cleft%28+X+%5Cright%29)， ![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+X%2BC+%5Cright%29%3DD%5Cleft%28+X+%5Cright%29)；
-   设![[公式]](https://www.zhihu.com/equation?tex=X)，![[公式]](https://www.zhihu.com/equation?tex=Y)是两个随机变量，则有

![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+X%2BY+%5Cright%29%3DD%5Cleft%28+X+%5Cright%29%2BD%5Cleft%28+Y+%5Cright%29%2B2E%5Cleft%5C%7B+%5Cleft%28+X-E%5Cleft%28+X+%5Cright%29+%5Cright%29%5Cleft%28+Y-E%5Cleft%28+Y+%5Cright%29+%5Cright%29+%5Cright%5C%7D+%5Ctag%7B7%7D)

特别，若![[公式]](https://www.zhihu.com/equation?tex=X)，![[公式]](https://www.zhihu.com/equation?tex=Y)互相独立，则![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+X%2BY+%5Cright%29%3DD%5Cleft%28+X+%5Cright%29%2BD%5Cleft%28+Y+%5Cright%29)。

设随机变量![[公式]](https://www.zhihu.com/equation?tex=X)具有数学期望![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+X+%5Cright%29%3D%5Cmu+)，方差![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+X+%5Cright%29%3D%7B%7B%5Csigma+%7D%5E%7B2%7D%7D)，则对于任意正数![[公式]](https://www.zhihu.com/equation?tex=%5Cvarepsilon)，不等式

![[公式]](https://www.zhihu.com/equation?tex=P%5Cleft%5C%7B+%5Cleft%7C+X-%5Cmu++%5Cright%7C%5Cge+%5Cvarepsilon++%5Cright%5C%7D%5Cle+%5Cfrac%7B%7B%7B%5Csigma+%7D%5E%7B2%7D%7D%7D%7B%7B%7B%5Cvarepsilon+%7D%5E%7B2%7D%7D%7D+%5Ctag%7B8%7D)

成立。这一不等式称为**切比雪夫**（Chebyshev）不等式。

**辛钦大数定理**：设![[公式]](https://www.zhihu.com/equation?tex=%7B%7BX%7D_%7B1%7D%7D%2C%7B%7BX%7D_%7B2%7D%7D%2C%5Ccdots+)是相互独立，服从同一分布随机变量序列，且具有数学期望![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%3D%5Cmu+%5Cleft%28+k%3D1%2C2%2C%5Ccdots++%5Cright%29)，作前n个变量的算术平均![[公式]](https://www.zhihu.com/equation?tex=%5Cfrac%7B1%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%7B%7BX%7D_%7Bk%7D%7D%7D)，则对于任意![[公式]](https://www.zhihu.com/equation?tex=%5Cvarepsilon+%5Csucc+0)，有：

![[公式]](https://www.zhihu.com/equation?tex=%5Cunderset%7Bn%5Cto+%5Cinfty+%7D%7B%5Cmathop%7B%5Clim+%7D%7D%5C%2CP%5Cleft%5C%7B+%5Cleft%7C+%5Cfrac%7B1%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%7B%7BX%7D_%7Bk%7D%7D%7D-%5Cmu++%5Cright%7C%5Cprec+%5Cvarepsilon++%5Cright%5C%7D%3D1+%5Ctag%7B9%7D)

**伯努利大数定理**：设![[公式]](https://www.zhihu.com/equation?tex=%7B%7Bf%7D_%7BA%7D%7D)是n次独立重复试验中事件A发生的次数，p是事件A在每次试验中发生的概率，则对于任意正数![[公式]](https://www.zhihu.com/equation?tex=%5Cvarepsilon+%5Csucc+0)，有：

![[公式]](https://www.zhihu.com/equation?tex=%5Cunderset%7Bn%5Cto+%5Cinfty+%7D%7B%5Cmathop%7B%5Clim+%7D%7D%5C%2CP%5Cleft%5C%7B+%5Cleft%7C+%5Cfrac%7B%7B%7Bf%7D_%7BA%7D%7D%7D%7Bn%7D-p+%5Cright%7C%5Cprec+%5Cvarepsilon++%5Cright%5C%7D%3D1+%5Ctag%7B10%7D)

这两个数学表达式很能体现数学之美，简洁明了。辛钦大数定理解释了：在大量重复试验下，样本的平均值约等式总体的平均值。伯努利大数定理解释了：在大量重复试验下，样本的频率收敛于其概率。

设![[公式]](https://www.zhihu.com/equation?tex=%7B%7BX%7D_%7B1%7D%7D%2C%7B%7BX%7D_%7B2%7D%7D%2C%5Ccdots+%2C%7B%7BX%7D_%7Bn%7D%7D)是随机变量![[公式]](https://www.zhihu.com/equation?tex=X)的一组样本，![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta+)是包含在总体变量![[公式]](https://www.zhihu.com/equation?tex=X)分布中的待估参数，若**估计量**![[公式]](https://www.zhihu.com/equation?tex=%5Chat%7B%5Ctheta+%7D%3D%5Chat%7B%5Ctheta+%7D%5Cleft%28+%7B%7BX%7D_%7B1%7D%7D%2C%7B%7BX%7D_%7B2%7D%7D%2C%5Ccdots+%2C%7B%7BX%7D_%7Bn%7D%7D+%5Cright%29)的数学期望![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+%7B%5Chat%7B%5Ctheta+%7D%7D+%5Cright%29)存在，且对于任意![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta)有

![[公式]](https://www.zhihu.com/equation?tex=E%5Cleft%28+%7B%5Chat%7B%5Ctheta+%7D%7D+%5Cright%29%3D%5Ctheta%5C%5C)

则称![[公式]](https://www.zhihu.com/equation?tex=%5Chat%7B%5Ctheta+%7D)是![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta+)的**无偏估计量**。

对于待估参数，不同的样本值就会得到不同的估计值。这样，要确定一个估计量的好坏，就不能仅仅依据某次抽样的结果来衡量，而必须由大量抽样的结果来衡量。对此，一个自然而基本的衡量标准是要求估计量**无系统偏差**。也就是说，尽管在一次抽样中得到的估计值不一定恰好等于待估参数的真值，但在大量重复抽样时，所得到的估计值平均起来应与待估参数的真值相同，换句话说，希望估计量的数学期望应等于待估参数的真值。

## 算法初识

引用俄罗斯的数学家Sobol的一句话[3]：

> The Monte Carlo method is a numerical method of solving mathematical problems by random sampling (or by the simulation of random variables).  

蒙特卡洛方法是一类通过随机采样来求解问题的算法的统称，要求解的问题是某随机事件的概率或某随机变量的期望。通过随机抽样的方法，以随机事件出现的频率估计其概率，并将其作为问题的解。本篇文章主要介绍蒙特卡洛方法在积分计算上的应用。

![](https://pic4.zhimg.com/v2-15752c466116b9fba5b5ffdebad814ff_b.jpg)

![](https://pic4.zhimg.com/80/v2-15752c466116b9fba5b5ffdebad814ff_720w.jpg)

图1. 蒙特卡洛法估计不规则图形面积[3]

蒙特卡洛的基本做法是通过大量重复试验，通过统计频率，来估计概率，从而得到问题的求解。举个例子，如图1所示，一个矩形内有一个不规则图案，要求解不规则图形的面积。显然，矩形的面积可以简单计算为![[公式]](https://www.zhihu.com/equation?tex=A%3Dab%5Ctimes+ac)，点位于不规则形状内的概率为![[公式]](https://www.zhihu.com/equation?tex=p%3D%7B%7BA%7D_%7Bshape%7D%7D%2FA)。现在重复往矩形范围内随机的投射点，样本点有一定概率会落在不规则图形内，若复杂n次试验，落到不规则图形内的次数为k，频率为k/n，若样本数量较大，则有

![[公式]](https://www.zhihu.com/equation?tex=p%3D%5Cfrac%7B%7B%7BA%7D_%7Bshape%7D%7D%7D%7BA%7D%5Capprox+%5Cfrac%7Bk%7D%7Bn%7D%5C%5C)

根据伯努利大数定理得到的结论就是：随着样本数增加，频率k/n会收敛于概率p，使得该等式成立。

因此，我们可以估计出不规则图形的面积为![[公式]](https://www.zhihu.com/equation?tex=kA%2Fn)。假设矩形面积为1，投射了1000次，有200个点位于不规则形状内，则可以推算出不规则图形的面积为0.2，投射的次数越大，计算出来的面积越精确。

这样的一个例子说明蒙特卡洛方法的基本思路，它并不是“缘分”求解法，而是有严格的数学基础作为依托，前面介绍的大数定理是它重要的理论基础。但是，蒙特卡洛方法的求解的结果是有误差的，重复的试验越多误差就会越低。

## 积分估计

举个简单的例子，设一个函数![[公式]](https://www.zhihu.com/equation?tex=f%5Cleft%28+x+%5Cright%29%3D3%7B%7Bx%7D%5E%7B2%7D%7D)，计算其在区间[a, b]上的积分值，如图2所示，容易得到：

![[公式]](https://www.zhihu.com/equation?tex=F%5Cleft%28+x+%5Cright%29%3D%5Cint_%7Ba%7D%5E%7Bb%7D%7Bf%5Cleft%28+x+%5Cright%29%7D%3D%5Cleft.+%7B%7Bx%7D%5E%7B3%7D%7D+%5Cright%7C_%7Ba%7D%5E%7Bb%7D%5C%5C)

![](https://pic1.zhimg.com/v2-53e17990a78d4034b2d80ff4207b9e90_b.jpg)

![](https://pic1.zhimg.com/80/v2-53e17990a78d4034b2d80ff4207b9e90_720w.jpg)

图2. 函数示意图

假定要求的积分区间是[1, 3]，那么积分结果为![[公式]](https://www.zhihu.com/equation?tex=%7B%7B3%7D%5E%7B3%7D%7D-%7B%7B1%7D%5E%7B3%7D%7D%3D26)。

若采用蒙特卡洛方法来计算函数积分，这里直给出一般的定义，设![[公式]](https://www.zhihu.com/equation?tex=%7B%7BX%7D_%7B1%7D%7D%2C%7B%7BX%7D_%7B2%7D%7D%2C%5Ccdots+%7B%7BX%7D_%7Bn%7D%7D)是相互独立的样本且服从同一分布，概率密度函数表示为![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)，则函数的积分可以表示为：

![[公式]](https://www.zhihu.com/equation?tex=%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29%3D%5Cfrac%7B1%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%5Cfrac%7Bf%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%7D%7Bpdf%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%7D%7D+%5Ctag%7B11%7D)

这就是蒙特卡洛法积分的一般等式，不要问为什么要除以概率密度函数，可以理解为是对样本进行的统计处理，我们要做的是验证这个做法是正确的。

还是回到前面的特殊情况，函数![[公式]](https://www.zhihu.com/equation?tex=f%5Cleft%28+x+%5Cright%29)是区间[a, b]上的均匀分布，均匀分布参见等式（2），则任意一个样本点的概率密度函数是![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29%3D1%2F%5Cleft%28+b-a+%5Cright%29)，代入等式（11）可知：

![[公式]](https://www.zhihu.com/equation?tex=%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29%3D%5Cfrac%7Bb-a%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7Bf%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%7D+%5Ctag%7B12%7D)

那么，若样本是{2}，则![[公式]](https://www.zhihu.com/equation?tex=%7B%7BF%7D_%7B1%7D%7D%5Cleft%28+x+%5Cright%29%3D24)；若样本是{1, 2, 3}，则![[公式]](https://www.zhihu.com/equation?tex=%7B%7BF%7D_%7B3%7D%7D%5Cleft%28+x+%5Cright%29%3D28)；若样本是{1.0, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3.0}，则![[公式]](https://www.zhihu.com/equation?tex=%7B%7BF%7D_%7B9%7D%7D%5Cleft%28+x+%5Cright%29%3D26.5)。以这个趋势，不断在逼近的积分结果26。若随机采样10k个均匀的随机采样点，那么它的结果一定是逼近26的，这是代码片段，跑的的结果min\_sum = 25.9683，max\_sum = 26.1315。

```cpp
#include <random>
#include <time.h>
#include <iostream>

float f(float x){
    return 3 * x * x;
}

int main() {
    int run_times = 1000;
    float min_sum = 10000.0f, max_sum = -10000.0f;
    std::default_random_engine seed(time(NULL));
    while (run_times--) {
        int num_samples = 10000;
        float a = 1.0f, b = 3.0f, sum = 0.0f;
        std::uniform_real_distribution<float> random(a, b);
        for (int i = 0; i < num_samples; i++) {
            float sample = random(seed);
            sum += (b - a) * f(sample);
        }
        sum /= num_samples;
        min_sum = min_sum > sum ? sum : min_sum;
        max_sum = max_sum < sum ? sum : max_sum;
    }
    std::cout << min_sum << "  " << max_sum << std::endl;
    return 0;
}
```

最后，我们来证明蒙特卡洛法的积分估计量的正确性：

![[公式]](https://www.zhihu.com/equation?tex=%5Cbegin%7Baligned%7D+++%26+E%5Cleft%5B+%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29+%5Cright%5D+%5C%5C+++%26+%3DE%5Cleft%5B+%5Cfrac%7B1%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%5Cfrac%7Bf%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%7D%7Bpdf%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%7D%7D+%5Cright%5D+%5C%5C+++%26+%3D%5Cfrac%7B1%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%5Cint%7B%5Cfrac%7Bf%5Cleft%28+x+%5Cright%29%7D%7Bpdf%5Cleft%28+x+%5Cright%29%7D%5Ccdot+pdf%5Cleft%28+x+%5Cright%29dx%7D%7D+%5C%5C+++%26+%3D%5Cfrac%7B1%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%5Cint%7Bf%5Cleft%28+x+%5Cright%29dx%7D%7D+%5C%5C+++%26+%3D%5Cint%7Bf%5Cleft%28+x+%5Cright%29dx%7D+%5C%5C++%5Cend%7Baligned%7D)

蒙特卡洛法的积分估计量的数学期望等于被积函数的积分真值，证明![[公式]](https://www.zhihu.com/equation?tex=%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29)是无偏估计量（无偏估计的概念参见前面的介绍）。

估计量的方差，代表了它与被估真值之间的偏移，设蒙特卡洛估计量的标准差为![[公式]](https://www.zhihu.com/equation?tex=%5Csigma)，由于![[公式]](https://www.zhihu.com/equation?tex=%7B%7BX%7D_%7B1%7D%7D%2C%7B%7BX%7D_%7B2%7D%7D%2C%5Ccdots+%7B%7BX%7D_%7Bn%7D%7D)是相互独立的样本且服从同一分布，可知：

![[公式]](https://www.zhihu.com/equation?tex=%5Cbegin%7Baligned%7D+++%26+%7B%7B%5Csigma+%7D%5E%7B2%7D%7D%5Cleft%5B+%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29+%5Cright%5D+%5C%5C+++%26+%3D%7B%7B%5Csigma+%7D%5E%7B2%7D%7D%5Cleft%5B+%5Cfrac%7B1%7D%7Bn%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%5Cfrac%7Bf%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%7D%7Bp%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29%7D%7D+%5Cright%5D+%5C%5C+++%26+%3D%5Cfrac%7B1%7D%7B%7B%7Bn%7D%5E%7B2%7D%7D%7D%5Csum%5Climits_%7Bk%3D1%7D%5E%7Bn%7D%7B%5Cint%7B%7B%7B%5Cleft%28+%5Cfrac%7Bf%5Cleft%28+x+%5Cright%29%7D%7Bpdf%5Cleft%28+x+%5Cright%29%7D-E%5Cleft%28+%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D%5Ccdot+pdf%5Cleft%28+x+%5Cright%29dx%7D%7D+%5C%5C+++%26+%3D%5Cfrac%7B1%7D%7Bn%7D%5Cleft%5B+%5Cint%7B%7B%7B%5Cleft%28+%5Cfrac%7Bf%5Cleft%28+x+%5Cright%29%7D%7Bpdf%5Cleft%28+x+%5Cright%29%7D+%5Cright%29%7D%5E%7B2%7D%7D%5Ccdot+pdf%5Cleft%28+x+%5Cright%29dx%7D-E%7B%7B%5Cleft%28+%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D+%5Cright%5D+%5C%5C+++%26+%3D%5Cfrac%7B1%7D%7Bn%7D%5Cleft%5B+%5Cint%7B%5Cfrac%7Bf%7B%7B%5Cleft%28+x+%5Cright%29%7D%5E%7B2%7D%7D%7D%7Bpdf%5Cleft%28+x+%5Cright%29%7Ddx%7D-E%7B%7B%5Cleft%28+%7B%7BF%7D_%7Bn%7D%7D%5Cleft%28+X+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D+%5Cright%5D+%5C%5C++%5Cend%7Baligned%7D)

从式子中可知，标准差与![[公式]](https://www.zhihu.com/equation?tex=1%2F%5Csqrt%7Bn%7D)正相关，可以表示为：

![[公式]](https://www.zhihu.com/equation?tex=%5Csigma+%5Cpropto+%5Cfrac%7B1%7D%7B%5Csqrt%7Bn%7D%7D+%5Ctag%7B13%7D)

由式子（13）可以得出积分估计量的收敛与被积函数的维度等都无关，只跟样本数有关。

蒙特卡洛法进行积分估计，是非常简单的，无偏的。但是它的收敛速度比较慢，如何想要将误差降低1/2，需要提高4倍的采样数，不容易精确的计算方差，这就代表无法精确计算误差值。

前面介绍的切比雪夫不等、中心大数定理也保证了在大样本条件下，蒙特卡洛法估计出来的积分值是正确的，但是我们更希望在较小的采样数的条件也，也可以控制误差范围。方差表示随机变量与其均值的偏移程度，蒙特卡洛的估计值与积分真值存在差异，这个差异就是用方差表示，方差的大小也就代表了误差的大小，常提到的**方差缩减**，目的就是降低误差。方差缩减的研究课题是如何能做到不提高采样数，达到缩减误差的目的。本篇文章后面介绍的重要性采样和拟蒙特卡洛就是方差缩减中的两种策略。

## 随机数

随机变量![[公式]](https://www.zhihu.com/equation?tex=X)通常表示某种概率分布，随机数通常指生成某种概率分布的生成器，也就是随机变量![[公式]](https://www.zhihu.com/equation?tex=X)的生成器。如何生成符合指定概率分布特点的随机数是本小节要解决的问题。

设![[公式]](https://www.zhihu.com/equation?tex=X)是一个随机变量，它的概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)，它的累积分布函数可以表示为：

![[公式]](https://www.zhihu.com/equation?tex=cdf%5Cleft%28+x+%5Cright%29%3D%5Cint_%7B-%5Cinfty+%7D%5E%7Bx%7D%7Bpdf%5Cleft%28+t+%5Cright%29dt%7D+%5Ctag%7B14%7D)

那么，计算符合该概率分布的随机数方法如下所示：

-   对于概率密度函数![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29)，计算它的分布函数![[公式]](https://www.zhihu.com/equation?tex=cdf%5Cleft%28+x+%5Cright%29)，如等式（14）所示；
-   计算![[公式]](https://www.zhihu.com/equation?tex=cdf%5Cleft%28+x+%5Cright%29)的反函数![[公式]](https://www.zhihu.com/equation?tex=cd%7B%7Bf%7D%5E%7B-1%7D%7D%5Cleft%28+x+%5Cright%29)；
-   对于一个均匀分布的随机数![[公式]](https://www.zhihu.com/equation?tex=%5Cxi)，则![[公式]](https://www.zhihu.com/equation?tex=X%3Dcd%7B%7Bf%7D%5E%7B-1%7D%7D%5Cleft%28+%5Cxi++%5Cright%29)，就是符合该概率分布的随机数。

举个例子，区间[0, 1]之间的概率密度函数

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29%3Dc%7B%7Bx%7D%5E%7Bn%7D%7D%2Cx%5Cin+%5B0%2C1%5D%5C%5C)

其中，c和n是一个常数，由于概率密度函数要求![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B0%7D%5E%7B1%7D%7Bpdf%5Cleft%28+x+%5Cright%29%7D%3D1)，易知

![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B0%7D%5E%7B1%7D%7Bc%7B%7Bx%7D%5E%7Bn%7D%7D%7D%3D%5Cleft.+c%5Cfrac%7B%7B%7Bx%7D%5E%7Bn%2B1%7D%7D%7D%7Bn%2B1%7D+%5Cright%7C_%7B0%7D%5E%7B1%7D%3D%5Cfrac%7Bc%7D%7Bn%2B1%7D%3D1%5C%5C)

得到![[公式]](https://www.zhihu.com/equation?tex=c%3Dn%2B1)，首先计算累积分布函数

![[公式]](https://www.zhihu.com/equation?tex=cdf%5Cleft%28+x+%5Cright%29%3D%5Cint_%7B0%7D%5E%7Bx%7D%7B%5Cleft%28+n%2B1+%5Cright%29%7B%7Bt%7D%5E%7Bn%7D%7Ddt%7D%3D%7B%7Bx%7D%5E%7Bn%2B1%7D%7D%5C%5C)

其反函数为

![[公式]](https://www.zhihu.com/equation?tex=cd%7B%7Bf%7D%5E%7B-1%7D%7D%5Cleft%28+x+%5Cright%29%3D%5Csqrt%5Bn%2B1%5D%7Bx%7D%5C%5C)

符合该概率分布的随机数为

![[公式]](https://www.zhihu.com/equation?tex=X%3D%5Csqrt%5Bn%2B1%5D%7B%5Cxi+%7D%5C%5C)

C++实现的代码也很简单：

```cpp
float a = 0, b = 1.0f, n = 10.0f;
std::default_random_engine seed(time(NULL));
std::uniform_real_distribution<float> random(a, b);
float uniform_random = random(seed);
// generate the specified random.
float r = pow(uniform_random, 1 / (n + 1));
```

**分布变换**

现在考虑一个随机变量的概率分布是从另外一个概率分布变换而来，这种情况怎么生成随机数呢？

设![[公式]](https://www.zhihu.com/equation?tex=X)是随机变量，它的概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7Bx%7D%7D%5Cleft%28+x+%5Cright%29)。![[公式]](https://www.zhihu.com/equation?tex=Y)是另外一个随机变量，它的概率密度函数是![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+pd%7B%7Bf%7D_%7BX%7D%7D%5Cleft%28+x+%5Cright%29+%5Cright%29)，如何计算计算随机变量Y的概率密度函数呢，设![[公式]](https://www.zhihu.com/equation?tex=y%3Dpd%7B%7Bf%7D_%7BX%7D%7D%5Cleft%28+x+%5Cright%29)，则![[公式]](https://www.zhihu.com/equation?tex=Y)的概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7By%7D%7D%5Cleft%28+x+%5Cright%29)。

由概率密度函数的性质，容易得出结论![[公式]](https://www.zhihu.com/equation?tex=x)与![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29)必需是一一对应的关系，易知

![[公式]](https://www.zhihu.com/equation?tex=cd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%3Dcd%7B%7Bf%7D_%7BX%7D%7D%5Cleft%28+x+%5Cright%29%5C%5C)

两别分别求导，得

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%5Ccdot+%5Cfrac%7Bdy%7D%7Bdx%7D%3Dpd%7B%7Bf%7D_%7BX%7D%7D%5Cleft%28+x+%5Cright%29%5C%5C)

即有

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%3Dpd%7B%7Bf%7D_%7BX%7D%7D%5Cleft%28+x+%5Cright%29%5Ccdot+%7B%7B%5Cleft%28+%5Cfrac%7Bdy%7D%7Bdx%7D+%5Cright%29%7D%5E%7B-1%7D%7D%5C%5C)

一般y的导数是都是正或者负的，则

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%3Dpd%7B%7Bf%7D_%7BX%7D%7D%5Cleft%28+x+%5Cright%29%5Ccdot+%7B%7B%5Cleft%7C+%5Cfrac%7Bdy%7D%7Bdx%7D+%5Cright%7C%7D%5E%7B-1%7D%7D+%5Ctag%7B15%7D)

举个例子，区间[0, 1]之间的概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7Bx%7D%7D%5Cleft%28+x+%5Cright%29%3D2x)，![[公式]](https://www.zhihu.com/equation?tex=Y%3D%5Csin+X)，如何计算![[公式]](https://www.zhihu.com/equation?tex=Y)的概率密度函数呢？

由于![[公式]](https://www.zhihu.com/equation?tex=dy%2Fdx%3D%5Ccos+x)，则

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+y+%5Cright%29%3D%5Cfrac%7B2x%7D%7B%5Cleft%7C+%5Ccos+x+%5Cright%7C%7D%3D%5Cfrac%7B2%5Carcsin+y%7D%7B%5Csqrt%7B1-%7B%7By%7D%5E%7B2%7D%7D%7D%7D%5C%5C)

可以扩展到多维的情况，设![[公式]](https://www.zhihu.com/equation?tex=%7B%7BX%7D_%7B1%7D%7D%2C%7B%7BX%7D_%7B2%7D%7D%2C%5Ccdots+%2C%7B%7BX%7D_%7Bn%7D%7D)是随机变量，![[公式]](https://www.zhihu.com/equation?tex=%7B%7BY%7D_%7Bk%7D%7D%3D%7B%7BT%7D_%7Bk%7D%7D%5Cleft%28+%7B%7BX%7D_%7Bk%7D%7D+%5Cright%29)是变换函数，对应的随机变量是![[公式]](https://www.zhihu.com/equation?tex=%7B%7BY%7D_%7B1%7D%7D%2C%7B%7BY%7D_%7B2%7D%7D%2C%5Ccdots+%2C%7B%7BY%7D_%7Bn%7D%7D)，可以构造一个雅可比矩阵：

![[公式]](https://www.zhihu.com/equation?tex=%7B%7BJ%7D_%7BT%7D%7D%3D%5Cleft%28+%5Cbegin%7Bmatrix%7D++++%5Cpartial+%7B%7BT%7D_%7B1%7D%7D%2F%5Cpartial+%7B%7Bx%7D_%7B1%7D%7D+%26+%5Ccdots++%26+%5Cpartial+%7B%7BT%7D_%7B1%7D%7D%2F%5Cpartial+%7B%7Bx%7D_%7Bn%7D%7D++%5C%5C++++%5Cvdots++%26+%5Cddots++%26+%5Cvdots+++%5C%5C++++%5Cpartial+%7B%7BT%7D_%7Bn%7D%7D%2F%5Cpartial+%7B%7Bx%7D_%7B1%7D%7D+%26+%5Ccdots++%26+%5Cpartial+%7B%7BT%7D_%7Bn%7D%7D%2F%5Cpartial+%7B%7Bx%7D_%7Bn%7D%7D++%5C%5C+%5Cend%7Bmatrix%7D+%5Cright%29+%5Ctag%7B16%7D)

那么可以得到:

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7BY%7D%7D%5Cleft%28+%7B%7By%7D_%7B1%7D%7D%2C%7B%7By%7D_%7B2%7D%7D%2C%5Ccdots+%2C%7B%7By%7D_%7Bn%7D%7D+%5Cright%29%3D%5Cfrac%7Bpd%7B%7Bf%7D_%7BX%7D%7D%5Cleft%28+%7B%7Bx%7D_%7B1%7D%7D%2C%7B%7Bx%7D_%7B2%7D%7D%2C%5Ccdots+%2C%7B%7Bx%7D_%7Bn%7D%7D+%5Cright%29%7D%7B%5Cleft%7C+%7B%7BJ%7D_%7BT%7D%7D+%5Cright%7C%7D+%5Ctag%7B17%7D)

其中，![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%7C+%7B%7BJ%7D_%7BT%7D%7D+%5Cright%7C)是矩阵![[公式]](https://www.zhihu.com/equation?tex=%7B%7BJ%7D_%7BT%7D%7D)的行列式。

以三维空间下的极坐标为例，如下所示

![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%5C%7B+%5Cbegin%7Baligned%7D+++%26+x%3Dr%5Csin+%5Ctheta+%5Ccos+%5Cphi++%5C%5C+++%26+y%3Dr%5Csin+%5Ctheta+%5Csin+%5Cphi++%5C%5C+++%26+z%3Dr%5Ccos+%5Ctheta++%5C%5C++%5Cend%7Baligned%7D+%5Cright.+%5Ctag%7B18%7D)

其中，![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta+%5Cin+%5Cleft%5B+0%2C%5Cpi++%5Cright%5D%2C%5Cphi+%5Cin+%5Cleft%5B+0%2C2%5Cpi++%5Cright%5D)

对应的雅可比矩阵为：

![[公式]](https://www.zhihu.com/equation?tex=%7B%7BJ%7D_%7BT%7D%7D%3D%5Cleft%28+%5Cbegin%7Bmatrix%7D++++%5Csin+%5Ctheta+%5Ccos+%5Cphi++%26+r%5Ccos+%5Ctheta+%5Ccos+%5Cphi++%26+-r%5Csin+%5Ctheta+%5Csin+%5Cphi+++%5C%5C++++%5Csin+%5Ctheta+%5Csin+%5Cphi++%26+r%5Ccos+%5Ctheta+%5Csin+%5Cphi++%26+r%5Csin+%5Ctheta+%5Ccos+%5Cphi+++%5C%5C++++%5Ccos+%5Ctheta++%26+-r%5Csin+%5Ctheta++%26+0++%5C%5C+%5Cend%7Bmatrix%7D+%5Cright%29%5C%5C)

则行列式为![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%7C+%7B%7BJ%7D_%7BT%7D%7D+%5Cright%7C%3D%7B%7Br%7D%5E%7B2%7D%7D%5Csin+%5Ctheta+)，代入等式（17），得

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+r%2C%5Ctheta+%2C%5Cphi++%5Cright%29%3D%7B%7Br%7D%5E%7B2%7D%7D%5Csin+%5Ctheta+%5Ccdot+pdf%5Cleft%28+x%2Cy%2Cz+%5Cright%29+%5Ctag%7B19%7D)

现在考虑半球积分的采样，设半球的概率密度函数为![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Comega++%5Cright%29%3Dc)，其中![[公式]](https://www.zhihu.com/equation?tex=%5Comega+)是立体角，极坐标与立体角的对应关系有

![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B%7B%7B%5COmega+%7D%5E%7B2%7D%7D%7D%7Bp%5Cleft%28+%5Comega++%5Cright%29d%5Comega+%7D%3D%5Cint_%7B%7B%7B%5COmega+%7D%5E%7B2%7D%7D%7D%7B%5Csin+%5Ctheta+d%5Cphi+d%5Ctheta+%7D+%5Ctag%7B20%7D)

则有

![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B%7B%7B%5COmega+%7D%5E%7B2%7D%7D%7D%7Bp%5Cleft%28+%5Comega++%5Cright%29d%5Comega+%7D%3Dc%5Cint_%7B0%7D%5E%7B%5Cpi+%2F2%7D%7B%5Csin+%5Ctheta+%5Cint_%7B0%7D%5E%7B2%5Cpi+%7D%7Bd%5Cphi+%7Dd%5Ctheta+%7D%3D2%5Cpi+c%3D1%5C%5C)

则![[公式]](https://www.zhihu.com/equation?tex=c%3D1%2F2%5Cpi)，那么

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Ctheta+%2C%5Cphi++%5Cright%29%3D%5Csin+%5Ctheta+%2F%5Cleft%28+2%5Cpi++%5Cright%29%5C%5C)

可以计算出

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Ctheta++%5Cright%29%3D%5Cint_%7B0%7D%5E%7B2%5Cpi+%7D%7Bp%5Cleft%28+%5Ctheta+%2C%5Cphi++%5Cright%29d%5Cphi+%7D%3D%5Csin+%5Ctheta%5C%5C)

再根据条件概率的公式，易知

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Cphi+%7C%5Ctheta++%5Cright%29%3D%5Cfrac%7Bpdf%5Cleft%28+%5Ctheta+%2C%5Cphi++%5Cright%29%7D%7Bpdf%5Cleft%28+%5Ctheta++%5Cright%29%7D%3D%5Cfrac%7B1%7D%7B2%5Cpi+%7D%5C%5C)

分别计算累积分布函数

![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%5C%7B+%5Cbegin%7Baligned%7D+++%26+cdf%5Cleft%28+%5Ctheta++%5Cright%29%3D%5Cint_%7B0%7D%5E%7B%5Ctheta+%7D%7B%5Csin+tdt%3D1-%5Ccos+%5Ctheta+%7D+%5C%5C+++%26+cdf%5Cleft%28+%5Cphi+%7C%5Ctheta++%5Cright%29%3D%5Cint_%7B0%7D%5E%7B%5Cphi+%7D%7B%5Cfrac%7B1%7D%7B2%5Cpi+%7D%7Ddt%3D%5Cfrac%7B%5Cphi+%7D%7B2%5Cpi+%7D+%5C%5C++%5Cend%7Baligned%7D+%5Cright.%5C%5C)

根据前面介绍的随机数生成法，设![[公式]](https://www.zhihu.com/equation?tex=%7B%7B%5Cxi+%7D_%7B1%7D%7D%2C%7B%7B%5Cxi+%7D_%7B2%7D%7D)是[0, 1]之间均匀分布的随机数，可以用![[公式]](https://www.zhihu.com/equation?tex=1-%7B%7B%5Cxi+%7D_%7B1%7D%7D)替换![[公式]](https://www.zhihu.com/equation?tex=%7B%7B%5Cxi+%7D_%7B1%7D%7D)，可以求出：

![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta+%3D%7B%7B%5Ccos+%7D%5E%7B-1%7D%7D%7B%7B%5Cxi+%7D_%7B1%7D%7D%2C%5Cphi+%3D2%5Cpi+%7B%7B%5Cxi+%7D_%7B2%7D%7D+%5Ctag%7B21%7D)

代入极坐标，可知：

![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%5C%7B+%5Cbegin%7Baligned%7D+++%26+x%3D%5Csin+%5Ctheta+%5Ccos+%5Cphi+%3D%5Ccos+%5Cleft%28+2%5Cpi+%7B%7B%5Cxi+%7D_%7B2%7D%7D+%5Cright%29%5Csqrt%7B1-%5Cxi+_%7B1%7D%5E%7B2%7D%7D+%5C%5C+++%26+y%3D%5Csin+%5Ctheta+%5Csin+%5Cphi+%3D%5Csin+%5Cleft%28+2%5Cpi+%7B%7B%5Cxi+%7D_%7B2%7D%7D+%5Cright%29%5Csqrt%7B1-%5Cxi+_%7B1%7D%5E%7B2%7D%7D+%5C%5C+++%26+z%3D%5Ccos+%5Ctheta+%3D%7B%7B%5Cxi+%7D_%7B1%7D%7D+%5C%5C++%5Cend%7Baligned%7D+%5Cright.+%5Ctag%7B22%7D)

UE4中的算法实现为

```cpp
float4 UniformSampleHemisphere( float2 E )
{
    float Phi = 2 * PI * E.x;
    float CosTheta = E.y;
    float SinTheta = sqrt( 1 - CosTheta * CosTheta );

    float3 H;
    H.x = SinTheta * cos( Phi );
    H.y = SinTheta * sin( Phi );
    H.z = CosTheta;

    float PDF = 1.0 / (2 * PI);

    return float4( H, PDF );
}
```

还有一种是cos加权的半球采样，有

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Comega++%5Cright%29%5Cpropto+%5Ccos+%5Ctheta%5C%5C)

由于概率密度函数在区间上的积分值为1，可以得到![[公式]](https://www.zhihu.com/equation?tex=c%3D1%2F%5Cpi)，所以

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Ctheta+%2C%5Cphi++%5Cright%29%3D%5Cfrac%7B1%7D%7B%5Cpi+%7D%5Ccos+%5Ctheta+%5Csin+%5Ctheta%5C%5C)

相似的方法，可以计算出

![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta+%3D%7B%7B%5Ccos+%7D%5E%7B-1%7D%7D%5Csqrt%7B%7B%7B%5Cxi+%7D_%7B1%7D%7D%7D%2C%5Cphi+%3D2%5Cpi+%7B%7B%5Cxi+%7D_%7B2%7D%7D+%5Ctag%7B23%7D)

代入极坐标等式，可得：

![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%5C%7B+%5Cbegin%7Baligned%7D+++%26+x%3D%5Csin+%5Ctheta+%5Ccos+%5Cphi+%3D%5Ccos+%5Cleft%28+2%5Cpi+%7B%7B%5Cxi+%7D_%7B2%7D%7D+%5Cright%29%5Csqrt%7B1-%7B%7B%5Cxi+%7D_%7B1%7D%7D%7D+%5C%5C+++%26+y%3D%5Csin+%5Ctheta+%5Csin+%5Cphi+%3D%5Csin+%5Cleft%28+2%5Cpi+%7B%7B%5Cxi+%7D_%7B2%7D%7D+%5Cright%29%5Csqrt%7B1-%7B%7B%5Cxi+%7D_%7B1%7D%7D%7D+%5C%5C+++%26+z%3D%5Ccos+%5Ctheta+%3D%5Csqrt%7B%7B%7B%5Cxi+%7D_%7B1%7D%7D%7D+%5C%5C++%5Cend%7Baligned%7D+%5Cright.+%5Ctag%7B24%7D)

UE4中的算法实现为：

```cpp
float4 CosineSampleHemisphere( float2 E )
{
    float Phi = 2 * PI * E.x;
    float CosTheta = sqrt( E.y );
    float SinTheta = sqrt( 1 - CosTheta * CosTheta );

    float3 H;
    H.x = SinTheta * cos( Phi );
    H.y = SinTheta * sin( Phi );
    H.z = CosTheta;

    float PDF = CosTheta * (1.0 /  PI);

    return float4( H, PDF );
}
```

## 重要性采样

重要性采样（Importance Sampling）是已知被积函数的一些分布信息而采用的一种缩减方差的策略，还有别的策略像俄罗斯轮盘切割（Russian Roulette and Splitting），分层采样（Stratified Sampling），拉丁超立方体采样（Latin Hypercube Sampling）等，是通过控制采样的策略达到缩减方差的目的，但本篇文章只介绍在实时渲染中常用到的重要性采样方法。

先给张[PBRT](http://www.pbr-book.org/3ed-2018/Monte_Carlo_Integration/Importance_Sampling.html)中均匀采样和重要性采样得到的不同渲染效果压压惊。

![](https://pic4.zhimg.com/v2-5fe1cff059c3dd83c0824fa9526bc193_b.jpg)

![](https://pic4.zhimg.com/80/v2-5fe1cff059c3dd83c0824fa9526bc193_720w.jpg)

图3. 均匀采样和重要性采样效果比对[1]

考虑一个简单的例子，设一个函数为

![[公式]](https://www.zhihu.com/equation?tex=f%5Cleft%28+x+%5Cright%29%3D%5Cleft%5C%7B+%5Cbegin%7Bmatrix%7D++++99.01+%26+x%5Cin+%5B0%2C.01%29++%5C%5C++++0.01+%26+x%5Cin+%5B.01%2C1%5D++%5C%5C+%5Cend%7Bmatrix%7D+%5Cright.%5C%5C)

它的几何示意图如图4所示，我们采用蒙特卡洛法估计它的积分，选择区间[0, 1]之间的均匀分布作为它的随机数，那么存在绝大部分的采样点在区间[0.01, 1]之间，但是它对积分估计的贡献只有0.01，小部分采样点在区间[0, 0.01)之间，它对积分估计的贡献却非常的大，这种现象就会导致误差非常的大，简单提高采样数对估计量收敛的影响较小。那么，如果我们简单的选择一个采样策略：多采样区间[0, 0.01)的样本点，少采样(0.01,1]的样本点，这就违背了蒙特卡洛法的本质，产生的统计结果就没有任何意义。

![](https://pic2.zhimg.com/v2-47f4b8448b2f6ca5a0a5ae26a35ffd01_b.jpg)

![](https://pic2.zhimg.com/80/v2-47f4b8448b2f6ca5a0a5ae26a35ffd01_720w.jpg)

图4. 分段函数示意图

蒙特卡洛法的核心，是根据某一概率分布来随机采样，那么，划重点，**根据被积函数曲线规律来设计类似的概率密度来进行采样**，这就符合蒙特卡洛积分的要求，也就是重要性采样的核心。

考虑另外一个例子[[3](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-in-practice/variance-reduction-methods)]，需要计算函数![[公式]](https://www.zhihu.com/equation?tex=f%5Cleft%28+x+%5Cright%29%3D%5Csin+x%2Cx%5Cin+%5B0%2C%5Cpi+%2F2%5D)的积分，容易计算出它的积分真值为：

![[公式]](https://www.zhihu.com/equation?tex=F%5Cleft%28+x+%5Cright%29%3D%5Cint_%7B0%7D%5E%7B%5Cfrac%7B%5Cpi+%7D%7B2%7D%7D%7Bf%5Cleft%28+x+%5Cright%29dx%7D%3D%5Cleft.+-%5Ccos+x+%5Cright%7C_%7B0%7D%5E%7B%5Cpi+%2F2%7D%3D1%5C%5C)

我们设计两种概率密度函数，一种是均匀分布，随机变量![[公式]](https://www.zhihu.com/equation?tex=%7B%7BX%7D_%7B1%7D%7D)的概率密度函数为

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B1%7D%7D%5Cleft%28+x+%5Cright%29%3D%5Cfrac%7B1%7D%7B%5Cpi+%2F2%7D%2Cx%5Cin+%5B0%2C%5Cpi+%2F2%5D%5C%5C)

另外一种，随机变量![[公式]](https://www.zhihu.com/equation?tex=%7B%7BX%7D_%7B2%7D%7D)概率密度函数为：

![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B2%7D%7D%5Cleft%28+x+%5Cright%29%3D%5Cfrac%7B8x%7D%7B%7B%7B%5Cpi+%7D%5E%7B2%7D%7D%7D%2Cx%5Cin+%5B0%2C%5Cpi+%2F2%5D%5C%5C)

两种概率分布与函数的几何示意图如图5所示，显然![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B2%7D%7D%5Cleft%28+x+%5Cright%29)更符被积函数的曲线特点，接下来我们来做实验验证两种概率分布估计出的积分与真值间的差异。

![](https://pic1.zhimg.com/v2-2fe89bfc3c7f4a728d59fbce5ee0f968_b.jpg)

![](https://pic1.zhimg.com/80/v2-2fe89bfc3c7f4a728d59fbce5ee0f968_720w.jpg)

图5. 被积函数和两种概率密度函数曲线图[3]

设区间[0,1]间均匀分布的随机数![[公式]](https://www.zhihu.com/equation?tex=%5Cxi)，根据前面的随机数计算方法，则容易算出两种概率分布的随机数，![[公式]](https://www.zhihu.com/equation?tex=%7B%5Cxi+%7D_%7B1%7D)对应![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B1%7D%7D%5Cleft%28+x+%5Cright%29)，![[公式]](https://www.zhihu.com/equation?tex=%7B%5Cxi+%7D_%7B2%7D)对应![[公式]](https://www.zhihu.com/equation?tex=pd%7B%7Bf%7D_%7B2%7D%7D%5Cleft%28+x+%5Cright%29)

![[公式]](https://www.zhihu.com/equation?tex=%7B%7B%5Cxi+%7D_%7B1%7D%7D%3D%5Cfrac%7B%5Cpi+%7D%7B2%7D%5Cxi+%2C%7B%7B%5Cxi+%7D_%7B2%7D%7D%3D%5Cfrac%7B%5Cpi+%7D%7B2%7D%5Csqrt%7B%5Cxi+%7D%5C%5C)

C++的实现代码如下所示。

```cpp
#include <random>
#include <time.h>
#include <cmath>
#include <iostream>

#define PI 3.14159265358979323846

double random_generator1(double x){
    return x * PI / 2.0;
}

double random_generator2(double x) {
    return sqrt(x) * PI / 2.0;
}

double pdf1(double x) {
    return 2.0 / PI;
}

double pdf2(double x) {
    return 8.0 * x / (PI * PI);
}

double f(double x) {
    return sin(x);
}

int main() {
    const int total_times = 16;
    int run_times = 1;
    double real = 1.0;
    std::default_random_engine seed(time(NULL));
    printf("No     Uniform     Importance   Err.Uniform(%%) Err.Importance(%%)\n");
    while ((run_times++) < total_times) {
        int num_samples = 16;
        double sum1 = 0.0, sum2 = 0.0;
        std::uniform_real_distribution<double> random(0, 1);

        for (int i = 0; i < num_samples; i++) {
            double sample = random(seed);
            double random1 = random_generator1(sample);
            double random2 = random_generator2(sample);
            double p1 = pdf1(random1);
            double p2 = pdf2(random2);

            sum1 += f(random1) / p1;
            sum2 += f(random2) / p2;
        }
        sum1 /= num_samples;
        sum2 /= num_samples;
        printf("%-6d %-12.4f %-14.4f %-14.1f %-12.1f\n", run_times, sum1, sum2, 100.0 * (sum1 - real) / real, 100.0 * (sum2 - real) / real);
    }
    return 0;
}
```

实验结果如图6所示，可以看出，在相同采样数下，重要性采样估计值比均匀采样的误差小。

![](https://pic3.zhimg.com/v2-49247fc5026641b7e721b59d0a8e7bce_b.jpg)

![](https://pic3.zhimg.com/80/v2-49247fc5026641b7e721b59d0a8e7bce_720w.jpg)

图6. 均匀采样与重要性采样的结果比对

从理论的角度来说，任意一个被积函数![[公式]](https://www.zhihu.com/equation?tex=f%5Cleft%28+x+%5Cright%29)，它的最优概率密度函数是

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29%3D%5Cfrac%7B%5Cleft%7C+f%5Cleft%28+x+%5Cright%29+%5Cright%7C%7D%7B%5Cint%7Bf%5Cleft%28+x+%5Cright%29dx%7D%7D++%5Ctag%7B25%7D)

从这个结论来说，上述例子中，最优的概率密度函数应该是

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+x+%5Cright%29%3D%5Csin+x%5C%5C)

但是实际上我们无法得知被积函数的积分真值，不然我们还要去估计积分做甚，好的概率密度函数应该是与函数本身的几何曲线形状相似，是不是和本节开头划重点的一句话呼应上了。

最后，介绍下重要性采样实时渲染中的应用，这里不会过多的解释物理光照模型，只介绍其中的GGX[8]重要性采样，GGX的法线分布函数，有很长的拖尾效果，得到广泛应用。

在实时渲染中，采用的物理光照模型是基于微表面理论，需要统计微面元的法线分布，如图7所示，设![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+m+%5Cright%29)是微表面的法线分布函数，有下列等式成立。

![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B%5COmega+%7D%7BD%5Cleft%28+m+%5Cright%29%5Cleft%28+m%5Ccdot+n+%5Cright%29d%5Comega+%7D%3D1+%5Ctag%7B26%7D)

![](https://pic3.zhimg.com/v2-7b8211bf556e6d6a50e8802fccc85cbe_b.jpg)

![](https://pic3.zhimg.com/80/v2-7b8211bf556e6d6a50e8802fccc85cbe_720w.jpg)

图7. 微表面的法线分布

其中,m是微表面的法线，n是几何平面的法线。

法线分布函数GGX，如下所示：

![[公式]](https://www.zhihu.com/equation?tex=D%5Cleft%28+m+%5Cright%29%3D%5Cfrac%7B%7B%7Ba%7D%5E%7B2%7D%7D%7D%7B%5Cpi+%7B%7B%5Cleft%28+1%2B%7B%7B%5Cleft%28+m%5Ccdot+n+%5Cright%29%7D%5E%7B2%7D%7D%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D%7D+%5Ctag%7B27%7D)

其中，![[公式]](https://www.zhihu.com/equation?tex=a%3Droughnes%7B%7Bs%7D%5E%7B2%7D%7D)。

将等式（20）和等式（27）代入等式（26），得

![[公式]](https://www.zhihu.com/equation?tex=%5Cint_%7B%5COmega+%7D%7BD%5Cleft%28+m+%5Cright%29%5Cleft%28+m%5Ccdot+n+%5Cright%29d%5Comega+%7D%3D%5Cint_%7B%5COmega+%7D%7B%5Cfrac%7B%7B%7Ba%7D%5E%7B2%7D%7D%7D%7B%5Cpi+%7B%7B%5Cleft%28+1%2B%7B%7B%5Ccos+%7D%5E%7B2%7D%7D%5Ctheta+%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D%7D%5Ccos+%5Ctheta+%5Csin+%5Ctheta+d%5Ctheta+d%5Cphi+%7D%3D1%5C%5C)

其中，![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta+%5Cin+%5B0%2C%5Cpi+%2F2%5D%2C%5Cphi+%5Cin+%5B0%2C2%5Cpi+%5D)。

由等式（25）可知，最优的概率密度函数是

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Ctheta+%2C%5Cphi++%5Cright%29%3D%5Cfrac%7B%7B%7Ba%7D%5E%7B2%7D%7D%7D%7B%5Cpi+%7B%7B%5Cleft%28+1%2B%7B%7B%5Ccos+%7D%5E%7B2%7D%7D%5Ctheta+%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D%7D%5Ccos+%5Ctheta+%5Csin+%5Ctheta%5C%5C)

首先计算关于![[公式]](https://www.zhihu.com/equation?tex=%5Ctheta)边缘概率密度函数![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Ctheta++%5Cright%29)：

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Ctheta++%5Cright%29%3D%5Cint_%7B0%7D%5E%7B2%5Cpi+%7D%7Bpdf%5Cleft%28+%5Ctheta+%2C%5Cphi++%5Cright%29%7Dd%5Cphi+%3D%5Cfrac%7B2%7B%7Ba%7D%5E%7B2%7D%7D%7D%7B%7B%7B%5Cleft%28+1%2B%7B%7B%5Ccos+%7D%5E%7B2%7D%7D%5Ctheta+%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D%7D%5Ccos+%5Ctheta+%5Csin+%5Ctheta%5C%5C)

再计算条件概率密度函数![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Cphi+%7C%5Ctheta++%5Cright%29)：

![[公式]](https://www.zhihu.com/equation?tex=pdf%5Cleft%28+%5Cphi+%7C%5Ctheta++%5Cright%29%3D%5Cfrac%7Bpdf%5Cleft%28+%5Ctheta+%2C%5Cphi++%5Cright%29%7D%7Bpdf%5Cleft%28+%5Ctheta++%5Cright%29%7D%3D%5Cfrac%7B1%7D%7B2%5Cpi+%7D%5C%5C)

计算等式的积分

![[公式]](https://www.zhihu.com/equation?tex=%5Cbegin%7Baligned%7D+++%26+cdf%5Cleft%28+x+%5Cright%29%3D%5Cint_%7B0%7D%5E%7Bx%7D%7Bpdf%5Cleft%28+%5Ctheta++%5Cright%29%7Dd%5Ctheta++%5C%5C+++%26+%3D-2%7B%7Ba%7D%5E%7B2%7D%7D%5Cint_%7B1%7D%5E%7B%5Ccos+x%7D%7B%5Cfrac%7Bt%7D%7B%7B%7B%5Cleft%28+1%2B%7B%7Bt%7D%5E%7B2%7D%7D%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D%7Ddt%7D%2Ct%3D%5Ccos+%5Ctheta++%5C%5C+++%26+%3D-%7B%7Ba%7D%5E%7B2%7D%7D%5Cint_%7B1%7D%5E%7B%7B%7B%5Ccos+%7D%5E%7B2%7D%7Dx%7D%7B%5Cfrac%7B1%7D%7B%7B%7B%5Cleft%28+1%2By%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29+%5Cright%29%7D%5E%7B2%7D%7D%7Ddy%2Cy%3D%7B%7Bt%7D%5E%7B2%7D%7D%7D+%5C%5C+++%26+%3D-%5Cfrac%7B%7B%7Ba%7D%5E%7B2%7D%7D%7D%7B%7B%7Ba%7D%5E%7B2%7D%7D-1%7D%5Cint_%7B%7B%7Ba%7D%5E%7B2%7D%7D%7D%5E%7B%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29%7B%7B%5Ccos+%7D%5E%7B2%7D%7Dx%2B1%7D%7B%5Cfrac%7B1%7D%7B%7B%7Bz%7D%5E%7B2%7D%7D%7Ddz%7D%2Cz%3D%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29y%2B1+%5C%5C+++%26+%3D%5Cleft.+%5Cfrac%7B%7B%7Ba%7D%5E%7B2%7D%7D%7D%7B%7B%7Ba%7D%5E%7B2%7D%7D-1%7D%5Cfrac%7B1%7D%7Bz%7D+%5Cright%7C_%7B%7B%7Ba%7D%5E%7B2%7D%7D%7D%5E%7B%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29%7B%7B%5Ccos+%7D%5E%7B2%7D%7Dx%2B1%7D+%5C%5C+++%26+%3D%5Cfrac%7B1-%7B%7B%5Ccos+%7D%5E%7B2%7D%7Dx%7D%7B%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29%7B%7B%5Ccos+%7D%5E%7B2%7D%7Dx%2B1%7D+%5C%5C++%5Cend%7Baligned%7D)

则

![[公式]](https://www.zhihu.com/equation?tex=cd%7B%7Bf%7D%5E%7B-1%7D%7D%5Cleft%28+x+%5Cright%29%3D%7B%7B%5Ccos+%7D%5E%7B-1%7D%7D%5Csqrt%7B%5Cfrac%7B1-x%7D%7B%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29x%2B1%7D%7D+%5Ctag%7B28%7D)

设![[公式]](https://www.zhihu.com/equation?tex=%7B%7B%5Cxi+%7D_%7B1%7D%7D%2C%7B%7B%5Cxi+%7D_%7B2%7D%7D)是区间[0, 1]中均匀分布的随机数，易知

![[公式]](https://www.zhihu.com/equation?tex=%5Cphi+%3D2%5Cpi+%7B%7B%5Cxi+%7D_%7B1%7D%7D%2C%5Ctheta+%3D%7B%7B%5Ccos+%7D%5E%7B-1%7D%7D%5Csqrt%7B%5Cfrac%7B1-%7B%7B%5Cxi+%7D_%7B2%7D%7D%7D%7B%5Cleft%28+%7B%7Ba%7D%5E%7B2%7D%7D-1+%5Cright%29%7B%7B%5Cxi+%7D_%7B2%7D%7D%2B1%7D%7D+%5Ctag%7B29%7D)

UE4中GGX的重要性采样的代码如下所示，有没有豁然开朗的感觉。

```cpp
float4 ImportanceSampleGGX( float2 E, float a2 )
{
    float Phi = 2 * PI * E.x;
    float CosTheta = sqrt( (1 - E.y) / ( 1 + (a2 - 1) * E.y ) );
    float SinTheta = sqrt( 1 - CosTheta * CosTheta );

    float3 H;
    H.x = SinTheta * cos( Phi );
    H.y = SinTheta * sin( Phi );
    H.z = CosTheta;

    float d = ( CosTheta * a2 - CosTheta ) * CosTheta + 1;
    float D = a2 / ( PI*d*d );
    float PDF = D * CosTheta;

    return float4( H, PDF );
}
```

## 拟蒙特卡洛

拟蒙特卡洛（Quasi Monte Carlo）积分估计技术的核心点是**积分估计时采用低差异序列（Low Discrepancy Sequence）来替换纯随机数**，它的优点是积分估计的收敛速度更快，理论上拟蒙特卡洛能达到![[公式]](https://www.zhihu.com/equation?tex=%7B%5Cmathrm+O%7D%5Cleft%28+%7B%7Bn%7D%5E%7B%5Ctext%7B-1%7D%7D%7D+%5Cright%29)的收敛速度，而普通蒙特卡洛的收敛速度是![[公式]](https://www.zhihu.com/equation?tex=%7B%5Cmathrm+O%7D%5Cleft%28+%7B%7Bn%7D%5E%7B%5Ctext%7B-0%7D%5Ctext%7B.5%7D%7D%7D+%5Cright%29)，更快的收敛速度意味着相同的采样数下，低差异序列估计的结果误差更小。

我们先举一个简单的[例子](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/monte-carlo-methods-in-practice/introduction-quasi-monte-carlo)解释，随机采样很可能会导致采样点的**聚集**（Clump）现象，如图8所示，聚集会导致积分估计的误差扩大。

![](https://pic1.zhimg.com/v2-c3eb3850217b81b65899a7a7958949cc_b.jpg)

![](https://pic1.zhimg.com/80/v2-c3eb3850217b81b65899a7a7958949cc_720w.jpg)

图8. 随机采样的采样点聚集现象[3]

为了消除这种聚集现象，就有了分层采样（Stratified Sampling）的提出，它是将采样空间均分为n个格子，每个格子里面再随机采样一个点，如图9所示。

![](https://pic2.zhimg.com/v2-726fa4a0548d0791d6cf8394ba99b7c5_b.jpg)

![](https://pic2.zhimg.com/80/v2-726fa4a0548d0791d6cf8394ba99b7c5_720w.jpg)

图9. 分层采样[3]

那么，有没有一种采样方式，它不需要对采样空间进行手动分割，就同时具备空间平均性和随机性这两个特点呢？数学家引入了**差异**（Discrepancy）这个概念，完全随机的样本具有很高的差异，但是完全平均的样本的差异为0，我们的目标就是找到一组有较低差异且不失随机性的序列，这就是**低差异序列**，以期望达到消除聚集的目的。

给出差异的标准数学定义[11]：设![[公式]](https://www.zhihu.com/equation?tex=P%3D%5Cleft%5C%7B+%7B%7Bx%7D_%7B1%7D%7D%2C%5Ccdots+%2C%7B%7Bx%7D_%7Bn%7D%7D+%5Cright%5C%7D)是一组位于空间![[公式]](https://www.zhihu.com/equation?tex=%7B%7B%5B0%2C1%5D%7D%5E%7Bs%7D%7D)下的点集，差异可以定义为：

![[公式]](https://www.zhihu.com/equation?tex=%7B%7BD%7D_%7Bn%7D%7D%5Cleft%28+P+%5Cright%29%3D%5Cunderset%7BB%5Cin+J%7D%7B%5Cmathop%7B%5Csup+%7D%7D%5C%2C%5Cleft%7C+%5Cfrac%7BA%5Cleft%28+B+%5Cright%29%7D%7Bn%7D-%7B%7B%5Clambda+%7D_%7Bs%7D%7D%5Cleft%28+B+%5Cright%29+%5Cright%7C+%5Ctag%7B30%7D)

其中，s表示维度，![[公式]](https://www.zhihu.com/equation?tex=%7B%7B%5Clambda+%7D_%7Bs%7D%7D)是s维空间的体积度量（非标准命名），![[公式]](https://www.zhihu.com/equation?tex=A%5Cleft%28+B+%5Cright%29)表示点集P中落入区域B的点的个数，J表示s维空间下的任意盒状包围范围。

这个定义可能很费解，举个例子解释下，如图10所示，在二维空间下区间[0,1]x[0,1]内有一组采样点集，点集个数为n，整个点集的面积（在二维空间下的体积度量就称为面积）就为1，任意划定一块区域B，区域B囊括了k个采样点。它的面积是![[公式]](https://www.zhihu.com/equation?tex=%5Clambda+%5Cleft%28+B+%5Cright%29)，那么差异指点集个数比值k/n与面积比值![[公式]](https://www.zhihu.com/equation?tex=%5Clambda+%5Cleft%28+B+%5Cright%29%2F1)的差的绝对值，注意B是指空间范围[0, 1]x[0, 1]内的任意一块区域。

![](https://pic4.zhimg.com/v2-4105e4e9a3d34471742bb3d3074bdc4f_b.jpg)

![](https://pic4.zhimg.com/80/v2-4105e4e9a3d34471742bb3d3074bdc4f_720w.jpg)

图10. 差异定义

在了解了低差异序列的定义后，就需要去生成这样的序列，常用到的几种低差异序列有：

-   Van der Corput序列；
-   Halton序列；
-   Hammersley序列；
-   Sobol序列。

本篇文章只会介绍Van der Corput序列、Halton序列和Hammersley序列。

Van der Corput序列[12]是数学家Van der Corput在1935年设计的一种**一维低差异序列**，也是最简单的一种序列。现实生活中的数字通常都是十进制，例如1314可以拆解为：

![[公式]](https://www.zhihu.com/equation?tex=1%5Ctimes+%7B%7B10%7D%5E%7B3%7D%7D%2B3%5Ctimes+%7B%7B10%7D%5E%7B2%7D%7D%2B1%5Ctimes+%7B%7B10%7D%5E%7B1%7D%7D%2B1%5Ctimes+%7B%7B10%7D%5E%7B0%7D%7D%5C%5C)

由十进制扩展了b进制，它的数学表示就是

![[公式]](https://www.zhihu.com/equation?tex=x%3D%5Csum%5Climits_%7Bk%3D0%7D%5E%7Bm%7D%7B%7B%7Bd%7D_%7Bk%7D%7D%5Ccdot+%7B%7Bb%7D%5E%7Bk%7D%7D%7D+%5Ctag%7B31%7D)

其中，b是底数，![[公式]](https://www.zhihu.com/equation?tex=%7B%7Bd%7D_%7Bk%7D%7D%5Cin+%5B0%2Cb-1%5D)。

它对应的Van der Corput序列就可以表示为

![[公式]](https://www.zhihu.com/equation?tex=%7B%7Bg%7D_%7Bb%7D%7D%5Cleft%28+x+%5Cright%29%3D%5Csum%5Climits_%7Bk%3D0%7D%5E%7Bm%7D%7B%7B%7Bd%7D_%7Bk%7D%7D%5Ccdot+%7B%7Bb%7D%5E%7B-k-1%7D%7D%7D+%5Ctag%7B32%7D)

以十进制数来说，1~13的Van der Corput序列就是

![[公式]](https://www.zhihu.com/equation?tex=%5Cleft%5C%7B+%5Cfrac%7B1%7D%7B10%7D%2C%5Cfrac%7B2%7D%7B10%7D%2C%5Cfrac%7B3%7D%7B10%7D%2C%5Cfrac%7B4%7D%7B10%7D%2C%5Cfrac%7B5%7D%7B10%7D%2C%5Cfrac%7B6%7D%7B10%7D%2C%5Cfrac%7B7%7D%7B10%7D%2C%5Cfrac%7B8%7D%7B10%7D%2C%5Cfrac%7B9%7D%7B10%7D%2C%5Cfrac%7B1%7D%7B100%7D%2C%5Cfrac%7B21%7D%7B100%7D%2C%5Cfrac%7B31%7D%7B100%7D+%5Cright%5C%7D%5C%5C)

C++算法的实现代码为：

```cpp
double van_der_corput(int x, int base) {
    double q = 0, bk = 1.0 / base;
    while (x > 0) {
        q += (x % base) * bk;
        x /= base;
        bk /= base;
    }
    return q;
}
```

像这种将底数取反的做法，有一种标准的名称叫**基底取反**（Radical Inverse），即兴翻译，还请见谅，这是其它几种低差异序列的基础。

Halton序列就是将Van der Corput序列扩展为N维的情况，可以表示为

![[公式]](https://www.zhihu.com/equation?tex=halton%5Cleft%28+x+%5Cright%29%3D%5Cleft%28+%7B%7Bg%7D_%7B%7B%7Bb%7D_%7B1%7D%7D%7D%7D%5Cleft%28+x+%5Cright%29%2C%7B%7Bg%7D_%7B%7B%7Bb%7D_%7B2%7D%7D%7D%7D%5Cleft%28+x+%5Cright%29%2C%5Ccdots+%2C%7B%7Bg%7D_%7B%7B%7Bb%7D_%7BN%7D%7D%7D%7D%5Cleft%28+x+%5Cright%29+%5Cright%29+%5Ctag%7B33%7D)

其中,底数![[公式]](https://www.zhihu.com/equation?tex=%7B%7Bb%7D_%7B1%7D%7D%2C%7B%7Bb%7D_%7B2%7D%7D%2C%5Ccdots+%2C%7B%7Bb%7D_%7BN%7D%7D)互为质数。

Hammersley序列是在已知采样点集个数的情况下才可计算出的序列，设采样点集个数为n，维度为N，Hammersley序列表示为

![[公式]](https://www.zhihu.com/equation?tex=Hammersley%5Cleft%28+x+%5Cright%29%3D%5Cleft%28+%5Cfrac%7Bx%7D%7Bn%7D%2C%7B%7Bg%7D_%7B%7B%7Bb%7D_%7B1%7D%7D%7D%7D%5Cleft%28+x+%5Cright%29%2C%7B%7Bg%7D_%7B%7B%7Bb%7D_%7B2%7D%7D%7D%7D%5Cleft%28+x+%5Cright%29%2C%5Ccdots+%2C%7B%7Bg%7D_%7B%7B%7Bb%7D_%7BN-1%7D%7D%7D%7D%5Cleft%28+x+%5Cright%29+%5Cright%29+%5Ctag%7B34%7D)

Halton序列的收敛速度[7]是![[公式]](https://www.zhihu.com/equation?tex=%7B%5Cmathrm+O%7D%5Cleft%28+%7B%7B%5Cleft%28+%5Clog+n+%5Cright%29%7D%5E%7BN%7D%7D%2Fn+%5Cright%29)，Hammersley序列的收敛速度是![[公式]](https://www.zhihu.com/equation?tex=%7B%5Cmathrm+O%7D%5Cleft%28+%7B%7B%5Cleft%28+%5Clog+n+%5Cright%29%7D%5E%7BN-1%7D%7D%2Fn+%5Cright%29)，所以在已知样本个数的情况下Hammersley序列会有更优的表现。

最后，实现Halton和Hammersley两种低差异序列，并生成采样分布的纹理，如图11所示。

![](https://pic4.zhimg.com/v2-addb3a71973fbe024298464c4f23c2f3_b.jpg)

![](https://pic4.zhimg.com/80/v2-addb3a71973fbe024298464c4f23c2f3_720w.jpg)

图11. 200个点集的Halton序列和Hammersley序列

```cpp
#include <cstdlib> 
#include <cstdio> 
#include <cmath> 
#include <iostream> 
#include <fstream> 
#include <random>

#define Float float

const int Primes[] = {
    2, 3, 5, 7, 11,
    13, 17, 19, 23,
    29, 31, 37, 41,
    43, 47, 53, 59,
    61, 67, 71, 73 };

const int Width = 512;
const int Height = 512;
const int NumSamples = 200;
const int Strand = 3;

const int Offset[9][2] = {
    {0, 0},
    {0, 1},
    {0, -1},
    {1, 0},
    {-1, 0},
    {1, 1},
    {-1, -1},
    {1, -1},
    {-1, 1},
};

static Float RadicalInverse(int a, int base) {
    const Float invBase = (Float)1 / (Float)base;
    int reversedDigits = 0;
    Float invBaseN = 1;
    while (a) {
        int next = a / base;
        int digit = a - next * base;
        reversedDigits = reversedDigits * base + digit;
        invBaseN *= invBase;
        a = next;
    }
    return reversedDigits * invBaseN;
}

int GetNthPrime(int dimension){
    return Primes[dimension];
}

Float Halton(int dimension, int index){
    return RadicalInverse(index, GetNthPrime(dimension));
}

Float Hammersley(int dimension, int index, int numSamples){
    if (dimension == 0)
        return index / (Float)numSamples;
    else
        return RadicalInverse(index, GetNthPrime(dimension - 1));
}

void WritePPM(const char* filename, const unsigned char* data, int width, int height) {
    std::ofstream ofs;
    ofs.open(filename);
    ofs << "P5\n" << width << " " << height << "\n255\n";
    ofs.write((char*)data, width * height);
    ofs.close();
}

void SaveSample(unsigned char* pixels, int width, int height, Float x, Float y){
    int px = (int)(x * Width + 0.5);
    int py = (int)(y * Height + 0.5);
    for (int i = 0; i < 9; i++) {
        int col = std::max(std::min(px + Offset[i][0], Width - 1), 0);
        int row = std::max(std::min(py + Offset[i][1], Height - 1), 0);
        pixels[row * width + col] = 0;
    }
}

int main(){
    unsigned char pixels[Height][Width];
    // generate halton sequence.
    memset(pixels, 0xff, sizeof(pixels));
    for (int i = 0; i < NumSamples; i++)
    {
        Float x = Halton(0, i);
        Float y = Halton(1, i);
        SaveSample(&pixels[0][0], Width, Height, x, y);
    }
    WritePPM("halton.ppm", &pixels[0][0], Width, Height);

    // generate hammersley sequence.
    memset(pixels, 0xff, sizeof(pixels));
    for (int i = 0; i < NumSamples; i++)
    {
        Float x = Hammersley(0, i, NumSamples);
        Float y = Hammersley(1, i, NumSamples);
        SaveSample(&pixels[0][0], Width, Height, x, y);
    }
    WritePPM("hammersley.ppm", &pixels[0][0], Width, Height);
    return 0;
}
```

## 参考

[1] Matt Pharr, Wenzel Jakob, and Greg Humphreys. Physically based rendering: From theory to implementation. Morgan Kaufmann, 2016.

[2] 概率论与数理统计，浙江大学第4版.

[3] [Scratchapixel 2.0](https://www.scratchapixel.com/)

[4] [解析Monte-Carlo算法(基本原理,理论基础,应用实践)](https://www.cnblogs.com/leoo2sk/archive/2009/05/29/1491526.html)

[5] [Monte Carlo数学原理](https://zhuanlan.zhihu.com/p/61611088)

[6] [无偏估计量](https://baike.baidu.com/item/%E6%97%A0%E5%81%8F%E4%BC%B0%E8%AE%A1%E9%87%8F/303853?fr=aladdin)

[7] Philip Dutre, Philippe Bekaert, and Kavita Bala. Advanced global illumination. CRC Press, 2018.

[8] Bruce Walter, et al. "Microfacet models for refraction through rough surfaces." Proceedings of the 18th Eurographics conference on Rendering Techniques. Eurographics Association, 2007.

[9] [低差异序列（一）- 常见序列的定义及性质](https://zhuanlan.zhihu.com/p/20197323)

[10] [低差异序列（二）- 高效实现以及应用](https://zhuanlan.zhihu.com/p/20374706)

[11] wikipedia, [Low-discrepancy sequence](https://en.wikipedia.org/wiki/Low-discrepancy_sequence)

[12] wikipedia, [Van der Corput sequence](https://en.wikipedia.org/wiki/Van_der_Corput_sequence)
