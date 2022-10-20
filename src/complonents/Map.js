import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import { API } from "aws-amplify";
import { useSelector } from "react-redux";

const Map = () => {
  const user = useSelector((state) => state.user);
  const initPosition = { lat: 60.25, lng: 24.94 };
  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const [location, setLocation] = useState(null);
    const map = useMapEvents({
      click: async (e) => {
        try {
          const init = {
            headers: {
              Authorization: `Bearer ${user.jwt}`,
            },
            response: true,
          };

          const place = await API.get(
            "rdslambda2",
            `/places?query=point&coords=${e.latlng.lat},${e.latlng.lng}`,
            init
          );
          setLocation(place.data.place_name);
          setPosition(e.latlng);
          map.flyTo(e.latlng, 10);
        } catch (e) {
          console.log(e);
        }
      },
    });

    //!isSelected ? map.flyTo(initPosition, 10) : map.flyTo(selectPosition, 10);

    return position === null ? null : (
      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    );
  };
  return (
    <>
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
        <LocationMarker />
      </MapContainer>
    </>
  );
};

export default Map;
