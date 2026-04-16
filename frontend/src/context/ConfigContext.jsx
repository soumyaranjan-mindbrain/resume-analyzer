import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getConfig } from '../services/api';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const isFetching = useRef(false);

    const fetchConfig = async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            const data = await getConfig();
            setMaintenanceMode(data.config?.maintenanceMode || false);
        } catch (error) {
            console.error('Failed to fetch system config:', error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    useEffect(() => {
        fetchConfig();
        // High-frequency polling for near-realtime experience
        const interval = setInterval(fetchConfig, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ConfigContext.Provider value={{ maintenanceMode, loading, refreshConfig: fetchConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('useConfig must be used within a ConfigProvider');
    return context;
};
