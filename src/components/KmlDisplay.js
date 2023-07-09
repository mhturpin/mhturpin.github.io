import PropTypes from 'prop-types';

function KmlDisplay(props) {
  function renderNode([name, contents], i) {
    if (name === 'attributes') {
      return '';
    }

    /* eslint-disable no-use-before-define */
    return (
      <div className='kml-node' key={i}>
        <p>{`${name} ${contents.attributes !== undefined ? JSON.stringify(contents.attributes) : ''}`}</p>
        {renderContents(contents)}
      </div>
    );
    /* eslint-enable no-use-before-define */
  }

  function renderContents(contents) {
    if (contents instanceof Array) {
      return contents.map((e, i) => renderNode(Object.entries(e)[0], i));
    } else if (contents instanceof Object) {
      return Object.entries(contents).map((e, i) => renderNode(e, i));
    } else {
      return (
        <div className='kml-node'>
          {contents}
        </div>
      );
    }
  }

  return (
    <div>
      {renderNode(Object.entries(props.kmlObject)[0], 0)}
    </div>
  );
}

KmlDisplay.propTypes = {
  kmlObject: PropTypes.object.isRequired,
};

export default KmlDisplay;
