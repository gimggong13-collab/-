import React, { useState, useEffect } from 'react';
import { TeamTheme, ProblemRecord, PeerReview, RevisionEntry } from './types';
import { initialThemeData } from './data/defaultThemeData';
import { Navbar, ActiveTab } from './components/Navbar';
import { AuthoringStudio } from './components/AuthoringStudio';
import { PeerTestingChamber } from './components/PeerTestingChamber';
import { RevisionLedger } from './components/RevisionLedger';
import { TeamMastermind } from './components/TeamMastermind';
import { EscapeSimulator } from './components/EscapeSimulator';
import { AssessmentReport } from './components/AssessmentReport';
import { DataModal } from './components/DataModal';
import { GeminiHintChatbot } from './components/GeminiHintChatbot';
import { Sparkles } from 'lucide-react';

const STORAGE_KEY = 'math_escape_theme_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('authoring');
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeAiProblem, setActiveAiProblem] = useState<ProblemRecord | null>(null);

  // Load from localStorage or use initial default
  const [theme, setTheme] = useState<TeamTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.problems && parsed.problems.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return initialThemeData;
  });

  // Default active AI problem to first problem if none selected
  useEffect(() => {
    if (!activeAiProblem && theme.problems.length > 0) {
      setActiveAiProblem(theme.problems[0]);
    }
  }, [theme, activeAiProblem]);

  // Save on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // storage quota or error
    }
  }, [theme]);

  // Update a single problem
  const handleUpdateProblem = (updated: ProblemRecord) => {
    setTheme((prev) => ({
      ...prev,
      problems: prev.problems.map((p) => (p.id === updated.id ? updated : p)),
    }));
    if (activeAiProblem?.id === updated.id) {
      setActiveAiProblem(updated);
    }
  };

  // Add peer review to a problem
  const handleAddReview = (problemId: string, review: PeerReview) => {
    setTheme((prev) => ({
      ...prev,
      problems: prev.problems.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            peerReviews: [...(p.peerReviews || []), review],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      }),
    }));
  };

  // Add revision entry to a problem
  const handleAddRevision = (problemId: string, revision: RevisionEntry) => {
    setTheme((prev) => ({
      ...prev,
      problems: prev.problems.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            revisionHistory: [...(p.revisionHistory || []), revision],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      }),
    }));
  };

  // Update whole theme
  const handleUpdateTheme = (updatedTheme: TeamTheme) => {
    setTheme(updatedTheme);
  };

  // Reset to initial sample
  const handleResetSample = () => {
    if (confirm('기본 예제(6개 고교 수학 문제 및 검증 데이터)로 복원하시겠습니까? 현재 작성 중인 내용은 덮어씌워집니다.')) {
      setTheme(initialThemeData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialThemeData));
      setActiveAiProblem(initialThemeData.problems[0]);
    }
  };

  // Open Chatbot focused on specific problem
  const handleOpenChatbotForProblem = (prob: ProblemRecord) => {
    setActiveAiProblem(prob);
    setIsChatbotOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white relative">
      {/* Top Bar with Revolut Aesthetic */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onResetSample={handleResetSample}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'authoring' && (
          <AuthoringStudio
            problems={theme.problems}
            onUpdateProblem={handleUpdateProblem}
            onNextStep={() => setActiveTab('peer_review')}
          />
        )}

        {activeTab === 'peer_review' && (
          <PeerTestingChamber
            problems={theme.problems}
            onAddReview={handleAddReview}
            onNextStep={() => setActiveTab('revision')}
          />
        )}

        {activeTab === 'revision' && (
          <RevisionLedger
            problems={theme.problems}
            onAddRevision={handleAddRevision}
            onNextStep={() => setActiveTab('team_theme')}
          />
        )}

        {activeTab === 'team_theme' && (
          <TeamMastermind
            theme={theme}
            onUpdateTheme={handleUpdateTheme}
            onNextStep={() => setActiveTab('play_escape')}
          />
        )}

        {activeTab === 'play_escape' && (
          <EscapeSimulator
            theme={theme}
            onGoToReport={() => setActiveTab('report')}
            onOpenChatbotWithProblem={handleOpenChatbotForProblem}
          />
        )}

        {activeTab === 'report' && (
          <AssessmentReport theme={theme} />
        )}
      </main>

      {/* Footer (Clean, unboxed, Revolut-style) */}
      <footer className="no-print border-t border-white/[0.06] py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">수학과제 탐구</span>
            <span>·</span>
            <span>2022 개정 교육과정 [12수과02-04] 개발 연구</span>
          </div>
          <div>
            착안 → 제작 → 검증 → 수정 → 완성 5단계 개발 연구 절차 실천
          </div>
        </div>
      </footer>

      {/* Floating AI Hint Assistant Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        title="제미나이 수학 힌트 조교 열기"
        className="no-print fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-medium text-xs sm:text-sm shadow-xl shadow-indigo-600/30 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold">제미나이 힌트 조교</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Data Management Modal */}
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        theme={theme}
        onImportTheme={handleUpdateTheme}
      />

      {/* Gemini Hint Chatbot Drawer */}
      <GeminiHintChatbot
        currentProblem={activeAiProblem}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}
