import dotenv from "dotenv";

dotenv.config();

const consumerApiKey = process.env.CONSUMER_API_KEY;
const enterpriseApiKey = process.env.ENTERPRISE_API_KEY;
const workflowId = process.env.WORKFLOW_ID;

console.log("🔍 检查API Key格式:\n");

console.log("消费级API Key:");
console.log(`  原始值: "${consumerApiKey}"`);
console.log(`  长度: ${consumerApiKey?.length || 0}`);
console.log(`  包含空格: ${consumerApiKey?.includes(' ') ? '是 ⚠️' : '否 ✅'}`);
console.log(`  包含换行: ${consumerApiKey?.includes('\n') ? '是 ⚠️' : '否 ✅'}`);
console.log(`  首尾空格: ${consumerApiKey !== consumerApiKey?.trim() ? '是 ⚠️' : '否 ✅'}`);

console.log("\n企业级API Key:");
console.log(`  原始值: "${enterpriseApiKey}"`);
console.log(`  长度: ${enterpriseApiKey?.length || 0}`);
console.log(`  包含空格: ${enterpriseApiKey?.includes(' ') ? '是 ⚠️' : '否 ✅'}`);
console.log(`  包含换行: ${enterpriseApiKey?.includes('\n') ? '是 ⚠️' : '否 ✅'}`);
console.log(`  首尾空格: ${enterpriseApiKey !== enterpriseApiKey?.trim() ? '是 ⚠️' : '否 ✅'}`);

console.log("\n工作流ID:");
console.log(`  原始值: "${workflowId}"`);
console.log(`  长度: ${workflowId?.length || 0}`);

console.log("\n💡 下一步:");
console.log("1. 请登录 https://www.runninghub.cn");
console.log("2. 进入 '个人中心' 或 '设置' 页面");
console.log("3. 找到 'API Key' 或 'API设置' 选项");
console.log("4. 确认你复制的key是否正确");
console.log("5. 如果有疑问，可以截图显示API key获取页面（遮挡敏感信息）");
