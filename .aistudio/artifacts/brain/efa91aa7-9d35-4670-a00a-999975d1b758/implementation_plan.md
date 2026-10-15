# 수학 방탈출 개발 연구 포털 (Math Escape Lab)

2022 개정 교육과정 수학과제 탐구 [12수과02-04] 성취기준에 기반하여, 고등학생들이 방탈출 수학 문제를 체계적으로 **개발(착안 → 제작 → 검증 → 수정 → 완성)**하고 모둠 테마로 결합하여 상호 체험 및 평가 보고서를 산출할 수 있는 전문 웹 애플리케이션 구축 계획입니다.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> 교사 질의를 통해 확정된 핵심 설계 사항과 기본 권장 방침입니다.

- **확정 결정 1: 병렬형 문제 연결 구조 (Parallel to Master Vault)**
  - 모둠원 6명이 각자 독립된 수학 문제(1번~6번)를 제작합니다.
  - 각 문제의 정답 값(숫자, 기호, 영문 등)이 모둠 테마의 '최종 탈출 암호(Master Passcode)'를 구성하는 조각(단서)으로 결합됩니다.
  - 플레이어는 원하는 순서대로 6문제를 공략할 수 있으며, 6개의 부분 단서를 모두 확보하여 중앙 금고/메인 콘솔에 최종 암호를 입력하면 탈출에 성공합니다.
- **확정 결정 2: 단계별 힌트 및 수학적 풀이 공개 체계 (Stepwise Reveal)**
  - 문제 풀이 시 즉각적인 정답 노출을 지양하고, 오답 횟수나 힌트 요청에 따라 단계적으로 안내합니다.
  - 1차 오답: 착안 단서(수학적 개념 힌트 1) 활성화
  - 2차 오답: 핵심 공식 및 접근 방향(수학적 힌트 2) 활성화
  - 최종 탈출 성공 시 또는 자포자기(풀이 보기) 선택 시: 제작자가 작성한 완전한 수학적 원리, 출처, 풀이 전문 및 개발 수정 이력이 투명하게 공개됩니다.
- **권장 결정 3: 데이터 보관 및 공유 방식 (Local + Team JSON Sync)**
  - 외부 로그인이나 API 장애 없이 학교 교실 환경(크롬북/태블릿/PC)에서 즉각 동작할 수 있도록 로컬 브라우저 저장소(localStorage) 자동 저장과 **원클릭 모둠 파일 내보내기/가져오기(JSON)** 체계를 채택합니다.
  - 학생이 개인 문제를 작성해 JSON으로 내보내면, 모둠장이 6명의 파일을 모아 한 번에 불러와 모둠 테마를 결합할 수 있습니다.

---

### 1. Overview & Core Concept

- **What It Does**:
  - 학생이 단원별 수학 개념(마방진, 다항식 연산, 아폴로니우스의 원, 집합과 명제, 암호수학 등)을 활용해 방탈출 문제를 개발하는 전 과정을 안내합니다.
  - 동료 학생 간의 교차 시험 풀이(Peer Review)를 통해 수학적 오류와 정답 유일성을 검증하고, 수정 전·후 이력을 누적 기록합니다.
  - 6인의 문제를 하나의 흥미로운 테마(예: 피타고라스 학파의 비밀 결사, 알베르티의 암호탑 등)로 통합하고, 실제로 플레이 가능한 인터랙티브 방탈출 모드와 학생부 기록용 탐구보고서를 자동 생성합니다.
- **Target Audience / Persona**:
  - **고등학교 2~3학년 수학과제 탐구 수강생**: 수학적 개념을 문제로 구현하고, 동료의 풀이를 검증하며 개발 프로세스를 체득.
  - **지도 교사**: [12수과02-04] 성취기준에 명시된 개발 연구 절차(착안-제작-검증-수정)의 실제 근거와 학생별 기여도를 한눈에 열람 및 평가.
- **Key Value**:
  - AI 생성형 모델에 의존하지 않고, 순수 인간 동료 간의 수학적 검증을 거치는 신뢰도 높은 탐구활동 보장.
  - 교육과정 성취기준에 정확히 부합하는 정량·정성적 포트폴리오 산출.

---

### 2. User Experience & Visual Design

