import { Auth } from "aws-amplify";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ loginChain }) => {
  let navigate = useNavigate();

  const logInside = async (event) => {
    event.preventDefault();
    const { email, userPassword } = event.currentTarget;
    try {
      const user = await Auth.signIn(email.value, userPassword.value);
      loginChain(user);
      navigate("/");
    } catch (error) {
      alert("error signing in");
    }
  };

  return (
    <>
      <h1>Login Page</h1>
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
      <Link to={"/sign-up"}>Don't have an account? Sign up!</Link>
    </>
  );
};

export default Login;
