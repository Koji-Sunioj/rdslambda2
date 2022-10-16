const aws = require("aws-sdk");

const depositS3 = async (file, bucket) => {
  const { name, size, binary, type } = file;
  const s3 = new aws.S3();
  const decodedFile = Buffer.from(binary, "base64");
  const params = {
    Bucket: bucket,
    Key: name,
    Body: decodedFile,
    ContentType: type,
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};

const removeS3 = async (name, bucket) => {
  const s3 = new aws.S3();
  const params = {
    Bucket: bucket,
    Key: name,
  };
  await s3.deleteObject(params).promise();
};

module.exports = { depositS3, removeS3 };
