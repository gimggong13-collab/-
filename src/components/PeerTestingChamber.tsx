import React, { useState } from 'react';
import { ProblemRecord, PeerReview } from '../types';
import { MathRenderer } from '../utils/mathRenderer';
import { CheckCircle, AlertTriangle, MessageSquare, Send, CheckSquare, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

interface PeerTestingChamberProps {
  problems: ProblemRecord[];
  onAddReview: (problemId: string, review: PeerReview) => void;
  onNextStep: () => void;
}

export const PeerTestingChamber: React.FC<PeerTestingChamberProps> = ({
  problems,
  onAddReview,
  onNextStep,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(problems[0].id);
  const activeProblem = problems.find((p) => p.id === selectedProblemId) || problems[0];

  // Peer review form state
  const [reviewerName, setReviewerName] = useState('');
  const [trialAnswer, setTrialAnswer] = useState('');
  const [trialResult, setTrialResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isSolvable, setIsSolvable] = useState(true);
  const [hasSingleAnswer, setHasSingleAnswer] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [foundErrors, setFoundErrors] = useState('');
  const [improvementSuggestion, setImprovementSuggestion] = useState('');
  const [showAuthorSolution, setShowAuthorSolution] = useState(false);
  const [submittedToast, setSubmittedToast] = useState(false);

  // Check trial answer
  const handleCheckAnswer = () => {
    if (!trialAnswer.trim()) return;
    const isCorrect = trialAnswer.trim().toLowerCase() === activeProblem.answerValue.trim().toLowerCase();
    setTrialResult(isCorrect ? 'correct' : 'incorrect');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      alert('검증자(동료 학생) 이름을 입력해 주세요.');
      return;
    }

    const newReview: PeerReview = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewerName.trim(),
      isSolvable,
      hasSingleAnswer,
      difficulty,
      foundErrors: foundErrors.trim() || '발견된 수학적 오류 없음 (정상 검증)',
      improvementSuggestion: improvementSuggestion.trim() || '수학적 완성도가 높아 추가 수정 불필요',
      reviewedAt: new Date().toISOString().split('T')[0],
    };

    onAddReview(activeProblem.id, newReview);
    setSubmittedToast(true);
    setFoundErrors('');
    setImprovementSuggestion('');
    setTrialAnswer('');
    setTrialResult(null);
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>02단계 개발 연구 상호 교차 검증</span>
            <span>·</span>
            <span>Human Peer Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            동료 교차 시험 풀이 및 검증실
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            AI 없이 동료 학생이 직접 문제를 풀어보며 **수학적 오류**, **정답의 유일성(단일 해)**, **난이도 및 표현의 명확성**을 검증합니다.
            발견된 문제점은 다음 3단계에서 수정·개선 근거로 활용됩니다.
          </p>
        </div>

        <button
          onClick={onNextStep}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>다음: 수정 기록부</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Select Problem to Review */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-3">
          검증 대상 문제 선택 (자신이 아닌 동료의 문제 선택)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {problems.map((p) => {
            const isSelected = p.id === selectedProblemId;
            const reviewCount = p.peerReviews?.length || 0;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProblemId(p.id);
                  setTrialAnswer('');
                  setTrialResult(null);
                  setShowAuthorSolution(false);
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-emerald-500/80 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'bg-zinc-950/60 border-white/[0.06] hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-zinc-400">
                    #{p.authorNumber} {p.authorName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    검증 {reviewCount}건
                  </span>
                </div>
                <div className="font-semibold text-sm text-white truncate">
                  {p.topic}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                  <span className={reviewCount > 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {reviewCount > 0 ? '● 검증 완료' : '○ 검증 대기'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Problem Board to Test Solve (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  출제자: {activeProblem.authorName} (슬롯 #{activeProblem.authorNumber})
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {activeProblem.topic}
                </h3>
              </div>
              <div className="text-xs text-zinc-400 border border-zinc-800 px-2.5 py-1 rounded-lg">
                출처: {activeProblem.sourceCitation || '교과서 및 연구자료'}
              </div>
            </div>

            {/* Problem Story */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                방탈출 문제 지문
              </span>
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/[0.06] text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
                {activeProblem.problemStory}
              </div>
            </div>

            {/* Formula Block (KaTeX Math Rendered) */}
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

            {/* Author's Handwritten Sketch (if present) */}
            {activeProblem.drawingDataUrl && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  🖊️ 출제자 손필기 수식 및 도형 스케치
                </span>
                <div className="p-2 rounded-2xl bg-black border border-white/10 flex items-center justify-center max-h-40 overflow-hidden">
                  <img
                    src={activeProblem.drawingDataUrl}
                    alt="출제자 필기"
                    className="max-h-36 max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Trial Solve Section (동료가 직접 풀어보는 인터랙티브 블록) */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/[0.1] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  교차 시험 풀이 (Trial Solve)
                </span>
                <span className="text-[11px] text-zinc-400">
                  직접 답을 넣어 유일성을 체감해 보세요
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={trialAnswer}
                  onChange={(e) => {
                    setTrialAnswer(e.target.value);
                    setTrialResult(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                  placeholder="도출한 답 입력 (예: 3)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black border border-white/[0.12] text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  채점 확인
                </button>
              </div>

              {trialResult === 'correct' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    정답 일치! (출제자가 의도한 단서값: <strong className="font-mono text-emerald-200">[{activeProblem.keyClue}]</strong>)
                  </span>
                </div>
              )}

              {trialResult === 'incorrect' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    출제자 정답과 불일치합니다. 지문의 조건이나 계산을 다시 점검해 보세요.
                  </span>
                </div>
              )}
            </div>

            {/* Toggle Author Solution */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAuthorSolution(!showAuthorSolution)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {showAuthorSolution ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>출제자 상세 풀이 접기</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>출제자가 등록한 수학적 풀이 및 아이디어 대조하기</span>
                  </>
                )}
              </button>

              {showAuthorSolution && (
                <div className="mt-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs leading-relaxed animate-fade-in">
                  <div>
                    <span className="text-zinc-400 font-semibold block mb-0.5">수학적 원리</span>
                    <p className="text-zinc-300">{activeProblem.mathConcept}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-semibold block mb-0.5">상세 풀이 전문</span>
                    <p className="text-zinc-300 whitespace-pre-line font-mono">{activeProblem.solutionDetailed}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Peer Review Form & Ledger (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Submission Card */}
          <form
            onSubmit={handleSubmitReview}
            className="p-6 rounded-3xl bg-zinc-950/80 border border-white/[0.08] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>검증 체크리스트 및 피드백 작성</span>
              </h3>
              {submittedToast && (
                <span className="text-xs text-emerald-400 font-medium animate-pulse">
                  ✔ 검증 의견이 성공적으로 등록되었습니다!
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                검증자(동료 학생) 이름
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="예: 이서연"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                핵심 검증 항목 (성취기준 [12수과02-04])
              </span>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] cursor-pointer hover:bg-zinc-900 transition-colors">
                <input
                  type="checkbox"
                  checked={isSolvable}
                  onChange={(e) => setIsSolvable(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 bg-zinc-800 border-zinc-700"
                />
                <div className="text-xs">
                  <div className="font-medium text-zinc-200">
                    1. 수학적 오류 없이 정상적으로 풀이가 가능한가?
                  </div>
                  <div className="text-zinc-500 mt-0.5">
                    계산 실수, 정의 왜곡, 비논리적 가정이 없는지 확인
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] cursor-pointer hover:bg-zinc-900 transition-colors">
                <input
                  type="checkbox"
                  checked={hasSingleAnswer}
                  onChange={(e) => setHasSingleAnswer(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 bg-zinc-800 border-zinc-700"
                />
                <div className="text-xs">
                  <div className="font-medium text-zinc-200">
                    2. 정답의 유일성(단일 해)이 완벽히 보장되는가?
                  </div>
                  <div className="text-zinc-500 mt-0.5">
                    회전 대칭, 미정계수 미비로 복수 정답이 나올 가능성 배제
                  </div>
                </div>
              </label>
            </div>

            {/* Difficulty rating */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                체감 난이도 평가
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: '하 (기본 개념)' },
                  { id: 'medium', label: '중 (응용/추론)' },
                  { id: 'hard', label: '상 (심화/복합)' },
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setDifficulty(level.id as any)}
                    className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-colors cursor-pointer ${
                      difficulty === level.id
                        ? 'bg-zinc-800 border-white/20 text-white shadow-sm'
                        : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error findings */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                발견된 수학적 오류 또는 모호한 점 (없을 시 비워두기)
              </label>
              <textarea
                rows={2}
                value={foundErrors}
                onChange={(e) => setFoundErrors(e.target.value)}
                placeholder="예: 초안에서 회전 방향이 지정되지 않아 답이 4개 발생함 등"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Improvement suggestion */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                수정 및 개선 제안 (개발 연구 피드백)
              </label>
              <textarea
                rows={2}
                value={improvementSuggestion}
                onChange={(e) => setImprovementSuggestion(e.target.value)}
                placeholder="예: 지문에 '가장 짧은 변'이라는 한정 조건을 추가하여 유일성을 확보하면 좋겠음."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>동료 검증 피드백 공식 등록</span>
            </button>
          </form>

          {/* Existing Peer Reviews for this problem */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              누적된 동료 검증 기록 ({activeProblem.peerReviews?.length || 0}건)
            </h4>

            {activeProblem.peerReviews?.length === 0 ? (
              <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] text-center text-xs text-zinc-500">
                아직 등록된 동료 검증 기록이 없습니다. 위 양식으로 첫 검증을 남겨주세요.
              </div>
            ) : (
              <div className="space-y-3">
                {activeProblem.peerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200">{rev.reviewerName}</span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {rev.reviewedAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className={rev.isSolvable ? 'text-emerald-400' : 'text-rose-400'}>
                          {rev.isSolvable ? '✔ 풀이 가능' : '✖ 오류 있음'}
                        </span>
                        <span>·</span>
                        <span className={rev.hasSingleAnswer ? 'text-emerald-400' : 'text-amber-400'}>
                          {rev.hasSingleAnswer ? '✔ 유일성 확인' : '▲ 복수 정답'}
                        </span>
                      </div>
                    </div>

                    {rev.foundErrors && (
                      <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-300">
                        <strong className="text-zinc-400">지적 사항:</strong> {rev.foundErrors}
                      </div>
                    )}

                    {rev.improvementSuggestion && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 text-emerald-200 border border-emerald-500/10">
                        <strong className="text-emerald-400">개선 제안:</strong>{' '}
                        {rev.improvementSuggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
