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

  const { httpMethod, resource, pathParameters } = event;
  const routeKey = `${httpMethod} ${resource}`;
  let query, command, request, values;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,PATCH",
  };

  switch (routeKey) {
    case "GET /complaints":
      query = await pool.query("select id,complaint from complaints;");
      console.log(query.rows);
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(query.rows),
      };
    case "GET /complaints/{id}":
      query = await pool.query(
        `select id,complaint from complaints where id=${pathParameters.id};`
      );
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(query.rows[0]),
      };
    case "POST /complaints":
      command = "INSERT INTO complaints(complaint) VALUES($1) RETURNING *;";
      request = JSON.parse(event.body);
      values = [request.complaint];
      query = await pool.query(command, values);
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(query.rows),
      };
    case "DELETE /complaints/{id}":
      query = await pool.query(
        `delete from complaints where id=${pathParameters.id};`
      );
      return {
        statusCode: 200,
        headers: headers,
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
        headers: headers,
        body: JSON.stringify({
          message: `complaint ${pathParameters.id} updated`,
        }),
      };
    default:
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ message: "no route key" }),
      };
  }
};
