import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navLinks = ['Home', 'About', 'Menu', 'Reservation', 'Contact'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: rgba(201,168,76,0.15);
          --cream: #F5EDD8;
          --ink: #0E0C0A;
          --surface: #181410;
          --muted: rgba(245,237,216,0.45);
          --border: rgba(201,168,76,0.18);
        }

        @keyframes shimmerLine {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes floatHint {
          0%,100% { transform: translateX(-50%) translateY(0);   opacity: 0.5; }
          50%     { transform: translateX(-50%) translateY(-6px); opacity: 1;   }
        }
        @keyframes mobileSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .hc-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 48px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.6s ease, border-color 0.6s ease, height 0.4s ease;
          border-bottom: 1px solid transparent;
          font-family: 'DM Sans', sans-serif;
        }
        .hc-nav.scrolled {
          background: rgba(14,12,10,0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom-color: var(--border);
          height: 64px;
        }
        .hc-nav::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--gold) 40%, var(--gold-light) 50%, var(--gold) 60%, transparent 100%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.6s ease;
          animation: shimmerLine 3s linear infinite;
          pointer-events: none;
        }
        .hc-nav.scrolled::after { opacity: 1; }

        /* ── LOGO ── */
        .hc-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .hc-logo-mark { width: 36px; height: 36px; flex-shrink: 0; }
        .hc-logo-text { display: flex; flex-direction: column; line-height: 1; }
        .hc-logo-top {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.35em;
          color: var(--gold);
          text-transform: uppercase;
        }
        .hc-logo-main {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: var(--cream);
          margin-top: 1px;
        }
        .hc-logo-main em {
          font-style: italic;
          color: var(--gold-light);
          font-weight: 400;
        }

        /* ── DESKTOP LINKS ── */
        .hc-nav-links {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0; padding: 0;
        }
        .hc-nav-links a {
          position: relative;
          display: flex;
          align-items: center;
          padding: 8px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.3s;
        }
        .hc-nav-links a::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: width 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .hc-nav-links a:hover { color: var(--cream); }
        .hc-nav-links a:hover::before { width: calc(100% - 44px); }
        .hc-nav-links a.active { color: var(--gold-light); }
        .hc-nav-links a.active::before { width: calc(100% - 44px); background: var(--gold-light); }
        .hc-nav-links li:not(:last-child) > a::after {
          content: '';
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%);
          width: 2px; height: 2px;
          border-radius: 50%;
          background: var(--border);
          opacity: 0.5;
        }

        /* ── ACTIONS ── */
        .hc-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }
        .hc-icon-btn {
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s, transform 0.2s;
          position: relative;
        }
        .hc-icon-btn:hover { color: var(--gold-light); transform: scale(1.1); }
        .hc-icon-btn svg { width: 18px; height: 18px; }
        .hc-badge {
          position: absolute;
          top: 0; right: 0;
          width: 14px; height: 14px;
          background: var(--gold);
          border-radius: 50%;
          font-size: 8px;
          font-weight: 500;
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(25%, -25%);
        }
        .hc-divider {
          width: 1px; height: 18px;
          background: var(--border);
        }

        /* ── CTA BUTTON ── */
        .hc-cta {
          position: relative;
          background: transparent;
          border: 1px solid var(--gold);
          color: var(--gold);
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 10px 24px;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.4s, border-color 0.4s;
          white-space: nowrap;
        }
        .hc-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .hc-cta:hover { color: var(--ink); }
        .hc-cta:hover::before { transform: scaleX(1); }
        .hc-cta span { position: relative; z-index: 1; }

        /* ── MOBILE TOGGLE ── */
        .hc-mobile-toggle {
          display: none;
          background: none;
          border: 1px solid var(--border);
          color: var(--cream);
          cursor: pointer;
          width: 38px; height: 38px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          transition: border-color 0.3s;
        }
        .hc-mobile-toggle:hover { border-color: var(--gold); }
        .hc-burger {
          width: 18px; height: 1px;
          background: var(--cream);
          display: block;
          transition: all 0.35s ease;
        }
        .hc-mobile-toggle.open .hc-burger:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hc-mobile-toggle.open .hc-burger:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hc-mobile-toggle.open .hc-burger:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── MOBILE MENU ── */
        .hc-mobile-menu {
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: rgba(14,12,10,0.97);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
          z-index: 99;
          padding: 0 48px 32px;
          transform: translateY(-8px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .hc-mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        .hc-mobile-links { list-style: none; margin: 0; padding: 8px 0; }
        .hc-mobile-links li { border-bottom: 1px solid var(--border); }
        .hc-mobile-links a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: var(--cream);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.3s, padding-left 0.3s;
        }
        .hc-mobile-links a:hover { color: var(--gold-light); padding-left: 8px; }
        .hc-mobile-arrow {
          font-size: 14px;
          color: var(--gold);
          opacity: 0;
          transition: opacity 0.3s, transform 0.3s;
          font-family: 'DM Sans', sans-serif;
        }
        .hc-mobile-links a:hover .hc-mobile-arrow { opacity: 1; transform: translateX(4px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hc-nav { padding: 0 24px; }
          .hc-nav-links,
          .hc-divider,
          .hc-cta { display: none; }
          .hc-mobile-toggle { display: flex; }
          .hc-mobile-menu { padding: 0 24px 28px; }
        }
        @media (max-width: 480px) {
          .hc-icon-btn.search-btn { display: none; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`hc-nav${scrolled ? ' scrolled' : ''}`}>

        {/* Logo */}
        <a href="#" className="hc-logo">
          <div className="hc-logo-mark">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="17" stroke="#C9A84C" strokeWidth="0.75" opacity="0.5"/>
              <circle cx="18" cy="18" r="13" stroke="#C9A84C" strokeWidth="0.5" opacity="0.3"/>
              <ellipse cx="18" cy="18" rx="6" ry="9" stroke="#C9A84C" strokeWidth="1" fill="none"/>
              <path d="M18 9 Q22 18 18 27" stroke="#C9A84C" strokeWidth="0.75" fill="none"/>
              <circle cx="14" cy="6" r="1" fill="#C9A84C" opacity="0.6"/>
              <circle cx="18" cy="4.5" r="1" fill="#C9A84C" opacity="0.8"/>
              <circle cx="22" cy="6" r="1" fill="#C9A84C" opacity="0.6"/>
            </svg>
          </div>
          <div className="hc-logo-text">
            <span className="hc-logo-top">Est. 1924</span>
            <span className="hc-logo-main">Hot <em>Coffee</em></span>
          </div>
        </a>

        {/* Desktop Links */}
        <ul className="hc-nav-links">
          {navLinks.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={activeSection === item.toLowerCase() ? 'active' : ''}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hc-actions">
          <button className="hc-icon-btn search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>

          <button className="hc-icon-btn" aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className="hc-badge">3</span>
          </button>

          <div className="hc-divider" />

          <button className="hc-cta"><span>Reserve a Table</span></button>

          {/* Mobile Toggle */}
          <button
            className={`hc-mobile-toggle${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="hc-burger" />
            <span className="hc-burger" />
            <span className="hc-burger" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`hc-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <ul className="hc-mobile-links">
          {navLinks.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
              >
                {item}
                <span className="hc-mobile-arrow">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;