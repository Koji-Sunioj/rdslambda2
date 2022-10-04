const ComplaintForm = ({ user }) => {
  return (
    <form className="login">
      <div>
        <label htmlFor="complaint">complaint: </label>
        <input type="text" name="complaint" />
      </div>
    </form>
  );
};

export default ComplaintForm;
