class Kml {

  #kmlDoc;

  constructor() {
    let kmlString = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document></Document></kml>';
    let parser = new DOMParser();
    this.#kmlDoc = parser.parseFromString(kmlString, 'text/xml');
  }

  importFromGeoJson(geoJson, nameField) {
    geoJson['features'].map(f => this.addPlacemark(f, nameField));
  }

  // https://datatracker.ietf.org/doc/html/rfc7946
  // Possible geometry types: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, and GeometryCollection.
  addPlacemark(feature, nameField) {
    let placemark = this.#kmlDoc.createElement('Placemark');
    let props = feature['properties'];
    let coordinates = feature['geometry']['coordinates'];
    let type = feature['geometry']['type'];

    let name = this.#kmlDoc.createElement('name');
    name.appendChild(this.#kmlDoc.createCDATASection(props[nameField]));
    placemark.appendChild(name);

    let desc = this.#kmlDoc.createElement('description');
    let description = `<h1>Properties:</h1>\n<ul>\n${Object.keys(props).map(k => `<li>${k}: ${props[k]}</li>`).join('\n')}\n</ul>`;
    desc.appendChild(this.#kmlDoc.createCDATASection(description))
    placemark.appendChild(desc);

    if (props['styleId']) {
      let styleUrl = this.#kmlDoc.createElement('styleUrl');
      styleUrl.textContent = '#' + props['styleId'];
      placemark.appendChild(styleUrl);
    }

    if (type === 'Polygon') {
      placemark.appendChild(this.createPolygon(coordinates));
    } else if (type === 'MultiPolygon') {
      placemark.appendChild(this.createMultiGeometry(coordinates));
    } else if (type === 'Point') {
      placemark.appendChild(this.createPoint(coordinates));
    } else {
      console.log(`Unrecognized feature of type ${type}`);
    }

    this.#kmlDoc.getElementsByTagName('Document')[0].appendChild(placemark);
  }

  createPolygon(coordinates) {
    let polygon = this.#kmlDoc.createElement('Polygon');
    let outerBoundaryIs = this.#kmlDoc.createElement('outerBoundaryIs');

    outerBoundaryIs.appendChild(this.createLinearRing(coordinates[0]));
    polygon.appendChild(outerBoundaryIs);

    // Any rings after the first are inner boundaries
    if (coordinates.slice(1).length > 0) {
      // Skip the first ring
      coordinates.slice(1).forEach(ring => {
        let innerBoundaryIs = this.#kmlDoc.createElement('innerBoundaryIs');
        innerBoundaryIs.appendChild(this.createLinearRing(ring));
        polygon.appendChild(innerBoundaryIs);
      });
    }

    return polygon;
  }

  createLinearRing(coordinates) {
    let linearRing = this.#kmlDoc.createElement('LinearRing');
    let coords = this.#kmlDoc.createElement('coordinates');

    coords.textContent = coordinates.map(pair => pair.join()).join('\n');
    linearRing.appendChild(coords);

    return linearRing;
  }

  createMultiGeometry(coordinates) {
    let multiGeometry = this.#kmlDoc.createElement('MultiGeometry');

    coordinates.forEach(polygon => multiGeometry.appendChild(this.createPolygon(polygon)));

    return multiGeometry;
  }

  createPoint(coordinates) {
    let point = this.#kmlDoc.createElement('Point');
    let coords = this.#kmlDoc.createElement('coordinates');

    coords.textContent = coordinates.join();
    point.appendChild(coords);

    return point;
  }

  addColorStyle(id, color) {
    let style = this.#kmlDoc.createElement('Style');
    style.id = id;

    let polyStyle = this.#kmlDoc.createElement('PolyStyle');
    let col = this.#kmlDoc.createElement('color');
    col.textContent = color;

    polyStyle.appendChild(col);
    style.appendChild(polyStyle);
    this.#kmlDoc.getElementsByTagName('Document')[0].appendChild(style);
  }

  toString() {
    return new XMLSerializer().serializeToString(this.#kmlDoc);
  }

  toHtml() {
    let div = document.createElement('div');

    [...this.#kmlDoc.getElementsByTagName('Placemark')].forEach(e => {
      div.appendChild(this.placemarkToHtml(e));
    });

    return div;
  }

  placemarkToHtml(placemark) {
    let div = document.createElement('div');

    let h3 = document.createElement('h3');
    h3.textContent = placemark.lastChild.nodeName;
    div.appendChild(h3);

    let name = document.createElement('input');
    name.value = placemark.getElementsByTagName('name')[0].textContent;
    div.appendChild(name);

    div.appendChild(document.createElement('br'));

    let description = document.createElement('textarea');
    description.rows = 10;
    description.cols = 80;
    description.value = placemark.getElementsByTagName('description')[0].textContent;
    div.appendChild(description);

    return div;
  }
}
