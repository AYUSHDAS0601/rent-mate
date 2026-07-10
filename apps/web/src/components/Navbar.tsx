import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Browse", href: "/listings" },
  { label: "List an Item", href: "/listings/new" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setMenuOpen(false);
  }, [location.pathname]);

  // close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="w-full overflow-hidden border-b" style={{ background: "var(--blue)", borderColor: "var(--blue)", color: "#fff", height: "36px", display: "flex", alignItems: "center" }}>
        <div className="announce-strip flex whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-8 text-xs font-bold uppercase tracking-widest">
              🏍️ Hyperlocal P2P Rentals &nbsp;·&nbsp; KYC Verified &nbsp;·&nbsp; Escrow Protected &nbsp;·&nbsp; 72h Dispute SLA &nbsp;·&nbsp; Real-time Chat
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <header
        id="main-navbar"
        style={{ background: "var(--bg-white)", borderBottom: "1px solid var(--border-light)", position: "sticky", top: 0, zIndex: 50 }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link to="/" id="nav-logo" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.04em", color: "var(--fg)", textTransform: "uppercase" }}>
              Rent<span style={{ color: "var(--blue)" }}>Mate</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0" }} className="hidden md:flex">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href || location.pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    padding: "8px 20px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: active ? "var(--fg)" : "var(--fg-muted)",
                    borderBottom: active ? "2px solid var(--fg)" : "2px solid transparent",
                    transition: "all 0.15s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = active ? "var(--fg)" : "var(--fg-muted)"; }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isLoggedIn ? (
              <>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)", padding: "4px 10px", border: "1px solid var(--border-light)" }}>
                  ● Signed in
                </span>
                <button onClick={handleLogout} id="nav-logout" className="btn-ghost hidden md:flex">
                  Sign out
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth" id="nav-sign-in" className="btn-ghost">Sign in</Link>
                <Link to="/listings/new" id="nav-list-item" className="btn-primary" style={{ padding: "10px 18px", fontSize: "0.7rem" }}>
                  List an item ↗
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              id="nav-hamburger"
              className="md:hidden"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}
              aria-label="Toggle menu"
            >
              <span style={{ display: "block", width: "20px", height: "1.5px", background: "var(--fg)", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
              <span style={{ display: "block", width: "20px", height: "1.5px", background: "var(--fg)", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <span style={{ display: "block", width: "20px", height: "1.5px", background: "var(--fg)", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div ref={menuRef} style={{ background: "var(--bg-white)", borderTop: "1px solid var(--border-light)", position: "absolute", top: "64px", left: 0, right: 0, zIndex: 100 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{ display: "block", padding: "16px 24px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid var(--border-light)", color: "var(--fg)" }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="btn-secondary">Sign out</button>
              ) : (
                <>
                  <Link to="/auth" className="btn-secondary">Sign in</Link>
                  <Link to="/listings/new" className="btn-primary">List an item ↗</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
