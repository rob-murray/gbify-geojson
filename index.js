(function (root, factory) {
  // UMD for Node, AMD or browser globals.
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['proj4'], factory);
  } else if (typeof exports === 'object') {
    // Node and CommonJS-like environments
    module.exports = factory(require('proj4'));
  } else {
    // Browser globals
    if (typeof window.proj4 === 'undefined') {
      throw 'proj4js library is missing';
    }
    root.returnExports = factory(root.proj4);
  }
}(this, function (proj4) {
  var osgb36 = proj4('+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy' +
                '+towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs no_defs');

  function clone(obj) {
    if(obj === null || typeof(obj) !== 'object') {
      return obj;
    }
    var temp = obj.constructor();
    for(var key in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, key)) {
          temp[key] = clone(obj[key]);
      }
    }
    return temp;
  }

  /*
   * Check coords in form of [x, y] or [x, y, z]
   */
  function isValidCoord(coord) {
    return coord && coord.length >= 2 &&
      typeof coord[0] === 'number' &&
        typeof coord[1] === 'number';
  }

  function traverseCoords(coordinates, callback) {
    if (isValidCoord(coordinates)) {
      return callback(coordinates);
    }

    return coordinates.map(function(coord) {
      return traverseCoords(coord, callback);
    });
  }

  function traverseGeoJson(geoJson, processLeafNode) {
    var reprojected = clone(geoJson);

    // Whilst the crs prop is in the GeoJson spec its a bit of a hassle to work out
    // what format the ref sys is in so play safe and just remove it if present.
    if (reprojected.crs) {
      delete reprojected.crs;
    }

    if (geoJson.type === 'Feature') {
      //console.log([JSON.stringify(geoJson), 'is a Feature']);
      reprojected.geometry = traverseGeoJson(geoJson.geometry, processLeafNode);
    } else if (geoJson.type === 'FeatureCollection') {
      //console.log([JSON.stringify(geoJson), 'is a FeatureCollection']);
      reprojected.features = reprojected.features.map(function(feature) {
        return traverseGeoJson(feature, processLeafNode);
      });
    } else {
      if (processLeafNode) {
        processLeafNode(reprojected);
      }
    }

    return reprojected;
  }

  function traverseAndReproject(geoJson, from, to, precision) {
    var reproject = proj4(from, to);

    return traverseGeoJson(geoJson, function(leafNode) {
      //console.log(['leafNode callback on', JSON.stringify(leafNode)])
      leafNode.coordinates = traverseCoords(leafNode.coordinates, function(coords) {
        return reproject.forward(coords).map(function(p) {
          return 1 * p.toFixed(precision);
        });
      });
    });
  }

  return {
    toOSGB36: function(geoJson) {
      return traverseAndReproject(geoJson, proj4.WGS84, osgb36, 2);
    },
    toWGS84: function(geoJson) {
      return traverseAndReproject(geoJson, osgb36, proj4.WGS84, 6);
    }
  };
}));
