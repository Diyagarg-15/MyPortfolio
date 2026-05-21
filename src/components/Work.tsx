import React, { useState, useCallback, useRef, useEffect } from "react";
import "./styles/Work.css";

const projects = [
  {
    title: "E-Commerce Dashboard",
    desc: "A full-featured admin panel with real-time analytics, order tracking, and inventory management.",
    stack: [
      { name: "React", hl: true },
      { name: "TypeScript", hl: true },
      { name: "Tailwind", hl: false },
      { name: "Recharts", hl: false },
    ],
    url: "yourproject.com",
    img: "https://picsum.photos/seed/proj1/700/1400",
  },
  {
    title: "Design System UI Kit",
    desc: "A component library with 60+ elements, dark/light mode, and a live Storybook playground.",
    stack: [
      { name: "React", hl: true },
      { name: "Storybook", hl: false },
      { name: "CSS Modules", hl: false },
      { name: "Figma", hl: false },
    ],
    url: "designsystem.dev",
    img: "https://picsum.photos/seed/proj2/700/1400",
  },
  {
    title: "SaaS Landing Page",
    desc: "High-conversion landing page with animated sections, pricing table, and waitlist form.",
    stack: [
      { name: "Next.js", hl: true },
      { name: "Framer Motion", hl: true },
      { name: "Tailwind", hl: false },
    ],
    url: "saasapp.io",
    img: "https://picsum.photos/seed/proj3/700/1400",
  },
  {
    title: "Creative Portfolio",
    desc: "Scroll-driven animations, project case studies, and custom cursor interactions.",
    stack: [
      { name: "React", hl: true },
      { name: "GSAP", hl: false },
      { name: "Three.js", hl: false },
      { name: "Sass", hl: false },
    ],
    url: "portfolio.design",
    img: "https://picsum.photos/seed/proj4/700/1400",
  },
  {
    title: "Task Management App",
    desc: "Drag-and-drop kanban board with real-time sync, workspace sharing, and AI task suggestions.",
    stack: [
      { name: "React", hl: true },
      { name: "Zustand", hl: false },
      { name: "Supabase", hl: false },
      { name: "dnd-kit", hl: false },
    ],
    url: "taskflow.app",
    img: "https://picsum.photos/seed/proj5/700/1400",
  }
];

const Work = () => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setVisible(window.innerWidth <= 860 ? 1 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = projects.length;

  const goTo = useCallback((n: number) => {
    const newCurrent = Math.max(0, Math.min(n, total - visible));
    setCurrent(newCurrent);
  }, [total, visible]);

  useEffect(() => {
    goTo(Math.min(current, total - visible));
  }, [visible, total, current, goTo]);

  const handlePrev = () => goTo(current - 1);
  const handleNext = () => goTo(current + 1);

  const getTransform = useCallback(() => {
    if (!trackRef.current) return 'translateX(0px)';
    const firstCard = trackRef.current.children[0] as HTMLElement;
    if (!firstCard) return 'translateX(0px)';
    
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 24;
    return `translateX(-${current * (cardWidth + gap)}px)`;
  }, [current]);

  const [trackStyle, setTrackStyle] = useState({ transform: 'translateX(0px)' });

  useEffect(() => {
    setTrackStyle({ transform: getTransform() });
  }, [current, visible, getTransform]);

  useEffect(() => {
    const handleResize = () => {
      setTrackStyle({ transform: getTransform() });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getTransform]);

  const handleTouchStart = (e: React.TouchEvent) => setTx(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = e.currentTarget.querySelector('.screen-video') as HTMLVideoElement;
    if (video) video.play();
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = e.currentTarget.querySelector('.screen-video') as HTMLVideoElement;
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
  };

  return (
    <div className="work-section" id="work">
      <div className="noise-bg"></div>

      <header className="section-header">
        <p className="eyebrow">Selected work</p>
        <h1 className="section-title">Things I've <em>built</em></h1>
        <p className="section-sub">Hover a card to scroll through the site. Click to visit live.</p>
      </header>

      <div className="carousel-outer">
        <div className="carousel-track-wrap">
          <div 
            className="carousel-track" 
            id="track" 
            ref={trackRef}
            style={trackStyle}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {projects.map((proj, idx) => (
              <div 
                className="project-card" 
                key={idx}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="browser-chrome">
                  <div className="browser-top">
                    <div className="dots">
                      <div className="dot dot-r"></div>
                      <div className="dot dot-y"></div>
                      <div className="dot dot-g"></div>
                    </div>
                    <div className="url-bar">{proj.url}</div>
                  </div>
                </div>
                <div className="screen-wrap">
                  <img className="screen-img" src={proj.img} alt={`${proj.title} preview`} />
                  <div className="hover-reveal">
                    <span className="hover-hint">Scrolling through</span>
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-number">0{idx + 1} / 05</div>
                  <h2 className="card-title">{proj.title}</h2>
                  <p className="card-desc">{proj.desc}</p>
                  <div className="stack-row">
                    {proj.stack.map((s, sIdx) => (
                        <span key={sIdx} className={`stack-pill ${s.hl ? 'highlight' : ''}`}>{s.name}</span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <a href="#" className="btn-live">↗ View live</a>
                    <a href="#" className="btn-gh">GitHub</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carousel-controls">
          <button 
            className="ctrl-btn" 
            id="prev-btn" 
            aria-label="Previous"
            onClick={handlePrev}
            disabled={current === 0}
          >
            &#8592;
          </button>
          <div className="ctrl-dots" id="ctrl-dots">
            {Array.from({ length: total }).map((_, i) => (
                <button 
                    key={i}
                    className={`ctrl-dot ${i === current ? 'active' : ''}`}
                    aria-label={`Go to project ${i + 1}`}
                    onClick={() => goTo(i)}
                />
            ))}
          </div>
          <button 
            className="ctrl-btn" 
            id="next-btn" 
            aria-label="Next"
            onClick={handleNext}
            disabled={current >= total - visible}
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Work;