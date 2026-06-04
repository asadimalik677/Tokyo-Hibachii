const STORAGE_KEY = "tokyoHibachiBookings";
const SESSION_KEY = "tokyoHibachiAdminLoggedIn";

// Change these two values to update the static demo admin credentials.
// Static credentials are visible in frontend code, so do not use this for sensitive production data.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "anaPZyJN135vll";

const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const dashboard = document.getElementById("dashboard");
const logoutButton = document.getElementById("logoutButton");
const bookingList = document.getElementById("bookingList");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.getElementById("year");

function getBookings() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
function saveBookings(bookings) { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings)); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function formatDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) return "Date/time not set";
  const date = new Date(`${dateValue}T${timeValue}`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}
function createBooking(formData) {
  return { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), fullName: formData.get("fullName").trim(), phone: formData.get("phone").trim(), email: formData.get("email").trim(), date: formData.get("date"), time: formData.get("time"), guests: Number(formData.get("guests")), request: formData.get("request").trim(), status: "Pending", createdAt: new Date().toISOString() };
}
function renderBookingList(bookings) {
  if (!bookingList) return;
  if (bookings.length === 0) { bookingList.innerHTML = '<div class="empty-state">No reservations yet. New online bookings will appear here.</div>'; return; }
  const sortedBookings = [...bookings].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  bookingList.innerHTML = sortedBookings.map((booking) => `<article class="booking-item"><div><h4>${escapeHtml(booking.fullName)} <span class="status-pill">${escapeHtml(booking.status)}</span></h4><div class="booking-meta"><span>${formatDateTime(booking.date, booking.time)}</span><span>${booking.guests} guest${booking.guests === 1 ? "" : "s"}</span><span>${escapeHtml(booking.phone)}</span><span>${escapeHtml(booking.email)}</span></div>${booking.request ? `<p class="booking-request">${escapeHtml(booking.request)}</p>` : ""}</div><div class="booking-actions"><select data-action="status" data-id="${booking.id}" aria-label="Change booking status">${["Pending", "Confirmed", "Completed"].map((status) => `<option value="${status}" ${booking.status === status ? "selected" : ""}>${status}</option>`).join("")}</select><button class="btn delete-button" type="button" data-action="delete" data-id="${booking.id}">Delete</button></div></article>`).join("");
}
function updateDashboard() {
  const bookings = getBookings();
  const counts = bookings.reduce((totals, booking) => { totals.total += 1; totals[booking.status.toLowerCase()] += 1; return totals; }, { total: 0, pending: 0, confirmed: 0, completed: 0 });
  document.getElementById("totalBookings").textContent = counts.total;
  document.getElementById("pendingBookings").textContent = counts.pending;
  document.getElementById("confirmedBookings").textContent = counts.confirmed;
  document.getElementById("completedBookings").textContent = counts.completed;
  renderBookingList(bookings);
}
function setAdminView(isLoggedIn) {
  sessionStorage.setItem(SESSION_KEY, isLoggedIn ? "true" : "false");
  if (loginForm) loginForm.classList.toggle("is-hidden", isLoggedIn);
  if (dashboard) dashboard.classList.toggle("is-hidden", !isLoggedIn);
  if (isLoggedIn && dashboard) updateDashboard();
}
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const booking = createBooking(new FormData(bookingForm));
    const bookings = getBookings();
    bookings.push(booking);
    saveBookings(bookings);
    bookingForm.reset();
    bookingMessage.textContent = "Thank you. Your reservation has been received and is pending confirmation.";
  });
}
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    if (formData.get("username") === ADMIN_USERNAME && formData.get("password") === ADMIN_PASSWORD) { loginMessage.textContent = ""; loginForm.reset(); setAdminView(true); }
    else loginMessage.textContent = "Incorrect username or password.";
  });
}
if (logoutButton) logoutButton.addEventListener("click", () => setAdminView(false));
if (bookingList) {
  bookingList.addEventListener("change", (event) => {
    if (event.target.dataset.action !== "status") return;
    const bookings = getBookings().map((booking) => booking.id === event.target.dataset.id ? { ...booking, status: event.target.value } : booking);
    saveBookings(bookings); updateDashboard();
  });
  bookingList.addEventListener("click", (event) => {
    if (event.target.dataset.action !== "delete") return;
    saveBookings(getBookings().filter((booking) => booking.id !== event.target.dataset.id)); updateDashboard();
  });
}
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => { const isOpen = navLinks.classList.toggle("is-open"); navToggle.setAttribute("aria-expanded", String(isOpen)); });
  navLinks.addEventListener("click", () => { navLinks.classList.remove("is-open"); navToggle.setAttribute("aria-expanded", "false"); });
}
if (year) year.textContent = new Date().getFullYear();
setAdminView(sessionStorage.getItem(SESSION_KEY) === "true");