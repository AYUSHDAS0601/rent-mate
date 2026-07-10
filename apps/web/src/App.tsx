import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import ListingsPage from './pages/ListingsPage'
import NewListingPage from './pages/NewListingPage'
import Navbar from './components/Navbar'

// ─── Data ─────────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'DSLR Camera', 'Camping Gear', 'Gaming Console', 'Power Tools',
  'Acoustic Guitar', 'Bicycle', 'Projector', 'Camping Tent', 'Mic Setup',
  'Scooter', 'Art Supplies', 'MacBook Pro', 'DJ Setup', 'Drone', 'Kayak',
]

const HOW_IT_WORKS = [
  { step: '01', icon: '🗺️', title: 'Discover Nearby', body: 'Browse verified listings by category, price range, and distance from you.' },
  { step: '02', icon: '🔐', title: 'Book with Confidence', body: 'KYC-verified owners, transparent deposits, and a 72h inspection window.' },
  { step: '03', icon: '🤝', title: 'Handoff & Return', body: 'Guided pickup and return flow. Disputes resolved in your favour, every time.' },
]

const TRUST_ITEMS = [
  { icon: '🛡️', label: 'OTP Auth & JWT', desc: 'Passwordless, secure, instant' },
  { icon: '🪪', label: 'KYC Verification', desc: 'Aadhaar / PAN identity checks' },
  { icon: '💰', label: 'Escrow Deposits', desc: 'Funds held until safe return' },
  { icon: '⚖️', label: 'Dispute Resolution', desc: 'Admin-mediated, fair outcomes' },
]

const STATS = [
  { val: '500+', label: 'Active Listings' },
  { val: '4.9★', label: 'Avg Rating' },
  { val: '72h', label: 'Dispute SLA' },
  { val: '100%', label: 'Escrow Protected' },
]

const FAQS = [
  { q: 'How does the security deposit work?', a: 'The deposit is held in escrow when the rental begins. It is returned to the renter after the owner confirms the item is back in good condition.' },
  { q: 'What happens if an item is damaged?', a: 'Our 72-hour inspection window allows both parties to flag damage. Admins mediate disputes fairly using photographic evidence.' },
  { q: 'Is KYC mandatory to list an item?', a: 'Yes. KYC (Aadhaar/PAN + selfie verification) is required to list items. This builds trust and prevents fraudulent listings.' },
  { q: 'What categories are available?', a: 'Electronics, Photography, Sports, Outdoor, Tools, Music, Gaming, Furniture, Vehicles, and more — with new categories added regularly.' },
]

// ─── FAQ Accordion ─────────────────────────────────────────────────────────────
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border-light)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
      >
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{q}</span>
        <span style={{ fontSize: '1.2rem', color: 'var(--fg-muted)', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none', display: 'block', lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <p style={{ paddingBottom: '20px', fontSize: '0.85rem', color: 'var(--fg-muted)', lineHeight: 1.7, marginTop: 0 }}>{a}</p>
      )}
    </div>
  )
}

