// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const OPENROUTER_API_KEY = 'your_api_key'; // Thay key của bạn
const MODEL = 'google/gemma-3-27b-it:free'; // Model miễn phí

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log('API response:', data);

    if (data.error) {
      return res.json({ reply: `[Lỗi API]: ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || '[Không có phản hồi từ AI]';
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi gọi OpenRouter API.' });
  }
});

app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));
