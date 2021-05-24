---
layout:     post
title:      "   贝叶斯深度学习研究综述  "
description:   "  贝叶斯深度学习 "
date:       2021-05-17 10:00:00
author:     "西山晴雪"
mathjax:    true
categories: 
    - [贝叶斯统计, 贝叶斯深度学习]
    - [GeoAI, 贝叶斯方法]
tags:
    - 贝叶斯统计
    - 贝叶斯深度学习
    - 感知组件
    - 任务组件
    - 铰链组件
    - 综述
    - 概率图模型
    - 深度学习
---

# 贝叶斯深度学习研究综述（A Survey on Bayesian Deep Learning）

[Hao Wang](https://www.google.com/url?q=http://www.wanghao.in&sa=D&ust=1595195435875000&usg=AOvVaw3I4lmPqmkH08NZ12iOb1xN)， [Dit-Yan Yeung](https://www.google.com/url?q=https://www.cse.ust.hk/~dyyeung/&sa=D&ust=1595195435875000&usg=AOvVaw2fLKlN2b0ErbskC-Gnq1-O)

Massachusetts Institute of Technology

Hong Kong University of Science and Technology

【摘要】一个全面的人工智能系统不仅需要感知环境，还需要推断关系（甚至因果）及其不确定性。过去十年中，深度学习在感知任务中取得了重大进展，例如：用于视觉对象识别和语音识别。但对更高级的推断任务而言，具有贝叶斯性质的概率图模型（Probabilistic Graphical Model， PGM ）则更强大和灵活。近年，贝叶斯深度学习作为统一的概率框架出现，将深度学习和贝叶斯模型紧密结合在一起，用深度学习对文本、图像的感知能力来提高进一步推断的性能，反过来，通过推断过程的反馈来增强文本或图像的感知能力。本文对贝叶斯深度学习进行了较为全面的介绍，综述了贝叶斯深度学习在推荐系统、主题模型、控制等方面的应用，并讨论了贝叶斯深度学习与神经网络的贝叶斯处理等相关课题的联系与区别。

【关键字】Deep Learning， Bayesian Networks， Probabilistic Graphical Models， Generative Models

【原文】Wang H， Yeung D Y. A survey on Bayesian deep learning[J]. ACM Computing Surveys (CSUR)， 2020， 53(5): 1-37.

【作者blog】[wanghao.in/BDL.html](http://wanghao.in/BDL.html)

---

本文的目录如下:

[TOC]

---

## 1 概述



过去十年中，深度学习在包括视觉对象识别、文本理解和语音识别在内的许多流行感知任务中取得了巨大的成功。这些任务分别对应于人工智能系统的视觉、阅读和听觉能力，它们无疑对AI有效感知环境不可或缺。但构建一个实用、全面的AI系统，不仅需要感知，更应具备思考的能力。

以医学诊断为例，医生除了要看可见症状、医学检测数据和患者描述外，还必须寻找症状间的关系，并推断出相应病因。只有如此，医生才能为病人提供医疗建议。此例中，虽然视觉和听觉能力允许医生从病人那里获取信息，但定义医生的关键是思维部分。这里的思维能力可能涉及识别条件依赖、因果推断、逻辑推断和处理不确定性等，它们显然超出了传统深度学习方法的能力。幸运的是，另一种机器学习范式--- `概率图形模型（ PGM ）`---擅长概率和推断，尤其是不确定性。问题是，  PGM  在感知任务中效果似乎不如深度学习模型好，特别是感知任务通常涉及大规模和高维信号（如图像和视频）。为解决该问题，将深度学习和 PGM 统一在一个原则性概率框架内是一个自然而然的选择，即`贝叶斯深度学习（Bayesian Deep Learning， BDL ）` 。

上例中，感知任务涉及感知患者的症状（例如，通过查看医学图像），而推断任务涉及处理条件依赖、因果推断、逻辑推断和不确定性。通过贝叶斯深度学习中的原则性集成，感知任务和推断任务被视为一个整体，相互受益。既能够看到医学图像帮助医生进行诊断和推断，也能看到诊断和推断反过来帮助理解医学图像。假设医生不确定医学图像中的黑斑是什么，但如果她能够推断出病因，则可以帮她更好地决定黑斑是不是肿瘤。

再以推荐系统 `[1，70，71，92，121]` 为例。高精度推荐系统需要：（1）完整理解项目内容（例如，文档和电影中的内容）`[85]` ，（2）仔细分析用户档案和偏好 `[126，130，134]`；（3）正确评估用户间的相似性 `[3，12，46，109]` 。深度学习具有高效处理密集高维数据（如电影内容）的能力，因此擅长于任务一，而 PGM 对用户、项目和评级之间的条件依赖关系进行建模，则擅长于任务二和任务三。因此，将两者统一在一个概率框架中可以让我们两全其美。这种整合还带来额外好处，即推荐过程中的不确定性可以得到优雅的处理。更重要的，还可以推导出具体模型的贝叶斯处理方法，从而得到更可靠的预测 `[68，121]` 。

第三个示例是控制系统，考虑依据摄像机的实时视频流来控制复杂的动态系统。该问题可转化为迭代地执行两个任务：原始图像感知和动态模型控制。处理原始图像的感知任务可通过深度学习来实现，而控制任务通常需要更复杂的模型，如隐马尔可夫模型和卡尔曼滤波器 `[35，74]` 。通过控制模型选择的动作可以影响接收到的视频流，并进一步完成反馈循环。为在感知任务和控制任务之间实现有效迭代过程，需要信息在它们之间来回流动。感知组件将是控制组件估计其状态的基础，具有内置动态模型的控制组件将能够预测未来的轨迹（图像）。因此，采用贝叶斯深度学习解决此问题比较合适 `[125]` 。同样，在该概率框架下可以自然地处理来自原始图像的噪声和控制过程中的不确定性。

上面的例子展示了 BDL 的主要优势：（1）感知任务和推断任务之间的信息交换；（2）对高维数据的条件依赖；（3）对不确定性的有效建模。

在不确定性方面， BDL 应用于复杂任务时，有三种参数不确定性需要考虑：

1.  神经网络的参数的不确定性；
2.  与任务相关的参数的不确定性；
3.  感知部分和任务部分信息传递的不确定性。

通过使用概率分布而不是点估计来表示未知参数， BDL 提供了一个很有前途的框架来统一处理上述不确定性。特别是，第三种不确定性只能在 BDL 这样的统一框架下处理，因为分别训练感知组件和任务组件相当于假设两者之间交换信息时不存在不确定性。另外，神经网络在使用时存在过度参数化的问题，因此如何高效处理如此庞大的参数空间的不确定性，是一个比较大的挑战。此外，概率图模型通常更简洁，参数空间更小，从而可以提供更好的可解释性。

除了上述优点外， BDL 的另外一个优点是内置 `隐式正则化` 。通过对隐藏单元、神经网络参数或指定条件依赖关系的模型参数施加先验， BDL 可在一定程度上避免过拟合，特别是在数据不足的情况下。通常， BDL 模型中的感知组件是某种类型神经网络的贝叶斯公式，任务组件使用PGM描述不同隐藏或观测变量之间的关系，正则化对它们都至关重要。对于感知部分，正则化技术（如权重衰减和Dropout `[103]`） 被证明在改善神经网络性能方面是非常有效的，并且都有合理的贝叶斯解释  `[22]`。对于任务部分，专家知识或先验信息作为一种规则化，在数据稀缺的情况下，可通过施加先验信息来指导模型。

当然，将 BDL 应用于实际任务时也存在挑战。

首先，设计一个具有合理时间复杂度的有效贝叶斯神经网络模型非常重要。这项工作是由 `[42，72，80]` 开创的，但由于缺乏可伸缩性，并没有被广泛采用。幸运的是，最近在此方向上的一些进展  `[2，9，31，39，58,119,121]` 似乎揭示了贝叶斯神经网络的实际应用。

第二个挑战是确保感知组件和任务组件之间高效有效的信息交换。理想情况下，一阶和二阶信息（例如，均值和方差）应该能够在两个分量之间来回流动。一种自然的方式是将感知部分表示为PGM，并将其无缝地连接到特定于任务的PGM，如 `[24,118,121]` 中所做的那样。

本文提供了对 BDL 的全面概述，并为各种应用提供了具体模型。文章其余部分安排如下：第2节回顾了一些基本的深度学习模型；第3节介绍了PGM的主要概念和技术；第4节将阐述统一 BDL 框架的基本原理，并详细说明实现其感知组件和任务组件的选择；第5节回顾了应用于推荐系统、主题模型和控制等多个领域的 BDL 模型，分别展示了 BDL 在监督学习、非监督学习和一般表征学习中的作用；第6节对未来研究问题进行了讨论，并对全文进行了总结。

## 2 深度学习

深度学习通常指两层以上的神经网络。为更好地理解深度学习，我们从最简单的神经网络---多层感知器(MLP)开始，说明传统深度学习如何工作。之后，将回顾基于MLP的其他几种深度学习模型。该章主要介绍经典深度学习方法，文章中提到的方法包括MLP、AutoEncoder、CNN、RNN等。

### 2.1 多层感知机（MLP）



### 2.2 自编码器（Autocoder）

该部分提一下自编码器。这是一种能将输入编码为更紧凑表示的神经网络，同时能够将这种紧凑表示进行重建。这方面的资料也很多，这里主要说明一下AE的变种——SDAE（Stacked Denoising AutoEncoders）

![图片](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/bayesian_stat_20210519114919ac.webp)

SDAE的结构如上图所示，和AE不同的是，![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HW06nU1nJjPg9ads3EgQHxBNOj9yeFeGRt5MzLygT1d6ibicmUkg4IBuxiacXZxv9qSS/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)可以看做输入数据![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HvDFqkO0cVdySkKIPiaHKTbAGjic4RLDeTGmWl8tVt7rek6e8sPDYyPrDtZHVoBQlGX/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)加入噪声或者做了一些随机处理后的结果(比如可以把![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HvDFqkO0cVdySkKIPiaHKTbAGjic4RLDeTGmWl8tVt7rek6e8sPDYyPrDtZHVoBQlGX/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)中的数据随机选30%变为零)。所以SDAE做的就是试图把处理过的corrupted data恢复成clean data。SDAE可以转化为如下优化问题：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtz40YBzeNTG1YsMMwmH83fK6rY181d6bnERMXyAnCkQUiabW62D5ARtg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 2.3 卷积神经网络（CNN）



### 2.4 循环神经网络（RNN）



## 3 概率图模型

概率图形模型（Probabilistic Graphical Models，PGM）使用图形表示法来描述随机变量及其之间的关系。与包含节点和边的图类似，PGM 具有表示随机变量的节点和表示它们间概率关系的边。

### 3.1 主要模型

PGM 本质上有两种类型，有向PGM（历史遗留下来也称为贝叶斯网络，注意与贝叶斯神经网络的区别）和无向PGM（也称为马尔可夫随机场） `[5]`。本文主要关注有向 PGM ，有关无向 PGM 的详细信息，请参阅 `[5]`。

PGM 的一个经典例子是潜狄拉克雷分配( Latent Dirichlet Allocation，LDA)，被用于对文档中单词和主题生成关系建模 `[8]` 。通常，PGM 带有模型的图形化表示和一个生成过程，用来描述随机变量是如何一步一步产生的。

图 4 显示了 LDA 的图模型，相应的生成过程如下：

对于每个文档 $j(j=1,2, \ldots, J)$ ，

(1) 从狄拉克雷分布中抽取主题概率 $\theta_{j} \sim \operatorname{Dirichlet}(\alpha)$ 。 

(2) 对于文档 $\mathbf{w}_j$ 中的每个词  $w_{j_n}$ ，

​     (a) 从多项分布中抽取主题赋值 $z_{j_n} \sim \operatorname{Mult}\left(\theta_{j}\right)$ 。

​     (b) 从多项分布中抽取词 $w_{j_n} \sim \operatorname{Mult}\left(\beta_{z_{j_n}}\right)$ 。

上面的生成过程提供了随机变量是如何生成的。在图 4 的图模型中，阴影节点表示观测到的变量，而其他节点是隐变量( $\theta$ 和 $z$ )或参数( $\alpha$ 和 $\beta$ )。一旦定义了模型，就可以应用学习算法自动学习隐变量和参数。


![](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/bayesian_stat_20210519163118fb.webp)

图4 LDA的概率图模型，$J$ 是文档数，$D$ 是文档中的词数，$K$ 是主题的数量。

由于其贝叶斯性质，诸如 LDA 的PGM很容易扩展以合并其他信息或执行其他任务。例如，在 LDA 之后，提出了主题模型的不同变体。`[7,113]` 被建议纳入时间信息，`[6]` 通过假设主题之间的相关性扩展了 LDA。`[44]` 将 LDA 从批处理模式扩展到在线设置，从而可以处理大型数据集。在推荐系统上，协作主题回归( CTR )`[112]` 扩展了 LDA 以纳入评级信息并提出推荐。然后，该模型被进一步扩展以包含社会信息 `[89,115,116]` 。

### 3.2 学习与推断

**严格地说，查找参数（如图 4 中的 $\alpha$ 和 $\beta$ )的过程称为学习，查找给定参数的隐变量（如图 4 中的 $\theta$ 和 $z$ )的过程称为推断。**然而，如果只给出观测变量（如图 4 中的 $w$ ），学习和推断通常是交织在一起的。通常，LDA 的学习和推断会在隐变量（对应于推断）更新和参数（对应于学习）更新之间交替进行。一旦学习和推断完成，就可以学习得到参数 $\alpha$ 和 $\beta$ 。如果有新文档到来，就可以固定学习到的 $\alpha$ 和 $\beta$ ，然后单独执行推断以找到新文档的主题概率 $\theta_J$ 。

