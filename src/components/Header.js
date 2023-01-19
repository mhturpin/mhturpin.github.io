import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <header>
      <Link to='/kml_generator' className={props.currentPage === 'kml_generator' ? 'current-page' : ''}>KML Generator</Link>
      <Link to='/steganography' className={props.currentPage === 'steganography' ? 'current-page' : ''}>Steganography</Link>
    </header>
  );
}

export default Header;
