const prisma = require("../../prisma/client");

// Add Student
exports.createStudent = async (req, res) => {
  try {
    const student = await prisma.student.create({
      data: req.body,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(student);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(500).json({ error: error.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    await prisma.student.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Student deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(500).json({ error: error.message });
  }
};