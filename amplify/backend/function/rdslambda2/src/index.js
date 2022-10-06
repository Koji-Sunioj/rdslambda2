/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { Pool } = require("pg");
const { successObject } = require("./utils/headers");
const { verifyToken } = require("./utils/token");
const { getSecret } = require("./utils/ssm");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

exports.handler = async (event) => {
  const { user, host, database, password, port } = await getSecret("rdslambda");
  const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: Number(port),
  });

  const { httpMethod, resource, pathParameters, headers } = event;

  /*const token = String(headers.Authorization).split(" ")[1];
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
     }*/

  const routeKey = `${httpMethod} ${resource}`;
  let query, command, request, values;

  switch (routeKey) {
    case "GET /complaints":
      query = await pool.query(
        "select id,complaint,user_email from complaints;"
      );
      return {
        ...successObject,
        body: JSON.stringify(query.rows),
      };
    case "GET /complaints/{id}":
      query = await pool.query(
        `select id,complaint,user_email from complaints where id=${pathParameters.id};`
      );
      return {
        ...successObject,
        body: JSON.stringify(query.rows[0]),
      };
    case "POST /complaints":
      const isValidUser = await verifyToken(headers);
      if (isValidUser.valid) {
        command =
          "INSERT INTO complaints(complaint,user_email) VALUES($1,$2) RETURNING *;";
        request = JSON.parse(event.body);
        values = [request.complaint, isValidUser.user_email];
        query = await pool.query(command, values);
        return {
          ...successObject,
          body: JSON.stringify(query.rows[0]),
        };
      } else {
        return {
          ...successObject,
          statusCode: 403,
          body: JSON.stringify({
            message: "not authorized to create resource",
          }),
        };
      }

    case "DELETE /complaints/{id}":
      query = await pool.query(
        `delete from complaints where id=${pathParameters.id};`
      );
      return {
        ...successObject,
        body: JSON.stringify({
          message: `complaint ${pathParameters.id} deleted`,
        }),
      };
    case "PATCH /complaints/{id}":
      command = "UPDATE complaints set complaint=$1 where id=$2 RETURNING *;";
      request = JSON.parse(event.body);
      values = [request.complaint, pathParameters.id];
      query = await pool.query(command, values);
      console.log(query.rows);
      return {
        ...successObject,
        body: JSON.stringify({
          message: `complaint ${pathParameters.id} updated`,
          ...query.rows[0],
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
