---
title: Java基本数据类型演示草稿
date: 2026-10-06
tags: [Java]
summary: Java几本数据类型
---
```java
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
```
