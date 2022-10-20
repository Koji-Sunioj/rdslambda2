import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Complaint = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    getComplaint();
  }, []);

  const getComplaint = async () => {
    const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
    setComplaint(response);
  };

  const deleteComplaint = async (complaintId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
      response: true,
    };
    const toBeDeleted = await API.del(
      "rdslambda2",
      `/complaints/${complaintId}`,
      options
    );

    const {
      request: { status },
      data: { message },
    } = toBeDeleted;
    alert(message);
    status === 200 && setTimeout(navigate("/"), 500);
  };

  return (
    <>
      {complaint !== null && (
        <div style={{ animation: `fadeIn 1s` }}>
          <h1>complaint number: {complaint.id}</h1>
          <p>{complaint.complaint}</p>
          <p>{complaint.user_email}</p>
          {complaint.picture && (
            <img
              style={{ display: "block" }}
              key={Date.now()}
              src={`${complaint.picture}?${Date.now()}`}
              alt={complaint.complaint}
            />
          )}

          {user !== null && user.id === complaint.user_email && (
            <div style={{ paddingTop: "20px" }}>
              <button
                onClick={() => {
                  deleteComplaint(complaint.id);
                }}
              >
                Delete
              </button>
              <button>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "default",
                  }}
                  to={`/edit-complaint/${complaint.id}`}
                >
                  Edit
                </Link>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Complaint;
