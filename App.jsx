import { useState, useEffect } from 'react'
import { COLUMNS, EBOOKS } from './data'
import { useAuth } from './src/useAuth'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 설정
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FORMSPREE_WAITLIST = 'https://formspree.io/f/xgopnwdd'
const FORMSPREE_REGISTER = 'https://formspree.io/f/xkopqwya'
const FORMSPREE_PAYMENT  = 'https://formspree.io/f/xgopnwdd'

const BANK_INFO = {
  bank: '카카오뱅크',
  account: '0000-00-0000000',
  holder: '한채연',
}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 라이트 테마 컬러 (dub.co 스타일, SAP 골드 액센트)
const T = {
  // 배경
  bg: '#FFFFFF',
  bgSoft: '#FAFAFA',
  bgCard: '#FFFFFF',
  // 텍스트
  txt: '#0D1117',       // 본문 딥 네이비
  txtS: '#4B5563',      // 서브 그레이
  txtD: '#9CA3AF',      // 약한 회색
  // 브랜드
  navy: '#0D1117',
  gold: '#B8860B',      // 딥 골드 (라이트 배경 대비 강화)
  goldL: '#D4A853',
  goldSoft: '#FAF7F0',  // 크림 골드
  cream: '#FAF7F2',
  // 테두리 / 그림자
  border: 'rgba(13,17,23,0.08)',
  borderH: 'rgba(13,17,23,0.15)',
  shadow: '0 1px 3px rgba(13,17,23,0.04), 0 1px 2px rgba(13,17,23,0.03)',
  shadowHover: '0 10px 30px rgba(13,17,23,0.08), 0 4px 10px rgba(13,17,23,0.04)',
}

const Flame = ({size=32}) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <defs>
      <linearGradient id="fl" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stopColor="#8B6914"/><stop offset="25%" stopColor="#C49530"/>
        <stop offset="55%" stopColor="#D4A853"/><stop offset="80%" stopColor="#E8CFA0"/>
        <stop offset="100%" stopColor="#F5E8D0"/>
      </linearGradient>
      <linearGradient id="fi" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stopColor="#C49530" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#F5E8D0" stopOpacity="0.06"/>
      </linearGradient>
    </defs>
    <path d="M100 28C104 42,118 58,126 78C134 98,138 118,134 136C130 154,120 168,100 176C80 168,70 154,66 136C62 118,66 98,74 78C82 58,96 42,100 28Z" fill="url(#fl)" opacity="0.95"/>
    <path d="M92 176C82 164,78 148,80 132C82 116,88 104,92 90C94 100,96 114,96 128C96 142,94 160,92 176Z" fill="url(#fi)"/>
    <path d="M108 176C118 164,122 148,120 132C118 116,112 104,108 90C106 100,104 114,104 128C104 142,106 160,108 176Z" fill="url(#fi)"/>
    <ellipse cx="100" cy="34" rx="3" ry="5" fill="#F5E8D0" opacity="0.4"/>
  </svg>
)

