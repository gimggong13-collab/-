import React, { useState, useEffect } from 'react';
import { TeamTheme, ProblemRecord, PlaySessionState } from '../types';
import { MathRenderer } from '../utils/mathRenderer';
import { MathHandwritingCanvas } from './MathHandwritingCanvas';
import confetti from 'canvas-confetti';
import {
  Lock,
  Unlock,
  KeyRound,
  Timer,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileText,
  Sparkles,
  Trophy,
  ArrowRight,
  PenTool,
} from 'lucide-react';

interface EscapeSimulatorProps {
  theme: TeamTheme;
  onGoToReport: () => void;
  onOpenChatbotWithProblem?: (prob: ProblemRecord) => void;
}

export const EscapeSimulator: React.FC<EscapeSimulatorProps> = ({
  theme,
  onGoToReport,
  onOpenChatbotWithProblem,
}) => {
  const [session, setSession] = useState<PlaySessionState>({
    solvedProblemIds: [],
    collectedClues: {},
    unlockedHints: {},
    incorrectAttempts: {},
    masterAttempts: 0,
    isEscaped: false,
    elapsedSeconds: 0,
    isPlaying: true,
  });

  const [activeChamberId, setActiveChamberId] = useState<string | null>(theme.problems[0]?.id || null);
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [answerFeedback, setAnswerFeedback] = useState<'success' | 'error' | null>(null);

  // Master vault input
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [masterCodeInput, setMasterCodeInput] = useState('');
  const [masterFeedback, setMasterFeedback] = useState<'success' | 'error' | null>(null);
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Timer
  useEffect(() => {
    let interval: any;
    if (session.isPlaying && !session.isEscaped) {
      interval = setInterval(() => {
        setSession((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.isPlaying, session.isEscaped]);

  const activeProblem = theme.problems.find((p) => p.id === activeChamberId) || theme.problems[0];
  const isCurrentSolved = session.solvedProblemIds.includes(activeProblem.id);
  const currentHintLevel = session.unlockedHints[activeProblem.id] || 0;
  const currentAttempts = session.incorrectAttempts[activeProblem.id] || 0;

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Submit Chamber Answer
  const handleCheckAnswer = () => {
    if (!inputAnswer.trim() || isCurrentSolved) return;

    const isMatch = inputAnswer.trim().toLowerCase() === activeProblem.answerValue.trim().toLowerCase();

    if (isMatch) {
      setAnswerFeedback('success');
      setSession((prev) => {
        const nextSolved = [...prev.solvedProblemIds, activeProblem.id];
        const nextClues = {
          ...prev.collectedClues,
          [activeProblem.authorNumber]: activeProblem.keyClue,
        };
        const nextHints = {
          ...prev.unlockedHints,
          [activeProblem.id]: 3, // Reveal full solution on solve!
        };
        return {
          ...prev,
          solvedProblemIds: nextSolved,
          collectedClues: nextClues,
          unlockedHints: nextHints,
        };
      });
      setInputAnswer('');
    } else {
      setAnswerFeedback('error');
      // Stepwise Reveal logic: increment attempts and unlock hints
      setSession((prev) => {
        const attempts = (prev.incorrectAttempts[activeProblem.id] || 0) + 1;
        const currentLvl = prev.unlockedHints[activeProblem.id] || 0;
        // 1st incorrect -> level 1 hint unlocked
        // 2nd incorrect -> level 2 hint unlocked
        const nextLvl = attempts >= 2 ? Math.max(currentLvl, 2) : attempts >= 1 ? Math.max(currentLvl, 1) : currentLvl;

        return {
          ...prev,
          incorrectAttempts: {
            ...prev.incorrectAttempts,
            [activeProblem.id]: attempts,
          },
          unlockedHints: {
            ...prev.unlockedHints,
            [activeProblem.id]: nextLvl,
          },
        };
      });
    }
  };

  // Explicit Hint Request
  const handleRequestHint = (targetLevel: number) => {
    setSession((prev) => ({
      ...prev,
      unlockedHints: {
        ...prev.unlockedHints,
        [activeProblem.id]: Math.max(prev.unlockedHints[activeProblem.id] || 0, targetLevel),
      },
    }));
  };

  // Forfeit / View full solution
  const handleForfeitSolution = () => {
    if (confirm('전체 수학적 풀이를 열람하시겠습니까? (학습 피드백 및 검토용)')) {
      setSession((prev) => ({
        ...prev,
        unlockedHints: {
          ...prev.unlockedHints,
          [activeProblem.id]: 3,
        },
      }));
    }
  };

  // Master Safe Submit
  const handleMasterSubmit = () => {
    if (!masterCodeInput.trim()) return;

    const normalizedMaster = theme.finalMasterPasscode.trim().toLowerCase();
    const normalizedInput = masterCodeInput.trim().toLowerCase();

    if (normalizedInput === normalizedMaster) {
      setMasterFeedback('success');
      setSession((prev) => ({
        ...prev,
        isEscaped: true,
        isPlaying: false,
      }));

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // fallback
      }
    } else {
      setMasterFeedback('error');
      setSession((prev) => ({
        ...prev,
        masterAttempts: prev.masterAttempts + 1,
      }));
    }
  };

  // Reset Session
  const handleResetSession = () => {
    if (confirm('방탈출 세션을 초기화하고 처음부터 다시 도전하시겠습니까?')) {
      setSession({
        solvedProblemIds: [],
        collectedClues: {},
        unlockedHints: {},
        incorrectAttempts: {},
        masterAttempts: 0,
        isEscaped: false,
        elapsedSeconds: 0,
        isPlaying: true,
      });
      setInputAnswer('');
      setAnswerFeedback(null);
      setIsMasterModalOpen(false);
      setMasterCodeInput('');
      setMasterFeedback(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Controller Bar (Revolut FinTech Status Bar style) */}
      <div className="p-6 rounded-3xl bg-zinc-950/90 border border-white/[0.08] backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">
              <span>{theme.teamName}</span>
              <span>·</span>
              <span>수학 방탈출 테마 시뮬레이터</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {theme.storyTitle}
            </h1>
          </div>

          {/* Time & Control widgets */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.06] text-white font-mono text-sm">
              <Timer className="w-4 h-4 text-indigo-400" />
              <span className="tabular-nums font-bold">{formatTime(session.elapsedSeconds)}</span>
            </div>

            <button
              onClick={() =>
                setSession((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
              }
              title={session.isPlaying ? '일시정지' : '계속하기'}
              className="p-2 rounded-xl bg-zinc-900 border border-white/[0.06] text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {session.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={handleResetSession}
              title="게임 초기화"
              className="p-2 rounded-xl bg-zinc-900 border border-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Clue Strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-white/[0.06]">
          <div className="md:col-span-8 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>개별 챔버 잠금 해제 진행률</span>
              <span className="font-mono text-white">
                {session.solvedProblemIds.length} / {theme.problems.length} 완료 ({Math.round((session.solvedProblemIds.length / theme.problems.length) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-white/[0.04]">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{
                  width: `${(session.solvedProblemIds.length / theme.problems.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={() => setIsMasterModalOpen(true)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                session.solvedProblemIds.length === theme.problems.length
                  ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg shadow-amber-400/20 animate-pulse'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08]'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>최종 마스터 금고 콘솔 열기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Escape Success Hero Banner (When escaped!) */}
      {session.isEscaped && (
        <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/40 text-center space-y-4 animate-fade-in shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              MISSION ACCOMPLISHED
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              방탈출 성공! 모든 수학적 암호가 해제되었습니다!
            </h2>
            <p className="text-sm text-zinc-300 max-w-xl mx-auto mt-2 leading-relaxed">
              탈출 소요시간: <strong className="font-mono text-amber-300">{formatTime(session.elapsedSeconds)}</strong>
              <br />
              6인의 수학적 아이디어(마방진, 다항식, 아폴로니우스의 원, 명제 대우, 모듈로 암호, 피타고라스 삼조)를 모두 규명하였습니다.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToReport}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-colors shadow-lg shadow-amber-400/20 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>성취기준 [12수과02-04] 탐구보고서 및 평가 루브릭 확인</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: 6 Chamber Cards & Selected Active Chamber Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 6 Parallel Chambers Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-zinc-400">
              병렬 챔버 선택 (자유 순서 공략)
            </span>
            <span className="text-xs font-mono text-zinc-500">
              수집된 단서 {Object.keys(session.collectedClues).length}개
            </span>
          </div>

          <div className="space-y-3">
            {theme.problems.map((p) => {
              const isSolved = session.solvedProblemIds.includes(p.id);
              const isSelected = activeChamberId === p.id;
              const attempts = session.incorrectAttempts[p.id] || 0;

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveChamberId(p.id);
                    setInputAnswer('');
                    setAnswerFeedback(null);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-zinc-950/70 border-white/[0.06] hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                          isSolved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {isSolved ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-mono font-semibold text-zinc-300">
                        CHAMBER #{p.authorNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSolved ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold border border-emerald-500/20">
                          단서: [{p.keyClue}]
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {attempts > 0 ? `오답 ${attempts}회` : '미해결'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="font-semibold text-sm text-white">{p.topic}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">출제: {p.authorName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chamber Play Console (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-white/[0.08] space-y-6 shadow-xl">
            {/* Chamber Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                  CHAMBER #{activeProblem.authorNumber} CONSOLE
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {activeProblem.topic}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400">출제자</span>
                <div className="text-sm font-semibold text-white">
                  {activeProblem.authorName}
                </div>
              </div>
            </div>

            {/* Problem Story */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                상황 지문
              </span>
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/[0.06] text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-sans">
                {activeProblem.problemStory}
              </div>
            </div>

            {/* Formula Area (KaTeX Rendered) */}
            {activeProblem.problemFormula && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                  수학적 조건 및 수식
                </span>
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-100">
                  <MathRenderer content={activeProblem.problemFormula} forceMathMode={true} className="text-sm font-medium" />
                </div>
              </div>
            )}

            {/* Author's Handwritten Formula / Diagram (if available) */}
            {activeProblem.drawingDataUrl && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  🖊️ 출제자 손필기 수식 및 기하 스케치
                </span>
                <div className="p-2 rounded-2xl bg-black border border-white/10 flex items-center justify-center max-h-48 overflow-hidden">
                  <img
                    src={activeProblem.drawingDataUrl}
                    alt="출제자 필기 수식"
                    className="max-h-44 max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Stylus Scratchpad Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showScratchpad ? '터치펜 풀이 연습장 접기' : '터치펜 풀이 연습장 (직접 필기하며 풀기)'}</span>
                </button>
                {showScratchpad && (
                  <span className="text-[11px] text-zinc-500">
                    화면에 자유롭게 풀이 계산을 적어보세요
                  </span>
                )}
              </div>

              {showScratchpad && (
                <div className="animate-fade-in">
                  <MathHandwritingCanvas
                    title="풀이 계산 연습장 (터치펜·마우스)"
                    onSave={() => {}}
                  />
                </div>
              )}
            </div>

            {/* Answer Input or Solved Badge */}
            <div className="p-5 rounded-2xl bg-black border border-white/[0.1] space-y-4">
              {isCurrentSolved ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-300">
                    잠금 해제 성공!
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    챔버 #{activeProblem.authorNumber}의 잠금장치가 해제되어 단서 조각{' '}
                    <strong className="text-amber-300 font-mono text-sm">[{activeProblem.keyClue}]</strong>을(를)
                    획득하였습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      정답 패스코드 입력
                    </label>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      오답 시도: {currentAttempts}회
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputAnswer}
                      onChange={(e) => {
                        setInputAnswer(e.target.value);
                        setAnswerFeedback(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                      placeholder="도출한 답을 입력하세요"
                      className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-white/[0.12] text-white font-mono text-sm sm:text-base focus:outline-none focus:border-indigo-500 tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={handleCheckAnswer}
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      잠금 해제
                    </button>
                  </div>

                  {answerFeedback === 'error' && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        패스코드가 일치하지 않습니다. (오답 누적 시 힌트가 공개됩니다)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stepwise Reveal Deck (Hints & Solution) */}
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>단계별 힌트 및 수학적 풀이 공개 체계</span>
                </span>
                <div className="flex items-center gap-2">
                  {onOpenChatbotWithProblem && (
                    <button
                      type="button"
                      onClick={() => onOpenChatbotWithProblem(activeProblem)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 text-[11px] text-white font-medium border border-indigo-400/30 transition-all cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                      <span>제미나이 AI 힌트 질문</span>
                    </button>
                  )}
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">
                    {currentHintLevel === 0 && '미공개'}
                    {currentHintLevel === 1 && '1차 개념 힌트'}
                    {currentHintLevel === 2 && '2차 공식 힌트'}
                    {currentHintLevel === 3 && '전체 풀이'}
                  </span>
                </div>
              </div>

              {/* Hint 1 */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300">
                    1차 힌트: 핵심 개념적 착안점
                  </span>
                  {currentHintLevel >= 1 ? (
                    <span className="text-emerald-400 font-mono">열람 가능</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestHint(1)}
                      className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      힌트 요청하기
                    </button>
                  )}
                </div>
                {currentHintLevel >= 1 ? (
                  <p className="text-zinc-300 mt-1 leading-relaxed">
                    {activeProblem.hintLevel1 || '등록된 1차 힌트가 없습니다.'}
                  </p>
                ) : (
                  <p className="text-zinc-600 italic">
                    1회 이상 오답 시도 또는 힌트 요청 시 공개됩니다.
                  </p>
                )}
              </div>

              {/* Hint 2 */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300">
                    2차 힌트: 공식 및 접근 방향
                  </span>
                  {currentHintLevel >= 2 ? (
                    <span className="text-emerald-400 font-mono">열람 가능</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestHint(2)}
                      className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      힌트 요청하기
                    </button>
                  )}
                </div>
                {currentHintLevel >= 2 ? (
                  <p className="text-zinc-300 mt-1 leading-relaxed">
                    {activeProblem.hintLevel2 || '등록된 2차 힌트가 없습니다.'}
                  </p>
                ) : (
                  <p className="text-zinc-600 italic">
                    2회 이상 오답 시도 또는 힌트 요청 시 공개됩니다.
                  </p>
                )}
              </div>

              {/* Full Solution (Revealed on solve or forfeit) */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>출제자의 수학적 상세 풀이 전문</span>
                  </span>
                  {currentHintLevel >= 3 || isCurrentSolved ? (
                    <span className="text-indigo-400 font-mono">완전 공개</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleForfeitSolution}
                      className="text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                    >
                      학습용 풀이 열람하기
                    </button>
                  )}
                </div>

                {currentHintLevel >= 3 || isCurrentSolved ? (
                  <div className="space-y-2 mt-2 pt-2 border-t border-white/[0.04]">
                    <div>
                      <strong className="text-zinc-400">수학적 원리: </strong>
                      <span className="text-zinc-300">{activeProblem.mathConcept}</span>
                    </div>
                    <div>
                      <strong className="text-zinc-400">상세 풀이 과정:</strong>
                      <p className="text-zinc-300 font-mono whitespace-pre-line leading-relaxed mt-1">
                        {activeProblem.solutionDetailed}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-600 italic">
                    정답을 맞추거나 풀이 열람 버튼을 누르면 수학적 논증 과정이 공개됩니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Master Safe Modal */}
      {isMasterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.12] space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">중앙 마스터 금고 콘솔</h3>
                  <span className="text-xs text-zinc-400">최종 탈출 암호 검증</span>
                </div>
              </div>
              <button
                onClick={() => setIsMasterModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm cursor-pointer"
              >
                닫기 ✕
              </button>
            </div>

            {/* Collected Clues Grid */}
            <div>
              <span className="text-xs font-medium text-zinc-400 mb-2 block">
                모둠원 6인의 단서 조각 수집 상태
              </span>
              <div className="grid grid-cols-6 gap-2">
                {theme.problems.map((p) => {
                  const clue = session.collectedClues[p.authorNumber];
                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-xl border text-center font-mono ${
                        clue
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-zinc-900 border-white/[0.06] text-zinc-600'
                      }`}
                    >
                      <div className="text-[10px] text-zinc-500">#{p.authorNumber}</div>
                      <div className="text-base font-bold mt-0.5">{clue || '?'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Master Passcode Rule reminder */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.06] text-xs text-zinc-300 leading-relaxed">
              <span className="font-semibold text-amber-400 block mb-1">
                탈출 암호 결합 규칙
              </span>
              {theme.masterPasscodeRule}
            </div>

            {/* Input Passcode */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-400">
                최종 암호 입력 (6자리)
              </label>
              <input
                type="text"
                value={masterCodeInput}
                onChange={(e) => {
                  setMasterCodeInput(e.target.value);
                  setMasterFeedback(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleMasterSubmit()}
                placeholder="예: 342795"
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/[0.12] text-amber-300 font-mono font-bold text-center text-xl tracking-widest focus:outline-none focus:border-amber-400"
              />

              {masterFeedback === 'error' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    마스터 암호가 일치하지 않습니다. 각 챔버의 단서 조각과 결합 순서를 다시 확인하세요.
                  </span>
                </div>
              )}

              {masterFeedback === 'success' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    금고가 열렸습니다! 탈출에 성공하였습니다.
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsMasterModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleMasterSubmit}
                className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-sm font-bold transition-colors shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                금고 해제 시도
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
