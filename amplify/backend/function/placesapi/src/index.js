const { getSecret } = require("./utils/ssm");
const { verifyToken } = require("./utils/token");
const { successObject, rejectObject } = require("./utils/headers");
const axios = require("axios");

exports.handler = async (event) => {
  console.log(event);
  const { mapboxKey } = await getSecret("rdslambda");
  const endPoint = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
  const {
    headers,
    queryStringParameters: { query, location, coords },
  } = event;
  const { type } = await verifyToken(headers);
  const router = `${type} ${query}`;
  let places;
  switch (router) {
    case "user address":
      places = await axios.get(
        endPoint +
          `${location}.json?types=address&access_token=${mapboxKey}&autocomplete=true&country=fi`
      );
      return {
        ...successObject,
        body: JSON.stringify({
          message: "success",
          places: places.data.features,
        }),
      };
    case "user point":
      console.log("user point");
      const [lat, lng] = coords.split(",");
      places = await axios.get(
        endPoint + `${lng},${lat}.json?types=address&access_token=${mapboxKey}`
      );

      return {
        ...successObject,
        body: JSON.stringify({
          message: "success",
          place: places.data.features[0],
        }),
      };

    default:
      return {
        ...successObject,
        statusCode: 204,
        body: JSON.stringify({ message: "no matching resource" }),
      };
  }
};
