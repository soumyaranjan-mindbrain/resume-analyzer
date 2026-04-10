import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  BarChart3,
  Target,
  FileSearch,
  ChevronRight,
  Menu,
  X,
  User
} from 'lucide-react';
import { cn } from '../../utils/cn';

gsap.registerPlugin(ScrollTrigger);


gsap.registerEase('jarvisSnap', (progress) => {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
});


const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6",
      isScrolled ? "py-4" : "py-8"
    )}>
      <div className={cn(
        "container mx-auto max-w-7xl rounded-2xl flex items-center justify-between px-8 py-4 transition-all duration-500",
        isScrolled ? "bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg" : "bg-transparent"
      )}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <img 
            src="/Kredo_logo_with_educational_theme-removebg-preview.png" 
            alt="Kredo Logo" 
            className="h-10 w-auto transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="hidden md:flex items-center gap-10">
          
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/auth')} className="hidden sm:block text-sm font-black text-[var(--neutral-900)] uppercase tracking-widest">
            Login
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="btn-kredo !py-3 !px-8 shadow-purple-500/20"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};


const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const mockupRef = useRef(null);
  const textGroupRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'jarvisSnap', duration: 1.2 } });

      tl.from('.hero-animate', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
      })
        .from(mockupRef.current, {
          x: 100,
          opacity: 0,
          rotateY: -20,
          duration: 1.5
        }, '-=1');

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
    <section ref={heroRef} className="relative min-h-[100vh] pt-40 pb-20 overflow-hidden px-6">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-purple-200/40 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-cyan-200/30 blur-[100px] rounded-full" />
        <div className="absolute -bottom-20 left-1/2 w-[600px] h-[600px] bg-pink-200/40 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <div ref={textGroupRef} className="space-y-8">
          <h1 className="hero-animate text-6xl md:text-8xl font-display font-black leading-[1.15] tracking-tighter text-[var(--neutral-900)]">
            Land more <br />
            <span className="kredo-text inline-block py-1">Interview Calls</span> <br />
            with Kredo.
          </h1>

          <p className="hero-animate text-xl text-[var(--neutral-900)]/70 max-w-xl leading-relaxed font-bold">
            Optimize your professional identity against 240+ market variables. Our neural engine ensures your resume is visible to both Humans and ATS algorithms.
          </p>

          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary-100 rounded-full blur-[80px] opacity-40 animate-float" />
            <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-white rounded-full blur-[100px] opacity-60 animate-float" style={{ animationDelay: '-3s' }} />
            <div className="absolute top-[40%] right-[30%] w-48 h-48 bg-primary-200 rounded-full blur-[60px] opacity-30 animate-float" style={{ animationDelay: '-1.5s' }} />
          </div>



          
        </div>

        
        <div ref={mockupRef} className="relative flex items-center justify-center p-10">
          <div className="relative w-full max-w-[450px]">
            
            <div className="hero-float relative z-20 clay-card !p-10 rotate-[-4deg] border-white/60 shadow-2xl">
              <div className="space-y-8">
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl font-black text-[var(--neutral-900)] tracking-tighter mb-1">Alex Rivera</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600">Senior Systems Architect</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--neutral-50)] border border-white flex items-center justify-center shadow-inner">
                    <User className="w-6 h-6 text-purple-200" />
                  </div>
                </div>

                
                <div className="space-y-2">
                  <div className="text-[8px] font-black uppercase tracking-widest text-[var(--neutral-400)]">Professional Matrix</div>
                  <p className="text-[11px] font-bold text-[var(--neutral-900)]/70 leading-relaxed italic">
                    "Driving technical excellence through neural-informed architecture and scalable cloud ecosystems. 8+ years of high-frequency engineering."
                  </p>
                </div>

                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-grow bg-[var(--neutral-100)]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--neutral-300)]">Recent Nodes</span>
                    <div className="h-[1px] flex-grow bg-[var(--neutral-100)]" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-[var(--neutral-900)]">Lead Developer @ QuantumFlow</span>
                      <span className="text-[9px] font-bold text-[var(--neutral-400)]">2021 - PRESENT</span>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--neutral-900)]/60 leading-relaxed">
                      - Orchestrated a 45% reduction in latent system overhead using AI-driven routing.<br />
                      - Scaled micro-service architecture to handle 1.2M concurrent data points.
                    </p>
                  </div>
                </div>

                
                <div className="flex flex-wrap gap-2 pt-4">
                  {['React', 'Node.js', 'PyTorch', 'AWS'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-white border border-[var(--neutral-100)] text-[8px] font-black text-[var(--neutral-900)] shadow-sm uppercase tracking-tighter">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-[2.5rem] bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-white z-30 group hover:scale-110 transition-all duration-700">
                <div className="text-4xl font-display font-black text-purple-600">78<span className="text-lg">%</span></div>
                <div className="text-[8px] font-black text-[var(--neutral-400)] uppercase tracking-widest">ATS Match</div>
                <div className="mt-2 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</div>
              </div>
            </div>



            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/20 backdrop-blur-3xl rounded-[4rem] -z-10 rotate-6 border border-white/10" />
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
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
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
    <section id="product" ref={containerRef} className="pt-60 pb-32 px-6 relative z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-32 text-center max-w-4xl mx-auto">
          <div className="space-y-16">
            <div>
              <h2 className="text-5xl md:text-7xl font-display font-black text-[var(--neutral-900)] tracking-tighter leading-[0.9] mb-8">
                Professional Edge, <br /> Engineering Precision.
              </h2>
              <p className="text-xl text-[var(--neutral-900)]/60 font-bold leading-relaxed max-w-2xl mx-auto">
                Stop guessing. Use the data-driven insights recruiters use to find you. Upgrade your professional matrix today.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 pt-12 border-t border-[var(--neutral-100)]">
              <span className="px-5 py-2 rounded-full bg-purple-50 text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">The Neural Methodology</span>
              <h3 className="text-3xl font-black text-[var(--neutral-900)] tracking-tight">Engineered for the Elite Tier.</h3>
              <p className="text-[var(--neutral-900)]/50 font-bold max-w-2xl leading-relaxed">
                Kredo processes your document through 240+ validation nodes. We don't just check for keywords; we analyze semantic resonance, layout heatmaps, and role-specific density to ensure your resume dominates the recruitment funnel.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featureCards.map((card, i) => (
            <div key={i} className="feature-card clay-card !p-5 group min-h-[280px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                  {React.cloneElement(card.icon, { className: 'w-4 h-4 ' + card.icon.props.className.split(' ').slice(2).join(' ') })}
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[var(--neutral-100)]/50 border border-[var(--neutral-200)]/30 text-[7px] font-black uppercase tracking-[0.2em] text-[var(--neutral-600)] shadow-sm">
                  {card.tag}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-display font-black text-purple-600 tracking-tighter leading-none mb-1">{card.value}</div>
                <div className="min-h-[3rem] flex items-center">
                  <h4 className="text-[17px] font-black leading-tight text-[var(--neutral-900)] tracking-tight">{card.title}</h4>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-[var(--neutral-600)] leading-relaxed font-bold text-[13px]">
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
    <section className="py-32 px-6 mb-20">
      <div className="container mx-auto max-w-7xl">
        <div className="relative clay-card !p-20 overflow-hidden text-center border-white/60 bg-white/40 backdrop-blur-md">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/40 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-display font-black text-[var(--neutral-900)] tracking-tighter mb-10 leading-[0.9]">
              Accelerate Your <br /> Career Trajectory.
            </h2>
            <p className="text-lg text-[var(--neutral-900)]/60 font-bold mb-12 max-w-2xl mx-auto">
              Join 10,000+ candidates who have optimized their resumes to land roles at the world's most innovative firms.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <button onClick={() => navigate('/auth')} className="btn-kredo !px-14 !py-7 text-sm">
                Analyze My Resume Today {'->'}
              </button>
              <button className="px-10 py-7 rounded-2xl border-2 border-white/50 bg-white/10 backdrop-blur-md text-sm font-black text-[var(--neutral-900)] uppercase tracking-widest hover:bg-white/30 transition-all">
                View Sample Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Landing = () => {
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

