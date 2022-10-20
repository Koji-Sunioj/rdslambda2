import { API } from "aws-amplify";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [complaints, setComplaints] = useState(null);
  const user = useSelector((state) => state.user);
  console.log(user);
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
        complaints.map((complaint, n) => {
          let value = (n += 1);
          return (
            <div
              key={complaint.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                animation: `fadeIn ${value / 4}s`,
              }}
            >
              <Link to={`complaint/${complaint.id}`}>
                <p>{complaint.complaint}</p>
              </Link>
              <p>{complaint.user_email}</p>
              {complaint.picture && (
                <img
                  src={`${complaint.picture}?${Date.now()}`}
                  alt={complaint.complaint}
                />
              )}
            </div>
          );
        })}
    </>
  );
};

export default HomePage;
