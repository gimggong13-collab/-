import React, { useState } from 'react';
import { TeamTheme } from '../types';
import { KeyRound, ShieldCheck, Layers, FileEdit, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface TeamMastermindProps {
  theme: TeamTheme;
  onUpdateTheme: (updated: TeamTheme) => void;
  onNextStep: () => void;
}

export const TeamMastermind: React.FC<TeamMastermindProps> = ({
  theme,
  onUpdateTheme,
  onNextStep,
}) => {
  const [formData, setFormData] = useState<TeamTheme>(theme);
  const [isSaved, setIsSaved] = useState(false);

  // Check duplicate clue values
  const clues = formData.problems.map((p) => p.keyClue || '');
  const hasDuplicates = clues.filter((c, idx) => c && clues.indexOf(c) !== idx).length > 0;
  const isAllCluesPresent = clues.every((c) => c.trim().length > 0);

  // Auto-calculated combined master code
  const calculatedMasterCode = formData.problems
    .map((p) => p.keyClue.trim())
    .join('');

  const handleFieldChange = (field: keyof TeamTheme, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleSaveTheme = () => {
    onUpdateTheme(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSyncCalculatedCode = () => {
    setFormData((prev) => ({
      ...prev,
      finalMasterPasscode: calculatedMasterCode,
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span>04단계 모둠 테마 및 병렬 구조 완성</span>
            <span>·</span>
            <span>Parallel to Master Vault Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            모둠 테마 종합 설계실
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            모둠원 6명이 각자 개발한 독립 문제들을 하나의 흥미진진한 방탈출 스토리로 결합합니다.
            확정된 **병렬형 구조**에 따라 각 문제의 정답 단서가 중앙 마스터 금고의 최종 암호로 결합됩니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 font-medium text-xs sm:text-sm hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>테마 저장 완료</span>
              </>
            ) : (
              <>
                <FileEdit className="w-4 h-4 text-zinc-800" />
                <span>모둠 테마 저장</span>
              </>
            )}
          </button>

          <button
            onClick={onNextStep}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <span>다음: 방탈출 플레이</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Story & Synopsis Card */}
      <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/[0.08] space-y-4">
        <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>모둠 테마 스토리라인 및 세계관 설정</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              모둠 이름
            </label>
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) => handleFieldChange('teamName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              방탈출 테마 제목 (Story Title)
            </label>
            <input
              type="text"
              value={formData.storyTitle}
              onChange={(e) => handleFieldChange('storyTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            테마 배경 이야기 및 탈출 시놉시스
          </label>
          <textarea
            rows={3}
            value={formData.storySynopsis}
            onChange={(e) => handleFieldChange('storySynopsis', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Revolut-style Parallel Multi-Node Matrix Diagram */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-950 to-black border border-white/[0.1] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block">
              PARALLEL TOPOLOGY MAP
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              6개 독립 문제와 중앙 마스터 금고 연결 구조
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
              병렬형 (자유 순서 공략)
            </span>
          </div>
        </div>

        {/* 6 Peripheral Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formData.problems.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] relative group hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-zinc-400">
                  CHAMBER #{p.authorNumber}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-amber-500/20">
                  단서 조각: <strong className="text-white text-sm">{p.keyClue || '?'}</strong>
                </span>
              </div>

              <div className="font-semibold text-sm text-white">{p.authorName}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{p.topic}</div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>정답: {p.answerValue || '-'}</span>
                <span>검증: {p.peerReviews?.length || 0}건</span>
              </div>
            </div>
          ))}
        </div>

        {/* Central Master Vault Combination Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-amber-950/30 border border-indigo-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">
                최종 마스터 금고 암호 결합 규칙
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncCalculatedCode}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline cursor-pointer"
              >
                1~6번 단서 순서대로 자동 동기화
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                암호 결합 규칙 설명 (플레이어 안내문구)
              </label>
              <input
                type="text"
                value={formData.masterPasscodeRule}
                onChange={(e) => handleFieldChange('masterPasscodeRule', e.target.value)}
                placeholder="예: 1번부터 6번 문제에서 획득한 각 단서 숫자를 순서대로 나열한 6자리 코드"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                최종 탈출 패스코드 (Master Passcode)
              </label>
              <input
                type="text"
                value={formData.finalMasterPasscode}
                onChange={(e) => handleFieldChange('finalMasterPasscode', e.target.value)}
                placeholder="예: 342795"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-amber-500/40 text-amber-300 font-mono font-bold text-base tracking-widest text-center focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Real-time Integrity Checklist */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] space-y-2 text-xs">
            <span className="font-semibold text-zinc-300 block mb-1">
              모둠 통합 무결성 점검 결과
            </span>
            <div className="flex items-center gap-2">
              {isAllCluesPresent ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className={isAllCluesPresent ? 'text-zinc-300' : 'text-amber-300'}>
                6개 문제 단서 조각 완전성: {isAllCluesPresent ? '6개 모두 등록됨' : '미등록 단서 존재'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!hasDuplicates ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className={!hasDuplicates ? 'text-zinc-300' : 'text-amber-300'}>
                정답 및 단서 중복 여부: {!hasDuplicates ? '중복 없음 (유일성 통과)' : '단서 중복 발견 (재조율 권장)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-zinc-300">
                도출 논리: 각 문제 해결 후 획득한 단서의 결합 규칙이 명확함
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
