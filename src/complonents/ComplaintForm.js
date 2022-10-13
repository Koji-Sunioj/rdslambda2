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

  const addPicture = async (picture) => {
    const { size, type, name } = picture;
    size > 125000 &&
      (() => {
        throw new Error("too big");
      })();

    const binary = await toBase64(picture);
    return {
      file: {
        size,
        type,
        binary: binary,
        extension: name.match(/\.[0-9a-z]+$/g)[0],
      },
    };
  };

  const { complaintId } = useParams();
  const navigate = useNavigate();
  const sendPost = async (event) => {
    event.preventDefault();
    const {
      currentTarget: {
        complaint: { value: complaint },
        picture: { files: picture },
      },
    } = event;

    const options = {
      headers: {
        Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
      },
      response: true,
      body: { complaint: complaint },
    };
    try {
      picture.length > 0 &&
        Object.assign(options.body, await addPicture(picture[0]));
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
      console.log(toBeAltered);
      const {
        request: { status },
        data: { message },
      } = toBeAltered;
      alert(message);
      status === 200 && setTimeout(navigate(path), 500);
    } catch (error) {
      alert(error);
    }
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
      </div>
      <div>
        <label htmlFor="picture">picture: </label>
        <input
          type="file"
          name="picture"
          accept="image/*"
          style={{ width: "50%" }}
        />
      </div>
    </form>
  );
};

export default ComplantForm;
