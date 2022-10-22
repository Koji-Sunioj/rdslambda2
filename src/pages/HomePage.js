import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
const HomePage = () => {
  const [complaints, setComplaints] = useState(null);
  const [view, setView] = useState("list");

  useEffect(() => {
    getAllComplaints();
  }, []);

  const getAllComplaints = async () => {
    const response = await API.get("rdslambda2", "/complaints");
    setComplaints(response);
  };

  const radioChange = (e) => {
    setView(e.currentTarget.value);
  };

  const initPosition = { lat: 60.25, lng: 24.94 };
  console.log(complaints);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1>Current complaints</h1>
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
              <Link to={`complaint/${complaint.id}`}>
                <p>{complaint.complaint}</p>
              </Link>
              <p>{complaint.user_email}</p>
              <p>{complaint.place.address}</p>
              {complaint.picture && (
                <img
                  src={`${complaint.picture}?${Date.now()}`}
                  alt={complaint.complaint}
                />
              )}
            </div>
          );
        })
      ) : (
        <MapContainer
          center={initPosition}
          zoom={10}
          id="map"
          maxBounds={[
            [59.846373196, 20.6455928891],
            [70.1641930203, 31.5160921567],
          ]}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {complaints.map((complaint) => (
            <Marker
              position={{ lat: complaint.place.lat, lng: complaint.place.lng }}
              key={complaint.id}
            >
              <Popup className="popup">
                <Link to={`complaint/${complaint.id}`}>
                  <h2>{complaint.complaint}</h2>
                </Link>
                <p>{complaint.user_email}</p>
                <p>{complaint.place.address}</p>
                {complaint.picture && (
                  <img
                    src={`${complaint.picture}?${Date.now()}`}
                    alt={complaint.complaint}
                  />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default HomePage;
