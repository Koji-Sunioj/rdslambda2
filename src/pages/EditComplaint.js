import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ComplantForm from "../complonents/ComplaintForm";

const EditComplaint = () => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    getComplaint();
  }, []);

  const getComplaint = async () => {
    const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
    setComplaint(response);
  };

  return (
    <ComplantForm
      requestType={"edit"}
      response={complaint}
      complaintId={complaintId}
    />
  );
};

export default EditComplaint;
