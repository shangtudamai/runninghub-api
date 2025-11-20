import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// 使用企业级API Key
const apiKey = process.env.ENTERPRISE_API_KEY;
const workflowId = process.env.WORKFLOW_ID;

// 正确的API端点
const ACCOUNT_STATUS_URL = "https://www.runninghub.cn/uc/openapi/accountStatus";
const CREATE_TASK_URL = "https://www.runninghub.cn/task/openapi/create";
const QUERY_OUTPUT_URL = "https://www.runninghub.cn/task/openapi/outputs";

const headers = {
  "User-Agent": "Node.js/RunningHub-API-Client",
  "Content-Type": "application/json",
  "Accept": "*/*",
  "Host": "www.runninghub.cn",
  "Connection": "keep-alive"
};

// 1. 检查账户状态
async function checkAccountStatus() {
  console.log("🔍 检查账户状态...");
  const res = await fetch(ACCOUNT_STATUS_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ apikey: apiKey })
  });

  const data = await res.json();
  if (data.code === 0) {
    console.log("✅ 账户验证成功!");
    console.log(`💰 余额: ${data.data.remainCoins} RH币 + ${data.data.remainMoney} ${data.data.currency}`);
    console.log(`📊 API类型: ${data.data.apiType}`);
    return true;
  }
  console.log("❌ 账户验证失败:", data.msg);
  return false;
}

// 2. 创建任务
async function createTask() {
  console.log("\n🚀 创建工作流任务...");

  const res = await fetch(CREATE_TASK_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      apiKey: apiKey,
      workflowId: workflowId
    })
  });

  const data = await res.json();
  if (data.code === 0) {
    console.log("✅ 任务创建成功!");
    console.log(`📝 任务ID: ${data.data.taskId}`);
    console.log(`📊 状态: ${data.data.taskStatus}`);
    return data.data.taskId;
  }
  console.log("❌ 任务创建失败:", data.msg);
  return null;
}

// 3. 查询任务结果
async function queryTaskOutput(taskId) {
  console.log("\n⏳ 查询任务结果...");

  const maxAttempts = 60;
  const interval = 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(QUERY_OUTPUT_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        apiKey: apiKey,
        taskId: taskId
      })
    });

    const data = await res.json();

    // 检查 msg 字段来判断任务状态
    if (data.msg === "success" && data.code === 0) {
      console.log("\n✅ 任务完成!");
      console.log("📦 结果:", JSON.stringify(data.data, null, 2));

      // 提取文件URL
      if (data.data && data.data.length > 0 && data.data[0].fileUrl) {
        console.log("🖼️ 输出文件:", data.data[0].fileUrl);
      }
      return data.data;
    } else if (data.msg === "APIKEY_TASK_IS_RUNNING") {
      // 任务还在运行中
      console.log(`[${attempt}/${maxAttempts}] 任务运行中，等待...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    } else if (data.msg === "TASK_FAILED" || data.msg === "FAILED") {
      console.log("\n❌ 任务失败:", data.msg);
      return null;
    } else {
      // 其他状态，继续等待
      console.log(`[${attempt}/${maxAttempts}] 状态: ${data.msg || "WAITING"}`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  console.log("\n⏰ 超时：任务未在预期时间内完成");
  return null;
}

// 主函数
async function run() {
  console.log("=" .repeat(60));
  console.log("🎯 RunningHub 企业 API");
  console.log("=" .repeat(60));

  try {
    // 步骤1: 验证账户
    if (!await checkAccountStatus()) {
      return;
    }

    // 步骤2: 创建任务
    const taskId = await createTask();
    if (!taskId) {
      return;
    }

    // 步骤3: 查询结果
    const result = await queryTaskOutput(taskId);

    if (result) {
      console.log("\n" + "=" .repeat(60));
      console.log("🎉 执行完成!");
      console.log("=" .repeat(60));
    }
  } catch (err) {
    console.error("❌ 出错:", err.message);
  }
}

run();
