贝叶斯推理（Bayesian inference）

Codefmeister 2020-11-25 23:30:00  758  收藏 2
分类专栏： 统计理论 笔记 文章标签： 数学 概率论
版权
Reference: Wikipedia:Bayesian_inference

Bayesian inference is a method of statistical inference in which Bayes’ theorem is used to update the probability for a hypothesis as more evidence or information becomes available. Bayesian inference is an important technique in statistics, and especially in mathematical statistics. Bayesian updating is particularly important in the dynamic analysis of a sequence of data. Bayesian inference has found application in a wide range of activities, including science, engineering, philosophy, medicine, sport, and law. In the philosophy of decision theory, Bayesian inference is closely related to subjective probability, often called “Bayesian probability”.

贝叶斯推理是一种统计推理方法，利用贝叶斯定理更新假设的概率，来获得更多的证据与信息。贝叶斯推理是统计学尤其是数理统计中的一项重要技术。贝叶斯更新在对于序列化数据的动态分析中非常重要。贝叶斯推断被广泛应用于科学研究，工程等领域。在决策理论哲学中，贝叶斯推理与主观概率密切相关，经常被称为贝叶斯概率。

贝叶斯规则简介(Introduction to Bayes' rule)
形式化解释(Formal explanation)
Bayesian inference derives the posterior probability as a consequence of two antecedents: a prior probability and a “likelihood function” derived from a statistical model for the observed data. Bayesian inference computes the posterior probability according to Bayes’ theorem.

贝叶斯推理根据两个前因式的结果来得到后验概率：一个先验概率；一个由观测数据的统计模型得出的似然函数。贝叶斯推理根据贝叶斯公式来计算后验概率。

贝叶斯公式：

P ( H ∣ E ) = P ( E ∣ H ) ⋅ P ( H ) P ( E ) P(H|E) = \frac{{P(E|H) \cdot P(H)}}{{P(E)}}
P(H∣E)= 
P(E)
P(E∣H)⋅P(H)
	


上述公式中：

H HH代表其概率可能受到数据（下称证据evidence)影响的任何假设。通常这些假设是相互竞争的，而我们的任务就是决定哪一个是最有可能的。
P ( H ) P(H)P(H),先验概率(prior probability),是在数据E EE（即当前得到的证据）被观测到前，对假设H HH的概率估计。
E EE,即证据(evidence),指那些未被用于计算先验概率的新数据。
P ( H ∣ E ) P(H|E)P(H∣E)，后验概率（posterior probability），是指H HH给予E EE以后的概率，即在观测到证据E EE以后，更新的概率。后验概率就是我们想要得到的：在当前观测到的证据下，某个假设发生的概率有多大。
P ( E ∣ H ) P(E|H)P(E∣H), 是在假设H HH的前提下观测到证据E EE的概率，被称为似然函数(likelihood)。作为固定H HH下E EE的函数，它体现了当前证据与给定假设的相容性。似然函数是证据E EE的函数，而后验概率是假设H HH的函数。
P ( E ) P(E)P(E)，被称作边际似然函数或者模型证据。该因子对所有被考虑到的可能的假设都相同（可以明显的看出，符号表达式中并没有H HH），所以该因子不会影响各个假设间的相对概率。
对于不同的H HH，只有P ( H ) P(H)P(H)和P ( E ∣ H ) P(E|H)P(E∣H)这两项在分子上的因子会影响后验概率P ( H ∣ E ) P(H|E)P(H∣E)的值。也就是说，后验概率与其先验概率（固有的可能性）和新获得的似然函数（与新获得的证据的相容性）成正比。

贝叶斯规则也可以被写成如下形式：

P ( E ∣ H ) P ( H ) P ( E ) = P ( E ∣ H ) P ( H ) P ( E ∣ H ) P ( H ) + P ( E ∣ ¬ H ) P ( ¬ H ) = 1 1 + ( 1 P ( H ) − 1 ) P ( E ∣ ¬ H ) P ( E ∣ H ) \frac{{P(E|H)P(H)}}{{P(E)}} = \frac{{P(E|H)P(H)}}{{P(E|H)P(H) + P(E|\neg H)P(\neg H)}} = \frac{1}{{1 + (\frac{1}{{P(H)}} - 1)\frac{{P(E|\neg H)}}{{P(E|H)}}}}
P(E)
P(E∣H)P(H)
	
 = 
P(E∣H)P(H)+P(E∣¬H)P(¬H)
P(E∣H)P(H)
	
 = 
1+( 
P(H)
1
	
 −1) 
P(E∣H)
P(E∣¬H)
	

1
	


这是由于：

P ( E ) = P ( E ∣ H ) P ( H ) + P ( E ∣ ¬ H ) P ( ¬ H ) P(E) = {P(E|H)P(H) + P(E|\neg H)P(\neg H)}
P(E)=P(E∣H)P(H)+P(E∣¬H)P(¬H)

P ( H ) + P ( ¬ H ) = 1 P(H)+P(\neg H)=1
P(H)+P(¬H)=1

贝叶斯推理的形式化描述(Formal description of Bayesian inference)
定义 Definitions
x xx： 一个数据点，事实上可能是一个值向量vector。
θ \thetaθ，数据点所对应的分布的参数，即x ∼ p ( x ∣ θ ) x \sim p(x|\theta)x∼p(x∣θ)。事实上，θ \thetaθ可能是许多参数组成的向量。
α \alphaα，参数分布的超参数，即θ ∼ p ( θ ∣ α ) \theta \sim p(\theta | \alpha)θ∼p(θ∣α)。可能是由很多超参数构成的一个向量。
X XX代表采样，一个由n nn个观测的数据点构成的集合。即x 1 , . . . , x n x_1,...,x_nx 
1
	
 ,...,x 
