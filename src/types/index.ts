/**
 * Types for Math Escape Lab (수학 방탈출 개발 연구 포털)
 * Aligned with 2022 개정 교육과정 수학과제 탐구 [12수과02-04] 개발 연구
 */

export interface PeerReview {
  id: string;
  reviewerName: string;
  reviewerNumber?: number;
  isSolvable: boolean;
  hasSingleAnswer: boolean; // 정답 유일성 검증
  difficulty: 'easy' | 'medium' | 'hard';
  foundErrors: string; // 발견된 수학적 오류
  improvementSuggestion: string; // 개선 제안
  reviewedAt: string;
}

export interface RevisionEntry {
  version: number;
  revisedAt: string;
  previousContent: string;
  revisedContent: string;
  revisionReason: string; // 수정 이유 및 반영된 피드백
}

export interface ProblemRecord {
  id: string;
  authorName: string;
  authorNumber: number; // 모둠 내 1~6번 학생
  topic: string; // 마방진, 다항식, 아폴로니우스의 원, 집합과 명제, 암호수학 등
  sourceCitation: string; // 참고자료 출처
  creationReason: string; // 문제 제작 이유
  mathConcept: string; // 핵심 수학적 아이디어 및 원리
  problemStory: string; // 방탈출 상황 지문
  problemFormula: string; // 수식 및 세부 조건 (LaTeX 지원)
  drawingDataUrl?: string; // 터치펜/스타일러스 손필기 수식 및 도형 스케치 (DataURL)
  answerValue: string; // 정답값
  keyClue: string; // 최종 마스터 금고로 연결되는 단서 조각 (숫자 또는 문자)
  hintLevel1: string; // 1차 힌트 (개념적 착안점)
  hintLevel2: string; // 2차 힌트 (접근 공식 및 풀이 방향)
  solutionDetailed: string; // 수학적 풀이 과정 전문
  revisionHistory: RevisionEntry[]; // 개발 과정 및 수정 이력
  peerReviews: PeerReview[]; // 동료 교차 검증 피드백 목록
  updatedAt: string;
}

export interface TeamTheme {
  teamName: string;
  storyTitle: string;
  storySynopsis: string;
  structureType: 'parallel'; // 병렬형 고정
  problems: ProblemRecord[];
  finalMasterPasscode: string; // 6개 단서가 결합된 최종 탈출 암호
  masterPasscodeRule: string; // 결합 규칙 설명 (예: 1번~6번 단서 순서대로 나열)
  integrationCheck: {
    noDuplicateAnswers: boolean;
    logicalDerivationVerified: boolean;
    notes: string;
  };
}

export interface PlaySessionState {
  solvedProblemIds: string[];
  collectedClues: Record<number, string>; // authorNumber -> keyClue
  unlockedHints: Record<string, number>; // problemId -> level (0: none, 1: hint1, 2: hint2, 3: solution)
  incorrectAttempts: Record<string, number>;
  masterAttempts: number;
  isEscaped: boolean;
  elapsedSeconds: number;
  isPlaying: boolean;
}

export interface RubricScore {
  mathValidity: number; // 1~4
  singleAnswer: number; // 1~4
  devProcessDesc: number; // 1~4
  teamIntegration: number; // 1~4
  teacherComment: string;
}
