import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div>
          <h1>complaint number: {complaint.id}</h1>
          <p>{complaint.complaint}</p>
          <p>{complaint.user_email}</p>
          {user !== null && user.attributes.email === complaint.user_email && (
            <button
              onClick={() => {
                deleteComplaint(complaint.id);
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Complaint;
