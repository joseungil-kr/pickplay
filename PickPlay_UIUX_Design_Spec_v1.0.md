# PickPlay UI/UX Design Specification v1.0

- 문서명: PickPlay UI/UX Design Specification v1.0
- 목적: PLAY 게임 영역과 게임 로비의 최종 디자인 기준 정의
- 적용 대상: G01 룰렛, G02 랜덤뽑기, G03 종이뽑기 및 이후 신규 게임
- 작성 기준일: 2026-09-28
- 기술 기준: Astro + TypeScript + Vanilla TS 우선, Cloudflare Pages/Workers, CSS/Canvas/SVG 중심
- 핵심 방향: **Casino의 몰입감 + Arcade의 재미 + Game Show의 밝은 긴장감**
- 중요 원칙: **온라인 카지노의 도박성·압박감·오인성 패턴은 배제하고, 게임 탐색성과 몰입 구조만 차용한다.**

---

# 1. 문서의 목적

이 문서는 PickPlay의 UI/UX를 “기능형 프로토타입”에서 “실제 공개 서비스 수준의 게임 플랫폼”으로 전환하기 위한 기준 문서다.

현재까지 G01 룰렛, G02 랜덤뽑기, G03 종이뽑기의 핵심 기능과 공통 추첨 상태 구조가 구현되었다.

공통 상태 구조의 핵심은 다음과 같다.

```text
participants
remaining
history
currentWinner
```

각 게임은 `selectionState`를 통해 참가자 추가·삭제, 추첨 결과 기록, 제외, 마지막 참가자 자동 확정, 다시 하기 등의 상태 전이를 공유한다.

이 문서 이후부터 디자인은 개별 게임마다 임의로 판단하지 않는다.

모든 신규 게임은 본 문서의 디자인 토큰, Game Stage, Primary Action, 결과 표현, 반응형, 접근성, 성능 규칙을 우선 적용한다.

---

# 2. 제품 디자인의 한 문장 정의

> 게임은 카지노만큼 눈에 띄게, 사용법은 장난감만큼 쉽게, 분위기는 아케이드처럼 즐겁게.

PickPlay은 카지노 사이트처럼 보여서는 안 된다.

대신 카지노 서비스가 잘하는 다음 요소를 차용한다.

- 게임을 화면의 주인공으로 만드는 정보 위계
- 게임 탐색을 빠르게 만드는 로비 구조
- 한 게임당 하나의 명확한 Primary Action
- 플레이 결과가 즉시 이해되는 Result Reveal
- 색상, 모션, 사운드를 통한 짧은 피드백
- 최근 사용, 즐겨찾기, 추천 등 재방문 UX
- 모바일에서도 바로 플레이 가능한 밀도
- 보조 설명을 게임 주변부로 치우는 구조

반대로 다음은 차용하지 않는다.

- 베팅 금액 강조
- 칩, 현금, 달러, 잭팟 그래픽 남발
- “거의 당첨” 같은 오인성 표현
- 가짜 near-miss
- 자동 연속 플레이
- 불필요한 FOMO
- 과도한 카운트다운
- 결과를 왜곡하는 축하 연출
- 반복 클릭을 유도하는 점멸
- 화면 전체를 덮는 보너스 팝업
- 초고속 반복 플레이를 부추기는 Turbo 구조

---

# 3. 해외 UI/UX 조사에서 차용할 핵심

## 3.1 Stake에서 차용할 것

2026년 Stake 카지노 UI 업데이트에서 다음 패턴이 확인된다.

- Games For You
- Saved Games
- Following
- Continue Playing
- Desktop side panel
- Mobile `For You` slide-up
- 게임 타일 hover preview

PickPlay 적용안:

```text
Games For You      -> 추천 게임
Saved Games        -> 즐겨찾기
Continue Playing   -> 최근 사용
Following          -> 자주 쓰는 게임
```

단, hover 영상 미리보기는 성능상 사용하지 않는다.

대신 다음 정도만 허용한다.

```text
hover
- border 밝아짐
- thumbnail 1.02 scale
- 매우 짧은 CSS transition
```

---

## 3.2 BetMGM에서 차용할 것

BetMGM은 게임 검색과 카테고리 탐색이 명확하다.

PickPlay의 권장 1차 카테고리:

```text
전체
뽑기
파티
교실
2인용
미니게임
```

게임 수가 충분히 늘어난 이후 다음을 추가한다.

```text
최근 사용
즐겨찾기
인기
새 게임
```

초기부터 세부 카테고리를 과도하게 늘리지 않는다.

---

## 3.3 DraftKings에서 차용할 것

DraftKings Casino는 단순 전체 게임 목록보다 다음과 같은 “수평 콘텐츠 묶음”을 반복한다.

- New Games
- Recently Played
- Suggested for You
- Hottest Games
- Top Slots
- Weekly Picks
- Arcade
- Top Roulette Games

PickPlay 홈도 같은 원리로 “게임 로비” 방식으로 만든다.

예:

```text
최근 사용
[룰렛] [종이뽑기] [랜덤뽑기] →

바로 뽑기
[룰렛] [랜덤] [종이] [사다리] →

모임에서
[폭탄] [밸런스] [5초 게임] →

교실에서
[랜덤 발표] [팀 나누기] [퀴즈] →

둘이서
[반응 대결] [가위바위보] →

새 게임
[신규 게임들...]
```

---

## 3.4 FanDuel에서 차용할 것

FanDuel 게임 UI 설명에서 공통적으로 확인할 수 있는 패턴:

- Spin 버튼이 매우 강한 Primary Action
- 메뉴, 설정, 사운드 등은 게임 주변부에 배치
- 게임 화면이 가장 높은 시각적 비중을 가짐
- 사운드는 테마를 돕지만 UI보다 앞서지 않음
- 결과 피드백은 짧고 즉각적

PickPlay 적용 원칙:

```text
룰렛       -> 룰렛 돌리기
랜덤뽑기   -> 뽑기
종이뽑기   -> 종이 직접 선택
반응속도   -> 시작
폭탄게임   -> 넘기기
```

**한 게임에서 강한 Primary Action은 하나만 둔다.**

---

# 4. 디자인 컨셉

내부 디자인 컨셉명:

## PLAY NIGHT

의미:

