import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ComplantForm = ({ requestType, user, response = null }) => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [initBinary, setInitBinary] = useState(null);
  const renderRevert = user !== null && response !== null;

  useEffect(() => {
    response !== null &&
      (() => {
        setComplaint(response.complaint);
        response.picture !== null && fetchBlob(response.picture);
      })();
  }, [response]);

  const fetchBlob = (uri) => {
    setPreview(uri);
    fetch(uri, {
      method: "GET",
    })
      .then((res) => res.blob())
      .then(async (blob) => {
        setInitBinary(await toBase64(blob));
      });
  };

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
    size > 5242880 &&
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
      body: {},
    };

    const isDifComplaint =
      requestType === "create" ||
      (requestType === "edit" &&
        complaint.length > 0 &&
        complaint !== response.complaint);
    isDifComplaint && Object.assign(options.body, { complaint: complaint });

    let binaryFile = {};

    picture.length > 0 &&
      (async () => {})((binaryFile = await addPicture(picture[0])));

    const isDifPhoto =
      requestType === "create" ||
      (requestType === "edit" &&
        "file" in binaryFile &&
        binaryFile.file.binary !== initBinary);

    isDifPhoto && Object.assign(options.body, binaryFile);

    console.log(options);
    /*picture.length > 0 &&
      Object.assign(options.body, await addPicture(picture[0]));

    const isSamePhoto =
      "file" in options.body && options.body.file.binary === initBinary;
    const isSameComplaint = options.body.complaint === response.complaint;

    try {
      
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
    } catch (error) {
      alert(error);
    }*/
  };

  return (
    <>
      <form
        encType="multipart/form-data"
        className="login"
        onSubmit={(e) => {
          sendPost(e);
        }}
      >
        <fieldset>
          <div>
            <label htmlFor="complaint">complaint: </label>
            <input
              type="text"
              name="complaint"
              onChange={(e) => {
                setComplaint(e.currentTarget.value);
              }}
              value={complaint}
            />
          </div>
          <div>
            <label htmlFor="picture">picture: </label>
            <input
              value={file}
              type="file"
              name="picture"
              accept="image/*"
              onChange={(e) => {
                setFile(e.currentTarget.value);
                e.currentTarget.files.length > 0
                  ? (() => {
                      const objectUrl = URL.createObjectURL(
                        e.currentTarget.files[0]
                      );
                      setPreview(objectUrl);
                      return () => URL.revokeObjectURL(objectUrl);
                    })()
                  : setPreview(null);
              }}
            />
          </div>
          <img src={preview} />
        </fieldset>
      </form>
      {renderRevert && (
        <button
          onClick={() => {
            setComplaint(response.complaint);
            setPreview(response.picture);
            setFile("");
          }}
        >
          Revert changes
        </button>
      )}
    </>
  );
};

export default ComplantForm;
