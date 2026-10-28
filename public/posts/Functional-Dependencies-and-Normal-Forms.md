---
title: 函数依赖与范式的谓词逻辑表示及证明
date: 2026-10-28
tags: [数据库, 离散数学, 数学]
---
# 函数依赖与范式的谓词逻辑表示及证明

## 0. 用严格的离散数学描述合理吗？

**合理，而且能把教材中“决定”“完全依赖”“传递依赖”等自然语言表述的适用条件说清楚。** 不过要注意：

1. **函数依赖不是某两个元组之间的偶然相等，而是对关系模式中每一个合法关系实例都成立的语义约束。**
2. 仅用一阶谓词逻辑可以准确表达“元组相等蕴涵属性值相等”；判断候选码、主属性等，则还需要结合给定的依赖集与业务语义。
3. 下文把属性值是否“原子”作为 1NF 的建模前提；关系数据库理论通常默认讨论满足 1NF 的关系模式。

---

## 1. 基本符号与约定

设：

- $R(U,F)$ 是关系模式，$U=\{A_1,A_2,\ldots,A_n\}$ 是有限属性集，$F$ 是定义在 $U$ 上的函数依赖集；
- 对每个属性 $A\in U$，令 $\operatorname{Dom}(A)$ 表示 $A$ 的值域。一个元组 $t$ 可形式化为定义在 $U$ 上的函数：

$$
t:U\to\bigcup_{A\in U}\operatorname{Dom}(A),
\qquad
\forall A\in U,\;t(A)\in\operatorname{Dom}(A).
$$

- $r$ 是 $R(U,F)$ 的一个关系实例，即满足约束的有限元组集合：

$$
r\subseteq\prod_{A\in U}\operatorname{Dom}(A),
\qquad |r|<\infty,
$$

其中 $\prod_{A\in U}\operatorname{Dom}(A)$ 是各属性值域的笛卡尔积；若 $r$ 是合法关系实例，还必须满足 $F$ 中的全部函数依赖；

- $t,s\in r$ 表示 $r$ 中的任意两个元组；
- 对属性子集 $X\subseteq U$，$t[X]$ 表示元组 $t$ 在 $X$ 上各属性值组成的投影；
- $t[X]=s[X]$ 表示 $t,s$ 在 $X$ 的所有属性上分别相等：

$$
  t[X]=s[X]\iff \forall A\in X,\;t[A]=s[A].
$$

- $X,Y,Z\subseteq U$ 均表示属性组（即属性的子集），单个属性 $A\in U$；
- $XY$ 是 $X\cup Y$ 的简写；
- $X\subsetneq Y$ 表示 $X$ 是 $Y$ 的真子集；
- $\mathcal K$ 表示 $R$ 的全部候选码组成的集合。

> 下文“某依赖成立”均指：它在该关系模式的**每一个合法关系实例**中成立。

---

## 2. 函数依赖

### 2.1 定义

称 $X$ **函数决定** $Y$，或 $Y$ **函数依赖于** $X$，记作 $X\to Y$，当且仅当：

$$
\boxed{
X\to Y
\iff
\forall r\;\forall t,s\in r,\;
t[X]=s[X]\Rightarrow t[Y]=s[Y]
}
$$

这句话和公式的意思是：**无论向表中合法地插入、删除或修改数据后得到哪一个关系实例，只要任意两行的** $X$ **属性组取值完全相同，这两行的** $Y$ **属性组取值也必须完全相同。** 其中：

- $\forall r$：考虑该关系模式的每一个合法关系实例，而不只是当前这一张表；
- $\forall t,s\in r$：在实例 $r$ 中任意选取两行，它们可以是同一行；
- $t[X]=s[X]$：这两行在属性组 $X$ 上的取值相同；
- $\Rightarrow t[Y]=s[Y]$：那么这两行在属性组 $Y$ 上的取值也必须相同。

例如，若规定“学号决定姓名”，即 $\{\text{学号}\}\to\{\text{姓名}\}$，那么任何合法的学生表中都不能同时出现“学号相同而姓名不同”的两行。**某个当前实例恰好满足这一点，并不足以证明依赖成立；它必须由数据的语义约束保证在所有合法实例中都成立。**

