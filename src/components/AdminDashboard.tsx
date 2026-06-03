import React, { useState } from 'react';
import { Booking } from '../types';
import { 
  Users, CheckCircle2, AlertCircle, Sparkles, Trash2, 
  Search, Filter, Lock, LogOut, Check, FileDown, 
  Terminal, ShieldCheck, Download, Code, Globe
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, newStatus: 'Pending' | 'Confirmed' | 'Completed') => void;
  onDeleteBooking: (id: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ 
  bookings, 
  onUpdateStatus, 
  onDeleteBooking, 
  onLogout 
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed'>('All');
  const [activeTab, setActiveTab] = useState<'bookings' | 'exporter'>('bookings');
  
  // Exporter copy notifications
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Statistics Computations
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  // Filter & Search Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const searchString = `${b.name} ${b.phone} ${b.email} ${b.id} ${b.date}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const triggerCopy = (filename: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(filename);
    setTimeout(() => {
      setCopiedFile(null);
    }, 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Pre-compiled direct static file codes matched strictly to the user specifications
  const getStaticHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tokyo Hibachi | Japanese & Hibachi Restaurant in Ithaca, NY</title>
  <meta name="description" content="Savor the finest Japanese dining, premium hibachi teppanyaki grill shows, and hand-crafted sushi at Tokyo Hibachi in Ithaca, NY. Easy online table reservations!">
  
  <!-- Open Graph / Sharing -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Tokyo Hibachi | Japanese & Hibachi Restaurant in Ithaca, NY">
  <meta property="og:description" content="Experience dazzling teppanyaki shows and prime sushi platters in a premium, warm environment beside South Meadow Street.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80">
  <meta property="og:url" content="https://tokyoithaca.github.io">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  
  <!-- SEO Font Awesome Styles -->
  <link rel="stylesheet" href="style.css">

  <!-- Restaurant Schema Markup JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Tokyo Hibachi",
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "722 S Meadow St",
      "addressLocality": "Ithaca",
      "addressRegion": "NY",
      "postalCode": "14850",
      "addressCountry": "US"
    },
    "telephone": "+16072778888",
    "email": "tokyoithaca@gmail.com",
    "priceRange": "$$",
    "servesCuisine": "Japanese, Hibachi, Sushi Coals, Asian Grill",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "14:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Friday", "Saturday"],
        "opens": "12:00",
        "closes": "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "12:00",
        "closes": "21:30"
      }
    ]
  }
  </script>
