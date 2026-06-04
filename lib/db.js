const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isDatabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

async function supabaseFetch(path, options = {}) {
  if (!isDatabaseConfigured()) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Database request failed with ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function makeBookingRef() {
  return `TH-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function createBooking(payload) {
  const rows = await supabaseFetch("bookings", {
    method: "POST",
    body: JSON.stringify({
      ref: makeBookingRef(),
      full_name: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      booking_date: payload.date,
      booking_time: payload.time,
      guests: Number(payload.guests),
      request: payload.request || "",
      priority: payload.priority || "STANDARD",
      status: "NEW"
    })
  });
  return rows[0];
}

export async function listBookings({ q = "", status = "", priority = "" } = {}) {
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("order", "created_at.desc");
  if (status) params.set("status", `eq.${status}`);
  if (priority) params.set("priority", `eq.${priority}`);
  const rows = await supabaseFetch(`bookings?${params.toString()}`, { method: "GET" });
  const search = q.trim().toLowerCase();
  if (!search) return rows;
  return rows.filter((booking) =>
    [booking.ref, booking.full_name, booking.phone, booking.email, booking.request]
      .join(" ")
      .toLowerCase()
      .includes(search)
  );
}

export async function updateBooking(id, patch) {
  const rows = await supabaseFetch(`bookings?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
  return rows[0];
}

export async function deleteBooking(id) {
  await supabaseFetch(`bookings?id=eq.${id}`, {
    method: "DELETE",
    prefer: "return=minimal"
  });
}

export async function dashboardStats() {
  const rows = await listBookings();
  return {
    total: rows.length,
    open: rows.filter((b) => !["RESOLVED", "CANCELLED"].includes(b.status)).length,
    new: rows.filter((b) => b.status === "NEW").length,
    resolved: rows.filter((b) => b.status === "RESOLVED").length,
    today: rows.filter((b) => b.booking_date === new Date().toISOString().slice(0, 10)).length
  };
}
