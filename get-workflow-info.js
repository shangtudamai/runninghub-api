/**
 * 获取工作流详细信息
 * 帮助找出正确的节点配置
 */
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ENTERPRISE_API_KEY;
const workflowId = process.env.WORKFLOW_ID;

// 尝试获取工作流信息的不同API端点
const endpoints = [
  {
    name: "工作流详情",
    url: `https://www.runninghub.cn/api/workflow/${workflowId}`,
    method: "GET"
  },
  {
    name: "工作流信息",
    url: `https://www.runninghub.cn/task/openapi/workflowInfo`,
    method: "POST",
    body: { apiKey, workflowId }
  },
  {
    name: "工作流节点信息",
    url: `https://www.runninghub.cn/api/workflow/${workflowId}/nodes`,
    method: "GET"
  }
];

async function tryEndpoint(endpoint) {
  console.log(`\n📡 尝试: ${endpoint.name}`);
  console.log(`   URL: ${endpoint.url}`);

  try {
    const options = {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    };

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }

    const response = await fetch(endpoint.url, options);
    const data = await response.json();

    console.log(`   状态: ${response.status}`);
    console.log(`   响应:`, JSON.stringify(data, null, 2).substring(0, 500));

    if (response.ok && data.code === 0) {
      return data;
    }
  } catch (error) {
    console.log(`   错误: ${error.message}`);
  }

  return null;
}

async function main() {
  console.log('🔍 尝试获取工作流信息...\n');
  console.log(`工作流ID: ${workflowId}`);
  console.log(`API Key: ${apiKey}`);
  console.log('='.repeat(60));

  for (const endpoint of endpoints) {
    const result = await tryEndpoint(endpoint);
    if (result) {
      console.log('\n✅ 成功获取工作流信息!');
      break;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('💡 提示:');
  console.log('');
  console.log('如果无法通过API获取工作流信息，请访问:');
  console.log(`https://www.runninghub.cn/workflow/${workflowId}`);
  console.log('');
  console.log('在工作流页面查找:');
  console.log('1. "API调用" 或 "API示例" 按钮');
  console.log('2. 查看示例代码中的 nodeInfoList 配置');
  console.log('3. 记录下正确的 nodeId 和 fieldName');
  console.log('');
  console.log('或者，如果这个工作流是你自己创建的:');
  console.log('1. 在ComfyUI编辑器中打开工作流');
  console.log('2. 找到"LoadImage"节点');
  console.log('3. 查看它的节点ID（通常显示在节点标题或右键菜单中）');
}

main();
