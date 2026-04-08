# 🚀 SAP Website 셋업 가이드

이 문서는 새로 추가된 기능들(Supabase 인증, 동의서, 결제, RSS 뉴스레터)을 활성화하기 위한 단계별 가이드입니다.

## 새로 추가된 기능

- ✅ 홈페이지 리뉴얼 (4개 섹션 카드 허브)
- ✅ TED 프로그램 랜딩페이지 (`#ted-program`) — 별도 링크 공유 가능
- ✅ Supabase 소셜 로그인 (Google + Kakao)
- ✅ 칼럼 본문 회원 게이팅 (미리보기 → 가입 유도)
- ✅ 개인정보/마케팅 동의서 (한국법 준수)
- ✅ 결제 페이지 (계좌이체, 사업자등록 후 PortOne 전환 가능)
- ✅ Stibee 뉴스레터 RSS 피드 (`/rss.xml`)
- ✅ Formspree 대기자/회원가입 폼에 동의 체크박스 추가

---

## 1️⃣ Supabase 셋업 (필수, ~30분)

### 1-1. Supabase 프로젝트 생성
1. https://supabase.com 가입
2. New Project → 이름: `sap-website` → 비밀번호 설정 → 리전: Northeast Asia (Seoul) 선택
3. 프로젝트 생성 완료 후 좌측 메뉴 **Project Settings → API** 에서 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public key** (긴 문자열)

### 1-2. DB 스키마 적용
1. Supabase Dashboard → **SQL Editor** → New Query
2. `supabase-schema.sql` 파일 내용 전체 복사 후 붙여넣기 → Run
3. 좌측 **Table Editor** 에서 `profiles` 테이블 생성 확인

### 1-3. 환경변수 로컬 설정
프로젝트 루트에 `.env` 파일 생성:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 1-4. Railway 환경변수 설정
1. Railway Dashboard → 프로젝트 → Variables 탭
2. 아래 2개 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. 저장 → 자동 재배포

---

## 2️⃣ Google OAuth 셋업 (~20분)

### 2-1. Google Cloud Console
1. https://console.cloud.google.com → 프로젝트 생성 (이름: `sap-website`)
2. 좌측 메뉴 → **APIs & Services → OAuth consent screen**
   - User Type: External 선택
   - 앱 이름: `조용한 야망가들`
   - 이메일: 본인 이메일
   - 저장
3. **Credentials → Create Credentials → OAuth client ID**
   - Application type: Web application
   - 이름: `SAP Web`
   - **Authorized redirect URIs**에 추가:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     (xxxxx 부분은 본인의 Supabase 프로젝트 URL)
   - 생성 완료 → **Client ID** 와 **Client Secret** 복사

### 2-2. Supabase에 등록
1. Supabase Dashboard → **Authentication → Providers → Google**
2. Enable 활성화
3. Client ID, Client Secret 붙여넣기 → Save

---

## 3️⃣ Kakao OAuth 셋업 (~20분)

### 3-1. Kakao Developers
1. https://developers.kakao.com 가입/로그인
2. 내 애플리케이션 → 애플리케이션 추가하기
   - 앱 이름: `조용한 야망가들`
   - 사업자명: (개인이면 본인 이름)
3. 생성 후 **앱 키** → **REST API 키** 복사
4. 좌측 메뉴 → **카카오 로그인** → 활성화 ON
5. **Redirect URI** 등록:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
6. 좌측 **카카오 로그인 → 보안** → **Client Secret** 코드 생성 → 활성화 → 복사
7. 좌측 **카카오 로그인 → 동의 항목**:
   - 닉네임: 필수 동의
   - 카카오계정(이메일): 필수 동의 (선택 동의 가능)

### 3-2. Supabase에 등록
1. Supabase Dashboard → **Authentication → Providers → Kakao**
2. Enable 활성화
3. **Kakao Client ID** = 위에서 복사한 REST API 키
4. **Kakao Client Secret** = 위에서 생성한 Client Secret
5. Save

---

## 4️⃣ Stibee RSS 자동 발송 셋업 (~10분)

새 칼럼이 추가되면 자동으로 마케팅 동의 회원에게 발송됩니다.

