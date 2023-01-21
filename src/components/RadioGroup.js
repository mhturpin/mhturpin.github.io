function RadioGroup(props) {
  return (
    <div id={props.id} onChange={props.onChange}>
      <span>{props.label}</span>
      <br />

      {props.options.map((option) => (
        <div key={option}>
          <input type='radio' id={`property-${option}`} value={option} name='placemark-name' />
          <label htmlFor={`property-${option}`}>{option}</label>
          <br />
        </div>
      ))}

    </div>
  );
}

export default RadioGroup;
