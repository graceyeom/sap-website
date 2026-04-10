import { useState, useEffect } from 'react'
import { COLUMNS, EBOOKS } from './data'
import { useAuth } from './src/useAuth'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FORMSPREE_WAITLIST = 'https://formspree.io/f/xgopnwdd'
const FORMSPREE_REGISTER = 'https://formspree.io/f/xkopqwya'
const FORMSPREE_PAYMENT  = 'https://formspree.io/f/xgopnwdd'
const BANK_INFO = { bank:'카카오뱅크', account:'0000-00-0000000', holder:'한채연' }
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
  const [formMsg,setFormMsg]=useState('')
  const [ebookPreview,setEbookPreview]=useState(null)

  useEffect(()=>{
    const h=()=>{
      const hash=window.location.hash.slice(1)
      if(hash.startsWith('col-')||(hash.startsWith('ted-')&&hash!=='ted-program')){setPage('blog');setPostId(hash)}
      else if(hash==='ted-program'){setPage('ted-program');setPostId(null)}
      else if(hash==='blog'){setPage('blog');setPostId(null)}
      else if(['register','waitlist','ebooks','admin','login','consent','payment'].includes(hash)){setPage(hash);setPostId(null)}
      else{setPage('home');setPostId(null)}
      window.scrollTo(0,0)
    }
    h();window.addEventListener('hashchange',h);return()=>window.removeEventListener('hashchange',h)
  },[])

  useEffect(()=>{if(auth.needsConsent&&page!=='consent')window.location.hash='consent'},[auth.needsConsent,page])

  const nav=(p,id)=>{window.location.hash=id||p;setFormMsg('')}

  const submitForm=async(e,endpoint)=>{
    e.preventDefault();const fd=new FormData(e.target);const name=fd.get('name')
    if(fd.get('privacy_consent')!=='on'){setFormMsg('개인정보 수집·이용에 동의해주세요.');setTimeout(()=>setFormMsg(''),4000);return}
    try{const res=await fetch(endpoint,{method:'POST',body:fd,headers:{'Accept':'application/json'}});if(res.ok){setFormMsg(`감사합니다, ${name}님!`);e.target.reset()}else setFormMsg('오류가 발생했습니다.')}catch{setFormMsg('네트워크 오류.')}
    setTimeout(()=>setFormMsg(''),6000)
  }

  const post=postId?COLUMNS.find(c=>c.id===postId):null

  return(
    <div style={{background:T.bg,minHeight:'100vh',color:T.txt,fontFamily:"'DM Sans','Noto Sans KR',-apple-system,sans-serif",WebkitFontSmoothing:'antialiased'}}>
      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${T.border}`}}>
        <div style={{width:'100%',maxWidth:1200,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>nav('home')}><Flame size={24}/><span style={{color:T.txt,fontSize:15,fontWeight:800,letterSpacing:-0.3}}>조용한 야망가들</span></div>
          <div style={{display:'flex',gap:28,alignItems:'center'}}>
            <div style={{display:'flex',gap:24,alignItems:'center'}} className="nav-links">
              {[['home','홈'],['blog','칼럼'],['ebooks','전자책'],['ted-program','TED 스터디']].map(([p,l])=>(<button key={p} onClick={()=>nav(p)} style={{background:'none',border:'none',cursor:'pointer',color:page===p?T.txt:T.txtS,fontSize:13,fontWeight:page===p?600:500,padding:0}}>{l}</button>))}
            </div>
            {auth.isLoggedIn?(<div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:12,color:T.txtS,maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{auth.profile?.display_name||auth.user?.email?.split('@')[0]}</span><button onClick={auth.signOut} style={{background:T.bg,border:`1px solid ${T.border}`,color:T.txtS,padding:'6px 12px',borderRadius:6,fontSize:11,fontWeight:500,cursor:'pointer'}}>로그아웃</button></div>):(<button onClick={()=>nav('login')} style={{background:'none',border:'none',color:T.txt,padding:0,fontSize:13,fontWeight:500,cursor:'pointer'}}>로그인</button>)}
            <button onClick={()=>nav('waitlist')} style={{padding:'9px 18px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',boxShadow:T.shadow}}>사전 등록</button>
          </div>
        </div>
      </nav>

      <main>
        {page==='home'&&<Home nav={nav}/>}
        {page==='blog'&&(post?<Post post={post} nav={nav} auth={auth}/>:<BlogList nav={nav}/>)}
        {page==='ebooks'&&<Ebooks preview={ebookPreview} setPreview={setEbookPreview} nav={nav}/>}
        {page==='ted-program'&&<TedProgram nav={nav}/>}
        {page==='login'&&<Login auth={auth} nav={nav}/>}
        {page==='consent'&&<ConsentPage auth={auth} nav={nav}/>}
        {page==='payment'&&<PaymentPage auth={auth} nav={nav}/>}
        {page==='register'&&<FormPg title="회원가입" desc="가입하시면 칼럼 전체와 프로그램 소식을 먼저 받으실 수 있습니다." onSubmit={e=>submitForm(e,FORMSPREE_REGISTER)} msg={formMsg} btn="가입하기" fields={[{n:'name',p:'이름',r:true},{n:'email',p:'이메일',t:'email',r:true},{n:'phone',p:'휴대폰 번호 (선택)'}]}/>}
        {page==='waitlist'&&<WaitlistForm submitForm={submitForm} formMsg={formMsg} nav={nav}/>}
        {page==='admin'&&<Admin/>}
      </main>

      {/* FOOTER */}
      <footer style={{background:T.bgSoft,borderTop:`1px solid ${T.border}`,marginTop:80}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'64px 24px 32px',display:'grid',gridTemplateColumns:'1.3fr 1fr 1fr 1fr',gap:40}} className="footer-grid">
          <div><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}><Flame size={24}/><span style={{fontSize:14,fontWeight:800,color:T.txt}}>조용한 야망가들</span></div><p style={{fontSize:12,color:T.txtS,lineHeight:1.8,maxWidth:280}}>Silent Ambitious People.<br/>떠들지 않지만 실행하는 사람들을 위한 커뮤니티.</p></div>
          <div><p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>콘텐츠</p><FL onClick={()=>nav('blog')}>무료 칼럼</FL><FL onClick={()=>nav('ebooks')}>전자책 · 자료집</FL><FL onClick={()=>nav('ted-program')}>TED 올인원 스터디</FL></div>
          <div><p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>커뮤니티</p><FL onClick={()=>nav('waitlist')}>1기 사전 등록</FL><FL onClick={()=>nav('login')}>로그인 / 가입</FL><FL onClick={()=>nav('consent')}>개인정보 처리방침</FL></div>
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
    {icon:'📝',label:'무료 칼럼',desc:'영어·커리어·시스템 16편',goto:'blog'},
    {icon:'🎙️',label:'TED 올인원 스터디',desc:'4주 집중 프로그램',goto:'ted-program'},
    {icon:'📚',label:'전자책 · 자료집',desc:'깊이 있는 이야기',goto:'ebooks'},
    {icon:'💬',label:'디스코드 커뮤니티',desc:'실행하는 사람들',goto:'waitlist'},
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
          <button onClick={()=>nav('ted-program')} style={{padding:'15px 30px',background:T.navy,color:'#fff',fontSize:14,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',boxShadow:'0 10px 30px rgba(184,134,11,0.25)',transition:'transform 0.15s'}} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>TED 스터디 자세히 →</button>
          <button onClick={()=>nav('blog')} style={{padding:'15px 30px',background:'rgba(255,255,255,0.9)',color:T.txt,fontSize:14,fontWeight:600,border:'1px solid rgba(184,134,11,0.3)',borderRadius:10,cursor:'pointer',backdropFilter:'blur(10px)'}}>무료 칼럼 읽기</button>
        </div>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0}}><GoldDivider/></div>
    </section>

    {/* FEATURED */}
    <section style={{padding:'80px 24px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',borderRadius:24,overflow:'hidden',background:`linear-gradient(135deg,${T.navy} 0%,#1a2332 100%)`,padding:'56px',display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:40,alignItems:'center',boxShadow:T.shadowH,position:'relative'}} className="featured-grid">
        <div style={{position:'absolute',top:'50%',right:'-15%',transform:'translateY(-50%)',width:500,height:500,background:'radial-gradient(circle,rgba(212,168,83,0.25) 0%,transparent 60%)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',background:'rgba(212,168,83,0.18)',border:'1px solid rgba(212,168,83,0.4)',borderRadius:100,fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1.2,marginBottom:18}}><span style={{width:5,height:5,borderRadius:'50%',background:'#E8CFA0'}}/>사전 모집 중 · 1기</div>
          <h2 style={{fontSize:'clamp(24px,3.2vw,34px)',fontWeight:800,color:'#fff',marginBottom:14,lineHeight:1.25,letterSpacing:-1}}>커리어 점프업을 위한<br/><span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,color:'#E8CFA0'}}>영어 TED 올인원 스터디</span></h2>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.7)',marginBottom:24,lineHeight:1.7,maxWidth:480}}>TED Talk 기반 10단계 스피킹 메소드와<br/>캐나다 명문대 출신 원어민 튜터의 1:1 피드백.<br/>4주 동안 매일 실행하고, 매주 성장합니다.</p>
          <div style={{display:'flex',gap:24,marginBottom:28,flexWrap:'wrap'}}>
            {[['기간','4주 집중'],['구성','매일 과제 + 피어 피드백'],['정원','선착순 20명']].map(([k,v])=>(<div key={k}><p style={{fontSize:10,fontWeight:700,color:'#E8CFA0',letterSpacing:1,marginBottom:3,textTransform:'uppercase'}}>{k}</p><p style={{fontSize:13,color:'#fff',fontWeight:600}}>{v}</p></div>))}
          </div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button onClick={()=>nav('ted-program')} style={{padding:'12px 22px',background:'#fff',color:T.navy,fontSize:13,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>자세히 보기 →</button>
            <button onClick={()=>nav('waitlist')} style={{padding:'12px 22px',background:'transparent',color:'#fff',fontSize:13,fontWeight:600,border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,cursor:'pointer'}}>사전 신청</button>
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
        <div style={{fontSize:36,marginBottom:16}}>🎁</div>
        <h2 style={{fontSize:'clamp(22px,3vw,28px)',fontWeight:800,color:T.txt,marginBottom:12}}>16편 무료 칼럼, 즉시 열람</h2>
        <p style={{fontSize:14,color:T.txtS,marginBottom:28,lineHeight:1.7,maxWidth:480,margin:'0 auto 28px'}}>영어·커리어·실행 시스템에 대한 솔직한 이야기.<br/>Google 계정으로 1초 가입하고 바로 읽어보세요.</p>
        <button onClick={()=>nav('blog')} style={{padding:'13px 28px',background:T.navy,color:'#fff',fontSize:13,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',boxShadow:T.shadow}}>무료 칼럼 읽기 →</button>
      </div>
    </section>

    {/* 최신 칼럼 */}
    <section style={{padding:'60px 24px 120px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:40,flexWrap:'wrap',gap:16}}>
          <div><SL>LATEST COLUMNS</SL><h2 style={{fontSize:28,fontWeight:800,color:T.txt}}>최신 칼럼</h2></div>
          <button onClick={()=>nav('blog')} style={{background:T.bg,border:`1px solid ${T.borderH}`,color:T.txt,padding:'10px 20px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>전체 보기 →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>
          {COLUMNS.slice(0,3).map(c=>(<div key={c.id} onClick={()=>nav('blog',c.id)} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'28px 26px',cursor:'pointer',transition:'all 0.2s',boxShadow:T.shadow}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowH}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow}}>
            <span style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.5,textTransform:'uppercase'}}>{c.tag} · {c.num}</span>
            <h3 style={{fontSize:16,fontWeight:700,color:T.txt,margin:'12px 0 10px',lineHeight:1.4}}>{c.title}</h3>
            <p style={{fontSize:13,color:T.txtS,lineHeight:1.6,marginBottom:16}}>{c.summary}</p>
            <p style={{fontSize:11,color:T.txtD}}>{c.date}</p>
          </div>))}
        </div>
      </div>
    </section>
  </div>)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━
// TED PROGRAM — Orson 톤
// ━━━━━━━━━━━━━━━━━━━━━━━━
function TedProgram({nav}){
  const pains=[
    {n:'01',q:'점수는 있는데 말이 안 나온다',a:'토익, 오픽 점수는 만들었는데 막상 실전에서 한마디도 못 하는 내 자신이 답답하다.'},
    {n:'02',q:'작심삼일이 습관이 됐다',a:'영어 공부 시작만 수십 번. 2~3주면 어김없이 흐지부지되고 자책만 남는다.'},
    {n:'03',q:'글로벌 커리어, 경로를 모른다',a:'외국계 이직이나 해외 취업에 관심은 있는데 주변에 경험자가 없어서 어디서 시작해야 할지 모른다.'},
    {n:'04',q:'동기부여 영상으로는 월요일이 안 바뀐다',a:'자기계발 영상을 아무리 봐도 실행으로 이어지지 않는다. 영감이 아니라 루틴이 필요하다.'},
    {n:'05',q:'문장은 만드는데 대화에서 안 나온다',a:'혼자 영작은 되는데, 실시간 대화에서 떠오르지 않는다. 인풋은 있는데 아웃풋 훈련이 부족하다.'},
    {n:'06',q:'중요한 순간에 영어 자신감이 무너진다',a:'회의, 발표, 면접 — 중요할수록 영어로 말하는 게 더 어렵다. 실전 경험이 절대적으로 부족하다.'},
  ]
  const steps=[
    {n:'Step 01 — 02',t:'듣기 훈련',d:'자막 없이 TED Talk 전체를 듣고, 주제와 흐름을 유추합니다. 노트테이킹으로 안 들리는 구간을 시각화하는 것이 핵심.',tag:'인풋'},
    {n:'Step 03 — 05',t:'분석 & 오답노트',d:'안 들렸던 원인을 파악합니다. 단어인지, 연음인지, 발음인지. 핵심 표현을 골라 내 이야기로 바꿔보는 훈련.',tag:'이해'},
    {n:'Step 06 — 08',t:'쉐도잉 & 녹음',d:'스피커의 속도와 인토네이션을 따라 읽습니다. 녹음해서 자신의 발화를 객관적으로 확인하는 과정.',tag:'아웃풋'},
    {n:'Step 09 — 10',t:'스피치 & 피어 피드백',d:'그 주의 TED를 요약하거나, 자신의 생각을 담은 3분 스피치를 녹음합니다. 동료와 서로 피드백을 주고받으며 성장.',tag:'성장'},
  ]
  const week=[
    {d:'MON',i:'🎧',t:'1차 리스닝',s:'전체 흐름 파악',o:'3줄 요약 제출'},
    {d:'TUE',i:'📝',t:'노트테이킹',s:'색깔별 메모',o:'노트 공유'},
    {d:'WED',i:'📋',t:'오답노트',s:'안 들린 부분 분석·공유',o:'오답노트 제출'},
    {d:'THU',i:'🔍',t:'표현 정리',s:'단어·표현 위주',o:'5개 이상 정리'},
    {d:'FRI',i:'🎙️',t:'쉐도잉 & 녹음',s:'쉐도잉 후 녹음',o:'녹음 제출'},
    {d:'SAT',i:'🗣️',t:'3분 스피치',s:'TED 요약 or 의견',o:'스피치 녹음'},
    {d:'SUN',i:'🤝',t:'피어 피드백',s:'서로 스피치 듣기',o:'주말까지 공유'},
  ]
  const faqs=[
    ['영어를 정말 못하는데 참여할 수 있나요?','토익 500점 전후면 충분합니다. 완벽한 영어가 아니라 입을 여는 시스템이 목표예요. 매일 30분, 과제를 따라가다 보면 자연스럽게 습관이 됩니다.'],
    ['직장인인데 시간이 될까요?','하루 30분이면 됩니다. 출퇴근 시간이나 점심시간에도 가능하도록 설계했어요. 매일 작은 과제가 있어서 오히려 루틴이 만들어집니다.'],
    ['원어민 튜터 피드백은 어떻게 이루어지나요?','매주 토·일에 제출하는 3분 스피치에 대해 캐나다 명문대 출신 원어민 튜터가 발음·인토네이션·표현의 자연스러움을 1:1로 피드백합니다. Tier에 따라 서면 또는 비디오로 제공됩니다.'],
    ['3분 스피치는 얼마나 되는 양인가요?','영어 기준 약 400~450단어, A4 한 페이지 정도입니다. 처음에는 어렵지만, 매주 하다 보면 3주차부터 확 수월해집니다.'],
    ['4주 후에는 어떻게 되나요?','4주간의 녹음과 노트가 나만의 영어 포트폴리오가 됩니다. 디스코드 커뮤니티는 기수 이후에도 계속 이용 가능합니다.'],
    ['환불은 가능한가요?','결제 후 환불은 불가합니다. 사전 등록은 무료이며, 프로그램 상세를 충분히 확인하신 후 결제 여부를 결정해주세요.'],
  ]

  const Sec=({label,title,sub,bg,children})=>(
    <section style={{padding:'80px 24px',background:bg||'transparent',borderTop:`1px solid ${T.border}`}}>
      <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center',marginBottom:48}}>
        <SL>{label}</SL>
        <h2 style={{fontSize:'clamp(24px,3.5vw,36px)',fontWeight:800,color:T.txt,lineHeight:1.25,letterSpacing:-1}}>{title}</h2>
        {sub&&<p style={{fontSize:15,color:T.txtS,lineHeight:1.7,marginTop:16,maxWidth:520,margin:'16px auto 0'}}>{sub}</p>}
      </div>
      <div style={{maxWidth:1000,margin:'0 auto'}}>{children}</div>
    </section>
  )

  return(<div>
    {/* HERO */}
    <section style={{padding:'100px 24px 80px',textAlign:'center',position:'relative',overflow:'hidden',background:'linear-gradient(180deg,#FFFDF7 0%,#FFF8EC 50%,#FFFFFF 100%)'}}>
      <div style={{position:'absolute',top:'25%',left:'50%',transform:'translate(-50%,-50%)',width:800,height:500,background:'radial-gradient(ellipse,rgba(184,134,11,0.2) 0%,transparent 65%)',pointerEvents:'none'}}/>
      <svg style={{position:'absolute',top:'25%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:600,opacity:0.12,pointerEvents:'none'}} viewBox="0 0 600 600"><circle cx="300" cy="300" r="280" fill="none" stroke="#B8860B" strokeWidth="0.6"/><circle cx="300" cy="300" r="220" fill="none" stroke="#B8860B" strokeWidth="0.6"/><circle cx="300" cy="300" r="160" fill="none" stroke="#B8860B" strokeWidth="0.6"/></svg>
      <div style={{position:'relative',maxWidth:840,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',background:'rgba(255,255,255,0.7)',backdropFilter:'blur(10px)',border:'1px solid rgba(184,134,11,0.3)',borderRadius:100,fontSize:11,color:T.txtS,marginBottom:28,letterSpacing:0.5,fontWeight:500}}><span style={{width:6,height:6,borderRadius:'50%',background:T.gold}}/>커리어 점프업 · 1기 모집</div>
        <h1 style={{fontSize:'clamp(32px,5.5vw,56px)',fontWeight:800,color:T.txt,lineHeight:1.15,marginBottom:24,letterSpacing:-2}}>토익은 되는데<br/><span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:500,color:T.gold}}>입이 안 열리는</span> 당신을 위한<br/>영어 TED 올인원 스터디</h1>
        <p style={{fontSize:16,color:T.txtS,marginBottom:40,lineHeight:1.75,maxWidth:560,margin:'0 auto 40px'}}>TED Talk 기반 10단계 스피킹 메소드와<br/>캐나다 명문대 출신 원어민 튜터의 <strong style={{color:T.txt}}>1:1 맞춤 피드백</strong>.<br/>4주 동안 매일 실행하고, 매주 눈에 띄게 성장합니다.</p>
        <div style={{display:'flex',gap:40,justifyContent:'center',paddingTop:36,borderTop:`1px solid ${T.border}`,maxWidth:600,margin:'0 auto',flexWrap:'wrap'}}>
          {[['10년','영어 독학'],['8년','글로벌 빅테크'],['18K+','유튜브 구독자'],['10단계','검증된 메소드']].map(([v,l])=>(<div key={l} style={{textAlign:'center'}}><div style={{fontSize:26,fontWeight:800,color:T.txt,fontFamily:"'Playfair Display',serif"}}>{v}</div><div style={{fontSize:11,color:T.txtS,marginTop:4}}>{l}</div></div>))}
        </div>
      </div>
    </section>

    <GoldDivider/>

    {/* PAIN POINTS */}
    <Sec label="WHY THIS MATTERS" title={<>혹시 이런 상황,<br/>반복되고 있지 않나요?</>} bg={T.bgWarm}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
        {pains.map(p=>(<div key={p.n} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'28px 26px',boxShadow:T.shadow}}>
          <span style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1}}>{p.n}</span>
          <h3 style={{fontSize:15,fontWeight:700,color:T.txt,margin:'10px 0 8px',lineHeight:1.4}}>{p.q}</h3>
          <p style={{fontSize:13,color:T.txtS,lineHeight:1.7}}>{p.a}</p>
        </div>))}
      </div>
      <p style={{textAlign:'center',marginTop:44,fontSize:16,color:T.txt,lineHeight:1.7}}>의지력의 문제가 아닙니다.<br/><span style={{color:T.gold,fontWeight:700}}>시스템의 문제</span>였을 뿐.</p>
    </Sec>

    {/* METHOD */}
    <Sec label="THE METHOD" title={<>TED Talk 기반<br/>10단계 스피킹 메소드</>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {steps.map((s,i)=>(<div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'28px 26px',boxShadow:T.shadow}}>
          <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>{s.n}</p>
          <h3 style={{fontSize:17,fontWeight:700,color:T.txt,marginBottom:10}}>{s.t}</h3>
          <p style={{fontSize:13,color:T.txtS,lineHeight:1.7,marginBottom:14}}>{s.d}</p>
          <span style={{display:'inline-block',padding:'4px 10px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:100,fontSize:10,color:T.txtS,fontWeight:600}}>{s.tag}</span>
        </div>))}
      </div>
    </Sec>

    {/* WEEKLY */}
    <Sec label="WEEKLY SCHEDULE" title="1주일, 이렇게 돌아갑니다" sub="하루 30분이면 충분합니다. 직장인의 루틴에 맞게 설계했습니다." bg={T.bgWarm}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:10}}>
        {week.map(w=>(<div key={w.d} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:'20px 12px',textAlign:'center',boxShadow:T.shadow}}>
          <div style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.5,marginBottom:10}}>{w.d}</div>
          <div style={{fontSize:26,marginBottom:10}}>{w.i}</div>
          <div style={{fontSize:12,fontWeight:700,color:T.txt,marginBottom:4}}>{w.t}</div>
          <div style={{fontSize:10,color:T.txtD,marginBottom:8}}>{w.s}</div>
          <div style={{fontSize:10,color:T.gold,paddingTop:8,borderTop:`1px solid ${T.border}`,fontWeight:600}}>{w.o}</div>
        </div>))}
      </div>
      <div style={{marginTop:32,padding:'20px 24px',background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,textAlign:'center',boxShadow:T.shadow}}>
        <p style={{fontSize:13,color:T.txt,fontWeight:600}}>📊 과제 완료 트래킹</p>
        <p style={{fontSize:12,color:T.txtS,marginTop:6,lineHeight:1.6}}>매일 과제 완료 여부를 실시간으로 트래킹합니다. 매주 완주 현황을 공유하고, 끝까지 함께 가는 시스템을 만들어 드립니다.</p>
      </div>
    </Sec>

    {/* 원어민 튜터 소개 */}
    <section style={{padding:'80px 24px',textAlign:'center',borderTop:`1px solid ${T.border}`}}>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <SL>NATIVE TUTOR</SL>
        <SH>캐나다 명문대 출신 원어민 튜터의<br/>1:1 맞춤 피드백</SH>
        <p style={{fontSize:15,color:T.txtS,lineHeight:1.8,marginTop:20}}>
          매주 당신의 스피치를 직접 듣고 피드백합니다.<br/>
          한국인이 자주 놓치는 발음, 인토네이션, 표현의 자연스러움까지 —<br/>
          <strong style={{color:T.txt}}>교과서에 없는 피드백</strong>을 받으세요.
        </p>
      </div>
    </section>

    {/* PRICING — 3 tier */}
    <Sec label="PRICING" title={<>투자 대비 가장 확실한<br/>성장을 약속합니다</>} bg={T.bgWarm}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18,maxWidth:960,margin:'0 auto'}}>
        {/* Tier 1 */}
        <div style={{background:T.bgCard,border:`2px solid ${T.gold}`,borderRadius:16,padding:'32px 26px',position:'relative',boxShadow:T.shadowH}}>
          <div style={{position:'absolute',top:-12,left:26,padding:'4px 12px',background:T.gold,color:'#fff',fontSize:10,fontWeight:700,borderRadius:6}}>1기 모집 중</div>
          <p style={{fontSize:13,color:T.gold,marginTop:8,fontWeight:600}}>셀프 스터디 + 서면 피드백</p>
          <p style={{fontSize:34,fontWeight:800,color:T.txt,margin:'12px 0 4px',letterSpacing:-1}}>₩150,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <ul style={{listStyle:'none',padding:0,margin:'20px 0 0'}}>
            {['매주 TED Talk 1편 커리큘럼','10단계 스피킹 메소드 가이드','디스코드 커뮤니티 접근','매일 과제 + 과제 완료 트래킹','피어 피드백','4주 완주 포트폴리오','원어민 튜터 1:1 서면 맞춤 피드백 (주간 스피치)'].map(f=>(<li key={f} style={{fontSize:13,color:T.txtS,padding:'9px 0',borderBottom:`1px solid ${T.border}`}}>✓ {f}</li>))}
          </ul>
        </div>
        {/* Tier 2 */}
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 26px',position:'relative',boxShadow:T.shadow,opacity:0.75}}>
          <div style={{position:'absolute',top:-12,left:26,padding:'4px 12px',background:T.bgSoft,color:T.txtS,fontSize:10,fontWeight:700,borderRadius:6,border:`1px solid ${T.border}`}}>오픈 예정</div>
          <p style={{fontSize:13,color:T.gold,marginTop:8,fontWeight:600}}>셀프 스터디 + 비디오 피드백</p>
          <p style={{fontSize:34,fontWeight:800,color:T.txt,margin:'12px 0 4px',letterSpacing:-1}}>₩200,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <ul style={{listStyle:'none',padding:0,margin:'20px 0 0'}}>
            {['Tier 1 전체 포함','원어민 튜터 1:1 비디오 맞춤 피드백 (주간 스피치)'].map(f=>(<li key={f} style={{fontSize:13,color:T.txtS,padding:'9px 0',borderBottom:`1px solid ${T.border}`}}>✓ {f}</li>))}
          </ul>
        </div>
        {/* Tier 3 */}
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 26px',position:'relative',boxShadow:T.shadow,opacity:0.75}}>
          <div style={{position:'absolute',top:-12,left:26,padding:'4px 12px',background:T.bgSoft,color:T.txtS,fontSize:10,fontWeight:700,borderRadius:6,border:`1px solid ${T.border}`}}>오픈 예정</div>
          <p style={{fontSize:13,color:T.gold,marginTop:8,fontWeight:600}}>프리미엄 + 1:1 컨설팅</p>
          <p style={{fontSize:34,fontWeight:800,color:T.txt,margin:'12px 0 4px',letterSpacing:-1}}>₩300,000<span style={{fontSize:13,color:T.txtS,fontWeight:400}}> / 4주</span></p>
          <ul style={{listStyle:'none',padding:0,margin:'20px 0 0'}}>
            {['Tier 2 전체 포함','1:1 온보딩 컨설팅 (Grace 직접)','중간 컨설팅 (Grace 직접)'].map(f=>(<li key={f} style={{fontSize:13,color:T.txtS,padding:'9px 0',borderBottom:`1px solid ${T.border}`}}>✓ {f}</li>))}
          </ul>
        </div>
      </div>
      <p style={{textAlign:'center',fontSize:12,color:T.txtD,marginTop:28,lineHeight:1.8}}>
        * 추후 alumni 네트워킹 모임 진행 시 참여 우선권이 제공됩니다.<br/>
        ※ 결제 후 환불은 불가합니다. 신중히 결정해주세요.
      </p>
    </Sec>

    {/* FAQ */}
    <Sec label="FAQ" title="자주 묻는 질문">
      <div style={{maxWidth:720,margin:'0 auto'}}>
        {faqs.map(([q,a],i)=>(<div key={i} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:12,padding:'24px 28px',marginBottom:12,boxShadow:T.shadow}}>
          <p style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:10}}>Q. {q}</p>
          <p style={{fontSize:13,color:T.txtS,lineHeight:1.7}}>{a}</p>
        </div>))}
      </div>
    </Sec>

    {/* 단일 CTA */}
    <section style={{padding:'100px 24px 120px',textAlign:'center'}}>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <h2 style={{fontSize:'clamp(24px,3.5vw,34px)',fontWeight:800,color:T.txt,marginBottom:16,letterSpacing:-1,lineHeight:1.3}}>준비되셨나요?</h2>
        <p style={{fontSize:15,color:T.txtS,marginBottom:36,lineHeight:1.75}}>사전 등록하시면 오픈 소식과 1기 특별가를 가장 먼저 받으실 수 있습니다.<br/>사전 등록은 <strong style={{color:T.txt}}>무료</strong>이며, 결제는 오픈 시 별도 진행됩니다.</p>
        <button onClick={()=>nav('waitlist')} style={{padding:'16px 36px',background:T.navy,color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',boxShadow:T.shadowH}}>사전 신청하기 →</button>
        <p style={{fontSize:12,color:T.txtD,marginTop:16}}>무료 · 선착순 20명</p>
      </div>
    </section>
  </div>)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━
// WAITLIST — 확장된 신청서
// ━━━━━━━━━━━━━━━━━━━━━━━━
function WaitlistForm({submitForm,formMsg,nav}){
  return(<div style={{padding:'80px 24px 60px',maxWidth:480,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10}}>TED 스터디 사전 등록</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginBottom:32,lineHeight:1.7}}>사전 등록하시면 오픈 소식과 1기 특별가를 가장 먼저 받으실 수 있습니다.</p>
    {formMsg?<div style={{padding:28,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:14,textAlign:'center'}}><p style={{fontSize:17,fontWeight:700,color:T.gold}}>{formMsg}</p></div>:
    <form onSubmit={e=>submitForm(e,'https://formspree.io/f/xgopnwdd')} style={{display:'flex',flexDirection:'column',gap:12}}>
      <In name="name" placeholder="이름" required/>
      <In name="email" type="email" placeholder="이메일" required/>
      <In name="phone" placeholder="휴대폰 (알림용, 선택)"/>
      <In name="nickname" placeholder="커뮤니티 닉네임 (선택)"/>
      <In name="discord_id" placeholder="디스코드 ID (필수)" required/>
      <Sel name="english_level" required>
        <option value="">현재 영어 레벨 (필수)</option>
        <option value="beginner">초급 — 간단한 문장 읽기 가능</option>
        <option value="intermediate">중급 — 일상 대화 가능, 업무 영어 어려움</option>
        <option value="upper-intermediate">중상급 — 업무 영어 가능, 유창함은 부족</option>
      </Sel>
      <In name="motivation" placeholder="참여 동기 (한 줄, 필수)" required/>
      <In name="industry" placeholder="소속 업계 (선택, Grace만 열람)"/>

      <label style={{display:'flex',alignItems:'flex-start',gap:10,marginTop:8,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}>
        <input type="checkbox" name="privacy_consent" required style={{marginTop:2,accentColor:T.gold}}/>
        <span style={{fontSize:12,color:T.txtS,lineHeight:1.6}}><strong style={{color:T.txt}}>[필수]</strong> 개인정보 수집·이용 동의<br/><span style={{color:T.txtD,fontSize:11}}>이름, 이메일, 휴대폰, 디스코드 ID를 프로그램 안내 목적으로 수집합니다.</span></span>
      </label>
      <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}>
        <input type="checkbox" name="marketing_consent" style={{marginTop:2,accentColor:T.gold}}/>
        <span style={{fontSize:12,color:T.txtS,lineHeight:1.6}}><strong style={{color:T.txt}}>[선택]</strong> 마케팅 정보 수신 동의<br/><span style={{color:T.txtD,fontSize:11}}>새 칼럼·프로그램·이벤트 안내를 받으실 수 있습니다.</span></span>
      </label>
      <button type="submit" style={{padding:14,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',marginTop:4,boxShadow:T.shadow}}>사전 등록하기</button>
      <p style={{fontSize:11,color:T.txtD,textAlign:'center'}}>무료 · 결제 아님</p>
    </form>}
  </div>)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━
// BLOG / POST / EBOOKS / LOGIN / CONSENT / PAYMENT / ADMIN
// (기존과 동일, Orson 라이트 톤 유지)
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

function PaymentPage({auth,nav}){
  const [sub,setSub]=useState(false),[done,setDone]=useState(false),[err,setErr]=useState('')
  if(!auth.isLoggedIn||!auth.profile?.privacy_consent)return(<div style={{padding:'100px 24px',textAlign:'center'}}><p style={{fontSize:14,color:T.txtS}}>로그인 후 이용 가능합니다.</p><button onClick={()=>nav('login')} style={{marginTop:20,padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>로그인</button></div>)
  const go=async e=>{e.preventDefault();setSub(true);setErr('');const fd=new FormData(e.target);fd.append('user_email',auth.user.email);fd.append('product','TED 올인원 4주 스터디 1기');fd.append('amount','150000');try{const r=await fetch(FORMSPREE_PAYMENT,{method:'POST',body:fd,headers:{'Accept':'application/json'}});if(r.ok)setDone(true);else setErr('전송 실패.')}catch{setErr('네트워크 오류.')}setSub(false)}
  if(done)return(<div style={{padding:'100px 24px',maxWidth:520,margin:'0 auto',textAlign:'center'}}><Flame size={44}/><h2 style={{fontSize:24,fontWeight:800,color:T.txt,margin:'18px 0 12px'}}>입금 알림 접수 완료</h2><p style={{fontSize:14,color:T.txtS,lineHeight:1.8}}>확인 후 디스코드 초대를 보내드립니다.</p><button onClick={()=>nav('home')} style={{marginTop:28,padding:'12px 28px',background:T.navy,color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>홈으로</button></div>)
  return(<div style={{padding:'80px 24px',maxWidth:560,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:32}}>결제하기</h2>
    <div style={{background:T.bgCard,border:`2px solid ${T.gold}`,borderRadius:14,padding:28,marginBottom:20,boxShadow:T.shadow}}><p style={{fontSize:12,color:T.gold,fontWeight:600}}>1기 특별가</p><p style={{fontSize:19,fontWeight:700,color:T.txt,margin:'8px 0'}}>TED 올인원 4주 스터디</p><p style={{fontSize:32,fontWeight:800,color:T.txt}}>₩150,000</p></div>
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:28,marginBottom:20,boxShadow:T.shadow}}>
      <p style={{fontSize:14,fontWeight:700,color:T.gold,marginBottom:16}}>계좌이체 정보</p>
      <table style={{width:'100%',fontSize:14,color:T.txt,lineHeight:2}}><tbody><tr><td style={{color:T.txtS,width:80}}>은행</td><td style={{fontWeight:600}}>{BANK_INFO.bank}</td></tr><tr><td style={{color:T.txtS}}>계좌번호</td><td style={{fontWeight:600}}>{BANK_INFO.account}</td></tr><tr><td style={{color:T.txtS}}>예금주</td><td style={{fontWeight:600}}>{BANK_INFO.holder}</td></tr><tr><td style={{color:T.txtS}}>금액</td><td style={{color:T.gold,fontWeight:700}}>₩150,000</td></tr></tbody></table>
      <p style={{fontSize:11,color:T.txtD,marginTop:16,lineHeight:1.6}}>※ 입금 후 아래 폼 작성. 환불 불가.</p>
    </div>
    <form onSubmit={go} style={{display:'flex',flexDirection:'column',gap:12}}>
      <In name="depositor_name" placeholder="입금자명" required/><In name="phone" placeholder="휴대폰 (선택)"/>
      {err&&<p style={{fontSize:12,color:'#DC2626',textAlign:'center'}}>{err}</p>}
      <button type="submit" disabled={sub} style={{padding:15,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:sub?'wait':'pointer',opacity:sub?0.6:1}}>{sub?'전송 중...':'입금 완료 알림 보내기'}</button>
    </form>
  </div>)
}

function FormPg({title,desc,onSubmit,msg,btn,note,fields,extraCta}){
  return(<div style={{padding:'80px 24px',maxWidth:460,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:32}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10}}>{title}</h2>
    <p style={{fontSize:14,color:T.txtS,textAlign:'center',marginBottom:32,lineHeight:1.7}}>{desc}</p>
    {msg?<div style={{padding:28,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:14,textAlign:'center'}}><p style={{fontSize:17,fontWeight:700,color:T.gold}}>{msg}</p></div>:
    <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
      {fields.map(f=><In key={f.n} name={f.n} type={f.t||'text'} placeholder={f.p} required={f.r}/>)}
      <label style={{display:'flex',alignItems:'flex-start',gap:10,marginTop:8,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}><input type="checkbox" name="privacy_consent" required style={{marginTop:2,accentColor:T.gold}}/><span style={{fontSize:12,color:T.txtS,lineHeight:1.6}}><strong style={{color:T.txt}}>[필수]</strong> 개인정보 수집·이용 동의</span></label>
      <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}><input type="checkbox" name="marketing_consent" style={{marginTop:2,accentColor:T.gold}}/><span style={{fontSize:12,color:T.txtS,lineHeight:1.6}}><strong style={{color:T.txt}}>[선택]</strong> 마케팅 수신 동의</span></label>
      <button type="submit" style={{padding:14,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',marginTop:4,boxShadow:T.shadow}}>{btn}</button>
      {note&&<p style={{fontSize:11,color:T.txtD,textAlign:'center'}}>{note}</p>}
      {extraCta}
    </form>}
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