与 LDA 类似，每种 PGM 都有各种学习和推断算法可用。其中，最具成本效益的方法可能是最大后验概率（MAP），它相当于将隐变量的后验概率最大化。使用 MAP ，学习过程等同于用正则化最小化(或最大化)目标函数。一个著名的例子是 `概率矩阵分解(PMF)[96]`，其中图模型的学习等价于用 $L2$ 正则化将一个大矩阵分解成两个低秩矩阵。

尽管 MAP 效率很高，但它只给出了隐变量（包括模型参数）的点估计。为考虑不确定性并充分利用贝叶斯模型的能力，人们不得不求助于贝叶斯处理，如变分推断和MCMC 。例如，原始的 LDA 使用变分推断来获得近似真实分布的后验分布 `[8]` 。隐变量和参数的学习则归结为最小化变分分布和真实后验分布之间的 KL 散度。除变分推断，贝叶斯处理的另一选择是MCMC。例如，已经提出了 MCMC 算法(如 `[86]` )来学习 LDA 的后验分布。


> 注： PGM 推断任务大致可分为两类：概率推断任务（求概率分布）和最大后验推断任务（求变量值）。概率推断主要用于推断得到随机变量的联合概率，进而在联合概率分布基础上计算边缘概率分布或条件概率分布，是一种生成式任务，常用方法有变量消除法、信念传播法、变分法、MCMC方法等。最大后验推断任务则寻求使得后验联合概率最大化的变量值，是一种判别式任务，常用方法有经最大化改造后的变量消除法、团树传播法、后向传播法等。