#### A. Key User Flows (5대 단계별 워크스페이스)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Math Escape Lab Workspace                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────┬───────────────┼───────────────┬────────────────┐
    ▼               ▼               ▼               ▼                ▼
[1. 개인 제작]   [2. 교차 검증]   [3. 수정 이력]   [4. 모둠 통합]   [5. 체험·보고서]
 - 개념/소재 선택  - 동료 시험풀이  - 피드백 반영    - 6인 단서 결합  - 방탈출 플레이
 - 문제문·정답     - 유일성 체크    - 수정 전/후 대조- 마스터암호 설계 - 평가 루브릭
 - 수학적 원리     - 오류 피드백    - 개선 사유 기록 - 스토리라인 완성 - 보고서 인쇄/PDF
```

1. **[1단계] 개인 개발 연구실 (Authoring Studio)**:
   - 소재 선택: 마방진, 다항식 분해/나머지정리, 아폴로니우스의 원, 집합/명제 논리, 합동식/카이사르/비즈네르 암호 등 기본 프리셋 및 자유 주제.
   - 필수 항목 입력: 참고자료 출처, 제작 의도, 상황 지문(스토리텔링 문구), 수식/도형 설명, 정답값 및 단서 조각 문자, 수학적 상세 풀이, 1·2단계 힌트.
   - 실시간 수식 미리보기 및 렌더링 지원.
2. **[2단계] 동료 검증 시험실 (Peer Testing Chamber)**:
   - 다른 모둠원 1~2명이 문제 작성자의 이름을 가리거나 확인한 상태에서 '시험 풀이' 수행.
   - 검증 체크리스트:
     - [ ] 수학적 오류가 없고 논리적으로 참인가?
     - [ ] 오직 단 하나의 정답만 도출되는가? (정답 유일성)
     - [ ] 방탈출 상황과 지문의 지시사항이 모호하지 않은가?
     - [ ] 체감 난이도 (상 / 중 / 하) 및 힌트 적절성.
   - 구체적인 정량 평어 및 수정 제안 코멘트 입력.
3. **[3단계] 수정 및 개선 기록부 (Revision Ledger)**:
   - 버전 비교 뷰(Diff View): 초안(v1.0) vs 수정본(v2.0) 병렬 비교.
   - 개발 연구의 핵심인 "동료 피드백에 따른 수정 내용 및 수정 이유"를 명문화하여 기록.
4. **[4단계] 모둠 테마 통합실 (Team Mastermind)**:
   - 테마 제목 및 시놉시스(배경 스토리) 설정.
   - 모둠원 6명의 문제 카드 배치 (병렬 6채널 매트릭스).
   - 각 문제의 정답이 결합되어 최종 탈출 암호(Master Key)를 형성하는 규칙 설정 (예: 각 문제 정답의 앞 글자 조합, 자물쇠 다이얼 번호 순서 배열, 수학적 좌표 결합 등).
   - 통합 점검: 정답 중복 여부 및 암호 해독 논리성 자동 검증.
5. **[5단계] 인터랙티브 방탈출 체험 & 탐구보고서 (Play & Rubrics)**:
   - **체험 모드**: 실제 방탈출 느낌의 몰입형 UI (대시보드 형태의 6개 락커/도어 패널, 실시간 타이머, 패스코드 입력기, 오답 경고, 단계별 힌트 열람, 최종 금고 해제 연출).
   - **탐구보고서 모드**: 성취기준 [12수과02-04] 표준 양식에 맞춘 개인별 개발 기록지 + 모둠 종합 설계서 원클릭 인쇄/PDF 다운로드.
   - **교사용 평가 루브릭**: 수학적 타당성, 정답 유일성, 개발 절차 설명력, 모둠 협업 기여도를 4수준(매우 우수/우수/보통/노력요함)으로 채점 가능한 내장 루브릭.

#### B. Visual Identity & Theme

- **Aesthetic Direction**: 학술적이면서도 호기심을 자극하는 '현대적 수학 연구소 & 비밀 서재' 분위기. 과도한 네온이나 사이버펑크 대신, 단정하고 신뢰감 있는 슬레이트 네이비/차콜 배경과 앰버/브론즈 악센트를 적용합니다.
- **Color Palette**:
  - 캔버스/배경: Soft Off-white (`#F8FAFC`) / Dark Slate (`#0F172A`)
  - 카드 표면: Pure White (`#FFFFFF`) / Deep Navy Container (`#1E293B`)
  - 포인트 악센트: Deep Indigo (`#4338CA`) 및 Warm Amber/Gold (`#D97706`) - 탈출 성공 및 열쇠 해금에 활용
  - 상태 신호: 텍스트 레이블 병행 (`● 정상 검증`, `▲ 수정 필요`, `✔ 해제 완료`)