这里的**固定实例** $r$，就是关系模式在某一时刻的一份具体数据，通俗地说就是“当前这张表里实际装着的所有行”。例如，学生关系模式规定了“学号、姓名、年龄”等属性，而今天表中现有 100 名学生的记录，这 100 行组成一个固定实例 $r$；明天插入一行后，就得到另一个实例 $r'$。关系模式相当于表的结构和约束，关系实例相当于某一时刻的具体表内容。

若只检查当前这份具体数据 $r$ 是否满足 $X\to Y$，则写作：

$$
r\models X\to Y
\iff
\forall t,s\in r,\;
t[X]=s[X]\Rightarrow t[Y]=s[Y].
$$

### 2.2 逐属性形式

设 $X=\{X_1,\ldots,X_m\}$，$Y=\{Y_1,\ldots,Y_n\}$，则：

$$
X\to Y
\iff
\forall t,s\in r,
\left(\bigwedge_{i=1}^{m}t[X_i]=s[X_i]\right)
\Rightarrow
\left(\bigwedge_{j=1}^{n}t[Y_j]=s[Y_j]\right).
$$

**直观理解：** $X$ 值相同的两行，绝不允许出现不同的 $Y$ 值。

### 2.3 平凡与非平凡函数依赖

- 若 $Y\subseteq X$，则 $X\to Y$ 称为**平凡函数依赖**；
- 若 $Y\nsubseteq X$，则 $X\to Y$ 称为**非平凡函数依赖**。

---

## 3. 完全函数依赖与部分函数依赖

### 3.1 完全函数依赖

称 $Y$ **完全函数依赖于** $X$，记作 $X\xrightarrow{F}Y$，当且仅当：

$$
\boxed{
X\xrightarrow{F}Y
\iff
X\to Y
\;\land\;
\forall X'\subsetneq X,\;X'\not\to Y
}
$$

即：$X$ 能决定 $Y$，但去掉 $X$ 中任何一个决定所必需的属性后，都不能再决定 $Y$。

### 3.2 部分函数依赖

称 $Y$ **部分函数依赖于** $X$，记作 $X\xrightarrow{P}Y$，当且仅当：

$$
\boxed{
X\xrightarrow{P}Y
\iff
\exists X'\subsetneq X,\;X'\to Y
}
$$

由定义可知，在 $X\to Y$ 已成立的前提下：

$$
X\xrightarrow{F}Y
\iff
\neg\left(X\xrightarrow{P}Y\right).
$$

> 若 $X$ 是单属性集，则不存在非空真子集可作为更小的决定因素。因此在通常讨论的非空属性决定下，$X\to Y$ 不会构成“去掉部分属性后仍能决定”的部分依赖。

---

## 4. 传递函数依赖

称 $Z$ **传递函数依赖于** $X$（经由 $Y$），记作 $X\xrightarrow{T}Z$，当且仅当存在 $Y\subseteq U$，使得：

$$
\boxed{
X\to Y,\qquad
Y\not\to X,\qquad
Y\to Z,\qquad
Z\nsubseteq Y
}
$$

即：

$$
X\xrightarrow{T}Z
\iff
\exists Y\subseteq U,
\left(
X\to Y
\land Y\not\to X
\land Y\to Z
\land Z\nsubseteq Y
\right).
$$

这里加上 $Y\not\to X$，是为了排除 $X$ 与 $Y$ 互相决定的情形；加上 $Z\nsubseteq Y$，是为了排除 $Y\to Z$ 为平凡依赖的情形。

---

## 5. 候选码、主属性与非主属性

### 5.1 超码与候选码

若 $K\subseteq U$ 能函数决定全部属性，则称 $K$ 为**超码**：

$$
\operatorname{Superkey}(K)\iff K\to U.
$$

若 $K$ 是超码，且其任何真子集都不是超码，则称 $K$ 为**候选码**：

$$
\boxed{
\operatorname{CandidateKey}(K)
\iff
K\to U
\land
\forall K'\subsetneq K,\;K'\not\to U
}
$$

因此，候选码也就是**极小超码**。

### 5.2 主属性与非主属性

$$
\operatorname{Prime}(A)
\iff
\exists K\in\mathcal K,\;A\in K.
$$

$$
\operatorname{Nonprime}(A)
\iff
A\in U\land\neg\operatorname{Prime}(A).
$$

