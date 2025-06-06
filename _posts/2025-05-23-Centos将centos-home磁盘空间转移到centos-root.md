---
layout: post
title: Centos将centos-home磁盘空间转移到centos-root
subtitle: '磁盘空间分配不合理，需要将centos-home磁盘空间转移到centos-root'
date: 2025-05-23
author: 丶德灬锅
tags: Centos 磁盘
---

# Centos将centos-home磁盘空间转移到centos-root

## 前言

> 安装Linux系统时，磁盘空间分配不合理，/dev/mapper/centos-home目录下磁盘空间过多，而/dev/mapper/centos-root目录下磁盘空间不足的时候，可以考虑将部分/dev/mapper/centos-home磁盘空间转移到/dev/mapper/centos-root。

## 查看存储

通过`df -h`查看当前磁盘空间。

![image-20250606093646693](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-05-23-Centos%E5%B0%86centos-home%E7%A3%81%E7%9B%98%E7%A9%BA%E9%97%B4%E8%BD%AC%E7%A7%BB%E5%88%B0centos-root-image-20250606093646693.png)

## 备份Home目录

通过`tar cvf /tmp/home.tar /home`命令备份Home目录。

## 扩容到centos-root

```shell
umount /home
# 若umount卸载时，发现/home在使用中，则执行此命令先终止再执行umount /home命令
fuser -km /home/

# fuser命令需要安装psmisc包
# yum install -y psmisc

# 查看占用进程
# fuser -mu /home

# 终止进程，将 <PID> 替换为实际的进程 ID
# kill -9 <PID>

# 删除/home所在的lv
lvremove /dev/mapper/centos-home

# 扩展/root所在的lv
lvextend -L +15G /dev/mapper/centos-root

# 扩展/root文件系统
xfs_growfs /dev/mapper/centos-root

# 重新创建home lv （创建时计算好剩余的磁盘容量，建议比剩余小1G左右，空间设置较大时会报错，如果需要设置精准的磁盘容量大小可以通过vgdisplay -v命令查询）
lvcreate -L 10G -n /dev/mapper/centos-home

# 创建home文件系统
mkfs.xfs /dev/mapper/centos-home

# 挂载home
mount /dev/mapper/centos-home
```

## 恢复Home目录

通过`tar xvf /tmp/home.tar -C /home/`命令备份Home目录。