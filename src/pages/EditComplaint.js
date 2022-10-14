import ComplantForm from "../complonents/ComplaintForm";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "aws-amplify";

const EditComplaint = ({ user }) => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    getComplaint();
  }, []);

  const getComplaint = async () => {
    const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
    setComplaint(response);
  };

  return <ComplantForm requestType={"edit"} user={user} response={complaint} />;
};

export default EditComplaint;
