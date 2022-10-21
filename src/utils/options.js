export const getOptions = (user) => {
  const options = {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
    response: true,
    body: {},
  };
  return options;
};
