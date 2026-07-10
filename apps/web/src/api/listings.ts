const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

// =====================
// TYPES
// =====================
export interface ListingMedia {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  dailyPricePaise: number;
  depositPaise: number;
  category?: string;
  city?: string;
  status: "active" | "inactive" | "rented";
  createdAt: string;
  media: ListingMedia[];
  owner?: { id: string; name?: string };
}

export interface CreateListingPayload {
  title: string;
  description?: string;
  dailyPricePaise: number;
  depositPaise: number;
  category?: string;
  city?: string;
  mediaUrls?: string[];
}

// =====================
// AUTH HEADER HELPER
// =====================
function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// =====================
// GET ALL LISTINGS
// =====================
export async function fetchListings(filters?: {
  city?: string;
  category?: string;
}): Promise<Listing[]> {
  const params = new URLSearchParams();
  if (filters?.city) params.set("city", filters.city);
  if (filters?.category) params.set("category", filters.category);

  const url = `${API_BASE}/listings${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

// =====================
// GET SINGLE LISTING
// =====================
export async function fetchListingById(id: string): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings/${id}`);
  if (!res.ok) throw new Error("Listing not found");
  return res.json();
}

// =====================
// GET MY LISTINGS
// =====================
export async function fetchMyListings(): Promise<Listing[]> {
  const res = await fetch(`${API_BASE}/listings/mine`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch your listings");
  return res.json();
}

// =====================
// CREATE LISTING
// =====================
export async function createListing(
  payload: CreateListingPayload
): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to create listing");
  }
  return res.json();
}

// =====================
// UPDATE LISTING
// =====================
export async function updateListing(
  id: string,
  payload: Partial<CreateListingPayload>
): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to update listing");
  }
  return res.json();
}