</head>
<body>

  <!-- Announcement Ticker -->
  <div class="announcement">
    🍣 EXPERIENCE ITHACA'S ULTIMATE SIZZLING HIBACHI PERFORMANCE • BOOK DIRECTLY ONLINE &nbsp; <a href="#reservation" class="announce-link">RESERVE NOW</a>
  </div>

  <!-- Header Section -->
  <header class="navbar">
    <div class="navbar-container">
      <a href="#" class="logo">
        <span class="logo-kanji">東京</span>
        <span class="logo-text">TOKYO <span class="accent">HIBACHI</span></span>
      </a>
      <nav class="nav-links" id="menuLinks">
        <a href="#about">About</a>
        <a href="#menu">Menu</a>
        <a href="#experience">The Experience</a>
        <a href="#hours">Hours & Location</a>
        <a href="#reviews">Reviews</a>
        <a href="#reservation" class="cta-nav">Table Booking</a>
        <a href="#admin" class="admin-link">Admin Access</a>
      </nav>
      <!-- Mobile toggler button -->
      <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </header>

  <!-- Hero Landing Section -->
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="hero-subtitle">PREMIER TEPPANYAKI & SUSHI BAR IN ITHACA</p>
      <h1>Sizzling Fires & Crafted Rolls</h1>
      <p class="hero-description">Welcome to Tokyo Hibachi, where fresh premium steaks, lobster, and house chef performance erupt on a 500°F teppan grill table.</p>
      <div className="hero-cta">
        <a href="#reservation" class="btn btn-primary">Book Teppanyaki Station</a>
        <a href="#menu" class="btn btn-secondary">Explore Our Menus</a>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="about">
    <div class="section-container">
      <div class="about-grid">
        <div class="about-text">
          <span class="section-tag font-mono">Our Heritage</span>
          <h2>The Art of Teppanyaki</h2>
          <p>Since establishing our grills at 722 S Meadow St, Tokyo Hibachi has defined Ithaca's premium dining scene, fusing ancient Japanese knife showmanship with high-quality USDA choice ribeyes, organic sea harvests, and traditional sake cups.</p>
          <div class="features">
            <div class="feat">🛡️ Premium USDA Steaks</div>
            <div class="feat">🍣 Chef-Grade Sushi Bar</div>
            <div class="feat">🔥 Family-Centered Dining</div>
          </div>
        </div>
        <div class="about-visual">
          <div class="video-placeholder">
            <span>🔥 LIVE TEPPANYAKI Grills Sizzling Active Daily</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Hibachi Experience Section -->
  <section id="experience" class="exp-section">
    <div class="section-container">
      <div class="title-block">
        <span class="section-tag font-mono">Interactive Teppan Gastronomy</span>
        <h2>Master Culinary Acts</h2>
      </div>
      <div class="exp-grid">
        <div class="exp-card">
          <span class="exp-icon">🔥</span>
          <h3>Flashing Onion Volcano</h3>
          <p>The fiery mountain tower engineered by our culinary masters. Erupts high-temp fireballs safely in real-time.</p>
        </div>
        <div class="exp-card">
          <span class="exp-icon">🦐</span>
          <h3>Flying Shrimp Catch</h3>
          <p>Lively shrimp tossing exercises testing guest reflexes and catching precision directly at your workspace seats.</p>
        </div>
        <div class="exp-card">
          <span class="exp-icon">🥩</span>
          <h3>Spiced Butter Garlic Sear</h3>
          <p>The rhythmic musical tap-dancing spatulas searing local NY meats inside aromatic garlic butter.</p>
        </div>
        <div class="exp-card">
          <span class="exp-icon">💖</span>
          <h3>Heart-Shaped Fried Rice</h3>
          <p>Gently sculpted savory fried rice heartbeat drums, perfect for anniversaries, couples, and family birthdays.</p>
        </div>
      </div>
    </div>
  </section>

  {/* Authentic Menu Section */}
  <section id="menu" class="menu-section">
    <div class="section-container">
      <div class="title-block">
        <span class="section-tag font-mono">Cuisine Categories</span>
        <h2>The Sizzling Menu Selection</h2>
      </div>
      <div class="menu-category-tabs">
        <button class="tab-btn active" onclick="switchCategory('hibachi')">Hibachi Dinners</button>
        <button class="tab-btn" onclick="switchCategory('sushi')">Specialty Rolls</button>
        <button class="tab-btn" onclick="switchCategory('starters')">Appetizers</button>
      </div>

      <div class="menu-items-grid active-cat" id="menu-hibachi">
        <div class="menu-card">
          <div class="menu-header"><h4>Hibachi Chicken Dinner</h4> <span class="price">$22.95</span></div>
          <p>Grilled with gourmet garlic oil, seasoned in butter salt. Includes fried rice & soup.</p>
        </div>
        <div class="menu-card">
          <div class="menu-header"><h4>Hibachi NY Strip Steak</h4> <span class="price">$28.95</span></div>
          <p>Prime aged choice strip steak cooked cleanly to temperature.</p>
        </div>
        <div class="menu-card">
          <div class="menu-header"><h4>Imperial Filet Mignon</h4> <span class="price">$34.95</span></div>
          <p>Center-cut premium tenderloin steak that melts deliciously.</p>
        </div>
        <div class="menu-card">
          <div class="menu-header"><h4>Land & Sea Express Combo</h4> <span class="price">$38.95</span></div>
          <p>Chicken breast, strip steak, and colossal coastal sea shrimp combo.</p>
        </div>
      </div>

      <div class="menu-items-grid hidden" id="menu-sushi">
        <div class="menu-card">
          <div class="menu-header"><h4>Spicy Volcano Roll</h4> <span class="price">$15.95</span></div>
          <p>Tuna avocado roll baked with premium scallop-crab crabmeat dynamites.</p>
        </div>
        <div class="menu-card">
          <div class="menu-header"><h4>Ithaca Dragon Roll</h4> <span class="price">$14.95</span></div>
          <p>Eel cucumber inside wrapped under avocado arrays, unagi dressing.</p>
        </div>
      </div>

      <div class="menu-items-grid hidden" id="menu-starters">
        <div class="menu-card">
          <div class="menu-header"><h4>Crispy Gyoza (6pcs)</h4> <span class="price">$7.95</span></div>
          <p>Crispy fried dumplings paired under citrus ponzu garlic dips.</p>
        </div>
        <div class="menu-card">
          <div class="menu-header"><h4>Sea Salt Garlic Edamame</h4> <span class="price">$6.95</span></div>
          <p>Steamed soy pads rolled in warm toasted garlic, flaked mineral salt.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Reservation Section -->
  <section id="reservation" class="reserve-section">
    <div class="section-container max-width-small">
      <div class="title-block">
        <span class="section-tag font-mono">Teppanyaki Slots</span>
        <h2>Instantly Request Slots online</h2>
      </div>
      
      <div id="bookingResult" class="hide result-box"></div>

      <form id="bookForm" onsubmit="submitLocalBooking(event)">
        <div class="form-row">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="custName" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" id="custPhone" required placeholder="(607) 123-4567">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="custEmail" required placeholder="john@gmail.com">
          </div>
          <div class="form-group">
            <label>Guests Size</label>
            <select id="custGuests">
              <option value="1">1 Person</option>
              <option value="2" selected>2 Guests</option>
              <option value="4">4 Guests</option>
              <option value="6">6 Guests</option>
              <option value="8">8 Guests</option>
              <option value="10">10 Guests</option>
              <option value="15">15 Guests (Teppanyaki limit)</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Reservation Date</label>
            <input type="date" id="custDate" required>
          </div>
          <div class="form-group">
            <label>Dining Time</label>
            <input type="time" id="custTime" required>
          </div>
        </div>
        <div class="form-group">
          <label>Special Celebration Notes / Dietary requests</label>
          <textarea id="custRequest" rows="3" placeholder="Birthday celebration request, high chairs, GF requirements..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-full">Request Table Booking</button>
      </form>
    </div>
  </section>

  <!-- Opening Hours & Maps -->
  <section id="hours" class="hours-section">
    <div class="section-container">
      <div class="hours-grid">
        <div class="hours-card">
          <span class="section-tag font-mono">Dining Schedule</span>
          <h2>Opening Hours</h2>
          <div class="hours-row"><span>Monday – Thursday</span> <strong>2:00 PM – 10:00 PM</strong></div>
          <div class="hours-row"><span>Friday – Saturday</span> <strong>12:00 PM – 11:00 PM</strong></div>
          <div class="hours-row"><span>Sunday</span> <strong>12:00 PM – 9:30 PM</strong></div>
          <div class="hours-contact">
            📞 Call Direct: <a href="tel:6072778888" class="gold">(607) 277-8888</a>
          </div>
        </div>
        <div class="location-card">
          <span class="section-tag font-mono">Our Location</span>
          <h2>Tokyo Hibachi Ithaca</h2>
          <p>Find us in the Meadow Court plaza at:</p>
          <p class="address">📍 722 S Meadow St, Ithaca, NY 14850</p>
          <a href="https://maps.google.com/?q=722+S+Meadow+St,+Ithaca,+NY+14850" target="_blank" class="btn btn-secondary w-full">Get Google Navigation GPS</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Customer Reviews Section -->
  <section id="reviews" class="reviews-section">
    <div class="section-container">
      <div class="title-block">
        <span class="section-tag font-mono">Community Love</span>
        <h2>Patron Reviews & Stars</h2>
      </div>
      <div class="reviews-grid" id="reviewsContainer">
        <!-- Dyn contents go here -->
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <footer class="footer">
    <div class="section-container align-center">
      <h2>Tokyo Hibachi</h2>
      <p>Ithaca's Premier Asian Steakhouse & Teppanyaki Lounge</p>
      <p class="email">📩 Email support: tokyoithaca@gmail.com | ☎️ Phone: (607) 277-8888</p>
      <p class="terms">© 2026 Tokyo Hibachi. All rights reserved. Open-source under GitHub Pages.</p>
    </div>
  </footer>

  <!-- Admin Anchor Container -->
  <section id="admin" class="admin-panel-section bg-dark">
    <div class="section-container max-width-small">
      <div class="admin-shield text-center">
        <h2>Admin Management Portal</h2>
        <p class="notice">Enter security credentials to monitor incoming tables and statuses</p>
        <div id="adminLoginArea">
          <form onsubmit="handleStaticLogin(event)">
            <input type="text" id="adminUser" placeholder="Username" required class="w-full">
            <input type="password" id="adminPass" placeholder="Password" required class="w-full">
            <button type="submit" class="btn btn-secondary w-full">Access Admin Suite</button>
          </form>
        </div>
        <div id="adminPanelResult" class="hide">
          <div class="stats-grid">
            <div class="stat-box">Total: <b id="statTotal">0</b></div>
            <div class="stat-box">Confirmed: <b id="statConfirm">0</b></div>
          </div>
          <div class="table-container shadow">
            <div id="bookingsListDiv">No bookings found inside localStorage.</div>
          </div>
          <button onclick="handleLogout()" class="btn btn-danger font-mono font-bold uppercase py-2 hover:bg-red-500">Log Out</button>
        </div>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>`;
  };

  const getStaticCSS = () => {
    return `/* Tokyo Hibachi Static CSS Stylesheet */
