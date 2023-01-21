import PropTypes from 'prop-types';

function DownloadButton(props) {
  return (
    <div className={props.className}>
      <a href={window.URL.createObjectURL(new Blob([props.fileContents], { type: 'text/plain' }))} download={props.fileName}>Download Converted File</a>
    </div>
  );
}

DownloadButton.propTypes = {
  className: PropTypes.string.isRequired,
  fileContents: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};

export default DownloadButton;
