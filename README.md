<p align="center">
	<img alt="logo" src="./doc/logo.png">
</p>
<h1 align="center" style="margin: 10px 0 30px; font-weight: bold;">wl-admin</h1>
<h4 align="center">基于SpringBoot3、Vue3开发的轻量级后台管理框架</h4>
<p align="center">
	<!--<a href="https://gitee.com/gltqe/wl-admin/stargazers"><img src="https://gitee.com/gltqe/wl-admin/badge/star.svg?theme=gvp"></a>-->
	<a href="https://gitee.com/gltqe/wl-admin"><img src="https://img.shields.io/badge/version-v1.0.0-brightgreen.svg"></a>
	<a href="https://gitee.com/gltqe/wl-admin/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
</p>

## 项目介绍

这里是`wl-admin`的前端代码仓库， 它是基于vue3、element-plus开发的。
* 后端代码：[Gitee](https://gitee.com/gltqe/wl-admin) | [Github](https://github.com/gltqe/wl-admin)
* 前端主要参考了[RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue)项目，在此特别感谢
* 请使用较新版本的`nodejs`运行，推荐18以上
* 管理员：admin/123


## 在线文档
[wl-admin](https://gltqe.github.io/wl-admin-doc/)

## 演示地址
[还没部署]()

## 运行发布

### 下载安装
```shell
# 克隆到本地
git clone https://gitee.com/gltqe/wl-admin-ui.git
```

### 安装

```shell
# 进入wl-admin-ui
cd wl-admin-ui

# 安装
npm install
```

### 运行
```shell
npm run dev
```
### 打包

```shell
# 打包放到nginx
npm run build

# 打包放到springboot中（需要修改后端代码，请参考在线文档）
npm run build:spring

```


## 功能模块

### 系统管理

* 用户管理：系统用户基本信息的增删改查，修改密码等
* 菜单管理：控制左侧菜单栏和按钮的增删改查，可无限嵌套
* 部门管理：机构或部门的组织结构
* 角色管理：功能权限与数据权限，都通过角色与用户关联
* 职位管理：用户职位
* 参数配置：配置系统参数，例如：是否启用验证码
* 字典配置：维护固定参数值
* 接口限制：用于配置接口访问次数，针对每个接口分为单用户和全部用户限制，基于`redis`+`lua`

### 系统监控

* 定时任务：基于`Quartz`的定时任务模块
* 服务监控：监控内存，CPU，服务器信息
* 操作日志：通过自定义日志注解，记录操作
* 登录日志：记录登录用户信息
* 在线用户：查看当前在线用户

## 页面展示
![用户管理](./doc/用户管理.png)
![菜单管理](./doc/菜单管理.png)
![部门管理](./doc/部门管理.png)
![角色管理](./doc/角色管理.png)
![参数配置](./doc/参数配置.png)
![字典配置](./doc/字典配置.png)
![接口限流](./doc/接口限流.png)
![定时任务](./doc/定时任务.png)
![登录日志](./doc/登录日志.png)
![在线用户](./doc/在线用户.png)

## 交流反馈