## 4 贝叶斯深度学习

在这一节中，将列出一些最新的 BDL 模型，它们在推荐系统、主题模型、控制等方面都有应用。这些模型的摘要如表1所示。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtBGyjGq16RGgZzMJaXTVVt91FgJrMiboxQIbtqjCaukCwvRIjTZUe8BQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

### 4.1 贝叶斯神经网络与贝叶斯深度学习简史

与 BDL 高度相关的主题是贝叶斯神经网络( BNN )或神经网络的贝叶斯处理。与其他贝叶斯处理类似， BNN 对神经网络的参数施加先验，目的是学习这些参数的后验分布。在推断阶段，后验分布被边缘化以产生最终预测（此处不知如何理解，感觉应当是基于后验做一次抽样）。此过程被称为贝叶斯模型平均（Bayesian Model Averaging） `[5]` ，可被视为学习了无限数量的神经网络（或神经网络的分布），而后通过集成来聚合结果。

>   注：贝叶斯神经网络通过为神经网络的权重引入不确定性进行正则化（regularization）。你可以把它想象成一个集成（ensemble）了无穷多组神经网络（权重分布上的每一种可能性构成一个确定的神经网络，从此角度看，贝叶斯神经网络可以视为所有可能性的集成）的模型。

对 BNN 的研究可以追溯到20世纪90年代，经典著作始于 `[42，72，80]` 。多年来，出现了大量文献 `[2，9，31，39，58,100]` ，实现了更好的扩展，并结合了最新的深度神经网络进展。由于贝叶斯神经网络历史悠久，术语“贝叶斯深度学习”有时专指“贝叶斯神经网络” `[73,128]` 。本文使用泛化的“贝叶斯深度学习”来指代包含贝叶斯神经网络的概率框架。因为具有感知组件和`空`任务组件的 BDL 模型等价于贝叶斯神经网络。

有趣的是，虽然 BNN 开始于20世纪90年代，但更广泛意义上的 BDL 研究大约始于 2014 年 `[38,114,118,121]` ，略晚于2012年 ImageNet LSVRC 竞赛的深度学习突破 `[62]`。正如将在后面几节中看到的， BNN 通常用作 BDL 模型中的感知组件。

如今 BDL 越来越受欢迎，已经在推荐系统和计算机视觉等领域获得了成功应用，并成为各种会议研讨会的主题（例如，NeurIPS BDL Workshop 6）。

### 4.2 通用架构

如第1节提到的， BDL 是一个原则性的概率框架，包含两个紧密集成的组件：感知组件和任务组件。

#### **（1）两个组件** 

图5 以一个简单的 BDL 模型为例显示了其概率图模型。左侧红色矩形内的部分表示感知组件，右侧蓝色矩形内的部分表示任务组件。通常，感知组件应当是一个具有多个非线性处理层（在PGM中表示为链结构）的深度学习模型的概率公式。

虽然感知组件中的节点和边相对简单，但任务组件中的节点和边通常描述更复杂的变量之间的分布和关系。具体而言，任务组件可采用多种形式。可以是典型的贝叶斯网络（即有向PGM），例如LDA、深度贝叶斯网络 `[117]` ，也可以是随机过程 `[51，94]` 。

>   注：概率图模型分为两类，一是有向图模型，通常被称为贝叶斯网络，二是无向图模型，通常被称为马尔可夫随机场。因为在研究随机过程时，常假设其为马尔可夫随机场，所以此处用随机过程代指了马尔科夫随机场。



![图片](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/bayesian_stat_20210519120555fb.webp)
<center>

图5  一个 BDL 模型的概率图。左侧红色矩形表示感知组件，右侧蓝色矩形表示任务组件，铰链变量集合 $Ω_h={H}$ 。 
</center>

#### **（2）三类变量**

 BDL 模型中有三类变量：`感知变量（perception variables）` 、 `铰链变量（hinge variables ）` 和 `任务变量（task variables ）` 。

