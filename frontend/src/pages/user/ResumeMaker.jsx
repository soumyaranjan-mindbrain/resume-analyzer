import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import {
    Plus,
    Sparkles,
    Layout,
    ChevronLeft,
    ChevronRight,
    Download,
    Printer,
    ChevronDown,
    User,
    Briefcase,
    GraduationCap,
    Code2,
    Trophy,
    Save,
    Trash2,
    MoreVertical,
    FileText
} from 'lucide-react';
import { cn } from '../../utils/cn';
import * as Templates from './components/ResumeTemplates';
import { uploadResume, autoFillFromResume, optimizeForJD } from '../../services/api';
import { toast } from 'react-hot-toast';

const dummyPreviewData = {
    fullName: "ALEX STERLING",
    targetRole: "Senior Neural Architect",
    email: "alex.sterling@neural.com",
    phone: "+1 (555) 001-9922",
    location: "Neo-Tokyo, JP",
    linkedin: "linkedin.com/in/alex",
    github: "github.com/asterling",
    summary: "Deep-tech engineer specializing in high-throughput data meshes and decentralized AI nodes. Focused on reducing cognitive latency in distributed compute environments.",
    skills: ["Rust", "PyTorch", "Kubernetes", "Redis", "Solidity", "GRPC"],
    experience: [
        { role: "Staff Architect", company: "Cyberdyne Systems", startDate: "2020", endDate: "Current", highlights: ["Orchestrated a 400-node GPU cluster", "Reduced infra spend by $2M/yr"] }
    ],
    education: [{ degree: "M.S. Robotics", university: "MIT", year: "2018" }]
};

