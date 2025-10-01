export const DateInput = (props) => {
  const { id, label, value, onChange, required = false } = props;

  return (
    <input
      id={`date-${id}`}
      type="date"
      required={required}
      value={value ?? ""}
      onChange={onChange}
    />
  );
};
