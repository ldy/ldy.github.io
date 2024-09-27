---
layout: post
title: Oracle Sqlplus和Sqlldr工具安装
subtitle: 'Oracle客户端工具Sqlplus和Sqlldr'
date: 2019-10-12
author: 丶德灬锅
tags: Oracle Sqlplus Sqlldr
---

# Oracle Sqlplus和Sqlldr工具安装

## 前言

> 在生产的机器安装了Oracle数据库，本地机器有时候需要用到Sqlplus命令连接数据库，Sqlldr命令批量导入数据，以及exp/imp、expdp/impdp等导入导出命令，Oracle支持只安装这些客户端工具，不用下载整个Oracle安装包。

## 下载

[点击进入官网下载页面](https://www.oracle.com/database/technologies/instant-client/downloads.html)，选择对应系统客户端。

![image-20240927162639940](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-10-12-Oracle%20Sqlplus%E5%92%8CSqlldr%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85-image-20240927162639940.png)

需要下载Basic Package、SQL*Plus Package、Tools Package几个文件。

![image-20240927162756017](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-10-12-Oracle%20Sqlplus%E5%92%8CSqlldr%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85-image-20240927162756017.png)

将这几个文件解压成一个文件夹，可以看到instantclient文件夹中有Sqlplus.exe、Sqlldr.exe等。

![66f2a6a72015371f3e424964df4552a8](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-10-12-Oracle%20Sqlplus%E5%92%8CSqlldr%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85-66f2a6a72015371f3e424964df4552a8.png)

![image-20240927163426776](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-10-12-Oracle%20Sqlplus%E5%92%8CSqlldr%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85-image-20240927163426776.png)

## 配置环境变量

```
# 编码
NLS_LANG
SIMPLIFIED CHINESE_CHINA.ZHS16GBK
# Cmd直接执行
PATH
D:\Soft\instantclient_23_5
```

![image-20240927165829914](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-10-12-Oracle%20Sqlplus%E5%92%8CSqlldr%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85-image-20240927165829914.png)

## 测试

在Cmd命令行执行Sqlldr测试命令是否可用。

![image-20240927170018441](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-10-12-Oracle%20Sqlplus%E5%92%8CSqlldr%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85-image-20240927170018441.png)

在Cmd测试Sqlplu命令是否可用，`sqlplus username/password@hostname:port/service_name`。

![image-20240927170229285](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-10-12-Oracle%20Sqlplus%E5%92%8CSqlldr%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85-image-20240927170229285.png)