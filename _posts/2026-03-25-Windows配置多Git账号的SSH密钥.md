---
layout: post
title: Windows配置多Git账号的SSH密钥
subtitle: '一台机器配置多个SSH密钥登录不同Git仓库平台'
date: 2026-03-25
author: 丶德灬锅
tags: Git SSH密钥
---

# Windows配置多Git账号的SSH密钥

## 前言

> 在Windows日常开发中，我们可能需要同时维护个人项目和工作项目，访问GitHub、私有化GitLab等多个平台，这时需要使用多个Git用户信息（用户名、邮箱）和SSH密钥进行提交与推送，下面介绍如何通过简单的配置，实现一套系统内多Git账号SSH密钥的生成、管理与无缝切换。

## 生成SSH密钥对

打开`Git Bash`，使用 `ssh-keygen` 命令生成密钥。注意`-t`参数是指定加密方式，可选参数；`-C` 参数是注释，可选参数，通常用邮箱，会拼接到公钥最后；`-f`参数指定了密钥文件的名称，可选参数，默认在当前目录下生成`id_rsa`文件，需要将该文件生成到`%HOMEPATH%\.ssh`目录下，`Git Bash`中用`~/.ssh/`替代。

```bash
# 为账号user1生成密钥
ssh-keygen -t ed25519 -C "ldy@gitee.com" -f ~/.ssh/id_ed25519_gitee

# 为账号user2生成密钥
ssh-keygen -C "ldy@bd.com" -f ~/.ssh/id_ed25519_gitlab
```

执行命令后，系统会提示是否配置私钥密码，可以为私钥设置一个密码增加安全性，后续可通过`ssh-agent`代理管理密码避免每次输入。

![image-20260325144952308](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2026-03-25-Windows%E9%85%8D%E7%BD%AE%E5%A4%9AGit%E8%B4%A6%E5%8F%B7%E7%9A%84SSH%E5%AF%86%E9%92%A5-image-20260325144952308.png)

## 配置SSH客户端

`SSH`协议允许客户端通过`~/.ssh/config`配置文件，为不同的服务器或别名指定不同的认证密钥，通过为每个Git账号创建独立的密钥对，并在配置文件中建立“主机别名”到“密钥文件”的映射。

```shell
# 公司账号配置
Host 10.122.10.214
    HostName 10.122.10.214
    User git
    IdentityFile "C:\Users\admin\.ssh\id_rsa_gitee"

# 个人账号配置
Host gitee.com
    HostName gitee.com
    User git
    # 密钥文件也可以使用相同的
    IdentityFile "C:\Users\admin\.ssh\id_rsa_gitee"

# Host：与HostName保持一致最好别改，定义一个新的连接别名，后续的Git操作必须使用此别名替代原始的git@gitee.com，比如设置别名为gitee后，git@gitee.com:lideyu/tvsource.git必须替换为git@gitee:lideyu/tvsource.git，否则会提示没有权限
# HostName：指定真实的Git服务器地址
# User：连接用户名，对于Git服务用户名固定为git
# IdentityFile：关键项，指向该账号对应的私钥文件的绝对路径
```

## 配置Git平台

登录到Git服务器平台，将公钥内容拷贝到`SSH Keys`配置处即可。

![image-20260325162815756](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2026-03-25-Windows%E9%85%8D%E7%BD%AE%E5%A4%9AGit%E8%B4%A6%E5%8F%B7%E7%9A%84SSH%E5%AF%86%E9%92%A5-image-20260325162815756.png)

## 测试配置

通过```ssh -T git@gitee.com```命令测试连接情况，如下显示则成功。

![image-20260326085843094](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2026-03-25-Windows%E9%85%8D%E7%BD%AE%E5%A4%9AGit%E8%B4%A6%E5%8F%B7%E7%9A%84SSH%E5%AF%86%E9%92%A5-image-20260326085843094.png)

如果`Host`别名设置与域名不一致比如为`gitee`，则可能会出现连接失败的情况，需要通过别名连接。

![image-20260326090032295](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2026-03-25-Windows%E9%85%8D%E7%BD%AE%E5%A4%9AGit%E8%B4%A6%E5%8F%B7%E7%9A%84SSH%E5%AF%86%E9%92%A5-image-20260326090032295.png)

![image-20260326090046631](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2026-03-25-Windows%E9%85%8D%E7%BD%AE%E5%A4%9AGit%E8%B4%A6%E5%8F%B7%E7%9A%84SSH%E5%AF%86%E9%92%A5-image-20260326090046631.png)

通过`ssh -T git@gitee.com -vvv`命令可以看出，默认会查找配置文件的别名，如果查找不到再去`~/.ssh/`目录下找各种加密方式默认生成的密钥文件，比如`id_rsa`文件。

![image-20260326090246312](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2026-03-25-Windows%E9%85%8D%E7%BD%AE%E5%A4%9AGit%E8%B4%A6%E5%8F%B7%E7%9A%84SSH%E5%AF%86%E9%92%A5-image-20260326090246312.png)

![image-20260326090326358](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2026-03-25-Windows%E9%85%8D%E7%BD%AE%E5%A4%9AGit%E8%B4%A6%E5%8F%B7%E7%9A%84SSH%E5%AF%86%E9%92%A5-image-20260326090326358.png)

## 配置不同提交作者

Git 提供了三个配置级别：

| 级别 | 范围       | 文件位置                                | 优先级 |
| ---- | ---------- | --------------------------------------- | ------ |
| 本地 | 当前存储库 | `.git/config`                           | 最高   |
| 全局 | 当前用户   | `~/.gitconfig`、`%HOMEPATH%\.gitconfig` | 中等   |
| 系统 | 所有用户   | `/etc/gitconfig`                        | 最低   |

```shell
# 查看全局配置
git config --global -l

# 取消全局配置
git config --global --unset user.name 
git config --global --unset user.email

# 设置全局默认的用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "Your-email@example.com"


# 在项目目录下执行，为此项目单独设置用户名和邮箱，它会创建或修改项目内的.git/config文件
git config user.name "Your Name"
git config user.email "Your-email@example.com"

# 删除项目配置
git config --unset user.name
git config --unset user.email
```

## 总结

- `git config user.name/email`：决定了谁提交了代码（作者信息）。
- `~/.ssh/config` ：决定了你以什么身份推送到远程仓库（认证信息）。