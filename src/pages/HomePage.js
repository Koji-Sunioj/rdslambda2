import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [complaints, setComplaints] = useState(null);

  useEffect(() => {
    getAllComplaints();
  }, []);

  const getAllComplaints = async () => {
    const response = await API.get("rdslambda2", "/complaints");
    setComplaints(response);
  };

  return (
    <>
      <h1>Current complaints</h1>
      {complaints !== null &&
        complaints.map((complaint) => (
          <div
            key={complaint.id}
            style={{ border: "1px solid #ccc", padding: "20px" }}
          >
            <Link to={`complaint/${complaint.id}`}>
              <p>{complaint.complaint}</p>
            </Link>
            <p>{complaint.user_email}</p>
          </div>
        ))}
    </>
  );
};

export default HomePage;
