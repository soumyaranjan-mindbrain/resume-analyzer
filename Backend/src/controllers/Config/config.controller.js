const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

        res.status(200).json({
            message: `Maintenance mode ${config.maintenanceMode ? 'enabled' : 'disabled'}`,
            config
        });
    } catch (error) {
        console.error("Error updating config:", error);
        res.status(500).json({ error: "Failed to update system configuration" });
    }
};
