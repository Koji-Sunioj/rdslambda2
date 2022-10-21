import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import { API } from "aws-amplify";
import { useSelector } from "react-redux";
import { getOptions } from "../utils/options";

const Map = ({
  position,
  location,
  setLocation,
  setPosition,
  setSearch,
  setDataList,
}) => {
  const user = useSelector((state) => state.user);
  const initPosition = { lat: 60.25, lng: 24.94 };
  const options = getOptions(user);
  const LocationMarker = () => {
    const map = useMapEvents({
      click: async (e) => {
        try {
          const place = await API.get(
            "rdslambda2",
            `/places?query=point&coords=${e.latlng.lat},${e.latlng.lng}`,
            options
          );
          if ("place" in place.data) {
            const {
              data: {
                place: { place_name },
                place: fetchedPlace,
              },
            } = place;
            console.log(fetchedPlace);
            setSearch(place_name);
            setLocation(place_name);
            setPosition(e.latlng);
            setDataList([fetchedPlace]);
          } else {
            alert("nothing");
          }
        } catch (e) {
          console.log(e);
        }
      },
    });
    position !== null ? map.flyTo(position, 10) : map.flyTo(initPosition, 10);

    return position === null ? null : (
      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    );
  };
  return (
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
  );
};

export default Map;
