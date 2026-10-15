import React, { useState } from 'react';
import { ProblemRecord } from '../types';
import { MathRenderer } from '../utils/mathRenderer';
import { MathHandwritingCanvas } from './MathHandwritingCanvas';
import { BookOpen, HelpCircle, Key, Lightbulb, Save, CheckCircle2, FileText, ArrowRight, PenTool, Type } from 'lucide-react';

interface AuthoringStudioProps {
  problems: ProblemRecord[];
  onUpdateProblem: (updated: ProblemRecord) => void;
  onNextStep: () => void;
}

export const AuthoringStudio: React.FC<AuthoringStudioProps> = ({
  problems,
  onUpdateProblem,
  onNextStep,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const currentProblem = problems.find((p) => p.authorNumber === selectedNumber) || problems[0];

  const [formData, setFormData] = useState<ProblemRecord>(currentProblem);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [formulaMode, setFormulaMode] = useState<'text' | 'draw'>('text');

  // Switch student
  const handleSelectStudent = (num: number) => {
    setSelectedNumber(num);
    const target = problems.find((p) => p.authorNumber === num);
    if (target) {
      setFormData(target);
      setIsSaved(false);
    }
  };

  const handleChange = (field: keyof ProblemRecord, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString().split('T')[0],
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdateProblem(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Hero / Context Banner (Revolut minimal editorial) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span>01단계 개발 연구 착안 및 제작</span>
            <span>·</span>
            <span>성취기준 [12수과02-04]</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            개인 문제 기록지 작성실
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            모둠원 6명이 각자 고교 수학 개념을 바탕으로 방탈출 문제를 개발합니다.
            수학적 엄밀성, 정답의 유일성, 그리고 최종 마스터 금고로 연결될 단서 조각을 설계하세요.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 font-medium text-xs sm:text-sm hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>저장 완료</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-zinc-800" />
                <span>문제 기록지 저장</span>
              </>
            )}
          </button>

          <button
            onClick={onNextStep}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <span>다음: 동료 검증</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6-Student Multi-Selector (Revolut Card Carousel style) */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-3">
          모둠원 6인 개발 슬롯 선택 (학생별 1문제 개발)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {problems.map((p) => {
            const isSelected = p.authorNumber === selectedNumber;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectStudent(p.authorNumber)}
                className={`p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-indigo-500/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-zinc-950/60 border-white/[0.06] hover:bg-zinc-900/60 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-medium text-zinc-400">
                    SLOT #{p.authorNumber}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      p.answerValue ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    단서: {p.keyClue || '미설정'}
                  </span>
                </div>
                <div className="font-semibold text-sm text-white truncate">
                  {p.authorName}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {p.topic}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Form Deck on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Author & Topic Metadata */}
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-5">
            <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>기본 정보 및 탐구 배경</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  제작자 이름
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleChange('authorName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="예: 김민준"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  수학 탐구 주제 / 소재
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="예: 마방진, 아폴로니우스의 원 등"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                참고자료 출처 (교과서, 논문, 기사, 연구자료 등)
              </label>
              <input
                type="text"
                value={formData.sourceCitation}
                onChange={(e) => handleChange('sourceCitation', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="예: 공통수학1 다항식 단원 교과서 및 기하학 연구 보고서"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                문제 제작 이유 (학습 목표 및 방탈출 적용 의도)
              </label>
              <textarea
                rows={2}
                value={formData.creationReason}
                onChange={(e) => handleChange('creationReason', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="어떤 수학적 개념을 문제 해결에 적용하고자 했는지 설명하세요."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                핵심 수학적 아이디어 및 원리
              </label>
              <textarea
                rows={2}
                value={formData.mathConcept}
                onChange={(e) => handleChange('mathConcept', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="예: 거리의 비가 m:n인 점의 자취는 아폴로니우스의 원을 이룸."
              />
            </div>
          </div>

          {/* Card 2: Escape Room Scenario & Problem Statement */}
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-5">
            <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>방탈출 상황 지문 및 수식 조건</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                방탈출 상황 지문 (플레이어가 마주할 스토리 & 암호문)
              </label>
              <textarea
                rows={4}
                value={formData.problemStory}
                onChange={(e) => handleChange('problemStory', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="방탈출 공간의 분위기와 상황 지문을 몰입감 있게 작성하세요."
              />
            </div>

            {/* Formula and Handwriting Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs font-medium text-zinc-400">
                  수학적 조건 및 수식 작성 (LaTeX 렌더링 & 터치펜 필기 지원)
                </label>
                {/* Segmented Mode Switcher */}
                <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-white/[0.08] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setFormulaMode('text')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      formulaMode === 'text'
                        ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>LaTeX 수식 입력</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormulaMode('draw')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      formulaMode === 'draw'
                        ? 'bg-zinc-800 text-amber-300 shadow-sm border border-white/10'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>🖊️ 터치펜 직접 필기</span>
                  </button>
                </div>
              </div>

              {formulaMode === 'text' ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={formData.problemFormula}
                    onChange={(e) => handleChange('problemFormula', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="수식이나 엄밀한 수학 조건을 입력하세요. 예: $$P(x) = x^3 - 3x^2 + 4$$"
                  />
                  {formData.problemFormula && (
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                        수식 실시간 KaTeX 렌더링 미리보기
                      </span>
                      <MathRenderer content={formData.problemFormula} forceMathMode={true} className="text-zinc-200" />
                    </div>
                  )}
                </div>
              ) : (
                <MathHandwritingCanvas
                  key={`canvas-${formData.id}`}
                  initialDrawing={formData.drawingDataUrl}
                  onSave={(dataUrl) => {
                    setFormData((prev) => ({
                      ...prev,
                      drawingDataUrl: dataUrl,
                      updatedAt: new Date().toISOString().split('T')[0],
                    }));
                    setIsSaved(false);
                  }}
                  title={`[${formData.authorName}] 터치펜 수식 및 도형 필기장`}
                />
              )}
            </div>

            {/* Answer & Key Clue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  문제 정답 (Answer)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    type="text"
                    value={formData.answerValue}
                    onChange={(e) => handleChange('answerValue', e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="예: 3"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  플레이어가 이 방의 자물쇠를 풀 정답값
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  마스터 금고 연계 단서 조각 (Clue Piece)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.keyClue}
                  onChange={(e) => handleChange('keyClue', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-amber-300 font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                  placeholder="예: 3 (한 자리 숫자 권장)"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  6개 문제 해결 시 최종 금고 암호로 조합될 문자/숫자
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Hints & Mathematical Solution */}
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-5">
            <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>단계별 힌트 및 수학적 풀이 전문</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                1차 힌트 (1회 오답 또는 힌트 요청 시 공개: 개념적 착안점)
              </label>
              <input
                type="text"
                value={formData.hintLevel1}
                onChange={(e) => handleChange('hintLevel1', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="예: 마방진의 모든 가로, 세로, 대각선의 합은 15입니다."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                2차 힌트 (2회 오답 또는 추가 요청 시 공개: 핵심 공식 및 풀이 방향)
              </label>
              <input
                type="text"
                value={formData.hintLevel2}
                onChange={(e) => handleChange('hintLevel2', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="예: 내분점과 외분점을 지름의 양 끝점으로 활용하세요."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                수학적 상세 풀이 과정 (탈출 성공 또는 평가 보고서용)
              </label>
              <textarea
                rows={5}
                value={formData.solutionDetailed}
                onChange={(e) => handleChange('solutionDetailed', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="논리적 비약 없이 정답이 유일하게 도출되는 수학적 증명과정을 작성하세요."
              />
            </div>
          </div>
        </div>

        {/* Right Preview Card (5 cols) - Revolut Phone/Card Simulator style */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/[0.12] shadow-2xl relative overflow-hidden">
            {/* Subtle glow accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  실시간 플레이어 프리뷰
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                CHAMBER #{formData.authorNumber}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">
                  {formData.topic || '수학 주제'}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {formData.authorName}의 수학적 수수께끼
                </h3>
              </div>

              {/* Problem Story Box */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] text-sm text-zinc-200 leading-relaxed font-sans min-h-[90px]">
                {formData.problemStory || (
                  <span className="text-zinc-600 italic">
                    상황 지문을 입력하면 플레이어 화면에 실시간 표시됩니다.
                  </span>
                )}
              </div>

              {/* Math Formula Renderer (LaTeX) */}
              {formData.problemFormula && (
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-indigo-500/20 text-indigo-200">
                  <div className="text-[10px] font-mono uppercase text-indigo-400 mb-1 flex items-center justify-between">
                    <span>수학적 조건 및 수식 (KaTeX 렌더링)</span>
                    <span className="text-[9px] text-indigo-300">수식 모드</span>
                  </div>
                  <MathRenderer content={formData.problemFormula} forceMathMode={true} className="text-sm font-medium" />
                </div>
              )}

              {/* Handwritten Formula / Diagram Preview */}
              {formData.drawingDataUrl && (
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-amber-400 flex items-center justify-between">
                    <span>🖊️ 터치펜 손필기 수식·도형</span>
                    <span className="text-[9px] text-amber-300">손필기 첨부됨</span>
                  </div>
                  <div className="w-full h-32 rounded-lg bg-black overflow-hidden border border-white/10 flex items-center justify-center">
                    <img
                      src={formData.drawingDataUrl}
                      alt="Handwritten formula"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Mock Keypad / Input preview */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-400">정답 자물쇠</div>
                  <div className="text-sm font-mono text-zinc-300 mt-0.5">
                    {formData.answerValue ? `${formData.answerValue.length}자리 정답 등록됨` : '정답 미등록'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-zinc-400">획득 단서 조각</div>
                  <div className="text-base font-mono font-bold text-amber-400 mt-0.5">
                    {formData.keyClue ? `[ ${formData.keyClue} ]` : '[-]'}
                  </div>
                </div>
              </div>

              {/* Stepwise Hints status */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>1차 개념 힌트</span>
                  </span>
                  <span className={formData.hintLevel1 ? 'text-emerald-400' : 'text-zinc-600'}>
                    {formData.hintLevel1 ? '등록됨' : '미작성'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>2차 공식 힌트</span>
                  </span>
                  <span className={formData.hintLevel2 ? 'text-emerald-400' : 'text-zinc-600'}>
                    {formData.hintLevel2 ? '등록됨' : '미작성'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
