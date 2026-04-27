import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Java Developer",
    "React Native Developer"
];

const Onboarding = () => {
    const { user, completeOnboarding } = useAuth();
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null); // 'FRESHER' or 'EXPERIENCED'
    const [targetRole, setTargetRole] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleComplete = async () => {
        if (!userType) return;
        if (!targetRole) return;
        if (userType === 'EXPERIENCED' && !yearsOfExperience) return;

        setLoading(true);
        try {
            await completeOnboarding({
                userType,
                targetRole,
                yearsOfExperience: userType === 'EXPERIENCED' ? yearsOfExperience : '0'
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Onboarding failed:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Let's personalize your experience</h1>
                    <p className="text-slate-600 font-medium">To provide the most accurate ATS analysis, we need to know a bit about your career stage.</p>
                </div>

                <div className="clay-card !p-8 space-y-8 bg-white shadow-xl">
                    {/* Step 1: User Type Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <UserCircle className="w-6 h-6 text-indigo-500" />
                                Which best describes you?
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setUserType('FRESHER')}
                                    className={cn(
                                        "flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all group",
                                        userType === 'FRESHER'
                                            ? "border-indigo-500 bg-indigo-50/50 shadow-md"
                                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                        userType === 'FRESHER' ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                    )}>
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-slate-900">Fresher / Student</h3>
                                        <p className="text-xs text-slate-500 mt-1">Starting your career journey</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setUserType('EXPERIENCED')}
                                    className={cn(
                                        "flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all group",
                                        userType === 'EXPERIENCED'
                                            ? "border-indigo-500 bg-indigo-50/50 shadow-md"
                                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                        userType === 'EXPERIENCED' ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                    )}>
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-slate-900">Experienced</h3>
                                        <p className="text-xs text-slate-500 mt-1">Working professional</p>
                                    </div>
                                </button>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!userType || loading}
                                    className="btn-mindvista w-full !py-4 flex items-center justify-center gap-2 group"
                                >
                                    Next: Choose Track
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Track Selection */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <button
                                onClick={() => setStep(1)}
                                className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors"
                            >
                                ← Back to selection
                            </button>

                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                Select your target developer track
                            </h2>

                            <p className="text-sm text-slate-500">
                                We'll use this to benchmark your resume against the specific skills expected for this role.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setTargetRole(role)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 text-left transition-all",
                                            targetRole === role
                                                ? "border-indigo-500 bg-indigo-50/50"
                                                : "border-slate-100 hover:bg-slate-50"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-sm font-bold",
                                            targetRole === role ? "text-indigo-700" : "text-slate-700"
                                        )}>
                                            {role}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => userType === 'EXPERIENCED' ? setStep(3) : handleComplete()}
                                    disabled={!targetRole || loading}
                                    className="btn-mindvista w-full !py-4 flex items-center justify-center gap-2"
                                >
                                    {userType === 'EXPERIENCED' ? 'Next: Experience Level' : (loading ? 'Finalizing...' : 'Finalize Onboarding')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Years of Experience (Experienced Only) */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <button
                                onClick={() => setStep(2)}
                                className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors"
                            >
                                ← Back to track selection
                            </button>

                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-indigo-500" />
                                Total Years of Experience
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {["1-2 Years", "3-5 Years", "5-8 Years", "8+ Years"].map((exp) => (
                                    <button
                                        key={exp}
                                        onClick={() => setYearsOfExperience(exp)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 text-left transition-all",
                                            yearsOfExperience === exp
                                                ? "border-indigo-500 bg-indigo-50/50"
                                                : "border-slate-100 hover:bg-slate-50"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-sm font-bold",
                                            yearsOfExperience === exp ? "text-indigo-700" : "text-slate-700"
                                        )}>
                                            {exp}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleComplete}
                                    disabled={!yearsOfExperience || loading}
                                    className="btn-mindvista w-full !py-4 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Complete Onboarding'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Onboarding;
