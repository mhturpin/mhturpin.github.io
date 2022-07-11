window.addEventListener('load', () => {
  document.getElementById('geojson-file').addEventListener('change', clearErrors);
  document.getElementById('geojson-file').addEventListener('change', toggleConvertButton);
  document.getElementById('geojson-file').addEventListener('change', showNameSelection);
  document.getElementById('convert-file').addEventListener('click', processGeojson);

  toggleConvertButton();
  showNameSelection();
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
  let styles = '';

  if (document.getElementById('include-zone-colors').checked) {
    styles = createZoneColorStyles();
  }

  let kmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        ${styles}
        ${contents}
      </Document>
    </kml>
  `;

  let parser = new DOMParser();
  return parser.parseFromString(kmlString, 'text/xml');
}

// https://datatracker.ietf.org/doc/html/rfc7946
// Possible types: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, GeometryCollection, Feature, FeatureCollection
function createPlacemark(feature) {
  let props = feature['properties'];
  let contents = '';
  let name = document.querySelector('input[name="placemark-name"]:checked').value;

  if (feature['geometry']['type'] === 'Polygon') {
    contents = createPolygon(feature['geometry']['coordinates'], props['ZONE']);
  } else if (feature['geometry']['type'] === 'MultiPolygon') {
    contents = createMultiGeometry(feature['geometry']['coordinates']);
  } else if (feature['geometry']['type'] === 'Point') {
    contents = createPoint(feature['geometry']['coordinates']);
  } else {
    let p = window.document.createElement('p');
    p.textContent = `Unrecognized feature of type ${feature['geometry']['type']}`;
    document.getElementById('errors').appendChild(p);
  }

  let style = '';

  if (document.getElementById('include-zone-colors').checked) {
    style = `<styleUrl>#${props['ZONE']}Color</styleUrl>`;
  }

  return `
    <Placemark>
      ${style}
      <name><![CDATA[${props[name]}]]></name>
      <description>
        <![CDATA[
          <h1>Properties:</h1>
          <ul>
            ${Object.keys(props).map(k => `<li>${k}: ${props[k]}</li>`)}
          </ul>
        ]]>
      </description>
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

function createPoint(coordinates) {
  return `
    <Point>
      <coordinates>
        ${coordinates.join(',')},0
      </coordinates>
    </Point>
  `;
}

// USDA Zone Colors
// https://pdi.scinet.usda.gov/phzm/md/All_states_halfzones_poster_rgb_300dpi.pdf
function createZoneColorStyles() {
  let zoneColors = {
    '1aColor': '80ffd6d7',
    '1bColor': '80f2c4c4',
    '2aColor': '80d9abab',
    '2bColor': '80ebb0eb',
    '3aColor': '80eb91e0',
    '3bColor': '80db7dcf',
    '4aColor': '80ff6ba8',
    '4bColor': '80ed755b',
    '5aColor': '80ffa173',
    '5bColor': '80e0c95d',
    '6aColor': '8046ba48',
    '6bColor': '8056c777',
    '7aColor': '8069d6ad',
    '7bColor': '8070dbcf',
    '8aColor': '8085daed',
    '8bColor': '8057cbeb',
    '9aColor': '804fb6dc',
    '9bColor': '8078b6f4',
    '10aColor': '80369bec',
    '10bColor': '801f78e6',
    '11aColor': '801e56e6',
    '11bColor': '806485e8',
    '12aColor': '804e62d4',
    '12bColor': '802850b4',
    '13aColor': '802e6fab',
    '13bColor': '805d91c4'
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

function showNameSelection() {
  let file = document.getElementById('geojson-file').files[0];

  if (file) {
    file.text().then(function(t) {
      let inputJson = JSON.parse(t);
      let keys = Object.keys(inputJson['features'][0]['properties']);

      keys.forEach(function(k) {
        createRadioButton(k);
      })
    });

    document.getElementById('select-name').classList.remove('hidden');
  }
}

function createRadioButton(value) {
  let parent = document.getElementById('select-name');
  let input = document.createElement('input');
  input.type = 'radio';
  input.id = `property-${value}`;
  input.value = value;
  input.name = 'placemark-name';
  parent.appendChild(input);

  let label = document.createElement('label');
  label.for = `property-${value}`;
  label.textContent = value;
  parent.appendChild(label);

  parent.appendChild(document.createElement('br'));
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
