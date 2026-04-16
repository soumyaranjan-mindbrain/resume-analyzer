const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//   Create Job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, type, experience, requirements, responsibilities, tags, salary } = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        description,
        type: type || "Full-time",
        experience,
        requirements,
        responsibilities,
        skillsRequired: tags || [], // frontend sends 'tags'
        salary,
        userId: req.userId || req.user?.id || req.user?._id
      }
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Get All Jobs  
exports.getJobs = async (req, res) => {
  try {
    const { search, skill } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          search
            ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } }
              ]
            }
            : {},
          skill
            ? {
              skillsRequired: { has: skill }
            }
            : {}
        ]
      },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Get Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Update Job
exports.updateJob = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const data = { ...rest };
    if (tags) data.skillsRequired = tags;

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: data
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Delete Job
exports.deleteJob = async (req, res) => {
  try {
    await prisma.job.delete({
      where: { id: req.params.id }
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get My Jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
