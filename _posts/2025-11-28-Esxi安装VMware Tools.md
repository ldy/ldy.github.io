---
layout: post
title: Esxi安装VMware Tools
subtitle: 'Esxi上给虚拟机安装VMware Tools'
date: 2025-11-28
author: 丶德灬锅
tags: Esxi VMware Tools
---

# Esxi安装VMware Tools

> Esxi宿主机上查看已经安装好的虚拟机，一直提示未安装VMware Tools，直接点击安装不会生效，正常安装好之后，Esxi上是可以看到Ip和主机名等信息。

## Linux安装

### 挂载方式安装

使用`blkid`命令识别存储设备的文件系统类型，此时还看不到`VMware Tools`，根据提示点击安装`VMware Tools`，再次使用`blkid`命令可以看到`VMware Tools`。

![image-20251202170612836](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251202170612836.png)

![image-20251202171642025](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251202171642025.png)

创建目录并挂载`cdrom`，可以在`/mnt/cdrom/`目录即可看到一个`VMwareTools-10.3.25-20206839.tar.gz`的包。

```shell
mkdir /mnt/cdrom
mount -t iso9660 /dev/cdrom /mnt/cdrom/
```

![image-20251202172329783](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251202172329783.png)

![image-20251202172410210](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251202172410210.png)

无法在该目录直接解压会报错，需要先拷贝到其他目录后再解压并安装。

```shell
cp /mnt/cdrom/VMwareTools-10.3.25-20206839.tar.gz /home/app
cd /home/app
tar -zxvf VMwareTools-10.3.25-20206839.tar.gz
cd vmware-tools-distrib/
./vmware-install.pl
```

第一次输入`yes`开始安装，后面的步骤一路回车默认即可。

![image-20251202172848930](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251202172848930.png)

安装完成之后，Esxi控制台会更新`VMware Tools`安装状态，隔10多秒点刷新，主机名称和IP地址也会显示出来。

![image-20251202173111207](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251202173111207.png)

### Yum方式安装

```shell
# 安装
yum install open-vm-tools
# 启动
systemctl start vmtoolsd
```

简单粗暴，直接`yum`命令进行安装，安装之后需要手工启动，之后Esxi控制台会显示主机名称和IP地址。

## Windows安装

点击安装`VMware Tools`，进入到虚拟机，找到`DVD VMware Tools` 驱动器，双击后会自动打开软件安装程序，默认下一步即可，最后会提示重启应用程序，不重启隔一会主机名称和IP地址也会显示出来。

![image-20251202173733917](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251202173733917.png)

![image-20251203110259870](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251203110259870.png)

![image-20251203110530218](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251203110530218.png)

![image-20251203110651223](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251203110651223.png)

![image-20251203110802079](https://cdn.jsdelivr.net/gh/ldy/ldy.github.io@master/screenshot/2025-11-28-Esxi%E5%AE%89%E8%A3%85VMware%20Tools-image-20251203110802079.png)