import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const ComplaintForm = ({ user }) => {
  const navigate = useNavigate();
  console.log(user);
  const createPost = async (event) => {
    event.preventDefault();
    const {
      currentTarget: {
        complaint: { value },
      },
    } = event;
    console.log(value);
    const options = {
      headers: {
        Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
      },
      response: true,
      body: { complaint: value },
    };
    const toBeCreated = await API.post("rdslambda2", "/complaints/", options);
    const {
      request: { status },
      data: { message },
    } = toBeCreated;

    alert(message);
    status === 200 && setTimeout(navigate("/"), 500);
  };

  return (
    <form className="login" onSubmit={createPost}>
      <div>
        <label htmlFor="complaint">complaint: </label>
        <input type="text" name="complaint" disabled={user === null} />
      </div>
    </form>
  );
};

export default ComplaintForm;
