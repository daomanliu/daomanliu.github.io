---
title: Markdown 语法速查
date: 2026-08-07
tags: [技术, 写作]
summary: 博客支持的 Markdown 语法一览，写新文章时翻一翻。
---

## 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
```

## 文字样式

**加粗**、*斜体*、~~删除线~~、`行内代码`

```markdown
**加粗**、*斜体*、~~删除线~~、`行内代码`
```

## 列表

- 无序列表项
- 用短横线开头

1. 有序列表项
2. 用数字加点开头

## 引用

> 这是一段引用。
> 可以写多行。

## 代码块

```js
function hello() {
  console.log('Hello, blog!')
}
```

## 数学公式（KaTeX）

行内公式：$E = mc^2$

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 表格

| 语法 | 效果 |
|------|------|
| `**粗体**` | **粗体** |
| `` `代码` `` | `代码` |

## 链接和图片

```markdown
[链接文字](https://example.com)
![图片描述](/图片地址.png)
```

## 分割线

三个或更多的短横线：

---

## 下面全是随便敲的例子

# 1

等号也是一级标题
=
## 2

减号也是二级标题
-
### 3
#### 4
##### 5
###### 6

**换**  
__行__

*换*

_段_

***斜体加粗***

***~~删除~~***

***

分割线细

---

分割线粗

___

* 第一
* 第二
- 第一
- 第二
+ 第一
+ 第二
1. 第一
   2. 二级列表
      3. 三级列表
2. 第二
---

*[x] 打钩
*[ ] 不打勾

---

```java
int a = 10;
```

    public class draft {
    /// ## 打印byte, short, int, long表示的最小整数
    /// - byte: -128
    /// - short: -32768
    /// - int: -2147483648
    /// - long: -9223372036854775808
    /// ## 打印float, double表示的最大整数
    /// - float: 3.4028235E38
    /// - double: 1.7976931348623157E308
    /// ## 打印能显示的最大字符
    /// - char: �
    /// ## 中文命名变量
    /// ## var自动推断类型
    public static void main(String[] args){
    byte b = (byte)0x80;
    System.out.println(b);
    short s = (short)0x8000;
    System.out.println(s);
    int i = 0x8000_0000;
    System.out.println(i);
    long l = 0x8000_0000_0000_0000L;
    System.out.println(l);
    
            float f = 0x1.ff_fffep127F;   // 0 1111_1110 111_1111_1111_1111_1111_1111
            System.out.println(f);
            double d = 0x1.f_ffff_ffff_ffffp1023;
            System.out.println(d);
    
            char c = 0xfffd;
            System.out.println(c);
    
            String 刘道满 = "刘道满";
            System.out.println(刘道满);
    
            var v = '中';
            System.out.println(v);
        }
    }

行内`代码`

> 引用
> - 嵌套列表
> ```c
> int a = 100;
> ```
> > 第一次嵌套[^1]
> > > 第二次嵌套
> > > > 第三次嵌套
> > > > > [道满](https://daomanliu.github.io/#/)
> 
> [bilibili][b], [overleaf][o]


[b]: https://www.bilibili.com/video/BV1eJ4m157kC/?spm_id_from=333.788.player.switch&vd_source=e9ae7c51c83ebfc716090ba55760aaa0&p=7
[o]: https://www.overleaf.com/project
[^1]: 我是指数

![图片][zh]

[zh]: https://cdn.overleaf.com/img/flags/24/zh-CN.png


<image style="width:100px" src="https://daomanliu.github.io/avatar1.jpg">

html<span style="color:blue; font-size:40px">标签</span><span style="color:red">红色</span>

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=1252624739&bvid=BV1eJ4m157kC&cid=1489709802&p=10" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" height="500px"></iframe>

$$
5 = 3+2
\\
\frac{1}{2}
$$

$\frac{x+1}{x+2}, x_{x}^{x}, \sqrt{4}, \sqrt[3]{(4+x)\{x+x+x\}}$
$\not= 不等于, \approx 约等于, \leq 小于等于, \geq 大于等于, \notin, \emptyset$
$\times 乘号, \div 除号, \pm 正负号, \mp 负正号$
$\sum_{求和}^{求和}, \prod_{累乘}, \coprod_{累除}$
$\overline{1+3+5+7+9}, \sin \pi, \cos 180^\circ, \in, \infty, \int^{定积分}, \iint, \iiint, y\prime, \gamma, \supset, \supseteq, \cap, \bigcap, \cap, \bigcap$

$$
\lim_{n\to+\infty}\frac{1}{n}    \\
f(x) = 1+\frac{1}{2}+\frac{1}{3}+\frac{1}{4}+\cdots+\frac{1}{x}
$$

|表格|第二列|第三轮|
|:--|--:|:---:|
|左对齐|右对齐|居中|

```
# 1

等号也是一级标题
=
## 2

减号也是二级标题
-
### 3
#### 4
##### 5
###### 6

**换**  
__行__

*换*

_段_

***斜体加粗***

***~~删除~~***

***

分割线细

---

分割线粗

___

* 第一
* 第二
- 第一
- 第二
+ 第一
+ 第二
1. 第一
   2. 二级列表
      3. 三级列表
2. 第二
---

*[x] 打钩
*[ ] 不打勾

---

```java
int a = 10;
```

    public class draft {
    /// ## 打印byte, short, int, long表示的最小整数
    /// - byte: -128
    /// - short: -32768
    /// - int: -2147483648
    /// - long: -9223372036854775808
    /// ## 打印float, double表示的最大整数
    /// - float: 3.4028235E38
    /// - double: 1.7976931348623157E308
    /// ## 打印能显示的最大字符
    /// - char: �
    /// ## 中文命名变量
    /// ## var自动推断类型
    public static void main(String[] args){
    byte b = (byte)0x80;
    System.out.println(b);
    short s = (short)0x8000;
    System.out.println(s);
    int i = 0x8000_0000;
    System.out.println(i);
    long l = 0x8000_0000_0000_0000L;
    System.out.println(l);
    
            float f = 0x1.ff_fffep127F;   // 0 1111_1110 111_1111_1111_1111_1111_1111
            System.out.println(f);
            double d = 0x1.f_ffff_ffff_ffffp1023;
            System.out.println(d);
    
            char c = 0xfffd;
            System.out.println(c);
    
            String 刘道满 = "刘道满";
            System.out.println(刘道满);
    
            var v = '中';
            System.out.println(v);
        }
    }

行内`代码`

> 引用
> - 嵌套列表
> ```c
> int a = 100;
> ```
> > 第一次嵌套[^1]
> > > 第二次嵌套
> > > > 第三次嵌套
> > > > > [道满](https://daomanliu.github.io/#/)
> 
> [bilibili][b], [overleaf][o]


[b]: https://www.bilibili.com/video/BV1eJ4m157kC/?spm_id_from=333.788.player.switch&vd_source=e9ae7c51c83ebfc716090ba55760aaa0&p=7
[o]: https://www.overleaf.com/project
[^1]: 我是指数

![图片][zh]

[zh]: https://cdn.overleaf.com/img/flags/24/zh-CN.png


<image style="width:100px" src="https://daomanliu.github.io/avatar1.jpg">

html<span style="color:blue; font-size:40px">标签</span><span style="color:red">红色</span>

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=1252624739&bvid=BV1eJ4m157kC&cid=1489709802&p=10" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" height="500px"></iframe>

$$
5 = 3+2
\\
\frac{1}{2}
$$

$\frac{x+1}{x+2}, x_{x}^{x}, \sqrt{4}, \sqrt[3]{(4+x)\{x+x+x\}}$
$\not= 不等于, \approx 约等于, \leq 小于等于, \geq 大于等于, \notin, \emptyset$
$\times 乘号, \div 除号, \pm 正负号, \mp 负正号$
$\sum_{求和}^{求和}, \prod_{累乘}, \coprod_{累除}$
$\overline{1+3+5+7+9}, \sin \pi, \cos 180^\circ, \in, \infty, \int^{定积分}, \iint, \iiint, y\prime, \gamma, \supset, \supseteq, \cap, \bigcap, \cap, \bigcap$

$$
\lim_{n\to+\infty}\frac{1}{n}    \\
f(x) = 1+\frac{1}{2}+\frac{1}{3}+\frac{1}{4}+\cdots+\frac{1}{x}
$$

|表格|第二列|第三轮|
|:--|--:|:---:|
|左对齐|右对齐|居中|


```
