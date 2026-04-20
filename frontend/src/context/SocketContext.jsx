import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const socketUrl = apiUrl.replace(/\/api$/, '');

        console.log('[Socket] Connecting to:', socketUrl);

        const newSocket = io(socketUrl, {
            withCredentials: true,
            transports: ['polling', 'websocket'], // Try polling first for better compatibility
            reconnectionAttempts: 5,
            timeout: 10000
        });

        newSocket.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
        });

        newSocket.on('connect', () => {
            console.log('[Socket] Connected to server');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('[Socket] Disconnected from server');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