- **Typography**:
  - 국문/영문 제목: `Plus Jakarta Sans`, 가독성 높은 산세리프 Bold
  - 본문: 고성능 시스템 산세리프 (15~16px, line-height 1.6)
  - 수식 및 암호 다이얼: `font-mono tabular-nums` (IBM Plex Mono 스타일)
- **Zero-Pill Restraint**:
  - 단순 태그에 무분별한 캡슐형 뱃지 남발 금지. unboxed 텍스트와 구분자(`·`, `/`) 활용.
  - 상단 탑바는 [브랜드 로고] - [5대 단계 네비게이션] - [데이터 저장/내보내기 단일 액션]의 표준 규칙 엄수.

---

### 3. Key Product Decisions & Trade-Offs

- **결정 1: 완전한 병렬형 구조와 마스터 금고 조합**
  - *선택 방식*: 6개 문제를 플레이어가 원하는 순서대로 자유롭게 선택하여 풀 수 있으며, 6개의 단서가 모두 모였을 때 마스터 금고를 열 수 있는 병렬 구조.
  - *이유*: 특정 문제에서 한 학생이 막히더라도 다른 문제를 풀 수 있어 수업 시간 내 팀원 전체의 참여도가 극대화되며, 모둠원 6명의 기여도가 균등하게 유지됨.
  - *대안 검토*: 직렬형(1번을 풀어야 2번이 열림)은 앞 번호가 너무 어려우면 전체 진행이 정체되는 병목 현상이 발생함.
- **결정 2: 페널티 없는 힌트 시스템과 단계별 풀이 공개**
  - *선택 방식*: 1차 오답 시 개념 힌트, 2차 오답 시 풀이 방향 힌트 제공. 탈출 성공 시 전체 수학적 풀이 전문이 열람되며, 수업 종료 전 포기 시에도 학습 피드백을 위해 전체 풀이 열람 가능.
  - *이유*: 방탈출의 흥미를 유지하면서도 '수학과제 탐구'라는 교과 본연의 학습 목표(수학적 원리 이해)를 잃지 않도록 보장.
- **결정 3: 브라우저 로컬 저장 + JSON 파일 기반 모둠 통합**
  - *선택 방식*: 별도의 서버 DB 가입 없이 로컬 스토리지에 실시간 자동 저장되며, '개인 문제 내보내기 (.json)' 및 '모둠원 데이터 병합' 기능을 제공.
  - *이유*: 학교 현장의 방화벽, 학생 개인정보(이메일 수집 등) 이슈, 와이파이 불안정 환경에서도 100% 안전하고 즉각 동작함.
- **결정 4: 교육과정 성취기준 맞춤형 개발 연구 보고서 템플릿 내장**
  - *선택 방식*: 개인 기록지, 교차 검증표, 수정 전후 비교표, 모둠 테마 설계서를 A4 인쇄 규격의 공식 문서 스타일로 깔끔하게 렌더링.
  - *이유*: 교사가 학생 생활기록부 '과목별 세부능력 및 특기사항(세특)' 작성 시 직접 인용 가능한 객관적 근거 자료로 즉시 활용 가능.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Math Escape Lab Frontend                        │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark — 5 Steps Tab Bar — Export/Import)     │
