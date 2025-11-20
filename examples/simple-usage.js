/**
 * 示例1：最简单的使用方式
 */
import { RunningHubClient } from '../runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // 创建客户端
  const client = new RunningHubClient({
    apiKey: process.env.ENTERPRISE_API_KEY,
    workflowId: process.env.WORKFLOW_ID
  });

  try {
    // 方式1：获取完整结果
    console.log('🚀 运行工作流...');
    const result = await client.runWorkflow();
    console.log('✅ 完成！');
    console.log('📝 任务ID:', result.taskId);
    console.log('🖼️ 输出文件:', result.fileUrl);
    console.log('💰 消费:', result.consumeMoney, '元');
    console.log('⏱️ 耗时:', result.taskCostTime, '秒');

    // 方式2：只获取文件URL（最简单）
    // const fileUrl = await client.runAndGetUrl();
    // console.log('文件URL:', fileUrl);

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

main();
