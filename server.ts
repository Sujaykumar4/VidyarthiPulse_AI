import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { db } from "./src/db/index.ts";
import { analysisHistory } from "./src/db/schema.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      res.json(user);
    } catch (error: any) {
      console.error("Sync error:", error);
      res.status(500).json({ error: "Failed to sync user" });
    }
  });

  app.post("/api/analyze-crop", async (req: AuthRequest, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(401).json({ error: "Missing Gemini API Key. Please provide one in Settings." });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are VidyarthiPulse AI, a personal AI tutor for Indian students.
Inspect this image of a book, notes, or a student's handwritten doubt. Identify the subject, topic, explain the core concept simply, and create a short live quiz question to test understanding.

Return ONLY the following exact JSON block with no wrapping markdown formatting:
{
  "topic": "E.g. Newton's Second Law",
  "subject": "E.g. Physics",
  "gradeLevel": "E.g. Class 9",
  "estimatedTime": "E.g. 5 Mins to Learn",
  "studyDashboard": {
    "concept": "Simple 1-line explanation of the concept",
    "formula": "Any key formula, fact, or trick to remember",
    "quizQuestion": "A quick multiple choice or simple question to test them",
    "quizAnswer": "The answer to the quiz question"
  },
  "explanationEnglish": "A highly encouraging, easy-to-understand step-by-step explanation of the doubt in plain text (NO MARKDOWN), ready to be sent to the student on WhatsApp."
}`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
              parts: [
                  { text: prompt },
                  {
                      inlineData: {
                          data: imageBase64,
                          mimeType: mimeType || 'image/jpeg'
                      }
                  }
              ]
          },
          config: {
              responseMimeType: "application/json",
          }
        });
      } catch (genError: any) {
        if (genError.message && genError.message.includes('503')) {
          throw new Error("The AI model is currently experiencing high demand. Please try again in a few moments.");
        }
        throw genError;
      }

      const text = response.text;
      if (!text) {
          throw new Error("No analysis received from Gemini Vision.");
      }
      
      const parsedCrop = JSON.parse(text.trim());
      res.json(parsedCrop);

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze crop image." });
    }
  });

  app.post("/api/analyze-voice", async (req: AuthRequest, res) => {
    try {
      const { transcript } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(401).json({ error: "Missing Gemini API Key. Please provide one in Settings." });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are VidyarthiPulse AI, a personal AI tutor for Indian students.
The user is a student who just spoke this doubt using voice input: "${transcript}"

Extract the educational details from this speech. Identify the subject, topic, explain the core concept simply, and create a short live quiz question to test understanding.

Return ONLY the following exact JSON block with no wrapping markdown formatting:
{
  "topic": "E.g. Photosynthesis",
  "subject": "E.g. Biology",
  "gradeLevel": "E.g. Class 10",
  "estimatedTime": "E.g. 5 Mins to Learn",
  "studyDashboard": {
    "concept": "Simple 1-line explanation of the concept",
    "formula": "Any key formula, fact, or trick to remember",
    "quizQuestion": "A quick multiple choice or simple question to test them",
    "quizAnswer": "The answer to the quiz question"
  },
  "explanationEnglish": "A highly encouraging, easy-to-understand step-by-step explanation of the doubt in plain text (NO MARKDOWN), ready to be sent to the student on WhatsApp."
}`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
          }
        });
      } catch (genError: any) {
        if (genError.message && genError.message.includes('503')) {
          throw new Error("The AI model is currently experiencing high demand. Please try again in a few moments.");
        }
        throw genError;
      }

      const text = response.text;
      if (!text) {
          throw new Error("No analysis received from Gemini.");
      }
      
      const parsedCrop = JSON.parse(text.trim());
      parsedCrop.image = "https://images.unsplash.com/photo-1595856427503-46788e04e0e5?w=800&auto=format&fit=crop&q=80"; // Harvest field placeholder
      res.json(parsedCrop);

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze voice input." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
