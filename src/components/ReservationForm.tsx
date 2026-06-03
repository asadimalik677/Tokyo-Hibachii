import React, { useState } from 'react';
import { Booking } from '../types';
import { Calendar, Clock, Users, MessageSquare, ShieldCheck, Mail, Phone, User, CalendarCheck } from 'lucide-react';

interface ReservationFormProps {
  onBookingAdded: () => void;
}

export default function ReservationForm({ onBookingAdded }: ReservationFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');
  
  // States for handling status
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Validate operational hours based on day
  const validateHours = (selectedDateStr: string, selectedTimeStr: string): { isValid: boolean; rangeMsg: string } => {
    if (!selectedDateStr || !selectedTimeStr) return { isValid: false, rangeMsg: '' };
    
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    // JS Months are 0-indexed, so minus 1
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay(); // 0 is Sun, 1 is Mon, ..., 6 is Sat

    const [hourStr, minStr] = selectedTimeStr.split(':');
    const selectedHour = parseFloat(hourStr) + parseFloat(minStr) / 60;

    let minHour = 14; // Mon-Thu 2 PM = 14:00
    let maxHour = 22; // Mon-Thu 10 PM = 22:00
    let rangeMsg = 'between 2:00 PM and 10:00 PM';

    if (dayOfWeek === 0) { // Sunday 12:00 PM - 9:30 PM
      minHour = 12;
      maxHour = 21.5;
      rangeMsg = 'between 12:00 PM and 9:30 PM';
    } else if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday and Saturday 12:00 PM - 11:00 PM
      minHour = 12;
      maxHour = 23;
      rangeMsg = 'between 12:00 PM and 11:00 PM';
    }

    if (selectedHour < minHour || selectedHour > maxHour) {
      return { isValid: false, rangeMsg };
    }

    return { isValid: true, rangeMsg };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validations
    if (!name.trim()) return setErrorMsg('Please enter your full name.');
    if (!phone.trim()) return setErrorMsg('Please enter your phone number.');
    if (!email.trim()) return setErrorMsg('Please enter your email address for receipts.');
    if (!date) return setErrorMsg('Please select a reservation date.');
    if (!time) return setErrorMsg('Please select a dining time.');
    if (guests < 1 || guests > 15) return setErrorMsg('Please choose between 1 and 15 guests. Please contact us directly for larger parties.');

    // Hours Validation
    const hourCheck = validateHours(date, time);
    if (!hourCheck.isValid) {
      setErrorMsg(`Tokyo Hibachi is closed at the selected time. Our hours for this day are ${hourCheck.rangeMsg}.`);
      return;
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0,0,0,0);
    const [y, m, d] = date.split('-').map(Number);
    const selectedDate = new Date(y, m - 1, d);
    
    if (selectedDate < today) {
      setErrorMsg('Cannot make reservations for a past date.');
      return;
    }

    // Generate real booking structure
    const newBookingID = `TH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: newBookingID,
      name,
      phone,
      email,
      date,
      time,
      guests,
      specialRequest: specialRequest.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const liveBookings: Booking[] = JSON.parse(localStorage.getItem('tokyo_hibachi_bookings') || '[]');
      liveBookings.push(newBooking);
      localStorage.setItem('tokyo_hibachi_bookings', JSON.stringify(liveBookings));
      
      // Setup Success State
      setSuccessBooking(newBooking);
      onBookingAdded();

      // Reset Form fields
      setName('');
      setPhone('');
      setEmail('');
      setDate('');
      setTime('');
      setGuests(2);
      setSpecialRequest('');
    } catch (e) {
      setErrorMsg('Failed to process. Please check browser permissions and try again.');
    }
  };

  const getFriendlyDayName = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFriendlyTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMin = m < 10 ? `0${m}` : m;
    return `${displayHour}:${displayMin} ${ampm}`;
  };

  return (
    <section id="reservation" className="py-24 bg-shimmer bg-zinc-950 relative border-b border-zinc-900">
      <div className="absolute inset-0 bg-grid-decor opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gold-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-gold-400 font-mono tracking-widest text-xs uppercase block mb-3">
            Teppanyaki Table Bookings
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white tracking-tight mb-4">
            Secure Your Table Online
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Book your seats in advance for our exciting chef shows. Standard tables and hibachi station grills are fully reservable down below.
          </p>
        </div>

        {successBooking ? (
          /* Bookings success screen */
          <div className="bg-zinc-900 border border-gold-400/40 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-2xl animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold-400 via-amber-500 to-red-500" />
            
            <div className="w-16 h-16 bg-gold-400/10 border border-gold-400/20 text-gold-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarCheck className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase font-mono tracking-widest text-gold-400 bg-gold-400/5 px-3 py-1.5 rounded-full border border-gold-400/10 mb-2 inline-block">
              Reservation Transmitted
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
              Seat Request Received!
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed mb-8">
              Thank you for choosing Tokyo Hibachi! Your request has been stored in our system under the booking reference below. We look forward to serving you.
            </p>

            {/* Receipt receipt card */}
            <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-left mb-8 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <span className="text-zinc-500 text-xs font-mono">BOOKING ID</span>
                <span className="text-gold-400 font-mono font-bold tracking-wider">{successBooking.id}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500 text-[11px] font-mono block mb-0.5">GUEST NAME</span>
                  <span className="text-white font-medium">{successBooking.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] font-mono block mb-0.5">PARTY SIZE</span>
                  <span className="text-white font-medium">{successBooking.guests} Guests</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] font-mono block mb-0.5">DATE</span>
                  <span className="text-white font-medium text-xs">
                    {getFriendlyDayName(successBooking.date)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] font-mono block mb-0.5">DINING TIME</span>
                  <span className="text-white font-medium">
                    {getFriendlyTime(successBooking.time)}
                  </span>
                </div>
              </div>

              {successBooking.specialRequest && (
                <div className="border-t border-zinc-900 pt-3">
                  <span className="text-zinc-500 text-[11px] font-mono block mb-1">SPECIAL INSTRUCTIONS</span>
                  <p className="text-zinc-400 text-xs italic bg-zinc-900/40 p-2 rounded border border-zinc-900 leading-relaxed">
                    "{successBooking.specialRequest}"
                  </p>
                </div>
              )}

              <div className="bg-zinc-900/60 p-3 rounded-lg flex items-center gap-3 border border-zinc-900">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="text-zinc-400 text-xs text-left leading-normal">
                  Status: <strong className="text-gold-400">Pending Confirmation</strong>. You can verify this inside the Admin Dashboard below.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                id="btn-book-another"
                onClick={() => setSuccessBooking(null)}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm rounded-lg transition-all"
              >
                Reserve Another Table
              </button>
              <a
                id="btn-success-scroll-menu"
                href="#menu"
                className="px-6 py-3 bg-gold-400 hover:bg-gold-500 text-black font-semibold text-sm rounded-lg transition-all inline-block shadow-lg"
              >
                Browse Menu Options
              </a>
            </div>
          </div>
        ) : (
          /* Booking Reservation Form */
          <form 
            onSubmit={handleSubmit} 
            className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl space-y-6 relative"
          >
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-left font-sans select-none">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name field */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                  <User className="w-3.5 h-3.5 text-zinc-500" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  id="form-input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all font-sans"
                  required
                />
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="(607) 123-4567"
                  id="form-input-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all font-sans"
                  required
                />
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  id="form-input-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date selection */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" /> Booking Date
                </label>
                <input
                  type="date"
                  id="form-input-date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all font-sans"
                  required
                />
              </div>

              {/* Time selection */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> Dining Time
                </label>
                <input
                  type="time"
                  id="form-input-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all font-sans"
                  required
                />
              </div>

              {/* Guest size dropdown */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                  <Users className="w-3.5 h-3.5 text-zinc-500" /> Party Size
                </label>
                <select
                  id="form-input-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all cursor-pointer font-sans"
                  required
                >
                  {[...Array(15)].map((_, i) => (
                    <option key={i+1} value={i+1} className="bg-zinc-950 text-white">
                      {i+1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" /> Dietary Needs / Birthday celebration / Requests
              </label>
              <textarea
                id="form-input-special"
                rows={3}
                placeholder="Examples: Vegetarian, gluten-free prep, table near play area, celebrating 30th birthday, high chair needed..."
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all resize-none font-sans"
              />
            </div>

            {/* Explanatory Operational Notice */}
            <div className="text-[11px] text-zinc-500 text-left leading-normal bg-zinc-950/50 p-4 border border-zinc-800/40 rounded-xl space-y-1">
              <p className="font-semibold text-zinc-400">Tokyo Hibachi Ithaca Hours & Scheduling Constraints:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Mon–Thu: 2:00 PM – 10:00 PM</li>
                <li>Fri–Sat: 12:00 PM – 11:00 PM</li>
                <li>Sun: 12:00 PM – 9:30 PM</li>
              </ul>
              <p className="pt-1.5 text-[10px]">Note: Parties over 15 people must make phone reservations via <a href="tel:6072778888" className="text-gold-400 underline font-semibold">(607) 277-8888</a> for safety & teppanyaki room arrangements.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                id="btn-submit-booking"
                className="w-full md:w-auto px-10 py-4 bg-gold-400 hover:bg-gold-300 text-black font-semibold text-sm uppercase tracking-wider rounded-lg shadow-lg hover:shadow-gold-950/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Send Table Request
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
