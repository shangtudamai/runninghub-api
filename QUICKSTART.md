# RunningHub API 快速入门

## 🎯 5种使用方式

### 1️⃣ 最快速 - 直接运行
```bash
npm start
```
使用`.env`中配置的API Key和工作流ID直接运行。

---

### 2️⃣ 命令行工具
```bash
# 运行工作流
node run-workflow.js run

# 检查余额
node run-workflow.js status

# 查询任务
node run-workflow.js query --task=任务ID

# 使用指定工作流
node run-workflow.js run --workflow=1963972275496210433
```

---

### 3️⃣ 简单脚本（推荐）
创建你的脚本 `my-script.js`：
```javascript
import { RunningHubClient } from './runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});

// 运行并获取结果
const result = await client.runWorkflow();
console.log('输出文件:', result.fileUrl);
```

运行：
```bash
node my-script.js
```

---

### 4️⃣ 在Web服务中使用
```javascript
import express from 'express';
import { RunningHubClient } from './runninghub-client.js';

const app = express();
const client = new RunningHubClient({
  apiKey: 'your-api-key',
  workflowId: 'your-workflow-id'
});

app.post('/api/generate', async (req, res) => {
  const result = await client.runWorkflow();
  res.json({ fileUrl: result.fileUrl });
});

app.listen(3000);
```

完整示例：`examples/express-server.js`

---

### 5️⃣ 批量处理
```javascript
// 运行多个工作流
const workflows = ['ID1', 'ID2', 'ID3'];

for (const id of workflows) {
  const client = new RunningHubClient({
    apiKey: apiKey,
    workflowId: id
  });
  const result = await client.runWorkflow();
  console.log('完成:', result.fileUrl);
}
```

完整示例：`examples/batch-process.js`

---

## 📚 查看示例

所有示例都在 `examples/` 目录中：

```bash
# 简单使用
node examples/simple-usage.js

# 检查余额
node examples/check-balance.js

# 批量处理
node examples/batch-process.js

# Web服务（需要先安装express）
npm install express
node examples/express-server.js
```

---

## 🔧 RunningHubClient API

### 创建客户端
```javascript
const client = new RunningHubClient({
  apiKey: 'your-api-key',        // 必需
  workflowId: 'your-workflow-id', // 可选
  maxAttempts: 60,                // 可选：最大查询次数
  pollInterval: 5000              // 可选：查询间隔（毫秒）
});
```

### 方法

#### `checkAccountStatus()`
检查账户余额和状态
```javascript
const status = await client.checkAccountStatus();
// 返回: { remainCoins, remainMoney, currency, apiType, currentTaskCounts }
```

#### `createTask(params)`
创建任务
```javascript
const taskId = await client.createTask({
  // 可选参数
  nodeInfoList: [...]
});
```

#### `queryTaskOutput(taskId)`
查询任务结果
```javascript
const results = await client.queryTaskOutput('任务ID');
```

#### `runWorkflow(params)` ⭐ 推荐
运行完整流程（创建+查询）
```javascript
const result = await client.runWorkflow();
// 返回: { taskId, results, fileUrl, consumeMoney, taskCostTime }
```

#### `runAndGetUrl(params)` ⭐ 最简单
只返回文件URL
```javascript
const url = await client.runAndGetUrl();
```

---

## 💡 常见场景

### 场景1：快速测试
```bash
npm start
```

### 场景2：查看余额
```bash
node run-workflow.js status
```

### 场景3：集成到你的项目
```javascript
import { RunningHubClient } from './runninghub-client.js';

const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: '你的工作流ID'
});

const url = await client.runAndGetUrl();
```

### 场景4：定时任务
```javascript
import cron from 'node-cron';

// 每小时运行一次
cron.schedule('0 * * * *', async () => {
  const result = await client.runWorkflow();
  console.log('定时任务完成:', result.fileUrl);
});
```

---

## 📖 完整文档
查看 `README.md` 获取详细文档。
