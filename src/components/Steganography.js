import { useCallback, useEffect, useState } from 'react';

import DownloadButton from './DownloadButton';
import FileUpload from './FileUpload';
import Header from './Header';
import { encodeFileInImage, getFileContentsAsBase64, decodeFileFromImage } from '../helpers/SteganographyProcessor';

function Steganography() {
  const [fileToHide, setFileToHide] = useState({ name: '', base64: '' });
  const [hostImage, setHostImage] = useState({ name: '', base64: '' });
  const [encodedImageBase64, setEncodedImageBase64] = useState('');
  const [imageWithFile, setImageWithFile] = useState({ name: '', base64: '' });
  const [extractedFile, setExtractedFile] = useState({ name: '', base64: '' });

  const updateFiles = useCallback(() => {
    let file = document.getElementById('file-to-hide').files[0];
    getFileContentsAsBase64(file, (base64) => {
      setFileToHide({ name: file.name, base64: base64 });
    });

    file = document.getElementById('host-image').files[0];
    getFileContentsAsBase64(file, (base64) => {
      setHostImage({ name: file.name, base64: base64 });
    });

    file = document.getElementById('image-with-file').files[0];
    getFileContentsAsBase64(file, (base64) => {
      setImageWithFile({ name: file.name, base64: base64 });
    });
  }, [setFileToHide, setHostImage, setImageWithFile]);

  useEffect(() => {
    setEncodedImageBase64(encodeFileInImage(fileToHide, hostImage));
  }, [fileToHide, hostImage]);

  useEffect(() => {
    setExtractedFile(decodeFileFromImage(imageWithFile));
  }, [imageWithFile]);

  return (
    <div>
      <Header currentPage='steganography' />

      <h2>Steganography</h2>
      <FileUpload id='file-to-hide' label='Upload a file to hide: ' accept='*' onChange={updateFiles} />
      <FileUpload id='host-image' label='Upload a host image: ' accept='.png,.jpg,.jpeg' onChange={updateFiles} />
      <DownloadButton className='' href={encodedImageBase64} fileName={hostImage.name} />

      <h2>Retrieve file from image</h2>
      <FileUpload id='image-with-file' label='Upload an image to extract the file from: ' accept='.png' onChange={updateFiles} />
      <DownloadButton className='' href={extractedFile.base64} fileName={extractedFile.name} />
    </div>
  );
}

export default Steganography;
