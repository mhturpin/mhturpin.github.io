function Checkbox(props) {
  return (
    <div>
      <input type='checkbox' id={props.id}/>
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
}

export default Checkbox;
