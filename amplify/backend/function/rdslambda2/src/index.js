const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "database-1.cfhhi0m77nho.eu-north-1.rds.amazonaws.com",
  database: "fuckyou",
  password: "FuckFuck",
  port: 5432,
});

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(event);
  const { httpMethod, resource, pathParameters } = event;
  const routeKey = `${httpMethod} ${resource}`;
  let query, command, request, values;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };

  switch (routeKey) {
    case "GET /complaints":
      query = await pool.query("select id,complaint from complaints;");
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
        body: JSON.stringify({ message: `${routeKey}` }),
      };
  }
};
