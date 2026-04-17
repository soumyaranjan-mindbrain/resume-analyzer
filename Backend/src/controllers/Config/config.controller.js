const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const EventEmitter = require("events");

const configEvents = new EventEmitter();

// Get System Config
exports.getConfig = async (req, res) => {
    try {
        let config = await prisma.systemConfig.findFirst();

        // Create default if not exists
        if (!config) {
            config = await prisma.systemConfig.create({
                data: { maintenanceMode: false }
            });
        }

        res.status(200).json({ config });
    } catch (error) {
        console.error("Error fetching config:", error);
        res.status(500).json({ error: "Failed to fetch system configuration" });
    }
};

// SSE stream for real-time config updates
exports.streamConfig = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendConfig = async () => {
        try {
            const config = await prisma.systemConfig.findFirst();
            res.write(`data: ${JSON.stringify({ config })}\n\n`);
        } catch (error) {
            console.error("Error in config stream:", error);
        }
    };

    // Send initial config
    await sendConfig();

    // Listen for updates
    const onUpdate = () => {
        sendConfig();
    };

    configEvents.on('update', onUpdate);

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 30000);

    req.on('close', () => {
        clearInterval(heartbeat);
        configEvents.removeListener('update', onUpdate);
        res.end();
    });
};

// Update System Config (Admin Only)
exports.updateConfig = async (req, res) => {
    try {
        const { maintenanceMode } = req.body;

        let config = await prisma.systemConfig.findFirst();

        if (!config) {
            config = await prisma.systemConfig.create({
                data: { maintenanceMode: !!maintenanceMode }
            });
        } else {
            config = await prisma.systemConfig.update({
                where: { id: config.id },
                data: { maintenanceMode: !!maintenanceMode }
            });
        }

        // Notify all streaming clients
        configEvents.emit('update');

        res.status(200).json({
            message: `Maintenance mode ${config.maintenanceMode ? 'enabled' : 'disabled'}`,
            config
        });
    } catch (error) {
        console.error("Error updating config:", error);
        res.status(500).json({ error: "Failed to update system configuration" });
    }
};
