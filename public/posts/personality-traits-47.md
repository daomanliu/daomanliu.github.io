---
title: AI做的html用iframe嵌入测试
date: 2026-11-19
tags: [英语, 词汇, 六级, 交互]
summary: 把「人物特征」的 47 个词按外形、心智、善恶、气质、抽象重排成六个类别，再做成一个能翻卡、能测验的单文件交互页。
---


<iframe src="/attachement/26_11_19/personality.html" width="100%" height="820" style="width:100%;height:820px;border:0;border-radius:14px;display:block" loading="lazy" title="人物特征 47 词 · 交互单词卡"></iframe>

三个视图，右上角的圆环记录你标成「已掌握」的比例：

- **卡片**：点一下翻面，正面只有单词、音标、词性，背面是全部义项和一条常用搭配。逼自己先读正面。
- **列表**：六类分组铺开，左边方框打勾即算掌握，适合快速过一遍。
- **测验**：随机出「看词选义」或「看义选词」，答对自动计入已掌握，答错会把正确答案标红。数字键 1–4 可以直接选。

进度存在浏览器 localStorage 里，只在本机有效，关掉页面不会丢；换设备就是全新的。搜索框支持单词、音标和中文释义（比如直接搜「秃」只剩 *bald*），按 `/` 聚焦、`Esc` 清空。

### 1. 外貌形体 · 11

| 单词 | 音标 | 词性 | 释义 | 搭配 |
| --- | --- | --- | --- | --- |
| blonde | /blɒnd/ | a. / n. | （头发）金黄色的；金发女郎 | a blonde girl |
| curl | /kɜːl/ | n. / v. | （一缕）鬈发；卷曲（物）；卷、蜷缩 | curly hair |
| blush | /blʌʃ/ | vi. / n. | 脸红 | blush with shame |
| gorgeous | /ˈɡɔːdʒəs/ | a. | 极其漂亮的；令人十分愉快的 | a gorgeous view |
| dwarf | /dwɔːf/ | n. / vt. | 矮子，侏儒；使显得矮小、相形见绌 | be dwarfed by |
| naked | /ˈneɪkɪd/ | a. | 裸体的；裸露的 | the naked eye |
| nude | /njuːd/ | a. / n. | （尤指艺术人像）裸体的；（美）肉色的；裸体艺术品 | a nude painting |
| bald | /bɔːld/ | a. | 秃头的；简单的 | go bald |
| trim | /trɪm/ | a. / vt. / n. | （人）苗条的；修剪 | a trim figure |
| slender | /ˈslendə(r)/ | a. | 苗条的，修长的；细的，窄的；微薄的 | a slender chance |
| masculine | /ˈmæskjəlɪn/ | a. | 男子汉的 | a masculine voice |

这一组最容易混的是**体型三件套**：*trim* 是「收拾得利落、没有赘肉」，*slender* 是纯客观的「细长」，*bald* 则和体型无关，只说头顶。而 *naked / nude* 的分工很清楚：前者是状态（没穿），后者是**艺术语境**下的裸体，还顺手多一个「肉色」的旧义。

### 2. 智力心智 · 7

| 单词 | 音标 | 词性 | 释义 | 搭配 |
| --- | --- | --- | --- | --- |
| shrewd | /ʃruːd/ | a. | 机灵的，敏锐的 | a shrewd businessman |
| clumsy | /ˈklʌmzi/ | a. | 笨拙的；不得体的 | a clumsy apology |
| retarded | /rɪˈtɑːdɪd/ | a. | 弱智的 | mentally retarded |
| illiterate | /ɪˈlɪtərət/ | n. / a. | 文盲；文盲的 | computer illiterate |
| juvenile | /ˈdʒuːvənaɪl/ | a. / n. | 少年的；幼稚的；未成年人 | juvenile crime |
| idiot | /ˈɪdiət/ | n. | 白痴；傻子，笨蛋 | You idiot! |
| cunning | /ˈkʌnɪŋ/ | a. / n. | 狡猾的；灵巧的；狡猾 | a cunning plan |

*clumsy* 有个很实用的第二义「不得体的」，所以 *a clumsy apology* 是「笨嘴拙舌的道歉」，不是动作笨。*cunning* 的「灵巧」义经常被忽略，但它正是从「手巧」滑到「心巧（狡猾）」的中间站。

⚠️ *retarded* 在当代英语里已被视为冒犯性说法，考试可能考它的释义，日常和正式写作请改用 *intellectually disabled*。

### 3. 性情之善 · 10

