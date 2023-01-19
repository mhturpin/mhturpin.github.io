import Header from './Header';
import FileUpload from './FileUpload';

function KmlGenerator() {
  return (
    <div>
      <Header currentPage='kml_generator'/>
      <h2>KML Generator</h2>

      <FileUpload label='Upload geojson file: ' name='geojson-file' accept='.geojson'/>
    </div>
  );
}

export default KmlGenerator;
