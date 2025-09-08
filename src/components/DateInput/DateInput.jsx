export const DateInput = (props) => {
  const { id, label } = props;

  return (
    <input id={`date-${id}`} type="date" />
  );
};
