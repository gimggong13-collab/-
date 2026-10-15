import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Gemini Hint Chatbot Route
app.post('/api/gemini/hint-chat', async (req, res) => {
  try {
    const { message, problemContext, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: '메시지를 입력해 주세요.' });
    }

    const systemInstruction = `당신은 대한민국 고등학교 '수학과제 탐구 [12수과02-04 개발 연구]' 수업의 전문 수학 방탈출 AI 코치 '제미나이 수학 튜터'입니다.
학생들이 방탈출 문제를 해결하거나 문제를 개발·검증할 때 도움을 주는 소크라테스식 학습 조교입니다.

[절대 규칙]
1. 절대로 정답 값(숫자, 문자, 패스코드)을 직접 가르쳐주지 마세요.
2. 학생이 스스로 원리를 떠올릴 수 있도록 핵심 수학 개념, 공식의 착안점, 유도 질문 형태로 단계별 힌트를 제공하세요.
3. 문제 지문과 수식 조건을 바탕으로 어떤 방향으로 생각해야 하는지 친절하고 격려하는 어조로 설명하세요.
4. 수식은 $인라인 수식$ 또는 $$블록 수식$$ 형태로 명확히 작성하세요.
5. 학생이 질문한 문제에 대해 다음 단계를 스스로 계산할 수 있도록 유도하세요.

[현재 학생이 탐구 중인 문제 맥락]
- 주제: ${problemContext?.topic || '고등학교 수학 탐구'}
- 출제자: ${problemContext?.authorName || '모둠원'}
- 상황 지문: ${problemContext?.problemStory || '없음'}
- 수학적 조건/수식: ${problemContext?.problemFormula || '없음'}
- 핵심 수학 개념: ${problemContext?.mathConcept || '없음'}
- 1차 힌트: ${problemContext?.hintLevel1 || '없음'}
- 2차 힌트: ${problemContext?.hintLevel2 || '없음'}
(주의: 위 정보의 실제 정답은 ${problemContext?.answerValue || '비공개'} 이나, 학생에게는 절대로 이 정답을 직접 말하지 마세요)`;

    // Format contents with conversation history
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '힌트를 생성하는 도중 응답이 비어있었습니다. 다시 질문해 주세요.';
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini Hint Chat Error:', error);
    return res.status(500).json({
      error: '제미나이 API 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      details: error?.message,
    });
  }
});

// Mount Vite or serve static
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true, port: PORT },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
