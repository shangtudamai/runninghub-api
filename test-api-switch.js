/**
 * 测试API切换 - 验证企业级和消费级API
 */
import { RunningHubClient } from './runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAPI(apiType, apiKey) {
  console.log(`\n🧪 测试 ${apiType} API...`);
  console.log('='.repeat(60));

  if (!apiKey) {
    console.log(`❌ ${apiType} API Key 未配置`);
    return false;
  }

  console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);

  const client = new RunningHubClient({
    apiKey: apiKey,
    workflowId: process.env.WORKFLOW_ID
  });

  try {
    const status = await client.checkAccountStatus();
    console.log(`✅ ${apiType} API 可用`);
    console.log(`💰 余额: ${status.remainCoins} RH币 + ${status.remainMoney} ${status.currency}`);
    console.log(`📊 API类型: ${status.apiType}`);
    console.log(`👤 用户ID: ${status.userId}`);
    return true;
  } catch (error) {
    console.log(`❌ ${apiType} API 失败:`, error.message);
    return false;
  }
}

async function main() {
  console.log('\n🔄 API切换测试工具');
  console.log('='.repeat(60));
  console.log('📝 当前配置:');
  console.log(`   WORKFLOW_ID: ${process.env.WORKFLOW_ID}`);
  console.log(`   NODE_ID: ${process.env.NODE_ID || '2'}`);
  console.log('='.repeat(60));

  // 测试企业级API
  const enterpriseOK = await testAPI('企业级', process.env.ENTERPRISE_API_KEY);

  // 等待一下
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 测试消费级API
  const consumerOK = await testAPI('消费级', process.env.CONSUMER_API_KEY);

  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  console.log(`企业级API: ${enterpriseOK ? '✅ 可用' : '❌ 不可用'}`);
  console.log(`消费级API: ${consumerOK ? '✅ 可用' : '❌ 不可用'}`);
  console.log('='.repeat(60));

  if (enterpriseOK && consumerOK) {
    console.log('\n💡 两种API都可用！');
    console.log('\n📝 切换方法：');
    console.log('1. 打开 server.js');
    console.log('2. 找到第20行');
    console.log('3. 修改 apiKey 配置：');
    console.log('   - 使用企业级: process.env.ENTERPRISE_API_KEY');
    console.log('   - 使用消费级: process.env.CONSUMER_API_KEY');
    console.log('4. 保存并重启服务器');
  } else if (enterpriseOK) {
    console.log('\n✅ 企业级API可用（当前使用中）');
  } else if (consumerOK) {
    console.log('\n💡 只有消费级API可用');
    console.log('建议在 server.js 中切换到消费级API');
  } else {
    console.log('\n❌ 两种API都不可用，请检查API Key配置');
  }

  console.log('\n📖 详细切换指南请查看: API_SWITCH_GUIDE.md');
}

main();
