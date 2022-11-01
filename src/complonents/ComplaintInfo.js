import { Link } from "react-router-dom";

export const complaintInfo = (complaint) => {
  const {
    id,
    complaint: text,
    user_email,
    place: { address },
    picture,
  } = complaint;
  return (
    <>
      <Link to={`complaint/${id}`}>{text}</Link>
      <p>{user_email}</p>
      <p>{address}</p>
      {picture && (
        <img
          src={`${picture}?${Date.now()}`}
          alt={text}
          style={{ width: "25vw" }}
        />
      )}
    </>
  );
};
