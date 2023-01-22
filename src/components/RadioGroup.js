import PropTypes from 'prop-types';

function RadioGroup(props) {
  return (
    <div id={props.id} onChange={props.onChange}>
      <span>{props.label}</span>
      <br />

      {props.options.map((option) => (
        <span key={option}>
          <input type='radio' id={`property-${option}`} value={option} name='placemark-name' />
          <label htmlFor={`property-${option}`}>{option}</label>
          <br />
        </span>
      ))}

    </div>
  );
}

RadioGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default RadioGroup;
