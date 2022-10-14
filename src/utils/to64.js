const addPicture = async (picture) => {
  const { size, type, name } = picture;
  size > 5242880 &&
    (() => {
      throw new Error("too big");
    })();
  const binary = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(picture);
    reader.onload = () =>
      resolve(reader.result.replace(/^data:image\/\w+;base64,/, ""));
    reader.onerror = (error) => reject(error);
  });

  return {
    file: {
      size,
      type,
      binary: binary,
      extension: name.match(/\.[0-9a-z]+$/g)[0],
    },
  };
};

export default addPicture;
