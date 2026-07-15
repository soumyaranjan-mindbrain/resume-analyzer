const SystemConfig = require("../../models/SystemConfig");
const AIPrompt = require("../../models/AIPrompt");
const JobTrack = require("../../models/JobTrack");
const Analysis = require("../../models/Analysis");
const Application = require("../../models/Application");
const HelpTicket = require("../../models/HelpTicket");
const Resume = require("../../models/Resume");
const User = require("../../models/User");

// --- System Config (Maintenance Mode, etc.) ---

exports.getSystemConfig = async (req, res) => {
    try {
        let config = await SystemConfig.findOne();
        if (!config) {
            config = await SystemConfig.create({ maintenanceMode: false });
        }
        res.json({ success: true, config });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSystemConfig = async (req, res) => {
    try {
        const { maintenanceMode } = req.body;
        const existing = await SystemConfig.findOne();

        let config;
        if (existing) {
            config = await SystemConfig.findByIdAndUpdate(existing._id, { maintenanceMode }, { new: true });
        } else {
            config = await SystemConfig.create({ maintenanceMode });
        }
        res.json({ success: true, config });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- Prompts Management ---


exports.getPrompts = async (req, res) => {
    try {
        const prompts = await AIPrompt.find().lean();
        const formattedPrompts = prompts.map(p => ({ ...p, id: p._id.toString() }));
        res.json({ success: true, prompts: formattedPrompts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePrompt = async (req, res) => {
    try {
        const { key } = req.params;
        const { content, isActive } = req.body;

        const prompt = await AIPrompt.findOneAndUpdate(
            { key },
            { content, isActive: isActive ?? true },
            { new: true, upsert: true }
        );

        const promptObj = prompt.toObject();
        promptObj.id = promptObj._id.toString();

        res.json({ success: true, prompt: promptObj });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Job Tracks Management ---

exports.getTracks = async (req, res) => {
    try {
        const tracks = await JobTrack.find({ isActive: true }).lean();
        const formattedTracks = tracks.map(t => ({ ...t, id: t._id.toString() }));
        res.json({ success: true, tracks: formattedTracks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTrack = async (req, res) => {
    try {
        const { name, skills } = req.body;
        const track = await JobTrack.create({ name, skills, isActive: true });
        const trackObj = track.toObject();
        trackObj.id = trackObj._id.toString();
        res.json({ success: true, track: trackObj });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Track
exports.updateTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, skills, isActive } = req.body;

        const track = await JobTrack.findByIdAndUpdate(id, { name, skills, isActive }, { new: true });
        if (!track) return res.status(404).json({ error: "Track not found" });

        const trackObj = track.toObject();
        trackObj.id = trackObj._id.toString();

        res.json({ success: true, track: trackObj });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const track = await JobTrack.findByIdAndUpdate(id, { isActive: false });
        if (!track) return res.status(404).json({ error: "Track not found" });
        res.json({ success: true, message: "Track deactivated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Platform Purge (Clear DB) ---

exports.purgePlatformData = async (req, res) => {
    try {
        // 1. Delete all dependencies first
        await Analysis.deleteMany({});
        await Application.deleteMany({});
        await HelpTicket.deleteMany({});
        await Resume.deleteMany({});

        // 2. Delete all students, but keep admins
        await User.deleteMany({ role: "student" });

        res.json({
            success: true,
            message: "Platform has been purged. All students, resumes, and reports deleted."
        });
    } catch (error) {
        console.error("[Purge Error]", error);
        res.status(500).json({ error: error.message });
    }
};
