import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
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

  console.log(complaints);

  return (
    <Authenticator>
      {({ signOut, user }) => {
        console.log(user.attributes.email);
        return (
          <main>
            <h1>Testing, testing... 1, 2, 3</h1>
            <button onClick={signOut}>Sign out</button>
            {complaints !== null &&
              complaints.map((complaint) => (
                <div>
                  <Link to={`complaint/${complaint.id}`}>
                    <p>{complaint.complaint}</p>
                  </Link>
                </div>
              ))}
          </main>
        );
      }}
    </Authenticator>
  );
};

export default HomePage;
