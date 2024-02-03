import React, { useState, useEffect } from "react";
import axios from "axios";

const AverageClasses = () => {
  const [averageClasses, setAverageClasses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAverageClasses = async () => {
      try {
        const response = await axios.get(
          "/teachers/average-classes"
        );
        setAverageClasses(response.data.averageClasses);
      } catch (error) {
        setError("Error fetching average classes.");
      }
    };

    fetchAverageClasses();
  }, []);

  return (
    <div className="average-classes">
      {error && <div className="error">{error}</div>}
      {averageClasses !== null && (
        <div className="average-classes-result">
          <h2>Average Number of Classes</h2>
          <h3>{averageClasses}</h3>
        </div>
      )}
    </div>
  );
};

export default AverageClasses;
