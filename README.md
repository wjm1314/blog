# blog_vue_express_mongodb

> Vue.js+Node.js+Mongodb+Express的前后端分离的个人博客

> 参考地址：https://github.com/FatDong1/VueBlog.git


## 主要技术构成
前端主要技术栈为：vue.js、vuex、axios、vue-router

后端主要技术栈为：node.js、express

数据库：MongoDB

## 博客功能
### 前台页面
- 文章目录
- 搜索文章
- 文章分类显示
- 留言（尚未完成）
### 后台管理页面
- 发布文章
- 存为草稿
- 搜索文章
- 修改账户
- markdown编辑器


## 安装
安装依赖
```
npm install
```
启动mongodb数据库
```
mongod --dbpath d:/data  // d:/data 为数据库文件夹位置，可自行设置
```
连接MongoDB
```
mongo
```
运行服务器
```
npm run start
```
在8080端口运行项目
```
npm run dev
```
### 注意
- 账户： wjm        密码： 123456

### 下一步要做的事：
- 页面重新布局
- 登录验证
- 权限验证
- mongodb数据库封装进一步优化
- 页面之间跳转的连续性
- 评论模块的优化
