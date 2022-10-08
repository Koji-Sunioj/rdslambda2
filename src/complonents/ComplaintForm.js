import { API } from "aws-amplify";
import { useNavigate, useParams } from "react-router-dom";

const ComplantForm = ({ requestType, user }) => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const sendPost = async (event) => {
    event.preventDefault();
    const {
      currentTarget: {
        complaint: { value },
      },
    } = event;

    const options = {
      headers: {
        Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
      },
      response: true,
      body: { complaint: value },
    };
    let toBeAltered, path;
    switch (requestType) {
      case "edit":
        toBeAltered = await API.patch(
          "rdslambda2",
          `/complaints/${complaintId}`,
          options
        );
        path = `/complaint/${complaintId}`;
        break;
      case "create":
        toBeAltered = await API.post("rdslambda2", "/complaints/", options);
        path = "/";
        break;
    }
    const {
      request: { status },
      data: { message },
    } = toBeAltered;
    alert(message);
    status === 200 && setTimeout(navigate(path), 500);
  };

  return (
    <form
      className="login"
      onSubmit={(e) => {
        sendPost(e);
      }}
    >
      <div>
        <label htmlFor="complaint">complaint: </label>
        <input type="text" name="complaint" disabled={user === null} />
      </div>
    </form>
  );
};

export default ComplantForm;
