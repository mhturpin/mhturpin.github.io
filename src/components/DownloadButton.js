import PropTypes from 'prop-types';

function DownloadButton(props) {
  return (
    <div className={props.className}>
      <a href={props.href ? props.href : window.URL.createObjectURL(new Blob([props.fileContents], { type: 'text/plain' }))} download={props.fileName}>Download Converted File</a>
    </div>
  );
}

DownloadButton.propTypes = {
  className: PropTypes.string.isRequired,
  fileContents: PropTypes.string,
  fileName: PropTypes.string.isRequired,
  href: PropTypes.string,
};

DownloadButton.defaultProps = {
  fileContents: null,
  href: null,
};

export default DownloadButton;
