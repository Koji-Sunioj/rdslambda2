import { useState } from "react";
import { Auth } from "aws-amplify";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setTheUser } from "../app/reducers/userSlice";

const Login = () => {
  const [logging, setLoggin] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const logInside = async (event) => {
    setLoggin(true);
    event.preventDefault();
    const { email, userPassword } = event.currentTarget;
    try {
      const user = await Auth.signIn(email.value, userPassword.value);
      dispatch(
        setTheUser({
          jwt: user.signInUserSession.idToken.jwtToken,
          id: user.attributes.email,
          exp: user.signInUserSession.idToken.payload.exp,
        })
      );
      navigate("/");
    } catch (error) {
      alert("error signing in");
    }
    setLoggin(false);
  };

  return (
    <>
      <h1>Login Page</h1>
      <fieldset disabled={logging}>
        <form onSubmit={logInside} className="login">
          <div>
            <label htmlFor="email">email:</label>
            <input type="text" name="email" />
          </div>
          <div>
            <label htmlFor="userPassword">password:</label>
            <input name="userPassword" type="password" />
          </div>
          <button type="submit">Go</button>
        </form>
      </fieldset>
      <Link to={"/sign-up"}>Don't have an account? Sign up!</Link>
    </>
  );
};

export default Login;