:root {
  --bg-dark: #090909;
  --bg-card: #121212;
  --gold: #d4af37;
  --gold-hover: #bda13e;
  --crimson: #e53e3e;
  --text-white: #f7f7f7;
  --text-muted: #9f9f9f;
  --border: #222222;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-white);
}

.announcement {
  background: linear-gradient(90deg, #8b1e1e, #0e111d);
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  padding: 10px;
  letter-spacing: 0.05em;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.announce-link {
  color: var(--gold);
  text-decoration: none;
  font-weight: bold;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(9, 9, 9, 0.95);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  text-decoration: none;
  font-family: 'Playfair Display', serif;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.logo-kanji {
  background-color: var(--crimson);
  color: white;
  font-size: 14px;
  padding: 4px 6px;
  font-weight: bold;
  border-radius: 4px;
}

.logo-text {
  font-size: 18px;
  letter-spacing: 0.1em;
  font-weight: 700;
}

.logo-text .accent {
  color: var(--gold);
}

.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-links a:hover {
  color: var(--gold);
}

.cta-nav {
  background-color: var(--gold);
  color: #000 !important;
  font-weight: bold !important;
  padding: 8px 16px;
  border-radius: 6px;
}

.mobile-toggle {
  display: none;
  background: none;
  color: var(--gold);
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.hero {
  height: 80vh;
  background-image: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}

.hero-content {
  max-width: 800px;
}

.hero-subtitle {
  color: var(--gold);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  margin-bottom: 20px;
  font-weight: bold;
}

.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero-description {
  color: var(--text-muted);
  font-size: 16px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 12px 30px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--gold);
  color: #000;
}

.btn-primary:hover {
  background-color: var(--gold-hover);
}

.btn-secondary {
  border: 1px solid var(--border);
  color: #fff;
  background-color: transparent;
}

.btn-secondary:hover {
  background-color: rgba(255,255,255,0.05);
}

.btn-danger {
  background-color: var(--crimson);
  color: #fff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
}

.max-width-small {
  max-width: 700px;
}

.section-tag {
  color: var(--gold);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
}

.title-block {
  text-align: center;
  margin-bottom: 60px;
}

.title-block h2 {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  margin-top: 10px;
}

/* About Layout */
.about-grid {
  display: grid;
  grid-template-cols: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about h2 {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.about p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 30px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feat {
  font-size: 14px;
  font-weight: 500;
}

.video-placeholder {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  height: 350px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--gold);
}

/* Experience Cards */
.exp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.exp-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 30px;
  border-radius: 12px;
  transition: transform 0.3s, border-color 0.3s;
}

.exp-card:hover {
  transform: translateY(-5px);
  border-color: var(--gold);
}

.exp-icon {
  font-size: 32px;
  margin-bottom: 20px;
  display: block;
}

.exp-card h3 {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  margin-bottom: 15px;
}

.exp-card p {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.6;
}

/* Menu selection */
.menu-category-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
}

.tab-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 10px 24px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 6px;
  cursor: pointer;
}

.tab-btn.active {
  background-color: var(--gold);
  color: #000;
  border-color: var(--gold);
}

.menu-items-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.menu-items-grid.hidden {
  display: none !important;
}

.menu-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 25px;
  border-radius: 8px;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.menu-header h4 {
  font-size: 16px;
  font-weight: 600;
}

.price {
  color: var(--gold);
  font-weight: bold;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}

.menu-card p {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.5;
}

/* Forms styling */
form {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 40px;
  border-radius: 12px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group input, .form-group select, .form-group textarea {
  background-color: var(--bg-dark);
  border: 1px solid #333;
  color: #fff;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--gold);
  outline: none;
}

label {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  text-transform: uppercase;
}

.result-box {
  background-color: rgba(212,175,55,0.1);
  border: 1px solid var(--gold);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.6;
}

.hide {
  display: none !important;
}

/* Hours section */
.hours-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.hours-card, .location-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 40px;
  border-radius: 12px;
}

.hours-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.hours-contact {
  margin-top: 30px;
  font-size: 14px;
}

.gold {
  color: var(--gold);
  text-decoration: none;
  font-weight: bold;
}

.address {
  font-weight: bold;
  margin: 15px 0 30px 0;
  font-size: 16px;
}

/* Reviews styles */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.rev-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 25px;
  border-radius: 12px;
}

