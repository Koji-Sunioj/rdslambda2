const aws = require("aws-sdk");

const depositS3 = async (file) => {
  const { name, size, binary, type } = file;
  const s3 = new aws.S3();
  const decodedFile = Buffer.from(binary, "base64");
  const params = {
    Bucket: "rdslambda2",
    Key: name,
    Body: decodedFile,
    ContentType: type,
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};

module.exports = { depositS3 };
