import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { COLUMNS, EBOOKS, TESTIMONIALS_TED1, REVIEW_SHOTS } from './data'
import { useAuth } from './src/useAuth'
import GatedArticle from './src/GatedArticle'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2기 신청·결제는 래피드(Latpeed)에서 진행. URL은 만든 뒤 교체.
const LATPEED_URL = 'https://www.latpeed.com/products/K8g15'
const goToLatpeed = () => window.open(LATPEED_URL, '_blank', 'noopener,noreferrer')
// 2기 오픈 전까지 false → TED 프로그램/신청은 '곧 공개 + 알림 신청'만 노출
const PROGRAM_LIVE = true
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const T = {
  bg:'#FFFFFF', bgSoft:'#FAFAFA', bgWarm:'#FFF9EE', bgCard:'#FFFFFF',
  txt:'#0D1117', txtS:'#4B5563', txtD:'#9CA3AF',
  navy:'#0D1117', gold:'#B8860B', goldL:'#D4A853', goldSoft:'#FAF7F0', cream:'#FAF7F2',
  border:'rgba(13,17,23,0.08)', borderH:'rgba(13,17,23,0.15)',
  shadow:'0 1px 3px rgba(13,17,23,0.04),0 1px 2px rgba(13,17,23,0.03)',
  shadowH:'0 10px 30px rgba(13,17,23,0.08),0 4px 10px rgba(13,17,23,0.04)',
}

