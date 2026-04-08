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

const T = {
  navy:'#0D1117',navyL:'#161B22',navyC:'#1C2128',
  gold:'#D4A853',goldL:'#E8D5B7',goldM:'#C4A35A',
  cream:'#F5F0E8',txt:'#E6EDF3',txtS:'#8B949E',txtD:'#484F58',
  border:'rgba(212,168,83,0.12)',borderH:'rgba(212,168,83,0.3)'
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
    <path d="M100 28C104 42,118 58,126 78C134 98,138 118,134 136C130 154,120 168,100 176C80 168,70 154,66 136C62 118,66 98,74 78C82 58,96 42,100 28Z" fill="url(#fl)" opacity="0.9"/>
    <path d="M92 176C82 164,78 148,80 132C82 116,88 104,92 90C94 100,96 114,96 128C96 142,94 160,92 176Z" fill="url(#fi)"/>
    <path d="M108 176C118 164,122 148,120 132C118 116,112 104,108 90C106 100,104 114,104 128C104 142,106 160,108 176Z" fill="url(#fi)"/>
    <ellipse cx="100" cy="34" rx="3" ry="5" fill="#F5E8D0" opacity="0.35"/>
  </svg>
)

const In = (p) => <input {...p} style={{width:'100%',padding:'12px 14px',background:'rgba(212,168,83,0.04)',border:`1px solid ${T.border}`,borderRadius:8,color:T.cream,fontSize:14,outline:'none',fontFamily:'inherit',...(p.style||{})}}/>

const FooterLink = ({onClick, children}) => (
  <button onClick={onClick} style={{display:'block',background:'none',border:'none',padding:'5px 0',fontSize:11,color:T.txtS,textAlign:'left',cursor:'pointer',fontFamily:'inherit'}}
    onMouseEnter={e=>e.currentTarget.style.color=T.gold}
    onMouseLeave={e=>e.currentTarget.style.color=T.txtS}>
    {children}
  </button>
)

const PREVIEW_CHARS = 280

