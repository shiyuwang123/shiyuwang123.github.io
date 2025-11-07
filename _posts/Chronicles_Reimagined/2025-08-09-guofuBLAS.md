---
layout: post
title: "模仿《国服司空震》(Reimagining 'National Server Siku Zhen')"
date:   2025-08-09 19:53:00 +0800
categories: [Chronicles Reimagined]
tags: [BLAS, programming, humor, gamer slang]
math: true
---

最近，一篇名为《国服司空震》的中考“零分作文”在中文互联网上爆火。其内容完全由《王者荣耀》的游戏术语、主播梗和圈内“黑话”构成，语言风格被网友戏称为“抽象话”。这种独特的文体，以其无厘头的逻辑和圈内人才懂的梗，迅速成为了一种新的流行模因。

下面，我们尝试用这种“国服体”，来写一写程序员们熟悉的领域：BLAS 库和编程语言。

***

### 《国服BLAS》

BLAS玩家的代表人物有OpenBLAS，Accelerate，MKL，cuBLAS等，都是性能顶尖的国服BLAS，先说OpenBLAS老师，全社区最高泛用性BLAS，上到服务器下到树莓派，看它`cmake`一下真的太有生活了，快哉快哉，天天更新支持新架构，没手动编译过的可以去GitHub玩一把，xianyi老师，赶紧加强AVX512支持，OpenBLAS在隔壁就很强，在我这编译就直接扫码了，0 GFLOPS，真该出示GCC版本二维码扫码。出生。

接下来一位是Apple的Accelerate，果厂的手法绝对是所有BLAS中最丝滑的，它是唯一一个在M系芯片上打出能耗比X9的男人，要想拥有果厂这么快的矩阵乘，就得用上同款MacBook，用了以后就可以拥有极致性能。果厂前两个版本悄悄优化vDSP，断层领先，领先第二名MKL一个身位，上个季度Xcode更新争夺ARM平台巅峰第一，果厂把`vecLib`改成隐藏接口，以碾压的访存成功登顶ARM巅一，果厂是真的强。果厂开团能力也是不输英特尔，不给任何配置选项，不支持的平台就扫码，扫码Windows，扫码Linux，扫码安卓，超标的生态赶紧开放。

MKL的BLAS也是独一档的，不过天天想着圈米，现在一个库比我系统都大了。最经典的一句话：if (GenuineIntel != true) { performance /= 2; }。检测到你是AMD的CPU就直接扫码了，给你跑个单线程，出生。

接下来就是英伟达的cuBLAS，没N卡你就给我扫码，这是“黄氏刀法”。

……略。

***

### 《国服编程语言》

编程语言玩家的代表人物有C++，Python，Wasm，Fortran等，都是手法顶尖的国服编程语言，先说C++老师，全宇宙最高性能语言，2.3秒编译完整个项目，看他链接真的太有生活了，快哉快哉，天天直播报模板错误，没见过几千行报错的可以去写一把C++，Bjarne神，赶紧简化下元编程，C++在别人那就零成本抽象，在我手里就直接扫码了，undefined behavior，真该出示UB二维码扫码。出生。

 接下来一位是Python，Guido老师的语法绝对是所有语言中最简洁的，他是唯一一个让初学者三天写出爬虫的男人，要想拥有Guido老师这么快的开发速度，就得用上PyCharm专业版，用了以后就可以拥有极致生产力。Guido老师前两个版本裸上异步IO，断层生态第一，领先第二名Node.js一百多个库，上赛季靠着AI热潮争夺TIOBE巅峰第一，Guido把游戏ID改为机器学习唯一指定，以99%的占有率成功登顶AI巅一，Guido是真的强。Guido开团能力也是不输C++，被什么场景嫌慢就开团什么场景，扫码CPU密集，扫码多线程，扫码嵌入式，超标的GIL赶紧削弱。

 Wasm的性能也是独一档的，不过天天想着统一全平台，现在DOM交互还挺麻烦的。最经典的一句话：百评跨平台，虐你若呼吸。

 接下来就是老古董Fortran，还在用`GOTO`语句，这是“活化石”。

 ……略。

