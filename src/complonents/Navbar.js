import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";

const NavBar = ({ user, logOut }) => {
  const guestOrUser = user === null;

  return (
    <div className="nav">
      <div>
        <Link to={"/"}>
          <h2>Welcome {guestOrUser ? "guest" : user.attributes.email}</h2>
        </Link>
      </div>
      {!guestOrUser && (
        <div className="div-button">
          <Link to={"/complaint-form"}>
            <h2>Create Complaint</h2>
          </Link>{" "}
        </div>
      )}
      <div className="div-button">
        {guestOrUser ? (
          <Link to={"/login"}>
            <h2>Login</h2>
          </Link>
        ) : (
          <button
            onClick={() => {
              Auth.signOut();
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