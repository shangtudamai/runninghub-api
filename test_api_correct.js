import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// 使用企业级API Key
const apiKey = process.env.ENTERPRISE_API_KEY;
const workflowId = process.env.WORKFLOW_ID;

// 读取 Base64 图片
const imageBase64 = fs.readFileSync("./test_base64.txt", "utf-8");

// 正确的API端点
const ACCOUNT_STATUS_URL = "https://www.runninghub.cn/uc/openapi/accountStatus";
const CREATE_TASK_URL = "https://www.runninghub.cn/task/openapi/create";
const QUERY_OUTPUT_URL = "https://www.runninghub.cn/task/openapi/outputs";

// HTTP头部
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
  try {
    const res = await fetch(ACCOUNT_STATUS_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ apikey: apiKey }) // 注意这里是小写的 apikey
    });

    const data = await res.json();
    console.log("📊 账户状态响应:", JSON.stringify(data, null, 2));

    if (data.code === 0 || data.success === true) {
      console.log("✅ 账户验证成功!");
      return true;
    } else {
      console.log("❌ 账户验证失败:", data.msg || data.message);
      return false;
    }
  } catch (err) {
    console.error("❌ 检查账户状态出错:", err.message);
    return false;
  }
}

// 2. 创建任务
async function createTask() {
  console.log("\n🚀 创建工作流任务...");

  const taskData = {
    apiKey: apiKey,  // 注意这里是驼峰式的 apiKey
    workflowId: workflowId,
    nodeInfoList: [
      {
        nodeId: "input_image",  // 这个需要根据你的工作流调整
        fieldName: "image",
        fieldValue: imageBase64
      }
    ]
  };

  try {
    const res = await fetch(CREATE_TASK_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(taskData)
    });

    const data = await res.json();
    console.log("📦 创建任务响应:", JSON.stringify(data, null, 2));

    if (data.code === 0 || data.success === true) {
      console.log("✅ 任务创建成功!");
      console.log("📝 任务ID:", data.data?.taskId || data.taskId);
      return data.data?.taskId || data.taskId;
    } else {
      console.log("❌ 任务创建失败:", data.msg || data.message);
      return null;
    }
  } catch (err) {
    console.error("❌ 创建任务出错:", err.message);
    return null;
  }
}

// 3. 查询任务结果
async function queryTaskOutput(taskId) {
  console.log("\n🔍 查询任务结果...");

  const maxAttempts = 60; // 最多查询60次
  const interval = 5000; // 每5秒查询一次

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(QUERY_OUTPUT_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          apiKey: apiKey,
          taskId: taskId
        })
      });

      const data = await res.json();
      console.log(`\n[尝试 ${attempt}/${maxAttempts}] 任务状态:`, data.data?.status || data.status);

      if (data.code === 0 || data.success === true) {
        const taskStatus = data.data?.status || data.status;

        if (taskStatus === "SUCCESS" || taskStatus === "COMPLETED") {
          console.log("✅ 任务完成!");
          console.log("📦 结果:", JSON.stringify(data.data, null, 2));
          return data.data;
        } else if (taskStatus === "FAILED" || taskStatus === "ERROR") {
          console.log("❌ 任务失败:", data.data?.message || data.message);
          return null;
        } else {
          console.log("⏳ 任务进行中，等待5秒后重试...");
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      } else {
        console.log("❌ 查询失败:", data.msg || data.message);
        return null;
      }
    } catch (err) {
      console.error("❌ 查询出错:", err.message);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  console.log("⏰ 超时：任务未在预期时间内完成");
  return null;
}

// 主函数
async function main() {
  console.log("=" .repeat(60));
  console.log("🎯 RunningHub 企业 API 测试");
  console.log("=" .repeat(60));
  console.log(`API Key: ${apiKey}`);
  console.log(`工作流ID: ${workflowId}`);
  console.log("=" .repeat(60));

  // 步骤1: 检查账户
  const accountValid = await checkAccountStatus();
  if (!accountValid) {
    console.log("\n❌ 账户验证失败，无法继续。请检查API Key是否正确。");
    return;
  }

  // 步骤2: 创建任务
  const taskId = await createTask();
  if (!taskId) {
    console.log("\n❌ 任务创建失败，无法继续。");
    return;
  }

  // 步骤3: 查询结果
  const result = await queryTaskOutput(taskId);
  if (result) {
    console.log("\n" + "=" .repeat(60));
    console.log("🎉 执行完成!");
    console.log("=" .repeat(60));
  } else {
    console.log("\n" + "=" .repeat(60));
    console.log("❌ 执行失败或超时");
    console.log("=" .repeat(60));
  }
}

main();
