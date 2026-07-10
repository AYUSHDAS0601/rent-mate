import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createListing } from "../api/listings";

const CATEGORIES = ["Electronics","Sports","Outdoor","Tools","Music","Photography","Gaming","Furniture","Vehicles","Other"];
const CAT_EMOJI: Record<string, string> = {
  Electronics:"💻",Sports:"⚽",Outdoor:"⛺",Tools:"🔧",Music:"🎸",Photography:"📷",Gaming:"🎮",Furniture:"🪑",Vehicles:"🛵",Other:"📦"
};
const STEPS = [{ id:1, label:"Item Details" }, { id:2, label:"Pricing" }, { id:3, label:"Location & Photos" }];

interface FormData {
  title:string; description:string; category:string;
  dailyPriceRupees:string; depositRupees:string;
  city:string; mediaUrl1:string; mediaUrl2:string; mediaUrl3:string;
}
const INIT: FormData = { title:"",description:"",category:"",dailyPriceRupees:"",depositRupees:"",city:"",mediaUrl1:"",mediaUrl2:"",mediaUrl3:"" };

const inputStyle: React.CSSProperties = {
  width:"100%", background:"var(--bg-white)", border:"1px solid var(--fg)", borderRadius:0,
  padding:"12px 16px", fontSize:"0.88rem", color:"var(--fg)", outline:"none",
  fontFamily:"inherit",
};
const labelStyle: React.CSSProperties = { display:"block", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--fg)", marginBottom:"8px" };