const Flame=({size=32})=>(<svg viewBox="0 0 200 200" width={size} height={size}><defs><linearGradient id="fl" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stopColor="#8B6914"/><stop offset="25%" stopColor="#C49530"/><stop offset="55%" stopColor="#D4A853"/><stop offset="80%" stopColor="#E8CFA0"/><stop offset="100%" stopColor="#F5E8D0"/></linearGradient><linearGradient id="fi" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stopColor="#C49530" stopOpacity="0.6"/><stop offset="100%" stopColor="#F5E8D0" stopOpacity="0.06"/></linearGradient></defs><path d="M100 28C104 42,118 58,126 78C134 98,138 118,134 136C130 154,120 168,100 176C80 168,70 154,66 136C62 118,66 98,74 78C82 58,96 42,100 28Z" fill="url(#fl)" opacity="0.95"/><path d="M92 176C82 164,78 148,80 132C82 116,88 104,92 90C94 100,96 114,96 128C96 142,94 160,92 176Z" fill="url(#fi)"/><path d="M108 176C118 164,122 148,120 132C118 116,112 104,108 90C106 100,104 114,104 128C104 142,106 160,108 176Z" fill="url(#fi)"/><ellipse cx="100" cy="34" rx="3" ry="5" fill="#F5E8D0" opacity="0.4"/></svg>)
const In=(p)=><input {...p} style={{width:'100%',padding:'12px 14px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,color:T.txt,fontSize:14,outline:'none',fontFamily:'inherit',...(p.style||{})}}/>
const Sel=(p)=><select {...p} style={{width:'100%',padding:'12px 14px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,color:T.txt,fontSize:14,outline:'none',fontFamily:'inherit',appearance:'none',...(p.style||{})}}/>
const FL=({onClick,children})=>(<button onClick={onClick} style={{display:'block',background:'none',border:'none',padding:'5px 0',fontSize:12,color:T.txtS,textAlign:'left',cursor:'pointer',fontFamily:'inherit'}} onMouseEnter={e=>e.currentTarget.style.color=T.txt} onMouseLeave={e=>e.currentTarget.style.color=T.txtS}>{children}</button>)

// Orson divider
const GoldDivider=()=>(<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,padding:'0 24px'}}><div style={{flex:1,height:1,background:'linear-gradient(90deg,transparent,rgba(184,134,11,0.4),transparent)'}}/><div style={{width:8,height:8,background:T.gold,transform:'rotate(45deg)',opacity:0.5}}/><div style={{flex:1,height:1,background:'linear-gradient(90deg,transparent,rgba(184,134,11,0.4),transparent)'}}/></div>)

// Section header for Orson-style
const SL=({children})=>(<p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>{children}</p>)
const SH=({children})=>(<h2 style={{fontSize:'clamp(26px,3.5vw,38px)',fontWeight:800,color:T.txt,marginBottom:12,lineHeight:1.2,letterSpacing:-1}}>{children}</h2>)
const SS=({children})=>(<p style={{fontSize:15,color:T.txtS,marginBottom:40,lineHeight:1.7,maxWidth:560,margin:'0 auto 40px'}}>{children}</p>)

const PREVIEW_CHARS=320

export default function App(){
  const auth=useAuth()
  const [page,setPage]=useState('home')
  const [postId,setPostId]=useState(null)
  const [ebookPreview,setEbookPreview]=useState(null)

  useEffect(()=>{
    const h=()=>{
      const hash=window.location.hash.slice(1)
      if(hash.startsWith('col-')||(hash.startsWith('ted-')&&hash!=='ted-program')){setPage('blog');setPostId(hash)}
      else if(hash==='ted-program'){setPage('ted-program');setPostId(null)}
      else if(hash==='blog'){setPage('blog');setPostId(null)}
      else if(hash==='article'){setPage('article');setPostId(null)}
      else if(['ebooks','admin','login','consent','apply'].includes(hash)){setPage(hash);setPostId(null)}
      else{setPage('home');setPostId(null)}
      window.scrollTo(0,0)
    }
    h();window.addEventListener('hashchange',h);return()=>window.removeEventListener('hashchange',h)
  },[])

  useEffect(()=>{if(auth.needsConsent&&page!=='consent')window.location.hash='consent'},[auth.needsConsent,page])

  const nav=(p,id)=>{window.location.hash=id||p}

  const post=postId?COLUMNS.find(c=>c.id===postId):null

  return(
    <div style={{background:T.bg,minHeight:'100vh',color:T.txt,fontFamily:"'DM Sans','Noto Sans KR',-apple-system,sans-serif",WebkitFontSmoothing:'antialiased',wordBreak:'keep-all',lineBreak:'strict'}}>
      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${T.border}`}}>
        <div style={{width:'100%',maxWidth:1200,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>nav('home')}><Flame size={24}/><span style={{color:T.txt,fontSize:15,fontWeight:800,letterSpacing:-0.3}}>조용한 야망가들</span></div>
          <div style={{display:'flex',gap:28,alignItems:'center'}}>
            <div style={{display:'flex',gap:24,alignItems:'center'}} className="nav-links">
              {[['home','홈'],['article','아티클'],['ebooks','전자책'],['ted-program','TED 스터디']].map(([p,l])=>(<button key={p} onClick={()=>nav(p)} style={{background:'none',border:'none',cursor:'pointer',color:page===p?T.txt:T.txtS,fontSize:13,fontWeight:page===p?600:500,padding:0}}>{l}</button>))}
            </div>
            {auth.isLoggedIn?(<div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:12,color:T.txtS,maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{auth.profile?.display_name||auth.user?.email?.split('@')[0]}</span><button onClick={auth.signOut} style={{background:T.bg,border:`1px solid ${T.border}`,color:T.txtS,padding:'6px 12px',borderRadius:6,fontSize:11,fontWeight:500,cursor:'pointer'}}>로그아웃</button></div>):(<button onClick={()=>nav('login')} style={{background:'none',border:'none',color:T.txt,padding:0,fontSize:13,fontWeight:500,cursor:'pointer'}}>로그인</button>)}
            <button onClick={()=>nav('apply')} style={{padding:'9px 18px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',boxShadow:T.shadow}}>{PROGRAM_LIVE?'사전신청':'오픈 알림'}</button>
          </div>
        </div>
      </nav>

      <main>
        {page==='home'&&<Home nav={nav}/>}
        {page==='blog'&&(post?<Post post={post} nav={nav} auth={auth}/>:<BlogList nav={nav}/>)}
        {page==='ebooks'&&<Ebooks preview={ebookPreview} setPreview={setEbookPreview} nav={nav}/>}
        {page==='ted-program'&&(PROGRAM_LIVE?<TedProgram nav={nav}/>:<ComingSoon nav={nav}/>)}
        {page==='article'&&<GatedArticle auth={auth}/>}
        {page==='login'&&<Login auth={auth} nav={nav}/>}
        {page==='consent'&&<ConsentPage auth={auth} nav={nav}/>}
        {page==='apply'&&(PROGRAM_LIVE?<Apply nav={nav}/>:<ComingSoon nav={nav}/>)}
        {page==='admin'&&<Admin/>}
      </main>

      {/* FOOTER */}
      <footer style={{background:T.bgSoft,borderTop:`1px solid ${T.border}`,marginTop:80}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'64px 24px 32px',display:'grid',gridTemplateColumns:'1.3fr 1fr 1fr 1fr',gap:40}} className="footer-grid">
          <div><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}><Flame size={24}/><span style={{fontSize:14,fontWeight:800,color:T.txt}}>조용한 야망가들</span></div><p style={{fontSize:12,color:T.txtS,lineHeight:1.8,maxWidth:280}}>Silent Ambitious People.<br/>떠들지 않지만 실행하는 사람들을 위한 커뮤니티.</p></div>
          <div><p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>콘텐츠</p><FL onClick={()=>nav('article')}>아티클</FL><FL onClick={()=>nav('ebooks')}>전자책 · 자료집</FL><FL onClick={()=>nav('ted-program')}>TED 올인원 스터디</FL></div>
          <div><p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>커뮤니티</p>{PROGRAM_LIVE?<FL onClick={goToLatpeed}>2기 신청하기</FL>:<FL onClick={()=>nav('apply')}>오픈 알림 신청</FL>}<FL onClick={()=>nav('login')}>로그인 / 가입</FL><FL onClick={()=>nav('consent')}>개인정보 처리방침</FL></div>
          <div><p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>SNS</p><a href="https://youtube.com/@kglobaltechgirl" target="_blank" rel="noreferrer" style={{display:'block',fontSize:12,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>YouTube</a><a href="https://instagram.com/kglobal.tech.girl" target="_blank" rel="noreferrer" style={{display:'block',fontSize:12,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>Instagram</a><a href="https://threads.net/@getnerdywithgrace" target="_blank" rel="noreferrer" style={{display:'block',fontSize:12,color:T.txtS,textDecoration:'none',padding:'5px 0'}}>Threads</a></div>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,maxWidth:1200,margin:'0 auto',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}><p style={{fontSize:11,color:T.txtD}}>© 2026 조용한 야망가들. All rights reserved.</p><div style={{display:'flex',gap:18}}><span onClick={()=>nav('consent')} style={{fontSize:11,color:T.txtD,cursor:'pointer'}}>개인정보처리방침</span><span onClick={()=>nav('admin')} style={{fontSize:11,color:T.txtD,cursor:'pointer'}}>관리자</span></div></div>
      </footer>
      <style>{`@media(max-width:768px){.nav-links{display:none!important}.footer-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}.featured-grid{grid-template-columns:1fr!important;padding:40px 28px!important}}`}</style>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━
// HOME — Orson Hero
// ━━━━━━━━━━━━━━━━━━━━━━━━
function Home({nav}){
  const features=[
    {icon:'📝',label:'아티클',desc:'나를 지켜주었던 말들',goto:'article'},
    {icon:'🎙️',label:'TED 올인원 스터디',desc:PROGRAM_LIVE?'4주 집중 · 2기 모집중':'4주 집중 · 곧 공개',goto:'ted-program'},
    {icon:'📚',label:'전자책 · 자료집',desc:'깊이 있는 이야기',goto:'ebooks'},
    {icon:'💬',label:'디스코드 커뮤니티',desc:'실행하는 사람들',goto:'ted-program'},
    {icon:'🔥',label:'실행 시스템',desc:'의지력이 아닌 구조',goto:'blog'},
    {icon:'🎯',label:'글로벌 커리어',desc:'비전공자 빅테크 로드맵',goto:'blog'},
  ]
  return(<div>
    {/* HERO — Orson */}
    <section style={{position:'relative',padding:'160px 24px 140px',textAlign:'center',overflow:'hidden',background:'linear-gradient(180deg,#FFFDF7 0%,#FFF6E5 45%,#FFFFFF 100%)',borderBottom:`1px solid ${T.border}`}}>
      <div style={{position:'absolute',top:'20%',left:'50%',transform:'translate(-50%,-50%)',width:900,height:700,background:'radial-gradient(ellipse at center,rgba(212,168,83,0.45) 0%,rgba(212,168,83,0.2) 25%,rgba(212,168,83,0.06) 50%,transparent 75%)',pointerEvents:'none'}}/>
      <svg style={{position:'absolute',top:'18%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,opacity:0.2,pointerEvents:'none'}} viewBox="0 0 700 700"><circle cx="350" cy="350" r="320" fill="none" stroke="#B8860B" strokeWidth="0.6"/><circle cx="350" cy="350" r="260" fill="none" stroke="#B8860B" strokeWidth="0.6"/><circle cx="350" cy="350" r="200" fill="none" stroke="#B8860B" strokeWidth="0.6"/><circle cx="350" cy="350" r="140" fill="none" stroke="#B8860B" strokeWidth="0.6"/></svg>
      <div style={{position:'relative',maxWidth:900,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 18px',background:'rgba(255,255,255,0.8)',backdropFilter:'blur(10px)',border:'1px solid rgba(184,134,11,0.3)',borderRadius:100,fontSize:11,color:'#8B6914',marginBottom:32,letterSpacing:1,fontWeight:600}}><span style={{width:6,height:6,borderRadius:'50%',background:T.gold}}/>SILENT AMBITIOUS PEOPLE</div>
        <h1 style={{fontSize:'clamp(38px,6.5vw,72px)',fontWeight:800,color:T.txt,lineHeight:1.1,marginBottom:30,letterSpacing:-2.8}}>떠들지 않지만<br/><span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,background:'linear-gradient(135deg,#8B6914 0%,#D4A853 50%,#E8CFA0 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>실행하는 사람들</span>의<br/>커뮤니티</h1>
        <p style={{fontSize:17,color:T.txt,marginBottom:48,lineHeight:1.75,maxWidth:560,margin:'0 auto 48px'}}>동기부여보다 구조, 영감보다 루트맵.<br/><strong style={{color:'#8B6914',fontWeight:600}}>영어 · 커리어 · 실행 시스템</strong>을 함께 만들어 갑니다.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>nav('article')} style={{padding:'15px 30px',background:T.navy,color:'#fff',fontSize:14,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',boxShadow:'0 10px 30px rgba(184,134,11,0.25)',transition:'transform 0.15s'}} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>아티클 읽기 →</button>
        </div>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0}}><GoldDivider/></div>
    </section>

    {/* FEATURED: TED 스터디 배너 */}
    <section style={{padding:'80px 24px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',borderRadius:24,overflow:'hidden',background:`linear-gradient(135deg,${T.navy} 0%,#1a2332 100%)`,padding:'56px',display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:40,alignItems:'center',boxShadow:T.shadowH,position:'relative'}} className="featured-grid">
        <div style={{position:'absolute',top:'50%',right:'-15%',transform:'translateY(-50%)',width:500,height:500,background:'radial-gradient(circle,rgba(212,168,83,0.25) 0%,transparent 60%)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',background:'rgba(212,168,83,0.18)',border:'1px solid rgba(212,168,83,0.4)',borderRadius:100,fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1.2,marginBottom:18}}><span style={{width:5,height:5,borderRadius:'50%',background:'#E8CFA0'}}/>{PROGRAM_LIVE?'2기 모집 중 · 30명 내외 소그룹':'2기 곧 공개 · 오픈 알림 신청 중'}</div>
          <h2 style={{fontSize:'clamp(26px,3.4vw,36px)',fontWeight:800,color:'#fff',marginBottom:16,lineHeight:1.25,letterSpacing:-1}}>커리어 점프업을 위한<br/><span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,color:'#E8CFA0'}}>영어 TED 올인원 스터디</span></h2>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.75)',marginBottom:26,lineHeight:1.7,maxWidth:480}}>TED Talk 기반 10단계 스피킹 메소드와<br/>캐나다 명문대 출신 원어민 튜터의 1:1 피드백.<br/>4주 동안 매일 실행하고, 매주 성장합니다.</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button onClick={()=>nav(PROGRAM_LIVE?'ted-program':'apply')} style={{padding:'13px 24px',background:'#fff',color:T.navy,fontSize:14,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>{PROGRAM_LIVE?'자세히 보기 →':'오픈 알림 신청 →'}</button>
            {PROGRAM_LIVE&&<button onClick={goToLatpeed} style={{padding:'13px 24px',background:'transparent',color:'#fff',fontSize:14,fontWeight:600,border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,cursor:'pointer'}}>2기 신청하기</button>}
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle at 30% 30%,rgba(212,168,83,0.3),rgba(212,168,83,0.05))',border:'1px solid rgba(212,168,83,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}><Flame size={100}/></div></div>
      </div>
    </section>

    {/* FEATURES */}
    <section style={{padding:'100px 24px',textAlign:'center'}}>
      <SL>ALL IN ONE PLACE</SL><SH>야망을 실행으로</SH><SS>조용한 야망가들의 성장에 필요한 모든 것을 한 곳에서.</SS>
      <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {features.map(f=>(<div key={f.label} onClick={()=>nav(f.goto)} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'28px 26px',cursor:'pointer',transition:'all 0.2s',boxShadow:T.shadow,textAlign:'left'}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowH;e.currentTarget.style.transform='translateY(-3px)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform='translateY(0)'}}><div style={{fontSize:26,marginBottom:14}}>{f.icon}</div><h3 style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:6}}>{f.label}</h3><p style={{fontSize:13,color:T.txtS,lineHeight:1.6}}>{f.desc}</p></div>))}
      </div>
    </section>

    <GoldDivider/>

    {/* EBOOKS */}
    <section style={{padding:'80px 24px',background:T.bgWarm,textAlign:'center'}}>
      <SL>EBOOKS</SL><SH>핵심 요약 전자책</SH><SS>조용한 야망가들의 깊이 있는 이야기</SS>
      <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
        {EBOOKS.map(b=>(<div key={b.id} onClick={()=>nav('ebooks')} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,overflow:'hidden',cursor:'pointer',transition:'all 0.2s',boxShadow:T.shadow,textAlign:'left'}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowH;e.currentTarget.style.transform='translateY(-3px)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform='translateY(0)'}}>
          <div style={{aspectRatio:'3/4',background:`linear-gradient(135deg,${T.cream},#fff)`,borderBottom:`1px solid ${T.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,position:'relative'}}><div style={{position:'absolute',top:14,right:14,padding:'4px 10px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:100,fontSize:10,color:T.txtS}}>준비중</div><Flame size={56}/><p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',color:T.gold,fontSize:17,marginTop:18,textAlign:'center',lineHeight:1.4}}>{b.title}</p></div>
          <div style={{padding:'22px 24px'}}><h3 style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:5}}>{b.title}</h3><p style={{fontSize:11,color:T.gold,marginBottom:10,fontWeight:600}}>{b.subtitle}</p><p style={{fontSize:12,color:T.txtS,lineHeight:1.6}}>{b.desc}</p></div>
        </div>))}
      </div>
    </section>

    <GoldDivider/>

    {/* 무료 칼럼 CTA */}
    <section style={{padding:'100px 24px'}}>
      <div style={{maxWidth:780,margin:'0 auto',background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:'56px 48px',textAlign:'center',boxShadow:T.shadow,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${T.gold},${T.goldL})`}}/>
        <div style={{fontSize:36,marginBottom:16}}>✍️</div>
        <h2 style={{fontSize:'clamp(22px,3vw,28px)',fontWeight:800,color:T.txt,marginBottom:12}}>나를 단단하게 만든 문장들</h2>
        <p style={{fontSize:14,color:T.txtS,marginBottom:28,lineHeight:1.7,maxWidth:480,margin:'0 auto 28px'}}>흔들리는 시간 속에서 나를 지켜준 세 가지 말.<br/>Google 계정으로 가입하고 전문을 읽어보세요.</p>
        <button onClick={()=>nav('article')} style={{padding:'13px 28px',background:T.navy,color:'#fff',fontSize:13,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',boxShadow:T.shadow}}>아티클 읽기 →</button>
      </div>
    </section>

    {/* 아티클 소개 */}
    <section style={{padding:'60px 24px 120px'}}>
      <div style={{maxWidth:800,margin:'0 auto',textAlign:'center'}}>
        <SL>FEATURED ARTICLE</SL>
        <h2 style={{fontSize:28,fontWeight:800,color:T.txt,marginBottom:16}}>내 삶의 기둥이 무너져가는 것 같은 때,<br/>나를 지켜주었던 말들.</h2>
        <p style={{fontSize:14,color:T.txtS,lineHeight:1.7,marginBottom:32,maxWidth:520,margin:'0 auto 32px'}}>첫 출근을 앞두고 정리한 글. 흔들리는 시간 속에서 나를 붙들어 준 세 가지 말에 대하여.</p>
        <button onClick={()=>nav('article')} style={{padding:'14px 28px',background:T.navy,color:'#fff',fontSize:14,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',boxShadow:T.shadow}}>전문 읽기 →</button>
      </div>
    </section>
  </div>)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━
// TED PROGRAM — Orson 톤
// ━━━━━━━━━━━━━━━━━━━━━━━━
function TedProgram({nav}){
  const scrollTo=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}

  const pains=[
    {n:'01',q:'점수는 있는데 말이 안 나와요',a:'토익·오픽 점수는 만들었는데 막상 실전에서 한마디도 못 하는 내 자신이 답답해요.'},
    {n:'02',q:'작심삼일이 습관이 됐어요',a:'영어 공부 시작만 수십 번. 2~3주면 어김없이 흐지부지되고 자책만 남아요.'},
    {n:'03',q:'글로벌 커리어 가고 싶은데 영어가 발목을 잡아요',a:'외국계 이직이나 해외 커리어로 가고 싶은데, 영어 때문에 첫 걸음이 안 떼어져요.'},
    {n:'04',q:'미드 쉐도잉 했는데 효과를 모르겠어요',a:'몇 달째 미드 쉐도잉을 했는데도 실력이 느는 게 체감이 안 돼요. 미드는 i+3~4 난이도라 내 수준과 안 맞았을 수 있어요.'},
    {n:'05',q:'문장은 만드는데 대화에서 안 나와요',a:'혼자 영작은 되는데, 실시간 대화에서 떠오르지 않아요. 인풋은 있는데 아웃풋 훈련이 부족한 거죠.'},
    {n:'06',q:'중요한 순간에 영어 자신감이 무너져요',a:'회의·발표·면접 — 중요할수록 영어로 말하는 게 더 어려워요. 실전 경험이 절대적으로 부족해서예요.'},
  ]
  const steps=[
    {n:'Step 01 — 02',t:'듣기 훈련',d:'자막 없이 TED Talk 전체를 듣고, 주제와 흐름을 유추합니다. 노트테이킹으로 안 들리는 구간을 식별하는 것이 핵심.',tag:'인풋'},
    {n:'Step 03 — 04',t:'분석 & 오답노트',d:'안 들렸던 원인을 파악합니다. 모르는 단어인지, 연음·축약인지, 문법 구조인지. 핵심 표현을 골라 내 문장으로 만드는 훈련.',tag:'이해'},
    {n:'Step 05 — 08',t:'쉐도잉 & 녹음',d:'스피커의 속도와 인토네이션을 따라 읽습니다. 녹음해서 자신의 발화를 객관적으로 확인하는 과정.',tag:'아웃풋'},
    {n:'Step 09 — 10',t:'스피치 & 피어 피드백',d:'그 주의 TED를 요약하거나, 자신의 생각을 담은 3분 스피치를 녹음합니다. 동료와 서로 피드백을 주고받으며 성장.',tag:'성장'},
  ]
  const weekLeft=[
    {d:'Day 1 (월)',t:'주제 찾기',s:'자막 없이 TED 전체를 듣고 주제와 구조를 파악해요. 받아쓰기가 아니라 서론·본론·결론의 뼈대를 잡는 게 핵심. 안 들려도 괜찮아요.',o:'1줄 요약 + 노트테이킹'},
    {d:'Day 2 (화)',t:'오답 분석',s:'Transcript를 열고 안 들린 이유를 분석해요. 모르는 단어인지, 연음·축약인지, 문법 구조인지 — 원인을 알아야 패턴이 보여요.',o:'오답노트 제출'},
    {d:'Day 3 (수)',t:'핵심 표현 정리',s:'진짜 쓰고 싶은 표현 3개를 골라, 내 일·삶 맥락으로 각 3문장씩 만들어요. 입에 붙어야 스피치에서 자연스럽게 나와요.',o:'표현 3개 + 내 예문'},
    {d:'Day 4 (목)',t:'쉐도잉',s:'스피커의 속도·인토네이션을 따라 읽어요. 0.75배속부터 영상 속도까지. 녹음해서 내 발화를 객관적으로 확인.',o:'쉐도잉 녹음'},
  ]
  const weekRight=[
    {d:'Day 5 (금)',t:'3분 스피치',s:'이번 주 TED를 내 말로 요약(약 1분 30초) + 내 생각(약 1분 30초)으로 재구성해 녹음해요. 한 주의 메인 결과물이에요.',o:'3분 스피치 · 금요일 자정 마감'},
    {d:'Day 6 (토)',t:'피어 피드백',s:'내 뒤 2명의 스피치를 듣고 전달 체크 · 표현 수집 · 차이 발견 3가지를 코멘트해요. 평가가 아니라 서로 거울이 되는 구조예요.',o:'피어 피드백 (뒤 2명)'},
    {d:'Day 7 (일)',t:'자체 학습',s:'내 속도에 맞춰 복습하거나 다음 주를 예습해요. 단 1분이라도, 한 주 소감이라도 좋으니 끈을 놓지 않는 게 목표.',o:'복습·예습 인증'},
    {d:'별도 (일~월)',t:'원어민 서면 피드백',s:'금요일 3분 스피치를 원어민 튜터가 직접 듣고 발음·표현·구성 기준으로 서면 피드백을 드려요. 매주 1회 도착해요.',o:'별도 서면 제공'},
  ]
  const beforeAfter=[
    {b:'영상 틀면 막막하고 속상하다. 뭔 말인지 모르겠고 어디서부터 손 대야 할지 모르겠다.',a:'안 들려도 당황하지 않는다. 어디가 안 들리는지, 왜 안 들리는지 스스로 진단할 수 있다.'},
    {b:'영어 공부법이 맞는 건지 모른 채 혼자 중얼거린다.',a:'듣기 → 분석 → 내 말로 바꾸기 → 녹음 → 피드백. 나만의 루프가 장착된다.'},
    {b:'영어 말하기가 두렵다. 틀릴까봐, 부끄러워서.',a:'3분 스피치 녹음 4개가 쌓여 있다. 1주차와 4주차를 비교하면 성장이 들린다.'},
    {b:'혼자 시작하면 3일 만에 포기한다.',a:'28일 연속 실행 기록. 시스템과 동료가 나를 움직여줬다.'},
  ]
  const timeline=[
    {label:'사전신청 접수 중',date:'~6월 14일 (일)',active:true},
    {label:'2기 모집·결제',date:'6월 15일(월)~19일(금)',active:false},
    {label:'디스코드 입장권 전달',date:'결제 후 1일 이내',active:false},
    {label:'오리엔테이션',date:'6월 20일 (토)',active:false},
    {label:'2기 시작',date:'6월 22일 (월)',active:false},
    {label:'4주 과정 종료',date:'7월 19일 (일)',active:false},
  ]

  const faqs=[
    ['영어를 정말 못하는데 참여할 수 있나요?','TED 영상의 60% 정도는 이해할 수 있는 분을 기준으로 설계되어 있어요. 완벽하게 알아들을 필요는 없지만, 키워드와 전체 흐름을 파악할 수 있는 정도면 충분해요. 신청 시 현재 영어 상황을 여쭤보지만, 이는 추후 운영과 피드백 참고용이에요.'],
    ['직장인인데 시간이 될까요?','매일 한 시간 정도는 필요해요. 대신 출퇴근 시간에 리스닝, 점심시간에 노트테이킹, 퇴근 후 쉐도잉처럼 시간을 쪼개서 실행할 수 있는 시스템이에요. 저도 풀타임 직장인으로 이 루틴을 만들어 왔기 때문에 충분히 가능해요. 매일 제출물이 있어서 자연스럽게 루틴이 만들어져요.'],
    ['신청하면 바로 결제인가요?','네, 신청과 결제가 한 번에 이루어져요. 30명 내외 소그룹으로 운영되며, 결제 완료 순으로 자리가 확정돼요. 신청 페이지에서 작성하시는 설문은 추후 운영과 피드백 참고용으로만 활용해요.'],
    ['어떤 TED 영상으로 공부하나요?','커리어·자기계발·심리학 중심의 TED Talk을 큐레이션해서 제공해요. 5분 안팎 길이로, 직장에서 실제로 쓸 수 있는 표현이 풍부한 영상 위주예요. 2기는 "자기관리 × 생산성" 테마로 4편이 준비되어 있어요.'],
    ['피드백은 어떻게 받나요?','두 가지 피드백이 있어요. 매주 3분 요약 스피치에 대해 원어민 튜터가 서면으로 발음·표현·구성 피드백을 드려요. 거기에 매주 토요일 동료들과의 피어 피드백까지 — 혼자 연습할 때는 절대 얻을 수 없는 기준이 생겨요.'],
    ['4주 후에는 어떻게 되나요?','4주간 쌓은 노트·녹음·오답노트·스피치가 나만의 영어 포트폴리오가 돼요. 완주자에게는 다음 기수 우선 안내가 제공돼요.'],
    ['중간에 빠지게 되는 기준(킥아웃)이 있나요?','몰입도 높은 환경을 위해, 열정적으로 참여하지 못하는 경우 부득이하게 킥아웃될 수 있어요. 다만 최대한 완주하실 수 있도록 더 가벼운 버전으로 도와드리고, 사정이 생기면 미리 알려주실 경우 최대한 반영해드려요. 상세 기준은 프로그램 시작 전 오리엔테이션에서 안내드려요.'],
    ['환불은 가능한가요?','결제 후 환불은 불가해요. 결제 전에 프로그램 상세를 충분히 확인하신 후 결정해주세요.'],
  ]

  // 큰 폰트 기반 섹션 헤더
  const Sec=({id,label,title,sub,bg,children,maxW=1080})=>(
    <section id={id} style={{padding:'100px 24px',background:bg||'transparent',borderTop:`1px solid ${T.border}`}}>
      <div style={{maxWidth:maxW,margin:'0 auto',textAlign:'center',marginBottom:56}}>
        <p style={{fontSize:13,fontWeight:700,color:T.gold,letterSpacing:2.5,marginBottom:16,textTransform:'uppercase'}}>{label}</p>
        <h2 style={{fontSize:'clamp(30px,4.5vw,46px)',fontWeight:800,color:T.txt,lineHeight:1.22,letterSpacing:-1.2}}>{title}</h2>
        {sub&&<p style={{fontSize:'clamp(15px,1.7vw,18px)',color:T.txtS,lineHeight:1.8,marginTop:20,maxWidth:640,margin:'20px auto 0'}}>{sub}</p>}
      </div>
      <div style={{maxWidth:maxW,margin:'0 auto'}}>{children}</div>
    </section>
  )

  return(<div>
    {/* ━ 1. HERO ━ */}
    <section style={{padding:'100px 24px 80px',textAlign:'center',position:'relative',overflow:'hidden',background:'linear-gradient(180deg,#FFFDF7 0%,#FFF8EC 50%,#FFFFFF 100%)',minHeight:'90vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',top:'30%',left:'50%',transform:'translate(-50%,-50%)',width:900,height:600,background:'radial-gradient(ellipse,rgba(184,134,11,0.22) 0%,transparent 65%)',pointerEvents:'none'}}/>
      <svg style={{position:'absolute',top:'28%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,opacity:0.15,pointerEvents:'none'}} viewBox="0 0 700 700"><circle cx="350" cy="350" r="320" fill="none" stroke="#B8860B" strokeWidth="0.7"/><circle cx="350" cy="350" r="260" fill="none" stroke="#B8860B" strokeWidth="0.7"/><circle cx="350" cy="350" r="200" fill="none" stroke="#B8860B" strokeWidth="0.7"/><circle cx="350" cy="350" r="140" fill="none" stroke="#B8860B" strokeWidth="0.7"/></svg>
      <div style={{position:'relative',maxWidth:900,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 18px',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(10px)',border:'1px solid rgba(184,134,11,0.35)',borderRadius:100,fontSize:12,color:'#8B6914',marginBottom:32,letterSpacing:1,fontWeight:600}}><span style={{width:7,height:7,borderRadius:'50%',background:T.gold}}/>2기 모집 중 · 30명 내외 소그룹</div>
        <h1 style={{fontSize:'clamp(36px,6.5vw,68px)',fontWeight:800,color:T.txt,lineHeight:1.12,marginBottom:30,letterSpacing:-2.5}}>
          토익은 되는데<br/>
          <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,color:T.gold}}>입이 안 열리는</span> 당신을 위한<br/>
          영어 TED 올인원 스터디
        </h1>
        <p style={{fontSize:'clamp(16px,1.8vw,19px)',color:T.txt,marginBottom:44,lineHeight:1.75,maxWidth:640,margin:'0 auto 44px'}}>
          TED Talk 기반 10단계 스피킹 메소드와<br/>
          캐나다 명문대 출신 원어민 튜터의 <strong style={{color:T.gold}}>1:1 맞춤 피드백</strong>.<br/>
          4주 동안 매일 실행하고, 매주 눈에 띄게 성장해요.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:50}}>
          <button onClick={goToLatpeed} style={{padding:'17px 36px',background:T.navy,color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',boxShadow:'0 10px 30px rgba(184,134,11,0.25)'}}>2기 신청하기 →</button>
          <button onClick={()=>scrollTo('curriculum')} style={{padding:'17px 36px',background:'rgba(255,255,255,0.9)',color:T.txt,fontSize:15,fontWeight:600,border:'1px solid rgba(184,134,11,0.35)',borderRadius:10,cursor:'pointer',backdropFilter:'blur(10px)'}}>커리큘럼 보기 ↓</button>
        </div>
        <div style={{maxWidth:680,margin:'0 auto',textAlign:'center'}}>
          <div style={{width:60,height:2,background:`linear-gradient(90deg,transparent,${T.gold},transparent)`,margin:'0 auto 18px'}}/>
          <p style={{fontSize:15,color:T.txtS,fontWeight:400,letterSpacing:-0.2}}><strong style={{fontWeight:700,color:T.txt}}>36만 명</strong>이 공감한 TED 공부법 기반</p>
        </div>
      </div>
    </section>

    {/* ━ 1.5 SOCIAL PROOF + 후기 롤링 (앞단) ━ */}
    <section style={{padding:'56px 24px 64px',background:T.bg}}>
      <div style={{maxWidth:720,margin:'0 auto',textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,marginBottom:26,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center'}}>
            {TESTIMONIALS_TED1.map((t,i)=>{
              const ini=(t.name||'?').replace(/[()님\s]/g,'').charAt(0)||'·'
              return <div key={i} style={{width:40,height:40,borderRadius:'50%',background:`linear-gradient(135deg,${T.gold} 0%,${T.goldL} 60%,#E8CFA0 100%)`,border:'2px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:700,marginLeft:i===0?0:-12,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',position:'relative',zIndex:i}}>{ini}</div>
            })}
            <div style={{width:40,height:40,borderRadius:'50%',background:T.navy,border:'2px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,fontWeight:700,marginLeft:-12,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',position:'relative',zIndex:99}}>40+</div>
          </div>
          <p style={{fontSize:'clamp(14px,1.7vw,16px)',color:T.txt,fontWeight:500,letterSpacing:-0.2}}>이미 <strong style={{color:T.gold,fontWeight:700}}>40명이 넘는 멤버</strong>가<br className="sp-br"/> 이 여정을 함께하고 있어요</p>
        </div>
        <TestimonialCarousel compact/>
        <p style={{fontSize:12,color:T.txtD,marginTop:16,lineHeight:1.6}}>실제 참가자들이 커뮤니티에 자발적으로 남긴 소감 중 극히 일부예요.</p>
      </div>
      <style>{`@media(min-width:561px){.sp-br{display:none}}`}</style>
    </section>

    <GoldDivider/>

    {/* ━ 2. PAIN POINTS ━ */}
    <Sec label="IS THIS YOU?" title={<>혹시 이런 상황,<br/>반복되고 있지 않나요?</>} bg={T.bgWarm}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:18}}>
        {pains.map(p=>(<div key={p.n} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 30px',boxShadow:T.shadow}}>
          <span style={{fontSize:14,fontWeight:700,color:T.gold,letterSpacing:1}}>{p.n}</span>
          <h3 style={{fontSize:18,fontWeight:700,color:T.txt,margin:'12px 0 10px',lineHeight:1.4}}>{p.q}</h3>
          <p style={{fontSize:15,color:T.txtS,lineHeight:1.8}}>{p.a}</p>
        </div>))}
      </div>
      <div style={{maxWidth:820,margin:'56px auto 0',textAlign:'center'}}>
        <p style={{fontSize:'clamp(18px,2.2vw,22px)',color:T.txt,lineHeight:1.6,marginBottom:14,fontWeight:600}}>
          하나라도 해당된다면,
        </p>
        <p style={{fontSize:'clamp(26px,4.2vw,42px)',lineHeight:1.3,fontWeight:800,letterSpacing:-1.2,background:'linear-gradient(135deg,#8B6914 0%,#D4A853 50%,#E8CFA0 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
          이 프로그램이 답이 될 수도 있어요.
        </p>
      </div>
      <p style={{textAlign:'center',marginTop:44,fontSize:'clamp(18px,2vw,22px)',color:T.txt,lineHeight:1.7,fontWeight:500}}>의지력의 문제가 아니에요.<br/><span style={{color:T.gold,fontWeight:700}}>시스템의 문제</span>였을 뿐.</p>
    </Sec>

    {/* ━ 3. WHY THIS WORKS — 독자 관점 전개 ━ */}
    <section style={{padding:'120px 24px',borderTop:`1px solid ${T.border}`}}>
      <div style={{maxWidth:900,margin:'0 auto',textAlign:'center',marginBottom:64}}>
        <p style={{fontSize:13,fontWeight:700,color:T.gold,letterSpacing:2.5,marginBottom:16,textTransform:'uppercase'}}>WHY THIS WORKS</p>
        <h2 style={{fontSize:'clamp(30px,4.5vw,46px)',fontWeight:800,color:T.txt,lineHeight:1.22,letterSpacing:-1.2}}>이 스터디가<br/>작심삼일로 끝나지 않는 이유</h2>
      </div>

      {/* Block 1: 독자의 문제 — 기존 스터디의 한계 */}
      <div style={{maxWidth:580,margin:'0 auto',textAlign:'center',padding:'0 0 60px'}}>
        <p style={{fontSize:'clamp(20px,2.6vw,28px)',fontWeight:800,letterSpacing:-0.6,marginBottom:22,background:'linear-gradient(135deg,#8B6914 0%,#D4A853 55%,#E8CFA0 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>"같이 공부하자"만으로는 부족했어요</p>
        <p style={{fontSize:'clamp(17px,2vw,21px)',color:T.txt,lineHeight:1.85}}>
          대부분의 영어 스터디는 "같이 공부하자"에서 끝나요.<br/>
          커리큘럼도, 제출 구조도, 피드백 루프도 없이<br/>
          2~3주면 자연스럽게 흐지부지되죠.
        </p>
      </div>

      {/* 세로 그라데이션 라인 구분자 */}
      <div style={{padding:'24px 0'}}>
        <div style={{width:'1.5px',height:48,background:'linear-gradient(180deg,rgba(184,134,11,0.05),rgba(184,134,11,0.35),rgba(184,134,11,0.05))',margin:'0 auto'}}/>
      </div>

      {/* Block 2: 이 프로그램은 다릅니다 */}
      <div style={{maxWidth:580,margin:'0 auto',textAlign:'center',padding:'60px 0'}}>
        <p style={{fontSize:'clamp(20px,2.6vw,28px)',fontWeight:800,letterSpacing:-0.6,marginBottom:22,background:'linear-gradient(135deg,#8B6914 0%,#D4A853 55%,#E8CFA0 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>이 프로그램은 다릅니다</p>
        <p style={{fontSize:'clamp(17px,2vw,21px)',color:T.txt,lineHeight:1.85}}>
          매일 <strong>무엇을</strong>, <strong>어떤 순서로</strong> 하고,<br/>
          <strong>언제 제출</strong>하고, <strong>어떤 피드백</strong>을 받는지까지<br/>
          전부 <strong style={{color:T.gold}}>시스템으로 설계</strong>되어 있어요.
        </p>
      </div>

      {/* 본업 브릿지 */}
      <div style={{maxWidth:580,margin:'0 auto',padding:'32px 32px 28px',borderRadius:14,background:'linear-gradient(135deg,rgba(184,134,11,0.06),rgba(184,134,11,0.02))',textAlign:'center',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:60,height:3,background:`linear-gradient(90deg,transparent,${T.gold},transparent)`}}/>
        <p style={{fontSize:'clamp(16px,1.9vw,18px)',color:T.txt,lineHeight:1.95,fontWeight:500,marginTop:6}}>
          제 본업이 그 일이거든요. <strong style={{color:T.gold,fontWeight:700}}>어떤 지표를 볼지, 어떤 주기로 트래킹할지 설계해서 사람들의 행동이 바뀌도록 만드는 일</strong>을 해왔어요.
        </p>
      </div>

      {/* Block 3: 큰 인용문 — border 없이 풀와이드 페이드 */}
      <div style={{marginTop:80}}>
        <div style={{textAlign:'center',padding:'96px 32px',background:'linear-gradient(180deg,#FAF7F2 0%,transparent 100%)',borderRadius:0,position:'relative'}}>
          <div style={{maxWidth:860,margin:'0 auto'}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:80,color:T.gold,opacity:0.4,lineHeight:0.5,display:'inline-block',marginBottom:8}}>"</span>
            <p style={{fontSize:'clamp(24px,3.8vw,40px)',color:T.txt,fontWeight:800,lineHeight:1.35,letterSpacing:-1.5,marginBottom:20,fontFamily:"'Noto Sans KR',sans-serif"}}>
              좋은 시스템 하나가<br/>
              개인의 의지보다<br/>
              <em style={{color:T.gold,fontStyle:'italic',fontFamily:"'Playfair Display',serif",fontWeight:500}}>훨씬 큰 임팩트</em>를 만들어내요.
            </p>
            <p style={{fontSize:13,color:T.txtS,marginTop:20,letterSpacing:1}}>— 반복하며 내린 결론</p>
          </div>
        </div>
      </div>
    </section>

    {/* ━ 4. DIFFERENTIATOR ━ */}
    <Sec label="WHAT MAKES US DIFFERENT" title={<>왜 기존 학원·스터디로는<br/>입이 안 열렸을까요?</>} maxW={1000}>
      <div style={{display:'grid',gap:18}}>
        {[
          {old:'단어와 표현만 가르쳐주는 학습',oldD:'"이 표현 외워두세요"는 쉬워요. 문제는 언제 써야 할지 모른다는 점이에요. 내 상황에 연결되지 않은 학습은 오래 남지 않아요.',mine:'나에게 필요한 표현을 스스로 뽑아내는 훈련',mineD:'TED 한 편에서 내가 쓸 수 있는 표현 5개를 직접 고르고, 그걸로 내 스피치를 만들어요. 필요한 맥락이 있으니 기억에 남아요.'},
          {old:'인풋 없는 "내 문장 만들기"',oldD:'계속 쓰기만 하는데 실력이 느는 게 체감되지 않아요. 무엇을 기준으로 잘한 건지 모르니까요.',mine:'인풋 → 이해 → 아웃풋 → 피드백 루프',mineD:'TED를 듣고, 분석하고, 내 말로 바꾸고, 녹음하고, 피드백 받는 전 과정이 매주 반복돼요. 기준이 있는 아웃풋이에요.'},
          {old:'전화 영어나 단일 수업 방식',oldD:'매일 30~50분씩 대화하는 건 시스템이 아니라 "기회 제공"에 가까워요. 내가 무엇을 어떻게 개선해야 할지는 알려주지 않죠.',mine:'매일 다른 과제가 쌓이는 시스템',mineD:'월요일 리스닝부터 일요일 피어 피드백까지, 하루하루 다른 과제가 쌓여 1주일 뒤 나의 스피치 녹음이 완성돼요. 축적되는 구조예요.'},
          {old:'개별 피드백 없는 일방향 스터디',oldD:'웬만한 스터디는 "같이 공부하자"가 목적이지, 내 영어를 개별로 봐주지는 않아요. 결국 방향이 맞는지 모른 채 반복하게 돼요.',mine:'원어민 1:1 서면 피드백 + 피어 3관점 피드백',mineD:'원어민이 4가지 기준(발음·표현·구성·마무리)으로 매주 서면 피드백을 드려요. 동료들도 3관점으로 피드백을 교환해요.'},
        ].map((r,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,background:T.border,borderRadius:16,overflow:'hidden',boxShadow:T.shadow}} className="diff-row">
            <div style={{background:T.bgSoft,padding:'28px 30px'}}>
              <p style={{fontSize:11,fontWeight:700,color:T.txtD,letterSpacing:1.5,marginBottom:10,textTransform:'uppercase'}}>기존 방식</p>
              <h4 style={{fontSize:16,fontWeight:700,color:T.txtS,marginBottom:10,lineHeight:1.4,textDecoration:'line-through',textDecorationColor:'rgba(13,17,23,0.2)'}}>{r.old}</h4>
              <p style={{fontSize:14,color:T.txtS,lineHeight:1.75}}>{r.oldD}</p>
            </div>
            <div style={{background:'#FFFDF7',padding:'28px 30px'}}>
              <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1.5,marginBottom:10,textTransform:'uppercase'}}>TED 올인원 스터디</p>
              <h4 style={{fontSize:16,fontWeight:700,color:T.txt,marginBottom:10,lineHeight:1.4}}>{r.mine}</h4>
              <p style={{fontSize:14,color:T.txt,lineHeight:1.75}}>{r.mineD}</p>
            </div>
          </div>
        ))}
      </div>
    </Sec>

    {/* ━ 6. METHOD ━ */}
    <Sec label="THE METHOD" title={<>TED Talk 기반<br/>10단계 스피킹 메소드</>} sub={<>Krashen의 이해가능한 입력(i+1)과 Swain의 출력 가설을 하나의 학습 루프에 녹인 실전 시스템.<br/>매주 TED 1편으로 <strong style={{color:T.txt}}>듣기부터 발표까지</strong>.</>} bg={T.bgWarm} maxW={840}>
      <div style={{display:'grid',gap:16}}>
        {steps.map((s,i)=>(<div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 36px',boxShadow:T.shadow,display:'grid',gridTemplateColumns:'auto 1fr',gap:32,alignItems:'center'}} className="method-row">
          <div style={{minWidth:120}}>
            <p style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1.2,marginBottom:8,textTransform:'uppercase'}}>{s.n}</p>
            <span style={{display:'inline-block',padding:'5px 12px',background:'rgba(184,134,11,0.1)',border:`1px solid rgba(184,134,11,0.25)`,borderRadius:100,fontSize:11,color:T.gold,fontWeight:700}}>{s.tag}</span>
          </div>
          <div>
            <h3 style={{fontSize:22,fontWeight:700,color:T.txt,marginBottom:10,letterSpacing:-0.4}}>{s.t}</h3>
            <p style={{fontSize:15,color:T.txtS,lineHeight:1.85}}>{s.d}</p>
          </div>
        </div>))}
      </div>
    </Sec>

    {/* ━ 7. WEEKLY ━ */}
    <Sec label="WEEKLY SCHEDULE" title="1주일, 이렇게 진행됩니다" sub="매일 한 시간 정도 필요해요. 출퇴근·점심·퇴근 후로 나눠서 언제 어디서든 실행할 수 있는 시스템이에요.">
      {(() => {
        // 왼쪽(Input+Understanding): 골드 톤 — 쌓는 단계
        // 오른쪽(Output+Feedback): 웜 오렌지 톤 — 뱉는 단계
        const GOLD={main:T.gold,tagBg:'rgba(184,134,11,0.12)',tagBd:'rgba(184,134,11,0.3)',cardBd:'rgba(184,134,11,0.2)'}
        const ORANGE={main:'#C4652A',tagBg:'rgba(196,101,42,0.08)',tagBd:'rgba(196,101,42,0.2)',cardBd:'rgba(196,101,42,0.22)'}
        const DayItem=({w,c})=>(
          <div style={{padding:'20px 22px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,marginBottom:10,flexWrap:'wrap'}}>
              <span style={{display:'inline-block',padding:'4px 10px',background:c.tagBg,border:`1px solid ${c.tagBd}`,borderRadius:100,fontSize:11,color:c.main,fontWeight:700,letterSpacing:0.3}}>{w.d}</span>
              <span style={{fontSize:'clamp(15px,1.7vw,17px)',fontWeight:800,color:T.txt,letterSpacing:-0.3,lineHeight:1.3}}>{w.t}</span>
            </div>
            <p style={{fontSize:13,color:T.txtS,lineHeight:1.7,marginBottom:12}}>{w.s}</p>
            <div style={{display:'inline-block',padding:'5px 10px',background:c.main,color:'#fff',borderRadius:6,fontSize:11,fontWeight:700,letterSpacing:0.3}}>제출물 · {w.o}</div>
          </div>
        )
        const GroupCard=({phase,title,sub,items,c})=>(
          <div style={{border:`1px solid ${c.cardBd}`,borderRadius:14,padding:'28px 28px 18px',background:T.bgCard,boxShadow:T.shadow}}>
            <p style={{fontSize:11,fontWeight:700,color:c.main,letterSpacing:2,marginBottom:8,textTransform:'uppercase'}}>{phase}</p>
            <h3 style={{fontSize:'clamp(17px,2vw,20px)',fontWeight:800,color:T.txt,marginBottom:6,letterSpacing:-0.4}}>{title}</h3>
            <p style={{fontSize:13,color:T.txtS,marginBottom:22,lineHeight:1.6}}>{sub}</p>
            {items.map(w=><DayItem key={w.d} w={w} c={c}/>)}
          </div>
        )
        return(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,alignItems:'start'}} className="week-grid">
            <GroupCard phase="Input + Understanding" title="월~목: 듣고, 분석하고, 입에 붙이는 시간" sub="이번 주 TED를 내 안에 통과시키는 단계" items={weekLeft} c={GOLD}/>
            <GroupCard phase="Output + Feedback" title="금~일: 말하고, 듣고, 교정받는 시간" sub="쌓인 인풋을 내 말과 기준으로 바꾸는 단계" items={weekRight} c={ORANGE}/>
          </div>
        )
      })()}
      <div style={{marginTop:28,padding:'24px 28px',background:'rgba(184,134,11,0.06)',border:`1px solid rgba(184,134,11,0.22)`,borderLeft:`4px solid ${T.gold}`,borderRadius:12}}>
        <p style={{fontSize:'clamp(14px,1.6vw,15px)',color:T.txt,lineHeight:1.85,fontWeight:500}}>
          <strong style={{color:T.gold,fontWeight:700}}>매일 과제 완료를 실시간 트래킹해요.</strong> 매주 완주 현황을 공유하고, 끝까지 함께 가는 시스템을 만들어 드립니다.
        </p>
      </div>
      <style>{`@media(max-width:600px){.week-grid{grid-template-columns:1fr!important}}`}</style>
    </Sec>

    {/* ━ 8. SAMPLE CURRICULUM ━ */}
    <Sec id="curriculum" label="SAMPLE CURRICULUM" title={<>2기 커리큘럼 엿보기<br/>자기관리 × 생산성</>} sub="이번 달 테마는 '나를 움직이는 자기관리'예요. 나쁜 습관 끊기, 미루지 않기, 시간 관리, 번아웃 없는 팀워크까지 — 일과 삶에 바로 쓰는 4편을 5분 안팎으로 큐레이션했어요." bg={T.bgWarm} maxW={1000}>
      <div style={{maxWidth:560,margin:'0 auto'}}>
        <p style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1.5,marginBottom:14,textTransform:'uppercase',textAlign:'center'}}>Week 1 영상 미리보기</p>
        <a href="https://www.ted.com/talks/ted_ed_why_is_it_so_hard_to_break_a_bad_habit" target="_blank" rel="noreferrer" style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 30px',textDecoration:'none',boxShadow:T.shadow,transition:'all 0.2s',display:'block'}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowH;e.currentTarget.style.borderColor=T.borderH;e.currentTarget.style.transform='translateY(-3px)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform='translateY(0)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <span style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1.5,textTransform:'uppercase'}}>Week 1 · PSYCHOLOGY</span>
            <span style={{fontSize:13,color:T.txtD}}>▶ 4:44</span>
          </div>
          <h3 style={{fontSize:20,fontWeight:700,color:T.txt,marginBottom:10,lineHeight:1.35,letterSpacing:-0.3}}>Why is it so hard to break a bad habit?</h3>
          <p style={{fontSize:14,color:T.txtS,marginBottom:16}}>TED-Ed</p>
          <p style={{fontSize:13,color:T.gold,fontWeight:600}}>TED에서 보기 →</p>
        </a>
        <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginTop:20,lineHeight:1.8}}>
          매주 이렇게 <strong style={{color:T.txt}}>5분 안팎의 TED 1편씩, 4주간 총 4편</strong>을<br/>
          '자기관리 × 생산성' 테마로 큐레이션해 제공해요.
        </p>
      </div>
      <div style={{width:'100%',margin:'48px auto 0',padding:'28px 32px',background:'linear-gradient(180deg,#FAF7F2 0%,transparent 100%)',border:`1px solid ${T.border}`,borderRadius:12,textAlign:'center',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:60,height:3,background:`linear-gradient(90deg,transparent,${T.gold},transparent)`}}/>
        <p style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:2,marginBottom:12,textTransform:'uppercase',marginTop:6}}>참여 적합도 체크</p>
        <p style={{fontSize:'clamp(15px,1.8vw,17px)',color:T.txt,lineHeight:1.9}}>
          위 영상 중 하나를 골라 들어보세요.<br/>
          <strong style={{color:T.gold,fontWeight:700}}>60~80% 정도 이해</strong>된다면 이 스터디에 딱 맞는 레벨이에요.
        </p>
      </div>
    </Sec>

    {/* ━ 9. NATIVE FEEDBACK — 튜터 소개 + 피드백 통합 ━ */}
    <Sec label="NATIVE FEEDBACK · 이 프로그램의 심장" title={<>매주 내 스피치를 직접 듣는<br/>원어민 서면 피드백</>} sub={<>매주 5분 TED를 3분으로 요약한 스피치를 녹음하면, 원어민이 직접 듣고 <strong style={{color:T.txt}}>발음 · 표현/전달력 · 구성/흐름 3가지 기준으로 서면 피드백</strong>을 드려요. "이렇게 말했는데 → 이렇게 바꿔보세요"까지 구체적으로. <strong style={{color:T.gold}}>혼자 연습하면 기준이 없어요. 이 피드백이 기준이 돼요.</strong></>} bg={T.bgWarm} maxW={900}>

      {/* 튜터 프로필 카드 — 임팩트 있게 */}
      <div style={{background:`linear-gradient(135deg,${T.navy} 0%,#1a2332 100%)`,borderRadius:20,padding:'40px 44px',marginBottom:40,position:'relative',overflow:'hidden',boxShadow:T.shadowH}}>
        <div style={{position:'absolute',top:'50%',right:'-10%',transform:'translateY(-50%)',width:400,height:400,background:'radial-gradient(circle,rgba(212,168,83,0.25) 0%,transparent 60%)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',background:'rgba(212,168,83,0.18)',border:'1px solid rgba(212,168,83,0.4)',borderRadius:100,fontSize:11,fontWeight:700,color:'#E8CFA0',letterSpacing:1.2,marginBottom:20,textTransform:'uppercase'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#E8CFA0'}}/>
            Meet your native tutor
          </div>
          <h3 style={{fontSize:'clamp(20px,2.4vw,26px)',fontWeight:700,color:'#fff',marginBottom:24,lineHeight:1.4,letterSpacing:-0.5}}>
            한국인이 자주 놓치는 부분을 정확히 짚어주는,<br/>
            <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',color:'#E8CFA0',fontWeight:500}}>6년 경력의 원어민 튜터</span>
          </h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:18}}>
            {[
              {k:'학력',v:'캐나다 명문대 생물의학 전공',sub:'QS 세계대학 Top 150'},
              {k:'경력',v:'영어 스피킹 전문 지도 6년+',sub:'대기업·임원 대상 티칭 경험'},
              {k:'언어',v:'영어 · 한국어 · 중국어 유창',sub:'한국인의 학습 맥락 이해'},
            ].map((r,i)=>(
              <div key={i} style={{padding:'18px 20px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,backdropFilter:'blur(10px)'}}>
                <p style={{fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1.5,marginBottom:8,textTransform:'uppercase'}}>{r.k}</p>
                <p style={{fontSize:14,color:'#fff',fontWeight:600,marginBottom:4,lineHeight:1.4}}>{r.v}</p>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.55)',lineHeight:1.5}}>{r.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 피드백 샘플 */}
      <FeedbackSample/>
    </Sec>

    {/* ━ 10. LEARNING LOOP — 선순환 사이클 다이어그램 ━ */}
    <Sec label="THE LEARNING LOOP" title={<>4주 내내 돌아가는<br/>선순환 사이클</>} sub="매주 같은 구조로 반복돼요. 인풋으로 시작해서 피드백으로 닫히고, 그 피드백이 다시 다음 주의 인풋이 돼요. 4번 돌리면 습관이 남아요.">
      <div style={{maxWidth:820,margin:'0 auto'}}>
        <div style={{position:'relative',background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,overflow:'hidden',boxShadow:T.shadow}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',position:'relative'}} className="loop-grid">
            {[
              {step:'01',label:'INPUT',title:'인풋',desc:'TED 듣기 · 노트테이킹으로 이해가능한 입력(i+1) 쌓기'},
              {step:'02',label:'UNDERSTANDING',title:'이해',desc:'오답노트 · 표현 분석으로 안 들린 이유를 구조화'},
              {step:'04',label:'FEEDBACK',title:'피드백',desc:'원어민 서면 피드백 + 동료 피어 피드백으로 기준 수립'},
              {step:'03',label:'OUTPUT',title:'아웃풋',desc:'쉐도잉 녹음 · 3분 스피치로 내 말로 재생산'},
            ].map((n,i)=>{
              const isRight=i%2===1, isBottom=i>=2
              return(
                <div key={n.step} style={{padding:'44px 36px 40px',minHeight:220,display:'flex',flexDirection:'column',justifyContent:'center',borderRight:!isRight?`1px solid ${T.border}`:'none',borderBottom:!isBottom?`1px solid ${T.border}`:'none',textAlign:'center',position:'relative'}}>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:T.gold,lineHeight:1,marginBottom:10,letterSpacing:-0.5}}>{n.step}</p>
                  <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:2.2,marginBottom:8,textTransform:'uppercase'}}>{n.label}</p>
                  <h4 style={{fontSize:'clamp(18px,2.2vw,22px)',fontWeight:800,color:T.txt,marginBottom:12,letterSpacing:-0.4}}>{n.title}</h4>
                  <p style={{fontSize:13,color:T.txtS,lineHeight:1.75,maxWidth:260,margin:'0 auto'}}>{n.desc}</p>
                </div>
              )
            })}
            {/* 중앙 원형 장식 */}
            <div className="loop-center" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:64,height:64,borderRadius:'50%',background:`radial-gradient(circle at 30% 30%,#E8CFA0,#B8860B)`,boxShadow:'0 4px 16px rgba(184,134,11,0.35), 0 0 0 8px #fff',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 3 21 9 15 9"/></svg>
            </div>
            {/* 화살표: 01→02 (상단 가로) */}
            <svg className="loop-arrow" style={{position:'absolute',top:'calc(25% - 12px)',left:'50%',transform:'translateX(-50%)',zIndex:2}} width="40" height="24" viewBox="0 0 40 24" fill="none"><path d="M4 12 H34" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/><path d="M28 5 L36 12 L28 19" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            {/* 화살표: 02→03 (우측 세로) */}
            <svg className="loop-arrow" style={{position:'absolute',top:'50%',right:'calc(0% + 12px)',transform:'translateY(-50%) rotate(90deg)',zIndex:2}} width="40" height="24" viewBox="0 0 40 24" fill="none"><path d="M4 12 H34" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/><path d="M28 5 L36 12 L28 19" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            {/* 화살표: 03→04 (하단 가로, 우→좌) */}
            <svg className="loop-arrow" style={{position:'absolute',bottom:'calc(25% - 12px)',left:'50%',transform:'translateX(-50%) rotate(180deg)',zIndex:2}} width="40" height="24" viewBox="0 0 40 24" fill="none"><path d="M4 12 H34" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/><path d="M28 5 L36 12 L28 19" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            {/* 화살표: 04→01 (좌측 세로, 아래→위) */}
            <svg className="loop-arrow" style={{position:'absolute',top:'50%',left:'calc(0% + 12px)',transform:'translateY(-50%) rotate(-90deg)',zIndex:2}} width="40" height="24" viewBox="0 0 40 24" fill="none"><path d="M4 12 H34" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/><path d="M28 5 L36 12 L28 19" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </div>
        </div>

        {/* 하단 callout — 피드백→인풋 메시지 + 피어 피드백 통합 */}
        <div style={{marginTop:28,padding:'28px 32px',background:'rgba(184,134,11,0.06)',border:`1px solid rgba(184,134,11,0.22)`,borderLeft:`4px solid ${T.gold}`,borderRadius:12}}>
          <p style={{fontSize:'clamp(15px,1.8vw,17px)',color:T.txt,lineHeight:1.85,fontWeight:500}}>
            <strong style={{color:T.gold,fontWeight:700}}>피드백 → 다시 인풋</strong>으로 돌아가요. 이번 주의 교정이 다음 주의 시작점이 되는 구조예요. 피드백 단계에는 원어민 서면 피드백과 동료의 피어 피드백이 함께 이루어져, 평가가 아니라 서로의 스피치를 거울 삼아 배웁니다.
          </p>
        </div>
      </div>
      <style>{`@media(max-width:640px){.loop-grid{grid-template-columns:1fr!important;grid-template-rows:repeat(4,1fr)!important}.loop-center,.loop-arrow{display:none!important}}`}</style>
    </Sec>

    {/* ━ 10.5 REAL COMMUNITY — 피어 피드백 예시 ━ */}
    <Sec label="PEER FEEDBACK" title={<>혼자가 아니에요,<br/>동료와 함께 봐줘요</>} sub="스터디 동료들이 서로의 스피치를 함께 보고 의견을 나눠요. 아래는 실제 1기 커뮤니티에서 발췌한 피어 피드백 예시예요. 개인정보 보호를 위해 이름·정보는 모두 가렸어요.">
      <figure style={{margin:'0 auto',maxWidth:580,borderRadius:16,overflow:'hidden',border:`1px solid ${T.border}`,boxShadow:T.shadow,background:'#1e1f22'}}>
        <img src="/proof/peer-feedback.webp" alt="실제 1기 커뮤니티의 피어 피드백 예시" loading="lazy" style={{width:'100%',display:'block'}}/>
      </figure>
    </Sec>

    {/* ━ 11. TESTIMONIALS — 1기 후기 (롤링) ━ */}
    <Sec label="TESTIMONIALS" title={<>1기가 직접 남긴 후기</>} sub="실제 1기 멤버들이 커뮤니티에 남긴 회고와 후기에서 발췌했어요. 개인정보 보호를 위해 이름·정보는 모두 가렸어요." maxW={1200}>
      <TestimonialCarousel/>
    </Sec>

    {/* ━ 12. BEFORE/AFTER ━ */}
    <Sec label="TRANSFORMATION" title={<>4주 후,<br/>이런 변화가 생겨요</>} bg={T.bgWarm} maxW={960}>
      <div style={{display:'grid',gap:16}}>
        {beforeAfter.map((ba,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:0,background:T.border,borderRadius:16,overflow:'hidden',boxShadow:T.shadow,alignItems:'stretch'}} className="ba-row">
            <div style={{background:T.bgSoft,padding:'28px 30px'}}>
              <p style={{fontSize:11,fontWeight:700,color:T.txtD,letterSpacing:1.5,marginBottom:10,textTransform:'uppercase'}}>Before</p>
              <p style={{fontSize:15,color:T.txtS,lineHeight:1.75}}>{ba.b}</p>
            </div>
            <div style={{background:T.bgCard,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 16px',minWidth:50}}>
              <div style={{fontSize:20,color:T.gold}}>→</div>
            </div>
            <div style={{background:'#FFFDF7',padding:'28px 30px'}}>
              <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1.5,marginBottom:10,textTransform:'uppercase'}}>After</p>
              <p style={{fontSize:15,color:T.txt,lineHeight:1.75,fontWeight:500}}>{ba.a}</p>
            </div>
          </div>
        ))}
      </div>
    </Sec>

    {/* ━ 13. PRICING — 1기 메인, 2/3기는 하단에 작게 ━ */}
    <Sec label="YOUR 4 WEEKS" title={<>4주 뒤, 당신의 영어가<br/>달라져 있을 겁니다</>} sub="이 시스템에 투자하는 4주가 혼자 흘려보내는 6개월을 바꿉니다.">
      <PricingCards nav={nav}/>
      <p style={{textAlign:'center',fontSize:13,color:T.txtD,marginTop:36,lineHeight:2}}>
        * 신청 인원이 많아지면 <strong style={{color:T.txt}}>30명 내외의 소그룹</strong>으로 나누어, 모두가 밀착 케어를 받도록 운영해요.<br/>
        * 완주자에게는 alumni 네트워킹 모임 참여 우선권이 제공돼요.<br/>
        ※ 신청 페이지에서 결제와 함께 진행돼요.<br/>
        ※ 결제 후 환불은 불가해요.
      </p>
    </Sec>

    {/* ━ 14. TIMELINE — 심플 리스트 ━ */}
    <Sec label="SCHEDULE" title="모집 일정" bg={T.bgWarm} maxW={820}>
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:'12px 40px',boxShadow:T.shadow}}>
        {timeline.map((t,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'24px 0',borderBottom:i<timeline.length-1?`1px solid ${T.border}`:'none',gap:20,flexWrap:'wrap'}} className="tl-row">
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <span style={{width:10,height:10,borderRadius:'50%',background:t.active?T.gold:T.borderH,flexShrink:0,boxShadow:t.active?`0 0 0 4px rgba(184,134,11,0.12)`:'none'}}/>
              <span style={{fontSize:'clamp(15px,1.7vw,17px)',fontWeight:700,color:T.txt,letterSpacing:-0.3}}>{t.label}</span>
            </div>
            <span style={{fontSize:'clamp(14px,1.6vw,16px)',color:T.txtS,fontWeight:500,textAlign:'right'}}>{t.date}</span>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:560px){.tl-row{justify-content:flex-start!important}}`}</style>
    </Sec>

    {/* ━ 15. FAQ ━ */}
    <Sec label="FAQ" title="자주 묻는 질문" maxW={800}>
      <div>
        {faqs.map(([q,a],i)=>(<div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'28px 32px',marginBottom:14,boxShadow:T.shadow}}>
          <p style={{fontSize:17,fontWeight:700,color:T.txt,marginBottom:12,letterSpacing:-0.3}}>Q. {q}</p>
          <p style={{fontSize:15,color:T.txtS,lineHeight:1.85}}>{a}</p>
        </div>))}
      </div>
    </Sec>

    {/* ━ 16. FINAL CTA ━ */}
    <section style={{padding:'120px 24px 140px',textAlign:'center'}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <h2 style={{fontSize:'clamp(28px,4vw,42px)',fontWeight:800,color:T.txt,marginBottom:20,letterSpacing:-1.2,lineHeight:1.25}}>준비되셨나요?</h2>
        <p style={{fontSize:'clamp(15px,1.8vw,18px)',color:T.txtS,marginBottom:40,lineHeight:1.8}}>
          신청 페이지에서 설문 작성과 결제가 한 번에 이루어져요.<br/>
          인원이 많아도 <strong style={{color:T.txt}}>30명 내외 소그룹</strong>으로 나누어 끝까지 밀착 케어해요.
        </p>
        <button onClick={goToLatpeed} style={{padding:'18px 40px',background:T.navy,color:'#fff',fontSize:16,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer',boxShadow:T.shadowH}}>2기 신청하기 →</button>
        <p style={{fontSize:13,color:T.txtD,marginTop:18}}>30명 내외 소그룹 · 결제 후 환불 불가</p>
      </div>
    </section>

    <style>{`
      @media(max-width:720px){
        .diff-row,.ba-row{grid-template-columns:1fr!important;}
        .method-row{grid-template-columns:1fr!important;gap:16px!important;}
      }
    `}</style>
  </div>)
}


// ━━━━━━━━━━━━━━━━━━━━━━━━
// BLOG / POST / EBOOKS / LOGIN / CONSENT / ADMIN
// ━━━━━━━━━━━━━━━━━━━━━━━━

function BlogList({nav}){
  const [filter,setFilter]=useState('all')
  const series=['all',...new Set(COLUMNS.map(c=>c.series))]
  const list=filter==='all'?COLUMNS:COLUMNS.filter(c=>c.series===filter)
  return(<div style={{padding:'80px 24px 60px',maxWidth:800,margin:'0 auto'}}>
    <h2 style={{fontSize:32,fontWeight:800,color:T.txt,marginBottom:10}}>칼럼</h2>
    <p style={{fontSize:14,color:T.txtS,marginBottom:28}}>영어, 커리어, 시스템에 대한 솔직한 이야기. <span style={{color:T.gold,fontWeight:600}}>전체 본문은 가입 후 읽을 수 있습니다.</span></p>
    <div style={{display:'flex',gap:6,marginBottom:32,flexWrap:'wrap'}}>
      {series.map(s=>(<button key={s} onClick={()=>setFilter(s)} style={{padding:'6px 14px',background:filter===s?T.navy:T.bg,border:`1px solid ${filter===s?T.navy:T.border}`,borderRadius:100,color:filter===s?'#fff':T.txtS,fontSize:11,fontWeight:500,cursor:'pointer'}}>{s==='all'?'전체':s}</button>))}
    </div>
    {list.map(c=>(<div key={c.id} onClick={()=>nav('blog',c.id)} style={{padding:'20px 0',borderBottom:`1px solid ${T.border}`,cursor:'pointer',display:'flex',gap:16}}>
      <span style={{fontSize:11,color:T.txtD,flexShrink:0,marginTop:4,minWidth:75}}>{c.date}</span>
      <div><span style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1,textTransform:'uppercase'}}>{c.tag} · {c.num}</span><h3 style={{fontSize:16,fontWeight:700,color:T.txt,margin:'6px 0 4px'}}>{c.title}</h3><p style={{fontSize:13,color:T.txtS,lineHeight:1.6}}>{c.summary}</p></div>
    </div>))}
  </div>)
}

function Post({post,nav,auth}){
  const copy=()=>{navigator.clipboard?.writeText(window.location.href)}
  const ok=auth.isLoggedIn&&auth.profile?.privacy_consent
  const pre=post.content.slice(0,PREVIEW_CHARS)
  const more=post.content.length>PREVIEW_CHARS
  return(<article style={{padding:'80px 24px 60px',maxWidth:680,margin:'0 auto'}}>
    <button onClick={()=>nav('blog')} style={{background:'none',border:'none',color:T.gold,fontSize:12,cursor:'pointer',marginBottom:28,fontWeight:600}}>← 칼럼 목록</button>
    <span style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.2,textTransform:'uppercase'}}>{post.series} · COLUMN {post.num}</span>
    <h1 style={{fontSize:'clamp(24px,4vw,36px)',fontWeight:800,color:T.txt,margin:'12px 0 10px',lineHeight:1.25,letterSpacing:-1}}>{post.title}</h1>
    <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:40}}><span style={{fontSize:12,color:T.txtD}}>{post.date}</span><button onClick={copy} style={{background:T.bg,border:`1px solid ${T.border}`,color:T.txtS,padding:'4px 10px',borderRadius:6,fontSize:10,cursor:'pointer'}}>링크 복사</button></div>
    {ok?(<div style={{fontSize:16,color:T.txt,lineHeight:2,whiteSpace:'pre-wrap'}}>{post.content}</div>):(
      <><div style={{position:'relative'}}><div style={{fontSize:16,color:T.txt,lineHeight:2,whiteSpace:'pre-wrap'}}>{pre}{more&&'…'}</div>{more&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:140,background:`linear-gradient(180deg,transparent,${T.bg})`,pointerEvents:'none'}}/>}</div>
      <div style={{marginTop:40,padding:40,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:16,textAlign:'center'}}><Flame size={36}/><p style={{fontSize:17,fontWeight:700,color:T.txt,margin:'16px 0 8px'}}>전체 내용은 가입 후 읽을 수 있습니다</p><p style={{fontSize:13,color:T.txtS,marginBottom:24,lineHeight:1.7}}>Google 계정으로 1초 만에 시작하세요. 무료입니다.</p><button onClick={()=>nav('login')} style={{padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>가입하고 전체 읽기 →</button></div></>
    )}
    <div style={{marginTop:56,padding:32,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:16,textAlign:'center'}}><Flame size={28}/><p style={{fontSize:15,fontWeight:700,color:T.txt,margin:'12px 0 6px'}}>조용한 야망가들</p><p style={{fontSize:12,color:T.txtS,marginBottom:18}}>@kglobal.tech.girl</p><button onClick={()=>nav('ted-program')} style={{padding:'10px 22px',background:T.bg,color:T.txt,border:`1px solid ${T.borderH}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>TED 스터디 보기 →</button></div>
  </article>)
}

