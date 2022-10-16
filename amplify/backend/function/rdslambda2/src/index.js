const { Pool } = require("pg");
const { getSecret } = require("./utils/ssm");
const { verifyToken } = require("./utils/token");
const { checkSameUser, checkRequester } = require("./utils/check");
const { depositS3, removeS3 } = require("./utils/s3");
const { successObject, rejectObject } = require("./utils/headers");

exports.handler = async (event) => {
  const { user, host, database, password, port, bucket } = await getSecret(
    "rdslambda"
  );
  const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: Number(port),
  });

  const { httpMethod, resource, pathParameters, headers } = event;
  const routeKey = `${httpMethod} ${resource}`;
  let query, command, values, requester, user_email, type, isSameUser;

  switch (routeKey) {
    case "GET /complaints":
      query = await pool.query(
        "select id,complaint,user_email,picture from complaints order by id ASC;"
      );
      return {
        ...successObject,
        body: JSON.stringify(query.rows),
      };
    case "GET /complaints/{id}":
      query = await pool.query(
        `select id,complaint,user_email, picture from complaints where id=${pathParameters.id};`
      );
      return {
        ...successObject,
        body: JSON.stringify(query.rows[0]),
      };

    case "POST /complaints":
      ({ user_email, type } = await verifyToken(headers));
      switch (type) {
        case "user":
          const client = await pool.connect();
          const { complaint, file } = JSON.parse(event.body);
          values = [complaint, user_email];
          await client.query("BEGIN");
          command =
            "INSERT INTO complaints(complaint,user_email) VALUES($1,$2) RETURNING *;";
          query = await client.query(command, values);
          const { id } = query.rows[0];
          const secondCommand = "UPDATE complaints set picture=$1 where id=$2;";
          file &&
            (await depositS3({ ...file, name: `complaint_${id}` }, bucket).then(
              async (uri) => {
                (query.rows[0].picture = uri),
                  await client.query(secondCommand, [uri, id]);
              }
            ));
          await client.query("COMMIT");
          return {
            ...successObject,
            body: JSON.stringify({
              message: "complaint created",
              ...query.rows[0],
            }),
          };
        default:
          return rejectObject;
      }
    case "DELETE /complaints/{id}":
      requester = await checkRequester(headers, pathParameters.id, pool);
      switch (requester) {
        case "user same":
          query = await pool.query(
            `delete from complaints where id=${pathParameters.id} returning picture;`
          );
          const { picture } = query.rows[0];
          const fileReg = /complaint_[0-9]{1,3}/g;
          picture && (await removeS3(picture.match(fileReg)[0], bucket));
          return {
            ...successObject,
            body: JSON.stringify({
              message: `complaint ${pathParameters.id} deleted`,
            }),
          };
        default:
          return rejectObject;
      }
    case "PATCH /complaints/{id}":
      requester = await checkRequester(headers, pathParameters.id, pool);
      switch (requester) {
        case "user same":
          const client = await pool.connect();
          const { complaint, file, removePhoto } = JSON.parse(event.body);
          await client.query("BEGIN");
          command =
            "UPDATE complaints set complaint=$1 where id=$2 RETURNING *;";
          query = await client.query(command, [complaint, pathParameters.id]);
          if (removePhoto) {
            await removeS3(removePhoto, bucket);
            command = "UPDATE complaints set picture = null where id = $1;";
            await client.query(command, [pathParameters.id]);
            query.rows[0].picture = null;
          } else if (file) {
            const uri = await depositS3(
              {
                ...file,
                name: `complaint_${pathParameters.id}`,
              },
              bucket
            );
            const { picture } = query.rows[0];
            command = "UPDATE complaints set picture = $1 where id = $2;";
            picture === null &&
              client.query(command, [uri, pathParameters.id]).then(() => {
                query.rows[0].picture = uri;
              });
          }
          await client.query("COMMIT");
          return {
            ...successObject,
            body: JSON.stringify({
              message: `complaint ${pathParameters.id} updated`,
              ...query.rows[0],
            }),
          };

        default:
          return rejectObject;
      }
    default:
      return {
        ...successObject,
        statusCode: 204,
        body: JSON.stringify({ message: "no matching resource" }),
      };
  }
};