export default function NewListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  function set(key: keyof FormData, val: string) { setForm(p => ({...p,[key]:val})); setError(""); }

  function validate(): string {
    if (step===1 && form.title.trim().length<3) return "Item name must be at least 3 characters.";
    if (step===2) {
      const p=parseFloat(form.dailyPriceRupees), d=parseFloat(form.depositRupees);
      if (!form.dailyPriceRupees||isNaN(p)||p<1) return "Enter a valid daily price (min ₹1).";
      if (form.depositRupees===""||isNaN(d)||d<0) return "Enter a valid deposit amount (₹0 or more).";
    }
    if (step===3&&!form.city.trim()) return "Please enter a city.";
    return "";
  }

  function next() { const e=validate(); if(e){setError(e);return;} setError(""); setStep(s=>s+1); }
  function back() { setError(""); setStep(s=>s-1); }

  async function submit() {
    const e=validate(); if(e){setError(e);return;}
    if(!isLoggedIn){setError("You must be signed in to create a listing.");return;}
    setLoading(true);
    try {
      const mediaUrls=[form.mediaUrl1,form.mediaUrl2,form.mediaUrl3].filter(u=>u.trim());
      await createListing({ title:form.title.trim(), description:form.description.trim()||undefined, dailyPricePaise:Math.round(parseFloat(form.dailyPriceRupees)*100), depositPaise:Math.round(parseFloat(form.depositRupees)*100), category:form.category||undefined, city:form.city.trim(), mediaUrls:mediaUrls.length?mediaUrls:undefined });
      setSuccess(true);
    } catch(ex:unknown){ setError(ex instanceof Error?ex.message:"Something went wrong."); }
    finally{ setLoading(false); }
  }

  const daily=parseFloat(form.dailyPriceRupees)||0;
  const deposit=parseFloat(form.depositRupees)||0;

  if (success) return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <Navbar/>
      <div style={{maxWidth:"480px",margin:"80px auto",padding:"0 24px",textAlign:"center"}}>
        <div style={{width:"64px",height:"64px",background:"var(--accent)",border:"1px solid var(--fg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",margin:"0 auto 24px"}}>✓</div>
        <h1 style={{fontSize:"1.4rem",fontWeight:900,letterSpacing:"-0.02em",textTransform:"uppercase",marginBottom:"8px"}}>Listing Published</h1>
        <p style={{fontSize:"0.85rem",color:"var(--fg-muted)",marginBottom:"32px"}}>Your item is now live for renters nearby.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          <button onClick={()=>navigate("/listings")} className="btn-primary" style={{width:"100%"}}>Browse Listings →</button>
          <button onClick={()=>{setForm(INIT);setStep(1);setSuccess(false);}} className="btn-secondary" style={{width:"100%"}}>List Another Item</button>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <Navbar/>
      <div style={{maxWidth:"440px",margin:"80px auto",padding:"0 24px",textAlign:"center"}}>
        <div style={{width:"64px",height:"64px",background:"var(--bg-white)",border:"1px solid var(--fg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",margin:"0 auto 24px"}}>🔐</div>
        <h1 style={{fontSize:"1.4rem",fontWeight:900,letterSpacing:"-0.02em",textTransform:"uppercase",marginBottom:"8px"}}>Sign In Required</h1>
        <p style={{color:"var(--fg-muted)",fontSize:"0.85rem",marginBottom:"32px"}}>You need an account to list items on Rent Mate.</p>
        <Link to="/auth" className="btn-primary" style={{display:"block",textAlign:"center"}}>Sign In with OTP →</Link>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <Navbar/>

      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"32px 24px 60px"}}>
        {/* Page title */}
        <div style={{borderBottom:"1px solid var(--border-light)",paddingBottom:"20px",marginBottom:"32px"}}>
          <h1 style={{fontSize:"1.6rem",fontWeight:900,letterSpacing:"-0.02em",textTransform:"uppercase",margin:0}}>List Your Item</h1>
          <p style={{fontSize:"0.8rem",color:"var(--fg-muted)",marginTop:"4px"}}>Start earning from what you own — takes under 2 minutes.</p>
        </div>

        {/* Step indicator */}
        <div style={{display:"flex",alignItems:"center",gap:"0",marginBottom:"32px",borderBottom:"1px solid var(--border-light)",paddingBottom:"0"}}>
          {STEPS.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:"0"}}>
              <button style={{display:"flex",alignItems:"center",gap:"10px",padding:"14px 20px",background:"transparent",border:"none",borderBottom:step===s.id?"2px solid var(--fg)":"2px solid transparent",cursor:"pointer",transition:"all 0.15s"}}>
                <div className={`step-dot ${step>s.id?"done":step===s.id?"active":""}`}>{step>s.id?"✓":s.id}</div>
                <span style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:step>=s.id?"var(--fg)":"var(--fg-faint)"}}>{s.label}</span>
              </button>
              {i<STEPS.length-1 && <div style={{width:"24px",height:"1px",background:"var(--border-light)"}}/>}
            </div>
          ))}
        </div>

        {/* 2-col layout */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:"24px",alignItems:"start"}} className="grid-cols-1 lg:grid-cols-[1fr_320px]">

          {/* Left — form */}
          <div style={{background:"var(--bg-white)",border:"1px solid var(--border-light)",padding:"32px"}}>
            <p style={{fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--fg-faint)",marginBottom:"24px",borderBottom:"1px solid var(--border-light)",paddingBottom:"12px"}}>
              Step {step} of {STEPS.length} — {STEPS[step-1].label}
            </p>

            {/* Step 1 */}
            {step===1 && (
              <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div>
                  <label style={labelStyle}>Item Name <span style={{color:"var(--red)"}}>*</span></label>
                  <input id="listing-title" type="text" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Sony A7 III Camera, Mountain Bike…" style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Description <span style={{fontSize:"0.65rem",fontWeight:400,color:"var(--fg-faint)"}}>optional</span></label>
                  <textarea id="listing-description" value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Condition, accessories, pickup notes…" rows={4} style={{...inputStyle,resize:"none"}}/>
                </div>
                <div>
                  <label style={labelStyle}>Category <span style={{fontSize:"0.65rem",fontWeight:400,color:"var(--fg-faint)"}}>optional</span></label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:"8px"}}>
                    {CATEGORIES.map(cat=>(
                      <button key={cat} type="button" id={`cat-${cat.toLowerCase()}`}
                        onClick={()=>set("category",form.category===cat?"":cat)}
                        style={{
                          border:`1px solid ${form.category===cat?"var(--fg)":"var(--border-light)"}`,
                          background:form.category===cat?"var(--fg)":"transparent",
                          color:form.category===cat?"#fff":"var(--fg-muted)",
                          padding:"10px 8px",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.08em",
                          textTransform:"uppercase",cursor:"pointer",display:"flex",flexDirection:"column",
                          alignItems:"center",gap:"4px",transition:"all 0.15s"
                        }}>
                        <span style={{fontSize:"1.3rem"}}>{CAT_EMOJI[cat]}</span>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step===2 && (
              <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div style={{background:"#f7f7f4",border:"1px solid var(--border-light)",padding:"12px 16px",fontSize:"0.78rem",color:"var(--fg-muted)"}}>
                  💡 Prices in ₹. Funds held in escrow until rental completion.
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                  <div>
                    <label style={labelStyle}>Daily Price (₹) <span style={{color:"var(--red)"}}>*</span></label>
                    <div style={{position:"relative"}}>
                      <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--fg-muted)",fontWeight:600}}>₹</span>
                      <input id="listing-daily-price" type="number" min="1" value={form.dailyPriceRupees} onChange={e=>set("dailyPriceRupees",e.target.value)} placeholder="499" style={{...inputStyle,paddingLeft:"28px"}}/>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Security Deposit (₹) <span style={{color:"var(--red)"}}>*</span></label>
                    <div style={{position:"relative"}}>
                      <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--fg-muted)",fontWeight:600}}>₹</span>
                      <input id="listing-deposit" type="number" min="0" value={form.depositRupees} onChange={e=>set("depositRupees",e.target.value)} placeholder="2000" style={{...inputStyle,paddingLeft:"28px"}}/>
                    </div>
                  </div>
                </div>
                {daily>0 && (
                  <div style={{border:"1px solid var(--border-light)",padding:"20px"}}>
                    <p style={{fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--fg-faint)",marginBottom:"14px"}}>Estimated Earnings</p>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:"var(--border-light)"}}>
                      {[["1 Day",1],["1 Week",7],["1 Month",30]].map(([label,days])=>(
                        <div key={label as string} style={{background:"var(--bg-white)",padding:"16px",textAlign:"center"}}>
                          <p style={{fontSize:"1.1rem",fontWeight:800,color:"var(--fg)"}}>₹{(daily*(days as number)).toLocaleString("en-IN")}</p>
                          <p style={{fontSize:"0.65rem",color:"var(--fg-muted)",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:"2px"}}>{label as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 */}
            {step===3 && (
              <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div>
                  <label style={labelStyle}>City <span style={{color:"var(--red)"}}>*</span></label>
                  <input id="listing-city" type="text" value={form.city} onChange={e=>set("city",e.target.value)} placeholder="e.g. Bengaluru, Delhi, Mumbai…" style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Photo URLs <span style={{fontSize:"0.65rem",fontWeight:400,color:"var(--fg-faint)"}}>optional</span></label>
                  <p style={{fontSize:"0.72rem",color:"var(--fg-muted)",marginBottom:"10px"}}>Paste public image links (Imgur, Cloudinary). S3 upload coming soon.</p>
                  {(["mediaUrl1","mediaUrl2","mediaUrl3"] as (keyof FormData)[]).map((key,i)=>(
                    <div key={key} style={{display:"flex",gap:"8px",marginBottom:"8px",alignItems:"center"}}>
                      <div style={{width:"44px",height:"44px",flexShrink:0,border:"1px solid var(--border-light)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:"#f7f7f4",fontSize:"1.2rem"}}>
                        {form[key] ? <img src={form[key]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/> : "📷"}
                      </div>
                      <input id={`listing-photo-${i+1}`} type="url" value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={`Photo ${i+1} URL`} style={{...inputStyle,flex:1,border:"1px solid var(--border-light)"}}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{marginTop:"16px",background:"#fff0f0",border:"1px solid var(--red)",padding:"10px 14px",fontSize:"0.8rem",color:"var(--red)",display:"flex",gap:"8px"}}>
                <span>⚠</span>{error}
              </div>
            )}

            {/* Actions */}
            <div style={{marginTop:"28px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border-light)",paddingTop:"20px"}}>
              {step>1 ? (
                <button id="btn-back" type="button" onClick={back} className="btn-secondary">← Back</button>
              ) : <div/>}
              {step<STEPS.length ? (
                <button id="btn-next" type="button" onClick={next} className="btn-primary">Continue →</button>
              ) : (
                <button id="btn-submit" type="button" onClick={submit} disabled={loading} className="btn-primary" style={{background:loading?"var(--fg-faint)":"var(--accent)"}}>
                  {loading ? (
                    <span style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <span style={{width:"14px",height:"14px",border:"2px solid rgba(0,0,0,0.2)",borderTopColor:"var(--fg)",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/>
                      Publishing…
                    </span>
                  ) : "Publish Listing →"}
                </button>
              )}
            </div>
          </div>

          {/* Right — preview sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            {/* Live preview card */}
            <div style={{background:"var(--bg-white)",border:"1px solid var(--border-light)"}}>
              <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border-light)"}}>
                <p style={{fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--fg-faint)",margin:0}}>Live Preview</p>
              </div>
              <div style={{aspectRatio:"1/1",background:"#f7f7f4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4rem",borderBottom:"1px solid var(--border-light)"}}>
                {form.mediaUrl1 ? (
                  <img src={form.mediaUrl1} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                ) : (CAT_EMOJI[form.category]??"")}
              </div>
              <div style={{padding:"14px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <p style={{fontSize:"0.82rem",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:"var(--fg)"}}>{form.title||"Item Name"}</p>
                  <p style={{fontSize:"0.68rem",color:"var(--fg-muted)",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:"2px"}}>{form.category||"Category"}</p>
                  {form.city && <p style={{fontSize:"0.68rem",color:"var(--fg-faint)",marginTop:"4px"}}>📍 {form.city}</p>}
                </div>
                <div style={{textAlign:"right"}}>
                  {daily>0&&<p style={{fontSize:"0.9rem",fontWeight:800,color:"var(--fg)"}}>₹{daily.toLocaleString("en-IN")}</p>}
                  {daily>0&&<p style={{fontSize:"0.65rem",color:"var(--fg-muted)",letterSpacing:"0.05em"}}>/day</p>}
                </div>
              </div>
              {deposit>0&&(
                <div style={{padding:"10px 14px",background:"#f7f7f4",borderTop:"1px solid var(--border-light)",fontSize:"0.72rem",color:"var(--fg-muted)"}}>
                  🔐 ₹{deposit.toLocaleString("en-IN")} deposit in escrow
                </div>
              )}
            </div>

            {/* Protection box */}
            <div style={{background:"var(--bg-white)",border:"1px solid var(--border-light)"}}>
              <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border-light)"}}>
                <p style={{fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--fg-faint)",margin:0}}>Listing Protection</p>
              </div>
              <div style={{padding:"14px",display:"flex",flexDirection:"column",gap:"10px"}}>
                {[["🛡️","KYC-verified identity"],["💰","Escrow payment"],["⚖️","72h dispute SLA"],["⭐","Mutual reviews"]].map(([icon,label])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:"10px",fontSize:"0.75rem",color:"var(--fg-muted)"}}>
                    <span>{icon}</span><span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={{fontSize:"0.68rem",color:"var(--fg-faint)",textAlign:"center"}}>
              🪪 KYC required to publish. <a href="#" style={{color:"var(--blue)",textDecoration:"underline"}}>Learn more</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}