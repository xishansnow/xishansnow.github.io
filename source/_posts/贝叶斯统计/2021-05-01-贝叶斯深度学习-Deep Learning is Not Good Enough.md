# 深度学习还不够好，安全的人工智能需要贝叶斯深度学习

【原文】[DeepLearningIsNotGoodEnough,WeNeedBayesianDeepLearningforSafeAI](https://alexgkendall.com/computer_vision/bayesian_deep_learning_for_safe_ai/"DeepLearningIsNotGoodEnough,WeNeedBayesianDeepLearningforSafeAI")

【引自】[K5niper](https://blog.csdn.net/zhaoyin214/article/details/90231491)

【摘要】理解模型的不确定度（uncertainty）是机器学习的关键。但能够理解不确定度的传统机器学习方法（如高斯过程，[Gaussianprocesses](https://en.wikipedia.org/wiki/Gaussian_process)），无法应用于如图像、视频等高维数据。深度学习（deeplearning）能够高效处理该类数据，但其难以对不确定度建模。本文将介绍一个重新兴起的领域，称为贝叶斯深度学习 （BDL），它提供了一个可以建模不确定性的深度学习框架。贝叶斯深度学习可以达到最先进的结果，同时也能理解不确定性。

---

## 1、 背景

知道一个模型所不知道的是许多机器学习系统的关键部分。不幸的是，如今的深度学习算法通常无法理解它们的不确定性。这些模型常常被盲目地采用，并被认为是准确的，但情况并不总是如此。例如，在最近的两个情景中，这造成了灾难性的后果：

- 2016年5月，发生了第一起辅助驾驶系统造成的死亡事故。根据制造商博客，“在明亮天空下，自动驾驶仪和司机都没有注意到拖拉机拖车的白色一面，所以没有刹车。”
- 2015年7月，一个图像分类系统错误将两名非裔美国人认定为大猩猩，引起人们对种族歧视的关注。

我相信还有更多有趣的案例！如果这两种算法都能给错误的预测赋予高度的不确定性，那么系统就可能做出更好的决策，并避免可能的灾难。

在我看来，理解不确定性是非常重要的。那为什么不是每个人都这样做呢？主要问题是，传统机器学习方法（如高斯过程）很难扩展到高维输入（如图像和视频）。深度学习虽然可以有效理解这些数据，但深度学习很难模拟不确定性。

本文将介绍一个重新兴起的领域，称为贝叶斯深度学习 （BDL），它提供一个可建模不确定性的深度学习框架。贝叶斯深度学习可以达到最先进的结果，同时也能理解不确定性。我将解释不同类型不确定性并展示如何建模。最后，将讨论一个近期成果，显示如何使用不确定性为多任务的深度学习减重。

这篇博文的材料主要来自最近的两篇论文:

- [WhatUncertaintiesDoWeNeedinBayesianDeepLearningforComputerVision?](https://arxiv.org/pdf/1703.04977.pdf)
- [Multi-TaskLearningUsingUncertaintytoWeighLossesforSceneGeometryandSemantics.](https://arxiv.org/pdf/1705.07115.pdf)

和往常一样，更多技术细节可以在论文中找到。

![](https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/spatialPresent_20210501225253_e0.webp)

图像深度估计示例：（1）图像深度估计贝叶斯神经网络输入样本；（2）深度估计输出；（3）估计的不确定度。



## 2、不确定度类型（typesofuncertainty）

我想说的第一个问题是：什么是不确定性?实际上存在不同类型的不确定性，需要了解不同应用程序需要哪种类型。我将讨论两种最重要的类型——认知不确定性和随机不确定性。

### 2.1 认知不确定度（epistemicuncertainty）

认知不确定度（epistemicuncertainty）描述了根据给定训练集得到的模型的不确定度。这种不确定度可通过提供用足够多的数据消除，也被称为模型不确定度（modeluncertainty）。

认知不确定度对下列应用至关重要：

（1）安全至上的应用，认知不确定度是理解模型泛化能力的关键；

（2）训练数据稀疏的小数据集。

### 2.2 随机不确定度（aleatoricuncertainty）

随机不确定度（aleatoricuncertainty）描述了关于数据无法解释的信息的不确定度。例如，图像的随机不确定度可以归因于遮挡、缺乏视觉特征或过度曝光区域等。这种不确定度可通过以更高精度观察所有解释性变量（explanatoryvariables）的能力来消除。

随机不确定度对下列应用至关重要：

（1）海量数据（largedata），此时认知不确定度几乎被完全消除；

（2）实时（real-time）应用，取消蒙特卡罗采样（MonteCarlosampling），用输入数据的确知函数（adeterministicfunctionoftheinputdata）表示随机模型（aleatoricmodels）。

随机不确定度可细分分为两个类：

（1）数据相关（data-dependant）不确定度或异方差不确定度（heteroscedasticuncertainty）：依赖于输入数据且模型输出为预测的随机不确定度。

（2）任务相关（task-dependant）不确定度或同方差不确定度（homoscedasticuncertainty）：不依赖于输入数据的的随机不确定度；对于所有输入数据，它为常量；它在不同的任务之间变化；它不是模型输出；它可用来描述依赖任务的不确定度。

![](https://alexgkendall.com/assets/images/blog_uncertainty/uncertainty_types.jpg)

示例：图像语义分割中的随机不确定度与认知不确定度，随机不确定度给出了有噪标签的物体边界。第三行给出模型对人行道（footpath）不熟悉时，图像语义分割失败的案例，其对应的认知不确定度变大。

## 3、贝叶斯深度学习（Bayesiandeeplearning）

贝叶斯深度学习是介于深度学习和贝叶斯概率论之间的一个交叉领域。它给出了深度学习架构的不确定度评估原理。这些深度架构可以利用深度学习的层次表示能力来建模复杂的任务，同时也能够推断复杂的多模态后验分布。贝叶斯深度学习利用深度学习的层次表示对复杂任务进行建模，同时对复杂的多模态后验分布进行推断。贝叶斯深度学习模型通过模型权重的分布，或学习直接映射输出概率对不确定度进行估计。

首先，我们可以通过改变损失函数来建立异方差的随机不确定性模型。因为这种不确定性是输入数据的函数，我们可以学习使用从输入到模型输出的确定性映射来预测它。对于回归任务，我们通常用类似欧几里得/L2损失的东西来训练: $Loss = || y-\hat{y}||_{2} $ 。要学习异方差不确定性模型，我们只需将损失函数替换为：

$$
Loss=\frac{||y-\hat{y}||_{2}}{2\delta ^{2}}+\frac{1}{2}log\delta ^{2}
$$

模型的预测意味着 $\hat{y}$ 和方差 $\delta ^{2}$ 。正如你所看到的从这个方程,如果模型预测非常错误。那么它将被鼓励去削弱残余项，通过 $\delta ^{2}$ 增加不确定性。然而，$log\delta ^{2}$  防止不确定性项无限大。这可以被认为是学习损耗衰减。同构的任意不确定度可以用类似的方法建模，但不确定度参数将不再是模型输出，而是我们优化的自由参数。

另一方面，认知的不确定性很难建模。这要求我们对模型及其参数上的分布进行建模，而这在规模上很难实现。一种流行的建模技术是[蒙特卡罗误差抽样](http://proceedings.mlr.press/v48/gal16.pdf)，它将伯努利分布置于网络的权值之上。

在实践中，这意味着我们可以用dropout来训练一个模型。然后，在测试时，我们可以从网络中随机采样，使用不同的随机漏出掩模，而不是执行模型平均。这种输出分布的统计将反映模型的认知不确定性。

在前一节中，我解释了定义任意不确定性和认知不确定性的属性。我们论文中一个令人兴奋的结果是，我们可以证明这个公式给出的结果满足这些性质。下面是对两个数据集的单目深度回归模型的一些结果的快速总结:

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;"><tbody><tr><td>训练数据</td><td>测试数据</td><td><p>任意的方差</p></td><td><p>认知差异</p></td></tr><tr><td>在数据集#1上训练</td><td>在数据集#1上测试</td><td>0.485</td><td>2.78</td></tr><tr><td>在25%的数据集#1上训练</td><td>在数据集#1上测试</td><td>0.506</td><td>7.73</td></tr><tr><td>在数据集#1上训练</td><td>在数据集#2上测试</td><td>0.461</td><td>4.87</td></tr><tr><td>在25%的数据集#1上训练</td><td>在数据集#2上测试</td><td>0.388</td><td>15.0</td></tr></tbody></table>

结果表明：当训练数据集很小或者测试数据与训练数据差异显著时，认知不确定度急剧增大；而随机不确定度保持相对不变，其原因在于它是用同一传感器在相同问题上测试的。



## 4、多任务学习的不确定度（uncertaintyformulti-tasklearning）

接下来，我将讨论这些思想在多任务学习中的有趣应用。

多任务学习的目的是通过从一个共享表示中学习多个目标来提高学习效率和预测精度。它在机器学习的许多领域都很流行，从NLP到语音识别再到计算机视觉。多任务学习在长时间运行的计算系统中是至关重要的，比如在机器人中使用的系统。将所有任务合并到一个模型中可以减少计算，并允许这些系统实时运行。

大多数多任务模型使用损失的加权和训练不同的任务。然而，这些模型的性能很大程度上取决于每个任务损失之间的相对权重。手工调整这些权重是一个困难而昂贵的过程，使得多任务学习在实践中变得难以执行。

在我们[最近的论文](https://arxiv.org/pdf/1705.07115.pdf)中，我们建议使用同态不确定性来衡量多任务学习模型中的损失。由于同方差不确定性不随输入数据的变化而变化，我们可以将其解释为任务不确定性。这使我们形成了一个原则性的损失，同时学习各种任务。

我们探讨了在计算机视觉环境下的多任务学习。场景理解算法必须同时理解场景的几何和语义。这形成了一个有趣的多任务学习问题，因为场景理解涉及到不同单位和尺度的各种回归和分类任务的联合学习。也许令人惊讶的是，我们证明了我们的模型可以学习多任务权重，并且优于单独训练的模型。

<img src="https://gitee.com/XiShanSnow/imagebed/raw/master/images/articles/spatialPresent_20210501230510_75.webp" style="zoom: 25%;" />

多任务学习提高了深度感知的平稳性和准确性，因为它可以学习使用来自其他任务(比如分割)的提示的表示(反之亦然)。



## 5、一些具有挑战性的研究问题

为什么贝叶斯深度学习能力不能应用到我们今天的人工智能系统中呢？我认为他们应该这样做，但仍有一些非常棘手的研究问题有待解决。在结束这篇博客之前，我想提一下其中的几个：

- 实时认知不确定性技术阻碍了认知不确定性模型在实时机器人应用中的应用。无论是提高样本效率，还是不依赖于蒙特卡罗推断的新方法都将是非常有益的。
- 贝叶斯深度学习模型的基准。量化改进以快速开发模型是非常重要的——看看像[ImageNet](http://www.image-net.org/)这样的基准对计算机视觉做了什么。我们还需要基准套件来测量BDL模型中的不确定性校准。
- 更好的推断技术来捕获多模态分布。例如，看看这里[设置的演示Yarin](https://htmlpreview.github.io/?https://github.com/yaringal/HeteroscedasticDropoutUncertainty/blob/master/demos/heteroscedastic_dropout_reg.html)，它显示了一些MC dropout推断未能建模的多模态数据。



参考文献：

A.Kendall&Y.Gal,[WhatUncertaintiesDoWeNeedinBayesianDeepLearningforComputerVision?](https://arxiv.org/pdf/1703.04977.pdf),2017

A.Kendall,Y.Gal&R.Cipolla,[Multi-TaskLearningUsingUncertaintytoWeighLossesforSceneGeometryandSemantics](https://arxiv.org/pdf/1705.07115.pdf),2017