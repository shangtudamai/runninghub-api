import React, { useState, useEffect } from "react";

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [balance, setBalance] = useState<any>(null);
  const [taskInfo, setTaskInfo] = useState<any>(null);

  // ✅ RunningHub 本地 API 地址
  const API_URL = "http://localhost:3001/api/restore";
  const BALANCE_URL = "http://localhost:3001/api/balance";

  // 加载账户余额
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(BALANCE_URL);
      const data = await response.json();
      if (data.success) {
        setBalance(data.data);
      }
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };

  // ✅ 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ✅ 点击修复按钮
  const handleRestore = async () => {
    if (!selectedFile) {
      alert("请先选择一张老照片！");
      return;
    }

    setLoading(true);
    setResultUrl(null);
    setErrorMsg(null);
    setDebugInfo(null);

    try {
      // 将图片转换为 Base64
      const reader = new FileReader();
      const base64Data: string = await new Promise((resolve) => {
        reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(selectedFile);
      });

      console.log("📤 正在上传至 API...");

      // ✅ 调用 Vercel API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data }),
      });

      const data = await response.json();
      console.log("📩 API 返回：", data);

      if (!response.ok) throw new Error(data.error || "服务器错误");

      if (data.output_url) {
        setResultUrl(data.output_url);
        setTaskInfo({
          taskId: data.taskId,
          consumeMoney: data.consumeMoney,
          taskCostTime: data.taskCostTime
        });
        // 刷新余额
        fetchBalance();
      } else {
        setErrorMsg("⚠️ 修复成功，但未返回图片链接。");
      }

      // ✅ 显示完整调试信息
      if (data.debug_raw) {
        setDebugInfo(data.debug_raw);
      }
    } catch (err: any) {
      console.error("❌ 出错：", err);
      setErrorMsg(err.message || "修复失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">AI 老照片修复体验站（RunningHub版）</h1>
      <p className="text-gray-600 mb-2">上传一张老照片，AI 将帮你修复它。</p>

      {/* 账户余额显示 */}
      {balance && (
        <div className="mb-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
          💰 余额: {balance.remainCoins} RH币 + {balance.remainMoney} {balance.currency}
          {' '} | 📊 API: {balance.apiType}
        </div>
      )}

      {/* 上传区域 */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white w-full max-w-md cursor-pointer"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {imagePreview ? (
          <img src={imagePreview} alt="预览图" className="rounded-lg max-h-64 mx-auto" />
        ) : (
          <p className="text-gray-400">点击或拖拽图片到此上传</p>
        )}
      </div>

      {/* 修复按钮 */}
      <button
        onClick={handleRestore}
        disabled={loading || !selectedFile}
        className={`mt-6 px-6 py-3 rounded-lg text-white text-lg ${
          loading || !selectedFile
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "🪄 正在修复中..." : "开始修复"}
      </button>

      {/* 错误信息 */}
      {errorMsg && <p className="text-red-500 mt-4">{errorMsg}</p>}

      {/* 修复后图片 */}
      {resultUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-3">✅ 修复完成</h2>
          <img
            src={resultUrl}
            alt="修复后"
            className="rounded-lg shadow-md max-h-80 mx-auto"
          />

          {/* 任务信息 */}
          {taskInfo && (
            <div className="mt-4 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg inline-block">
              <span className="mr-3">📝 任务ID: {taskInfo.taskId}</span>
              <span className="mr-3">💰 消费: {taskInfo.consumeMoney}元</span>
              <span>⏱️ 耗时: {taskInfo.taskCostTime}秒</span>
            </div>
          )}

          {/* 下载按钮 */}
          <div className="mt-4">
            <a
              href={resultUrl}
              download="restored-photo.png"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              下载修复后的图片
            </a>
          </div>
        </div>
      )}

      {/* ✅ 调试信息展示区域 */}
      {debugInfo && (
        <div className="mt-10 bg-gray-100 text-left p-4 rounded-lg w-full max-w-2xl overflow-auto text-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">🔍 调试信息（RunningHub 原始返回）</h3>
          <pre className="whitespace-pre-wrap break-words text-gray-800">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
