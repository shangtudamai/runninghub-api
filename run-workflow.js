/**
 * 示例5：命令行工具 - 快速运行工作流
 */
import { RunningHubClient } from './runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

// 解析命令行参数
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const command = args[0];
const workflowId = getArg('workflow') || process.env.WORKFLOW_ID;
const apiKey = getArg('apikey') || process.env.ENTERPRISE_API_KEY;

// 显示帮助信息
function showHelp() {
  console.log(`
RunningHub CLI - 命令行工具

用法:
  node run-workflow.js <command> [options]

命令:
  run         运行工作流
  status      检查账户状态
  query       查询任务结果

选项:
  --workflow=<id>    工作流ID（可选，默认使用.env中的配置）
  --apikey=<key>     API密钥（可选，默认使用.env中的配置）
  --task=<id>        任务ID（query命令必需）

示例:
  node run-workflow.js run
  node run-workflow.js run --workflow=1963972275496210433
  node run-workflow.js status
  node run-workflow.js query --task=1988271550107381762
`);
}

// 主函数
async function main() {
  if (!command || command === 'help' || command === '--help') {
    showHelp();
    return;
  }

  const client = new RunningHubClient({
    apiKey: apiKey,
    workflowId: workflowId
  });

  try {
    switch (command) {
      case 'run': {
        console.log('🚀 运行工作流...');
        const result = await client.runWorkflow();
        console.log('✅ 完成！');
        console.log('📝 任务ID:', result.taskId);
        console.log('🖼️ 输出文件:', result.fileUrl);
        console.log('💰 消费:', result.consumeMoney, '元');
        break;
      }

      case 'status': {
        const status = await client.checkAccountStatus();
        console.log('📊 账户状态:');
        console.log('  RH币余额:', status.remainCoins);
        console.log('  人民币余额:', status.remainMoney, status.currency);
        console.log('  API类型:', status.apiType);
        break;
      }

      case 'query': {
        const taskId = getArg('task');
        if (!taskId) {
          console.error('❌ 错误: 需要提供任务ID (--task=<id>)');
          process.exit(1);
        }
        console.log('🔍 查询任务:', taskId);
        const result = await client.queryTaskOutput(taskId);
        console.log('📦 结果:', result);
        break;
      }

      default:
        console.error('❌ 未知命令:', command);
        showHelp();
        process.exit(1);
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
