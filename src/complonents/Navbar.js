import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ user, logOut }) => {
  return (
    <div className="nav">
      <div>
        <h1>Welcome {user === null ? "guest" : user.attributes.email}</h1>
      </div>
      <div className="div-button">
        {user === null ? (
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
