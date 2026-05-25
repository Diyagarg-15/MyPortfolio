import React, { useState, useCallback, useRef, useEffect } from "react";
import "./styles/Work.css";

const projects = [
  {
    title: "Travel booking & exploration platform",
    desc: "A full-featured travel website  where planing, exploring , and booking your next destination is easy — all in one place.",
    stack: [
      { name: "Next.js", hl: true },
      { name: "TypeScript", hl: true },
      { name: "Tailwind", hl: true },
      { name: ".Net", hl: true },
    ],
    url: "https://github.com/Diyagarg-15/tafriTravels",
    img: "https://picsum.photos/seed/proj1/700/1400",
    video: "images/travel.mp4",
  },
  {
    title: "UI/UX showcase",
    desc: "creative personal product showcase with immersive storytelling UI.",
    stack: [
      { name: "Javascript", hl: true },
      { name: "Framer", hl: true },
      { name: "Scroll animations", hl: true },
      { name: "Figma", hl: true },
    ],
    url: "https://67booze.framer.website/",
    img: "https://picsum.photos/seed/proj2/700/1400",
    video: "images/67.mp4",
  },
  {
    title: "E-commerce retail website",
    desc: "A full-featured admin panel with real-time analytics, order tracking, and inventory management.",
    stack: [
      { name: "Next.js", hl: true },
      { name: "React", hl: true },
      { name: "Tailwind", hl: true },
      { name: "Wordpress", hl: true },
    ],
    url: "https://pringo.in/",
    img: "images/pringo.png",
  },
  {
    title: "Movie Booking real-time website",
    desc: "Real-time movie discovery, seat booking, and cinema selection — all by your location with Admin Dashboard to manage data",
    stack: [
      { name: "React", hl: true },
      { name: "Springboot", hl: false },
      { name: "SQL", hl: true },
      { name: "Tailwind", hl: true },
    ],
    url: "https://github.com/Diyagarg-15/multiplex-website-main",
    img: "images/Movie.png",
  },
  {
    title: "TCSS Mechanics — Animation Showcase",
    desc: "A deep dive into what pure CSS can do — complex animations, precision timing, and motion built entirely without libraries.",
    stack: [
      { name: "CSS", hl: true },
      { name: "GSAP", hl: true },
      { name: "SCSS", hl: true },
      { name: "HTML", hl: true },
    ],
    url: "https://github.com/Diyagarg-15/moonlight",
    img: "https://picsum.photos/seed/proj5/700/1400",
    video: "images/sun.mp4"
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
                  {proj.video ? (
                    <video
                      className="screen-video"
                      src={proj.video}
                      preload="auto"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img className="screen-img" src={proj.img} alt={`${proj.title} preview`} />
                  )}
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