// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());

app.post('/sentiment', async (req, res) => {
  const { text } = req.body;
  const apiToken = process.env.HF_API_TOKEN;
  if (!apiToken) {
    return res.status(500).json({ error: 'Hugging Face API 토큰이 설정되어 있지 않습니다.' });
  }
  try {
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );
    const result = await hfResponse.json();
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    let sentimentLabel = '';
    if (Array.isArray(result) && result.length > 0 && result[0].label) {
      sentimentLabel = result[0].label.toLowerCase();
    }
    let tip = '';
    if (sentimentLabel === 'negative' || text.includes('스트레스')) {
      tip = "스트레스가 높습니다. 5분 호흡 운동을 시도해보세요.";
    } else if (sentimentLabel === 'positive' || text.includes('행복')) {
      tip = "행복한 기분을 유지하세요! 잠시 산책하며 기분 전환해보세요.";
    } else {
      tip = "몸과 마음 모두를 돌보세요. 간단한 스트레칭을 시도해보세요.";
    }
    res.json({ tip });
  } catch (error) {
    console.error('Express 서버 에러:', error);
    res.status(500).json({ error: '건강 팁을 생성하는 중 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`Express 서버가 포트 ${port}에서 실행 중입니다.`);
});
