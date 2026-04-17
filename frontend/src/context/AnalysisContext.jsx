import React, { createContext, useContext, useState, useCallback } from 'react';
import { uploadResume, analyzeResume } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // uploading, parsing, generating
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const startAnalysis = useCallback(async (fileToUpload) => {
        if (!fileToUpload) return;

        setIsAnalyzing(true);
        setFile(fileToUpload);
        setStatus('uploading');
        setProgress(0);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', fileToUpload);

            // 1. Upload Phase
            const uploadResp = await uploadResume(formData, (progressEvent) => {
                const realPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(Math.min(realPercent * 0.4, 40));
            });

            const resumeId = uploadResp?.resume?.id || uploadResp?.resume?._id;
            if (!resumeId) throw new Error('Upload failed');

            // 2. Parsing Phase
            setStatus('parsing');
            let p = 40;
            const parsingInterval = setInterval(() => {
                p += Math.random() * 5;
                if (p >= 80) clearInterval(parsingInterval);
                setProgress(Math.min(p, 80));
            }, 300);

            // 3. Generation Phase
            await analyzeResume(resumeId);
            clearInterval(parsingInterval);
            setStatus('generating');
            setProgress(100);

            await new Promise(r => setTimeout(r, 1000));

            setIsAnalyzing(false);
            setFile(null);
            setStatus('idle');

            toast.success('Analysis complete!');
            navigate('/history', { state: { openReportId: resumeId }, replace: true });

        } catch (err) {
            console.error('Global Analysis Error:', err);
            setError(err.message || 'Operation failed');
            setIsAnalyzing(false);
            toast.error(err.message || 'Analysis failed');
        }
    }, [navigate]);

    return (
        <AnalysisContext.Provider value={{
            isAnalyzing,
            progress,
            status,
            file,
            error,
            startAnalysis,
            cancelAnalysis: () => {
                setIsAnalyzing(false);
                setFile(null);
                setStatus('idle');
            }
        }}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (!context) throw new Error('useAnalysis must be used within an AnalysisProvider');
    return context;
};
