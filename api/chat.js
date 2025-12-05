import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 允许跨域调用
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // ⚠️ 请在这里填入你的 API Key (保留双引号)
    const apiKey = "AIza..."; 
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 解析数据
    let data = req.body;
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) {}
    }
    const { prompt } = data || {};
    
    if (!prompt) return res.status(400).json({ error: "无内容" });

    // ★★★ 核心修改：定义人设 (System Prompt) ★★★
    // 你可以随意修改下面这段文字，把它变成你想要的样子
    const persona = `
      你是一位精通泰国佛教文化、佛牌鉴赏、法事仪轨以及运势解析的“泰佛大师”。
      
      请遵守以下规则：
      1. 语气风格：庄重、慈悲、神秘，略带一点古风，像一位得道高僧。
      2. 知识领域：专注于回答关于泰国佛牌、刺符、转运法事、解梦和运势的问题。
      3. 拒绝无关话题：如果用户问编程、数学或娱乐八卦，请用慈悲的语气婉拒，并引导回佛学话题（例如：“施主，世间万物皆有定数，不如让我们来探讨一下您最近的运势...”）。
      4. 回答简练有深度，如果是解梦，请给出吉凶暗示。
    `;

    // 将人设和用户的问题组合在一起
    const finalPrompt = `${persona}\n\n用户的问题是：${prompt}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "未知错误" });
  }
}
