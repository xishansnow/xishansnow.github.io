---
layout:     post
title:      "BIO、IOB、BILOU等序列标注方法的异同"
description:   "BIO、IOB、BILOU等序列标注方法的异同"
date:       2021-03-25 16:00:00
author:     "西山晴雪"
categories: "知识图谱"
tags:
    - 知识图谱
    - "Knowledge Graph"
    - 信息抽取
    - "Information Extract" 
    - 序列标注
---


# BIO、IOB、BILOU等序列标注方法的异同

序列标注的方法中有多种标注方式：BIO、BIOSE、IOB、BILOU、BMEWO，其中前三种最为常见。各种标注方法大同小异，下面以命名实体识别为例，看一看他们之间的区别，主要关注标注方法对最终模型效果的影响。



剪辑自: [https://zhuanlan.zhihu.com/p/147537898?utm*source=wechat*session](https://zhuanlan.zhihu.com/p/147537898?utmsource=wechatsession)



结论写在前面：大多数情况下，直接用 BIO 就可以了; 大多数情况下 BIO 和 BIOES 的结果差不太多，文末展示了各个数据集上的结果。

## 1. IO

- I stands for 'inside'     (signifies that the word is inside an NE)
- O stands for 'outside'     (signifies that the word is just a regular word outside of an NE)



## 2. BIO（等价于IOB-2）

 

- B stands for 'beginning'     (signifies beginning of an Named Entity, i.e. NE)
- I stands for 'inside'     (signifies that the word is inside an NE)
- O stands for 'outside'     (signifies that the word is just a regular word outside of an NE)

## 3. IOB（即IOB-1）

 IOB 与 BIO 字母对应的含义相同，其不同点是 IOB 中，标签 B 仅用于两个连续的同类型命名实体的边界区分，不用于命名实体的起始位置

这里举个例子： 

~~~
词序列：  （word） （word） （word） （word）（word）（word）
IOB标注：（I-loc）（I-loc）（B-loc）（I-loc） （o）   （o） 
BIO标注：（B-loc）（I-loc）（B-loc）（I-loc） （o）   （o） 
The IOB scheme is similar to the BIO scheme, however, here the tag B- is only used to start a segment if the previous token is of the same class but is not part of the segment.
~~~


 因为 IOB 的整体效果不好，所以出现了 IOB-2，约定了所有命名实体均以 B tag 开头。这样 IOB-2 就与 BIO 的标注方式等价了。

## 4. BIOES

- B stands for 'beginning'      (signifies beginning of an NE)

- I stands for 'inside'      (signifies that the word is inside an NE)
- O stands for 'outside'      (signifies that the word is just a regular word outside of an NE)
- E stands for 'end'      (signifies that the word is the end of an NE)
- S stands for      'singleton'(signifies that the single word is an NE )

## 5. BILOU     (等价于 BIOES)

- B stands for 'beginning'      (signifies beginning of an NE)

- I stands for 'inside'      (signifies that the word is inside an NE)
- O stands for 'outside'      (signifies that the word is just a regular word outside of an NE)
- L stands for 'last'      (signifies that the last word of an NE)
- U stands for      'unit'(signifies that the single word is an NE )

## 6. BMEWO

​     (等价于 BIOES)

- B stands for 'beginning'      (signifies beginning of an NE)

- M stands for 'middle'      (signifies that the word is inside an NE)

- O stands for 'outside'      (signifies that the word is just a regular word outside of an NE)

- E stands for 'end'      (signifies that the word is the end of an NE)

- W stands for      'whole'(signifies that the whole word is an NE )

## 总结

​     综上所述，诸多主流的序列标注方法本质上就有 4 种：IO、BIO、IOB、BIOES，这里简单分析一下：  

- IO 缺少头部表示，导致很多任务上效果不好，很少使用
- IOB 因为缺少 B-tag 作为实体标注的头部表示，丢失了部分标注信息，导致很多任务上的效果不佳
- BIO 解决了 IOB 的问题，所以整体效果优于 IOB
- BIOES 额外提供了 End 的信息，并给出了单个词汇的 S-tag，提供了更多的信息，可能效果更优，但其需要预测的标签更多（多了 E 和 S），效果也可能受到影响。



   下面来看一下各个标注方法的效果比较： 先来看一下数据集，都是比较经典的序列标注数据集，第一列是任务类型：

![](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/NER_003.png)



接下来看一下各个标注方法的效果（这些数字均为多次实验采样的结果）：

![](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/NER_b2e1c.png)

**结论：**

- **可以看到 IOB 表现很糟糕，BIO 和 BIOES 各有优劣**
- **有人反馈说：BIO 和 BIOES 在很多任务上的表现差异不大，可能是小数点后 3-4 位的差别。**

- **所有上述结果均为英文数据集上的结果，中文数据上暂无对比结果**

## 其他

基于 BIOES 这个标注格式，衍生出了更加复杂的标注方法，明确了命名实体边界的边界比如：BMEWO+（There is also BMEWO+, which put more information about surrounding word class to Outside tokens (thus "O plus")）

这里给出一个图表以示区别：

![](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/NER_b7c1c.png)

BMEWO+标注方法的效果方面有待检验。感兴趣的小伙伴可关注一下 Ref 2,在文章中还给出了多种标注方法的复杂度分析。 
