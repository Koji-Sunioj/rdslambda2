import { useMapEvents, Marker, Popup } from "react-leaflet";
import { API } from "aws-amplify";
import { useSelector } from "react-redux";
import { getOptions } from "../utils/options";

import Map from "./Map";

const ComplaintMap = ({
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
          const {
            data: {
              place: { place_name },
              place: fetchedPlace,
            },
          } = place;
          setSearch(place_name);
          setLocation(place_name);
          setPosition(e.latlng);
          setDataList([fetchedPlace]);
        } catch (e) {
          alert("no address found");
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
    <Map initPosition={initPosition}>
      <LocationMarker />
    </Map>
  );
};

export default ComplaintMap;
