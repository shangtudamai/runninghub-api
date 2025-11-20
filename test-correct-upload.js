/**
 * 正确的测试：上传图片后传给工作流
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

console.log('🧪 正确的测试：上传图片 → 传给工作流\n');
console.log('='.repeat(60));

async function testCorrectFlow() {
  try {
    // 步骤1: 上传图片
    console.log('\n📤 步骤1: 上传图片...');
    const fileName = await client.uploadImage(imageBase64);
    console.log(`✅ 上传成功: ${fileName}`);

    // 步骤2: 运行工作流，传入上传的文件名
    console.log('\n🎨 步骤2: 运行工作流（使用上传的图片）...');

    // 尝试不同的节点配置
    const configs = [
      { nodeId: "2", fieldName: "image" },      // 使用 .env 中的 NODE_ID=2
      { nodeId: "2", fieldName: "upload" },
      { nodeId: "598", fieldName: "image" },
      { nodeId: "598", fieldName: "upload" }
    ];

    for (const config of configs) {
      console.log(`\n🔍 尝试配置: nodeId=${config.nodeId}, fieldName=${config.fieldName}`);

      try {
        const result = await client.runWorkflow({
          nodeInfoList: [
            {
              nodeId: config.nodeId,
              fieldName: config.fieldName,
              fieldValue: fileName  // 传入上传后的文件名
            }
          ]
        });

        console.log('\n✅ 成功!');
        console.log('输出:', result.fileUrl);
        console.log('消费:', result.consumeMoney, '元');
        console.log('耗时:', result.taskCostTime, '秒');

        console.log('\n' + '='.repeat(60));
        console.log('🎉 找到正确配置!');
        console.log(`   nodeId: "${config.nodeId}"`);
        console.log(`   fieldName: "${config.fieldName}"`);
        console.log('='.repeat(60));

        return; // 找到正确配置，退出

      } catch (error) {
        console.log(`   ❌ 失败: ${error.message}`);
      }

      // 等待一下再试下一个配置
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n❌ 所有配置都失败了');
    console.log('\n💡 建议：');
    console.log('1. 在RunningHub编辑器中查看工作流');
    console.log('2. 找到接收图片的节点');
    console.log('3. 记下节点ID和字段名');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
  }
}

testCorrectFlow();
