import PropTypes from 'prop-types';

function KmlDisplay(props) {
  return (
    <div>
      {JSON.stringify(props.kmlObject)}
    </div>
  );
}

KmlDisplay.propTypes = {
  kmlObject: PropTypes.object.isRequired,
};

export default KmlDisplay;
