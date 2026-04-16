import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAdminStudents, getDashboardStats, getAnalytics, getAdminReports } from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState(null);
    const [reports, setReports] = useState([]);
    const [analytics, setAnalytics] = useState({}); // Stores analytics by range key
    const [loading, setLoading] = useState({
        students: false,
        dashboard: false,
        analytics: false,
        reports: false
    });

    const fetchStudents = useCallback(async (force = false) => {
        if (students.length > 0 && !force) return;
        try {
            setLoading(prev => ({ ...prev, students: true }));
            const data = await getAdminStudents();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching admin students:', error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, students: false }));
        }
    }, [students.length]);

    const fetchReports = useCallback(async (force = false) => {
        if (reports.length > 0 && !force) return;
        try {
            setLoading(prev => ({ ...prev, reports: true }));
            const data = await getAdminReports();
            setReports(data);
        } catch (error) {
            console.error('Error fetching admin reports:', error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, reports: false }));
        }
    }, [reports.length]);

    const fetchDashboardStats = useCallback(async (force = false) => {
        if (stats && !force) return;
        try {
            setLoading(prev => ({ ...prev, dashboard: true }));
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching admin dashboard stats:', error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, dashboard: false }));
        }
    }, [stats]);

    const fetchAnalytics = useCallback(async (range = 'month', force = false) => {
        if (analytics[range] && !force) return analytics[range];
        try {
            setLoading(prev => ({ ...prev, analytics: true }));
            const data = await getAnalytics(range);
            setAnalytics(prev => ({ ...prev, [range]: data }));
            return data;
        } catch (error) {
            console.error('Error fetching admin analytics:', error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, analytics: false }));
        }
    }, [analytics]);

    const value = {
        students,
        setStudents,
        stats,
        reports,
        analytics,
        loading,
        fetchStudents,
        fetchReports,
        fetchDashboardStats,
        fetchAnalytics
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
