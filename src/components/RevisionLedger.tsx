import React, { useState } from 'react';
import { ProblemRecord, RevisionEntry } from '../types';
import { GitCompare, History, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface RevisionLedgerProps {
  problems: ProblemRecord[];
  onAddRevision: (problemId: string, revision: RevisionEntry) => void;
  onNextStep: () => void;
}

export const RevisionLedger: React.FC<RevisionLedgerProps> = ({
  problems,
  onAddRevision,
  onNextStep,
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(problems[0].id);
  const activeProblem = problems.find((p) => p.id === selectedProblemId) || problems[0];

  const [isAdding, setIsAdding] = useState(false);
  const [previousContent, setPreviousContent] = useState('');
  const [revisedContent, setRevisedContent] = useState('');
  const [revisionReason, setRevisionReason] = useState('');

  const handleSaveRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisedContent.trim() || !revisionReason.trim()) {
      alert('수정 내용과 이유를 모두 입력해 주세요.');
      return;
    }

    const nextVer = (activeProblem.revisionHistory?.length || 0) + 1;
    const newEntry: RevisionEntry = {
      version: nextVer,
      revisedAt: new Date().toISOString().split('T')[0],
      previousContent: previousContent.trim() || '초안 (v1.0 문제문 및 조건)',
      revisedContent: revisedContent.trim(),
      revisionReason: revisionReason.trim(),
    };

    onAddRevision(activeProblem.id, newEntry);
    setIsAdding(false);
    setPreviousContent('');
    setRevisedContent('');
    setRevisionReason('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <span>03단계 개발 연구 검증 및 수정</span>
            <span>·</span>
            <span>성취기준 [12수과02-04] 핵심 평가 근거</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            수정 및 개선 이력 기록부 (Revision Ledger)
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            2단계 동료 검증(교차 시험 풀이)에서 도출된 오류와 정답 유일성 결함을 개선한 내역을 기록합니다.
            수정 전후 비교와 명확한 수정 이유는 개발 연구의 타당성을 입증하는 결정적 포트폴리오 자료입니다.
          </p>
        </div>

        <button
          onClick={onNextStep}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>다음: 모둠 테마 통합</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Selector */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-3">
          문제별 수정 내역 열람 및 등록
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {problems.map((p) => {
            const isSelected = p.id === selectedProblemId;
            const revCount = p.revisionHistory?.length || 0;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProblemId(p.id);
                  setIsAdding(false);
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500/80 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-zinc-950/60 border-white/[0.06] hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-zinc-400">
                    #{p.authorNumber} {p.authorName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    개정 {revCount}회
                  </span>
                </div>
                <div className="font-semibold text-sm text-white truncate">
                  {p.topic}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                  <span className={revCount > 0 ? 'text-amber-400' : 'text-zinc-500'}>
                    {revCount > 0 ? `v${revCount + 1}.0 최종판` : '초안 유지'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 rounded-3xl bg-zinc-950/80 border border-white/[0.08]">
          <div>
            <div className="text-xs text-amber-400 font-mono">
              SLOT #{activeProblem.authorNumber} · {activeProblem.authorName}
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {activeProblem.topic} 개정 이력
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              동료 피드백 {activeProblem.peerReviews?.length || 0}건 반영 완료
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAdding ? '작성 취소' : '새 수정 이력 등록'}</span>
          </button>
        </div>

        {/* New Revision Form */}
        {isAdding && (
          <form
            onSubmit={handleSaveRevision}
            className="p-6 rounded-3xl bg-zinc-950 border border-amber-500/30 space-y-4 animate-fade-in shadow-xl"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>새로운 개정(v{(activeProblem.revisionHistory?.length || 0) + 1}.0) 기록 추가</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  수정 전 내용 (초안 또는 이전 버전의 문제점)
                </label>
                <textarea
                  rows={3}
                  required
                  value={previousContent}
                  onChange={(e) => setPreviousContent(e.target.value)}
                  placeholder="예: 초안에서는 회전 형태가 지정되지 않아 답이 4가지로 갈리는 상태였음."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  수정 후 개선된 내용 (반영된 최종 조건)
                </label>
                <textarea
                  rows={3}
                  required
                  value={revisedContent}
                  onChange={(e) => setRevisedContent(e.target.value)}
                  placeholder="예: 중앙수 5와 모서리 8을 명시하여 단일한 해 3만 나오도록 조건을 보강함."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                수정 이유 및 동료 피드백 연계 설명
              </label>
              <input
                type="text"
                required
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                placeholder="예: 동료 검증자 이서연 학생의 '정답 다중성 발생' 지적을 수용하여 정답 유일성 확립."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-zinc-400 hover:text-white"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs transition-colors"
              >
                이력 저장하기
              </button>
            </div>
          </form>
        )}

        {/* Existing Revision Cards (Diff View) */}
        <div className="space-y-4">
          {(!activeProblem.revisionHistory || activeProblem.revisionHistory.length === 0) ? (
            <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/[0.06] text-center text-sm text-zinc-500">
              아직 등록된 개정 이력이 없습니다. [새 수정 이력 등록] 버튼을 눌러 수정 전후 내용을 기록하세요.
            </div>
          ) : (
            activeProblem.revisionHistory.map((rev, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-zinc-950/80 border border-white/[0.08] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      REVISION #{rev.version}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      기록일자: {rev.revisedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>개선 완료</span>
                  </div>
                </div>

                {/* Diff Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1">
                      <span>BEFORE (수정 전 내용 / 결함)</span>
                    </div>
                    <p className="text-xs text-rose-200 leading-relaxed font-sans">
                      {rev.previousContent}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                      <span>AFTER (수정 후 개선 결과)</span>
                    </div>
                    <p className="text-xs text-emerald-200 leading-relaxed font-sans">
                      {rev.revisedContent}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/[0.06] text-xs">
                  <span className="text-zinc-400 font-semibold">수정 사유 및 반영 내용: </span>
                  <span className="text-zinc-200">{rev.revisionReason}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
