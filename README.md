# UpUpload.js

`vue + koa` 实现文件上传

- 进度条
- 拖拽
- 图片格式校验
- 大文件切片
- 秒传 + 断点续传
- 并发控制
- 失败重试 + 错误控制

### 使用

```shell
# 克隆项目
git clone git@github.com:iamhmx/UpUpload.git

# 进入目录
cd upupload

# 安装前端依赖
yarn

# 安装服务端依赖
cd server
yarn

# 进入跟目录，启动前端
yarn dev

# 启动后端服务
# 安装了nodemon（推荐）
yarn start
# 未安装nodemon
yarn start_node
```

### 效果

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-eewtwzjb1bxvad91bd/11586f60-2a0a-11eb-b997-9918a5dda011.gif" style="width: 100%">
