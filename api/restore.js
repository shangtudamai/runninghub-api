/**
 * Vercel Serverless Function - 图片修复
 */
import { RunningHubClient } from '../lib/runninghub-client.js';

// 工作流配置
const WORKFLOW_CONFIG = {
  light: {
    workflowId: process.env.WORKFLOW_ID_LIGHT || process.env.WORKFLOW_ID,
    nodeId: process.env.NODE_ID_LIGHT || process.env.NODE_ID || "2"
  },
  severe: {
    workflowId: process.env.WORKFLOW_ID_SEVERE,
    nodeId: process.env.NODE_ID_LOAD_SEVERE || "12"
  }
};

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // 根据损坏程度选择配置
    const config = WORKFLOW_CONFIG[damageLevel] || WORKFLOW_CONFIG.light;
    console.log('🔧 使用工作流ID:', config.workflowId);
    console.log('🔧 使用节点ID:', config.nodeId);

    // 创建客户端
    const client = new RunningHubClient({
      apiKey: process.env.ENTERPRISE_API_KEY,
      workflowId: config.workflowId
    });

    // 步骤1: 上传图片
    console.log('📤 步骤1: 上传图片到RunningHub...');
    const fileName = await client.uploadImage(image);
    console.log(`✅ 图片上传成功! 文件名: ${fileName}`);

    // 步骤2: 运行工作流
    console.log('🎨 步骤2: 运行工作流...');
    const result = await client.runWorkflow({
      nodeInfoList: [
        {
          nodeId: config.nodeId,
          fieldName: "image",
          fieldValue: fileName
        }
      ]
    });

    console.log('✅ RunningHub 返回成功');
    console.log('📝 任务ID:', result.taskId);

    // 返回结果
    res.status(200).json({
      success: true,
      output_url: result.fileUrl,
      imageUrl: result.fileUrl,  // 兼容前端的字段名
      taskId: result.taskId,
      consumeMoney: result.consumeMoney,
      taskCostTime: result.taskCostTime,
      debug_raw: result.results
    });

  } catch (error) {
    console.error('❌ 错误:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || '处理失败，请稍后重试'
    });
  }
}
