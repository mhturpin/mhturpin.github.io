import { useCallback, useState } from 'react';

import Checkbox from './Checkbox';
import DownloadButton from './DownloadButton';
import FileUpload from './FileUpload';
import Header from './Header';
import RadioGroup from './RadioGroup';
import Kml from '../helpers/Kml';
import UsdaZoneColors from '../UsdaZoneColors';

function KmlGenerator() {
  const [kmlFileName, setKmlFileName] = useState('');
  const [kmlFileContents, setKmlFileContents] = useState('');
  const [geojson, setGeojson] = useState({});
  const [propertyKeys, setPropertyKeys] = useState([]);
  const [nameField, setNameField] = useState('');

  // Pull data from the file when it's uploaded
  const updateFile = useCallback(() => {
    const file = document.getElementById('geojson-file').files[0];
    setKmlFileName(file.name.replace('.geojson', '.kml'));

    file.text().then((text) => {
      const inputJson = JSON.parse(text);
      setGeojson(inputJson);
      setPropertyKeys(Object.keys(inputJson.features[0].properties));
    });
  }, [setGeojson, setPropertyKeys]);

  const updateNameField = useCallback(() => {
    setNameField(document.querySelector('input[name="placemark-name"]:checked').value);
    // Clear out kml since it will have to be regenerated
    setKmlFileContents('');
  }, [setNameField, setKmlFileContents]);

  // Convert geojson file to kml
  function processGeojson() {
    const kml = new Kml();

    if (document.getElementById('include-zone-colors').checked) {
      Object.keys(UsdaZoneColors).forEach((id) => kml.addColorStyle(id, UsdaZoneColors[id]));
      // geojson.features.forEach((f) => f.properties.styleId = `${f.properties.ZONE}-color`);
    }

    kml.importFromGeoJson(geojson, nameField);
    setKmlFileContents(kml.toString());
  }

  return (
    <div>
      <Header currentPage='kml_generator' />
      <h2>KML Generator</h2>

      <FileUpload id='geojson-file' label='Upload geojson file: ' accept='.geojson' onChange={updateFile} />

      <span className={kmlFileName === '' ? 'hidden' : ''}>
        <Checkbox id='include-zone-colors' label='Include styles for USDA plant hardiness zone colors' />
        <RadioGroup id='select-name' label='Select which property to use as the placemark names' options={propertyKeys} onChange={updateNameField} />
        <button type='button' onClick={processGeojson} disabled={nameField === ''}>Convert File to KML</button>
        <DownloadButton className={kmlFileContents === '' ? 'hidden' : ''} fileName={kmlFileName} fileContents={kmlFileContents} />
      </span>
    </div>
  );
}

export default KmlGenerator;
