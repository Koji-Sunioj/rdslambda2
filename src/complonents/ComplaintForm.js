import { API } from "aws-amplify";
import { useNavigate, useParams } from "react-router-dom";

const ComplantForm = ({ requestType, user, complaint }) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve(reader.result.replace(/^data:image\/\w+;base64,/, ""));
      reader.onerror = (error) => reject(error);
    });

  const { complaintId } = useParams();
  const navigate = useNavigate();
  const sendPost = async (event) => {
    event.preventDefault();
    // const file = event.currentTarget.picture.files[0];
    // console.log(file);
    const {
      currentTarget: {
        complaint: { value: complaint },
        picture: { files: picture },
      },
    } = event;
    const { name, size, type } = picture[0];
    const upload = { name, size, type };
    upload.binary = await toBase64(picture[0]);

    const options = {
      headers: {
        Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
      },
      response: true,
      body: { complaint: complaint, file: upload },
    };

    console.log(options);
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
    //status === 200 && setTimeout(navigate(path), 500);
  };

  return (
    <form
      encType="multipart/form-data"
      className="login"
      onSubmit={(e) => {
        sendPost(e);
      }}
    >
      <div>
        <label htmlFor="complaint">complaint: </label>
        <input
          type="text"
          name="complaint"
          disabled={user === null}
          defaultValue={complaint}
        />
        <input type="file" name="picture" />
      </div>
    </form>
  );
};

export default ComplantForm;
