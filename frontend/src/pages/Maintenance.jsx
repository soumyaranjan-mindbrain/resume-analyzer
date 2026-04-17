import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const Maintenance = () => {
    const { maintenanceMode, loading } = useConfig();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !maintenanceMode) {
            const target = user?.role === 'admin' ? '/admin' : '/dashboard';
            navigate(target, { replace: true });
        }
    }, [maintenanceMode, loading, user, navigate]);

    if (loading) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans antialiased text-slate-900 leading-normal selection:bg-blue-100">
            {/* Minimal Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="max-w-[520px] w-full relative z-10 space-y-12">

                <div className="space-y-6 flex flex-col items-center">
                    <Logo size="lg" className="opacity-90" />
                    <h1 className="text-2xl font-light tracking-widest text-slate-400 uppercase">
                        Under Maintenance
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
