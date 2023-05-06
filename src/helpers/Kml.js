class Kml {
  #kmlObject;

  constructor() {
    // const kmlString = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document></Document></kml>';

    this.#kmlObject = {
      kml: {
        Document: {
          name: '',
          description: '',
          Features: []
        }
      }
    };
  }

  getKmlObject() {
    return this.#kmlObject;
  }

  importFromGeoJson(geoJson, documentName, nameField) {
    const folder = {
      Folder: {
        name: documentName,
        description: '',
        Features: geoJson.features.map((f) => this.createPlacemark(f, nameField))
      }
    };

    this.#kmlObject.kml.Document.Features.push(folder);
  }

  // https://datatracker.ietf.org/doc/html/rfc7946
  // Possible geometry types: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, and GeometryCollection.
  createPlacemark(feature, nameField) {
    const properties = feature.properties;
    // const coordinates = feature.geometry.coordinates;
    // const type = feature.geometry.type;
    const placemark = {
      Placemark: {
        name: properties[nameField],
        description: '',
        ExtendedData: this.createExtendedData(properties)
      }
    };

    // if (props.styleId) {
    //   const styleUrl = this.#kmlDoc.createElement('styleUrl');
    //   styleUrl.textContent = `#${props.styleId}`;
    //   placemark.appendChild(styleUrl);
    // }

    // if (type === 'Polygon') {
    //   placemark.appendChild(this.createPolygon(coordinates));
    // } else if (type === 'MultiPolygon') {
    //   placemark.appendChild(this.createMultiGeometry(coordinates));
    // } else if (type === 'Point') {
    //   placemark.appendChild(this.createPoint(coordinates));
    // } else {
    //   console.log(`Unrecognized feature of type ${type}`);
    //   alert(`Unrecognized feature of type ${type}`);
    // }

    return placemark;
  }

  createExtendedData(properties) {
    const extendedData = [];

    Object.keys(properties).map((k) => extendedData.push(this.createData(k, properties[k])));

    return extendedData;
  }

  createData(name, value) {
    return {
      Data: {
        attributes: { name: name },
        value: value
      }
    };
  }

  // createPolygon(coordinates) {
  //   const polygon = this.#kmlDoc.createElement('Polygon');
  //   const outerBoundaryIs = this.#kmlDoc.createElement('outerBoundaryIs');

  //   outerBoundaryIs.appendChild(this.createLinearRing(coordinates[0]));
  //   polygon.appendChild(outerBoundaryIs);

  //   // Any rings after the first are inner boundaries
  //   if (coordinates.length > 1) {
  //     // Skip the first ring
  //     coordinates.slice(1).forEach((ring) => {
  //       const innerBoundaryIs = this.#kmlDoc.createElement('innerBoundaryIs');
  //       innerBoundaryIs.appendChild(this.createLinearRing(ring));
  //       polygon.appendChild(innerBoundaryIs);
  //     });
  //   }

  //   return polygon;
  // }

  // createLinearRing(coordinates) {
  //   const linearRing = this.#kmlDoc.createElement('LinearRing');
  //   const coords = this.#kmlDoc.createElement('coordinates');

  //   coords.textContent = coordinates.map((pair) => pair.join()).join('\n');
  //   linearRing.appendChild(coords);

  //   return linearRing;
  // }

  // createMultiGeometry(coordinates) {
  //   const multiGeometry = this.#kmlDoc.createElement('MultiGeometry');

  //   coordinates.forEach((polygon) => multiGeometry.appendChild(this.createPolygon(polygon)));

  //   return multiGeometry;
  // }

  // createPoint(coordinates) {
  //   const point = this.#kmlDoc.createElement('Point');
  //   const coords = this.#kmlDoc.createElement('coordinates');

  //   coords.textContent = coordinates.join();
  //   point.appendChild(coords);

  //   return point;
  // }

  // addColorStyle(id, color) {
  //   const style = this.#kmlDoc.createElement('Style');
  //   style.id = id;

  //   const polyStyle = this.#kmlDoc.createElement('PolyStyle');
  //   const col = this.#kmlDoc.createElement('color');
  //   col.textContent = color;

  //   polyStyle.appendChild(col);
  //   style.appendChild(polyStyle);
  //   this.#kmlDoc.getElementsByTagName('Document')[0].appendChild(style);
  // }

  // toString() {
  //   return new XMLSerializer().serializeToString(this.#kmlDoc);
  // }

  // toObject() {
  //   // Document
  //   //   name
  //   //   description
  //   //   Folder
  //   //     name
  //   //     Placemark
  //   //       name
  //   //       ExtendedData
  //   //         Data(attr: name)
  //   //           value

  //   const kmlObject = {};
  //   // kmlObject.name = this.#kmlDoc.querySelector('Document > name').textContent;
  //   // kmlObject.description = this.#kmlDoc.querySelector('Document > description').textContent;
  //   kmlObject.folders = [...this.#kmlDoc.querySelectorAll('Document > Folder')].map(this.folderToObject);

  //   console.log(kmlObject);

  //   return kmlObject;
  // }

  // folderToObject(folder) {
  //   const folderObject = {};
  //   folderObject.name = folder.childNodes[0].textContent;

  //   return folderObject;
  // }
}

export default Kml;
