/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { Pool } = require("pg");
const { successObject, rejectObject } = require("./utils/headers");
const { verifyToken } = require("./utils/token");
const { getSecret } = require("./utils/ssm");
const { checkSameUser } = require("./utils/check");

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
  const routeKey = `${httpMethod} ${resource}`;
  let query, command, request, values, isValidUser;

  switch (routeKey) {
    case "GET /complaints":
      query = await pool.query(
        "select id,complaint,user_email from complaints order by id ASC;"
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
      isValidUser = await verifyToken(headers);
      switch (isValidUser.type) {
        case "guest":
          return rejectObject;
        case "user":
          command =
            "INSERT INTO complaints(complaint,user_email) VALUES($1,$2) RETURNING *;";
          request = JSON.parse(event.body);
          values = [request.complaint, isValidUser.user_email];
          query = await pool.query(command, values);
          return {
            ...successObject,
            body: JSON.stringify({
              message: "complaint created",
              ...query.rows[0],
            }),
          };
      }
    case "DELETE /complaints/{id}":
      isValidUser = await verifyToken(headers);
      switch (isValidUser.type) {
        case "guest":
          return rejectObject;
        case "user":
          const isSameUser = await checkSameUser(
            pool,
            isValidUser.user_email,
            pathParameters.id
          );

          if (isSameUser) {
            query = await pool.query(
              `delete from complaints where id=${pathParameters.id};`
            );
            return {
              ...successObject,
              body: JSON.stringify({
                message: `complaint ${pathParameters.id} deleted`,
              }),
            };
          } else {
            return rejectObject;
          }
      }
    case "PATCH /complaints/{id}":
      isValidUser = await verifyToken(headers);
      switch (isValidUser.type) {
        case "guest":
          return rejectObject;

        case "user":
          request = JSON.parse(event.body);
          const isSameUser = await checkSameUser(
            pool,
            isValidUser.user_email,
            pathParameters.id
          );

          if (isSameUser) {
            command =
              "UPDATE complaints set complaint=$1 where id=$2 RETURNING *;";
            values = [request.complaint, pathParameters.id];
            query = await pool.query(command, values);
            return {
              ...successObject,
              body: JSON.stringify({
                message: `complaint ${pathParameters.id} updated`,
                ...query.rows[0],
              }),
            };
          } else {
            return rejectObject;
          }
      }
    default:
      return {
        ...successObject,
        statusCode: 204,
        body: JSON.stringify({ message: "no matching resource" }),
      };
  }
};
