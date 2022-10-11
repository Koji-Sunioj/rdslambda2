import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./complonents/Navbar";
import HomePage from "./pages/HomePage";
import Complaint from "./pages/Complaint";
import CreateComplaint from "./pages/CreateComplaint";
import EditComplaint from "./pages/EditComplaint";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const Pages = () => {
  //user.signInUserSession.accessToken.jwtToken
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user.signInUserSession.idToken.jwtToken);
      setUser(user);
    } catch (error) {
      setUser(null);
    }
  };

  const setLogin = (cognitoObject) => {
    setUser(cognitoObject);
  };

  return (
    <BrowserRouter>
      <NavBar
        user={user}
        logOut={() => {
          setUser(null);
        }}
      />
      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/create-complaint"
            element={<CreateComplaint user={user} />}
          />
          <Route
            path="/edit-complaint/:complaintId"
            element={<EditComplaint user={user} />}
          />
          <Route path="/login" element={<Login loginChain={setLogin} />} />
          <Route
            path="/complaint/:complaintId"
            element={<Complaint user={user} />}
          />
          <Route
            path="/sign-up"
            element={<SignUp loginChain={setLogin} />}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Pages;
