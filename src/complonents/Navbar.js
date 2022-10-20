import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { unSetUser } from "../app/reducers/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { initialState } from "../app/reducers/userSlice";

const NavBar = ({ logOut }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const guestOrUser = user === initialState;

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
              Auth.signOut();
              dispatch(unSetUser());
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
