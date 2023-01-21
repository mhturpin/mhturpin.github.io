import PropTypes from 'prop-types';

function FileUpload(props) {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input type='file' accept={props.accept} id={props.id} name={props.id} onChange={props.onChange} />
    </div>
  );
}

FileUpload.propTypes = {
  accept: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FileUpload;
