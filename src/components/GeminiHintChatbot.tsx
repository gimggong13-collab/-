import React, { useState, useRef, useEffect } from 'react';
import { ProblemRecord } from '../types';
import { MathRenderer } from '../utils/mathRenderer';
import { Sparkles, Send, X, Bot, User, Trash2, Lightbulb, HelpCircle, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GeminiHintChatbotProps {
  currentProblem?: ProblemRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiHintChatbot: React.FC<GeminiHintChatbotProps> = ({
  currentProblem,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '안녕하세요! 제미나이 수학 방탈출 힌트 조교입니다. 🎓\n\n문제를 풀거나 개발할 때 막히는 부분이 있다면 언제든 물어보세요! 절대 정답을 바로 알려주지 않고, 스스로 수학적 원리를 발견할 수 있도록 단계별 유도 힌트를 드릴게요.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: '💡 개념 힌트 요청', text: '이 문제에 접근하기 위한 핵심 수학적 아이디어나 개념 착안점 힌트를 줘.' },
    { label: '📐 어떤 공식 사용?', text: '이 문제를 해결할 때 적용할 수 있는 공식이나 수학적 정의의 방향을 알려줘.' },
    { label: '🔍 계산 방향 안내', text: '정답 값은 직접 말하지 말고, 내가 다음 단계로 어떤 계산을 진행해야 하는지 유도해 줘.' },
    { label: '🛡️ 정답 유일성 검토', text: '이 문제의 조건에서 다른 복수 정답이 나올 가능성이 없는지 수학적으로 점검하는 힌트를 줘.' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/hint-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          problemContext: currentProblem
            ? {
                authorName: currentProblem.authorName,
                authorNumber: currentProblem.authorNumber,
                topic: currentProblem.topic,
                sourceCitation: currentProblem.sourceCitation,
                creationReason: currentProblem.creationReason,
                mathConcept: currentProblem.mathConcept,
                problemStory: currentProblem.problemStory,
                problemFormula: currentProblem.problemFormula,
                hintLevel1: currentProblem.hintLevel1,
                hintLevel2: currentProblem.hintLevel2,
                answerValue: currentProblem.answerValue,
              }
            : null,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        const errMsg: ChatMessage = {
          id: `model-err-${Date.now()}`,
          role: 'model',
          text: `⚠️ 오류: ${data.error || '응답을 가져올 수 없습니다.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (err: any) {
      const networkErrMsg: ChatMessage = {
        id: `model-net-err-${Date.now()}`,
        role: 'model',
        text: '⚠️ 서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, networkErrMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: '대화 기록이 초기화되었습니다. 새로운 질문이나 탐구 힌트가 필요하면 말씀해 주세요!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-zinc-950/95 backdrop-blur-2xl border-l border-white/[0.1] shadow-2xl flex flex-col animate-slide-left">
      {/* Header (Revolut Minimal Assistant Bar) */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                제미나이 수학 힌트 챗봇
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              소크라테스식 유도 질문 및 착안점 안내
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            title="대화 초기화"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="닫기"
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Current Context Pill Banner */}
      <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-white/[0.06] text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="text-zinc-400 font-medium shrink-0">현재 탐구 맥락:</span>
          {currentProblem ? (
            <span className="text-indigo-300 font-semibold truncate">
              #{currentProblem.authorNumber} {currentProblem.topic} ({currentProblem.authorName})
            </span>
          ) : (
            <span className="text-zinc-400 italic">종합 방탈출 테마</span>
          )}
        </div>
        <span className="text-[10px] text-emerald-400 shrink-0 font-mono">
          ● AI 연동됨
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? 'bg-zinc-800 text-zinc-200'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-zinc-900/90 text-zinc-200 border border-white/[0.08]'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-line">{m.text}</div>
                ) : (
                  <MathRenderer content={m.text} className="text-zinc-200" />
                )}
                <div
                  className={`text-[10px] mt-1.5 ${
                    isUser ? 'text-indigo-200 text-right' : 'text-zinc-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/[0.08] text-xs text-zinc-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>제미나이가 수학적 개념을 분석하고 유도 힌트를 작성 중입니다...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-white/[0.06] bg-zinc-950/60 overflow-x-auto flex items-center gap-2">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(qp.text)}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-[11px] text-zinc-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-white/[0.08] bg-zinc-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="수학 힌트나 질문을 입력하세요..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <span className="text-[10px] text-zinc-400 block mt-1.5 text-center">
          제미나이는 정답을 직접 알려주지 않고 학생이 스스로 도출하도록 유도합니다.
        </span>
      </div>
    </div>
  );
};
