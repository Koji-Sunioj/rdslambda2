import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const Login = ({ loginChain }) => {
  let navigate = useNavigate();

  const logInside = async (event) => {
    event.preventDefault();
    console.log("testing");
    const { email, userPassword } = event.currentTarget;
    try {
      const user = await Auth.signIn(email.value, userPassword.value);
      loginChain(user);
      navigate("/");
    } catch (error) {
      console.log("error signing in", error);
    }
  };

  return (
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
  );
};

export default Login;
