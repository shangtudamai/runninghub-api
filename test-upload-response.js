/**
 * 测试图片上传API的完整返回
 */
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ENTERPRISE_API_KEY;
const imageBase64 = fs.readFileSync('./test_base64.txt', 'utf-8');

console.log('🧪 测试图片上传API的完整返回...\n');

async function testUpload() {
  const url = 'https://www.runninghub.cn/task/openapi/upload';

  // 将Base64转换为Buffer
  const buffer = Buffer.from(imageBase64, 'base64');

  const formData = new FormData();
  formData.append('file', buffer, {
    filename: 'test.png',
    contentType: 'image/png'
  });
  formData.append('apiKey', apiKey);
  formData.append('fileType', 'image');

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: formData.getHeaders()
  });

  const data = await response.json();

  console.log('📦 完整响应:');
  console.log(JSON.stringify(data, null, 2));

  if (data.code === 0) {
    console.log('\n✅ 上传成功!');
    console.log('📝 返回的字段:');
    console.log('   fileName:', data.data.fileName);

    // 检查是否还有其他字段
    console.log('\n🔍 data对象的所有字段:');
    Object.keys(data.data).forEach(key => {
      console.log(`   ${key}:`, data.data[key]);
    });

    // 尝试构造可能的完整URL
    console.log('\n💡 可能的完整路径格式:');
    console.log('   1. 直接使用:', data.data.fileName);
    console.log('   2. 加前缀:', `https://www.runninghub.cn/${data.data.fileName}`);
    console.log('   3. 加存储前缀:', `https://rh-images.xiaoyaoyou.com/${data.data.fileName}`);
  }
}

testUpload();