const In = (p) => <input {...p} style={{width:'100%',padding:'12px 14px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,color:T.txt,fontSize:14,outline:'none',fontFamily:'inherit',...(p.style||{})}}/>

const FooterLink = ({onClick, children}) => (
  <button onClick={onClick} style={{display:'block',background:'none',border:'none',padding:'5px 0',fontSize:12,color:T.txtS,textAlign:'left',cursor:'pointer',fontFamily:'inherit',transition:'color 0.15s'}}
    onMouseEnter={e=>e.currentTarget.style.color=T.txt}
    onMouseLeave={e=>e.currentTarget.style.color=T.txtS}>
    {children}
  </button>
)

const PREVIEW_CHARS = 320

export default function App() {
  const auth = useAuth()
  const [page, setPage] = useState('home')
  const [postId, setPostId] = useState(null)
  const [formMsg, setFormMsg] = useState('')
  const [ebookPreview, setEbookPreview] = useState(null)

  useEffect(() => {
    const h = () => {
      const hash = window.location.hash.slice(1)
      if (hash.startsWith('col-')||hash.startsWith('ted-') && hash !== 'ted-program') { setPage('blog'); setPostId(hash) }
      else if (hash === 'ted-program') { setPage('ted-program'); setPostId(null) }
      else if (hash==='blog') { setPage('blog'); setPostId(null) }
      else if (['register','waitlist','ebooks','admin','login','consent','payment'].includes(hash)) {
        setPage(hash); setPostId(null)
      }
      else { setPage('home'); setPostId(null) }
      window.scrollTo(0, 0)
    }
    h()
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])

  useEffect(() => {
    if (auth.needsConsent && page !== 'consent') {
      window.location.hash = 'consent'
    }
  }, [auth.needsConsent, page])

  const nav = (p, id) => { window.location.hash = id || p; setFormMsg('') }

  const submitForm = async (e, endpoint) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name = fd.get('name')
    if (fd.get('privacy_consent') !== 'on') {
      setFormMsg('개인정보 수집·이용에 동의해주세요.')
      setTimeout(() => setFormMsg(''), 4000)
      return
    }
    try {
      const res = await fetch(endpoint, { method:'POST', body:fd, headers:{'Accept':'application/json'} })
      if (res.ok) { setFormMsg(`감사합니다, ${name}님!`); e.target.reset() }
      else setFormMsg('오류가 발생했습니다. 다시 시도해주세요.')
    } catch { setFormMsg('네트워크 오류. 다시 시도해주세요.') }
    setTimeout(() => setFormMsg(''), 6000)
  }

  const post = postId ? COLUMNS.find(c=>c.id===postId) : null

  return (
    <div style={{background:T.bg,minHeight:'100vh',color:T.txt,fontFamily:"'DM Sans','Noto Sans KR',-apple-system,sans-serif",WebkitFontSmoothing:'antialiased'}}>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderBottom:`1px solid ${T.border}`}}>
        <div style={{width:'100%',maxWidth:1200,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>nav('home')}>
            <Flame size={24}/>
            <span style={{color:T.txt,fontSize:15,fontWeight:800,letterSpacing:-0.3}}>조용한 야망가들</span>
          </div>
          <div style={{display:'flex',gap:28,alignItems:'center'}}>
            <div style={{display:'flex',gap:24,alignItems:'center'}} className="nav-links">
              {[['home','홈'],['blog','칼럼'],['ebooks','전자책'],['ted-program','TED 스터디']].map(([p,l])=>(
                <button key={p} onClick={()=>nav(p)} style={{background:'none',border:'none',cursor:'pointer',color:page===p?T.txt:T.txtS,fontSize:13,fontWeight:page===p?600:500,padding:0,transition:'color 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.color=T.txt}
                  onMouseLeave={e=>e.currentTarget.style.color=page===p?T.txt:T.txtS}>{l}</button>
              ))}
            </div>
            {auth.isLoggedIn ? (
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:12,color:T.txtS,maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{auth.profile?.display_name || auth.user?.email?.split('@')[0]}</span>
                <button onClick={auth.signOut} style={{background:T.bg,border:`1px solid ${T.border}`,color:T.txtS,padding:'6px 12px',borderRadius:6,fontSize:11,fontWeight:500,cursor:'pointer'}}>로그아웃</button>
              </div>
            ) : (
              <button onClick={()=>nav('login')} style={{background:'none',border:'none',color:T.txt,padding:0,fontSize:13,fontWeight:500,cursor:'pointer'}}>로그인</button>
            )}
            <button onClick={()=>nav('waitlist')} style={{padding:'9px 18px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',boxShadow:T.shadow}}>사전 등록</button>
          </div>
        </div>
      </nav>

      <main>
        {page==='home' && <Home nav={nav}/>}
        {page==='blog' && (post ? <Post post={post} nav={nav} auth={auth}/> : <BlogList nav={nav}/>)}
        {page==='ebooks' && <Ebooks preview={ebookPreview} setPreview={setEbookPreview} nav={nav}/>}
        {page==='ted-program' && <TedProgram nav={nav}/>}
        {page==='login' && <Login auth={auth} nav={nav}/>}
        {page==='consent' && <ConsentPage auth={auth} nav={nav}/>}
        {page==='payment' && <PaymentPage auth={auth} nav={nav}/>}
        {page==='register' && <FormPg title="회원가입" desc="가입하시면 칼럼 전체와 프로그램 소식을 먼저 받으실 수 있습니다. 칼럼 본문 읽기는 소셜 로그인이 필요합니다." onSubmit={e=>submitForm(e,FORMSPREE_REGISTER)} msg={formMsg} btn="가입하기" fields={[{n:'name',p:'이름',r:true},{n:'email',p:'이메일',t:'email',r:true},{n:'phone',p:'휴대폰 번호 (선택)'}]} extraCta={<button onClick={()=>nav('login')} style={{marginTop:10,background:'none',border:'none',color:T.gold,fontSize:12,cursor:'pointer',textDecoration:'underline'}}>Google로 바로 시작하기 →</button>}/>}
        {page==='waitlist' && <FormPg title="TED 스터디 사전 등록" desc="사전 등록하시면 오픈 소식과 1기 특별가(₩100,000)를 가장 먼저 받으실 수 있습니다." onSubmit={e=>submitForm(e,FORMSPREE_WAITLIST)} msg={formMsg} btn="사전 등록하기" note="무료 · 결제 아님" fields={[{n:'name',p:'이름',r:true},{n:'email',p:'이메일',t:'email',r:true},{n:'phone',p:'휴대폰 (알림용, 선택)'}]}/>}
        {page==='admin' && <Admin/>}
      </main>

      {/* FOOTER */}
      <footer style={{background:T.bgSoft,borderTop:`1px solid ${T.border}`,marginTop:80}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'64px 24px 32px',display:'grid',gridTemplateColumns:'1.3fr 1fr 1fr 1fr',gap:40}} className="footer-grid">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <Flame size={24}/>
              <span style={{fontSize:14,fontWeight:800,color:T.txt,letterSpacing:-0.3}}>조용한 야망가들</span>
            </div>
            <p style={{fontSize:12,color:T.txtS,lineHeight:1.8,maxWidth:280}}>
              Silent Ambitious People.<br/>
              떠들지 않지만 실행하는 사람들을 위한 커뮤니티. 영어, 커리어, 실행 시스템.
            </p>
          </div>

          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>콘텐츠</p>
            <FooterLink onClick={()=>nav('blog')}>무료 칼럼</FooterLink>
            <FooterLink onClick={()=>nav('ebooks')}>전자책 · 자료집</FooterLink>
            <FooterLink onClick={()=>nav('ted-program')}>TED 올인원 스터디</FooterLink>
          </div>

          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>커뮤니티</p>
            <FooterLink onClick={()=>nav('waitlist')}>1기 사전 등록</FooterLink>
            <FooterLink onClick={()=>nav('login')}>로그인 / 가입</FooterLink>
            <FooterLink onClick={()=>nav('consent')}>개인정보 처리방침</FooterLink>
          </div>

          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>연락 · SNS</p>
            <a href="https://youtube.com/@kglobaltechgirl" target="_blank" rel="noreferrer" style={{display:'block',fontSize:12,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>YouTube</a>
            <a href="https://instagram.com/kglobal.tech.girl" target="_blank" rel="noreferrer" style={{display:'block',fontSize:12,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>Instagram</a>
            <a href="https://threads.net/@getnerdywithgrace" target="_blank" rel="noreferrer" style={{display:'block',fontSize:12,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>Threads</a>
          </div>
        </div>

        <div style={{borderTop:`1px solid ${T.border}`,maxWidth:1200,margin:'0 auto',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <p style={{fontSize:11,color:T.txtD}}>© 2026 조용한 야망가들. All rights reserved.</p>
          <div style={{display:'flex',gap:18}}>
            <span onClick={()=>nav('consent')} style={{fontSize:11,color:T.txtD,cursor:'pointer'}}>개인정보처리방침</span>
            <span onClick={()=>nav('admin')} style={{fontSize:11,color:T.txtD,cursor:'pointer'}}>관리자</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ─── HOME (라이트 허브) ───
function Home({nav}) {
  const features = [
    {icon:'📝', label:'무료 칼럼', desc:'영어·커리어·시스템 16편', goto:'blog'},
    {icon:'🎙️', label:'TED 올인원 스터디', desc:'4주 집중 프로그램', goto:'ted-program'},
    {icon:'📚', label:'전자책 · 자료집', desc:'깊이 있는 이야기', goto:'ebooks'},
    {icon:'💬', label:'디스코드 커뮤니티', desc:'실행하는 사람들', goto:'waitlist'},
    {icon:'🔥', label:'실행 시스템', desc:'의지력이 아닌 구조', goto:'blog'},
    {icon:'🎯', label:'글로벌 커리어', desc:'비전공자 빅테크 로드맵', goto:'blog'},
  ]

  return (<div>

    {/* ━━ HERO ━━ */}
    <section style={{position:'relative',padding:'140px 24px 120px',textAlign:'center',overflow:'hidden'}}>
      {/* 파스텔 글로우 */}
      <div style={{position:'absolute',top:'20%',left:'50%',transform:'translate(-50%,-50%)',width:900,height:500,background:'radial-gradient(ellipse at center, rgba(184,134,11,0.08) 0%, rgba(184,134,11,0.03) 30%, transparent 60%)',pointerEvents:'none'}}/>

      <div style={{position:'relative',maxWidth:900,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:100,fontSize:11,color:T.txtS,marginBottom:28,letterSpacing:0.5,fontWeight:500}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:T.gold}}/>
          SILENT AMBITIOUS PEOPLE
        </div>

        <h1 style={{fontSize:'clamp(36px,6vw,68px)',fontWeight:800,color:T.txt,lineHeight:1.1,marginBottom:28,letterSpacing:-2.5}}>
          떠들지 않지만<br/>
          <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,color:T.gold}}>실행하는 사람들</span>의<br/>
          커뮤니티
        </h1>

        <p style={{fontSize:'clamp(15px,1.6vw,18px)',color:T.txtS,marginBottom:44,lineHeight:1.7,maxWidth:560,margin:'0 auto 44px',fontWeight:400}}>
          동기부여보다 구조, 영감보다 루트맵.<br/>
          <strong style={{color:T.txt,fontWeight:600}}>영어 · 커리어 · 실행 시스템</strong>을 함께 만들어 갑니다.
        </p>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>nav('ted-program')} style={{padding:'14px 28px',background:T.navy,color:'#fff',fontSize:14,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',letterSpacing:-0.2,boxShadow:T.shadow,transition:'transform 0.15s, box-shadow 0.15s'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow=T.shadowHover}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=T.shadow}}>
            TED 스터디 자세히 →
          </button>
          <button onClick={()=>nav('blog')} style={{padding:'14px 28px',background:T.bg,color:T.txt,fontSize:14,fontWeight:600,border:`1px solid ${T.borderH}`,borderRadius:10,cursor:'pointer',letterSpacing:-0.2,transition:'background 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.background=T.bgSoft}
            onMouseLeave={e=>e.currentTarget.style.background=T.bg}>
            무료 칼럼 읽기
          </button>
        </div>
      </div>
    </section>

    {/* ━━ FEATURED: TED 올인원 스터디 배너 ━━ */}
    <section style={{padding:'0 24px 100px'}}>
      <div style={{maxWidth:1100,margin:'0 auto',position:'relative',borderRadius:24,overflow:'hidden',background:`linear-gradient(135deg, ${T.navy} 0%, #1a2332 100%)`,padding:'56px 56px',display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:40,alignItems:'center',boxShadow:T.shadowHover}} className="featured-grid">
        {/* 글로우 */}
        <div style={{position:'absolute',top:'50%',right:'-15%',transform:'translateY(-50%)',width:500,height:500,background:'radial-gradient(circle,rgba(212,168,83,0.25) 0%,transparent 60%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-20%',left:'-10%',width:400,height:400,background:'radial-gradient(circle,rgba(168,85,247,0.15) 0%,transparent 60%)',pointerEvents:'none'}}/>

        <div style={{position:'relative',minWidth:0}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',background:'rgba(212,168,83,0.18)',border:'1px solid rgba(212,168,83,0.4)',borderRadius:100,fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1.2,marginBottom:18}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#E8CFA0'}}/>
            사전 모집 중 · 1기
          </div>
          <h2 style={{fontSize:'clamp(24px,3.2vw,34px)',fontWeight:800,color:'#fff',marginBottom:14,lineHeight:1.25,letterSpacing:-1}}>
            커리어 점프업을 위한<br/>
            <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,color:'#E8CFA0'}}>영어 TED 올인원 스터디</span>
          </h2>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.7)',marginBottom:24,lineHeight:1.7,maxWidth:480}}>
            TED Talk 기반 10단계 스피킹 메소드.<br/>
            AI 피드백 · 동료 피드백 · 디스코드 커뮤니티.<br/>
            4주 집중 프로그램으로 입이 열립니다.
          </p>
          <div style={{display:'flex',gap:24,marginBottom:28,flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1,marginBottom:3,textTransform:'uppercase'}}>기간</p>
              <p style={{fontSize:13,color:'#fff',fontWeight:600}}>4주 집중</p>
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1,marginBottom:3,textTransform:'uppercase'}}>구성</p>
              <p style={{fontSize:13,color:'#fff',fontWeight:600}}>매일 과제 + 피어 피드백</p>
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1,marginBottom:3,textTransform:'uppercase'}}>정원</p>
              <p style={{fontSize:13,color:'#fff',fontWeight:600}}>선착순 20명</p>
            </div>
          </div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button onClick={()=>nav('ted-program')} style={{padding:'12px 22px',background:'#fff',color:T.navy,fontSize:13,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>자세히 보기 →</button>
            <button onClick={()=>nav('waitlist')} style={{padding:'12px 22px',background:'transparent',color:'#fff',fontSize:13,fontWeight:600,border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,cursor:'pointer'}}>사전 신청</button>
          </div>
        </div>

        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle at 30% 30%, rgba(212,168,83,0.3), rgba(212,168,83,0.05))',border:'1px solid rgba(212,168,83,0.3)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            <Flame size={100}/>
          </div>
        </div>
      </div>
    </section>

    {/* ━━ FEATURES (카드 그리드) ━━ */}
    <section style={{padding:'60px 24px 100px'}}>
      <div style={{maxWidth:1100,margin:'0 auto',textAlign:'center',marginBottom:56}}>
        <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>ALL IN ONE PLACE</p>
        <h2 style={{fontSize:'clamp(26px,3.5vw,38px)',fontWeight:800,color:T.txt,marginBottom:12,lineHeight:1.2,letterSpacing:-1}}>
          야망을 실행으로
        </h2>
        <p style={{fontSize:15,color:T.txtS,lineHeight:1.7,maxWidth:520,margin:'0 auto'}}>
          조용한 야망가들의 성장에 필요한 모든 것을 한 곳에서.
        </p>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {features.map(f => (
          <div key={f.label} onClick={()=>nav(f.goto)} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'28px 26px',cursor:'pointer',transition:'all 0.2s',boxShadow:T.shadow}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowHover;e.currentTarget.style.transform='translateY(-3px)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{fontSize:26,marginBottom:14}}>{f.icon}</div>
            <h3 style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:6,letterSpacing:-0.3}}>{f.label}</h3>
            <p style={{fontSize:13,color:T.txtS,lineHeight:1.6}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ━━ EBOOKS ━━ */}
    <section style={{padding:'60px 24px 100px',background:T.bgSoft,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
      <div style={{maxWidth:1100,margin:'0 auto',textAlign:'center',marginBottom:48}}>
        <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>EBOOKS</p>
        <h2 style={{fontSize:'clamp(26px,3.5vw,38px)',fontWeight:800,color:T.txt,marginBottom:12,lineHeight:1.2,letterSpacing:-1}}>
          핵심 요약 전자책
        </h2>
        <p style={{fontSize:15,color:T.txtS,lineHeight:1.7}}>조용한 야망가들의 깊이 있는 이야기</p>
      </div>

      <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
        {EBOOKS.map(b=>(
          <div key={b.id} onClick={()=>nav('ebooks')} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,overflow:'hidden',cursor:'pointer',transition:'all 0.2s',boxShadow:T.shadow}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowHover;e.currentTarget.style.transform='translateY(-3px)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{aspectRatio:'3/4',background:`linear-gradient(135deg, ${T.cream}, #fff)`,borderBottom:`1px solid ${T.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative'}}>
              <div style={{position:'absolute',top:14,right:14,padding:'4px 10px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:100,fontSize:10,color:T.txtS,fontWeight:500}}>준비중</div>
              <Flame size={56}/>
              <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',color:T.gold,fontSize:17,marginTop:18,textAlign:'center',lineHeight:1.4,fontWeight:500}}>{b.title}</p>
            </div>
            <div style={{padding:'22px 24px'}}>
              <h3 style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:5,letterSpacing:-0.3}}>{b.title}</h3>
              <p style={{fontSize:11,color:T.gold,marginBottom:10,fontWeight:600}}>{b.subtitle}</p>
              <p style={{fontSize:12,color:T.txtS,lineHeight:1.6}}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ━━ 무료 칼럼 CTA ━━ */}
    <section style={{padding:'100px 24px'}}>
      <div style={{maxWidth:780,margin:'0 auto',background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:'56px 48px',textAlign:'center',boxShadow:T.shadow,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:`linear-gradient(90deg, ${T.gold}, ${T.goldL})`}}/>
        <div style={{fontSize:36,marginBottom:16}}>🎁</div>
        <h2 style={{fontSize:'clamp(22px,3vw,28px)',fontWeight:800,color:T.txt,marginBottom:12,letterSpacing:-0.5}}>16편 무료 칼럼, 즉시 열람</h2>
        <p style={{fontSize:14,color:T.txtS,marginBottom:28,lineHeight:1.7,maxWidth:480,margin:'0 auto 28px'}}>
          영어·커리어·실행 시스템에 대한 솔직한 이야기.<br/>
          Google 계정으로 1초 가입하고 바로 읽어보세요.
        </p>
        <button onClick={()=>nav('blog')} style={{padding:'13px 28px',background:T.navy,color:'#fff',fontSize:13,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',boxShadow:T.shadow}}>무료 칼럼 받아보기 →</button>
      </div>
    </section>

    {/* ━━ 최신 칼럼 ━━ */}
    <section style={{padding:'60px 24px 120px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:40,flexWrap:'wrap',gap:16}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:10,textTransform:'uppercase'}}>LATEST COLUMNS</p>
            <h2 style={{fontSize:28,fontWeight:800,color:T.txt,letterSpacing:-0.8}}>최신 칼럼</h2>
          </div>
          <button onClick={()=>nav('blog')} style={{background:T.bg,border:`1px solid ${T.borderH}`,color:T.txt,padding:'10px 20px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>전체 보기 →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>
          {COLUMNS.slice(0,3).map(c=>(
            <div key={c.id} onClick={()=>nav('blog',c.id)} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'28px 26px',cursor:'pointer',transition:'all 0.2s',boxShadow:T.shadow}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowHover;e.currentTarget.style.transform='translateY(-3px)'}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform='translateY(0)'}}>
              <span style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.5,textTransform:'uppercase'}}>{c.tag} · {c.num}</span>
              <h3 style={{fontSize:16,fontWeight:700,color:T.txt,margin:'12px 0 10px',lineHeight:1.4,letterSpacing:-0.3}}>{c.title}</h3>
              <p style={{fontSize:13,color:T.txtS,lineHeight:1.6,marginBottom:16}}>{c.summary}</p>
              <p style={{fontSize:11,color:T.txtD}}>{c.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <style>{`
      @media (max-width: 860px) {
        .featured-grid { grid-template-columns: 1fr !important; padding: 40px 28px !important; }
      }
    `}</style>
  </div>)
}

// ─── TED PROGRAM (상세 랜딩 — 읽기 전용) ───
function TedProgram({nav}) {
  const steps = [
    {n:'Step 01 — 02', t:'듣기 훈련', d:'자막 없이 전체 흐름을 파악하고, 노트테이킹하며 주제를 유추합니다. 색깔별 메모로 안 들리는 구간을 시각화.', tag:'인풋 단계'},
    {n:'Step 03 — 05', t:'분석 & 표현 학습', d:'안 들리는 원인 파악 (단어/연음/발음). 핵심 문장 3개를 골라 내 이야기로 바꿔보기. 오답노트 정리.', tag:'이해 단계'},
    {n:'Step 06 — 08', t:'쉐도잉 & 녹음', d:'천천히 따라 읽기 → 영상 속도에 맞춰 읽기 → 녹음 후 AI가 발음 피드백. 될 때까지 반복.', tag:'아웃풋 단계'},
    {n:'Step 09 — 10', t:'피어 피드백 & 회고', d:'디스코드에 녹음 공유. 동료들과 서로 피드백. 주간 회고로 배운 것을 정리하고 다음 주를 설계.', tag:'성장 단계'},
  ]
  const week = [
    {d:'MON',i:'🎧',t:'1차 리스닝',s:'전체 흐름 파악',o:'3줄 요약'},
    {d:'TUE',i:'📝',t:'노트테이킹',s:'색깔별 메모',o:'노트 공유'},
    {d:'WED',i:'🔍',t:'표현 분석',s:'핵심 문장 3개',o:'표현 5개'},
    {d:'THU',i:'🗣️',t:'쉐도잉 1차',s:'천천히 따라읽기',o:'30초 녹음'},
    {d:'FRI',i:'🎙️',t:'쉐도잉 2차',s:'실전 속도 연습',o:'AI 피드백'},
    {d:'SAT',i:'🤝',t:'피어 피드백',s:'서로 녹음 듣기',o:'코멘트'},
    {d:'SUN',i:'📋',t:'회고 & 복습',s:'다음 TED 선택',o:'자유'},
  ]
  const pains = [
    '토익 점수는 있는데 막상 회의에서 한마디도 못 하는 자신',
    '영어 공부 매번 작심삼일. 시작은 하는데 2~3주면 흐지부지',
    '외국계·해외 커리어에 관심은 있는데 구체적인 경로를 모르는',
    '자기계발 영상 100개를 봐도 월요일 아침은 똑같음',
  ]
  const faqs = [
    ['영어를 정말 못하는데 참여할 수 있나요?', '토익 500점 전후면 충분합니다. 중요한 건 점수가 아니라 \'말하겠다\'는 마음이에요.'],
    ['직장인인데 시간이 될까요?', '하루 30분이면 충분합니다. 출퇴근, 점심시간에도 가능해요.'],
    ['셀프 스터디인데 어떻게 피드백을 받나요?', '쉐도잉 녹음은 AI가 피드백, 매주 토요일 동료 피어 피드백 시간이 있습니다.'],
    ['어떤 TED 영상으로 공부하나요?', '커리어/자기계발/비즈니스 리더십 중심의 15분 이내 TED Talk을 큐레이션해 제공합니다.'],
    ['4주 후에는 어떻게 되나요?', '4주간의 녹음과 노트가 \'나만의 영어 포트폴리오\'가 되고, 디스코드는 계속 이용 가능합니다.'],
    ['환불은 가능한가요?', '결제 후 환불은 불가합니다. 1기 특별가로 제공되니 신중히 결정해주세요.'],
  ]

  const Section = ({label, title, children, sub, bg}) => (
    <section style={{padding:'80px 24px',background:bg||'transparent',borderTop:`1px solid ${T.border}`}}>
      <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center',marginBottom:48}}>
        <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>{label}</p>
        <h2 style={{fontSize:'clamp(24px,3.5vw,36px)',fontWeight:800,color:T.txt,lineHeight:1.25,letterSpacing:-1}}>{title}</h2>
        {sub && <p style={{fontSize:15,color:T.txtS,lineHeight:1.7,marginTop:16,maxWidth:520,margin:'16px auto 0'}}>{sub}</p>}
      </div>
      <div style={{maxWidth:1000,margin:'0 auto'}}>{children}</div>
    </section>
  )

  return (<div>
    {/* HERO */}
    <section style={{padding:'100px 24px 80px',textAlign:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'30%',left:'50%',transform:'translate(-50%,-50%)',width:800,height:500,background:'radial-gradient(ellipse,rgba(184,134,11,0.08) 0%,transparent 65%)',pointerEvents:'none'}}/>

      <div style={{position:'relative',maxWidth:840,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:100,fontSize:11,color:T.txtS,marginBottom:28,letterSpacing:0.5,fontWeight:500}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:T.gold}}/>
          커리어 점프업 · 1기 모집
        </div>
        <h1 style={{fontSize:'clamp(32px,5.5vw,56px)',fontWeight:800,color:T.txt,lineHeight:1.15,marginBottom:24,letterSpacing:-2}}>
          토익은 되는데<br/>
          <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,color:T.gold}}>입이 안 열리는</span> 당신을 위한<br/>
          영어 TED 올인원 스터디
        </h1>
        <p style={{fontSize:16,color:T.txtS,marginBottom:40,lineHeight:1.75,maxWidth:560,margin:'0 auto 40px'}}>
          TED Talk 기반 10단계 스피킹 메소드.<br/>
          AI 피드백 + 동료 피드백 + 디스코드 커뮤니티.<br/>
          <strong style={{color:T.txt,fontWeight:600}}>4주 집중</strong>으로 입이 열립니다.
        </p>
        <div style={{display:'flex',gap:40,justifyContent:'center',paddingTop:36,borderTop:`1px solid ${T.border}`,maxWidth:600,margin:'0 auto',flexWrap:'wrap'}}>
          {[['10년','영어 독학'],['8년','글로벌 빅테크'],['18K+','유튜브 구독자'],['10단계','검증된 메소드']].map(([v,l])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontSize:26,fontWeight:800,color:T.txt,fontFamily:"'Playfair Display',serif"}}>{v}</div>
              <div style={{fontSize:11,color:T.txtS,marginTop:4,letterSpacing:0.3}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* PAIN POINTS */}
    <Section label="WHY THIS MATTERS" title={<>혹시 이런 상황,<br/>계속 반복되고 있지 않나요?</>} bg={T.bgSoft}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {pains.map((p,i)=>(
          <div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'26px 24px',boxShadow:T.shadow}}>
            <span style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1}}>0{i+1}</span>
            <p style={{fontSize:14,color:T.txt,lineHeight:1.7,marginTop:10,fontWeight:500}}>{p}</p>
          </div>
        ))}
      </div>
      <p style={{textAlign:'center',marginTop:40,fontSize:16,color:T.txt,lineHeight:1.7}}>
        의지력의 문제가 아닙니다.<br/><span style={{color:T.gold,fontWeight:700}}>시스템의 문제</span>였을 뿐.
      </p>
    </Section>

    {/* METHOD */}
    <Section label="THE METHOD" title={<>TED Talk 기반<br/>10단계 스피킹 메소드</>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {steps.map((s,i)=>(
          <div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'28px 26px',boxShadow:T.shadow}}>
            <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>{s.n}</p>
            <h3 style={{fontSize:17,fontWeight:700,color:T.txt,marginBottom:10,letterSpacing:-0.3}}>{s.t}</h3>
            <p style={{fontSize:13,color:T.txtS,lineHeight:1.7,marginBottom:14}}>{s.d}</p>
            <span style={{display:'inline-block',padding:'4px 10px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:100,fontSize:10,color:T.txtS,fontWeight:600}}>{s.tag}</span>
          </div>
        ))}
      </div>
    </Section>

    {/* WEEKLY */}
    <Section label="WEEKLY SCHEDULE" title="1주일, 이렇게 돌아갑니다" sub="매일 30분이면 충분합니다. 직장인을 위해 설계된 프로그램이에요." bg={T.bgSoft}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:10}}>
        {week.map(w=>(
          <div key={w.d} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:'20px 12px',textAlign:'center',boxShadow:T.shadow}}>
            <div style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.5,marginBottom:10}}>{w.d}</div>
            <div style={{fontSize:26,marginBottom:10}}>{w.i}</div>
            <div style={{fontSize:12,fontWeight:700,color:T.txt,marginBottom:4}}>{w.t}</div>
            <div style={{fontSize:10,color:T.txtD,marginBottom:8}}>{w.s}</div>
            <div style={{fontSize:10,color:T.gold,paddingTop:8,borderTop:`1px solid ${T.border}`,fontWeight:600}}>{w.o}</div>
          </div>
        ))}
      </div>
    </Section>

    {/* PRICING */}
    <Section label="PRICING" title={<>영어 학원 한 달보다 싸고<br/>효과는 3배 오래갑니다</>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,maxWidth:780,margin:'0 auto'}}>
        <div style={{background:T.bgCard,border:`2px solid ${T.gold}`,borderRadius:16,padding:'32px 28px',position:'relative',boxShadow:T.shadowHover}}>
          <div style={{position:'absolute',top:-12,left:28,padding:'4px 12px',background:T.gold,color:'#fff',fontSize:10,fontWeight:700,borderRadius:6,letterSpacing:0.5}}>1기 특별가</div>
          <p style={{fontSize:13,color:T.gold,marginBottom:8,marginTop:8,fontWeight:600}}>TED 올인원 4주 스터디</p>
          <p style={{fontSize:36,fontWeight:800,color:T.txt,marginBottom:4,letterSpacing:-1}}>₩100,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <p style={{fontSize:11,color:T.txtD,marginBottom:20}}>다음 기수부터 인상됩니다</p>
          <ul style={{listStyle:'none',padding:0,margin:0}}>
            {['매주 TED Talk 1편 커리큘럼','10단계 스피킹 메소드 가이드','AI 발음 피드백 시스템','디스코드 커뮤니티 접근','매일 과제 + 피어 피드백','4주 완주 포트폴리오'].map(f=>(
              <li key={f} style={{fontSize:13,color:T.txtS,padding:'9px 0',borderBottom:`1px solid ${T.border}`}}>✓ {f}</li>
            ))}
          </ul>
        </div>
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 28px',opacity:0.65,boxShadow:T.shadow}}>
          <p style={{fontSize:11,color:T.txtD,marginBottom:8,fontWeight:600}}>추후 오픈</p>
          <p style={{fontSize:13,color:T.gold,marginBottom:8,fontWeight:600}}>라이브 코칭 (2기~)</p>
          <p style={{fontSize:36,fontWeight:800,color:T.txt,marginBottom:4,letterSpacing:-1}}>₩300,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <p style={{fontSize:11,color:T.txtD,marginBottom:20}}>셀프 스터디 + 직접 코칭</p>
          <ul style={{listStyle:'none',padding:0,margin:0}}>
            {['셀프 스터디 전체 포함','주 1회 라이브 노트테이킹','Grace의 직접 피드백','소그룹 스피킹 세션','커리어 Q&A 시간','Alumni 네트워크'].map(f=>(
              <li key={f} style={{fontSize:13,color:T.txtS,padding:'9px 0',borderBottom:`1px solid ${T.border}`}}>✓ {f}</li>
            ))}
          </ul>
        </div>
      </div>
      <p style={{textAlign:'center',fontSize:12,color:T.txtD,marginTop:28,lineHeight:1.8}}>
        ※ 결제 후 환불은 불가합니다. 신중히 결정해주세요.
      </p>
    </Section>

    {/* FAQ */}
    <Section label="FAQ" title="자주 묻는 질문" bg={T.bgSoft}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        {faqs.map(([q,a],i)=>(
          <div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:'24px 28px',marginBottom:12,boxShadow:T.shadow}}>
            <p style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:10,letterSpacing:-0.3}}>Q. {q}</p>
            <p style={{fontSize:13,color:T.txtS,lineHeight:1.7}}>{a}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* 단 하나의 CTA — 신청 폼으로 */}
    <section style={{padding:'100px 24px 120px',textAlign:'center'}}>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <h2 style={{fontSize:'clamp(24px,3.5vw,34px)',fontWeight:800,color:T.txt,marginBottom:16,letterSpacing:-1,lineHeight:1.3}}>
          준비되셨나요?
        </h2>
        <p style={{fontSize:15,color:T.txtS,marginBottom:36,lineHeight:1.75}}>
          1기 사전 등록하시면 오픈 소식과 1기 특별가를 가장 먼저 받으실 수 있습니다.<br/>
          사전 등록은 <strong style={{color:T.txt}}>무료</strong>이며, 결제는 오픈 시 별도로 진행됩니다.
        </p>
        <button onClick={()=>nav('waitlist')} style={{padding:'16px 36px',background:T.navy,color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',boxShadow:T.shadowHover}}>
          사전 신청하기 →
        </button>
        <p style={{fontSize:12,color:T.txtD,marginTop:16}}>무료 · 선착순 20명 · 1기 특별가 ₩100,000</p>
      </div>
    </section>
  </div>)
}

