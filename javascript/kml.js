window.addEventListener('load', () => {
  document.getElementById('geojson-file').addEventListener('change', clearErrors);
  document.getElementById('geojson-file').addEventListener('change', showConvertButton);
  document.getElementById('convert-file').addEventListener('click', processGeojson);
});

function processGeojson() {
  let file = document.getElementById('geojson-file').files[0];
  let fileName = file.name;

  file.text().then(function(t) {
    let inputJson = JSON.parse(t);
    let contents = inputJson['features'].map(f => createPlacemark(f)).join(''); // Convert all the features
    let kmlDoc = createKmlDoc(contents);
    let kmlDocString = new XMLSerializer().serializeToString(kmlDoc);

    showDowloadButton(fileName.replace('.geojson', '.kml'), kmlDocString);
  });
}

function createKmlDoc(contents) {
  let parser = new DOMParser();
  let kmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        ${contents}
      </Document>
    </kml>
  `;

  return parser.parseFromString(kmlString, 'text/xml');
}

// https://datatracker.ietf.org/doc/html/rfc7946
// Possible types: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, GeometryCollection, Feature, FeatureCollection
function createPlacemark(feature) {
  let contents = '';

  if (feature['geometry']['type'] === 'Polygon') {
    contents = createPolygon(feature['geometry']['coordinates'], feature['properties']['ZONE']);
  } else if (feature['geometry']['type'] === 'MultiPolygon') {
    contents = createMultiGeometry(feature['geometry']['coordinates']);
  } else {
    let p = window.document.createElement('p');
    p.textContent = `Unrecognized feature of type ${feature['geometry']['type']}`;
    document.getElementById('errors').appendChild(p);
  }

  return `
    <Placemark>
      <name>${feature['properties']['ZONE']}</name>
      ${contents}
    </Placemark>
  `;
}

function createPolygon(coordinates) {
  let innerBoundaries = '';

  if (coordinates.slice(1).length > 0) {
    innerBoundaries = `
      <innerBoundaryIs>
        ${coordinates.slice(1).map(ring => createLinearRing(ring))}
      </innerBoundaryIs>
    `;
  }

  return `
    <Polygon>
      <outerBoundaryIs>
        ${createLinearRing(coordinates[0])}
      </outerBoundaryIs>
      ${innerBoundaries}
    </Polygon>
  `;
}

function createLinearRing(coordinates) {
  return `
    <LinearRing>
      <coordinates>
        ${coordinates.map(pair => pair.join()).join('\n')}
      </coordinates>
    </LinearRing>
  `;
}

function createMultiGeometry(coordinates) {
  return `
    <MultiGeometry>
      ${coordinates.map(polygon => createPolygon(polygon)).join('')}
    </MultiGeometry>
  `;
}

function downloadFile(name, contents) {
  let blob = new Blob([contents], {type: 'text/plain'});
  let a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function clearErrors() {
  document.getElementById('errors').innerHTML = '';
}

function showConvertButton() {
  document.getElementById('converted-file-download').disabled = true;
  document.getElementById('convert-file').disabled = false;
}

function showDowloadButton(name, contents) {
  let button = document.getElementById('converted-file-download');
  button.onclick = () => downloadFile(name, contents);
  button.disabled = false;
}


    // let placemark = kmlDoc.createElement('Placemark');
    // let polygon = kmlDoc.createElement('Polygon');
    // let outerBoundaryIs = kmlDoc.createElement('outerBoundaryIs');
    // let linearRing = kmlDoc.createElement('LinearRing');
    // let coordinates = kmlDoc.createElement('coordinates');

    // coordinates.textContent = feature['geometry']['coordinates'][0].map(pair => pair.join()).join('\n');

    // linearRing.appendChild(coordinates);
    // outerBoundaryIs.appendChild(linearRing);
    // polygon.appendChild(outerBoundaryIs);
    // placemark.appendChild(polygon);
