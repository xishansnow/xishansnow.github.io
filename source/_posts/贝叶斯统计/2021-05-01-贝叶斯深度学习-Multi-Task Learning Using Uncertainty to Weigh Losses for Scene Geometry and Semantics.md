# 论文笔记：Multi-Task Learning Using Uncertainty to Weigh Losses for Scene Geometry and Semantics

2020年7月20日

文章目录

- [1 Multi Task Learning with Homoscedastic Uncertainty (同方差多任务学习)](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#1_Multi_Task_Learning_with_Homoscedastic_Uncertainty_(%E5%90%8C%E6%96%B9%E5%B7%AE%E5%A4%9A%E4%BB%BB%E5%8A%A1%E5%AD%A6%E4%B9%A0) "1 Multi Task Learning with Homoscedastic Uncertainty (同方差多任务学习)")
    - [1.1 Homoscedastic uncertainty as task-dependent uncertainty (同方差不确定性)](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#1_1_Homoscedastic_uncertainty_as_taskdependent_uncertainty_(%E5%90%8C%E6%96%B9%E5%B7%AE%E4%B8%8D%E7%A1%AE%E5%AE%9A%E6%80%A7) "1.1 Homoscedastic uncertainty as task-dependent uncertainty (同方差不确定性)")
    - [1.2  Multi-task likelihoods (多任务似然)](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#1_2_Multitask_likelihoods_(%E5%A4%9A%E4%BB%BB%E5%8A%A1%E4%BC%BC%E7%84%B6) "1.2  Multi-task likelihoods (多任务似然)")
- [2 实验论证](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#2_%E5%AE%9E%E9%AA%8C%E8%AE%BA%E8%AF%81 "2 实验论证")
- [个人小结](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#%E4%B8%AA%E4%BA%BA%E5%B0%8F%E7%BB%93 "个人小结")
- [参考材料](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#%E5%8F%82%E8%80%83%E6%9D%90%E6%96%99 "参考材料")
- [文章下载](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD "文章下载")
    - - [Multi-Task Learning Using Uncertainty to Weigh Losses for Scene Geometry and Semantics](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#MultiTask_Learning_Using_Uncertainty_to_Weigh_Losses_for_Scene_Geometry_and_Semantics "Multi-Task Learning Using Uncertainty to Weigh Losses for Scene Geometry and Semantics")
- [源码地址](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#%E6%BA%90%E7%A0%81%E5%9C%B0%E5%9D%80 "源码地址")

Multi-Task Learning (MTL) 问题一个典型方法就是把所有的 Loss 放在一起优化，但是往往又需要设置不同权重。传统方法中往往根据不同 Loss 的量级等人为分析、实验等设置合理的权重，但是取得理想效果往往需要大量工作。本文提出了一种使用 Uncertainty 自动学习权重的方式。

如下图展示了一个典型的 Multi-Task Learning 的场景，同时学习 Semantic、Instance 和 Depth，这一场景包含了分类、特征学习、回归任务，比较典型，也是本文的示例：

![](http://cdn.liuxiao.org/wp-content/uploads/2020/07/1595256365-Screen-Shot-2020-07-19-at-18.47.26.png?x-oss-process=image/resize,m_fill,w_3884,h_1784#)

本文主要创新点如下：

1）一种创新的原则，利用同方差不确定性的多任务学习方法  
2）一个统一的用于学习 semantic segmentation, instance segmentation 和 depth regression 的框架  
3）展示了通过学习方法获得权重的有效性

# 1 Multi Task Learning with Homoscedastic Uncertainty (同方差多任务学习)

简单的多任务学习往往是把所有 Loss 进行联合优化，通常需要需要手动调节他们的 weights。典型的 Loss Function 如下：

Ltotal\=∑iwiLi(1)L\_{\\text {total}}=\\sum\_{i} w\_{i} L\_{i}\\tag{1}Ltotal\=i∑wiLi(1)

然而这种方式通常存在如下问题：模型最后学习效果对于 weights 非常敏感，否则很难同时收获对于多个任务都比较优的模型。同时手工调节这些 weights 也是非常费时费力的工作。例如下图可以看到  weights 对于模型优化效果的影响是很大的：

![](http://cdn.liuxiao.org/wp-content/uploads/2020/07/1595257562-Screen-Shot-2020-07-19-at-19.21.10.png?x-oss-process=image/resize,m_fill,w_2988,h_2332#)

基于此，本文提出一个方法自动选择多任务学习时不同loss前的权重，并在训练过程中可以自行调整，能够有效提高多任务学习时各个任务的精度．

## 1.1 Homoscedastic uncertainty as task-dependent uncertainty (同方差不确定性)

作者的数学模型通过贝叶斯模型建立。作者首先提出贝叶斯建模中存在两类不确定性：

**认知不确定性（Epistemic uncertainty）**：由于缺少训练数据而引起的不确定性

**偶然不确定性（Aleatoric uncertainty）**：由于训练数据无法解释信息而引起的不确定性

而对于偶然不确定性，又分为如下两个子类：

数据依赖地（Data-dependant）或异方差（Heteroscedastic）不确定性

任务依赖地（Task-dependant）或同方差（Homoscedastic）不确定性

多任务中，任务不确定性捕获任务间相关置信度，反应回归或分类任务的内在不确定性。

## 1.2  Multi-task likelihoods (多任务似然)

基于极大似然估计，假设 $f^{\mathbf{W}}$ 为网络输出，**$W$** 为该项输出的权重，则对于**回归任务**有：
$$
p(y∣f^{W}(x))=N(f^W(x),σ^2)\tag{2}\\
p\left(\mathbf{y} \mid \mathbf{f}^{\mathbf{W}}(\mathbf{x})\right)=\mathcal{N}\left(\mathbf{f}^{\\mathbf{W}}(\mathbf{x}), \sigma^{2}\right)\tag{3}\\
p(y∣fW(x))\=N(fW(x),σ2)(2)
$$
对于**分类任务**有：
$$
p(y∣fW(x))\=Softmax⁡(fW(x))(3)p\\left(\\mathbf{y} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right)=\\operatorname{Softmax}\\left(\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right)\\tag{3}p(y∣fW(x))\=Softmax(fW(x))(3)
$$
**多任务的概率**：
$$
p(y1,…,yK∣fW(x))\=p(y1∣fW(x))…p(yK∣fW(x))(4)p\\left(\\mathbf{y}\_{1}, \\ldots, \\mathbf{y}\_{K} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right)=p\\left(\\mathbf{y}\_{1} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right) \\ldots p\\left(\\mathbf{y}\_{K} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right)\\tag{4}p(y1,…,yK∣fW(x))\=p(y1∣fW(x))…p(yK∣fW(x))(4)
$$
例如对于回归任务来说，极大似然估计转化为最小化负对数：
$$
log⁡p(y∣fW(x))∝−12σ2∥y−fW(x)∥2−log⁡σ(5)\\log p\\left(\\mathbf{y} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right) \\propto-\\frac{1}{2 \\sigma^{2}}\\left\\|\\mathbf{y}-\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right\\|^{2}-\\log \\sigma\\tag{5}logp(y∣fW(x))∝−2σ21∥∥∥y−fW(x)∥∥∥2−logσ(5)  
其中 σ\\sigmaσ 表示测量噪声的方差。
$$
**双任务举例**

假设我们有两个任务：

则概率如下：
$$
p(y1,y2∣fW(x))\=p(y1∣fW(x))⋅p(y2∣fW(x))\=N(y1;fW(x),σ12)⋅N(y2;fW(x),σ22)(6)\\begin{aligned} p\\left(\\mathbf{y}\_{1}, \\mathbf{y}\_{2} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right) &=p\\left(\\mathbf{y}\_{1} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right) \\cdot p\\left(\\mathbf{y}\_{2} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right) \\\\ &=\\mathcal{N}\\left(\\mathbf{y}\_{1} ; \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x}), \\sigma\_{1}^{2}\\right) \\cdot \\mathcal{N}\\left(\\mathbf{y}\_{2} ; \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x}), \\sigma\_{2}^{2}\\right) \\end{aligned}\\tag{6}p(y1,y2∣fW(x))\=p(y1∣fW(x))⋅p(y2∣fW(x))\=N(y1;fW(x),σ12)⋅N(y2;fW(x),σ22)(6)
$$
为了优化我们的 Loss 函数 $L(W,σ1,σ2)\\mathcal{L}\\left(\\mathbf{W}, \\sigma\_{1}, \\sigma\_{2}\\right)L(W,σ1,σ2)$ ，取最小化负对数：
$$
\=−log⁡p(y1,y2∣fW(x))∝12σ12∥y1−fW(x)∥2+12σ22∥y2−fW(x)∥2+log⁡σ1σ2\=12σ12L1(W)+12σ22L2(W)+log⁡σ1σ2(7)\\begin{array}{l} =-\\log p\\left(\\mathbf{y}\_{1}, \\mathbf{y}\_{2} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right) \\\\ \\propto \\frac{1}{2 \\sigma\_{1}^{2}}\\left\\|\\mathbf{y}\_{1}-\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right\\|^{2}+\\frac{1}{2 \\sigma\_{2}^{2}}\\left\\|\\mathbf{y}\_{2}-\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right\\|^{2}+\\log \\sigma\_{1} \\sigma\_{2} \\\\ =\\frac{1}{2 \\sigma\_{1}^{2}} \\mathcal{L}\_{1}(\\mathbf{W})+\\frac{1}{2 \\sigma\_{2}^{2}} \\mathcal{L}\_{2}(\\mathbf{W})+\\log \\sigma\_{1} \\sigma\_{2} \\end{array}\\tag{7}\=−logp(y1,y2∣fW(x))∝2σ121∥∥∥y1−fW(x)∥∥∥2+2σ221∥∥∥y2−fW(x)∥∥∥2+logσ1σ2\=2σ121L1(W)+2σ221L2(W)+logσ1σ2(7)
$$
这里我们计 $L1(W)\=∥y1−fW(x)∥2\\mathcal{L}\_{1}(\\mathbf{W})=\\left\\|\\mathbf{y}\_{1}-\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right\\|^{2}L1(W)\=∥∥∥y1−fW(x)∥∥∥2$ 和 $ L2(W)\=∥y2−fW(x)∥2\\mathcal{L}\_{2}(\\mathbf{W})=\\left\\|\\mathbf{y}\_{2}-\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right\\|^{2}L2(W)\=∥∥∥y2−fW(x)∥∥∥2$  分别为两个任务的 Loss Function。

可以看出变量 $y1y\_1y1$ 的噪声 $σ1\\sigma\_1σ1$ 增大，$L1(W)\\mathcal{L}\_{1}(\\mathbf{W})L1(W) $ 的权值降低。反之亦然。最后的 $log⁡σ1σ2\\log \\sigma\_{1} \\sigma\_{2}logσ1σ2$ 可以理解为正则项，防止某个 $σ\\sigmaσ$ 过大而引起训练严重失衡。

这一数学表述可以很容易地扩展为多个回归问题，然而我们对于如何适用分类问题更加关注，我们将分类问题看作对于网络输出通过 Softmax 做了重新的尺度运算：
$$
p(y∣fW(x),σ)\=Softmax⁡(1σ2fW(x))(8)p\\left(\\mathbf{y} \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x}), \\sigma\\right)=\\operatorname{Softmax}\\left(\\frac{1}{\\sigma^{2}} \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right)\\tag{8}p(y∣fW(x),σ)\=Softmax(σ21fW(x))(8)
$$
这一表示形式可以看作[玻尔兹曼分布](http://www.liuxiao.org/knowledge-base/%e7%8e%bb%e5%b0%94%e5%85%b9%e6%9b%bc%e5%88%86%e5%b8%83-boltzmann-distribution/)，其中的 $σ2\\sigma^2σ2$ 可以看作是 kT 也就是玻尔兹曼常数 k 与热力学温度 T 的乘积。这个常数是可以固定或者学习得到的。

根据玻尔兹曼分布，分类问题的极大似然估计为：
$$
log⁡p(y\=c∣fW(x),σ)\=1σ2fcW(x)−log⁡∑c′exp⁡(1σ2fc′W(x))(9)\\begin{aligned} \\log p\\left(\\mathbf{y}=c \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x}), \\sigma\\right) &=\\frac{1}{\\sigma^{2}} f\_{c}^{\\mathbf{W}}(\\mathbf{x}) \\\\ &-\\log \\sum\_{c^{\\prime}} \\exp \\left(\\frac{1}{\\sigma^{2}} f\_{c^{\\prime}}^{\\mathbf{W}}(\\mathbf{x})\\right) \\end{aligned}\\tag{9}logp(y\=c∣fW(x),σ)\=σ21fcW(x)−logc′∑exp(σ21fc′W(x))(9)
$$
其中 $fcW(x)\\mathbf{f}\_{c}^{\\mathbf{W}}(\\mathbf{x})fcW(x)$  是 $fW(x)\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})fW(x) $ 中第 c 类的输出。

那么当我们假设 y1 是一个连续的回归任务预测，y2 是一个离散的分类任务预测。我们定义的 Loss Function 如下：

1）回归问题：L2 距离 $L1(W)\=∥y1−fW(x)∥2\\mathcal{L}\_{1}(\\mathbf{W})=\\left\\|\\mathbf{y}\_{1}-\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right\\|^{2}L1(W)\=∥∥∥y1−fW(x)∥∥∥2$

2）分类问题：交叉熵（Cross Entropy）：$L2(W)\=−log⁡Softmax⁡(y2,fW(x))\\mathcal{L}\_{2}(\\mathbf{W})=-\\log \\operatorname{Softmax}\\left(\\mathbf{y}\_{2}, \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right)L2(W)\=−logSoftmax(y2,fW(x))$

则推导二者联合分布的极大似然估计为：
$$
\=−log⁡p(y1,y2\=c∣fW(x))\=−log⁡N(y1;fW(x),σ12)⋅Softmax⁡(y2\=c;fW(x),σ2)\=12σ12∥y1−fW(x)∥2+log⁡σ1−log⁡p(y2\=c∣fW(x),σ2)\=12σ12L1(W)+1σ22L2(W)+log⁡σ1+log⁡∑c′exp⁡(1σ22fc′W(x))(∑c′exp⁡(fc′W(x)))1σ22≈12σ12L1(W)+1σ22L2(W)+log⁡σ1+log⁡σ2(10)\\begin{array}{l} =-\\log p\\left(\\mathbf{y}\_{1}, \\mathbf{y}\_{2}=c \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right) \\\\ =-\\log \\mathcal{N}\\left(\\mathbf{y}\_{1} ; \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x}), \\sigma\_{1}^{2}\\right) \\cdot \\operatorname{Softmax}\\left(\\mathbf{y}\_{2}=c ; \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x}), \\sigma\_{2}\\right) \\\\ =\\frac{1}{2 \\sigma\_{1}^{2}}\\left\\|\\mathbf{y}\_{1}-\\mathbf{f}^{\\mathbf{W}}(\\mathbf{x})\\right\\|^{2}+\\log \\sigma\_{1}-\\log p\\left(\\mathbf{y}\_{2}=c \\mid \\mathbf{f}^{\\mathbf{W}}(\\mathbf{x}), \\sigma\_{2}\\right) \\\\ =\\frac{1}{2 \\sigma\_{1}^{2}} \\mathcal{L}\_{1}(\\mathbf{W})+\\frac{1}{\\sigma\_{2}^{2}} \\mathcal{L}\_{2}(\\mathbf{W})+\\log \\sigma\_{1} +\\log \\frac{\\sum\_{c^{\\prime}} \\exp \\left(\\frac{1}{\\sigma\_{2}^{2}} f\_{c^{\\prime}}^{\\mathrm{W}}(\\mathrm{x})\\right)}{\\left(\\sum\_{c^{\\prime}} \\exp \\left(f\_{c^{\\prime}}^{\\mathrm{W}}(\\mathrm{x})\\right)\\right)^{\\frac{1}{\\sigma\_{2}^{2}}}} \\\\ \\approx \\frac{1}{2 \\sigma\_{1}^{2}} \\mathcal{L}\_{1}(\\mathbf{W})+\\frac{1}{\\sigma\_{2}^{2}} \\mathcal{L}\_{2}(\\mathbf{W})+\\log \\sigma\_{1}+\\log \\sigma\_{2} \\end{array}\\tag{10}\=−logp(y1,y2\=c∣fW(x))\=−logN(y1;fW(x),σ12)⋅Softmax(y2\=c;fW(x),σ2)\=2σ121∥∥∥y1−fW(x)∥∥∥2+logσ1−logp(y2\=c∣fW(x),σ2)\=2σ121L1(W)+σ221L2(W)+logσ1+log(∑c′exp(fc′W(x)))σ221∑c′exp(σ221fc′W(x))≈2σ121L1(W)+σ221L2(W)+logσ1+logσ2(10)
$$
其中最后一步约等于用到了如下近似：
$$
1σ2∑c′exp⁡(1σ22fc′W(x))≈(∑c′exp⁡(fc′W(x)))1σ22(11)\\frac{1}{\\sigma\_{2}} \\sum\_{c^{\\prime}} \\exp \\left(\\frac{1}{\\sigma\_{2}^{2}} f\_{c^{\\prime}}^{\\mathbf{W}}(\\mathbf{x})\\right) \\approx \\left(\\sum\_{c^{\\prime}} \\exp \\left(f\_{c^{\\prime}}^{\\mathbf{W}}(\\mathbf{x})\\right)\\right)^{\\frac{1}{\\sigma\_{2}^{2}}}\\tag{11}σ21c′∑exp(σ221fc′W(x))≈(c′∑exp(fc′W(x)))σ221(11)
$$
当 $σ2→1\\sigma\_{2} \\to 1σ2→1 $ 时二者更接近于相等。

