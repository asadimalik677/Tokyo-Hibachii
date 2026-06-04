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
const bookingSearch = document.getElementById("bookingSearch");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");
const clearFilters = document.getElementById("clearFilters");
const detailPanel = document.getElementById("detailPanel");

function getBookings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return "Date/time not set";
  }

  const date = new Date(`${dateValue}T${timeValue}`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function createBooking(formData) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    ref: `TH-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    fullName: formData.get("fullName").trim(),
    phone: formData.get("phone").trim(),
    email: formData.get("email").trim(),
    date: formData.get("date"),
    time: formData.get("time"),
    guests: Number(formData.get("guests")),
    request: formData.get("request").trim(),
    status: "Pending",
    createdAt: new Date().toISOString()
  };
}

function getBookingRef(booking) {
  return booking.ref || `TH-${String(booking.id).slice(-5).toUpperCase()}`;
}

function isToday(dateValue) {
  const today = new Date().toISOString().slice(0, 10);
  return dateValue === today;
}

function matchesDateFilter(booking) {
  if (!dateFilter || dateFilter.value === "All") return true;
  const today = new Date().toISOString().slice(0, 10);
  if (dateFilter.value === "Today") return booking.date === today;
  if (dateFilter.value === "Upcoming") return booking.date >= today;
  if (dateFilter.value === "Past") return booking.date < today;
  return true;
}

function getFilteredBookings(bookings) {
  const search = bookingSearch ? bookingSearch.value.trim().toLowerCase() : "";
  const status = statusFilter ? statusFilter.value : "All";
  return bookings.filter((booking) => {
    const haystack = [getBookingRef(booking), booking.fullName, booking.phone, booking.email, booking.request, booking.status].join(" ").toLowerCase();
    const statusMatch = status === "All" || booking.status === status;
    return haystack.includes(search) && statusMatch && matchesDateFilter(booking);
  });
}

function renderBookingList(bookings) {
  if (!bookingList) {
    return;
  }

  if (bookings.length === 0) {
    bookingList.innerHTML = '<tr><td colspan="7" class="empty-state">No reservations yet. New online bookings will appear here.</td></tr>';
    return;
  }

  const sortedBookings = getFilteredBookings(bookings).sort((a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  });

  if (sortedBookings.length === 0) {
    bookingList.innerHTML = '<tr><td colspan="7" class="empty-state">No bookings match the selected filters.</td></tr>';
    return;
  }

  bookingList.innerHTML = sortedBookings.map((booking) => `
    <tr>
      <td><strong>${escapeHtml(getBookingRef(booking))}</strong></td>
      <td><strong>${escapeHtml(booking.fullName)}</strong><small>${escapeHtml(booking.phone)}<br>${escapeHtml(booking.email)}</small></td>
      <td>${formatDateTime(booking.date, booking.time)}</td>
      <td>${booking.guests}</td>
      <td><select data-action="status" data-id="${booking.id}" aria-label="Change booking status">${["Pending", "Confirmed", "Completed"].map((status) => `<option value="${status}" ${booking.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
      <td>${new Date(booking.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</td>
      <td class="table-actions"><button type="button" data-action="open" data-id="${booking.id}">Open</button><button type="button" data-action="delete" data-id="${booking.id}">Delete</button></td>
    </tr>
  `).join("");
}

function updateDashboard() {
  const bookings = getBookings();
  const counts = bookings.reduce(
    (totals, booking) => {
      totals.total += 1;
      totals[booking.status.toLowerCase()] += 1;
      return totals;
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0 }
  );

  document.getElementById("totalBookings").textContent = counts.total;
  document.getElementById("pendingBookings").textContent = counts.pending;
  document.getElementById("confirmedBookings").textContent = counts.confirmed;
  document.getElementById("completedBookings").textContent = counts.completed;
  const todayCount = bookings.filter((booking) => isToday(booking.date)).length;
  const todayBookings = document.getElementById("todayBookings");
  if (todayBookings) todayBookings.textContent = todayCount;
  renderBookingList(bookings);
}

function setAdminView(isLoggedIn) {
  sessionStorage.setItem(SESSION_KEY, isLoggedIn ? "true" : "false");

  if (loginForm) {
    loginForm.classList.toggle("is-hidden", isLoggedIn);
  }

  if (dashboard) {
    dashboard.classList.toggle("is-hidden", !isLoggedIn);
  }

  if (isLoggedIn && dashboard) {
    updateDashboard();
  }
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const booking = createBooking(formData);
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
    const username = formData.get("username");
    const password = formData.get("password");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      loginMessage.textContent = "";
      loginForm.reset();
      setAdminView(true);
    } else {
      loginMessage.textContent = "Incorrect username or password.";
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => setAdminView(false));
}

if (bookingList) {
  bookingList.addEventListener("change", (event) => {
    if (event.target.dataset.action !== "status") {
      return;
    }

    const bookings = getBookings().map((booking) => {
      if (booking.id === event.target.dataset.id) {
        return { ...booking, status: event.target.value };
      }
      return booking;
    });

    saveBookings(bookings);
    updateDashboard();
  });

  bookingList.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    const id = event.target.dataset.id;
    if (!action || !id) return;
    if (action === "delete") {
      saveBookings(getBookings().filter((booking) => booking.id !== id));
      if (detailPanel) detailPanel.classList.add("is-hidden");
      updateDashboard();
    }
    if (action === "open") {
      const booking = getBookings().find((item) => item.id === id);
      if (!booking || !detailPanel) return;
      detailPanel.classList.remove("is-hidden");
      detailPanel.innerHTML = `<div><p class="eyebrow">Booking Detail</p><h3>${escapeHtml(booking.fullName)} <span class="status-pill">${escapeHtml(booking.status)}</span></h3><p><strong>Ref:</strong> ${escapeHtml(getBookingRef(booking))}</p><p><strong>Phone:</strong> ${escapeHtml(booking.phone)} | <strong>Email:</strong> ${escapeHtml(booking.email)}</p><p><strong>Date:</strong> ${formatDateTime(booking.date, booking.time)} | <strong>Guests:</strong> ${booking.guests}</p><p><strong>Request:</strong> ${booking.request ? escapeHtml(booking.request) : "No special request"}</p></div><button class="btn btn-light" type="button" onclick="document.getElementById('detailPanel').classList.add('is-hidden')">Close</button>`;
    }
  });
}

[bookingSearch, statusFilter, dateFilter].forEach((control) => {
  if (control) control.addEventListener("input", updateDashboard);
});

if (clearFilters) {
  clearFilters.addEventListener("click", () => {
    if (bookingSearch) bookingSearch.value = "";
    if (statusFilter) statusFilter.value = "All";
    if (dateFilter) dateFilter.value = "All";
    updateDashboard();
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

setAdminView(sessionStorage.getItem(SESSION_KEY) === "true");
