import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const consumerApiKey = process.env.CONSUMER_API_KEY;
const enterpriseApiKey = process.env.ENTERPRISE_API_KEY;
const workflowId = process.env.WORKFLOW_ID;

// 读取 Base64 图片
const imageBase64 = fs.readFileSync("./test_base64.txt", "utf-8");

const body = {
  inputs: {
    image: imageBase64
  }
};

// 定义多个可能的API端点格式
const endpoints = [
  {
    name: "企业级API - 当前格式",
    url: `https://www.runninghub.cn/enterprise-api/enterpriseApi/${enterpriseApiKey}/runWorkflow/${workflowId}`,
    apiKey: enterpriseApiKey
  },
  {
    name: "消费级API - 相同格式",
    url: `https://www.runninghub.cn/enterprise-api/enterpriseApi/${consumerApiKey}/runWorkflow/${workflowId}`,
    apiKey: consumerApiKey
  },
  {
    name: "企业级API - 简化路径1",
    url: `https://www.runninghub.cn/api/enterpriseApi/${enterpriseApiKey}/runWorkflow/${workflowId}`,
    apiKey: enterpriseApiKey
  },
  {
    name: "消费级API - 简化路径1",
    url: `https://www.runninghub.cn/api/${consumerApiKey}/runWorkflow/${workflowId}`,
    apiKey: consumerApiKey
  },
  {
    name: "企业级API - 简化路径2",
    url: `https://www.runninghub.cn/api/runWorkflow/${workflowId}`,
    apiKey: enterpriseApiKey,
    useAuthHeader: true
  },
  {
    name: "消费级API - 简化路径2",
    url: `https://www.runninghub.cn/api/runWorkflow/${workflowId}`,
    apiKey: consumerApiKey,
    useAuthHeader: true
  }
];

async function testEndpoint(endpoint) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🧪 测试: ${endpoint.name}`);
  console.log(`📍 URL: ${endpoint.url}`);

  try {
    const headers = { "Content-Type": "application/json" };

    // 如果需要在header中传递API key
    if (endpoint.useAuthHeader) {
      headers["Authorization"] = `Bearer ${endpoint.apiKey}`;
      headers["X-API-Key"] = endpoint.apiKey;
    }

    const res = await fetch(endpoint.url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    console.log(`📊 状态码: ${res.status} ${res.statusText}`);

    const text = await res.text();

    // 如果不是404或HTML错误页面，说明可能成功了
    if (res.status !== 404 && !text.includes("<!DOCTYPE html>")) {
      console.log("✅ 可能成功! 返回内容:");
      console.log(text.substring(0, 500)); // 只显示前500字符
      return { success: true, endpoint, response: text };
    } else {
      console.log(`❌ 失败: ${res.status === 404 ? "404 Not Found" : "返回HTML页面"}`);
    }
  } catch (err) {
    console.log(`❌ 出错: ${err.message}`);
  }

  return null;
}

async function runTests() {
  console.log("🚀 开始测试多个API端点...\n");
  console.log(`消费级API Key: ${consumerApiKey}`);
  console.log(`企业级API Key: ${enterpriseApiKey}`);
  console.log(`工作流ID: ${workflowId}`);

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result) {
      results.push(result);
    }
    // 稍微延迟，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("📋 测试总结:");
  console.log(`${"=".repeat(60)}`);

  if (results.length > 0) {
    console.log(`\n✅ 找到 ${results.length} 个可能有效的端点:`);
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.endpoint.name}`);
      console.log(`   URL: ${r.endpoint.url}`);
    });
  } else {
    console.log("\n❌ 所有端点测试均失败");
    console.log("\n💡 建议:");
    console.log("1. 检查API key是否正确且有效");
    console.log("2. 检查工作流ID是否存在");
    console.log("3. 查看RunningHub官方API文档");
    console.log("4. 联系RunningHub技术支持");
  }
}

runTests();