**注意：** 主属性是“至少属于某一个候选码的属性”，不是只属于主码的属性。

---

## 6. 各级范式的形式化定义

### 6.1 第一范式（1NF）

关系模式 $R$ 满足 1NF，当且仅当每个属性的每个取值都是不可再分的原子值：

$$
\boxed{
\operatorname{1NF}(R)
\iff
\forall r\;\forall t\in r\;\forall A\in U,\;
\operatorname{Atomic}(t[A])
}
$$

这里的“原子”是相对于关系模型而言的：一个属性值不能作为需要继续拆分的属性集合、重复组或嵌套关系来处理。

### 6.2 第二范式（2NF）

$R$ 满足 2NF，当且仅当 $R$ 满足 1NF，且**每个非主属性都完全函数依赖于每一个候选码**：

$$
\boxed{
\operatorname{2NF}(R)
\iff
\operatorname{1NF}(R)
\land
\forall K\in\mathcal K\;\forall A\in U,
\left(
\operatorname{Nonprime}(A)
\Rightarrow K\xrightarrow{F}A
\right)
}
$$

等价地，不存在非主属性对候选码的部分依赖：

$$
\neg\exists K\in\mathcal K\;\exists A\in U,
\left(
\operatorname{Nonprime}(A)
\land K\xrightarrow{P}A
\right).
$$

### 6.3 第三范式（3NF）

3NF 可以用下面两种等价方式定义。

#### 定义一：教材定义——不存在指定的依赖结构

设 $R(U,F)$ 满足 1NF。若 $R$ 中**不存在**候选码 $K$、属性组 $Y\subseteq U$ 及非主属性 $A\in U$，使得：

$$
K\to Y,
\qquad Y\to A,
\qquad Y\not\to K,
\qquad A\notin Y,
$$

则称 $R(U,F)$ 满足 3NF。形式化写为：

$$
\boxed{
\operatorname{3NF}(R)
\iff
\operatorname{1NF}(R)
\land
\neg\exists K\in\mathcal K\;\exists Y\subseteq U\;\exists A\in U,
\left(
\operatorname{Nonprime}(A)
\land K\to Y
\land Y\to A
\land Y\not\to K
\land A\notin Y
\right)
}
$$

这里虽然只以 1NF 为前提，但被排除的结构也涵盖了非主属性对候选码的部分依赖：若存在 $Y\subsetneq K$ 使 $Y\to A$，则同时有 $K\to Y$ 和 $Y\not\to K$，恰好形成上述被禁止的结构。因此，由该定义可以推出每个非主属性既不部分依赖于候选码，也不传递依赖于候选码，即 $R$ 必满足 2NF。

#### 定义二：用任意非平凡函数依赖刻画

$R$ 满足 3NF，当且仅当 $R$ 满足 1NF，且对任意非平凡函数依赖 $X\to A$（其中 $A\notin X$），必有以下二者之一：

1. $X$ 是超码；
2. $A$ 是主属性。

即：

$$
\boxed{
\operatorname{3NF}(R)
\iff
\operatorname{1NF}(R)
\land
\forall X\subseteq U\;\forall A\in U\setminus X,
\left(
X\to A
\Rightarrow
\operatorname{Superkey}(X)\lor\operatorname{Prime}(A)
\right)
}
$$

#### 证明：3NF 的两种定义等价

记定义一为 $D_1$，定义二为 $D_2$，下面分别证明 $D_1\Rightarrow D_2$ 和 $D_2\Rightarrow D_1$。

**（1）证明** $D_1\Rightarrow D_2$**。**

设 $R$ 满足定义一。任取非平凡函数依赖：

$$
X\to A,\qquad A\notin X.
$$

反设 $X$ 不是超码，且 $A$ 不是主属性。任取候选码 $K\in\mathcal K$，因为 $K\to U$，所以：

$$
K\to X.
$$

又因为 $X$ 不是超码，若 $X\to K$，则由 $K\to U$ 和传递律可得 $X\to U$，矛盾。因此：

$$
X\not\to K.
$$

结合反设中的 $X\to A$、$A\notin X$，以及 $A$ 是非主属性，得到：

