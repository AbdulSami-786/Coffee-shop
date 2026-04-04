// App.jsx
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Calendar, ArrowRight } from 'lucide-react';
import CoffeeIntro from "./Coffeeintro.jsx";
import { SiteParticles } from "./Coffeeintro.jsx";
import Navbar from "./Navbar.jsx";

// ─── Events Data ──────────────────────────────────────────────────────────────
const eventsData = [
  {
    id: '01', title: 'How We Roast Our Aromatic Coffee', location: 'NEW YORK',
    startDate: 'June 1, 2026 08:00', endDate: 'June 22, 2026 17:00',
    price: '$254', month: 'Jun, 2026',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '15', title: 'Master class "Coffee at home"', location: 'NEW YORK',
    startDate: 'June 15, 2026 10:00', endDate: 'June 15, 2026 14:00',
    price: '$150', month: 'Jun, 2026',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '04', title: 'Excursion to the Processing Plant', location: 'NEW YORK',
    startDate: 'July 4, 2026 08:00', endDate: 'July 9, 2026 17:00',
    price: 'Free', month: 'Jul, 2026',
    image: 'https://images.unsplash.com/photo-1504639725597-78f6ec6b5383?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '10', title: 'Latte Art Competition', location: 'NEW YORK',
    startDate: 'July 10, 2026 09:00', endDate: 'July 10, 2026 18:00',
    price: 'Free', month: 'Jul, 2026',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '22', title: 'Lecture "Stages of Coffee Processing"', location: 'NEW YORK',
    startDate: 'July 22, 2026 08:00', endDate: 'July 25, 2026 17:00',
    price: '$254', month: 'Jul, 2026',
    image: 'https://images.unsplash.com/photo-1442550528053-c431ecb55509?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '05', title: 'Professional Cupping Session', location: 'NEW YORK',
    startDate: 'August 5, 2026 11:00', endDate: 'August 5, 2026 15:00',
    price: '$80', month: 'Aug, 2026',
    image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=600&q=80'
  }
];