.rev-stars {
  color: var(--gold);
  margin-bottom: 10px;
}

.rev-card p {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 15px;
}

.rev-author {
  font-size: 12px;
  font-weight: bold;
}

/* Admin shield */
.admin-shield {
  background-color: #0b0b0b;
  border: 1px solid var(--crimson);
  padding: 40px;
  border-radius: 16px;
}

.admin-shield h2 {
  font-family: 'Playfair Display', serif;
  color: var(--crimson);
  margin-bottom: 10px;
}

.notice {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.stat-box {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 15px;
  border-radius: 8px;
  font-size: 13px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
}

th {
  background-color: var(--bg-card);
  color: var(--gold);
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}

.badge-pending { background-color: rgba(212,175,55,0.15); color: var(--gold); }
.badge-confirmed { background-color: rgba(0,255,100,0.1); color: #48bb78; }

.footer {
  background-color: #050505;
  border-top: 1px solid var(--border);
  padding: 60px 20px;
  text-align: center;
}

.footer h2 {
  font-family: 'Playfair Display', serif;
  margin-bottom: 15px;
}

.footer p {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 10px;
}

.terms {
  font-size: 11px !important;
  color: #444 !important;
  margin-top: 30px;
}

/* Responsive constraints */
@media (max-width: 768px) {
  .navbar-container { padding: 15px 20px; }
  .nav-links { display: none; }
  .mobile-toggle { display: block; }
  .hero h1 { font-size: 32px; }
  .about-grid, .hours-grid, .menu-items-grid { grid-template-cols: 1fr; }
  .form-row { flex-direction: column; gap: 0; }
}
`;
  };

  const getStaticJS = () => {
    return `/* Tokyo Hibachi Booking & Admin JS Logic */

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
      card.innerHTML = \`<div class="rev-stars">\${'★'.repeat(r.rating)}\${'☆'.repeat(5-r.rating)}</div>
      <p>"\${r.text}"</p>
      <div class="rev-author">\${r.name}</div>\`;
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
  box.innerHTML = \`✨ <strong>Tables Seat Requested!</strong><br>
  Thank you, <strong>\${name}</strong>. Your request is registered under Reference: <strong>\${bId}</strong>.<br>
  Size: \${guests} Guests | Date: \${date} | Time: \${time}<br>
  <em>Status: Pending Admin Confirmation. Find this record in the Admin logs below.</em>\`;

  // Reset inputs
  document.getElementById('bookForm').reset();
  refreshBookingsTable();
}

/* Static Admin Security Rules & Control Loops */
/* SECURITY EXPLANATION GUIDELINE: Change credentials to protect layout */
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

  let tableHtml = \`<table>
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
    <tbody>\`;

  currentList.forEach((b, i) => {
    const badgeClass = b.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending';
    tableHtml += \`<tr>
      <td><strong>\${b.id}</strong></td>
      <td>\${b.name}<br><small style="color:#777 font-size:10px">\${b.phone}</small></td>
      <td>\${b.guests}</td>
      <td>\${b.date}<br><small style="color:#777">\${b.time}</small></td>
      <td><span class="badge \${badgeClass}">\${b.status}</span></td>
      <td>
        <button style="background:none border:1px solid #c29d2c text-align:center font-size:10px padding:2px 6px border-radius:4px color:#fff cursor:pointer" onclick="toggleBookingStatus('\${b.id}')">Toggle Code</button>
        <button style="background:none border:1px solid var(--crimson) font-size:10px padding:2px 6px border-radius:4px color:var(--crimson) cursor:pointer" onclick="deleteLocalBooking('\${b.id}')">Del</button>
      </td>
    </tr>\`;
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
`;
  };

  return (
    <section id="admin" className="py-24 bg-shimmer bg-zinc-950 border-t border-zinc-900 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-zinc-900 pb-6 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-mono tracking-widest text-xs uppercase font-semibold">
                Administrative Control Panel
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white font-semibold">
              Tokyo Hibachi Management Portal
            </h2>
          </div>

          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'bookings'
                  ? 'bg-gold-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Bookings Logs
            </button>
            <button
              onClick={() => setActiveTab('exporter')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'exporter'
                  ? 'bg-gold-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Static Exporter (GitHub Pages)
            </button>
          </div>
        </div>

        {activeTab === 'bookings' ? (
          <div>
            {/* Metric Board */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                  TOTAL BOOKINGS REQUESTED
                </span>
                <span className="text-3xl font-mono text-white font-bold block">{totalBookings}</span>
              </div>
              
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 block mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> PENDING TICKETS
                </span>
                <span className="text-3xl font-mono text-amber-400 font-bold block">{pendingCount}</span>
                <div className="absolute right-0 bottom-0 h-1.5 w-full bg-amber-500/20" />
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> SEATS CONFIRMED
                </span>
                <span className="text-3xl font-mono text-emerald-400 font-bold block">{confirmedCount}</span>
                <div className="absolute right-0 bottom-0 h-1.5 w-full bg-emerald-500/20" />
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                  COMPLETED SERVICE
                </span>
                <span className="text-3xl font-mono text-zinc-300 font-bold block">{completedCount}</span>
              </div>
            </div>

            {/* Filter Suite */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search patron name, email, phone, reference..."
                  id="admin-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-sans"
                />
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-850 shrink-0">
                  {(['All', 'Pending', 'Confirmed', 'Completed'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setStatusFilter(lvl)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                        statusFilter === lvl
                          ? 'bg-zinc-800 text-white font-black'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              {filteredBookings.length === 0 ? (
                <div className="py-16 text-center text-zinc-550">
                  <Lock className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm font-medium">No dining reservations found</p>
                  <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                    Try placing an online booking in the reservation section above. It will register instantly here!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-400 font-mono tracking-wider border-b border-zinc-850 uppercase text-[10px]">
                        <th className="py-4 px-5 font-semibold">Booking ID</th>
                        <th className="py-4 px-5 font-semibold">Patron Details</th>
                        <th className="py-4 px-5 font-semibold">Party</th>
                        <th className="py-4 px-5 font-semibold">Date & Time</th>
                        <th className="py-4 px-5 font-semibold">Special Requests</th>
                        <th className="py-4 px-5 font-semibold">Status Badge</th>
                        <th className="py-4 px-5 font-semibold text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-950/40 transition-colors">
                          <td className="py-4 px-5 font-mono text-gold-400 font-semibold select-all">
                            {b.id}
                          </td>
                          <td className="py-4 px-5 font-sans">
                            <span className="text-white font-medium block">
                              {b.name}
                            </span>
                            <span className="text-zinc-400 text-[10px] block font-mono mt-0.5">
                              {b.phone}
                            </span>
                            <span className="text-zinc-500 text-[10px] mt-0.5 block truncate max-w-xs">
                              {b.email}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-white font-medium">
                            {b.guests} Guests
                          </td>
                          <td className="py-4 px-5 font-sans">
                            <span className="text-white block">
                              {b.date}
                            </span>
                            <span className="text-gold-400 font-mono text-[10px] block mt-0.5 font-semibold">
                              {b.time}
                            </span>
                          </td>
                          <td className="py-4 px-5 max-w-xs">
                            {b.specialRequest ? (
                              <p className="text-zinc-350 text-[11px] leading-relaxed bg-zinc-950/60 p-2 border border-zinc-850 rounded truncate hover:whitespace-normal cursor-help" title={b.specialRequest}>
                                "{b.specialRequest}"
                              </p>
                            ) : (
                              <span className="text-zinc-600 font-mono italic text-[10px]">No request</span>
                            )}
                          </td>
                          <td className="py-4 px-5">
                            <span className={`inline-flex px-2 py-1 roundedtext-[10px] font-bold uppercase rounded ${
                              b.status === 'Completed'
                                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                                : b.status === 'Confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-505/20'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right font-sans">
                            <div className="flex items-center justify-end gap-2">
                              {/* Cycle through booking status states */}
                              <select
                                value={b.status}
                                onChange={(e) => onUpdateStatus(b.id, e.target.value as any)}
                                className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-gold-400 font-semibold uppercase"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                              </select>

                              {/* Delete button */}
                              <button
                                onClick={() => onDeleteBooking(b.id)}
                                className="p-1 text-red-500 hover:bg-red-500/15 border border-transparent hover:border-red-500/25 rounded transition-all"
                                title="Delete Booking"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* GitHub Pages Code exporter block */
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-left space-y-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-gold-400 font-serif font-semibold text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gold-400" /> Standalone Static Build Ready
                </h3>
                <p className="text-zinc-400 text-xs max-w-2xl leading-normal">
                  These optimized, plain, non-framework source files are fully self-contained (no servers/node needed). You can host them directly on <strong>GitHub Pages</strong>, Netlify, or any static hosting cloud. Local storage handles the database automatically!
                </p>
              </div>

              {/* Master zip placeholder download or layout instruction info */}
              <div className="shrink-0 flex gap-3">
                <button
                  onClick={() => downloadAllFiles()}
                  className="px-4 py-2 bg-gold-400 hover:bg-gold-300 text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" /> Download Files Kit
                </button>
              </div>
            </div>

            {/* Grid for Index.html, Style.css, and Script.js codes */}
            <div className="space-y-6 text-left">
              {/* File 1: Index.html code display */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="font-mono text-zinc-300 text-xs font-semibold">index.html (HTML/SEO/Schema)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerCopy('index.html', getStaticHTML())}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-gold-400 font-mono text-[10px] rounded font-bold border border-zinc-700 flex items-center gap-1"
                    >
                      {copiedFile === 'index.html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
                      {copiedFile === 'index.html' ? 'COPIED!' : 'COPY CODE'}
                    </button>
                    <button 
                      onClick={() => downloadFile('index.html', getStaticHTML())}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 rounded border border-zinc-700"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-60 overflow-y-auto font-mono text-[10px] text-zinc-450 leading-relaxed scrollbar">
                  <pre>{getStaticHTML()}</pre>
                </div>
              </div>

              {/* File 2: Style.css */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500/80" />
                    <span className="font-mono text-zinc-300 text-xs font-semibold">style.css (Japanese Aesthetic styles)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerCopy('style.css', getStaticCSS())}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-gold-400 font-mono text-[10px] rounded font-bold border border-zinc-700 flex items-center gap-1"
                    >
                      {copiedFile === 'style.css' ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
                      {copiedFile === 'style.css' ? 'COPIED!' : 'COPY CODE'}
                    </button>
                    <button 
                      onClick={() => downloadFile('style.css', getStaticCSS())}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 rounded border border-zinc-700"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-60 overflow-y-auto font-mono text-[10px] text-zinc-450 leading-relaxed scrollbar">
                  <pre>{getStaticCSS()}</pre>
                </div>
              </div>

              {/* File 3: Script.js */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="font-mono text-zinc-300 text-xs font-semibold">script.js (Client Database & Validation engine)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerCopy('script.js', getStaticJS())}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-gold-400 font-mono text-[10px] rounded font-bold border border-zinc-700 flex items-center gap-1"
                    >
                      {copiedFile === 'script.js' ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
                      {copiedFile === 'script.js' ? 'COPIED!' : 'COPY CODE'}
                    </button>
                    <button 
                      onClick={() => downloadFile('script.js', getStaticJS())}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 rounded border border-zinc-700"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-60 overflow-y-auto font-mono text-[10px] text-zinc-450 leading-relaxed scrollbar">
                  <pre>{getStaticJS()}</pre>
                </div>
              </div>
            </div>

            {/* Instructions box */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-left space-y-3">
              <h4 className="text-white text-sm font-semibold uppercase font-mono text-gold-400">
                🚀 GitHub Pages Deployment Steps:
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-zinc-400 leading-relaxed font-sans">
                <li>Create a <strong>new GitHub repository</strong> named e.g., <code className="bg-zinc-900 text-gold-400 px-1.5 py-0.5 rounded font-mono">tokyo-hibachi-ithaca</code>. Make it Public.</li>
                <li>Download or Copy each file above individually, saving them into a single local directory as <code className="text-white">index.html</code>, <code className="text-white">style.css</code>, and <code className="text-white">script.js</code>.</li>
                <li>Upload these 3 files directly into the root folder of your newly initialized GitHub repository.</li>
                <li>In your repository browser dashboard, go to <strong>Settings</strong> &gt; <strong>Pages</strong> (in the left-hand menu).</li>
                <li>Under <strong>Build and deployment</strong>, select the Source: <strong>Deploy from a branch</strong>. Selection branch: <strong>main / (root)</strong>. Click <strong>Save</strong>.</li>
                <li>Wait 30-60 seconds, and refresh the tab. GitHub will publish your elegant showcase link at <code className="text-gold-400">https://yourusername.github.io/tokyo-hibachi-ithaca/</code>!</li>
              </ol>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-8 border-t border-zinc-900 mt-10">
          <button
            onClick={onLogout}
            className="px-6 py-2.5 bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 text-xs font-mono font-semibold uppercase tracking-widest rounded-lg border border-zinc-800 hover:border-red-500/20 transition-all flex items-center gap-1.5 shadow"
          >
            <LogOut className="w-3.5 h-3.5" /> Secure Log Out
          </button>
        </div>
      </div>
    </section>
  );

  function downloadAllFiles() {
    downloadFile('index.html', getStaticHTML());
    downloadFile('style.css', getStaticCSS());
    downloadFile('script.js', getStaticJS());
  }
}
