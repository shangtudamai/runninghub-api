/**
 * 示例3：批量运行多个工作流
 */
import { RunningHubClient } from '../runninghub-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function batchProcess() {
  // 定义多个工作流
  const workflows = [
    { id: process.env.WORKFLOW_ID, name: '工作流1' },
    // 可以添加更多工作流
    // { id: '另一个工作流ID', name: '工作流2' },
  ];

  const results = [];

  for (const workflow of workflows) {
    console.log(`\n🚀 运行: ${workflow.name}`);

    const client = new RunningHubClient({
      apiKey: process.env.ENTERPRISE_API_KEY,
      workflowId: workflow.id
    });

    try {
      const result = await client.runWorkflow();
      console.log(`✅ ${workflow.name} 完成`);
      console.log(`   文件: ${result.fileUrl}`);

      results.push({
        workflow: workflow.name,
        success: true,
        fileUrl: result.fileUrl,
        cost: result.consumeMoney
      });

    } catch (error) {
      console.error(`❌ ${workflow.name} 失败:`, error.message);
      results.push({
        workflow: workflow.name,
        success: false,
        error: error.message
      });
    }
  }

  // 汇总结果
  console.log('\n====================================');
  console.log('📋 批量处理结果汇总');
  console.log('====================================');

  const successCount = results.filter(r => r.success).length;
  const totalCost = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + parseFloat(r.cost || 0), 0);

  console.log(`✅ 成功: ${successCount}/${results.length}`);
  console.log(`💰 总消费: ${totalCost.toFixed(3)} 元`);

  console.log('\n详细结果:');
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.workflow}: ${r.success ? '✅' : '❌'}`);
    if (r.success) {
      console.log(`   ${r.fileUrl}`);
    } else {
      console.log(`   ${r.error}`);
    }
  });
}

batchProcess();
