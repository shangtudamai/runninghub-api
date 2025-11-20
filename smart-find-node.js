/**
 * 智能查找工作流的正确节点配置
 * 会尝试所有常见的节点ID（1-50）
 */
import { RunningHubClient } from './runninghub-client.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});

// 读取两张不同的测试图片（如果有的话）
let testImage1, testImage2;

try {
  testImage1 = fs.readFileSync('./test_base64.txt', 'utf-8');
  // 创建一个修改过的版本作为测试（实际上我们需要不同的图片）
  testImage2 = testImage1; // 先用同一张
} catch (error) {
  console.error('❌ 无法读取测试图片');
  process.exit(1);
}

console.log('🔍 智能查找正确的节点配置...\n');
console.log('策略：测试节点ID 1-50，找出哪个节点接收图片输入\n');
console.log('='.repeat(60));

async function testNodeId(nodeId) {
  try {
    const taskId = await client.createTask({
      nodeInfoList: [
        {
          nodeId: nodeId.toString(),
          fieldName: "image",
          fieldValue: testImage1
        }
      ]
    });

    console.log(`✅ 节点 ${nodeId}: 任务创建成功 (${taskId})`);

    // 等待任务完成
    const results = await client.queryTaskOutput(taskId);
    const outputUrl = results[0].fileUrl;

    console.log(`   输出: ${outputUrl.substring(outputUrl.length - 30)}`);

    return {
      nodeId,
      success: true,
      taskId,
      outputUrl
    };

  } catch (error) {
    if (error.message.includes('APIKEY_INVALID_NODE_INFO')) {
      console.log(`❌ 节点 ${nodeId}: 节点不存在或配置错误`);
    } else {
      console.log(`⚠️ 节点 ${nodeId}: ${error.message}`);
    }
    return { nodeId, success: false, error: error.message };
  }
}

async function main() {
  const successfulNodes = [];

  // 测试节点ID 1-50
  for (let nodeId = 1; nodeId <= 50; nodeId++) {
    const result = await testNodeId(nodeId);

    if (result.success) {
      successfulNodes.push(result);
    }

    // 每5个节点休息一下
    if (nodeId % 5 === 0) {
      console.log(`   [已测试 ${nodeId}/50]`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 测试结果');
  console.log('='.repeat(60));

  if (successfulNodes.length > 0) {
    console.log(`\n✅ 找到 ${successfulNodes.length} 个可用的节点:\n`);

    successfulNodes.forEach((node, index) => {
      console.log(`${index + 1}. 节点ID: ${node.nodeId}`);
      console.log(`   任务ID: ${node.taskId}`);
      console.log(`   输出: ${node.outputUrl}`);
      console.log('');
    });

    console.log('💡 建议使用第一个节点ID:', successfulNodes[0].nodeId);
    console.log('\n📝 更新配置：');
    console.log(`在 server.js 中使用：nodeId: "${successfulNodes[0].nodeId}"`);

  } else {
    console.log('\n❌ 没有找到可用的节点。');
    console.log('\n可能的原因：');
    console.log('1. 工作流没有配置API输入节点');
    console.log('2. 节点ID不在1-50范围内');
    console.log('3. 节点使用了特殊的命名而不是数字ID');
    console.log('\n💡 解决方案：');
    console.log('1. 在RunningHub编辑器中打开工作流');
    console.log('2. 查看LoadImage节点的ID');
    console.log('3. 手动告诉我节点ID');
  }
}

main();
