import PropTypes from 'prop-types';

function KmlDisplay(props) {
  function renderNode([name, contents]) {
    if (name === 'attributes') {
      return '';
    }

    /* eslint-disable no-use-before-define */
    return (
      <div className='kml-node'>
        <p>{`${name} ${contents.attributes !== undefined ? JSON.stringify(contents.attributes) : ''}`}</p>
        {renderContents(contents)}
      </div>
    );
    /* eslint-enable no-use-before-define */
  }

  function renderContents(contents) {
    if (contents instanceof Array) {
      return contents.map((e) => renderNode(Object.entries(e)[0]));
    } else if (contents instanceof Object) {
      return Object.entries(contents).map((e) => renderNode(e));
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
      {renderNode(Object.entries(props.kmlObject)[0])}
    </div>
  );
}

KmlDisplay.propTypes = {
  kmlObject: PropTypes.object.isRequired,
};

export default KmlDisplay;
