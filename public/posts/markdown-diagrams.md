---
title: 给博客加上 PlantUML 与 Mermaid 图表支持
date: 2026-10-10
tags: [技术, Vue, Markdown]
---
## plantuml测试
```plantuml
@startuml
Alice -> Bob: 认证请求

alt 成功情况

    Bob -> Alice: 认证接受

else 某种失败情况

    Bob -> Alice: 认证失败
    group 我自己的标签
    Alice -> Log : 开始记录攻击日志
        loop 1000次
            Alice -> Bob: DNS 攻击
        end
    Alice -> Log : 结束记录攻击日志
    end

else 另一种失败

   Bob -> Alice: 请重复

end
@enduml
```

```plantuml
@startuml
left to right direction

actor "学生" as Student
actor "LLM服务" as AI

rectangle "错题本系统 MVP" {
    usecase "注册/登录" as UC1
    usecase "拍照上传错题图片" as UC2
    usecase "确认/修正题目文本" as UC3
    usecase "查看AI标准解答" as UC4
    usecase "编写个人解题思路" as UC5
    usecase "获取AI思路点评" as UC6
    usecase "错题分类与检索" as UC7
    usecase "导出Docx/Markdown" as UC8
    usecase "错题复习管理" as UC9

    usecase "OCR与题目解析" as OCR
    usecase "生成标准解答" as GenAns
    usecase "分析思路与解答" as Analyze
}

Student --> UC1
Student --> UC2
Student --> UC3
Student --> UC4
Student --> UC5
Student --> UC6
Student --> UC7
Student --> UC8
Student --> UC9

AI --> OCR
AI --> GenAns
AI --> Analyze

UC2 ..> OCR : <<include>>
UC4 ..> GenAns : <<include>>
UC6 ..> Analyze : <<include>>
@enduml
```
## mermaid测试
```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }
```
