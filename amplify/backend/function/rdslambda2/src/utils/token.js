const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifyToken = async (headers) => {
  const token = String(headers.Authorization).split(" ")[1];
  const verifier = CognitoJwtVerifier.create({
    userPoolId: "eu-north-1_cDwntZxiY",
    tokenUse: "id",
    clientId: "1g7rpp9sakka3flr0i1v7h8dcp",
  });

  try {
    const payload = await verifier.verify(token);
    return { user_email: payload.email, type: "user" };
  } catch {
    return { type: "guest" };
  }
};

module.exports = { verifyToken };
