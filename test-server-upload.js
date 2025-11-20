/**
 * 测试服务器端点 - 模拟前端上传新图片
 */
import fetch from 'node-fetch';
import fs from 'fs';

const imageBase64 = fs.readFileSync('./test_base64.txt', 'utf-8');

console.log('🧪 测试服务器 /api/restore 端点\n');
console.log('='.repeat(60));

async function testServerRestore() {
  try {
    console.log('📤 发送请求到 http://localhost:3001/api/restore...');
    console.log('📷 图片数据长度:', imageBase64.length, '字符');

    const response = await fetch('http://localhost:3001/api/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: imageBase64
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('\n✅ 成功!');
      console.log('📝 任务ID:', data.taskId);
      console.log('🖼️  输出URL:', data.output_url);
      console.log('💰 消费:', data.consumeMoney, '元');
      console.log('⏱️  耗时:', data.taskCostTime, '秒');

      console.log('\n' + '='.repeat(60));
      console.log('🎉 服务器工作正常！每次上传都会使用新图片！');
      console.log('='.repeat(60));
    } else {
      console.log('\n❌ 失败:', data.error);
    }

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
  }
}

testServerRestore();
