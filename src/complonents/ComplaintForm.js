import { API } from "aws-amplify";
import addPicture from "../utils/to64";
import PointPicker from "./PointPicker";
import { useState, useEffect } from "react";
import { getOptions } from "../utils/options";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initialState as userState } from "../app/reducers/userSlice";
import { addCreated, mutateEdited } from "../app/reducers/complaintsHome";
import { createComplaint, editComplaint } from "../app/reducers/complaintView";

const ComplantForm = ({ requestType, complaintId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    complaintPage: { data, mutating, mutated, mutateError, loading },
    user,
  } = useSelector((state) => state);
  const guestOrUser = user === userState;

  const [mapping, setMapping] = useState(false);

  //picture values
  const [file, setFile] = useState("");
  const [checked, setChecked] = useState(false);
  const [preview, setPreview] = useState(null);

  //form values
  const [position, setPosition] = useState(null);
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [complaint, setComplaint] = useState("");

  const hasPicture = data !== null && data.picture !== null;
  const shouldSetInput = data !== null && requestType === "edit" && !mutated;
  const options = getOptions(user);

  useEffect(() => {
    shouldSetInput && resetFromResp(data);
    mutated &&
      (() => {
        requestType === "edit"
          ? dispatch(mutateEdited(data))
          : dispatch(addCreated(data));
        alert(`successful ${requestType}`);
        navigate(`/complaint/${data.id}`);
      })();
    mutateError && alert(`failed ${requestType}`);
  }, [mutated, mutateError, shouldSetInput]);

  const resetFromResp = (data) => {
    setComplaint(data.complaint);
    setPreview(data.picture);
    setPosition({ lat: data.place.lat, lng: data.place.lng });
    setSearch(data.place.address);
    setLocation(data.place.address);
    setDataList([
      {
        place_name: data.place.address,
        id: 1,
        center: [data.place.lng, data.place.lat],
      },
    ]);
  };

  const sendPost = async (event) => {
    event.preventDefault();
    const {
      currentTarget: {
        complaint: { value: complaint },
        picture: { files: picture },
        location: { value: address },
      },
    } = event;

    const getFile = /complaint_[0-9]{1,3}/g;
    const place = dataList.find((item) => item.place_name === address.trim());

    complaint.length > 0 &&
      Object.assign(options.body, { complaint: complaint });
    place &&
      Object.assign(options.body, {
        place: {
          address: place.place_name,
          lat: place.center[1],
          lng: place.center[0],
        },
      });
    checked
      ? Object.assign(options.body, {
          removePhoto: data.picture.match(getFile)[0],
        })
      : picture.length > 0 &&
        Object.assign(options.body, await addPicture(picture[0]));

    try {
      if (!("complaint" in options.body) || !("place" in options.body))
        throw new Error("complaint and location must be valid");
      switch (requestType) {
        case "edit":
          dispatch(
            editComplaint({ options: options, complaintId: complaintId })
          );
          break;
        case "create":
          dispatch(createComplaint(options));
          break;
        default:
          alert("missing action");
      }
    } catch (error) {
      alert(error);
    }
  };

  const searchChange = (e) => {
    const {
      target: { value: searchInput },
    } = e;
    setSearch(searchInput);
    const inputAction = "inputType" in e.nativeEvent ? "typed" : "selected";

    switch (inputAction) {
      case "typed": {
        clearTimeout(timer);
        const refined = searchInput.trim();
        const shouldFetch = refined.length > 0 && refined !== search.trim();
        const newTimer = setTimeout(() => {
          shouldFetch &&
            API.get(
              "rdslambda2",
              `/places?query=address&location=${refined}`,
              options
            ).then((response) => {
              setDataList(response.data.places);
            });
        }, 1000);
        setTimer(newTimer);
        break;
      }
      case "selected": {
        searchInput.length > 0 &&
          (() => {
            const place = dataList.find(
              (item) => item.place_name === searchInput.trim()
            );
            setPosition({ lat: place.center[1], lng: place.center[0] });
            setLocation(place.place_name);
          })();
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      <form
        type="submit"
        encType="multipart/form-data"
        onSubmit={(e) => {
          sendPost(e);
        }}
      >
        <fieldset className="login" disabled={mutating || loading || mapping}>
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
            <label htmlFor="location">location: </label>
            <input
              type="search"
              name="location"
              autoComplete="off"
              value={search}
              onChange={searchChange}
              list="places"
            />
            <datalist id="places">
              {dataList.map((place) => (
                <option value={place.place_name} key={place.id} />
              ))}
            </datalist>
          </div>
          <PointPicker
            location={location}
            position={position}
            setLocation={setLocation}
            setPosition={setPosition}
            setSearch={setSearch}
            setDataList={setDataList}
            disabled={mutating || loading || mapping}
            setMapping={setMapping}
          />
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

          <div>
            <label htmlFor="picture">
              {hasPicture ? "replace photo" : "new photo"}
            </label>
            <input
              disabled={checked}
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
                      hasPicture ? setPreview(data.picture) : setPreview(null);
                    })();
              }}
            />
          </div>

          {preview !== null && (
            <figure>
              <img
                src={
                  hasPicture && preview === data.picture
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

          <button type="submit">Go</button>
        </fieldset>
      </form>
      {!guestOrUser && (
        <button
          disabled={mutating || loading || mapping}
          onClick={() => {
            setFile("");
            data === null
              ? (() => {
                  setPosition(null);
                  setLocation(null);
                  setComplaint("");
                  setSearch("");
                  setPreview(null);
                })()
              : resetFromResp(data);
          }}
        >
          Revert changes
        </button>
      )}
    </>
  );
};

export default ComplantForm;
