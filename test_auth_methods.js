import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const enterpriseApiKey = process.env.ENTERPRISE_API_KEY;
const consumerApiKey = process.env.CONSUMER_API_KEY;
const workflowId = process.env.WORKFLOW_ID;

// 读取 Base64 图片
const imageBase64 = fs.readFileSync("./test_base64.txt", "utf-8");

// 测试不同的body格式和认证方式
const testCases = [
  {
    name: "企业API - body中传apiKey",
    url: `https://www.runninghub.cn/api/enterpriseApi/${enterpriseApiKey}/runWorkflow/${workflowId}`,
    body: {
      apiKey: enterpriseApiKey,
      inputs: { image: imageBase64 }
    }
  },
  {
    name: "企业API - body中传token",
    url: `https://www.runninghub.cn/api/enterpriseApi/${enterpriseApiKey}/runWorkflow/${workflowId}`,
    body: {
      token: enterpriseApiKey,
      inputs: { image: imageBase64 }
    }
  },
  {
    name: "企业API - Header Authorization Bearer",
    url: `https://www.runninghub.cn/api/runWorkflow/${workflowId}`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${enterpriseApiKey}`
    },
    body: {
      inputs: { image: imageBase64 }
    }
  },
  {
    name: "企业API - Header X-API-Key",
    url: `https://www.runninghub.cn/api/runWorkflow/${workflowId}`,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": enterpriseApiKey
    },
    body: {
      inputs: { image: imageBase64 }
    }
  },
  {
    name: "企业API - Header api-key",
    url: `https://www.runninghub.cn/api/runWorkflow/${workflowId}`,
    headers: {
      "Content-Type": "application/json",
      "api-key": enterpriseApiKey
    },
    body: {
      inputs: { image: imageBase64 }
    }
  },
  {
    name: "消费API - body中传apiKey",
    url: `https://www.runninghub.cn/api/${consumerApiKey}/runWorkflow/${workflowId}`,
    body: {
      apiKey: consumerApiKey,
      inputs: { image: imageBase64 }
    }
  },
  {
    name: "消费API - Header Authorization Bearer",
    url: `https://www.runninghub.cn/api/runWorkflow/${workflowId}`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${consumerApiKey}`
    },
    body: {
      inputs: { image: imageBase64 }
    }
  },
  {
    name: "消费API - Header X-API-Key",
    url: `https://www.runninghub.cn/api/runWorkflow/${workflowId}`,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": consumerApiKey
    },
    body: {
      inputs: { image: imageBase64 }
    }
  }
];

async function testAuth(testCase) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🧪 测试: ${testCase.name}`);
  console.log(`📍 URL: ${testCase.url}`);

  try {
    const headers = testCase.headers || { "Content-Type": "application/json" };

    const res = await fetch(testCase.url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(testCase.body)
    });

    console.log(`📊 状态码: ${res.status} ${res.statusText}`);

    const text = await res.text();
    let jsonResponse;

    try {
      jsonResponse = JSON.parse(text);
    } catch (e) {
      jsonResponse = null;
    }

    if (jsonResponse) {
      console.log("📦 响应内容:", JSON.stringify(jsonResponse, null, 2).substring(0, 500));

      // 检查是否成功
      if (jsonResponse.code === 0 || jsonResponse.code === 200 || jsonResponse.success === true) {
        console.log("✅✅✅ 成功! 这个配置是正确的!");
        return { success: true, testCase, response: jsonResponse };
      } else if (jsonResponse.code === 412 && jsonResponse.msg === "TOKEN_INVALID") {
        console.log("❌ TOKEN_INVALID - 认证方式不对");
      } else {
        console.log(`⚠️ 返回了响应，但可能有其他问题: code=${jsonResponse.code}, msg=${jsonResponse.msg}`);
        return { success: false, testCase, response: jsonResponse, maybeUseful: true };
      }
    } else {
      console.log("📄 非JSON响应:", text.substring(0, 200));
    }
  } catch (err) {
    console.log(`❌ 出错: ${err.message}`);
  }

  return null;
}

async function runAuthTests() {
  console.log("🚀 开始测试不同的认证方式...\n");

  const results = [];
  const maybeUseful = [];

  for (const testCase of testCases) {
    const result = await testAuth(testCase);
    if (result) {
      if (result.success) {
        results.push(result);
      } else if (result.maybeUseful) {
        maybeUseful.push(result);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("📋 测试总结:");
  console.log(`${"=".repeat(60)}`);

  if (results.length > 0) {
    console.log(`\n✅ 找到成功的配置:`);
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.testCase.name}`);
      console.log(`   URL: ${r.testCase.url}`);
    });
  } else if (maybeUseful.length > 0) {
    console.log(`\n⚠️ 找到可能有用的响应:`);
    maybeUseful.forEach((r, i) => {
      console.log(`${i + 1}. ${r.testCase.name}`);
      console.log(`   响应:`, r.response);
    });
  } else {
    console.log("\n❌ 所有认证方式均失败");
    console.log("\n💡 建议:");
    console.log("1. 检查API key是否在RunningHub后台正确复制");
    console.log("2. 确认API key是否已激活/有效");
    console.log("3. 查看RunningHub官方文档了解正确的认证方式");
    console.log("4. 检查工作流是否公开或是否有权限访问");
  }
}

runAuthTests();
