import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Portfolio Analysis
  app.post("/api/analyze-portfolio", async (req, res) => {
    try {
      const { holdings, totalValue, totalCost, totalProfit, returnRate, sectorTotals } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured.",
          fallback: true
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
당신은 월스트리트 수석 포트폴리오 매니저이자 수석 퀀트 애널리스트입니다.
아래의 사용자의 주식 포트폴리오 데이터를 바탕으로 전문적이고 깊이 있는 분석과 자산 리밸런싱/투자 추천 리포트를 한국어로 작성해주세요.

[포트폴리오 요약 데이터]
- 총 평가 자산: $${Number(totalValue || 0).toLocaleString()}
- 총 투자 원금: $${Number(totalCost || 0).toLocaleString()}
- 총 평가 손익: $${Number(totalProfit || 0).toLocaleString()} (${Number(returnRate || 0).toFixed(2)}%)
- 섹터별 비중:
  * IT: $${Number(sectorTotals?.IT || 0).toLocaleString()}
  * 바이오: $${Number(sectorTotals?.바이오 || 0).toLocaleString()}
  * 에너지: $${Number(sectorTotals?.에너지 || 0).toLocaleString()}
  * 소비재: $${Number(sectorTotals?.소비재 || 0).toLocaleString()}
- 보유 종목 리스트:
${JSON.stringify(holdings || [], null, 2)}

[요청 사항]
1. 포트폴리오 종합 건강도 평가 (100점 만점 스코어 및 등급)
2. 4대 섹터(IT, 바이오, 에너지, 소비재) 분산 상태 및 리스크 진단
3. 종목별 성과 분석 (수익 견인 종목 및 부진 종목 진단)
4. 구체적인 리밸런싱 및 종목 추천 전략 (추가 매수, 비중 축소, 신규 편입 추천 등)
5. 월스트리트 관점의 전문적인 투자 조언

반드시 마크다운 형식으로 깔끔하게 정리하여 답변해주세요.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI analysis" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wall Street Portfolio Server running on port ${PORT}`);
  });
}

startServer();
