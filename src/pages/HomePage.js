import Map from "../complonents/Map";
import { useEffect, useState } from "react";
import RadioToggle from "../complonents/RadioToggle";
import { Marker, Popup } from "react-leaflet";
import { complaintInfo } from "../complonents/ComplaintInfo";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplaints } from "../app/reducers/complaintsHome";
import { initialState as complaintsInit } from "../app/reducers/complaintsHome";
import { ComplaintsSkeleton } from "../complonents/ComplaintsSkeleton";

const HomePage = () => {
  const dispatch = useDispatch();
  const complaints = useSelector((state) => state.complaintsPage);
  const { data, error, loading } = complaints;
  const [page, setPage] = useState(1);
  const [view, setView] = useState("list");

  console.log(complaints);

  useEffect(() => {
    complaints === complaintsInit && dispatch(fetchComplaints());
    window.scrollTo(0, 0);
  }, [page]);

  const radioChange = (e) => {
    setView(e.currentTarget.value);
  };

  let filter = [];
  let pages = [];

  data !== null &&
    (() => {
      filter.push(...data.slice(page * 5 - 5, page * 5));
      for (let i = 1; i <= Math.ceil(data.length / 5); i++) {
        pages.push(i);
      }
    })();

  return (
    <div id="show">
      <div
        style={{
          display: "flex",
          fledDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1>
          Current complaints
          {data !== null && ` (${data.length} total)`}
          {loading && ` (loading)`}
        </h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <RadioToggle
            identifier={"list"}
            radioChange={radioChange}
            loading={loading}
          />
          <RadioToggle
            identifier={"map"}
            radioChange={radioChange}
            loading={loading}
          />
        </div>
      </div>
      {error && (
        <div style={{ textAlign: "center" }}>
          <h2>Error in fetch</h2>
        </div>
      )}
      {loading &&
        [0, 1, 2, 3, 4].map((skeleton, n) => {
          let value = (n += 1);
          return (
            <div
              className="skeleton"
              key={skeleton}
              style={{
                animation: `fadeIn ${value / 4}s`,
              }}
            >
              <ComplaintsSkeleton />
            </div>
          );
        })}
      {view === "list" ? (
        filter.length > 0 && (
          <div>
            {filter.map((complaint) => {
              return (
                <div key={complaint.id} className="complaint">
                  {complaintInfo(complaint)}
                </div>
              );
            })}
            <br />
            {pages.map((num) => (
              <button
                key={num}
                disabled={page === num}
                onClick={() => {
                  setPage(num);
                }}
              >
                {num}
              </button>
            ))}
          </div>
        )
      ) : (
        <Map type={"multipoint-map"}>
          {data.map((complaint) => (
            <Marker
              position={{ lat: complaint.place.lat, lng: complaint.place.lng }}
              key={complaint.id}
            >
              <Popup className="popup">{complaintInfo(complaint)}</Popup>
            </Marker>
          ))}
        </Map>
      )}
    </div>
  );
};

export default HomePage;
