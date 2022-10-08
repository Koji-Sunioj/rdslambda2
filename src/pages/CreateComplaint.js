import ComplantForm from "../complonents/ComplaintForm";

const CreateComplaint = ({ user }) => {
  return <ComplantForm requestType={"create"} user={user} />;
};

export default CreateComplaint;