本文使用 $Ω_p$ 表示感知变量集（例如，图5中的 $X_0$ 、 $X_1$ 和 $W_1$ 等），它们是感知组件中的变量。通常，$Ω_p$ 是深度学习模型的概率公式中出现的 `权重参数` 和 `神经元（隐变量）` 。

 $Ω_h$ 用于表示铰链变量集（如图5中的 $H$ )，此类变量来自于任务组件，但直接与感知组件交互。

任务变量集（如图 5 中的 $A$ 、$B$ 和 $C$ ），即任务组件中与感知组件无直接关系的变量，被表示为 $Ω_t$ 。

#### （3）面向有监督和无监督的生成式过程

如果两个组件之间的边指向 $Ω_h$，则依据概率图模型理论，所有变量的联合概率分布可以写为：


$$
p\left(\Omega_{p}, \Omega_{h}, \Omega_{t}\right)=p\left(\Omega_{p}\right) p\left(\Omega_{h} \mid \Omega_{p}\right) p\left(\Omega_{t} \mid \Omega_{h}\right) \tag{式2}
$$


如果两个组件之间的边源自 $Ω_h $ ，则所有变量的联合概率分布可以写为：

$$
p\left(\Omega_{p}, \Omega_{h}, \Omega_{t}\right)=p\left(\Omega_{t}\right) p\left(\Omega_{h} \mid \Omega_{t}\right) p\left(\Omega_{p} \mid \Omega_{h}\right) \tag{式3}
$$

公式 (2) 和 (3) 假设数据的生成过程不同，并对应于不同学习任务。

式 2 用于监督学习，其中感知组件充当概率（或贝叶斯）表示学习器，以促进任何下游任务（参见5.1节示例）。式 3  用于无监督学习，其中任务组件提供结构化约束和领域知识，以帮助感知组件学习更强的表示（参见5.2节示例）。

请注意，除上述两种情况外， BDL 还可能存在既有指向 $Ω_h$ 又有源自 $\Omega_h$ 的边的情况，此时联合分布的分解将更加复杂。

>   注：上述联合概率分布基于概率图模型的推断计算。细节参见概率图模型相关理论和书籍。

#### （4）独立性要求

铰链变量 $Ω_h$ 和相关条件分布的引入大大简化了模型（特别是当 $Ω_h$ 的入度或出度为 1 时），便于学习，并提供归纳偏差（有关目标函数的假设）以聚焦 $Ω_h$ 内部的信息。

请注意，铰链变量始终位于任务组件中；铰链变量 $Ω_h$ 和感知组件之间的连接（如图5中的 $X_4→H$ ）应该尽量独立，以方便感知组件实施并行计算。例如，$H$ 中的每一行只与 $X_4$ 中的一个对应行相关。虽然在 BDL 模型中这不是强制性的，但满足此要求将显著提高模型训练时的并行计算效率。

#### （5） 铰链方差 $Ω_h$ 的灵活性

如第 1 节所述， 对感知组件和任务组件之间交换信息的不确定性建模，是 BDL 的主要动机之一。 这归根结底是对与 $Ω_h$ 相关的一些不确定性进行建模。例如：在式 2 中，该不确定性反映在条件概率密度 $p(Ω_h|Ω_p)$ 的方差中。根据灵活性程度， $Ω_h$ 有三种类型的方差（为简单起见，本例中假设 BDL 的联合似然为公式 2 ，$Ω_p=\{p\}$ 、 $\Omega_h=\{h\}$ ， 且 $p(Ω_h|Ω_p)= \mathcal{N}(\mu_p，σ^2_p)$） ：

-   Zero-Variance（ZV，没有不确定性，方差为零）：假设在两个组件之间的信息交换过程中不存在不确定性。在本例中，ZV 表现为直接设置 $σ^2_p= 0$ 。
-   Hyper-Variance（HV，方差大小由超参数决定）：假设信息交换期间的不确定性通过超参数定义。在本例中，HV 表现为 $σ^2_p$ 是手动调整的超参数。
-   Learnable Variance（LV，使用可学习参数表示)：使用可学习参数来表示信息交换过程中的不确定性。在本例中，$σ^2$ 为可学习参数。

显然在模型灵活性方面，$LV>HV>ZV$。正常情况下，如果适当地正则化，`LV模型` 的性能应当优于 `HV模型` ，而 `HV模型` 又优于 `ZV模型` 。表 1 中显示了不同 BDL 模型中 $\Omega_h$ 的方差类型。

请注意，尽管表中每种模型都有特定的铰链方差类型，但始终可以调整模型以设计出满足其他类型要求的模型。例如，虽然表中的 CDL 是 `HV模型`，但可以很容易地调整 CDL 中的 $p(Ω_h|Ω_p)$ 来设计其对应的  ZV 和 LV 项。`[121]` 的作者比较了 `HV CDL` 和 `ZV CDL` 的性能，发现前者要好得多，这意味着对两个组件之间的不确定性进行建模对性能至关重要。

#### （6）学习算法

由于 BDL 的性质，实用的学习算法需满足以下准则：

-   准则1：应当是在线算法，以便能够很好地扩展到大数据集;
-   准则2：应当足够有效，能够随着感知组件中的空闲参数数量线性扩展。

准则 1 暗示传统的变分推断或 MCMC 方法可能不适用。通常需要它们的在线版本 `[45]` 。大多数基于 SGD 的方法也不起作用，除非只执行 MAP 推断（与贝叶斯处理相反）。

准则2是必需的，因为在感知组件中通常有大量空闲参数。这意味着基于拉普拉斯近似的方法 `[72]`是不现实的，因为其涉及到海森矩阵中与自由参数数量成二次方关系的计算复杂度。

### 4.3 感知组件

理想情况下，感知组件应是贝叶斯（或概率）神经网络，以便与任务组件（任务组件天生是概率的）兼容，确保感知组件具备处理参数及输出不确定性的能力。

正如4.1节提到的，贝叶斯神经网络的研究可以追溯到 20 世纪 90 年代 `[31，42，72，80]`。但当时的开创性工作由于缺乏可扩展性而没有被广泛采纳。为解决此问题，最近有了一些发展，例如 `受限玻尔兹曼机(RBM)  [40，41]`、`概率广义堆叠去噪自动编码器(pSDAE)[118,121]`、`变分自编码器(VAE)[58]`、`概率反向传播(PBP)[39]`、`贝叶斯后向传播(BBB)[9]` 、`贝叶斯暗知识(BDK)[2]` 和 `自然参数网络(NPN)[119]`。

最近，`生成性对抗性网络(GAN)[30]` 作为一种新的神经网络训练方案盛行，并在图像生成方面显示出生命力。随后，GAN的贝叶斯公式（以及相关的理论结果）也被提出 `[30，37]` 。这些模型也是 BDL 框架感知组件的潜在构建块。

