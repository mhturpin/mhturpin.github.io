import Header from './Header';
import FileUpload from './FileUpload';

function Steganography() {
  return (
    <div>
      <Header currentPage='steganography' />
      <h2>Steganography</h2>

      <FileUpload label='Upload a file to hide: ' name='file-to-hide' accept='*' />
      <FileUpload label='Upload a host image: ' name='host-image' accept='.png,.jpg,.jpeg' />
    </div>
  );
}

export default Steganography;
