/**
 * 测试不同的字段名
 */
import { RunningHubClient } from './runninghub-client.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});

const NODE_ID = "598";
const imageBase64 = fs.readFileSync('./test_base64.txt', 'utf-8');

console.log('🧪 测试节点 #598 的不同字段名...\n');

// 可能的字段名
const fieldNames = [
  "image",
  "upload",
  "file",
  "input",
  "img"
];

async function testFieldName(fieldName) {
  try {
    console.log(`\n📤 测试字段名: "${fieldName}"`);

    // 先上传图片
    const fileName = await client.uploadImage(imageBase64);
    console.log(`   上传成功: ${fileName.substring(0, 30)}...`);

    // 创建任务
    const taskId = await client.createTask({
      nodeInfoList: [
        {
          nodeId: NODE_ID,
          fieldName: fieldName,
          fieldValue: fileName
        }
      ]
    });

    console.log(`   ✅ 任务创建成功: ${taskId}`);

    // 查询结果
    const results = await client.queryTaskOutput(taskId);
    const outputUrl = results[0].fileUrl;

    console.log(`   📦 输出: ${outputUrl.substring(outputUrl.length - 40)}`);

    return { fieldName, success: true, outputUrl };

  } catch (error) {
    console.log(`   ❌ 失败: ${error.message}`);
    return { fieldName, success: false, error: error.message };
  }
}

async function main() {
  const results = [];

  for (const fieldName of fieldNames) {
    const result = await testFieldName(fieldName);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 测试结果汇总');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);

  if (successful.length > 0) {
    console.log('\n✅ 成功的字段名:');
    successful.forEach(r => {
      console.log(`   - "${r.fieldName}"`);
      console.log(`     输出: ${r.outputUrl}`);
    });
  } else {
    console.log('\n❌ 所有字段名都失败了');
    console.log('\n💡 建议：在RunningHub编辑器中：');
    console.log('1. 右键点击节点 #598');
    console.log('2. 查看节点的属性');
    console.log('3. 找到输入字段的名称');
  }
}

main();
