import React, { useState } from 'react';
import { TeamTheme, RubricScore, ProblemRecord } from '../types';
import { MathRenderer } from '../utils/mathRenderer';
import { Printer, Award, FileText, CheckCircle2, BookmarkCheck, PenTool } from 'lucide-react';

interface AssessmentReportProps {
  theme: TeamTheme;
}

export const AssessmentReport: React.FC<AssessmentReportProps> = ({ theme }) => {
  // Rubric scoring state for teacher / group evaluation
  const [rubric, setRubric] = useState<RubricScore>({
    mathValidity: 4,
    singleAnswer: 4,
    devProcessDesc: 4,
    teamIntegration: 4,
    teacherComment:
      '수학적 개념(마방진의 중심수, 다항식의 인수정리, 아폴로니우스의 원 자취, 명제의 대우, 모듈로 역원, 피타고라스 삼조)을 방탈출 문제 상황에 창의적으로 접목함. 특히 동료 검증을 통해 발견된 정답 다중성과 계산 오차를 v1.0에서 v2.0으로 수정·개선하는 개발 연구 절차(착안-제작-검증-수정-완성)를 논리적으로 완벽히 설명함.',
  });

  const [activeStudentFilter, setActiveStudentFilter] = useState<number | 'all'>('all');

  const handlePrint = () => {
    window.print();
  };

  // Split problems into Page 1 (1~3) and Page 2 (4~6) for guaranteed 2-page print
  const page1Problems = theme.problems.slice(0, 3);
  const page2Problems = theme.problems.slice(3, 6);

  const renderProblemCard = (p: ProblemRecord) => (
    <div
      key={p.id}
      className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-[11px] print:text-[10px] print:p-2.5 print:space-y-1.5 print-break-inside-avoid"
    >
      <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-indigo-700">
            SLOT #{p.authorNumber}
          </span>
          <span className="font-bold text-zinc-900 text-xs print:text-[11px]">
            {p.authorName} · {p.topic}
          </span>
        </div>
        <div className="font-mono font-semibold text-zinc-700 bg-white border border-zinc-200 px-2 py-0.5 rounded text-[10px]">
          정답: {p.answerValue} · 단서: [{p.keyClue}]
        </div>
      </div>

      {/* Rationale and Math Concept */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10.5px] print:text-[9.5px]">
        <div>
          <strong className="text-zinc-600 block">제작 이유 및 출처:</strong>
          <span className="text-zinc-800 leading-snug line-clamp-2">
            {p.creationReason} ({p.sourceCitation})
          </span>
        </div>
        <div>
          <strong className="text-zinc-600 block">수학적 원리:</strong>
          <span className="text-zinc-800 leading-snug line-clamp-2">
            {p.mathConcept}
          </span>
        </div>
      </div>

      {/* Formula & Handwriting Preview */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1 border-t border-zinc-200/80">
        {p.problemFormula && (
          <div className="flex-1 p-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 font-mono overflow-x-auto">
            <span className="text-[9px] text-zinc-400 block font-sans font-medium mb-0.5">
              수학적 조건 및 수식:
            </span>
            <MathRenderer content={p.problemFormula} forceMathMode={true} className="text-xs print:text-[10px]" />
          </div>
        )}

        {p.drawingDataUrl && (
          <div className="w-36 shrink-0 p-1 rounded-lg bg-black border border-zinc-300 flex items-center justify-center overflow-hidden">
            <img
              src={p.drawingDataUrl}
              alt="손필기 수식"
              className="max-h-16 max-w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Revision Diff (수정 전후 비교 - 개발 연구 핵심 근거) */}
      {p.revisionHistory && p.revisionHistory.length > 0 && (
        <div className="pt-1 border-t border-zinc-200/80">
          <div className="grid grid-cols-2 gap-1.5 text-[9.5px] print:text-[9px]">
            <div className="p-1.5 rounded bg-red-50 text-red-900 border border-red-100">
              <strong className="text-red-700 block">[수정 전 결함]</strong>
              <span className="line-clamp-2">{p.revisionHistory[0].previousContent}</span>
            </div>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-100">
              <strong className="text-emerald-700 block">[수정 후 개선]</strong>
              <span className="line-clamp-2">{p.revisionHistory[0].revisedContent}</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 mt-0.5 italic truncate">
            <strong>수정 이유:</strong> {p.revisionHistory[0].revisionReason}
          </div>
        </div>
      )}

      {/* Peer Review Summary */}
      {p.peerReviews && p.peerReviews.length > 0 && (
        <div className="text-[9.5px] print:text-[9px] text-zinc-600 bg-white p-1.5 rounded border border-zinc-200 flex items-center justify-between">
          <span className="truncate">
            <strong className="text-indigo-700">검증자({p.peerReviews[0].reviewerName}):</strong>{' '}
            {p.peerReviews[0].foundErrors || '오류 없음'}{' '}
            {p.peerReviews[0].improvementSuggestion && `→ ${p.peerReviews[0].improvementSuggestion}`}
          </span>
          <span className="shrink-0 font-mono text-emerald-700 ml-2">
            ✔ 정답 유일성 확인
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner (Hidden in Print) */}
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <span>06단계 포트폴리오 산출 및 평가</span>
            <span>·</span>
            <span>A4용지 2장 최적화 리포트</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            개발 연구 탐구보고서 & 평가 루브릭
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            인쇄 및 PDF 다운로드 시 정확히 **A4용지 2장**에 모든 내용(1페이지: 개요 및 1~3번 문제 / 2페이지: 4~6번 문제 및 루브릭·세특)이 여백 넘침 없이 깔끔하게 수납되도록 설계되었습니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4 text-zinc-900" />
            <span>보고서 인쇄 / PDF 다운로드 (A4 2장 규격)</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (No Print) */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveStudentFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
            activeStudentFilter === 'all'
              ? 'bg-zinc-800 text-white border-white/20'
              : 'bg-zinc-950 text-zinc-400 border-white/[0.06] hover:text-white'
          }`}
        >
          전체 모둠 종합 보고서 (A4 2장 일괄)
        </button>
        {theme.problems.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveStudentFilter(p.authorNumber)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
              activeStudentFilter === p.authorNumber
                ? 'bg-zinc-800 text-white border-white/20'
                : 'bg-zinc-950 text-zinc-400 border-white/[0.06] hover:text-white'
            }`}
          >
            #{p.authorNumber} {p.authorName} ({p.topic})
          </button>
        ))}
      </div>

      {/* Official Printable Report Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white text-zinc-900 border border-zinc-200 shadow-2xl print:border-none print:shadow-none print:p-0">
        
        {/* ================= PAGE 1 ================= */}
        <div className="print-page print-page-1 space-y-4">
          {/* Document Header */}
          <div className="border-b-2 border-zinc-900 pb-3 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-wider text-indigo-700 uppercase">
                2022 개정 교육과정 수학과제 탐구 수행평가 결과물 [12수과02-04 개발 연구] (1/2)
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 mt-0.5 tracking-tight">
                수학 방탈출 문제 개발 연구 종합 보고서
              </h2>
            </div>

            <div className="text-right text-[10.5px] text-zinc-700 space-y-0.5">
              <div><strong>모둠명:</strong> {theme.teamName}</div>
              <div><strong>테마 제목:</strong> {theme.storyTitle}</div>
              <div><strong>보고서 발급일자:</strong> {new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          {/* Section 1: 모둠 테마 및 병렬 구조 개요 */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-zinc-950 border-b border-zinc-300 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full inline-block" />
              1. 모둠 테마 기획 및 병렬 문제 연결 구조
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                <strong className="text-zinc-600 block mb-0.5">테마 시놉시스</strong>
                <p className="text-zinc-800 leading-snug line-clamp-3">{theme.storySynopsis}</p>
              </div>

              <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                <strong className="text-zinc-600 block mb-0.5">문제 연결 구조</strong>
                <p className="text-zinc-800 leading-snug">
                  <strong>병렬형 (6-Node Parallel):</strong> 6인이 독립된 문제를 동시 공략 후, 획득한 각 단서를 조합하여 중앙 마스터 금고를 해제함.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                <strong className="text-zinc-600 block mb-0.5">최종 마스터 암호 및 결합 규칙</strong>
                <div className="font-mono text-xs font-bold text-indigo-700">
                  PASSCODE: {theme.finalMasterPasscode}
                </div>
                <p className="text-zinc-700 leading-snug mt-0.5 truncate">{theme.masterPasscodeRule}</p>
              </div>
            </div>
          </div>

          {/* Section 2: 학생 개인별 문제 기록지 (전반부: 1번~3번 문제) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-950 border-b border-zinc-300 pb-1 flex items-center justify-between uppercase tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full inline-block" />
                2. 학생별 문제 개발 기록 및 수정 전후 비교 (슬롯 #1 ~ #3)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">착안 → 제작 → 검증 → 수정</span>
            </h3>

            <div className="space-y-2.5">
              {(activeStudentFilter === 'all'
                ? page1Problems
                : theme.problems.filter((p) => p.authorNumber === activeStudentFilter && p.authorNumber <= 3)
              ).map((p) => renderProblemCard(p))}
            </div>
          </div>

          {/* Page 1 Footer stamp */}
          <div className="text-right text-[9px] text-zinc-400 font-mono pt-1">
            수학 방탈출 개발 연구 보고서 - 1 / 2 페이지
          </div>
        </div>

        {/* Page Break for Print */}
        <div className="print-page-break my-8 border-b-2 border-dashed border-zinc-200 no-print" />

        {/* ================= PAGE 2 ================= */}
        <div className="print-page print-page-2 space-y-4 pt-4 print:pt-0">
          {/* Page 2 Mini Header */}
          <div className="border-b border-zinc-900 pb-2 flex items-center justify-between text-xs">
            <div className="font-bold text-zinc-900">
              수학 방탈출 문제 개발 연구 종합 보고서 (2/2) · {theme.teamName}
            </div>
            <div className="text-[10px] text-zinc-600 font-mono">
              성취기준: [12수과02-04] 개발 연구
            </div>
          </div>

          {/* Section 2 (후반부: 4번~6번 문제) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-950 border-b border-zinc-300 pb-1 flex items-center justify-between uppercase tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full inline-block" />
                2. 학생별 문제 개발 기록 및 수정 전후 비교 (슬롯 #4 ~ #6)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">착안 → 제작 → 검증 → 수정</span>
            </h3>

            <div className="space-y-2.5">
              {(activeStudentFilter === 'all'
                ? page2Problems
                : theme.problems.filter((p) => p.authorNumber === activeStudentFilter && p.authorNumber > 3)
              ).map((p) => renderProblemCard(p))}
            </div>
          </div>

          {/* Section 3: 교육과정 성취기준 [12수과02-04] 연계 교사용 평가 루브릭 */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-300 print-break-inside-avoid">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5 uppercase tracking-wide">
                <Award className="w-3.5 h-3.5 text-indigo-700" />
                <span>3. 교육과정 성취기준 [12수과02-04] 연계 교사용 평가 루브릭</span>
              </h3>
              <span className="text-[10px] text-indigo-700 font-bold font-mono">
                총점: {rubric.mathValidity + rubric.singleAnswer + rubric.devProcessDesc + rubric.teamIntegration} / 16점
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[9.5px] print:text-[8.5px] text-left border-collapse border border-zinc-300">
                <thead className="bg-zinc-100 text-zinc-800">
                  <tr>
                    <th className="p-1.5 border border-zinc-300 w-1/4">평가 영역 및 관점</th>
                    <th className="p-1.5 border border-zinc-300">매우 우수 (4점)</th>
                    <th className="p-1.5 border border-zinc-300">우수 (3점)</th>
                    <th className="p-1.5 border border-zinc-300">보통 (2점)</th>
                    <th className="p-1.5 border border-zinc-300">노력 요함 (1점)</th>
                    <th className="p-1.5 border border-zinc-300 w-12 text-center">평정</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="p-1.5 border border-zinc-300 font-semibold">
                      1. 수학적 타당성 및 개념 적용
                    </td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">수학적 정의와 원리가 완벽하며 오류 없음</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">대부분 타당하며 사소한 오차 교정됨</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">개념 적용에 일부 한계 있음</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">수학적 오류 미해결</td>
                    <td className="p-1.5 border border-zinc-300 text-center font-bold text-indigo-700">
                      <select
                        value={rubric.mathValidity}
                        onChange={(e) => setRubric({ ...rubric, mathValidity: Number(e.target.value) })}
                        className="bg-zinc-100 border border-zinc-300 rounded px-1 py-0.5 font-mono no-print text-[10px]"
                      >
                        <option value="4">4점</option>
                        <option value="3">3점</option>
                        <option value="2">2점</option>
                        <option value="1">1점</option>
                      </select>
                      <span className="print:inline hidden">{rubric.mathValidity}점</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1.5 border border-zinc-300 font-semibold">
                      2. 정답 유일성 및 조건 엄밀성
                    </td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">오직 단 하나의 정답만 도출되도록 한정됨</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">정답 유일하나 풀이 일부 모호성 잔존</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">복수 정답 가능성이 일부 있음</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">유일성 확보 실패</td>
                    <td className="p-1.5 border border-zinc-300 text-center font-bold text-indigo-700">
                      <select
                        value={rubric.singleAnswer}
                        onChange={(e) => setRubric({ ...rubric, singleAnswer: Number(e.target.value) })}
                        className="bg-zinc-100 border border-zinc-300 rounded px-1 py-0.5 font-mono no-print text-[10px]"
                      >
                        <option value="4">4점</option>
                        <option value="3">3점</option>
                        <option value="2">2점</option>
                        <option value="1">1점</option>
                      </select>
                      <span className="print:inline hidden">{rubric.singleAnswer}점</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1.5 border border-zinc-300 font-semibold">
                      3. 개발 절차 이해 및 수정 설명력
                    </td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">착안-제작-검증-수정 절차를 체계적 설명</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">수정 전후가 기록되고 이유가 명확함</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">수정 전후 비교가 다소 형식적임</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">개발 절차 설명 부족</td>
                    <td className="p-1.5 border border-zinc-300 text-center font-bold text-indigo-700">
                      <select
                        value={rubric.devProcessDesc}
                        onChange={(e) => setRubric({ ...rubric, devProcessDesc: Number(e.target.value) })}
                        className="bg-zinc-100 border border-zinc-300 rounded px-1 py-0.5 font-mono no-print text-[10px]"
                      >
                        <option value="4">4점</option>
                        <option value="3">3점</option>
                        <option value="2">2점</option>
                        <option value="1">1점</option>
                      </select>
                      <span className="print:inline hidden">{rubric.devProcessDesc}점</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1.5 border border-zinc-300 font-semibold">
                      4. 모둠 테마 통합성 및 협업 기여도
                    </td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">6인의 단서가 마스터 금고에 유기적 결합</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">스토리와 암호 결합이 조화로움</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">단서 결합 논리가 다소 단순함</td>
                    <td className="p-1.5 border border-zinc-300 text-zinc-600">문제 간 결합성 부족</td>
                    <td className="p-1.5 border border-zinc-300 text-center font-bold text-indigo-700">
                      <select
                        value={rubric.teamIntegration}
                        onChange={(e) => setRubric({ ...rubric, teamIntegration: Number(e.target.value) })}
                        className="bg-zinc-100 border border-zinc-300 rounded px-1 py-0.5 font-mono no-print text-[10px]"
                      >
                        <option value="4">4점</option>
                        <option value="3">3점</option>
                        <option value="2">2점</option>
                        <option value="1">1점</option>
                      </select>
                      <span className="print:inline hidden">{rubric.teamIntegration}점</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Teacher 종합 평가의견 (학생부 세특 기재란) */}
            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[10px] print:text-[9px] space-y-1">
              <strong className="text-zinc-900 block">
                지도교사 총평 및 학생부 과목별 세부능력 및 특기사항(세특) 기재 예시
              </strong>
              <textarea
                rows={2}
                value={rubric.teacherComment}
                onChange={(e) => setRubric({ ...rubric, teacherComment: e.target.value })}
                className="w-full p-2 rounded border border-zinc-300 text-zinc-800 leading-snug font-sans focus:outline-none focus:border-indigo-600 no-print"
              />
              <p className="print:block hidden text-zinc-800 leading-snug">
                {rubric.teacherComment}
              </p>
            </div>
          </div>

          {/* Page 2 Footer stamp */}
          <div className="text-right text-[9px] text-zinc-400 font-mono pt-1">
            수학 방탈출 개발 연구 보고서 - 2 / 2 페이지 (완결)
          </div>
        </div>

      </div>
    </div>
  );
};