// ─── BLOG LIST ───
function BlogList({nav}) {
  const [filter,setFilter] = useState('all')
  const series = ['all',...new Set(COLUMNS.map(c=>c.series))]
  const list = filter==='all' ? COLUMNS : COLUMNS.filter(c=>c.series===filter)
  return (<div style={{padding:'80px 24px 60px',maxWidth:800,margin:'0 auto'}}>
    <h2 style={{fontSize:32,fontWeight:800,color:T.txt,marginBottom:10,letterSpacing:-1}}>칼럼</h2>
    <p style={{fontSize:14,color:T.txtS,marginBottom:28}}>영어, 커리어, 시스템에 대한 솔직한 이야기. <span style={{color:T.gold,fontWeight:600}}>전체 본문은 가입 후 읽을 수 있습니다.</span></p>
    <div style={{display:'flex',gap:6,marginBottom:32,flexWrap:'wrap'}}>
      {series.map(s=>(<button key={s} onClick={()=>setFilter(s)} style={{padding:'6px 14px',background:filter===s?T.navy:T.bg,border:`1px solid ${filter===s?T.navy:T.border}`,borderRadius:100,color:filter===s?'#fff':T.txtS,fontSize:11,fontWeight:500,cursor:'pointer'}}>{s==='all'?'전체':s}</button>))}
    </div>
    {list.map(c=>(<div key={c.id} onClick={()=>nav('blog',c.id)} style={{padding:'20px 0',borderBottom:`1px solid ${T.border}`,cursor:'pointer',display:'flex',gap:16}}>
      <span style={{fontSize:11,color:T.txtD,flexShrink:0,marginTop:4,minWidth:75}}>{c.date}</span>
      <div>
        <span style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1,textTransform:'uppercase'}}>{c.tag} · {c.num}</span>
        <h3 style={{fontSize:16,fontWeight:700,color:T.txt,margin:'6px 0 4px',letterSpacing:-0.3}}>{c.title}</h3>
        <p style={{fontSize:13,color:T.txtS,lineHeight:1.6}}>{c.summary}</p>
      </div>
    </div>))}
  </div>)
}

