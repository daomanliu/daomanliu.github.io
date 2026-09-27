---
title: 关系代数与SQL语句对应
date: 2026-09-27
tags: [数据库, 关系代数]
summary: 关系代数与SQL语句的对应关系
---
## 对应关系

| 关系代数 | 含义 | SQL |
|---|---|---|
| σ 选择 | 选行（行级筛选） | `WHERE` |
| π 投影 | 选列（列级筛选） | `SELECT` |
| ⋈ 连接 | 按条件拼表 | `JOIN ... ON` / `WHERE` |
| × 笛卡尔积 | 两表全组合 | `CROSS JOIN` / 逗号 |
| ∪ 并 | 合并去重 | `UNION` |
| ∩ 交 | 共同部分 | `INTERSECT` |
| − 差 | 在 A 不在 B | `EXCEPT` / `NOT IN` |
| ÷ 除 | "查询...全部/所有..." | `NOT EXISTS` 双重否定 |
| ρ 重命名 | 改名字 | `AS` |
| γ 分组聚合 | 分组统计 | `GROUP BY` + 聚合函数 |

## 逐一举例

**1. 选择 σ：查男同学**
```sql
σ Ssex='男' (Student)
SELECT * FROM Student WHERE Ssex = '男';
```

**2. 投影 π：只查学号和姓名**
```sql
π Sno, Sname (Student)
SELECT Sno, Sname FROM Student;
```

**3. 选择和投影组合（先选后投）**
```sql
π Sname (σ Ssex='男' (Student))
SELECT Sname FROM Student WHERE Ssex = '男';
```

**4. 连接 ⋈：学生及其选课**
```sql
Student ⋈ SC   -- 自然连接，按同名属性 Sno
SELECT * FROM Student NATURAL JOIN SC;
-- 或
SELECT * FROM Student JOIN SC ON Student.Sno = SC.Sno;
```

**5. 等值连接 vs 自然连接**：等值连接结果保留两表的 Sno 列（重复），自然连接只留一列。

**6. 差 −：没选课的学生**
```sql
π Sno(Student) − π Sno(SC)
SELECT Sno FROM Student
WHERE Sno NOT IN (SELECT Sno FROM SC);
-- MySQL 没有 EXCEPT，用 NOT IN 代替
```

**7. 除 ÷：查询选修了全部课程的学生**
```sql
π Sno,Cno(SC) ÷ π Cno(Course)
SELECT Sno FROM Student
WHERE NOT EXISTS (
    SELECT * FROM Course
    WHERE NOT EXISTS (
        SELECT * FROM SC
        WHERE SC.Sno = Student.Sno AND SC.Cno = Course.Cno
    )
);
```
记法：**“全部/所有/至少” → 除 → 双重 NOT EXISTS**。

**8. 交 ∩：既选了81001又选了81002的学生**
```sql
π Sno(σ Cno='81001'(SC)) ∩ π Sno(σ Cno='81002'(SC))
-- MySQL 没有 INTERSECT，用 IN 或自连接代替
SELECT Sno FROM SC WHERE Cno='81001'
AND Sno IN (SELECT Sno FROM SC WHERE Cno='81002');
```

## 要点

- **σ 对 WHERE，π 对 SELECT**，永远先 σ 后 π（先选行再选列）。
- MySQL 的短板：没有 `INTERSECT`、`EXCEPT`、`FULL OUTER JOIN`，分别用 `IN`、`NOT IN`、`LEFT JOIN UNION RIGHT JOIN` 代替。
- 看到代数式里有 **÷**，立刻翻译成双重 `NOT EXISTS`，这是必考题。
- 除法口诀：「R ÷ S 的结果 = 在 R 中，与 S 的**全部**元组都搭配过的那些值」。
