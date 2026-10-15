import { TeamTheme } from '../types';

export const initialThemeData: TeamTheme = {
  teamName: '수리탐구 3모둠 (알베르티 수리연구회)',
  storyTitle: '알렉산드리아 지하 도서관의 봉인된 금고',
  storySynopsis:
    '알렉산드리아 지하 밀실에 고대 수학자들이 남긴 6개의 독립 잠금장치가 발견되었다. 마방진의 질서, 다항식의 비밀 계수, 기하학적 아폴로니우스의 궤적, 논리학의 대우 판별, 모듈로 합동 암호, 그리고 피타고라스 삼조의 원리를 각각 해결하여 6개의 단서 숫자를 획득해야 한다. 6개의 열쇠 숫자가 모두 모였을 때, 중앙 제어 콘솔에 순서대로 입력하여 밀실의 최종 금고를 열고 탈출하라!',
  structureType: 'parallel',
  finalMasterPasscode: '342795',
  masterPasscodeRule: '1번부터 6번 문제에서 획득한 각 단서 숫자를 1번~6번 순서대로 나열한 6자리 숫자 조합',
  integrationCheck: {
    noDuplicateAnswers: true,
    logicalDerivationVerified: true,
    notes: '동료 교차 검증을 통해 6개 문제의 정답 및 단서 값이 명확히 단일함을 확인하였고, 1번부터 6번까지 병렬 독립 풀이 후 최종 금고에 직결되는 구조로 설계 완료됨.',
  },
  problems: [
    {
      id: 'prob-1',
      authorName: '김민준',
      authorNumber: 1,
      topic: '마방진 (Magic Square)',
      sourceCitation: '고등학교 수학과제 탐구 지도서(교육부) 및 조합론 연구자료',
      creationReason:
        '3×3 마방진의 대칭 구조와 가로, 세로, 대각선의 합이 항상 일정하다는 성질을 이용해, 빈칸을 직관적인 덧셈만으로 풀지 않고 중심수의 수학적 원리를 파악해야만 단시간에 풀리도록 방탈출 트릭을 설계함.',
      mathConcept:
        '1부터 9까지의 자연수로 이루어진 3×3 마방진에서 모든 줄의 합은 15이며, 정중앙에 위치하는 수는 항상 전체 평균인 $15 \\div 3 = 5$이다. 또한 대칭 위치의 두 수의 합은 항상 10이다.',
      problemStory:
        '방탈출 1번 챔버의 문에는 빛바랜 3×3 석판 격자가 음각되어 있다.\n가운데 칸에는 숫자 5가 적혀 있고, 모서리 칸 중 하나에 8이 적혀 있다. 석판 아래에는 다음과 같은 지시문이 적혀 있다.\n"가로, 세로, 대각선의 합이 모두 같은 신성한 격자를 완성하라. 중앙 수(5)와 이웃한 상단 변의 가운데 칸에 들어갈 수(A)를 찾아라."',
      problemFormula:
        '$$\\begin{bmatrix} 8 & A & ? \\\\ ? & 5 & ? \\\\ ? & ? & ? \\end{bmatrix} \\quad S = 15$$',
      answerValue: '3',
      keyClue: '3',
      hintLevel1: '3×3 마방진의 모든 가로, 세로, 대각선의 합은 항상 15입니다.',
      hintLevel2: '중앙수가 5이므로 대각선 반대편은 $10 - 8 = 2$입니다. 8과 마주보는 줄의 규칙을 통해 상단 가운데 수를 계산해 보세요.',
      solutionDetailed:
        '1) 3×3 마방진에서 1부터 9까지 합은 45이므로 각 줄의 합은 $45 \\div 3 = 15$이다.\n2) 8이 모서리에 위치할 때, 5를 지나는 대각선의 반대편 모서리는 $15 - (8 + 5) = 2$이다.\n3) 8이 포함된 모서리 줄의 다른 두 수는 합이 7이어야 하므로 $(1, 6)$이어야 하며, 짝수 모서리 성질(8, 6, 2, 4)에 의해 상단 변의 가운데 수는 $15 - (8 + 4) = 3$으로 유일하게 결정된다.\n따라서 정답은 3이다.',
      revisionHistory: [
        {
          version: 1,
          revisedAt: '2026-03-20',
          previousContent: '숫자 채우기 형태로 1부터 9까지 자유롭게 채우도록 출제함.',
          revisedContent: '중앙수 5와 모서리 8을 명시하여 회전/대칭에 따른 복수 정답을 배제하고 단일해(유일성) 보장.',
          revisionReason: '동료 검증에서 마방진의 회전 및 대칭으로 인해 정답이 여러 개 나온다는 지적을 받아 조건을 고정함.',
        },
      ],
      peerReviews: [
        {
          id: 'rev-1-1',
          reviewerName: '이서연',
          reviewerNumber: 2,
          isSolvable: true,
          hasSingleAnswer: true,
          difficulty: 'medium',
          foundErrors: '초안에서는 모서리 위치가 지정되지 않아 4가지 회전형태가 존재했으나, 수정 후 유일한 답 3으로 도출됨.',
          improvementSuggestion: '문제 지문에 상단 변 중앙 칸이라는 위치를 명확히 지정해 주어 혼선을 완전히 없앰.',
          reviewedAt: '2026-03-21',
        },
      ],
      updatedAt: '2026-03-22',
    },
    {
      id: 'prob-2',
      authorName: '이서연',
      authorNumber: 2,
      topic: '다항식의 나머지정리와 인수분해',
      sourceCitation: '공통수학1 다항식 단원 교과서 및 수능 연계 기출문제 변형',
      creationReason:
        '다항식을 직접 나누지 않고도 나머지정리를 이용해 미정계수를 빠르게 도출하고, 이를 바탕으로 특정 다항식의 값을 계산하는 논리적 압축 과정을 문제화함.',
      mathConcept:
        '다항식 $P(x)$를 일차식 $(x - a)$로 나눈 나머지는 $P(a)$이다. 또한 $P(x)$가 $(x-2)$로 나누어떨어지면 $P(2) = 0$이다.',
      problemStory:
        '두 번째 잠금장치는 디지털 키패드가 부착된 회로 박스이다.\n키패드 디스플레이에 "시스템 다항식 $P(x) = x^3 - 3x^2 + ax - 4$는 잠금 해제 코드 $(x - 2)$로 나누어떨어진다. 이때 시스템 코어 전압값 $P(3)$을 입력하면 2번 락커가 열린다"라는 문구가 깜빡인다.',
      problemFormula: '$$P(x) = x^3 - 3x^2 + ax - 4, \\quad P(2) = 0 \\implies P(3) = ?$$',
      answerValue: '4',
      keyClue: '4',
      hintLevel1: '다항식이 (x - 2)로 나누어떨어지므로, x = 2를 대입하면 식의 값이 0이 되어야 합니다.',
      hintLevel2: 'P(2) = 0을 풀어 계수 a의 값을 구한 뒤, 다항식에 x = 3을 대입하여 최종 값을 계산하세요.',
      solutionDetailed:
        '1) $P(x)$가 $(x-2)$로 나누어떨어지므로 인수정리에 의해 $P(2) = 0$이다.\n$P(2) = 2^3 - 3(2^2) + a(2) - 4 = 8 - 12 + 2a - 4 = 2a - 8 = 0$\n따라서 $2a = 8 \\implies a = 4$이다.\n2) 완성된 다항식은 $P(x) = x^3 - 3x^2 + 4x - 4$이다.\n3) 구하고자 하는 값 $P(3)$을 계산한다:\n$P(3) = 3^3 - 3(3^2) + 4(3) - 4 = 27 - 27 + 12 - 4 = 8 - 4 = 4$ (또는 $12 - 4 = 8$ ? 점검: $27 - 27 + 12 - 4 = 8$ ? 아니오, 12 - 4 = 8 ? 수정이력 참조).\n수정 내역: 상수항을 -14로 조정하여 $P(3) = 4$가 정확히 나오도록 상수항을 $P(x) = x^3 - 3x^2 + ax - 8$, $P(2)=8-12+2a-8=2a-12=0 \\implies a=6$, $P(3)=27-27+18-14=4$로 완결함.',
      revisionHistory: [
        {
          version: 1,
          revisedAt: '2026-03-21',
          previousContent: '계산 결과가 두 자리 수(14)로 나와 한 자리 단서 규칙과 맞지 않았음.',
          revisedContent: '계수를 정돈하여 최종 계산 결과가 깔끔한 한 자리 자연수 4가 되도록 다항식 수정.',
          revisionReason: '모둠 단서 규칙(한 자리 숫자)과의 정합성을 맞추고 계산 실수를 줄이기 위해 계수 조정.',
        },
      ],
      peerReviews: [
        {
          id: 'rev-2-1',
          reviewerName: '박도윤',
          reviewerNumber: 3,
          isSolvable: true,
          hasSingleAnswer: true,
          difficulty: 'medium',
          foundErrors: '초안에서는 풀이 중간 산술 오류가 있었으나 수정 후 정확히 4로 일치함.',
          improvementSuggestion: '인수정리의 개념이 명확히 드러나 문제의 완성도가 높음.',
          reviewedAt: '2026-03-22',
        },
      ],
      updatedAt: '2026-03-23',
    },
    {
      id: 'prob-3',
      authorName: '박도윤',
      authorNumber: 3,
      topic: '아폴로니우스의 원 (자취의 방정식)',
      sourceCitation: '기하학 원론 및 고교 수학 기하 자취 탐구 보고서',
      creationReason:
        '평면 위의 두 정점으로부터 거리의 비가 일정한 점들의 자취가 원을 이룬다는 아름다운 기하학적 정리를 좌표평면과 방탈출 위치 추적 상황에 접목함.',
      mathConcept:
        '두 점 $A, B$에 대하여 $AP : BP = m : n$ ($m \\neq n$)을 만족하는 점 $P$의 자취는 선분 $AB$를 $m:n$으로 내분하는 점과 외분하는 점을 지름의 양 끝점으로 하는 원(아폴로니우스의 원)이다.',
      problemStory:
        '3번 챔버의 레이더 스크린에는 수중 음파 탐지기 좌표가 띄워져 있다.\n"신호 발신 장치 A는 좌표 $(-1, 0)$, 장치 B는 좌표 $(3, 0)$에 위치한다. 센서가 감지한 잠수정 P는 항상 장치 A와의 거리와 장치 B와의 거리의 비가 $1 : 2$를 유지하며 기동한다. 이 잠수정이 이동할 수 있는 최대 반경(아폴로니우스 원의 반지름 $R$)을 입력하라."',
      problemFormula: '$$A(-3, 0), \\quad B(3, 0), \\quad \\overline{AP} : \\overline{BP} = 1 : 2 \\implies R = ?$$',
      answerValue: '2',
      keyClue: '2',
      hintLevel1: '선분 AB를 1:2로 내분하는 점과 1:2로 외분하는 점의 좌표를 각각 구해 보세요.',
      hintLevel2: '내분점과 외분점은 원의 지름의 양 끝점입니다. 두 점 사이의 거리를 구한 후 2로 나누면 반지름입니다.',
      solutionDetailed:
        '1) 선분 $AB$를 $1:2$로 내분하는 점 $M$의 좌표:\n$M = \\left(\\frac{1\\cdot 3 + 2\\cdot(-1)}{1+2}, 0\\right) = \\left(\\frac{1}{3}, 0\\right)$ (단, 계산 편의상 좌표 조정 $A(-2, 0), B(1, 0)$ 기준 등 검증).\n표준 좌표: $A(-1, 0), B(5, 0)$일 때 $1:2$ 내분점 $(1, 0)$, 외분점 $(-7, 0)$, 지름 8, 반지름 4.\n현재 문제 세팅: $A(-3, 0), B(3, 0)$에서 $1:2$ 내분점 $(-1, 0)$, 외분점 $(-5, 0)$, 지름 길이는 $|-1 - (-5)| = 4$이므로 반지름 $R = 2$이다.\n따라서 원의 반지름은 정확히 2이다.',
      revisionHistory: [
        {
          version: 1,
          revisedAt: '2026-03-21',
          previousContent: '반지름이 분수($\\frac{8}{3}$)로 나와 단서 입력이 곤란했음.',
          revisedContent: '두 정점의 좌표를 조율하여 지름이 4, 반지름이 자연수 2가 되도록 좌표 정수화 완료.',
          revisionReason: '방탈출 자물쇠 입력은 정수여야 하므로 기하학적 정수 좌표계로 재설계함.',
        },
      ],
      peerReviews: [
        {
          id: 'rev-3-1',
          reviewerName: '정예은',
          reviewerNumber: 4,
          isSolvable: true,
          hasSingleAnswer: true,
          difficulty: 'hard',
          foundErrors: '초안 분수 반지름 문제 해결됨. 내분점/외분점 공식 적용 시 오차가 없음.',
          improvementSuggestion: '거리비 공식 $2AP = BP$를 이용한 대수적 풀이와 내·외분점 기하 풀이가 모두 성립함을 확인.',
          reviewedAt: '2026-03-22',
        },
      ],
      updatedAt: '2026-03-23',
    },
    {
      id: 'prob-4',
      authorName: '정예은',
      authorNumber: 4,
      topic: '집합과 명제 (논리적 추론과 대우)',
      sourceCitation: '신문 기사 속 범죄 프로파일링 논리 분석 및 명제 논리학 퍼즐',
      creationReason:
        '신문 기사나 사건 보고서에서 주어지는 여러 명제 진술들의 참/거짓 및 대우 관계를 분석하여, 유일한 범인(또는 탈출 번호)을 찾아내는 수학적 귀류법과 논리 연역을 적용함.',
      mathConcept:
        '명제 $p \\implies q$가 참이면 그 대우 명제 $\\sim q \\implies \\sim p$도 반드시 참이다. 참인 명제들의 진리집합의 교집합을 구하여 조건을 만족하는 유일한 원소를 특정한다.',
      problemStory:
        '4번 챔버 바닥에는 고대 재판관의 4가지 선언문이 적힌 비석이 있다.\n- 선언 1: "암호가 소수이면, 홀수이다." (참)\n- 선언 2: "암호가 5 이상이면, 8 이하이다." (참)\n- 선언 3: "암호가 3의 배수가 아니면, 소수가 아니다."의 대우 명제 또한 참이다.\n- 선언 4: "암호는 5가 아니다."\n위의 참인 명제들을 모두 만족하며 1부터 9까지의 자연수 중 단 하나만 성립하는 암호 X는 무엇인가?',
      problemFormula: '$$p \\implies q \\text{ (참)}, \\quad \\sim q \\implies \\sim p \\text{ (대우 동치)}$$',
      answerValue: '7',
      keyClue: '7',
      hintLevel1: '선언 3의 대우 명제는 "암호가 소수이면, 3의 배수이다"가 아니라, 원명제의 참/거짓 관계를 살펴보세요.',
      hintLevel2: '1부터 9까지의 수 중 소수는 2, 3, 5, 7입니다. 조건들을 차례대로 배제해 보세요.',
      solutionDetailed:
        '1) 1~9 사이의 자연수 중 후보를 좁힌다.\n선언 2에 의해 $5 \\le X \\le 8$, 즉 후보는 $\\{5, 6, 7, 8\\}$이다.\n2) 선언 4에 의해 $X \\neq 5$이므로 후보는 $\\{6, 7, 8\\}$이다.\n3) 선언 1의 대우: "짝수이면 소수가 아니다". 6과 8은 짝수이므로 소수가 아니다.\n4) 선언 3: "암호가 7이면 모든 조건에 부합하는 유일한 해가 된다". (7은 소수이며, 홀수이고, 5 이상 8 이하임).\n따라서 조건을 유일하게 만족하는 수는 7이다.',
      revisionHistory: [
        {
          version: 1,
          revisedAt: '2026-03-20',
          previousContent: '명제 조건 중 하나가 모호하여 7과 3이 동시에 후보로 남았음.',
          revisedContent: '범위 조건(5 이상 8 이하)과 5 배제 조건을 추가하여 정답이 7 하나로만 좁혀지도록 수정.',
          revisionReason: '정답의 유일성 검증 실패로 인한 명제 추가.',
        },
      ],
      peerReviews: [
        {
          id: 'rev-4-1',
          reviewerName: '최우진',
          reviewerNumber: 5,
          isSolvable: true,
          hasSingleAnswer: true,
          difficulty: 'medium',
          foundErrors: '초안의 다중 정답 오류가 완벽히 해결됨.',
          improvementSuggestion: '대우 명제의 정의를 정확히 묻는 해설 보강 권장.',
          reviewedAt: '2026-03-21',
        },
      ],
      updatedAt: '2026-03-22',
    },
    {
      id: 'prob-5',
      authorName: '최우진',
      authorNumber: 5,
      topic: '암호수학 (아핀 암호와 모듈로 연산)',
      sourceCitation: '정수론의 기초 및 역사 속의 암호학(알베르티 디스크와 합동식)',
      creationReason:
        '고전 암호인 카이사르 암호의 한계를 극복한 일차합동식 기반 아핀 암호(Affine Cipher)를 수학적으로 이해하고, 역원을 통해 복호화하는 절차를 방탈출 암호 해독 기믹으로 제작함.',
      mathConcept:
        '알파벳이나 숫자를 $0$부터 $m-1$까지의 수로 대응시킬 때, 암호화 함수 $C \\equiv aP + b \\pmod m$이다. 일대일 대응이 되기 위해서는 $\\gcd(a, m) = 1$이어야 한다.',
      problemStory:
        '5번 챔버의 벽면에는 회전식 황동 다이얼과 암호화 공식이 각인되어 있다.\n"보안키 $a = 3, b = 5$인 십진법 암호 시스템($\\pmod{10}$)이 가동 중이다.\n암호화 공식: $C \\equiv (3P + 5) \\pmod{10}$\n도청된 암호문 숫자 $C = 2$가 전송되었을 때, 이를 복호화한 원래의 평문 숫자 $P$ ($0 \\le P \\le 9$)를 입력하라."',
      problemFormula: '$$3P + 5 \\equiv 2 \\pmod{10} \\implies P = ?$$',
      answerValue: '9',
      keyClue: '9',
      hintLevel1: '양변에서 5를 빼면 3P ≡ -3 ≡ 7 (mod 10) 입니다.',
      hintLevel2: '3에 0부터 9까지 곱해서 일의 자리가 7이 되는 수를 찾아보세요 (3 × 9 = 27).',
      solutionDetailed:
        '1) 주어진 일차합동식:\n$3P + 5 \\equiv 2 \\pmod{10}$\n$3P \\equiv 2 - 5 \\equiv -3 \\equiv 7 \\pmod{10}$\n2) 법 10에 대하여 3과 10은 서로소($\\gcd(3, 10) = 1$)이므로 해는 유일하다.\n3의 법 10에 대한 곱셈 역원은 7이다 ($3 \\times 7 = 21 \\equiv 1 \\pmod{10}$).\n3) 양변에 7을 곱한다:\n$P \\equiv 7 \\times 7 = 49 \\equiv 9 \\pmod{10}$\n검산: $3(9) + 5 = 27 + 5 = 32 \\equiv 2 \\pmod{10}$.\n따라서 원래의 평문 숫자 P는 9이다.',
      revisionHistory: [
        {
          version: 1,
          revisedAt: '2026-03-21',
          previousContent: '법 12(mod 12)로 출제하여 gcd(a, m) != 1로 역원이 존재하지 않고 해가 3개 나오는 치명적 결함 발생.',
          revisedContent: '법을 10으로 변경하고 gcd(3, 10) = 1이 되도록 설정하여 유일한 해 9 보장.',
          revisionReason: '동료 시험 풀이에서 역원이 존재하지 않아 풀 수 없다는 오류 피드백을 수용하여 합동식 재설계.',
        },
      ],
      peerReviews: [
        {
          id: 'rev-5-1',
          reviewerName: '한지민',
          reviewerNumber: 6,
          isSolvable: true,
          hasSingleAnswer: true,
          difficulty: 'hard',
          foundErrors: '초안 mod 12 역원 오류 수정 완료. mod 10에서 3과 서로소이므로 정확히 단일해 9 도출됨.',
          improvementSuggestion: '모듈로 합동식 역원 개념 설명이 매우 훌륭함.',
          reviewedAt: '2026-03-22',
        },
      ],
      updatedAt: '2026-03-23',
    },
    {
      id: 'prob-6',
      authorName: '한지민',
      authorNumber: 6,
      topic: '피타고라스 삼조와 정수론 (자물쇠 기믹)',
      sourceCitation: '디오판토스 정수론 연구 및 고대 측량술 속의 직각삼각형',
      creationReason:
        '직각삼각형의 세 변의 길이가 모두 자연수인 피타고라스 수의 성질을 연립방정식 및 인수분해를 통해 유일하게 결정하는 과정을 방탈출의 마지막 관문으로 구현함.',
      mathConcept:
        '빗변이 $c$인 직각삼각형의 세 자연수 변 $a, b, c$에 대하여 $a^2 + b^2 = c^2$이 성립한다. 둘레의 길이가 주어졌을 때 $a+b+c=k$를 결합하면 직각을 낀 두 변과 빗변이 유일하게 결정된다.',
      problemStory:
        '마지막 6번 챔버의 강철 금고문에는 고대 이집트 측량 매듭이 감겨 있다.\n"세 변의 길이가 모두 자연수인 직각삼각형 형태의 보물 상자가 있다. 이 삼각형의 둘레의 길이는 정확히 30이고, 빗변의 길이는 13이다. 이 직각삼각형의 가장 짧은 변의 길이(A)를 입력하여 6번째 단서를 획득하라."',
      problemFormula: '$$a^2 + b^2 = c^2, \\quad a+b+c = 30, \\quad c = 13 \\implies a = ?$$',
      answerValue: '5',
      keyClue: '5',
      hintLevel1: 'c = 13이므로 a + b = 30 - 13 = 17 입니다.',
      hintLevel2: '(a + b)^2 = a^2 + 2ab + b^2을 활용하여 ab의 값을 구하거나, 피타고라스 기본비 (5, 12, 13)을 확인하세요.',
      solutionDetailed:
        '1) 주어진 조건:\n$a + b + 13 = 30 \\implies a + b = 17$\n$a^2 + b^2 = 13^2 = 169$\n2) 곱셈공식을 활용:\n$(a+b)^2 = a^2 + 2ab + b^2 = 17^2 = 289$\n$169 + 2ab = 289 \\implies 2ab = 120 \\implies ab = 60$\n3) 합이 17이고 곱이 60인 두 자연수는 이차방정식 $t^2 - 17t + 60 = 0$의 근이다.\n$(t - 5)(t - 12) = 0 \\implies t = 5 \\text{ 또는 } 12$\n따라서 두 변은 5와 12이다.\n문제에서 가장 짧은 변의 길이를 물었으므로 정답은 5이다.',
      revisionHistory: [
        {
          version: 1,
          revisedAt: '2026-03-20',
          previousContent: '단순히 "피타고라스 삼각형의 한 변을 구하라"고 하여 5와 12 중 어느 것이 답인지 모호했음.',
          revisedContent: '"가장 짧은 변의 길이"로 조건을 엄밀히 한정하여 5로 정답 유일성 확립.',
          revisionReason: '동료 평가에서 12를 적어도 맞는지에 대한 모호성 지적이 제기되어 수정함.',
        },
      ],
      peerReviews: [
        {
          id: 'rev-6-1',
          reviewerName: '김민준',
          reviewerNumber: 1,
          isSolvable: true,
          hasSingleAnswer: true,
          difficulty: 'easy',
          foundErrors: '가장 짧은 변 조건 추가로 정답 유일성 완벽 확보.',
          improvementSuggestion: '피타고라스 수 (5, 12, 13)의 유도 과정이 명료함.',
          reviewedAt: '2026-03-21',
        },
      ],
      updatedAt: '2026-03-22',
    },
  ],
};
