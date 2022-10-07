const ComplantForm = ({ sendPost, user }) => {
  return (
    <form className="login" onSubmit={sendPost}>
      <div>
        <label htmlFor="complaint">complaint: </label>
        <input type="text" name="complaint" disabled={user === null} />
      </div>
    </form>
  );
};

export default ComplantForm;