- 어두운 Game Stage
- 밝고 명확한 게임 오브젝트
- 게임별 Accent Color
- 페이지 전체는 과도하게 어둡게 만들지 않음
- PLAY는 놀이터
- BUSINESS는 작업실

즉 전체 사이트를 카지노처럼 검게 만들지 않는다.

권장 구조는:

```text
Light Utility Area
+
Dark Game Stage
```

이다.

---

# 5. 전체 테마 전략

## 5.1 Hybrid Dark Stage

PickPlay 전체 사이트를 완전한 Dark Theme로 만들지 않는다.

권장:

```text
페이지 배경      Light
입력/설정        Light
Game Stage       Dark
결과             Light 또는 Stage 하단
BUSINESS CTA     Light / Emerald Accent
```

장점:

- 교실, MT, 친구 모임에서 부담이 적음
- 실제 도박 사이트처럼 보이지 않음
- 게임 영역만 몰입감을 높일 수 있음
- BUSINESS와 PLAY를 시각적으로 구분하기 좋음

---

# 6. Design Tokens

## 6.1 기본 색상

```css
:root {
  --pp-page: #f8fafc;
  --pp-page-strong: #ffffff;

  --pp-stage: #07111f;
  --pp-stage-soft: #0b1628;
  --pp-stage-raised: #101d31;
  --pp-stage-hover: #16253d;

  --pp-border-light: #dbe3ec;
  --pp-border-dark: rgba(255,255,255,.11);
  --pp-border-dark-strong: rgba(255,255,255,.20);

  --pp-text: #0f2742;
  --pp-text-soft: #40556d;
  --pp-text-muted: #738397;

  --pp-stage-text: #f8fafc;
  --pp-stage-text-soft: #a6b4c8;
  --pp-stage-text-muted: #718198;

  --pp-primary: #2563eb;
  --pp-primary-hover: #3974f5;
  --pp-primary-active: #1e54c7;

  --pp-win: #ffc857;
  --pp-success: #16a085;
  --pp-orange: #f97316;
  --pp-danger: #ef476f;

  --pp-business: #0b806f;
  --pp-focus: #38bdf8;
}
```

---

## 6.2 게임별 Accent

```text
G01 룰렛       Blue
G02 랜덤뽑기   Violet
G03 종이뽑기   Teal
사다리         Orange
반응속도       Lime
폭탄게임       Red
밸런스게임     Pink
퀴즈           Cyan
```

Accent는 Primary Action, 미세 glow, 상태 강조 정도에 사용한다.

게임별로 전체 페이지 색을 바꾸지 않는다.

---

# 7. 룰렛 팔레트

권장 기본 팔레트:

```ts
const wheelPalette = [
  '#2F6BFF',
  '#F97316',
  '#0F9F89',
  '#8B5CF6',
  '#E94D77',
  '#F5B942',
  '#28B8E8',
  '#74B816'
];
```

규칙:

- 인접한 조각은 가능한 한 다른 색상 계열을 사용한다.
- 8명 이상이면 팔레트를 반복할 수 있다.
- 반복 시 같은 색이 붙지 않도록 순서를 재배열한다.
- 결과 결정 로직과 색상은 분리한다.
- 특정 색상이 당첨 확률을 암시하면 안 된다.

---

# 8. Typography

웹폰트를 사용하지 않는 기존 원칙을 유지한다.

권장:

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Noto Sans KR",
  sans-serif;
```

실제 사용자 시스템에 설치된 폰트를 사용하며 외부 폰트 요청을 만들지 않는다.

권장 크기:

```text
Page title desktop      36~40px
Page title mobile       30~34px

Game title desktop      28~34px
Game title mobile       26~30px

Section title           18~20px
Body                    15~16px
Secondary               13~14px
Chip                     14px
Primary button           16~17px / 700
Winner                   26~36px
```

---

# 9. Spacing System

기준 단위:

```text
4
8
12
16
20
24
32
40
48
64
```

권장:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 32px;
--space-8: 40px;
--space-9: 48px;
```

금지:

- 의미 없이 60~100px의 큰 공백을 반복하지 않는다.
- Desktop이라고 게임과 설정 사이를 과도하게 벌리지 않는다.
- Mobile에서 상단 설명 때문에 게임이 첫 화면 아래로 밀려나지 않게 한다.

---

# 10. Radius / Border / Shadow

## Radius

```text
Input       10px
Button      10px
Chip        9px
Game Stage  14~16px
Game Card   10~12px
Modal       14~16px
```

과도한 pill shape는 기본적으로 사용하지 않는다.

## Border

Light:

```css
1px solid #dbe3ec
```

Dark:

```css
1px solid rgba(255,255,255,.11)
```

## Shadow

기본 원칙:

- Shadow는 거의 사용하지 않는다.
- Game Stage에서 필요한 경우 매우 약하게.
- 카드마다 그림자 사용 금지.

예:

```css
box-shadow: 0 12px 30px rgba(0,0,0,.16);
```

정도만 제한적으로 사용.

---

# 11. Production GameShell

현재 `GameShell variant="production"` 구조를 기준으로 한다.

Production 화면에서 다음 개발용 라벨을 노출하지 않는다.

```text
준비
게임 설정
시작
게임
완료 후
결과
```

DOM section이 필요하다면 유지 가능하지만 사용자 화면에는 자연스러운 콘텐츠 구조로 표현한다.

---

# 12. 게임 페이지 기본 구조

권장:

```text
PLAY · 무료 게임

행운의 룰렛

이름을 넣고 룰렛을 돌려 한 명을 뽑아보세요.

2명 이상 · 약 1분 · [게임 방법]

참가자
[이름 입력                    ][추가]

[민지 ×] [준호 ×] [서연 ×]

☑ 뽑힌 사람은 다음 뽑기에서 제외

┌────────────────────────────┐
│          GAME STAGE        │
│                            │
│            ▼               │
│          룰렛              │
│                            │
│      [룰렛 돌리기]         │
│                            │
└────────────────────────────┘

민지 님이 뽑혔어요!

준호, 서연 님이 남았어요.
추첨 순서: 민지 → 준호

[다시 하기] [공유]

──────────────────────────────

이 룰렛으로 매장 이벤트 만들기 →

관련 게임
```

---

# 13. Game Stage

Game Stage는 PLAY 디자인의 핵심 컴포넌트다.

## Desktop

```text
max-width: 720px
padding: 24~32px
border-radius: 16px
```

## Mobile

