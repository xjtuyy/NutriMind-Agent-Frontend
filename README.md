# NutriMind Agent 前端

当前版本只接入后端文档中已经实现的认证和知识库接口。

## 启动

```powershell
npm install
npm run dev
```

开发服务器运行在 `http://localhost:3000`，默认将 `/api` 代理到 `http://localhost:9999`。如果后端地址不同，复制 `.env.example` 为 `.env` 后修改 `VITE_API_TARGET`。

## 已实现功能

- 用户注册、登录、登录状态恢复、退出登录
- 查看当前用户资料
- 上传知识库文档（PDF、Markdown、TXT、TEXT）
- 语义检索、按来源删除文档、知识库统计

Agent 对话、目标检测、模型训练、摄像头和数据看板将在后端接口完成后接入。