上述最后结论，也就是整个多任务问题的联合 Loss 形式，那么我们需要优化的参数不仅有 **W** 还有 $σ1\\sigma\_{1}σ1 和 σ2\\sigma\_{2}σ2$ 。

# 2 实验论证

作者尝试将实例分割，语义分割与深度预测在多任务中一起完成，实验结果如下：

![](http://cdn.liuxiao.org/wp-content/uploads/2020/07/1595258620-Screenshot-from-2020-07-20-14-41-05.png?x-oss-process=image/resize,m_fill,w_2110,h_1030#)

可以看出相比手动调参，使用不确定性自动学习的方法获得了很大的效果提升，同时在相同模型架构下，3个任务联合训练比2个任务甚至1个任务都更好。这是一个非常打破认知的结论，通常认为多任务相比单任务一定会存在某种程度上的妥协。

# 个人小结

整个建模思路非常清晰，从同方差性入手利用预测的方差来代表权重，适合大部分回归和分类问题的多任务学习。

# 参考材料

https://zhuanlan.zhihu.com/p/34358595  
https://blog.csdn.net/cv\_family\_z/article/details/78749992

# 文章下载

![图标](http://liuxiao.org/wp-content/plugins/download-manager/assets/file-type-icons/pdf.svg)

### [Multi-Task Learning Using Uncertainty to Weigh Losses for Scene Geometry and Semantics](http://liuxiao.org/download/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/)

1 文件 4.32 MB

[下载](http://liuxiao.org/2020/07/multi-task-learning-using-uncertainty-to-weigh-losses-for-scene-geometry-and-semantics/#)

# 源码地址

[https://github.com/yaringal/multi-task-learning-example/blob/master/multi-task-learning-example.ipynb](https://github.com/yaringal/multi-task-learning-example/blob/master/multi-task-learning-example.ipynb) （Keras）

[https://github.com/Hui-Li/multi-task-learning-example-PyTorch](https://github.com/Hui-Li/multi-task-learning-example-PyTorch) （PyTorch）

[https://github.com/ranandalon/mtl](https://github.com/ranandalon/mtl)