```text
width: 100%
padding: 14~16px
border-radius: 14px
```

권장 CSS:

```css
.game-stage {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 50% 8%,
      rgba(47, 107, 255, .15),
      transparent 45%
    ),
    #0b1628;

  border: 1px solid rgba(255,255,255,.10);
  border-radius: 16px;
}
```

Gradient 허용 범위:

- Game Stage 내부
- Result Reveal의 순간적 강조

페이지 전체 Gradient는 금지.

---

# 14. Game Stage Header

필요한 게임에서만 사용한다.

예:

```text
행운의 룰렛                       ?   🔊
```

왼쪽:

- 게임명
- 현재 라운드 상태

오른쪽:

- 게임 방법
- 사운드
- 전체화면

모바일에서는 최대 2개 정도만 노출한다.

Stage Header가 없어도 게임 이해가 가능하면 생략한다.

---

# 15. 참가자 입력

권장 UI:

```text
참가자

[ 이름을 입력하세요                 ][추가]

[ 민지 × ] [ 준호 × ] [ 서연 × ]

☑ 뽑힌 사람은 다음 뽑기에서 제외
```

삭제는 화면상:

```text
민지 ×
```

처럼 보여도 된다.

접근성:

```html
aria-label="민지 삭제"
```

유지.

---

# 16. Participant Chip

권장:

```css
.participant-chip {
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid var(--pp-border-light);
  border-radius: 9px;
}
```

삭제 `×`의 클릭 영역은 최소 32px 이상 확보한다.

Chip이 너무 화려해서 게임보다 먼저 보이지 않게 한다.

---

# 17. Primary Action 규칙

**게임당 Primary Action은 하나.**

권장:

```text
G01 룰렛       룰렛 돌리기
G02 랜덤       뽑기
G03 종이       종이를 직접 클릭
반응속도       시작
폭탄게임       넘기기
```

버튼 규격:

```css
.primary-game-action {
  min-height: 52px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 10px;
}
```

Mobile:

```text
width: 100%
```

Desktop:

```text
min-width: 320px
max-width: 420px
```

---

# 18. Secondary Action

예:

```text
다시 하기
공유
게임 방법
사운드
전체화면
```

Primary보다 낮은 우선순위를 가져야 한다.

금지:

- Primary와 동일한 색상/크기로 여러 버튼 나란히 배치
- 결과 화면에서 BUSINESS 버튼이 “다시 하기”보다 더 강하게 보임

---

# 19. Result Reveal

결과는 모달이 아니라 기본적으로 게임 흐름 안에서 표현한다.

권장 흐름:

```text
0ms        결과 결정
0~250ms    게임 정지
250ms      당첨 이름 등장
250~650ms  짧은 강조
650ms+     일반 결과 상태
```

예:

```text
민지 님이 뽑혔어요!

준호, 서연 님이 남았어요.

추첨 순서: 민지 → 준호
```

시각적 우선순위:

```text
당첨자
↓
남은 사람
↓
추첨 이력
```

---

# 20. Winner Motion

권장:

```css
@keyframes winner-pop {
  0% {
    transform: scale(.94);
    opacity: .45;
  }

  55% {
    transform: scale(1.06);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

권장 시간:

```text
300~500ms
```

기본 Confetti 금지.

추후 BUSINESS 특별 이벤트에서 선택 기능으로 제공 가능.

---

# 21. Motion Tokens

```css
:root {
  --motion-fast: 140ms;
  --motion-ui: 180ms;
  --motion-reveal: 420ms;
  --motion-game: 2800ms;
}
```

용도:

```text
Hover           140ms
Button press    140ms
Modal           180ms
Paper reveal    300~420ms
Winner reveal   420ms
Wheel spin      2.5~2.8s
```

무한 루프 애니메이션은 기본 금지.

---

# 22. Reduced Motion

필수:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

단, 실제 게임 결과가 사라지거나 기능이 깨지면 안 된다.

---

# 23. Sound Design

기본 원칙:

```text
배경 음악 없음
```

필요한 효과음만 사용:

```text
click
spin start
tick
reveal
success
```

규칙:

- 사용자 interaction 이후에만 로딩
- autoplay sound 금지
- mute 상태 LocalStorage 저장 가능
- 음량은 과하지 않게
- 결과를 오인시키는 소리 금지

---

# 24. Lobby Information Architecture

최종 홈은 “서비스 설명 랜딩페이지”가 아니라 “Game Lobby”다.

권장:

```text
PickPlay

오늘 뭐할까요?

[게임 검색]

최근 사용
[룰렛] [종이뽑기] [랜덤뽑기] →

빠른 뽑기
[룰렛] [랜덤] [종이] [사다리] →

모임 · 파티
[폭탄] [밸런스] [5초 게임] →

교실에서
[랜덤 발표] [팀 나누기] [퀴즈] →

둘이서
[반응 대결] [가위바위보] →

새 게임
[신규 게임들...]
```

Hero는 최소화한다.

---

# 25. 게임 검색

게임 수가 12~15개 이상일 때 상단 검색을 강화한다.

예:

```text
[게임 이름이나 상황을 검색하세요]
```

검색 대상:

- 게임명
- 태그
- 사용 상황
- 인원
- 카테고리

예:

```text
“발표”
“2명”
“벌칙”
“팀”
“회식”
```

---

# 26. Game Card

권장 Desktop:

```text
160~190px width
4:3 visual area
```

Mobile:

```text
2 columns
gap 10~12px
```

카드:

```text
┌──────────────┐
│              │
│ game visual  │
│              │
├──────────────┤
│ 행운의 룰렛 │
│ 2명+ · 1분  │
└──────────────┘
```

Visual은 다음 우선순위:

```text
CSS
SVG
Canvas snapshot
small WebP/AVIF
```

이미지 대량 제작을 기본 전제로 하지 않는다.

---

# 27. Game Card Hover

Desktop hover:

```text
border-color 상승
thumbnail scale 1.02
title contrast 상승
```

금지:

- video autoplay
- GIF autoplay
- 큰 shadow
- 과한 3D tilt
- 카드 전체 pulse

---

# 28. Recently Played

로그인 없이 LocalStorage로 시작 가능.

저장 예:

```ts
type RecentGame = {
  gameId: string;
  playedAt: number;
};
```

정렬:

```text
최근 사용 시간 DESC
```

최대:

```text
6~10개
```

---

# 29. Favorites

게임 카드나 게임 페이지에 별 모양 등을 사용할 수 있다.

초기에는 LocalStorage.

로그인 이후 서버 동기화 가능.

기본 화면을 복잡하게 만들면 MVP에서는 생략 가능.

---

# 30. PLAY와 BUSINESS 분리

## PLAY

```text
게임 중심
Dark Game Stage
강한 Accent
Motion 있음
짧은 Sound 있음
즉시 사용
```

## BUSINESS

```text
Light dashboard
Form / Table 중심
데이터 가독성
정확성
Neutral UI
```

BUSINESS 관리자 화면을 카지노 스타일로 만들지 않는다.

---

# 31. BUSINESS CTA

게임 완료 이후 자연스럽게 보여준다.

예:

```text
이 게임, 매장 이벤트에도 써보세요.

