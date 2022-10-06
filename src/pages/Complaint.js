import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";

const Complaint = () => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    testComplaint();
  }, []);

  const testComplaint = async () => {
    const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
    setComplaint(response);
  };

  return (
    <>
      {complaint !== null && (
        <div>
          <h1>complaint number: {complaint.id}</h1>
          <p>{complaint.complaint}</p>
          <p>{complaint.user_email}</p>
        </div>
      )}
    </>
  );
};

export default Complaint;