| 单词 | 音标 | 词性 | 释义 | 搭配 |
| --- | --- | --- | --- | --- |
| amiable | /ˈeɪmiəbl/ | a. | 和蔼可亲的 | an amiable host |
| benevolent | /bəˈnevələnt/ | a. | 仁慈的 | a benevolent smile |
| ardent | /ˈɑːdnt/ | a. | 热烈的 | an ardent supporter |
| earnest | /ˈɜːnɪst/ | a. | 真诚的，热切的 | in earnest |
| sincere | /sɪnˈsɪə(r)/ | a. | 诚挚的；诚实的 | sincere thanks |
| lenient | /ˈliːniənt/ | a. | 宽容的 | be lenient with sb |
| lavish | /ˈlævɪʃ/ | a. / vt. | 大量的；慷慨的；慷慨地给予 | lavish praise on sb |
| diligent | /ˈdɪlɪdʒənt/ | a. | 勤奋的 | a diligent student |
| meticulous | /məˈtɪkjələs/ | a. | 极细致的，小心翼翼的 | meticulous about details |
| eminent | /ˈemɪnənt/ | a. | （人）出众的；（品质）杰出的 | an eminent scientist |

十个词其实分三档：**对人**（amiable 好相处、benevolent 心肠好、lenient 手松）、**对事**（diligent 肯下功夫、meticulous 抠细节、ardent 有火、earnest / sincere 不掺假）、**被评价**（eminent 站在人群前面）。*lavish* 是里面唯一的「双向」词：既能形容「大量的」（*lavish praise*），又能当动词「慷慨地给予」。

### 4. 性情之恶 · 10

| 单词 | 音标 | 词性 | 释义 | 搭配 |
| --- | --- | --- | --- | --- |
| brutal | /ˈbruːtl/ | a. | 残忍的；冷酷的 | a brutal attack |
| coarse | /kɔːs/ | a. | 粗鲁无礼的；（皮肤或布料）粗糙的；粗的 | coarse language |
| reckless | /ˈrekləs/ | a. | 鲁莽的 | reckless driving |
| ruthless | /ˈruːθləs/ | a. | 无情的，残忍的 | a ruthless competitor |
| coward | /ˈkaʊəd/ | n. | 胆怯者，懦夫 | call sb a coward |
| sinister | /ˈsɪnɪstə(r)/ | a. | 邪恶的 | a sinister look |
| nasty | /ˈnɑːsti/ | a. | 令人讨厌的；恶意的 | a nasty remark |
| wicked | /ˈwɪkɪd/ | a. | 邪恶的；淘气的，顽皮的；极好的 | a wicked sense of humour |
| naughty | /ˈnɔːti/ | a. | （尤指儿童）顽皮的，淘气的 | a naughty child |
| idle | /ˈaɪdl/ | a. | 懒惰的；空闲的 | lie idle |

这组的排列本身就是一条从「动手」到「动心」的梯度：*coarse*（嘴上没把门）→ *reckless*（不计后果）→ *brutal*（下手狠）→ *ruthless*（心不软）→ *sinister*（邪气）。*coward* 站在这条线的反面偏下——不是坏，是**不敢**，所以和 *reckless* 恰好构成两个极端。

*wicked* 值得单独画个重点：它在口语里既能夸人（*a wicked sense of humour* 缺德得好笑），也能骂人，还能说小孩淘气；*naughty* 则几乎只留给小孩和玩笑语境。

### 5. 气质状态 · 5

| 单词 | 音标 | 词性 | 释义 | 搭配 |
| --- | --- | --- | --- | --- |
| eccentric | /ɪkˈsentrɪk/ | a. / n. | 古怪的，异乎寻常的；古怪的人 | an eccentric millionaire |
| tedious | /ˈtiːdiəs/ | a. | 乏味的，单调的 | a tedious lecture |
| single | /ˈsɪŋɡl/ | a. / n. / v. | 单一的；未婚的；单程票；选出 | remain single |
| cosmopolitan | /ˌkɒzməˈpɒlɪtən/ | a. / n. | 世界性的；见识广的；周游世界的人 | a cosmopolitan city |
| ego | /ˈiːɡəʊ/ | n. | 自我（意识） | hurt sb's ego |

这一类的共同点是**不带道德判断**：*eccentric* 的怪是「有意思的怪」，换成 *sinister* 就变成「危险的怪」；*cosmopolitan* 是夸人见多识广，不是「不接地气」。*single* 放进来是因为它在这一节里唯一常用的义项是「未婚的」——顺带记住它的三个词性。

### 6. 抽象特质 · 4

| 单词 | 音标 | 词性 | 释义 | 搭配 |
| --- | --- | --- | --- | --- |
| vigour | /ˈvɪɡə(r)/ | n. | 精力（亦作 vigor） | full of vigour |
| flaw | /flɔː/ | n. | 缺点 | a fatal flaw |
| greed | /ɡriːd/ | n. | 贪心，贪婪；贪吃 | greed for money |
| hypocrisy | /hɪˈpɒkrəsi/ | n. | 伪善，虚伪 | the hypocrisy of it |

四个名词，正好对应四种「说不清但确实存在」的东西：能量（vigour）、裂缝（flaw）、欲望（greed）、面具（hypocrisy）。*flaw* 和 *greed* 都常出现在写作里，*a fatal flaw*、*greed for money* 是可以直接搬进作文的搭配。

