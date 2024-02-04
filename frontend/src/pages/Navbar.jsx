import React, { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import AverageClasses from "./AverageClasses";

const Navbar = ({
  handleFilterByAgeRange,
  handleFilterByClassesRange,
  handleSearch,
  fetchTeachersBySearchQuery,
}) => {
  const [openTeacherModal, setAddTeacherModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAverageModal, setOpenAverageModal] = useState(false);

  const onOpenAverageModal = () => setOpenAverageModal(true);
  const onCloseAverageModal = () => setOpenAverageModal(false);

  const onOpenTeacherModal = () => setAddTeacherModalOpen(true);
  const onCloseTeacherModal = () => setAddTeacherModalOpen(false);

  return (
    <div className="navbar">
    <div className="logo">Teacher <span className="logoFont">M</span>anagement <span className="logoFont">A</span>pplication</div>
      <div className="left">
        <a onClick={() => window.location.reload()}>Home</a>
        <a onClick={onOpenTeacherModal}>Add Teacher</a>
        <div className="dropdown">
          <button className="dropbtn">
            Filter By Age
            <i className="fa fa-caret-down" />
          </button>
          <div className="dropdown-content">
            <a href="#" onClick={() => handleFilterByAgeRange("20-30")}>
              20-30
            </a>
            <a href="#" onClick={() => handleFilterByAgeRange("30-40")}>
              30-40
            </a>
            <a href="#" onClick={() => handleFilterByAgeRange("40-")}>
              40+
            </a>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">
            Filter By Classes
            <i className="fa fa-caret-down" />
          </button>
          <div className="dropdown-content">
            <a href="#" onClick={() => handleFilterByClassesRange("1-3")}>
              1-3
            </a>
            <a href="#" onClick={() => handleFilterByClassesRange("4-6")}>
              4-6
            </a>
            <a href="#" onClick={() => handleFilterByClassesRange("6-")}>
              6+
            </a>
          </div>
        </div>

        <a href="#home" onClick={onOpenAverageModal}>
          Average
        </a>
      </div>

      <div className="right">
        <input
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => handleSearch(e, searchQuery)}
          placeholder="Search"
        />

        <button onClick={() => fetchTeachersBySearchQuery(searchQuery)}>
          Search
        </button>
      </div>

      <Modal open={openTeacherModal} onClose={onCloseTeacherModal} center>
        <AddTeacherForm onCloseTeacherModal={onCloseTeacherModal} />
      </Modal>

      <Modal open={openAverageModal} onClose={onCloseAverageModal} center>
        <AverageClasses />
      </Modal>
    </div>
  );
};

export default Navbar;
const AddTeacherForm = ({ onCloseTeacherModal }) => {
  const [teacherData, setTeacherData] = useState({
    fullName: "",
    age: "",
    dateOfBirth: "",
    numClasses: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({ ...teacherData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/addteachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });
      if (!response.ok) {
        throw new Error("Failed to add teacher");
      }
      alert("Teacher added successfully!");
      // Clear the form after successful submission
      setTeacherData({
        fullName: "",
        age: "",
        dateOfBirth: "",
        numClasses: "",
      });

      onCloseTeacherModal();

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add teacher");
    }
  };

  return (
    <div className="add-teacher-form">
      <h2>Add New Teacher</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={teacherData.fullName}
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
            value={teacherData.age}
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
            value={teacherData.dateOfBirth}
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
            value={teacherData.numClasses}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Teacher
        </button>
      </form>
    </div>
  );
};
