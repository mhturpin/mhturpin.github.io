window.addEventListener('load', () => {
  document.getElementById('geojson-file').addEventListener('change', clearErrors);
  document.getElementById('geojson-file').addEventListener('change', toggleConvertButton);
  document.getElementById('convert-file').addEventListener('click', processGeojson);

  toggleConvertButton();
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
        ${createZoneColorStyles()}
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
      <styleUrl>#${feature['properties']['ZONE']}Color</styleUrl>
      ${contents}
    </Placemark>
  `;
}

function createPolygon(coordinates) {
  let innerBoundaries = '';

  if (coordinates.slice(1).length > 0) {
    innerBoundaries = `
      <innerBoundaryIs>
        ${coordinates.slice(1).map(ring => createLinearRing(ring)).join('</innerBoundaryIs><innerBoundaryIs>')}
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
        ${coordinates.map(pair => pair.join() + ',0').join('\n')}
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

function createZoneColorStyles() {
  let zoneColors = {
    '1aColor': '80dac9cd',
    '1bColor': '80c7b6bc',
    '2aColor': '80ac9da6',
    '2bColor': '80bdb2de',
    '3aColor': '80ae97d0',
    '3bColor': '809c84c1',
    '4aColor': '80a4729f',
    '4bColor': '809c6d66',
    '5aColor': '80b88a71',
    '5bColor': '80b59c5c',
    '6aColor': '80648b51',
    '6bColor': '806d9d7c',
    '7aColor': '807cb4aa',
    '7bColor': '8081c3ca',
    '8aColor': '808fcfe8',
    '8bColor': '806ec2e5',
    '9aColor': '8066add2',
    '9bColor': '807eb7ea',
    '10aColor': '80519ddf',
    '10bColor': '803f82d4',
    '11aColor': '803c6dcf',
    '11bColor': '80668dd7',
    '12aColor': '80536dc3',
    '12bColor': '804463ab',
    '13aColor': '804a74a7',
    '13bColor': '80678db9'
  }

  return Object.keys(zoneColors).map(id => createColorStyle(id, zoneColors[id])).join('');
}

function createColorStyle(id, color) {
  return `
    <Style id="${id}">
      <PolyStyle>
        <color>${color}</color>
      </PolyStyle>
    </Style>
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

function toggleConvertButton() {
  if (document.getElementById('geojson-file').files[0]) {
    document.getElementById('convert-file').disabled = false;
  } else {
    document.getElementById('convert-file').disabled = true;
  }

  document.getElementById('converted-file-download').disabled = true;
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

// USDA Zone Colors
// https://pdi.scinet.usda.gov/phzm/md/All_states_halfzones_poster_cmyk_300dpi.pdf
// rgb, hex (rrggbb), kml (aabbggrr)
// 1a: 205, 201, 218 = #cdc9da = 80dac9cd
// 1b: 188, 182, 199 = #bcb6c7 = 80c7b6bc
// 2a: 166, 157, 172 = #a69dac = 80ac9da6
// 2b: 222, 178, 189 = #deb2bd = 80bdb2de
// 3a: 208, 151, 174 = #d097ae = 80ae97d0
// 3b: 193, 132, 156 = #c1849c = 809c84c1
// 4a: 159, 114, 164 = #9f72a4 = 80a4729f
// 4b: 102, 109, 156 = #666d9c = 809c6d66
// 5a: 113, 138, 184 = #718ab8 = 80b88a71
// 5b: 92, 156, 181 = #5c9cb5 = 80b59c5c
// 6a: 81, 139, 100 = #518b64 = 80648b51
// 6b: 124, 157, 109 = #7c9d6d = 806d9d7c
// 7a: 170, 180, 124 = #aab47c = 807cb4aa
// 7b: 202, 195, 129 = #cac381 = 8081c3ca
// 8a: 232, 207, 143 = #e8cf8f = 808fcfe8
// 8b: 229, 194, 110 = #e5c26e = 806ec2e5
// 9a: 210, 173, 102 = #d2ad66 = 8066add2
// 9b: 234, 183, 126 = #eab77e = 807eb7ea
// 10a: 223, 157, 81 = #df9d51 = 80519ddf
// 10b: 212, 130, 63 = #d4823f = 803f82d4
// 11a: 207, 109, 60 = #cf6d3c = 803c6dcf
// 11b: 215, 141, 102 = #d78d66 = 80668dd7
// 12a: 195, 109, 83 = #c36d53 = 80536dc3
// 12b: 171, 99, 68 = #ab6344 = 804463ab
// 13a: 167, 116, 74 = #a7744a = 804a74a7
// 13b: 185, 141, 103 = #b98d67 = 80678db9

