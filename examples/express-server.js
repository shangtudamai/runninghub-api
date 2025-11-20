/**
 * 示例4：在Express服务中使用
 */
import express from 'express';
import { RunningHubClient } from '../runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// 创建RunningHub客户端
const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});

// API路由：运行工作流
app.post('/api/run-workflow', async (req, res) => {
  try {
    const { nodeInfoList } = req.body;

    // 运行工作流
    const result = await client.runWorkflow({ nodeInfoList });

    res.json({
      success: true,
      data: {
        taskId: result.taskId,
        fileUrl: result.fileUrl,
        consumeMoney: result.consumeMoney,
        taskCostTime: result.taskCostTime
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API路由：检查账户余额
app.get('/api/balance', async (req, res) => {
  try {
    const status = await client.checkAccountStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API路由：查询任务状态
app.get('/api/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await client.queryTaskOutput(taskId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log('\n可用的API端点:');
  console.log(`  POST http://localhost:${PORT}/api/run-workflow`);
  console.log(`  GET  http://localhost:${PORT}/api/balance`);
  console.log(`  GET  http://localhost:${PORT}/api/task/:taskId`);
});

/**
 * 使用示例：
 *
 * 1. 安装express: npm install express
 *
 * 2. 运行服务器: node examples/express-server.js
 *
 * 3. 调用API:
 *    curl -X POST http://localhost:3000/api/run-workflow \
 *      -H "Content-Type: application/json" \
 *      -d '{}'
 *
 *    curl http://localhost:3000/api/balance
 */
