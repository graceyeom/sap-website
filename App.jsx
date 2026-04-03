import { useState, useEffect } from 'react'
import { COLUMNS, EBOOKS } from './data'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 설정 — Formspree 가입 후 여기 ID만 교체
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FORMSPREE_WAITLIST = 'https://formspree.io/f/xgopnwdd'
const FORMSPREE_REGISTER = 'https://formspree.io/f/xkopqwya'
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
    <path d="M100 60C103 72,112 86,114 102C116 118,114 138,108 152C104 160,96 160,92 152C86 138,84 118,86 102C88 86,97 72,100 60Z" fill="#E8CFA0" opacity="0.12"/>
    <ellipse cx="100" cy="34" rx="3" ry="5" fill="#F5E8D0" opacity="0.35"/>
  </svg>
)

const In = (p) => <input {...p} style={{width:'100%',padding:'12px 14px',background:'rgba(212,168,83,0.04)',border:`1px solid ${T.border}`,borderRadius:8,color:T.cream,fontSize:14,outline:'none',fontFamily:'inherit',...(p.style||{})}}/>

export default function App() {
  const [page, setPage] = useState('home')
  const [postId, setPostId] = useState(null)
  const [formMsg, setFormMsg] = useState('')
  const [ebookPreview, setEbookPreview] = useState(null)

  useEffect(() => {
    const h = () => {
      const hash = window.location.hash.slice(1)
      if (hash.startsWith('col-')||hash.startsWith('ted-')) { setPage('blog'); setPostId(hash) }
      else if (hash==='blog') { setPage('blog'); setPostId(null) }
      else if (['register','waitlist','ebooks','admin'].includes(hash)) { setPage(hash); setPostId(null) }
      else { setPage('home'); setPostId(null) }
    }
    h()
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])

  const nav = (p, id) => { window.location.hash = id || p; setFormMsg('') }

  const submitForm = async (e, endpoint) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name = fd.get('name')
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
          <div style={{display:'flex',gap:14,alignItems:'center'}}>
            {[['home','홈'],['blog','칼럼'],['ebooks','전자책']].map(([p,l])=>(
              <button key={p} onClick={()=>nav(p)} style={{background:'none',border:'none',cursor:'pointer',color:page===p?T.gold:T.txtS,fontSize:11,fontWeight:500}}>{l}</button>
            ))}
            <button onClick={()=>nav('waitlist')} style={{padding:'5px 11px',background:T.gold,color:T.navy,border:'none',borderRadius:5,fontSize:10,fontWeight:700,cursor:'pointer'}}>사전등록</button>
          </div>
        </div>
      </nav>

      {/* PAGES */}
      <main style={{maxWidth:1080,margin:'0 auto'}}>
        {page==='home' && <Home nav={nav}/>}
        {page==='blog' && (post ? <Post post={post} nav={nav}/> : <BlogList nav={nav}/>)}
        {page==='ebooks' && <Ebooks preview={ebookPreview} setPreview={setEbookPreview} nav={nav}/>}
        {page==='register' && <FormPg title="회원가입" desc="가입하시면 칼럼 전체와 프로그램 소식을 먼저 받으실 수 있습니다." onSubmit={e=>submitForm(e,FORMSPREE_REGISTER)} msg={formMsg} btn="가입하기" fields={[{n:'name',p:'이름',r:true},{n:'email',p:'이메일',t:'email',r:true},{n:'phone',p:'휴대폰 번호 (선택)'}]}/>}
        {page==='waitlist' && <FormPg title="1기 사전 등록" desc="사전 등록하시면 오픈 소식과 1기 특별가(₩100,000)를 먼저 받으실 수 있습니다." onSubmit={e=>submitForm(e,FORMSPREE_WAITLIST)} msg={formMsg} btn="사전 등록하기" note="무료 · 결제 아님" fields={[{n:'name',p:'이름',r:true},{n:'email',p:'이메일',t:'email',r:true},{n:'phone',p:'휴대폰 (알림용, 선택)'}]}/>}
        {page==='admin' && <Admin/>}
      </main>

      {/* FOOTER */}
      <footer style={{padding:'28px 16px',textAlign:'center',borderTop:`1px solid ${T.border}`,marginTop:60}}>
        <Flame size={16}/>
        <p style={{fontSize:11,color:T.txtD,lineHeight:1.8,marginTop:8}}>
          조용한 야망가들 · Silent Ambitious People<br/>
          <a href="https://youtube.com/@kglobaltechgirl" target="_blank" style={{color:T.gold,textDecoration:'none'}}>YouTube</a>
          {' · '}<a href="https://instagram.com/kglobal.tech.girl" target="_blank" style={{color:T.gold,textDecoration:'none'}}>Instagram</a>
          {' · '}<a href="https://threads.net/@getnerdywithgrace" target="_blank" style={{color:T.gold,textDecoration:'none'}}>Threads</a>
          <br/><span onClick={()=>nav('admin')} style={{cursor:'pointer',color:T.txtD,fontSize:10}}>관리자</span>
        </p>
      </footer>
    </div>
  )
}