本小节主要介绍最新的贝叶斯神经网络，如 RBM、pSDAE、VAE 和 NPN 。建议读者参考 `[29]` ，了解在此方向上的早期工作。

#### （1）受限玻尔兹曼机（Restrict Boltzmann Machine，RBM）

RBM是一种特殊的 BNN ，用于学习输入随机变量的分布。RBM 具有两层神经元，其中相邻层的神经元之间全相连，同层的神经元之间无相连（此即所谓受限的定义）。其主要特点：一是没有反向传播（BP）训练，RBM 的反向过程是在给定激活值的情况下估计输入 $X$ 的概率，期间使用与前向传递过程相同的权重参数，可以被表达为  $p(x|a; w)$ 。，二是隐层神经元是二值的。如果这两层是更深网络的一部分，那么第一个隐藏层的输出会被传递到第二个隐藏层作为输入，进而就可以有很多隐藏层，直至扩展到最终的分类层。对于简单的前馈网络，RBM 本质上起着自编码器的作用。

具体而言，RBM定义了以下能量：

$$
E(\mathbf{v}, \mathbf{h})=-\mathbf{v}^{T} \mathbf{W h}-\mathbf{v}^{T} \mathbf{b}-\mathbf{h}^{T} \mathbf{a} \notag
$$

其中 $\mathbf{v}$ 表示可见神经元，$\mathbf{h}$ 表示二值的隐藏神经元。$W$ 、$a$ 和 $b$ 是可学习的权重参数。能量函数可推出以下条件分布：

$$
p(\mathbf{v} \mid \mathbf{h})=\frac{\exp (-E(\mathbf{v}, \mathbf{h}))}{\sum_{\mathbf{v}} \exp (-E(\mathbf{v}, \mathbf{h}))}, \quad p(\mathbf{h} \mid \mathbf{v})=\frac{\exp (-E(\mathbf{v}, \mathbf{h}))}{\sum_{\mathbf{h}} \exp (-E(\mathbf{v}, \mathbf{h}))} \tag{式4}
$$

RBM是使用 `对比散度（Contrastive Divergence）”[40]` 而不是后向传播来训练。一旦经过训练，RBM就可以通过边缘化其他神经元来推断 $\mathbf{h}$ 或 $\mathbf{v}$。还可以堆叠RBM层以形成 `深度信念网络(DBN)[76]` ，使用深度RBN的多个分支进行多模态学习 `[104]`，或者将DBN与卷积层相结合以形成卷积DBN `[65]`。

#### （2）广义概率堆叠去噪自编码器（pSDAE）

在第2.2节引入 SDAE 之后，如果假设净输入 $X_c$ 和损坏输入 $X_0$ 均为观测变量，类似于 `[4，5，13，72]`，可以定义概率堆叠去噪自编码器（pSDAE）的生成过程：

(1) 对于 SDAE 网络的 每一层  $l$ 

对于权重矩阵 $W_l$ 中的每一列 $n$ ，抽取 $\mathbf{W}_{l,n} \sim \mathcal{N}(0, \lambda_w^{-1} \mathbf{I}_{K_l})$ 。

抽取偏差向量 $\mathbf{b}_{l} \sim \mathcal{N}\left(0, \lambda_{w}^{-1} \mathbf{I}_{K_{l}}\right)$。

对于 $\mathrm{X}_{l}$ 中的每一行  $j$ ，抽取

$$
\mathbf{X}_{l, j *} \sim \mathcal{N}\left(\sigma\left(\mathbf{X}_{l-1, j *} \mathbf{W}_{l}+\mathbf{b}_{l}\right), \lambda_{s}^{-1} \mathbf{I}_{K_{l}}\right) \tag{式5}
$$

(2) 对于每个元素 $j$ ，

抽取干净输入 $\mathbf{X}_{c, j *} \sim \mathcal{N}\left(\mathbf{X}_{L, j *}, \lambda_{n}^{-1} \mathbf{I}_{B}\right)$.

注意，如果 $λ_s$ 趋于无穷大，则公式(5)中的高斯分布将变成以 $σ(X_{l−1，j∗}W_l+b_l)$ 为中心的 `狄拉克增量分布[106]`，其中σ(·)是Sigmoid函数，并且模型将退化为普通 SDAE 的贝叶斯公式。这也是我们称之为“广义”SDAE的原因。

网络的前L/2层充当编码器，后L/2层充当解码器。后验概率最大化等价于考虑权重衰减的重构误差最小化。

继pSDAE之后，其卷积版本 `[132]` 和递归版本 `[122]` 都已提出，并在知识图谱嵌入和推荐系统中得到了应用。

#### （3）变分自编码器（Variational Autoencoders，VAE）

变分自编码器(VAE) `[58]` 本质上试图学习最大化证据下限( ELBO )的参数 ϕ 和 $\theta$ ：

$$
\mathcal{L}_{v a e}=E_{q_{\phi}(z \mid \mathbf{x})}\left[\log p_{\theta}(\mathbf{x} \mid \mathbf{z})\right]-K L\left(q_{\phi}(\mathbf{z} \mid \mathbf{x}) \| p(\mathbf{z})\right) \tag{式6}
$$

其中 $q_ϕ(z|x)$ 是由 $ϕ$ 参数化的编码器，$p_\theta(x|z)$ 是由 $\theta$ 参数化的解码器。第一项的负值类似于普通自编码器中的重构误差，而 KL 散度作为编码器的正则化项。在训练期间，$q_ϕ(z|x)$ 将输出高斯分布的均值和方差，通过重参数化技巧从该均值和方差中采样 $z$ 。通常 $q_ϕ(z|x)$ 由具有两个分支的 MLP 参数化，一个分支产生平均值，另一个分支产生方差。

类似于 pSDAE 的情况，已经提出了多种 VAE 变体。例如，`重要性加权自编码器(IWAE)[11]` 通过重要性加权得到了更紧致的下界，`[129]` 将 LSTM、VAE 和扩展CNN结合用于文本建模，`[17]` 提出了VAE的递归版本，称为变分 RNN(VRNN)。

#### （4）自然参数网络（Natural-Parameter Networks，NPN）

与通常采用确定性输入的普通神经网络不同，`NPN[119]` 是一种以分布为输入的概率神经网络。输入分布通过线性和非线性变换层来产生输出分布。在 NPN 中，所有隐藏神经元和权值也是以封闭形式表示的分布。请注意，这与 VAE 不同，VAE 只有中间层输出 $z$ 是分布。

