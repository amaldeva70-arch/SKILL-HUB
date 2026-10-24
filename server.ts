import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// AI Chat & Explanation Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, language = 'en', topic, context } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      res.json({
        fallback: true,
        text: getCuratedFallback(message, language, topic),
        source: 'curated_offline_engine',
      });
      return;
    }

    const languageInstruction =
      language === 'ml'
        ? 'Respond primarily in Malayalam (മലയാളം) script, with English technical terms in parentheses where helpful for clarity.'
        : 'Respond in clear, accessible, simple English suitable for undergraduate and beginner CS students.';

    const prompt = `You are SkillBridge AI, a supportive Computer Science tutor dedicated to SDG 4 (Quality Education) and SDG 10 (Reduced Inequalities).
${languageInstruction}

Topic Context: ${topic || 'Computer Science (Python, Data Structures, Algorithms, DBMS)'}
Additional Context: ${context ? JSON.stringify(context) : 'None'}

Student's Query: "${message}"

Guidelines:
1. Explain step-by-step with simple analogies.
2. If the user asks for a hint, provide progressive hints without spoiling the final answer immediately.
3. If code is helpful, provide clean, commented Python or pseudocode.
4. If asked in or about Malayalam, provide natural, fluent Malayalam explanations.
5. Keep explanations direct, friendly, and empowering.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      fallback: false,
      text: response.text || 'No response generated.',
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Gemini API chat error:', error);
    const { message = '', language = 'en', topic = '' } = req.body || {};
    res.json({
      fallback: true,
      text: getCuratedFallback(message, language, topic),
      source: 'curated_offline_fallback',
    });
  }
});

// Explain Quiz Answer Endpoint
app.post('/api/ai/explain-answer', async (req, res) => {
  try {
    const { question, studentAnswer, correctAnswer, explanation, language = 'en', topic } = req.body;

    if (!ai) {
      res.json({
        fallback: true,
        text: explanation || 'Please review the core principles of this topic.',
        source: 'curated_offline_engine',
      });
      return;
    }

    const languageInstruction =
      language === 'ml'
        ? 'Provide your explanation in Malayalam (മലയാളം), accompanied by key terms in English.'
        : 'Provide your explanation in clear, friendly simple English.';

    const prompt = `You are SkillBridge AI tutor.
${languageInstruction}

Question: "${question}"
Topic: ${topic || 'General CS'}
Student's Chosen Option: "${studentAnswer}"
Correct Option: "${correctAnswer}"
Default Explanation: "${explanation || ''}"

Please provide:
1. A concise breakdown of why "${studentAnswer}" is incorrect or suboptimal.
2. Clear reasoning for why "${correctAnswer}" is the correct solution.
3. A memorable rule-of-thumb or simple analogy so the student never misses this concept again.
Keep it encouraging and educational.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      fallback: false,
      text: response.text || explanation,
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Gemini explanation error:', error);
    res.json({
      fallback: true,
      text: req.body?.explanation || 'Explanation generated from local knowledge base.',
      source: 'curated_offline_fallback',
    });
  }
});

