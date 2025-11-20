# 🔄 企业级API ↔️ 消费级API 切换指南

## 📋 API类型对比

### 企业级API (Enterprise API)
- ✅ 功能更强大
- ✅ 支持更多节点配置
- ✅ 更高的并发限制
- 💰 按使用量计费

### 消费级API (Consumer API)
- ✅ 适合个人用户
- ✅ 价格更优惠
- ✅ 功能与企业级相同
- 💰 消费级计费

---

## 🎯 如何切换API类型？

### 方法1：修改 .env（最简单）⭐ 推荐

**文件位置**: `C:\runninghub-test\.env`

当前配置：
```env
CONSUMER_API_KEY=c194f8c634e546cfa8ecf6b23593e737
ENTERPRISE_API_KEY=01636845dc98444882a6cac2680d65cb
WORKFLOW_ID=1988307311074697218
NODE_ID=2
```

#### 切换到消费级API：

**步骤1**: 编辑 `.env`
```env
# 方法A：直接替换企业级Key为消费级Key
ENTERPRISE_API_KEY=c194f8c634e546cfa8ecf6b23593e737

# 或者方法B：添加一个 API_KEY 配置
API_KEY=c194f8c634e546cfa8ecf6b23593e737
```

**步骤2**: 修改 `server.js`（见下面"方法2"）

---

### 方法2：修改 server.js ⭐ 推荐

**文件位置**: `C:\runninghub-test\server.js`

**第20行** - API Key配置：

#### 当前配置（企业级）：
```javascript
const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,  // ← 使用企业级API
  workflowId: process.env.WORKFLOW_ID
});
```

#### 切换到消费级API：
```javascript
const client = new RunningHubClient({
  apiKey: process.env.CONSUMER_API_KEY,  // ← 改成消费级API
  workflowId: process.env.WORKFLOW_ID
});
```

#### 或者使用统一配置（灵活方式）：
```javascript
// 在文件顶部添加（第10行左右）
const API_TYPE = process.env.API_TYPE || 'enterprise';  // 'enterprise' 或 'consumer'
const API_KEY = API_TYPE === 'consumer'
  ? process.env.CONSUMER_API_KEY
  : process.env.ENTERPRISE_API_KEY;

// 然后在第20行使用
const client = new RunningHubClient({
  apiKey: API_KEY,
  workflowId: process.env.WORKFLOW_ID
});
```

然后在 `.env` 中添加：
```env
API_TYPE=consumer  # 或 enterprise
```

---

## 🚀 完整切换步骤

### 快速切换（2分钟）

**步骤1**: 编辑 `server.js`
```bash
notepad server.js
# 或
code server.js
```

**步骤2**: 找到第20行，修改为：
```javascript
apiKey: process.env.CONSUMER_API_KEY,  // 改这一行
```

**步骤3**: 保存文件 (Ctrl+S)

**步骤4**: 重启服务器
```bash
# 停止服务器 (Ctrl+C)
npm run server
```

**步骤5**: 测试
```bash
node test-server-upload.js
```

---

## 🔍 验证API类型

运行测试查看使用的API类型：

```bash
curl http://localhost:3001/api/balance
```

返回结果中会显示：
```json
{
  "apiType": "consumer"  // 或 "enterprise"
}
```

---

## 📝 修改其他文件（可选）

如果你使用其他测试脚本，也需要修改：

### 测试脚本

**文件**: `test-correct-upload.js`, `test-field-names.js` 等

找到：
```javascript
const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,  // ← 改这里
  workflowId: process.env.WORKFLOW_ID
});
```

改为：
```javascript
const client = new RunningHubClient({
  apiKey: process.env.CONSUMER_API_KEY,  // ← 改成消费级
  workflowId: process.env.WORKFLOW_ID
});
```

---

## 🎨 高级配置：灵活切换

如果你想要轻松在两种API之间切换，可以这样配置：

### 修改 `.env`
```env
# API配置
CONSUMER_API_KEY=c194f8c634e546cfa8ecf6b23593e737
ENTERPRISE_API_KEY=01636845dc98444882a6cac2680d65cb

# 选择使用哪种API（只需要修改这一行即可切换）
API_TYPE=consumer  # 可选: consumer 或 enterprise

# 工作流配置
WORKFLOW_ID=1988307311074697218
NODE_ID=2
```

