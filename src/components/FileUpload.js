import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { getFileContentsAsBase64 } from '../helpers/SteganographyProcessor';

function FileUpload(props) {
  const [fileName, setFileName] = useState('');

  const updateFileName = useCallback((e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    if (file.type.startsWith('image')) {
      getFileContentsAsBase64(file, (base64) => {
        const img = e.target.parentElement.getElementsByClassName('preview')[0];
        img.src = base64;
        img.classList.remove('hidden');
      });
    }
  }, [setFileName]);

  return (
    <div>
      <label className='btn' htmlFor={props.id}>{props.label}</label>
      <input className='hidden' type='file' accept={props.accept} id={props.id} name={props.id} onChange={(e) => { props.onChange(e); updateFileName(e); }} />
      <span className='uploaded-file-name'>{fileName}</span>
      <img className='hidden preview' alt={`${fileName} preview`} />
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