// Generate dynamic practice questions
app.post('/api/ai/generate-practice', async (req, res) => {
  try {
    const { topic = 'Data Structures', difficulty = 'Medium', count = 3, language = 'en' } = req.body;

    if (!ai) {
      res.json({
        fallback: true,
        questions: [],
      });
      return;
    }

    const prompt = `Generate ${count} multiple-choice practice questions on "${topic}" at "${difficulty}" level.
Language: ${language === 'ml' ? 'Malayalam with English technical terms' : 'English'}.
Return strictly valid JSON with this exact schema:
[
  {
    "id": "generated_1",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed step-by-step explanation"
  }
]
Do not wrap in markdown quotes if possible, output pure JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({
      fallback: false,
      questions: parsed,
    });
  } catch (error) {
    console.error('Generate practice error:', error);
    res.json({
      fallback: true,
      questions: [],
    });
  }
});

// Fallback curated content when offline or API key absent
function getCuratedFallback(query: string, language: string, topic?: string): string {
  const q = query.toLowerCase();

  if (language === 'ml' || q.includes('malayalam') || q.includes('മലയാളം')) {
    if (q.includes('linked list') || q.includes('ലിങ്ക്ഡ് ലിസ്റ്റ്')) {
      return `ലിങ്ക്ഡ് ലിസ്റ്റ് (Linked List) എന്നാൽ മെമ്മറിയിൽ തുടർച്ചയായി അല്ലാതെ സൂക്ഷിക്കുന്ന നോഡുകളുടെ (Nodes) ഒരു ശ്രേണിയാണ്.\n\nഓരോ നോഡിലും രണ്ട് പ്രധാന ഭാഗങ്ങളുണ്ട്:\n1. **Data**: സൂക്ഷിക്കേണ്ട മൂല്യം (Value)\n2. **Pointer / Next**: അടുത്ത നോഡിന്റെ മെമ്മറി അഡ്രസ്സ്\n\n**പ്രയോജനങ്ങൾ (Advantages):**\n- അറേകളിൽ (Arrays) പോലെ വലിപ്പം മുൻകൂട്ടി നിശ്ചയിക്കേണ്ടതില്ല (Dynamic Size).\n- ഇടയിൽ പുതിയ ഡാറ്റ തിരുകിക്കയറ്റാനും (Insertion) നീക്കം ചെയ്യാനും (Deletion) എളുപ്പമാണ് (O(1) സമയം, പോയിന്റർ അറിയാമെങ്കിൽ).\n\n**പോരായ്മ:** ഏത് സ്ഥാനത്തുമുള്ള ഡാറ്റ നേരിട്ട് ആക്സസ് ചെയ്യാൻ കഴിയില്ല (No random access).`;
    }
    if (q.includes('recursion') || q.includes('റിക്കർഷൻ')) {
      return `റിക്കർഷൻ (Recursion) എന്നാൽ ഒരു ഫംഗ്ഷൻ സ്വയം വീണ്ടും വിളിക്കുന്ന രീതിയാണ്.\n\n**രണ്ട് പ്രധാന ഘടകങ്ങൾ:**\n1. **Base Case (അടിസ്ഥാന നിബന്ധന)**: ഫംഗ്ഷൻ ആവർത്തിക്കുന്നത് എപ്പോൾ നിർത്തണമെന്ന് തീരുമാനിക്കുന്ന ഭാഗം. ഇത് ഇല്ലെങ്കിൽ 'Stack Overflow' എറർ വരും.\n2. **Recursive Step**: പ്രശ്നത്തെ ചെറിയ ഭാഗങ്ങളാക്കി മാറ്റി സ്വയം വിളിക്കുന്ന ഘട്ടം.\n\n**ഉദാഹരണം: Factorial(n)**\n\`factorial(4) = 4 * factorial(3)\`\n\`factorial(0) = 1\` (Base case).`;
    }
    if (q.includes('binary search') || q.includes('ബൈനറി സെർച്ച്')) {
      return `ബൈനറി സെർച്ച് (Binary Search) എന്നത് ക്രമീകരിച്ചിരിക്കുന്ന (Sorted) അറേയിൽ നിന്ന് ഒരു മൂല്യം അതിവേഗം കണ്ടെത്താനുള്ള മാർഗ്ഗമാണ്.\n\n**പ്രവർത്തന തത്വം:**\nഓരോ തവണയും അറേയുടെ മധ്യഭാഗത്തെ സംഖ്യ നോക്കി തിരയുന്ന മൂല്യവുമായി താരതമ്യം ചെയ്യുന്നു. തിരയുന്ന സംഖ്യ ചെറുതാണെങ്കിൽ ഇടത് പകുതിയിലും, വലുതാണെങ്കിൽ വലത് പകുതിയിലും മാത്രം അടുത്ത ഘട്ടത്തിൽ തിരയുന്നു.\n\n**Time Complexity**: O(log n) - സാധാരണ ലീനിയർ സെർച്ചിനേക്കാൾ (O(n)) വളരെ വേഗതയേറിയതാണ്.`;
    }
    return `നമസ്കാരം! സ്കിൽബ്രിഡ്ജ് എഐ (SkillBridge AI) ലേക്ക് സ്വാഗതം. കമ്പ്യൂട്ടർ സയൻസ് വിഷയങ്ങൾ (Python, Data Structures, Algorithms, DBMS) മലയാളത്തിലും ലളിതമായ ഇംഗ്ലീഷിലും പഠിക്കാൻ ഞാൻ സഹായിക്കാം.\n\nനിങ്ങൾക്ക് സംശയമുള്ള കോൺസെപ്റ്റ് ചോദിക്കൂ, ഉദാഹരണത്തിന്: "റിക്കർഷൻ വിശദീകരിക്കുക", "ബൈനറി സെർച്ച് എന്താണ്?", അല്ലെങ്കിൽ "ലിങ്ക്ഡ് ലിസ്റ്റ് ലളിതമായി പറയൂ".`;
  }

  // English fallbacks
  if (q.includes('linked list')) {
    return `### Understanding Linked Lists in Simple English

A **Linked List** is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (called a **Node**) points to the next node using a pointer/reference.

**Anatomy of a Node:**
- \`data\`: The actual value (e.g., integer, string)
- \`next\`: Reference to the next node in line (or \`None\` / \`null\` at the end)

**Why use Linked Lists over Arrays?**
1. **Dynamic Size**: Can grow and shrink in memory on demand without reallocation.
2. **Fast Insertions/Deletions**: Inserting at the head is **O(1)** compared to **O(n)** in arrays where elements must shift.

**Trade-off:**
- No direct indexing (accessing the 5th element requires traversing from node 1: **O(n)**).`;
  }

  if (q.includes('recursion')) {
    return `### What is Recursion?

**Recursion** is when a function solves a problem by calling a smaller instance of itself.

Think of it like nesting Russian dolls (Matryoshka) or looking into two facing mirrors.

**Two essential parts of every recursive function:**
1. **Base Case**: The stopping condition where no further calls are made (prevents infinite loop & stack overflow).
2. **Recursive Step**: Calling the function with a progressively smaller or simpler input.

**Quick Example (Factorial):**
\`\`\`python
def factorial(n):
    # 1. Base case
    if n <= 1:
        return 1
    # 2. Recursive step
    return n * factorial(n - 1)
\`\`\`
For \`factorial(3)\`: 3 * factorial(2) -> 3 * (2 * factorial(1)) -> 3 * 2 * 1 = 6.`;
  }

  if (q.includes('normalization') || q.includes('dbms')) {
    return `### Database Normalization Explained

**Normalization** is the process of organizing database tables to reduce data redundancy and eliminate update/delete anomalies.

**The Main Normal Forms:**
- **1NF (First Normal Form)**: Each table cell contains atomic (indivisible) values; no repeating groups.
- **2NF (Second Normal Form)**: Must be in 1NF, and all non-key attributes must be fully functionally dependent on the primary key (no partial dependency).
- **3NF (Third Normal Form)**: Must be in 2NF, and no transitive dependencies (non-key attributes should not depend on other non-key attributes).

**Memory trick:** *"Every non-key attribute must depend on the key, the whole key, and nothing but the key, so help me Codd."*`;
  }

  if (q.includes('binary search')) {
    return `### Binary Search Simplified

**Binary Search** is an efficient divide-and-conquer algorithm to find a target value within a **sorted** array.

**How it works:**
1. Look at the middle element.
2. If middle == target, you're done!
3. If target < middle, eliminate the right half and search the left.
4. If target > middle, eliminate the left half and search the right.
5. Repeat until found or range is empty.

**Time Complexity:**
- **O(log n)** — In an array of 1,000,000 items, binary search takes at most ~20 comparisons!`;
  }

  return `SkillBridge AI CS Educational Assistant is ready to help!

I can help you understand:
• **Python Programming**: Functions, list comprehensions, decorators, OOP, error handling
• **Data Structures**: Arrays, Linked Lists, Stacks, Queues, Trees, Hash Tables, Graphs
• **Algorithms**: Sorting, Binary Search, Big-O Notation, Recursion, Dynamic Programming
• **DBMS**: SQL queries, Normalization, ACID properties, Indexing, Transactions

Ask me for simple English analogies, Malayalam explanations, code breakdowns, or quiz hints!`;
}

// Dev server or production static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge AI full-stack server running on port ${PORT}`);
  });
}

startServer();