// ─── Scroll Animation Hook ─────────────────────────────────────────────────────
function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const els = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-scale');
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Counter Animation Hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ value, label, suffix = '+' }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 1600, started);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '10px 20px' }}>
      <div style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", color: '#b3bd78', fontWeight: 700, lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ color: '#666', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '8px' }}>
        {label}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const HotCoffee = () => {
  const [activeEvent, setActiveEvent]     = useState(eventsData[0]);
  const [scrolled, setScrolled]           = useState(false);
  const [showIntro, setShowIntro]         = useState(true);
  const [siteVisible, setSiteVisible]     = useState(false);
  const [eventChanging, setEventChanging] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setTimeout(() => setSiteVisible(true), 50);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useScrollAnimation();

  const handleEventClick = (event) => {
    if (event.id === activeEvent.id) return;
    setEventChanging(true);
    setTimeout(() => { setActiveEvent(event); setEventChanging(false); }, 300);
  };

  const cardHoverOn  = (e) => { e.currentTarget.style.borderColor = 'rgba(179,189,120,0.35)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.5)'; };
  const cardHoverOff = (e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; };
  const btnHoverOn   = (e) => { e.target.style.background = '#b3bd78'; e.target.style.transform = 'scale(1.05)'; };
  const btnHoverOff  = (e) => { e.target.style.background = '#fff';    e.target.style.transform = 'scale(1)'; };
  const imgHoverOn   = (e) => { e.target.style.transform = 'scale(1.08)'; e.target.style.filter = 'grayscale(0%)'; };
  const imgHoverOff  = (e) => { e.target.style.transform = 'scale(1)';    e.target.style.filter = 'grayscale(50%)'; };

  const menuCols = [
    [
      { name: 'Espresso',  price: '$11', desc: 'A small portion (30 ml) of pure, strong, aromatic coffee.' },
      { name: 'Ristretto', price: '$10', desc: 'From Italian "one sip". Small portion of strong coffee.' },
      { name: 'Latte',     price: '$14', desc: 'A light coffee drink made from espresso, milk and milk foam.' },
    ],
    [
      { name: 'Americano',  price: '$12', desc: 'Espresso with added water. Less strong than espresso.' },
      { name: 'Cappuccino', price: '$15', desc: 'Creamy coffee drink with milk foam. Coffee with hearts.' },
      { name: 'Flat White', price: '$15', desc: 'Strong coffee with a delicate hint of milk and milk foam.' },
    ],
  ];

  const menuCards = [
    { img: 'https://hotcoffee.themerex.net/wp-content/uploads/2020/04/images-8-min-890x664.jpg', name: 'Caffé Americano',    price: '$4.50', desc: '"Rich, full-bodied espresso pulled over hot water."',      badge: 'Best Seller' },
    { img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',                        name: 'Caramel Macchiato', price: '$5.25', desc: '"Fresh steamed milk marked with vanilla and caramel."',   badge: null },
    { img: 'https://hotcoffee.themerex.net/wp-content/uploads/2021/08/images-37-min-1.jpg',       name: 'Vanilla Latte',     price: '$4.95', desc: '"Signature espresso blended with creamy vanilla milk."', badge: null },
  ];


  return (
    <>
      {showIntro && <CoffeeIntro onComplete={handleIntroComplete} />}
      {siteVisible && <SiteParticles />}

      <div className="app" style={{
        opacity: siteVisible ? 1 : 0,
        transform: siteVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>

        {/* ── Navbar ── */}
        <Navbar/>

        {/* ── Hero ── */}
        <section id="home" className="hero">
          <div className="hero-content">
            <span className="tag">Established 1992</span>
            <h1>Better Coffee<br/>For Better Days</h1>
            <div className="hero-divider" />
            <p>Experience the rich aroma and smooth taste of our artisanal coffee.</p>
            <div className="hero-buttons herbtn">
              <a href="#menuss" className="btn primary">Order Online</a>
              <a href="#reservation" className="btn secondary btnnn">Book A Table</a>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '40px 20px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            <StatCounter value={32}    label="Years of Excellence" />
            <StatCounter value={150}   label="Coffee Varieties" />
            <StatCounter value={25000} label="Happy Customers" suffix="+" />
            <StatCounter value={12}    label="Awards Won" />
          </div>
        </div>

        {/* ── Features ── */}
        <section id="about" className="features">
          <div className="container grid-3">
            {[
              { title: 'Natural Beans',   text: '100% organic Arabica beans from premium farms.' },
              { title: 'Master Roasting', text: 'Precision roasting for unique flavor profiles.' },
              { title: 'Fast Delivery',   text: 'Delivered fresh within 48 hours.' },
            ].map((f, i) => (
              <div key={f.title} className={`animate-on-scroll delay-${(i+1)*200}`}>
                <h3>{f.title}</h3><p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Menu Cards ── */}
        <section id="menuss" style={{ backgroundColor: '#000', padding: '80px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ maxWidth: '1100px', width: '100%' }}>
            <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '70px' }}>
              <span style={{ color: '#b3bd78', letterSpacing: '4px', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>The Artisan Collection</span>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: "'Playfair Display', serif", color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
                Freshly Brewed <span style={{ color: '#b3bd78', fontStyle: 'italic' }}>Popular Picks</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '1px', background: 'rgba(179,189,120,0.4)' }} />
                <span style={{ color: '#555', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>Crafted with passion</span>
                <div style={{ width: '40px', height: '1px', background: 'rgba(179,189,120,0.4)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', justifyItems: 'center' }}>
              {menuCards.map((card, i) => (
                <div key={card.name} className={`animate-on-scroll delay-${(i+1)*200}`}
                  style={{ width: '100%', maxWidth: '360px', background: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.4s, transform 0.4s, box-shadow 0.4s' }}
                  onMouseEnter={cardHoverOn} onMouseLeave={cardHoverOff}
                >
                  <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                    <img src={card.img} alt={card.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)', transition: 'transform 0.7s ease, filter 0.7s ease' }}
                      onMouseEnter={imgHoverOn} onMouseLeave={imgHoverOff}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111 0%, transparent 60%)' }} />
                    {card.badge && (
                      <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#b3bd78', color: '#000', fontSize: '10px', fontWeight: 900, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '28px 28px 32px', textAlign: 'center', marginTop: '-24px', position: 'relative', zIndex: 1 }}>
                    <h4 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: '10px' }}>{card.name}</h4>
                    <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>{card.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '2rem', color: '#b3bd78', fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>{card.price}</span>
                      <button style={{ background: '#fff', color: '#000', padding: '10px 28px', borderRadius: '50px', fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', letterSpacing: '1px', transition: 'background 0.3s, transform 0.3s' }}
                        onMouseEnter={btnHoverOn} onMouseLeave={btnHoverOff}>ADD TO ORDER</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Coffee Hero / About ── */}
        <section className="coffee-hero">
          <div className="container">
            <div className="image-wrapper animate-left">
              <div className="image-box top-left"><img src="https://hotcoffee.themerex.net/wp-content/uploads/2021/12/243-min-1.jpg" alt="Coffee latte art" /></div>
              <div className="image-box bottom-right"><img src="https://hotcoffee.themerex.net/wp-content/uploads/2021/12/img-home-12.jpg" alt="Espresso pour" /></div>
            </div>
            <div className="content-wrapper animate-right delay-200">
              <span className="subtitle">OUR COFFEE SHOP</span>
              <h1 className="title">We Combine Classics<br/>and Modernity</h1>
              <p className="description">We appreciate your trust greatly. Our clients choose us because they know we are the best.</p>
              <div className="hours">
                <p><strong>MON–FRI:</strong> 9 AM – 10 PM</p>
                <p><strong>SATURDAY:</strong> 9 AM – 8 PM</p>
              </div>
              <a href="#" className="btn-about">About Us</a>
            </div>
          </div>
        </section>

        {/* ── Menu Specials ── */}
        <section className="menu-section">
          <div className="containers">
            <div className="menu-header animate-on-scroll">
              <span className="subtitle">OUR MENU</span>
              <h2 className="title">Our Specials</h2>
              <span className="icon-divider">︾</span>
            </div>
            <div className="menu-grid" style={{ width: '100%' }}>
              {menuCols.map((col, ci) => (
                <div key={ci} className={`menu-column ${ci === 0 ? 'animate-left delay-100' : 'animate-right delay-200'}`}>
                  {col.map(item => (
                    <div key={item.name} className="menu-item">
                      <div className="item-main">
                        <span className="item-name">{item.name}</span>
                        <span className="dots" />
                        <span className="price">{item.price}</span>
                      </div>
                      <p className="description">{item.desc}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="menu-footer animate-on-scroll delay-300">
              <a href="#" className="btn-view">View More</a>
            </div>
          </div>
        </section>

        {/* ── Coffee Features ── */}
        <section className="coffee-features">
          <div className="container">
            <div className="image-stack animate-left">
              <div className="img-back"><img src="https://hotcoffee.themerex.net/wp-content/uploads/2021/12/img-home-13.jpg" alt="Iced coffee" /></div>
              <div className="img-front"><img src="https://hotcoffee.themerex.net/wp-content/uploads/2021/12/img-home-11.jpg" alt="Interior" /></div>
            </div>
            <div className="content-area animate-right delay-200">
              <span className="top-label">BE OUR GUEST</span>
              <h2 className="main-heading">Enjoy Authentic<br/>Aromatic Coffee</h2>
              <p className="intro-text">Every cup is a story — from hand-picked beans to precision roasting, we craft each drink with uncompromising care.</p>
              {[
                { title: 'Extensive Menu', text: 'Our skilled team will never let you wait for too long.' },
                { title: 'Organic Coffee', text: "We're proud to offer our guests unique single-origin blends." },
              ].map(f => (
                <div key={f.title} className="feature-item">
                  <div className="icon-box" />
                  <div className="feature-text"><h3>{f.title}</h3><p>{f.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Events ── */}
        <div className="events-section">
          <div className="events-container">
            <div className="events-left animate-left">
              <p className="events-label">Selected Event</p>
              <div className="events-image" style={{ opacity: eventChanging ? 0 : 1, transform: eventChanging ? 'scale(0.97)' : 'scale(1)', transition: 'opacity 0.3s, transform 0.3s' }}>
                <img src={activeEvent.image} alt={activeEvent.title} />
              </div>
              <h2 className="events-title" style={{ opacity: eventChanging ? 0 : 1, transform: eventChanging ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.3s, transform 0.3s' }}>
                {activeEvent.title}
              </h2>
            </div>
            <div className="events-right animate-right delay-200">
              <div className="events-header">
                <div className="events-header-top">
                  <h1 className="events-main-title">Events Schedule</h1>
                  <button className="view-more-btn">View More <ArrowRight size={16} /></button>
                </div>
                <p className="events-description">Join us for exclusive coffee events — from masterclasses to cupping sessions.</p>
              </div>
              <div className="events-list">
                {eventsData.map((event, index) => (
                  <div key={event.id} onClick={() => handleEventClick(event)}
                    className={`event-item ${activeEvent.id === event.id ? 'active' : ''}`}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <div className="event-id">
                      <span className="event-id-number">{event.id}</span>
                      <span className="event-id-month">{event.month}</span>
                    </div>
                    <div className="event-thumb"><img src={event.image} alt="thumb" /></div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <div className="event-meta">
                        <span className="event-location">{event.location}</span>
                        <span className="event-date"><Calendar size={11} /> {event.startDate} — {event.endDate}</span>
                      </div>
                    </div>
                    <div className={`event-price ${event.price === 'Free' ? 'free' : ''}`}>{event.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Reservation ── */}
        <section id="reservation" className="reservation">
          <div className="animate-on-scroll">
            <h2>Book A Table</h2>
            <span className="reservation-sub">We'd love to host you</span>
          </div>
          <form className="form animate-on-scroll delay-200" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <input type="date" />
            <textarea placeholder="Special requests..." rows="4" />
            <button type="submit">Reserve My Seat</button>
          </form>
        </section>

        {/* ── Footer ── */}
        <footer id="contact" className="footer">
          <h3>HOT<span>COFFEE</span></h3>
          <p style={{ marginTop: '8px' }}>© 2025 Hot Coffee. All rights reserved.</p>
        </footer>

      </div>
    </>
  );
};

export default HotCoffee;