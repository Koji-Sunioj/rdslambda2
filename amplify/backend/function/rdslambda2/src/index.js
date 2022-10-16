const { Pool } = require("pg");
const { getSecret } = require("./utils/ssm");
const { verifyToken } = require("./utils/token");
const { checkSameUser } = require("./utils/check");
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
  let query,
    command,
    values,
    isValidUser,
    requester,
    user_email,
    type,
    isSameUser;

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
            "INSERT INTO complaints(complaint,user_email) VALUES($1,$2) RETURNING id;";
          query = await client.query(command, values);
          if (file) {
            const { id } = query.rows[0];
            const uri = await depositS3(
              { ...file, name: `complaint_${id}` },
              bucket
            );
            command = "UPDATE complaints set picture=$1 where id=$2;";
            await client.query(command, [uri, id]);
            query.rows[0].picture = uri;
          }
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
      ({ user_email, type } = await verifyToken(headers));
      isSameUser = await checkSameUser(pool, user_email, pathParameters.id);
      requester = `${type} ${isSameUser}`;
      switch (requester) {
        case "user same":
          query = await pool.query(
            `delete from complaints where id=${pathParameters.id} returning picture;`
          );
          const { picture } = query.rows[0];
          if (picture) {
            const complaintPic = picture.match(/complaint_[0-9]{1,3}/g)[0];
            await removeS3(complaintPic, bucket);
          }
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
      ({ user_email, type } = await verifyToken(headers));
      isSameUser = await checkSameUser(pool, user_email, pathParameters.id);
      requester = `${type} ${isSameUser}`;
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
          } else if (file) {
            const uri = await depositS3(
              {
                ...file,
                name: `complaint_${pathParameters.id}`,
              },
              bucket
            );
            const { picture } = query.rows[0];
            if (picture === null) {
              command = "UPDATE complaints set picture = $1 where id = $2;";
              await client.query(command, [uri, pathParameters.id]);
              query.rows[0].picture = uri;
            }
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
