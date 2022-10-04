/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const secretsManagerClient = new SecretsManagerClient({
  region: "eu-north-1",
});
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const { Pool } = require("pg");

exports.handler = async (event) => {
  const params = {
    SecretId: "rdslambda",
  };
  const secretQuery = new GetSecretValueCommand(params);
  const { SecretString } = await secretsManagerClient.send(secretQuery);

  const { user, host, database, password, port } = JSON.parse(SecretString);
  const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: Number(port),
  });

  const { httpMethod, resource, pathParameters, headers } = event;
  const token = String(headers.Authorization).split(" ")[1];
  console.log(token);
  const verifier = CognitoJwtVerifier.create({
    userPoolId: "eu-north-1_cDwntZxiY",
    tokenUse: "id",
    clientId: "1g7rpp9sakka3flr0i1v7h8dcp",
  });

  try {
    const payload = await verifier.verify(token);
    console.log(payload);
    console.log("Token is valid. Payload:", payload);
  } catch {
    console.log("Token not valid!");
  }

  const routeKey = `${httpMethod} ${resource}`;
  let query, command, request, values;
  const returnHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,PATCH",
  };

  switch (routeKey) {
    case "GET /complaints":
      query = await pool.query("select id,complaint from complaints;");
      return {
        statusCode: 200,
        headers: returnHeaders,
        body: JSON.stringify(query.rows),
      };
    case "GET /complaints/{id}":
      query = await pool.query(
        `select id,complaint from complaints where id=${pathParameters.id};`
      );
      return {
        statusCode: 200,
        headers: returnHeaders,
        body: JSON.stringify(query.rows[0]),
      };
    case "POST /complaints":
      command = "INSERT INTO complaints(complaint) VALUES($1) RETURNING *;";
      request = JSON.parse(event.body);
      values = [request.complaint];
      query = await pool.query(command, values);
      return {
        statusCode: 200,
        headers: returnHeaders,
        body: JSON.stringify(query.rows),
      };
    case "DELETE /complaints/{id}":
      query = await pool.query(
        `delete from complaints where id=${pathParameters.id};`
      );
      return {
        statusCode: 200,
        headers: returnHeaders,
        body: JSON.stringify({
          message: `complaint ${pathParameters.id} deleted`,
        }),
      };
    case "PATCH /complaints/{id}":
      command = "UPDATE complaints set complaint=$1 where id=$2;";
      request = JSON.parse(event.body);
      values = [request.complaint, pathParameters.id];
      query = await pool.query(command, values);
      return {
        statusCode: 200,
        headers: returnHeaders,
        body: JSON.stringify({
          message: `complaint ${pathParameters.id} updated`,
        }),
      };
    default:
      return {
        statusCode: 200,
        headers: returnHeaders,
        body: JSON.stringify({ message: "no route key" }),
      };
  }
};
