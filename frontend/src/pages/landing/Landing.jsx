import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  BarChart3,
  Target,
  FileSearch,
  ChevronRight,
  Menu,
  X,
  User,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Logo from '../../components/common/Logo';

gsap.registerPlugin(ScrollTrigger);


gsap.registerEase('jarvisSnap', (progress) => {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
});





const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const mockupRef = useRef(null);
  const textGroupRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Forced State - Ensure visibility is physically possible
      gsap.set('.hero-animate', { visibility: 'visible', opacity: 1 });

      // 2. Entry Animation
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } });

      tl.from('.hero-animate', {
        y: 60,
        opacity: 0,
        filter: 'blur(10px)',
        stagger: 0.2
      });

      if (mockupRef.current) {
        tl.from(mockupRef.current, {
          x: 100,
          opacity: 0,
          duration: 1.5,
          ease: 'expo.out'
        }, '-=1.2');
      }

      // 3. Scroll Trigger - Only starts after hero is long gone
      gsap.to('.hero-animate', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: '25% top',
          end: '75% top',
          scrub: true,
          invalidateOnRefresh: true,
        },
        opacity: 0,
        y: 50,
        stagger: 0.05,
        ease: 'none'
      });

      gsap.to('.hero-float', {
        y: -15,
        stagger: 0.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100vh] flex flex-col justify-center pt-12 lg:pt-20 pb-16 lg:pb-20 overflow-hidden px-6">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="bg-parallax absolute -top-20 -left-20 w-[600px] h-[600px] bg-purple-200/40 blur-[120px] rounded-full" />
        <div className="bg-parallax absolute top-1/2 -right-20 w-[500px] h-[500px] bg-cyan-200/30 blur-[100px] rounded-full text-parallax" />
        <div className="bg-parallax absolute -bottom-20 left-1/2 w-[600px] h-[600px] bg-pink-200/40 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
        <div ref={textGroupRef} className="space-y-6 md:space-y-8 text-center lg:text-left w-full max-w-2xl mx-auto lg:max-w-none lg:mx-0">
          <h1 className="hero-animate text-4xl md:text-7xl font-bold leading-[1.1] tracking-tight text-slate-800">
            Land more <br className="hidden md:block" />
            <span className="mindvista-text inline-block py-1">Interview Calls</span> <br className="hidden md:block" />
            with MindVista.
          </h1>

          <p className="hero-animate text-base md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Optimize your professional identity against 240+ market variables. Our neural engine ensures your resume is visible to both Humans and ATS algorithms.
          </p>

          <div className="hero-animate pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button onClick={() => navigate('/auth?mode=signup')} className="btn-mindvista !px-10 !py-5 text-sm w-full sm:w-auto">
              Analyze My Resume
            </button>
          </div>
        </div>


        <div ref={mockupRef} className="relative hidden lg:flex items-center justify-center p-4 md:p-10 order-first lg:order-last">
          <div className="relative w-full max-w-[320px] md:max-w-[450px]">

            <div className="hero-float relative z-20 clay-card !p-6 md:!p-10 rotate-[-2deg] md:rotate-[-4deg] border-white/60 shadow-2xl">
              <div className="space-y-6 md:space-y-8">

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base md:text-xl font-semibold text-slate-800 tracking-tight mb-1">Alex Rivera</h4>
                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Senior Systems Architect</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--neutral-50)] border border-white flex items-center justify-center shadow-inner shrink-0">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-purple-200" />
                  </div>
                </div>


                <div className="space-y-2">
                  <div className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400">Professional Matrix</div>
                  <p className="text-[9px] md:text-[11px] font-medium text-slate-600 leading-relaxed italic">
                    "Driving technical excellence through neural-informed architecture and scalable cloud ecosystems. 8+ years of high-frequency engineering."
                  </p>
                </div>


                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-[1px] flex-grow bg-[var(--neutral-100)]" />
                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-[var(--neutral-300)]">Recent Nodes</span>
                    <div className="h-[1px] flex-grow bg-[var(--neutral-100)]" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-end gap-2">
                      <span className="text-[10px] md:text-xs font-semibold text-slate-800 truncate">Lead Developer @ QuantumFlow</span>
                      <span className="text-[7px] md:text-[9px] font-bold text-slate-500 text-right shrink-0">2021 - PRESENT</span>
                    </div>
                  </div>
                </div>


                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-2 md:pt-4">
                  {['React', 'Node.js', 'PyTorch', 'AWS'].map(skill => (
                    <span key={skill} className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white border border-slate-100 text-[7px] md:text-[8px] font-bold text-slate-600 shadow-sm uppercase tracking-tighter">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>


              <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-white shadow-2xl flex flex-col items-center justify-center border-2 md:border-4 border-white z-30 group hover:scale-105 transition-all duration-700">
                <div className="text-2xl md:text-4xl font-bold text-purple-600">78<span className="text-sm md:text-lg">%</span></div>
                <div className="text-[7px] md:text-[8px] font-bold text-[var(--neutral-400)] uppercase tracking-widest">ATS Match</div>
                <div className="mt-1 md:mt-2 text-[8px] md:text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 md:px-2 py-0.5 rounded-full">Optimal</div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/20 backdrop-blur-3xl rounded-[3rem] md:rounded-[4rem] -z-10 rotate-6 border border-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
};


const Features = () => {
  const containerRef = useRef(null);
  const featureCards = [
    {
      title: "Contextual Intelligence",
      value: "0.8s",
      desc: "Neural-sweep speed across your entire professional identity. Decodes engineering logic in real-time.",
      icon: <Target className="w-6 h-6 text-purple-600" />,
      tag: "Neural"
    },
    {
      title: "ATS Optimization",
      value: "98%",
      desc: "Success rate across major Tier-1 Recruitment platforms. Direct calibration for algorithmic visibility.",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      tag: "Visibility"
    },
    {
      title: "Market Resonance",
      value: "240+",
      desc: "Variable checks comparing your resume against successful hires at firms like Google, OpenAI, and Linear.",
      icon: <BarChart3 className="w-6 h-6 text-cyan-600" />,
      tag: "Insight"
    },
    {
      title: "Semantic Analysis",
      value: "85%",
      desc: "Average lift in candidate response rates via high-frequency impactful verb and phrase suggestion.",
      icon: <FileSearch className="w-6 h-6 text-indigo-600" />,
      tag: "Precision"
    },
    {
      title: "Placement Velocity",
      value: "3.2x",
      desc: "Faster hiring cycle achievement through real-time compatibility scores and targeted improvement paths.",
      icon: <Activity className="w-6 h-6 text-pink-600" />,
      tag: "Speed"
    },
    {
      title: "Secure Architecture",
      value: "12k+",
      desc: "Global network nodes ensuring end-to-end encrypted profile data via enterprise-grade protocols.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      tag: "Privacy"
    }
  ];

  return (
    <section id="product" ref={containerRef} className="pt-20 lg:pt-40 pb-12 lg:pb-20 px-6 relative z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 lg:mb-32 text-center max-w-4xl mx-auto reveal-animate">
          <div className="space-y-8 lg:space-y-16">
            <div>
              <h2 className="text-3xl md:text-6xl font-bold text-slate-800 tracking-tight leading-[1.1] mb-6 md:mb-8">
                Professional Edge, <br /> Engineering Precision.
              </h2>
              <p className="text-base md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                Stop guessing. Use the data-driven insights recruiters use to find you. Upgrade your professional matrix today.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 pt-8 md:pt-12 border-t border-slate-100">
              <span className="px-5 py-2 rounded-full bg-blue-50 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">The Neural Methodology</span>
              <h3 className="text-xl md:text-3xl font-semibold text-slate-800 tracking-tight">Engineered for the Elite Tier.</h3>
              <p className="text-sm md:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
                MindVista processes your document through 240+ validation nodes. We don't just check for keywords; we analyze semantic resonance, layout heatmaps, and role-specific density to ensure your resume dominates the recruitment funnel.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {featureCards.map((card, i) => (
            <div key={i} className="feature-card clay-card !p-5 group min-h-[220px] md:min-h-[280px] flex flex-col opacity-0 translate-y-20 scale-90">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                  {React.cloneElement(card.icon, { className: 'w-4 h-4 ' + card.icon.props.className.split(' ').slice(2).join(' ') })}
                </div>
                <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[7px] font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
                  {card.tag}
                </span>
              </div>

              <div className="mb-3 md:mb-4">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 tracking-tighter leading-none mb-1">{card.value}</div>
                <div className="min-h-[2rem] md:min-h-[3rem] flex items-center">
                  <h4 className="text-[15px] md:text-[17px] font-semibold leading-tight text-slate-800 tracking-tight">{card.title}</h4>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-slate-500 leading-relaxed font-medium text-[11px] md:text-[13px]">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-12 lg:pt-24 pb-8 lg:pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="relative clay-card !p-6 md:!p-20 overflow-hidden text-center border-white/60 bg-white/40 backdrop-blur-md cta-animate opacity-0 translate-y-20 scale-95">

          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/40 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6 md:mb-10 leading-[1.1]">
              Accelerate Your <br /> Career Trajectory.
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-medium mb-8 md:mb-12 max-w-2xl mx-auto">
              Join 10,000+ candidates who have optimized their resumes to land roles at the world's most innovative firms.
            </p>
            <div className="flex justify-center items-center">
              <button onClick={() => navigate('/auth?mode=signup')} className="btn-mindvista !px-10 md:!px-14 !py-5 md:!py-7 text-xs md:text-sm w-full sm:w-auto">
                Analyze My Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Landing = () => {
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Backgrounds
      gsap.to('.bg-parallax', {
        scrollTrigger: {
          trigger: '.relative',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
        y: (i) => (i + 1) * 100,
        rotate: (i) => (i + 1) * 15,
        ease: 'none'
      });

      // Feature Reveals with clean scale
      gsap.to('.feature-card', {
        scrollTrigger: {
          trigger: '#product',
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.15,
        duration: 1.4,
        ease: 'elastic.out(1, 0.75)'
      });

      // CTA Reveal with depth
      gsap.to('.cta-animate', {
        scrollTrigger: {
          trigger: '.cta-animate',
          start: 'top 85%',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(1.7)'
      });

      // Section Header reveals
      gsap.from('.reveal-animate', {
        scrollTrigger: {
          trigger: '.reveal-animate',
          start: 'top 90%'
        },
        opacity: 0,
        y: 30,
        duration: 1
      });

    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('maintenance') === 'true') {
      toast.error('The platform is currently undergoing scheduled maintenance. Please check back shortly.', {
        id: 'maintenance-notice',
        duration: 5000,
        icon: '🛠️'
      });
      window.history.replaceState({}, document.title, "/");
    }
  }, [location]);

  return (
    <div className="relative min-h-screen">
      <Hero />
      <Features />
      <CTA />
      <div className="fixed inset-0 pointer-events-none z-50 border-[24px] border-white/10" />
    </div>
  );
};

export default Landing;

