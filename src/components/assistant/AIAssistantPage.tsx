import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, TopicId } from '../../types';
import { TOPICS, TOPIC_LIST } from '../../data/topics';
import { AiService } from '../../services/aiService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Globe,
  HelpCircle,
  Loader2,
  RefreshCw,
  Lightbulb,
  FileQuestion,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface AIAssistantPageProps {
  currentLanguage: 'en' | 'ml';
  onLanguageChange: (lang: 'en' | 'ml') => void;
  activeTopicContext?: TopicId;
}

const DEFAULT_SUGGESTED_PROMPTS = [
  'Explain linked lists in simple English.',
  'Explain recursion in Malayalam.',
  'Give me a hint for binary search before the solution.',
  'Explain Database Normalization (1NF, 2NF, 3NF) in Malayalam.',
  'Why does an array have better cache locality than a linked list?',
  'Give me Python practice questions on list comprehensions.',
];

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTopicContext = 'data-structures',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text:
        currentLanguage === 'ml'
          ? 'നമസ്കാരം! സ്കിൽബ്രിഡ്ജ് എഐ അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം. കമ്പ്യൂട്ടർ സയൻസ് വിഷയങ്ങൾ (Python, Data Structures, Algorithms, DBMS) ലളിതമായ മലയാളത്തിലും ഇംഗ്ലീഷിലും വിശദീകരിക്കാൻ ഞാൻ തയ്യാറാണ്. എന്താണ് ഇന്ന് പഠിക്കേണ്ടത്?'
          : 'Hello! I am your SkillBridge AI Computer Science Tutor. I can explain complex CS topics in simple, intuitive English or in Malayalam (മലയാളം), give hints without giving away the full answer immediately, and help you bridge your diagnostic gaps. What would you like to explore?',
      timestamp: new Date().toISOString(),
      language: currentLanguage,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicId>(activeTopicContext);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AiService.checkHealth().then((health) => {
      setHasGeminiKey(health.hasGeminiKey);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
      language: currentLanguage,
      topicContext: selectedTopic,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await AiService.sendChatMessage({
        message: query,
        language: currentLanguage,
        topic: TOPICS[selectedTopic].name,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toISOString(),
        language: currentLanguage,
        isFallback: response.isFallback,
        topicContext: selectedTopic,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Interactive Educational Tutor
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">SkillBridge AI Assistant</h1>
          <p className="text-xs text-slate-500">
            Powered by Google Gemini 3.8 Flash with bilingual English &amp; Malayalam support
          </p>
        </div>

        {/* Controls: Topic context + Language switch */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Topic Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium">Context:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value as TopicId)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TOPIC_LIST.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                currentLanguage === 'en'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ml')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                currentLanguage === 'ml'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              മലയാളം
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex-shrink-0 space-y-1.5">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Suggested Educational Prompts:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-full text-xs font-medium transition-all shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-900 to-violet-700 text-indigo-100 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Subtext info / Fallback notice */}
                <div
                  className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                    isUser
                      ? 'border-indigo-500/50 text-indigo-200'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {msg.isFallback && ' • Curated Knowledge Engine'}
                  </span>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-slate-700"
                      title="Copy response"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>SkillBridge AI is formulating educational explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex-shrink-0 flex items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            currentLanguage === 'ml'
              ? 'സംശയങ്ങൾ ചോദിക്കൂ (ഉദാ: റിക്കർഷൻ എന്താണ്?, ലിങ്ക്ഡ് ലിസ്റ്റ് വിശദീകരിക്കൂ...)'
              : 'Ask any CS concept in English or Malayalam (e.g. "Explain linked lists with an analogy")...'
          }
          className="flex-1 px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white transition-colors"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
