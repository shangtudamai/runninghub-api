# Home.tsx + RunningHub API 集成指南

## 🎉 已完成的集成

你的 `Home.tsx` 已经成功集成了 RunningHub API！

## 📁 文件结构

```
runninghub-test/
├── Home.tsx              # ✅ 前端React组件（已修改）
├── server.js             # ✅ 后端API服务器（新创建）
├── runninghub-client.js  # ✅ RunningHub客户端库
├── .env                  # ✅ 环境变量配置
└── package.json          # ✅ 已添加server脚本
```

## 🚀 如何使用

### 步骤1：启动RunningHub API服务器

打开一个终端窗口，运行：

```bash
npm run server
```

或者：

```bash
node server.js
```

你会看到：
```
==================================================
🚀 RunningHub API 服务器已启动
==================================================
📍 地址: http://localhost:3001

📌 可用端点:
   POST http://localhost:3001/api/restore
   GET  http://localhost:3001/api/balance
   GET  http://localhost:3001/api/health
==================================================
```

**⚠️ 重要：保持这个窗口运行，不要关闭！**

---

### 步骤2：启动你的前端应用（扣子空间）

在扣子空间中，确保你的React应用已经使用了更新后的 `Home.tsx`。

前端会自动：
1. ✅ 连接到 `http://localhost:3001`
2. ✅ 显示账户余额
3. ✅ 上传图片并调用RunningHub API
4. ✅ 显示修复后的图片和任务信息

---

## 🎯 功能说明

### 新增功能：

1. **实时余额显示**
   - 页面加载时自动显示账户余额
   - 每次任务完成后自动刷新余额

2. **任务信息展示**
   - 任务ID
   - 消费金额
   - 任务耗时

3. **下载按钮**
   - 可以直接下载修复后的图片

4. **调试信息**
   - 完整的RunningHub返回数据

---

## 🔧 API接口说明

### 1. POST /api/restore
修复老照片

**请求：**
```json
{
  "image": "base64编码的图片"
}
```

**响应：**
```json
{
  "success": true,
  "output_url": "https://...",
  "taskId": "1988271550107381762",
  "consumeMoney": "0.007",
  "taskCostTime": "6",
  "debug_raw": [...]
}
```

---

### 2. GET /api/balance
查询账户余额

**响应：**
```json
{
  "success": true,
  "data": {
    "remainCoins": "59058",
    "remainMoney": "9.623",
    "currency": "CNY",
    "apiType": "SHARED"
  }
}
```

---

### 3. GET /api/health
健康检查

**响应：**
```json
{
  "status": "ok",
  "message": "RunningHub API Server is running"
}
```

---

## 🧪 测试

### 测试1：检查服务器是否运行
```bash
curl http://localhost:3001/api/health
```

### 测试2：查询账户余额
```bash
curl http://localhost:3001/api/balance
```

### 测试3：在浏览器中测试前端
确保：
1. ✅ 服务器在运行（`npm run server`）
2. ✅ 前端应用在运行
3. ✅ 上传一张图片
4. ✅ 点击"开始修复"

---

## ⚙️ 配置

### 修改端口

如果3001端口被占用，可以修改 `.env` 文件：
```env
PORT=3002
```

然后在 `Home.tsx` 中也要修改：
```typescript
const API_URL = "http://localhost:3002/api/restore";
const BALANCE_URL = "http://localhost:3002/api/balance";
```

### 修改工作流

在 `.env` 中修改：
```env
WORKFLOW_ID=你的新工作流ID
```

---

## 📊 运行流程

```
用户上传图片
     ↓
Home.tsx (前端)
     ↓
发送 POST 请求到 http://localhost:3001/api/restore
     ↓
server.js (后端)
     ↓
调用 RunningHub API
     ↓
等待任务完成（轮询）
     ↓
返回结果给前端
     ↓
显示修复后的图片
```

---

## 🐛 常见问题

### Q: 前端显示"修复失败，请稍后重试"
**A:** 检查服务器是否在运行：
```bash
curl http://localhost:3001/api/health
```

### Q: 服务器报错"端口被占用"
**A:** 修改端口号（参考配置章节）

### Q: 任务一直在"修复中"
**A:** 查看服务器终端的日志，检查RunningHub API是否正常

### Q: 余额不显示
**A:** 检查浏览器控制台，确保没有CORS错误

---

## 🎨 自定义

### 修改样式
编辑 `Home.tsx` 中的 Tailwind CSS 类名

### 修改超时时间
在 `server.js` 中创建客户端时：
```javascript
const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID,
  maxAttempts: 120,  // 增加到120次（10分钟）
  pollInterval: 5000
});
```

---

## 📦 部署到生产环境

### 方案1：部署到Vercel
1. 将 `server.js` 改为 serverless function
2. 参考 `examples/express-server.js`

### 方案2：部署到自己的服务器
```bash
# 使用 pm2 保持服务运行
npm install -g pm2
pm2 start server.js --name runninghub-api
```

---

## 🔒 安全提示

⚠️ **重要：不要将 API Key 提交到 Git！**

确保 `.env` 在 `.gitignore` 中：
```
.env
```

---

## ✅ 完整测试清单

- [ ] 服务器启动成功
- [ ] 健康检查通过
- [ ] 余额查询成功
- [ ] 前端能显示余额
- [ ] 图片上传成功
- [ ] 图片修复成功
- [ ] 结果正确显示
- [ ] 任务信息正确
- [ ] 下载功能正常

---

## 📞 获取帮助

如有问题，请提供：
1. 服务器终端日志
2. 浏览器控制台错误
3. 使用的工作流ID
4. 账户余额信息
