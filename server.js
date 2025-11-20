/**
 * RunningHub API 服务器 - 用于前端调用
 * 启动: node server.js
 */
import express from 'express';
import cors from 'cors';
import { RunningHubClient } from './runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 启用CORS（允许前端跨域调用）
app.use(cors());
app.use(express.json({ limit: '50mb' })); // 支持大文件

// 工作流配置
const WORKFLOW_CONFIG = {
  light: {
    workflowId: process.env.WORKFLOW_ID_LIGHT || process.env.WORKFLOW_ID,
    nodeId: process.env.NODE_ID_LIGHT || process.env.NODE_ID || "2",
    fieldName: "加载图像"
  },
  severe: {
    workflowId: process.env.WORKFLOW_ID_SEVERE,
    nodeId: process.env.NODE_ID_LOAD_SEVERE || "12",
    fieldName: "加载图像"
  }
};

// 创建RunningHub客户端的工厂函数
const createClient = (damageLevel) => {
  const config = WORKFLOW_CONFIG[damageLevel] || WORKFLOW_CONFIG.light;
  return new RunningHubClient({
    apiKey: process.env.ENTERPRISE_API_KEY,
    workflowId: config.workflowId
  });
};

/**
 * POST /api/restore
 * 老照片修复接口
 * 请求体: { image: "base64编码的图片", damageLevel: "light" | "severe" }
 * 返回: { output_url, debug_raw, taskId, consumeMoney }
 */
app.post('/api/restore', async (req, res) => {
  console.log('📥 收到修复请求...');

  try {
    const { image, damageLevel = 'light' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: '缺少图片数据'
      });
    }

    console.log(`🚀 调用 RunningHub API (${damageLevel === 'severe' ? '严重损坏' : '轻微损坏'}模式)...`);
    console.log('📷 图片数据长度:', image.length, '字符');

    // 根据损坏程度创建对应的客户端
    const config = WORKFLOW_CONFIG[damageLevel] || WORKFLOW_CONFIG.light;
    const client = createClient(damageLevel);
    const NODE_ID = config.nodeId;

    console.log('🔧 使用工作流ID:', config.workflowId);
    console.log('🔧 使用节点ID:', NODE_ID);

    // 步骤1: 先上传图片
    console.log('📤 步骤1: 上传图片到RunningHub...');
    const fileName = await client.uploadImage(image);
    console.log(`✅ 图片上传成功! 文件名: ${fileName}`);
    console.log(`📋 文件名类型: ${typeof fileName}, 内容: ${JSON.stringify(fileName)}`);

    // 步骤2: 使用文件名运行工作流
    console.log('🎨 步骤2: 运行工作流...');
    console.log(`📝 传递参数: nodeId=${NODE_ID}, fieldName=${config.fieldName}, fieldValue=${fileName}`);
    const result = await client.runWorkflow({
      nodeInfoList: [
        {
          nodeId: NODE_ID,
          fieldName: config.fieldName,
          fieldValue: fileName
        }
      ]
    });

    console.log('✅ RunningHub 返回成功');
    console.log('📝 任务ID:', result.taskId);
    console.log('🖼️ 输出URL:', result.fileUrl);
    console.log('💰 消费:', result.consumeMoney, '元');
    console.log('📋 完整结果:', JSON.stringify(result.results, null, 2));

    // 返回给前端的数据格式（与原API保持一致）
    res.json({
      success: true,
      output_url: result.fileUrl,
      imageUrl: result.fileUrl,  // 兼容前端的字段名
      taskId: result.taskId,
      consumeMoney: result.consumeMoney,
      taskCostTime: result.taskCostTime,
      // 调试信息
      debug_raw: result.results
    });

  } catch (error) {
    console.error('❌ 错误:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || '处理失败，请稍后重试'
    });
  }
});

/**
 * GET /api/balance
 * 查询账户余额
 */
app.get('/api/balance', async (req, res) => {
  try {
    const client = createClient('light');
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

/**
 * GET /api/health
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RunningHub API Server is running'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('🚀 RunningHub API 服务器已启动');
  console.log('='.repeat(50));
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log('');
  console.log('📌 可用端点:');
  console.log(`   POST http://localhost:${PORT}/api/restore`);
  console.log(`   GET  http://localhost:${PORT}/api/balance`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
  console.log('');
});

export default app;
