import { redirect } from "next/navigation";
import { dashboardStats, isDatabaseConfigured, listBookings } from "../../lib/db";
import { isAdminLoggedIn } from "../../lib/auth";

export const dynamic = "force-dynamic";

const statuses = ["NEW", "CONTACTED", "SCHEDULED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];
const priorities = ["STANDARD", "EXPRESS", "EMERGENCY"];

function statusClass(status) {
  return {
    NEW: "status-new",
    CONTACTED: "status-contacted",
    SCHEDULED: "status-scheduled",
    IN_PROGRESS: "status-progress",
    RESOLVED: "status-resolved",
    CANCELLED: "status-cancelled"
  }[status] || "status-new";
}

function priorityClass(priority) {
  return {
    STANDARD: "priority-standard",
    EXPRESS: "priority-express",
    EMERGENCY: "priority-emergency"
  }[priority] || "priority-standard";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default async function AdminPage({ searchParams }) {
  if (!(await isAdminLoggedIn())) redirect("/admin/login");
  const params = await searchParams;
  const q = params?.q || "";
  const status = params?.status || "";
  const priority = params?.priority || "";
  let bookings = [];
  let stats = { total: 0, open: 0, new: 0, resolved: 0, today: 0 };
  let setupError = "";

  if (isDatabaseConfigured()) {
    try {
      [bookings, stats] = await Promise.all([listBookings({ q, status, priority }), dashboardStats()]);
    } catch (error) {
      setupError = error.message;
    }
  } else {
    setupError = "Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.";
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <a className="brand" href="/"><span>Tokyo Hibachi</span><strong>Operations dashboard</strong></a>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <a href="/">View site</a>
            <form action="/api/logout" method="post"><button className="btn btn-light" type="submit">Sign out</button></form>
          </div>
        </div>
      </header>

      <section className="admin-main">
        {setupError ? <p className="admin-note">{setupError}</p> : null}
        <div className="admin-grid">
          <article className="admin-stat admin-card"><span>Total bookings</span><strong>{stats.total}</strong></article>
          <article className="admin-stat admin-card"><span>Open tickets</span><strong>{stats.open}</strong></article>
          <article className="admin-stat admin-card"><span>New</span><strong>{stats.new}</strong></article>
          <article className="admin-stat admin-card"><span>Resolved</span><strong>{stats.resolved}</strong></article>
          <article className="admin-stat admin-card"><span>Today</span><strong>{stats.today}</strong></article>
        </div>

        <form className="admin-filter" action="/admin">
          <label>Search<input name="q" placeholder="Name, phone, ref..." defaultValue={q} /></label>
          <label>Status<select name="status" defaultValue={status}><option value="">All statuses</option>{statuses.map((item) => <option value={item} key={item}>{item.replaceAll("_", " ")}</option>)}</select></label>
          <label>Priority<select name="priority" defaultValue={priority}><option value="">All</option>{priorities.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
          <button className="btn btn-dark" type="submit">Filter</button>
        </form>

        <h2>Bookings & Tickets</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Ref</th><th>Customer</th><th>Date / Time</th><th>Guests</th><th>Priority</th><th>Status</th><th>Created</th><th></th></tr></thead>
            <tbody>
              {bookings.length === 0 ? <tr><td colSpan="8">No bookings found.</td></tr> : bookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.ref}</strong></td>
                  <td><strong>{booking.full_name}</strong><br /><small>{booking.phone}<br />{booking.email}</small></td>
                  <td>{booking.booking_date} at {String(booking.booking_time).slice(0,5)}</td>
                  <td>{booking.guests}</td>
                  <td><span className={`badge ${priorityClass(booking.priority)}`}>{booking.priority}</span></td>
                  <td><span className={`badge ${statusClass(booking.status)}`}>{booking.status.replaceAll("_", " ")}</span></td>
                  <td>{formatDate(booking.created_at)}</td>
                  <td>
                    <form action={`/api/bookings/${booking.id}`} method="post" style={{display:"grid",gap:8,minWidth:170}}>
                      <select name="status" defaultValue={booking.status}>{statuses.map((item) => <option value={item} key={item}>{item.replaceAll("_", " ")}</option>)}</select>
                      <select name="priority" defaultValue={booking.priority}>{priorities.map((item) => <option value={item} key={item}>{item}</option>)}</select>
                      <button className="btn btn-dark" name="action" value="update" type="submit">Update</button>
                      <button className="btn btn-light" name="action" value="delete" type="submit">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
