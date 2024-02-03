const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 4000;
const cors = require("cors");
const path = require('path');
const { v4: uuidv4 } = require("uuid");

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

// Handle other routes or API endpoints here
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

function writeTeachers() {
  fs.writeFileSync("teachers.json", JSON.stringify(teachers, null, 2), "utf-8");
}
// File path for storing teacher records
let teachers = [];
async function loadTeachersFromFile() {
  try {
    const data = fs.readFileSync("teachers.json", "utf-8");
    teachers = JSON.parse(data);
  } catch (error) {
    console.error("Error reading teacher file:", error.message);
    teachers = [];
  }
}

loadTeachersFromFile();

// Landing/Home Page

// Show all teachers
app.get("/getData", (req, res) => {
  res.json(teachers);
});

// Add a teacher
app.post("/addteachers", (req, res) => {
  const newTeacher = req.body;
  teachers.push({ ...newTeacher, id: uuidv4() });
  writeTeachers(teachers);
  res.json(newTeacher);
});

app.put("/editteacher/:id", (req, res) => {
  const { id } = req.params;
  const updatedTeacherData = req.body;

  // Find the teacher by ID
  const index = teachers.findIndex((teacher) => teacher.id === id);
  if (index !== -1) {
    // Update the teacher data
    teachers[index] = { ...teachers[index], ...updatedTeacherData };
    writeTeachers(teachers);
    res.json(teachers[index]);
  } else {
    res.status(404).json({ error: "Teacher not found" });
  }
});

app.delete("/deleteteacher/:id", (req, res) => {
  const { id } = req.params;

  // Find the index of the teacher with the given ID
  const index = teachers.findIndex((teacher) => teacher.id === id);
  if (index !== -1) {
    // Remove the teacher from the array
    const deletedTeacher = teachers.splice(index, 1)[0];
    writeTeachers(teachers);
    res.json(deletedTeacher);
  } else {
    res.status(404).json({ error: "Teacher not found" });
  }
});

app.get("/teachers/filterByAge", (req, res) => {
  const { age } = req.query;

  if (!age) {
    return res.status(400).json({ error: "Age parameter is missing" });
  }

  // Convert age range to min and max age
  let minAge, maxAge;
  switch (age) {
    case "20-30":
      minAge = 20;
      maxAge = 30;
      break;
    case "30-40":
      minAge = 30;
      maxAge = 40;
      break;
    case "40-":
      minAge = 40;
      break;
    default:
      return res.status(400).json({ error: "Invalid age range" });
  }

  const filteredTeachers = teachers.filter((teacher) => {
    if (minAge && maxAge) {
      return +teacher.age >= minAge && +teacher.age <= maxAge;
    } else if (minAge) {
      return +teacher.age >= minAge;
    } else {
      return true;
    }
  });

  res.json(filteredTeachers);
});

app.get("/teachers/filterByClasses", (req, res) => {
  const { classes } = req.query;

  if (!classes) {
    return res.status(400).json({ error: "Classes parameter is missing" });
  }

  // Convert classes range to min and max classes
  let minClasses, maxClasses;
  switch (classes) {
    case "1-3":
      minClasses = 1;
      maxClasses = 3;
      break;
    case "4-6":
      minClasses = 4;
      maxClasses = 6;
      break;
    case "6-":
      minClasses = 7;
      break;
    default:
      return res.status(400).json({ error: "Invalid classes range" });
  }

  // Filter teachers by classes
  const filteredTeachers = teachers.filter((teacher) => {
    if (minClasses && maxClasses) {
      return (
        +teacher.numClasses >= minClasses && +teacher.numClasses <= maxClasses
      );
    } else if (minClasses) {
      return +teacher.numClasses >= minClasses;
    } else {
      return true;
    }
  });

  res.json(filteredTeachers);
});

// Filter teachers
app.get("/teachers/filter", (req, res) => {
  // Implement filtering logic based on criteria (age, number of classes)
  const { age, numClasses } = req.query;
  const teachers = readTeachers();

  let filteredTeachers = teachers;

  if (age) {
    filteredTeachers = filteredTeachers.filter(
      (teacher) => teacher.age === parseInt(age)
    );
  }

  if (numClasses) {
    filteredTeachers = filteredTeachers.filter(
      (teacher) => teacher.numClasses === parseInt(numClasses)
    );
  }

  res.json(filteredTeachers);
});

// Search for a teacher by ID
app.get("/teachers/search/", (req, res) => {
  return res.json(teachers);
});

app.get("/teachers/search/:name", (req, res) => {
  //const teachers = readTeachers();
  const name = req.params.name.toLowerCase();
  const teacher = teachers.filter((t) =>
    t.fullName.toLowerCase().includes(name)
  );

  res.json(teacher);
});

// Update a teacher's record
app.put("/teachers/update/:id", (req, res) => {
  const teacherId = req.params.id;
  const index = teachers.findIndex((t) => t.id === parseInt(teacherId));

  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...req.body };
    writeTeachers(teachers);
    res.json(teachers[index]);
  } else {
    res.status(404).send("Teacher not found.");
  }
});

// Delete a teacher
app.delete("/teachers/delete/:id", (req, res) => {
  const teacherId = req.params.id;
  const index = teachers.findIndex((t) => t.id === parseInt(teacherId));

  if (index !== -1) {
    const deletedTeacher = teachers.splice(index, 1);
    writeTeachers(teachers);
    res.json(deletedTeacher);
  } else {
    res.status(404).send("Teacher not found.");
  }
});

// Bonus: Calculate and display the average number of classes
app.get("/teachers/average-classes", (req, res) => {
  //const teachers = readTeachers();

  if (teachers.length === 0) {
    res.send("No teachers available.");
  } else {
    const totalClasses = teachers.reduce(
      (acc, teacher) => acc + +teacher.numClasses,
      0
    );
    const averageClasses = (totalClasses / teachers.length).toFixed(2);
    res.json({ averageClasses });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
