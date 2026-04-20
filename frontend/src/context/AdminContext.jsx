import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAdminStudents, getDashboardStats, getAnalytics, getAdminReports } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { socket } = useSocket();
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
    }, []); // Removed students.length dependency to stop function re-generation loop

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
    }, []); // Removed reports.length dependency

    const fetchDashboardStats = useCallback(async (force = false) => {
        // If we have data and it's not a force refresh, don't show loading
        const showLoading = !stats || force;
        try {
            if (showLoading) setLoading(prev => ({ ...prev, dashboard: true }));
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching admin dashboard stats:', error);
            throw error;
        } finally {
            if (showLoading) setLoading(prev => ({ ...prev, dashboard: false }));
        }
    }, []); // Removed stats dependency

    const fetchAnalytics = useCallback(async (range = 'month', force = false) => {
        // If we already have this range and it's not forced, just return it
        if (analytics[range] && !force) return analytics[range];

        // Only show loading if we don't have data for this range
        const showLoading = !analytics[range] || force;

        try {
            if (showLoading) setLoading(prev => ({ ...prev, analytics: true }));
            const data = await getAnalytics(range);
            setAnalytics(prev => ({ ...prev, [range]: data }));
            return data;
        } catch (error) {
            console.error('Error fetching admin analytics:', error);
            throw error;
        } finally {
            if (showLoading) setLoading(prev => ({ ...prev, analytics: false }));
        }
    }, []); // Removed analytics dependency

    const { user } = useAuth();

    // Real-Time Listeners
    useEffect(() => {
        // Real-time automatic background refresh disabled as per user request to minimize API calls
        return () => { };
    }, []);

    // Eagerly pre-fetch all admin data when an admin logs in
    useEffect(() => {
        if (user && user.role === 'admin') {
            console.log('[AdminContext] Admin detected, initial pre-fetch starting...');
            fetchDashboardStats();
            fetchAnalytics('month');
            fetchAnalytics('week');
            fetchStudents();
            fetchReports();
        }
    }, [user?.id, user?.role, fetchDashboardStats, fetchAnalytics, fetchStudents, fetchReports]);

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
