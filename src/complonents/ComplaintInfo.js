import { Link } from "react-router-dom";

export const complaintInfo = (complaint) => {
  return (
    <>
      <Link to={`complaint/${complaint.id}`}>{complaint.complaint}</Link>
      <p>{complaint.user_email}</p>
      <p>{complaint.place.address}</p>
      {complaint.picture && (
        <img
          src={`${complaint.picture}?${Date.now()}`}
          alt={complaint.complaint}
          style={{ width: "25vw" }}
        />
      )}
    </>
  );
};
