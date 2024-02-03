import React from "react";
import "./home.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";



function Home() {
  const [teachers, setTeachers] = useState([]);
  const [filterAgeRange, setFilterAgeRange] = useState("");
  const [filterClassesRange, setFilterClassesRange] = useState("");

  const fetchTeachersByClassesRange = async (classesRange) => {
    try {
      const response = await axios.get(
        `/teachers/filterByClasses?classes=${classesRange}`
      );
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleFilterByClassesRange = (classesRange) => {
    setFilterClassesRange(classesRange);
    fetchTeachersByClassesRange(classesRange);
  };

  const fetchTeachersByAgeRange = async (ageRange) => {
    try {
      const response = await axios.get(
        `/teachers/filterByAge?age=${ageRange}`
      );
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleFilterByAgeRange = (ageRange) => {
    setFilterAgeRange(ageRange);
    fetchTeachersByAgeRange(ageRange);
  };

  useEffect(() => {
    // Make a GET request to the backend's / route
    axios
      .get("/getData") 
      .then((response) => {
        console.log(response.data);
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = async (teacherToEdit) => {
    try {
      const response = await fetch(
        `/editteacher/${teacherToEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teacherToEdit),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit teacher");
      }
      // Update the teacher list after successful edit
      const updatedTeachers = teachers.map((teacher) => {
        if (teacher.id === teacherToEdit.id) {
          return teacherToEdit;
        }
        return teacher;
      });
      setTeachers(updatedTeachers);
      alert("Teacher edited successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to edit teacher");
    }
  };

  // Function to handle deleting a teacher
  const handleDelete = async (teacherToDelete) => {
    try {
      const response = await fetch(
        `/deleteteacher/${teacherToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }
      // Update the teacher list after successful deletion
      const updatedTeachers = teachers.filter(
        (teacher) => teacher.id !== teacherToDelete.id
      );
      setTeachers(updatedTeachers);
      alert("Teacher deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete teacher");
    }
  };

  const fetchTeachersBySearchQuery = async (query) => {
    try {
      const response = await axios.get(
        `/teachers/search/${query}`
      );
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleSearch = async (e, searchQuery) => {
    if (e.key === "Enter") {
      await fetchTeachersBySearchQuery(searchQuery);
    }
  };

  return (
    <div className="HomeContainer">
      <Navbar
        handleFilterByAgeRange={handleFilterByAgeRange}
        handleFilterByClassesRange={handleFilterByClassesRange}
        handleSearch={handleSearch}
        fetchTeachersBySearchQuery={fetchTeachersBySearchQuery}
      />

      <div className="lowerDiv">
        {teachers.map((teacher, index) => (
          <SingleCard
            key={index}
            teacher={teacher}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className="lowerDiv">
        {teachers.length === 0 && <div>No Teachers Found </div>}
      </div>
    </div>
  );
}

export default Home;

const SingleCard = ({ teacher, onEdit, onDelete }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState({ ...teacher });

  const onOpenEditModal = () => setOpenEditModal(true);
  const onCloseEditModal = () => setOpenEditModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher({ ...editedTeacher, [name]: value });
  };

  const handleEdit = () => {
    onEdit(editedTeacher);
    onCloseEditModal();
  };

  const handleDelete = () => {
    onDelete(teacher);
  };

  return (
    <div className="card">
      <div className="text">
        <span>{teacher.fullName}</span>
        <p className="subtitle">Date of Birth: {teacher.dateOfBirth}</p>
        <p className="subtitle">Age: {teacher.age}</p>
        <p className="subtitle">Number of Classes: {teacher.numClasses}</p>
      </div>
      <div className="icons">
        <div className="edit btn" onClick={onOpenEditModal}>
          Edit
        </div>
        <div className="delete btn btn-red" onClick={handleDelete}>
          Delete
        </div>
      </div>

      <Modal open={openEditModal} onClose={onCloseEditModal} center>
        <div className="edit-teacher-form">
          <h2 className="form-title">Edit Teacher</h2>
          <form className="form" onSubmit={handleEdit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={editedTeacher.fullName}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={editedTeacher.dateOfBirth}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={editedTeacher.age}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="numClasses">Number of Classes:</label>
              <input
                type="number"
                id="numClasses"
                name="numClasses"
                value={editedTeacher.numClasses}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="buttons">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                onClick={onCloseEditModal}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
