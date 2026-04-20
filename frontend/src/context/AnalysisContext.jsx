import React, { createContext, useContext, useState, useCallback } from 'react';
import { uploadResume, analyzeResume, getDashboardStats, getMyResumes, getAllJobs, getFeedback, getAnalytics } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket } = useSocket();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // uploading, parsing, generating
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [skillInsights, setSkillInsights] = useState(null);
    const [loading, setLoading] = useState({
        dashboard: false,
        resumes: false,
        jobs: false,
        recommendations: false,
        insights: false
    });

    const fetchDashboardData = useCallback(async (force = false) => {
        if (dashboardStats && !force) return;
        const showLoading = !dashboardStats || force;
        try {
            if (showLoading) setLoading(prev => ({ ...prev, dashboard: true }));
            const statsData = await getDashboardStats();
            setDashboardStats(prev => ({ ...(prev || {}), stats: statsData || null }));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            if (showLoading) setLoading(prev => ({ ...prev, dashboard: false }));
        }
    }, []); // Removed dashboardStats dependency

    const fetchHistory = useCallback(async (force = false) => {
        if (resumes.length > 0 && !force) return;
        const showLoading = resumes.length === 0 || force;
        try {
            if (showLoading) setLoading(prev => ({ ...prev, resumes: true }));
            const data = await getMyResumes();
            const list = data.resumes || [];
            setResumes(list);
            setDashboardStats(prev => ({ ...(prev || {}), resumes: list }));
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            if (showLoading) setLoading(prev => ({ ...prev, resumes: false }));
        }
    }, []); // Removed resumes dependency

    const fetchJobs = useCallback(async (force = false) => {
        if (jobs.length > 0 && !force) return;
        const showLoading = jobs.length === 0 || force;
        try {
            if (showLoading) setLoading(prev => ({ ...prev, jobs: true }));
            const jobData = await getAllJobs();
            const list = Array.isArray(jobData) ? jobData : (jobData?.jobs || []);
            const normalized = list.map((job) => ({
                ...job,
                skills: Array.isArray(job.skillsRequired) ? job.skillsRequired : (Array.isArray(job.skills) ? job.skills : []),
            }));
            setJobs(normalized);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            if (showLoading) setLoading(prev => ({ ...prev, jobs: false }));
        }
    }, []); // Removed jobs dependency

    const fetchRecommendations = useCallback(async (force = false) => {
        if (recommendations.length > 0 && !force) return;
        const showLoading = recommendations.length === 0 || force;
        try {
            if (showLoading) setLoading(prev => ({ ...prev, recommendations: true }));
            // Get latest resume first
            const hist = await getMyResumes();
            const list = hist.resumes || [];
            if (list.length > 0) {
                const feedbackData = await getFeedback(list[0]._id || list[0].id);
                if (feedbackData) {
                    const tips = [
                        ...(feedbackData.aiFeedback || []).map((text, idx) => ({
                            id: idx,
                            title: text,
                            description: text,
                            type: 'skill'
                        })),
                        ...(feedbackData.recommendations || [])
                    ];
                    setRecommendations(tips);
                }
            }
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            if (showLoading) setLoading(prev => ({ ...prev, recommendations: false }));
        }
    }, []); // Removed recommendations dependency

    const fetchSkillInsights = useCallback(async (force = false) => {
        if (skillInsights && !force) return;
        const showLoading = !skillInsights || force;
        try {
            if (showLoading) setLoading(prev => ({ ...prev, insights: true }));
            const data = await getAnalytics();
            setSkillInsights(data);
        } catch (error) {
            console.error('Failed to fetch insights:', error);
        } finally {
            if (showLoading) setLoading(prev => ({ ...prev, insights: false }));
        }
    }, []); // Removed skillInsights dependency

    React.useEffect(() => {
        // Background synchronization disabled to prevent excessive API calls as per user request
        return () => { };
    }, []);

    // Eager Pre-fetcher for students
    React.useEffect(() => {
        if (user && user.role === 'student') {
            console.log('[AnalysisContext] Eagerly pre-fetching student data...');
            fetchDashboardData();
            fetchHistory();
            fetchJobs();
            fetchRecommendations();
            fetchSkillInsights();
        }
    }, [user?.id, user?.role, fetchDashboardData, fetchHistory, fetchJobs, fetchRecommendations, fetchSkillInsights]);

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

            // Mask technical errors with professional guidance
            const isValidationError = err.message?.includes('Validation Error:');
            const friendlyMsg = isValidationError
                ? err.message.replace('Validation Error:', '').trim()
                : 'Please upload a professional resume to analyze properly.';

            setError(friendlyMsg);
            setIsAnalyzing(false);
            toast.error(friendlyMsg);
        }
    }, [navigate]);

    return (
        <AnalysisContext.Provider value={{
            isAnalyzing,
            progress,
            status,
            file,
            error,
            dashboardStats,
            resumes,
            jobs,
            recommendations,
            skillInsights,
            loading,
            startAnalysis,
            fetchDashboardData,
            fetchHistory,
            fetchJobs,
            fetchRecommendations,
            fetchSkillInsights,
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
