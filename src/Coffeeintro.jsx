// CoffeeIntro.jsx
// Drop-in coffee cup → pour → flood → reveal website

import React, { useEffect, useState, useRef } from 'react';
import '../src/Coffeeintro.css';

// ── SVG Cup ─────────────────────────────────────────────────────────────────
const CoffeeCupSVG = ({ fillLevel = 0 }) => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Saucer */}
    <ellipse cx="80" cy="145" rx="65" ry="10" fill="#c8851a" opacity="0.35"/>
    {/* Cup body */}
    <path d="M28 70 Q30 140 80 142 Q130 140 132 70 Z" fill="#2a1200"/>
    {/* Cup inner */}
    <path d="M32 70 Q34 134 80 136 Q126 134 128 70 Z" fill="#1a0800"/>
    {/* Coffee liquid fill (clipped by level) */}
    <clipPath id="coffeeClip">
      <rect x="32" y={70 + (66 * (1 - fillLevel))} width="96" height={66 * fillLevel} />
    </clipPath>
    <path d="M32 70 Q34 134 80 136 Q126 134 128 70 Z"
          fill="#8B4513" clipPath="url(#coffeeClip)"/>
    {/* Crema surface */}
    {fillLevel > 0.1 && (
      <ellipse cx="80" cy={70 + (66 * (1 - fillLevel))} rx="47" ry="7"
               fill="#c8851a" opacity="0.7"/>
    )}
    {/* Cup rim */}
    <ellipse cx="80" cy="70" rx="52" ry="12" fill="#3d1a00"/>
    <ellipse cx="80" cy="70" rx="48" ry="10" fill="#2a1200"/>
    {/* Handle */}
    <path d="M130 85 Q158 85 158 105 Q158 128 130 128"
          stroke="#3d1a00" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M130 85 Q152 85 152 105 Q152 124 130 124"
          stroke="#2a1200" strokeWidth="6" fill="none" strokeLinecap="round"/>
    {/* Logo on cup */}
    <text x="80" y="115" textAnchor="middle" fill="#b3bd78"
          fontSize="11" fontFamily="'Playfair Display', serif" opacity="0.7">HC</text>
  </svg>
);

// ── Floating Particle ────────────────────────────────────────────────────────
const IntroParticle = ({ style }) => (
  <div className="coffee-particle" style={style} />
);

// ── Site Background Particles ────────────────────────────────────────────────
export const SiteParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${12 + Math.random() * 20}s`,
    animationDelay: `${Math.random() * 15}s`,
    width: `${6 + Math.random() * 6}px`,
    height: `${9 + Math.random() * 8}px`,
    opacity: 0.08 + Math.random() * 0.1,
  }));

  const ripples = [
    { width: 300, height: 300, top: '30%', left: '10%', animationDuration: '8s', animationDelay: '0s' },
    { width: 200, height: 200, top: '70%', right: '15%', animationDuration: '6s', animationDelay: '2s' },
    { width: 500, height: 500, top: '50%', left: '40%', animationDuration: '12s', animationDelay: '4s' },
  ];

  return (
    <>
      <div className="app-bg-animated" />
      {particles.map((p, i) => (
        <div key={i} className="site-particle" style={p} />
      ))}
      {ripples.map((r, i) => (
        <div key={i} className="bg-ripple" style={r} />
      ))}
    </>
  );
};

// ── Main Intro Component ─────────────────────────────────────────────────────
const CoffeeIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  // 0 = cup drops
  // 1 = cup fills + drip starts
  // 2 = flood begins
  // 3 = flood full (brand turns light)
  // 4 = exit

  const [fillLevel, setFillLevel] = useState(0);
  const [exiting, setExiting] = useState(false);
  const fillRef = useRef(null);

  const introParticles = Array.from({ length: 10 }, (_, i) => ({
    left: `${5 + i * 9}%`,
    bottom: `${Math.random() * 40}%`,
    animationDuration: `${4 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 4}s`,
    width: `${6 + Math.random() * 8}px`,
    height: `${10 + Math.random() * 12}px`,
    background: i % 2 === 0 ? '#3b1a00' : '#7a3d00',
    opacity: 0.3 + Math.random() * 0.4,
  }));

  const doExit = () => {
    setExiting(true);
    setTimeout(() => onComplete?.(), 900);
  };

  useEffect(() => {
    // Cup drops at t=0 (CSS handles it)
    // Phase 1: start filling cup at t=1100ms
    const t1 = setTimeout(() => {
      setPhase(1);
      let start = null;
      const animFill = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 800, 1);
        setFillLevel(p);
        if (p < 1) fillRef.current = requestAnimationFrame(animFill);
      };
      fillRef.current = requestAnimationFrame(animFill);
    }, 1100);

    // Phase 2: flood at t=2100ms
    const t2 = setTimeout(() => setPhase(2), 2100);

    // Phase 3: brand text turns light at t=3000ms
    const t3 = setTimeout(() => setPhase(3), 3000);

    // Phase 4: exit at t=4200ms
    const t4 = setTimeout(() => doExit(), 4200);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4);
      if (fillRef.current) cancelAnimationFrame(fillRef.current);
    };
  }, []);

  const floodActive = phase >= 2;
  const brandLight  = phase >= 3;

  return (
    <div className={`coffee-intro-overlay ${exiting ? 'exit' : ''}`}>

      {/* Cream background */}
      <div className="coffee-bg-fill" />

      {/* Floating coffee bean particles */}
      {introParticles.map((p, i) => (
        <IntroParticle key={i} style={p} />
      ))}

      {/* Coffee flood rising from bottom */}
      <div className={`coffee-flood ${floodActive ? 'pour' : ''}`} />

      {/* Cup scene */}
      <div className="cup-scene">
        <div style={{ position: 'relative' }}>
          {/* Steam wisps (appear after phase 1) */}
          {phase >= 1 && (
            <>
              <div className="steam-wisp" />
              <div className="steam-wisp" />
              <div className="steam-wisp" />
            </>
          )}

          {/* The Cup */}
          <div className="cup-wrapper">
            <CoffeeCupSVG fillLevel={fillLevel} />
          </div>

          {/* Drip falling from cup */}
          {phase >= 1 && <div className="coffee-drip" style={{ height: 0 }} />}

          {/* Splash rings */}
          <div className="splash-ring" />
          <div className="splash-ring" />
          <div className="splash-ring" />
        </div>
      </div>

      {/* Brand */}
      <div className={`intro-brand ${brandLight ? 'light' : ''}`}>
        HOT<span>COFFEE</span>
      </div>
      <div className={`intro-tagline ${brandLight ? 'light' : ''}`}>
        Established 1992 · New York
      </div>

      {/* Skip */}
      <button className="intro-skip" onClick={doExit}>Skip ↓</button>
    </div>
  );
};

export default CoffeeIntro;