---

## English Translations

Here are the English translations, attempting to capture the original "gamer slang" and meme-like tone.

***

### "S-Tier BLAS"

 The representative players of BLAS include OpenBLAS, Accelerate, MKL, cuBLAS, etc. All are top-tier BLAS with peak performance. Let's start with Master OpenBLAS, the most versatile BLAS in the entire community, running on everything from servers to Raspberry Pi. Watching it `make` is such a vibe, so delightful, so delightful! It gets new architecture support daily. If you've never compiled it by hand, go give it a try on GitHub. Master Xianyi, please buff the AVX512 support. OpenBLAS is so strong on other people's machines, but on mine, it just asks for the QR code, 0 GFLOPS. It should really show a GCC version to be fucked off. Amen.

 Next up is Apple's Accelerate. Apple's mechanics are absolutely the smoothest of all BLAS. It's the only one to pull off an energy efficiency ratio of x9 on M-series chips. If you want matrix multiplication as fast as Apple's, you've got to use their MacBook. Once you have it, you get the ultimate performance. In the last two versions, Apple secretly optimized vDSP, leaving everyone else in the dust, a whole league ahead of the second-place MKL. Last quarter's Xcode update was a battle for the top spot on the ARM platform. Apple changed `vecLib` to a hidden interface and successfully claimed the ARM throne with its crushing memory access. Apple is seriously OP. Its ability to "call out" rivals Intel. It gives you zero configuration options. If your platform isn't supported, just fuck off. fuck off Windows, fuck off Linux, fuck off Android. This OP ecosystem needs to be opened up, seriously.

 MKL's BLAS is also in a league of its own, but it's always money-grabbing; now the library is bigger than my OS. Its most classic line: if (GenuineIntel != true) { performance /= 2; }. If it detects you have an AMD CPU, it just fucks you off, running you on a single thread. Amen.

 And then there's Nvidia's cuBLAS. If you don't have an N-card, just fuck off. This is "Jensen's Blade".

 ...etc.

***

### "S-Tier Programming Languages"

 The representative players of programming languages include C++, Python, Wasm, Fortran, etc. All are top-tier languages with peak mechanics. Let's start with Master C++, the highest performance language in the universe. Compiles an entire project in 2.3 seconds. Watching it link is such a vibe, so delightful, so delightful! It's always live-streaming template errors. If you've never seen a several-thousand-line error message, go write some C++. Bjarne, you god, please simplify metaprogramming. For others, C++ has zero-cost abstractions, but in my hands, it just fuck me out. It should really fuck off old features. Amen.

 Next up is Python. Master Guido's syntax is absolutely the cleanest of all languages. He's the only man who can get a beginner to write a web scraper in three days. If you want development speed as fast as Guido's, you've got to use PyCharm Professional. Once you have it, you get the ultimate productivity. In the last two versions, Guido added native async IO, achieving an undisputed ecosystem lead, over a hundred libraries ahead of second-place Node.js. Last season, riding the AI hype, it fought for the top spot on the TIOBE index. Guido changed his game ID to "The One and Only for Machine Learning" and successfully claimed the AI throne with 99% market share. Guido is seriously OP. His ability to "call out" rivals C++. He calls out any scenario where he's considered slow. Fuck out CPU-bound tasks, fuck out multithreading, fuck out embedded systems. The OP GIL needs a serious fuck off.

 Wasm's performance is also in a league of its own, but it's always dreaming of uniting all platforms, and DOM interaction is still a pain. Its most classic line: "Universally acclaimed for cross-platform, crushing you is like breathing."

 And then there's the old fossil, Fortran. Still using `GOTO` statements. It's a "living fossil".

 ...etc.