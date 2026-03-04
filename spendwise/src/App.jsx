import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase config ──────────────────────────────
const SUPABASE_URL  = "https://btlfemlkvzitbzojqopy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bGZlbWxrdnppdGJ6b2pxb3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDU5NjQsImV4cCI6MjA4ODIyMTk2NH0.oYNtp-MfuaN-77VweZLRH0bAUt7P3Ln0q6adWrg5y40";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Constants ─────────────────────────────────────
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
const NAV=[{id:"dashboard",icon:"⬡",label:"Dashboard"},{id:"history",icon:"☰",label:"History"},{id:"analytics",icon:"◎",label:"Analytics"}];

// ── CSS ───────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#080c18;color:#e2e8f0;overflow-x:hidden}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#d4a853;border-radius:2px}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.card{background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.018));border:1px solid rgba(212,168,83,.14);border-radius:18px;backdrop-filter:blur(10px)}
.gbtn{background:linear-gradient(135deg,#d4a853,#f0c96e,#d4a853);background-size:200%;color:#080c18;border:none;border-radius:13px;font-weight:700;cursor:pointer;transition:all .3s;font-family:'DM Sans',sans-serif;font-size:15px;display:flex;align-items:center;justify-content:center;gap:10px}
.gbtn:hover{background-position:100%;transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,168,83,.4)}
.gbtn:active{transform:scale(.97)}
.gbtn:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
.xbtn{background:transparent;border:1px solid rgba(212,168,83,.3);color:#d4a853;border-radius:11px;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.xbtn:hover{background:rgba(212,168,83,.1)}
.chip{cursor:pointer;border-radius:12px;padding:10px 8px;border:2px solid transparent;transition:all .2s;text-align:center;background:rgba(255,255,255,.04)}
.chip:active{transform:scale(.95)}
.chip.sel{border-color:#d4a853;background:rgba(212,168,83,.14)}
.erow:hover .dbtn{opacity:1!important}
.dbtn{opacity:0;transition:opacity .2s}
@media(max-width:639px){.dbtn{opacity:1}}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fade .2s}
@media(min-width:640px){.modal-bg{align-items:center}}
.modal{background:linear-gradient(160deg,#111827,#0d1428);border:1px solid rgba(212,168,83,.22);border-radius:22px 22px 0 0;padding:26px 22px;width:100%;animation:up .28s;max-height:93vh;overflow-y:auto}
@media(min-width:640px){.modal{border-radius:22px;max-width:500px;width:90%}}
.sw-input{font-family:'DM Sans',sans-serif;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;color:#fff;padding:13px 15px;width:100%;font-size:14px;transition:border-color .2s}
.sw-input::placeholder{color:#475569}
.sw-input:focus{outline:none;border-color:rgba(212,168,83,.5)}
.bar{height:8px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden}
.fill{height:100%;border-radius:4px;transition:width 1s ease}
.notif{position:fixed;top:18px;left:50%;transform:translateX(-50%);padding:13px 22px;border-radius:14px;z-index:400;animation:up .3s;font-weight:600;font-size:13px;pointer-events:none;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.5);font-family:'DM Sans',sans-serif}
.bnav{position:fixed;bottom:0;left:0;right:0;background:rgba(6,9,20,.97);backdrop-filter:blur(24px);border-top:1px solid rgba(212,168,83,.1);display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px)}
.bitem{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 0;cursor:pointer;color:#475569;font-size:10px;font-weight:600;transition:color .2s;font-family:'DM Sans',sans-serif}
.bitem.on{color:#d4a853}
.fab{position:fixed;bottom:76px;right:20px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#d4a853,#f0c96e);border:none;cursor:pointer;font-size:30px;color:#080c18;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 28px rgba(212,168,83,.6);z-index:150;transition:transform .2s;line-height:1;font-weight:200}
.fab:active{transform:scale(.9)}
.mscroll{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;-webkit-overflow-scrolling:touch}
.mscroll::-webkit-scrollbar{display:none}
.mbtn{padding:5px 13px;border-radius:20px;font-size:12px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .2s;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#64748b}
.mbtn.on{border-color:#d4a853;background:rgba(212,168,83,.15);color:#d4a853}
.snav{cursor:pointer;padding:10px 16px;border-radius:12px;transition:all .2s;font-weight:500;font-size:13px;display:flex;align-items:center;gap:10px;color:#64748b;margin-bottom:3px;font-family:'DM Sans',sans-serif}
.snav:hover{background:rgba(212,168,83,.08);color:#94a3b8}
.snav.on{background:rgba(212,168,83,.14);color:#d4a853}
.spinner{border:3px solid rgba(212,168,83,.2);border-top-color:#d4a853;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
.live{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;animation:blink 2s infinite;flex-shrink:0}
.authtab{flex:1;padding:12px;text-align:center;cursor:pointer;font-weight:600;font-size:14px;border-bottom:2px solid transparent;transition:all .2s;color:#64748b;font-family:'DM Sans',sans-serif}
.authtab.on{color:#d4a853;border-bottom-color:#d4a853}
`;

// ══════════════════════════════════════════════
//  AUTH SCREEN  (Sign Up / Sign In)
// ══════════════════════════════════════════════
function AuthScreen({ onAuth }) {
  const [tab,      setTab]      = useState("signin"); // signin | signup
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");
  const [msg,      setMsg]      = useState("");

  const handle = async () => {
    setErr(""); setMsg("");
    if (!email || !password) return setErr("Please fill in all fields.");
    if (tab === "signup" && !name) return setErr("Please enter your name.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");
    setLoading(true);
    if (tab === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      });
      if (error) setErr(error.message);
      else setMsg("✅ Account created! Please check your email to confirm, then sign in.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
      else onAuth(data.user);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(135deg,#080c18,#0d1428 60%,#090e1c)"}}>
      <div style={{width:"100%",maxWidth:380,animation:"up .5s ease"}}>

        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:88,height:88,borderRadius:26,background:"rgba(212,168,83,.1)",border:"1px solid rgba(212,168,83,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 18px",boxShadow:"0 0 40px rgba(212,168,83,.1)"}}>💰</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,color:"#d4a853",lineHeight:1}}>Spend<span style={{color:"#fff"}}>Wise</span></div>
          <div style={{fontSize:11,color:"#475569",letterSpacing:2.5,textTransform:"uppercase",marginTop:8}}>Your Personal Money Tracker</div>
        </div>

        <div className="card" style={{padding:"6px",marginBottom:22,display:"flex"}}>
          <div className={`authtab${tab==="signin"?" on":""}`} onClick={()=>{setTab("signin");setErr("");setMsg("");}}>Sign In</div>
          <div className={`authtab${tab==="signup"?" on":""}`} onClick={()=>{setTab("signup");setErr("");setMsg("");}}>Create Account</div>
        </div>

        <div className="card" style={{padding:"22px 20px"}}>
          {tab==="signup" && (
            <>
              <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Your Name</div>
              <input className="sw-input" type="text" value={name} onChange={e=>setName(e.target.value)}
                placeholder="e.g. Monish Kandanuru" style={{marginBottom:16}}/>
            </>
          )}

          <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Email</div>
          <input className="sw-input" type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="your@email.com" style={{marginBottom:16}}/>

          <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Password</div>
          <input className="sw-input" type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Min. 6 characters" style={{marginBottom:22}}
            onKeyDown={e=>e.key==="Enter"&&handle()}/>

          {err && <div style={{fontSize:13,color:"#f87171",background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.2)",borderRadius:10,padding:"10px 14px",marginBottom:16}}>{err}</div>}
          {msg && <div style={{fontSize:13,color:"#4ade80",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.2)",borderRadius:10,padding:"10px 14px",marginBottom:16}}>{msg}</div>}

          <button className="gbtn" onClick={handle} disabled={loading} style={{width:"100%",padding:"16px"}}>
            {loading ? <><div className="spinner" style={{width:20,height:20}}/> Please wait...</> : tab==="signin" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <div className="card" style={{padding:"14px 18px",marginTop:16,display:"flex",alignItems:"flex-start",gap:12}}>
          <span style={{fontSize:20,flexShrink:0}}>🔒</span>
          <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>
            Your expenses are <strong style={{color:"#94a3b8"}}>completely private</strong>. Nobody else can see your data — not even other users of this app.
          </div>
        </div>

        <p style={{textAlign:"center",fontSize:11,color:"#334155",marginTop:14,lineHeight:1.7}}>
          Free forever · No credit card needed
        </p>
      </div>

      <footer style={{marginTop:40,textAlign:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:"#d4a853",letterSpacing:1}}>MONISH KANDANURU</div>
        <div style={{fontSize:11,color:"#334155",fontStyle:"italic",marginTop:5,lineHeight:1.7,maxWidth:300}}>
          "Money should be saved and each penny spent should be tracked."
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════
export default function SpendWise() {
  const [user,        setUser]        = useState(null);
  const [authReady,   setAuthReady]   = useState(false);
  const [entries,     setEntries]     = useState([]);
  const [budget,      setBudget]      = useState(10000);
  const [view,        setView]        = useState("dashboard");
  const [showAdd,     setShowAdd]     = useState(false);
  const [showBudget,  setShowBudget]  = useState(false);
  const [form,        setForm]        = useState({amount:"",category:"",note:"",date:toISO()});
  const [budgetInput, setBudgetInput] = useState("");
  const [selMonth,    setSelMonth]    = useState(new Date().getMonth());
  const [notif,       setNotif]       = useState(null);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 640);
  const amtRef  = useRef();
  const selYear = new Date().getFullYear();

  useEffect(()=>{
    const h=()=>setIsMobile(window.innerWidth<640);
    window.addEventListener("resize",h);
    return()=>window.removeEventListener("resize",h);
  },[]);

  // Check if already logged in
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user ?? null);
    });
    return()=>subscription.unsubscribe();
  },[]);

  // Load THIS user's private expenses (real-time)
  useEffect(()=>{
    if(!user) { setEntries([]); return; }
    const fetch = async()=>{
      const {data} = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {ascending:false});
      if(data) setEntries(data);
    };
    fetch();
    // Real-time subscription
    const sub = supabase
      .channel("expenses")
      .on("postgres_changes",{event:"*",schema:"public",table:"expenses",filter:`user_id=eq.${user.id}`},fetch)
      .subscribe();
    return()=>supabase.removeChannel(sub);
  },[user]);

  // Load THIS user's private budget (real-time)
  useEffect(()=>{
    if(!user) return;
    const fetch = async()=>{
      const {data} = await supabase
        .from("budgets")
        .select("amount")
        .eq("user_id", user.id)
        .single();
      if(data) setBudget(data.amount);
    };
    fetch();
    const sub = supabase
      .channel("budgets")
      .on("postgres_changes",{event:"*",schema:"public",table:"budgets",filter:`user_id=eq.${user.id}`},fetch)
      .subscribe();
    return()=>supabase.removeChannel(sub);
  },[user]);

  const toast=(msg,type="ok")=>{setNotif({msg,type});setTimeout(()=>setNotif(null),2500);};

  const doLogout=async()=>{
    await supabase.auth.signOut();
    setEntries([]);
    setBudget(10000);
  };

  const addEntry=async()=>{
    if(!form.amount||isNaN(form.amount)||+form.amount<=0) return toast("Enter a valid amount","err");
    if(!form.category) return toast("Pick a category","err");
    const {error} = await supabase.from("expenses").insert({
      user_id:user.id, amount:+form.amount,
      category:form.category, note:form.note, date:form.date
    });
    if(error) return toast("Failed to save. Try again.","err");
    setForm({amount:"",category:"",note:"",date:toISO()});
    setShowAdd(false);
    toast("Expense added! ✓");
  };

  const delEntry=async(id)=>{
    const {error} = await supabase.from("expenses").delete().eq("id",id).eq("user_id",user.id);
    if(error) return toast("Failed to delete","err");
    toast("Removed","info");
  };

  const saveBudget=async()=>{
    if(!budgetInput||+budgetInput<=0) return;
    await supabase.from("budgets").upsert({user_id:user.id, amount:+budgetInput},{onConflict:"user_id"});
    setBudgetInput(""); setShowBudget(false); toast("Budget updated!");
  };

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
  const weeks={};
  mEntries.forEach(e=>{const w=getWeek(e.date);if(!weeks[w])weeks[w]={total:0,count:0};weeks[w].total+=e.amount;weeks[w].count++;});

  // Loading
  if(!authReady) return(
    <div style={{minHeight:"100vh",background:"#080c18",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <style>{CSS}</style>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#d4a853"}}>Spend<span style={{color:"#fff"}}>Wise</span></div>
      <div className="spinner" style={{width:36,height:36}}/>
    </div>
  );

  if(!user) return(<><style>{CSS}</style><AuthScreen onAuth={setUser}/></>);

  const MonthRow=()=>(
    <div className="mscroll">
      {MONTHS.map((m,i)=>(
        <button key={m} className={`mbtn${selMonth===i?" on":""}`} onClick={()=>setSelMonth(i)}>{m}</button>
      ))}
    </div>
  );

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userInitial = userName[0].toUpperCase();

  const sharedProps = {mTotal,diff,diffPct,pMonth,budPct,budget,todayTot,todayCnt,catBreak,entries,del:delEntry,mEntries,pEntries,pTotal,weeks,selMonth,selYear,pYear,isMobile};

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"linear-gradient(135deg,#080c18,#0d1428 60%,#090e1c)",color:"#e2e8f0",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{CSS}</style>

      {notif&&<div className="notif" style={{background:notif.type==="err"?"linear-gradient(135deg,#7f1d1d,#991b1b)":notif.type==="info"?"linear-gradient(135deg,#1e3a5f,#1e40af)":"linear-gradient(135deg,#14532d,#166534)",border:`1px solid ${notif.type==="err"?"#ef4444":notif.type==="info"?"#3b82f6":"#22c55e"}`,color:"#fff"}}>{notif.msg}</div>}

      {/* Add Modal */}
      {showAdd&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal">
            <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853"}}>Add Expense</h2>
              <button onClick={()=>setShowAdd(false)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:26,lineHeight:1}}>×</button>
            </div>
            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Amount (₹)</div>
            <div style={{position:"relative",marginBottom:16}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:18,fontWeight:700}}>₹</span>
              <input ref={amtRef} className="sw-input" type="number" inputMode="decimal" value={form.amount}
                onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.00"
                style={{paddingLeft:36,fontSize:22,fontWeight:700,borderColor:"rgba(212,168,83,.25)"}}/>
            </div>
            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:10}}>Category</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
              {CATS.map(c=>(
                <div key={c.id} className={`chip${form.category===c.id?" sel":""}`}
                  style={{background:form.category===c.id?`${c.color}22`:"rgba(255,255,255,.04)"}}
                  onClick={()=>setForm({...form,category:c.id})}>
                  <div style={{fontSize:19}}>{c.icon}</div>
                  <div style={{fontSize:9,color:form.category===c.id?c.color:"#64748b",marginTop:3,fontWeight:600}}>{c.label.split(" ")[0]}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Note (optional)</div>
            <input className="sw-input" type="text" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="What was this for?" style={{marginBottom:14}}/>
            <div style={{fontSize:11,color:"#64748b",letterSpacing:1.4,textTransform:"uppercase",marginBottom:8}}>Date</div>
            <input className="sw-input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{marginBottom:22,colorScheme:"dark"}}/>
            <button className="gbtn" onClick={addEntry} style={{width:"100%",padding:"15px"}}>+ Add Expense</button>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudget&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowBudget(false)}>
          <div className="modal" style={{maxWidth:isMobile?"100%":380}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853",marginBottom:6}}>Monthly Budget</h2>
            <p style={{fontSize:13,color:"#475569",marginBottom:18}}>Current: {fmt(budget)}</p>
            <div style={{position:"relative",marginBottom:20}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#d4a853",fontSize:18,fontWeight:700}}>₹</span>
              <input className="sw-input" type="number" inputMode="decimal" value={budgetInput}
                onChange={e=>setBudgetInput(e.target.value)} placeholder={String(budget)}
                style={{paddingLeft:36,fontSize:22,fontWeight:700,borderColor:"rgba(212,168,83,.25)"}}/>
            </div>
            <button className="gbtn" style={{width:"100%",padding:"14px"}} onClick={saveBudget}>Save Budget</button>
          </div>
        </div>
      )}

      {/* ══ DESKTOP ══ */}
      {!isMobile&&(
        <div style={{display:"flex",flex:1}}>
          <div style={{width:218,padding:"26px 14px",background:"rgba(0,0,0,.4)",borderRight:"1px solid rgba(212,168,83,.08)",display:"flex",flexDirection:"column",flexShrink:0}}>
            <div style={{paddingLeft:6,marginBottom:26}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:21,color:"#d4a853"}}>Spend<span style={{color:"#fff"}}>Wise</span></div>
              <div style={{fontSize:10,color:"#334155",letterSpacing:2,textTransform:"uppercase",marginTop:3}}>Money Tracker</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",marginBottom:20}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#d4a853,#f0c96e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#080c18",flexShrink:0}}>{userInitial}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{userName}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                  <div className="live"/><span style={{fontSize:10,color:"#4ade80"}}>Live sync</span>
                </div>
              </div>
            </div>
            {NAV.map(n=>(
              <div key={n.id} className={`snav${view===n.id?" on":""}`} onClick={()=>setView(n.id)}>
                <span style={{fontSize:15}}>{n.icon}</span>{n.label}
              </div>
            ))}
            <div style={{flex:1}}/>
            <button className="xbtn" onClick={()=>setShowBudget(true)} style={{padding:"8px 13px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span>⚙</span> Set Budget
            </button>
            <button onClick={doLogout} style={{padding:"8px 13px",fontSize:13,width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:8,background:"transparent",border:"1px solid rgba(248,113,113,.3)",color:"#f87171",borderRadius:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              <span>↩</span> Sign Out
            </button>
          </div>
          <div style={{flex:1,padding:"26px 30px",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:25}}>{view==="dashboard"?"Dashboard":view==="history"?"Expense History":"Analytics"}</h1>
                <p style={{color:"#475569",fontSize:12,marginTop:3}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
              </div>
              <button className="gbtn" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}} style={{padding:"12px 22px"}}>
                <span style={{fontSize:18,fontWeight:200,lineHeight:1}}>+</span> Add Expense
              </button>
            </div>
            <div style={{marginBottom:20}}><MonthRow/></div>
            {view==="dashboard"&&<Dashboard {...sharedProps}/>}
            {view==="history"  &&<History   {...sharedProps}/>}
            {view==="analytics"&&<Analytics {...sharedProps}/>}
            <AppFooter/>
          </div>
        </div>
      )}

      {/* ══ MOBILE ══ */}
      {isMobile&&(
        <div style={{display:"flex",flexDirection:"column",flex:1,paddingBottom:130}}>
          <div style={{padding:"13px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.05)",background:"rgba(0,0,0,.3)",position:"sticky",top:0,zIndex:50}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#d4a853"}}>Spend<span style={{color:"#fff"}}>Wise</span></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}><div className="live"/><span style={{fontSize:10,color:"#4ade80",fontWeight:600}}>Live</span></div>
              <div onClick={doLogout} title="Tap to sign out" style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#d4a853,#f0c96e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#080c18",cursor:"pointer"}}>{userInitial}</div>
            </div>
          </div>
          <div style={{padding:"12px 16px 8px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:21}}>{view==="dashboard"?"Dashboard":view==="history"?"History":"Analytics"}</h1>
              <button className="xbtn" onClick={()=>setShowBudget(true)} style={{padding:"6px 11px",fontSize:12}}>⚙ Budget</button>
            </div>
            <MonthRow/>
          </div>
          <div style={{flex:1,padding:"4px 16px 0",overflowY:"auto"}}>
            {view==="dashboard"&&<Dashboard {...sharedProps}/>}
            {view==="history"  &&<History   {...sharedProps}/>}
            {view==="analytics"&&<Analytics {...sharedProps}/>}
            <AppFooter mobile/>
          </div>
          <button className="fab" onClick={()=>{setShowAdd(true);setTimeout(()=>amtRef.current?.focus(),80)}}>+</button>
          <div className="bnav">
            {NAV.map(n=>(
              <div key={n.id} className={`bitem${view===n.id?" on":""}`} onClick={()=>setView(n.id)}>
                <span style={{fontSize:21}}>{n.icon}</span><span>{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SC({label,value,valueColor,sub,subColor,delay,span}){
  return(
    <div className="card" style={{padding:17,animation:`up .4s ease ${delay||0}s both`,gridColumn:span?"1/-1":"auto"}}>
      <div style={{fontSize:10,color:"#475569",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{fontSize:21,fontWeight:700,fontFamily:"'Playfair Display',serif",color:valueColor||"#fff",lineHeight:1.1}}>{value}</div>
      <div style={{fontSize:11,marginTop:7,color:subColor||"#64748b",fontWeight:500}}>{sub}</div>
    </div>
  );
}

function Dashboard({mTotal,diff,diffPct,pMonth,budPct,budget,todayTot,todayCnt,catBreak,entries,del,isMobile}){
  return(
    <div style={{animation:"up .3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:13}}>
        <SC span label="Monthly Total" value={fmt(mTotal)} valueColor="#fff"
          sub={diffPct?`${diff>0?"↑":"↓"} ${Math.abs(diffPct)}% vs ${MONTHS[pMonth]}`:"No previous data"}
          subColor={diff>0?"#f87171":"#4ade80"} delay={0}/>
        <SC label="Today" value={fmt(todayTot)} valueColor="#d4a853"
          sub={`${todayCnt} transaction${todayCnt!==1?"s":""}`} subColor="#64748b" delay={.1}/>
        <SC label="Budget Left" value={fmt(Math.abs(budget-mTotal))}
          valueColor={(budget-mTotal)<0?"#f87171":"#4ade80"}
          sub={(budget-mTotal)<0?"⚠ Over budget!":fmt(budget)+" limit"}
          subColor={(budget-mTotal)<0?"#f87171":"#4ade80"} delay={.2}/>
      </div>
      <div className="card" style={{padding:17,marginBottom:13}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
          <span style={{fontSize:13,fontWeight:600}}>Budget Usage</span>
          <span style={{fontSize:13,fontWeight:700,color:budPct>90?"#f87171":"#d4a853"}}>{budPct.toFixed(1)}%</span>
        </div>
        <div className="bar"><div className="fill" style={{width:`${budPct}%`,background:budPct>90?"linear-gradient(90deg,#f87171,#ef4444)":"linear-gradient(90deg,#d4a853,#f0c96e)"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:7,fontSize:11,color:"#475569"}}>
          <span>Spent {fmt(mTotal)}</span><span>Limit {fmt(budget)}</span>
        </div>
      </div>
      {catBreak.length>0&&(
        <div className="card" style={{padding:17,marginBottom:13}}>
          <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Category Breakdown</div>
          {catBreak.map(c=>(
            <div key={c.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13,fontWeight:500}}>{c.icon} {c.label}</span>
                <span style={{fontSize:13,fontWeight:700,color:c.color}}>{fmt(c.total)}</span>
              </div>
              <div className="bar"><div className="fill" style={{width:`${(c.total/mTotal*100).toFixed(1)}%`,background:`linear-gradient(90deg,${c.color}66,${c.color})`}}/></div>
            </div>
          ))}
        </div>
      )}
      <div className="card" style={{padding:17}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Recent Transactions</div>
        {entries.length===0
          ?<div style={{textAlign:"center",padding:"28px 0",color:"#334155"}}><div style={{fontSize:34,marginBottom:10}}>💸</div><div style={{fontSize:13}}>No transactions yet!</div></div>
          :entries.slice(0,8).map(e=>{
            const cat=CATS.find(c=>c.id===e.category);
            return(
              <div key={e.id} className="erow" style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{width:38,height:38,borderRadius:11,background:`${cat?.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,marginRight:11,flexShrink:0}}>{cat?.icon||"📦"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note||cat?.label||"Expense"}</div>
                  <div style={{fontSize:10,color:"#475569",marginTop:2}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})} · {cat?.label}</div>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:"#f87171",marginRight:9,flexShrink:0}}>-{fmt(e.amount)}</span>
                <button className="dbtn xbtn" onClick={()=>del(e.id)} style={{padding:"3px 8px",fontSize:11,color:"#f87171",borderColor:"rgba(248,113,113,.3)",flexShrink:0,opacity:1}}>✕</button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function History({mEntries,weeks,selMonth,selYear,del}){
  return(
    <div style={{animation:"up .3s ease"}}>
      <div className="card" style={{padding:17,marginBottom:13}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Weekly — {MONTHS[selMonth]} {selYear}</div>
        {Object.keys(weeks).length===0
          ?<div style={{color:"#475569",fontSize:13,padding:"12px 0"}}>No data for this month.</div>
          :Object.entries(weeks).sort((a,b)=>+a[0]-+b[0]).map(([w,d])=>(
            <div key={w} style={{borderLeft:"3px solid rgba(212,168,83,.3)",paddingLeft:13,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Week {w}</span>
                <span style={{fontSize:14,fontWeight:700,color:"#d4a853"}}>{fmt(d.total)}</span>
              </div>
              <div style={{fontSize:11,color:"#475569",marginTop:2}}>{d.count} transaction{d.count!==1?"s":""}</div>
            </div>
          ))}
      </div>
      <div className="card" style={{padding:17}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>All — {MONTHS[selMonth]} {selYear}</div>
        {mEntries.length===0
          ?<div style={{textAlign:"center",padding:"28px 0",color:"#334155"}}><div style={{fontSize:32,marginBottom:10}}>📅</div><div style={{fontSize:13}}>No entries for {MONTHS[selMonth]} {selYear}</div></div>
          :mEntries.map(e=>{
            const cat=CATS.find(c=>c.id===e.category);
            return(
              <div key={e.id} className="erow" style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{width:38,height:38,borderRadius:11,background:`${cat?.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,marginRight:11,flexShrink:0}}>{cat?.icon||"📦"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.note||cat?.label}</div>
                  <div style={{fontSize:10,color:"#475569",marginTop:2}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                </div>
                <div style={{textAlign:"right",marginRight:9,flexShrink:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#f87171"}}>-{fmt(e.amount)}</div>
                  <div style={{fontSize:10,color:cat?.color,marginTop:1}}>{cat?.label}</div>
                </div>
                <button className="dbtn xbtn" onClick={()=>del(e.id)} style={{padding:"3px 8px",fontSize:11,color:"#f87171",borderColor:"rgba(248,113,113,.3)",flexShrink:0,opacity:1}}>✕</button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function Analytics({mTotal,mEntries,pTotal,pEntries,diff,diffPct,catBreak,selMonth,selYear,pMonth,pYear,entries}){
  return(
    <div style={{animation:"up .3s ease"}}>
      <div className="card" style={{padding:17,marginBottom:13}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>Month Comparison</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          {[{label:`${MONTHS[selMonth]} ${selYear}`,total:mTotal,cnt:mEntries.length,col:"#d4a853"},
            {label:`${MONTHS[pMonth]} ${pYear}`,total:pTotal,cnt:pEntries.length,col:"#64748b"}].map((x,i)=>(
            <div key={i} style={{padding:14,background:"rgba(255,255,255,.03)",borderRadius:14}}>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{x.label}</div>
              <div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',serif",color:x.col,lineHeight:1}}>{fmt(x.total)}</div>
              <div style={{fontSize:11,color:"#475569",marginTop:5}}>{x.cnt} transactions</div>
            </div>
          ))}
        </div>
        {diffPct!==null&&(
          <div style={{marginTop:14,padding:13,borderRadius:13,background:diff>0?"rgba(248,113,113,.08)":"rgba(74,222,128,.08)",border:`1px solid ${diff>0?"rgba(248,113,113,.2)":"rgba(74,222,128,.2)"}`,textAlign:"center"}}>
            <span style={{fontSize:14,fontWeight:700,color:diff>0?"#f87171":"#4ade80"}}>{diff>0?"↑":"↓"} {Math.abs(diffPct)}% {diff>0?"more":"less"} than last month</span>
            <div style={{fontSize:11,color:"#64748b",marginTop:3}}>Difference: {fmt(Math.abs(diff))}</div>
          </div>
        )}
      </div>
      {catBreak.length>0&&(
        <div className="card" style={{padding:17,marginBottom:13}}>
          <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>By Category</div>
          {catBreak.map(c=>(
            <div key={c.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13}}>{c.icon} {c.label}</span>
                <span style={{fontSize:13,fontWeight:700,color:c.color}}>{fmt(c.total)} <span style={{color:"#475569",fontWeight:400}}>({(c.total/mTotal*100).toFixed(0)}%)</span></span>
              </div>
              <div className="bar" style={{height:9}}><div className="fill" style={{width:`${(c.total/mTotal*100).toFixed(1)}%`,background:`linear-gradient(90deg,${c.color}55,${c.color})`}}/></div>
            </div>
          ))}
        </div>
      )}
      <div className="card" style={{padding:17}}>
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1.5,textTransform:"uppercase",marginBottom:13}}>6-Month Trend</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:7,height:100}}>
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
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{fontSize:9,color:"#64748b",fontWeight:600}}>{x.t>0?"₹"+Math.round(x.t/1000)+"k":""}</div>
                <div style={{width:"100%",height:`${h}%`,borderRadius:"4px 4px 3px 3px",background:cur?"linear-gradient(180deg,#d4a853,#f0c96e)":"rgba(255,255,255,.07)",border:cur?"1px solid rgba(212,168,83,.4)":"none",transition:"all .6s"}}/>
                <div style={{fontSize:9,color:cur?"#d4a853":"#475569",fontWeight:cur?700:400}}>{MONTHS[x.m]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AppFooter({mobile}){
  return(
    <footer style={{borderTop:"1px solid rgba(212,168,83,.1)",background:"rgba(0,0,0,.4)",padding:mobile?"20px 0 18px":"22px 0",textAlign:"center",marginTop:28}}>
      <div style={{display:"inline-flex",alignItems:"center",padding:"4px 14px",borderRadius:20,background:"rgba(212,168,83,.07)",border:"1px solid rgba(212,168,83,.16)",marginBottom:9}}>
        <span style={{fontSize:10,color:"#d4a853",letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>Created by</span>
      </div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#fff",letterSpacing:1.5,marginBottom:9}}>MONISH KANDANURU</div>
      <p style={{fontSize:11,color:"#475569",maxWidth:340,margin:"0 auto",lineHeight:1.8,fontStyle:"italic",padding:"0 20px"}}>
        "Money should be saved and each penny spent should be tracked so we can easily know where did we spend that money on."
      </p>
      <div style={{marginTop:12,fontSize:10,color:"#1e293b"}}>© {new Date().getFullYear()} SpendWise · All rights reserved</div>
    </footer>
  );
}