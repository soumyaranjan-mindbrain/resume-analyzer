const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
    // Parse client URLs from environment variable
    let clientUrls = [];
    if (process.env.CLIENT_URL) {
        clientUrls = process.env.CLIENT_URL.split(",")
            .map(url => url.trim())
            .filter(Boolean);
    }

    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        ...clientUrls
    ].map(url => url.replace(/\/$/, "").toLowerCase()); // Normalize: remove trailing slash and lowercase

    console.log(`[Socket] Initializing with allowed origins:`, allowedOrigins);

    const corsOriginFunc = (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        const normalizedOrigin = origin.replace(/\/$/, "").toLowerCase();
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }
        const isVercelOriginAllowed = allowedOrigins.some(url => url.includes("vercel.app"));
        if (isVercelOriginAllowed && normalizedOrigin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        callback(null, false);
    };

    io = new Server(server, {
        cors: {
            origin: corsOriginFunc,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
        console.log(`[Socket] Emitted event: ${event}`);
    }
};

module.exports = { initSocket, getIO, emitEvent };