// ─── HOME ───
function Home({nav}) {
  return (<div style={{padding:'0 16px'}}>
    <section style={{minHeight:'80vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',padding:'80px 0 40px',position:'relative'}}>
      <div style={{position:'absolute',top:'20%',left:'50%',transform:'translate(-50%,-50%)',width:400,height:300,background:'radial-gradient(ellipse,rgba(212,168,83,0.06) 0%,transparent 70%)',filter:'blur(60px)',pointerEvents:'none'}}/>
      <div style={{position:'relative',marginBottom:28}}><Flame size={52}/></div>
      <h1 style={{position:'relative',fontSize:'clamp(26px,5vw,46px)',fontWeight:900,color:T.txt,lineHeight:1.2,marginBottom:20,letterSpacing:-2}}>
        토익은 되는데<br/><span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',background:`linear-gradient(135deg,${T.gold},${T.goldL})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>입이 안 열리는</span> 당신을 위한<br/>스피킹 시스템
      </h1>
      <p style={{position:'relative',fontSize:15,color:T.txtS,marginBottom:32,lineHeight:1.8,maxWidth:420}}>
        <strong style={{color:T.goldL}}>TED Talk 기반 10단계 스피킹 메소드.</strong><br/>AI + 동료 피드백. 디스코드 커뮤니티.
      </p>
      <button onClick={()=>nav('waitlist')} style={{padding:'13px 28px',background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:14,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer'}}>1기 사전 등록하기 →</button>
      <p style={{marginTop:10,fontSize:11,color:T.txtD}}>1기 특별가 ₩100,000 · 선착순 20명 · 환불 불가</p>
    </section>
    <section style={{paddingBottom:60}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{fontSize:18,fontWeight:700,color:T.txt}}>최신 칼럼</h2>
        <button onClick={()=>nav('blog')} style={{background:'none',border:`1px solid ${T.border}`,color:T.gold,padding:'5px 12px',borderRadius:5,fontSize:10,cursor:'pointer'}}>전체 →</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10}}>
        {COLUMNS.slice(0,4).map(c=>(<div key={c.id} onClick={()=>nav('blog',c.id)} style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:'20px 16px',cursor:'pointer'}}>
          <span style={{fontSize:9,fontWeight:600,color:T.gold,letterSpacing:1}}>{c.tag.toUpperCase()}</span>
          <h3 style={{fontSize:14,fontWeight:700,color:T.txt,margin:'6px 0 4px',lineHeight:1.4}}>{c.title}</h3>
          <p style={{fontSize:11,color:T.txtS,lineHeight:1.5}}>{c.summary}</p>
        </div>))}
      </div>
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
    <p style={{fontSize:13,color:T.txtS,marginBottom:20}}>영어, 커리어, 시스템에 대한 솔직한 이야기.</p>
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

