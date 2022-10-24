import moment from "moment";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { unSetUser } from "../app/reducers/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { initialState } from "../app/reducers/userSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [time, setTime] = useState("");
  const user = useSelector((state) => state.user);
  const guestOrUser = user === initialState;

  useEffect(() => {
    if (user.exp !== null) {
      const intervalId = setInterval(() => {
        setTime(moment().format("HH:mm:ss"));
      }, 1000);

      const expiration = new Date(user.exp * 1000);
      const current = new Date();
      current > expiration && logOut();

      return () => clearInterval(intervalId);
    }
  }, [time, user.exp]);

  const logOut = () => {
    Auth.signOut();
    dispatch(unSetUser());
    navigate("/");
  };

  return (
    <div className="nav">
      <div className="child">
        <Link to={"/"}>
          <h2>Welcome {guestOrUser ? "guest" : user.id}</h2>
        </Link>
      </div>
      {!guestOrUser && (
        <div className="child">
          <Link to={"/create-complaint"}>
            <h2>Create Complaint</h2>
          </Link>{" "}
        </div>
      )}
      <div className="child">
        {guestOrUser ? (
          <Link to={"/login"}>
            <h2>Login</h2>
          </Link>
        ) : (
          <button
            onClick={() => {
              logOut();
            }}
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
