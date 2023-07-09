class Kml {
  #kmlObject;

  constructor() {
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

  // Add data from geoJson to this.#kmlObject
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

  removeHtml(string) {
    const div = document.createElement('div');
    div.innerHTML = string;
    return div.textContent;
  }

  // Create a placemark from the feature
  // https://developers.google.com/kml/documentation/kmlreference#placemark
  // https://datatracker.ietf.org/doc/html/rfc7946
  // Possible geometry types: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, and GeometryCollection
  createPlacemark(feature, nameField) {
    const properties = feature.properties;
    const coordinates = feature.geometry.coordinates;
    const type = feature.geometry.type;

    Object.keys(properties).forEach((key) => { properties[key] = this.removeHtml(properties[key]); });

    const placemark = {
      Placemark: {
        name: properties[nameField],
        description: '',
        ExtendedData: this.createExtendedData(properties)
      }
    };

    if (type === 'Point') {
      placemark.Placemark.Point = {
        coordinates: {
          latitude: coordinates[1],
          longitude: coordinates[0]
        }
      };
    } else if (type === 'Polygon') {
      // Polygon
      // * outerBoundaryIs
      //   * LinearRing
      // * innerBoundaryIs
      //   * LinearRing
    } else if (type === 'MultiPolygon') {
      // MultiGeometry
      // * for each, create polygon
    } else {
      console.log(`Unrecognized feature of type ${type}`);
      alert(`Unrecognized feature of type ${type}`);
    }

    return placemark;
  }

  // https://developers.google.com/kml/documentation/kmlreference#extendeddata
  createExtendedData(properties) {
    const extendedData = [];

    Object.keys(properties).map((k) => extendedData.push(this.createData(k, properties[k])));

    return extendedData;
  }

  // https://developers.google.com/kml/documentation/kmlreference#elements-specific-to-extendeddata
  createData(name, value) {
    return {
      Data: {
        attributes: { name: name },
        value: value
      }
    };
  }

  // Convert this.#kmlObject to a string that can be used in a .kml file
  convertToKmlString() {
    const kmlDoc = new DOMParser().parseFromString('<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"></kml>', 'text/xml');

    this.addElementToDocument(kmlDoc, kmlDoc.getElementsByTagName('kml')[0], 'Document', this.#kmlObject.kml.Document);

    return new XMLSerializer().serializeToString(kmlDoc);
  }

  // Create a kml element from the data and add it to the parent element
  addElementToDocument(kmlDoc, parent, name, value) {
    if (name === 'Features') {
      value.forEach((feature) => {
        const featureType = Object.keys(feature)[0];
        this.addElementToDocument(kmlDoc, parent, featureType, feature[featureType]);
      });
    } else {
      const element = kmlDoc.createElement(name);

      if (name === 'ExtendedData') {
        value.forEach((feature) => {
          const featureType = Object.keys(feature)[0];
          this.addElementToDocument(kmlDoc, element, featureType, feature[featureType]);
        });
      } else if (name === 'coordinates') {
        element.textContent = `${value.longitude},${value.latitude}\n`;
      } else if (typeof value === 'string') {
        element.textContent = value;
      } else {
        Object.keys(value).forEach((k) => {
          if (k === 'attributes') {
            this.setAttributes(element, value[k]);
          } else {
            this.addElementToDocument(kmlDoc, element, k, value[k]);
          }
        });
      }

      parent.appendChild(element);
    }
  }

  // Set attributes on the element
  setAttributes(element, attributes) {
    Object.keys(attributes).forEach((attr) => {
      element.setAttribute(attr, attributes[attr]);
    });
  }
}

export default Kml;
