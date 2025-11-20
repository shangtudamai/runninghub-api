/**
 * 示例2：检查账户余额
 */
import { RunningHubClient } from '../runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkBalance() {
  const client = new RunningHubClient({
    apiKey: process.env.ENTERPRISE_API_KEY
  });

  try {
    const status = await client.checkAccountStatus();

    console.log('====================================');
    console.log('📊 RunningHub 账户状态');
    console.log('====================================');
    console.log('💰 RH币余额:', status.remainCoins);
    console.log('💵 人民币余额:', status.remainMoney, status.currency);
    console.log('📈 当前任务数:', status.currentTaskCounts);
    console.log('🔑 API类型:', status.apiType);
    console.log('====================================');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

checkBalance();
