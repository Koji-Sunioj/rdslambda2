import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";

const Complaint = ({ user }) => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);

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
        Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
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
    status == 200 && setTimeout(navigate("/"), 500);
  };

  return (
    <>
      {complaint !== null && (
        <div style={{ animation: `fadeIn 1s` }}>
          <h1>complaint number: {complaint.id}</h1>
          <p>{complaint.complaint}</p>
          <p>{complaint.user_email}</p>
          <img src={complaint.picture} style={{ display: "block" }} />
          {user !== null && user.attributes.email === complaint.user_email && (
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