// ─── Marquee Strip ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '14px 0', position: 'relative', background: 'var(--bg-white)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to right, var(--bg-white), transparent)', zIndex: 1 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to left, var(--bg-white), transparent)', zIndex: 1 }} />
      <div className="announce-strip" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {items.map((item, i) => (
          <span key={i} style={{ marginRight: '48px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Landing Page ──────────────────────────────────────────────────────────────
function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '520px', alignItems: 'stretch' }}>

            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px 60px 0', borderRight: '1px solid var(--border-light)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg)', marginBottom: '24px', width: 'fit-content' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--fg)', display: 'inline-block' }} />
                Now Live in India
              </div>

              <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--fg)', lineHeight: 1.0, margin: '0 0 20px', textTransform: 'uppercase' }}>
                Rent What<br />You Need.<br />
                <span style={{ color: 'var(--blue)' }}>Earn From</span><br />What You Own.
              </h1>

              <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', lineHeight: 1.7, maxWidth: '440px', margin: '0 0 32px' }}>
                India's peer-to-peer rental marketplace — built for college campuses and urban communities. KYC verified. Escrow protected. Real-time.
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to="/listings" className="btn-primary" style={{ fontSize: '0.78rem', padding: '14px 28px' }}>
                  Browse Listings →
                </Link>
                <Link to="/listings/new" className="btn-secondary" style={{ fontSize: '0.78rem', padding: '14px 28px' }}>
                  List an Item
                </Link>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '0', marginTop: '40px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                {STATS.map((s, i) => (
                  <div key={s.label} style={{ flex: 1, paddingRight: '20px', marginRight: '20px', borderRight: i < STATS.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--fg)', margin: 0 }}>{s.val}</p>
                    <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-faint)', margin: '2px 0 0' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
              {[
                { emoji: '📷', label: 'DSLR Camera', price: '₹500', tag: 'POPULAR', bg: '#f7f7f4' },
                { emoji: '🎮', label: 'Gaming Console', price: '₹350', tag: 'TRENDING', bg: '#f0f5ff' },
                { emoji: '🛵', label: 'Scooter', price: '₹800', tag: 'NEW', bg: '#f5fff0' },
                { emoji: '🎸', label: 'Acoustic Guitar', price: '₹250', tag: 'KYC ✓', bg: '#fff8f0' },
              ].map((item, i) => (
                <Link
                  to="/listings"
                  key={item.label}
                  style={{
                    background: item.bg,
                    borderLeft: i % 2 !== 0 ? '1px solid var(--border-light)' : 'none',
                    borderTop: i >= 2 ? '1px solid var(--border-light)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px 20px',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#eeede8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = item.bg; }}
                >
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <span style={{ background: 'var(--fg)', color: '#fff', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.tag}</span>
                  </div>
                  <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '16px' }}>{item.emoji}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--fg)' }}>{item.price}<span style={{ fontSize: '0.6rem', color: 'var(--fg-muted)', fontWeight: 500 }}>/day</span></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 0 0', borderBottom: '1px solid var(--border-light)', marginBottom: '0' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-faint)', margin: '0 0 6px' }}>How it works</p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--fg)', margin: 0 }}>
                Three Steps to Your Next Rental
              </h2>
            </div>
            <Link to="/listings" className="btn-secondary" style={{ fontSize: '0.72rem', flexShrink: 0 }}>Browse All →</Link>
          </div>

          {/* 3-col step cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div
                key={s.step}
                style={{
                  padding: '48px 36px',
                  borderLeft: i > 0 ? '1px solid var(--border-light)' : 'none',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '3rem', fontWeight: 900, color: 'var(--border-light)', lineHeight: 1 }}>{s.step}</div>
                <div style={{ fontSize: '2.8rem', marginBottom: '20px' }}>{s.icon}</div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-faint)', margin: '0 0 8px' }}>Step {s.step}</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--fg)', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST & SAFETY ───────────────────────────────────────────────── */}
      <section id="trust" style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Left text */}
          <div style={{ padding: '60px 48px 60px 0', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-faint)', margin: '0 0 12px' }}>Trust & Safety</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--fg)', margin: '0 0 16px', lineHeight: 1.1 }}>
              Built Safe,<br />From the<br />Ground Up.
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--fg-muted)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: '380px' }}>
              Every transaction is wrapped in identity checks, escrow payments, and dispute resolution — so you rent and lend with zero anxiety.
            </p>
            <Link to="/auth" className="btn-primary" style={{ width: 'fit-content', fontSize: '0.75rem' }}>
              Get Started →
            </Link>
          </div>

          {/* Right grid of trust items */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {TRUST_ITEMS.map((t, i) => (
              <div
                key={t.label}
                style={{
                  padding: '40px 32px',
                  borderLeft: i % 2 !== 0 ? '1px solid var(--border-light)' : 'none',
                  borderTop: i >= 2 ? '1px solid var(--border-light)' : 'none',
                  transition: 'background 0.15s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f7f7f4'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{t.icon}</div>
                <p style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg)', margin: '0 0 6px' }}>{t.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section id="cta" style={{ background: 'var(--fg)', borderBottom: '1px solid var(--fg)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', minHeight: '140px' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
              Ready to Start?
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', margin: '6px 0 0' }}>
              List your first item in under 2 minutes. No listing fees.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/listings" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '13px 24px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
            >Browse Listings</Link>
            <Link to="/listings/new" className="btn-primary" style={{ fontSize: '0.75rem' }}>
              Start Listing ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0' }}>
          {/* Left label */}
          <div style={{ padding: '60px 48px 60px 0', borderRight: '1px solid var(--border-light)', position: 'sticky', top: '100px', height: 'fit-content' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-faint)', margin: '0 0 12px' }}>FAQ</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--fg)', margin: '0 0 16px', lineHeight: 1.1 }}>
              Frequently<br />Asked<br />Questions
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: 0 }}>
              Have more questions? Reach out on GitHub Issues.
            </p>
          </div>
          {/* Right accordions */}
          <div style={{ padding: '60px 0 60px 48px' }}>
            {FAQS.map(faq => <FAQ key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--fg)', borderTop: '1px solid #222' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.04em', color: '#fff', textTransform: 'uppercase' }}>
              Rent<span style={{ color: 'var(--accent)' }}>Mate</span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>© {new Date().getFullYear()} · MIT License</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contributing', 'GitHub'].map(l => (
              <a key={l} href="#" style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}
              >{l}</a>
            ))}
          </div>
          <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>
            Hyperlocal · P2P · KYC Verified
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/listings/new" element={<NewListingPage />} />
    </Routes>
  )
}
