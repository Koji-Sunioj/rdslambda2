import Map from "../complonents/Map";
import { Marker } from "react-leaflet";
import { SVGOverlay } from "react-leaflet";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOptions } from "../utils/options";
import { purgeDeleted } from "../app/reducers/complaintsHome";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ComplaintSkeleton } from "../complonents/ComplaintSkeleton";
import { initialState as complaintInit } from "../app/reducers/complaintView";
import { fetchComplaint, deleteComplaint } from "../app/reducers/complaintView";

const Complaint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const user = useSelector((state) => state.user);
  const [isDeleted, setDeleted] = useState(false);
  const complaint = useSelector((state) => state.complaintPage);
  const { data, error, loading, deleting, deleted } = complaint;

  const shouldFetch =
    (JSON.stringify(complaintInit) === JSON.stringify(complaint) &&
      isDeleted === false) ||
    (data !== null && Number(data.id) !== Number(complaintId));

  useEffect(() => {
    window.scrollTo(0, 0);
    shouldFetch && dispatch(fetchComplaint(complaintId));
    deleted &&
      (() => {
        dispatch(purgeDeleted({ id: complaintId }));
        alert("item deleted");
        navigate("/");
      })();
  }, [deleted, complaintId]);

  const removeComplaint = (complaintId) => {
    setDeleted(true);
    const options = getOptions(user);
    dispatch(deleteComplaint({ options: options, complaintId: complaintId }));
  };

  let id, address, picture, user_email, text, lat, lng;
  const bounds = [
    [60.28, 25.1],
    [60.2, 24.55],
  ];

  // function LocationMarker(position) {
  //   const map = useMapEvents({});
  //   map.flyTo(position, 10);

  //   return <Marker position={position}></Marker>;
  // }

  //initPosition = { lat: 60.25, lng: 24.94 },

  return (
    <>
      {error && (
        <div style={{ textAlign: "center" }}>
          <h2>Error in fetch</h2>
        </div>
      )}
      {loading && (
        <div className="single-skeleton">
          <ComplaintSkeleton />
          <Map type={"onepoint-map"}>
            <SVGOverlay bounds={bounds}>
              <text x="50%" y="50%" stroke="black" fontSize="50px">
                loading
              </text>
            </SVGOverlay>
          </Map>
        </div>
      )}
      {data !== null &&
        (() => {
          ({
            id,
            complaint: text,
            place: { address, lat, lng },
            picture,
            user_email,
          } = data);
          return (
            <div>
              <h1>complaint number: {id}</h1>
              <p>{text}</p>
              <p>{user_email}</p>
              <p>{address}</p>
              {picture && (
                <>
                  <img
                    style={{ display: "block" }}
                    key={Date.now()}
                    src={`${picture}?${Date.now()}`}
                    alt={text}
                  />
                  <br />
                </>
              )}

              <Map
                type={"onepoint-map"}
                zoom={15}
                initPosition={{
                  lat: lat,
                  lng: lng,
                }}
              >
                <Marker position={{ lat: lat, lng: lng }}> </Marker>
              </Map>

              {user !== null && user.id === user_email && (
                <div>
                  <br />
                  <button
                    disabled={deleting}
                    onClick={() => {
                      removeComplaint(id);
                    }}
                  >
                    Delete
                  </button>
                  <button disabled={deleting}>
                    <Link
                      to={`/edit-complaint/${id}`}
                      style={{
                        textDecoration: "none",
                        color: deleting ? "rgba(16, 16, 16, 0.3)" : "black",
                        cursor: "default",
                      }}
                    >
                      Edit
                    </Link>
                  </button>
                </div>
              )}
            </div>
          );
        })()}
    </>
  );
};

export default Complaint;
