# Teacher-Management-System
The Teacher Management System is a web application developed to efficiently manage teacher-related information(like Name,Date of Birth,Number of Classes and Age). This system provides CRUD (Create, Read, Update and Delete) operations, filtering based on Age and Classes, searching capabilities, and an average class calculation feature. The project utilizes React.js for Frontend, Express and Node.js for Backend and used file system storage(JSON) for data storage. This website is hosted on Render.

## Steps to Run Project
- First Clone the git Repository.
- Navigate to the `backend` directory : cd backend
- Install dependencies : npm install
- Run the backend Server : npm start
- Navigate to the `frontend` directory : cd frontend
- Install dependenices : npm install
- Run the frontend application : npm start
- Visit `http://localhost:3000` in your browser to access the Teacher Management System.

## Features
| Endpoint                    | Method | Description                                  | Request Parameters / Body                                                                                 | Response                                                   |
| --------------------------- | ------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `/`                         | GET    | Retrieves a list of all teachers.            | N/A                                                                                                       | An array containing all teacher objects.                   |
| `/addteachers`              | POST   | Adds a new teacher to the system.            | JSON object containing the details of the new teacher.                                                    | The added teacher object.                                  |
| `/editteacher/:id`          | PUT    | Updates an existing teacher's details.       | `id`: The ID of the teacher to be edited. <br> JSON object containing the updated details of the teacher. | The updated teacher object.                                |
| `/deleteteacher/:id`        | DELETE | Deletes a teacher from the system.           | `id`: The ID of the teacher to be deleted.                                                                | The deleted teacher object.                                |
| `/teachers/filterByAge`     | GET    | Filters teachers based on their age.         | `age`: Age range to filter teachers (`20-30`, `30-40`, `40+`).                                            | An array of teacher objects filtered by age.               |
| `/teachers/filterByClasses` | GET    | Filters teachers based on number of classes. | `classes`: Number of classes range (`1-3`, `4-6`, `6+`).                                                  | An array of teacher objects filtered by number of classes. |
| `/teachers/search/:name`    | GET    | Searches for teachers by their name.         | `name`: The name of the teacher to search for.                                                            | An array of teacher objects matching the search query.     |
| `/teachers/average-classes` | GET    | Calculates the average number of classes.    | N/A                                                                                                       | JSON object containing the average number of classes.      |


## Technology
- React.js
- Node.js
- Express
- CSS

[Project Link](https://teacher-management-system-k2ri.onrender.com/)