├──────────────────┬───────────────────┬─────────────────────────────────┤
│ [1. Authoring]   │ [2. Peer Testing] │ [3. Revision Ledger]            │
│  - Problem Draft │  - Blind/Open Test│  - Diff Comparison (v1 vs v2)   │
│  - Math Concept  │  - Checklists     │  - Modification Rationale       │
│  - Hint 1 & 2    │  - Feedback Form  │  - Reflection Notes             │
├──────────────────┴───────────────────┴─────────────────────────────────┤
│ [4. Team Mastermind]                                                   │
│  - 6-Node Parallel Matrix View                                         │
│  - Master Passcode Logic Validator                                     │
│  - Story & Theme Synthesis                                             │
├────────────────────────────────────────────────────────────────────────┤
│ [5. Escape Room Simulator & Evaluation Portfolio]                      │
│  - Interactive Vault & Chamber UI (Timer, Attempt Counter, Lockers)    │
│  - Stepwise Reveal Engine (Hints & Full Math Solution)                 │
│  - Printable Assessment Report & Rubric Matrix                         │
├────────────────────────────────────────────────────────────────────────┤
│ State Management & Persistence (localStorage + JSON Export/Import)     │
└────────────────────────────────────────────────────────────────────────┘
```

#### A. Core Data Schema

```typescript
// 학생 개인 문제 레코드
export interface ProblemRecord {
  id: string;
  authorName: string;
  authorNumber: number; // 모둠 내 1~6번
  topic: string; // 예: 마방진, 아폴로니우스의 원 등
  sourceCitation: string; // 참고자료 출처
  creationReason: string; // 문제 제작 이유
  mathConcept: string; // 수학적 아이디어 및 핵심 원리
  problemStory: string; // 방탈출 상황 지문
  problemFormula?: string; // 수식 또는 세부 조건
  answerValue: string; // 정답값
  keyClue: string; // 다음/최종 단계로 이어지는 단서 조각
  hintLevel1: string; // 1차 힌트 (개념적 단서)
  hintLevel2: string; // 2차 힌트 (접근 공식)
  solutionDetailed: string; // 수학적 풀이 과정 전문
  revisionHistory: RevisionEntry[]; // 수정 이력
  peerReviews: PeerReview[]; // 동료 검증 피드백 목록
  updatedAt: string;
}

// 수정 전후 비교 레코드
export interface RevisionEntry {
  version: number;
  revisedAt: string;
  previousContent: string;
  revisedContent: string;
  revisionReason: string; // 수정 이유
}

// 동료 교차 풀이 검증 피드백
export interface PeerReview {
  reviewerName: string;
  isSolvable: boolean;
  hasSingleAnswer: boolean; // 정답 유일성
  difficulty: 'easy' | 'medium' | 'hard';
  foundErrors: string; // 발견된 수학적 오류
  improvementSuggestion: string; // 개선 제안
  reviewedAt: string;
}

// 모둠 방탈출 테마 종합 레코드
export interface TeamTheme {
  teamName: string;
  storyTitle: string;
  storySynopsis: string;
  structureType: 'parallel'; // 병렬형 고정
  problems: ProblemRecord[]; // 6개 문제
  finalMasterPasscode: string; // 최종 탈출 암호
  masterPasscodeRule: string; // 정답 결합 규칙 설명
  integrationCheck: {
    noDuplicateAnswers: boolean;
    logicalDerivationVerified: boolean;
    notes: string;
  };
}
```

---

### 5. Plan Execution Sequence

1. **상태 관리 및 더미 데이터(실제 고교 수학 예시 6종) 구축**:
   - 마방진 합 암호, 다항식 나머지정리 자물쇠, 아폴로니우스의 원 궤적 좌표, 명제 대우 논리 퍼즐, 카이사르 치환 암호, 합동식 주기성 등을 기본 샘플로 탑재하여 즉시 시연 가능하도록 준비.
2. **개인 제작 & 동료 피드백 & 수정 이력 컴포넌트 구현**:
   - LaTeX 렌더링 또는 깔끔한 수식 포맷터 지원.
   - 직관적인 초안-수정본 비교 뷰(Side-by-side) 및 유일성 체크리스트 구축.
3. **모둠 테마 종합 캔버스 구현**:
   - 6개 슬롯 카드 매트릭스, 마스터 암호 생성기 및 정답 결합 시각화.
4. **인터랙티브 방탈출 플레이어 & 단계별 힌트 공개 엔진**:
   - 6개 잠금장치 선택 화면, 정답 검증 로직, 1/2차 힌트 모달, 최종 탈출 성공 축하 화면 및 풀이 해설집.
5. **성취기준 [12수과02-04] 탐구보고서 및 평가 루브릭 뷰**:
   - 브라우저 인쇄 친화적(A4 출력용 CSS) 보고서 레이아웃과 교사용 루브릭 채점표 제공.
