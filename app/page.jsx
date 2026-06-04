const menuCards = [
  ["Hibachi Entrees", "Chicken, steak, shrimp, salmon, scallops, fried rice, vegetables, and signature sauces."],
  ["Sushi & Starters", "Fresh rolls, gyoza, tempura, soups, salads, and shareable Asian appetizers."],
  ["Family Dinners", "Comfortable tables, generous plates, and a warm Japanese steakhouse atmosphere."]
];

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const reserved = params?.reserved;
  const bookingError = params?.bookingError;

  return (
    <>
      <header className="site-header">
        <nav className="nav">
          <a className="brand" href="#"><span>Tokyo</span><strong>Hibachi</strong></a>
          <div className="nav-links">
            <a href="#menu">Menu</a>
            <a href="#hours">Hours</a>
            <a href="#reservation">Reserve</a>
            <a className="btn btn-primary" href="tel:+16072778888">Call Now</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Japanese hibachi in Ithaca, NY</p>
            <h1>Tokyo Hibachi</h1>
            <p>Premium hibachi dining, Asian favorites, and warm service at 722 S Meadow St in Ithaca.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#reservation">Reserve a Table</a>
              <a className="btn btn-light" href="tel:+16072778888">(607) 277-8888</a>
            </div>
          </div>
          <div className="hero-media">
            <img src="https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1400&q=85" alt="Japanese hibachi dinner with grilled steak and seafood" />
            <div className="float-card">
              <span>Open today</span>
              <p>Fresh grill energy, polished service, and reservations managed live from the admin dashboard.</p>
            </div>
          </div>
        </section>

        <div className="quick">
          <a className="card" href="#reservation"><span>Book online</span><strong>Reserve in under a minute</strong></a>
          <a className="card" href="mailto:tokyoithaca@gmail.com"><span>Email</span><strong>tokyoithaca@gmail.com</strong></a>
          <a className="card" href="https://maps.google.com/?q=722%20S%20Meadow%20St%20Ithaca%20NY%2014850"><span>Visit</span><strong>722 S Meadow St, Ithaca</strong></a>
        </div>

        <section className="section intro">
          <div>
            <p className="eyebrow">About Tokyo Hibachi</p>
            <h2>A polished Japanese steakhouse experience for Ithaca.</h2>
          </div>
          <p>Tokyo Hibachi serves Japanese, hibachi, and Asian restaurant favorites with a warm dining room feel, bold grill flavors, and simple online reservations.</p>
        </section>

        <section className="promo-stack" id="menu">
          <article className="promo-card">
            <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1300&q=85" alt="Sushi and Japanese appetizers" />
            <div>
              <p className="eyebrow">Popular menu</p>
              <h2>Modern Japanese favorites.</h2>
              <p>From hibachi classics to sushi-inspired starters, the menu is built for date nights, families, and casual celebrations.</p>
            </div>
          </article>
          <article className="promo-card reverse">
            <img src="https://images.unsplash.com/photo-1584278858536-52532423b9ea?auto=format&fit=crop&w=1300&q=85" alt="Hibachi grill flame and chef preparation" />
            <div>
              <p className="eyebrow">Hibachi dining</p>
              <h2>Fire, flavor, and table-side energy.</h2>
              <p>Enjoy the lively hibachi experience with warm orange glow, savory grilled plates, and a room that feels special without feeling stiff.</p>
            </div>
          </article>
        </section>

        <section className="section">
          <div className="reviews">
            {menuCards.map(([title, text]) => (
              <article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </section>

        <section className="experience">
          <div>
            <p className="eyebrow">The experience</p>
            <h2>Built around the grill.</h2>
            <p>Premium visuals, fast online reservations, and a real admin workflow make the site feel like a working restaurant operation.</p>
            <div className="stats">
              <div><strong>3</strong><span>Dining moods</span></div>
              <div><strong>7</strong><span>Days open</span></div>
              <div><strong>Live</strong><span>Admin booking flow</span></div>
            </div>
          </div>
        </section>

        <section className="section reservation" id="hours">
          <div className="card">
            <p className="eyebrow">Opening hours</p>
            <h2>Visit us in Ithaca.</h2>
            <ul className="hours-list">
              <li><strong>Mon-Thu</strong><span>2:00 PM - 10:00 PM</span></li>
              <li><strong>Fri-Sat</strong><span>12:00 PM - 11:00 PM</span></li>
              <li><strong>Sun</strong><span>12:00 PM - 9:30 PM</span></li>
            </ul>
          </div>
          <div className="card">
            <p className="eyebrow">Location</p>
            <h2>722 S Meadow St</h2>
            <p>Ithaca, NY 14850. Serving Japanese hibachi dinners for Ithaca, South Hill, Cayuga Heights, Lansing, and nearby Tompkins County guests.</p>
          </div>
        </section>

        <section className="reservation section" id="reservation">
          <div>
            <p className="eyebrow">Online reservation</p>
            <h2>Book your table.</h2>
            <p>Submissions go directly into the Vercel admin dashboard once Supabase environment variables are configured.</p>
            {reserved ? <p className="message">Reservation received. Reference: {reserved}</p> : null}
            {bookingError ? <p className="message">Booking error: {bookingError}</p> : null}
          </div>
          <form className="reservation-form" action="/api/bookings" method="post">
            <div className="form-grid">
              <label>Full name<input name="fullName" required /></label>
              <label>Phone<input name="phone" required /></label>
              <label>Email<input type="email" name="email" required /></label>
              <label>Date<input type="date" name="date" required /></label>
              <label>Time<input type="time" name="time" required /></label>
              <label>Guests<input type="number" name="guests" min="1" max="20" defaultValue="2" required /></label>
            </div>
            <label>Priority<select name="priority" defaultValue="STANDARD"><option value="STANDARD">Standard</option><option value="EXPRESS">Express</option><option value="EMERGENCY">Emergency</option></select></label>
            <label>Special request<textarea name="request" rows="4" placeholder="Birthday, seating request, allergies..."></textarea></label>
            <button className="btn btn-primary" type="submit">Send Reservation</button>
          </form>
        </section>

        <section className="section">
          <div className="reviews">
            <article className="card"><h3>Wonderful hibachi night</h3><p>Great portions, lively grill, and friendly service for the whole table.</p></article>
            <article className="card"><h3>Perfect for groups</h3><p>Easy reservation experience and a dining room that feels warm and energetic.</p></article>
            <article className="card"><h3>Ithaca favorite</h3><p>Reliable Japanese and Asian favorites with a special-occasion feel.</p></article>
          </div>
        </section>

        <section className="final-cta">
          <div><p className="eyebrow">Ready for hibachi?</p><h2>Reserve Tokyo Hibachi tonight.</h2><p>Call or book online for Japanese hibachi dining in Ithaca, NY.</p></div>
          <a className="btn btn-light" href="#reservation">Reserve Now</a>
        </section>
      </main>

      <footer className="footer">
        <span>Tokyo Hibachi, 722 S Meadow St, Ithaca, NY 14850</span>
        <a href="/admin">Admin</a>
      </footer>
    </>
  );
}
