import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // 关键步骤：把你的新 Key 粘贴在下面双引号中间
    const apiKey = "AIzaSyD......(粘贴你的新Key)"; 
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 解析数据
    let data = req.body;
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) {}
    }
    const { prompt } = data || {};
    
    if (!prompt) return res.status(400).json({ error: "无内容" });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error(error);
    // 把详细错误显示出来
    res.status(500).json({ error: error.message || "未知错误" });
  }
}