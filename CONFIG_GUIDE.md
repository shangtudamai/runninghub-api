# 🛠️ 工作流API配置指南

## 📍 配置文件位置

所有的工作流API配置都在这些文件中，你可以随时修改：

---

## 1️⃣ `.env` - 主要配置文件 ⭐

**位置**: `C:\runninghub-test\.env`

这是**最重要**的配置文件，包含：

```env
# API密钥（在RunningHub个人中心获取）
ENTERPRISE_API_KEY=你的API密钥

# 工作流ID（在工作流详情页面的URL中）
WORKFLOW_ID=你的工作流ID

# 节点ID（默认2，可以修改）
NODE_ID=2

# 服务器端口（可选，默认3001）
PORT=3001
```

**修改方法：**
- 直接编辑这个文件
- 修改后**重启服务器**才会生效
- `npm run server` 停止后重新运行

---

## 2️⃣ `server.js` - 服务器代码

**位置**: `C:\runninghub-test\server.js`

**第24-25行** - 节点ID配置：
```javascript
// 节点ID配置（已验证：nodeId=2, fieldName=image 可以正常工作）
const NODE_ID = process.env.NODE_ID || "2";  // LoadImage节点ID
```

**第56-64行** - 工作流参数配置：
```javascript
const result = await client.runWorkflow({
  nodeInfoList: [
    {
      nodeId: NODE_ID,        // ← 修改节点ID
      fieldName: "image",     // ← 修改字段名
      fieldValue: fileName    // ← 修改传递的值
    }
  ]
});
```

**修改方法：**
- 编辑这个文件
- 保存后**重启服务器**

---

## 3️⃣ `runninghub-client.js` - API客户端库

**位置**: `C:\runninghub-test\runninghub-client.js`

**第10行** - API基础URL：
```javascript
this.baseUrl = options.baseUrl || "https://www.runninghub.cn";
```

**第11-12行** - 超时配置：
```javascript
this.maxAttempts = options.maxAttempts || 60;      // 最多查询次数
this.pollInterval = options.pollInterval || 5000;  // 查询间隔(毫秒)
```

**修改方法：**
- 编辑这个文件
- 如果修改API端点，需要重启服务器

---

## 📝 常见修改场景

### 🔄 场景1: 更换工作流

**步骤：**
1. 在RunningHub上创建或选择新工作流
2. 复制工作流ID（在URL中）
3. 修改 `.env` 中的 `WORKFLOW_ID`
4. 重启服务器

```bash
# 停止服务器 (Ctrl+C)
# 然后重新启动
npm run server
```

---

### 🔢 场景2: 修改节点ID或字段名

**方法1：通过 .env（推荐）**
```env
NODE_ID=598  # 改成你的节点ID
```

**方法2：直接修改 server.js**

找到第56-64行，修改：
```javascript
const result = await client.runWorkflow({
  nodeInfoList: [
    {
      nodeId: "你的节点ID",    // 比如 "598"
      fieldName: "你的字段名",  // 比如 "upload"
      fieldValue: fileName
    }
  ]
});
```

---

### 🔑 场景3: 更换API密钥

修改 `.env` 中的：
```env
ENTERPRISE_API_KEY=你的新API密钥
```

重启服务器。

---

### 🔌 场景4: 修改服务器端口

**步骤1：** 修改 `.env`
```env
PORT=3002  # 改成你想要的端口
```

**步骤2：** 同时修改前端调用地址

在 `test-page.html` 中（第113行）：
```javascript
const response = await fetch('http://localhost:3002/api/restore', {
```

在 `Home.tsx` 中（约第XX行）：
```typescript
const response = await fetch('http://localhost:3002/api/restore', {
```

---

## 🎯 如何找到节点ID和字段名？

### 方法1：使用测试脚本（推荐）

我创建了 `test-field-names.js`，可以自动测试：

```bash
node test-field-names.js
```

会测试常见的字段名组合，找到正确的配置。

### 方法2：在RunningHub编辑器中查看

1. 打开你的工作流
2. 右键点击接收图片的节点
3. 查看节点属性
4. 记下：
   - 节点ID（比如 "2" 或 "598"）
   - 字段名（比如 "image" 或 "upload"）

---

## 📦 配置文件优先级

```
1. .env 文件（最高优先级）
   ↓
2. server.js 中的默认值
   ↓
3. runninghub-client.js 中的默认值
```

**建议：**
- 日常修改用 `.env`
- 特殊需求修改 `server.js`
- API端点等底层配置修改 `runninghub-client.js`

---

## 🚀 快速修改步骤

### 最快速的方式（90%的情况）：

1. **编辑 `.env` 文件**
   ```bash
   # 用记事本或VS Code打开
   notepad .env
   ```

2. **修改你需要的参数**
   ```env
   WORKFLOW_ID=新的工作流ID
   NODE_ID=新的节点ID
   ```

3. **保存文件**

4. **重启服务器**
   ```bash
   # 先停止（Ctrl+C）
   # 再启动
   npm run server
   ```

5. **测试**
   ```bash
   node test-server-upload.js
   ```

---

## 🔍 测试工具

我为你准备了这些测试脚本：

| 脚本 | 用途 |
|------|------|
| `test-server-upload.js` | 测试服务器是否正常 |
| `test-correct-upload.js` | 测试正确的上传流程 |
| `test-field-names.js` | 自动测试不同的节点配置 |
| `test-node-598.js` | 测试特定节点 |

---

## 💡 实用技巧

### 技巧1：测试新配置

修改配置后，先用测试脚本验证：
```bash
node test-server-upload.js
```

### 技巧2：保留配置备份

修改前复制一份 `.env`：
```bash
copy .env .env.backup
```

### 技巧3：查看服务器日志

服务器运行时会显示详细日志：
- 上传的文件名
- 使用的节点配置
- 任务ID和结果

这些日志帮助你调试问题。

---

## ❓ 常见问题

### Q: 修改后没有生效？
**A:** 确保重启了服务器（Ctrl+C 然后 `npm run server`）

### Q: 如何知道工作流ID？
**A:** 在RunningHub网页上打开工作流，URL中就有ID

### Q: 节点ID在哪里看？
**A:** 用 `test-field-names.js` 自动测试，或在编辑器右键节点查看

### Q: 可以同时运行多个工作流吗？
**A:** 可以！创建不同的 RunningHubClient 实例，传入不同的 workflowId

---

## 📚 相关文件

- `README.md` - API使用文档
- `INTEGRATION.md` - 集成文档
- `START.md` - 快速启动指南

---

**🎉 现在你可以自己动手修改工作流配置了！**
