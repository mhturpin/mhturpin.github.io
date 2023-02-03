class Kml {
  #kmlDoc;

  constructor() {
    const kmlString = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document></Document></kml>';
    const parser = new DOMParser();
    this.#kmlDoc = parser.parseFromString(kmlString, 'text/xml');
  }

  importFromGeoJson(geoJson, nameField) {
    geoJson.features.map((f) => this.addPlacemark(f, nameField));
  }

  // https://datatracker.ietf.org/doc/html/rfc7946
  // Possible geometry types: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, and GeometryCollection.
  addPlacemark(feature, nameField) {
    const placemark = this.#kmlDoc.createElement('Placemark');
    const props = feature.properties;
    const coordinates = feature.geometry.coordinates;
    const type = feature.geometry.type;

    const name = this.#kmlDoc.createElement('name');
    name.appendChild(this.#kmlDoc.createCDATASection(props[nameField]));
    placemark.appendChild(name);

    const description = this.#kmlDoc.createElement('description');
    const descriptionText = `Properties:\n${Object.keys(props).map((k) => `* ${k}: ${props[k]}`).join('\n')}\n`;
    description.appendChild(this.#kmlDoc.createCDATASection(descriptionText));
    placemark.appendChild(description);

    if (props.styleId) {
      const styleUrl = this.#kmlDoc.createElement('styleUrl');
      styleUrl.textContent = `#${props.styleId}`;
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
      alert(`Unrecognized feature of type ${type}`);
    }

    this.#kmlDoc.getElementsByTagName('Document')[0].appendChild(placemark);
  }

  createPolygon(coordinates) {
    const polygon = this.#kmlDoc.createElement('Polygon');
    const outerBoundaryIs = this.#kmlDoc.createElement('outerBoundaryIs');

    outerBoundaryIs.appendChild(this.createLinearRing(coordinates[0]));
    polygon.appendChild(outerBoundaryIs);

    // Any rings after the first are inner boundaries
    if (coordinates.length > 1) {
      // Skip the first ring
      coordinates.slice(1).forEach((ring) => {
        const innerBoundaryIs = this.#kmlDoc.createElement('innerBoundaryIs');
        innerBoundaryIs.appendChild(this.createLinearRing(ring));
        polygon.appendChild(innerBoundaryIs);
      });
    }

    return polygon;
  }

  createLinearRing(coordinates) {
    const linearRing = this.#kmlDoc.createElement('LinearRing');
    const coords = this.#kmlDoc.createElement('coordinates');

    coords.textContent = coordinates.map((pair) => pair.join()).join('\n');
    linearRing.appendChild(coords);

    return linearRing;
  }

  createMultiGeometry(coordinates) {
    const multiGeometry = this.#kmlDoc.createElement('MultiGeometry');

    coordinates.forEach((polygon) => multiGeometry.appendChild(this.createPolygon(polygon)));

    return multiGeometry;
  }

  createPoint(coordinates) {
    const point = this.#kmlDoc.createElement('Point');
    const coords = this.#kmlDoc.createElement('coordinates');

    coords.textContent = coordinates.join();
    point.appendChild(coords);

    return point;
  }

  addColorStyle(id, color) {
    const style = this.#kmlDoc.createElement('Style');
    style.id = id;

    const polyStyle = this.#kmlDoc.createElement('PolyStyle');
    const col = this.#kmlDoc.createElement('color');
    col.textContent = color;

    polyStyle.appendChild(col);
    style.appendChild(polyStyle);
    this.#kmlDoc.getElementsByTagName('Document')[0].appendChild(style);
  }

  toString() {
    return new XMLSerializer().serializeToString(this.#kmlDoc);
  }

  toHtml() {
    const div = document.createElement('div');

    [...this.#kmlDoc.getElementsByTagName('Placemark')].forEach((placemark) => {
      div.appendChild(this.placemarkToHtml(placemark));
    });

    return div;
  }

  placemarkToHtml(placemark) {
    const div = document.createElement('div');

    const h3 = document.createElement('h3');
    h3.textContent = placemark.lastChild.nodeName;
    div.appendChild(h3);

    const name = document.createElement('input');
    name.value = placemark.getElementsByTagName('name')[0].textContent;
    div.appendChild(name);

    div.appendChild(document.createElement('br'));

    const description = document.createElement('textarea');
    description.rows = 10;
    description.cols = 80;
    description.value = placemark.getElementsByTagName('description')[0].textContent;
    div.appendChild(description);

    return div;
  }
}

export default Kml;
