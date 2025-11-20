/**
 * 测试轻微损坏 API
 */
import { RunningHubClient } from './runninghub-client.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function testLightDamage() {
  console.log('\n=== 测试轻微损坏工作流 ===');
  console.log('Workflow ID:', process.env.WORKFLOW_ID_LIGHT);
  console.log('Node ID:', process.env.NODE_ID_LIGHT);
  console.log('API Key:', process.env.ENTERPRISE_API_KEY ? '已设置' : '未设置');

  try {
    const client = new RunningHubClient({
      apiKey: process.env.ENTERPRISE_API_KEY,
      workflowId: process.env.WORKFLOW_ID_LIGHT
    });

    // 读取测试图片
    const testImagePath = './test.jpg';
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ 测试图片不存在，请在项目根目录放置 test.jpg');
      return;
    }

    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');

    console.log('\n📤 步骤1: 上传图片...');
    const fileName = await client.uploadImage(base64Image);
    console.log('✅ 上传成功:', fileName);

    console.log('\n🎨 步骤2: 运行工作流...');
    const result = await client.runWorkflow({
      nodeInfoList: [
        {
          nodeId: process.env.NODE_ID_LIGHT || "2",
          fieldName: "image",
          fieldValue: fileName
        }
      ]
    });

    console.log('\n✅ 测试成功！');
    console.log('任务ID:', result.taskId);
    console.log('输出URL:', result.fileUrl);
    console.log('消费:', result.consumeMoney, '元');

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('详细错误:', error);
  }
}

testLightDamage();
