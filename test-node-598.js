/**
 * 快速测试节点598是否能正确接收图片
 */
import { RunningHubClient } from './runninghub-client.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new RunningHubClient({
  apiKey: process.env.ENTERPRISE_API_KEY,
  workflowId: process.env.WORKFLOW_ID
});

// 读取测试图片
const imageBase64 = fs.readFileSync('./test_base64.txt', 'utf-8');

console.log('🧪 测试节点 #598 是否能接收图片...\n');
console.log('📷 图片数据长度:', imageBase64.length, '字符');
console.log('='.repeat(60));

async function testNode598() {
  try {
    console.log('\n🚀 创建任务，使用节点 #598...');

    const taskId = await client.createTask({
      nodeInfoList: [
        {
          nodeId: "598",
          fieldName: "image",
          fieldValue: imageBase64
        }
      ]
    });

    console.log('✅ 任务创建成功!');
    console.log('📝 任务ID:', taskId);

    console.log('\n⏳ 等待任务完成...');
    const results = await client.queryTaskOutput(taskId);

    console.log('\n✅ 任务完成!');
    console.log('📦 结果:');
    console.log('   输出URL:', results[0].fileUrl);
    console.log('   消费:', results[0].consumeMoney, '元');
    console.log('   耗时:', results[0].taskCostTime, '秒');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 成功! 节点 #598 能够正确接收图片');
    console.log('='.repeat(60));
    console.log('\n现在你可以在前端上传图片，每次都会使用新上传的图片！');

    return true;

  } catch (error) {
    console.log('\n❌ 失败:', error.message);

    if (error.message.includes('APIKEY_INVALID_NODE_INFO')) {
      console.log('\n⚠️ 节点配置错误。可能的原因：');
      console.log('1. 节点ID 598 不存在');
      console.log('2. 节点 #598 不是 LoadImage 类型');
      console.log('3. 节点 #598 没有名为 "image" 的字段');
      console.log('\n💡 请再次确认：');
      console.log('- 在RunningHub编辑器中查看节点');
      console.log('- 确认节点ID确实是 598');
      console.log('- 确认节点类型是 LoadImage');
    }

    return false;
  }
}

testNode598();
