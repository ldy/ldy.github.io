---
layout: post
title: Linux密钥登录另一台Linux
subtitle: 'SSH协议实现远程登录、数据传输'
date: 2019-09-16
author: 丶德灬锅
tags: Linux SSH 密钥
---

# Linux密钥登录另一台Linux

## 前言

> SSH登录支持两种认证方式：口令（密码）认证方式和密钥认证方式。口令认证方式是最常用的一种，这里介绍密钥认证方式如何登录到Linux/Unix系统。

## SSH密码登录Linux

可以省略端口号，若没有指定用户名，SSH客户端会尝试使用当前用户的用户名进行登录，需要确保远程服务器上存在一个和本地用户名相同的用户。

```shell
# 端口默认22，回车后输入root用户密码即可
ssh -p 22 root@10.122.10.218
```

## SSH密钥登录Linux

### ssh-keygen生成密钥

通过`ssh-keygen`生成一对私钥和公钥，密钥默认放在用户的家目录`~/.ssh`下，可设置私钥密码。

```shell
[root@Kjb-Git-Runner-01 home]# ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:rsKjGYzUwK6wlEFHKzAkSS9X3UiyXFncevM6XAPhm9M root@Kjb-Git-Runner-01
The key's randomart image is:
+---[RSA 2048]----+
|*=.o ooo*..      |
|*.o + ++ o o     |
| * + o    o .    |
|. O      . =     |
|.= .    S . B    |
|=+     .   + E   |
|+ o.    . . + .  |
|   o+  .   +     |
|  o. o.     .    |
+----[SHA256]-----+
[root@Kjb-Git-Runner-01 home]# ls ~/.ssh
id_rsa  id_rsa.pub  known_hosts
```

### 复制公钥到Linux服务器

通过`ssh-copy-id -i ~/.ssh/id_rsa.pub Shenma@10.122.10.218`命令，将公钥文件复制到远程服务器。

```shell
[root@Kjb-Git-Runner-01 home]# ssh-copy-id -i ~/.ssh/id_rsa.pub Shenma@10.122.10.218
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
Shenma@10.122.10.218's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'Shenma@10.122.10.218'"
and check to make sure that only the key(s) you wanted were added.
```

![image-20240924103739436](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-09-16-Linux%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95%E5%8F%A6%E4%B8%80%E5%8F%B0Linux-image-20240924103739436.png)

### 验证SSH密钥登录

![image-20240924103906340](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-09-16-Linux%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95%E5%8F%A6%E4%B8%80%E5%8F%B0Linux-image-20240924103906340.png)

### 配置SSH快捷登录

`vim /etc/hosts`修改hosts文件，设置ip的别名`10.122.10.218 Kjb-Nginx`，通过`ssh Shenma@Kjb-Nignx`进行登录。

![image-20240924105702558](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-09-16-Linux%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95%E5%8F%A6%E4%B8%80%E5%8F%B0Linux-image-20240924105702558.png)

![image-20240924105720806](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2019-09-16-Linux%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95%E5%8F%A6%E4%B8%80%E5%8F%B0Linux-image-20240924105720806.png)

## SSH黑白名单

### 系统级别

修改白名单`/etc/hosts.allow`或者黑名单`/etc/hosts.deny`系统文件。

```shell
# 编辑白名单
vim /etc/hosts.allow

# 新增配置
sshd:192.168.92.133:allow  # 允许192.168.0.1这个IP地址ssh登录
sshd:192.168.92.0/24:allow # 允许192.168.92.0/24这段IP地址的用户登录
sshd:ALL # 允许全部的ip通过ssh登录 

# 编辑黑名单
vim /etc/hosts.deny

# 新增配置
sshd:192.168.92.135:deny # 拒绝135这个IP地址通过ssh登录
sshd:all:deny    # 拒绝所欲sshd远程连接

# 重启服务
systemctl restart sshd
```

### SSH配置

修改`/etc/ssh/sshd_config`配置文件，添加`DenyUsers user`或者 `AllowUsers user`。

```shell
# 编辑
vim /etc/ssh/sshd_config

# 白名单
# AllowUsers <用户名1> <用户名2> <用户名3> ...
# 指定允许通过远程访问的用户，多个用户以空格隔开
# AllowGroups <组名1> <组名2> <组名3> ...
# 指定允许通过远程访问的组，多个组以空格隔开

# 允许所有的主机访问我的lisi用户，只允许192.168.91.101上的所有用户访问本机的zhangsan用户，默认拒绝所有
AllowUsers zhangsan@192.168.91.101  lisi

# 黑名单
# DenyUsers <用户名1> <用户名2> <用户名3> ...
# 指定禁止通过远程访问的用户，多个用户以空格隔开
# DenyGroups <组名1> <组名2> <组名3> ...
# 指定禁止通过远程访问的组，多个组以空格隔开
#拒绝liwu被访问
DenyUsers  liwu
```

## Linux关闭口令登录

[参考](https://blog.lideyu.com/2019/08/04/Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux.html#linux%E5%85%B3%E9%97%AD%E5%8F%A3%E4%BB%A4%E7%99%BB%E5%BD%95)

## Linux普通用户添加sudo权限

[参考](https://blog.lideyu.com/2019/08/04/Xshell%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95Linux.html#linux%E6%99%AE%E9%80%9A%E7%94%A8%E6%88%B7%E6%B7%BB%E5%8A%A0sudo%E6%9D%83%E9%99%90)