/**
 * 测试不传nodeInfoList参数
 */
import { RunningHubClient } from './runninghub-client.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});

const imageBase64 = fs.readFileSync('./test_base64.txt', 'utf-8');

console.log('🧪 测试：不传nodeInfoList参数\n');
console.log('='.repeat(60));

async function test() {
  try {
    // 上传图片
    console.log('\n📤 上传图片...');
    const fileName = await client.uploadImage(imageBase64);
    console.log(`✅ 上传成功: ${fileName}`);

    // 不传nodeInfoList，直接运行
    console.log('\n🎨 运行工作流（不传nodeInfoList）...');
    const result = await client.runWorkflow();

    console.log('\n✅ 完成!');
    console.log('输出:', result.fileUrl);

  } catch (error) {
    console.error('\n❌ 失败:', error.message);
  }
}

test();
