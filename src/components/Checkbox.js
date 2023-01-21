import PropTypes from 'prop-types';

function Checkbox(props) {
  return (
    <div>
      <input type='checkbox' id={props.id} />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Checkbox;
