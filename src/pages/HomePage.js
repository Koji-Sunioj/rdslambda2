import { API } from "aws-amplify";
import Map from "../complonents/Map";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { complaintInfo } from "../complonents/ComplaintInfo";

const HomePage = () => {
  const [complaints, setComplaints] = useState(null);
  const [view, setView] = useState("list");

  useEffect(() => {
    getAllComplaints();
  }, []);

  const getAllComplaints = async () => {
    const response = await API.get("rdslambda2", "/complaints");
    console.log("endpoint hit");
    setComplaints(response);
  };

  const radioChange = (e) => {
    setView(e.currentTarget.value);
  };

  const initPosition = { lat: 60.25, lng: 24.94 };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1>
          Current complaints{" "}
          {complaints !== null && ` (${complaints.length} total)`}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <label htmlFor="listView">list</label>
          <input
            type="radio"
            name="view"
            value="list"
            checked={view === "list"}
            id="listView"
            onChange={radioChange}
          />
          <label htmlFor="mapView">map</label>
          <input
            type="radio"
            name="view"
            value="map"
            id="mapView"
            onChange={radioChange}
          />
        </div>
      </div>
      {view === "list" ? (
        complaints !== null &&
        complaints.map((complaint, n) => {
          let value = (n += 1);
          return (
            <div
              key={complaint.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                animation: `fadeIn ${value / 4}s`,
              }}
            >
              {complaintInfo(complaint)}
            </div>
          );
        })
      ) : (
        <Map initPosition={initPosition}>
          {complaints.map((complaint) => (
            <Marker
              position={{ lat: complaint.place.lat, lng: complaint.place.lng }}
              key={complaint.id}
            >
              <Popup className="popup">{complaintInfo(complaint)}</Popup>
            </Marker>
          ))}
        </Map>
      )}
    </>
  );
};

export default HomePage;