룰렛에 경품 수량과 쿠폰을 연결할 수 있어요.

[이 룰렛으로 이벤트 만들기]
```

권장 Accent:

```text
Emerald
```

PLAY Primary Blue와 역할을 구분한다.

금지:

- 결과보다 BUSINESS CTA가 먼저 보임
- 팝업으로 강제 노출
- 번쩍이는 프로모션 배너
- 게임 플레이 중 CTA 노출

---

# 32. Fullscreen / Presentation Mode

MVP 이후 우선순위 높은 기능.

교실, 행사, 매장에서 유용하다.

Fullscreen 실행 시 숨길 것:

```text
상세 설명
관련 게임
BUSINESS CTA
불필요한 입력
```

유지:

```text
게임
현재 결과
Primary Action
최소한의 설정
```

예:

```text
┌─────────────────────────────┐
│                             │
│           룰렛              │
│                             │
│      [룰렛 돌리기]          │
│                             │
└─────────────────────────────┘
```

---

# 33. Responsive Breakpoints

## Mobile

```text
320~479px
```

원칙:

- Stage full width
- Primary full width
- Game Card 2열
- 터치 영역 44px+
- 불필요한 Utility 숨김
- 첫 viewport에 게임 의미 있는 부분 노출

## Tablet

```text
480~899px
```

원칙:

- Stage 560~680px
- Game Card 3~4열

## Desktop

```text
900px+
```

원칙:

- 게임 페이지 720~900px
- Lobby max-width 약 1200px
- Game Card 4~6열
- 지나치게 넓은 빈 공간 방지

---

# 34. 360px Mobile 기준

필수 체크:

```text
제목
짧은 설명
참가자 입력
참가자 chip
핵심 게임 영역 일부
```

가 첫 화면 안 또는 매우 짧은 스크롤 내에서 이어져야 한다.

금지:

```text
제목
설명
인원
시간
긴 규칙
준비
설정
게임
```

순으로 게임이 화면 아래로 밀려나는 구조.

---

# 35. 게임 방법

기본은 접힌 상태.

예:

```html
<details>
  <summary>게임 방법</summary>

  <ol>
    <li>참가자 이름을 넣어요.</li>
    <li>룰렛을 돌려요.</li>
    <li>멈춘 이름을 확인해요.</li>
  </ol>
</details>
```

게임 방법은 게임을 밀어내면 안 된다.

---

# 36. Accessibility

필수 기준:

- 키보드 조작 가능
- focus visible
- 결과 `aria-live`
- 색만으로 상태 전달 금지
- 터치 영역 44px 이상
- Reduced Motion
- 충분한 contrast
- Canvas 결과는 DOM 텍스트로도 표시

Focus:

```css
:focus-visible {
  outline: 2px solid var(--pp-focus);
  outline-offset: 3px;
}
```

---

# 37. Canvas Accessibility

Canvas 안의 텍스트만으로 결과를 전달하지 않는다.

예:

Canvas에서 민지가 당첨되어도 DOM에 반드시:

```text
민지 님이 뽑혔어요.
```

출력한다.

Canvas는 시각 표현이고 상태의 단일 source of truth가 아니다.

---

# 38. Performance Budget

기존 PickPlay 기준을 유지한다.

목표:

```text
LCP <= 2.5s
INP <= 200ms
CLS <= 0.1
Lighthouse Performance >= 90
SEO >= 95
Accessibility >= 90
```

권장:

```text
initial JS gzip <= 120KB
first-view game image transfer <= 120KB
thumbnail <= 25KB
```

---

# 39. Asset Policy

우선순위:

```text
1. CSS
2. HTML
3. Canvas
4. SVG
5. AVIF/WebP
6. 그 외
```

금지:

- 초기 화면 video
- animated GIF
- 배경용 대형 PNG
- 웹폰트 다운로드
- 한 게임 때문에 무거운 공통 라이브러리 추가

---

# 40. Code Splitting

G01 룰렛 페이지에서 다음 코드가 로드되면 안 된다.

```text
Scratch
Paper
Reaction
Business Dashboard
```

각 게임 renderer는 route level lazy/code split을 유지한다.

---

# 41. Casino-like UX에서 금지할 패턴

다음은 명시적 금지 목록이다.

## Interaction

- autoplay
- turbo 반복
- multi-game simultaneous play
- infinite flashing
- accidental double action

## Result

- fake near miss
- 거짓 winner state
- 실패를 성공처럼 표현
- 결과 확률 왜곡

## Marketing

- countdown pressure
- fake scarcity
- “지금 안 하면 손해” FOMO
- 전면 pop-up bonus

## Visual

- 검정 + 금색 + 칩 + 달러 + 잭팟 남발
- Slot-machine 외형을 모든 게임에 적용
- 현금 payout 연상 아이콘

---

# 42. G01 룰렛 적용 사양

## Stage

룰렛은 Dark Game Stage의 중심.

권장:

```text
Stage
- Pointer
- Wheel
- Primary Action
```

설정은 Stage 밖 Light area.

## Text

2~4명:

- 읽기 쉬운 방향 유지
- 완전히 뒤집힌 이름 금지

많은 참가자:

- font-size 축소
- truncate 가능

## Pointer

명확해야 하지만 과도하게 크지 않게.

## Center hub

실행 버튼처럼 보여서는 안 된다.

`GO` 문구 금지.

단순 원 또는 PickPlay mark 정도.

---

# 43. G01 Result

예:

```text
민지 님이 뽑혔어요!

준호, 서연 님이 남았어요.

