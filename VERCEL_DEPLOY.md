# 部署到 Vercel 指南

## 📋 部署前准备

1. 注册 Vercel 账号：https://vercel.com/signup
2. 安装 Git（如果还没有）
3. 准备好你的 RunningHub API 密钥

## 🚀 部署步骤

### 方法一：通过 Vercel CLI（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **在项目目录执行部署**
   ```bash
   cd C:\runninghub-test
   vercel
   ```

4. **按提示操作**
   - Set up and deploy? → Yes
   - Which scope? → 选择你的账号
   - Link to existing project? → No
   - What's your project's name? → runninghub-photo-restore (或其他名字)
   - In which directory is your code located? → ./
   - Want to override the settings? → No

5. **配置环境变量**

   部署完成后，在 Vercel 网站上配置环境变量：

   - 访问：https://vercel.com/dashboard
   - 选择你的项目
   - 进入 Settings → Environment Variables
   - 添加以下变量：
     - `ENTERPRISE_API_KEY` = `01636845dc98444882a6cac2680d65cb`
     - `WORKFLOW_ID` = `1988307311074697218`
     - `NODE_ID` = `2`

6. **重新部署**
   ```bash
   vercel --prod
   ```

### 方法二：通过 GitHub + Vercel 网站

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建新仓库（可以是私有的）

2. **上传代码到 GitHub**
   ```bash
   cd C:\runninghub-test
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 访问 https://vercel.com/new
   - 选择 "Import Git Repository"
   - 授权访问你的 GitHub
   - 选择刚才创建的仓库
   - 点击 Import

4. **配置项目**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (留空)
   - Output Directory: public

5. **配置环境变量**（同方法一步骤5）

6. **点击 Deploy**

## ✅ 部署完成后

部署成功后，你会获得一个 URL，例如：
- `https://runninghub-photo-restore.vercel.app`

访问这个 URL 就可以使用你的老照片修复应用了！

## 🔧 本地测试

在部署前，你可以本地测试 Vercel 环境：

```bash
npm install -g vercel
vercel dev
```

这会在 http://localhost:3000 启动一个本地 Vercel 开发服务器。

## 📁 项目结构

```
runninghub-test/
├── api/                    # Vercel Serverless Functions
│   ├── restore.js         # 图片修复 API
│   ├── balance.js         # 余额查询 API
│   └── health.js          # 健康检查 API
├── lib/                    # 共享库
│   └── runninghub-client.js  # RunningHub 客户端
├── public/                 # 静态文件
│   └── index.html         # 前端页面
├── vercel.json            # Vercel 配置
└── package.json           # 依赖配置
```

## 🐛 常见问题

### 1. 部署后 API 报错
- 检查环境变量是否正确配置
- 查看 Vercel 的 Logs 获取详细错误信息

### 2. CORS 错误
- API 函数已经配置了 CORS，如果还有问题，检查 Vercel 日志

### 3. 超时错误
- Vercel 免费版函数执行时间限制为 10 秒
- 如果图片处理时间过长，考虑升级到 Pro 版本

## 📞 获取帮助

- Vercel 文档：https://vercel.com/docs
- RunningHub 文档：https://www.runninghub.cn

## 🔐 安全提示

- **不要**将 `.env` 文件提交到 Git
- **不要**在前端代码中硬编码 API 密钥
- 使用 Vercel 的环境变量功能管理敏感信息
