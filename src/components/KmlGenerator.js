import { useCallback, useState } from 'react';

import Checkbox from './Checkbox';
import DownloadButton from './DownloadButton';
import FileUpload from './FileUpload';
import Header from './Header';
import KmlDisplay from './KmlDisplay';
import RadioGroup from './RadioGroup';
import Kml from '../helpers/Kml';
import UsdaZoneColors from '../UsdaZoneColors';

function KmlGenerator() {
  const [kml] = useState(new Kml());
  const [kmlFileName, setKmlFileName] = useState('');
  const [kmlFileContents, setKmlFileContents] = useState('');
  const [geojson, setGeojson] = useState({});
  const [propertyKeys, setPropertyKeys] = useState([]);
  const [nameField, setNameField] = useState('');

  // Pull data from the file when it's uploaded
  const updateFile = useCallback(() => {
    const file = document.getElementById('geojson-file').files[0];
    setKmlFileName(file.name.replace('.geojson', '.kml'));
    setKmlFileContents('');

    file.text().then((text) => {
      const inputJson = JSON.parse(text);
      setGeojson(inputJson);
      setPropertyKeys(Object.keys(inputJson.features[0].properties));
    });
  }, [setKmlFileName, setKmlFileContents, setGeojson, setPropertyKeys]);

  const updateNameField = useCallback(() => {
    setNameField(document.querySelector('input[name="placemark-name"]:checked').value);
    // Clear out kml since it will have to be regenerated
    setKmlFileContents('');
  }, [setNameField, setKmlFileContents]);

  // Convert geojson file to kml
  function processGeojson() {
    const outputJson = geojson;

    if (document.getElementById('include-zone-colors').checked) {
      Object.keys(UsdaZoneColors).forEach((id) => kml.addColorStyle(id, UsdaZoneColors[id]));
      outputJson.features = outputJson.features.map((f) => ({ ...f, properties: { ...f.properties, styleId: `${f.properties.ZONE}-color` } }));
    }

    kml.importFromGeoJson(outputJson, kmlFileName.replace('.kml', ''), nameField);
    setKmlFileContents(kml.toString());
  }

  return (
    <div>
      <Header currentPage='kml_generator' />
      <h2>KML Generator</h2>
      <p>
        KML is an XML language for storing information that can be displayed on a map, such as placemarks or boundaries.
        This project accepts a geojson file and will convert it to KML.
        <br />
        <a href='https://developers.google.com/kml/documentation/kmlreference'>https://developers.google.com/kml/documentation/kmlreference</a>
        <br />
        <a href='https://www.ogc.org/standards/kml/'>https://www.ogc.org/standards/kml/</a>
      </p>

      <div className='half-page'>
        <FileUpload id='geojson-file' label='Upload Geojson' accept='.geojson' onChange={updateFile} />

        {kmlFileName !== '' ? (
          <>
            <Checkbox id='include-zone-colors' label='Include styles for USDA plant hardiness zone colors' />
            <RadioGroup id='select-name' label='Select which property to use as the placemark names' options={propertyKeys} onChange={updateNameField} />
            <button type='button' onClick={processGeojson} disabled={nameField === ''}>Add File to KML</button>
            <DownloadButton className={kmlFileContents === '' ? 'hidden' : ''} fileName={kmlFileName} fileContents={kmlFileContents} label='Download KML' />
          </>
        ) : ''}
      </div>

      <div className='half-page'>
        KML State
        <KmlDisplay kmlObject={kml.getKmlObject()} />
      </div>
    </div>
  );
}

export default KmlGenerator;
