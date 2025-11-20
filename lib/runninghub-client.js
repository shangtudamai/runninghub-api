import axios from "axios";
import FormData from "form-data";

/**
 * RunningHub API 客户端
 */
export class RunningHubClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.workflowId = options.workflowId;
    this.baseUrl = options.baseUrl || "https://www.runninghub.cn";
    this.maxAttempts = options.maxAttempts || 60;
    this.pollInterval = options.pollInterval || 5000;

    this.headers = {
      "User-Agent": "Node.js/RunningHub-API-Client",
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Host": "www.runninghub.cn",
      "Connection": "keep-alive"
    };
  }

  /**
   * 检查账户状态
   * @returns {Promise<Object>} 账户信息
   */
  async checkAccountStatus() {
    const url = `${this.baseUrl}/uc/openapi/accountStatus`;
    const { data } = await axios.post(url,
      { apikey: this.apiKey },
      {
        headers: this.headers,
        timeout: 30000
      }
    );

    if (data.code === 0) {
      return data.data;
    }
    throw new Error(`账户验证失败: ${data.msg}`);
  }

  /**
   * 上传图片到RunningHub
   * @param {string} imageBase64 - Base64编码的图片
   * @returns {Promise<string>} 返回文件名
   */
  async uploadImage(imageBase64) {
    const url = `${this.baseUrl}/task/openapi/upload`;

    // 将Base64转换为Buffer
    const buffer = Buffer.from(imageBase64, 'base64');

    // 创建FormData
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: 'image.png',
      contentType: 'image/png'
    });
    formData.append('apiKey', this.apiKey);
    formData.append('fileType', 'image');

    const { data } = await axios.post(url, formData, {
      headers: formData.getHeaders(),
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (data.code === 0) {
      return data.data.fileName;
    }

    throw new Error(`上传图片失败: ${data.msg}`);
  }

  /**
   * 创建工作流任务
   * @param {Object} params - 任务参数
   * @param {Array} params.nodeInfoList - 节点信息列表（可选）
   * @returns {Promise<string>} 任务ID
   */
  async createTask(params = {}) {
    const url = `${this.baseUrl}/task/openapi/create`;
    const taskData = {
      apiKey: this.apiKey,
      workflowId: this.workflowId,
      ...params
    };

    const { data } = await axios.post(url, taskData, {
      headers: this.headers,
      timeout: 30000
    });

    if (data.code === 0) {
      return data.data.taskId;
    }
    throw new Error(`任务创建失败: ${data.msg}`);
  }

  /**
   * 查询任务输出结果
   * @param {string} taskId - 任务ID
   * @returns {Promise<Array>} 任务结果数组
   */
  async queryTaskOutput(taskId) {
    const url = `${this.baseUrl}/task/openapi/outputs`;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        const { data } = await axios.post(url,
          {
            apiKey: this.apiKey,
            taskId: taskId
          },
          {
            headers: this.headers,
            timeout: 30000
          }
        );

        if (data.msg === "success" && data.code === 0) {
          return data.data;
        } else if (data.msg === "APIKEY_TASK_IS_RUNNING") {
          // 任务还在运行中，继续等待
          console.log(`⏳ 任务进行中... (尝试 ${attempt}/${this.maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, this.pollInterval));
        } else if (data.msg === "TASK_FAILED" || data.msg === "FAILED") {
          throw new Error(`任务失败: ${data.msg}`);
        } else {
          // 其他状态，继续等待
          console.log(`⏳ 等待任务完成... 状态: ${data.msg} (尝试 ${attempt}/${this.maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, this.pollInterval));
        }
      } catch (error) {
        // 网络错误或其他错误
        if (error.message.includes('任务失败')) {
          throw error; // 重新抛出任务失败错误
        }

        console.error(`❌ 查询任务输出失败 (尝试 ${attempt}/${this.maxAttempts}):`, error.message);

        // 如果还有重试机会，等待后重试
        if (attempt < this.maxAttempts) {
          console.log(`🔄 等待 ${this.pollInterval}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, this.pollInterval));
        } else {
          throw new Error(`查询任务输出失败: ${error.message}`);
        }
      }
    }

    throw new Error("任务超时：未在预期时间内完成");
  }

  /**
   * 运行工作流（完整流程：创建 -> 等待 -> 获取结果）
   * @param {Object} params - 任务参数（可选）
   * @returns {Promise<Object>} 包含任务ID和结果的对象
   */
  async runWorkflow(params = {}) {
    // 创建任务
    const taskId = await this.createTask(params);

    // 查询结果
    const results = await this.queryTaskOutput(taskId);

    return {
      taskId,
      results,
      // 便捷访问第一个输出文件
      fileUrl: results[0]?.fileUrl,
      consumeMoney: results[0]?.consumeMoney,
      taskCostTime: results[0]?.taskCostTime
    };
  }

  /**
   * 运行工作流并返回文件URL（最简单的用法）
   * @param {Object} params - 任务参数（可选）
   * @returns {Promise<string>} 输出文件URL
   */
  async runAndGetUrl(params = {}) {
    const result = await this.runWorkflow(params);
    return result.fileUrl;
  }
}

/**
 * 创建默认客户端实例
 * @param {Object} options - 配置选项
 * @returns {RunningHubClient}
 */
export function createClient(options) {
  return new RunningHubClient(options);
}
