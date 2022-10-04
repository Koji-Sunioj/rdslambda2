import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [complaints, setComplaints] = useState(null);

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    const response = await API.get("rdslambda2", "/complaints");
    setComplaints(response);
  };

  return (
    <>
      <h1>Current complaints</h1>
      {complaints !== null &&
        complaints.map((complaint) => (
          <div key={complaint.id}>
            <Link to={`complaint/${complaint.id}`}>
              <p>{complaint.complaint}</p>
            </Link>
          </div>
        ))}
    </>
  );
};

export default HomePage;
