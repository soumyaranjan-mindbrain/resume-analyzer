const User = require("../../models/User");
const Resume = require("../../models/Resume");
const Analysis = require("../../models/Analysis");
const Job = require("../../models/Job");
const HelpTicket = require("../../models/HelpTicket");
const Application = require("../../models/Application");
const { emitEvent } = require("../../utils/socket");

// Add Student (Creates a User with role 'student')
exports.createStudent = async (req, res) => {
  try {
    const { name, email, phone, course, password } = req.body;

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already in use" });

    if (phone) {
      console.log(`[Student] Checking phone uniqueness for: "${phone}"`);
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        console.log(`[Student] Phone collision detected for: ${phone}`);
        return res.status(400).json({ message: "Mobile number already in use" });
      }
    }

    const student = await User.create({
      name,
      email,
      phone,
      course,
      password: password || "student123", // Default password if not provided
      role: "student",
      status: "Active"
    });

    const studentObj = student.toObject();
    studentObj.id = studentObj._id.toString();

    emitEvent("student_registered", { id: studentObj.id, name: studentObj.name });

    res.status(201).json(studentObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Students with their average ATS scores
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).lean();

    // Calculate average score for each student
    const formattedStudents = await Promise.all(students.map(async (student) => {
      const resumes = await Resume.find({ userId: student._id }).lean();
      const analyses = [];
      for (const r of resumes) {
        const analysis = await Analysis.findOne({ resumeId: r._id }, 'atsScore').lean();
        if (analysis) {
          analyses.push(analysis);
        }
      }

      const avgScore = analyses.length > 0
        ? Math.round(analyses.reduce((sum, a) => sum + a.atsScore, 0) / analyses.length)
        : 0;

      return {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        status: student.status,
        github: student.github || null,
        linkedin: student.linkedin || null,
        score: avgScore,
        lastActive: student.lastActive || null,
        updatedAt: student.updatedAt || null,
      };
    }));

    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" }).lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const resumes = await Resume.find({ userId: student._id }).lean();
    for (const r of resumes) {
      r.id = r._id.toString();
      r.analysis = await Analysis.findOne({ resumeId: r._id }).lean();
      if (r.analysis) {
        r.analysis.id = r.analysis._id.toString();
      }
    }

    student.id = student._id.toString();
    student.resumes = resumes;

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentObj = student.toObject();
    studentObj.id = studentObj._id.toString();

    res.json(studentObj);
    emitEvent("student_updated", { id: studentObj.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if student exists
    const student = await User.findById(id).lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Step-by-step cleanup of related records
    const resumes = await Resume.find({ userId: id }, '_id').lean();
    const resumeIds = resumes.map(r => r._id);
    if (resumeIds.length > 0) {
      await Analysis.deleteMany({
        resumeId: { $in: resumeIds }
      });
    }

    await Resume.deleteMany({ userId: id });
    await Job.deleteMany({ userId: id });
    await HelpTicket.deleteMany({ userId: id });
    await Application.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    emitEvent("student_deleted", { id });

    res.json({ message: "Student and all related data deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
};