// ─── POST (shareable via hash) ───
function Post({post,nav}) {
  const copy = () => { navigator.clipboard?.writeText(window.location.href) }
  return (<article style={{padding:'70px 16px 40px',maxWidth:640,margin:'0 auto'}}>
    <button onClick={()=>nav('blog')} style={{background:'none',border:'none',color:T.gold,fontSize:11,cursor:'pointer',marginBottom:24}}>← 목록</button>
    <span style={{fontSize:9,fontWeight:600,color:T.gold,letterSpacing:1}}>{post.series} · COLUMN {post.num}</span>
    <h1 style={{fontSize:'clamp(20px,4vw,30px)',fontWeight:900,color:T.txt,margin:'8px 0 6px',lineHeight:1.3,letterSpacing:-1}}>{post.title}</h1>
    <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:32}}>
      <span style={{fontSize:11,color:T.txtD}}>{post.date}</span>
      <button onClick={copy} style={{background:'none',border:`1px solid ${T.border}`,color:T.txtS,padding:'2px 7px',borderRadius:4,fontSize:9,cursor:'pointer'}}>링크 복사</button>
    </div>
    <div style={{fontSize:15,color:T.txtS,lineHeight:2.1,whiteSpace:'pre-wrap'}}>{post.content}</div>
    <div style={{marginTop:48,padding:24,background:'rgba(212,168,83,0.03)',border:`1px solid ${T.border}`,borderRadius:10,textAlign:'center'}}>
      <Flame size={24}/><p style={{fontSize:13,fontWeight:600,color:T.txt,margin:'10px 0 6px'}}>조용한 야망가들</p>
      <p style={{fontSize:11,color:T.txtS,marginBottom:14}}>@kglobal.tech.girl</p>
      <button onClick={()=>nav('waitlist')} style={{padding:'8px 18px',background:T.gold,color:T.navy,border:'none',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer'}}>TED 스피킹 프로그램 →</button>
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

// ─── FORM ───
function FormPg({title,desc,onSubmit,msg,btn,note,fields}) {
  return (<div style={{padding:'70px 16px 40px',maxWidth:400,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:28}}><Flame size={36}/></div>
    <h2 style={{fontSize:22,fontWeight:700,color:T.txt,textAlign:'center',marginBottom:6}}>{title}</h2>
    <p style={{fontSize:13,color:T.txtS,textAlign:'center',marginBottom:28,lineHeight:1.7}}>{desc}</p>
    {msg ? <div style={{padding:24,background:'rgba(212,168,83,0.06)',border:`1px solid ${T.border}`,borderRadius:10,textAlign:'center'}}><p style={{fontSize:16,fontWeight:700,color:T.goldL}}>{msg}</p></div> :
      <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:10}}>
        {fields.map(f=><In key={f.n} name={f.n} type={f.t||'text'} placeholder={f.p} required={f.r}/>)}
        <button type="submit" style={{padding:12,background:`linear-gradient(135deg,${T.gold},${T.goldM})`,color:T.navy,fontSize:14,fontWeight:700,border:'none',borderRadius:8,cursor:'pointer',marginTop:4}}>{btn}</button>
        {note && <p style={{fontSize:10,color:T.txtD,textAlign:'center'}}>{note}</p>}
        <p style={{fontSize:10,color:T.txtD,textAlign:'center'}}>※ 결제 후 환불은 불가합니다.</p>
      </form>
    }
  </div>)
}

// ─── ADMIN ───
function Admin() {
  return (<div style={{padding:'70px 16px 40px',maxWidth:500,margin:'0 auto',textAlign:'center'}}>
    <h2 style={{fontSize:20,fontWeight:700,color:T.txt,marginBottom:16}}>관리자 안내</h2>
    <div style={{background:T.navyL,border:`1px solid ${T.border}`,borderRadius:10,padding:24,textAlign:'left'}}>
      <p style={{fontSize:14,color:T.txtS,lineHeight:1.8,marginBottom:16}}>데이터는 Formspree에서 확인하세요:</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>📋 <strong>대기자 확인:</strong> formspree.io → 대기자 폼 대시보드</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>👤 <strong>회원 확인:</strong> formspree.io → 회원가입 폼 대시보드</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>📧 <strong>이메일 발송:</strong> Formspree CSV → Stibee 업로드</p>
      <p style={{fontSize:13,color:T.txt,marginBottom:8}}>📱 <strong>문자 발송:</strong> aligo.in (건당 ~15원)</p>
      <p style={{fontSize:13,color:T.txt}}>💬 <strong>디스코드:</strong> 결제 확인 후 초대 링크 DM</p>
      <div style={{marginTop:20,padding:16,background:'rgba(212,168,83,0.04)',borderRadius:8}}>
        <p style={{fontSize:12,color:T.gold,fontWeight:600,marginBottom:8}}>1기 운영 워크플로우</p>
        <p style={{fontSize:11,color:T.txtS,lineHeight:1.8}}>
          1. 대기자 등록 → Formspree에 쌓임<br/>
          2. 오픈 시 Stibee로 이메일 발송<br/>
          3. 결제: 토스 송금 링크 DM<br/>
          4. 결제 확인 → 디스코드 초대 링크 발송<br/>
          5. 알리고로 문자 알림 (선택)
        </p>
      </div>
    </div>
  </div>)
}