// ─── POST ───
function Post({post,nav,auth}) {
  const copy = () => { navigator.clipboard?.writeText(window.location.href) }
  const isLoggedIn = auth.isLoggedIn && auth.profile?.privacy_consent
  const previewContent = post.content.slice(0, PREVIEW_CHARS)
  const hasMore = post.content.length > PREVIEW_CHARS

  return (<article style={{padding:'80px 24px 60px',maxWidth:680,margin:'0 auto'}}>
    <button onClick={()=>nav('blog')} style={{background:'none',border:'none',color:T.gold,fontSize:12,cursor:'pointer',marginBottom:28,fontWeight:600}}>← 칼럼 목록</button>
    <span style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.2,textTransform:'uppercase'}}>{post.series} · COLUMN {post.num}</span>
    <h1 style={{fontSize:'clamp(24px,4vw,36px)',fontWeight:800,color:T.txt,margin:'12px 0 10px',lineHeight:1.25,letterSpacing:-1}}>{post.title}</h1>
    <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:40}}>
      <span style={{fontSize:12,color:T.txtD}}>{post.date}</span>
      <button onClick={copy} style={{background:T.bg,border:`1px solid ${T.border}`,color:T.txtS,padding:'4px 10px',borderRadius:6,fontSize:10,cursor:'pointer'}}>링크 복사</button>
    </div>

    {isLoggedIn ? (
      <div style={{fontSize:16,color:T.txt,lineHeight:2,whiteSpace:'pre-wrap'}}>{post.content}</div>
    ) : (
      <>
        <div style={{position:'relative'}}>
          <div style={{fontSize:16,color:T.txt,lineHeight:2,whiteSpace:'pre-wrap'}}>{previewContent}{hasMore && '…'}</div>
          {hasMore && <div style={{position:'absolute',bottom:0,left:0,right:0,height:140,background:`linear-gradient(180deg,transparent,${T.bg})`,pointerEvents:'none'}}/>}
        </div>
        <div style={{marginTop:40,padding:40,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:16,textAlign:'center'}}>
          <Flame size={36}/>
          <p style={{fontSize:17,fontWeight:700,color:T.txt,margin:'16px 0 8px',letterSpacing:-0.3}}>전체 내용은 가입 후 읽을 수 있습니다</p>
          <p style={{fontSize:13,color:T.txtS,marginBottom:24,lineHeight:1.7}}>Google 계정으로 1초 만에 시작하세요. 무료입니다.</p>
          <button onClick={()=>nav('login')} style={{padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',boxShadow:T.shadow}}>가입하고 전체 읽기 →</button>
        </div>
      </>
    )}

    <div style={{marginTop:56,padding:32,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:16,textAlign:'center'}}>
      <Flame size={28}/>
      <p style={{fontSize:15,fontWeight:700,color:T.txt,margin:'12px 0 6px'}}>조용한 야망가들</p>
      <p style={{fontSize:12,color:T.txtS,marginBottom:18}}>@kglobal.tech.girl</p>
      <button onClick={()=>nav('ted-program')} style={{padding:'10px 22px',background:T.bg,color:T.txt,border:`1px solid ${T.borderH}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>TED 스터디 보기 →</button>
    </div>
  </article>)
}

// ─── EBOOKS ───
function Ebooks({preview,setPreview,nav}) {
  return (<div style={{padding:'80px 24px 60px',maxWidth:900,margin:'0 auto'}}>
    <h2 style={{fontSize:32,fontWeight:800,color:T.txt,marginBottom:10,letterSpacing:-1}}>전자책</h2>
    <p style={{fontSize:14,color:T.txtS,marginBottom:32}}>조용한 야망가들의 이야기를 깊이 읽어보세요.</p>
    {EBOOKS.map(b=>(<div key={b.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px',marginBottom:20,boxShadow:T.shadow}}>
      <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
        <div style={{width:120,height:160,background:`linear-gradient(135deg, ${T.cream}, #fff)`,border:`1px solid ${T.border}`,borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0,padding:14}}>
          <Flame size={32}/>
          <p style={{fontSize:9,color:T.gold,marginTop:8,textAlign:'center',lineHeight:1.3,fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500}}>{b.title}</p>
        </div>
        <div style={{flex:1,minWidth:220}}>
          <h3 style={{fontSize:20,fontWeight:800,color:T.txt,marginBottom:5,letterSpacing:-0.5}}>{b.title}</h3>
          <p style={{fontSize:13,color:T.gold,marginBottom:12,fontWeight:600}}>{b.subtitle} · {b.chapters}챕터</p>
          <p style={{fontSize:14,color:T.txtS,lineHeight:1.7,marginBottom:18}}>{b.desc}</p>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setPreview(preview===b.id?null:b.id)} style={{padding:'8px 18px',background:preview===b.id?T.navy:T.bg,color:preview===b.id?'#fff':T.txt,border:`1px solid ${preview===b.id?T.navy:T.borderH}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>{preview===b.id?'닫기':'미리보기'}</button>
            <span style={{padding:'8px 18px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,color:T.txtS}}>출간 준비 중</span>
          </div>
        </div>
      </div>
      {preview===b.id && (<div style={{marginTop:24,padding:24,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}>
        <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1.2,marginBottom:12,textTransform:'uppercase'}}>PREVIEW</p>
        <div style={{fontSize:14,color:T.txt,lineHeight:2,whiteSpace:'pre-wrap'}}>{b.preview}</div>
        <p style={{fontSize:12,color:T.txtD,marginTop:16,textAlign:'center',fontStyle:'italic'}}>— 전체 내용은 출간 후 공개됩니다 —</p>
      </div>)}
    </div>))}
  </div>)
}

// ─── LOGIN ───
function Login({auth, nav}) {
  if (auth.isLoggedIn && auth.profile?.privacy_consent) {
    return (<div style={{padding:'100px 24px 60px',maxWidth:420,margin:'0 auto',textAlign:'center'}}>
      <Flame size={44}/>
      <h2 style={{fontSize:22,fontWeight:800,color:T.txt,margin:'18px 0 8px',letterSpacing:-0.5}}>이미 로그인되어 있습니다</h2>
      <p style={{fontSize:14,color:T.txtS,marginBottom:28}}>{auth.user?.email}</p>
      <button onClick={()=>nav('home')} style={{padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>홈으로</button>
    </div>)
  }

  return (<div style={{padding:'100px 24px 60px',maxWidth:420,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={44}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10,letterSpacing:-0.8}}>로그인 / 회원가입</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginBottom:36,lineHeight:1.7}}>
      Google 계정으로<br/>1초 만에 시작하세요.
    </p>

    {!auth.supabaseReady && (
      <div style={{padding:16,background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,marginBottom:20}}>
        <p style={{fontSize:12,color:'#991B1B',lineHeight:1.6}}>
          ⚠ Supabase 환경변수가 설정되지 않았습니다.<br/>
          .env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.
        </p>
      </div>
    )}

    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <button onClick={auth.signInWithGoogle} disabled={!auth.supabaseReady} style={{padding:'14px',background:T.bg,color:T.txt,fontSize:14,fontWeight:600,border:`1px solid ${T.borderH}`,borderRadius:10,cursor:auth.supabaseReady?'pointer':'not-allowed',opacity:auth.supabaseReady?1:0.5,display:'flex',alignItems:'center',justifyContent:'center',gap:12,boxShadow:T.shadow}}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6 5.1C40.7 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
        Google로 시작하기
      </button>
    </div>

    <p style={{fontSize:11,color:T.txtD,textAlign:'center',marginTop:28,lineHeight:1.7}}>
      가입 시 <a href="#consent" style={{color:T.gold,fontWeight:600}}>개인정보 수집·이용</a>에 동의하게 됩니다.
    </p>
  </div>)
}

// ─── CONSENT ───
function ConsentPage({auth, nav}) {
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [marketingChecked, setMarketingChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!auth.isLoggedIn) {
    return (<div style={{padding:'100px 24px',textAlign:'center'}}>
      <p style={{fontSize:14,color:T.txtS}}>먼저 로그인이 필요합니다.</p>
      <button onClick={()=>nav('login')} style={{marginTop:20,padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>로그인하러 가기</button>
    </div>)
  }

  if (auth.profile?.privacy_consent) {
    return (<div style={{padding:'100px 24px',textAlign:'center'}}>
      <Flame size={40}/>
      <p style={{fontSize:17,color:T.txt,margin:'16px 0 8px',fontWeight:700}}>이미 동의 완료되었습니다</p>
      <p style={{fontSize:13,color:T.txtS,marginBottom:24}}>{auth.profile.privacy_consent_at?.split('T')[0]}</p>
      <button onClick={()=>nav('home')} style={{padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>홈으로</button>
    </div>)
  }

  const onSubmit = async () => {
    if (!privacyChecked) { setError('필수 항목에 동의해주세요.'); return }
    setSubmitting(true)
    setError('')
    const { error } = await auth.saveConsent(true, marketingChecked)
    setSubmitting(false)
    if (error) { setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.'); return }
    nav('home')
  }

  return (<div style={{padding:'80px 24px 60px',maxWidth:680,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10,letterSpacing:-0.8}}>개인정보 수집·이용 동의</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginBottom:36,lineHeight:1.7}}>
      서비스 이용을 위해 아래 내용을 확인하고 동의해주세요.
    </p>

    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:16,boxShadow:T.shadow}}>
      <p style={{fontSize:14,fontWeight:700,color:T.gold,marginBottom:16}}>[필수] 개인정보 수집·이용 동의</p>
      <table style={{width:'100%',fontSize:12,color:T.txtS,lineHeight:1.7,borderCollapse:'collapse'}}>
        <tbody>
          <tr><td style={{padding:'6px 0',color:T.txt,width:100,verticalAlign:'top',fontWeight:600}}>수집 항목</td><td>이름, 이메일, 프로필 사진(소셜 로그인 제공)</td></tr>
          <tr><td style={{padding:'6px 0',color:T.txt,verticalAlign:'top',fontWeight:600}}>수집 목적</td><td>계정 관리, 칼럼/프로그램 이용, 고객 지원</td></tr>
          <tr><td style={{padding:'6px 0',color:T.txt,verticalAlign:'top',fontWeight:600}}>보유 기간</td><td>회원 탈퇴 시 또는 최종 이용일로부터 3년</td></tr>
          <tr><td style={{padding:'6px 0',color:T.txt,verticalAlign:'top',fontWeight:600}}>제3자 제공</td><td>Supabase(데이터 저장·인증), Google(로그인), 결제대행사(결제 시)</td></tr>
        </tbody>
      </table>
      <p style={{fontSize:11,color:T.txtD,marginTop:14,lineHeight:1.6}}>
        ※ 동의를 거부할 권리가 있으며, 거부 시 서비스 이용이 제한될 수 있습니다.
      </p>
      <label style={{display:'flex',alignItems:'center',gap:10,marginTop:20,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,borderRadius:8}}>
        <input type="checkbox" checked={privacyChecked} onChange={e=>setPrivacyChecked(e.target.checked)} style={{width:18,height:18,accentColor:T.gold}}/>
        <span style={{fontSize:13,color:T.txt,fontWeight:600}}>위 내용에 동의합니다 (필수)</span>
      </label>
    </div>

    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:24,boxShadow:T.shadow}}>
      <p style={{fontSize:14,fontWeight:700,color:T.txtS,marginBottom:12}}>[선택] 마케팅 정보 수신 동의</p>
      <p style={{fontSize:12,color:T.txtS,lineHeight:1.7,marginBottom:14}}>
        새 칼럼 알림, 프로그램 안내, 이벤트 등 홍보성 이메일을 받으시려면 동의해주세요.
        <br/>(거래성 안내 — 결제 확인, 계정 관련 — 는 동의 여부와 무관하게 발송됩니다.)
        <br/>언제든지 수신 거부하실 수 있습니다.
      </p>
      <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,borderRadius:8}}>
        <input type="checkbox" checked={marketingChecked} onChange={e=>setMarketingChecked(e.target.checked)} style={{width:18,height:18,accentColor:T.gold}}/>
        <span style={{fontSize:13,color:T.txt}}>마케팅 정보 수신에 동의합니다 (선택)</span>
      </label>
    </div>

    {error && <p style={{fontSize:12,color:'#DC2626',textAlign:'center',marginBottom:12}}>{error}</p>}

    <button onClick={onSubmit} disabled={submitting} style={{width:'100%',padding:15,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:submitting?'wait':'pointer',opacity:submitting?0.6:1,boxShadow:T.shadow}}>
      {submitting ? '저장 중...' : '동의하고 시작하기'}
    </button>
  </div>)
}

// ─── PAYMENT ───
function PaymentPage({auth, nav}) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!auth.isLoggedIn || !auth.profile?.privacy_consent) {
    return (<div style={{padding:'100px 24px',textAlign:'center'}}>
      <p style={{fontSize:14,color:T.txtS}}>결제는 로그인 후 이용 가능합니다.</p>
      <button onClick={()=>nav('login')} style={{marginTop:20,padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>로그인하러 가기</button>
    </div>)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const fd = new FormData(e.target)
    fd.append('user_email', auth.user.email)
    fd.append('user_id', auth.user.id)
    fd.append('product', 'TED 올인원 4주 스터디 1기')
    fd.append('amount', '100000')
    try {
      const res = await fetch(FORMSPREE_PAYMENT, { method:'POST', body:fd, headers:{'Accept':'application/json'} })
      if (res.ok) setDone(true)
      else setError('전송 실패. 다시 시도해주세요.')
    } catch { setError('네트워크 오류.') }
    setSubmitting(false)
  }

  if (done) {
    return (<div style={{padding:'100px 24px 60px',maxWidth:520,margin:'0 auto',textAlign:'center'}}>
      <Flame size={44}/>
      <h2 style={{fontSize:24,fontWeight:800,color:T.txt,margin:'18px 0 12px',letterSpacing:-0.5}}>입금 알림이 접수되었습니다</h2>
      <p style={{fontSize:14,color:T.txtS,lineHeight:1.8}}>
        입금 확인 후 디스코드 초대 링크를<br/>이메일로 보내드립니다.<br/>
        보통 영업일 기준 1일 이내 처리됩니다.
      </p>
      <button onClick={()=>nav('home')} style={{marginTop:28,padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>홈으로</button>
    </div>)
  }

  return (<div style={{padding:'80px 24px 60px',maxWidth:560,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10,letterSpacing:-0.8}}>결제하기</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginBottom:32,lineHeight:1.7}}>
      TED 올인원 4주 스터디 1기
    </p>

    <div style={{background:T.bgCard,border:`2px solid ${T.gold}`,borderRadius:14,padding:28,marginBottom:20,boxShadow:T.shadow}}>
      <p style={{fontSize:12,color:T.gold,marginBottom:6,fontWeight:600}}>1기 특별가</p>
      <p style={{fontSize:19,fontWeight:700,color:T.txt,marginBottom:10}}>TED 올인원 4주 스터디</p>
      <p style={{fontSize:32,fontWeight:800,color:T.txt,letterSpacing:-1}}>₩100,000</p>
    </div>

    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:20,boxShadow:T.shadow}}>
      <p style={{fontSize:14,fontWeight:700,color:T.gold,marginBottom:16}}>계좌이체 정보</p>
      <table style={{width:'100%',fontSize:14,color:T.txt,lineHeight:2}}>
        <tbody>
          <tr><td style={{color:T.txtS,width:80}}>은행</td><td style={{color:T.txt,fontWeight:600}}>{BANK_INFO.bank}</td></tr>
          <tr><td style={{color:T.txtS}}>계좌번호</td><td style={{color:T.txt,fontWeight:600}}>{BANK_INFO.account}</td></tr>
          <tr><td style={{color:T.txtS}}>예금주</td><td style={{color:T.txt,fontWeight:600}}>{BANK_INFO.holder}</td></tr>
          <tr><td style={{color:T.txtS}}>금액</td><td style={{color:T.gold,fontWeight:700}}>₩100,000</td></tr>
        </tbody>
      </table>
      <p style={{fontSize:11,color:T.txtD,marginTop:16,lineHeight:1.6}}>
        ※ 입금 후 아래 폼을 작성해주세요. 영업일 1일 이내 디스코드 초대를 보내드립니다.
        <br/>※ 환불 불가 — 신중히 결정해주세요.
      </p>
    </div>

    <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
      <In name="depositor_name" placeholder="입금자명 (통장에 찍힐 이름)" required/>
      <In name="phone" placeholder="휴대폰 번호 (선택)"/>
      {error && <p style={{fontSize:12,color:'#DC2626',textAlign:'center'}}>{error}</p>}
      <button type="submit" disabled={submitting} style={{padding:15,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:submitting?'wait':'pointer',marginTop:6,opacity:submitting?0.6:1,boxShadow:T.shadow}}>
        {submitting ? '전송 중...' : '입금 완료 알림 보내기'}
      </button>
    </form>
  </div>)
}

// ─── FORM ───
function FormPg({title,desc,onSubmit,msg,btn,note,fields,extraCta}) {
  return (<div style={{padding:'80px 24px 60px',maxWidth:460,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10,letterSpacing:-0.8}}>{title}</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginBottom:32,lineHeight:1.7}}>{desc}</p>
    {msg ? <div style={{padding:28,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:14,textAlign:'center'}}><p style={{fontSize:17,fontWeight:700,color:T.gold}}>{msg}</p></div> :
      <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
        {fields.map(f=><In key={f.n} name={f.n} type={f.t||'text'} placeholder={f.p} required={f.r}/>)}
        <label style={{display:'flex',alignItems:'flex-start',gap:10,marginTop:8,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}>
          <input type="checkbox" name="privacy_consent" required style={{marginTop:2,accentColor:T.gold}}/>
          <span style={{fontSize:12,color:T.txtS,lineHeight:1.6}}>
            <strong style={{color:T.txt}}>[필수]</strong> 개인정보 수집·이용 동의<br/>
            <span style={{color:T.txtD,fontSize:11}}>이름, 이메일, 휴대폰을 프로그램 안내 목적으로 수집·이용합니다. 보유 기간: 최종 이용 후 3년.</span>
          </span>
        </label>
        <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}>
          <input type="checkbox" name="marketing_consent" style={{marginTop:2,accentColor:T.gold}}/>
          <span style={{fontSize:12,color:T.txtS,lineHeight:1.6}}>
            <strong style={{color:T.txt}}>[선택]</strong> 마케팅 정보 수신 동의<br/>
            <span style={{color:T.txtD,fontSize:11}}>새 칼럼·프로그램·이벤트 안내를 받으실 수 있습니다.</span>
          </span>
        </label>
        <button type="submit" style={{padding:14,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',marginTop:4,boxShadow:T.shadow}}>{btn}</button>
        {note && <p style={{fontSize:11,color:T.txtD,textAlign:'center'}}>{note}</p>}
        {extraCta}
      </form>
    }
  </div>)
}

// ─── ADMIN ───
function Admin() {
  return (<div style={{padding:'80px 24px 60px',maxWidth:560,margin:'0 auto'}}>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,marginBottom:20,letterSpacing:-0.8,textAlign:'center'}}>관리자 안내</h2>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:32,boxShadow:T.shadow}}>
      <p style={{fontSize:14,color:T.txtS,lineHeight:1.8,marginBottom:18}}>데이터 관리:</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>📋 <strong>대기자/회원:</strong> formspree.io 대시보드</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>👤 <strong>가입 회원 (소셜 로그인):</strong> Supabase Dashboard → Authentication → Users</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>📧 <strong>뉴스레터:</strong> Stibee → 자동 이메일 (RSS 연동)</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>💬 <strong>결제:</strong> Formspree 결제 알림 → 입금 확인 → 디스코드 초대</p>
      <p style={{fontSize:13,color:T.txt}}>📱 <strong>문자:</strong> aligo.in (건당 ~15원)</p>
      <div style={{marginTop:24,padding:20,background:T.bgSoft,borderRadius:10}}>
        <p style={{fontSize:12,color:T.gold,fontWeight:700,marginBottom:10}}>1기 운영 워크플로우</p>
        <p style={{fontSize:12,color:T.txtS,lineHeight:1.8}}>
          1. 사전등록 → Formspree 대기자 명단<br/>
          2. 회원가입 → Supabase profiles<br/>
          3. 칼럼 발행 → data.js 수정 → git push → Stibee 자동 발송<br/>
          4. 결제 (계좌이체) → Formspree 알림 → 입금 확인 → 디스코드 초대<br/>
          5. 향후 사업자등록 시 PortOne 결제 연동
        </p>
      </div>
    </div>
  </div>)
}