추첨 순서  민지 → 준호
```

제외 ON:

```text
다음 Spin 시작 시 민지 제외
```

당첨 직후:

```text
당첨 상태 Wheel 유지
```

다음 라운드 시작:

```text
remaining 기준 재렌더링
```

---

# 44. G02 랜덤뽑기 디자인 방향

G02가 룰렛의 “텍스트 버전”처럼 보여서는 안 된다.

고유 연출:

```text
민지
준호
서연
민지
서연
...
민지
```

처럼 이름이 짧게 전환되다가 정지.

권장:

```text
cycling 500~900ms
winner reveal 420ms
```

과도한 slot machine 표현은 피한다.

---

# 45. G03 종이뽑기 디자인 방향

핵심:

```text
사용자가 직접 하나를 고른다.
```

접힌 종이:

- 충분한 크기
- 각 종이 미세한 angle variation 가능
- 선택 시 짧게 펼침
- 이름 공개
- 결과 후 펼쳐진 상태 유지
- 다음 라운드에서 remaining 기준 재배치

마지막 1명 자동 확정 시 마지막 종이도 자동 공개.

---

# 46. 이후 게임 디자인 원칙

새 게임은 반드시 “고유 손맛”을 정의한 뒤 구현한다.

예:

```text
룰렛      회전
랜덤      빠른 이름 전환
종이      직접 선택/펼침
사다리    경로 추적
오리경주  이동/경쟁
반응속도  순간 반응
폭탄      시간 압박
카드      뒤집기
캡슐      열기
```

동일한 버튼 + 결과 UI만 반복하지 않는다.

---

# 47. Component 후보

필요한 경우 다음 정도만 공통화한다.

```text
GameStage
GamePrimaryAction
ParticipantInput
ParticipantChip
GameResult
GameHistory
GameUtilityBar
GameCard
LobbyRail
BusinessCTA
```

주의:

- 이름만 공통 컴포넌트로 만들고 내부가 게임별 조건문 투성이가 되면 안 된다.
- 두 개 이상 게임에서 실제 중복이 보인 후 공통화한다.

---

# 48. 권장 GameStage API 예시

```astro
<GameStage
  gameId="wheel"
  accent="blue"
  title="행운의 룰렛"
>
  <slot name="game" />
  <slot name="action" />
  <slot name="result" />
</GameStage>
```

게임 로직은 GameStage에 넣지 않는다.

GameStage 역할:

- 레이아웃
- 배경
- Border
- 결과 표시 영역
- Utility slot

---

# 49. LobbyRail 예시

```astro
<LobbyRail
  title="빠른 뽑기"
  href="/games/draw"
>
  <GameCard />
  <GameCard />
  <GameCard />
</LobbyRail>
```

Desktop:

```text
수평 rail
```

Mobile:

```text
horizontal scroll 또는 2열 grid
```

둘 중 하나를 테스트 후 확정.

---

# 50. 홈 정보 위계

홈 상단 권장:

```text
PickPlay

오늘 뭐할까요?

