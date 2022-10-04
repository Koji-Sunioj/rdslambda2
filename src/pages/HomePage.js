import { API, Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [complaints, setComplaints] = useState(null);

  useEffect(() => {
    // console.log(Auth.user);
    testApi();
  }, []);

  const testApi = async () => {
    //const user = await Auth.currentAuthenticatedUser();
    //console.log(user);

    const response = await API.get("rdslambda2", "/complaints");
    setComplaints(response);
  };

  return (
    <>
      <h1>Testing, testing... 1, 2, 3</h1>
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

/*<Authenticator>
      {({ signOut, user }) => {
        console.log(Auth.user);
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
    </Authenticator> */
