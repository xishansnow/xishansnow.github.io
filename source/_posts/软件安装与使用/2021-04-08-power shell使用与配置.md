---
layout:     post
title:      " Power Shell的使用与配置 "
date:       2021-04-08 12:00:00
author:     "西山晴雪"
categories: 
	- [软件安装与使用, PowerShell]
tags:
    - 软件安装与使用
    - powershell
    - scoop
    - proxy 代理
---

# Power Shell的使用与配置

​	Windows下终于有可用的shell了。Power Shell自5.0版本之后，可用性越来越高，对于经常使用windowns的人来说，是一大福音。

## 1. Power Shell的安装

见power shell的github主页，可以下载安装各种稳定版和预览版

https://github.com/PowerShell/PowerShell

## 2. Windows Terminal的安装

Windows Terminal好用了很多，支持多种配置文件和界面配置，一经发布得到很多人的喜欢，尤其是配合wsl、power shell等效果非常好。可以通过微软商店来安装，也可以到其github主页下载安装

https://github.com/microsoft/terminal/

## 3. Power Shell 的常用配置

### （1）传输安全控制协议

- 问题：

  新版PowerShell改变了传输安全策略，导致在power shell中访问网络资源总是报SSL无法连接的错误

- 解决办法：

  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

### （2）代理设置

- 问题：
  - 很多同学希望在Power Shell中直接设置代理服务器，以访问墙外资源，但却不知道如何设置
- 解决办法：
  - HTTP代理：$env:HTTP_PROXY="http://代理服务器IP:端口号"
  - HTTP代理：$env:HTTPS_PROXY="https://代理服务器IP:端口号"
  - HTTP代理：$env:ALL_PROXY="socks5://代理服务器IP:端口号"
  - 删除代理：上述环境变量等号右侧设置为空字符串""

### (3)安装命令行安装工具 scoop

- 问题：

  - 熟悉linux的同学对apt等命令行软件安装工具应该不陌生，windows下近年也出现了类似的工具，最出名的是scoop和choco，本人习惯于scoop。

- 解决办法：

  - scoop的安装：

    ```
    （1）设置安全策略
    Set-ExecutionPolicy RemoteSigned -scope CurrentUser
    （2）下载安装脚本并安装
    Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
    或
    iwr -useb get.scoop.sh | iex
    ```

  - scoop的使用
  
    - 增加仓库：scoop bucket add 仓库名（可用scoop bucket known查看知名的仓库）
    - 查询软件：scoop search 软件名
    - 安装软件：scoop install 软件名
    - 卸载软件：scoop uninstall 软件名
  
  - 注意：scoop及其安装的软件默认在"~/scoop"目录下。