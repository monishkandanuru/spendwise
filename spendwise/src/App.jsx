import { useState, useRef, useEffect } from "react";

const CATS = [
  { id:"food",          label:"Food & Dining",  icon:"🍽️", color:"#FF6B6B" },
  { id:"transport",     label:"Transport",       icon:"🚗", color:"#4ECDC4" },
  { id:"clothing",      label:"Clothing",        icon:"👗", color:"#A78BFA" },
  { id:"education",     label:"Education",       icon:"📚", color:"#60A5FA" },
  { id:"health",        label:"Health",          icon:"💊", color:"#34D399" },
  { id:"entertainment", label:"Entertainment",   icon:"🎬", color:"#FBBF24" },
  { id:"utilities",     label:"Utilities",       icon:"💡", color:"#FB923C" },
  { id:"other",         label:"Other",           icon:"📦", color:"#94A3B8" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = n => "₹" + Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const toISO = () => new Date().toISOString().split("T")[0];
function getWeek(s){const d=new Date(s),x=d.getDay()||7;d.setDate(d.getDate()+4-x);const y=new Date(d.getFullYear(),0,1);return Math.ceil((((d-y)/86400000)+1)/7);}

const DEMO = [
  {id:1,amount:450,category:"food",note:"Lunch at restaurant",date:"2026-03-05"},
  {id:2,amount:1200,category:"transport",note:"Monthly bus pass",date:"2026-03-04"},
  {id:3,amount:3500,category:"clothing",note:"New shirt",date:"2026-03-03"},
  {id:4,amount:800,category:"education",note:"Online course",date:"2026-03-02"},
  {id:5,amount:250,category:"food",note:"Groceries",date:"2026-03-01"},
  {id:6,amount:600,category:"health",note:"Pharmacy",date:"2026-02-28"},
  {id:7,amount:1800,category:"entertainment",note:"Movie + dinner",date:"2026-02-25"},
  {id:8,amount:500,category:"utilities",note:"Electricity bill",date:"2026-02-20"},
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #d4a853; border-radius: 2px; }
  @keyframes up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fade { from{opacity:0} to{opacity:1} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  .sw-card { background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.018)); border:1px solid rgba(212,168,83,.14); border-radius:18px; backdrop-filter:blur(10px); }
  .sw-gbtn { background:linear-gradient(135deg,#d4a853,#f0c96e,#d4a853); background-size:200%; color:#080c18; border:none; border-radius:13px; font-weight:700; cursor:pointer; transition:all .3s; font-family:'DM Sans',sans-serif; }
  .sw-gbtn:hover { background-position:100%; transform:translateY(-2px); box-shadow:0 8px 24px rgba(212,168,83,.4); }
  .sw-gbtn:active { transform:scale(.97); }
  .sw-xbtn { background:transparent; border:1px solid rgba(212,168,83,.3); color:#d4a853; border-radius:11px; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .sw-xbtn:hover { background:rgba(212,168,83,.1); }
  .sw-chip { cursor:pointer; border-radius:12px; padding:10px 8px; border:2px solid transparent; transition:all .2s; text-align:center; background:rgba(255,255,255,.04); }
  .sw-chip:active { transform:scale(.95); }
  .sw-chip.sel { border-color:#d4a853; background:rgba(212,168,83,.14); }
  .sw-row:hover .sw-del { opacity:1!important; }
  .sw-del { opacity:0; transition:opacity .2s; }
  .sw-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.8); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:flex-end; justify-content:center; animation:fade .2s; }
  .sw-modal { background:linear-gradient(160deg,#111827,#0d1428); border:1px solid rgba(212,168,83,.22); border-radius:24px 24px 0 0; padding:28px 22px; width:100%; animation:up .28s; max-height:92vh; overflow-y:auto; }
  .sw-input { font-family:'DM Sans',sans-serif; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09); border-radius:12px; color:#fff; padding:13px 15px; width:100%; font-size:14px; transition:border-color .2s; }
  .sw-input:focus { outline:none; border-color:rgba(212,168,83,.5); }
  .sw-input::placeholder { color:#475569; }
  .sw-bar { height:8px; border-radius:4px; background:rgba(255,255,255,.07); overflow:hidden; }
  .sw-fill { height:100%; border-radius:4px; transition:width 1s ease; }
  .sw-notif { position:fixed; top:18px; left:50%; transform:translateX(-50%); padding:12px 22px; border-radius:14px; z-index:400; animation:up .3s; font-weight:600; font-size:13px; pointer-events:none; white-space:nowrap; box-shadow:0 6px 24px rgba(0,0,0,.5); font-family:'DM Sans',sans-serif; }
  .sw-bnav { position:fixed; bottom:0; left:0; right:0; background:rgba(6,9,20,.97); backdrop-filter:blur(24px); border-top:1px solid rgba(212,168,83,.1); display:flex; z-index:100; }
  .sw-bitem { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:11px 0; cursor:pointer; color:#475569; font-size:10px; font-weight:600; transition:color .2s; font-family:'DM Sans',sans-serif; }
  .sw-bitem.on { color:#d4a853; }
  .sw-fab { position:fixed; bottom:76px; right:20px; width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg,#d4a853,#f0c96e); border:none; cursor:pointer; font-size:30px; color:#080c18; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 28px rgba(212,168,83,.6); z-index:150; transition:transform .2s; line-height:1; }
  .sw-fab:active { transform:scale(.9); }
  .sw-mscroll { display:flex; gap:6px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; padding-bottom:2px; }
  .sw-mscroll::-webkit-scrollbar { display:none; }
  .sw-mbtn { padding:5px 14px; border-radius:20px; font-size:12px; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all .2s; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.03); color:#64748b; }
  .sw-mbtn.on { border-color:#d4a853; background:rgba(212,168,83,.15); color:#d4a853; }
  .sw-snav { cursor:pointer; padding:10px 16px; border-radius:12px; transition:all .2s; font-weight:500; font-size:13.5px; display:flex; align-items:center; gap:11px; color:#64748b; margin-bottom:3px; font-family:'DM Sans',sans-serif; }
  .sw-snav:hover { background:rgba(212,168,83,.08); color:#94a3b8; }
  .sw-snav.on { background:rgba(212,168,83,.14); color:#d4a853; }
  .sw-sync { width:8px; height:8px; border-radius:50%; background:#4ade80; display:inline-block; animation:pulse 2s infinite; }
`;

export default function SpendWise() {
  const [entries,    setEntries]    = useState(DEMO);
  const [budget,     setBudget]     = useState(10000);
  const [view,       setView]       = useState("dashboard");
  const [showAdd,    setShowAdd]    = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [form,       setForm]       = useState({amount:"",category:"",note:"",date:toISO()});
  const [budgetInput,setBudgetInput]= useState("");
  const [selMonth,   setSelMonth]   = useState(new Date().getMonth());
  const [notif,      setNotif]      = useState(null);
  const [width,      setWidth]      = useState(600);
  const containerRef = useRef();
  const amtRef = useRef();
  const selYear = new Date().getFullYear();
  const isMobile = width < 640;

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const toast = (msg, type="ok") => { setNotif({msg,type}); setTimeout(()=>setNotif(null),2500); };

  const addEntry = () => {
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return toast("Enter a valid amount","err");
    if (!form.category) return toast("Pick a category","err");
    setEntries(p => [{id:Date.now(), amount:+form.amount, category:form.category, note:form.note, date:form.date}, ...p]);
    setForm({amount:"",category:"",note:"",date:toISO()});
    setShowAdd(false);
    toast("Expense added! ✓");
  };

  const delEntry = id => { setEntries(p=>p.filter(e=>e.id!==id)); toast("Removed","info"); };

  // Derived
  const mEntries = entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===selMonth&&d.getFullYear()===selYear;});
  const mTotal   = mEntries.reduce((s,e)=>s+e.amount,0);
  const pMonth   = selMonth===0?11:selMonth-1;
  const pYear    = selMonth===0?selYear-1:selYear;
  const pEntries = entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===pMonth&&d.getFullYear()===pYear;});
  const pTotal   = pEntries.reduce((s,e)=>s+e.amount,0);
  const diff     = mTotal-pTotal;
  const diffPct  = pTotal>0?((diff/pTotal)*100).toFixed(1):null;
  const budPct   = Math.min((mTotal/budget)*100,100);
  const todayTot = entries.filter(e=>e.date===toISO()).reduce((s,e)=>s+e.amount,0);
  const todayCnt = entries.filter(e=>e.date===toISO()).length;
  const catBreak = CATS.map(c=>({...c,total:mEntries.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0)})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
  const weeks    = {};
  mEntries.forEach(e=>{const w=getWeek(e.date);if(!weeks[w])weeks[w]={total:0,count:0};weeks[w].total+=e.amount;weeks[w].count++;});

  const bg = "linear-gradient(135deg,#080c18 0%,#0d1428 60%,#090e1c 100%)";
  const ff = "'DM Sans',sans-serif";

  const MonthRow = () => (
    <div className="sw-mscroll">
      {MONTHS.map((m,i)=>(
        <button key={m} className={`sw-mbtn${selMonth===i?" on":""}`} onClick={()=>setSelMonth(i)}>{m}</button>
      ))}
    </div>
  );

  const NAV = [{id:"dashboard",icon:"⬡",label:"Dashboard"},{id:"history",icon:"☰",label:"History"},{id:"analytics",icon:"◎",label:"Analytics"}];

  return (
    <div ref={containerRef} style={{fontFamily:ff,background:bg,color:"#e2e8f0",minHeight:"100vh",position:"relative",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* Toast */}
      {notif && (
        <div className="sw-notif" style={{background:notif.type==="err"?"linear-gradient(135deg,#7f1d1d,#991b1b)":notif.type==="info"?"linear-gradient(135deg,#1e3a5f,#1e40af)":"linear-gradient(135deg,#14532d,#166534)",border:`1px solid ${notif.type==="err"?"#ef4444":notif.type==="info"?"#3b82f6":"#22c55e"}`,color:"#fff"}}>
          {notif.msg}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="sw-modal-bg" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="sw-modal" style={{maxWidth:isMobile?"100%":500, borderRadius:isMobile?"24px 24px 0 0":"24px", margin:isMobile?0:"auto"}}>
            <div style={{width:44,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 22px",display:isMobile?"block":"none"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:21,color:"#d4a853"}}>Add Expense</h2>
              <button onClick={()=>setShowAdd(false)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:26}}>×</button>
            </div>

            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Amount (₹)</div>
            <div style={{position:"relative",marginBottom:18}}>
              <span style={{position:"absolute",left:15,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:19,fontWeight:700}}>₹</span>
              <input ref={amtRef} className="sw-input" type="number" inputMode="decimal" value={form.amount}
                onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.00"
                style={{paddingLeft:38,fontSize:24,fontWeight:700,borderColor:"rgba(212,168,83,.25)"}}/>
            </div>

            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:10}}>Category</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
              {CATS.map(c=>(
                <div key={c.id} className={`sw-chip${form.category===c.id?" sel":""}`}
                  style={{background:form.category===c.id?`${c.color}22`:"rgba(255,255,255,.04)"}}
                  onClick={()=>setForm({...form,category:c.id})}>
                  <div style={{fontSize:20}}>{c.icon}</div>
                  <div style={{fontSize:9,color:form.category===c.id?c.color:"#64748b",marginTop:4,fontWeight:600}}>{c.label.split(" ")[0]}</div>
                </div>
              ))}
            </div>

            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Note (optional)</div>
            <input className="sw-input" type="text" value={form.note}
              onChange={e=>setForm({...form,note:e.target.value})} placeholder="What was this for?"
              style={{marginBottom:16}}/>

            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Date</div>
            <input className="sw-input" type="date" value={form.date}
              onChange={e=>setForm({...form,date:e.target.value})}
              style={{marginBottom:24,colorScheme:"dark"}}/>

            <button className="sw-gbtn" onClick={addEntry} style={{width:"100%",padding:"16px",fontSize:15}}>+ Add Expense</button>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudget && (
        <div className="sw-modal-bg" onClick={e=>e.target===e.currentTarget&&setShowBudget(false)}>
          <div className="sw-modal" style={{maxWidth:isMobile?"100%":380,borderRadius:isMobile?"24px 24px 0 0":"24px",margin:isMobile?0:"auto"}}>
            <div style={{width:44,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 22px",display:isMobile?"block":"none"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853",marginBottom:6}}>Monthly Budget</h2>
            <p style={{fontSize:13,color:"#475569",marginBottom:20}}>Current limit: {fmt(budget)}</p>
            <div style={{position:"relative",marginBottom:22}}>
              <span style={{position:"absolute",left:15,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:19,fontWeight:700}}>₹</span>
              <input className="sw-input" type="number" inputMode="decimal" value={budgetInput}
                onChange={e=>setBudgetInput(e.target.value)} placeholder={String(budget)}
                style={{paddingLeft:38,fontSize:22,fontWeight:700,borderColor:"rgba(212,168,83,.25)"}}/>
            </div>
            <button className="sw-gbtn" style={{width:"100%",padding:"15px",fontSize:15}} onClick={()=>{
              if(budgetInput&&+budgetInput>0){setBudget(+budgetInput);setBudgetInput("");setShowBudget(false);toast("Budget updated!");}
            }}>Save Budget</button>
          </div>
        </div>
      )}

      {/* ── DESKTOP ── */}
      {!isMobile ? (
        <div style={{display:"flex",minHeight:"100vh"}}>
          {/* Sidebar */}
          <div style={{width:220,padding:"28px 14px",background:"rgba(0,0,0,.4)",borderRight:"1px solid rgba(212,168,83,.08)",display:"flex",flexDirection:"column",flexShrink:0}}>
            <div style={{paddingLeft:6,marginBottom:32}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#d4a853"}}>Spend<span style={{color:"#fff"}}>Wise</span></div>
              <div style={{fontSize:10,color:"#334155",letterSpacing:2,textTransform:"uppercase",marginTop:4}}>Money Tracker</div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",marginBottom:22}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(212,168,83,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>👤</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600}}>Monish</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                  <div className="sw-sync"/>
                  <span style={{fontSize:10,color:"#4ade80"}}>Active</span>
                </div>
              </div>
            </div>

            {NAV.map(n=>(
              <div key={n.id} className={`sw-snav${view===n.id?" on":""}`} onClick={()=>setView(n.id)}>
                <span style={{fontSize:16}}>{n.icon}</span>{n.label}
              </div>
            ))}
            <div style={{flex:1}}/>
            <button className="sw-xbtn" onClick={()=>setShowBudget(true)} style={{padding:"9px 13px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
              <span>⚙</span> Set Budget
            </button>
          </div>

          {/* Desktop content */}
          <div style={{flex:1,padding:"28px 32px",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26}}>{view==="dashboard"?"Dashboard":view==="history"?"Expense History":"Analytics"}</h1>
                <p style={{color:"#475569",fontSize:12,marginTop:3}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
              </div>
              <button className="sw-gbtn" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}} style={{padding:"13px 24px",fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:20,fontWeight:200,lineHeight:1}}>+</span> Add Expense
              </button>
            </div>
            <div style={{marginBottom:22}}><MonthRow/></div>
            <PageContent view={view} mEntries={mEntries} mTotal={mTotal} pEntries={pEntries} pTotal={pTotal} diff={diff} diffPct={diffPct} budPct={budPct} budget={budget} todayTot={todayTot} todayCnt={todayCnt} catBreak={catBreak} weeks={weeks} selMonth={selMonth} selYear={selYear} pMonth={pMonth} pYear={pYear} entries={entries} del={delEntry} isMobile={false}/>
            <Footer/>
          </div>
        </div>

      ) : (
      /* ── MOBILE ── */
        <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",paddingBottom:140}}>
          {/* Mobile topbar */}
          <div style={{padding:"16px 18px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.05)",background:"rgba(0,0,0,.3)",position:"sticky",top:0,zIndex:50}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853"}}>Spend<span style={{color:"#fff"}}>Wise</span></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div className="sw-sync"/><span style={{fontSize:10,color:"#4ade80",fontWeight:600}}>Live</span>
              </div>
              <button className="sw-xbtn" onClick={()=>setShowBudget(true)} style={{padding:"6px 12px",fontSize:12}}>⚙ Budget</button>
            </div>
          </div>

          <div style={{padding:"14px 18px 10px"}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:12}}>
              {view==="dashboard"?"Dashboard":view==="history"?"History":"Analytics"}
            </h1>
            <MonthRow/>
          </div>

          <div style={{flex:1,padding:"4px 18px 0",overflowY:"auto"}}>
            <PageContent view={view} mEntries={mEntries} mTotal={mTotal} pEntries={pEntries} pTotal={pTotal} diff={diff} diffPct={diffPct} budPct={budPct} budget={budget} todayTot={todayTot} todayCnt={todayCnt} catBreak={catBreak} weeks={weeks} selMonth={selMonth} selYear={selYear} pMonth={pMonth} pYear={pYear} entries={entries} del={delEntry} isMobile={true}/>
            <Footer mobile/>
          </div>

          <button className="sw-fab" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}}>+</button>

          <div className="sw-bnav">
            {NAV.map(n=>(
              <div key={n.id} className={`sw-bitem${view===n.id?" on":""}`} onClick={()=>setView(n.id)}>
                <span style={{fontSize:22}}>{n.icon}</span><span>{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PageContent({view,...props}){
  if(view==="dashboard") return <Dashboard {...props}/>;
  if(view==="history")   return <History   {...props}/>;
  if(view==="analytics") return <Analytics {...props}/>;
}

function StatCard({label,value,valueColor,sub,subColor,delay,span}){
  return(
    <div className="sw-card" style={{padding:18,animation:`up .4s ease ${delay||0}s both`,gridColumn:span?"1/-1":"auto"}}>
      <div style={{fontSize:10,color:"#475569",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',serif",color:valueColor||"#fff",lineHeight:1.1}}>{value}</div>
      <div style={{fontSize:11,marginTop:7,color:subColor||"#64748b",fontWeight:500}}>{sub}</div>
    </div>
  );
}

function Dashboard({mTotal,diff,diffPct,pMonth,budPct,budget,todayTot,todayCnt,catBreak,entries,del,isMobile}){
  return(
    <div style={{animation:"up .35s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <StatCard span label="Monthly Total" value={fmt(mTotal)} valueColor="#fff"
          sub={diffPct?`${diff>0?"↑":"↓"} ${Math.abs(diffPct)}% vs ${MONTHS[pMonth]}`:"No previous data"}
          subColor={diff>0?"#f87171":"#4ade80"} delay={0}/>
        <StatCard label="Today" value={fmt(todayTot)} valueColor="#d4a853"
          sub={`${todayCnt} transaction${todayCnt!==1?"s":""}`} subColor="#64748b" delay={.1}/>
        <StatCard label="Budget Left" value={fmt(Math.abs(budget-mTotal))}
          valueColor={(budget-mTotal)<0?"#f87171":"#4ade80"}
          sub={(budget-mTotal)<0?"⚠ Over budget!":fmt(budget)+" limit"}
          subColor={(budget-mTotal)<0?"#f87171":"#4ade80"} delay={.2}/>
      </div>

      <div className="sw-card" style={{padding:18,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:600}}>Budget Usage</span>
          <span style={{fontSize:13,fontWeight:700,color:budPct>90?"#f87171":"#d4a853"}}>{budPct.toFixed(1)}%</span>
        </div>
        <div className="sw-bar"><div className="sw-fill" style={{width:`${budPct}%`,background:budPct>90?"linear-gradient(90deg,#f87171,#ef4444)":"linear-gradient(90deg,#d4a853,#f0c96e)"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:"#475569"}}>
          <span>Spent {fmt(mTotal)}</span><span>Limit {fmt(budget)}</span>
        </div>
      </div>

      {catBreak.length>0&&(
        <div className="sw-card" style={{padding:18,marginBottom:14}}>
          <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Category Breakdown</div>
          {catBreak.map(c=>(
            <div key={c.id} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13,fontWeight:500}}>{c.icon} {c.label}</span>
                <span style={{fontSize:13,fontWeight:700,color:c.color}}>{fmt(c.total)}</span>
              </div>
              <div className="sw-bar"><div className="sw-fill" style={{width:`${(c.total/mTotal*100).toFixed(1)}%`,background:`linear-gradient(90deg,${c.color}66,${c.color})`}}/></div>
            </div>
          ))}
        </div>
      )}

      <div className="sw-card" style={{padding:18}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Recent Transactions</div>
        {entries.length===0
          ?<div style={{textAlign:"center",padding:"32px 0",color:"#334155"}}><div style={{fontSize:36,marginBottom:10}}>💸</div><div style={{fontSize:13}}>No transactions yet!</div></div>
          :entries.slice(0,8).map(e=>{
            const cat=CATS.find(c=>c.id===e.category);
            return(
              <div key={e.id} className="sw-row" style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{width:40,height:40,borderRadius:12,background:`${cat?.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,marginRight:12,flexShrink:0}}>{cat?.icon||"📦"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note||cat?.label||"Expense"}</div>
                  <div style={{fontSize:10,color:"#475569",marginTop:2}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})} · {cat?.label}</div>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:"#f87171",marginRight:isMobile?8:12,flexShrink:0}}>-{fmt(e.amount)}</span>
                <button className="sw-del sw-xbtn" onClick={()=>del(e.id)} style={{padding:"3px 8px",fontSize:11,color:"#f87171",borderColor:"rgba(248,113,113,.3)",flexShrink:0,opacity:1}}>✕</button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function History({mEntries,weeks,selMonth,selYear,del}){
  return(
    <div style={{animation:"up .35s ease"}}>
      <div className="sw-card" style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Weekly Breakdown — {MONTHS[selMonth]} {selYear}</div>
        {Object.keys(weeks).length===0
          ?<div style={{color:"#475569",fontSize:13,padding:"14px 0"}}>No data for this month.</div>
          :Object.entries(weeks).sort((a,b)=>+a[0]-+b[0]).map(([w,d])=>(
            <div key={w} style={{borderLeft:"3px solid rgba(212,168,83,.3)",paddingLeft:14,marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Week {w}</span>
                <span style={{fontSize:14,fontWeight:700,color:"#d4a853"}}>{fmt(d.total)}</span>
              </div>
              <div style={{fontSize:11,color:"#475569",marginTop:2}}>{d.count} transaction{d.count!==1?"s":""}</div>
            </div>
          ))}
      </div>
      <div className="sw-card" style={{padding:18}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>All Entries — {MONTHS[selMonth]} {selYear}</div>
        {mEntries.length===0
          ?<div style={{textAlign:"center",padding:"32px 0",color:"#334155"}}><div style={{fontSize:34,marginBottom:10}}>📅</div><div style={{fontSize:13}}>No entries for {MONTHS[selMonth]} {selYear}</div></div>
          :mEntries.map(e=>{
            const cat=CATS.find(c=>c.id===e.category);
            return(
              <div key={e.id} className="sw-row" style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{width:40,height:40,borderRadius:12,background:`${cat?.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,marginRight:12,flexShrink:0}}>{cat?.icon||"📦"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note||cat?.label}</div>
                  <div style={{fontSize:10,color:"#475569",marginTop:2}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                </div>
                <div style={{textAlign:"right",marginRight:10,flexShrink:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#f87171"}}>-{fmt(e.amount)}</div>
                  <div style={{fontSize:10,color:cat?.color,marginTop:1}}>{cat?.label}</div>
                </div>
                <button className="sw-del sw-xbtn" onClick={()=>del(e.id)} style={{padding:"3px 8px",fontSize:11,color:"#f87171",borderColor:"rgba(248,113,113,.3)",flexShrink:0,opacity:1}}>✕</button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function Analytics({mTotal,mEntries,pTotal,pEntries,diff,diffPct,catBreak,selMonth,selYear,pMonth,pYear,entries}){
  return(
    <div style={{animation:"up .35s ease"}}>
      <div className="sw-card" style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Month Comparison</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{label:`${MONTHS[selMonth]} ${selYear}`,total:mTotal,cnt:mEntries.length,col:"#d4a853"},
            {label:`${MONTHS[pMonth]} ${pYear}`,total:pTotal,cnt:pEntries.length,col:"#64748b"}].map((x,i)=>(
            <div key={i} style={{padding:16,background:"rgba(255,255,255,.03)",borderRadius:14}}>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>{x.label}</div>
              <div style={{fontSize:21,fontWeight:700,fontFamily:"'Playfair Display',serif",color:x.col,lineHeight:1}}>{fmt(x.total)}</div>
              <div style={{fontSize:11,color:"#475569",marginTop:6}}>{x.cnt} transactions</div>
            </div>
          ))}
        </div>
        {diffPct!==null&&(
          <div style={{marginTop:16,padding:14,borderRadius:13,background:diff>0?"rgba(248,113,113,.08)":"rgba(74,222,128,.08)",border:`1px solid ${diff>0?"rgba(248,113,113,.2)":"rgba(74,222,128,.2)"}`,textAlign:"center"}}>
            <span style={{fontSize:15,fontWeight:700,color:diff>0?"#f87171":"#4ade80"}}>{diff>0?"↑":"↓"} {Math.abs(diffPct)}% {diff>0?"more":"less"} than last month</span>
            <div style={{fontSize:11,color:"#64748b",marginTop:4}}>Difference: {fmt(Math.abs(diff))}</div>
          </div>
        )}
      </div>

      {catBreak.length>0&&(
        <div className="sw-card" style={{padding:18,marginBottom:14}}>
          <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Spending by Category</div>
          {catBreak.map(c=>(
            <div key={c.id} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13}}>{c.icon} {c.label}</span>
                <span style={{fontSize:13,fontWeight:700,color:c.color}}>{fmt(c.total)} <span style={{color:"#475569",fontWeight:400}}>({(c.total/mTotal*100).toFixed(0)}%)</span></span>
              </div>
              <div className="sw-bar" style={{height:10}}><div className="sw-fill" style={{width:`${(c.total/mTotal*100).toFixed(1)}%`,background:`linear-gradient(90deg,${c.color}55,${c.color})`}}/></div>
            </div>
          ))}
        </div>
      )}

      <div className="sw-card" style={{padding:18}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>6-Month Trend</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:110}}>
          {Array.from({length:6},(_,i)=>{
            const m=(selMonth-5+i+12)%12;
            const y=selMonth-5+i<0?selYear-1:selYear;
            const t=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===m&&d.getFullYear()===y;}).reduce((s,e)=>s+e.amount,0);
            return{m,y,t};
          }).map((x,i,arr)=>{
            const mx=Math.max(...arr.map(a=>a.t),1);
            const h=Math.max((x.t/mx)*100,4);
            const cur=x.m===selMonth&&x.y===selYear;
            return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{fontSize:9,color:"#64748b",fontWeight:600}}>{x.t>0?"₹"+Math.round(x.t/1000)+"k":""}</div>
                <div style={{width:"100%",height:`${h}%`,borderRadius:"5px 5px 3px 3px",background:cur?"linear-gradient(180deg,#d4a853,#f0c96e)":"rgba(255,255,255,.07)",border:cur?"1px solid rgba(212,168,83,.4)":"none",transition:"all .6s"}}/>
                <div style={{fontSize:9,color:cur?"#d4a853":"#475569",fontWeight:cur?700:400}}>{MONTHS[x.m]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Footer({mobile}){
  return(
    <footer style={{borderTop:"1px solid rgba(212,168,83,.1)",background:"rgba(0,0,0,.4)",padding:mobile?"22px 0 20px":"24px 0",textAlign:"center",marginTop:32}}>
      <div style={{display:"inline-flex",alignItems:"center",padding:"4px 16px",borderRadius:20,background:"rgba(212,168,83,.07)",border:"1px solid rgba(212,168,83,.16)",marginBottom:10}}>
        <span style={{fontSize:10,color:"#d4a853",letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>Created by</span>
      </div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#fff",letterSpacing:1.5,marginBottom:10}}>MONISH KANDANURU</div>
      <p style={{fontSize:12,color:"#475569",maxWidth:360,margin:"0 auto",lineHeight:1.8,fontStyle:"italic",padding:"0 20px"}}>
        "Money should be saved and each penny spent should be tracked so we can easily know where did we spend that money on."
      </p>
      <div style={{marginTop:14,fontSize:10,color:"#1e293b"}}>© {new Date().getFullYear()} SpendWise · All rights reserved</div>
    </footer>
  );
}