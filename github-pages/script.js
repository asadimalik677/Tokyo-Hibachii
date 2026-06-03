/* Tokyo Hibachi Booking & Admin JS Logic */

// Multi-category Menu switcher
function switchCategory(cat) {
  const categories = ['hibachi', 'sushi', 'starters'];
  categories.forEach(c => {
    const el = document.getElementById('menu-' + c);
    if(c === cat) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  // Activate tab headers
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

// Mobile sidebar control toggle
function toggleMenu() {
  const x = document.getElementById('menuLinks');
  if (x.style.display === "flex") {
    x.style.display = "none";
  } else {
    x.style.display = "flex";
    x.style.flexDirection = "column";
    x.style.position = "absolute";
    x.style.top = "69px";
    x.style.left = "0";
    x.style.width = "100%";
    x.style.background = "#090909";
    x.style.alignItems = "center";
    x.style.gap = "15px";
    x.style.padding = "20px 0";
    x.style.borderBottom = "1px solid #222";
  }
}

// Initial Mock Datasets
const defaultReviews = [
  { name: 'Marcus L.', rating: 5, text: 'The onion volcano blew my kids away! Excellent filet mignon, tender and juicy. Best dining entertainment inside Ithaca.' },
  { name: 'Sarah G. (Cornell)', rating: 5, text: 'The Ithaca Dragon roll was insanely fresh and sweet. Sizzling atmosphere and the chefs are incredibly talented tossing those shrimps!' },
  { name: 'Emily P.', rating: 4, text: 'Great portions, friendly waiting staff, and the house yum yum sauce is liquid gold. Recommending booking teppanyaki tables in advance!' }
];

// Document Startup Initializations
document.addEventListener("DOMContentLoaded", () => {
  // Load review card structures
  const revArea = document.getElementById('reviewsContainer');
  if (revArea) {
    defaultReviews.forEach(r => {
      const card = document.createElement('div');
      card.className = 'rev-card';
      card.innerHTML = `<div class="rev-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <p>"${r.text}"</p>
      <div class="rev-author">${r.name}</div>`;
      revArea.appendChild(card);
    });
  }

  // Pre-fill calendar date input with tomorrow for convenience
  const dateInput = document.getElementById('custDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
  
  refreshBookingsTable();
});

// Reservation form submission to client localStorage
function submitLocalBooking(event) {
  event.preventDefault();
  
  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const email = document.getElementById('custEmail').value;
  const guests = document.getElementById('custGuests').value;
  const date = document.getElementById('custDate').value;
  const time = document.getElementById('custTime').value;
  const request = document.getElementById('custRequest').value;

  const bId = 'TH-' + Math.floor(1000 + Math.random() * 9000);
  const newBooking = {
    id: bId,
    name,
    phone,
    email,
    guests,
    date,
    time,
    specialRequest: request,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  const currentList = JSON.parse(localStorage.getItem('tokyo_hibachi_bookings') || '[]');
  currentList.push(newBooking);
  localStorage.setItem('tokyo_hibachi_bookings', JSON.stringify(currentList));

  // Render receipt ticket
  const box = document.getElementById('bookingResult');
  box.classList.remove('hide');
  box.innerHTML = `✨ <strong>Tables Seat Requested!</strong><br>
  Thank you, <strong>${name}</strong>. Your request is registered under Reference: <strong>${bId}</strong>.<br>
  Size: ${guests} Guests | Date: ${date} | Time: ${time}<br>
  <em>Status: Pending Admin Confirmation. Find this record in the Admin logs below.</em>`;

  // Reset inputs
  document.getElementById('bookForm').reset();
  refreshBookingsTable();
}

/* Static Admin Security Rules & Control Loops */
/* SECURITY EXPLANATION GUIDELINE: Change credentials below to protect your layout */
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'ChangeMe123!';

function handleStaticLogin(event) {
  event.preventDefault();
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;

  if (u === ADMIN_USER && p === ADMIN_PASSWORD) {
    document.getElementById('adminLoginArea').classList.add('hide');
    document.getElementById('adminPanelResult').classList.remove('hide');
    refreshBookingsTable();
  } else {
    alert('Invalid security credentials. By default, use admin / ChangeMe123!');
  }
}

function handleLogout() {
  document.getElementById('adminLoginArea').classList.remove('hide');
  document.getElementById('adminPanelResult').classList.add('hide');
}

function refreshBookingsTable() {
  const statsSpan = document.getElementById('statTotal');
  const confirmSpan = document.getElementById('statConfirm');
  const container = document.getElementById('bookingsListDiv');
  if(!container) return;

  const currentList = JSON.parse(localStorage.getItem('tokyo_hibachi_bookings') || '[]');
  
  if (statsSpan) statsSpan.innerText = currentList.length;
  if (confirmSpan) confirmSpan.innerText = currentList.filter(b => b.status === 'Confirmed').length;

  if(currentList.length === 0) {
    container.innerHTML = '<em>No bookings found inside localStorage. Book a table above to test!</em>';
    return;
  }

  let tableHtml = `<table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Guest</th>
        <th>Size</th>
        <th>Date/Time</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>`;

  currentList.forEach((b, i) => {
    const badgeClass = b.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending';
    tableHtml += `<tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.name}<br><small style="color:#777 font-size:10px">${b.phone}</small></td>
      <td>${b.guests}</td>
      <td>${b.date}<br><small style="color:#777">${b.time}</small></td>
      <td><span class="badge ${badgeClass}">${b.status}</span></td>
      <td>
        <button style="background:none border:1px solid #c29d2c text-align:center font-size:10px padding:2px 6px border-radius:4px color:#fff cursor:pointer" onclick="toggleBookingStatus('${b.id}')">Toggle Confirmation</button>
        <button style="background:none border:1px solid var(--crimson) font-size:10px padding:2px 6px border-radius:4px color:var(--crimson) cursor:pointer" onclick="deleteLocalBooking('${b.id}')">Del</button>
      </td>
    </tr>`;
  });

  tableHtml += '</tbody></table>';
  container.innerHTML = tableHtml;
}

function toggleBookingStatus(id) {
  const currentList = JSON.parse(localStorage.getItem('tokyo_hibachi_bookings') || '[]');
  const idx = currentList.findIndex(b => b.id === id);
  if(idx !== -1) {
    currentList[idx].status = currentList[idx].status === 'Pending' ? 'Confirmed' : 'Pending';
    localStorage.setItem('tokyo_hibachi_bookings', JSON.stringify(currentList));
    refreshBookingsTable();
  }
}

function deleteLocalBooking(id) {
  if (confirm('Permanently delete table request ' + id + '?')) {
    let currentList = JSON.parse(localStorage.getItem('tokyo_hibachi_bookings') || '[]');
    currentList = currentList.filter(b => b.id !== id);
    localStorage.setItem('tokyo_hibachi_bookings', JSON.stringify(currentList));
    refreshBookingsTable();
  }
}
