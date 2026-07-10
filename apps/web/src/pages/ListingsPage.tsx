import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchListings, type Listing } from "../api/listings";

const CATEGORIES = ["VIEW ALL", "Electronics", "Sports", "Outdoor", "Tools", "Music", "Photography", "Gaming", "Furniture", "Vehicles"];

const CAT_EMOJI: Record<string, string> = {
  Electronics: "💻", Sports: "⚽", Outdoor: "⛺", Tools: "🔧",
  Music: "🎸", Photography: "📷", Gaming: "🎮", Furniture: "🪑",
  Vehicles: "🛵", Other: "📦",
};

const MOCK: Listing[] = [
  { id: "1", title: "Mountain Bike", category: "Sports", dailyPricePaise: 15000, depositPaise: 200000, city: "Delhi", status: "active", createdAt: "", media: [] },
  { id: "2", title: "DSLR Camera", category: "Photography", dailyPricePaise: 50000, depositPaise: 500000, city: "Mumbai", status: "active", createdAt: "", media: [] },
  { id: "3", title: "Camping Tent", category: "Outdoor", dailyPricePaise: 20000, depositPaise: 100000, city: "Bangalore", status: "rented", createdAt: "", media: [] },
  { id: "4", title: "Power Drill", category: "Tools", dailyPricePaise: 10000, depositPaise: 50000, city: "Pune", status: "active", createdAt: "", media: [] },
  { id: "5", title: "Acoustic Guitar", category: "Music", dailyPricePaise: 25000, depositPaise: 80000, city: "Chennai", status: "active", createdAt: "", media: [] },
  { id: "6", title: "Projector", category: "Electronics", dailyPricePaise: 80000, depositPaise: 300000, city: "Hyderabad", status: "rented", createdAt: "", media: [] },
  { id: "7", title: "Gaming Console", category: "Gaming", dailyPricePaise: 35000, depositPaise: 150000, city: "Delhi", status: "active", createdAt: "", media: [] },
  { id: "8", title: "Camping Backpack", category: "Outdoor", dailyPricePaise: 12000, depositPaise: 40000, city: "Mumbai", status: "active", createdAt: "", media: [] },
];

function ListingCard({ item, index }: { item: Listing; index: number }) {
  const priceRupees = item.dailyPricePaise / 100;
  const isAvailable = item.status === "active";
  const photo = item.media?.[0]?.url;
  const emoji = CAT_EMOJI[item.category ?? ""] ?? "📦";

  // Comet-style badge tags
  const badges = index === 0 ? "BESTSELLER" : index === 1 ? "TRENDING" : index === 3 ? "NEW" : null;

  return (
    <div
      className="card-comet group relative flex flex-col"
      style={{ cursor: "pointer" }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#f7f7f4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderBottom: "1px solid var(--border-light)" }}>
        {photo ? (
          <img src={photo} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            className="group-hover:scale-105" />
        ) : (
          <span style={{ fontSize: "4rem", transition: "transform 0.3s" }} className="group-hover:scale-110 block">{emoji}</span>
        )}

        {/* Badge top-left */}
        {badges && (
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <span className="badge badge-new">{badges}</span>
          </div>
        )}

        {/* Availability top-right */}
        <div style={{ position: "absolute", top: "8px", right: "8px" }}>
          <span className={`badge ${isAvailable ? "badge-available" : "badge-rented"}`}>
            {isAvailable ? "Available" : "Rented"}
          </span>
        </div>

        {/* Quick action on hover */}
        {isAvailable && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, transform: "translateY(100%)", transition: "transform 0.2s" }}
            className="group-hover:translate-y-0">
            <Link to={`/listings/${item.id}`} id={`rent-${item.id}`}
              style={{ display: "block", background: "var(--fg)", color: "#fff", textAlign: "center", padding: "12px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
              Rent Now →
            </Link>
          </div>
        )}
      </div>

      {/* Info row — Comet style: name left, price right */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg)", lineHeight: 1.2 }}>
              {item.title}
            </p>
            <p style={{ fontSize: "0.7rem", color: "var(--fg-muted)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {item.category}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--fg)" }}>₹ {priceRupees.toLocaleString("en-IN")}</p>
            <p style={{ fontSize: "0.65rem", color: "var(--fg-muted)", letterSpacing: "0.05em" }}>/day</p>
          </div>
        </div>
        {item.city && (
          <p style={{ fontSize: "0.68rem", color: "var(--fg-faint)", letterSpacing: "0.04em", marginTop: "4px" }}>
            📍 {item.city}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("VIEW ALL");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetchListings()
      .then(data => { setListings(data); setApiError(false); })
      .catch(() => { setListings(MOCK); setApiError(true); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = listings;
    if (category !== "VIEW ALL") result = result.filter(l => l.category === category);
    if (search.trim()) result = result.filter(l =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, category, listings]);

  const availableCount = filtered.filter(l => l.status === "active").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Page header — Comet style */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "24px" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--fg)", margin: 0 }}>
            Listings
          </h1>
          <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginTop: "4px", letterSpacing: "0.04em" }}>
            {loading ? "Loading…" : `${availableCount} item${availableCount !== 1 ? "s" : ""} available · ${listings.length} total`}
            {apiError && <span style={{ marginLeft: "12px", color: "var(--red)", fontWeight: 700 }}>· Demo mode</span>}
          </p>
        </div>

        {/* Filter bar — exactly like Comet */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", padding: "0 0 0" }}>
          <div style={{ display: "flex", overflowX: "auto", gap: "0" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCategory(cat)}
                className="filter-tab"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: category === cat ? "2px solid var(--fg)" : "2px solid transparent",
                  color: category === cat ? "var(--fg)" : "var(--fg-muted)",
                  background: "transparent",
                  padding: "14px 16px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  whiteSpace: "nowrap" as const,
                  outline: "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search + Sort right side */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0, marginLeft: "16px" }}>
            <div style={{ position: "relative" }}>
              <input
                id="listings-search"
                type="text"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: "var(--bg-white)", border: "1px solid var(--border-light)", borderRadius: 0, padding: "8px 14px 8px 32px", fontSize: "0.75rem", color: "var(--fg)", outline: "none", width: "160px" }}
              />
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--fg-faint)", fontSize: "0.75rem" }}>⌕</span>
            </div>
            <Link to="/listings/new" id="cta-list"
              className="btn-primary hidden sm:flex"
              style={{ padding: "9px 16px", fontSize: "0.7rem" }}>
              + List Item
            </Link>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 24px 60px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1px", background: "var(--border-light)" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "1/1", background: "#e8e8e4" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
              No listings found
            </p>
            <button onClick={() => { setSearch(""); setCategory("VIEW ALL"); }}
              className="btn-secondary" style={{ marginTop: "20px" }}>
              Clear filters
            </button>
          </div>
        ) : (
          /* Comet-style grid — 1px gap = border effect */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1px", background: "var(--border-light)" }}>
            {filtered.map((item, idx) => (
              <ListingCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
