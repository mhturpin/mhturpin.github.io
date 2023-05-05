import PropTypes from 'prop-types';

import Kml from '../helpers/Kml';

function KmlDisplay(props) {
  return (
    <div>
      {props.kml.toString()}
      {props.kmlFileContents}
    </div>
  );
}

KmlDisplay.propTypes = {
  kml: PropTypes.instanceOf(Kml).isRequired,
  kmlFileContents: PropTypes.string.isRequired,
};

export default KmlDisplay;