例如，在普通线性NN中，$f_w(x)=wx$ 将标量 $x$ 作为输入，并基于标量参数 $w$ 计算输出；而相应的高斯NPN假设 $w$ 是从高斯分布 $\mathcal{N}(w_m，w_s)$ 中抽取的样本，$x$ 是从 $\mathcal{N}(x_m，x_s)$ 中抽得（当输入确定时，$x_s$ 被设置为0）。 $\theta=(w_m，w_s)$ 被视为可学习的参数对，NPN 将计算输出高斯分布的均值 $µ_\theta(x_m，x_s)$ 和方差  $s_\theta(x_m，x_s)$ （为清楚起见，忽略偏差项）：

$$
\mu_{\theta}\left(x_{m}, x_{s}\right)=E[w x]=x_{m} w_{m} \tag{式7}
$$

$$
s_{\theta}\left(x_{m}, x_{s}\right)=D[w x]=x_{s} w_{s}+x_{s} w_{m}^{2}+x_{m}^{2} w_{s} \tag{式8}
$$

因此，该高斯 NPN 的输出是表示高斯分布的元组 $(µ_\theta(x_m，x_s)，s_\theta(x_m，x_s))$ ，而不是单个值。如果不可用，则可以将NPN的输入 $x_s$  的方差设置为 0。请注意，由于 $s_\theta(x_m，0)=x_m^2w_s$ ，即使对于所有数据点 $x_s=0$ ， $w_m$ 和 $w_s$ 依然可学习得到。上面的推导在实践中被推广到处理向量和矩阵·`[119]` 。除高斯分布外，NPN还支持其他指数族分布，如泊松分布和伽马分布 `[119]`。

继NPN之后，提出了一个轻量级版本 `[26]`，以加快训练和推断过程。另一个变体 `MaxNPN[100]` 扩展了NPN以处理最大池化层和类别层。`ConvNPN[87]` 启用NPN中的卷积层。在模型量化和压缩方面，`BinaryNPN[107]` 也被提出为NPN的二进制版本，以获得更好的效率。

### 4.4 任务组件

本小节将介绍不同形式的任务组件。任务组件的目的是将概率先验知识合并到 BDL 模型中。这样的知识可以用PGM自然地表示出来。具体地说，它可以是典型的(或浅层)贝叶斯网络 `[5，54]` 、`双向推断网络[117]` 或 `随机过程[94]` 。

#### （1） 贝叶斯网络（Bayesian Network，BN）

贝叶斯网络是任务组件最常见的选择。正如第3节提到的，贝叶斯网络可以自然地表示条件依赖关系并处理不确定性。除上面介绍的LDA，一个更直接的例子是·`概率矩阵分解(PMF)[96]` ，其中使用贝叶斯网络来描述用户、项目和评分之间的条件依赖关系。具体地说，PMF假定了以下生成过程：

(1) 对每一个项目 $j$， 抽取隐项目向量： $\mathbf{v}_{i} \sim \mathcal{N}\left(\mathbf{0}, \lambda_{v}^{-1} \mathbf{I}_{K}\right)$.

(2) 对于每个用户 $i$ ，抽取隐用户向量： $\mathbf{u}_{i} \sim \mathcal{N}\left(\mathbf{0}, \lambda_{u}^{-1} \mathbf{I}_{K}\right)$.

(3) 对于每个（用户-项目）对 $(i, j)$，抽取评分： $\mathbf{R}_{i j} \sim \mathcal{N}\left(\mathbf{u}_{i}^{T} \mathbf{v}_{j}, \mathbf{C}_{i j}^{-1}\right.$ ).

在上述生成过程中, $\mathrm{C}_{i j}^{-1}$ 对应于评分的方差 $\mathrm{R}_{i j}$。 通过使用最大后验估计, 学习 PMF 的数量，以最大化  $p\left(\left\{\mathbf{u}_{i}\right\},\left\{\mathbf{v}_{j}\right\} \mid\left\{\mathbf{R}_{i j}\right\},\left\{\mathbf{C}_{i j}\right\}, \lambda_{u}, \lambda_{v}\right)$ 的 log 似然：

$$
\mathscr{L}=-\frac{\lambda_{u}}{2} \sum_{i}\left\|\mathbf{u}_{i}\right\|_{2}^{2}-\frac{\lambda_{v}}{2} \sum_{j}\left\|\mathbf{v}_{j}\right\|_{2}^{2}-\sum_{i, j} \frac{\mathrm{C}_{i j}}{2}\left(\mathbf{R}_{i j}-\mathbf{u}_{i}^{T} \mathbf{v}_{j}\right)^{2} \notag
$$

请注意，还可以通过完全贝叶斯处理将另一层先验强加给超参数。例如，`[97]` 对潜在因子的精度矩阵施加先验，并通过Gibbs抽样学习贝叶斯PMF。

在5.1节中，我们将展示如何将PMF用作任务组件，以及定义用于显著提高推荐系统性能的感知组件。

#### （2）双向推断网络（Bidirectional Inference Networks，BIN）

典型贝叶斯网络假定随机变量之间存在“浅”的条件依赖关系。在生成过程中，通常从由其母变量的线性组合参数化的条件分布中提取一个随机变量（可以是隐变量，也可以是可观测变量）。例如，在PMF中，从主要由 $u_i$ 和 $v_j$ 的线性组合参数化的高斯分布中提取评级 $R_{i j}$ ，即 $R_{i j}∼\mathcal{N}(u^T_iv_j，C^{−1}_{i j})$。

这种“浅”的线性结构可以用非线性甚至深的非线性结构来代替，从而形成一个深的贝叶斯网络。例如，`双向推断网络(BIN)[117]` 是一类深度贝叶斯网络，其在每个条件分布中启用深度非线性结构，同时保留将先验知识合并为贝叶斯网络的能力。

例如，图6(左)显示了BIN，其中每个条件分布由贝叶斯神经网络参数化。具体地说，此示例假定进行以下因子分解：

$$
p\left(v_{1}, v_{2}, v_{3} \mid X\right)=p\left(v_{1} \mid X\right) p\left(v_{2} \mid X, v_{1}\right) p\left(v_{3} \mid X, v_{1}, v_{2}\right) \notag
$$

