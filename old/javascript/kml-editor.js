window.addEventListener('load', () => {
  document.getElementById('geojson-file').addEventListener('change', toggleConvertButton);
  document.getElementById('geojson-file').addEventListener('change', showNameSelection);
  document.getElementById('convert-file').addEventListener('click', processGeojson);

  toggleConvertButton();
  showNameSelection();
});

function processGeojson() {
  let file = document.getElementById('geojson-file').files[0];
  let fileName = file.name;
  let kml = new Kml();

  file.text().then(function(t) {
    let inputJson = JSON.parse(t);
    let nameField = document.querySelector('input[name="placemark-name"]:checked').value;
    let zoneColors = getZoneColors();

    if (document.getElementById('include-zone-colors').checked) {
      Object.keys(zoneColors).forEach(id => kml.addColorStyle(id, zoneColors[id]));
      inputJson['features'].forEach((f, i) => f['properties']['styleId'] = `${f['properties']['ZONE']}-color`);
    }

    kml.importFromGeoJson(inputJson, nameField);

    showDowloadButton(fileName.replace('.geojson', '.kml'), kml.toString());
  });
}

// USDA Zone Colors
// https://pdi.scinet.usda.gov/phzm/md/All_states_halfzones_poster_rgb_300dpi.pdf
function getZoneColors() {
  return {
    '1a-color': '80ffd6d7',
    '1b-color': '80f2c4c4',
    '2a-color': '80d9abab',
    '2b-color': '80ebb0eb',
    '3a-color': '80eb91e0',
    '3b-color': '80db7dcf',
    '4a-color': '80ff6ba8',
    '4b-color': '80ed755b',
    '5a-color': '80ffa173',
    '5b-color': '80e0c95d',
    '6a-color': '8046ba48',
    '6b-color': '8056c777',
    '7a-color': '8069d6ad',
    '7b-color': '8070dbcf',
    '8a-color': '8085daed',
    '8b-color': '8057cbeb',
    '9a-color': '804fb6dc',
    '9b-color': '8078b6f4',
    '10a-color': '80369bec',
    '10b-color': '801f78e6',
    '11a-color': '801e56e6',
    '11b-color': '806485e8',
    '12a-color': '804e62d4',
    '12b-color': '802850b4',
    '13a-color': '802e6fab',
    '13b-color': '805d91c4'
  }
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
