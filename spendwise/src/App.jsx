import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://btlfemlkvzitbzojqopy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bGZlbWxrdnppdGJ6b2pxb3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDU5NjQsImV4cCI6MjA4ODIyMTk2NH0.oYNtp-MfuaN-77VweZLRH0bAUt7P3Ln0q6adWrg5y40";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const CATS = [
  { id:"food",          label:"Food & Dining",  icon:"🍽️", color:"#f43f5e" },
  { id:"transport",     label:"Transport",       icon:"🚗", color:"#06b6d4" },
  { id:"clothing",      label:"Clothing",        icon:"👗", color:"#a855f7" },
  { id:"education",     label:"Education",       icon:"📚", color:"#3b82f6" },
  { id:"health",        label:"Health",          icon:"💊", color:"#10b981" },
  { id:"entertainment", label:"Entertainment",   icon:"🎬", color:"#f59e0b" },
  { id:"utilities",     label:"Utilities",       icon:"💡", color:"#fb923c" },
  { id:"other",         label:"Other",           icon:"📦", color:"#94a3b8" },
];

const AVATARS = ["👤","😎","🧑‍💻","👨‍🎓","👩‍🎓","🦸","🧙","🐯","🦊","🐼","🦁","🐸"];
const AVATAR_COLORS = ["#6366f1","#f59e0b","#10b981","#f43f5e","#06b6d4","#a855f7","#fb923c","#3b82f6"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = n => "₹" + Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const toISO = () => new Date().toISOString().split("T")[0];
function getWeek(s){const d=new Date(s),x=d.getDay()||7;d.setDate(d.getDate()+4-x);const y=new Date(d.getFullYear(),0,1);return Math.ceil((((d-y)/86400000)+1)/7);}
const NAV=[
  {id:"dashboard", icon:"⬡", label:"Home"},
  {id:"history",   icon:"📋",label:"History"},
  {id:"analytics", icon:"📊",label:"Analytics"},
  {id:"goals",     icon:"🎯",label:"Goals"},
  {id:"profile",   icon:"👤",label:"Profile"},
  {id:"developer", icon:"👨‍💻",label:"Dev"},
];
const STREAK_MILESTONES=[7,14,30];

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#07090f;overflow-x:hidden}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:linear-gradient(#6366f1,#f59e0b);border-radius:4px}

@keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,.3)}50%{box-shadow:0 0 40px rgba(99,102,241,.7)}}
@keyframes slidedown{from{opacity:0;transform:translateY(-24px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{opacity:0;transform:scale(.7)}70%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes fillbar{from{width:0}to{width:var(--w)}}
@keyframes barrise{from{height:0}to{height:var(--h)}}

.card{border-radius:20px;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}
.dark .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
.light .card{background:#fff;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,.06)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;opacity:0;transition:opacity .3s}
.card:hover::before{opacity:1}

.gbtn{background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;border-radius:14px;font-weight:700;cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden}
.gbtn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(99,102,241,.5)}
.gbtn:active{transform:scale(.95)}
.gbtn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}

.xbtn{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:11px;cursor:pointer;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif}
.light .xbtn{background:#f8fafc;border:1px solid #e2e8f0;color:#64748b}
.xbtn:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.4);color:#818cf8}
.xbtn:active{transform:scale(.95)}

.chip{cursor:pointer;border-radius:14px;padding:11px 8px;border:2px solid transparent;transition:all .2s;text-align:center}
.dark .chip{background:rgba(255,255,255,.04)}
.light .chip{background:#f8fafc}
.chip:hover{transform:scale(1.06)}
.chip:active{transform:scale(.93)}
.chip.sel{border-color:#6366f1;background:rgba(99,102,241,.15)!important;box-shadow:0 0 16px rgba(99,102,241,.25)}

.erow{transition:all .2s;border-radius:12px}
.erow:hover{background:rgba(99,102,241,.05);padding-left:8px!important;padding-right:8px!important}
.erow:hover .dbtn{opacity:1!important}
.dbtn{opacity:0;transition:opacity .2s}
@media(max-width:639px){.dbtn{opacity:1}}

.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.88);backdrop-filter:blur(14px);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fade .2s}
@media(min-width:640px){.modal-bg{align-items:center}}
.modal{border-radius:28px 28px 0 0;padding:28px 24px;width:100%;animation:up .3s cubic-bezier(.4,0,.2,1);max-height:93vh;overflow-y:auto}
.dark .modal{background:linear-gradient(160deg,#0d1321,#080f1e);border:1px solid rgba(99,102,241,.2);border-bottom:none}
.light .modal{background:#fff;border:1px solid #e2e8f0;border-bottom:none}
@media(min-width:640px){.modal{border-radius:28px;max-width:520px;width:92%;border-bottom:1px solid rgba(99,102,241,.2)}}

.sw-input{font-family:'Plus Jakarta Sans',sans-serif;border-radius:14px;padding:14px 16px;width:100%;font-size:14px;transition:all .2s;outline:none}
.dark .sw-input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#e2e8f0}
.light .sw-input{background:#f8fafc;border:1px solid #e2e8f0;color:#1e293b}
.sw-input::placeholder{color:#475569}
.sw-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}

.bar{height:8px;border-radius:6px;overflow:hidden;transition:background .3s}
.dark .bar{background:rgba(255,255,255,.06)}
.light .bar{background:#f1f5f9}
.fill{height:100%;border-radius:6px;transition:width 1.2s cubic-bezier(.4,0,.2,1)}

.notif{position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:14px 24px;border-radius:16px;z-index:400;animation:popIn .3s cubic-bezier(.4,0,.2,1);font-weight:700;font-size:13px;pointer-events:none;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,.4);font-family:'Plus Jakarta Sans',sans-serif}

.bnav{position:fixed;bottom:0;left:0;right:0;backdrop-filter:blur(24px);display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px)}
.dark .bnav{background:rgba(7,9,15,.96);border-top:1px solid rgba(99,102,241,.12)}
.light .bnav{background:rgba(255,255,255,.97);border-top:1px solid #e2e8f0}
.bitem{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 0;cursor:pointer;font-size:9px;font-weight:700;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:.5px;text-transform:uppercase}
.dark .bitem{color:#334155}
.light .bitem{color:#94a3b8}
.bitem.on{color:#818cf8}
.bitem:active{transform:scale(.88)}

.fab{position:fixed;bottom:76px;right:18px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);border:none;cursor:pointer;font-size:28px;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 28px rgba(99,102,241,.6);z-index:150;transition:all .25s;animation:glow 2s infinite}
.fab:active{transform:scale(.87)}

.mscroll{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;-webkit-overflow-scrolling:touch}
.mscroll::-webkit-scrollbar{display:none}
.mbtn{padding:6px 14px;border-radius:22px;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .2s}
.dark .mbtn{border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#475569}
.light .mbtn{border:1px solid #e2e8f0;background:#f8fafc;color:#94a3b8}
.mbtn:active{transform:scale(.93)}
.mbtn.on{border-color:#6366f1;background:rgba(99,102,241,.2);color:#818cf8;box-shadow:0 0 12px rgba(99,102,241,.25)}

.snav{cursor:pointer;padding:11px 16px;border-radius:14px;transition:all .2s;font-weight:600;font-size:13px;display:flex;align-items:center;gap:11px;margin-bottom:4px;font-family:'Plus Jakarta Sans',sans-serif;position:relative;overflow:hidden}
.dark .snav{color:#475569}
.light .snav{color:#94a3b8}
.snav:hover{background:rgba(99,102,241,.1);color:#818cf8}
.snav:active{transform:scale(.96)}
.snav.on{background:linear-gradient(135deg,rgba(99,102,241,.2),rgba(129,140,248,.08));color:#818cf8;border:1px solid rgba(99,102,241,.18)}
.snav.on::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;background:linear-gradient(#6366f1,#818cf8);border-radius:0 3px 3px 0}

.spinner{border:3px solid rgba(99,102,241,.2);border-top-color:#6366f1;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.live{width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;animation:blink 2s infinite;flex-shrink:0;box-shadow:0 0 8px #10b981}

.authtab{flex:1;padding:13px;text-align:center;cursor:pointer;font-weight:700;font-size:14px;border-bottom:2px solid transparent;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif}
.dark .authtab{color:#475569}
.light .authtab{color:#94a3b8}
.authtab.on{color:#818cf8;border-bottom-color:#6366f1}
.authtab:active{opacity:.7}

.pmtab{flex:1;padding:11px;text-align:center;cursor:pointer;font-weight:700;font-size:13px;border-radius:12px;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif;border:2px solid transparent}
.pmtab:active{transform:scale(.94)}
.dark .pmtab{color:#475569}
.light .pmtab{color:#94a3b8}
.pmtab.cash.sel{background:rgba(16,185,129,.15);color:#10b981;border-color:#10b981}
.pmtab.upi.sel{background:rgba(99,102,241,.15);color:#818cf8;border-color:#6366f1}

.avatar-opt{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;transition:all .2s;border:3px solid transparent}
.avatar-opt:hover{transform:scale(1.15)}
.avatar-opt:active{transform:scale(.9)}
.avatar-opt.sel{border-color:#6366f1;box-shadow:0 0 16px rgba(99,102,241,.5)}

.stitle{font-size:10px;color:#475569;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;font-weight:700}

/* ── Pure CSS Charts ── */
.chart-bars{display:flex;align-items:flex-end;gap:6px;height:130px;padding:0 4px}
.chart-bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
.chart-bar{width:100%;border-radius:6px 6px 3px 3px;transition:height 1.2s cubic-bezier(.4,0,.2,1);min-height:4px;position:relative}
.chart-bar:hover{filter:brightness(1.2)}
.chart-bar-label{font-size:9px;font-weight:700;color:#475569;text-align:center;white-space:nowrap}
.chart-bar-val{font-size:8px;font-weight:700;position:absolute;top:-16px;left:50%;transform:translateX(-50%);white-space:nowrap}

.donut-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center}
.donut-svg{transform:rotate(-90deg)}
.donut-center{position:absolute;text-align:center;pointer-events:none}
`;

// ── Auth Screen ───────────────────────────────
function AuthScreen({onAuth,isDark}){
  const [tab,setTab]=useState("signin");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");
  const tc=isDark?"#e2e8f0":"#1e293b";
  const bg=isDark?"linear-gradient(135deg,#07090f,#0d1321 50%,#070b18)":"linear-gradient(135deg,#f1f5f9,#e2e8f0)";

  const handle=async()=>{
    setErr("");setMsg("");
    if(!email||!pw)return setErr("Please fill in all fields.");
    if(tab==="signup"&&!name)return setErr("Please enter your name.");
    if(pw.length<6)return setErr("Password must be at least 6 characters.");
    setLoading(true);
    if(tab==="signup"){
      const{error}=await supabase.auth.signUp({email,password:pw,options:{data:{full_name:name}}});
      if(error)setErr(error.message);
      else{setMsg("✅ Account created! You can now sign in.");setTab("signin");}
    }else{
      const{data,error}=await supabase.auth.signInWithPassword({email,password:pw});
      if(error)setErr(error.message);
      else onAuth(data.user);
    }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:bg,color:tc,transition:"background .3s"}}>
      <div style={{width:"100%",maxWidth:390,animation:"up .5s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:96,height:96,borderRadius:28,background:"linear-gradient(135deg,#6366f1,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 20px",boxShadow:"0 12px 40px rgba(99,102,241,.4)",animation:"float 3s ease-in-out infinite"}}>💰</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:38,lineHeight:1,marginBottom:6}}>
            <span style={{color:"#818cf8"}}>Spend</span><span style={{color:tc}}>Wise</span>
          </div>
          <div style={{fontSize:12,color:"#475569",letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Smart Money Tracker</div>
        </div>
        <div className="card" style={{padding:6,marginBottom:20,display:"flex",gap:4}}>
          {["signin","signup"].map(t=>(
            <div key={t} className={`authtab${tab===t?" on":""}`} onClick={()=>{setTab(t);setErr("");setMsg("");}}>
              {t==="signin"?"Sign In":"Create Account"}
            </div>
          ))}
        </div>
        <div className="card" style={{padding:"24px 22px"}}>
          {tab==="signup"&&(<><div className="stitle">Your Name</div><input className="sw-input" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Monish Kandanuru" style={{marginBottom:16}}/></>)}
          <div className="stitle">Email</div>
          <input className="sw-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{marginBottom:16}}/>
          <div className="stitle">Password</div>
          <input className="sw-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Min. 6 characters" style={{marginBottom:22}} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {err&&<div style={{fontSize:13,color:"#f43f5e",background:"rgba(244,63,94,.1)",border:"1px solid rgba(244,63,94,.2)",borderRadius:12,padding:"11px 15px",marginBottom:16,fontWeight:600}}>{err}</div>}
          {msg&&<div style={{fontSize:13,color:"#10b981",background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.2)",borderRadius:12,padding:"11px 15px",marginBottom:16,fontWeight:600}}>{msg}</div>}
          <button className="gbtn" onClick={handle} disabled={loading} style={{width:"100%",padding:"17px",fontSize:15}}>
            {loading?<><div className="spinner" style={{width:20,height:20}}/> Please wait...</>:tab==="signin"?"Sign In →":"Create Account →"}
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"#475569",marginTop:14,fontWeight:600}}>🔒 Private · 🔄 Real-time · 🆓 Free</p>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────
export default function SpendWise(){
  const [user,setUser]=useState(null);
  const [authReady,setAuthReady]=useState(false);
  const [entries,setEntries]=useState([]);
  const [baseBudget,setBaseBudget]=useState(10000);
  const [extraBudget,setExtraBudget]=useState(0);
  const [cashBudget,setCashBudget]=useState(0);
  const [upiBudget,setUpiBudget]=useState(0);
  const [view,setView]=useState("dashboard");
  const [showAdd,setShowAdd]=useState(false);
  const [showBudget,setShowBudget]=useState(false);
  const [showExtra,setShowExtra]=useState(false);
  const [form,setForm]=useState({amount:"",category:"",note:"",date:toISO(),pm:"upi"});
  const [budgetForm,setBudgetForm]=useState({base:"",cash:"",upi:""});
  const [extraInput,setExtraInput]=useState("");
  const [selMonth,setSelMonth]=useState(new Date().getMonth());
  const [notif,setNotif]=useState(null);
  const [isMobile,setIsMobile]=useState(window.innerWidth<640);
  const [isDark,setIsDark]=useState(()=>localStorage.getItem("sw_theme")!=="light");
  const [streak,setStreak]=useState(0);
  const [goals,setGoals]=useState(()=>{try{return JSON.parse(localStorage.getItem("sw_goals")||"[]");}catch{return[];}});
  const [goalHistory,setGoalHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("sw_goal_history")||"[]");}catch{return[];}});
  const [showGoalForm,setShowGoalForm]=useState(false);
  const [goalForm,setGoalForm]=useState({name:"",target:"",saved:""});
  const [reminder,setReminder]=useState(false);
  const [celebration,setCelebration]=useState(null);
  const [avatar,setAvatar]=useState(()=>{try{return JSON.parse(localStorage.getItem("sw_avatar")||'{"emoji":"👤","color":"#6366f1"}');}catch{return{emoji:"👤",color:"#6366f1"};}});
  const amtRef=useRef();
  const selYear=new Date().getFullYear();
  const budget=baseBudget+extraBudget;

  useEffect(()=>{const h=()=>setIsMobile(window.innerWidth<640);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  useEffect(()=>{localStorage.setItem("sw_theme",isDark?"dark":"light");document.body.style.background=isDark?"#07090f":"#f1f5f9";},[isDark]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAuthReady(true);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setUser(session?.user??null));
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!user){setEntries([]);return;}
    const load=async()=>{
      const{data,error}=await supabase.from("expenses").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
      if(!error&&data)setEntries(data);
    };
    load();
    const sub=supabase.channel("exp_ch").on("postgres_changes",{event:"*",schema:"public",table:"expenses",filter:`user_id=eq.${user.id}`},load).subscribe();
    return()=>supabase.removeChannel(sub);
  },[user]);

  useEffect(()=>{
    if(!user)return;
    const load=async()=>{
      const{data,error}=await supabase.from("budgets").select("*").eq("user_id",user.id).maybeSingle();
      if(!error&&data){
        setBaseBudget(Number(data.amount)||10000);
        setExtraBudget(Number(data.extra)||0);
        setCashBudget(Number(data.cash_budget)||0);
        setUpiBudget(Number(data.upi_budget)||0);
      }
    };
    load();
    const sub=supabase.channel("bud_ch").on("postgres_changes",{event:"*",schema:"public",table:"budgets",filter:`user_id=eq.${user.id}`},load).subscribe();
    return()=>supabase.removeChannel(sub);
  },[user]);

  useEffect(()=>{
    if(!entries.length)return;
    const dates=[...new Set(entries.map(e=>e.date))].sort((a,b)=>b.localeCompare(a));
    let s=0;
    for(let i=0;i<dates.length;i++){
      const d=new Date(dates[i]);d.setHours(0,0,0,0);
      const cur=new Date();cur.setHours(0,0,0,0);
      if(Math.round((cur-d)/86400000)===i)s++;else break;
    }
    setStreak(s);
    if(STREAK_MILESTONES.includes(s)){setCelebration(s);setTimeout(()=>setCelebration(null),4500);}
  },[entries]);

  useEffect(()=>{
    const last=localStorage.getItem("sw_reminder_date"),today=toISO();
    if(last===today)return;
    const now=new Date(),ms=new Date(now.getFullYear(),now.getMonth(),now.getDate(),20,0,0)-now;
    const show=()=>{localStorage.setItem("sw_reminder_date",today);if("Notification" in window&&Notification.permission==="granted")new Notification("SpendWise 💰",{body:"Don't forget to add today's expenses!"});else{setReminder(true);setTimeout(()=>setReminder(false),8000);}};
    if(ms>0){const t=setTimeout(show,ms);return()=>clearTimeout(t);}
  },[]);
  useEffect(()=>{if("Notification" in window&&Notification.permission==="default")Notification.requestPermission();},[]);
  useEffect(()=>{try{localStorage.setItem("sw_goals",JSON.stringify(goals));}catch{}},[goals]);
  useEffect(()=>{try{localStorage.setItem("sw_goal_history",JSON.stringify(goalHistory));}catch{}},[goalHistory]);
  useEffect(()=>{try{localStorage.setItem("sw_avatar",JSON.stringify(avatar));}catch{}},[avatar]);

  const toast=(m,type="ok")=>{setNotif({m,type});setTimeout(()=>setNotif(null),2600);};
  const doLogout=async()=>{await supabase.auth.signOut();setEntries([]);};

  const addEntry=async()=>{
    if(!form.amount||isNaN(form.amount)||+form.amount<=0)return toast("Enter a valid amount","err");
    if(!form.category)return toast("Pick a category","err");
    const{error}=await supabase.from("expenses").insert({user_id:user.id,amount:+form.amount,category:form.category,note:form.note,date:form.date,payment_method:form.pm});
    if(error)return toast("Failed to save","err");
    setForm({amount:"",category:"",note:"",date:toISO(),pm:"upi"});
    setShowAdd(false);toast("Expense added! ✓");
  };

  const delEntry=async(id)=>{await supabase.from("expenses").delete().eq("id",id).eq("user_id",user.id);toast("Removed","info");};

  const saveBudget=async()=>{
    const base=+budgetForm.base;
    if(!base||base<=0)return toast("Enter a valid budget amount","err");
    const cash=+budgetForm.cash||0;
    const upi=+budgetForm.upi||0;
    const{error}=await supabase.from("budgets").upsert({user_id:user.id,amount:base,extra:extraBudget,cash_budget:cash,upi_budget:upi},{onConflict:"user_id"});
    if(error)return toast("Failed to save budget","err");
    setBaseBudget(base);setCashBudget(cash);setUpiBudget(upi);
    setBudgetForm({base:"",cash:"",upi:""});setShowBudget(false);toast("Budget updated! ✓");
  };

  const saveExtra=async()=>{
    if(!extraInput||+extraInput<=0)return;
    const ne=extraBudget+(+extraInput);
    await supabase.from("budgets").upsert({user_id:user.id,amount:baseBudget,extra:ne,cash_budget:cashBudget,upi_budget:upiBudget},{onConflict:"user_id"});
    setExtraBudget(ne);setExtraInput("");setShowExtra(false);toast(`+${fmt(+extraInput)} added!`);
  };

  const addGoal=()=>{
    if(!goalForm.name||!goalForm.target||+goalForm.target<=0)return toast("Fill in name and target","err");
    const initial=+goalForm.saved||0;
    const ng={id:Date.now(),name:goalForm.name,target:+goalForm.target,saved:initial};
    setGoals(p=>[...p,ng]);
    if(initial>0)setGoalHistory(p=>[{id:Date.now(),goalName:goalForm.name,amount:initial,date:toISO()},...p]);
    setGoalForm({name:"",target:"",saved:""});setShowGoalForm(false);toast("Goal created! 🎯");
  };

  const updateGoalSaved=(id,amt)=>{
    const a=+amt;if(!a||a<=0)return;
    const goal=goals.find(g=>g.id===id);if(!goal)return;
    const add=Math.min(a,goal.target-goal.saved);
    setGoals(p=>p.map(g=>g.id===id?{...g,saved:g.saved+add}:g));
    setGoalHistory(p=>[{id:Date.now(),goalName:goal.name,amount:add,date:toISO()},...p]);
    toast(`Saved ${fmt(add)} towards "${goal.name}"! 💪`);
  };

  const deleteGoal=(id)=>{setGoals(p=>p.filter(g=>g.id!==id));toast("Goal removed","info");};

  // Derived
  const goalSpentMonth=goalHistory.filter(g=>{const d=new Date(g.date);return d.getMonth()===selMonth&&d.getFullYear()===selYear;}).reduce((s,g)=>s+g.amount,0);
  const mEntries=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===selMonth&&d.getFullYear()===selYear;});
  const mExpenseTotal=mEntries.reduce((s,e)=>s+e.amount,0);
  const mTotal=mExpenseTotal+goalSpentMonth;
  const pMonth=selMonth===0?11:selMonth-1;
  const pYear=selMonth===0?selYear-1:selYear;
  const pEntries=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===pMonth&&d.getFullYear()===pYear;});
  const pTotal=pEntries.reduce((s,e)=>s+e.amount,0);
  const diff=mTotal-pTotal;
  const diffPct=pTotal>0?((diff/pTotal)*100).toFixed(1):null;
  const budPct=Math.min(budget>0?(mTotal/budget)*100:0,100);
  const todayTot=entries.filter(e=>e.date===toISO()).reduce((s,e)=>s+e.amount,0);
  const todayCnt=entries.filter(e=>e.date===toISO()).length;
  const catBreak=CATS.map(c=>({...c,total:mEntries.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0)})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
  const cashSpent=mEntries.filter(e=>e.payment_method==="cash").reduce((s,e)=>s+e.amount,0);
  const upiSpent=mEntries.filter(e=>e.payment_method!=="cash").reduce((s,e)=>s+e.amount,0);
  const weeks={};
  mEntries.forEach(e=>{const w=getWeek(e.date);if(!weeks[w])weeks[w]={total:0,count:0};weeks[w].total+=e.amount;weeks[w].count++;});

  const tc=isDark?"#e2e8f0":"#1e293b";
  const bg=isDark?"linear-gradient(160deg,#07090f,#0d1321 60%,#070b18)":"linear-gradient(160deg,#f8fafc,#f1f5f9)";
  const sc=isDark?"#475569":"#94a3b8";
  const thC=isDark?"dark":"light";
  const userName=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"User";

  const sp={mTotal,mExpenseTotal,diff,diffPct,pMonth,budPct,budget,baseBudget,extraBudget,cashBudget,upiBudget,cashSpent,upiSpent,todayTot,todayCnt,catBreak,entries,mEntries,pEntries,pTotal,weeks,selMonth,selYear,pYear,del:delEntry,streak,goals,goalHistory,updateGoalSaved,deleteGoal,setShowGoalForm,setShowExtra,isDark,tc,sc,goalSpentMonth};

  if(!authReady)return(
    <div style={{minHeight:"100vh",background:"#07090f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:18}}>
      <style>{CSS}</style>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,color:"#818cf8"}}>SpendWise</div>
      <div className="spinner" style={{width:38,height:38}}/>
    </div>
  );

  if(!user)return(<div className={thC}><style>{CSS}</style><AuthScreen onAuth={setUser} isDark={isDark}/></div>);

  const MonthRow=()=>(<div className="mscroll">{MONTHS.map((m,i)=>(<button key={m} className={`mbtn${selMonth===i?" on":""}`} onClick={()=>setSelMonth(i)}>{m}</button>))}</div>);

  return(
    <div className={thC} style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:bg,color:tc,minHeight:"100vh",display:"flex",flexDirection:"column",transition:"background .4s,color .3s"}}>
      <style>{CSS}</style>

      {notif&&<div className="notif" style={{background:notif.type==="err"?"linear-gradient(135deg,#7f1d1d,#be123c)":notif.type==="info"?"linear-gradient(135deg,#1e3a5f,#1d4ed8)":"linear-gradient(135deg,#064e3b,#047857)",border:`1px solid ${notif.type==="err"?"#f43f5e":notif.type==="info"?"#3b82f6":"#10b981"}`,color:"#fff"}}>{notif.m}</div>}

      {reminder&&(<div style={{background:"linear-gradient(135deg,#6366f1,#818cf8)",color:"#fff",padding:"13px 20px",textAlign:"center",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:10,position:"sticky",top:0,zIndex:300,animation:"slidedown .4s ease"}}>
        💰 Don't forget to add today's expenses!
        <button onClick={()=>setReminder(false)} style={{background:"rgba(255,255,255,.2)",border:"none",cursor:"pointer",fontSize:15,color:"#fff",marginLeft:8,borderRadius:8,padding:"2px 8px"}}>×</button>
      </div>)}

      {celebration&&(<div onClick={()=>setCelebration(null)} style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:500,background:"linear-gradient(135deg,#6366f1,#818cf8)",borderRadius:28,padding:"36px 44px",textAlign:"center",boxShadow:"0 24px 80px rgba(99,102,241,.6)",animation:"popIn .5s cubic-bezier(.4,0,.2,1)",cursor:"pointer"}}>
        <div style={{fontSize:56,marginBottom:12,animation:"float 2s ease-in-out infinite"}}>🎉</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,color:"#fff",fontWeight:700}}>{celebration} Day Streak!</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.8)",marginTop:8}}>Incredible! Keep tracking! 🔥</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:16}}>Tap to close</div>
      </div>)}

      {/* ADD EXPENSE MODAL */}
      {showAdd&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal">
            <div style={{width:44,height:5,background:"rgba(255,255,255,.15)",borderRadius:3,margin:"0 auto 24px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#818cf8"}}>Add Expense</h2>
              <button onClick={()=>setShowAdd(false)} style={{background:"rgba(255,255,255,.08)",border:"none",color:sc,cursor:"pointer",fontSize:20,width:32,height:32,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(244,63,94,.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}>×</button>
            </div>
            <div className="stitle">Amount</div>
            <div style={{position:"relative",marginBottom:18}}>
              <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"#818cf8",fontSize:20,fontWeight:800}}>₹</span>
              <input ref={amtRef} className="sw-input" type="number" inputMode="decimal" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.00" style={{paddingLeft:42,fontSize:26,fontWeight:800,borderColor:"rgba(99,102,241,.3)"}}/>
            </div>
            <div className="stitle">Payment Method</div>
            <div style={{display:"flex",gap:10,marginBottom:18,padding:6,borderRadius:16,background:isDark?"rgba(255,255,255,.04)":"#f8fafc",border:isDark?"1px solid rgba(255,255,255,.07)":"1px solid #e2e8f0"}}>
              <div className={`pmtab cash${form.pm==="cash"?" sel":""}`} onClick={()=>setForm({...form,pm:"cash"})} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💵 Cash</div>
              <div className={`pmtab upi${form.pm==="upi"?" sel":""}`} onClick={()=>setForm({...form,pm:"upi"})} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>📱 UPI/Online</div>
            </div>
            <div className="stitle">Category</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
              {CATS.map(c=>(<div key={c.id} className={`chip${form.category===c.id?" sel":""}`} onClick={()=>setForm({...form,category:c.id})}><div style={{fontSize:20}}>{c.icon}</div><div style={{fontSize:9,color:form.category===c.id?"#818cf8":sc,marginTop:3,fontWeight:700}}>{c.label.split(" ")[0]}</div></div>))}
            </div>
            <div className="stitle">Note (optional)</div>
            <input className="sw-input" type="text" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="What was this for?" style={{marginBottom:14}}/>
            <div className="stitle">Date</div>
            <input className="sw-input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{marginBottom:24,colorScheme:isDark?"dark":"light"}}/>
            <button className="gbtn" onClick={addEntry} style={{width:"100%",padding:"17px",fontSize:15}}>+ Add Expense</button>
          </div>
        </div>
      )}

      {/* BUDGET MODAL */}
      {showBudget&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowBudget(false)}>
          <div className="modal" style={{maxWidth:isMobile?"100%":480}}>
            <div style={{width:44,height:5,background:"rgba(255,255,255,.15)",borderRadius:3,margin:"0 auto 24px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#818cf8",marginBottom:20}}>Set Monthly Budget</h2>
            <div className="stitle">Total Budget (₹)</div>
            <div style={{position:"relative",marginBottom:16}}>
              <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"#818cf8",fontSize:18,fontWeight:800}}>₹</span>
              <input className="sw-input" type="number" inputMode="decimal" value={budgetForm.base} onChange={e=>setBudgetForm({...budgetForm,base:e.target.value})} placeholder={String(baseBudget)} style={{paddingLeft:40,fontSize:22,fontWeight:800,borderColor:"rgba(99,102,241,.3)"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
              <div>
                <div style={{fontSize:11,color:"#10b981",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>💵 Cash</div>
                <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#10b981",fontSize:14,fontWeight:700}}>₹</span><input className="sw-input" type="number" inputMode="decimal" value={budgetForm.cash} onChange={e=>setBudgetForm({...budgetForm,cash:e.target.value})} placeholder={String(cashBudget||0)} style={{paddingLeft:28,borderColor:"rgba(16,185,129,.3)"}}/></div>
              </div>
              <div>
                <div style={{fontSize:11,color:"#818cf8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>📱 UPI</div>
                <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#818cf8",fontSize:14,fontWeight:700}}>₹</span><input className="sw-input" type="number" inputMode="decimal" value={budgetForm.upi} onChange={e=>setBudgetForm({...budgetForm,upi:e.target.value})} placeholder={String(upiBudget||0)} style={{paddingLeft:28,borderColor:"rgba(99,102,241,.3)"}}/></div>
              </div>
            </div>
            <button className="gbtn" style={{width:"100%",padding:"16px",fontSize:15}} onClick={saveBudget}>Save Budget ✓</button>
          </div>
        </div>
      )}

      {/* EXTRA BUDGET MODAL */}
      {showExtra&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowExtra(false)}>
          <div className="modal" style={{maxWidth:isMobile?"100%":400}}>
            <div style={{width:44,height:5,background:"rgba(255,255,255,.15)",borderRadius:3,margin:"0 auto 24px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#818cf8",marginBottom:18}}>Add Extra Budget</h2>
            <div style={{padding:"16px 18px",borderRadius:16,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",marginBottom:20}}>
              {[["Base Budget",fmt(baseBudget),tc],["+Extra Added",`+${fmt(extraBudget)}`,"#10b981"]].map(([l,v,c])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}><span style={{color:sc}}>{l}</span><span style={{fontWeight:700,color:c}}>{v}</span></div>))}
              <div style={{height:1,background:"rgba(99,102,241,.2)",margin:"8px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800}}><span>Total</span><span style={{color:"#818cf8"}}>{fmt(budget)}</span></div>
            </div>
            <div style={{position:"relative",marginBottom:22}}>
              <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"#818cf8",fontSize:18,fontWeight:800}}>₹</span>
              <input className="sw-input" type="number" inputMode="decimal" value={extraInput} onChange={e=>setExtraInput(e.target.value)} placeholder="Amount to add" style={{paddingLeft:40,fontSize:22,fontWeight:800,borderColor:"rgba(99,102,241,.3)"}}/>
            </div>
            <button className="gbtn" style={{width:"100%",padding:"16px",fontSize:15}} onClick={saveExtra}>+ Add to Budget</button>
          </div>
        </div>
      )}

      {/* GOAL FORM MODAL */}
      {showGoalForm&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowGoalForm(false)}>
          <div className="modal" style={{maxWidth:isMobile?"100%":420}}>
            <div style={{width:44,height:5,background:"rgba(255,255,255,.15)",borderRadius:3,margin:"0 auto 24px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#818cf8",marginBottom:22}}>New Savings Goal 🎯</h2>
            <div className="stitle">Goal Name</div>
            <input className="sw-input" type="text" value={goalForm.name} onChange={e=>setGoalForm({...goalForm,name:e.target.value})} placeholder="e.g. Buy Headphones" style={{marginBottom:14}}/>
            <div className="stitle">Target Amount</div>
            <div style={{position:"relative",marginBottom:14}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#818cf8",fontSize:15,fontWeight:700}}>₹</span><input className="sw-input" type="number" inputMode="decimal" value={goalForm.target} onChange={e=>setGoalForm({...goalForm,target:e.target.value})} placeholder="3000" style={{paddingLeft:30}}/></div>
            <div className="stitle">Already Saved</div>
            <div style={{position:"relative",marginBottom:24}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#818cf8",fontSize:15,fontWeight:700}}>₹</span><input className="sw-input" type="number" inputMode="decimal" value={goalForm.saved} onChange={e=>setGoalForm({...goalForm,saved:e.target.value})} placeholder="0" style={{paddingLeft:30}}/></div>
            <button className="gbtn" onClick={addGoal} style={{width:"100%",padding:"16px",fontSize:15}}>Create Goal 🎯</button>
          </div>
        </div>
      )}

      {/* ══ DESKTOP ══ */}
      {!isMobile&&(
        <div style={{display:"flex",flex:1}}>
          <div style={{width:232,padding:"24px 14px",background:isDark?"rgba(7,9,15,.92)":"rgba(255,255,255,.85)",borderRight:isDark?"1px solid rgba(99,102,241,.1)":"1px solid #e2e8f0",display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",overflowY:"auto",backdropFilter:"blur(20px)"}}>
            <div style={{paddingLeft:8,marginBottom:22}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22}}><span style={{color:"#818cf8"}}>Spend</span><span style={{color:tc}}>Wise</span></div>
              <div style={{fontSize:10,color:sc,letterSpacing:2.5,textTransform:"uppercase",marginTop:3,fontWeight:700}}>Smart Tracker</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:16,background:isDark?"rgba(99,102,241,.08)":"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.14)",marginBottom:16,cursor:"pointer",transition:"all .2s"}} onClick={()=>setView("profile")} onMouseEnter={e=>e.currentTarget.style.background=isDark?"rgba(99,102,241,.14)":"rgba(99,102,241,.1)"} onMouseLeave={e=>e.currentTarget.style.background=isDark?"rgba(99,102,241,.08)":"rgba(99,102,241,.06)"}>
              <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${avatar.color},${avatar.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,boxShadow:`0 4px 12px ${avatar.color}55`}}>{avatar.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:tc}}>{userName}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}><div className="live"/><span style={{fontSize:10,color:"#10b981",fontWeight:700}}>Live Sync</span></div>
              </div>
            </div>
            {streak>0&&(<div style={{padding:"11px 14px",borderRadius:14,background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.2)",marginBottom:14,display:"flex",alignItems:"center",gap:10,animation:"pulse 2s infinite",cursor:"pointer"}} onClick={()=>setView("dashboard")}>
              <span style={{fontSize:22}}>🔥</span>
              <div><div style={{fontSize:13,fontWeight:800,color:"#fbbf24"}}>{streak} Day Streak!</div><div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>{streak>=7?"Amazing! 🏆":"Keep going!"}</div></div>
            </div>)}
            {NAV.map(n=>(<div key={n.id} className={`snav${view===n.id?" on":""}`} onClick={()=>setView(n.id)}><span style={{fontSize:15}}>{n.icon}</span>{n.label}</div>))}
            <div style={{flex:1}}/>
            <button onClick={()=>setIsDark(p=>!p)} style={{padding:"10px 14px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:10,background:isDark?"rgba(255,255,255,.04)":"#f8fafc",border:isDark?"1px solid rgba(255,255,255,.07)":"1px solid #e2e8f0",borderRadius:13,cursor:"pointer",marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif",color:sc,fontWeight:600,transition:"all .2s"}}>
              {isDark?"☀️":"🌙"}<span>{isDark?"Light Mode":"Dark Mode"}</span>
            </button>
            <button className="xbtn" onClick={()=>setShowBudget(true)} style={{padding:"9px 14px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:10,marginBottom:8,fontWeight:600}}>⚙ Set Budget</button>
            <button onClick={doLogout} style={{padding:"9px 14px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:10,background:"rgba(244,63,94,.05)",border:"1px solid rgba(244,63,94,.2)",color:"#f43f5e",borderRadius:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(244,63,94,.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(244,63,94,.05)"}>↩ Sign Out</button>
          </div>
          <div style={{flex:1,padding:"26px 32px",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,background:"linear-gradient(135deg,#818cf8,#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{NAV.find(n=>n.id===view)?.label}</h1>
                <p style={{color:sc,fontSize:12,marginTop:4,fontWeight:600}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
              </div>
              {view!=="profile"&&(<button className="gbtn" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}} style={{padding:"13px 24px",fontSize:14}}>
                <span style={{fontSize:18,fontWeight:300}}>+</span> Add Expense
              </button>)}
            </div>
            {view!=="profile"&&<div style={{marginBottom:22}}><MonthRow/></div>}
            {view==="dashboard" &&<Dashboard {...sp}/>}
            {view==="history"   &&<History {...sp}/>}
            {view==="analytics" &&<Analytics {...sp}/>}
            {view==="goals"     &&<Goals {...sp}/>}
            {view==="profile"   &&<Profile user={user} avatar={avatar} setAvatar={setAvatar} doLogout={doLogout} entries={entries} goals={goals} streak={streak} isDark={isDark} tc={tc} sc={sc}/>}
            {view==="developer" &&<Developer isDark={isDark} tc={tc} sc={sc}/>}
          </div>
        </div>
      )}

      {/* ══ MOBILE ══ */}
      {isMobile&&(
        <div style={{display:"flex",flexDirection:"column",flex:1,paddingBottom:132}}>
          <div style={{padding:"14px 18px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:isDark?"1px solid rgba(99,102,241,.1)":"1px solid #e2e8f0",background:isDark?"rgba(7,9,15,.92)":"rgba(255,255,255,.95)",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(20px)"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22}}><span style={{color:"#818cf8"}}>Spend</span><span style={{color:tc}}>Wise</span></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}><div className="live"/><span style={{fontSize:10,color:"#10b981",fontWeight:700}}>Live</span></div>
              {streak>0&&<div style={{fontSize:12,fontWeight:800,color:"#fbbf24",animation:"pulse 2s infinite"}}>🔥{streak}</div>}
              <button onClick={()=>setIsDark(p=>!p)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,padding:4}}>{isDark?"☀️":"🌙"}</button>
              <div onClick={()=>setView("profile")} style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${avatar.color},${avatar.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",boxShadow:`0 4px 12px ${avatar.color}55`,transition:"transform .2s"}} onTouchStart={e=>e.currentTarget.style.transform="scale(.9)"} onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>{avatar.emoji}</div>
            </div>
          </div>
          {view!=="profile"&&view!=="developer"&&(<div style={{padding:"12px 18px 8px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,background:"linear-gradient(135deg,#818cf8,#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{NAV.find(n=>n.id===view)?.label}</h1>
              <button className="xbtn" onClick={()=>setShowBudget(true)} style={{padding:"6px 12px",fontSize:12,fontWeight:700}}>⚙ Budget</button>
            </div>
            <MonthRow/>
          </div>)}
          <div style={{flex:1,padding:"4px 18px 0",overflowY:"auto"}}>
            {view==="dashboard" &&<Dashboard {...sp}/>}
            {view==="history"   &&<History {...sp}/>}
            {view==="analytics" &&<Analytics {...sp}/>}
            {view==="goals"     &&<Goals {...sp}/>}
            {view==="profile"   &&<Profile user={user} avatar={avatar} setAvatar={setAvatar} doLogout={doLogout} entries={entries} goals={goals} streak={streak} isDark={isDark} tc={tc} sc={sc}/>}
            {view==="developer" &&<Developer isDark={isDark} tc={tc} sc={sc}/>}
          </div>
          <button className="fab" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}}>+</button>
          <div className="bnav">
            {NAV.map(n=>(<div key={n.id} className={`bitem${view===n.id?" on":""}`} onClick={()=>setView(n.id)}>
              <span style={{fontSize:20,transition:"transform .2s",transform:view===n.id?"scale(1.2)":"scale(1)"}}>{n.icon}</span>
              <span>{n.label}</span>
            </div>))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── GlowCard ──────────────────────────────────
function Card({children,style,color="#6366f1",delay=0}){
  return(
    <div className="card" style={{padding:18,animation:`up .4s cubic-bezier(.4,0,.2,1) ${delay}s both`,...style}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${color},transparent)`,borderRadius:"20px 20px 0 0"}}/>
      {children}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────
function SC({label,icon,value,valueColor,sub,subColor,delay,span,tc,color}){
  return(
    <Card delay={delay} color={color||valueColor||"#6366f1"} style={{gridColumn:span?"1/-1":"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{fontSize:10,color:"#475569",letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{label}</div>
        {icon&&<span style={{fontSize:22}}>{icon}</span>}
      </div>
      <div style={{fontSize:24,fontWeight:800,color:valueColor||tc,lineHeight:1,fontFamily:"'Playfair Display',serif"}}>{value}</div>
      <div style={{fontSize:12,marginTop:8,color:subColor||"#475569",fontWeight:600}}>{sub}</div>
    </Card>
  );
}

// ── Dashboard ─────────────────────────────────
function Dashboard({mTotal,diff,diffPct,pMonth,budPct,budget,baseBudget,extraBudget,cashBudget,upiBudget,cashSpent,upiSpent,todayTot,todayCnt,catBreak,entries,del,streak,setShowExtra,isDark,tc,sc,goalSpentMonth,mExpenseTotal}){
  return(
    <div style={{animation:"up .3s ease"}}>
      {streak>0&&(
        <Card color="#fbbf24" style={{marginBottom:14,background:"linear-gradient(135deg,rgba(251,191,36,.07),rgba(245,158,11,.03))"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:30,animation:"float 2s ease-in-out infinite"}}>🔥</span>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#fbbf24"}}>{streak} Day Tracking Streak!</div>
                <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{streak>=30?"🏆 Legend!":streak>=14?"⭐ Outstanding!":streak>=7?"🎯 Amazing!":"Keep it up!"}</div>
              </div>
            </div>
            {[7,14,30].filter(m=>m>streak)[0]&&(<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800,color:"#fbbf24"}}>{[7,14,30].filter(m=>m>streak)[0]-streak}</div><div style={{fontSize:10,color:"#94a3b8"}}>days to go</div></div>)}
          </div>
        </Card>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <SC span label="Monthly Spent" icon="💸" value={fmt(mTotal)} valueColor="#818cf8" sub={diffPct?`${diff>0?"↑":"↓"} ${Math.abs(diffPct)}% vs ${MONTHS[pMonth]}`:"First month!"} subColor={diff>0?"#f43f5e":"#10b981"} delay={0} tc={tc} color="#6366f1"/>
        <SC label="Today" icon="📅" value={fmt(todayTot)} valueColor="#f59e0b" sub={`${todayCnt} transaction${todayCnt!==1?"s":""}`} delay={.08} tc={tc} color="#f59e0b"/>
        <SC label="Budget Left" icon="🎯" value={fmt(Math.abs(budget-mTotal))} valueColor={(budget-mTotal)<0?"#f43f5e":"#10b981"} sub={(budget-mTotal)<0?"⚠️ Over budget!":fmt(budget)+" total"} subColor={(budget-mTotal)<0?"#f43f5e":"#10b981"} delay={.16} tc={tc} color="#10b981"/>
      </div>
      <Card color="#818cf8" style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:14,fontWeight:800}}>Budget Overview</span>
          <button onClick={()=>setShowExtra(true)} style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.3)",color:"#10b981",borderRadius:10,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(16,185,129,.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(16,185,129,.1)"}>+ Extra</button>
        </div>
        {[["Base Budget",fmt(baseBudget),tc],extraBudget>0?["+Extra Added",`+${fmt(extraBudget)}`,"#10b981"]:null,goalSpentMonth>0?["Saved to Goals",`-${fmt(goalSpentMonth)}`,"#818cf8"]:null].filter(Boolean).map(([l,v,c])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:sc}}>{l}</span><span style={{fontWeight:700,color:c}}>{v}</span></div>))}
        <div style={{height:1,background:isDark?"rgba(255,255,255,.06)":"#f1f5f9",margin:"10px 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800,marginBottom:12}}><span>Total Budget</span><span style={{color:"#818cf8"}}>{fmt(budget)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>Usage</span><span style={{fontSize:12,fontWeight:800,color:budPct>90?"#f43f5e":"#818cf8"}}>{budPct.toFixed(1)}%</span></div>
        <div className="bar" style={{height:10}}><div className="fill" style={{width:`${budPct}%`,background:budPct>90?"linear-gradient(90deg,#f43f5e,#be123c)":"linear-gradient(90deg,#6366f1,#818cf8,#a78bfa)"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:"#94a3b8",fontWeight:600}}><span>Spent {fmt(mTotal)}</span><span>Remaining {fmt(Math.max(budget-mTotal,0))}</span></div>
      </Card>
      {(cashBudget>0||upiBudget>0)&&(
        <Card color="#10b981" style={{marginBottom:14}}>
          <div className="stitle">Cash vs UPI Balance</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[{label:"💵 Cash",budget:cashBudget,spent:cashSpent,color:"#10b981"},{label:"📱 UPI",budget:upiBudget,spent:upiSpent,color:"#818cf8"}].map((x,i)=>(
              <div key={i} style={{padding:14,borderRadius:14,background:`${x.color}0d`,border:`1px solid ${x.color}22`}}>
                <div style={{fontSize:12,color:x.color,fontWeight:800,marginBottom:8}}>{x.label}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginBottom:2,fontWeight:600}}>Budget {fmt(x.budget)}</div>
                <div style={{fontSize:11,color:"#f43f5e",marginBottom:8,fontWeight:600}}>Spent {fmt(x.spent)}</div>
                <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,.06)",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:3,width:`${Math.min(x.budget>0?x.spent/x.budget*100:0,100)}%`,background:`linear-gradient(90deg,${x.color}66,${x.color})`,transition:"width 1.2s"}}/></div>
                <div style={{fontSize:12,fontWeight:800,color:(x.budget-x.spent)<0?"#f43f5e":x.color}}>Left {fmt(Math.max(x.budget-x.spent,0))}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {catBreak.length>0&&(
        <Card color="#f59e0b" style={{marginBottom:14}}>
          <div className="stitle">Category Breakdown</div>
          {catBreak.map(c=>(
            <div key={c.id} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:600}}>{c.icon} {c.label}</span>
                <span style={{fontSize:13,fontWeight:800,color:c.color}}>{fmt(c.total)}</span>
              </div>
              <div className="bar"><div className="fill" style={{width:`${mExpenseTotal>0?(c.total/mExpenseTotal*100).toFixed(1):0}%`,background:`linear-gradient(90deg,${c.color}55,${c.color})`}}/></div>
            </div>
          ))}
        </Card>
      )}
      <Card color="#6366f1">
        <div className="stitle">Recent Transactions</div>
        {entries.length===0
          ?<div style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:40,marginBottom:12,animation:"float 3s ease-in-out infinite"}}>💸</div><div style={{fontSize:14,color:"#475569",fontWeight:600}}>No transactions yet!</div></div>
          :entries.slice(0,8).map(e=>{
            const cat=CATS.find(c=>c.id===e.category);
            return(<div key={e.id} className="erow" style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9"}}>
              <div style={{width:42,height:42,borderRadius:14,background:`${cat?.color||"#94a3b8"}18`,border:`1px solid ${cat?.color||"#94a3b8"}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginRight:12,flexShrink:0}}>{cat?.icon||"📦"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note||cat?.label||"Expense"}</div>
                <div style={{fontSize:10,color:"#475569",marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontWeight:600}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
                  <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:8,background:e.payment_method==="cash"?"rgba(16,185,129,.1)":"rgba(99,102,241,.1)",color:e.payment_method==="cash"?"#10b981":"#818cf8",fontWeight:700,fontSize:9}}>{e.payment_method==="cash"?"💵 Cash":"📱 UPI"}</span>
                </div>
              </div>
              <span style={{fontSize:14,fontWeight:800,color:"#f43f5e",marginRight:10,flexShrink:0}}>-{fmt(e.amount)}</span>
              <button className="dbtn xbtn" onClick={()=>del(e.id)} style={{padding:"4px 8px",fontSize:11,color:"#f43f5e",borderColor:"rgba(244,63,94,.3)",flexShrink:0,opacity:1,fontWeight:700}}>✕</button>
            </div>);
          })}
      </Card>
    </div>
  );
}

// ── History ───────────────────────────────────
function History({mEntries,weeks,selMonth,selYear,del,isDark,tc,goalHistory}){
  const mGoalHistory=goalHistory.filter(g=>{const d=new Date(g.date);return d.getMonth()===selMonth&&d.getFullYear()===selYear;});
  const allItems=[...mEntries.map(e=>({...e,_type:"expense"})),...mGoalHistory.map(g=>({...g,id:`g_${g.id}`,amount:g.amount,date:g.date,_type:"goal"}))].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return(
    <div style={{animation:"up .3s ease"}}>
      <Card color="#f59e0b" style={{marginBottom:14}}>
        <div className="stitle">Weekly — {MONTHS[selMonth]} {selYear}</div>
        {Object.keys(weeks).length===0
          ?<div style={{color:"#475569",fontSize:13,padding:"12px 0",fontWeight:600}}>No expenses this month yet.</div>
          :Object.entries(weeks).sort((a,b)=>+a[0]-+b[0]).map(([w,d])=>(
            <div key={w} style={{borderLeft:"3px solid #6366f1",paddingLeft:14,marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:"#94a3b8",fontWeight:700}}>Week {w}</span><span style={{fontSize:15,fontWeight:800,color:"#818cf8"}}>{fmt(d.total)}</span></div>
              <div style={{fontSize:11,color:"#475569",marginTop:2,fontWeight:600}}>{d.count} transaction{d.count!==1?"s":""}</div>
            </div>
          ))}
      </Card>
      <Card color="#818cf8">
        <div className="stitle">All Transactions — {MONTHS[selMonth]} {selYear}</div>
        {allItems.length===0
          ?<div style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:36,marginBottom:10}}>📅</div><div style={{fontSize:13,color:"#475569",fontWeight:600}}>No entries for {MONTHS[selMonth]}</div></div>
          :allItems.map(e=>{
            const isGoal=e._type==="goal";
            const cat=CATS.find(c=>c.id===e.category);
            return(<div key={e.id} className="erow" style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9"}}>
              <div style={{width:42,height:42,borderRadius:14,background:isGoal?"rgba(99,102,241,.12)":(`${cat?.color||"#94a3b8"}18`),border:isGoal?"1px solid rgba(99,102,241,.3)":`1px solid ${cat?.color||"#94a3b8"}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginRight:12,flexShrink:0}}>{isGoal?"🎯":(cat?.icon||"📦")}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{isGoal?`Saved → ${e.goalName}`:(e.note||cat?.label)}</div>
                <div style={{fontSize:10,color:"#475569",marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontWeight:600}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                  {isGoal&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:8,background:"rgba(99,102,241,.1)",color:"#818cf8",fontWeight:700}}>Savings Goal</span>}
                  {!isGoal&&<span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:8,background:e.payment_method==="cash"?"rgba(16,185,129,.1)":"rgba(99,102,241,.1)",color:e.payment_method==="cash"?"#10b981":"#818cf8",fontWeight:700,fontSize:9}}>{e.payment_method==="cash"?"💵":"📱"}</span>}
                </div>
              </div>
              <div style={{textAlign:"right",marginRight:isGoal?0:10,flexShrink:0}}>
                <div style={{fontSize:14,fontWeight:800,color:isGoal?"#818cf8":"#f43f5e"}}>-{fmt(e.amount)}</div>
                {!isGoal&&<div style={{fontSize:10,color:cat?.color,marginTop:1,fontWeight:600}}>{cat?.label}</div>}
              </div>
              {!isGoal&&<button className="dbtn xbtn" onClick={()=>del(e.id)} style={{padding:"4px 8px",fontSize:11,color:"#f43f5e",borderColor:"rgba(244,63,94,.3)",flexShrink:0,opacity:1,fontWeight:700}}>✕</button>}
            </div>);
          })}
      </Card>
    </div>
  );
}

// ── PURE CSS Analytics (no Recharts!) ─────────
function Analytics({mTotal,mEntries,pTotal,pEntries,diff,diffPct,catBreak,selMonth,selYear,pMonth,pYear,entries,cashSpent,upiSpent,weeks,isDark,tc,sc}){
  const weekArr=Object.entries(weeks).sort((a,b)=>+a[0]-+b[0]).map(([w,d])=>({label:`Wk${w}`,val:d.total}));
  const maxWeek=Math.max(...weekArr.map(w=>w.val),1);
  const trend=Array.from({length:6},(_,i)=>{
    const m=(selMonth-5+i+12)%12;
    const y=selMonth-5+i<0?selYear-1:selYear;
    const t=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===m&&d.getFullYear()===y;}).reduce((s,e)=>s+e.amount,0);
    return{label:MONTHS[m],val:t,cur:m===selMonth&&y===selYear};
  });
  const maxTrend=Math.max(...trend.map(t=>t.val),1);
  const totalPM=cashSpent+upiSpent||1;
  const pieTotal=catBreak.reduce((s,c)=>s+c.total,0)||1;

  // Donut chart via SVG
  const DonutChart=({data,total,size=150})=>{
    const r=55,cx=size/2,cy=size/2,circ=2*Math.PI*r;
    let offset=0;
    const segs=data.map((d,i)=>{const pct=d.value/total;const dash=pct*circ;const seg={...d,offset,dash};offset+=dash;return seg;});
    return(
      <div className="donut-wrap" style={{width:size,height:size}}>
        <svg width={size} height={size} className="donut-svg">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={isDark?"rgba(255,255,255,.06)":"#f1f5f9"} strokeWidth={16}/>
          {segs.map((s,i)=>(<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={16} strokeDasharray={`${s.dash} ${circ-s.dash}`} strokeDashoffset={-s.offset} strokeLinecap="round"/>))}
        </svg>
        <div className="donut-center">
          <div style={{fontSize:10,color:sc,fontWeight:700,textAlign:"center",lineHeight:1.3}}>Total<br/><span style={{fontSize:13,color:tc,fontWeight:800}}>₹{Math.round(total/1000)||"0"}k</span></div>
        </div>
      </div>
    );
  };

  if(mEntries.length===0&&!cashSpent&&!upiSpent){
    return(
      <Card color="#6366f1">
        <div style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontSize:48,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>📊</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:8}}>No data yet!</div>
          <div style={{fontSize:13,color:"#475569",fontWeight:600}}>Add some expenses to see your analytics here.</div>
        </div>
      </Card>
    );
  }

  return(
    <div style={{animation:"up .3s ease"}}>
      {/* Month Comparison */}
      <Card color="#6366f1" style={{marginBottom:14}}>
        <div className="stitle">Month Comparison</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {[{label:`${MONTHS[selMonth]} ${selYear}`,total:mTotal,cnt:mEntries.length,col:"#818cf8"},{label:`${MONTHS[pMonth]} ${pYear}`,total:pTotal,cnt:pEntries.length,col:"#475569"}].map((x,i)=>(
            <div key={i} style={{padding:16,borderRadius:16,background:`${x.col}0d`,border:`1px solid ${x.col}22`}}>
              <div style={{fontSize:11,color:"#475569",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{x.label}</div>
              <div style={{fontSize:20,fontWeight:800,color:x.col,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{fmt(x.total)}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:6,fontWeight:600}}>{x.cnt} transactions</div>
            </div>
          ))}
        </div>
        {diffPct!==null&&(<div style={{padding:13,borderRadius:14,background:diff>0?"rgba(244,63,94,.08)":"rgba(16,185,129,.08)",border:`1px solid ${diff>0?"rgba(244,63,94,.2)":"rgba(16,185,129,.2)"}`,textAlign:"center"}}><span style={{fontSize:14,fontWeight:800,color:diff>0?"#f43f5e":"#10b981"}}>{diff>0?"↑":"↓"} {Math.abs(diffPct)}% {diff>0?"more":"less"} than last month</span></div>)}
      </Card>

      {/* Category Donut */}
      {catBreak.length>0&&(
        <Card color="#f59e0b" style={{marginBottom:14}}>
          <div className="stitle">🥧 Spending by Category</div>
          <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
            <DonutChart data={catBreak.map(c=>({color:c.color,value:c.total}))} total={pieTotal}/>
            <div style={{flex:1,minWidth:160}}>
              {catBreak.map(c=>(
                <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:10,height:10,borderRadius:3,background:c.color,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600}}>{c.icon} {c.label.split(" ")[0]}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontSize:12,fontWeight:800,color:c.color}}>{fmt(c.total)}</span>
                    <span style={{fontSize:10,color:"#475569",marginLeft:4}}>({(c.total/pieTotal*100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Bar Chart */}
      {weekArr.length>0&&(
        <Card color="#818cf8" style={{marginBottom:14}}>
          <div className="stitle">📊 Weekly Spending</div>
          <div className="chart-bars">
            {weekArr.map((w,i)=>{
              const h=Math.max((w.val/maxWeek)*110,6);
              return(
                <div key={i} className="chart-bar-wrap">
                  <div style={{flex:1,display:"flex",alignItems:"flex-end",width:"100%"}}>
                    <div className="chart-bar" style={{height:h,background:i===weekArr.length-1?"linear-gradient(180deg,#a78bfa,#818cf8)":"linear-gradient(180deg,#818cf8,#6366f1)"}}>
                      <span className="chart-bar-val" style={{color:"#818cf8",fontSize:9,fontWeight:800}}>₹{Math.round(w.val/100)/10}k</span>
                    </div>
                  </div>
                  <div className="chart-bar-label">{w.label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Cash vs UPI */}
      {(cashSpent>0||upiSpent>0)&&(
        <Card color="#10b981" style={{marginBottom:14}}>
          <div className="stitle">💳 Cash vs UPI</div>
          <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
            <DonutChart data={[{color:"#10b981",value:cashSpent||0},{color:"#818cf8",value:upiSpent||0}].filter(d=>d.value>0)} total={totalPM}/>
            <div style={{flex:1}}>
              {[{label:"💵 Cash",val:cashSpent,color:"#10b981"},{label:"📱 UPI/Online",val:upiSpent,color:"#818cf8"}].map((x,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:700}}>{x.label}</span><span style={{fontSize:13,fontWeight:800,color:x.color}}>{fmt(x.val)}</span></div>
                  <div style={{height:8,borderRadius:4,background:isDark?"rgba(255,255,255,.06)":"#f1f5f9",overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,width:`${(x.val/totalPM*100).toFixed(1)}%`,background:x.color,transition:"width 1.2s"}}/>
                  </div>
                  <div style={{fontSize:10,color:"#94a3b8",marginTop:4,fontWeight:600}}>{(x.val/totalPM*100).toFixed(0)}% of total</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 6-Month Trend */}
      <Card color="#a78bfa">
        <div className="stitle">📈 6-Month Trend</div>
        <div className="chart-bars">
          {trend.map((t,i)=>{
            const h=Math.max((t.val/maxTrend)*110,t.val>0?6:2);
            return(
              <div key={i} className="chart-bar-wrap">
                <div style={{flex:1,display:"flex",alignItems:"flex-end",width:"100%"}}>
                  <div className="chart-bar" style={{height:h,background:t.cur?"linear-gradient(180deg,#c084fc,#a78bfa)":"linear-gradient(180deg,#6366f166,#6366f1)",opacity:t.cur?1:.7}}>
                    {t.val>0&&<span className="chart-bar-val" style={{color:t.cur?"#c084fc":"#6366f1",fontSize:8,fontWeight:800}}>₹{Math.round(t.val/100)/10}k</span>}
                  </div>
                </div>
                <div className="chart-bar-label" style={{color:t.cur?"#a78bfa":"#475569",fontWeight:t.cur?800:600}}>{t.label}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── Goals ─────────────────────────────────────
function Goals({goals,updateGoalSaved,deleteGoal,setShowGoalForm,isDark,tc,sc}){
  const [addAmounts,setAddAmounts]=useState({});
  const colors=["#6366f1","#f59e0b","#10b981","#f43f5e","#a78bfa","#06b6d4"];
  return(
    <div style={{animation:"up .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <p style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Your savings targets</p>
        <button className="gbtn" onClick={()=>setShowGoalForm(true)} style={{padding:"11px 18px",fontSize:13}}>+ New Goal</button>
      </div>
      {goals.length===0
        ?<Card color="#6366f1" style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontSize:48,marginBottom:14,animation:"float 3s ease-in-out infinite"}}>🎯</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>No savings goals yet!</div>
          <div style={{fontSize:13,color:"#475569",fontWeight:600,marginBottom:20}}>Set a goal and start saving</div>
          <button className="gbtn" onClick={()=>setShowGoalForm(true)} style={{padding:"13px 28px",margin:"0 auto",fontSize:14}}>Create First Goal 🎯</button>
        </Card>
        :goals.map((g,idx)=>{
          const pct=Math.min(g.target>0?(g.saved/g.target)*100:0,100);
          const done=pct>=100;
          const col=colors[idx%colors.length];
          return(
            <Card key={g.id} color={done?"#10b981":col} style={{marginBottom:14}}>
              {done&&<div style={{position:"absolute",top:12,right:12,background:"rgba(16,185,129,.15)",border:"1px solid rgba(16,185,129,.3)",color:"#10b981",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:800}}>DONE! 🎉</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div><div style={{fontSize:16,fontWeight:800,marginBottom:3}}>{g.name}</div><div style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>Target: {fmt(g.target)}</div></div>
                <button onClick={()=>deleteGoal(g.id)} style={{background:"rgba(244,63,94,.1)",border:"1px solid rgba(244,63,94,.2)",color:"#f43f5e",cursor:"pointer",fontSize:16,borderRadius:10,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(244,63,94,.2)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(244,63,94,.1)"}>✕</button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"}}><span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Progress</span><span style={{fontSize:15,fontWeight:800,color:done?"#10b981":col}}>{fmt(g.saved)} / {fmt(g.target)}</span></div>
              <div style={{height:12,borderRadius:6,background:isDark?"rgba(255,255,255,.06)":"#f1f5f9",overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",borderRadius:6,width:`${pct}%`,background:done?"linear-gradient(90deg,#10b981,#34d399)":`linear-gradient(90deg,${col}88,${col})`,transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:done?0:14}}><span style={{fontSize:12,fontWeight:800,color:done?"#10b981":col}}>{pct.toFixed(0)}% complete</span>{!done&&<span style={{fontSize:12,color:"#475569",fontWeight:600}}>{fmt(g.target-g.saved)} to go</span>}</div>
              {!done&&(<div style={{display:"flex",gap:8}}>
                <div style={{position:"relative",flex:1}}>
                  <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:col,fontSize:14,fontWeight:800}}>₹</span>
                  <input className="sw-input" type="number" inputMode="decimal" value={addAmounts[g.id]||""} onChange={e=>setAddAmounts(p=>({...p,[g.id]:e.target.value}))} placeholder="Add savings" style={{paddingLeft:28,fontSize:13,padding:"10px 10px 10px 28px"}}/>
                </div>
                <button className="gbtn" onClick={()=>{if(addAmounts[g.id]&&+addAmounts[g.id]>0){updateGoalSaved(g.id,addAmounts[g.id]);setAddAmounts(p=>({...p,[g.id]:""}));}}} style={{padding:"10px 18px",fontSize:13,flexShrink:0}}>Save</button>
              </div>)}
            </Card>
          );
        })}
    </div>
  );
}

// ── Profile ───────────────────────────────────
function Profile({user,avatar,setAvatar,doLogout,entries,goals,streak,isDark,tc,sc}){
  const [editingAvatar,setEditingAvatar]=useState(false);
  const userName=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"User";
  const totalSpent=entries.reduce((s,e)=>s+e.amount,0);
  const totalGoals=goals.reduce((s,g)=>s+g.saved,0);
  const completedGoals=goals.filter(g=>g.saved>=g.target).length;

  return(
    <div style={{animation:"up .3s ease",padding:"16px 0"}}>
      <Card color={avatar.color} style={{marginBottom:14,textAlign:"center",padding:"32px 24px",background:`linear-gradient(135deg,${avatar.color}10,${avatar.color}04)`}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:16}}>
          <div style={{width:100,height:100,borderRadius:"50%",background:`linear-gradient(135deg,${avatar.color},${avatar.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,margin:"0 auto",boxShadow:`0 12px 40px ${avatar.color}44`,cursor:"pointer",transition:"transform .2s",border:`3px solid ${avatar.color}`}} onClick={()=>setEditingAvatar(p=>!p)} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.07)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            {avatar.emoji}
          </div>
          <div style={{position:"absolute",bottom:2,right:2,width:28,height:28,borderRadius:"50%",background:"#6366f1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer",border:`2px solid ${isDark?"#07090f":"#fff"}`,boxShadow:"0 4px 12px rgba(99,102,241,.5)"}} onClick={()=>setEditingAvatar(p=>!p)}>✏️</div>
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,marginBottom:4,color:tc}}>{userName}</div>
        <div style={{fontSize:13,color:"#94a3b8",marginBottom:14,fontWeight:600}}>{user?.email}</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:20,background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.2)"}}>
          <div className="live"/><span style={{fontSize:12,color:"#10b981",fontWeight:700}}>Account Active</span>
        </div>
        {editingAvatar&&(
          <div style={{marginTop:22,padding:"18px 16px",borderRadius:18,background:isDark?"rgba(255,255,255,.04)":"#f8fafc",border:isDark?"1px solid rgba(255,255,255,.07)":"1px solid #e2e8f0",textAlign:"left"}}>
            <div className="stitle">Choose Avatar</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {AVATARS.map(em=>(<div key={em} className={`avatar-opt${avatar.emoji===em?" sel":""}`} style={{background:avatar.emoji===em?`${avatar.color}22`:"rgba(255,255,255,.04)"}} onClick={()=>setAvatar(p=>({...p,emoji:em}))}>{em}</div>))}
            </div>
            <div className="stitle">Choose Color</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {AVATAR_COLORS.map(col=>(<div key={col} style={{width:36,height:36,borderRadius:"50%",background:col,cursor:"pointer",border:avatar.color===col?"3px solid #fff":"3px solid transparent",boxShadow:avatar.color===col?`0 0 16px ${col}`:"none",transition:"all .2s"}} onClick={()=>setAvatar(p=>({...p,color:col}))} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>))}
            </div>
            <button className="gbtn" onClick={()=>setEditingAvatar(false)} style={{width:"100%",padding:"12px",fontSize:13}}>Save Avatar ✓</button>
          </div>
        )}
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        {[{label:"Total Spent",value:fmt(totalSpent),icon:"💸",color:"#f43f5e"},{label:"Goals Saved",value:fmt(totalGoals),icon:"🎯",color:"#818cf8"},{label:"Day Streak",value:`${streak} 🔥`,icon:"",color:"#fbbf24"},{label:"Goals Done",value:`${completedGoals}/${goals.length}`,icon:"✅",color:"#10b981"}].map((s,i)=>(
          <Card key={i} color={s.color} style={{textAlign:"center",padding:"18px 14px"}}>
            <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:10,color:"#475569",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
            <div style={{fontSize:18,fontWeight:800,color:s.color}}>{s.value}</div>
          </Card>
        ))}
      </div>

      <Card color="#6366f1" style={{marginBottom:14}}>
        <div className="stitle">Account Info</div>
        {[["📧","Email",user?.email],["🗓️","Joined",new Date(user?.created_at||Date.now()).toLocaleDateString("en-IN",{month:"long",year:"numeric"})],["🔒","Privacy","All data is private & encrypted"]].map(([icon,label,value])=>(
          <div key={label} style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9",gap:12}}>
            <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
            <span style={{fontSize:12,color:"#475569",fontWeight:700,width:80,flexShrink:0}}>{label}</span>
            <span style={{fontSize:13,fontWeight:600,color:tc,flex:1,wordBreak:"break-all"}}>{value}</span>
          </div>
        ))}
      </Card>

      <button onClick={doLogout} style={{width:"100%",padding:"16px",background:"rgba(244,63,94,.07)",border:"1px solid rgba(244,63,94,.2)",color:"#f43f5e",borderRadius:16,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(244,63,94,.15)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(244,63,94,.07)";e.currentTarget.style.transform="translateY(0)";}}>↩ Sign Out</button>

      <div style={{textAlign:"center",fontSize:11,color:"#334155",fontWeight:600}}>© {new Date().getFullYear()} SpendWise · Made with ❤️ by Monish Kandanuru</div>
    </div>
  );
}

// ── Developer Page ────────────────────────────
function Developer({isDark,tc,sc}){
  const skills=["React.js","Supabase","JavaScript","CSS3","Responsive Design","Git & GitHub","Firebase","Vercel"];
  return(
    <div style={{animation:"up .3s ease",padding:"16px 0"}}>
      {/* Hero */}
      <Card color="#6366f1" style={{marginBottom:14,textAlign:"center",padding:"36px 24px",background:"linear-gradient(135deg,rgba(99,102,241,.08),rgba(129,140,248,.04))"}}>
        <div style={{width:96,height:96,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,margin:"0 auto 18px",boxShadow:"0 12px 40px rgba(99,102,241,.4)",animation:"float 3s ease-in-out infinite"}}>👨‍💻</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#818cf8",marginBottom:4}}>Monish Kandanuru</div>
        <div style={{fontSize:13,color:sc,marginBottom:16,fontWeight:600}}>Creator of SpendWise Management</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:20,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.25)"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:"#10b981",display:"inline-block",animation:"blink 2s infinite"}}/>
          <span style={{fontSize:12,color:"#818cf8",fontWeight:700}}>Full-Stack Developer</span>
        </div>
      </Card>

      {/* About */}
      <Card color="#f59e0b" style={{marginBottom:14}}>
        <div className="stitle">About</div>
        <p style={{fontSize:14,color:tc,lineHeight:1.85,fontWeight:500}}>
          Built SpendWise Management to help students and individuals track and manage their daily expenses effectively. The goal was to create a simple yet powerful tool that makes financial awareness easy and accessible for everyone.
        </p>
        <div style={{marginTop:16,padding:"16px 18px",borderRadius:14,background:"rgba(99,102,241,.07)",border:"1px solid rgba(99,102,241,.15)"}}>
          <p style={{fontSize:13,color:"#818cf8",fontStyle:"italic",lineHeight:1.85,textAlign:"center",fontWeight:600}}>
            "Money should be saved and each penny spent should be tracked so we can easily know where we spent it."
          </p>
        </div>
      </Card>

      {/* Project Details */}
      <Card color="#818cf8" style={{marginBottom:14}}>
        <div className="stitle">Project Details</div>
        {[
          ["🏷️","Project","SpendWise Management"],
          ["🎯","Purpose","Student & Personal Expense Tracker"],
          ["🛠️","Stack","React.js + Supabase + Vercel"],
          ["📱","Platform","Web App (PWA — Installable)"],
          ["🔒","Privacy","Each user's data is 100% private"],
          ["🆓","Cost","Completely Free to Use"],
          ["🌐","Live URL","spendwisemanagement.vercel.app"],
        ].map(([icon,label,value])=>(
          <div key={label} style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9",gap:12}}>
            <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
            <span style={{fontSize:12,color:"#475569",fontWeight:700,width:70,flexShrink:0}}>{label}</span>
            <span style={{fontSize:13,fontWeight:600,color:tc,flex:1,wordBreak:"break-all"}}>{value}</span>
          </div>
        ))}
      </Card>

      {/* Skills */}
      <Card color="#10b981" style={{marginBottom:14}}>
        <div className="stitle">Skills Used</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {skills.map(s=>(
            <div key={s} style={{padding:"7px 14px",borderRadius:20,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",fontSize:12,fontWeight:700,color:"#818cf8",transition:"all .2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,.2)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(99,102,241,.1)";e.currentTarget.style.transform="translateY(0)";}}>
              {s}
            </div>
          ))}
        </div>
      </Card>

      {/* Features Built */}
      <Card color="#a78bfa" style={{marginBottom:14}}>
        <div className="stitle">Features Built</div>
        {[
          ["🔐","Secure Authentication","Sign up / Sign in with Supabase"],
          ["💸","Expense Tracking","Add, view and delete expenses"],
          ["🎯","Savings Goals","Track savings with progress bars"],
          ["📊","Analytics","Charts for spending insights"],
          ["🔥","Streak System","Daily tracking streak gamification"],
          ["💵","Cash vs UPI","Split budget by payment method"],
          ["🌙","Dark Mode","Switch between light and dark themes"],
          ["📱","PWA Support","Install as a mobile app"],
        ].map(([icon,title,desc])=>(
          <div key={title} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9"}}>
            <div style={{width:38,height:38,borderRadius:12,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:tc}}>{title}</div>
              <div style={{fontSize:11,color:"#475569",fontWeight:600,marginTop:2}}>{desc}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Connect */}
      <Card color="#06b6d4" style={{marginBottom:14}}>
        <div className="stitle">Connect</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["🐙","GitHub","github.com/monishkandanuru"],["🌐","Live App","spendwisemanagement.vercel.app"]].map(([icon,label,val])=>(
            <div key={label} style={{padding:"14px",borderRadius:14,background:isDark?"rgba(255,255,255,.03)":"#f8fafc",border:isDark?"1px solid rgba(255,255,255,.06)":"1px solid #e2e8f0"}}>
              <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:11,color:sc,marginBottom:3,fontWeight:700}}>{label}</div>
              <div style={{fontSize:11,fontWeight:700,color:"#818cf8",wordBreak:"break-all"}}>{val}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{textAlign:"center",padding:"16px 0 4px",fontSize:11,color:"#334155",fontWeight:600}}>
        © {new Date().getFullYear()} SpendWise · Made with ❤️ by Monish Kandanuru
      </div>
    </div>
  );
}