普通贝叶斯网络通过简单的线性运算对每个分布进行参数化。例如，$p(v2|X，v_1)=N(v_2|Xw_0+v_1w_1+b，σ^2)$ 。相反，BIN使用 BNN 。例如，BIN 有 $p(v_2|X，v_1)=\mathcal{N}(v_2|µ_\theta(X，v_1)，s_\theta(X，v_1))$ ，其中 $\mu_\theta(X，v_1)$ 和 $s_\theta(X，v_1)$ 是 BNN 的输出均值和方差。通过对所有 BNN (例如，图6(左)中的 BNN 1、 BNN 2和 BNN 3)执行BP来完成对深层贝叶斯网络的推断和学习 `[117]`。

![](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/bayesian_stat_2021051915021738.webp)

图6左：BIN的一个简单示例，每个条件分布由贝叶斯神经网络( BNN )或简单地用概率神经网络参数化。右：另一个例子BIN。阴影节点和透明节点分别表示观测到的变量和未观测到的变量。

与普通(浅)贝叶斯网络相比，深度贝叶斯网络(如BIN)可以有效、高效地处理深度和非线性的条件依赖。此外，基于深度贝叶斯网络的任务组件以神经网络为构建块，可以更好地与感知组件协同工作，感知组件通常也是一个神经网络。图6(右)显示了一个更复杂的情况，其中既有观测到的(阴影节点)变量，也有未观测到的(透明节点)变量。

#### （3）随机过程（Stochastic Processes，SP）

除了普通贝叶斯网络和深度贝叶斯网络之外，任务组件也可以采取随机过程的形式 `[94]` 。例如，维纳过程可以自然地描述连续时间布朗运动模型 $x_{t+u}|x_t∼N(x_t，λ_uI)$，其中 $x_{t+u}$和 $x_t$ 分别是时间 $t$ 和 $t+u$ 的状态。在图模型文献中，这样的过程已经被用来对博文主题随时间连续时间的演变过程进行建模`[113]`。

另一个例子是在自动语音识别任务中使用泊松过程对音素的边界位置进行建模`[51]`。具体地说，泊松过程定义了生成过程 $∆t_i=t_i−t_{i−1}∼g(λ(t))$ ，其中$t={t_1，t_2，.。。。，t_N}$ 作为边界位置集合，$g(λ(t))$ 是参数为 $λ(t)$ (也称为强度)的指数分布。该随机过程自然地模拟了连续时间内音素边界的出现。参数 $λ(t)$ 可以是将原始语音信号作为输入的神经网络的输出 `[51，83，99]`。

有趣的是，随机过程可以看作是一种动态贝叶斯网络。为理解这一点，可以用等价的形式重写上面的泊松过程，其中给定 $t_{i−1}$ ，在时间 $t$ 没有发生 $t_i$ 的概率 $P(t_i>t)=exp(∫_{t_{i−1}}^{t_i}−λ(t)dt)$ 。显然，维纳过程和泊松过程都是马尔可夫过程，可以用动态贝叶斯网络来表示 `[78]`。

为方便讲解，第5节重点使用普通贝叶斯网络作为任务组件；如果需要，它们可以自然地替换为其他类型的任务组件，以表示不同的先验知识。

## 5 具体的 BDL 模型和应用

上一章讨论完构成 BDL 的基本模型结构，我们自然希望能够把该套大一统的框架运用在一些实际的问题上。因此，该章主要讨论了 BDL 的各种应用场景，包括推荐系统，控制问题等。在这里我们默认任务模块使用普通Bayesian networks作为此部分的模型。

### 5.1 推荐系统中的有监督贝叶斯深度学习

Collaborative Deep Learning。文章在此部分提出Collaborative Deep Learning（CDL）来处理推荐系统的问题，这种方法连接了content information（一般使用深度学习方法处理）和rating matrix（一般使用协同过滤）。

使用4.3.2提到的Probabilistic SDAE，CDL模型的生成过程如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxt6vaxs3GUnAG9kwGiawEWHYoA8rdI5pULhXhJUk7HMXUzefunx2NCMyg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

为了效率，我们可以设置趋向正无穷，此时候，CDL的图模型就可以用下图来表示了：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtBictcZ5PHMQcerhXolsbx5ZTaNhexK0NOC7aoT5STavNfGibnTxzJq8w/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

红色虚线框中的就是SDAE（图上是L=2的情况），右边是degenerated CDL，我们可以看到，degenerated CDL只有SDAE的encoder部分。根据我们之前定义过的，![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HA13jYmyibTUCau6CjibR3oQkOAWJsas2KgCYp5AbGbjXSUDN2ib2JkbutpiaIModrBg9/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)就是hinge variable，而![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4Hic9bAL5jWGaAj4kib0bBsRgNXNMfruFo5eicY9YrholaIDQyia9XLwS0DnJkzs1bu5uL/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)是task variables，其他的是perception variables。

那么我们应该如何训练此模型呢？直观来看，由于现在所有参数都被我们当做随机变量，我们可以使用纯贝叶斯方法，比如VI或MCMC，然而这样计算量往往是巨大的，因此，我们使用一个EM-style的算法去获得MAP估计。先定义需要优化的目标，我们希望最大化后验概率，可以等价为最大化给定![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HhiakuvR7TTRCYBfsdxh5EC53SE50UYwRhoJuEOY9ZHHrhMLZetksF0RiaGlQwwFzP2/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)的joint log-likelihood。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtEO78eLxkQYjNqBfs2D4dyr0jZDJy9sXdDiac5JqibmMPnvzPIstlDntw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

注意，当![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HVrcSYVibGDG5eic56WCgJYJuahbSEp554IXwqM96V80icJeElZq8dlZ6JiaNFZXOSicPV/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)趋向无穷时，训练CDL的概率图模型就退化为了训练下图的神经网络模型：两个网络有相同的加了噪音的输入，而输出是不同的。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtLXvCGx3GyGs6FLibpSDNoawBBvnnKRmW1VNFeERRLyuvsvO3bWjN8qQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

