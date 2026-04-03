# 🔥 조용한 야망가들 — 배포 완전 가이드

모든 파일이 준비되어 있습니다. 아래 순서대로 따라하면 됩니다.

---

## 📁 파일 구조 (이미 완성됨)

```
sap-website/
├── package.json         ← 의존성
├── vite.config.js       ← 빌드 설정
├── nixpacks.toml        ← Railway 배포 설정
├── server.js            ← 프로덕션 서버
├── index.html           ← 진입점
├── .gitignore
└── src/
    ├── main.jsx         ← React 진입점
    ├── App.jsx          ← 메인 앱 (★ 여기서 수정)
    └── data.js          ← 칼럼 데이터 (★ 칼럼 추가/수정)
```

---

## STEP 1: Formspree 가입 (5분)

1. https://formspree.io 접속 → 구글로 회원가입
2. **폼 2개** 만들기:
   - "대기자 등록" 폼 → 폼 ID 복사 (예: `xyzabcde`)
   - "회원가입" 폼 → 폼 ID 복사
3. `src/App.jsx` 파일 상단의 이 부분 수정:

```javascript
const FORMSPREE_WAITLIST = 'https://formspree.io/f/여기에_대기자_FORM_ID'
const FORMSPREE_REGISTER = 'https://formspree.io/f/여기에_회원가입_FORM_ID'
```

→ '여기에_대기자_FORM_ID'를 실제 ID로 교체. 예:
```javascript
const FORMSPREE_WAITLIST = 'https://formspree.io/f/xyzabcde'
```

---

## STEP 2: GitHub에 올리기 (10분)

### 방법 A: GitHub 웹사이트에서 (태블릿 가능)

1. https://github.com 로그인
2. 우측 상단 "+" → "New repository"
3. 이름: `sap-website` → Create
4. "Add file" → "Upload files" → 다운로드한 파일 전체 드래그
5. "Commit changes" 클릭

### 방법 B: Claude Code로 (랩탑)

```bash
cd sap-website
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/너의유저명/sap-website.git
git push -u origin main
```

---

## STEP 3: Railway 배포 (5분)

1. https://railway.app 접속 → GitHub으로 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. `sap-website` 레포 선택
5. Railway가 자동으로 빌드 시작 (nixpacks.toml 감지)
6. 2~3분 기다리면 배포 완료
7. "Settings" → "Networking" → "Generate Domain" 클릭
   → `sap-website-xxxxx.up.railway.app` URL 생성됨
8. (선택) 커스텀 도메인 연결: "Custom Domain" → 도메인 입력

---

## STEP 4: 프로필에 링크 걸기 (1분)

- 인스타 프로필 링크: 생성된 Railway URL
- 스레드 프로필: 같은 URL
- 유튜브 채널 소개: 같은 URL

---

## STEP 5: 테스트 (3분)

1. URL 접속 → 홈페이지 확인
2. "사전등록" 클릭 → 이름/이메일 입력 → 제출
3. formspree.io 대시보드 → 데이터 들어왔는지 확인
4. 칼럼 하나 클릭 → URL이 `#col-01` 형태인지 확인
5. 그 URL을 복사해서 새 탭에서 열기 → 해당 칼럼으로 이동하는지 확인

---

## 결제 시스템 (1기: 수동)

### 토스 송금 링크 만들기
1. 토스 앱 → "송금" → "송금 요청하기"
2. 금액: 100,000원 입력
3. 메시지: "조용한 야망가들 1기 프로그램"
4. 링크 생성 → 복사

### 결제 워크플로우
```
대기자 등록됨 (Formspree 알림)
  ↓ 오픈 시
Stibee로 안내 이메일 발송 (토스 송금 링크 포함)
  ↓ 결제 확인
디스코드 초대 링크 DM 발송
```

---

## 이메일 알림 (Stibee)

### 이미 계정 있으니까:
1. Formspree 대시보드 → "Export" → CSV 다운로드
2. Stibee → 주소록 → CSV 업로드
3. 이메일 작성 → 발송

### Formspree 자동 알림 설정:
- Formspree 무료 플랜: 새 제출마다 이메일 알림이 옴
- 즉, 누가 등록하면 Grace 이메일로 바로 알림

---

## 휴대폰 문자 알림 (알리고)

1. https://smartsms.aligo.in 가입
2. 충전 (최소 5,000원 → 약 300건)
3. "단문 발송" → 수신자 입력 → 메시지 작성
4. 예시: "[조용한 야망가들] 1기 프로그램이 오픈되었습니다! 자세한 내용: (URL)"

1기 20명이면 수동으로도 충분. 건당 약 15원.

---

## 디스코드 자동 메시지 (나중에)

### Webhook 셋업:
1. 디스코드 서버 → 채널 설정 → "연동" → "웹후크"
2. "새 웹후크" → URL 복사
3. Claude Code한테 요청:
   "이 웹후크 URL로 매일 아침 9시에 과제 알림 보내는 스크립트 만들어줘"

---

## Claude Code로 수정하는 법

랩탑에서 프로젝트 폴더 열고:

```bash
cd sap-website
claude
```

### 자주 쓸 명령들:

```
> src/App.jsx에서 가격을 15만원으로 변경해줘

> src/data.js에 새 칼럼 추가해줘. 
  제목: "xxx", 태그: "xxx", 내용: "xxx"

> 히어로 섹션 문구를 "2기 모집 중"으로 바꿔줘

> 전자책 미리보기 내용을 더 추가해줘

> git add . && git commit -m "업데이트" && git push
```

→ Railway가 자동으로 새 버전 배포 (1~2분)

---

## 타임라인 요약

| 순서 | 할 일 | 시간 |
|------|-------|------|
| 1 | Formspree 가입 + 폼 2개 생성 | 5분 |
| 2 | App.jsx에 Formspree ID 넣기 | 2분 |
| 3 | GitHub에 파일 올리기 | 10분 |
| 4 | Railway 연결 + 배포 | 5분 |
| 5 | 테스트 | 3분 |
| 6 | 프로필에 링크 걸기 | 1분 |
| **총** | | **~25분** |