[게임 검색]
```

그 아래 즉시 게임.

Hero 문구 3~4줄 금지.

큰 일러스트 Hero 금지.

---

# 51. Navigation

Desktop:

```text
PickPlay
PLAY
BUSINESS
```

필요하면:

```text
검색
최근 사용
```

Mobile Bottom Nav 후보:

```text
PLAY
찾기
BUSINESS
```

3개면 충분.

---

# 52. Modal

게임 설정 Modal은 필요할 때만 사용.

Modal 안에 모든 설정을 몰아넣지 않는다.

좋은 예:

```text
고급 옵션
- 반복 허용
- 사운드
- 표시 시간
```

나쁜 예:

```text
참가자 입력부터 게임 시작까지 전부 Modal
```

---

# 53. Error / Empty State

참가자 부족:

```text
한 명을 더 추가하면 시작할 수 있어요.
```

권장.

금지:

```text
ERROR: minimum participant count invalid
```

빈 결과:

```text
참가자를 넣고 게임을 시작해보세요.
```

---

# 54. Microcopy 원칙

기술 용어 금지.

권장:

```text
이름 추가
룰렛 돌리기
다시 하기
게임 방법
한 명을 더 추가해주세요
마지막으로 남았어요
```

피할 표현:

```text
submit
execute
reset state
participant entity
selection result
```

---

# 55. Result History Copy

기본:

```text
추첨 순서: 민지 → 준호 → 서연
```

상황형 게임은 label 교체 가능.

예:

```text
발표 순서
벌칙 순서
선물 선택 순서
자리 선택 순서
```

단, 일반 Draw에서 `1위 / 2위 / 3위`는 사용하지 않는다.

---

# 56. QA Viewports

반드시:

```text
360px
390px
768px
1440px
```

최소 확인.

특히 360px, 1440px screenshot은 Production Pass 필수.

---

# 57. Visual QA Checklist

## 상단

- 제목이 너무 크지 않은가
- 설명이 두 줄 이상 길어지지 않는가
- 게임 방법이 기본 닫힘인가
- 게임이 첫 viewport에서 보이는가

## 입력

- 이름 입력이 충분히 쉬운가
- 추가 버튼이 명확한가
- chip 삭제가 쉬운가
- 20명 이상에서 wrap 되는가

## 게임

- 게임 오브젝트가 가장 먼저 보이는가
- Primary Action이 하나인가
- Stage가 너무 카지노처럼 보이지 않는가
- 게임별 Accent가 명확한가

## 결과

- 당첨자가 가장 강하게 보이는가
- 남은 사람이 두 번째인가
- 이력이 세 번째인가
- 다시 하기/공유가 결과 아래 있는가

---

# 58. Interaction QA Checklist

- 빠른 연타 차단
- 애니메이션 중 설정 변경 방지
- 결과와 시각 상태 일치
- 마지막 1명 자동 확정
- 제외 ON/OFF
- 중복 이름
- 공백 이름
- 긴 이름
- 20~50명
- 다시 하기
- 공유
- 브라우저 Back/Forward
- Resize
- Reduced Motion

---

# 59. Accessibility QA Checklist

- 모든 input label 존재
- icon button aria-label
- 결과 aria-live
- Keyboard focus 순서
- 44px touch target
- Canvas 결과 DOM mirror
- contrast
- Reduced Motion
- checkbox label click 가능
- details summary keyboard 사용 가능

---

# 60. Performance QA Checklist

- route-specific JS인가
- 불필요 dependency 추가 안 했는가
- image 없는 게임에 image를 넣지 않았는가
- GIF/video 없는가
- Canvas resize 시 과도한 redraw 없는가
- Mobile CPU에서 animation이 끊기지 않는가
- layout shift 없는가

---

# 61. 디자인 구현 순서

현재 위치:

```text
G01 기능        완료
G02 기능        완료
G03 기능        완료
Production Shell 완료
```

다음:

```text
DS-C01 Design Tokens
↓
DS-C02 GameStage Component
↓
DS-C03 G01 Dark Stage 적용
↓
360 / 390 / 1440 검수
↓
DS-C04 Game Card / Lobby Rail
↓
DS-C05 G02 적용
↓
DS-C06 G03 적용
↓
Homepage Game Lobby
↓
통합 QA
↓
G04 이후 신규 게임
```

---

# 62. DS-C01 작업 범위

구현:

- color tokens
- spacing tokens
- radius
- motion tokens
- stage tokens
- focus tokens

금지:

- 기존 게임 로직 수정
- 새 게임
- 홈 전체 개편

---

# 63. DS-C02 작업 범위

`GameStage` 생성.

역할:

```text
Dark stage
Accent
Game slot
Action slot
Result slot
Utility slot
```

하지 말 것:

```text
selectionState
random logic
wheel logic
participant logic
coupon
business
```

---

# 64. DS-C03 작업 범위

G01 룰렛에만 적용.

검증:

```text
설정 Light
Stage Dark
Wheel 중심
Spin Primary
결과 자연스러운 연결
BUSINESS 분리
```

스크린샷 승인 후 G02/G03에 전파.

---

# 65. Design Freeze 규칙

G01 Dark Stage가 승인되면:

```text
Game Stage
Primary button
Result
Participant input
Chip
Game method
Business CTA
```

를 기본 기준으로 Freeze한다.

그 이후 신규 게임은 임의 스타일을 만들지 않는다.

단, 게임 고유 Renderer는 자유롭게 다를 수 있다.

---

# 66. 디자인 변경 승인 기준

다음 중 하나에 해당할 때만 공통 디자인 시스템 변경.

- 3개 이상 게임에서 같은 문제가 반복
- Mobile usability 문제
- Accessibility 문제
- Performance 문제
- 정보 위계 문제
- BUSINESS/PLAY 역할 충돌

단순 취향만으로 전역 디자인 변경 금지.

---

# 67. Anti-AI Design 규칙

다음 패턴을 피한다.

- 거대한 Hero Card
- 의미 없는 abstract blob
- pastel card grid
- 모든 요소 둥글게
- 과도한 shadow
- gradient everywhere
- 모든 문구를 “쉽고 빠르게” 같은 홍보 카피로 채움
- 큰 아이콘 + 설명 카드 반복
- 과도한 badge/pill
- 실제 기능보다 빈 장식 공간이 큼

PickPlay은 “예쁜 SaaS”보다 “자주 쓰는 게임 도구”로 보여야 한다.

---

# 68. 시각적 브랜드 방향

PickPlay 브랜드 느낌:

```text
빠름
명확함
재미
직접 조작
가벼움
친근함
```

피해야 할 느낌:

```text
도박
과장
럭셔리 카지노
기업용 ERP
AI SaaS template
어린이 전용
```

연령대가 넓어야 한다.

---

# 69. 게임별 시각 아이덴티티

공통 Stage는 유지하되 내부 연출은 다르게.

예:

```text
룰렛
원형 / 회전 / 포인터

종이
접힘 / 펼침 / 직접 선택

랜덤
빠른 텍스트 전환 / 정지

사다리
선 / 흐름 / 경로 추적

오리 경주
트랙 / 캐릭터 이동

반응속도
대형 컬러 패널 / 즉시 탭
```

---

# 70. 모바일 Thumb Zone

Primary button은 가능한 한 모바일 하단 thumb zone에 위치.

단, fixed bottom button을 기본 사용하지 않는다.

게임마다 스크롤 상황이 다르므로 Stage 하단에 자연스럽게 배치.

---

# 71. Safe Area

Mobile:

```css
padding-bottom:
  max(16px, env(safe-area-inset-bottom));
```

Bottom Navigation 존재 시 추가 padding 확보.

---

# 72. Haptic / Vibration

Web vibration API는 기본 사용하지 않는다.

추후 지원 시:

- 매우 짧은 success feedback
- 사용자 opt-in 고려
- 모바일 브라우저 호환성 확인

MVP에서는 제외 가능.

---

# 73. Keyboard Shortcuts

Desktop에서 유용한 게임은 선택적으로.

예:

```text
Space -> 룰렛 돌리기
R     -> 다시 하기
```

단, input focus 중에는 작동하지 않게 한다.

MVP 이후.

---

# 74. Share UX

지원 우선순위:

```text
navigator.share
↓
clipboard
```

공유 텍스트 예:

```text
PickPlay 룰렛에서 민지 님이 뽑혔어요.
```

Challenge 기능 도입 이후 URL 공유 확장.

---

# 75. Game Result URL

향후:

```text
/challenge/{id}
```

가능.

예:

```text
내 반응속도 187ms
이 기록을 이겨보세요.
```

현재 Draw 결과는 개인정보 포함 가능성이 있어 기본 public URL 공유에 주의.

---

# 76. 개인정보 표현

참가자 이름은 Local usage가 기본.

서버 저장이 불필요한 무료 게임은 브라우저 로컬 처리 우선.

공유 기능에서 참가자 이름이 외부 전송되는 경우 UX 안내 필요.

---

# 77. BUSINESS 전환 UX

PLAY -> BUSINESS 전환 시 사용자가 이미 사용한 게임을 재선택하지 않게 한다.

예:

```text
G01 룰렛
↓
이 룰렛으로 이벤트 만들기
↓
BUSINESS Campaign Wizard
gameType = WHEEL preset
```

이게 자연스러운 연결이다.

---

# 78. BUSINESS Campaign Visual Preview

향후 Campaign Builder에서 PLAY renderer를 그대로 preview에 사용.

단:

- BUSINESS 결과는 server-assigned
- Renderer는 결과 표현만
- 게임 renderer가 경품 확률/재고를 결정하지 않음

---

# 79. Renderer 원칙

무료 게임:

```text
Client random 가능
```

BUSINESS:

```text
Server validates ticket
Server reserves result
Client renderer animates to result
```

Design System은 둘 다 같은 Renderer를 사용할 수 있게 해야 한다.

---

# 80. 결과 상태 색상

권장:

```text
Winner      --pp-win
Success     --pp-success
Neutral     --pp-stage-text
Secondary   --pp-stage-text-soft
History     --pp-stage-text-muted
Error       --pp-danger
```

결과는 색 + 텍스트 함께 사용.

---

# 81. Dark Stage 대비

Stage 안에서:

```text
Primary text        4.5:1 이상 권장
Secondary text      충분한 대비
Disabled            너무 흐려져 읽지 못하게 하지 않음
```

특히 Dark background + Blue button contrast 확인.

---

# 82. Empty Stage

참가자 부족 시에도 빈 검정 박스만 보이면 안 된다.

예:

```text
참가자를 한 명 더 추가하면
룰렛을 돌릴 수 있어요.
```

Stage 중앙에 작게 안내.

---

# 83. Loading State

무료 게임은 로딩을 거의 만들지 않는다.

필요하면:

```text
게임을 준비하고 있어요…
```

200~300ms 이내라면 spinner를 굳이 보이지 않는다.

---

# 84. Skeleton

게임 page에는 기본적으로 skeleton 사용하지 않는다.

Static HTML + lightweight JS이므로 즉시 내용이 보여야 한다.

Lobby thumbnail이 네트워크 이미지일 경우만 필요 시 고려.

---

# 85. Button Disabled

Disabled 상태는 명확해야 한다.

예:

```css
opacity: .45;
cursor: not-allowed;
```

안내 문구:

```text
한 명을 더 추가해주세요.
```

버튼만 회색으로 만들어 이유를 숨기지 않는다.

---

# 86. Focus Flow

권장 키보드 순서:

```text
이름 input
추가
participant 삭제
exclude checkbox
game primary
secondary actions
business CTA
related games
```

---

# 87. Related Games

현재처럼 하단에 유지.

최종 Game Card system과 통합.

예:

```text
다른 게임도 해볼까요?

