/**
 * 测试不同的 nodeInfoList 配置，找出正确的节点ID
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

// 测试不同的节点配置
const testConfigs = [
  {
    name: "配置1: 不传递参数（默认）",
    params: {}
  },
  {
    name: "配置2: nodeId='3', fieldName='image'",
    params: {
      nodeInfoList: [
        { nodeId: "3", fieldName: "image", fieldValue: imageBase64 }
      ]
    }
  },
  {
    name: "配置3: nodeId='LoadImage', fieldName='image'",
    params: {
      nodeInfoList: [
        { nodeId: "LoadImage", fieldName: "image", fieldValue: imageBase64 }
      ]
    }
  },
  {
    name: "配置4: nodeId='1', fieldName='image'",
    params: {
      nodeInfoList: [
        { nodeId: "1", fieldName: "image", fieldValue: imageBase64 }
      ]
    }
  },
  {
    name: "配置5: nodeId='image_input', fieldName='image'",
    params: {
      nodeInfoList: [
        { nodeId: "image_input", fieldName: "image", fieldValue: imageBase64 }
      ]
    }
  },
  {
    name: "配置6: 使用inputs字段",
    params: {
      inputs: {
        image: imageBase64
      }
    }
  }
];

async function testConfig(config) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🧪 测试: ${config.name}`);
  console.log(`${"=".repeat(60)}`);

  try {
    const taskId = await client.createTask(config.params);
    console.log(`✅ 任务创建成功! 任务ID: ${taskId}`);

    console.log('⏳ 等待任务完成...');
    const results = await client.queryTaskOutput(taskId);

    console.log('✅ 任务完成!');
    console.log('📦 结果:', JSON.stringify(results[0], null, 2));

    return { success: true, config, taskId, results };

  } catch (error) {
    console.log(`❌ 失败: ${error.message}`);
    return { success: false, config, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 开始测试不同的节点配置...\n');

  const successfulConfigs = [];

  for (const config of testConfigs) {
    const result = await testConfig(config);

    if (result.success) {
      successfulConfigs.push(result);
    }

    // 等待一下，避免请求太快
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log('📋 测试总结');
  console.log(`${"=".repeat(60)}`);

  if (successfulConfigs.length > 0) {
    console.log(`\n✅ 找到 ${successfulConfigs.length} 个成功的配置:\n`);

    successfulConfigs.forEach((result, index) => {
      console.log(`${index + 1}. ${result.config.name}`);
      console.log(`   任务ID: ${result.taskId}`);
      console.log(`   输出URL: ${result.results[0].fileUrl}`);
      console.log('');
    });

    console.log('💡 推荐使用第一个成功的配置。');

  } else {
    console.log('\n❌ 所有配置都失败了。');
    console.log('\n可能的原因:');
    console.log('1. 工作流需要特定的节点ID');
    console.log('2. 工作流不接受外部输入');
    console.log('3. 需要查看工作流的具体配置');
    console.log('\n💡 建议: 在RunningHub网站上查看这个工作流的API调用示例。');
  }
}

runTests();
