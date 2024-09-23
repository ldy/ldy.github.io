---
layout: post
title: Xshell密钥登录Linux
subtitle: '密钥认证方式登录到Linux/Unix'
date: 2019-08-04
author: 丶德灬锅
tags: Xshell SSH 密钥
---

# Xshell密钥登录Linux

## 前言

> SSH登录支持两种认证方式：口令（密码）认证方式和密钥认证方式。口令认证方式是最常用的一种，这里介绍密钥认证方式如何登录到Linux/Unix系统。

## 生成密钥

密钥包含公钥和私钥，是成对的。通过Xshell的`新建用户密钥生成向导`菜单，生成密钥，默认密钥类型和长度即可。

![image-20240920174502439](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240920174502439.png)

![image-20240920174958757](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240920174958757.png)

用户密钥信息，可以修改密钥名称，同时可以给密钥设置密码进行加密。

![image-20240920175532272](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240920175532272.png)

打开`用户密钥管理者`，点击`属性`可以导出公钥，点击`导出`可以导出私钥。

![image-20240923090112647](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240923090112647.png)

![image-20240923090232704](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240923090232704.png)

## Linux添加公钥

通过口令方式登录服务器，`cd ~`进入用户目录下，`mkdir .ssh`新建文件夹,`chmod -R 700 .ssh`确保只有所有者可读可写否则无法登录，或者在`.ssh`目录下执行`chmod 600 *`。

![image-20240923102411204](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240923102411204.png)

运行`rz`命令（通过`yum install lrzsz`安装），将`key.pub`发送到服务器，然后运行`cat id_rsa_2048_lideyu.pub >> authorized_keys`命令，将公钥（Public Key）导入到`authorized_keys`文件。

![image-20240923100550821](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240923100550821.png)

通过`vim authorized_keys`给密钥添加备注。

![image-20240923102956101](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240923102956101.png)

## Xshell配置密钥认证方式登录

新建会话，输入Ip地址。

![image-20240923095314627](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240923095314627.png)

切换到用户身份验证，方法选择`Public Key`，用户名选择上一步在哪个用户的`.ssh`文件添加的公钥，用户密钥选择第一步创建的私钥，如果私钥有设置密码，还需要输入私钥密码，最后点击连接即可。

![image-20240923095453013](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-08-04-Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux-image-20240923095453013.png)

## Linux关闭口令登录

```shell
# 打开配置文件
vim  /etc/ssh/sshd_config

# 关闭密码登录
PasswordAuthentication no

# 重启ssh
systemctl restart sshd
```

## Linux普通用户添加sudo权限

```shell
# 当前用户添加写权限
chmod u+w /etc/sudoers

# 修改配置文件
vim /etc/sudoers

# 添加内容，区分是否需要密码
Shenma  ALL=(ALL)       ALL
Kjb    ALL=(ALL)       NOPASSWD: ALL
```