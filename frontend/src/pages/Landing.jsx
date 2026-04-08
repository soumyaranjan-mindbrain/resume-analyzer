import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileText,
  Search,
  ArrowRight,
  Layout,
  Globe,
  Share2,
  BarChart2,
  Sparkles,
  TrendingUp,
  X,
  Menu,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.5 }
    );

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-[#030712]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.4)]">
            <Layout className="text-black w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">Aptica</span>
        </div>



        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-[#00D2FF] text-black text-[13px] font-bold rounded-full hover:bg-[#00D2FF]/90 hover:shadow-[0_0_18px_rgba(0,210,255,0.4)] transition-all"
          >
            Get Started
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-t border-white/5 px-6 pb-6"
          >

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                className="flex-1 py-2 border border-white/10 rounded-full text-sm text-gray-400"
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                className="flex-1 py-2 bg-[#00D2FF] text-black text-sm font-bold rounded-full"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


/* ─────────────────────────────────────────────
   PREMIUM FLOATING PARTICLES (GLOBAL BACKGROUND)
───────────────────────────────────────────── */
const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      init();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        // Depth-based layers
        this.depth = Math.random() * 0.85 + 0.15; // Closer dots move faster
        this.size = (Math.random() * 1.0 + 0.45) * (this.depth + 0.5); // Slightly larger
        this.baseSize = this.size;
        
        this.velocity = {
          x: (Math.random() - 0.5) * 0.25 * (1 + this.depth),
          y: (Math.random() - 0.5) * 0.25 * (1 + this.depth)
        };
        
        const isCyan = Math.random() > 0.88;
        this.color = isCyan ? '0, 210, 255' : '255, 255, 255';
        this.baseAlpha = (Math.random() * 0.18 + 0.08) * this.depth; // Reverted visibility
        this.alpha = this.baseAlpha;
        this.glow = isCyan;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();

        // Glow Logic (Subtle spotlight) - reduced footprint
        const isInteractive = this.alpha > this.baseAlpha + 0.05;
        if ((this.glow || isInteractive) && this.alpha > 0.05) {
          const glowIntensity = isInteractive ? this.alpha * 0.4 : this.alpha * 0.12;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2, false); // Much tighter glow
          ctx.fillStyle = `rgba(${this.color}, ${glowIntensity})`;
          ctx.fill();
        }
      }

      update() {
        // Drift
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Mouse Spotlight & Parallax
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Parallax Shift (subtle 3D feel)
        if (mouse.x !== -1000) {
          const parallaxX = (mouse.x - window.innerWidth / 2) * 0.015 * this.depth;
          const parallaxY = (mouse.y - window.innerHeight / 2) * 0.015 * this.depth;
          this.x += parallaxX * 0.05;
          this.y += parallaxY * 0.05;
        }

        // Spotlight Feedback (Brightness ONLY, no size growth)
        if (distance < 120) {
          const force = (120 - distance) / 120;
          this.alpha = Math.min(0.85, this.baseAlpha + force * 0.65);
          
          // Smooth Magnetism
          this.x -= dx * force * 0.025;
          this.y -= dy * force * 0.025;
        } else {
          // Reset alpha
          if (this.alpha > this.baseAlpha) this.alpha -= (this.alpha - this.baseAlpha) * 0.1;
        }

        // Wraparound
        if (this.x > window.innerWidth + 50) this.x = -50;
        else if (this.x < -50) this.x = window.innerWidth + 50;
        if (this.y > window.innerHeight + 50) this.y = -50;
        else if (this.y < -50) this.y = window.innerHeight + 50;

        this.draw();
      }
    }

    const init = () => {
      particles = [];
      // Much higher count, much higher density
      const count = Math.min(2500, Math.floor((window.innerWidth * window.innerHeight) / 1200));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};


