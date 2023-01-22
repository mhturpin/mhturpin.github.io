import { useCallback, useEffect, useState } from 'react';

import DownloadButton from './DownloadButton';
import FileUpload from './FileUpload';
import Header from './Header';
import {
  getFileContentsAsBase64,
  getFileAsImageData,
  encodeFileInImage,
  decodeFileFromImage
} from '../helpers/SteganographyProcessor';

function Steganography() {
  const [fileToHide, setFileToHide] = useState({ name: '', base64: '' });
  const [hostImage, setHostImage] = useState({ name: '', base64: '' });
  const [encodedImageBase64, setEncodedImageBase64] = useState('');
  const [imageWithFile, setImageWithFile] = useState({ name: '', base64: '' });
  const [extractedFile, setExtractedFile] = useState({ name: '', base64: '' });

  // Callback to set fileToHide
  const updateFile = useCallback(() => {
    const file = document.getElementById('file-to-hide').files[0];

    getFileContentsAsBase64(file, (base64) => {
      setFileToHide({ name: file.name, base64: base64 });
    });
  }, [setFileToHide]);

  // Callback to set hostImage and imageWithFile
  const updateImage = useCallback((e) => {
    const setters = {
      'host-image': setHostImage,
      'image-with-file': setImageWithFile
    };
    const id = e.target.id;
    const file = document.getElementById(id).files[0];

    getFileAsImageData(file, (imageData) => {
      setters[id]({ name: file.name, imageData: imageData });
    });
  }, [setHostImage, setImageWithFile]);

  // Call encodeFileInImage when fileToHide or hostImage change
  useEffect(() => {
    setEncodedImageBase64(encodeFileInImage(fileToHide, hostImage));
  }, [fileToHide, hostImage]);

  // Call decodeFileFromImage when imageWithFile changes
  useEffect(() => {
    setExtractedFile(decodeFileFromImage(imageWithFile));
  }, [imageWithFile]);

  return (
    <div>
      <Header currentPage='steganography' />

      <h2>Steganography</h2>
      <FileUpload id='file-to-hide' label='Upload a File' accept='*' onChange={updateFile} />
      <FileUpload id='host-image' label='Upload a Host Image' accept='.png,.jpg,.jpeg' onChange={updateImage} />
      { encodedImageBase64 ? <DownloadButton className='' href={encodedImageBase64} fileName={hostImage.name} label='Download Encoded Image' /> : ''}

      <h2>Retrieve file from image</h2>
      <FileUpload id='image-with-file' label='Upload an Image' accept='.png' onChange={updateImage} />
      { extractedFile.base64 ? <DownloadButton className='' href={extractedFile.base64} fileName={extractedFile.name} label='Download Extracted File' /> : ''}
    </div>
  );
}

export default Steganography;