有了优化的目标，参数该如何去更新呢？和巧妙的EM算法的思路类似，我们通过迭代的方法去逐步找到一个局部最优解：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtveaP2nvqrlblb5MrVThfaxfLnKFfOs1zJHFkicewVXkIyfxiaXg9xGtg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当我们估计好参数，预测新的评分就容易了，我们只需要求期望即可，也就是根据如下公式计算：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxt9RhoWrOeBhyve6lmC6ebqX3c7ceoFAicnicjLlrfJWStgmCgIiaeq6iaQw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Bayesian Collaborative Deep Learning：除了这种模型，我们可以对上面提到的CDL进行另外一种扩展。这里我们不用MAP估计，而是sampling-based算法。主要过程如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtDObbqW8rIPwPTEMOIIfmR20YBa6YFVDj0jKibcC9PpDxZ21GQ3pnLJg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HVrcSYVibGDG5eic56WCgJYJuahbSEp554IXwqM96V80icJeElZq8dlZ6JiaNFZXOSicPV/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)趋向正无穷并使用adaptive rejection Metropolis sampling时，对![图片](https://mmbiz.qpic.cn/mmbiz_svg/kMaz9nc8bgIEdcLicp5Kd2P8l09AZmh4HiaQia7XkwSx17UVqknFr7ibNjQvoDhdjJuia0ybwdSZowWmkw2ru1Apzj02scj3iaGicCI/640?wx_fmt=svg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)采样就相当于BP的贝叶斯泛化版本。

Marginalized Collaborative Deep Learning：在SDAE的训练中，不同训练的epoch使用不同的corrupted input，因此训练过程中需要遍历所有的epochs，Marginalized SDAE做出了改进：通过边缘化corrupted input直接得到闭式解。

Collaborative Deep Ranking：除了关注精确的评分，我们也可以直接关注items的排名，比如CDR算法：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtGsA4LAheXCyVcD0qbfy6Xia4YKYy8vdpnekqTHJQNbQVtwg9NW4jpFQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

此时候我们需要优化的log-likelihood就会成为：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/gYUsOT36vfp0G9xjCH5OudvPdPBngyxttFCibApL6cU5AtLNBQblPCOvQK7g2TxGlDOiciapG0K4SLINjLU6siarBA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Collaborative Variational Autoencoders：另外，我们可以将感知模块的Probabilistic SDAE换成VAE，则生成过程如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtNSI0tFjUxFUtOvbyMX7eE4lzmpt5uibwBbfjsTwJ7QtS2bFGz0tMrKw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

总之，推荐系统问题往往涉及高维数据（文本、图像）处理以及条件关系推断（用户物品关系等），CDL这类模型使用 BDL 的框架，能发挥很重要的作用。当然其他监督学习的任务也可以参考推荐系统的应用使用CDL的方法。

### 5.2 主题模型中的无监督贝叶斯深度学习

该小节过渡到非监督问题中，在这类问题中我们不再追求 “match” 我们的目标，而更多是 “describe” 我们的研究对象。

Relational Stacked Denoising Autoencoders as Topic Models （RSDAE）：在RSDAE中我们希望能在关系图的限制下学到一组topics（或者叫潜因子）。RSDAE能“原生地”集成潜在因素的层次结构和可用的关系信息。其图模型的形式和生成过程如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtWrHgicqyWia8TE0Swswiax8j14mN7aSLkfjibY8UKP8vCwavB6aqu3yeicQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtMZF4WIXrPiak0F040f1icicXCUiam7fhc8aaYnpJAjEcogx595uMtdNj6g/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

同样的，我们最大化后验概率，也就是最大化各种参数的joint log-likelihood：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtqoib4Cqf2icCVrW0ylc7biaUd8SLoZicAD4ZuiaISEjfzRvxibd7iacnwvyxQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

训练的时候我们依然使用EM-style的算法去找MAP估计，并求得一个局部最优解（当然也可以使用一些带skip的方法尝试跳出局部最优），具体如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtxeLGqR9rlPMowhDfzq8QDHBJ8zbcaC3VOJPTz86GbR9uib2p9KUacdQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Deep Poisson Factor Analysis with Sigmoid Belief Networks：泊松过程适合对于非负计数相关的过程建模，考虑到此特性，我们可以尝试把Poisson factor analysis（PFA）用于非负矩阵分解。这里我们以文本中的topic问题作为例子，通过取不同的先验我们可以有多种不同的模型。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtTIfbABMaP0vUqFfhV9nH6rXRTMsAokkYn3KUickAhJjKibXVn8JDTPQQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

比如说，我们可以通过采用基于sigmoid belief networks（SBN）的深度先验，构成DeepPFA模型。DeepPFA的生成过程具体如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtUnmib5pXM2TgGOMLZDNJ88ibibFibuAibf55xnZ4YGvfwEqR2SN4dhAHa6A/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

此模型训练的方式是用Bayesian Conditional Density Filtering（BCDF），这是MCMC的一种online版本；也可以使用Stochastic Gradient Thermostats（SGT），属于hybrid Monto Carlo类的采样方法。

Deep Poisson Factor Analysis with Restricted Boltzmann Machine：我们也可以将DeepPFA中的SBN换成RBM模型达到相似的效果。

可以看到，在基于 BDL 的话题模型中，感知模块用于推断文本的topic hierarchy，而任务模块用于对词汇与话题的生产过程，词汇-话题关系，文本内在关系建模。

### 5.3 控制系统中的贝叶斯深度表示学习

前面两小节主要谈论 BDL 在监督学习与无监督学习的应用，该节主要关注另外一个领域：representation learning。用控制问题为例。

Stochastic Optimal Control：在该节，我们考虑一个未知动态系统的随机最优控制问题，在 BDL 的框架下解决的具体过程如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtbGibHAibQpggA6DBFVjxQT29Wuwibic3xq94gib96YOT65TgwuGRAc3Uibrw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

 BDL -Based Representation Learning for Control：为了能够优化上述问题，有三个关键的部分，具体如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtGvYFEhiaKNpCrbKIbWoZVDD50CNETw5JknfRibu50UIcHAd8EEZfnu3w/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Learning Using Stochastic Gradient Variational Bayes：该模型的损失函数是如下这种形式：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gYUsOT36vfp0G9xjCH5OudvPdPBngyxtaRBDJkqqRCap5YZe64hsT3uNcog57BUFmjp5qPEQiaQcjjrEOPmOVsA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在控制的问题中，我们通常希望能够从原始输入中获取语义信息，并在系统状态空间中保持局部线性。而 BDL 的框架正好适用该点，两个组件分别能完成不同的工作：感知模块可以捕获 live video，而任务模块可以推断动态系统的状态。

### 5.4 其他贝叶斯深度学习的应用

除了上面提到的， BDL 还有其他诸多运用场景：链路预测、自然语言处理、计算机视觉、语音、时间序列预测等。比如，在链路预测中，可以将GCN作为感知模块，将stochastic blockmodel作为任务处理模块等。

## 6 结论与展望

现实中很多任务都会涉及两个方面：感知高维数据（图像、信号等）和随机变量的概率推断。 BDL 正是应对这种问题的方案：结合了NN和 PGM 的长处。而广泛的应用使得 BDL 能够成为非常有价值的研究对象，目前这类模型仍然有着众多可以挖掘的地方。