function Ebooks({preview,setPreview,nav}){
  return(<div style={{padding:'80px 24px 60px',maxWidth:900,margin:'0 auto'}}>
    <h2 style={{fontSize:32,fontWeight:800,color:T.txt,marginBottom:10}}>전자책</h2>
    <p style={{fontSize:14,color:T.txtS,marginBottom:32}}>조용한 야망가들의 이야기를 깊이 읽어보세요.</p>
    {EBOOKS.map(b=>(<div key={b.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:32,marginBottom:20,boxShadow:T.shadow}}>
      <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
        <div style={{width:120,height:160,background:`linear-gradient(135deg,${T.cream},#fff)`,border:`1px solid ${T.border}`,borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0,padding:14}}><Flame size={32}/><p style={{fontSize:9,color:T.gold,marginTop:8,textAlign:'center',lineHeight:1.3,fontFamily:"'Playfair Display',serif",fontStyle:'italic'}}>{b.title}</p></div>
        <div style={{flex:1,minWidth:220}}><h3 style={{fontSize:20,fontWeight:800,color:T.txt,marginBottom:5}}>{b.title}</h3><p style={{fontSize:13,color:T.gold,marginBottom:12,fontWeight:600}}>{b.subtitle} · {b.chapters}챕터</p><p style={{fontSize:14,color:T.txtS,lineHeight:1.7,marginBottom:18}}>{b.desc}</p>
          <div style={{display:'flex',gap:8}}><button onClick={()=>setPreview(preview===b.id?null:b.id)} style={{padding:'8px 18px',background:preview===b.id?T.navy:T.bg,color:preview===b.id?'#fff':T.txt,border:`1px solid ${preview===b.id?T.navy:T.borderH}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>{preview===b.id?'닫기':'미리보기'}</button><span style={{padding:'8px 18px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,color:T.txtS}}>출간 준비 중</span></div>
        </div>
      </div>
      {preview===b.id&&(<div style={{marginTop:24,padding:24,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}><p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1.2,marginBottom:12,textTransform:'uppercase'}}>PREVIEW</p><div style={{fontSize:14,color:T.txt,lineHeight:2,whiteSpace:'pre-wrap'}}>{b.preview}</div><p style={{fontSize:12,color:T.txtD,marginTop:16,textAlign:'center',fontStyle:'italic'}}>— 전체 내용은 출간 후 공개됩니다 —</p></div>)}
    </div>))}
  </div>)
}

function Login({auth,nav}){
  if(auth.isLoggedIn&&auth.profile?.privacy_consent)return(<div style={{padding:'100px 24px',maxWidth:420,margin:'0 auto',textAlign:'center'}}><Flame size={44}/><h2 style={{fontSize:22,fontWeight:800,color:T.txt,margin:'18px 0 8px'}}>이미 로그인되어 있습니다</h2><p style={{fontSize:14,color:T.txtS,marginBottom:28}}>{auth.user?.email}</p><button onClick={()=>nav('home')} style={{padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>홈으로</button></div>)
  return(<div style={{padding:'100px 24px',maxWidth:420,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={44}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10}}>로그인 / 회원가입</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginBottom:36,lineHeight:1.7}}>Google 계정으로 1초 만에 시작하세요.</p>
    {!auth.supabaseReady&&<div style={{padding:16,background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,marginBottom:20}}><p style={{fontSize:12,color:'#991B1B',lineHeight:1.6}}>⚠ Supabase 환경변수가 설정되지 않았습니다.</p></div>}
    <button onClick={auth.signInWithGoogle} disabled={!auth.supabaseReady} style={{width:'100%',padding:14,background:T.bg,color:T.txt,fontSize:14,fontWeight:600,border:`1px solid ${T.borderH}`,borderRadius:10,cursor:auth.supabaseReady?'pointer':'not-allowed',opacity:auth.supabaseReady?1:0.5,display:'flex',alignItems:'center',justifyContent:'center',gap:12,boxShadow:T.shadow}}>
      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6 5.1C40.7 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
      Google로 시작하기
    </button>
    <p style={{fontSize:11,color:T.txtD,textAlign:'center',marginTop:28}}>가입 시 <a href="#consent" style={{color:T.gold,fontWeight:600}}>개인정보 수집·이용</a>에 동의하게 됩니다.</p>
  </div>)
}

function ConsentPage({auth,nav}){
  const [p,setP]=useState(false),[m,setM]=useState(false),[sub,setSub]=useState(false),[err,setErr]=useState('')
  if(!auth.isLoggedIn)return(<div style={{padding:'100px 24px',textAlign:'center'}}><p style={{fontSize:14,color:T.txtS}}>먼저 로그인이 필요합니다.</p><button onClick={()=>nav('login')} style={{marginTop:20,padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>로그인</button></div>)
  if(auth.profile?.privacy_consent)return(<div style={{padding:'100px 24px',textAlign:'center'}}><Flame size={40}/><p style={{fontSize:17,color:T.txt,margin:'16px 0 8px',fontWeight:700}}>이미 동의 완료</p><button onClick={()=>nav('home')} style={{marginTop:16,padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>홈으로</button></div>)
  const go=async()=>{if(!p){setErr('필수 항목에 동의해주세요.');return}setSub(true);setErr('');const{error}=await auth.saveConsent(true,m);setSub(false);if(error){setErr('저장 오류.');return}nav('home')}
  return(<div style={{padding:'80px 24px',maxWidth:680,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:32}}>개인정보 수집·이용 동의</h2>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:16,boxShadow:T.shadow}}>
      <p style={{fontSize:14,fontWeight:700,color:T.gold,marginBottom:16}}>[필수] 개인정보 수집·이용 동의</p>
      <table style={{width:'100%',fontSize:12,color:T.txtS,lineHeight:1.7,borderCollapse:'collapse'}}><tbody>
        <tr><td style={{padding:'6px 0',color:T.txt,width:100,fontWeight:600}}>수집 항목</td><td>이름, 이메일, 프로필 사진</td></tr>
        <tr><td style={{padding:'6px 0',color:T.txt,fontWeight:600}}>수집 목적</td><td>계정 관리, 프로그램 이용</td></tr>
        <tr><td style={{padding:'6px 0',color:T.txt,fontWeight:600}}>보유 기간</td><td>탈퇴 시 또는 3년</td></tr>
        <tr><td style={{padding:'6px 0',color:T.txt,fontWeight:600}}>제3자 제공</td><td>Supabase, Google</td></tr>
      </tbody></table>
      <label style={{display:'flex',alignItems:'center',gap:10,marginTop:20,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,borderRadius:8}}><input type="checkbox" checked={p} onChange={e=>setP(e.target.checked)} style={{width:18,height:18,accentColor:T.gold}}/><span style={{fontSize:13,color:T.txt,fontWeight:600}}>위 내용에 동의합니다 (필수)</span></label>
    </div>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:24,boxShadow:T.shadow}}>
      <p style={{fontSize:14,fontWeight:700,color:T.txtS,marginBottom:12}}>[선택] 마케팅 정보 수신 동의</p>
      <p style={{fontSize:12,color:T.txtS,lineHeight:1.7,marginBottom:14}}>새 칼럼, 프로그램 안내 등 홍보성 이메일 수신. 언제든 거부 가능.</p>
      <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,borderRadius:8}}><input type="checkbox" checked={m} onChange={e=>setM(e.target.checked)} style={{width:18,height:18,accentColor:T.gold}}/><span style={{fontSize:13,color:T.txt}}>마케팅 수신 동의 (선택)</span></label>
    </div>
    {err&&<p style={{fontSize:12,color:'#DC2626',textAlign:'center',marginBottom:12}}>{err}</p>}
    <button onClick={go} disabled={sub} style={{width:'100%',padding:15,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:sub?'wait':'pointer',opacity:sub?0.6:1}}>{sub?'저장 중...':'동의하고 시작하기'}</button>
  </div>)
}

function Apply({nav}){
  const [f,setF]=useState({name:'',email:'',phone:'',job:'',source:'',message:''})
  const [pc,setPc]=useState(false),[mc,setMc]=useState(false)
  const [sub,setSub]=useState(false),[err,setErr]=useState(''),[done,setDone]=useState(false)
  const set=k=>e=>setF(s=>({...s,[k]:e.target.value}))
  const Lbl=({children,req})=>(<label style={{display:'block',fontSize:13,fontWeight:600,color:T.txt,marginBottom:7}}>{children}{req&&<span style={{color:T.gold,marginLeft:3}}>*</span>}</label>)

  const submit=async()=>{
    setErr('')
    if(!f.name.trim())return setErr('이름을 입력해 주세요.')
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim()))return setErr('올바른 이메일 주소를 입력해 주세요.')
    if(!f.phone.trim())return setErr('연락처를 입력해 주세요.')
    if(!pc)return setErr('개인정보 수집·이용에 동의해 주세요.')
    setSub(true)
    try{
      const r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f,marketingConsent:mc})})
      const data=await r.json().catch(()=>({}))
      setSub(false)
      if(!r.ok||!data.ok)return setErr(data.error||'신청 처리 중 오류가 발생했어요.')
      setDone(true);window.scrollTo(0,0)
    }catch{setSub(false);setErr('네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.')}
  }

  if(done)return(<div style={{padding:'100px 24px',maxWidth:480,margin:'0 auto',textAlign:'center'}}>
    <Flame size={48}/>
    <h2 style={{fontSize:24,fontWeight:800,color:T.txt,margin:'20px 0 12px'}}>사전신청이 완료되었어요!</h2>
    <p style={{fontSize:14,color:T.txtS,lineHeight:1.8,marginBottom:32}}>2기 모집과 결제 오픈 소식을<br/>이메일·문자로 가장 먼저 보내드릴게요.</p>
    <button onClick={()=>nav('home')} style={{padding:'13px 30px',background:T.navy,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>홈으로</button>
  </div>)

  return(<div style={{padding:'72px 24px',maxWidth:560,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:14}}><Flame size={42}/></div>
    <h2 style={{fontSize:28,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10,letterSpacing:-0.5}}>TED 올인원 스터디 2기 사전신청</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',lineHeight:1.7,marginBottom:28}}>지금 신청하시면 <strong style={{color:T.txt}}>2기 모집 시작과 결제 오픈</strong>을<br/>이메일·문자로 가장 먼저 안내드려요.</p>

    <div style={{background:T.bgWarm,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px',marginBottom:28}}>
      <p style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:12,textTransform:'uppercase'}}>사전신청 혜택</p>
      {['2기 모집·결제 오픈 가장 먼저 안내','사전신청자 한정 얼리버드 소식','상세 학습 가이드북 등 자료 우선 제공'].map(t=>(
        <p key={t} style={{fontSize:13,color:T.txtS,lineHeight:1.9,display:'flex',gap:8}}><span style={{color:T.gold}}>✓</span>{t}</p>
      ))}
    </div>

    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div><Lbl req>이름</Lbl><In value={f.name} onChange={set('name')} placeholder="홍길동"/></div>
      <div><Lbl req>이메일</Lbl><In type="email" value={f.email} onChange={set('email')} placeholder="you@example.com"/></div>
      <div><Lbl req>연락처</Lbl><In type="tel" value={f.phone} onChange={set('phone')} placeholder="01012345678"/><p style={{fontSize:12,color:T.txtD,marginTop:6}}>모집·결제 오픈 소식을 문자로 가장 먼저 안내드려요.</p></div>
      <div><Lbl>현재 상황</Lbl><Sel value={f.job} onChange={set('job')}><option value="">선택해 주세요</option><option>직장인</option><option>1인 사업·프리랜서</option><option>창업 준비 중</option><option>학생·취준생</option><option>기타</option></Sel></div>
      <div><Lbl>어떻게 알게 되셨나요</Lbl><Sel value={f.source} onChange={set('source')}><option value="">선택해 주세요</option><option>인스타그램</option><option>유튜브</option><option>지인 추천</option><option>검색</option><option>기타</option></Sel></div>
      <div><Lbl>관심 티어</Lbl><Sel value={f.message} onChange={set('message')}><option value="">선택해 주세요</option><option>베이직 · 원어민 서면 첨삭 (₩159,200)</option><option>프리미엄 · 1:1 음성 진단 (₩299,000)</option><option>아직 고민 중</option></Sel></div>
    </div>

    <div style={{marginTop:24,display:'flex',flexDirection:'column',gap:10}}>
      <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',padding:'13px 15px',background:T.bgSoft,borderRadius:8}}>
        <input type="checkbox" checked={pc} onChange={e=>setPc(e.target.checked)} style={{width:18,height:18,accentColor:T.gold,marginTop:1,flexShrink:0}}/>
        <span style={{fontSize:13,color:T.txt,lineHeight:1.6}}><strong>[필수]</strong> 개인정보 수집·이용 동의 <span style={{color:T.txtD}}>(이름·이메일·연락처 / 2기 안내 목적 / 목적 달성 시까지 보유)</span></span>
      </label>
      <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',padding:'13px 15px',background:T.bgSoft,borderRadius:8}}>
        <input type="checkbox" checked={mc} onChange={e=>setMc(e.target.checked)} style={{width:18,height:18,accentColor:T.gold,marginTop:1,flexShrink:0}}/>
        <span style={{fontSize:13,color:T.txt,lineHeight:1.6}}>[선택] 마케팅·홍보 정보 수신 동의 <span style={{color:T.txtD}}>(이메일·문자 / 언제든 수신거부 가능)</span></span>
      </label>
    </div>

    {err&&<p style={{fontSize:13,color:'#DC2626',textAlign:'center',marginTop:16}}>{err}</p>}
    <button onClick={submit} disabled={sub} style={{width:'100%',marginTop:22,padding:16,background:T.navy,color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:sub?'wait':'pointer',opacity:sub?0.6:1,boxShadow:T.shadowH}}>{sub?'신청 중...':'사전신청 완료하기 →'}</button>
    <p style={{fontSize:11,color:T.txtD,textAlign:'center',marginTop:14,lineHeight:1.6}}>제출 시 <span onClick={()=>nav('consent')} style={{color:T.gold,cursor:'pointer',fontWeight:600}}>개인정보 처리방침</span>에 따라 정보가 안전하게 관리됩니다.</p>
  </div>)
}

function ComingSoon({nav}){
  const [email,setEmail]=useState('')
  const [agree,setAgree]=useState(false)
  const [sub,setSub]=useState(false),[err,setErr]=useState(''),[done,setDone]=useState(false)

  const submit=async()=>{
    setErr('')
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))return setErr('올바른 이메일 주소를 입력해 주세요.')
    if(!agree)return setErr('오픈 알림 수신에 동의해 주세요.')
    setSub(true)
    try{
      const r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),marketingConsent:true})})
      const data=await r.json().catch(()=>({}))
      setSub(false)
      if(!r.ok||!data.ok)return setErr(data.error||'신청 처리 중 오류가 발생했어요.')
      setDone(true);window.scrollTo(0,0)
    }catch{setSub(false);setErr('네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.')}
  }

  if(done)return(<div style={{padding:'120px 24px',maxWidth:480,margin:'0 auto',textAlign:'center'}}>
    <Flame size={48}/>
    <h2 style={{fontSize:24,fontWeight:800,color:T.txt,margin:'20px 0 12px'}}>알림 신청이 완료됐어요!</h2>
    <p style={{fontSize:14,color:T.txtS,lineHeight:1.8,marginBottom:32}}>2기 오픈 소식을<br/>이메일로 가장 먼저 보내드릴게요.</p>
    <button onClick={()=>nav('home')} style={{padding:'13px 30px',background:T.navy,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>홈으로</button>
  </div>)

  return(<div style={{padding:'120px 24px 100px',maxWidth:520,margin:'0 auto',textAlign:'center'}}>
    <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 18px',background:T.bgWarm,border:`1px solid ${T.border}`,borderRadius:100,fontSize:11,color:T.gold,marginBottom:28,letterSpacing:1.5,fontWeight:700}}><span style={{width:6,height:6,borderRadius:'50%',background:T.gold}}/>COMING SOON</div>
    <div style={{marginBottom:18}}><Flame size={52}/></div>
    <h1 style={{fontSize:'clamp(28px,5vw,40px)',fontWeight:800,color:T.txt,lineHeight:1.2,marginBottom:16,letterSpacing:-1}}>TED 올인원 스터디 2기<br/>곧 공개됩니다</h1>
    <p style={{fontSize:15,color:T.txtS,lineHeight:1.8,maxWidth:420,margin:'0 auto 36px'}}>지금 막바지 준비 중이에요.<br/>이메일을 남겨주시면 <strong style={{color:T.txt}}>모집 오픈 소식을 가장 먼저</strong> 보내드릴게요.</p>

    <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:380,margin:'0 auto'}}>
      <In type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{textAlign:'center'}}/>
      <label style={{display:'flex',alignItems:'flex-start',gap:9,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,borderRadius:8,textAlign:'left'}}>
        <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} style={{width:18,height:18,accentColor:T.gold,marginTop:1,flexShrink:0}}/>
        <span style={{fontSize:12.5,color:T.txt,lineHeight:1.6}}>오픈 알림 수신에 동의합니다 <span style={{color:T.txtD}}>(이메일 / 언제든 수신거부 가능)</span></span>
      </label>
      {err&&<p style={{fontSize:13,color:'#DC2626'}}>{err}</p>}
      <button onClick={submit} disabled={sub} style={{padding:15,background:T.navy,color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:sub?'wait':'pointer',opacity:sub?0.6:1,boxShadow:T.shadowH}}>{sub?'신청 중...':'오픈 알림 신청 →'}</button>
    </div>
    <p style={{fontSize:11,color:T.txtD,marginTop:18,lineHeight:1.6}}>제출 시 <span onClick={()=>nav('consent')} style={{color:T.gold,cursor:'pointer',fontWeight:600}}>개인정보 처리방침</span>에 따라 안전하게 관리됩니다.</p>
  </div>)
}


// ─── PRICING CARDS ───
function PricingCards({nav}){
  // 공통 베이스 혜택 (Tier 1에 전부 포함, Tier 2·3에도 계승)
  const base=[
    '4주 TED 올인원 스터디 루틴 (인풋 + 아웃풋 통합 설계)',
    '매주 엄선된 TED Talk 영상 제공',
    '과제 완료 실시간 트래킹',
    '매주 1회 피어 피드백 시스템',
    '스터디 전용 디스코드 커뮤니티 + 질문방',
    '4주 완주 포트폴리오',
  ]
  const writtenFb='원어민 튜터 1:1 서면 첨삭 (주 1회 · 문장·표현 교정)'
  const audioFb='원어민 튜터 1:1 음성 진단 (주 1회 · 발음·억양·전달력)'
  const bonus='상세 학습 가이드북 (보너스 제공)'
  const tier3Extra=[
    '매주 원어민 라이브 코칭',
    '1:1 컨설팅 총 2회 (원어민 온보딩 1회 + Grace 중간 점검 1회)',
    '전자책 《영어를 커리어 무기로 바꾼》 (89p) 제공',
  ]

  const Item=({text,hl})=>(
    <li style={{fontSize:13,color:hl?T.txt:T.txtS,padding:'10px 0',borderBottom:`1px solid ${T.border}`,display:'flex',gap:8,alignItems:'flex-start',fontWeight:hl?600:400}}>
      <span style={{color:hl?T.gold:T.txtD,flexShrink:0,marginTop:1}}>✓</span>
      <span style={hl?{background:'rgba(184,134,11,0.12)',padding:'1px 6px',borderRadius:4,marginLeft:-2}:{}}>{text}</span>
    </li>
  )

  return(<div style={{maxWidth:880,margin:'0 auto'}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,alignItems:'start'}} className="price-grid">
      {/* Tier 1 — 베이직 */}
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:'40px 32px',position:'relative',boxShadow:T.shadow,wordBreak:'keep-all',lineBreak:'strict'}}>
        <div style={{marginBottom:24}}>
          <p style={{fontSize:11,fontWeight:700,color:T.txtD,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>BASIC</p>
          <p style={{fontSize:15,color:T.gold,fontWeight:700,marginBottom:6}}>베이직 · 원어민 서면 첨삭</p>
          <p style={{fontSize:13,color:T.txtS,marginBottom:18}}>문장·표현 교정 · 4주</p>
          <p style={{fontSize:13,color:T.txtD,textDecoration:'line-through',marginBottom:4}}>₩199,000</p>
          <p style={{fontSize:'clamp(28px,3.4vw,36px)',fontWeight:800,color:T.txt,letterSpacing:-1.5,lineHeight:1}}>₩159,200<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <p style={{fontSize:11,color:T.gold,fontWeight:700,marginTop:8,letterSpacing:0.5}}>2기 사전 오픈 · 20% 할인</p>
          <p style={{fontSize:12,color:T.txtD,marginTop:6}}>30명 내외 소그룹</p>
        </div>
        <ul style={{listStyle:'none',padding:0,margin:0}}>
          {base.map(f=><Item key={f} text={f}/>)}
          <Item text={writtenFb}/>
          <Item text={bonus} hl/>
        </ul>
      </div>

      {/* Tier 2 — 프리미엄 */}
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:'40px 32px',position:'relative',boxShadow:T.shadow,wordBreak:'keep-all',lineBreak:'strict'}}>
        <div style={{marginBottom:24}}>
          <p style={{fontSize:11,fontWeight:700,color:T.txtD,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>PREMIUM</p>
          <p style={{fontSize:15,color:T.gold,fontWeight:700,marginBottom:6}}>프리미엄 · 1:1 음성 진단</p>
          <p style={{fontSize:13,color:T.txtS,marginBottom:18}}>발음·억양·전달력까지, 코치가 직접 듣고 녹음으로 짚어드려요</p>
          <p style={{fontSize:'clamp(28px,3.4vw,36px)',fontWeight:800,color:T.txt,letterSpacing:-1.5,lineHeight:1}}>₩299,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <p style={{fontSize:12,color:T.txtD,marginTop:6}}>30명 내외 소그룹</p>
        </div>
        <ul style={{listStyle:'none',padding:0,margin:0}}>
          {base.map(f=><Item key={f} text={f}/>)}
          <Item text={audioFb} hl/>
          <Item text={bonus} hl/>
        </ul>
      </div>
    </div>

    {/* 통합 CTA — 베이직/프리미엄 옵션 선택은 Latpeed에서 */}
    <div style={{marginTop:36,padding:'28px 24px',background:T.bgWarm,border:`1px solid ${T.border}`,borderRadius:16,textAlign:'center',maxWidth:560,margin:'36px auto 0',boxShadow:T.shadow}}>
      <p style={{fontSize:13,color:T.txtS,marginBottom:14,lineHeight:1.6}}>다음 페이지에서 <strong style={{color:T.txt}}>베이직 / 프리미엄 옵션</strong>을 선택하실 수 있어요.</p>
      <button onClick={goToLatpeed} style={{padding:'17px 44px',background:T.navy,color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer',boxShadow:T.shadowH,minWidth:260}}>2기 신청하기 →</button>
    </div>

    {/* Tier 3 — 하단 추후 공지 */}
    <div style={{marginTop:32}}>
      <p style={{fontSize:12,fontWeight:700,color:T.txtD,letterSpacing:1.5,marginBottom:14,textTransform:'uppercase',textAlign:'center'}}>향후 오픈 예정</p>
      <div style={{background:T.bgSoft,border:`1px dashed ${T.border}`,borderRadius:12,padding:'20px 24px',wordBreak:'keep-all',maxWidth:440,margin:'0 auto',textAlign:'center'}}>
        <p style={{fontSize:11,fontWeight:700,color:T.txtS,letterSpacing:0.5,marginBottom:6,textTransform:'uppercase'}}>Tier 3 · 프리미엄 올인원</p>
        <p style={{fontSize:12,color:T.txtS,lineHeight:1.7,marginBottom:4}}>Tier 2 + 라이브 코칭 + 1:1 컨설팅 2회 + 전자책</p>
        <p style={{fontSize:11,color:T.txtD}}>가격 · 일정 추후 공지</p>
      </div>
    </div>
    <style>{`@media(max-width:600px){.price-grid{grid-template-columns:1fr!important}}`}</style>
  </div>)
}

// ─── TESTIMONIAL CAROUSEL — 1기 자발적 후기 롤링 ───
function TestimonialCarousel({compact}){
  const txtItems=TESTIMONIALS_TED1
  const shots=REVIEW_SHOTS
  const len=compact?txtItems.length:shots.length
  const [idx,setIdx]=useState(0)
  const [paused,setPaused]=useState(false)
  const [zoom,setZoom]=useState(null)
  useEffect(()=>{
    if(!compact||paused||len<=1)return
    const id=setInterval(()=>setIdx(i=>(i+1)%len),3500)
    return ()=>clearInterval(id)
  },[paused,compact,len])
  const D={bg:'#313338',name:'#E8CFA0',time:'#949ba4'}
  const Dots=({n})=>(
    <div style={{display:'flex',gap:7,justifyContent:'center',marginTop:compact?18:24}}>
      {Array.from({length:n}).map((_,i)=>(
        <button key={i} onClick={()=>setIdx(i)} aria-label={`후기 ${i+1}`} style={{width:i===idx?22:7,height:7,borderRadius:100,border:'none',padding:0,cursor:'pointer',background:i===idx?T.gold:T.borderH,transition:'all 0.3s'}}/>
      ))}
    </div>
  )

  if(compact){
    const t=txtItems[idx]
    const initial=(t.name||'?').replace(/[()님\s]/g,'').trim().charAt(0)||'·'
    return(
      <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} style={{maxWidth:640,margin:'0 auto'}}>
        <div key={idx} style={{display:'flex',gap:14,background:D.bg,borderRadius:14,padding:'18px 20px',boxShadow:'0 8px 28px rgba(0,0,0,0.14)',animation:'tFade 0.6s ease',textAlign:'left'}}>
          <div style={{width:42,height:42,borderRadius:'50%',background:`linear-gradient(135deg,${T.gold} 0%,${T.goldL} 50%,#E8CFA0 100%)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:17,fontWeight:700,flexShrink:0}}>{initial}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:5,flexWrap:'wrap'}}>
              <span style={{fontSize:14,fontWeight:700,color:D.name}}>{t.name}</span>
              <span style={{fontSize:11,color:D.time}}>{t.date}</span>
            </div>
            <p style={{fontSize:15,color:'#fff',lineHeight:1.5,fontWeight:500}}>"{t.highlight}"</p>
          </div>
        </div>
        <Dots n={txtItems.length}/>
        <style>{`@keyframes tFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    )
  }

  return(<>
    <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} style={{overflow:'hidden',maxWidth:1200,margin:'0 auto',WebkitMaskImage:'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)',maskImage:'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)'}}>
      <div style={{display:'flex',gap:20,width:'max-content',animation:`tMarquee ${shots.length*9}s linear infinite`,animationPlayState:(paused||zoom)?'paused':'running'}}>
        {[...shots,...shots].map((src,i)=>(
          <div key={i} onClick={()=>setZoom(src)} style={{flexShrink:0,width:300,height:430,borderRadius:14,overflow:'hidden',border:`1px solid ${T.border}`,boxShadow:'0 8px 26px rgba(0,0,0,0.10)',background:'#fff',position:'relative',cursor:'zoom-in'}}>
            <img src={src} alt="1기 참가자 후기" loading="lazy" style={{width:'100%',display:'block'}}/>
            <div style={{position:'absolute',left:0,right:0,bottom:0,height:90,background:'linear-gradient(transparent,#fff)',pointerEvents:'none'}}/>
          </div>
        ))}
      </div>
      <p style={{textAlign:'center',fontSize:12,color:T.txtD,marginTop:18}}>후기를 클릭하면 크게 볼 수 있어요</p>
      <style>{`@keyframes tMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
    {zoom&&(
      <div onClick={()=>setZoom(null)} style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,0.86)',display:'flex',alignItems:'center',justifyContent:'center',padding:'4vh 4vw',cursor:'zoom-out'}}>
        <img src={zoom} alt="1기 참가자 후기 확대" style={{maxWidth:'94vw',maxHeight:'92vh',objectFit:'contain',borderRadius:12,boxShadow:'0 24px 70px rgba(0,0,0,0.55)'}}/>
        <button onClick={()=>setZoom(null)} aria-label="닫기" style={{position:'absolute',top:20,right:24,width:42,height:42,borderRadius:'50%',border:'none',background:'rgba(255,255,255,0.15)',color:'#fff',fontSize:22,cursor:'pointer',lineHeight:1}}>×</button>
      </div>
    )}
  </>)
}

// ─── FEEDBACK SAMPLE — 실제 원어민 피드백 캡처 ───
function FeedbackSample(){
  return(<div>
    <figure style={{margin:0,borderRadius:16,overflow:'hidden',border:`1px solid ${T.border}`,boxShadow:T.shadow,background:'#1e1f22'}}>
      <img src="/proof/tutor-feedback.webp" alt="원어민 튜터의 실제 주간 스피치 피드백 — 디스코드 스피치 채널" loading="lazy" style={{width:'100%',display:'block'}}/>
    </figure>
    <p style={{fontSize:13,color:T.txtD,textAlign:'center',marginTop:18,lineHeight:1.8}}>
      실제 1기 <strong style={{color:T.txtS}}>스피치 채널</strong> — 음성으로 제출한 주간 스피치를 원어민 튜터가 직접 듣고, 발음 · 표현 · 구성 · 흐름을 짚어 상세 피드백을 드려요.
    </p>
  </div>)
}

function Admin(){
  return(<div style={{padding:'80px 24px',maxWidth:560,margin:'0 auto'}}>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,marginBottom:20,textAlign:'center'}}>관리자 안내</h2>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:32,boxShadow:T.shadow}}>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>📋 <strong>대기자/회원:</strong> formspree.io</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>👤 <strong>소셜 가입:</strong> Supabase Dashboard</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>📧 <strong>뉴스레터:</strong> Stibee (RSS)</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:10}}>💬 <strong>결제:</strong> Formspree → 확인 → 디스코드 초대</p>
      <div style={{marginTop:24,padding:20,background:T.bgSoft,borderRadius:10}}>
        <p style={{fontSize:12,color:T.gold,fontWeight:700,marginBottom:10}}>1기 운영 워크플로우</p>
        <p style={{fontSize:12,color:T.txtS,lineHeight:1.8}}>1. 사전등록 → Formspree<br/>2. 회원가입 → Supabase<br/>3. 칼럼 → data.js → push → Stibee<br/>4. 결제 → 입금 확인 → 디스코드 초대<br/>5. 향후 사업자등록 시 PortOne 연동</p>
      </div>
    </div>
  </div>)
}
