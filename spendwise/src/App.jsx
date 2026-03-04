import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "food",          label: "Food & Dining",   icon: "🍽️", color: "#FF6B6B" },
  { id: "transport",     label: "Transport",        icon: "🚗", color: "#4ECDC4" },
  { id: "clothing",      label: "Clothing",         icon: "👗", color: "#A78BFA" },
  { id: "education",     label: "Education",        icon: "📚", color: "#60A5FA" },
  { id: "health",        label: "Health",           icon: "💊", color: "#34D399" },
  { id: "entertainment", label: "Entertainment",    icon: "🎬", color: "#FBBF24" },
  { id: "utilities",     label: "Utilities",        icon: "💡", color: "#FB923C" },
  { id: "other",         label: "Other",            icon: "📦", color: "#94A3B8" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = n => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function getWeek(dateStr) {
  const d = new Date(dateStr), day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const y = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - y) / 86400000) + 1) / 7);
}

const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "history",   icon: "☰", label: "History"   },
  { id: "analytics", icon: "◎", label: "Analytics" },
];

export default function SpendWise() {
  const [entries, setEntries] = useState([]);
  const [budget,  setBudget]  = useState(10000);
  const [view,    setView]    = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [form, setForm] = useState({ amount: "", category: "", note: "", date: new Date().toISOString().split("T")[0] });
  const [budgetInput, setBudgetInput] = useState("");
  const [selMonth, setSelMonth] = useState(new Date().getMonth());
  const selYear = new Date().getFullYear();
  const [notif, setNotif] = useState(null);
  const amtRef = useRef();

  const toast = (msg, type = "ok") => { setNotif({ msg, type }); setTimeout(() => setNotif(null), 2600); };

  const addEntry = () => {
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return toast("Enter a valid amount", "err");
    if (!form.category) return toast("Pick a category", "err");
    setEntries(p => [{ id: Date.now(), ...form, amount: +form.amount }, ...p]);
    setForm({ amount: "", category: "", note: "", date: new Date().toISOString().split("T")[0] });
    setShowAdd(false);
    toast("Expense added! ✓");
  };

  const del = id => { setEntries(p => p.filter(e => e.id !== id)); toast("Removed", "info"); };

  const mEntries = entries.filter(e => { const d = new Date(e.date); return d.getMonth() === selMonth && d.getFullYear() === selYear; });
  const mTotal   = mEntries.reduce((s, e) => s + e.amount, 0);
  const pMonth   = selMonth === 0 ? 11 : selMonth - 1;
  const pYear    = selMonth === 0 ? selYear - 1 : selYear;
  const pEntries = entries.filter(e => { const d = new Date(e.date); return d.getMonth() === pMonth && d.getFullYear() === pYear; });
  const pTotal   = pEntries.reduce((s, e) => s + e.amount, 0);
  const diff     = mTotal - pTotal;
  const diffPct  = pTotal > 0 ? ((diff / pTotal) * 100).toFixed(1) : null;
  const budPct   = Math.min((mTotal / budget) * 100, 100);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTot = entries.filter(e => e.date === todayStr).reduce((s, e) => s + e.amount, 0);
  const todayCnt = entries.filter(e => e.date === todayStr).length;
  const catBreak = CATEGORIES.map(c => ({ ...c, total: mEntries.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0) })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const weeks    = {};
  mEntries.forEach(e => { const w = getWeek(e.date); if (!weeks[w]) weeks[w] = { total: 0, count: 0 }; weeks[w].total += e.amount; weeks[w].count++; });

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"linear-gradient(135deg,#080c18 0%,#0d1428 60%,#090e1c 100%)", fontFamily:"'DM Sans',sans-serif", color:"#e2e8f0", overflowX:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d4a853;border-radius:2px}
        @keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fade{from{opacity:0}to{opacity:1}}
        .card{background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.018));border:1px solid rgba(212,168,83,.13);border-radius:20px;backdrop-filter:blur(10px)}
        .gbtn{background:linear-gradient(135deg,#d4a853,#f0c96e,#d4a853);background-size:200% 100%;color:#080c18;border:none;border-radius:13px;font-weight:700;cursor:pointer;transition:all .3s;font-family:'DM Sans',sans-serif}
        .gbtn:hover{background-position:100% 0;transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,168,83,.4)}
        .xbtn{background:transparent;border:1px solid rgba(212,168,83,.28);color:#d4a853;border-radius:11px;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
        .xbtn:hover{background:rgba(212,168,83,.1);border-color:#d4a853}
        .nav{cursor:pointer;padding:10px 16px;border-radius:12px;transition:all .2s;font-weight:500;font-size:13.5px;display:flex;align-items:center;gap:11px;color:#64748b;margin-bottom:3px}
        .nav:hover{background:rgba(212,168,83,.08);color:#94a3b8}
        .nav.on{background:rgba(212,168,83,.14);color:#d4a853}
        .chip{cursor:pointer;border-radius:12px;padding:11px 10px;border:2px solid transparent;transition:all .2s;text-align:center;background:rgba(255,255,255,.04)}
        .chip:hover{transform:translateY(-2px)}
        .chip.sel{border-color:#d4a853;background:rgba(212,168,83,.14)}
        .row:hover .dbtn{opacity:1!important}
        .dbtn{opacity:0!important;transition:opacity .2s!important}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(7px);z-index:50;display:flex;align-items:center;justify-content:center;animation:fade .18s}
        .modal{background:linear-gradient(135deg,#111827,#0d1428);border:1px solid rgba(212,168,83,.22);border-radius:22px;padding:30px;width:92%;max-width:460px;animation:up .25s;max-height:90vh;overflow-y:auto}
        input:focus{outline:none;border-color:rgba(212,168,83,.5)!important}
        .bar{height:8px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden}
        .fill{height:100%;border-radius:4px;transition:width .9s ease}
        .notif{position:fixed;top:18px;right:18px;padding:13px 20px;border-radius:13px;z-index:200;animation:up .28s;font-weight:600;font-size:13.5px;pointer-events:none}
      `}</style>

      {/* Toast */}
      {notif && <div className="notif" style={{ background:notif.type==="err"?"linear-gradient(135deg,#7f1d1d,#991b1b)":notif.type==="info"?"linear-gradient(135deg,#1e3a5f,#1e40af)":"linear-gradient(135deg,#14532d,#166534)", border:`1px solid ${notif.type==="err"?"#ef4444":notif.type==="info"?"#3b82f6":"#22c55e"}`, color:"#fff" }}>{notif.msg}</div>}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:21, color:"#d4a853" }}>Add Expense</h2>
              <button onClick={() => setShowAdd(false)} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:24, lineHeight:1 }}>×</button>
            </div>
            <label style={{ fontSize:11, color:"#64748b", letterSpacing:1.4, textTransform:"uppercase" }}>Amount (₹)</label>
            <div style={{ position:"relative", margin:"8px 0 18px" }}>
              <span style={{ position:"absolute", left:15, top:"50%", transform:"translateY(-50%)", color:"#d4a853", fontSize:19, fontWeight:700 }}>₹</span>
              <input ref={amtRef} type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00"
                style={{ width:"100%", padding:"15px 15px 15px 38px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(212,168,83,.2)", borderRadius:13, color:"#fff", fontSize:23, fontWeight:700 }}/>
            </div>
            <label style={{ fontSize:11, color:"#64748b", letterSpacing:1.4, textTransform:"uppercase" }}>Category</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9, margin:"10px 0 18px" }}>
              {CATEGORIES.map(c => (
                <div key={c.id} className={`chip${form.category === c.id ? " sel" : ""}`} style={{ background: form.category === c.id ? `${c.color}20` : "rgba(255,255,255,.04)" }} onClick={() => setForm({ ...form, category: c.id })}>
                  <div style={{ fontSize:21 }}>{c.icon}</div>
                  <div style={{ fontSize:10, color: form.category === c.id ? c.color : "#64748b", marginTop:4, fontWeight:500 }}>{c.label.split(" ")[0]}</div>
                </div>
              ))}
            </div>
            <label style={{ fontSize:11, color:"#64748b", letterSpacing:1.4, textTransform:"uppercase" }}>Note (optional)</label>
            <input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="What was it for?"
              style={{ width:"100%", margin:"8px 0 16px", padding:"12px 15px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, color:"#fff", fontSize:14 }}/>
            <label style={{ fontSize:11, color:"#64748b", letterSpacing:1.4, textTransform:"uppercase" }}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              style={{ width:"100%", margin:"8px 0 22px", padding:"12px 15px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, color:"#fff", fontSize:14, colorScheme:"dark" }}/>
            <button className="gbtn" onClick={addEntry} style={{ width:"100%", padding:"15px", fontSize:15 }}>+ Add Expense</button>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudget && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowBudget(false)}>
          <div className="modal" style={{ maxWidth:340 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:19, color:"#d4a853", marginBottom:20 }}>Set Monthly Budget</h2>
            <div style={{ position:"relative", marginBottom:20 }}>
              <span style={{ position:"absolute", left:15, top:"50%", transform:"translateY(-50%)", color:"#d4a853", fontSize:19, fontWeight:700 }}>₹</span>
              <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} placeholder={budget}
                style={{ width:"100%", padding:"15px 15px 15px 38px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(212,168,83,.22)", borderRadius:13, color:"#fff", fontSize:22, fontWeight:700 }}/>
            </div>
            <button className="gbtn" style={{ width:"100%", padding:"13px", fontSize:15 }} onClick={() => { if (budgetInput && +budgetInput > 0) { setBudget(+budgetInput); setBudgetInput(""); setShowBudget(false); toast("Budget updated!"); } }}>Save Budget</button>
          </div>
        </div>
      )}

      {/* ── LAYOUT: sidebar + main ── */}
      <div style={{ display:"flex", flex:1 }}>

        {/* Sidebar */}
        <div style={{ width:210, padding:"28px 14px", background:"rgba(0,0,0,.35)", borderRight:"1px solid rgba(212,168,83,.09)", display:"flex", flexDirection:"column" }}>
          <div style={{ paddingLeft:6, marginBottom:36 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, color:"#d4a853" }}>Spend<span style={{ color:"#fff" }}>Wise</span></div>
            <div style={{ fontSize:10, color:"#334155", letterSpacing:2, textTransform:"uppercase", marginTop:3 }}>Money Tracker</div>
          </div>
          {NAV.map(n => (
            <div key={n.id} className={`nav${view === n.id ? " on" : ""}`} onClick={() => setView(n.id)}>
              <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
            </div>
          ))}
          <div style={{ flex:1 }}/>
          <button className="xbtn" onClick={() => setShowBudget(true)} style={{ padding:"9px 13px", fontSize:13, width:"100%", textAlign:"left", display:"flex", alignItems:"center", gap:8 }}>
            <span>⚙</span> Set Budget
          </button>
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:"28px 30px", overflowY:"auto" }}>

          {/* Page header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26 }}>{view === "dashboard" ? "Dashboard" : view === "history" ? "Expense History" : "Analytics"}</h1>
              <p style={{ color:"#475569", fontSize:12, marginTop:3 }}>{new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
            </div>
            <button className="gbtn" onClick={() => { setShowAdd(true); setTimeout(() => amtRef.current?.focus(), 80); }} style={{ padding:"12px 22px", fontSize:13.5, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:17, fontWeight:300 }}>+</span> Add Expense
            </button>
          </div>

          {/* Month selector */}
          <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" }}>
            {MONTHS.map((m, i) => (
              <button key={m} onClick={() => setSelMonth(i)} style={{ padding:"5px 13px", borderRadius:20, border: selMonth === i ? "1px solid #d4a853" : "1px solid rgba(255,255,255,.06)", background: selMonth === i ? "rgba(212,168,83,.14)" : "rgba(255,255,255,.03)", color: selMonth === i ? "#d4a853" : "#64748b", cursor:"pointer", fontSize:12, fontWeight:500, fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}>
                {m}
              </button>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {view === "dashboard" && (
            <div style={{ animation:"up .35s ease" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:18 }}>
                {[
                  { label:"Monthly Total", val:fmt(mTotal),              sub: diffPct ? `${diff>0?"↑":"↓"} ${Math.abs(diffPct)}% vs ${MONTHS[pMonth]}` : "No prev data", sc: diff>0?"#f87171":"#4ade80", vc:"#fff" },
                  { label:"Today",         val:fmt(todayTot),            sub:`${todayCnt} transaction${todayCnt!==1?"s":""}`,                                                                                    sc:"#64748b",  vc:"#d4a853" },
                  { label:"Budget Left",   val:fmt(Math.abs(budget-mTotal)), sub:(budget-mTotal)<0?"Over budget!":fmt(budget)+" limit",                                                                          sc:(budget-mTotal)<0?"#f87171":"#4ade80", vc:(budget-mTotal)<0?"#f87171":"#4ade80" },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ padding:22, animation:`up .4s ease ${i*.1}s both` }}>
                    <div style={{ fontSize:10, color:"#475569", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{s.label}</div>
                    <div style={{ fontSize:26, fontWeight:700, fontFamily:"'Playfair Display',serif", color:s.vc }}>{s.val}</div>
                    <div style={{ fontSize:11, marginTop:7, color:s.sc, fontWeight:500 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding:22, marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>Budget Usage</span>
                  <span style={{ fontSize:13, fontWeight:700, color: budPct>90?"#f87171":"#d4a853" }}>{budPct.toFixed(1)}%</span>
                </div>
                <div className="bar"><div className="fill" style={{ width:`${budPct}%`, background: budPct>90?"linear-gradient(90deg,#f87171,#ef4444)":"linear-gradient(90deg,#d4a853,#f0c96e)" }}/></div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:7, fontSize:11, color:"#475569" }}>
                  <span>Spent {fmt(mTotal)}</span><span>Limit {fmt(budget)}</span>
                </div>
              </div>

              {catBreak.length > 0 && (
                <div className="card" style={{ padding:22, marginBottom:18 }}>
                  <div style={{ fontSize:11, color:"#64748b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Category Breakdown</div>
                  {catBreak.map(c => (
                    <div key={c.id} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:13, fontWeight:500 }}>{c.icon} {c.label}</span>
                        <span style={{ fontSize:13, fontWeight:700, color:c.color }}>{fmt(c.total)}</span>
                      </div>
                      <div className="bar"><div className="fill" style={{ width:`${(c.total/mTotal*100).toFixed(1)}%`, background:`linear-gradient(90deg,${c.color}77,${c.color})` }}/></div>
                    </div>
                  ))}
                </div>
              )}

              <div className="card" style={{ padding:22 }}>
                <div style={{ fontSize:11, color:"#64748b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Recent Transactions</div>
                {entries.length === 0
                  ? <div style={{ textAlign:"center", padding:"36px 0", color:"#334155" }}><div style={{ fontSize:36, marginBottom:10 }}>💸</div><div style={{ fontSize:13 }}>No transactions yet. Add your first expense!</div></div>
                  : entries.slice(0, 6).map(e => {
                      const cat = CATEGORIES.find(c => c.id === e.category);
                      return (
                        <div key={e.id} className="row" style={{ display:"flex", alignItems:"center", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                          <div style={{ width:40, height:40, borderRadius:12, background:`${cat?.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginRight:13, flexShrink:0 }}>{cat?.icon || "📦"}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13.5, fontWeight:500 }}>{e.note || cat?.label || "Expense"}</div>
                            <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{new Date(e.date).toLocaleDateString("en-IN", { day:"numeric", month:"short" })} · {cat?.label}</div>
                          </div>
                          <span style={{ fontSize:14, fontWeight:700, color:"#f87171", marginRight:12 }}>-{fmt(e.amount)}</span>
                          <button className="dbtn xbtn" onClick={() => del(e.id)} style={{ padding:"3px 9px", fontSize:12, color:"#f87171", borderColor:"rgba(248,113,113,.3)" }}>✕</button>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {view === "history" && (
            <div style={{ animation:"up .35s ease" }}>
              <div className="card" style={{ padding:22, marginBottom:18 }}>
                <div style={{ fontSize:11, color:"#64748b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Weekly Breakdown — {MONTHS[selMonth]} {selYear}</div>
                {Object.keys(weeks).length === 0
                  ? <div style={{ color:"#475569", fontSize:13, padding:"16px 0" }}>No data for this month.</div>
                  : Object.entries(weeks).sort((a, b) => +a[0] - +b[0]).map(([w, d]) => (
                      <div key={w} style={{ borderLeft:"3px solid rgba(212,168,83,.3)", paddingLeft:16, marginBottom:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:13, color:"#94a3b8", fontWeight:600 }}>Week {w}</span>
                          <span style={{ fontSize:14, fontWeight:700, color:"#d4a853" }}>{fmt(d.total)}</span>
                        </div>
                        <div style={{ fontSize:11, color:"#475569", marginTop:3 }}>{d.count} transaction{d.count !== 1 ? "s" : ""}</div>
                      </div>
                    ))}
              </div>
              <div className="card" style={{ padding:22 }}>
                <div style={{ fontSize:11, color:"#64748b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>All Entries — {MONTHS[selMonth]} {selYear}</div>
                {mEntries.length === 0
                  ? <div style={{ textAlign:"center", padding:"36px 0", color:"#334155" }}><div style={{ fontSize:34, marginBottom:10 }}>📅</div><div style={{ fontSize:13 }}>No entries for {MONTHS[selMonth]} {selYear}</div></div>
                  : mEntries.map(e => {
                      const cat = CATEGORIES.find(c => c.id === e.category);
                      return (
                        <div key={e.id} className="row" style={{ display:"flex", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                          <div style={{ width:42, height:42, borderRadius:12, background:`${cat?.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, marginRight:13, flexShrink:0 }}>{cat?.icon || "📦"}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13.5, fontWeight:500 }}>{e.note || cat?.label}</div>
                            <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{new Date(e.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</div>
                          </div>
                          <div style={{ textAlign:"right", marginRight:12 }}>
                            <div style={{ fontSize:14, fontWeight:700, color:"#f87171" }}>-{fmt(e.amount)}</div>
                            <div style={{ fontSize:10, color:cat?.color, marginTop:2 }}>{cat?.label}</div>
                          </div>
                          <button className="dbtn xbtn" onClick={() => del(e.id)} style={{ padding:"3px 9px", fontSize:12, color:"#f87171", borderColor:"rgba(248,113,113,.3)" }}>✕</button>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {view === "analytics" && (
            <div style={{ animation:"up .35s ease" }}>
              <div className="card" style={{ padding:22, marginBottom:18 }}>
                <div style={{ fontSize:11, color:"#64748b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Month Comparison</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[
                    { label:`${MONTHS[selMonth]} ${selYear}`, total:mTotal,  cnt:mEntries.length, col:"#d4a853" },
                    { label:`${MONTHS[pMonth]} ${pYear}`,     total:pTotal,  cnt:pEntries.length, col:"#64748b" },
                  ].map((x, i) => (
                    <div key={i} style={{ padding:18, background:"rgba(255,255,255,.03)", borderRadius:14 }}>
                      <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:1, marginBottom:7 }}>{x.label}</div>
                      <div style={{ fontSize:24, fontWeight:700, fontFamily:"'Playfair Display',serif", color:x.col }}>{fmt(x.total)}</div>
                      <div style={{ fontSize:11, color:"#475569", marginTop:5 }}>{x.cnt} transactions</div>
                    </div>
                  ))}
                </div>
                {diffPct !== null && (
                  <div style={{ marginTop:18, padding:14, borderRadius:13, background:diff>0?"rgba(248,113,113,.08)":"rgba(74,222,128,.08)", border:`1px solid ${diff>0?"rgba(248,113,113,.2)":"rgba(74,222,128,.2)"}`, textAlign:"center" }}>
                    <span style={{ fontSize:15, fontWeight:700, color:diff>0?"#f87171":"#4ade80" }}>{diff>0?"↑":"↓"} {Math.abs(diffPct)}% {diff>0?"more":"less"} than last month</span>
                    <div style={{ fontSize:11, color:"#64748b", marginTop:4 }}>Difference: {fmt(Math.abs(diff))}</div>
                  </div>
                )}
              </div>

              {catBreak.length > 0 && (
                <div className="card" style={{ padding:22, marginBottom:18 }}>
                  <div style={{ fontSize:11, color:"#64748b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Spending by Category</div>
                  {catBreak.map(c => (
                    <div key={c.id} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:13 }}>{c.icon} {c.label}</span>
                        <span style={{ fontSize:13, fontWeight:700, color:c.color }}>{fmt(c.total)} <span style={{ color:"#475569", fontWeight:400 }}>({(c.total/mTotal*100).toFixed(0)}%)</span></span>
                      </div>
                      <div className="bar" style={{ height:10 }}><div className="fill" style={{ width:`${(c.total/mTotal*100).toFixed(1)}%`, background:`linear-gradient(90deg,${c.color}66,${c.color})` }}/></div>
                    </div>
                  ))}
                </div>
              )}

              <div className="card" style={{ padding:22 }}>
                <div style={{ fontSize:11, color:"#64748b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>6-Month Trend</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:110 }}>
                  {Array.from({ length:6 }, (_, i) => {
                    const m = (selMonth - 5 + i + 12) % 12;
                    const y = selMonth - 5 + i < 0 ? selYear - 1 : selYear;
                    const t = entries.filter(e => { const d = new Date(e.date); return d.getMonth() === m && d.getFullYear() === y; }).reduce((s, e) => s + e.amount, 0);
                    return { m, y, t };
                  }).map((x, i, arr) => {
                    const mx = Math.max(...arr.map(a => a.t), 1);
                    const h  = Math.max((x.t / mx) * 100, 4);
                    const cur = x.m === selMonth && x.y === selYear;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                        <div style={{ fontSize:9, color:"#64748b", fontWeight:600 }}>{x.t > 0 ? "₹" + Math.round(x.t / 1000) + "k" : ""}</div>
                        <div style={{ width:"100%", height:`${h}%`, borderRadius:"5px 5px 3px 3px", background: cur ? "linear-gradient(180deg,#d4a853,#f0c96e)" : "rgba(255,255,255,.07)", border: cur ? "1px solid rgba(212,168,83,.4)" : "none", transition:"all .5s" }}/>
                        <div style={{ fontSize:10, color: cur ? "#d4a853" : "#475569", fontWeight: cur ? 700 : 400 }}>{MONTHS[x.m]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>{/* end main */}
      </div>{/* end flex body */}

      {/* ══ FOOTER — always at the very bottom ══ */}
      <footer style={{ borderTop:"1px solid rgba(212,168,83,.12)", background:"rgba(0,0,0,.45)", padding:"30px 24px 26px", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 18px", borderRadius:20, background:"rgba(212,168,83,.07)", border:"1px solid rgba(212,168,83,.18)", marginBottom:13 }}>
          <span style={{ fontSize:10, color:"#d4a853", letterSpacing:2.2, textTransform:"uppercase", fontWeight:600 }}>Created by</span>
        </div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#fff", letterSpacing:2, marginBottom:13 }}>
          MONISH KANDANURU
        </div>
        <p style={{ fontSize:13, color:"#475569", maxWidth:430, margin:"0 auto", lineHeight:1.8, fontStyle:"italic" }}>
          "Money should be saved and each penny spent should be tracked so we can easily know where did we spend that money on."
        </p>
        <div style={{ marginTop:18, fontSize:10, color:"#1e293b", letterSpacing:1 }}>
          © {new Date().getFullYear()} SpendWise · All rights reserved
        </div>
      </footer>

    </div>
  );
}