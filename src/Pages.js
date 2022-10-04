import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./complonents/Navbar";
import HomePage from "./pages/HomePage";
import Complaint from "./pages/Complaint";
import ComplaintForm from "./pages/ComplaintForm";
import Login from "./pages/Login";

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/complaint-form" element={<ComplaintForm user={user} />} />
        <Route path="/login" element={<Login loginChain={setLogin} />} />
        <Route path="/complaint/:complaintId" element={<Complaint />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;
