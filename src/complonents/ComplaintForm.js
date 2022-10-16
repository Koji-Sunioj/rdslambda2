import { API } from "aws-amplify";
import addPicture from "../utils/to64";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ComplantForm = ({ requestType, user, response = null }) => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [file, setFile] = useState("");
  const [checked, setChecked] = useState(false);
  const [preview, setPreview] = useState(null);
  const [complaint, setComplaint] = useState("");
  const hasPicture = response !== null && response.picture !== null;

  useEffect(() => {
    response !== null &&
      (() => {
        setComplaint(response.complaint);
        response.picture !== null && setPreview(response.picture);
      })();
  }, [response]);

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

    const getFile = /complaint_[0-9]{1,3}/g;

    complaint.length > 0 &&
      Object.assign(options.body, { complaint: complaint });
    checked
      ? Object.assign(options.body, {
          removePhoto: response.picture.match(getFile)[0],
        })
      : picture.length > 0 &&
        Object.assign(options.body, await addPicture(picture[0]));

    try {
      let toBeAltered, path;
      console.log(options);
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
      console.log(toBeAltered);
      alert(message);
      status === 200 && setTimeout(navigate(path), 500);
    } catch (error) {
      alert(error);
    }
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
        {hasPicture && (
          <div>
            <label htmlFor="removePhoto">no photo </label>
            <input
              value={checked}
              name="removePhoto"
              type={"checkbox"}
              onClick={(e) => {
                const {
                  currentTarget: { checked },
                } = e;
                setChecked(checked);
              }}
            />
          </div>
        )}
        <fieldset disabled={checked}>
          <div>
            <label htmlFor="picture">
              {hasPicture ? "replace photo" : "new photo"}
            </label>
            <input
              value={file}
              type="file"
              name="picture"
              accept="image/*"
              onChange={(e) => {
                setFile(e.currentTarget.value);
                const {
                  currentTarget: {
                    files: { length },
                  },
                } = e;
                length > 0
                  ? (() => {
                      const objectUrl = URL.createObjectURL(
                        e.currentTarget.files[0]
                      );
                      setPreview(objectUrl);
                      return () => URL.revokeObjectURL(objectUrl);
                    })()
                  : (() => {
                      hasPicture
                        ? setPreview(response.picture)
                        : setPreview(null);
                    })();
              }}
            />
          </div>

          {preview !== null && (
            <figure>
              <img
                src={
                  hasPicture && preview === response.picture
                    ? `${preview}?${Date.now()}`
                    : preview
                }
                alt="current selection"
              />
              <figcaption>
                {file !== ""
                  ? "current file selection"
                  : "current selection from complaint"}
              </figcaption>
            </figure>
          )}
        </fieldset>
      </form>
      {user !== null && (
        <button
          onClick={() => {
            response === null
              ? (() => {
                  setComplaint("");
                  setPreview(null);
                  setFile("");
                })()
              : (() => {
                  setComplaint(response.complaint);
                  setPreview(response.picture);
                  setFile("");
                })();
          }}
        >
          Revert changes
        </button>
      )}
    </>
  );
};

export default ComplantForm;