n
	

x ~ {\tilde x} 
x
~
 ，一个新的数据点，其分布需要被预测。
贝叶斯推理 Bayesian inference
先验分布 prior distribution，是指参数在没有任何新数据被观测到的情况下的概率分布，即p ( θ ∣ α ) p(\theta|\alpha)p(θ∣α)。先验分布可能不容易确定，在这种情况下，我们可以先采用Jeffrets Prior去获得一个先验分布的初始值，然后使用观测到的数据进行更新迭代。
采样分布 sample distribution，是指观测数据X XX在其参数条件下的分布，即p ( X ∣ θ ) p(X|\theta)p(X∣θ)，更确切的说，由于θ \thetaθ服从参数条件α \alphaα下的概率分布，采样分布也可以写为p ( X ∣ θ , α ) p(X|\theta,\alpha)p(X∣θ,α)。但是为了不引起歧义与混淆，我们一般都写为p ( X ∣ θ ) p(X|\theta)p(X∣θ)。采样分布有时候也被称为似然函数, 尤其是当其被视为是参数θ \thetaθ的函数时。有时候写作L ( θ ∣ X ) = p ( X ∣ θ ) L(\theta|X) = p(X|\theta)L(θ∣X)=p(X∣θ)。
边际似然函数 marginal likelihood，有时也被称为证据evidence，是观测数据marginalized out θ \thetaθ后得到的边缘分布，即p ( X ∣ α ) = ∫ θ p ( X ∣ θ ) p ( θ ∣ α ) d θ p(X|\alpha ) = \int_\theta {p(X|\theta )p(\theta |\alpha )d\theta }p(X∣α)=∫ 
θ
	
 p(X∣θ)p(θ∣α)dθ
后验分布 posterior distribution 是指在考虑新观测的数据后的参数分布。它由贝叶斯规则决定，形成了贝叶斯推理的核心。
p ( θ ∣ X , α ) = p ( θ , X , α ) p ( X , α ) = p ( X ∣ θ , α ) p ( θ , α ) p ( X ∣ α ) p ( α ) = p ( X ∣ θ , α ) p ( θ ∣ α ) p ( X ∣ α ) ∝ p ( X ∣ θ , α ) p ( θ ∣ α ) p(\theta |X,\alpha ) = \frac{{p(\theta ,X,\alpha )}}{{p(X,\alpha )}} = \frac{{p(X|\theta ,\alpha )p(\theta ,\alpha )}}{{p(X|\alpha )p(\alpha )}} = \frac{{p(X|\theta ,\alpha )p(\theta |\alpha )}}{{p(X|\alpha )}} \propto p(X|\theta ,\alpha )p(\theta |\alpha )
p(θ∣X,α)= 
p(X,α)
p(θ,X,α)
	
 = 
p(X∣α)p(α)
p(X∣θ,α)p(θ,α)
	
 = 
p(X∣α)
p(X∣θ,α)p(θ∣α)
	
 ∝p(X∣θ,α)p(θ∣α)

用语言描述就是：后验正比于先验乘以似然。 后验等于似然乘以先验除以证据。

“posterior is proportional to likelihood times prior”, or sometimes as “posterior = likelihood times prior, over evidence”

贝叶斯预测 Bayesian Prediction
后验预测分布 Posterior predictive distribution，是新的数据点的概率分布。通过将后验概率边缘化而得到的。
p ( x ~ ∣ X , α ) = ∫ p ( x ~ ∣ θ ) p ( θ ∣ X , α ) d θ p(\tilde x|X,\alpha ) = \int {p(\tilde x|\theta )p(\theta |X,\alpha )d\theta }
p( 
x
~
 ∣X,α)=∫p( 
x
~
 ∣θ)p(θ∣X,α)dθ

先验预测分布 Prior predictive distribution， 是新的数据点的概率分布，在先验概率上边缘化得到的。
p ( x ~ ∣ α ) = ∫ p ( x ~ ∣ θ ) p ( θ ∣ α ) d θ p(\tilde x|\alpha ) = \int {p(\tilde x|\theta )p(\theta |\alpha )d\theta }
p( 
x
~
 ∣α)=∫p( 
x
~
 ∣θ)p(θ∣α)dθ

贝叶斯理论要求使用后验预测分布来进行预测推断，即预测新的，未观测到的数据点的分布。也就是说，不再将一个固定点作为预测结果，而是返回一个可能点的分布。 只有这样才能使用参数θ \thetaθ的整个后验分布。相比之下，频率统计学中的预测常常需要寻找当前参数下的一个最优点估计，例如通过最大似然或者最大后验估计（MAP）。然后将这个最优点代入点的分布公式中。这样做的缺点是，它没有考虑任何参数的不确定性，所以会降低预测分布的方差。

两种类型的预测分布都有复合概率分布的形式（所以才有边际似然函数）。事实上，如果先验分布是共轭先验，那么先验分布和后验分布便来自于同一族，可以很容易看出，先验预测分布和后验预测分布同样来自于同一族的复合分布。唯一的不同在于，后验预测分布使用超参数更新后的值，而先验预测分布使用先验分布中出现的超参数的值。
————————————————
版权声明：本文为CSDN博主「Codefmeister」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_43977640/article/details/110150784