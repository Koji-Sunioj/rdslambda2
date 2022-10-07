import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import ComplantForm from "../complonents/ComplaintForm";

const CreateComplaint = ({ user }) => {
  const navigate = useNavigate();
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

  return <ComplantForm sendPost={createPost} user={user} />;
};

export default CreateComplaint;