### 修改 `server.js`（在第10行后添加）
```javascript
import express from 'express';
import cors from 'cors';
import { RunningHubClient } from './runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 灵活的API配置
const API_TYPE = process.env.API_TYPE || 'enterprise';
const API_KEY = API_TYPE === 'consumer'
  ? process.env.CONSUMER_API_KEY
  : process.env.ENTERPRISE_API_KEY;

console.log(`🔑 使用 ${API_TYPE.toUpperCase()} API`);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 创建RunningHub客户端
const client = new RunningHubClient({
  apiKey: API_KEY,  // 使用动态选择的API Key
  workflowId: process.env.WORKFLOW_ID
});

// ... 后面的代码保持不变
```

**这样配置后，切换API只需要修改 `.env` 中的一行：**
```env
API_TYPE=consumer  # 切换到消费级
# 或
API_TYPE=enterprise  # 切换到企业级
```

---

## ⚠️ 注意事项

### 1. API端点相同
两种API都使用相同的端点：
- `/task/openapi/upload` - 上传图片
- `/task/openapi/create` - 创建任务
- `/task/openapi/outputs` - 获取结果
- `/uc/openapi/accountStatus` - 查询余额

### 2. 功能完全相同
- ✅ 上传图片功能相同
- ✅ 运行工作流相同
- ✅ 获取结果相同
- ✅ 计费方式可能不同

### 3. 余额独立
- 企业级API有自己的余额
- 消费级API有自己的余额
- 切换API后会显示对应的余额

### 4. 修改后重启
- 修改配置后必须重启服务器
- 否则不会生效

---

## 🧪 测试切换

### 测试脚本：test-api-switch.js

创建一个测试脚本验证切换：

```javascript
import { RunningHubClient } from './runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAPI(apiType, apiKey) {
  console.log(`\n🧪 测试 ${apiType} API...`);
  console.log('='.repeat(50));

  const client = new RunningHubClient({
    apiKey: apiKey,
    workflowId: process.env.WORKFLOW_ID
  });

  try {
    const status = await client.checkAccountStatus();
    console.log(`✅ ${apiType} API 可用`);
    console.log(`💰 余额: ${status.remainCoins} RH币 + ${status.remainMoney} 元`);
    console.log(`📊 API类型: ${status.apiType}`);
    return true;
  } catch (error) {
    console.log(`❌ ${apiType} API 失败:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔄 测试API切换\n');

  // 测试企业级API
  await testAPI('企业级', process.env.ENTERPRISE_API_KEY);

  // 测试消费级API
  await testAPI('消费级', process.env.CONSUMER_API_KEY);

  console.log('\n' + '='.repeat(50));
  console.log('✅ 测试完成！选择你想要使用的API类型。');
}

main();
```

运行测试：
```bash
node test-api-switch.js
```

---

## 📋 切换检查清单

切换完成后，检查这些项目：

- [ ] 修改了 `server.js` 的 API Key
- [ ] 保存了文件
- [ ] 重启了服务器
- [ ] 运行测试脚本验证
- [ ] 检查余额显示是否正确
- [ ] 测试上传和修复功能

---

## 💡 常见问题

### Q: 切换后余额显示不同？
**A:** 正常！两种API的余额是独立的。

### Q: 功能有区别吗？
**A:** 没有！API端点和功能完全相同。

### Q: 如何切换回去？
**A:** 将 `CONSUMER_API_KEY` 改回 `ENTERPRISE_API_KEY`，重启服务器即可。

### Q: 可以同时使用两种API吗？
**A:** 可以！创建两个不同的 RunningHubClient 实例，使用不同的API Key。

---

## 🎉 总结

### 最简单的切换方法：

1. **打开** `server.js`
2. **找到第20行**，将 `ENTERPRISE_API_KEY` 改成 `CONSUMER_API_KEY`
3. **保存**文件
4. **重启**服务器
5. **完成**！

就这么简单！✨

---

## 📚 相关文件

- `server.js` - 主要修改位置
- `.env` - API Key 配置
- `CONFIG_GUIDE.md` - 配置指南
- `FRONTEND_GUIDE.md` - 前端指南