[랜덤뽑기] [종이뽑기] [사다리]
```

게임 페이지보다 강하게 보이지 않음.

---

# 88. SEO 콘텐츠와 Game UI 분리

검색용 설명은 게임 인터랙션 위에 길게 배치하지 않는다.

필요한 SEO 설명:

```text
게임 아래
FAQ
사용 방법
활용 예
```

등으로 이동.

첫 화면은 게임 우선.

---

# 89. FAQ

페이지 하단 가능:

```text
룰렛은 몇 명까지 사용할 수 있나요?
중복 이름을 넣어도 되나요?
당첨자를 제외할 수 있나요?
```

게임 플레이를 밀어내지 않도록 하단 배치.

---

# 90. 구현 시 우선순위

## P0

- 게임 동작
- 모바일
- 접근성
- 성능
- 상태 일치

## P1

- Dark Stage
- 결과 연출
- Lobby card
- Recently Played

## P2

- Sound
- Fullscreen
- Favorites
- Advanced motion

---

# 91. 구현하지 않을 것

v1.0에서 하지 않음:

- 3D
- WebGL
- 영상 배경
- 자동 미리보기 영상
- 고용량 사운드팩
- 복잡한 shader
- animated mascot
- heavy UI framework
- game engine dependency

---

# 92. G01 승인 기준

G01 Dark Stage 최종 PASS 조건:

- 360/390/1440 정상
- Light 설정 + Dark Game Stage 자연스러움
- 룰렛이 가장 강하게 보임
- Primary 하나
- 결과 hierarchy 명확
- BUSINESS 구분
- casino-copy 느낌 없음
- 한글 가독성
- no overflow
- 기존 기능 회귀 없음
- typecheck/build pass

---

# 93. G02 승인 기준

- 랜덤뽑기만의 고유 연출
- G01과 똑같은 화면처럼 보이지 않음
- selectionState 공유 유지
- Stage/Result/Primary는 공통 언어
- 모바일 정상

---

# 94. G03 승인 기준

- 종이를 직접 고르는 경험
- 접힌/펼침 상태 명확
- 마지막 1명 자동 공개
- 다음 라운드 상태 명확
- Stage 안에서 충분히 큰 터치 영역
- 20명 이상 wrap/scroll 안정

---

# 95. 홈 Game Lobby 승인 기준

- 첫 viewport에서 게임이 보임
- 게임 검색 접근 가능
- 최소 3개 rail
- 최근 사용 LocalStorage 적용 가능
- Mobile 2열 또는 horizontal rail 일관성
- Hero가 게임보다 크지 않음
- BUSINESS가 PLAY보다 먼저 나오지 않음

---

# 96. Terra 작업 지시 원칙

Terra에게 디자인 작업을 시킬 때 항상 다음을 명시한다.

```text
게임 로직 변경 금지
새 게임 금지
외부 라이브러리 금지
성능 기준 유지
360/390/1440 screenshot
typecheck/build
```

---

# 97. DS-C01 + DS-C02 + G01 적용용 작업지시 초안

```text
AGENTS.md, 작업지시.md, 개발체크리스트.md,
PickPlay_UIUX_Design_Spec_v1.0.md를 읽고 작업한다.

이번 작업은 DS-C01, DS-C02, G01 Dark Game Stage 적용까지만 진행한다.

새 게임은 만들지 않는다.
G02/G03는 수정하지 않는다.
기존 selectionState와 G01 추첨 로직은 변경하지 않는다.

1. design-system.css에 문서 기준 Design Token을 추가한다.
2. 재사용 가능한 GameStage를 구현한다.
3. GameStage에는 게임 로직을 넣지 않는다.
4. G01 룰렛에만 Hybrid Dark Stage를 적용한다.
5. 설정/참가자 입력은 Light 영역에 유지한다.
6. 룰렛과 Primary Action은 Dark Stage 안에서 중심이 되게 한다.
7. Winner Result는 Stage 또는 Stage 바로 아래에서 자연스럽게 이어지게 한다.
8. BUSINESS CTA는 별도 Light 영역으로 유지한다.
9. 이미지/GIF/video/새 UI library 추가 금지.
10. prefers-reduced-motion 유지.
11. 기존 G01 기능 회귀 검수.
12. 360px, 390px, 1440px 실제 screenshot 생성.
13. npm run typecheck
14. npm run build

