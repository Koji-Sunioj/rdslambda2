const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,PATCH",
};

const successObject = {
  statusCode: 200,
  headers: headers,
};

const rejectObject = {
  statusCode: 403,
  headers: headers,
  body: JSON.stringify({
    message: "not authorized to create or alter resource",
  }),
};

module.exports = { successObject, rejectObject };
