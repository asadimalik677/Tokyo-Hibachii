import React, { useState, useEffect } from 'react';
import { 
  Flame, MapPin, Phone, Clock, Mail, Star, Lock, Unlock, 
  Calendar, ChevronRight, Plus, Compass, Heart, Sparkles, 
  Menu, X, Check, Utensils, Award, BookOpen, UserCheck, Eye,
  Search, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, Review } from './types';
import { menuCategories, menuItems } from './menuData';
import HibachiExperience from './components/HibachiExperience';
import ReservationForm from './components/ReservationForm';
import AdminDashboard from './components/AdminDashboard';
import ForumBoard from './components/ForumBoard';

// ==========================================
// ADMIN CREDENTIALS CONFIGURATION:
// Feel free to modify the username and password values below to secure your portal!
// ==========================================
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'ChangeMe123!';

const categoryHighlights: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}> = {
  appetizers: {
    title: 'The Art of Starters',
    subtitle: '🥟 Warm Delicacies',
    description: 'Crisp spring rolls, pan-fried gyoza pouches, and succulent tempura oysters chosen by our master chefs to awaken your palate.',
    image: '/src/assets/images/teppanyaki_flaming_volcano_1780474158116.png'
  },
  soup: {
    title: 'Simmered Broths',
    subtitle: '🥣 Traditional Kettle',
    description: 'Deep and delicate miso soups, lemongrass infused tom yum bowls, and clear button-mushroom teas.',
    image: '/src/assets/images/modern_hibachi_lounge_1780474136358.png'
  },
  salad: {
    title: 'Crisp & Wholesome',
    subtitle: '🥗 Garden Greens',
    description: 'Fresh seaweed shreds, spicy kani ribbons, and toasted sesame-crusted tuna over organic baby crops.',
    image: '/src/assets/images/premium_sushi_rolls_1780474182317.png'
  },
  sushisashimialacarte: {
    title: 'Nigiri & Raw Slices',
    subtitle: '🍣 Sashimi Carves',
    description: 'Sashimi-grade ocean-fresh salmon, yellowtail, fat unagi, and bluefin tuna served by individual handcrafted pieces.',
    image: '/src/assets/images/premium_sushi_rolls_1780474182317.png'
  },
  classicrollandhandroll: {
    title: 'Classic Hand Rolls',
    subtitle: '🌯 Seaweed Treasures',
    description: 'Finest spicy salmon, crunchy shrimp tempura, and English cucumber wrapped snugly in toasted nori.',
    image: '/src/assets/images/premium_sushi_rolls_1780474182317.png'
  },
  signaturerolls: {
    title: 'Chef Special Rolls',
    subtitle: '🐉 Majestic Dragons',
    description: 'Plump volcano rolls dripping in dynamic spicy dynamite cream, and Ithaca-inspired Finger Lakes masterpieces.',
    image: '/src/assets/images/premium_sushi_rolls_1780474182317.png'
  },
  sushibarentrees: {
    title: 'The Sushi Banquet',
    subtitle: '🍱 Imperial Feasts',
    description: 'Vast wooden boats and bento boxes loaded with selected nigiris, custom sashimis, and classic spicy roll pairings.',
    image: '/src/assets/images/premium_sushi_rolls_1780474182317.png'
  },
  riceandnoodles: {
    title: 'Wok Sizzled Staples',
    subtitle: '🍜 Comfort Skillets',
    description: 'Stir-fried pad thais, rich broth ramen, and savory soy-slicked yaki udon pan-seared over scorching heat.',
    image: '/src/assets/images/teppanyaki_flaming_volcano_1780474158116.png'
  },
  kitchenentrees: {
    title: 'Simmered & Seared',
    subtitle: '🍛 Teriyaki Glazes',
    description: 'Hickory-seared short ribs, crisp pork katsu cutlets, and thick green curries stewed in coconut milk.',
    image: '/src/assets/images/modern_hibachi_lounge_1780474136358.png'
  },
  hibachidinners: {
    title: 'Teppanyaki Masterly',
    subtitle: '🔥 Theatrical Flames',
    description: 'Premium center-cut beef tenderloin, whole twin lobster tails, and giant shrimp seared live with garlic butter.',
    image: '/src/assets/images/teppanyaki_flaming_volcano_1780474158116.png'
  },
  drinks: {
    title: 'Ceremonial Sips',
    subtitle: '🍶 Sake & Refresher',
    description: 'Organic iced mango teas, fizzy ramune bottles, and premium warm Junmai Daiginjo flasks to lift your spirits.',
    image: '/src/assets/images/modern_hibachi_lounge_1780474136358.png'
  },
  dessert: {
    title: 'Sweets & Confections',
    subtitle: '🍰 Golden Endings',
    description: 'Crunchy sweet banana tempura baskets and caramelized katsu cream cheese to conclude a pristine feast.',
    image: '/src/assets/images/teppanyaki_flaming_volcano_1780474158116.png'
  }
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState('appetizers');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [searchGlobal, setSearchGlobal] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // App primary states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Custom review form states
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Load reviews & bookings
  useEffect(() => {
    // 1. Initial Booking Setup
    const savedBookings = localStorage.getItem('tokyo_hibachi_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      // Pre-fill mock bookings for spectacular demo visuals
      const initialBookings: Booking[] = [
        {
          id: 'TH-2849',
          name: 'Marcus Vander',
          phone: '(607) 345-9821',
          email: 'mvander88@cornell.edu',
          date: '2026-06-05',
          time: '18:30',
          guests: 4,
          specialRequest: 'Celebrating daughters 16th birthday. She would love the Onion Volcano fire show!',
          status: 'Pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 'TH-5742',
          name: 'Sarah Peterson',
          phone: '(607) 555-8833',
          email: 'sarah.peterson@gmail.com',
          date: '2026-06-04',
          time: '19:00',
          guests: 6,
          specialRequest: 'Vegetarian and Gluten-Free accommodations needed for two guests.',
          status: 'Confirmed',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'TH-1192',
          name: 'David Gold',
          phone: '(315) 234-9988',
          email: 'dgold_ithaca@outlook.com',
          date: '2026-06-02',
          time: '20:15',
          guests: 2,
          specialRequest: 'Anniversary celebration. Quiet table requested.',
          status: 'Completed',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      localStorage.setItem('tokyo_hibachi_bookings', JSON.stringify(initialBookings));
      setBookings(initialBookings);
    }

    // 2. Initial Reviews Setup
    const savedReviews = localStorage.getItem('tokyo_hibachi_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Pre-fill gorgeous customer testimonials
      const initialReviews: Review[] = [
        {
          id: 'r1',
          name: 'Dr. Evelyn Clark',
          rating: 5,
          comment: 'Absolutely stunning performance by Chef Kenji! The onion volcano was the biggest fire show I have seen. Searing ribeye steak was so tender, and the Yum Yum sauce is elite. Ithaca\'s premier Japanese dining room!',
          date: 'May 28, 2026',
          verified: true
        },
        {
          id: 'r2',
          name: 'Brendan S. (Cornell Student)',
          rating: 5,
          comment: 'Amazing place to celebrate birthdays! The flying shrimp catch challenge was so much fun—I actually caught it in my mouth! Sizable portions, robust ginger dressing, and amazing hospitality.',
          date: 'May 25, 2026',
          verified: true
        },
        {
          id: 'r3',
          name: 'Meera Patel',
          rating: 4,
          comment: 'Splendid hand-crafted sushi. The Ithaca Dragon roll had the perfect sweetness from the unagi glaze and very fresh avocado. Be sure to book your teppanyaki tables online because they fill up fast.',
          date: 'May 19, 2026',
          verified: true
        }
      ];
      localStorage.setItem('tokyo_hibachi_reviews', JSON.stringify(initialReviews));
      setReviews(initialReviews);
    }

    // 3. Admin session check
    const adminSessionFlag = sessionStorage.getItem('tokyo_hibachi_admin_logged');
    if (adminSessionFlag === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Listen for hidden url triggers (#wp-admin or #admin)
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash === '#wp-admin' || hash === '#admin') {
        setShowLoginModal(true);
      }
    };
    
    // Check on register
    handleHashCheck();
    
    // Register listener
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  // Update lists and persist
  const refreshBookingsState = () => {
    const list = JSON.parse(localStorage.getItem('tokyo_hibachi_bookings') || '[]');
    setBookings(list);
  };

  const handleBookingStatusChange = (id: string, newStatus: 'Pending' | 'Confirmed' | 'Completed') => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookings(updated);
    localStorage.setItem('tokyo_hibachi_bookings', JSON.stringify(updated));
  };

  const handleBookingDelete = (id: string) => {
    if (confirm(`Are you sure you want to permanently delete booking request ${id}?`)) {
      const filtered = bookings.filter(b => b.id !== id);
      setBookings(filtered);
      localStorage.setItem('tokyo_hibachi_bookings', JSON.stringify(filtered));
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (adminUsername === DEFAULT_ADMIN_USER && adminPassword === DEFAULT_ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('tokyo_hibachi_admin_logged', 'true');
      setShowLoginModal(false);
      setAdminUsername('');
      setAdminPassword('');
      
      // Cleanly clear hash from the browser address bar
      window.history.pushState(null, "", window.location.pathname);
      
      // Auto scroll down to the dashboard
      setTimeout(() => {
        const dash = document.getElementById('admin');
        if (dash) dash.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      setAdminError('Invalid administrator credentials.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('tokyo_hibachi_admin_logged');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `r-${Date.now()}`,
      name: newReviewName.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: false
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('tokyo_hibachi_reviews', JSON.stringify(updatedReviews));

    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const isSearching = menuSearchQuery.trim().length > 0;

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen relative font-sans selection:bg-gold-400 selection:text-black">
      {/* Absolute ambient lines and glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-red-950/10 via-zinc-950/20 to-zinc-950 pointer-events-none z-0" />
      <div className="bg-grid-decor opacity-15 fixed inset-0 pointer-events-none z-0" />

      {/* Sizzling Tonal Top Announcement Ticker */}
      <div className="bg-gradient-to-r from-red-900 via-zinc-950 to-red-950 border-b border-zinc-900 py-2.5 text-center text-xs font-mono tracking-widest text-[#f5eebd] relative z-50 px-4">
        ✨ JAPANESE CULINARY SHOWMANSHIP • MON-THU 2PM-10PM &nbsp;
        <a href="#reservation" className="text-gold-400 font-bold hover:underline ml-1">
          RESERVE SEATS ONLINE →
        </a>
      </div>

      {/* Navbar Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group relative">
            <span className="bg-red-600 text-white font-black px-2.5 py-1 text-sm rounded shadow-md group-hover:scale-105 transition-all font-sans">
              東京
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-widest text-white leading-none">
                TOKYO <span className="text-gold-400 group-hover:text-gold-300 transition-colors">HIBACHI</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mt-0.5">
                Steakhouse & Sushi Bar
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider uppercase font-semibold">
            <a href="#about" className="text-zinc-400 hover:text-gold-400 transition-colors">About</a>
            <a href="#menu" className="text-zinc-400 hover:text-gold-400 transition-colors">Menu</a>
            <a href="#experience" className="text-zinc-400 hover:text-gold-400 transition-colors">The Experience</a>
            <a href="#hours" className="text-zinc-400 hover:text-gold-400 transition-colors">Hours & Location</a>
            <a href="#forum" className="text-zinc-400 hover:text-gold-400 transition-colors">Diners Forum</a>
            <a href="#reviews" className="text-zinc-400 hover:text-gold-400 transition-colors">Reviews</a>
            <a 
              href="#reservation" 
              className="px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-black rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 font-bold shadow-md shadow-gold-950/15"
            >
              Request Table
            </a>
            
            {isAdminLoggedIn && (
              <a 
                href="#admin" 
                className="px-3.5 py-2 border border-emerald-500/30 text-emerald-400 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 font-bold animate-pulse text-xs"
              >
                <UserCheck className="w-3.5 h-3.5" /> Dashboard Live
              </a>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gold-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
            id="btn-mobile-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-zinc-950 border-b border-zinc-900 px-6 py-6 space-y-4 text-sm font-semibold tracking-wide uppercase font-mono relative z-50 text-center"
            >
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-400 hover:text-white py-2"
              >
                About Section
              </a>
              <a 
                href="#menu" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-400 hover:text-white py-2"
              >
                Menu Selection
              </a>
              <a 
                href="#experience" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-400 hover:text-white py-2"
              >
                The Experience
              </a>
              <a 
                href="#hours" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-400 hover:text-white py-2"
              >
                Hours & Navigation
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-400 hover:text-white py-2"
              >
                Patron Reviews
              </a>
              <a 
                href="#forum" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-400 hover:text-white py-3 border border-zinc-900 bg-zinc-950/40 rounded-lg text-gold-400 font-bold"
              >
                💬 Diners Club Forum
              </a>
              <a 
                href="#reservation" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 bg-gold-400 text-black rounded-lg font-bold"
              >
                Online Table Reservation
              </a>

              {isAdminLoggedIn && (
                <a 
                  href="#admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-emerald-400 border border-emerald-500/20 rounded bg-emerald-500/5 font-bold"
                >
                  Manage Bookings Dashboard
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION / LANDING */}
      <section className="relative px-4 md:px-8 py-20 lg:py-36 overflow-hidden min-h-[85vh] flex items-center justify-center bg-zinc-950 border-b border-zinc-900">
        <div className="absolute inset-0 bg-[url('/src/assets/images/modern_hibachi_lounge_1780474136358.png')] bg-cover bg-center opacity-[0.35] scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40 pointer-events-none" />
        
        {/* Dynamic decorative light flares */}
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-400 text-[10px] uppercase font-mono tracking-widest font-semibold font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Authentic Teppanyaki Steakhouse
            </span>
            <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mt-1">
              722 S Meadow St, Ithaca, NY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold text-white tracking-tight leading-[1.1]"
          >
            Sizzling Culinary <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-red-400">
              Showmanship & Artistry
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Experience a symphony of flame, taste, and laughter at Tokyo Hibachi. Master teppanyaki chefs sear premium steaks, coastal seafood, and fresh specialty rolls live right at your teppan table.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <a
              id="hero-book-cta"
              href="#reservation"
              className="w-full sm:w-auto px-8 py-4 bg-gold-400 hover:bg-gold-500 text-black font-semibold text-xs tracking-wider uppercase rounded-lg shadow-xl shadow-gold-950/20 hover:shadow-gold-950/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Book Sizzling Station Table
            </a>
            <a
              id="hero-menu-cta"
              href="#menu"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
            >
              Browse Dinners Menu <ChevronRight className="w-4 h-4 text-zinc-500" />
            </a>
          </motion.div>

          {/* Click to Call / Direct Contacts banner in hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 font-mono text-[11px] text-zinc-550 pt-10 border-t border-zinc-900/60 max-w-xl mx-auto"
          >
            <a href="tel:6072778888" className="hover:text-gold-400 transition-colors flex items-center gap-1.5 font-bold">
              <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" /> (607) 277-8888
            </a>
            <span className="text-zinc-800 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" /> 722 S Meadow St, Ithaca, NY
            </span>
          </motion.div>
        </div>
      </section>

      {/* SECTION: ABOUT TOKYO HIBACHI */}
      <section id="about" className="py-24 bg-zinc-950 px-4 md:px-8 border-b border-zinc-900 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-gold-400 font-mono uppercase tracking-widest text-xs block font-bold">
                Serving Ithaca Since Inception
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white tracking-tight leading-tight">
                Authentic Teppanyaki Culinary Heritage
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Nestled on <strong>South Meadow Street</strong> in beautiful Ithaca (beside Meadow Court), Tokyo Hibachi is a premium Japanese Steakhouse and Sushi Lounge celebrating the theatrical intersection of fire cooking and fine tastes.
              </p>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Our master chefs are formally trained artists. With rapid-fire spatulas, soaring shrimp captures, and breathtaking volcanic eruptions—they cook prime USDA strip steaks, sweet sea scallops, and fresh garlic rice directly on the built-in teppanyaki grills before your eyes.
              </p>

              {/* USP features array */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex gap-3">
                  <div className="text-gold-400"><Compass className="w-5 h-5 shrink-0" /></div>
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase font-mono tracking-wider">Premium Cuts Only</h4>
                    <p className="text-zinc-500 text-[11px] mt-0.5">USDA Choice steak beef, center filets, and jumbo seaside shrimp.</p>
                  </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex gap-3">
                  <div className="text-red-500"><Flame className="w-5 h-5 shrink-0" /></div>
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase font-mono tracking-wider">Flawless Fire Shows</h4>
                    <p className="text-zinc-500 text-[11px] mt-0.5">The legendary flaming volcano onion stack erupting at every table.</p>
                  </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex gap-3">
                  <div className="text-gold-400"><BookOpen className="w-5 h-5 shrink-0" /></div>
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase font-mono tracking-wider">Handmade Fresh Sushi</h4>
                    <p className="text-zinc-500 text-[11px] mt-0.5">Custom roll assemblies, fresh sashimi and local special Ithaca rolls.</p>
                  </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex gap-3">
                  <div className="text-rose-500"><Heart className="w-5 h-5 shrink-0" /></div>
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase font-mono tracking-wider">Perfect Family dining</h4>
                    <p className="text-zinc-500 text-[11px] mt-0.5">Comfortable teppan arrangements, birthday drums and laughter.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Graphic Collage */}
            <div className="lg:col-span-6 relative">
              <div className="bg-gradient-to-tr from-gold-400 via-amber-500 to-red-600 p-[1px] rounded-2xl glow-gold shadow-2xl">
                <div className="bg-zinc-950 rounded-2xl overflow-hidden p-3 relative">
                  <img 
                    src="/src/assets/images/teppanyaki_flaming_volcano_1780474158116.png" 
                    alt="Tokyo Hibachi Sizzling Teppanyaki Grill Chef Show" 
                    referrerPolicy="no-referrer"
                    className="w-full h-[400px] object-cover rounded-xl filter brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90 pointer-events-none" />
                  
                  {/* Absolute overlay visual */}
                  <div className="absolute bottom-8 left-8 right-8 bg-zinc-900/90 backdrop-blur border border-zinc-800 p-5 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-gold-400 text-[10px] tracking-widest uppercase block font-bold">
                        Teppan Grills Sizzling Live Daily
                      </span>
                      <h4 className="text-white font-serif font-medium text-base mt-0.5">
                        Reserve Your Front Row Seats
                      </h4>
                    </div>
                    <a 
                      id="about-cta-reserve"
                      href="#reservation" 
                      className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-black font-semibold text-xs rounded uppercase tracking-wider transition-colors inline-block"
                    >
                      Book Table
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INTEGRATED INTERACTIVE EXPERIENCES */}
      <HibachiExperience />

      {/* SECTION: MENU CATEGORIES & SELECTION */}
      <section id="menu" className="py-24 bg-zinc-950 px-4 md:px-8 border-b border-zinc-900 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-gold-400 font-mono tracking-widest text-xs uppercase block mb-3">
              東京鉄板焼・伝統の味 // AUTHENTIC TOKYO SIZZLE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white tracking-tight mb-4 animate-fade-in">
              The Fine Dining Menu Selection
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-xs md:text-sm">
              Discover a rich collection of hand-rolled specialty rolls, freshly seared sakes, and dramatic live teppanyaki grill dinners crafted fresh in Ithaca.
            </p>
          </div>

          {/* ELEGANT SEARCH & QUICK TAG FILTERS */}
          <div className="max-w-3xl mx-auto mb-10 bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:w-2/3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search rolls, noodles, drinks, dinners..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-xs pl-11 pr-10 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-400/50 focus:border-gold-400/50 placeholder-zinc-550 transition-all font-sans"
                />
                {menuSearchQuery && (
                  <button
                    onClick={() => setMenuSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Scope Toggles */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                  Search Scope:
                </span>
                <button
                  onClick={() => setSearchGlobal(!searchGlobal)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all ${
                    searchGlobal
                      ? 'bg-gold-400/10 border-gold-400/40 text-gold-400 font-extrabold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {searchGlobal ? '🌎 Entire Menu' : '📂 Current Category Only'}
                </button>
              </div>
            </div>

            {/* Quick Helper Filter Notice */}
            {menuSearchQuery.trim() && (
              <div className="mt-3 flex items-center justify-between text-[11px] font-sans text-zinc-500 border-t border-zinc-950/80 pt-3">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
                  <span>
                    Found <strong className="text-gold-400 font-mono">
                      {(() => {
                        const q = menuSearchQuery.toLowerCase().trim();
                        let total = 0;
                        Object.keys(menuItems).forEach(catId => {
                          if (!searchGlobal && catId !== activeCategory) return;
                          (menuItems[catId] || []).forEach(item => {
                            if (
                              item.name.toLowerCase().includes(q) ||
                              item.description.toLowerCase().includes(q) ||
                              (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
                            ) {
                              total++;
                            }
                          });
                        });
                        return total;
                      })()}
                    </strong> matching delicacies in {searchGlobal ? 'all categories' : `"${menuCategories.find(c => c.id === activeCategory)?.label}"`}
                  </span>
                </div>
                {searchGlobal && (
                  <button 
                    onClick={() => setSearchGlobal(false)}
                    className="text-gold-400 hover:underline text-[10px]"
                  >
                    Limit to selected tab
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Menu Selection Header Tabs/Buttons Grid */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                id={`tab-menu-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  // Keep search local if user prefers, else clear search to enjoy selected tab's items
                  if (!searchGlobal) setMenuSearchQuery('');
                }}
                className={`px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-gold-400 border-gold-400 text-black font-extrabold shadow-lg shadow-gold-950/25 scale-102'
                    : 'bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:border-zinc-800 hover:text-white hover:bg-zinc-900/90'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Category description text card */}
          {!menuSearchQuery.trim() && (
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <p className="text-gold-300 font-serif italic text-xs md:text-sm">
                "{menuCategories.find(c => c.id === activeCategory)?.description}"
              </p>
            </div>
          )}

          {/* Menu Items Grid with Animation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-6">
            {/* Featured Showcase Column (Left - 4 Cols) */}
            <div className="lg:col-span-4 h-full">
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden p-6 flex flex-col justify-between h-full relative group shadow-xl">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-bold block">
                    {categoryHighlights[activeCategory]?.subtitle || '✨ Selected Masterpiece'}
                  </span>
                  <h3 className="font-serif font-semibold text-white text-2xl leading-none">
                    {categoryHighlights[activeCategory]?.title || 'Gourmet Selection'}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                    {categoryHighlights[activeCategory]?.description || 'Each premium serving is crafted with accurate portioning, top-shelf ingredients, and fresh dressings.'}
                  </p>
                </div>

                <div className="relative h-64 rounded-xl overflow-hidden mt-6 border border-zinc-950 shadow-inner group">
                  <img
                    src={categoryHighlights[activeCategory]?.image || '/src/assets/images/modern_hibachi_lounge_1780474136358.png'}
                    alt="Featured culinary highlight plate"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-[9px] font-mono tracking-widest uppercase text-gold-400 bg-black/85 border border-zinc-800 px-2.5 py-1 rounded">
                    Chef Selected
                  </span>
                </div>
              </div>
            </div>

            {/* Menu List Grid - 8 Cols */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${menuSearchQuery}-${searchGlobal}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full content-start"
                >
                  {(() => {
                    const q = menuSearchQuery.toLowerCase().trim();
                    let itemsToRender: { item: any, catLabel: string }[] = [];

                    if (isSearching) {
                      Object.keys(menuItems).forEach(catId => {
                        if (!searchGlobal && catId !== activeCategory) return;
                        const cat = menuCategories.find(c => c.id === catId);
                        const catLabel = cat ? cat.label : catId;
                        (menuItems[catId] || []).forEach(item => {
                          if (
                            item.name.toLowerCase().includes(q) ||
                            item.description.toLowerCase().includes(q) ||
                            (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
                          ) {
                            itemsToRender.push({ item, catLabel });
                          }
                        });
                      });
                    } else {
                      const cat = menuCategories.find(c => c.id === activeCategory);
                      const catLabel = cat ? cat.label : activeCategory;
                      (menuItems[activeCategory] || []).forEach(item => {
                        itemsToRender.push({ item, catLabel });
                      });
                    }

                    if (itemsToRender.length === 0) {
                      return (
                        <div className="col-span-full py-20 px-6 bg-zinc-900/30 border border-zinc-900 rounded-2xl text-center flex flex-col items-center justify-center space-y-4">
                          <HelpCircle className="w-10 h-10 text-gold-400/50" />
                          <div>
                            <h4 className="text-white font-serif font-semibold text-lg">No Delicacy Matches your search</h4>
                            <p className="text-zinc-500 text-xs mt-1 max-w-sm">
                              No results found for "{menuSearchQuery}" in {searchGlobal ? 'the entire menu' : activeCategory}. Try typing another name or checking other tabs.
                            </p>
                          </div>
                          {searchGlobal === false && (
                            <button
                              onClick={() => setSearchGlobal(true)}
                              className="text-xs bg-gold-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-500 transition-colors"
                            >
                              Search Entire Menu
                            </button>
                          )}
                        </div>
                      );
                    }

                    return itemsToRender.map(({ item, catLabel }) => (
                      <div 
                        key={item.id}
                        className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl hover:border-zinc-800 hover:bg-zinc-900/80 transition-all flex flex-col justify-between text-left relative overflow-hidden group shadow-md"
                      >
                        <div className="space-y-2">
                          {isSearching && (
                            <span className="text-[8px] font-mono tracking-widest text-gold-400/80 uppercase block">
                              📁 {catLabel}
                            </span>
                          )}
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-white font-serif font-bold text-sm md:text-base group-hover:text-gold-400 transition-colors tracking-tight">
                              {item.name}
                            </h3>
                            <div className="font-mono text-gold-400 font-extrabold text-xs bg-gold-400/5 px-2 py-0.5 border border-gold-400/10 rounded shrink-0">
                              {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : `$${item.price}`}
                            </div>
                          </div>

                          <p className="text-zinc-400 text-xs leading-relaxed font-sans line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-zinc-950/50">
                            {item.tags.map((tag: string) => {
                              const isSpicy = tag.toLowerCase().includes('spicy') || tag.toLowerCase().includes('hot') || tag.toLowerCase().includes('fiery');
                              const isVeg = tag.toLowerCase().includes('veg');
                              const isGF = tag.toLowerCase().includes('gluten');
                              const isLuxury = tag.toLowerCase().includes('exclusive') || tag.toLowerCase().includes('luxury') || tag.toLowerCase().includes('elite') || tag.toLowerCase().includes('exquisite');
                              
                              let colorClasses = 'bg-gold-400/5 text-gold-400 border-gold-400/20';
                              if (isSpicy) colorClasses = 'bg-red-500/10 text-red-400 border-red-500/20';
                              else if (isVeg) colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                              else if (isGF) colorClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                              else if (isLuxury) colorClasses = 'bg-amber-400/10 text-amber-500 border-amber-400/30';

                              return (
                                <span 
                                  key={tag} 
                                  className={`border px-2 py-0.5 rounded text-[8px] uppercase font-mono tracking-wider font-semibold ${colorClasses}`}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Pricing Disclaimer Note */}
          <div className="mt-8 text-center text-zinc-500 text-[11px] font-sans">
            ⚠️ Menu prices may vary. Please call the restaurant to confirm latest pricing.
          </div>

          {/* ORDER & TABLE RESERVATION CTA */}
          <div className="mt-16 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-850 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 left-0 w-64 h-64 bg-red-400/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-left max-w-xl space-y-2 relative z-10">
              <span className="text-gold-400 font-mono text-[9px] uppercase tracking-widest font-extrabold bg-gold-400/5 px-2.5 py-1 border border-gold-400/10 rounded">
                Experience the Grill Theater Live
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                Plan an Unforgettable Japanese Feast
              </h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Whether you want to witness the dramatic flame show at our hot iron griddles or request direct premium takeout, our hospitality waits to greet you. Call us at (607) 378-5222 for immediate assistance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto relative z-10">
              <button 
                onClick={() => {
                  const el = document.getElementById('reservation');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-gold-400 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl hover:from-gold-500 hover:to-amber-600 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                📅 Reserve Table
              </button>
              <a 
                href="tel:6073785222"
                className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-zinc-850 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                📞 Call to Order Takeout
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: RESERVATION COMPONENT */}
      <ReservationForm onBookingAdded={refreshBookingsState} />

      {/* SECTION: HOURS & DIRECTIONS */}
      <section id="hours" className="py-24 bg-shimmer bg-zinc-950 px-4 md:px-8 border-b border-zinc-900 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Hours card */}
            <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between text-left shadow-xl">
              <div>
                <span className="text-gold-400 font-mono text-[10px] uppercase font-bold tracking-widest block mb-2">
                  Operating Schedule
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-white tracking-tight mb-6">
                  Hours Of Operation
                </h3>

                <div className="space-y-4 font-sans text-sm pb-8">
                  <div className="flex justify-between items-center border-b border-zinc-950/60 pb-3.5">
                    <span className="text-zinc-400">Monday – Thursday</span>
                    <strong className="text-white font-mono">2:00 PM – 10:00 PM</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-950/60 pb-3.5">
                    <span className="text-zinc-400">Friday – Saturday</span>
                    <strong className="text-white font-mono">12:00 PM – 11:00 PM</strong>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-zinc-400">Sunday</span>
                    <strong className="text-white font-mono">12:00 PM – 9:30 PM</strong>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex items-center justify-between gap-4 mt-4">
                <div>
                  <span className="text-zinc-500 font-mono text-[9px] uppercase block">Phone Inquiries</span>
                  <a href="tel:6072778888" className="text-white font-serif font-semibold text-base block hover:text-gold-400 transition-colors">
                    (607) 277-8888
                  </a>
                </div>
                <a 
                  id="hours-call-cta"
                  href="tel:6072778888"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-gold-400 text-xs font-mono font-bold uppercase rounded-lg shadow cursor-pointer transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Map visual and location finder */}
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between text-left shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-decor opacity-15 pointer-events-none" />
              
              <div>
                <span className="text-red-400 font-mono text-[10px] uppercase font-bold tracking-widest block mb-2">
                  Fine Dining Location
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-white tracking-tight mb-2">
                  Visit Us in Ithaca, NY
                </h3>
                <p className="text-zinc-400 text-xs md:text-sm mb-6 font-sans">
                  We are conveniently located in the Meadow Court shopping corridor, with generous parking space.
                </p>

                <div className="bg-zinc-950 border border-zinc-850/80 p-4 rounded-xl space-y-1 mb-6 max-w-md">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase block">Dining Address Coordinates</span>
                  <p className="text-white font-semibold text-sm">
                    📍 722 S Meadow St, Ithaca, NY 14850
                  </p>
                  <p className="text-zinc-500 text-[10px] font-sans">
                    Beside major shops, perfect for both locals and Cornell/Ithaca College students.
                  </p>
                </div>
              </div>

              {/* Fake aesthetic styled Dark Map box */}
              <div className="bg-zinc-950 border border-zinc-900/85 h-44 rounded-xl flex flex-col items-center justify-center relative overflow-hidden pt-4 mb-6">
                <div className="absolute inset-0 bg-grid-decor opacity-30" />
                {/* Decorative map graphics */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600 animate-ping top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute w-3 h-3 rounded-full bg-red-500 border border-zinc-950 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                
                {/* Simulated Street Labels */}
                <div className="absolute font-mono text-[8px] text-zinc-600 uppercase tracking-widest bottom-6 left-12 rotate-12">S Meadow St</div>
                <div className="absolute font-mono text-[8px] text-zinc-600 uppercase tracking-widest top-8 right-16">South Hill Area</div>
                <div className="absolute font-mono text-[8px] text-zinc-500/80 bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded top-1/2 left-1/2 -translate-x-1/2 translate-y-4">722 S Meadow St</div>
                <p className="text-zinc-500 text-[10px] font-mono z-10">Map Pin: TOKYO HIBACHI</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <a
                  id="btn-directions-primary"
                  href="https://maps.google.com/?q=722+S+Meadow+St,+Ithaca,+NY+14850"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-750 text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all shadow border border-zinc-700 hover:border-zinc-600 flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Get Google Directions GPS
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXCLUSIVE COMMUNITY CTA BANNER */}
      <section className="relative py-16 bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 px-4 md:px-8 border-b border-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-decor opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-gold-400 font-mono text-xs uppercase tracking-widest block font-bold font-semibold">
              Join the Tokyo Club
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Got a Sizzling Story to Tell?
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm max-w-xl">
              Post questions, reviews, or your culinary catches live on our diner forum boards. Meet other hibachi lovers from Ithaca!
            </p>
          </div>
          <a
            href="#forum"
            className="px-6 py-3.5 bg-gold-400 hover:bg-gold-500 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-gold-950/15"
          >
            Enter Club Forum Board &rarr;
          </a>
        </div>
      </section>

      {/* INTEGRATED GUEST COMMUNITY FORUM */}
      <ForumBoard isAdmin={isAdminLoggedIn} />

      {/* SECTION: CUSTOMER REVIEWS WALL */}
      <section id="reviews" className="py-24 bg-shimmer bg-zinc-950 px-4 md:px-8 border-b border-zinc-900 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-gold-400 font-mono tracking-widest text-xs uppercase block mb-3">
              Words From our Guest Patrons
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white tracking-tight mb-4">
              Community Reviews & Stars
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
              Explore authentic testimonials from satisfied Ithaca families and student groups who have cheered around our hot grills.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left side Reviews list (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="bg-zinc-900 border border-zinc-900 p-6 rounded-xl hover:border-zinc-850 transition-all text-left relative"
                  >
                    <div className="flex justify-between items-baseline mb-3">
                      <div className="flex text-gold-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-gold-400 text-gold-400' : 'text-zinc-700'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-zinc-500 text-[10px] font-mono">
                        {rev.date}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs leading-normal italic mb-3">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-xs">
                        {rev.name}
                      </span>
                      {rev.verified && (
                        <span className="bg-gold-400/10 text-gold-400 border border-gold-400/20 px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-black">
                          Verified Diner
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side Add Review Form (5 Cols) */}
            <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 text-left shadow-xl">
              <h4 className="text-white font-serif font-semibold text-lg mb-2">
                Share Your Tokyo Hibachi Experience
              </h4>
              <p className="text-zinc-400 text-xs mb-6">
                Loved our teppanyaki knife tricks or master wok rice? Leave us a critique for future diners!
              </p>

              {reviewSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-xs font-sans mb-4">
                  ✓ <strong>Review Added!</strong> Thank you for participating. Your critique was saved locally and is now visible on the left wall.
                </div>
              )}

              <form onSubmit={handleAddReview} className="bg-zinc-950 border border-zinc-900 p-5 rounded-xl space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono tracking-widest block uppercase">Patron Name</label>
                  <input
                    type="text"
                    placeholder="E.g., David C."
                    id="review-input-name"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-gold-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono tracking-widest block uppercase">Rating Star Selection</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        id={`btn-star-${star}`}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="text-gold-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-gold-400 text-gold-400' : 'text-zinc-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono tracking-widest block uppercase">Your Review Comment</label>
                  <textarea
                    rows={4}
                    placeholder="Describe our teppanyaki flavor, chefs show tricks, yum-yum dressing, and environment..."
                    id="review-input-comment"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded p-3 text-xs focus:outline-none focus:border-gold-400 resize-none leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-review"
                  className="w-full py-3 bg-gold-400 hover:bg-gold-500 text-black font-semibold text-xs tracking-wider uppercase rounded font-bold transition-all mt-2 cursor-pointer shadow"
                >
                  Publish Patrons Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & BRANDING */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-500 py-16 px-4 md:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <a href="#" className="inline-flex items-center gap-3 justify-center group">
            <span className="bg-red-600 text-white font-mono text-xs px-2.5 py-1 rounded">東京</span>
            <span className="font-serif text-white font-semibold text-lg tracking-widest uppercase">
              TOKYO <span className="text-gold-400">HIBACHI</span>
            </span>
          </a>

          <p className="text-zinc-400 max-w-md mx-auto text-xs leading-normal">
            Ithaca's premier teppanyaki destination serving premium meat and handmade specialty sushi. Local dining experience guaranteed that lights up your nights.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-500 font-mono pb-4">
            <a href="#about" className="hover:text-gold-400">About</a>
            <span>•</span>
            <a href="#menu" className="hover:text-gold-400">Menu Choices</a>
            <span>•</span>
            <a href="#experience" className="hover:text-gold-400">The Show</a>
            <span>•</span>
            <a href="#reservation" className="hover:text-gold-400">Reservations</a>
          </div>

          <div className="border-t border-zinc-900/80 pt-6 space-y-2 text-[11px] font-sans">
            <p>📍 722 S Meadow St, Ithaca, NY 14850 | ☎️ Phone support: (607) 277-8888</p>
            <p>📩 Business inquires email: tokyoithaca@gmail.com</p>
            <p className="text-[10px] text-zinc-650 pt-4">
              © 2026 Tokyo Hibachi Restaurant. Standalone Static System ready for GitHub Pages.
            </p>
          </div>
        </div>
      </footer>

      {/* SECTION: ADMIN COMPONENT CONTROL GATE */}
      {isAdminLoggedIn ? (
        <AdminDashboard 
          bookings={bookings}
          onUpdateStatus={handleBookingStatusChange}
          onDeleteBooking={handleBookingDelete}
          onLogout={handleAdminLogout}
        />
      ) : (
        null
      )}
      {false && (
        /* Anchor for linking straight to login */
        <section id="admin" className="py-12 bg-zinc-950 border-t border-zinc-900 text-center relative z-20">
          <div className="max-w-md mx-auto px-4">
            <button
              onClick={() => setShowLoginModal(true)}
              id="btn-bottom-login-gate"
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 mx-auto transition-all cursor-pointer shadow"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-500" /> Unlock Management Portal & Static Exporter
            </button>
            <p className="text-[10px] text-zinc-600 mt-2 font-mono">
              Access credentials are by default: username: <strong className="text-zinc-500">admin</strong> / password: <strong className="text-zinc-500">ChangeMe123!</strong>
            </p>
          </div>
        </section>
      )}

      {/* MODAL: ADMIN ACCESS GATEWAY */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 rounded transition"
                id="btn-close-modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 md:p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-5 h-5" />
                </div>

                <div className="text-center">
                  <h3 className="text-white font-serif font-semibold text-lg">
                    Administrator Suite Login
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    Sign in to monitor live incoming internet bookings, update confirmation states, and access the standalone export kit.
                  </p>
                </div>

                {adminError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded text-xs">
                    ⚠️ {adminError}
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4 text-left border-none p-0 bg-transparent flex flex-col">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Username</label>
                    <input
                      type="text"
                      placeholder="admin"
                      id="input-user"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-805 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Secret Password</label>
                    <input
                      type="password"
                      placeholder="ChangeMe123!"
                      id="input-pass"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-805 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-login-submit"
                    className="w-full py-3 bg-gold-400 hover:bg-gold-500 text-black text-xs font-mono font-bold tracking-widest uppercase rounded shadow transition"
                  >
                    Unlock Suite →
                  </button>
                </form>

                <div className="border-t border-zinc-850 pt-4 text-left">
                  <p className="text-[9px] text-zinc-500 leading-normal">
                    * By default, the admin credentials configured are <code className="text-zinc-400 font-mono bg-zinc-950 px-1 py-0.5 rounded">admin</code> and <code className="text-zinc-400 font-mono bg-zinc-950 px-1 py-0.5 rounded">ChangeMe123!</code>. Modify these directly inside `/src/App.tsx` (or `script.js` for standalone deployment).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