1. Stibee 로그인 → 자동 이메일 → 새 자동 이메일 만들기
2. 발송 조건: **RSS 피드 업데이트 시**
3. RSS URL 입력:
   ```
   https://sap-website-production.up.railway.app/rss.xml
   ```
4. 발송 주기: 매일 09:00 (또는 원하는 시간)
5. 이메일 템플릿: 본문에 `{{content:encoded}}` 변수 포함
6. 수신자 그룹: 마케팅 동의 회원
7. 활성화

### 새 칼럼 발행 워크플로우
1. `data.js`의 COLUMNS 배열에 새 칼럼 추가
2. `git push` → Railway 자동 배포
3. Stibee가 RSS 변경 감지 → 다음 발송 주기에 자동 발송

---

## 5️⃣ 계좌이체 정보 업데이트 (필수)

`App.jsx` 상단 `BANK_INFO` 객체에 실제 계좌 정보 입력:
```javascript
const BANK_INFO = {
  bank: '카카오뱅크',         // 본인 은행
  account: '0000-00-0000000', // 본인 계좌번호
  holder: '한채연',            // 본인 이름
}
```

---

## 6️⃣ 로컬 테스트

```bash
npm install
npm run dev
```
→ http://localhost:5173 에서 확인

### 테스트 체크리스트
- [ ] 홈 (`#home`) → 4개 섹션 카드 정상 표시
- [ ] TED 프로그램 (`#ted-program`) → 10단계, 스케줄, 가격, FAQ 정상
- [ ] 칼럼 (`#blog`) → 목록 보이고, 본문 클릭 시 미리보기 + 가입 유도
- [ ] 로그인 (`#login`) → 구글/카카오 버튼
- [ ] 구글 로그인 → 동의서 → 칼럼 본문 정상 노출
- [ ] 사전등록 (`#waitlist`) → 동의 체크박스 → Formspree 전송 확인
- [ ] 결제 (`#payment`) → 계좌 정보 + 입금 알림 폼
- [ ] RSS (`/rss.xml`) → 이건 production 빌드 후 `npm start`로 확인

### Production 빌드 + 서버 테스트 (RSS 확인용)
```bash
npm run build
npm start
```
→ http://localhost:3000/rss.xml 접속해서 RSS XML 확인

---

## 7️⃣ 배포

```bash
git add .
git commit -m "feat: Supabase 인증, 동의서, 결제, RSS 뉴스레터 추가"
git push
```
→ Railway 자동 배포

---

## ⚠️ 주의사항

### Kakao OAuth 이메일 수집
Kakao는 비즈 앱 등록 전까지 이메일을 받지 못할 수 있습니다. 이 경우:
- 옵션 A: Kakao 비즈 앱 등록 (사업자등록번호 필요)
- 옵션 B: 닉네임만 받고, 추가 정보 입력 페이지 만들기
- 옵션 C: 일단 Google만 활성화

### 사업자등록번호 확보 시 PortOne 전환
- 현재는 계좌이체 + Formspree 알림 방식
- 사업자등록 후 PortOne (Toss/카카오페이) 연동 코드를 추가하면 됨
- App.jsx `PaymentPage` 컴포넌트만 수정

### Stibee RSS 자동 발송 한계
- 실시간 발송 아님 (주기 발송)
- RSS에는 미리보기만 → 전체 본문은 사이트로 유도

---

## 파일 구조

```
sap-website-main/
├── App.jsx                  # 전체 페이지/라우팅
├── data.js                  # 칼럼/전자책 데이터
├── server.js                # Express + RSS 엔드포인트
├── package.json
├── .env                     # ⚠️ 직접 생성 (gitignore됨)
├── .env.example
├── supabase-schema.sql      # DB 스키마 (Supabase에서 1회 실행)
├── SETUP-GUIDE.md           # 이 문서
└── src/
    ├── supabaseClient.js    # Supabase 초기화
    └── useAuth.js           # 인증 커스텀 훅
```

---

## 도움이 필요하면

각 단계에서 막히면 해당 단계 번호와 에러 메시지를 알려주세요. 함께 해결합니다!
