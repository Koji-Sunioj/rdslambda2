import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ComplantForm from "../complonents/ComplaintForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplaint } from "../app/reducers/complaintView";
import { initialState as complaintInit } from "../app/reducers/complaintView";

const EditComplaint = () => {
  const { complaintId } = useParams();
  const dispatch = useDispatch();
  const complaint = useSelector((state) => state.complaintPage);

  const shouldFetch =
    JSON.stringify(complaintInit) === JSON.stringify(complaint) ||
    (complaint.data !== null &&
      Number(complaint.data.id) !== Number(complaintId));

  useEffect(() => {
    shouldFetch && dispatch(fetchComplaint(complaintId));
  }, []);

  // useEffect(() => {
  //   getComplaint();
  // }, []);

  // const getComplaint = async () => {
  //   const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
  //   setComplaint(response);
  //};

  return <ComplantForm requestType={"edit"} complaintId={complaintId} />;
};

export default EditComplaint;
