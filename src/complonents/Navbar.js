import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUser();
  }, [Auth]);

  const getUser = async () => {
    try {
      const user = await Auth.currentUserInfo();
      setCurrentUser(user.attributes.email);
    } catch (error) {
      console.log("no user");
    }
  };

  console.log(currentUser);

  return (
    <div>
      <h1>Welcome bitch</h1>
      <button
        onClick={() => {
          Auth.signOut();
        }}
      >
        sign out
      </button>
    </div>
  );
};

export default NavBar;
