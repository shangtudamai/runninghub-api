import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.ENTERPRISE_API_KEY;
const workflowId = process.env.WORKFLOW_ID;
const imageBase64 = fs.readFileSync("./test_base64.txt", "utf-8");

const CREATE_TASK_URL = "https://www.runninghub.cn/task/openapi/create";

const headers = {
  "User-Agent": "Node.js/RunningHub-API-Client",
  "Content-Type": "application/json",
  "Accept": "*/*",
  "Host": "www.runninghub.cn",
  "Connection": "keep-alive"
};

// 测试不同的任务创建格式
const testCases = [
  {
    name: "格式1: 不提供nodeInfoList",
    data: {
      apiKey: apiKey,
      workflowId: workflowId
    }
  },
  {
    name: "格式2: 使用inputs字段",
    data: {
      apiKey: apiKey,
      workflowId: workflowId,
      inputs: {
        image: imageBase64
      }
    }
  },
  {
    name: "格式3: nodeInfoList with 'image' node",
    data: {
      apiKey: apiKey,
      workflowId: workflowId,
      nodeInfoList: [
        {
          nodeId: "image",
          fieldName: "image",
          fieldValue: imageBase64
        }
      ]
    }
  },
  {
    name: "格式4: nodeInfoList with node 3 (常见的输入节点)",
    data: {
      apiKey: apiKey,
      workflowId: workflowId,
      nodeInfoList: [
        {
          nodeId: "3",
          fieldName: "image",
          fieldValue: imageBase64
        }
      ]
    }
  },
  {
    name: "格式5: nodeInfoList with LoadImage节点",
    data: {
      apiKey: apiKey,
      workflowId: workflowId,
      nodeInfoList: [
        {
          nodeId: "LoadImage",
          fieldName: "image",
          fieldValue: imageBase64
        }
      ]
    }
  },
  {
    name: "格式6: 完整的inputs对象",
    data: {
      apiKey: apiKey,
      workflowId: workflowId,
      inputs: [
        {
          name: "image",
          value: imageBase64
        }
      ]
    }
  }
];

async function testCreateTask(testCase) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🧪 测试: ${testCase.name}`);
  console.log(`📤 请求数据:`, JSON.stringify(testCase.data, null, 2).substring(0, 300) + "...");

  try {
    const res = await fetch(CREATE_TASK_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(testCase.data)
    });

    const data = await res.json();
    console.log(`📦 响应:`, JSON.stringify(data, null, 2));

    if (data.code === 0) {
      console.log(`✅✅✅ 成功! 这个格式是正确的!`);
      console.log(`📝 任务ID:`, data.data?.taskId || data.taskId);
      return { success: true, testCase, taskId: data.data?.taskId || data.taskId };
    } else {
      console.log(`❌ 失败: ${data.msg}`);
    }
  } catch (err) {
    console.log(`❌ 出错: ${err.message}`);
  }

  return null;
}

async function runTests() {
  console.log("🚀 测试不同的任务创建格式...\n");

  for (const testCase of testCases) {
    const result = await testCreateTask(testCase);
    if (result && result.success) {
      console.log(`\n${"=".repeat(60)}`);
      console.log("🎉 找到正确的格式！");
      console.log(`格式名称: ${result.testCase.name}`);
      console.log(`任务ID: ${result.taskId}`);
      console.log(`${"=".repeat(60)}`);
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("❌ 所有格式均失败");
  console.log("\n💡 建议:");
  console.log("1. 这个工作流可能需要特定的node配置");
  console.log("2. 可以在RunningHub网站上查看这个工作流的API调用示例");
  console.log("3. 或者在工作流页面找到'API文档'或'调用示例'");
  console.log(`${"=".repeat(60)}`);
}

runTests();
