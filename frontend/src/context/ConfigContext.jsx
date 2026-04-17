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
        // Initial fetch
        fetchConfig();

        // Fallback to polling every 30 seconds
        const pollInterval = setInterval(fetchConfig, 30000);

        return () => {
            clearInterval(pollInterval);
        };
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
