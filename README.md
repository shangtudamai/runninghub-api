# RunningHub API 使用指南

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
编辑 `.env` 文件，填入你的API Key和工作流ID：
```env
CONSUMER_API_KEY=你的消费级API密钥
ENTERPRISE_API_KEY=你的企业级API密钥
WORKFLOW_ID=你的工作流ID
```

### 3. 运行测试
```bash
npm start
```

## 如何获取API Key和工作流ID

### 获取API Key
1. 访问 [RunningHub官网](https://www.runninghub.cn)
2. 登录你的账户
3. 进入 **个人中心** → **API设置**
4. 复制你的API Key（消费级或企业级）

### 获取工作流ID
1. 在RunningHub平台打开你想调用的工作流
2. 从浏览器地址栏复制工作流ID
   - 例如：`https://www.runninghub.cn/workflow/1963972275496210433`
   - 工作流ID就是：`1963972275496210433`

## 使用方式

### 方式1：直接运行（最简单）
```bash
npm start
```
这会执行当前配置的工作流。

### 方式2：作为模块引入（推荐）
创建你自己的脚本：

```javascript
import { RunningHubClient } from './runninghub-client.js';

const client = new RunningHubClient({
  apiKey: 'your-api-key',
  workflowId: 'your-workflow-id'
});

// 运行工作流
const result = await client.runWorkflow();
console.log('结果:', result);
```

### 方式3：命令行传参
```bash
node run-workflow.js --workflow=1963972275496210433
```

## API说明

### 创建RunningHub客户端
```javascript
const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});
```

### 检查账户状态
```javascript
const status = await client.checkAccountStatus();
console.log('余额:', status.remainCoins, 'RH币');
console.log('人民币余额:', status.remainMoney, status.currency);
console.log('API类型:', status.apiType);
```

### 运行工作流
```javascript
// 运行工作流（如果工作流不需要输入参数）
const result = await client.runWorkflow();

// 运行工作流（如果需要传入参数）
const result = await client.runWorkflow({
  nodeInfoList: [
    {
      nodeId: "3",
      fieldName: "image",
      fieldValue: "base64编码的图片数据"
    }
  ]
});
```

### 查询任务状态
```javascript
const taskId = '1988271550107381762';
const result = await client.queryTaskOutput(taskId);

if (result) {
  console.log('输出文件:', result[0].fileUrl);
  console.log('消费金额:', result[0].consumeMoney, '元');
}
```

## 常见用例

### 用例1：批量处理多个工作流
参考：`examples/batch-process.js`

### 用例2：在Web服务中使用
参考：`examples/express-server.js`

### 用例3：定时任务
参考：`examples/scheduled-task.js`

## 费用说明

- 每次任务执行会消耗RH币或人民币余额
- 可以通过 `checkAccountStatus()` 查看当前余额
- 任务完成后会返回本次消费金额：`result[0].consumeMoney`

## 常见问题

### Q: 提示 TOKEN_INVALID 怎么办？
A: 检查你的API Key是否正确，确保从RunningHub后台的API设置页面复制。

### Q: 任务一直运行中不完成？
A: 部分工作流可能需要较长时间，默认等待时间是5分钟（60次*5秒）。可以修改 `maxAttempts` 参数。

### Q: 如何传入图片或其他参数？
A: 需要使用 `nodeInfoList` 参数，具体的 nodeId 和 fieldName 取决于你的工作流配置。

### Q: 消费级和企业级API有什么区别？
A:
- 消费级：适合个人使用，按需付费
- 企业级共享：适合团队使用，有资源池保障，响应更快

## 技术支持

- 官方文档：https://www.runninghub.cn/call-api
- GitHub Issues：提交问题反馈
- 技术支持：联系RunningHub客服

## 文件说明

- `test_api.js` - 主测试脚本
- `runninghub-client.js` - 封装的客户端类（即将创建）
- `run-workflow.js` - 命令行工具（即将创建）
- `examples/` - 使用示例（即将创建）
