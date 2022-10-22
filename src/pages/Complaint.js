import { API } from "aws-amplify";
import Map from "../complonents/Map";
import { Marker } from "react-leaflet";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOptions } from "../utils/options";
import { useParams, useNavigate, Link } from "react-router-dom";

const Complaint = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const user = useSelector((state) => state.user);
  const [complaint, setComplaint] = useState(null);
  const options = getOptions(user);

  useEffect(() => {
    getComplaint();
  }, []);

  const getComplaint = async () => {
    const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
    setComplaint(response);
  };

  const deleteComplaint = async (complaintId) => {
    const toBeDeleted = await API.del(
      "rdslambda2",
      `/complaints/${complaintId}`,
      options
    );

    const {
      request: { status },
      data: { message },
    } = toBeDeleted;
    alert(message);
    status === 200 && setTimeout(navigate("/"), 500);
  };

  return (
    <>
      {complaint !== null && (
        <div style={{ animation: `fadeIn 1s` }}>
          <h1>complaint number: {complaint.id}</h1>
          <p>{complaint.complaint}</p>
          <p>{complaint.user_email}</p>
          <p>{complaint.place.address}</p>
          {complaint.picture && (
            <>
              <img
                style={{ display: "block" }}
                key={Date.now()}
                src={`${complaint.picture}?${Date.now()}`}
                alt={complaint.complaint}
              />
              <br />
            </>
          )}

          <Map
            zoom={15}
            initPosition={{
              lat: complaint.place.lat,
              lng: complaint.place.lng,
            }}
          >
            <Marker
              position={{ lat: complaint.place.lat, lng: complaint.place.lng }}
              key={complaint.id}
            ></Marker>
          </Map>

          {user !== null && user.id === complaint.user_email && (
            <div style={{ paddingTop: "20px" }}>
              <button
                onClick={() => {
                  deleteComplaint(complaint.id);
                }}
              >
                Delete
              </button>
              <button>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "default",
                  }}
                  to={`/edit-complaint/${complaint.id}`}
                >
                  Edit
                </Link>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Complaint;
