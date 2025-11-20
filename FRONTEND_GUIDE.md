# 🎨 前端设计修改指南

## 📍 前端文件位置

项目中有两个前端页面，根据你的需求选择修改：

---

## 1️⃣ test-page.html - 独立测试页面 ⭐ 推荐

**文件路径**: `C:\runninghub-test\test-page.html`

### 📐 页面结构

```
第11行  - 标题
第12行  - 副标题
第14-15行 - 余额显示区
第18-31行 - 图片上传区域
第34-40行 - 修复按钮
第42-43行 - 错误信息
第46-65行 - 结果展示区
第68-71行 - 调试信息区
```

### 🎨 常见设计修改

#### 修改标题和副标题（第11-12行）
```html
<h1 class="text-2xl font-semibold mb-2">你的标题</h1>
<p class="text-gray-600 mb-2">你的副标题</p>
```

#### 修改上传区域样式（第18-31行）
```html
<div
  id="uploadArea"
  class="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white w-full max-w-md"
>
```
可以修改：
- `border-gray-300` → `border-blue-500` (边框颜色)
- `rounded-xl` → `rounded-3xl` (圆角大小)
- `p-8` → `p-12` (内边距)
- `max-w-md` → `max-w-lg` (最大宽度)

#### 修改按钮样式（第34-40行）
```html
<button
  id="restoreBtn"
  class="mt-6 px-6 py-3 rounded-lg text-white text-lg bg-gray-400"
>
  选择图片后开始
</button>
```
可以修改：
- `bg-gray-400` → `bg-purple-500` (背景颜色)
- `rounded-lg` → `rounded-full` (圆形按钮)
- `px-6 py-3` → `px-8 py-4` (按钮大小)
- 按钮文字

#### 修改配色方案

在第113行的激活状态：
```javascript
btn.className = "mt-6 px-6 py-3 rounded-lg text-white text-lg bg-blue-600 hover:bg-blue-700";
```
可以改成：
```javascript
btn.className = "mt-6 px-6 py-3 rounded-lg text-white text-lg bg-green-600 hover:bg-green-700";
```

### 🚀 测试修改

1. 用记事本或VS Code打开 `test-page.html`
2. 修改你想要的部分
3. 保存文件
4. 刷新浏览器页面
5. 立即看到效果！

---

## 2️⃣ Home.tsx - React组件

**文件路径**: `C:\runninghub-test\Home.tsx`

### 📐 组件结构

```
第106行  - 标题
第107行  - 副标题
第110-115行 - 余额显示
第118-134行 - 上传区域
第137-147行 - 修复按钮
第150行  - 错误信息
第153-183行 - 结果展示
第187-194行 - 调试信息
```

### 🎨 常见设计修改

#### 修改标题（第106-107行）
```tsx
<h1 className="text-2xl font-semibold mb-2">你的标题</h1>
<p className="text-gray-600 mb-2">你的副标题</p>
```

#### 修改上传区域（第118-134行）
```tsx
<div
  className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white w-full max-w-md"
>
```

#### 修改按钮样式（第137-147行）
```tsx
className={`mt-6 px-6 py-3 rounded-lg text-white text-lg ${
  loading || !selectedFile
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700"  // ← 修改这里的颜色
}`}
```

### 📝 注意事项

- React组件需要在React项目中运行
- 修改后需要重新编译
- 使用 `className` 而不是 `class`

---

## 🎨 Tailwind CSS 样式速查

### 颜色
```
bg-gray-50   - 浅灰背景
bg-blue-600  - 蓝色
bg-green-600 - 绿色
bg-red-500   - 红色
bg-purple-600 - 紫色
```

### 圆角
```
rounded      - 小圆角
rounded-lg   - 中等圆角
rounded-xl   - 大圆角
rounded-full - 完全圆形
```

### 间距
```
p-4   - 内边距
m-4   - 外边距
px-6  - 左右内边距
py-3  - 上下内边距
```

### 文字
```
text-sm   - 小字体
text-lg   - 大字体
text-2xl  - 超大字体
font-semibold - 半粗体
```

### 边框
```
border-2              - 边框宽度
border-gray-300       - 边框颜色
border-dashed         - 虚线边框
hover:border-blue-400 - 鼠标悬停效果
```

---

## 📝 快速修改示例

### 示例1: 改变主色调为绿色

**在 test-page.html 中：**

找到第113行，改为：
```javascript
btn.className = "mt-6 px-6 py-3 rounded-lg text-white text-lg bg-green-600 hover:bg-green-700";
```

找到第60行，改为：
```html
class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
```

### 示例2: 增大上传区域

找到第20行，改为：
```html
class="border-2 border-dashed border-gray-300 rounded-xl p-12 bg-white w-full max-w-lg cursor-pointer hover:border-blue-400"
```

### 示例3: 修改标题

找到第11行，改为：
```html
<h1 class="text-3xl font-bold mb-4 text-blue-600">我的AI照片修复工具</h1>
```

---

## 🎯 推荐修改流程

### 对于 test-page.html（最简单）

1. **打开文件**
   ```bash
   notepad test-page.html
   # 或用 VS Code
   code test-page.html
   ```

2. **修改设计**
   - 改标题（第11-12行）
   - 改颜色（搜索 `bg-blue-` 替换为其他颜色）
   - 改大小（修改 `max-w-` 类）

3. **保存并测试**
   - 保存文件
   - 刷新浏览器
   - 立即看到效果

4. **如果不满意**
   - 按 Ctrl+Z 撤销
   - 继续修改

---

## 🛠️ 实用工具

### Tailwind CSS 文档
https://tailwindcss.com/docs

### 颜色选择器
https://tailwindcss.com/docs/customizing-colors

### Tailwind CSS Playground
https://play.tailwindcss.com/

---

## 💡 设计建议

1. **保持一致性**
   - 统一使用一种主色调（如蓝色、绿色）
   - 按钮、链接使用相同的样式

2. **增加交互反馈**
   - 使用 `hover:` 效果
   - 添加过渡动画 `transition duration-300`

3. **响应式设计**
   - 文件已经使用了 `max-w-md`、`max-w-2xl` 等
   - 在手机上也能正常显示

4. **可访问性**
   - 保持足够的颜色对比度
   - 按钮要有清晰的状态

---

## ⚠️ 注意事项

1. **test-page.html 使用 CDN**
   - 不需要安装 Tailwind
   - 直接修改 class 即可

2. **保持服务器地址正确**
   - 第75行: `const API_URL = "http://localhost:3001/api/restore";`
   - 如果修改端口，这里也要改

3. **备份文件**
   ```bash
   copy test-page.html test-page.backup.html
   ```

---

## 🎉 开始修改吧！

推荐从 `test-page.html` 开始，这是最容易修改和测试的！

**快速测试流程：**
1. 打开 `test-page.html` 编辑
2. 修改一些样式
3. 保存
4. 刷新浏览器
5. 看效果！

有问题随时问我！
