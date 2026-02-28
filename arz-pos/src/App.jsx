
import { useState, useEffect } from "react";

const CUR = "MAD";

const PRODUCTS = [
  // Hot Drinks
  { id:1,  cat:"hot",     name:"Espresso",         price:15,  emoji:"☕", badge:null },
  { id:2,  cat:"hot",     name:"Cappuccino",        price:25,  emoji:"🫗", badge:"hot" },
  { id:3,  cat:"hot",     name:"Café au Lait",      price:20,  emoji:"☕", badge:null },
  { id:4,  cat:"hot",     name:"Latte",             price:28,  emoji:"🥛", badge:null },
  { id:5,  cat:"hot",     name:"Atay b'Nana",       price:18,  emoji:"🍵", badge:"hot" },
  { id:6,  cat:"hot",     name:"Atay Akhdar",       price:16,  emoji:"🫖", badge:null },
  // Cold Drinks
  { id:7,  cat:"cold",    name:"Iced Latte",        price:30,  emoji:"🧊", badge:null },
  { id:8,  cat:"cold",    name:"Jus d'Orange",      price:22,  emoji:"🍊", badge:"hot" },
  { id:9,  cat:"cold",    name:"Jus d'Avocat",      price:28,  emoji:"🥑", badge:"new" },
  { id:10, cat:"cold",    name:"Limonade Menthe",   price:20,  emoji:"🍋", badge:null },
  { id:11, cat:"cold",    name:"Smoothie Fraise",   price:32,  emoji:"🍓", badge:null },
  // Moroccan Food
  { id:12, cat:"moroccan",name:"Tajine Poulet",     price:85,  emoji:"🍲", badge:"hot" },
  { id:13, cat:"moroccan",name:"Tajine Kefta",      price:80,  emoji:"🍲", badge:null },
  { id:14, cat:"moroccan",name:"Couscous Royale",   price:95,  emoji:"🫕", badge:"hot" },
  { id:15, cat:"moroccan",name:"Harira",            price:25,  emoji:"🥣", badge:null },
  { id:16, cat:"moroccan",name:"Pastilla Poulet",   price:75,  emoji:"🥧", badge:"new" },
  { id:17, cat:"moroccan",name:"Merguez + Frites",  price:55,  emoji:"🌭", badge:null },
  { id:18, cat:"moroccan",name:"Msemen Beurre Miel",price:18,  emoji:"🫓", badge:null },
  { id:19, cat:"moroccan",name:"Baghrir Sirop",     price:20,  emoji:"🥞", badge:null },
  // Food / Snacks
  { id:20, cat:"food",    name:"Croissant",         price:12,  emoji:"🥐", badge:null },
  { id:21, cat:"food",    name:"Sandwich Kefta",    price:35,  emoji:"🥪", badge:"hot" },
  { id:22, cat:"food",    name:"Tarte au Fromage",  price:30,  emoji:"🥚", badge:null },
  { id:23, cat:"food",    name:"Salade Marocaine",  price:28,  emoji:"🥗", badge:"new" },
  // Desserts
  { id:24, cat:"dessert", name:"Chebakia",          price:15,  emoji:"🍯", badge:"hot" },
  { id:25, cat:"dessert", name:"Kaab el Ghzal",     price:18,  emoji:"🥮", badge:null },
  { id:26, cat:"dessert", name:"Sellou",            price:20,  emoji:"🍘", badge:null },
  { id:27, cat:"dessert", name:"Briouats Amandes",  price:22,  emoji:"🍡", badge:"new" },
  { id:28, cat:"dessert", name:"Cheesecake",        price:35,  emoji:"🍰", badge:null },
  // Specials
  { id:29, cat:"special", name:"ARZ Signature",     price:45,  emoji:"✨", badge:"special" },
  { id:30, cat:"special", name:"Latte Rose Maroc",  price:38,  emoji:"🌹", badge:"new" },
  { id:31, cat:"special", name:"Café Épices",       price:32,  emoji:"🌶️", badge:null },
];

