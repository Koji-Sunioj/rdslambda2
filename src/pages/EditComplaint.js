import ComplantForm from "../complonents/ComplaintForm";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const EditComplaint = ({ user }) => {
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

  const editPost = async (event) => {
    event.preventDefault();
    const {
      currentTarget: {
        complaint: { value },
      },
    } = event;

    const options = {
      headers: {
        Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
      },
      response: true,
      body: { complaint: value },
    };

    const toBePatched = await API.patch(
      "rdslambda2",
      `/complaints/${complaintId}`,
      options
    );
    const {
      request: { status },
      data: { message },
    } = toBePatched;
    alert(message);
    status == 200 && setTimeout(navigate(`/complaint/${complaintId}`), 500);
  };

  return <ComplantForm sendPost={editPost} user={user} />;
};

export default EditComplaint;
