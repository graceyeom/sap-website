import { useState, useEffect } from 'react'
import { COLUMNS, EBOOKS } from './data'
import { useAuth } from './src/useAuth'
import GatedArticle from './src/GatedArticle'

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
      else if(hash==='article'){setPage('article');setPostId(null)}
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
              {[['home','홈'],['article','아티클'],['ebooks','전자책']].map(([p,l])=>(<button key={p} onClick={()=>nav(p)} style={{background:'none',border:'none',cursor:'pointer',color:page===p?T.txt:T.txtS,fontSize:13,fontWeight:page===p?600:500,padding:0}}>{l}</button>))}
            </div>
            {auth.isLoggedIn?(<div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:12,color:T.txtS,maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{auth.profile?.display_name||auth.user?.email?.split('@')[0]}</span><button onClick={auth.signOut} style={{background:T.bg,border:`1px solid ${T.border}`,color:T.txtS,padding:'6px 12px',borderRadius:6,fontSize:11,fontWeight:500,cursor:'pointer'}}>로그아웃</button></div>):(<button onClick={()=>nav('login')} style={{background:'none',border:'none',color:T.txt,padding:0,fontSize:13,fontWeight:500,cursor:'pointer'}}>로그인</button>)}
            {/* 사전등록 버튼 — TED 프로그램 오픈 후 복원 */}
          </div>
        </div>
      </nav>

      <main>
        {page==='home'&&<Home nav={nav}/>}
        {page==='blog'&&(post?<Post post={post} nav={nav} auth={auth}/>:<BlogList nav={nav}/>)}
        {page==='ebooks'&&<Ebooks preview={ebookPreview} setPreview={setEbookPreview} nav={nav}/>}
        {page==='ted-program'&&<TedProgram nav={nav}/>}
        {page==='article'&&<GatedArticle auth={auth}/>}
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
          <div><p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>콘텐츠</p><FL onClick={()=>nav('article')}>아티클</FL><FL onClick={()=>nav('ebooks')}>전자책 · 자료집</FL><FL onClick={()=>{}}>TED 스피킹 (준비 중)</FL></div>
          <div><p style={{fontSize:11,fontWeight:700,color:T.txt,marginBottom:16,letterSpacing:0.5,textTransform:'uppercase'}}>커뮤니티</p>{/* <FL onClick={()=>nav('waitlist')}>1기 사전 등록</FL> */}<FL onClick={()=>nav('login')}>로그인 / 가입</FL><FL onClick={()=>nav('consent')}>개인정보 처리방침</FL></div>
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
    {icon:'🎙️',label:'TED 스피킹 (준비 중)',desc:'4주 집중 프로그램 · 곧 오픈',goto:'home'},
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
          <button onClick={()=>nav('article')} style={{padding:'15px 30px',background:T.navy,color:'#fff',fontSize:14,fontWeight:600,border:'none',borderRadius:10,cursor:'pointer',boxShadow:'0 10px 30px rgba(184,134,11,0.25)',transition:'transform 0.15s'}} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>아티클 읽기 →</button>
        </div>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0}}><GoldDivider/></div>
    </section>

    {/* COMING SOON 배너 */}
    <section style={{padding:'80px 24px 0'}}>
      <div style={{maxWidth:800,margin:'0 auto',borderRadius:20,background:T.bgSoft,border:`1px solid ${T.border}`,padding:'48px 40px',textAlign:'center',boxShadow:T.shadow}}>
        <Flame size={44}/>
        <p style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:2,marginTop:16,marginBottom:12,textTransform:'uppercase'}}>COMING SOON</p>
        <h2 style={{fontSize:'clamp(20px,3vw,28px)',fontWeight:800,color:T.txt,marginBottom:12,lineHeight:1.3}}>영어 스피킹 프로그램 준비 중</h2>
        <p style={{fontSize:14,color:T.txtS,lineHeight:1.7}}>TED Talk 기반 스피킹 스터디를 준비하고 있습니다.<br/>자세한 내용은 곧 공개됩니다.</p>
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

    {/* WHY THIS SYSTEM — Grace BPM 전문성 */}
    <Sec label="WHY THIS SYSTEM" title={<>왜 '시스템'이어야 할까요?</>}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'40px 36px',boxShadow:T.shadow}}>
          <p style={{fontSize:14,color:T.gold,fontWeight:600,marginBottom:18,letterSpacing:0.3}}>본업 이야기</p>
          <p style={{fontSize:15,color:T.txt,lineHeight:2,marginBottom:20}}>
            저는 글로벌 빅테크에서 <strong>Business Process Management</strong>를 합니다. 쉽게 말하면, <strong style={{color:T.gold}}>시스템을 설계해서 사람들의 행동을 바꾸는 일</strong>이에요.
          </p>
          <p style={{fontSize:14,color:T.txtS,lineHeight:2,marginBottom:20}}>
            어떤 지표를 볼지, 어떤 주기로 트래킹할지, 누가 리포팅할지를 설계해서 리더들의 우선순위와 행동을 바꾸고, 리더들의 변화를 통해 전사 직원의 움직임을 유도합니다. 이 과정을 8년간 반복하면서 한 가지를 확신하게 됐어요.
          </p>
          <p style={{fontSize:17,color:T.txt,fontWeight:700,lineHeight:1.8,marginBottom:20,paddingLeft:20,borderLeft:`3px solid ${T.gold}`}}>
            좋은 시스템 하나가 개인의 의지보다<br/>훨씬 큰 임팩트를 만들어냅니다.
          </p>
          <p style={{fontSize:14,color:T.txtS,lineHeight:2,marginBottom:20}}>
            이 프로그램은 제가 본업에서 익힌 시스템 설계를 <strong style={{color:T.txt}}>영어 학습</strong>에 적용한 결과물입니다. 습관이 들면 꾸준한 변화를 만들 수 있고, 더 이상 학원에 의존하지 않고 <strong style={{color:T.txt}}>스스로 할 수 있는 힘</strong>을 길러주도록 설계했어요.
          </p>
          <p style={{fontSize:14,color:T.txtS,lineHeight:2,marginBottom:20}}>
            쉽지는 않을 거예요. 하지만 매일 과제는 <strong style={{color:T.txt}}>snack 사이즈</strong>이고, 여기서 나오는 표현·구조는 실제 비즈니스 상황에서 바로 쓸 수 있는 것들입니다.
          </p>
          <p style={{fontSize:14,color:T.gold,lineHeight:1.9,fontWeight:600}}>
            4주 뒤 돌이켜봤을 때, <br/>"영어 습관을 만드는 데 이만한 게 없었다"고 말하실 거라 확신합니다.
          </p>
        </div>
      </div>
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

    {/* SAMPLE CURRICULUM — 4주 TED Talk 샘플 */}
    <Sec label="SAMPLE CURRICULUM" title={<>1기 커리큘럼 엿보기<br/>비즈니스 × 자기계발</>} sub="이번 달의 주제는 '비즈니스 성장을 위한 자기계발'입니다. 주차별 TED Talk 1편씩, 모두 5~6분 안팎으로 1주일 안에 충분히 마스터할 수 있도록 큐레이션했어요.">
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14,maxWidth:900,margin:'0 auto'}}>
        {[
          {w:'Week 1',t:'3 ways to measure your adaptability',sp:'Natalie Fratto',dur:'6:23',url:'https://www.ted.com/talks/natalie_fratto_3_ways_to_measure_your_adaptability_and_how_to_improve_it'},
          {w:'Week 2',t:'Why working from home is good for business',sp:'Matt Mullenweg',dur:'4:27',url:'https://www.ted.com/talks/matt_mullenweg_why_working_from_home_is_good_for_business'},
          {w:'Week 3',t:'3 steps to getting what you want in a negotiation',sp:'Ruchi Sinha',dur:'5:00',url:'https://www.ted.com/talks/ruchi_sinha_3_steps_to_getting_what_you_want_in_a_negotiation'},
          {w:'Week 4',t:'3 rules for better work-life balance',sp:'Ashley Whillans',dur:'5:07',url:'https://www.ted.com/talks/ashley_whillans_3_rules_for_better_work_life_balance'},
        ].map((v,i)=>(
          <a key={i} href={v.url} target="_blank" rel="noreferrer" style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'24px 22px',textDecoration:'none',boxShadow:T.shadow,transition:'all 0.2s',display:'block'}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowH;e.currentTarget.style.borderColor=T.borderH}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.borderColor=T.border}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:10,fontWeight:700,color:T.gold,letterSpacing:1.2,textTransform:'uppercase'}}>{v.w} · BUSINESS</span>
              <span style={{fontSize:11,color:T.txtD,fontFamily:"'DM Sans',sans-serif"}}>▶ {v.dur}</span>
            </div>
            <h3 style={{fontSize:15,fontWeight:700,color:T.txt,marginBottom:6,lineHeight:1.4}}>{v.t}</h3>
            <p style={{fontSize:12,color:T.txtS}}>{v.sp}</p>
            <p style={{fontSize:11,color:T.gold,marginTop:12,fontWeight:600}}>TED에서 보기 →</p>
          </a>
        ))}
      </div>
      <div style={{maxWidth:640,margin:'32px auto 0',padding:'20px 24px',background:'rgba(184,134,11,0.06)',border:`1px solid rgba(184,134,11,0.2)`,borderRadius:12,textAlign:'center'}}>
        <p style={{fontSize:13,color:T.txt,lineHeight:1.8}}>
          <strong style={{color:T.gold}}>💡 참여 적합도 체크</strong><br/>
          위 영상 중 하나를 골라 들어보세요.<br/>
          <strong>60~80% 정도 이해</strong>된다면 이 스터디에 딱 맞는 레벨입니다.
        </p>
      </div>
    </Sec>

    {/* 원어민 튜터 소개 */}
    <section style={{padding:'80px 24px',borderTop:`1px solid ${T.border}`}}>
      <div style={{maxWidth:760,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <SL>NATIVE TUTOR</SL>
          <SH>매주, 내 스피치를 직접 듣는<br/>원어민 튜터</SH>
        </div>
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'36px 32px',boxShadow:T.shadow}}>
          <div style={{display:'grid',gap:14}}>
            {[
              {k:'학력',v:'캐나다 명문대 생물의학 전공 · QS 세계대학 Top 150'},
              {k:'경력',v:'영어 스피킹 전문 지도 6년 이상'},
              {k:'이력',v:'대기업 및 임원 대상 영어 티칭 경험'},
              {k:'언어',v:'영어 · 한국어 · 중국어 유창'},
            ].map((r,i)=>(
              <div key={i} style={{display:'flex',gap:20,alignItems:'flex-start',paddingBottom:14,borderBottom:i<3?`1px solid ${T.border}`:'none'}}>
                <span style={{fontSize:11,fontWeight:700,color:T.gold,letterSpacing:1,minWidth:44,paddingTop:2}}>{r.k}</span>
                <span style={{fontSize:14,color:T.txt,lineHeight:1.7}}>{r.v}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:13,color:T.txtS,lineHeight:1.8,marginTop:24,paddingTop:20,borderTop:`1px solid ${T.border}`}}>
            한국인이 자주 놓치는 발음·인토네이션·표현의 자연스러움까지 —<br/>
            <strong style={{color:T.txt}}>교과서에는 없는 피드백</strong>을 매주 받아보세요.
          </p>
        </div>
      </div>
    </section>

    {/* 피드백 샘플 */}
    <Sec label="FEEDBACK SAMPLE" title={<>실제 원어민 피드백은<br/>어떻게 받게 되나요?</>} sub="매주 일요일 저녁까지 다음과 같은 형식의 서면 피드백을 받습니다. 스피치 샘플 → 구조화된 피드백 순으로 보여드립니다." bg={T.bgWarm}>
      <FeedbackSample/>
    </Sec>

    {/* PRICING — 3 tier */}
    <Sec label="PRICING" title={<>투자 대비 가장 확실한<br/>성장을 약속합니다</>} bg={T.bgWarm}>
      <PricingCards nav={nav}/>
      <p style={{textAlign:'center',fontSize:12,color:T.txtD,marginTop:28,lineHeight:1.9}}>
        * 추후 alumni 네트워킹 모임 진행 시 참여 우선권이 제공됩니다.<br/>
        ※ 1기 특별가: <strong style={{color:T.txt}}>120,000원</strong> (정가 150,000원 → 대기자 한정 할인)<br/>
        ※ 신청 ≠ 결제. 검토 후 선발된 분에게 결제 안내를 드립니다.<br/>
        ※ 결제 후 환불은 불가합니다.
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
  const Label=({children,req})=>(<p style={{fontSize:13,fontWeight:700,color:T.txt,marginBottom:10,marginTop:8,letterSpacing:-0.2}}>{children}{req&&<span style={{color:T.gold,marginLeft:4}}>*</span>}</p>)
  const HelpText=({children})=>(<p style={{fontSize:11,color:T.txtD,marginBottom:10,lineHeight:1.6}}>{children}</p>)
  const Radio=({name,value,children})=>(
    <label style={{display:'flex',gap:10,alignItems:'flex-start',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10,cursor:'pointer',marginBottom:6}}>
      <input type="radio" name={name} value={value} required style={{marginTop:3,accentColor:T.gold}}/>
      <span style={{fontSize:13,color:T.txt,lineHeight:1.6}}>{children}</span>
    </label>
  )
  const Check=({name,value,children})=>(
    <label style={{display:'flex',gap:10,alignItems:'flex-start',padding:'12px 14px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10,cursor:'pointer',marginBottom:6}}>
      <input type="checkbox" name={name} value={value} style={{marginTop:3,accentColor:T.gold}}/>
      <span style={{fontSize:13,color:T.txt,lineHeight:1.6}}>{children}</span>
    </label>
  )
  const FieldBlock=({children})=>(<div style={{marginBottom:28}}>{children}</div>)

  return(<div style={{padding:'80px 24px 60px',maxWidth:560,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:28}}><Flame size={40}/></div>
    <h2 style={{fontSize:26,fontWeight:800,color:T.txt,textAlign:'center',marginBottom:10,letterSpacing:-0.8}}>TED 올인원 스터디 1기 신청</h2>
    <p style={{fontSize:13,color:T.txtS,textAlign:'center',marginBottom:36,lineHeight:1.7}}>
      신청서를 검토 후 선발된 분께 결제 안내를 드립니다.<br/>
      <strong style={{color:T.gold}}>신청은 무료</strong>이며, 작성에는 약 3분이 소요됩니다.
    </p>

    {formMsg?<div style={{padding:32,background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:14,textAlign:'center'}}>
      <p style={{fontSize:17,fontWeight:700,color:T.gold,marginBottom:10}}>{formMsg}</p>
      <p style={{fontSize:12,color:T.txtS,lineHeight:1.7}}>제출해주셔서 감사합니다.<br/>검토 후 이메일/휴대폰으로 연락드리겠습니다.</p>
    </div>:
    <form onSubmit={e=>submitForm(e,'https://formspree.io/f/xgopnwdd')} style={{display:'flex',flexDirection:'column'}}>

      {/* 기본 정보 */}
      <FieldBlock>
        <Label req>기본 정보</Label>
        <HelpText>연락용으로만 사용되며, 외부에 공유되지 않습니다.</HelpText>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <In name="name" placeholder="이름" required/>
          <In name="phone" placeholder="휴대폰 번호" required/>
          <In name="email" type="email" placeholder="이메일" required/>
        </div>
      </FieldBlock>

      {/* 영어 상황 */}
      <FieldBlock>
        <Label req>현재 영어 상황 (택 1)</Label>
        <Radio name="english_status" value="a">읽기는 되는데 말은 거의 못 함. 외국인 앞에서 얼어붙은 적 있음.</Radio>
        <Radio name="english_status" value="b">간단한 인사/주문은 되는데, 회의나 발표에서 의견 말하기 어려움.</Radio>
        <Radio name="english_status" value="c">일상 대화는 되는데, 논리적으로 생각을 전달하는 게 약함.</Radio>
        <Radio name="english_status" value="d">업무 영어는 하는데, 더 자연스럽고 설득력 있게 말하고 싶음.</Radio>
      </FieldBlock>

      {/* 학습 타입 */}
      <FieldBlock>
        <Label>나의 영어 학습 타입 (복수 선택 가능)</Label>
        <HelpText>해당되는 모든 항목을 체크해주세요. 커리큘럼 보완 자료로 활용됩니다.</HelpText>
        <Check name="learner_type_perfectionist" value="yes">완벽주의형 — 틀릴까봐 입을 못 연다</Check>
        <Check name="learner_type_procrastinator" value="yes">실행 미루기형 — 시작은 맨날 하는데 3일이면 흐지부지</Check>
        <Check name="learner_type_input_heavy" value="yes">인풋 과다형 — 영상/책은 많이 보는데 아웃풋이 없다</Check>
        <Check name="learner_type_no_env" value="yes">환경 부재형 — 영어 쓸 일이 없어서 연습할 곳이 없다</Check>
        <Check name="learner_type_lost" value="yes">방법 미아형 — 이것저것 해봤는데 뭐가 맞는지 모르겠다</Check>
      </FieldBlock>

      {/* 공부법 */}
      <FieldBlock>
        <Label req>지금까지 해본 영어 공부법</Label>
        <textarea name="study_history" required placeholder="예: 토익, 학원, 미드 쉐도잉, 영어 앱, 1:1 과외, 독학 등" style={{width:'100%',minHeight:80,padding:'12px 14px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,color:T.txt,fontSize:14,outline:'none',fontFamily:'inherit',resize:'vertical'}}/>
      </FieldBlock>

      {/* 기대하는 것 */}
      <FieldBlock>
        <Label req>이 프로그램에서 얻고 싶은 것</Label>
        <HelpText>⭐ <strong style={{color:T.gold}}>이 답변이 선발에 반영됩니다.</strong> 구체적으로 써주세요.</HelpText>
        <textarea name="expectation" required placeholder="예: 매일 짧게라도 영어로 말하는 습관을 만들고 싶다 / 회의에서 의견을 논리적으로 전달할 수 있게 되고 싶다" style={{width:'100%',minHeight:100,padding:'12px 14px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,color:T.txt,fontSize:14,outline:'none',fontFamily:'inherit',resize:'vertical'}}/>
      </FieldBlock>

      {/* 추가 정보 (선택) */}
      <FieldBlock>
        <Label>추가 정보 (선택)</Label>
        <HelpText>비슷한 업계/연차 분들 매칭에 참고됩니다. 회사명은 비공개 처리됩니다.</HelpText>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <In name="industry" placeholder="업계/분야 (예: IT, 금융, 마케팅, 교육 등)"/>
          <In name="company" placeholder="회사명 (비공개 처리됩니다)"/>
          <Sel name="years">
            <option value="">연차 선택</option>
            <option value="1-3">1~3년차</option>
            <option value="4-7">4~7년차</option>
            <option value="8-10">8~10년차</option>
            <option value="11+">11년차 이상</option>
            <option value="student">학생 · 취준생</option>
          </Sel>
        </div>
      </FieldBlock>

      {/* 동의 */}
      <FieldBlock>
        <Label req>동의 항목</Label>
        <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',padding:'14px 16px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10,marginBottom:8}}>
          <input type="checkbox" name="privacy_consent" required style={{marginTop:3,accentColor:T.gold}}/>
          <span style={{fontSize:12,color:T.txtS,lineHeight:1.7}}>
            <strong style={{color:T.txt}}>[필수]</strong> 개인정보 수집·이용에 동의합니다.<br/>
            <span style={{color:T.txtD,fontSize:11}}>
              · 수집 항목: 이름, 연락처, 이메일<br/>
              · 수집 목적: 프로그램 운영 및 안내<br/>
              · 보유 기간: 프로그램 종료 후 1년
            </span>
          </span>
        </label>
        <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',padding:'14px 16px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:10}}>
          <input type="checkbox" name="marketing_consent" style={{marginTop:3,accentColor:T.gold}}/>
          <span style={{fontSize:12,color:T.txtS,lineHeight:1.7}}>
            <strong style={{color:T.txt}}>[선택]</strong> 추후 네트워킹 이벤트 오픈 시 알림 받는 것에 동의합니다.
          </span>
        </label>
      </FieldBlock>

      <button type="submit" style={{padding:15,background:T.navy,color:'#fff',fontSize:14,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',boxShadow:T.shadow,marginTop:8}}>신청 제출하기</button>

      <div style={{marginTop:20,padding:'16px 18px',background:T.bgSoft,borderRadius:10,fontSize:11,color:T.txtD,lineHeight:1.9}}>
        ※ <strong>신청 ≠ 결제</strong>입니다. 검토 후 선발된 분에게 결제 안내를 드립니다.<br/>
        ※ 1기 특별가: <strong style={{color:T.txt}}>120,000원</strong> (정가 150,000원)<br/>
        ※ 프로그램 구성과 가격은 기수별로 달라질 수 있습니다.<br/>
        ※ 결제 후 환불은 불가합니다.
      </div>
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

// ─── PRICING CARDS ───
function PricingCards({nav}){
  // 공통 베이스 혜택 (Tier 1에 전부 포함, Tier 2·3에도 계승)
  const base=[
    '4주 TED 올인원 스터디 루틴 (인풋 + 아웃풋 통합 설계)',
    '매주 엄선된 TED Talk 영상 제공',
    '매일 과제 가이드 + 방법론 제시',
    '과제 완료 실시간 트래킹',
    '매주 1회 피어 피드백 시스템',
    '스터디 전용 디스코드 커뮤니티 + 질문방',
    '매주 개인별 진단 · 교정 · 방향성 제시',
    '원어민 튜터 1:1 서면 피드백 (주 1회, 주간 스피치)',
    '4주 완주 포트폴리오',
  ]
  const tier2Extra=[
    '원어민 튜터 1:1 비디오 피드백 (주 1회, 주간 스피치)',
  ]
  const tier3Extra=[
    '매주 원어민 라이브 코칭',
    '원어민 튜터 1:1 온보딩 컨설팅',
    'Grace 1:1 중간 컨설팅 2회 (시작·중간 점검)',
    '전자책 《영어를 커리어 무기로 바꾼》 (89p) 제공',
  ]

  const Item=({text,hl})=>(
    <li style={{fontSize:13,color:hl?T.txt:T.txtS,padding:'10px 0',borderBottom:`1px solid ${T.border}`,display:'flex',gap:8,alignItems:'flex-start',fontWeight:hl?600:400}}>
      <span style={{color:hl?T.gold:T.txtD,flexShrink:0,marginTop:1}}>✓</span>
      <span style={hl?{background:'rgba(184,134,11,0.12)',padding:'1px 6px',borderRadius:4,marginLeft:-2}:{}}>{text}</span>
    </li>
  )

  return(<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18,maxWidth:1040,margin:'0 auto'}}>
    {/* Tier 1 */}
    <div style={{background:T.bgCard,border:`2px solid ${T.gold}`,borderRadius:16,padding:'32px 26px',position:'relative',boxShadow:T.shadowH}}>
      <div style={{position:'absolute',top:-12,left:26,padding:'4px 12px',background:T.gold,color:'#fff',fontSize:10,fontWeight:700,borderRadius:6}}>1기 모집 중</div>
      <p style={{fontSize:13,color:T.gold,marginTop:8,fontWeight:600}}>셀프 스터디 + 서면 피드백</p>
      <div style={{margin:'12px 0 4px'}}>
        <p style={{fontSize:11,color:T.txtD,textDecoration:'line-through',marginBottom:2}}>정가 ₩150,000</p>
        <p style={{fontSize:32,fontWeight:800,color:T.txt,letterSpacing:-1}}>₩120,000<span style={{fontSize:12,color:T.txtS,fontWeight:400}}> / 4주</span></p>
        <p style={{fontSize:11,color:T.gold,fontWeight:600}}>1기 특별가 · 대기자 한정</p>
      </div>
      <ul style={{listStyle:'none',padding:0,margin:'20px 0 0'}}>
        {base.map(f=><Item key={f} text={f}/>)}
      </ul>
      <button onClick={()=>nav('waitlist')} style={{width:'100%',padding:13,background:T.navy,color:'#fff',fontSize:13,fontWeight:700,border:'none',borderRadius:10,cursor:'pointer',marginTop:20}}>사전 신청하기</button>
    </div>

    {/* Tier 2 */}
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 26px',position:'relative',boxShadow:T.shadow}}>
      <div style={{position:'absolute',top:-12,left:26,padding:'4px 12px',background:T.bgSoft,color:T.txtS,fontSize:10,fontWeight:700,borderRadius:6,border:`1px solid ${T.border}`}}>오픈 예정</div>
      <p style={{fontSize:13,color:T.gold,marginTop:8,fontWeight:600}}>셀프 스터디 + 비디오 피드백</p>
      <div style={{margin:'12px 0 4px'}}>
        <p style={{fontSize:22,fontWeight:700,color:T.txtS,letterSpacing:-0.5}}>가격 추후 공지</p>
        <p style={{fontSize:11,color:T.txtD,marginTop:4}}>2기부터 오픈 예정</p>
      </div>
      <ul style={{listStyle:'none',padding:0,margin:'20px 0 0'}}>
        {base.map(f=><Item key={f} text={f}/>)}
        {tier2Extra.map(f=><Item key={f} text={f} hl/>)}
      </ul>
    </div>

    {/* Tier 3 */}
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:'32px 26px',position:'relative',boxShadow:T.shadow}}>
      <div style={{position:'absolute',top:-12,left:26,padding:'4px 12px',background:T.bgSoft,color:T.txtS,fontSize:10,fontWeight:700,borderRadius:6,border:`1px solid ${T.border}`}}>오픈 예정</div>
      <p style={{fontSize:13,color:T.gold,marginTop:8,fontWeight:600}}>프리미엄 올인원</p>
      <div style={{margin:'12px 0 4px'}}>
        <p style={{fontSize:22,fontWeight:700,color:T.txtS,letterSpacing:-0.5}}>가격 추후 공지</p>
        <p style={{fontSize:11,color:T.txtD,marginTop:4}}>2기부터 오픈 예정</p>
      </div>
      <ul style={{listStyle:'none',padding:0,margin:'20px 0 0'}}>
        {base.map(f=><Item key={f} text={f}/>)}
        {tier2Extra.map(f=><Item key={f} text={f} hl/>)}
        {tier3Extra.map(f=><Item key={f} text={f} hl/>)}
      </ul>
    </div>
  </div>)
}

// ─── FEEDBACK SAMPLE (접히는 카드) ───
function FeedbackSample(){
  const [open,setOpen]=useState(false)
  const Block=({title,children})=>(
    <div style={{marginBottom:22}}>
      <p style={{fontSize:12,fontWeight:700,color:T.gold,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>{title}</p>
      {children}
    </div>
  )
  return(<div>
    {/* 학생 스피치 샘플 */}
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'28px 30px',marginBottom:16,boxShadow:T.shadow}}>
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:18,flexWrap:'wrap'}}>
        <span style={{padding:'3px 10px',background:T.bgSoft,border:`1px solid ${T.border}`,borderRadius:100,fontSize:10,color:T.txtS,fontWeight:600}}>Student: 야망이-07</span>
        <span style={{fontSize:11,color:T.txtD}}>Topic: Why small habits matter</span>
      </div>
      <p style={{fontSize:13,color:T.txtS,lineHeight:2,fontStyle:'italic'}}>
        "I think this TED talk is very important because it talks about small habits. The speaker says if we do small things everyday, we can change our life. For example, if we exercise little by little, we can become healthier…"
      </p>
    </div>

    {/* 피드백 */}
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:'32px 30px',boxShadow:T.shadow}}>
      <p style={{fontSize:11,fontWeight:700,color:T.txt,letterSpacing:2,marginBottom:20,textTransform:'uppercase'}}>주간 스피치 서면 피드백</p>

      <Block title="1. 빅픽쳐 (Big Picture)">
        <p style={{fontSize:13,color:T.txtS,lineHeight:2,marginBottom:10}}><strong style={{color:T.txt}}>Input (Listening):</strong> You clearly understood the main idea about small habits and consistency.</p>
        <p style={{fontSize:13,color:T.txtS,lineHeight:2,marginBottom:10}}><strong style={{color:T.txt}}>Understanding (Analysis):</strong> You identified the key message and used a relevant example.</p>
        <p style={{fontSize:13,color:T.txtS,lineHeight:2}}><strong style={{color:T.txt}}>Output (Speech):</strong> Your structure is clearer than last week, and your ideas are easier to follow.</p>
      </Block>

      <Block title="2. 이번 주 업그레이드">
        <div style={{background:T.bgSoft,padding:'16px 18px',borderRadius:10,marginBottom:10}}>
          <p style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:6}}>[PRON] 발음</p>
          <p style={{fontSize:12,color:T.txtS,lineHeight:1.8}}>❌ habit → /hay-bit/<br/>✅ /hab-bit/<br/><span style={{color:T.txtD,fontSize:11}}>→ "happy / ham / hand" 할 때 같은 'ha' 입니다.</span></p>
        </div>
        <div style={{background:T.bgSoft,padding:'16px 18px',borderRadius:10,marginBottom:10}}>
          <p style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:6}}>[EXP] 표현</p>
          <p style={{fontSize:12,color:T.txtS,lineHeight:1.8}}>❌ "I think this idea is very good"<br/>✅ "I think this idea is <strong>powerful</strong> because it focuses on small, consistent actions"<br/><span style={{color:T.txtD,fontSize:11}}>→ "very good" 대신 왜 좋은지 확장하는 문장으로.</span></p>
        </div>
        <div style={{background:T.bgSoft,padding:'16px 18px',borderRadius:10}}>
          <p style={{fontSize:11,fontWeight:700,color:T.gold,marginBottom:6}}>[STRUCT] 구성 / 흐름</p>
          <p style={{fontSize:12,color:T.txtS,lineHeight:1.8}}>→ "First / For example / That's why" 같은 연결어를 사용하면 전체 흐름이 훨씬 자연스러워집니다.</p>
        </div>
      </Block>

      {open && <>
        <Block title="3. 재사용 가능한 표현">
          <p style={{fontSize:13,color:T.txt,fontWeight:600,marginBottom:8,fontStyle:'italic'}}>"One thing that stood out to me is that small habits create long-term change."</p>
          <p style={{fontSize:12,color:T.txtS,lineHeight:1.8}}>→ <strong>When to use:</strong> To highlight important things, when giving your opinion.<br/>→ <strong>Why useful:</strong> A natural way to introduce things, clearer speech structure.</p>
        </Block>

        <Block title="4. 다음 주 집중 포인트">
          <p style={{fontSize:13,color:T.txtS,lineHeight:2}}>• Practice speaking in full sentences, not word-by-word<br/>• Use upgraded expressions at least 2 times<br/>• Add simple structure words (First / For example / That's why)</p>
        </Block>

        <Block title="5. 마무리 코멘트">
          <p style={{fontSize:13,color:T.txt,lineHeight:1.9,fontStyle:'italic',paddingLeft:18,borderLeft:`3px solid ${T.gold}`}}>
            "You're starting to organize your thoughts more clearly, and that's a big step. If you keep repeating this process, your speaking will become much more natural."
          </p>
        </Block>
      </>}

      <button onClick={()=>setOpen(!open)} style={{width:'100%',padding:12,background:T.bg,color:T.txt,border:`1px solid ${T.borderH}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',marginTop:10}}>
        {open?'접기 ↑':'더 보기 ↓ (표현 라이브러리 · 다음 주 포인트 · 마무리)'}
      </button>
    </div>

    <p style={{fontSize:11,color:T.txtD,textAlign:'center',marginTop:20,lineHeight:1.7}}>
      ※ 피드백 예시는 수강생의 수준과 스피치 내용에 따라 달라집니다.<br/>
      ※ 실제 수강생의 스피치 · 피드백을 재구성한 샘플입니다.
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
