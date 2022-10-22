import { Link } from "react-router-dom";

export const complaintInfo = (complaint) => {
  return (
    <>
      <Link to={`complaint/${complaint.id}`}>
        <p>{complaint.complaint}</p>
      </Link>
      <p>{complaint.user_email}</p>
      <p>{complaint.place.address}</p>
      {complaint.picture && (
        <img
          src={`${complaint.picture}?${Date.now()}`}
          alt={complaint.complaint}
        />
      )}
    </>
  );
};