완료 보고:
- 변경 파일
- Design Token
- GameStage 책임 범위
- G01 적용 내용
- 기능 로직 변경 여부
- 회귀 테스트
- typecheck/build
- screenshots
```

---

# 98. 디자인 QA 보고 형식

```text
1. 화면 구조
2. 디자인 토큰
3. Game Stage
4. Primary Action
5. Result Reveal
6. Mobile 360/390
7. Desktop 1440
8. Accessibility
9. Performance
10. Regression
11. PASS / HOLD
```

---

# 99. 리서치 기반 요약

본 사양은 다음 공개 UI/UX 패턴을 참고해 PickPlay 목적에 맞게 재해석했다.

- Stake: 2026년 Casino UI 업데이트의 Games For You, Saved Games, Following, Continue Playing, Desktop side panel, Mobile For You
- BetMGM: Search Game, Featured, New Games, Table/Live/Variety 등 카테고리 탐색
- DraftKings Casino: New Games, Recently Played, Suggested for You, Hottest Games, Arcade, Roulette 등 콘텐츠 rail
- FanDuel Casino Research: 강한 Spin Primary Action, 설정/사운드의 주변부 배치, 시각/사운드 테마 몰입
- UK Gambling Commission의 remote game design 기준: autoplay, speed/turbo, near-miss, 오인성 결과 표현 등 위험한 패턴에 대한 제한 원칙

PickPlay은 위 패턴 중 “탐색성, 몰입감, 결과 피드백, Primary Action”만 차용한다.

---

# 100. 최종 원칙

PickPlay의 디자인은 카지노 복제품이 아니다.

최종적으로 다음 구조를 목표로 한다.

```text
Game Lobby
↓
게임 발견
↓
즉시 플레이
↓
짧고 만족스러운 결과 피드백
↓
다시 하기 / 공유
↓
필요한 사용자만 BUSINESS
```

가장 중요한 원칙은 다음 세 가지다.

1. **게임이 가장 먼저 보여야 한다.**
2. **게임마다 조작의 손맛이 달라야 한다.**
3. **공통 UI는 일관되되, 카지노처럼 보이기보다 PickPlay 자체의 게임 플랫폼처럼 보여야 한다.**

---

# Appendix A. Quick Token Reference

```css
:root {
  --pp-page: #f8fafc;
  --pp-page-strong: #ffffff;

  --pp-stage: #07111f;
  --pp-stage-soft: #0b1628;
  --pp-stage-raised: #101d31;
  --pp-stage-hover: #16253d;

  --pp-border-light: #dbe3ec;
  --pp-border-dark: rgba(255,255,255,.11);
  --pp-border-dark-strong: rgba(255,255,255,.20);

  --pp-text: #0f2742;
  --pp-text-soft: #40556d;
  --pp-text-muted: #738397;

  --pp-stage-text: #f8fafc;
  --pp-stage-text-soft: #a6b4c8;
  --pp-stage-text-muted: #718198;

  --pp-primary: #2563eb;
  --pp-primary-hover: #3974f5;
  --pp-primary-active: #1e54c7;

  --pp-win: #ffc857;
  --pp-success: #16a085;
  --pp-orange: #f97316;
  --pp-danger: #ef476f;

  --pp-business: #0b806f;
  --pp-focus: #38bdf8;

  --motion-fast: 140ms;
  --motion-ui: 180ms;
  --motion-reveal: 420ms;
  --motion-game: 2800ms;

  --radius-control: 10px;
  --radius-card: 12px;
  --radius-stage: 16px;
}
```

---

# Appendix B. Wheel Palette

```ts
export const wheelPalette = [
  '#2F6BFF',
  '#F97316',
  '#0F9F89',
  '#8B5CF6',
  '#E94D77',
  '#F5B942',
  '#28B8E8',
  '#74B816',
];
```

---

# Appendix C. Production Design Checklist

```text
[ ] 게임이 첫 화면의 주인공이다.
[ ] 긴 Hero가 없다.
[ ] 게임 방법은 접혀 있다.
[ ] Primary Action은 하나다.
[ ] Stage와 설정 영역의 역할이 구분된다.
[ ] Winner가 가장 강하게 보인다.
[ ] BUSINESS CTA가 게임을 방해하지 않는다.
[ ] 360px에서 overflow가 없다.
[ ] 1440px에서 과도한 빈 공간이 없다.
[ ] 모든 터치 영역은 44px 이상이다.
[ ] 결과는 aria-live로 전달된다.
[ ] prefers-reduced-motion을 지원한다.
[ ] 이미지/GIF/video 남용이 없다.
[ ] 새 dependency 없이 구현 가능한지 확인했다.
[ ] typecheck 통과.
[ ] build 통과.
[ ] 실제 Chrome screenshot 검수 완료.
```

---

# Appendix D. Reference Research Notes

## Stake
- 2026-08-14 UI 업데이트에서 Games For You, Saved Games, Following, Continue Playing을 통합한 새로운 Casino panel 발표.
- Desktop side panel과 Mobile For You slide-up 경험을 소개.
- Hover game preview는 참고만 하고 PickPlay에서는 성능상 영상 미리보기 미적용.

## BetMGM
- All Games에 Search Game 제공.
- Featured / New Games / Live Dealer / Table Games / Variety Games 등 카테고리 구조 확인.
- 신규 사용자에게 Featured/New Games 탐색을 유도하는 구조 참고.

## DraftKings
- Casino Home에서 New Games, Recently Played, Suggested for You, Hottest Games of the Year, Arcade, Top Roulette Games 등 다수의 콘텐츠 Rail 운영.
- PickPlay 홈의 Game Lobby 구조 참고.

## FanDuel
- 다양한 Casino Game Spotlight에서 큰 Spin 버튼, 주변부 설정 메뉴, 사운드 컨트롤, 몰입형 Visual/Sound 패턴 확인.
- PickPlay에서는 강한 Primary Action과 짧은 사운드 피드백만 차용.

## Gambling Commission
- 실제 온라인 도박 UX에서 autoplay, 과도한 속도 증가, near-miss, 오인성 결과 표현 등은 사용자 보호 관점에서 위험 요소로 다뤄짐.
- PickPlay은 법적 규제 적용 여부와 별개로 해당 패턴을 자발적으로 배제한다.

---

문서 끝.
