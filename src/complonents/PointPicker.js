import Map from "./Map";
import { API } from "aws-amplify";
import { useSelector } from "react-redux";
import { getOptions } from "../utils/options";
import { useMapEvents, Marker, Popup, SVGOverlay } from "react-leaflet";

const PointPicker = ({
  position,
  location,
  setLocation,
  setPosition,
  setSearch,
  setDataList,
  disabled,
  setMapping,
}) => {
  const user = useSelector((state) => state.user);
  const initPosition = { lat: 60.25, lng: 24.94 };
  const options = getOptions(user);
  const LocationMarker = () => {
    const map = useMapEvents({
      click: async (e) => {
        if (!disabled) {
          setMapping(true);
          map.dragging.disable();
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
          setMapping(false);
          map.dragging.enable();
        }
      },
    });

    disabled && map.dragging.disable();

    if (!disabled) {
      position !== null ? map.flyTo(position, 10) : map.flyTo(initPosition, 10);
    }

    return position === null ? null : (
      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    );
  };

  let bounds = [
    [60.28, 25.1],
    [60.2, 24.55],
  ];

  if (position !== null) {
    const { lat, lng } = position;
    bounds = [
      [lat + 1, lng + 1],
      [lat - 1, lng - 1.2],
    ];
  }

  return (
    <Map type={"onepoint-map"}>
      <LocationMarker />
      {disabled && (
        <SVGOverlay bounds={bounds}>
          <text x="50%" y="50%" stroke="black" fontSize="50px">
            loading
          </text>
        </SVGOverlay>
      )}
    </Map>
  );
};

export default PointPicker;