const CATS = [
  { id:"all",      label:"All",        icon:"⚡" },
  { id:"hot",      label:"Chaud",      icon:"☕" },
  { id:"cold",     label:"Froid",      icon:"🧊" },
  { id:"moroccan", label:"Marocain",   icon:"🍲" },
  { id:"food",     label:"Snacks",     icon:"🥐" },
  { id:"dessert",  label:"Desserts",   icon:"🍯" },
  { id:"special",  label:"Spéciaux",   icon:"✨" },
];

const CAT_LABELS = { hot:"Boissons Chaudes", cold:"Boissons Froides", moroccan:"Plats Marocains", food:"Snacks + Sandwichs", dessert:"Pâtisseries + Desserts", special:"Spéciaux ARZ" };

const TABLES = Array.from({length:15},(_,i)=>({
  id:i+1, label:`T${i+1}`,
  occupied:[2,5,9,12].includes(i+1)
}));

export default function ARZPOS() {
  const [cat, setCat]             = useState("all");
  const [search, setSearch]       = useState("");
  const [cart, setCart]           = useState([]);
  const [discType, setDiscType]   = useState("percent");
  const [discVal, setDiscVal]     = useState("");
  const [payMethod, setPayMethod] = useState("cash");
  const [orderType, setOrderType] = useState("dine");
  const [table, setTable]         = useState(null);
  const [noteItem, setNoteItem]   = useState(null);
  const [noteText, setNoteText]   = useState("");
  const [showTables, setShowTables] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [tempTable, setTempTable] = useState(null);
  const [toast, setToast]         = useState(null);
  const [successFlash, setSuccessFlash] = useState(false);
  const [clock, setClock]         = useState("");

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock(n.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false}));
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Cart helpers
  const addToCart = (prod) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === prod.id);
      if (ex) return prev.map(i => i.id===prod.id ? {...i, qty:i.qty+1} : i);
      return [...prev, {id:prod.id, name:prod.name, price:prod.price, emoji:prod.emoji, qty:1, note:""}];
    });
    showToast(`${prod.emoji} ${prod.name} added`);
  };
  const updateQty = (id, d) => setCart(prev => prev.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const removeItem = (id) => setCart(prev => prev.filter(i=>i.id!==id));
  const clearCart = () => setCart([]);
  const saveNote = () => {
    setCart(prev => prev.map(i=>i.id===noteItem?{...i,note:noteText}:i));
    setNoteItem(null);
  };

  // Totals
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const discAmt  = discType==="percent"
    ? subtotal*(parseFloat(discVal)||0)/100
    : Math.min(parseFloat(discVal)||0, subtotal);
  const after    = subtotal - discAmt;
  const vat      = after * 0.20;
  const total    = after + vat;

  // Filtered products
  const filtered = PRODUCTS.filter(p =>
    (cat==="all" || p.cat===cat) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );
  const sections = cat==="all"
    ? ["hot","cold","moroccan","food","dessert","special"]
    : [cat];

  const s = {
    root: { display:"flex", flexDirection:"column", height:"100vh", background:"#0f0e0c", color:"#f0ede8", fontFamily:"'DM Sans',system-ui,sans-serif", overflow:"hidden", fontSize:14 },
    // Topbar
    topbar: { display:"flex", alignItems:"center", padding:"0 16px", height:52, background:"#1a1916", borderBottom:"1px solid #333230", gap:12, flexShrink:0 },
    logo: { fontFamily:"'Syne',system-ui,sans-serif", fontWeight:800, fontSize:20, color:"#f5c842", letterSpacing:-1 },
    logoSub: { fontSize:10, color:"#7a7870", fontFamily:"monospace" },
    sep: { width:1, height:24, background:"#333230" },
    branch: { fontSize:12, color:"#7a7870" },
    branchName: { color:"#f0ede8", fontWeight:500 },
    ml: { marginLeft:"auto", display:"flex", alignItems:"center", gap:8 },
    clk: { fontFamily:"monospace", fontSize:12, color:"#7a7870", minWidth:48 },
    iconBtn: { width:32, height:32, borderRadius:8, background:"#232220", border:"1px solid #333230", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#7a7870", fontSize:14 },
    cashierPill: { display:"flex", alignItems:"center", gap:7, background:"#232220", border:"1px solid #333230", borderRadius:40, padding:"4px 10px 4px 4px", cursor:"pointer" },
    avatar: { width:26, height:26, borderRadius:"50%", background:"#f5c842", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:11, color:"#000" },
    cashierName: { fontSize:12, fontWeight:500 },
    cashierRole: { fontSize:10, color:"#7a7870", fontFamily:"monospace" },
    // Main
    main: { display:"flex", flex:1, overflow:"hidden" },
    // Product area
    prodArea: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 },
    // Cat bar
    catBar: { display:"flex", alignItems:"center", gap:6, padding:"10px 14px", background:"#1a1916", borderBottom:"1px solid #333230", overflowX:"auto", flexShrink:0 },
    catBtn: (active) => ({ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:40, fontFamily:"'Syne',system-ui,sans-serif", fontWeight:600, fontSize:12, whiteSpace:"nowrap", cursor:"pointer", border:"1px solid", transition:"all 0.15s",
      background: active?"#f5c842":"#232220", borderColor: active?"#f5c842":"#333230", color: active?"#000":"#7a7870" }),
    // Search
    searchWrap: { marginLeft:"auto", flexShrink:0, position:"relative" },
    searchInput: { background:"#232220", border:"1px solid #333230", borderRadius:40, padding:"6px 12px 6px 30px", fontFamily:"inherit", fontSize:12, color:"#f0ede8", width:160, outline:"none" },
    // Grid wrap
    gridWrap: { flex:1, overflowY:"auto", padding:"12px 14px" },
    catSection: { marginBottom:20 },
    catLabel: { fontFamily:"'Syne',system-ui,sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#7a7870", marginBottom:8, display:"flex", alignItems:"center", gap:6 },
    grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8 },
    card: (inCart) => ({ background:"#1a1916", border:`1px solid ${inCart?"#f5c842":"#333230"}`, borderRadius:12, overflow:"hidden", cursor:"pointer", position:"relative", transition:"all 0.15s" }),
    cardImg: { height:80, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, background:"#232220" },
    cardInfo: { padding:"8px 9px 9px" },
    cardName: { fontFamily:"'Syne',system-ui,sans-serif", fontWeight:600, fontSize:12, color:"#f0ede8", marginBottom:3, lineHeight:1.3 },
    cardPrice: { fontFamily:"monospace", fontSize:12, color:"#f5c842" },
    badge: (type) => ({ position:"absolute", top:5, right:5, borderRadius:4, padding:"1px 5px", fontFamily:"monospace", fontSize:9, fontWeight:600, zIndex:2,
      background: type==="hot"?"#f87171":type==="new"?"#4ade80":"#f5c842",
      color: type==="hot"?"#fff":"#000" }),
    qtyBubble: { position:"absolute", top:5, left:5, width:20, height:20, borderRadius:"50%", background:"#f5c842", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:11, color:"#000", zIndex:3 },
    // Cart
    cartPanel: { width:320, minWidth:320, display:"flex", flexDirection:"column", background:"#1a1916", borderLeft:"1px solid #333230" },
    cartHeader: { padding:"12px 14px", borderBottom:"1px solid #333230", display:"flex", alignItems:"center", gap:8, flexShrink:0 },
    cartTitle: { fontFamily:"'Syne',system-ui,sans-serif", fontWeight:700, fontSize:14, flex:1 },
    cartBadge: { background:"#f5c842", color:"#000", borderRadius:20, padding:"1px 8px", fontFamily:"monospace", fontSize:10 },
    cartMeta: { padding:"8px 14px", display:"flex", gap:6, borderBottom:"1px solid #333230", flexShrink:0 },
    orderTabs: { flex:1, display:"flex", gap:2, background:"#232220", borderRadius:8, padding:2 },
    orderTab: (active) => ({ flex:1, padding:"4px 6px", borderRadius:6, fontFamily:"'Syne',system-ui,sans-serif", fontWeight:600, fontSize:10, textAlign:"center", cursor:"pointer", color: active?"#f0ede8":"#7a7870", background: active?"#2c2b28":"transparent", transition:"all 0.15s" }),
    tableBtn: (active) => ({ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:8, border:"1px solid", cursor:"pointer", fontSize:11, fontWeight:500, transition:"all 0.15s",
      background: active?"rgba(96,165,250,0.08)":"#232220",
      borderColor: active?"#60a5fa":"#333230",
      color: active?"#60a5fa":"#7a7870" }),
    cartItems: { flex:1, overflowY:"auto", padding:"8px 10px", display:"flex", flexDirection:"column", gap:5 },
    empty: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, color:"#7a7870" },
    cartItem: { background:"#232220", border:"1px solid #333230", borderRadius:10, padding:"9px 10px" },
    ciTop: { display:"flex", alignItems:"flex-start", gap:7 },
    ciEmoji: { fontSize:20, lineHeight:1, paddingTop:1 },
    ciInfo: { flex:1, minWidth:0 },
    ciName: { fontFamily:"'Syne',system-ui,sans-serif", fontWeight:600, fontSize:12, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
    ciPrice: { fontFamily:"monospace", fontSize:11, color:"#f5c842" },
    ciCtrl: { display:"flex", alignItems:"center", background:"#1a1916", border:"1px solid #333230", borderRadius:7, overflow:"hidden" },
    qBtn: { width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"transparent", border:"none", color:"#f0ede8", fontSize:14, fontWeight:600 },
    qNum: { minWidth:24, textAlign:"center", fontFamily:"monospace", fontSize:12 },
    ciBot: { marginTop:6, display:"flex", alignItems:"center", gap:5 },
    noteBtn: (has) => ({ display:"flex", alignItems:"center", gap:3, fontSize:10, color: has?"#60a5fa":"#7a7870", cursor:"pointer", background:"none", border:"none", padding:0, fontFamily:"inherit" }),
    noteText: { fontSize:10, color:"#60a5fa", fontStyle:"italic", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
    lineTotal: { fontFamily:"monospace", fontSize:11, color:"#7a7870", marginLeft:"auto", whiteSpace:"nowrap" },
    rmBtn: { width:18, height:18, borderRadius:"50%", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#f87171", fontSize:10, flexShrink:0 },
    // Footer
    cartFoot: { borderTop:"1px solid #333230", padding:"12px 14px", flexShrink:0, display:"flex", flexDirection:"column", gap:7 },
    row: { display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12, color:"#7a7870" },
    val: { fontFamily:"monospace", color:"#f0ede8" },
    discRow: { display:"flex", alignItems:"center", gap:5 },
    discToggle: { display:"flex", borderRadius:5, overflow:"hidden", background:"#1a1916", border:"1px solid #333230" },
    discBtn: (a) => ({ padding:"3px 7px", fontFamily:"monospace", fontSize:10, cursor:"pointer", background: a?"#2c2b28":"transparent", border:"none", color: a?"#f0ede8":"#7a7870" }),
    discWrap: { display:"flex", background:"#232220", border:"1px solid #333230", borderRadius:7, padding:"3px 7px" },
    discInput: { background:"none", border:"none", outline:"none", fontFamily:"monospace", fontSize:12, color:"#f0ede8", width:44, textAlign:"right" },
    divider: { height:1, background:"#333230" },
    totalRow: { display:"flex", justifyContent:"space-between", alignItems:"center" },
    totalLabel: { fontFamily:"'Syne',system-ui,sans-serif", fontWeight:700, fontSize:14 },
    totalVal: { fontFamily:"'Syne',system-ui,sans-serif", fontWeight:800, fontSize:22, color:"#f5c842" },
    payBtns: { display:"flex", gap:5 },
    payBtn: (sel) => ({ flex:1, padding:"8px 4px", borderRadius:9, border:"1px solid", cursor:"pointer", background: sel?"rgba(245,200,66,0.1)":"#232220", borderColor: sel?"#f5c842":"#333230", color: sel?"#f5c842":"#7a7870", fontSize:11, fontWeight:500, display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontFamily:"inherit" }),
    chkBtn: (disabled) => ({ width:"100%", padding:12, background: disabled?"#2c2b28":"#f5c842", color: disabled?"#7a7870":"#000", border:"none", borderRadius:10, fontFamily:"'Syne',system-ui,sans-serif", fontSize:14, fontWeight:700, cursor: disabled?"not-allowed":"pointer", transition:"all 0.18s" }),
    // Modal overlay
    overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" },
    modal: { background:"#1a1916", border:"1px solid #333230", borderRadius:16, padding:20, width:320 },
    mTitle: { fontFamily:"'Syne',system-ui,sans-serif", fontWeight:700, fontSize:15, marginBottom:12 },
    mTA: { width:"100%", height:72, resize:"none", background:"#232220", border:"1px solid #333230", borderRadius:8, padding:"8px 10px", fontFamily:"inherit", fontSize:13, color:"#f0ede8", outline:"none" },
    mBtns: { display:"flex", gap:7, marginTop:10 },
    mBtn: (primary) => ({ flex:1, padding:"9px", borderRadius:9, fontFamily:"'Syne',system-ui,sans-serif", fontSize:12, fontWeight:600, cursor:"pointer", border:"1px solid", background: primary?"#f5c842":"#232220", borderColor: primary?"#f5c842":"#333230", color: primary?"#000":"#7a7870" }),
    tableGrid: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6, margin:"12px 0" },
    tCell: (occ, sel) => ({ aspectRatio:1, borderRadius:8, border:"1px solid", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, cursor: occ?"not-allowed":"pointer", fontFamily:"'Syne',system-ui,sans-serif", fontWeight:700, fontSize:13, transition:"all 0.15s",
      background: sel?"#f5c842": occ?"rgba(248,113,113,0.08)":"#232220",
      borderColor: sel?"#f5c842": occ?"#f87171":"#333230",
      color: sel?"#000": occ?"#7a7870":"#f0ede8" }),
    tStatus: { fontFamily:"monospace", fontSize:8, textTransform:"uppercase", color:"#7a7870" },
    // Receipt preview
    receipt: { background:"#232220", border:"1px solid #333230", borderRadius:10, padding:12, margin:"10px 0", fontFamily:"monospace", fontSize:11, lineHeight:1.9 },
    rRow: { display:"flex", justifyContent:"space-between" },
    rDiv: { height:1, background:"#333230", margin:"3px 0" },
    rTotal: { display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:13, color:"#f5c842" },
    pmGrid: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, margin:"10px 0" },
    pmBtn: (a) => ({ padding:"10px 6px", borderRadius:9, border:"1px solid", background: a?"rgba(245,200,66,0.1)":"#232220", borderColor: a?"#f5c842":"#333230", cursor:"pointer", textAlign:"center" }),
    pmIcon: { fontSize:18, marginBottom:3 },
    pmLabel: { fontFamily:"'Syne',system-ui,sans-serif", fontSize:10, fontWeight:600, color:"#7a7870" },
    confirmBtn: { width:"100%", padding:12, background:"#4ade80", border:"none", borderRadius:10, fontFamily:"'Syne',system-ui,sans-serif", fontSize:14, fontWeight:700, color:"#000", cursor:"pointer" },
    // Toast
    toastBox: (show) => ({ position:"fixed", bottom:16, left:"50%", transform:`translateX(-50%) translateY(${show?0:80}px)`, background:"#1a1916", border:"1px solid #333230", borderRadius:40, padding:"8px 18px", fontFamily:"'Syne',system-ui,sans-serif", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:7, boxShadow:"0 8px 32px rgba(0,0,0,0.5)", transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", zIndex:300, pointerEvents:"none" }),
    toastDot: { width:7, height:7, borderRadius:"50%", background:"#4ade80" },
    // Flash
    flash: (show) => ({ position:"fixed", inset:0, background:"rgba(74,222,128,0.1)", zIndex:200, pointerEvents:"none", opacity: show?1:0, transition:"opacity 0.3s" }),
  };

  return (
    <div style={s.root}>
      {/* TOPBAR */}
      <div style={s.topbar}>
        <div>
          <div style={s.logo}>ARZ</div>
          <div style={s.logoSub}>POINT OF SALE</div>
        </div>
        <div style={s.sep}/>
        <div style={s.branch}>📍 <span style={s.branchName}>Meknès — Ville Impériale</span></div>
        <div style={s.ml}>
          <div style={s.clk}>{clock}</div>
          <div style={s.iconBtn} onClick={()=>{setTempTable(table);setShowTables(true);}}>🪑</div>
          <div style={s.iconBtn}>📋</div>
          <div style={s.cashierPill}>
            <div style={s.avatar}>S</div>
            <div>
              <div style={s.cashierName}>Sara Ahmed</div>
              <div style={s.cashierRole}>cashier</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={s.main}>
        {/* PRODUCT AREA */}
        <div style={s.prodArea}>
          {/* CAT BAR */}
          <div style={s.catBar}>
            {CATS.map(c=>(
              <button key={c.id} style={s.catBtn(cat===c.id)} onClick={()=>setCat(c.id)}>
                <span>{c.icon}</span>{c.label}
              </button>
            ))}
            <div style={s.searchWrap}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#7a7870",fontSize:12}}>🔍</span>
              <input style={s.searchInput} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>

          {/* GRID */}
          <div style={s.gridWrap}>
            {sections.map(sec=>{
              const prods = filtered.filter(p=>p.cat===sec);
              if(!prods.length) return null;
              return (
                <div key={sec} style={s.catSection}>
                  <div style={s.catLabel}>
                    <span>{sec==="hot"?"☕":sec==="cold"?"🧊":sec==="moroccan"?"🍲":sec==="food"?"🥐":sec==="dessert"?"🍯":"✨"}</span>
                    {CAT_LABELS[sec]}
                    <div style={{flex:1,height:1,background:"#333230"}}/>
                  </div>
                  <div style={s.grid}>
                    {prods.map(p=>{
                      const inCart = cart.find(c=>c.id===p.id);
                      return (
                        <div key={p.id} style={s.card(!!inCart)} onClick={()=>addToCart(p)}>
                          {inCart && <div style={s.qtyBubble}>{inCart.qty}</div>}
                          {p.badge && <div style={s.badge(p.badge)}>{p.badge==="hot"?"🔥 HOT":p.badge==="new"?"NEW":"⭐"}</div>}
                          <div style={s.cardImg}>{p.emoji}</div>
                          <div style={s.cardInfo}>
                            <div style={s.cardName}>{p.name}</div>
                            <div style={s.cardPrice}>MAD {p.price.toFixed(2)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {filtered.length===0 && (
              <div style={{textAlign:"center",padding:48,color:"#7a7870"}}>No items found</div>
            )}
          </div>
        </div>

        {/* CART */}
        <div style={s.cartPanel}>
          <div style={s.cartHeader}>
            <div style={s.cartTitle}>Current Order</div>
            <div style={s.cartBadge}>{cart.reduce((s,i)=>s+i.qty,0)}</div>
            <div style={{...s.iconBtn,width:28,height:28,borderRadius:7,fontSize:12}} onClick={clearCart}>🗑</div>
          </div>

          {/* META */}
          <div style={s.cartMeta}>
            <div style={s.orderTabs}>
              {["dine","takeaway","delivery"].map(t=>(
                <div key={t} style={s.orderTab(orderType===t)} onClick={()=>setOrderType(t)}>
                  {t==="dine"?"Dine In":t==="takeaway"?"Takeaway":"Delivery"}
                </div>
              ))}
            </div>
            <div style={s.tableBtn(!!table)} onClick={()=>{setTempTable(table);setShowTables(true);}}>
              🪑 {table?`T${table}`:"Table"}
            </div>
          </div>

          {/* ITEMS */}
          <div style={s.cartItems}>
            {cart.length===0 ? (
              <div style={s.empty}>
                <div style={{fontSize:36,opacity:0.25}}>🛒</div>
                <div style={{fontSize:13,fontWeight:500}}>Cart is empty</div>
                <div style={{fontSize:11,opacity:0.5}}>Tap products to add</div>
              </div>
            ) : cart.map(item=>(
              <div key={item.id} style={s.cartItem}>
                <div style={s.ciTop}>
                  <div style={s.ciEmoji}>{item.emoji}</div>
                  <div style={s.ciInfo}>
                    <div style={s.ciName}>{item.name}</div>
                    <div style={s.ciPrice}>MAD {item.price.toFixed(2)}</div>
                  </div>
                  <div style={s.ciCtrl}>
                    <button style={s.qBtn} onClick={()=>updateQty(item.id,-1)}>−</button>
                    <div style={s.qNum}>{item.qty}</div>
                    <button style={s.qBtn} onClick={()=>updateQty(item.id,1)}>+</button>
                  </div>
                </div>
                <div style={s.ciBot}>
                  <button style={s.noteBtn(!!item.note)} onClick={()=>{setNoteItem(item.id);setNoteText(item.note);}}>
                    📝 {item.note?"Edit note":"Add note"}
                  </button>
                  {item.note && <span style={s.noteText}>{item.note}</span>}
                  <span style={s.lineTotal}>MAD {(item.price*item.qty).toFixed(2)}</span>
                  <div style={s.rmBtn} onClick={()=>removeItem(item.id)}>✕</div>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div style={s.cartFoot}>
            <div style={s.row}>
              <span>Discount</span>
              <div style={s.discRow}>
                <div style={s.discToggle}>
                  <button style={s.discBtn(discType==="percent")} onClick={()=>setDiscType("percent")}>%</button>
                  <button style={s.discBtn(discType==="fixed")} onClick={()=>setDiscType("fixed")}>MAD</button>
                </div>
                <div style={s.discWrap}>
                  <input style={s.discInput} type="number" min="0" placeholder="0" value={discVal} onChange={e=>setDiscVal(e.target.value)}/>
                </div>
              </div>
            </div>
            <div style={s.row}><span>Subtotal</span><span style={s.val}>{subtotal.toFixed(2)} MAD</span></div>
            {discAmt>0 && <div style={s.row}><span>Discount</span><span style={{...s.val,color:"#4ade80"}}>−{discAmt.toFixed(2)} MAD</span></div>}
            <div style={s.row}><span>TVA 20%</span><span style={s.val}>{vat.toFixed(2)} MAD</span></div>
            <div style={s.divider}/>
            <div style={s.totalRow}>
              <div style={s.totalLabel}>Total</div>
              <div style={s.totalVal}>MAD {total.toFixed(2)}</div>
            </div>
            <div style={s.payBtns}>
              {["cash","card","split"].map(m=>(
                <button key={m} style={s.payBtn(payMethod===m)} onClick={()=>setPayMethod(m)}>
                  <span style={{fontSize:14}}>{m==="cash"?"💵":m==="card"?"💳":"⚖️"}</span>
                  {m.charAt(0).toUpperCase()+m.slice(1)}
                </button>
              ))}
            </div>
            <button style={s.chkBtn(cart.length===0)} disabled={cart.length===0} onClick={()=>setShowCheckout(true)}>
              🛒 Charge Order
            </button>
          </div>
        </div>
      </div>

      {/* NOTE MODAL */}
      {noteItem!==null && (
        <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&setNoteItem(null)}>
          <div style={s.modal}>
            <div style={s.mTitle}>📝 Item Note</div>
            <textarea style={s.mTA} placeholder="e.g. No sugar, oat milk, extra shot…" value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus/>
            <div style={s.mBtns}>
              <button style={s.mBtn(false)} onClick={()=>setNoteItem(null)}>Cancel</button>
              <button style={s.mBtn(true)} onClick={saveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE MODAL */}
      {showTables && (
        <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&setShowTables(false)}>
          <div style={s.modal}>
            <div style={s.mTitle}>🪑 Select Table</div>
            <div style={s.tableGrid}>
              {TABLES.map(t=>(
                <div key={t.id} style={s.tCell(t.occupied, tempTable===t.id)}
                  onClick={()=>!t.occupied&&setTempTable(t.id)}>
                  <span>T{t.id}</span>
                  <span style={s.tStatus}>{t.occupied?"busy":"free"}</span>
                </div>
              ))}
            </div>
            <div style={s.mBtns}>
              <button style={s.mBtn(false)} onClick={()=>setShowTables(false)}>Cancel</button>
              <button style={s.mBtn(true)} onClick={()=>{setTable(tempTable);setShowTables(false);}}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&setShowCheckout(false)}>
          <div style={{...s.modal,width:360}}>
            <div style={s.mTitle}>💳 Confirm Order</div>
            <div style={s.receipt}>
              {cart.map(i=>(
                <div key={i.id} style={s.rRow}>
                  <span>{i.emoji} {i.name} ×{i.qty}</span>
                  <span>MAD {(i.price*i.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={s.rDiv}/>
              <div style={s.rRow}><span>Sous-total</span><span>MAD {subtotal.toFixed(2)}</span></div>
              {discAmt>0&&<div style={s.rRow}><span>Remise</span><span>−MAD {discAmt.toFixed(2)}</span></div>}
              <div style={s.rRow}><span>TVA 20%</span><span>MAD {vat.toFixed(2)}</span></div>
              <div style={s.rDiv}/>
              <div style={s.rTotal}><span>TOTAL</span><span>MAD {total.toFixed(2)}</span></div>
            </div>
            <div style={{fontFamily:"'Syne',system-ui,sans-serif",fontSize:11,fontWeight:600,color:"#7a7870",marginBottom:4}}>PAYMENT METHOD</div>
            <div style={s.pmGrid}>
              {["cash","card","split"].map(m=>(
                <div key={m} style={s.pmBtn(payMethod===m)} onClick={()=>setPayMethod(m)}>
                  <div style={s.pmIcon}>{m==="cash"?"💵":m==="card"?"💳":"⚖️"}</div>
                  <div style={{...s.pmLabel,color:payMethod===m?"#f5c842":"#7a7870"}}>{m.charAt(0).toUpperCase()+m.slice(1)}</div>
                </div>
              ))}
            </div>
            <button style={s.confirmBtn} onClick={()=>{
              setShowCheckout(false);
              setSuccessFlash(true);
              setTimeout(()=>setSuccessFlash(false),700);
              showToast("✅ Order confirmed! Printing receipt…");
              setTimeout(()=>{setCart([]);setTable(null);setDiscVal("");},400);
            }}>✓ Confirm &amp; Print Receipt</button>
            <div style={s.mBtns}>
              <button style={{...s.mBtn(false),flex:"none",padding:"7px 16px"}} onClick={()=>setShowCheckout(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* FLASH */}
      <div style={s.flash(successFlash)}/>

      {/* TOAST */}
      <div style={s.toastBox(!!toast)}>
        <div style={s.toastDot}/>
        <span>{toast}</span>
      </div>
    </div>
  );
}