export default function App() {
  const auth = useAuth()
  const [page, setPage] = useState('home')
  const [postId, setPostId] = useState(null)
  const [formMsg, setFormMsg] = useState('')
  const [ebookPreview, setEbookPreview] = useState(null)

  useEffect(() => {
    const h = () => {
      const hash = window.location.hash.slice(1)
      if (hash.startsWith('col-')||hash.startsWith('ted-')) { setPage('blog'); setPostId(hash) }
      else if (hash==='blog') { setPage('blog'); setPostId(null) }
      else if (['register','waitlist','ebooks','admin','login','consent','payment','ted-program'].includes(hash)) {
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
    <div style={{background:T.navy,minHeight:'100vh',color:T.txtS,fontFamily:"'DM Sans','Noto Sans KR',sans-serif"}}>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,padding:'0 16px',height:52,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(13,17,23,0.88)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${T.border}`}}>
        <div style={{width:'100%',maxWidth:1080,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}} onClick={()=>nav('home')}>
            <Flame size={20}/><span style={{color:T.txt,fontSize:13,fontWeight:700}}>조용한 야망가들</span>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
            {[['home','홈'],['blog','칼럼'],['ebooks','전자책'],['ted-program','TED']].map(([p,l])=>(
              <button key={p} onClick={()=>nav(p)} style={{background:'none',border:'none',cursor:'pointer',color:page===p?T.gold:T.txtS,fontSize:11,fontWeight:500,padding:0}}>{l}</button>
            ))}
            {auth.isLoggedIn ? (
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:11,color:T.goldL,maxWidth:70,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{auth.profile?.display_name || auth.user?.email?.split('@')[0]}</span>
                <button onClick={auth.signOut} style={{background:'none',border:`1px solid ${T.border}`,color:T.txtS,padding:'3px 7px',borderRadius:5,fontSize:10,cursor:'pointer'}}>로그아웃</button>
              </div>
            ) : (
              <button onClick={()=>nav('login')} style={{background:'none',border:`1px solid ${T.border}`,color:T.gold,padding:'4px 9px',borderRadius:5,fontSize:10,fontWeight:600,cursor:'pointer'}}>로그인</button>
            )}
            <button onClick={()=>nav('waitlist')} style={{padding:'5px 11px',background:T.gold,color:T.navy,border:'none',borderRadius:5,fontSize:10,fontWeight:700,cursor:'pointer'}}>사전등록</button>
          </div>
        </div>
      </nav>

      {/* PAGES */}
      <main style={{maxWidth:1080,margin:'0 auto'}}>
        {page==='home' && <Home nav={nav}/>}
        {page==='blog' && (post ? <Post post={post} nav={nav} auth={auth}/> : <BlogList nav={nav}/>)}
        {page==='ebooks' && <Ebooks preview={ebookPreview} setPreview={setEbookPreview} nav={nav}/>}
        {page==='ted-program' && <TedProgram nav={nav}/>}
        {page==='login' && <Login auth={auth} nav={nav}/>}
        {page==='consent' && <ConsentPage auth={auth} nav={nav}/>}
        {page==='payment' && <PaymentPage auth={auth} nav={nav}/>}
        {page==='register' && <FormPg title="회원가입" desc="가입하시면 칼럼 전체와 프로그램 소식을 먼저 받으실 수 있습니다. 칼럼 본문 읽기는 소셜 로그인이 필요합니다." onSubmit={e=>submitForm(e,FORMSPREE_REGISTER)} msg={formMsg} btn="가입하기" fields={[{n:'name',p:'이름',r:true},{n:'email',p:'이메일',t:'email',r:true},{n:'phone',p:'휴대폰 번호 (선택)'}]} extraCta={<button onClick={()=>nav('login')} style={{marginTop:10,background:'none',border:'none',color:T.gold,fontSize:11,cursor:'pointer',textDecoration:'underline'}}>Google로 바로 시작하기 →</button>}/>}
        {page==='waitlist' && <FormPg title="1기 사전 등록" desc="사전 등록하시면 오픈 소식과 1기 특별가(₩100,000)를 먼저 받으실 수 있습니다." onSubmit={e=>submitForm(e,FORMSPREE_WAITLIST)} msg={formMsg} btn="사전 등록하기" note="무료 · 결제 아님" fields={[{n:'name',p:'이름',r:true},{n:'email',p:'이메일',t:'email',r:true},{n:'phone',p:'휴대폰 (알림용, 선택)'}]}/>}
        {page==='admin' && <Admin/>}
      </main>

      {/* FOOTER */}
      <footer style={{background:T.navyL,borderTop:`1px solid ${T.border}`,marginTop:40}}>
        <div style={{maxWidth:1080,margin:'0 auto',padding:'56px 24px 32px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:36}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <Flame size={22}/>
              <span style={{fontSize:13,fontWeight:700,color:T.txt}}>조용한 야망가들</span>
            </div>
            <p style={{fontSize:11,color:T.txtS,lineHeight:1.8}}>
              Silent Ambitious People.<br/>
              떠들지 않지만 실행하는 사람들을 위한 커뮤니티.
            </p>
          </div>

          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:14,letterSpacing:0.5}}>콘텐츠</p>
            <FooterLink onClick={()=>nav('blog')}>무료 칼럼</FooterLink>
            <FooterLink onClick={()=>nav('ebooks')}>전자책 · 자료집</FooterLink>
            <FooterLink onClick={()=>nav('ted-program')}>TED 스피킹 프로그램</FooterLink>
          </div>

          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:14,letterSpacing:0.5}}>커뮤니티</p>
            <FooterLink onClick={()=>nav('waitlist')}>1기 사전 등록</FooterLink>
            <FooterLink onClick={()=>nav('login')}>로그인 / 가입</FooterLink>
            <FooterLink onClick={()=>nav('consent')}>개인정보 처리방침</FooterLink>
          </div>

          <div>
            <p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:14,letterSpacing:0.5}}>연락 · SNS</p>
            <a href="https://youtube.com/@kglobaltechgirl" target="_blank" rel="noreferrer" style={{display:'block',fontSize:11,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>YouTube @kglobaltechgirl</a>
            <a href="https://instagram.com/kglobal.tech.girl" target="_blank" rel="noreferrer" style={{display:'block',fontSize:11,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>Instagram</a>
            <a href="https://threads.net/@getnerdywithgrace" target="_blank" rel="noreferrer" style={{display:'block',fontSize:11,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>Threads</a>
          </div>
        </div>

        <div style={{borderTop:`1px solid ${T.border}`,maxWidth:1080,margin:'0 auto',padding:'20px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <p style={{fontSize:10,color:T.txtD}}>© 2026 조용한 야망가들. All rights reserved.</p>
          <div style={{display:'flex',gap:14}}>
            <span onClick={()=>nav('consent')} style={{fontSize:10,color:T.txtD,cursor:'pointer'}}>개인정보처리방침</span>
            <span onClick={()=>nav('admin')} style={{fontSize:10,color:T.txtD,cursor:'pointer'}}>관리자</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── HOME (the-chapter 스타일) ───
function Home({nav}) {
  const SectionLabel = ({children}) => (
    <p style={{display:'inline-block',padding:'4px 12px',border:`1px solid ${T.borderH}`,borderRadius:100,fontSize:10,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:14,background:'rgba(212,168,83,0.06)'}}>{children}</p>
  )
  const SectionTitle = ({children}) => (
    <h2 style={{fontSize:'clamp(22px,3.5vw,32px)',fontWeight:900,color:T.txt,marginBottom:10,lineHeight:1.3,letterSpacing:-1}}>{children}</h2>
  )
  const SectionSub = ({children}) => (
    <p style={{fontSize:14,color:T.txtS,marginBottom:36,lineHeight:1.7}}>{children}</p>
  )

  const features = [
    {icon:'📝', label:'무료 칼럼', desc:'영어·커리어·시스템 16편', goto:'blog'},
    {icon:'🎙️', label:'TED 스피킹', desc:'4주 올인원 프로그램', goto:'ted-program'},
    {icon:'📚', label:'전자책 · 자료집', desc:'깊이 있는 이야기', goto:'ebooks'},
    {icon:'💬', label:'디스코드 커뮤니티', desc:'실행하는 사람들', goto:'waitlist'},
    {icon:'🔥', label:'실행 시스템', desc:'의지력이 아닌 구조', goto:'ted-program'},
    {icon:'🎯', label:'글로벌 커리어', desc:'비전공자 빅테크 로드맵', goto:'blog'},
  ]

  return (<div>

    {/* 1. HERO */}
    <section style={{position:'relative',padding:'120px 16px 100px',textAlign:'center',overflow:'hidden',borderBottom:`1px solid ${T.border}`}}>
      <div style={{position:'absolute',top:'35%',left:'50%',transform:'translate(-50%,-50%)',width:800,height:500,background:'radial-gradient(ellipse,rgba(212,168,83,0.12) 0%,rgba(212,168,83,0.04) 35%,transparent 70%)',filter:'blur(100px)',pointerEvents:'none'}}/>

      <div style={{position:'relative',display:'inline-flex',alignItems:'center',gap:8,padding:'7px 18px',border:`1px solid ${T.borderH}`,borderRadius:100,fontSize:11,color:T.gold,marginBottom:32,background:'rgba(212,168,83,0.06)',letterSpacing:1.5,fontWeight:600}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:T.gold}}/>
        SILENT AMBITIOUS PEOPLE
      </div>

      <h1 style={{position:'relative',fontSize:'clamp(32px,6.5vw,62px)',fontWeight:900,color:T.txt,lineHeight:1.15,marginBottom:28,letterSpacing:-2.5,maxWidth:900,margin:'0 auto 28px'}}>
        떠들지 않지만<br/>
        <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,background:`linear-gradient(135deg,${T.gold} 0%,${T.goldL} 50%,${T.cream} 100%)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>실행하는 사람들</span>의<br/>
        커뮤니티
      </h1>

      <p style={{position:'relative',fontSize:'clamp(14px,1.6vw,17px)',color:T.txtS,marginBottom:44,lineHeight:1.8,maxWidth:560,margin:'0 auto 44px'}}>
        동기부여보다 구조, 영감보다 루트맵.<br/>
        <strong style={{color:T.goldL,fontWeight:600}}>영어 · 커리어 · 실행 시스템</strong>을 함께 만들어 갑니다.
      </p>

      <div style={{position:'relative',display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
        <button onClick={()=>nav('ted-program')} style={{padding:'15px 32px',background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:14,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer',letterSpacing:-0.3,transition:'transform 0.2s'}}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
          TED 프로그램 보기 →
        </button>
        <button onClick={()=>nav('blog')} style={{padding:'15px 32px',background:'transparent',color:T.cream,fontSize:14,fontWeight:600,border:`1px solid ${T.borderH}`,borderRadius:8,cursor:'pointer',letterSpacing:-0.3}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(212,168,83,0.06)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
          무료 칼럼 읽기
        </button>
      </div>
    </section>

    {/* 2. FEATURED 1기 배너 */}
    <section style={{padding:'80px 16px 0'}}>
      <div style={{maxWidth:1000,margin:'0 auto',position:'relative',borderRadius:20,overflow:'hidden',background:`linear-gradient(135deg,${T.navyC} 0%,${T.navyL} 50%,rgba(212,168,83,0.12) 100%)`,border:`1px solid ${T.borderH}`,padding:'48px 44px',display:'grid',gridTemplateColumns:'1fr auto',gap:32,alignItems:'center'}}>
        <div style={{position:'absolute',top:'50%',right:'-10%',transform:'translateY(-50%)',width:400,height:400,background:'radial-gradient(circle,rgba(212,168,83,0.18) 0%,transparent 60%)',filter:'blur(60px)',pointerEvents:'none'}}/>
        <div style={{position:'relative',minWidth:0}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 12px',background:'rgba(212,168,83,0.15)',border:`1px solid ${T.borderH}`,borderRadius:100,fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.5,marginBottom:16}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:T.gold}}/>
            사전 모집 중
          </div>
          <h2 style={{fontSize:'clamp(22px,3vw,30px)',fontWeight:900,color:T.txt,marginBottom:12,lineHeight:1.3,letterSpacing:-1}}>
            올인뿌 1기 TED 스피킹 스터디
          </h2>
          <p style={{fontSize:13,color:T.txtS,marginBottom:20,lineHeight:1.7}}>
            2026 상반기 TED 기반 10단계 스피킹 메소드.<br/>
            AI 피드백 + 동료 피드백 + 디스코드 커뮤니티.
          </p>
          <div style={{display:'flex',gap:24,marginBottom:24,flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:9,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:2}}>기간</p>
              <p style={{fontSize:13,color:T.txt,fontWeight:600}}>4주 집중 프로그램</p>
            </div>
            <div>
              <p style={{fontSize:9,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:2}}>구성</p>
              <p style={{fontSize:13,color:T.txt,fontWeight:600}}>매일 과제 + 피어 피드백</p>
            </div>
            <div>
              <p style={{fontSize:9,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:2}}>정원</p>
              <p style={{fontSize:13,color:T.txt,fontWeight:600}}>선착순 20명</p>
            </div>
          </div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button onClick={()=>nav('waitlist')} style={{padding:'11px 22px',background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:12,fontWeight:700,border:'none',borderRadius:6,cursor:'pointer'}}>사전 신청하기 →</button>
            <button onClick={()=>nav('ted-program')} style={{padding:'11px 22px',background:'transparent',color:T.cream,fontSize:12,fontWeight:600,border:`1px solid ${T.borderH}`,borderRadius:6,cursor:'pointer'}}>자세히 보기</button>
          </div>
        </div>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:180,height:180,borderRadius:'50%',background:'rgba(212,168,83,0.08)',border:`1px solid ${T.borderH}`,flexShrink:0}}>
          <Flame size={88}/>
        </div>
      </div>
    </section>

    {/* 3. PROGRAMS */}
    <section style={{padding:'100px 16px 60px',textAlign:'center'}}>
      <SectionLabel>PROGRAMS</SectionLabel>
      <SectionTitle>당신의 다음 챕터를 시작하세요</SectionTitle>
      <SectionSub>대기업 스피킹부터 글로벌 커리어까지 · 체계적인 커리큘럼</SectionSub>

      <div style={{maxWidth:360,margin:'0 auto'}}>
        <div onClick={()=>nav('ted-program')} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:14,overflow:'hidden',cursor:'pointer',transition:'all 0.2s',textAlign:'left'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH;e.currentTarget.style.transform='translateY(-3px)'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform='translateY(0)'}}>
          <div style={{aspectRatio:'4/3',background:`linear-gradient(135deg,${T.navyC},${T.navy})`,borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            <div style={{position:'absolute',top:12,left:12,padding:'3px 10px',background:T.gold,color:T.navy,fontSize:9,fontWeight:700,borderRadius:4}}>STUDY</div>
            <div style={{textAlign:'center'}}>
              <Flame size={44}/>
              <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',color:T.gold,fontSize:22,marginTop:10}}>TED</p>
              <p style={{color:T.cream,fontSize:14,fontWeight:700}}>스피킹 4주</p>
            </div>
          </div>
          <div style={{padding:'22px 24px'}}>
            <h3 style={{fontSize:16,fontWeight:700,color:T.txt,marginBottom:6}}>TED 스피킹 4주 프로그램</h3>
            <p style={{fontSize:12,color:T.txtS,lineHeight:1.6,marginBottom:14}}>10단계 메소드 · AI 피드백 · 디스코드 커뮤니티</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
              <p style={{fontSize:20,fontWeight:900,color:T.gold}}>₩100,000<span style={{fontSize:11,color:T.txtS,fontWeight:400}}> / 4주</span></p>
              <span style={{fontSize:11,fontWeight:600,color:T.gold}}>자세히 →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 4. EBOOKS */}
    <section style={{padding:'60px 16px',textAlign:'center',borderTop:`1px solid ${T.border}`,marginTop:40}}>
      <SectionLabel>EBOOKS</SectionLabel>
      <SectionTitle>핵심 요약 전자책</SectionTitle>
      <SectionSub>조용한 야망가들의 깊이 있는 이야기</SectionSub>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:18,maxWidth:760,margin:'0 auto'}}>
        {EBOOKS.map(b=>(
          <div key={b.id} onClick={()=>nav('ebooks')} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:14,overflow:'hidden',cursor:'pointer',transition:'all 0.2s',textAlign:'left'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH;e.currentTarget.style.transform='translateY(-3px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{aspectRatio:'3/4',background:`linear-gradient(135deg,${T.navyC},${T.navy})`,borderBottom:`1px solid ${T.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,position:'relative'}}>
              <div style={{position:'absolute',top:12,right:12,padding:'3px 9px',background:'rgba(212,168,83,0.1)',border:`1px solid ${T.border}`,borderRadius:4,fontSize:9,color:T.txtD}}>준비중</div>
              <Flame size={48}/>
              <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',color:T.gold,fontSize:15,marginTop:16,textAlign:'center',lineHeight:1.4}}>{b.title}</p>
            </div>
            <div style={{padding:'20px 22px'}}>
              <h3 style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:5}}>{b.title}</h3>
              <p style={{fontSize:11,color:T.gold,marginBottom:10}}>{b.subtitle}</p>
              <p style={{fontSize:11,color:T.txtS,lineHeight:1.6}}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* 5. FEATURES */}
    <section style={{padding:'100px 16px 60px',textAlign:'center',borderTop:`1px solid ${T.border}`,marginTop:40}}>
      <SectionLabel>ALL IN ONE PLACE</SectionLabel>
      <SectionTitle>야망을 실행으로</SectionTitle>
      <SectionSub>조용한 야망가들이 성장에 필요한 모든 것</SectionSub>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,maxWidth:900,margin:'0 auto',textAlign:'left'}}>
        {features.map(f => (
          <div key={f.label} onClick={()=>nav(f.goto)} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:12,padding:'24px 22px',cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border}}>
            <div style={{fontSize:22,marginBottom:10}}>{f.icon}</div>
            <h3 style={{fontSize:14,fontWeight:700,color:T.txt,marginBottom:4}}>{f.label}</h3>
            <p style={{fontSize:11,color:T.txtS,lineHeight:1.6}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* 6. 무료 칼럼 CTA */}
    <section style={{padding:'40px 16px 80px'}}>
      <div style={{maxWidth:720,margin:'0 auto',background:`linear-gradient(135deg,${T.navyL},${T.navyC})`,border:`1px solid ${T.borderH}`,borderRadius:16,padding:'44px 36px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:500,height:200,background:'radial-gradient(ellipse,rgba(212,168,83,0.1) 0%,transparent 70%)',filter:'blur(60px)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{fontSize:32,marginBottom:14}}>🎁</div>
          <h2 style={{fontSize:'clamp(18px,2.5vw,24px)',fontWeight:800,color:T.txt,marginBottom:10,letterSpacing:-0.5}}>16편 무료 칼럼, 즉시 열람</h2>
          <p style={{fontSize:13,color:T.txtS,marginBottom:24,lineHeight:1.7}}>
            영어·커리어·실행 시스템에 대한 솔직한 이야기.<br/>
            Google 계정으로 1초 가입하고 바로 읽어보세요.
          </p>
          <button onClick={()=>nav('blog')} style={{padding:'13px 28px',background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:13,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>무료 칼럼 받아보기 →</button>
        </div>
      </div>
    </section>

    {/* 7. 최신 칼럼 */}
    <section style={{padding:'60px 16px 100px',borderTop:`1px solid ${T.border}`,maxWidth:1080,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:32,flexWrap:'wrap',gap:12}}>
        <div>
          <SectionLabel>LATEST COLUMNS</SectionLabel>
          <h2 style={{fontSize:22,fontWeight:800,color:T.txt,letterSpacing:-0.5}}>최신 칼럼</h2>
        </div>
        <button onClick={()=>nav('blog')} style={{background:'none',border:`1px solid ${T.borderH}`,color:T.gold,padding:'8px 16px',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer'}}>전체 보기 →</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
        {COLUMNS.slice(0,3).map(c=>(
          <div key={c.id} onClick={()=>nav('blog',c.id)} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:12,padding:'24px 22px',cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border}}>
            <span style={{fontSize:9,fontWeight:700,color:T.gold,letterSpacing:1.5}}>{c.tag.toUpperCase()} · {c.num}</span>
            <h3 style={{fontSize:15,fontWeight:700,color:T.txt,margin:'10px 0 8px',lineHeight:1.4}}>{c.title}</h3>
            <p style={{fontSize:12,color:T.txtS,lineHeight:1.6,marginBottom:14}}>{c.summary}</p>
            <p style={{fontSize:10,color:T.txtD}}>{c.date}</p>
          </div>
        ))}
      </div>
    </section>

  </div>)
}

// ─── TED PROGRAM ───
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

  const Section = ({label, title, children}) => (
    <section style={{padding:'60px 16px',borderTop:`1px solid ${T.border}`}}>
      <p style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:2,textAlign:'center',marginBottom:10}}>{label}</p>
      <h2 style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:900,color:T.txt,textAlign:'center',marginBottom:36,lineHeight:1.3,letterSpacing:-1}}>{title}</h2>
      {children}
    </section>
  )

  return (<div>
    <section style={{padding:'80px 16px 60px',textAlign:'center',position:'relative'}}>
      <div style={{position:'absolute',top:'25%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:400,background:'radial-gradient(ellipse,rgba(212,168,83,0.08) 0%,transparent 70%)',filter:'blur(80px)',pointerEvents:'none'}}/>
      <div style={{position:'relative',display:'inline-flex',alignItems:'center',gap:8,padding:'7px 16px',border:`1px solid ${T.borderH}`,borderRadius:100,fontSize:12,color:T.gold,marginBottom:30,background:'rgba(212,168,83,0.06)'}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:T.gold}}/>
        TED 기반 영어 스피킹 — 1기 모집
      </div>
      <h1 style={{position:'relative',fontSize:'clamp(28px,5.5vw,52px)',fontWeight:900,color:T.txt,lineHeight:1.2,marginBottom:24,letterSpacing:-2}}>
        토익은 되는데<br/><span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',background:`linear-gradient(135deg,${T.gold},${T.goldL})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>입이 안 열리는</span> 당신을 위한<br/>스피킹 시스템
      </h1>
      <p style={{position:'relative',fontSize:16,color:T.txtS,marginBottom:40,lineHeight:1.8,maxWidth:520,margin:'0 auto 40px'}}>
        <strong style={{color:T.goldL}}>TED Talk 기반 10단계 스피킹 메소드.</strong><br/>
        AI 피드백 + 동료 피드백 + 디스코드 커뮤니티.<br/>
        혼자 하면 3주, 같이 하면 3개월.
      </p>
      <button onClick={()=>nav('waitlist')} style={{position:'relative',padding:'15px 32px',background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:15,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>1기 사전 등록하기 →</button>
      <p style={{position:'relative',marginTop:14,fontSize:12,color:T.txtD}}>무료 사전 등록 · 선착순 20명 · 1기 특별가 ₩100,000</p>
      <div style={{position:'relative',display:'flex',gap:32,justifyContent:'center',marginTop:50,paddingTop:36,borderTop:`1px solid ${T.border}`,maxWidth:600,margin:'50px auto 0',flexWrap:'wrap'}}>
        {[['10년','영어 독학'],['8년','글로벌 빅테크'],['18K+','유튜브 구독자'],['10단계','검증된 메소드']].map(([v,l])=>(
          <div key={l} style={{textAlign:'center'}}>
            <div style={{fontSize:22,fontWeight:900,color:T.gold,fontFamily:"'Playfair Display',serif"}}>{v}</div>
            <div style={{fontSize:10,color:T.txtD,marginTop:4,letterSpacing:0.5}}>{l}</div>
          </div>
        ))}
      </div>
    </section>

    <Section label="WHY THIS MATTERS" title={<>혹시 이런 상황,<br/>계속 반복되고 있지 않나요?</>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14,maxWidth:800,margin:'0 auto'}}>
        {pains.map((p,i)=>(
          <div key={i} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:'22px 20px'}}>
            <span style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1}}>0{i+1}</span>
            <p style={{fontSize:13,color:T.txtS,lineHeight:1.7,marginTop:8}}>{p}</p>
          </div>
        ))}
      </div>
      <p style={{textAlign:'center',marginTop:36,fontSize:15,color:T.txt,lineHeight:1.7}}>
        의지력의 문제가 아닙니다.<br/><span style={{color:T.gold,fontWeight:700}}>시스템의 문제</span>였을 뿐.
      </p>
    </Section>

    <Section label="THE METHOD" title={<>TED Talk 기반<br/>10단계 스피킹 메소드</>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14,maxWidth:900,margin:'0 auto'}}>
        {steps.map((s,i)=>(
          <div key={i} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:'22px 20px'}}>
            <p style={{fontSize:10,fontWeight:600,color:T.gold,letterSpacing:1,marginBottom:8}}>{s.n}</p>
            <h3 style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:8}}>{s.t}</h3>
            <p style={{fontSize:12,color:T.txtS,lineHeight:1.7,marginBottom:12}}>{s.d}</p>
            <span style={{display:'inline-block',padding:'3px 9px',background:'rgba(212,168,83,0.08)',border:`1px solid ${T.border}`,borderRadius:10,fontSize:10,color:T.gold}}>{s.tag}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section label="WEEKLY SCHEDULE" title="1주일, 이렇게 돌아갑니다">
      <p style={{textAlign:'center',fontSize:13,color:T.txtS,marginTop:-20,marginBottom:32,lineHeight:1.7}}>
        매일 30분이면 충분합니다.<br/>직장인을 위해 설계된 프로그램이에요.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:8,maxWidth:900,margin:'0 auto'}}>
        {week.map(w=>(
          <div key={w.d} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:8,padding:'16px 10px',textAlign:'center'}}>
            <div style={{fontSize:9,fontWeight:700,color:T.gold,letterSpacing:1.5,marginBottom:8}}>{w.d}</div>
            <div style={{fontSize:22,marginBottom:8}}>{w.i}</div>
            <div style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:3}}>{w.t}</div>
            <div style={{fontSize:9,color:T.txtD,marginBottom:6}}>{w.s}</div>
            <div style={{fontSize:9,color:T.gold,paddingTop:6,borderTop:`1px solid ${T.border}`}}>{w.o}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section label="PRICING" title={<>영어 학원 한 달보다 싸고<br/>효과는 3배 오래갑니다</>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18,maxWidth:760,margin:'0 auto'}}>
        <div style={{background:T.navyL,border:`2px solid ${T.borderH}`,borderRadius:14,padding:'30px 24px',position:'relative'}}>
          <div style={{position:'absolute',top:-10,left:24,padding:'3px 10px',background:T.gold,color:T.navy,fontSize:10,fontWeight:700,borderRadius:4}}>1기 특별가</div>
          <p style={{fontSize:13,color:T.gold,marginBottom:8,marginTop:6}}>TED 스피킹 4주 프로그램</p>
          <p style={{fontSize:32,fontWeight:900,color:T.txt,marginBottom:4}}>₩100,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <p style={{fontSize:11,color:T.txtD,marginBottom:16}}>다음 기수부터 인상됩니다</p>
          <ul style={{listStyle:'none',padding:0,margin:0}}>
            {['매주 TED Talk 1편 커리큘럼','10단계 스피킹 메소드 가이드','AI 발음 피드백 시스템','디스코드 커뮤니티 접근','매일 과제 + 피어 피드백','4주 완주 포트폴리오'].map(f=>(
              <li key={f} style={{fontSize:12,color:T.txtS,padding:'7px 0',borderBottom:`1px solid ${T.border}`}}>✓ {f}</li>
            ))}
          </ul>
          <button onClick={()=>nav('waitlist')} style={{marginTop:20,width:'100%',padding:12,background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:13,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>1기 사전 등록하기</button>
        </div>
        <div style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:14,padding:'30px 24px',opacity:0.7}}>
          <p style={{fontSize:13,color:T.txtD,marginBottom:8}}>추후 오픈</p>
          <p style={{fontSize:13,color:T.gold,marginBottom:8}}>라이브 코칭 (2기~)</p>
          <p style={{fontSize:32,fontWeight:900,color:T.txt,marginBottom:4}}>₩300,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <p style={{fontSize:11,color:T.txtD,marginBottom:16}}>셀프 스터디 + 직접 코칭</p>
          <ul style={{listStyle:'none',padding:0,margin:0}}>
            {['셀프 스터디 전체 포함','주 1회 라이브 노트테이킹','Grace의 직접 피드백','소그룹 스피킹 세션','커리어 Q&A 시간','Alumni 네트워크'].map(f=>(
              <li key={f} style={{fontSize:12,color:T.txtS,padding:'7px 0',borderBottom:`1px solid ${T.border}`}}>✓ {f}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>

    <Section label="FAQ" title="자주 묻는 질문">
      <div style={{maxWidth:680,margin:'0 auto'}}>
        {faqs.map(([q,a],i)=>(
          <div key={i} style={{padding:'20px 0',borderBottom:`1px solid ${T.border}`}}>
            <p style={{fontSize:14,fontWeight:700,color:T.txt,marginBottom:8}}>Q. {q}</p>
            <p style={{fontSize:13,color:T.txtS,lineHeight:1.7}}>{a}</p>
          </div>
        ))}
      </div>
    </Section>

    <section style={{padding:'70px 16px',textAlign:'center',position:'relative'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:500,height:300,background:'radial-gradient(ellipse,rgba(212,168,83,0.1) 0%,transparent 70%)',filter:'blur(80px)',pointerEvents:'none'}}/>
      <p style={{position:'relative',fontSize:10,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:14}}>JOIN US</p>
      <h2 style={{position:'relative',fontSize:'clamp(22px,4vw,32px)',fontWeight:900,color:T.txt,marginBottom:18,lineHeight:1.3,letterSpacing:-1}}>
        조용한 야망가들의<br/>첫 번째 프로그램
      </h2>
      <p style={{position:'relative',fontSize:14,color:T.txtS,marginBottom:30,lineHeight:1.8}}>
        1기 사전 등록하시면 오픈 소식과<br/>1기 특별가(₩100,000)를 가장 먼저 받으실 수 있습니다.
      </p>
      <button onClick={()=>nav('waitlist')} style={{position:'relative',padding:'15px 36px',background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:15,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>1기 사전 등록하기 →</button>
    </section>
  </div>)
}

// ─── BLOG LIST ───
function BlogList({nav}) {
  const [filter,setFilter] = useState('all')
  const series = ['all',...new Set(COLUMNS.map(c=>c.series))]
  const list = filter==='all' ? COLUMNS : COLUMNS.filter(c=>c.series===filter)
  return (<div style={{padding:'70px 16px 40px'}}>
    <h2 style={{fontSize:24,fontWeight:700,color:T.txt,marginBottom:6}}>칼럼</h2>
    <p style={{fontSize:13,color:T.txtS,marginBottom:20}}>영어, 커리어, 시스템에 대한 솔직한 이야기. <span style={{color:T.gold}}>전체 본문은 가입 후 읽을 수 있습니다.</span></p>
    <div style={{display:'flex',gap:5,marginBottom:28,flexWrap:'wrap'}}>
      {series.map(s=>(<button key={s} onClick={()=>setFilter(s)} style={{padding:'4px 10px',background:filter===s?'rgba(212,168,83,0.12)':'transparent',border:`1px solid ${filter===s?T.borderH:T.border}`,borderRadius:16,color:filter===s?T.gold:T.txtS,fontSize:10,cursor:'pointer'}}>{s==='all'?'전체':s}</button>))}
    </div>
    {list.map(c=>(<div key={c.id} onClick={()=>nav('blog',c.id)} style={{padding:'16px 0',borderBottom:`1px solid ${T.border}`,cursor:'pointer',display:'flex',gap:14}}>
      <span style={{fontSize:10,color:T.txtD,flexShrink:0,marginTop:3,minWidth:65}}>{c.date}</span>
      <div><span style={{fontSize:9,fontWeight:600,color:T.gold,letterSpacing:1}}>{c.tag.toUpperCase()} · {c.num}</span>
        <h3 style={{fontSize:15,fontWeight:700,color:T.txt,margin:'3px 0 2px'}}>{c.title}</h3>
        <p style={{fontSize:12,color:T.txtS,lineHeight:1.5}}>{c.summary}</p>
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

  return (<article style={{padding:'70px 16px 40px',maxWidth:640,margin:'0 auto'}}>
    <button onClick={()=>nav('blog')} style={{background:'none',border:'none',color:T.gold,fontSize:11,cursor:'pointer',marginBottom:24}}>← 목록</button>
    <span style={{fontSize:9,fontWeight:600,color:T.gold,letterSpacing:1}}>{post.series} · COLUMN {post.num}</span>
    <h1 style={{fontSize:'clamp(20px,4vw,30px)',fontWeight:900,color:T.txt,margin:'8px 0 6px',lineHeight:1.3,letterSpacing:-1}}>{post.title}</h1>
    <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:32}}>
      <span style={{fontSize:11,color:T.txtD}}>{post.date}</span>
      <button onClick={copy} style={{background:'none',border:`1px solid ${T.border}`,color:T.txtS,padding:'2px 7px',borderRadius:4,fontSize:9,cursor:'pointer'}}>링크 복사</button>
    </div>

    {isLoggedIn ? (
      <div style={{fontSize:15,color:T.txtS,lineHeight:2.1,whiteSpace:'pre-wrap'}}>{post.content}</div>
    ) : (
      <>
        <div style={{position:'relative'}}>
          <div style={{fontSize:15,color:T.txtS,lineHeight:2.1,whiteSpace:'pre-wrap'}}>{previewContent}{hasMore && '…'}</div>
          {hasMore && <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:`linear-gradient(180deg,transparent,${T.navy})`,pointerEvents:'none'}}/>}
        </div>
        <div style={{marginTop:32,padding:32,background:'rgba(212,168,83,0.04)',border:`1px solid ${T.borderH}`,borderRadius:12,textAlign:'center'}}>
          <Flame size={32}/>
          <p style={{fontSize:15,fontWeight:700,color:T.txt,margin:'14px 0 6px'}}>전체 내용은 가입 후 읽을 수 있습니다</p>
          <p style={{fontSize:12,color:T.txtS,marginBottom:20,lineHeight:1.7}}>Google 계정으로 1초 만에 시작하세요.<br/>무료입니다.</p>
          <button onClick={()=>nav('login')} style={{padding:'10px 24px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:12,fontWeight:700,cursor:'pointer'}}>가입하고 전체 읽기 →</button>
        </div>
      </>
    )}

    <div style={{marginTop:48,padding:24,background:'rgba(212,168,83,0.03)',border:`1px solid ${T.border}`,borderRadius:10,textAlign:'center'}}>
      <Flame size={24}/><p style={{fontSize:13,fontWeight:600,color:T.txt,margin:'10px 0 6px'}}>조용한 야망가들</p>
      <p style={{fontSize:11,color:T.txtS,marginBottom:14}}>@kglobal.tech.girl</p>
      <button onClick={()=>nav('ted-program')} style={{padding:'8px 18px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer'}}>TED 스피킹 프로그램 →</button>
    </div>
  </article>)
}

// ─── EBOOKS ───
function Ebooks({preview,setPreview,nav}) {
  return (<div style={{padding:'70px 16px 40px'}}>
    <h2 style={{fontSize:24,fontWeight:700,color:T.txt,marginBottom:6}}>전자책</h2>
    <p style={{fontSize:13,color:T.txtS,marginBottom:28}}>조용한 야망가들의 이야기를 깊이 읽어보세요.</p>
    {EBOOKS.map(b=>(<div key={b.id} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:12,padding:'28px 24px',marginBottom:16}}>
      <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
        <div style={{width:100,height:140,background:`linear-gradient(135deg,${T.navyC},${T.navy})`,border:`1px solid ${T.borderH}`,borderRadius:6,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <Flame size={28}/><p style={{fontSize:8,color:T.gold,marginTop:6,textAlign:'center',padding:'0 6px',lineHeight:1.3}}>{b.title}</p>
        </div>
        <div style={{flex:1,minWidth:180}}>
          <h3 style={{fontSize:18,fontWeight:700,color:T.txt,marginBottom:3}}>{b.title}</h3>
          <p style={{fontSize:12,color:T.gold,marginBottom:10}}>{b.subtitle} · {b.chapters}챕터</p>
          <p style={{fontSize:13,color:T.txtS,lineHeight:1.6,marginBottom:14}}>{b.desc}</p>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>setPreview(preview===b.id?null:b.id)} style={{padding:'6px 14px',background:preview===b.id?T.gold:'transparent',color:preview===b.id?T.navy:T.gold,border:`1px solid ${T.gold}`,borderRadius:5,fontSize:11,fontWeight:600,cursor:'pointer'}}>{preview===b.id?'닫기':'미리보기'}</button>
            <span style={{padding:'6px 14px',background:'rgba(212,168,83,0.05)',border:`1px solid ${T.border}`,borderRadius:5,fontSize:11,color:T.txtD}}>출간 준비 중</span>
          </div>
        </div>
      </div>
      {preview===b.id && (<div style={{marginTop:20,padding:20,background:'rgba(212,168,83,0.03)',border:`1px solid ${T.border}`,borderRadius:8}}>
        <p style={{fontSize:10,fontWeight:600,color:T.gold,letterSpacing:1,marginBottom:10}}>PREVIEW</p>
        <div style={{fontSize:13,color:T.txtS,lineHeight:2,whiteSpace:'pre-wrap'}}>{b.preview}</div>
        <p style={{fontSize:11,color:T.txtD,marginTop:14,textAlign:'center',fontStyle:'italic'}}>— 전체 내용은 출간 후 공개됩니다 —</p>
      </div>)}
    </div>))}
  </div>)
}

// ─── LOGIN ───
function Login({auth, nav}) {
  if (auth.isLoggedIn && auth.profile?.privacy_consent) {
    return (<div style={{padding:'70px 16px 40px',maxWidth:400,margin:'0 auto',textAlign:'center'}}>
      <Flame size={40}/>
      <h2 style={{fontSize:20,fontWeight:700,color:T.txt,margin:'14px 0 6px'}}>이미 로그인되어 있습니다</h2>
      <p style={{fontSize:13,color:T.txtS,marginBottom:24}}>{auth.user?.email}</p>
      <button onClick={()=>nav('home')} style={{padding:'10px 24px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:12,fontWeight:700,cursor:'pointer'}}>홈으로</button>
    </div>)
  }

  return (<div style={{padding:'70px 16px 40px',maxWidth:400,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:28}}><Flame size={40}/></div>
    <h2 style={{fontSize:22,fontWeight:700,color:T.txt,textAlign:'center',marginBottom:8}}>로그인 / 회원가입</h2>
    <p style={{fontSize:13,color:T.txtS,textAlign:'center',marginBottom:32,lineHeight:1.7}}>
      Google 계정으로<br/>1초 만에 시작하세요.
    </p>

    {!auth.supabaseReady && (
      <div style={{padding:14,background:'rgba(220,80,80,0.08)',border:'1px solid rgba(220,80,80,0.3)',borderRadius:8,marginBottom:18}}>
        <p style={{fontSize:11,color:'#f88',lineHeight:1.6}}>
          ⚠ Supabase 환경변수가 설정되지 않았습니다.<br/>
          .env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.
        </p>
      </div>
    )}

    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <button onClick={auth.signInWithGoogle} disabled={!auth.supabaseReady} style={{padding:'14px',background:'#fff',color:'#222',fontSize:14,fontWeight:600,border:'none',borderRadius:8,cursor:auth.supabaseReady?'pointer':'not-allowed',opacity:auth.supabaseReady?1:0.5,display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6 5.1C40.7 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
        Google로 시작하기
      </button>
    </div>

    <p style={{fontSize:10,color:T.txtD,textAlign:'center',marginTop:24,lineHeight:1.7}}>
      가입 시 <a href="#consent" style={{color:T.gold}}>개인정보 수집·이용</a>에 동의하게 됩니다.
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
    return (<div style={{padding:'70px 16px',textAlign:'center'}}>
      <p style={{fontSize:13,color:T.txtS}}>먼저 로그인이 필요합니다.</p>
      <button onClick={()=>nav('login')} style={{marginTop:16,padding:'10px 24px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:12,fontWeight:700,cursor:'pointer'}}>로그인하러 가기</button>
    </div>)
  }

  if (auth.profile?.privacy_consent) {
    return (<div style={{padding:'70px 16px',textAlign:'center'}}>
      <Flame size={36}/>
      <p style={{fontSize:15,color:T.txt,margin:'14px 0 8px',fontWeight:700}}>이미 동의 완료되었습니다</p>
      <p style={{fontSize:12,color:T.txtS,marginBottom:20}}>{auth.profile.privacy_consent_at?.split('T')[0]}</p>
      <button onClick={()=>nav('home')} style={{padding:'10px 24px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:12,fontWeight:700,cursor:'pointer'}}>홈으로</button>
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

  return (<div style={{padding:'70px 16px 40px',maxWidth:640,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:28}}><Flame size={36}/></div>
    <h2 style={{fontSize:22,fontWeight:700,color:T.txt,textAlign:'center',marginBottom:8}}>개인정보 수집·이용 동의</h2>
    <p style={{fontSize:13,color:T.txtS,textAlign:'center',marginBottom:32,lineHeight:1.7}}>
      서비스 이용을 위해 아래 내용을 확인하고 동의해주세요.
    </p>

    <div style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:24,marginBottom:14}}>
      <p style={{fontSize:13,fontWeight:700,color:T.gold,marginBottom:14}}>[필수] 개인정보 수집·이용 동의</p>
      <table style={{width:'100%',fontSize:11,color:T.txtS,lineHeight:1.7,borderCollapse:'collapse'}}>
        <tbody>
          <tr><td style={{padding:'6px 0',color:T.txt,width:90,verticalAlign:'top'}}>수집 항목</td><td>이름, 이메일, 프로필 사진(소셜 로그인 제공)</td></tr>
          <tr><td style={{padding:'6px 0',color:T.txt,verticalAlign:'top'}}>수집 목적</td><td>계정 관리, 칼럼/프로그램 이용, 고객 지원</td></tr>
          <tr><td style={{padding:'6px 0',color:T.txt,verticalAlign:'top'}}>보유 기간</td><td>회원 탈퇴 시 또는 최종 이용일로부터 3년</td></tr>
          <tr><td style={{padding:'6px 0',color:T.txt,verticalAlign:'top'}}>제3자 제공</td><td>Supabase(데이터 저장·인증), Google(로그인), 결제대행사(결제 시)</td></tr>
        </tbody>
      </table>
      <p style={{fontSize:10,color:T.txtD,marginTop:14,lineHeight:1.6}}>
        ※ 동의를 거부할 권리가 있으며, 거부 시 서비스 이용이 제한될 수 있습니다.
      </p>
      <label style={{display:'flex',alignItems:'center',gap:10,marginTop:18,cursor:'pointer'}}>
        <input type="checkbox" checked={privacyChecked} onChange={e=>setPrivacyChecked(e.target.checked)} style={{width:18,height:18,accentColor:T.gold}}/>
        <span style={{fontSize:13,color:T.txt,fontWeight:600}}>위 내용에 동의합니다 (필수)</span>
      </label>
    </div>

    <div style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:24,marginBottom:20}}>
      <p style={{fontSize:13,fontWeight:700,color:T.txtS,marginBottom:10}}>[선택] 마케팅 정보 수신 동의</p>
      <p style={{fontSize:11,color:T.txtS,lineHeight:1.7,marginBottom:14}}>
        새 칼럼 알림, 프로그램 안내, 이벤트 등 홍보성 이메일을 받으시려면 동의해주세요.
        <br/>(거래성 안내 — 결제 확인, 계정 관련 — 는 동의 여부와 무관하게 발송됩니다.)
        <br/>언제든지 수신 거부하실 수 있습니다.
      </p>
      <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
        <input type="checkbox" checked={marketingChecked} onChange={e=>setMarketingChecked(e.target.checked)} style={{width:18,height:18,accentColor:T.gold}}/>
        <span style={{fontSize:13,color:T.txt}}>마케팅 정보 수신에 동의합니다 (선택)</span>
      </label>
    </div>

    {error && <p style={{fontSize:12,color:'#f88',textAlign:'center',marginBottom:12}}>{error}</p>}

    <button onClick={onSubmit} disabled={submitting} style={{width:'100%',padding:14,background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:14,fontWeight:700,border:'none',borderRadius:8,cursor:submitting?'wait':'pointer',opacity:submitting?0.6:1}}>
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
    return (<div style={{padding:'70px 16px',textAlign:'center'}}>
      <p style={{fontSize:13,color:T.txtS}}>결제는 로그인 후 이용 가능합니다.</p>
      <button onClick={()=>nav('login')} style={{marginTop:16,padding:'10px 24px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:12,fontWeight:700,cursor:'pointer'}}>로그인하러 가기</button>
    </div>)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const fd = new FormData(e.target)
    fd.append('user_email', auth.user.email)
    fd.append('user_id', auth.user.id)
    fd.append('product', 'TED 스피킹 4주 프로그램 1기')
    fd.append('amount', '100000')
    try {
      const res = await fetch(FORMSPREE_PAYMENT, { method:'POST', body:fd, headers:{'Accept':'application/json'} })
      if (res.ok) setDone(true)
      else setError('전송 실패. 다시 시도해주세요.')
    } catch { setError('네트워크 오류.') }
    setSubmitting(false)
  }

  if (done) {
    return (<div style={{padding:'70px 16px 40px',maxWidth:480,margin:'0 auto',textAlign:'center'}}>
      <Flame size={40}/>
      <h2 style={{fontSize:20,fontWeight:700,color:T.txt,margin:'16px 0 10px'}}>입금 알림이 접수되었습니다</h2>
      <p style={{fontSize:13,color:T.txtS,lineHeight:1.8}}>
        입금 확인 후 디스코드 초대 링크를<br/>이메일로 보내드립니다.<br/>
        보통 영업일 기준 1일 이내 처리됩니다.
      </p>
      <button onClick={()=>nav('home')} style={{marginTop:24,padding:'10px 24px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:12,fontWeight:700,cursor:'pointer'}}>홈으로</button>
    </div>)
  }

  return (<div style={{padding:'70px 16px 40px',maxWidth:520,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:28}}><Flame size={36}/></div>
    <h2 style={{fontSize:22,fontWeight:700,color:T.txt,textAlign:'center',marginBottom:8}}>결제하기</h2>
    <p style={{fontSize:13,color:T.txtS,textAlign:'center',marginBottom:28,lineHeight:1.7}}>
      TED 스피킹 4주 프로그램 1기
    </p>

    <div style={{background:T.navyL,border:`1px solid ${T.borderH}`,borderRadius:10,padding:24,marginBottom:18}}>
      <p style={{fontSize:11,color:T.gold,marginBottom:6}}>1기 특별가</p>
      <p style={{fontSize:18,fontWeight:700,color:T.txt,marginBottom:8}}>TED 스피킹 4주 프로그램</p>
      <p style={{fontSize:28,fontWeight:900,color:T.txt}}>₩100,000</p>
    </div>

    <div style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:24,marginBottom:18}}>
      <p style={{fontSize:13,fontWeight:700,color:T.gold,marginBottom:14}}>계좌이체 정보</p>
      <table style={{width:'100%',fontSize:13,color:T.txtS,lineHeight:1.9}}>
        <tbody>
          <tr><td style={{color:T.txtD,width:80}}>은행</td><td style={{color:T.txt,fontWeight:600}}>{BANK_INFO.bank}</td></tr>
          <tr><td style={{color:T.txtD}}>계좌번호</td><td style={{color:T.txt,fontWeight:600}}>{BANK_INFO.account}</td></tr>
          <tr><td style={{color:T.txtD}}>예금주</td><td style={{color:T.txt,fontWeight:600}}>{BANK_INFO.holder}</td></tr>
          <tr><td style={{color:T.txtD}}>금액</td><td style={{color:T.gold,fontWeight:700}}>₩100,000</td></tr>
        </tbody>
      </table>
      <p style={{fontSize:10,color:T.txtD,marginTop:14,lineHeight:1.6}}>
        ※ 입금 후 아래 폼을 작성해주세요. 영업일 1일 이내 디스코드 초대를 보내드립니다.
        <br/>※ 환불 불가 — 신중히 결정해주세요.
      </p>
    </div>

    <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:10}}>
      <In name="depositor_name" placeholder="입금자명 (통장에 찍힐 이름)" required/>
      <In name="phone" placeholder="휴대폰 번호 (선택)"/>
      {error && <p style={{fontSize:11,color:'#f88',textAlign:'center'}}>{error}</p>}
      <button type="submit" disabled={submitting} style={{padding:14,background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:14,fontWeight:700,border:'none',borderRadius:8,cursor:submitting?'wait':'pointer',marginTop:6,opacity:submitting?0.6:1}}>
        {submitting ? '전송 중...' : '입금 완료 알림 보내기'}
      </button>
    </form>
  </div>)
}

// ─── FORM ───
function FormPg({title,desc,onSubmit,msg,btn,note,fields,extraCta}) {
  return (<div style={{padding:'70px 16px 40px',maxWidth:420,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:28}}><Flame size={36}/></div>
    <h2 style={{fontSize:22,fontWeight:700,color:T.txt,textAlign:'center',marginBottom:6}}>{title}</h2>
    <p style={{fontSize:13,color:T.txtS,textAlign:'center',marginBottom:28,lineHeight:1.7}}>{desc}</p>
    {msg ? <div style={{padding:24,background:'rgba(212,168,83,0.06)',border:`1px solid ${T.border}`,borderRadius:10,textAlign:'center'}}><p style={{fontSize:16,fontWeight:700,color:T.goldL}}>{msg}</p></div> :
      <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:10}}>
        {fields.map(f=><In key={f.n} name={f.n} type={f.t||'text'} placeholder={f.p} required={f.r}/>)}
        <label style={{display:'flex',alignItems:'flex-start',gap:8,marginTop:6,cursor:'pointer',padding:'10px 12px',background:'rgba(212,168,83,0.04)',border:`1px solid ${T.border}`,borderRadius:8}}>
          <input type="checkbox" name="privacy_consent" required style={{marginTop:2,accentColor:T.gold}}/>
          <span style={{fontSize:11,color:T.txtS,lineHeight:1.6}}>
            <strong style={{color:T.txt}}>[필수]</strong> 개인정보 수집·이용 동의<br/>
            <span style={{color:T.txtD,fontSize:10}}>이름, 이메일, 휴대폰을 프로그램 안내 목적으로 수집·이용합니다. 보유 기간: 최종 이용 후 3년.</span>
          </span>
        </label>
        <label style={{display:'flex',alignItems:'flex-start',gap:8,cursor:'pointer',padding:'10px 12px',background:'rgba(212,168,83,0.02)',border:`1px solid ${T.border}`,borderRadius:8}}>
          <input type="checkbox" name="marketing_consent" style={{marginTop:2,accentColor:T.gold}}/>
          <span style={{fontSize:11,color:T.txtS,lineHeight:1.6}}>
            <strong style={{color:T.txt}}>[선택]</strong> 마케팅 정보 수신 동의<br/>
            <span style={{color:T.txtD,fontSize:10}}>새 칼럼·프로그램·이벤트 안내를 받으실 수 있습니다.</span>
          </span>
        </label>
        <button type="submit" style={{padding:12,background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:14,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer',marginTop:4}}>{btn}</button>
        {note && <p style={{fontSize:10,color:T.txtD,textAlign:'center'}}>{note}</p>}
        {extraCta}
      </form>
    }
  </div>)
}

// ─── ADMIN ───
function Admin() {
  return (<div style={{padding:'70px 16px 40px',maxWidth:500,margin:'0 auto',textAlign:'center'}}>
    <h2 style={{fontSize:20,fontWeight:700,color:T.txt,marginBottom:16}}>관리자 안내</h2>
    <div style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:24,textAlign:'left'}}>
      <p style={{fontSize:14,color:T.txtS,lineHeight:1.8,marginBottom:16}}>데이터 관리:</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>📋 <strong>대기자/회원:</strong> formspree.io 대시보드</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>👤 <strong>가입 회원 (소셜 로그인):</strong> Supabase Dashboard → Authentication → Users</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>📧 <strong>뉴스레터:</strong> Stibee → 자동 이메일 (RSS 연동)</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>💬 <strong>결제:</strong> Formspree 결제 알림 → 입금 확인 → 디스코드 초대</p>
      <p style={{fontSize:13,color:T.txt}}>📱 <strong>문자:</strong> aligo.in (건당 ~15원)</p>
      <div style={{marginTop:20,padding:16,background:'rgba(212,168,83,0.04)',borderRadius:8}}>
        <p style={{fontSize:12,color:T.gold,fontWeight:600,marginBottom:8}}>1기 운영 워크플로우</p>
        <p style={{fontSize:11,color:T.txtS,lineHeight:1.8}}>
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
