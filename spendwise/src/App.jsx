import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── Supabase ──────────────────────────────────
const SUPABASE_URL  = "https://btlfemlkvzitbzojqopy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bGZlbWxrdnppdGJ6b2pxb3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDU5NjQsImV4cCI6MjA4ODIyMTk2NH0.oYNtp-MfuaN-77VweZLRH0bAUt7P3Ln0q6adWrg5y40";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Constants ─────────────────────────────────
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
const NAV=[
  {id:"dashboard",icon:"⬡",label:"Dashboard"},
  {id:"history",  icon:"☰",label:"History"},
  {id:"analytics",icon:"◎",label:"Analytics"},
  {id:"goals",    icon:"🎯",label:"Goals"},
  {id:"developer",icon:"👨‍💻",label:"Developer"},
];
const STREAK_MILESTONES=[7,14,30];

// ── CSS ───────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#d4a853;border-radius:2px}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes celebrate{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes slidedown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
.card{border-radius:18px;backdrop-filter:blur(10px);transition:background .3s,border .3s,box-shadow .3s}
.dark .card{background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.018));border:1px solid rgba(212,168,83,.14)}
.light .card{background:#fff;border:1px solid #e2e8f0;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.gbtn{background:linear-gradient(135deg,#d4a853,#f0c96e,#d4a853);background-size:200%;color:#080c18;border:none;border-radius:13px;font-weight:700;cursor:pointer;transition:all .3s;font-family:'DM Sans',sans-serif;font-size:15px;display:flex;align-items:center;justify-content:center;gap:10px}
.gbtn:hover{background-position:100%;transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,168,83,.4)}
.gbtn:active{transform:scale(.97)}
.gbtn:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
.xbtn{background:transparent;border:1px solid rgba(212,168,83,.3);color:#d4a853;border-radius:11px;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.xbtn:hover{background:rgba(212,168,83,.1)}
.chip{cursor:pointer;border-radius:12px;padding:10px 8px;border:2px solid transparent;transition:all .2s;text-align:center}
.dark .chip{background:rgba(255,255,255,.04)}
.light .chip{background:#f8fafc}
.chip:active{transform:scale(.95)}
.chip.sel{border-color:#d4a853;background:rgba(212,168,83,.14)!important}
.erow:hover .dbtn{opacity:1!important}
.dbtn{opacity:0;transition:opacity .2s}
@media(max-width:639px){.dbtn{opacity:1}}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fade .2s}
@media(min-width:640px){.modal-bg{align-items:center}}
.modal{border-radius:22px 22px 0 0;padding:26px 22px;width:100%;animation:up .28s;max-height:93vh;overflow-y:auto}
.dark .modal{background:linear-gradient(160deg,#111827,#0d1428);border:1px solid rgba(212,168,83,.22)}
.light .modal{background:#fff;border:1px solid #e2e8f0}
@media(min-width:640px){.modal{border-radius:22px;max-width:520px;width:90%}}
.sw-input{font-family:'DM Sans',sans-serif;border-radius:12px;padding:13px 15px;width:100%;font-size:14px;transition:border-color .2s,background .3s}
.dark .sw-input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);color:#fff}
.light .sw-input{background:#f8fafc;border:1px solid #e2e8f0;color:#1e293b}
.sw-input::placeholder{color:#94a3b8}
.sw-input:focus{outline:none;border-color:rgba(212,168,83,.5)}
.bar{height:8px;border-radius:4px;overflow:hidden;transition:background .3s}
.dark .bar{background:rgba(255,255,255,.07)}
.light .bar{background:#f1f5f9}
.fill{height:100%;border-radius:4px;transition:width 1s ease}
.notif{position:fixed;top:18px;left:50%;transform:translateX(-50%);padding:13px 22px;border-radius:14px;z-index:400;animation:up .3s;font-weight:600;font-size:13px;pointer-events:none;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.5);font-family:'DM Sans',sans-serif}
.bnav{position:fixed;bottom:0;left:0;right:0;backdrop-filter:blur(24px);display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px);transition:background .3s,border .3s}
.dark .bnav{background:rgba(6,9,20,.97);border-top:1px solid rgba(212,168,83,.1)}
.light .bnav{background:rgba(255,255,255,.97);border-top:1px solid #e2e8f0}
.bitem{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 0;cursor:pointer;font-size:9px;font-weight:600;transition:color .2s;font-family:'DM Sans',sans-serif}
.dark .bitem{color:#475569}
.light .bitem{color:#94a3b8}
.bitem.on{color:#d4a853}
.fab{position:fixed;bottom:74px;right:18px;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#d4a853,#f0c96e);border:none;cursor:pointer;font-size:28px;color:#080c18;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 28px rgba(212,168,83,.6);z-index:150;transition:transform .2s;line-height:1;font-weight:200}
.fab:active{transform:scale(.9)}
.mscroll{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;-webkit-overflow-scrolling:touch}
.mscroll::-webkit-scrollbar{display:none}
.mbtn{padding:5px 13px;border-radius:20px;font-size:12px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .2s}
.dark .mbtn{border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#64748b}
.light .mbtn{border:1px solid #e2e8f0;background:#f8fafc;color:#94a3b8}
.mbtn.on{border-color:#d4a853;background:rgba(212,168,83,.15);color:#d4a853}
.snav{cursor:pointer;padding:10px 16px;border-radius:12px;transition:all .2s;font-weight:500;font-size:13px;display:flex;align-items:center;gap:10px;margin-bottom:3px;font-family:'DM Sans',sans-serif}
.dark .snav{color:#64748b}
.light .snav{color:#94a3b8}
.dark .snav:hover{background:rgba(212,168,83,.08);color:#94a3b8}
.light .snav:hover{background:#f8fafc;color:#64748b}
.snav.on{background:rgba(212,168,83,.14);color:#d4a853}
.spinner{border:3px solid rgba(212,168,83,.2);border-top-color:#d4a853;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
.live{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;animation:blink 2s infinite;flex-shrink:0}
.authtab{flex:1;padding:12px;text-align:center;cursor:pointer;font-weight:600;font-size:14px;border-bottom:2px solid transparent;transition:all .2s;font-family:'DM Sans',sans-serif}
.dark .authtab{color:#64748b}
.light .authtab{color:#94a3b8}
.authtab.on{color:#d4a853;border-bottom-color:#d4a853}
.pmtab{flex:1;padding:10px;text-align:center;cursor:pointer;font-weight:600;font-size:13px;border-radius:10px;transition:all .2s;font-family:'DM Sans',sans-serif}
.dark .pmtab{color:#64748b;background:transparent}
.light .pmtab{color:#94a3b8;background:transparent}
.pmtab.cash{background:rgba(74,222,128,.15)!important;color:#4ade80!important;border:1px solid rgba(74,222,128,.3)!important}
.pmtab.upi{background:rgba(96,165,250,.15)!important;color:#60a5fa!important;border:1px solid rgba(96,165,250,.3)!important}
.theme-btn{background:none;border:none;cursor:pointer;font-size:19px;padding:6px;border-radius:10px;transition:all .2s}
.theme-btn:hover{background:rgba(212,168,83,.1)}
`;

// ── Auth Screen ───────────────────────────────
function AuthScreen({onAuth,isDark}){
  const [tab,setTab]=useState("signin");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");
  const tc=isDark?"#e2e8f0":"#1e293b";
  const bg=isDark?"linear-gradient(135deg,#080c18,#0d1428 60%,#090e1c)":"linear-gradient(135deg,#f8fafc,#f1f5f9)";
  const handle=async()=>{
    setErr("");setMsg("");
    if(!email||!password)return setErr("Please fill in all fields.");
    if(tab==="signup"&&!name)return setErr("Please enter your name.");
    if(password.length<6)return setErr("Password must be at least 6 characters.");
    setLoading(true);
    if(tab==="signup"){
      const{error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});
      if(error)setErr(error.message);
      else{setMsg("✅ Account created! You can now sign in.");setTab("signin");}
    }else{
      const{data,error}=await supabase.auth.signInWithPassword({email,password});
      if(error)setErr(error.message);
      else onAuth(data.user);
    }
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:bg,color:tc,transition:"background .3s"}}>
      <div style={{width:"100%",maxWidth:380,animation:"up .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:88,height:88,borderRadius:26,background:"rgba(212,168,83,.1)",border:"1px solid rgba(212,168,83,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 18px"}}>💰</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,color:"#d4a853",lineHeight:1}}>Spend<span style={{color:tc}}>Wise</span></div>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:2.5,textTransform:"uppercase",marginTop:8}}>Student Expense Tracker</div>
        </div>
        <div className="card" style={{padding:"6px",marginBottom:22,display:"flex"}}>
          <div className={`authtab${tab==="signin"?" on":""}`} onClick={()=>{setTab("signin");setErr("");setMsg("");}}>Sign In</div>
          <div className={`authtab${tab==="signup"?" on":""}`} onClick={()=>{setTab("signup");setErr("");setMsg("");}}>Create Account</div>
        </div>
        <div className="card" style={{padding:"22px 20px"}}>
          {tab==="signup"&&(<><div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Your Name</div><input className="sw-input" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Monish Kandanuru" style={{marginBottom:16}}/></>)}
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Email</div>
          <input className="sw-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{marginBottom:16}}/>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Password</div>
          <input className="sw-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" style={{marginBottom:22}} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {err&&<div style={{fontSize:13,color:"#f87171",background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.2)",borderRadius:10,padding:"10px 14px",marginBottom:16}}>{err}</div>}
          {msg&&<div style={{fontSize:13,color:"#4ade80",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.2)",borderRadius:10,padding:"10px 14px",marginBottom:16}}>{msg}</div>}
          <button className="gbtn" onClick={handle} disabled={loading} style={{width:"100%",padding:"16px"}}>
            {loading?<><div className="spinner" style={{width:20,height:20}}/> Please wait...</>:tab==="signin"?"Sign In →":"Create Account →"}
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"#94a3b8",marginTop:14,lineHeight:1.7}}>Free forever · No credit card · 100% Private</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
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
  const [form,setForm]=useState({amount:"",category:"",note:"",date:toISO(),paymentMethod:"upi"});
  const [budgetForm,setBudgetForm]=useState({base:"",cash:"",upi:""});
  const [extraInput,setExtraInput]=useState("");
  const [selMonth,setSelMonth]=useState(new Date().getMonth());
  const [notif,setNotif]=useState(null);
  const [isMobile,setIsMobile]=useState(window.innerWidth<640);
  const [isDark,setIsDark]=useState(()=>localStorage.getItem("sw_theme")!=="light");
  const [streak,setStreak]=useState(0);
  const [goals,setGoals]=useState(()=>JSON.parse(localStorage.getItem("sw_goals")||"[]"));
  const [showGoalForm,setShowGoalForm]=useState(false);
  const [goalForm,setGoalForm]=useState({name:"",target:"",saved:""});
  const [reminder,setReminder]=useState(false);
  const [celebration,setCelebration]=useState(null);
  const amtRef=useRef();
  const selYear=new Date().getFullYear();
  const budget=baseBudget+extraBudget;

  useEffect(()=>{const h=()=>setIsMobile(window.innerWidth<640);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  useEffect(()=>{localStorage.setItem("sw_theme",isDark?"dark":"light");document.body.style.background=isDark?"#080c18":"#f8fafc";},[isDark]);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAuthReady(true);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setUser(session?.user??null));
    return()=>subscription.unsubscribe();
  },[]);
  useEffect(()=>{
    if(!user){setEntries([]);return;}
    const fetch=async()=>{const{data}=await supabase.from("expenses").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setEntries(data);};
    fetch();
    const sub=supabase.channel("exp").on("postgres_changes",{event:"*",schema:"public",table:"expenses",filter:`user_id=eq.${user.id}`},fetch).subscribe();
    return()=>supabase.removeChannel(sub);
  },[user]);
  useEffect(()=>{
    if(!user)return;
    const fetch=async()=>{const{data}=await supabase.from("budgets").select("*").eq("user_id",user.id).single();if(data){setBaseBudget(data.amount||10000);setExtraBudget(data.extra||0);setCashBudget(data.cash_budget||0);setUpiBudget(data.upi_budget||0);}};
    fetch();
    const sub=supabase.channel("bud").on("postgres_changes",{event:"*",schema:"public",table:"budgets",filter:`user_id=eq.${user.id}`},fetch).subscribe();
    return()=>supabase.removeChannel(sub);
  },[user]);
  useEffect(()=>{
    if(!entries.length)return;
    const dates=[...new Set(entries.map(e=>e.date))].sort((a,b)=>b.localeCompare(a));
    let s=0;
    for(let i=0;i<dates.length;i++){
      const d=new Date(dates[i]);d.setHours(0,0,0,0);
      const cur=new Date();cur.setHours(0,0,0,0);
      const diff=Math.round((cur-d)/86400000);
      if(diff===i)s++;else break;
    }
    setStreak(s);
    if(STREAK_MILESTONES.includes(s)){setCelebration(s);setTimeout(()=>setCelebration(null),4000);}
  },[entries]);
  useEffect(()=>{
    const last=localStorage.getItem("sw_reminder_date"),today=toISO();
    if(last===today)return;
    const now=new Date(),ms8pm=new Date(now.getFullYear(),now.getMonth(),now.getDate(),20,0,0)-now;
    const show=()=>{localStorage.setItem("sw_reminder_date",today);if("Notification" in window&&Notification.permission==="granted")new Notification("SpendWise 💰",{body:"Don't forget to add today's expenses!"});else{setReminder(true);setTimeout(()=>setReminder(false),8000);}};
    if(ms8pm>0){const t=setTimeout(show,ms8pm);return()=>clearTimeout(t);}
  },[]);
  useEffect(()=>{if("Notification" in window&&Notification.permission==="default")Notification.requestPermission();},[]);
  useEffect(()=>{localStorage.setItem("sw_goals",JSON.stringify(goals));},[goals]);

  const toast=(msg,type="ok")=>{setNotif({msg,type});setTimeout(()=>setNotif(null),2500);};
  const doLogout=async()=>{await supabase.auth.signOut();setEntries([]);};

  const addEntry=async()=>{
    if(!form.amount||isNaN(form.amount)||+form.amount<=0)return toast("Enter a valid amount","err");
    if(!form.category)return toast("Pick a category","err");
    const{error}=await supabase.from("expenses").insert({user_id:user.id,amount:+form.amount,category:form.category,note:form.note,date:form.date,payment_method:form.paymentMethod});
    if(error)return toast("Failed to save","err");
    setForm({amount:"",category:"",note:"",date:toISO(),paymentMethod:"upi"});
    setShowAdd(false);toast("Expense added! ✓");
  };
  const delEntry=async(id)=>{await supabase.from("expenses").delete().eq("id",id).eq("user_id",user.id);toast("Removed","info");};
  const saveBudget=async()=>{
    const base=+budgetForm.base||baseBudget;
    const cash=+budgetForm.cash||0;
    const upi=+budgetForm.upi||0;
    if(base<=0)return;
    await supabase.from("budgets").upsert({user_id:user.id,amount:base,extra:extraBudget,cash_budget:cash,upi_budget:upi},{onConflict:"user_id"});
    setBaseBudget(base);setCashBudget(cash);setUpiBudget(upi);
    setBudgetForm({base:"",cash:"",upi:""});setShowBudget(false);toast("Budget updated!");
  };
  const saveExtra=async()=>{
    if(!extraInput||+extraInput<=0)return;
    const ne=extraBudget+(+extraInput);
    await supabase.from("budgets").upsert({user_id:user.id,amount:baseBudget,extra:ne,cash_budget:cashBudget,upi_budget:upiBudget},{onConflict:"user_id"});
    setExtraBudget(ne);setExtraInput("");setShowExtra(false);toast(`+${fmt(+extraInput)} added!`);
  };
  const addGoal=()=>{
    if(!goalForm.name||!goalForm.target||+goalForm.target<=0)return toast("Fill in name and target","err");
    setGoals(p=>[...p,{id:Date.now(),name:goalForm.name,target:+goalForm.target,saved:+goalForm.saved||0}]);
    setGoalForm({name:"",target:"",saved:""});setShowGoalForm(false);toast("Goal added! 🎯");
  };
  const updateGoalSaved=(id,amt)=>{setGoals(p=>p.map(g=>g.id===id?{...g,saved:Math.min(g.saved+(+amt),g.target)}:g));toast("Progress updated! 💪");};
  const deleteGoal=(id)=>{setGoals(p=>p.filter(g=>g.id!==id));toast("Goal removed","info");};

  // Derived
  const mEntries=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===selMonth&&d.getFullYear()===selYear;});
  const mTotal=mEntries.reduce((s,e)=>s+e.amount,0);
  const pMonth=selMonth===0?11:selMonth-1;
  const pYear=selMonth===0?selYear-1:selYear;
  const pEntries=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===pMonth&&d.getFullYear()===pYear;});
  const pTotal=pEntries.reduce((s,e)=>s+e.amount,0);
  const diff=mTotal-pTotal;
  const diffPct=pTotal>0?((diff/pTotal)*100).toFixed(1):null;
  const budPct=Math.min((mTotal/budget)*100,100);
  const todayTot=entries.filter(e=>e.date===toISO()).reduce((s,e)=>s+e.amount,0);
  const todayCnt=entries.filter(e=>e.date===toISO()).length;
  const catBreak=CATS.map(c=>({...c,total:mEntries.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0)})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
  const cashSpent=mEntries.filter(e=>e.payment_method==="cash").reduce((s,e)=>s+e.amount,0);
  const upiSpent=mEntries.filter(e=>e.payment_method!=="cash").reduce((s,e)=>s+e.amount,0);
  const weeks={};
  mEntries.forEach(e=>{const w=getWeek(e.date);if(!weeks[w])weeks[w]={total:0,count:0};weeks[w].total+=e.amount;weeks[w].count++;});

  const tc=isDark?"#e2e8f0":"#1e293b";
  const bg=isDark?"linear-gradient(135deg,#080c18,#0d1428 60%,#090e1c)":"linear-gradient(135deg,#f8fafc,#f1f5f9)";
  const sc=isDark?"#64748b":"#94a3b8";
  const thC=isDark?"dark":"light";

  if(!authReady)return(<div style={{minHeight:"100vh",background:isDark?"#080c18":"#f8fafc",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}><style>{CSS}</style><div style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#d4a853"}}>SpendWise</div><div className="spinner" style={{width:36,height:36}}/></div>);
  if(!user)return(<div className={thC}><style>{CSS}</style><AuthScreen onAuth={setUser} isDark={isDark}/></div>);

  const userName=user.user_metadata?.full_name||user.email?.split("@")[0]||"User";
  const userInitial=userName[0].toUpperCase();
  const MonthRow=()=>(<div className="mscroll">{MONTHS.map((m,i)=>(<button key={m} className={`mbtn${selMonth===i?" on":""}`} onClick={()=>setSelMonth(i)}>{m}</button>))}</div>);

  const sp={mTotal,diff,diffPct,pMonth,budPct,budget,baseBudget,extraBudget,cashBudget,upiBudget,cashSpent,upiSpent,todayTot,todayCnt,catBreak,entries,mEntries,pEntries,pTotal,weeks,selMonth,selYear,pYear,del:delEntry,streak,goals,updateGoalSaved,deleteGoal,setShowGoalForm,setShowExtra,isDark,tc,sc};

  return(
    <div className={thC} style={{fontFamily:"'DM Sans',sans-serif",background:bg,color:tc,minHeight:"100vh",display:"flex",flexDirection:"column",transition:"background .3s,color .3s"}}>
      <style>{CSS}</style>

      {notif&&<div className="notif" style={{background:notif.type==="err"?"linear-gradient(135deg,#7f1d1d,#991b1b)":notif.type==="info"?"linear-gradient(135deg,#1e3a5f,#1e40af)":"linear-gradient(135deg,#14532d,#166534)",border:`1px solid ${notif.type==="err"?"#ef4444":notif.type==="info"?"#3b82f6":"#22c55e"}`,color:"#fff"}}>{notif.msg}</div>}

      {reminder&&(
        <div style={{background:"linear-gradient(135deg,#d4a853,#f0c96e)",color:"#080c18",padding:"12px 20px",textAlign:"center",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,position:"sticky",top:0,zIndex:300,animation:"slidedown .4s ease"}}>
          💰 Don't forget to add today's expenses!
          <button onClick={()=>setReminder(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#080c18",marginLeft:8}}>×</button>
        </div>
      )}

      {celebration&&(
        <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:500,background:"linear-gradient(135deg,#d4a853,#f0c96e)",borderRadius:22,padding:"32px 40px",textAlign:"center",boxShadow:"0 20px 60px rgba(212,168,83,.5)",animation:"celebrate .6s ease"}}>
          <div style={{fontSize:48,marginBottom:10}}>🎉</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#080c18",fontWeight:700}}>{celebration} Day Streak!</div>
          <div style={{fontSize:14,color:"#080c18",marginTop:6,opacity:.8}}>Amazing job tracking your expenses!</div>
        </div>
      )}

      {/* ── ADD EXPENSE MODAL ── */}
      {showAdd&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal">
            <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853"}}>Add Expense</h2>
              <button onClick={()=>setShowAdd(false)} style={{background:"none",border:"none",color:sc,cursor:"pointer",fontSize:26,lineHeight:1}}>×</button>
            </div>
            {/* Amount */}
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Amount (₹)</div>
            <div style={{position:"relative",marginBottom:16}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:18,fontWeight:700}}>₹</span>
              <input ref={amtRef} className="sw-input" type="number" inputMode="decimal" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.00" style={{paddingLeft:36,fontSize:22,fontWeight:700,borderColor:"rgba(212,168,83,.25)"}}/>
            </div>
            {/* Payment Method */}
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:10}}>Payment Method</div>
            <div style={{display:"flex",gap:10,marginBottom:16,padding:6,borderRadius:13,background:isDark?"rgba(255,255,255,.04)":"#f8fafc",border:isDark?"1px solid rgba(255,255,255,.08)":"1px solid #e2e8f0"}}>
              <div className={`pmtab${form.paymentMethod==="cash"?" cash":""}`} onClick={()=>setForm({...form,paymentMethod:"cash"})} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💵 Cash</div>
              <div className={`pmtab${form.paymentMethod==="upi"?" upi":""}`} onClick={()=>setForm({...form,paymentMethod:"upi"})} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>📱 UPI / Online</div>
            </div>
            {/* Category */}
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:10}}>Category</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
              {CATS.map(c=>(<div key={c.id} className={`chip${form.category===c.id?" sel":""}`} style={{background:form.category===c.id?`${c.color}22`:undefined}} onClick={()=>setForm({...form,category:c.id})}><div style={{fontSize:19}}>{c.icon}</div><div style={{fontSize:9,color:form.category===c.id?c.color:sc,marginTop:3,fontWeight:600}}>{c.label.split(" ")[0]}</div></div>))}
            </div>
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Note (optional)</div>
            <input className="sw-input" type="text" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="What was this for?" style={{marginBottom:14}}/>
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Date</div>
            <input className="sw-input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{marginBottom:22,colorScheme:isDark?"dark":"light"}}/>
            <button className="gbtn" onClick={addEntry} style={{width:"100%",padding:"15px"}}>+ Add Expense</button>
          </div>
        </div>
      )}

      {/* ── BUDGET MODAL ── */}
      {showBudget&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowBudget(false)}>
          <div className="modal" style={{maxWidth:isMobile?"100%":460}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853",marginBottom:6}}>Set Monthly Budget</h2>
            <p style={{fontSize:13,color:sc,marginBottom:20}}>Split your budget between Cash and UPI</p>
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Total Budget (₹)</div>
            <div style={{position:"relative",marginBottom:14}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:16,fontWeight:700}}>₹</span>
              <input className="sw-input" type="number" inputMode="decimal" value={budgetForm.base} onChange={e=>setBudgetForm({...budgetForm,base:e.target.value})} placeholder={String(baseBudget)} style={{paddingLeft:32,fontSize:20,fontWeight:700,borderColor:"rgba(212,168,83,.25)"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              <div>
                <div style={{fontSize:11,color:"#4ade80",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>💵 Cash Amount</div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#4ade80",fontSize:14,fontWeight:700}}>₹</span>
                  <input className="sw-input" type="number" inputMode="decimal" value={budgetForm.cash} onChange={e=>setBudgetForm({...budgetForm,cash:e.target.value})} placeholder={String(cashBudget||0)} style={{paddingLeft:28,borderColor:"rgba(74,222,128,.3)"}}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:11,color:"#60a5fa",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>📱 UPI Amount</div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#60a5fa",fontSize:14,fontWeight:700}}>₹</span>
                  <input className="sw-input" type="number" inputMode="decimal" value={budgetForm.upi} onChange={e=>setBudgetForm({...budgetForm,upi:e.target.value})} placeholder={String(upiBudget||0)} style={{paddingLeft:28,borderColor:"rgba(96,165,250,.3)"}}/>
                </div>
              </div>
            </div>
            <button className="gbtn" style={{width:"100%",padding:"14px"}} onClick={saveBudget}>Save Budget</button>
          </div>
        </div>
      )}

      {/* ── EXTRA BUDGET MODAL ── */}
      {showExtra&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowExtra(false)}>
          <div className="modal" style={{maxWidth:isMobile?"100%":400}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853",marginBottom:6}}>Add Extra Budget</h2>
            <div style={{padding:"14px 16px",borderRadius:13,background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.2)",marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}><span style={{color:sc}}>Base Budget</span><span style={{fontWeight:600}}>{fmt(baseBudget)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}><span style={{color:sc}}>Extra Added</span><span style={{fontWeight:600,color:"#4ade80"}}>+{fmt(extraBudget)}</span></div>
              <div style={{height:1,background:"rgba(212,168,83,.2)",margin:"8px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700}}><span>Total</span><span style={{color:"#d4a853"}}>{fmt(budget)}</span></div>
            </div>
            <div style={{position:"relative",marginBottom:20}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:18,fontWeight:700}}>₹</span>
              <input className="sw-input" type="number" inputMode="decimal" value={extraInput} onChange={e=>setExtraInput(e.target.value)} placeholder="Amount to add" style={{paddingLeft:36,fontSize:22,fontWeight:700,borderColor:"rgba(212,168,83,.25)"}}/>
            </div>
            <button className="gbtn" style={{width:"100%",padding:"14px"}} onClick={saveExtra}>+ Add to Budget</button>
          </div>
        </div>
      )}

      {/* ── GOAL FORM MODAL ── */}
      {showGoalForm&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowGoalForm(false)}>
          <div className="modal" style={{maxWidth:isMobile?"100%":400}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853",marginBottom:20}}>New Savings Goal 🎯</h2>
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Goal Name</div>
            <input className="sw-input" type="text" value={goalForm.name} onChange={e=>setGoalForm({...goalForm,name:e.target.value})} placeholder="e.g. Buy Headphones" style={{marginBottom:14}}/>
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Target Amount</div>
            <div style={{position:"relative",marginBottom:14}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:14,fontWeight:700}}>₹</span><input className="sw-input" type="number" inputMode="decimal" value={goalForm.target} onChange={e=>setGoalForm({...goalForm,target:e.target.value})} placeholder="3000" style={{paddingLeft:28}}/></div>
            <div style={{fontSize:11,color:sc,letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Already Saved</div>
            <div style={{position:"relative",marginBottom:22}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:14,fontWeight:700}}>₹</span><input className="sw-input" type="number" inputMode="decimal" value={goalForm.saved} onChange={e=>setGoalForm({...goalForm,saved:e.target.value})} placeholder="0" style={{paddingLeft:28}}/></div>
            <button className="gbtn" onClick={addGoal} style={{width:"100%",padding:"14px"}}>Create Goal 🎯</button>
          </div>
        </div>
      )}

      {/* ══ DESKTOP ══ */}
      {!isMobile&&(
        <div style={{display:"flex",flex:1}}>
          <div style={{width:228,padding:"26px 14px",background:isDark?"rgba(0,0,0,.4)":"rgba(255,255,255,.7)",borderRight:isDark?"1px solid rgba(212,168,83,.08)":"1px solid #e2e8f0",display:"flex",flexDirection:"column",flexShrink:0,transition:"background .3s",position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
            <div style={{paddingLeft:6,marginBottom:22}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:21,color:"#d4a853"}}>Spend<span style={{color:tc}}>Wise</span></div>
              <div style={{fontSize:10,color:sc,letterSpacing:2,textTransform:"uppercase",marginTop:3}}>Student Tracker</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:14,background:isDark?"rgba(255,255,255,.04)":"#f8fafc",border:isDark?"1px solid rgba(255,255,255,.07)":"1px solid #e2e8f0",marginBottom:16}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#d4a853,#f0c96e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#080c18",flexShrink:0}}>{userInitial}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{userName}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}><div className="live"/><span style={{fontSize:10,color:"#4ade80"}}>Live sync</span></div>
              </div>
            </div>
            {streak>0&&(<div style={{padding:"10px 14px",borderRadius:13,background:"rgba(251,191,36,.1)",border:"1px solid rgba(251,191,36,.25)",marginBottom:14,textAlign:"center",animation:"celebrate .6s ease"}}><div style={{fontSize:18}}>🔥</div><div style={{fontSize:13,fontWeight:700,color:"#fbbf24",marginTop:2}}>{streak} Day Streak!</div></div>)}
            {NAV.map(n=>(<div key={n.id} className={`snav${view===n.id?" on":""}`} onClick={()=>setView(n.id)}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</div>))}
            <div style={{flex:1}}/>
            <button className="theme-btn" onClick={()=>setIsDark(p=>!p)} style={{marginBottom:8,display:"flex",alignItems:"center",gap:8,padding:"9px 13px",borderRadius:11,width:"100%",border:isDark?"1px solid rgba(255,255,255,.08)":"1px solid #e2e8f0"}}>
              {isDark?"☀️":"🌙"}<span style={{fontSize:13,fontWeight:500,color:sc}}>{isDark?"Light Mode":"Dark Mode"}</span>
            </button>
            <button className="xbtn" onClick={()=>setShowBudget(true)} style={{padding:"8px 13px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span>⚙</span> Set Budget</button>
            <button onClick={doLogout} style={{padding:"8px 13px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:8,background:"transparent",border:"1px solid rgba(248,113,113,.3)",color:"#f87171",borderRadius:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}><span>↩</span> Sign Out</button>
          </div>
          <div style={{flex:1,padding:"26px 30px",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:25}}>{NAV.find(n=>n.id===view)?.label||"Dashboard"}</h1>
                <p style={{color:sc,fontSize:12,marginTop:3}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
              </div>
              <button className="gbtn" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}} style={{padding:"12px 22px"}}>
                <span style={{fontSize:18,fontWeight:200}}>+</span> Add Expense
              </button>
            </div>
            {view!=="developer"&&<div style={{marginBottom:20}}><MonthRow/></div>}
            {view==="dashboard" &&<Dashboard {...sp}/>}
            {view==="history"   &&<History   {...sp}/>}
            {view==="analytics" &&<Analytics {...sp}/>}
            {view==="goals"     &&<Goals     {...sp}/>}
            {view==="developer" &&<Developer isDark={isDark} tc={tc} sc={sc}/>}
          </div>
        </div>
      )}

      {/* ══ MOBILE ══ */}
      {isMobile&&(
        <div style={{display:"flex",flexDirection:"column",flex:1,paddingBottom:130}}>
          <div style={{padding:"13px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:isDark?"1px solid rgba(255,255,255,.05)":"1px solid #e2e8f0",background:isDark?"rgba(0,0,0,.3)":"rgba(255,255,255,.9)",position:"sticky",top:0,zIndex:50,transition:"background .3s"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853"}}>Spend<span style={{color:tc}}>Wise</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}><div className="live"/><span style={{fontSize:10,color:"#4ade80",fontWeight:600}}>Live</span></div>
              {streak>0&&<span style={{fontSize:12,fontWeight:700,color:"#fbbf24"}}>🔥{streak}</span>}
              <button className="theme-btn" onClick={()=>setIsDark(p=>!p)}>{isDark?"☀️":"🌙"}</button>
              <div onClick={doLogout} style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#d4a853,#f0c96e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#080c18",cursor:"pointer"}}>{userInitial}</div>
            </div>
          </div>
          {view!=="developer"&&(
            <div style={{padding:"12px 16px 8px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:21}}>{NAV.find(n=>n.id===view)?.label}</h1>
                <button className="xbtn" onClick={()=>setShowBudget(true)} style={{padding:"6px 11px",fontSize:12}}>⚙ Budget</button>
              </div>
              <MonthRow/>
            </div>
          )}
          <div style={{flex:1,padding:"4px 16px 0",overflowY:"auto"}}>
            {view==="dashboard" &&<Dashboard {...sp}/>}
            {view==="history"   &&<History   {...sp}/>}
            {view==="analytics" &&<Analytics {...sp}/>}
            {view==="goals"     &&<Goals     {...sp}/>}
            {view==="developer" &&<Developer isDark={isDark} tc={tc} sc={sc}/>}
          </div>
          <button className="fab" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}}>+</button>
          <div className="bnav">
            {NAV.map(n=>(<div key={n.id} className={`bitem${view===n.id?" on":""}`} onClick={()=>setView(n.id)}><span style={{fontSize:18}}>{n.icon}</span><span>{n.label}</span></div>))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────
function SC({label,value,valueColor,sub,subColor,delay,span,tc}){
  return(
    <div className="card" style={{padding:17,animation:`up .4s ease ${delay||0}s both`,gridColumn:span?"1/-1":"auto"}}>
      <div style={{fontSize:10,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontSize:21,fontWeight:700,fontFamily:"'Playfair Display',serif",color:valueColor||tc,lineHeight:1.1}}>{value}</div>
      <div style={{fontSize:11,marginTop:7,color:subColor||"#64748b",fontWeight:500}}>{sub}</div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────
function Dashboard({mTotal,diff,diffPct,pMonth,budPct,budget,baseBudget,extraBudget,cashBudget,upiBudget,cashSpent,upiSpent,todayTot,todayCnt,catBreak,entries,del,streak,setShowExtra,isDark,tc,sc}){
  return(
    <div style={{animation:"up .3s ease"}}>
      {streak>0&&(
        <div className="card" style={{padding:"14px 18px",marginBottom:13,background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.2)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:26}}>🔥</span>
            <div><div style={{fontSize:14,fontWeight:700,color:"#fbbf24"}}>{streak} Day Tracking Streak!</div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{streak>=30?"🏆 Incredible!":streak>=14?"⭐ Outstanding!":streak>=7?"🎯 Amazing!":"Keep it up!"}</div></div>
          </div>
          {[7,14,30].filter(m=>m>streak)[0]&&(<div style={{fontSize:11,color:"#fbbf24",textAlign:"right"}}><div style={{fontWeight:700}}>{[7,14,30].filter(m=>m>streak)[0]-streak} days</div><div style={{color:"#94a3b8"}}>to next goal</div></div>)}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:13}}>
        <SC span label="Monthly Total" value={fmt(mTotal)} valueColor={tc} sub={diffPct?`${diff>0?"↑":"↓"} ${Math.abs(diffPct)}% vs ${MONTHS[pMonth]}`:"No previous data"} subColor={diff>0?"#f87171":"#4ade80"} delay={0} tc={tc}/>
        <SC label="Today" value={fmt(todayTot)} valueColor="#d4a853" sub={`${todayCnt} transaction${todayCnt!==1?"s":""}`} subColor="#64748b" delay={.1} tc={tc}/>
        <SC label="Budget Left" value={fmt(Math.abs(budget-mTotal))} valueColor={(budget-mTotal)<0?"#f87171":"#4ade80"} sub={(budget-mTotal)<0?"⚠ Over budget!":fmt(budget)+" total"} subColor={(budget-mTotal)<0?"#f87171":"#4ade80"} delay={.2} tc={tc}/>
      </div>

      {/* Smart Budget Card */}
      <div className="card" style={{padding:17,marginBottom:13}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:13,fontWeight:600}}>Budget Overview</span>
          <button onClick={()=>setShowExtra(true)} style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.3)",color:"#4ade80",borderRadius:9,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>+ Add Extra</button>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#94a3b8",marginBottom:3}}><span>Base Budget</span><span>{fmt(baseBudget)}</span></div>
        {extraBudget>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#4ade80",marginBottom:3}}><span>Extra Added</span><span>+{fmt(extraBudget)}</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,color:"#d4a853",marginBottom:10}}><span>Total Budget</span><span>{fmt(budget)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"#94a3b8"}}>Usage</span><span style={{fontSize:12,fontWeight:700,color:budPct>90?"#f87171":"#d4a853"}}>{budPct.toFixed(1)}%</span></div>
        <div className="bar"><div className="fill" style={{width:`${budPct}%`,background:budPct>90?"linear-gradient(90deg,#f87171,#ef4444)":"linear-gradient(90deg,#d4a853,#f0c96e)"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11,color:"#94a3b8"}}><span>Spent {fmt(mTotal)}</span><span>Remaining {fmt(Math.max(budget-mTotal,0))}</span></div>
      </div>

      {/* Cash vs UPI Card */}
      {(cashBudget>0||upiBudget>0)&&(
        <div className="card" style={{padding:17,marginBottom:13}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Cash vs UPI Balance</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[{label:"💵 Cash",budget:cashBudget,spent:cashSpent,color:"#4ade80"},{label:"📱 UPI / Online",budget:upiBudget,spent:upiSpent,color:"#60a5fa"}].map((x,i)=>(
              <div key={i} style={{padding:14,borderRadius:14,background:isDark?"rgba(255,255,255,.03)":"#f8fafc",border:`1px solid ${x.color}22`}}>
                <div style={{fontSize:12,color:x.color,fontWeight:600,marginBottom:8}}>{x.label}</div>
                <div style={{fontSize:10,color:"#94a3b8",marginBottom:3}}>Budget: {fmt(x.budget)}</div>
                <div style={{fontSize:10,color:"#f87171",marginBottom:6}}>Spent: {fmt(x.spent)}</div>
                <div style={{height:6,borderRadius:3,background:isDark?"rgba(255,255,255,.07)":"#f1f5f9",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:3,width:`${Math.min(x.budget>0?x.spent/x.budget*100:0,100)}%`,background:`linear-gradient(90deg,${x.color}88,${x.color})`,transition:"width 1s"}}/>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:(x.budget-x.spent)<0?"#f87171":x.color,marginTop:6}}>Left: {fmt(Math.max(x.budget-x.spent,0))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {catBreak.length>0&&(
        <div className="card" style={{padding:17,marginBottom:13}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Category Breakdown</div>
          {catBreak.map(c=>(<div key={c.id} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:500}}>{c.icon} {c.label}</span><span style={{fontSize:13,fontWeight:700,color:c.color}}>{fmt(c.total)}</span></div><div className="bar"><div className="fill" style={{width:`${(c.total/mTotal*100).toFixed(1)}%`,background:`linear-gradient(90deg,${c.color}66,${c.color})`}}/></div></div>))}
        </div>
      )}

      <div className="card" style={{padding:17}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Recent Transactions</div>
        {entries.length===0
          ?<div style={{textAlign:"center",padding:"28px 0",color:"#334155"}}><div style={{fontSize:34,marginBottom:10}}>💸</div><div style={{fontSize:13}}>No transactions yet!</div></div>
          :entries.slice(0,8).map(e=>{
            const cat=CATS.find(c=>c.id===e.category);
            return(<div key={e.id} className="erow" style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9"}}>
              <div style={{width:38,height:38,borderRadius:11,background:`${cat?.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:10,flexShrink:0}}>{cat?.icon||"📦"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note||cat?.label||"Expense"}</div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})} · <span style={{color:e.payment_method==="cash"?"#4ade80":"#60a5fa"}}>{e.payment_method==="cash"?"💵 Cash":"📱 UPI"}</span></div>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:"#f87171",marginRight:8,flexShrink:0}}>-{fmt(e.amount)}</span>
              <button className="dbtn xbtn" onClick={()=>del(e.id)} style={{padding:"3px 8px",fontSize:11,color:"#f87171",borderColor:"rgba(248,113,113,.3)",flexShrink:0,opacity:1}}>✕</button>
            </div>);
          })}
      </div>
    </div>
  );
}

// ── History ───────────────────────────────────
function History({mEntries,weeks,selMonth,selYear,del,isDark,tc}){
  return(
    <div style={{animation:"up .3s ease"}}>
      <div className="card" style={{padding:17,marginBottom:13}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Weekly — {MONTHS[selMonth]} {selYear}</div>
        {Object.keys(weeks).length===0
          ?<div style={{color:"#94a3b8",fontSize:13,padding:"12px 0"}}>No data for this month.</div>
          :Object.entries(weeks).sort((a,b)=>+a[0]-+b[0]).map(([w,d])=>(<div key={w} style={{borderLeft:"3px solid rgba(212,168,83,.3)",paddingLeft:13,marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Week {w}</span><span style={{fontSize:14,fontWeight:700,color:"#d4a853"}}>{fmt(d.total)}</span></div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{d.count} transaction{d.count!==1?"s":""}</div></div>))}
      </div>
      <div className="card" style={{padding:17}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>All — {MONTHS[selMonth]} {selYear}</div>
        {mEntries.length===0
          ?<div style={{textAlign:"center",padding:"28px 0"}}><div style={{fontSize:32,marginBottom:10}}>📅</div><div style={{fontSize:13,color:"#94a3b8"}}>No entries for {MONTHS[selMonth]}</div></div>
          :mEntries.map(e=>{
            const cat=CATS.find(c=>c.id===e.category);
            return(<div key={e.id} className="erow" style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9"}}>
              <div style={{width:38,height:38,borderRadius:11,background:`${cat?.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:10,flexShrink:0}}>{cat?.icon||"📦"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note||cat?.label}</div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})} · <span style={{color:e.payment_method==="cash"?"#4ade80":"#60a5fa"}}>{e.payment_method==="cash"?"💵 Cash":"📱 UPI"}</span></div>
              </div>
              <div style={{textAlign:"right",marginRight:8,flexShrink:0}}><div style={{fontSize:13,fontWeight:700,color:"#f87171"}}>-{fmt(e.amount)}</div><div style={{fontSize:10,color:cat?.color,marginTop:1}}>{cat?.label}</div></div>
              <button className="dbtn xbtn" onClick={()=>del(e.id)} style={{padding:"3px 8px",fontSize:11,color:"#f87171",borderColor:"rgba(248,113,113,.3)",flexShrink:0,opacity:1}}>✕</button>
            </div>);
          })}
      </div>
    </div>
  );
}

// ── Analytics (with Charts) ───────────────────
function Analytics({mTotal,mEntries,pTotal,pEntries,diff,diffPct,catBreak,selMonth,selYear,pMonth,pYear,entries,cashSpent,upiSpent,weeks,isDark,tc}){
  const tooltipStyle={background:isDark?"#1e293b":"#fff",border:`1px solid ${isDark?"rgba(212,168,83,.2)":"#e2e8f0"}`,borderRadius:10,color:isDark?"#e2e8f0":"#1e293b",fontSize:12};

  // Pie chart data
  const pieData=catBreak.map(c=>({name:c.label,value:c.total,color:c.color}));

  // Weekly bar chart data
  const weekData=Object.entries(weeks).sort((a,b)=>+a[0]-+b[0]).map(([w,d])=>({week:`Wk ${w}`,amount:d.total}));

  // Cash vs UPI
  const pmData=[{name:"💵 Cash",value:cashSpent,color:"#4ade80"},{name:"📱 UPI",value:upiSpent,color:"#60a5fa"}];

  // 6 month trend
  const trendData=Array.from({length:6},(_,i)=>{
    const m=(selMonth-5+i+12)%12;
    const y=selMonth-5+i<0?selYear-1:selYear;
    const t=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===m&&d.getFullYear()===y;}).reduce((s,e)=>s+e.amount,0);
    return{month:MONTHS[m],amount:t,current:m===selMonth};
  });

  return(
    <div style={{animation:"up .3s ease"}}>
      {/* Month Comparison */}
      <div className="card" style={{padding:17,marginBottom:13}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Month Comparison</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          {[{label:`${MONTHS[selMonth]} ${selYear}`,total:mTotal,cnt:mEntries.length,col:"#d4a853"},{label:`${MONTHS[pMonth]} ${pYear}`,total:pTotal,cnt:pEntries.length,col:"#64748b"}].map((x,i)=>(
            <div key={i} style={{padding:14,background:isDark?"rgba(255,255,255,.03)":"#f8fafc",borderRadius:14}}>
              <div style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{x.label}</div>
              <div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',serif",color:x.col,lineHeight:1}}>{fmt(x.total)}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:5}}>{x.cnt} transactions</div>
            </div>
          ))}
        </div>
        {diffPct!==null&&(<div style={{marginTop:12,padding:12,borderRadius:12,background:diff>0?"rgba(248,113,113,.08)":"rgba(74,222,128,.08)",border:`1px solid ${diff>0?"rgba(248,113,113,.2)":"rgba(74,222,128,.2)"}`,textAlign:"center"}}><span style={{fontSize:14,fontWeight:700,color:diff>0?"#f87171":"#4ade80"}}>{diff>0?"↑":"↓"} {Math.abs(diffPct)}% {diff>0?"more":"less"} than last month</span></div>)}
      </div>

      {/* Category Pie Chart */}
      {pieData.length>0&&(
        <div className="card" style={{padding:17,marginBottom:13}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>🥧 Category Spending</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent})=>`${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={(v)=>fmt(v)} contentStyle={tooltipStyle}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:"8px 16px",justifyContent:"center",marginTop:8}}>
            {pieData.map((d,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}><div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/><span style={{color:"#94a3b8"}}>{d.name}: </span><span style={{fontWeight:600}}>{fmt(d.value)}</span></div>))}
          </div>
        </div>
      )}

      {/* Weekly Bar Chart */}
      {weekData.length>0&&(
        <div className="card" style={{padding:17,marginBottom:13}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>📊 Weekly Spending</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} margin={{top:5,right:10,left:0,bottom:5}}>
              <XAxis dataKey="week" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`₹${(v/1000).toFixed(0)}k`:`₹${v}`}/>
              <Tooltip formatter={(v)=>fmt(v)} contentStyle={tooltipStyle}/>
              <Bar dataKey="amount" fill="#d4a853" radius={[6,6,0,0]}>
                {weekData.map((_,i)=><Cell key={i} fill={i===weekData.length-1?"#f0c96e":"#d4a853"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cash vs UPI Chart */}
      {(cashSpent>0||upiSpent>0)&&(
        <div className="card" style={{padding:17,marginBottom:13}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>💳 Cash vs UPI Spending</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={pmData} layout="vertical" margin={{top:5,right:30,left:10,bottom:5}}>
              <XAxis type="number" tick={{fill:"#94a3b8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <YAxis dataKey="name" type="category" tick={{fill:"#94a3b8",fontSize:12}} axisLine={false} tickLine={false} width={60}/>
              <Tooltip formatter={(v)=>fmt(v)} contentStyle={tooltipStyle}/>
              <Bar dataKey="value" radius={[0,8,8,0]}>
                {pmData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",justifyContent:"space-around",marginTop:8}}>
            {pmData.map((d,i)=>(<div key={i} style={{textAlign:"center"}}><div style={{fontSize:11,color:"#94a3b8"}}>{d.name}</div><div style={{fontSize:14,fontWeight:700,color:d.color,marginTop:2}}>{fmt(d.value)}</div></div>))}
          </div>
        </div>
      )}

      {/* 6-Month Trend */}
      <div className="card" style={{padding:17}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>📈 6-Month Trend</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={trendData} margin={{top:5,right:10,left:0,bottom:5}}>
            <XAxis dataKey="month" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`₹${(v/1000).toFixed(0)}k`:`₹${v}`}/>
            <Tooltip formatter={(v)=>fmt(v)} contentStyle={tooltipStyle}/>
            <Bar dataKey="amount" radius={[5,5,0,0]}>
              {trendData.map((e,i)=><Cell key={i} fill={e.current?"#f0c96e":"#d4a853"} opacity={e.current?1:.7}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Goals ─────────────────────────────────────
function Goals({goals,updateGoalSaved,deleteGoal,setShowGoalForm,isDark,tc}){
  const [addAmounts,setAddAmounts]=useState({});
  return(
    <div style={{animation:"up .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <p style={{fontSize:13,color:"#94a3b8"}}>Track your savings targets</p>
        <button className="gbtn" onClick={()=>setShowGoalForm(true)} style={{padding:"10px 16px",fontSize:13}}>+ New Goal</button>
      </div>
      {goals.length===0
        ?<div className="card" style={{padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:40,marginBottom:12}}>🎯</div><div style={{fontSize:15,fontWeight:600,marginBottom:6}}>No savings goals yet!</div><div style={{fontSize:13,color:"#94a3b8",marginBottom:20}}>Create a goal and start saving</div><button className="gbtn" onClick={()=>setShowGoalForm(true)} style={{padding:"12px 24px",margin:"0 auto"}}>Create First Goal 🎯</button></div>
        :goals.map(g=>{
          const pct=Math.min((g.saved/g.target)*100,100);const done=pct>=100;
          return(
            <div key={g.id} className="card" style={{padding:18,marginBottom:13,border:done?"1px solid rgba(74,222,128,.3)":undefined}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div><div style={{fontSize:15,fontWeight:700}}>{done?"✅ ":""}{g.name}</div><div style={{fontSize:12,color:"#94a3b8",marginTop:3}}>Target: {fmt(g.target)}</div></div>
                <button onClick={()=>deleteGoal(g.id)} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:18}}>✕</button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"#94a3b8"}}>Saved</span><span style={{fontSize:13,fontWeight:700,color:done?"#4ade80":"#d4a853"}}>{fmt(g.saved)} / {fmt(g.target)}</span></div>
              <div style={{height:10,borderRadius:5,background:isDark?"rgba(255,255,255,.07)":"#f1f5f9",overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",borderRadius:5,width:`${pct}%`,background:done?"linear-gradient(90deg,#4ade80,#22c55e)":"linear-gradient(90deg,#d4a853,#f0c96e)",transition:"width 1s ease"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:done?0:14}}><span style={{fontSize:12,color:done?"#4ade80":"#94a3b8",fontWeight:600}}>{pct.toFixed(0)}% {done?"Complete! 🎉":"complete"}</span>{!done&&<span style={{fontSize:12,color:"#94a3b8"}}>{fmt(g.target-g.saved)} remaining</span>}</div>
              {!done&&(<div style={{display:"flex",gap:8}}><div style={{position:"relative",flex:1}}><span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:14,fontWeight:700}}>₹</span><input className="sw-input" type="number" inputMode="decimal" value={addAmounts[g.id]||""} onChange={e=>setAddAmounts(p=>({...p,[g.id]:e.target.value}))} placeholder="Add amount" style={{paddingLeft:28,fontSize:13,padding:"9px 9px 9px 28px"}}/></div><button className="gbtn" onClick={()=>{if(addAmounts[g.id]&&+addAmounts[g.id]>0){updateGoalSaved(g.id,addAmounts[g.id]);setAddAmounts(p=>({...p,[g.id]:""}))}}} style={{padding:"9px 16px",fontSize:13,flexShrink:0}}>Add</button></div>)}
            </div>
          );
        })}
    </div>
  );
}

// ── Developer Page ────────────────────────────
function Developer({isDark,tc,sc}){
  const skills=["React.js","Supabase","JavaScript","CSS3","Responsive Design","Firebase","Node.js","Git & GitHub"];
  return(
    <div style={{animation:"up .3s ease",padding:"10px 0"}}>
      {/* Profile Card */}
      <div className="card" style={{padding:28,marginBottom:14,textAlign:"center"}}>
        <div style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#d4a853,#f0c96e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 16px",boxShadow:"0 8px 32px rgba(212,168,83,.3)"}}>👨‍💻</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"#d4a853",marginBottom:4}}>Monish Kandanuru</div>
        <div style={{fontSize:13,color:sc,marginBottom:16,letterSpacing:.5}}>Creator of SpendWise Management</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:20,background:"rgba(212,168,83,.1)",border:"1px solid rgba(212,168,83,.25)"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>
          <span style={{fontSize:12,color:"#d4a853",fontWeight:600}}>Full-Stack Developer</span>
        </div>
      </div>

      {/* About */}
      <div className="card" style={{padding:22,marginBottom:14}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>About</div>
        <p style={{fontSize:14,color:tc,lineHeight:1.8}}>
          Built SpendWise Management to help students and individuals track and manage their daily expenses effectively. The goal was to create a simple yet powerful tool that makes financial awareness easy and accessible for everyone.
        </p>
        <div style={{marginTop:16,padding:"14px 16px",borderRadius:13,background:"rgba(212,168,83,.07)",border:"1px solid rgba(212,168,83,.15)"}}>
          <p style={{fontSize:13,color:"#d4a853",fontStyle:"italic",lineHeight:1.8,textAlign:"center"}}>
            "Money should be saved and each penny spent should be tracked so we can easily know where we spent that money on."
          </p>
        </div>
      </div>

      {/* Project Info */}
      <div className="card" style={{padding:22,marginBottom:14}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Project Details</div>
        {[
          ["🏷️","Project","SpendWise Management"],
          ["🎯","Purpose","Student & Personal Expense Tracker"],
          ["🛠️","Tech Stack","React.js + Supabase + Recharts"],
          ["📱","Platform","Web App (PWA — Installable)"],
          ["🔒","Privacy","Each user's data is 100% private"],
          ["🆓","Cost","Completely Free to Use"],
        ].map(([icon,label,value])=>(
          <div key={label} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:isDark?"1px solid rgba(255,255,255,.04)":"1px solid #f1f5f9"}}>
            <span style={{fontSize:18,width:30,flexShrink:0}}>{icon}</span>
            <span style={{fontSize:12,color:sc,width:90,flexShrink:0}}>{label}</span>
            <span style={{fontSize:13,fontWeight:600,color:tc}}>{value}</span>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="card" style={{padding:22,marginBottom:14}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Skills Used</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {skills.map(s=>(<div key={s} style={{padding:"6px 14px",borderRadius:20,background:"rgba(212,168,83,.1)",border:"1px solid rgba(212,168,83,.2)",fontSize:12,fontWeight:600,color:"#d4a853"}}>{s}</div>))}
        </div>
      </div>

      {/* Contact */}
      <div className="card" style={{padding:22}}>
        <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Connect</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["🐙","GitHub","github.com/monishkandanuru"],["📧","Email","monish@spendwise.app"]].map(([icon,label,val])=>(
            <div key={label} style={{padding:"12px 14px",borderRadius:14,background:isDark?"rgba(255,255,255,.03)":"#f8fafc",border:isDark?"1px solid rgba(255,255,255,.06)":"1px solid #e2e8f0"}}>
              <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:11,color:sc,marginBottom:2}}>{label}</div>
              <div style={{fontSize:11,fontWeight:600,color:tc,wordBreak:"break-all"}}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center",padding:"24px 0 8px",color:sc,fontSize:11}}>© {new Date().getFullYear()} SpendWise · Made with ❤️ by Monish Kandanuru</div>
    </div>
  );
}