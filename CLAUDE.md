# sap-website — 작업 가이드

조용한 야망가들(SAP) 공개 웹사이트. TED 프로그램 랜딩 + 가격(베이직/프리미엄) + 뉴스레터 구독.
**이 저장소만 public입니다.** 커밋 전에 민감한 내용이 섞이지 않았는지 한 번 더 보세요.

## 스택

- Vite 5 + React 18 (TypeScript 아님 — `.jsx`)
- Supabase (인증 + 게이트 콘텐츠)
- Express (`server.js`) — 뉴스레터 구독을 Stibee로 프록시. 키를 브라우저에 노출하지 않기 위함.

```
npm run dev      # vite 개발 서버
npm run build    # 정적 빌드
npm start        # node server.js (Express + 빌드 결과 서빙)
```

## 구조

플랫한 구조입니다. 루트에 진입점이 있고 `src/`에는 인증 관련만 있습니다.

```
index.html          진입
main.jsx            React 마운트
App.jsx             페이지 전체 (랜딩·가격·CTA)
data.js             콘텐츠 데이터 (문구·가격·프로그램 정보)
server.js           Express — Stibee 구독 프록시
src/
  supabaseClient.js Supabase 클라이언트
  useAuth.js        인증 훅
  GatedArticle.jsx  구독자 전용 콘텐츠 게이트
```

문구·가격 수정 요청은 대부분 **`data.js`** 에서 끝납니다. `App.jsx`부터 뒤지지 마세요.

## 환경변수

`.env` 필요. Vite는 `VITE_` 접두어가 붙은 것만 클라이언트로 노출합니다.

| 변수 | 노출 | 용도 |
|---|---|---|
| `VITE_SUPABASE_URL` | 브라우저 | Supabase |
| `VITE_SUPABASE_ANON_KEY` | 브라우저 | Supabase (공개키라 노출 OK) |
| `STIBEE_API_KEY` | **서버 전용** | 절대 `VITE_` 붙이지 말 것 |
| `STIBEE_LIST_ID` | 서버 전용 | 주소록 468401 |

값은 OneDrive `dev-secrets\sap-website.env`에 보관 (`dev-setup`의 `sync-secrets.ps1 -Direction Pull`).

## ⚠️ 현재 막혀 있는 것 (2026-08 기준)

**Supabase 프로젝트 `sap-website`(ref `gwgsolvlvonakabjhdxs`)가 일시정지(INACTIVE) 상태입니다.**
그래서 `VITE_SUPABASE_ANON_KEY`가 비어 있고, 로그인·게이트 콘텐츠가 동작하지 않습니다.
Supabase 대시보드에서 Restore한 뒤 anon key를 `.env`에 채워야 합니다.

## 브랜치

`main` 외에 `claude/add-ted-landing-page-zyuNo`가 병합되지 않은 채 남아 있습니다.
필요 없으면 정리하세요.

## 관련 저장소

- `quiet-ambition` — 통합 사이트 (Next.js). 이쪽과 역할이 겹치므로 어느 쪽에 넣을지 먼저 확인.
- `qa-card-studio` — 카드뉴스 제작 도구 (독립 배포)

## 톤

사장-신입 톤, 한국어.
