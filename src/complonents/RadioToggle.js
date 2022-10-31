const RadioToggle = ({ identifier, radioChange, loading }) => {
  return (
    <>
      <label htmlFor={identifier + "View"}>{identifier}</label>
      <input
        defaultChecked={identifier === "list"}
        type="radio"
        name="view"
        value={identifier}
        id={identifier + "View"}
        onChange={radioChange}
        disabled={loading}
      />
    </>
  );
};

export default RadioToggle;
