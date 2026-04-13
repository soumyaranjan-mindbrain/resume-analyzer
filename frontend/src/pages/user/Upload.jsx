import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../../services/api';
import { cn } from '../../utils/cn';
import gsap from 'gsap';


const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, success, error
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const isDocx = selectedFile.name.toLowerCase().endsWith('.docx');
      
      if (!allowedTypes.includes(selectedFile.type) && !isDocx) {
        setError('Please upload a PDF or DOCX file.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      setFile(selectedFile);
      setError('');
      setStatus('idle');
    }
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const simulateProgress = (target, duration, callback) => {
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current >= target) {
        clearInterval(interval);
        callback();
      }
      setProgress(current);
    }, duration / (target / 5));
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus('uploading');
    setError('');

    try {
      // Step 1: Upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      simulateProgress(40, 800, async () => {
        try {
          const uploadResponse = await uploadResume(uploadFormData);
          if (!uploadResponse?.resume?.id && !uploadResponse?.resume?._id) {
            throw new Error('Upload failed: No resume ID returned');
          }

          setStatus('analyzing');
          setProgress(90);
          setTimeout(() => {
            setProgress(100);
            setStatus('success');
            setTimeout(() => {
              navigate('/dashboard');
            }, 1200);
          }, 800);
        } catch (err) {
          setError(err.error || 'Upload failed. Please try again.');
          setStatus('error');
          setUploading(false);
        }
      });

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setStatus('idle');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4" ref={containerRef}>
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
          Elevate Your <span className="text-[#4b7bff]">Career</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
          Upload your resume and let our advanced AI engine analyze it for ATS compatibility and job matching.
        </p>
      </div>

      <div className="relative">
        {/* Background Accents */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,0.5)] relative z-10">
          
          {!file && (
            <div 
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-4 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 group",
                isDragging 
                  ? "border-[#4b7bff] bg-blue-50/50 scale-[1.02] shadow-2xl shadow-blue-500/10" 
                  : "border-slate-200 hover:border-[#4b7bff]/30 hover:bg-blue-50/30"
              )}
            >

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx"
              />
              <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-xl shadow-blue-500/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <UploadIcon className="w-10 h-10 text-[#4b7bff]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-800">Drop your PDF or DOCX here</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Maximum file size 5MB</p>
              </div>
            </div>
          )}

          {file && (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-white/60 rounded-3xl border border-white/80 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 line-clamp-1">{file.name}</h4>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'} Document
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <button 
                    onClick={removeFile}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {uploading ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b7bff]">
                          {status === 'uploading' ? 'Transmitting Data' : 'AI Analysis in Progress'}
                        </span>
                        <h5 className="text-xl font-black text-slate-800">
                          {status === 'uploading' ? 'Uploading to Secure Cloud...' : 'Parsing Resume Metadata...'}
                        </h5>
                      </div>
                      <span className="text-3xl font-black text-[#4b7bff]">{progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4b7bff] to-[#6366f1] rounded-full transition-all duration-500 relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: ShieldCheck, label: 'Secure', active: progress > 10 },
                      { icon: Cpu, label: 'AI Match', active: progress > 50 },
                      { icon: Zap, label: 'Fast Sync', active: progress > 80 }
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-2 ${item.active ? 'bg-white border-blue-100 shadow-sm text-blue-600' : 'bg-slate-50/50 border-transparent text-slate-300'}`}>
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleUpload}
                  className="w-full bg-[#4b7bff] text-white py-6 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-[#3b63d6] transition-all shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95"
                >
                  Start AI Analysis
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center gap-3 text-emerald-500 animate-bounce mt-4">
                  <CheckCircle2 className="w-12 h-12" />
                  <span className="font-black uppercase tracking-widest text-xs">Analysis Complete! Redirecting...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-5 bg-red-50 rounded-2xl border border-red-100 text-red-600 mt-4">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Upload;
