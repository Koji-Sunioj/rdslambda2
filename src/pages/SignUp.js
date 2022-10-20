import { Auth } from "aws-amplify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTheUser } from "../app/reducers/userSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signFlow, setSignFlow] = useState(null);
  const [pwd, setPwd] = useState(null);
  const sendUser = async (username, password) => {
    try {
      const { user } = await Auth.signUp({
        username,
        password,
      });
      setPwd(password);
      Array.from(document.querySelectorAll("input")).forEach(
        (input) => (input.value = "")
      );
      setSignFlow(user);
    } catch (error) {
      alert(error);
    }
  };

  const confirmSignUp = async (event) => {
    event.preventDefault();
    const {
      currentTarget: {
        confirmation: { value: confirmation },
      },
    } = event;
    try {
      const signUpResponse = await Auth.confirmSignUp(
        signFlow.username,
        confirmation
      );
      signUpResponse === "SUCCESS" &&
        (async () => {
          const user = await Auth.signIn(signFlow.username, pwd);
          dispatch(
            setTheUser({
              jwt: user.signInUserSession.idToken.jwtToken,
              id: user.attributes.email,
            })
          );
          navigate("/");
        })();
    } catch (error) {
      alert(error);
    }
  };

  const signUp = (event) => {
    event.preventDefault();
    const {
      currentTarget: {
        email: { value: email },
        userPassword: { value: firstPwd },
        confirmPassword: { value: secondPwd },
      },
    } = event;

    const isEmail = /^[a-z0-9.]{1,64}@[a-z0-9.]{5,10}[a-z]{1,10}$/i.test(
      String(email).toLowerCase()
    );

    if (firstPwd !== secondPwd || !isEmail) {
      alert("passwords don't match");
    } else {
      sendUser(email, firstPwd);
    }
  };

  return (
    <>
      <h1>Sign up page</h1>
      {signFlow === null ? (
        <>
          <form className="login" onSubmit={signUp}>
            <div>
              <label htmlFor="email">email:</label>
              <input type="text" name="email" />
            </div>
            <div>
              <label htmlFor="userPassword">password:</label>
              <input name="userPassword" type="password" />
            </div>
            <div>
              <label htmlFor="confirmPassword">confirm password:</label>
              <input name="confirmPassword" type="password" />
            </div>
            <button type="submit">Go</button>
          </form>
        </>
      ) : (
        <>
          <form className="login" onSubmit={confirmSignUp}>
            <div>
              <label htmlFor="confirmation">sign up code:</label>
              <input type="text" name="confirmation" />
            </div>
            <button type="submit">Go</button>
          </form>
        </>
      )}
    </>
  );
};

export default SignUp;