$$
K\to X,
\qquad X\to A,
\qquad X\not\to K,
\qquad A\notin X.
$$

这正是定义一所禁止的结构，矛盾。因此，$X$ 是超码或 $A$ 是主属性，即 $R$ 满足定义二。

**（2）证明** $D_2\Rightarrow D_1$**。**

设 $R$ 满足定义二，则 $R$ 已满足 1NF。反设 $R$ 不满足定义一，则存在候选码 $K$、属性组 $Y$ 和非主属性 $A$，使得：

$$
K\to Y,
\qquad Y\to A,
\qquad Y\not\to K,
\qquad A\notin Y.
$$

由于 $Y\to A$ 且 $A\notin Y$，这是一个非平凡函数依赖。根据定义二，必有：

$$
\operatorname{Superkey}(Y)\lor\operatorname{Prime}(A).
$$

但 $A$ 是非主属性，所以只能是 $Y$ 为超码，即 $Y\to U$。因为 $K\subseteq U$，故特别有 $Y\to K$，与 $Y\not\to K$ 矛盾。

因此，定义一所禁止的结构不存在，$R$ 满足定义一。$\blacksquare$

综上，3NF 的两种定义等价。定义一从“候选码—中间属性组—非主属性”的依赖链出发，定义二直接检查所有非平凡函数依赖。

### 6.4 BCNF

$R$ 满足 BCNF，当且仅当 $R$ 满足 1NF，且对任意非平凡函数依赖 $X\to A$（其中 $A\notin X$），$X$ 必为超码：

$$
\boxed{
\operatorname{BCNF}(R)
\iff
\operatorname{1NF}(R)
\land
\forall X\subseteq U\;\forall A\in U\setminus X,
\left(
X\to A\Rightarrow\operatorname{Superkey}(X)
\right)
}
$$

也可对属性组写成：若 $X\to Y$ 且 $Y\nsubseteq X$，则 $X$ 必为超码。

**3NF 与 BCNF 的唯一区别：** 当决定因素不是超码时，3NF 还允许“被决定的属性是主属性”，BCNF 不允许任何例外。

---

## 7. 证明：3NF 一定是 2NF

### 命题

$$
\operatorname{3NF}(R)\Rightarrow\operatorname{2NF}(R).
$$

### 证明（反证法）

假设 $R$ 满足 3NF，但不满足 2NF。由 2NF 的定义，存在候选码 $K$ 和非主属性 $A$，使得 $A$ 部分函数依赖于 $K$。因此存在 $K_0\subsetneq K$，满足：

$$
K_0\to A.
$$

由于 $K$ 是候选码，有：

$$
K\to U,
$$

而 $K_0\subseteq U$，所以特别有：

$$
K\to K_0.
$$

又因为 $K_0$ 是候选码 $K$ 的真子集，根据候选码的极小性：

$$
K_0\not\to U,
$$

故必有：

$$
K_0\not\to K.
$$

于是得到：

$$
K\to K_0,\qquad K_0\not\to K,\qquad K_0\to A.
$$

同时，$A$ 是非主属性，因此 $A\notin K_0$（否则 $K_0\subseteq K$ 会使 $A\in K$，从而 $A$ 为主属性，矛盾）。所以 $K_0\to A$ 是非平凡依赖。

但是 $K_0$ 不是超码，$A$ 也不是主属性，这与 3NF 的定义矛盾。

因此假设不成立，$R$ 必满足 2NF。$\blacksquare$

**一句话概括：** 非主属性若部分依赖于候选码 $K$，就会经由 $K$ 的真子集 $K_0$ 形成一条 3NF 禁止的非平凡依赖。

---

## 8. 证明：BCNF 一定是 3NF

### 命题

$$
\operatorname{BCNF}(R)\Rightarrow\operatorname{3NF}(R).
$$

### 证明（直接证明）

设 $R$ 满足 BCNF。任取非平凡函数依赖：

$$
X\to A,\qquad A\notin X.
$$

由 BCNF 的定义，必有：

$$
\operatorname{Superkey}(X).
$$

因此当然有：

$$
\operatorname{Superkey}(X)\lor\operatorname{Prime}(A).
$$

这正好满足 3NF 对任意非平凡函数依赖的要求，所以 $R$ 满足 3NF。$\blacksquare$