/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const microRef = useRef(null);
  const contentWrapperRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Word Entrance Animation
    const wordSpans = titleRef.current.querySelectorAll('span > span > span, span > span');
    tl.fromTo(wordSpans,
      {
        y: 100,
        opacity: 0,
        filter: 'blur(10px)',
        rotateX: -40
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        rotateX: 0,
        duration: 1.5,
        stagger: 0.12
      },
      '+=0.1'
    )
      .fromTo(subtextRef.current,
        { y: 20, opacity: 0, filter: 'blur(5px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2 },
        '-=1'
      )
      .fromTo(ctaRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8 },
        '-=0.8'
      );

    // Premium Scroll-based Text Fade/Scale Up
    // Applied strictly to the wrapper so it doesn't conflict with the fromTo entrance logic above
    gsap.to(contentWrapperRef.current, {
      y: -80,
      opacity: 0,
      scale: 0.9,
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom center',
        scrub: true
      }
    });

    // Clean up if necessary

  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#3A7BD5]/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00D2FF]/5 blur-[100px] rounded-full" />
      </div>

      <div ref={contentWrapperRef} className="container mx-auto px-6 text-center max-w-4xl relative z-10">

        {/* Heading */}
        <h1
          ref={titleRef}
          className="text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6 overflow-hidden flex flex-wrap justify-center font-inter min-h-[1.1em] md:min-h-[2.2em]"
        >
          {"Turn Your Resume Into Interview Calls".split(" ").map((word, i) => (
            <span key={i} className={`inline-block ${word === "Calls" ? "mr-0" : "mr-[0.2em]"} overflow-hidden py-1`}>
              <span className="inline-block">
                {(word === "Interview" || word === "Calls") ? (
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5]">
                    {word}
                  </span>
                ) : word}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="text-white/70 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-loose"
        >
          AI-powered resume analysis that boosts your ATS score and helps you land more interviews.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 px-6 py-3 bg-[#00D2FF] text-black text-sm font-bold rounded-full hover:bg-[#00D2FF]/90 hover:shadow-[0_0_24px_rgba(0,210,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 border border-white/[0.12] text-sm font-medium text-gray-300 rounded-full hover:border-white/30 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 bg-white/[0.03]"
          >
            Check Compatibility
          </button>
        </div>

        {/* Micro Copy */}
        <p
          ref={microRef}
          className="mt-8 text-[10px] text-gray-600 font-bold uppercase tracking-[0.25em]"
        >
          No unnecessary steps • Fast and seamless analysis
        </p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT PREVIEW (App Mockup)
───────────────────────────────────────────── */
const ProductPreview = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Pure Expand to Full Screen Scroll Animation
    gsap.fromTo(cardRef.current,
      {
        scale: 0.65,
        opacity: 0.3
      },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%', // Start expanding slightly before it reaches the center
          end: 'top 20%',   // Fully expanded by the time it reaches the upper quarter
          scrub: true,      // Lock perfectly to scroll
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="pb-32 px-4 md:px-8 perspective-1000">
      <div className="w-full max-w-6xl mx-auto">
        <div
          ref={cardRef}
          className="relative rounded-[1.75rem] p-[1px] bg-gradient-to-b from-gray-700/60 via-gray-800/30 to-transparent shadow-[0_40px_100px_rgba(0,0,0,0.5)] transform-gpu origin-center"
        >
          <div className="bg-[#0D1117] rounded-[1.7rem] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05] bg-[#0D1117]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[#1C2333] rounded-md px-8 py-1 text-[10px] text-gray-500 font-mono">
                  https://aptica.com
                </div>
              </div>
            </div>

            {/* App content */}
            <div className="grid grid-cols-12 gap-0 min-h-[360px]">
              {/* Sidebar */}
              <div className="col-span-3 border-r border-white/[0.04] bg-[#090D14] p-4 flex flex-col gap-2">
                {/* Search bar */}
                <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-2 mb-3">
                  <Search className="w-3 h-3 text-gray-600" />
                  <div className="h-2 flex-1 bg-white/5 rounded" />
                </div>
                {['Dashboard', 'Resumes', 'Analysis', 'Jobs', 'Settings'].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[10px] ${i === 1
                      ? 'bg-[#00D2FF]/10 text-[#00D2FF]'
                      : 'text-gray-600 hover:text-gray-400'
                      }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-[#00D2FF]' : 'bg-gray-700'}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main panel */}
              <div className="col-span-6 border-r border-white/[0.04] bg-[#0D1117] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[10px] font-mono text-gray-500">Resume.pdf</span>
                  <div className="ml-auto px-2 py-0.5 bg-[#00D2FF]/10 rounded text-[9px] text-[#00D2FF]">Analyzing...</div>
                </div>

                {/* Resume mock content */}
                <div className="space-y-2.5">
                  <div className="h-4 w-2/5 bg-white/[0.08] rounded" />
                  <div className="h-2.5 w-1/3 bg-white/[0.04] rounded" />
                  <div className="h-px bg-white/[0.04] my-3" />
                  <div className="h-2.5 w-full bg-white/[0.04] rounded" />
                  <div className="h-2.5 w-5/6 bg-white/[0.04] rounded" />
                  <div className="h-2.5 w-4/5 bg-white/[0.04] rounded" />
                  <div className="h-px bg-white/[0.04] my-3" />
                  <div className="space-y-2">
                    {[1, 0.8, 0.9, 0.7].map((w, i) => (
                      <div key={i} className="h-2 rounded" style={{ width: `${w * 100}%`, background: 'rgba(255,255,255,0.03)' }} />
                    ))}
                  </div>
                </div>

                {/* AI scan overlay */}
                <motion.div
                  animate={{ top: ['10%', '85%', '10%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/30 to-transparent"
                  style={{ position: 'relative', marginTop: 12 }}
                />
              </div>

              {/* Right stats panel */}
              <div className="col-span-3 bg-[#090D14] p-4 flex flex-col gap-3">
                {/* Precision Score */}
                <div className="bg-[#111827]/80 rounded-xl p-3 border border-white/[0.04]">
                  <div className="text-[9px] text-gray-500 mb-2 uppercase tracking-wider">Precision Score</div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-white">78</div>
                    <div className="text-[9px] text-[#00D2FF] bg-[#00D2FF]/10 px-1.5 py-0.5 rounded">%</div>
                  </div>
                  <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '78%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] rounded-full"
                    />
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-[#111827]/80 rounded-xl p-3 border border-white/[0.04]">
                  <div className="text-[9px] text-gray-500 mb-2 uppercase tracking-wider">Keywords</div>
                  <div className="flex flex-wrap gap-1">
                    {['React', 'AI/ML', 'Python'].map(k => (
                      <span key={k} className="px-1.5 py-0.5 bg-[#3A7BD5]/20 border border-[#3A7BD5]/30 rounded text-[8px] text-[#3A7BD5]">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-[#111827]/80 rounded-xl p-3 border border-white/[0.04] flex-1">
                  <div className="text-[9px] text-gray-500 mb-2 uppercase tracking-wider">Suggestions</div>
                  {[80, 60, 45].map((w, i) => (
                    <div key={i} className="mb-1.5">
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-white/10 rounded-full" style={{ width: `${w}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TRUSTED BY
───────────────────────────────────────────── */
const TrustedBy = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        }
      }
    );
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-[0.25em] mb-10">
          Trusted by 100+ professionals at
        </p>
        <div ref={containerRef} className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {['Google', 'Stripe', 'Linear', 'Meta', 'Airbnb'].map((brand) => (
            <span
              key={brand}
              className="text-xl md:text-2xl font-bold text-gray-700 hover:text-gray-400 transition-colors duration-300 cursor-default tracking-tight"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────── */
const Features = () => {
  const features = [
    {
      icon: <BarChart2 className="w-5 h-5 text-[#00D2FF]" />,
      iconBg: 'bg-[#00D2FF]/10',
      title: 'Precision-based scoring',
      desc: 'Beyond basic resume checking. Our advanced optimization engine ensures real-world hiring alignment.',
      visual: (
        <div className="relative w-28 h-28 flex items-center justify-center mt-6 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1F2937" strokeWidth="7" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#atsGrad)"
              strokeWidth="7"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.78) }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#3A7BD5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">78</span>
            <span className="text-[10px] text-gray-500">/ 100</span>
          </div>
        </div>
      ),
    },
    {
      icon: <Search className="w-5 h-5 text-[#7C4DFF]" />,
      iconBg: 'bg-[#7C4DFF]/10',
      title: 'Context-aware analysis',
      desc: 'Smart job description matching and deep resume intelligence to identify critical gaps and high-impact insights.',
      visual: (
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {['Product Strategy', 'TypeScript'].map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['AI Models', 'Scalability'].map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-[#00D2FF]/5 border border-[#00D2FF]/20 text-[10px] text-[#00D2FF]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#00D2FF]" />,
      iconBg: 'bg-[#00D2FF]/10',
      title: 'Personalized roadmap',
      desc: 'Data-driven optimization and skill gap detection for long-term career readiness and industry-aligned insights.',
      visual: (
        <div className="mt-6 space-y-3">
          {[
            { label: 'Leadership', val: 75, color: '#00D2FF' },
            { label: 'System Design', val: 45, color: '#3A7BD5' },
          ].map(({ label, val, color }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-400">{val}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${val}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const containerRef = useRef(null);

  useEffect(() => {
    const cards = containerRef.current.querySelectorAll('.feature-card');
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section id="product" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why Aptica AI?</h2>
          <p className="text-gray-500 max-w-lg leading-relaxed">
            Smarter way to improve your resume. Designed for clarity and focused on real results with modern AI insights.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div ref={containerRef} className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card group relative bg-[#0D1117] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] cursor-default overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D2FF]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              {f.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   STATS STRIP
───────────────────────────────────────────── */
const Stats = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current.children,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        }
      }
    );
  }, []);

  return (
    <section className="py-16 px-6">
      <div ref={containerRef} className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
        {[
          { number: '3x', label: 'More interview callbacks' },
          { number: '98%', label: 'ATS pass rate' },
          { number: '10k+', label: 'Resumes optimized' },
        ].map(({ number, label }) => (
          <div key={label} className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              {number}
            </div>
            <div className="text-xs text-gray-600 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────────── */
const CTA = () => {
  const navigate = useNavigate();
  const bannerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(bannerRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top 90%',
        }
      }
    );
  }, []);

  return (
    <section className="py-24 px-6">
      <div
        ref={bannerRef}
        className="max-w-4xl mx-auto relative rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,210,255,0.1)]"
      >
        {/* BG */}
        <div className="absolute inset-0 bg-[#0D1117] border border-white/[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3A7BD5]/10 via-transparent to-[#00D2FF]/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/40 to-transparent" />

        <div className="relative z-10 py-20 px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Turn your resume into a strong profile.
          </h2>
          <p className="text-gray-500 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Fast and seamless analysis with an intelligent feedback system. Join thousands for real-world results.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3.5 bg-[#00D2FF] text-black text-sm font-bold rounded-full hover:bg-[#00D2FF]/90 hover:shadow-[0_0_28px_rgba(0,210,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Optimize Now
          </button>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-white/[0.05] bg-[#030712]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center">
              <Layout className="text-black w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-white">Aptica</span>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-[13px] text-gray-600">
            {['Product', 'Solutions', 'Pricing', 'About'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-gray-300 transition-colors">
                {l}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[Globe, Share2, X].map((Icon, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-600 hover:text-white hover:border-white/20 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5 border-t border-white/[0.04] text-[11px] text-gray-700">
          <p>© 2026 Aptica. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map(l => (
              <a key={l} href="#" className="hover:text-gray-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
const Landing = () => (
  <div className="min-h-screen bg-[#030712] text-white selection:bg-[#00D2FF]/20 selection:text-white overflow-x-hidden">
    <FloatingParticles />
    <Navbar />
    <Hero />
    <ProductPreview />
    <TrustedBy />
    <Features />
    <Stats />
    <CTA />
    <Footer />
  </div>
);

export default Landing;
