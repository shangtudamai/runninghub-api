/**
 * Vercel Serverless Function - 健康检查
 */
export default async function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'RunningHub API Server is running on Vercel',
    timestamp: new Date().toISOString()
  });
}