const ResumeMaker = () => {
    const CACHE_KEY = 'MBI_GLOBAL_RESUME_CONTEXT';

    const [view, setView] = useState(() => {
        const saved = sessionStorage.getItem(CACHE_KEY);
        if (saved) return JSON.parse(saved).view;
        return 'gallery';
    });

    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        const saved = sessionStorage.getItem(CACHE_KEY);
        if (saved) return JSON.parse(saved).selectedTemplate;
        return 1;
    });

    const [activeTab, setActiveTab] = useState('basics');
    const [isProcessing, setIsProcessing] = useState(false);
    const [jdText, setJdText] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const autoFillInputRef = useRef(null);

    const [resumeData, setResumeData] = useState(() => {
        const saved = sessionStorage.getItem(CACHE_KEY);
        if (saved) return JSON.parse(saved).resumeData;
        return {
            fullName: '',
            phone: '',
            email: '',
            linkedin: '',
            portfolio: '',
            github: '',
            location: '',
            targetRole: '',
            summary: '',
            skills: [],
            experience: [],
            education: [],
            projects: [],
            achievements: [],
            languages: '',
            frameworks: '',
            cloud: '',
            certifications: ''
        };
    });

    // Persist State to SessionStorage
    useEffect(() => {
        const stateToSave = {
            resumeData,
            view,
            selectedTemplate
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(stateToSave));
    }, [resumeData, view, selectedTemplate]);

    const handleDataChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const addListItem = (field, defaultItem) => {
        setResumeData(prev => ({ ...prev, [field]: [...prev[field], defaultItem] }));
    };

    const removeListItem = (field, index) => {
        setResumeData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateListItem = (field, index, value) => {
        setResumeData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? { ...item, ...value } : item)
        }));
    };

    // AI Automation: Strategic Synthesis (Source + Target)
    const handleAutoFill = async () => {
        const file = uploadedFile;
        if (!file) return;

        try {
            setIsProcessing(true);
            toast.loading('Initializing Strategic Synthesis...', { id: 'autofill' });

            // 1. Upload & Parse Base Data
            const formData = new FormData();
            formData.append('file', file);
            const uploadResult = await uploadResume(formData);
            const { data: parsedData } = await autoFillFromResume(uploadResult.resume.id);

            let finalData = parsedData;

            // 2. Immediate Optimization if JD is provided
            if (jdText.trim()) {
                toast.loading('Aligning with target benchmarks...', { id: 'autofill' });
                const { data: optimizedData } = await optimizeForJD(parsedData, jdText);
                finalData = optimizedData;
            }

            // 3. Populate
            setResumeData(prev => ({
                ...prev,
                ...finalData,
                skills: Array.isArray(finalData.skills) ? finalData.skills : [],
                experience: Array.isArray(finalData.experience) ? finalData.experience : [],
                education: Array.isArray(finalData.education) ? finalData.education : [],
                projects: Array.isArray(finalData.projects) ? finalData.projects : []
            }));

            toast.success('Professional Narrative Synthesized!', { id: 'autofill' });
            setView('editor');
        } catch (err) {
            console.error('Synthesis failed:', err);
            toast.error('Synthesis interrupted. Please verify credentials.', { id: 'autofill' });
        } finally {
            setIsProcessing(false);
        }
    };


    const templates = [
        { id: 1, name: 'The Executive / Elite', desc: 'Classy & sophisticated layout with optimized typography for senior roles.', component: Templates.Template1 },
        { id: 2, name: 'The Strategic Sidebar', desc: 'Modern 2-column structure to highlight skills and contact alongside history.', component: Templates.Template2 },
        { id: 3, name: 'The Minimalist Tech', desc: 'Precise monospace design with high-density blocks for engineering precision.', component: Templates.Template3 },
        { id: 4, name: 'The Elegant Narrative', desc: 'Impact-driven layout with bold headers and clean narrative flow.', component: Templates.Template4 }
    ];

    if (view === 'editor') {
        const CurrentTemplate = templates.find(t => t.id === selectedTemplate)?.component || Templates.Template1;

        return (
            <div className="relative">
                <style>{`
                    @media print {
                        .no-print { display: none !important; }
                        body { margin: 0; padding: 0; }
                        .print-area { width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: none !important; }
                    }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                `}</style>
                <div className="flex gap-8 no-print">
                    {/* Editor Sidebar */}
                    <div className="w-[450px] bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-shrink-0">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <button
                                onClick={() => setView('gallery')}
                                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900 flex items-center gap-2 group"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold text-xs uppercase tracking-widest">Gallery</span>
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="h-10 px-6 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span className="font-bold text-[11px] uppercase tracking-widest text-white">Save Resume</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-8">
                            {/* Tab Switcher */}
                            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl sticky top-0 z-20">
                                {[
                                    { id: 'basics', icon: User },
                                    { id: 'experience', icon: Briefcase },
                                    { id: 'education', icon: GraduationCap },
                                    { id: 'skills', icon: Code2 },
                                    { id: 'projects', icon: Layout }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex-1 flex justify-center py-2.5 rounded-xl transition-all",
                                            activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>

                            {/* Form Sections */}
                            {activeTab === 'basics' && (
                                <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Primary Information</h3>
                                    <div className="space-y-4">
                                        <Input label="Full Name" value={resumeData.fullName} onChange={(val) => handleDataChange('fullName', val)} placeholder="John Doe" />
                                        <Input label="Target Role" value={resumeData.targetRole} onChange={(val) => handleDataChange('targetRole', val)} placeholder="Senior Software Engineer" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Phone" value={resumeData.phone} onChange={(val) => handleDataChange('phone', val)} placeholder="+91 9876543210" />
                                            <Input label="Email" value={resumeData.email} onChange={(val) => handleDataChange('email', val)} placeholder="john@example.com" />
                                        </div>
                                        <Input label="Location" value={resumeData.location} onChange={(val) => handleDataChange('location', val)} placeholder="Bangalore, India" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="LinkedIn" value={resumeData.linkedin} onChange={(val) => handleDataChange('linkedin', val)} />
                                            <Input label="GitHub" value={resumeData.github} onChange={(val) => handleDataChange('github', val)} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Summary</label>
                                            <textarea
                                                value={resumeData.summary}
                                                onChange={(e) => handleDataChange('summary', e.target.value)}
                                                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                                                placeholder="Introduce yourself professionally..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'experience' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Work History</h3>
                                        <button
                                            onClick={() => addListItem('experience', { role: '', company: '', startDate: '', endDate: '', location: '', highlights: [''] })}
                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700"
                                        >+ Add Experience</button>
                                    </div>
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 relative group">
                                            <button onClick={() => removeListItem('experience', i)} className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-200 text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
                                            <Input label="Role" value={exp.role} onChange={(v) => updateListItem('experience', i, { role: v })} />
                                            <Input label="Company" value={exp.company} onChange={(v) => updateListItem('experience', i, { company: v })} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input label="Start Date" value={exp.startDate} onChange={(v) => updateListItem('experience', i, { startDate: v })} />
                                                <Input label="End Date" value={exp.endDate} onChange={(v) => updateListItem('experience', i, { endDate: v })} />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Key Highlights</label>
                                                    <button onClick={() => {
                                                        const highlights = [...(exp.highlights || []), ''];
                                                        updateListItem('experience', i, { highlights });
                                                    }} className="text-[9px] font-bold text-blue-600 uppercase">+ Add</button>
                                                </div>
                                                {(exp.highlights || []).map((h, hIdx) => (
                                                    <div key={hIdx} className="flex gap-2 group/h">
                                                        <input
                                                            value={h}
                                                            onChange={(e) => {
                                                                const newHighlights = [...exp.highlights];
                                                                newHighlights[hIdx] = e.target.value;
                                                                updateListItem('experience', i, { highlights: newHighlights });
                                                            }}
                                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                                            placeholder="Describe a key achievement..."
                                                        />
                                                        <button onClick={() => {
                                                            const newHighlights = exp.highlights.filter((_, idx) => idx !== hIdx);
                                                            updateListItem('experience', i, { highlights: newHighlights });
                                                        }} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover/h:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'skills' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Skills & Tech Stack</h3>
                                    <div className="space-y-4">
                                        <Input label="Languages" value={resumeData.languages} onChange={(v) => handleDataChange('languages', v)} />
                                        <Input label="Frameworks" value={resumeData.frameworks} onChange={(v) => handleDataChange('frameworks', v)} />
                                        <Input label="Cloud Platforms" value={resumeData.cloud} onChange={(v) => handleDataChange('cloud', v)} />
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Key Skills (Comma Separated)</label>
                                            <textarea
                                                value={resumeData.skills.join(', ')}
                                                onChange={(e) => handleDataChange('skills', e.target.value.split(',').map(s => s.trim()))}
                                                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                                                placeholder="React, Node.js, AWS..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'education' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Education</h3>
                                        <button
                                            onClick={() => addListItem('education', { degree: '', university: '', field: '', year: '' })}
                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700"
                                        >+ Add Education</button>
                                    </div>
                                    {resumeData.education.map((edu, i) => (
                                        <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 relative group">
                                            <button onClick={() => removeListItem('education', i)} className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-200 text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
                                            <Input label="Degree" value={edu.degree} onChange={(v) => updateListItem('education', i, { degree: v })} />
                                            <Input label="University" value={edu.university} onChange={(v) => updateListItem('education', i, { university: v })} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input label="Field" value={edu.field} onChange={(v) => updateListItem('education', i, { field: v })} />
                                                <Input label="Year" value={edu.year} onChange={(v) => updateListItem('education', i, { year: v })} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'projects' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Projects</h3>
                                        <button
                                            onClick={() => addListItem('projects', { name: '', techStack: '', highlights: [''] })}
                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700"
                                        >+ Add Project</button>
                                    </div>
                                    {resumeData.projects.map((p, i) => (
                                        <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 relative group">
                                            <button onClick={() => removeListItem('projects', i)} className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-200 text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
                                            <Input label="Project Name" value={p.name} onChange={(v) => updateListItem('projects', i, { name: v })} />
                                            <Input label="Tech Stack" value={p.techStack} onChange={(v) => updateListItem('projects', i, { techStack: v })} />
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Project Highlights</label>
                                                    <button onClick={() => {
                                                        const highlights = [...(p.highlights || []), ''];
                                                        updateListItem('projects', i, { highlights });
                                                    }} className="text-[9px] font-bold text-blue-600 uppercase">+ Add</button>
                                                </div>
                                                {(p.highlights || []).map((h, hIdx) => (
                                                    <div key={hIdx} className="flex gap-2 group/ph">
                                                        <input
                                                            value={h}
                                                            onChange={(e) => {
                                                                const newHighlights = [...p.highlights];
                                                                newHighlights[hIdx] = e.target.value;
                                                                updateListItem('projects', i, { highlights: newHighlights });
                                                            }}
                                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                                            placeholder="What was the outcome?"
                                                        />
                                                        <button onClick={() => {
                                                            const newHighlights = p.highlights.filter((_, idx) => idx !== hIdx);
                                                            updateListItem('projects', i, { highlights: newHighlights });
                                                        }} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover/ph:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel - Flat UI */}
                    <div className="flex-1 bg-white overflow-hidden flex flex-col relative no-print">
                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar flex justify-center">
                            <div className="transform scale-[0.8] xl:scale-[0.9] origin-top shrink-0">
                                <CurrentTemplate data={resumeData} />
                            </div>
                        </div>

                        {/* Template Quick Switcher - Top Positioned */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-2 flex gap-2 z-20">
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    title={t.name}
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all",
                                        selectedTemplate === t.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-50"
                                    )}
                                >
                                    {t.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bulletproof Print Portal Container */}
                    {createPortal(
                        <div className="hidden print:block print:absolute print:top-0 print:left-0 print:w-[210mm] print:bg-white print:z-[99999]" id="mbi-resume-print-portal">
                            <CurrentTemplate data={resumeData} />
                        </div>,
                        document.body
                    )}

                    <style dangerouslySetInnerHTML={{
                        __html: `
                    @media print {
                        /* Hide everything in the body except our portal */
                        body > *:not(#mbi-resume-print-portal) { display: none !important; }
                        #mbi-resume-print-portal { display: block !important; position: static !important; width: 100% !important; }
                        body { background: white !important; margin: 0 !important; padding: 0 !important; }
                        @page { size: A4; margin: 0; }
                    }
                `}} />

                    {/* Neural Processing Overlay */}
                    {isProcessing && (
                        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-500 no-print">
                            <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 text-center animate-in zoom-in-95 duration-500">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                                    <div className="absolute inset-2 bg-blue-500/20 rounded-full animate-pulse" />
                                    <div className="relative bg-blue-600 w-full h-full rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40">
                                        <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Synthesizing Narrative</h3>
                                    <p className="text-slate-500 font-medium text-sm">Aligning your professional trajectory with industry benchmarks and neural standards...</p>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 animate-loading-bar" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Gallery View
    return (
        <div className="relative">
            <div className="max-w-[1400px] mx-auto pb-10">
                {/* Neural Launchpad - Luxury Light UI */}
                <div className="bg-white rounded-[3.5rem] p-12 mb-20 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-200/60">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Step 1: Document Upload */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white italic">01</span>
                                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Existing Resume</h2>
                            </div>

                            <div
                                onClick={() => autoFillInputRef.current?.click()}
                                className={cn(
                                    "h-64 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 group",
                                    uploadedFile ? "border-emerald-500/50 bg-emerald-50" : "border-slate-200 bg-slate-50/50 hover:border-blue-500/50 hover:bg-blue-50/50"
                                )}
                            >
                                <input
                                    type="file"
                                    ref={autoFillInputRef}
                                    onChange={(e) => setUploadedFile(e.target.files[0])}
                                    className="hidden"
                                    accept=".pdf,.docx"
                                />
                                <div className={cn(
                                    "w-16 h-16 rounded-3xl flex items-center justify-center mb-2 transition-all duration-500",
                                    uploadedFile ? "bg-emerald-500 text-white" : "bg-white text-slate-400 border border-slate-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                                )}>
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div className="text-center px-6">
                                    <p className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">
                                        {uploadedFile ? uploadedFile.name : 'Drop Source Document'}
                                    </p>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                        {uploadedFile ? 'Click to replace file' : 'PDF or DOCX (Max 10MB)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Job Context */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white italic">02</span>
                                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Job Description</h2>
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                    placeholder="Paste the Job Description to align your narrative with elite industry benchmarks..."
                                    className="w-full h-64 bg-slate-50/50 border border-slate-200/60 rounded-[2.5rem] p-8 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all resize-none placeholder:text-slate-400"
                                />

                                <button
                                    onClick={handleAutoFill}
                                    disabled={!uploadedFile || isProcessing}
                                    className={cn(
                                        "w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-4",
                                        uploadedFile && !isProcessing
                                            ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20 hover:bg-blue-600 active:scale-95"
                                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {isProcessing ? 'Optimizing...' : 'Optimize Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Template Selection - Secondary Step */}
                <div className="space-y-12">
                    <div className="flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-slate-200" />
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Choose Your Executive Blueprint</h2>
                        <span className="h-px w-12 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {templates.map(template => (
                            <div
                                key={template.id}
                                onClick={() => { setSelectedTemplate(template.id); setView('editor'); }}
                                className="group cursor-pointer flex flex-col space-y-6"
                            >
                                {/* Direct A4 Preview - No Card Wrapper */}
                                <div className="aspect-[1/1.414] rounded-sm overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_80px_rgba(59,130,246,0.15)] ring-1 ring-slate-200/50 bg-white">
                                    <div className="absolute top-0 w-[210mm] left-1/2 -translate-x-1/2 origin-top transform scale-[0.34] bg-white">
                                        <template.component data={dummyPreviewData} />
                                    </div>

                                    {/* Glass Selection Overlay */}
                                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5" />
                                    <div className="absolute inset-x-0 bottom-0 py-12 bg-gradient-to-t from-slate-900/40 via-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end">
                                        <div className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
                                            Select Blueprint
                                        </div>
                                    </div>
                                </div>

                                {/* Integrated Labeling */}
                                <div className="px-1 text-center">
                                    <h3 className="font-black text-slate-900 uppercase tracking-tighter italic text-md group-hover:text-blue-600 transition-colors">{template.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Neural Processing Overlay - Global */}
                {isProcessing && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-500">
                        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 text-center animate-in zoom-in-95 duration-500">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                                <div className="absolute inset-2 bg-blue-500/20 rounded-full animate-pulse" />
                                <div className="relative bg-blue-600 w-full h-full rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40">
                                    <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Synthesizing Narrative</h3>
                                <p className="text-slate-500 font-medium text-sm">Aligning your professional trajectory with industry benchmarks and neural standards...</p>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 animate-loading-bar" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Input = ({ label, value, onChange, placeholder = '' }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-12 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            placeholder={placeholder}
        />
    </div>
);

export default ResumeMaker;
