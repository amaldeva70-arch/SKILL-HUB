export interface AiResponse {
  text: string;
  isFallback: boolean;
  source: string;
}

export class AiService {
  /**
   * Check if Gemini API is available on the server
   */
  public static async checkHealth(): Promise<{ hasGeminiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        return { hasGeminiKey: Boolean(data.hasGeminiKey) };
      }
    } catch {
      // offline or server starting
    }
    return { hasGeminiKey: false };
  }

  /**
   * Send a question or chat prompt to the AI educational tutor
   */
  public static async sendChatMessage(params: {
    message: string;
    language: 'en' | 'ml';
    topic?: string;
    context?: Record<string, unknown>;
  }): Promise<AiResponse> {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          text: data.text,
          isFallback: Boolean(data.fallback),
          source: data.source || 'gemini',
        };
      }
    } catch (e) {
      console.warn('AI chat request failed, generating client fallback:', e);
    }

    return {
      text: this.getClientFallback(params.message, params.language),
      isFallback: true,
      source: 'offline_client_tutor',
    };
  }

  /**
   * Request a detailed pedagogical explanation of why a selected quiz option was wrong and the correct one right
   */
  public static async explainQuizAnswer(params: {
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    explanation: string;
    language: 'en' | 'ml';
    topic: string;
  }): Promise<AiResponse> {
    try {
      const res = await fetch('/api/ai/explain-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          text: data.text,
          isFallback: Boolean(data.fallback),
          source: data.source || 'gemini',
        };
      }
    } catch (e) {
      console.warn('AI explanation request failed, using standard explanation:', e);
    }

    const fallbackText =
      params.language === 'ml'
        ? `ശരിയായ ഉത്തരം: "${params.correctAnswer}".\n\nവിശദീകരണം: ${params.explanation}`
        : `Selected answer: "${params.studentAnswer}".\n\nCorrect answer: "${params.correctAnswer}".\n\nExplanation: ${params.explanation}`;

    return {
      text: fallbackText,
      isFallback: true,
      source: 'curated_standard_explanation',
    };
  }

  /**
   * Request dynamic practice questions
   */
  public static async generatePractice(params: {
    topic: string;
    difficulty: string;
    count: number;
    language: 'en' | 'ml';
  }) {
    try {
      const res = await fetch('/api/ai/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          return { questions: data.questions, isFallback: false };
        }
      }
    } catch (e) {
      console.warn('Generate practice failed:', e);
    }

    return { questions: [], isFallback: true };
  }

  private static getClientFallback(query: string, language: 'en' | 'ml'): string {
    const q = query.toLowerCase();
    if (language === 'ml' || q.includes('malayalam') || q.includes('മലയാളം')) {
      return `നമസ്കാരം! സ്കിൽബ്രിഡ്ജ് എഐ അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം.\n\nഡാറ്റാ സ്ട്രക്ചറുകൾ, അൽഗോരിതങ്ങൾ, പൈത്തൺ, ഡി.ബി.എം.എസ് എന്നീ വിഷയങ്ങളിൽ നിങ്ങളുടെ സംശയങ്ങൾ ചോദിക്കാവുന്നതാണ്. ഉദാഹരണത്തിന്: "റിക്കർഷൻ ലളിതമായി പറയൂ", "ലിങ്ക്ഡ് ലിസ്റ്റും അറേയും തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?".`;
    }

    return `Welcome to SkillBridge AI Learning Assistant!\n\nI am configured with foundational knowledge for Computer Science (Data Structures, Algorithms, Python, DBMS). Ask me questions like "Explain linked lists in simple English", "Give me a hint for recursion", or "Explain Database Normalization".`;
  }
}