**一句话概括：** BCNF 要求“决定因素必须是超码”，3NF 只要求“决定因素是超码，或被决定属性是主属性”；前者显然推出后者。

---

## 9. 证明：BCNF 的三条性质

以下三条是教材中常用的 BCNF 性质表述。

### 性质一：所有非主属性都完全函数依赖于每个候选码

即：

$$
\forall K\in\mathcal K\;\forall A\in U,
\left(
\operatorname{Nonprime}(A)
\Rightarrow K\xrightarrow{F}A
\right).
$$

**证明：**

因为 BCNF 一定是 3NF，而 3NF 一定是 2NF，所以由 2NF 定义立即得到：每个非主属性都完全函数依赖于每个候选码。$\blacksquare$

### 性质二：所有主属性都完全函数依赖于每个不包含它的候选码

即：

$$
\forall K\in\mathcal K\;\forall A\in U,
\left(
\operatorname{Prime}(A)\land A\notin K
\Rightarrow K\xrightarrow{F}A
\right).
$$

**证明：**

任取候选码 $K$ 和主属性 $A$，且 $A\notin K$。

因为 $K$ 是候选码，所以 $K\to U$，从而 $K\to A$。下面证明这是完全依赖。反设存在 $K_0\subsetneq K$，使得：

$$
K_0\to A.
$$

由 $A\notin K$ 且 $K_0\subseteq K$，知 $A\notin K_0$，故 $K_0\to A$ 是非平凡函数依赖。由 BCNF 可知 $K_0$ 必须是超码。

但 $K_0\subsetneq K$，这说明候选码 $K$ 有一个真子集也是超码，与候选码的极小性矛盾。

因此不存在这样的 $K_0$，所以 $K\xrightarrow{F}A$。$\blacksquare$

> “不包含它”这个条件不可省：若 $A\in K$，则 $K\to A$ 是平凡依赖，$A$ 本身已经包含在决定因素中，不是这里要讨论的情形。

### 性质三：没有任何属性完全函数依赖于非码的任何一组属性

这里的“非码属性组”应严格理解为：**不是超码的属性组**。命题为：

$$
\forall X\subseteq U\;\forall A\in U,
\left(
\neg\operatorname{Superkey}(X)
\Rightarrow
\neg\left(X\xrightarrow{F}A\right)
\right).
$$

**证明：**

任取非超码属性组 $X$。反设存在属性 $A$，使得：

$$
X\xrightarrow{F}A.
$$

完全依赖首先要求 $X\to A$。若 $A\in X$，则 $X\to A$ 是平凡依赖；这不构成 BCNF 所限制的非平凡依赖，但也不会给出一个“由非码属性组决定其他属性”的反例。

若 $A\notin X$，则 $X\to A$ 是非平凡函数依赖。由 BCNF，$X$ 必须为超码，与 $\neg\operatorname{Superkey}(X)$ 矛盾。

因此，非超码属性组不能非平凡地决定任何其他属性，自然更不可能使其他属性完全函数依赖于它。$\blacksquare$

---

## 10. 三个范式之间的包含关系

综上：

$$
\boxed{
\operatorname{BCNF}(R)
\Rightarrow
\operatorname{3NF}(R)
\Rightarrow
\operatorname{2NF}(R)
\Rightarrow
\operatorname{1NF}(R)
}
$$

反向一般均不成立：

- 2NF 仍可能存在非主属性对候选码的传递依赖，所以未必是 3NF；
- 3NF 允许“非超码 $\to$ 主属性”的非平凡依赖，所以未必是 BCNF；
- BCNF 在 3NF 的基础上进一步取消了“被决定属性是主属性”这一例外。

---

## 11. 最容易混淆的四点

1. **完全依赖与部分依赖是一组相对概念**，都针对同一个决定因素 $X$；不能脱离 $X$ 单独说“$Y$ 是完全依赖的”。
2. **传递依赖不只是** $X\to Y$ **且** $Y\to Z$，教材定义还要求 $Y\not\to X$，并排除平凡的 $Y\to Z$。
3. **主属性不等于主码中的属性**；只要属于任一候选码，就是主属性。
4. **3NF 与 BCNF 的分界点**正是：非超码能否决定主属性。3NF 可以，BCNF 不可以。