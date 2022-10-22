import { MapContainer, TileLayer } from "react-leaflet";

const Map = ({ children, initPosition }) => {
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
      {children}
    </MapContainer>
  );
};

export default Map;
