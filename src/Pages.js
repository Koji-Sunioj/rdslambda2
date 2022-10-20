import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./complonents/Navbar";
import HomePage from "./pages/HomePage";
import Complaint from "./pages/Complaint";
import CreateComplaint from "./pages/CreateComplaint";
import EditComplaint from "./pages/EditComplaint";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import { Auth } from "aws-amplify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheUser, unSetUser } from "./app/reducers/userSlice";

const Pages = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      dispatch(
        setTheUser({
          jwt: user.signInUserSession.idToken.jwtToken,
          id: user.attributes.email,
        })
      );
      console.log(user.signInUserSession.idToken.jwtToken);
    } catch (error) {
      dispatch(unSetUser());
    }
  };

  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-complaint" element={<CreateComplaint />} />
          <Route
            path="/edit-complaint/:complaintId"
            element={<EditComplaint />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/complaint/:complaintId" element={<Complaint />} />
          <Route path="/sign-up" element={<SignUp l />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Pages;
