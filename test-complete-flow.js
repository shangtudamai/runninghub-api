/**
 * 完整测试：上传图片 + 运行工作流
 */
import { RunningHubClient } from './runninghub-client.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});

const NODE_ID = process.env.NODE_ID || "598";
const imageBase64 = fs.readFileSync('./test_base64.txt', 'utf-8');

console.log('🧪 完整流程测试：上传图片 + 运行工作流\n');
console.log('='.repeat(60));

async function testComplete() {
  try {
    // 步骤1: 上传图片
    console.log('\n📤 步骤1: 上传图片到RunningHub...');
    console.log('   图片大小:', imageBase64.length, '字符');

    const fileName = await client.uploadImage(imageBase64);
    console.log(`✅ 上传成功! 文件名: ${fileName}`);

    // 步骤2: 运行工作流
    console.log(`\n🎨 步骤2: 使用文件 "${fileName}" 运行工作流...`);
    console.log(`   节点ID: ${NODE_ID}`);

    const result = await client.runWorkflow({
      nodeInfoList: [
        {
          nodeId: NODE_ID,
          fieldName: "image",
          fieldValue: fileName
        }
      ]
    });

    console.log('\n✅ 工作流完成!');
    console.log('📦 结果:');
    console.log('   任务ID:', result.taskId);
    console.log('   输出URL:', result.fileUrl);
    console.log('   消费:', result.consumeMoney, '元');
    console.log('   耗时:', result.taskCostTime, '秒');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 完整流程测试成功!');
    console.log('='.repeat(60));
    console.log('\n现在服务器已经配置正确，每次上传的图片都会被正确处理！');
    console.log('\n📝 启动服务器:');
    console.log('   npm run server');
    console.log('\n📱 使用方式:');
    console.log('   1. 打开 test-page.html');
    console.log('   2. 或在扣子空间中使用 Home.tsx');

  } catch (error) {
    console.error('\n❌ 失败:', error.message);
    console.error('\n完整错误:', error);
  }
}

testComplete();
