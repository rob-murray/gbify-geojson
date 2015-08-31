
// dummy data; coordinate transformations calculated externally
var point = {
  OSGB36: {
    "type": "Point",
    "properties": {
      "hello": "world"
    },
    "coordinates": [
      437324.22, 115385.91
    ]
  },
  WGS84: {
    "type": "Point",
    "properties": {
      "hello": "world"
    },
    "coordinates": [
      -1.47019386, 50.9367169
    ]
  }
};

var pointWithElevation = {
  OSGB36: {
    "type": "Point",
    "properties": {
      "hello": "world"
    },
    "coordinates": [
      437324.22, 115385.91, 150
    ]
  },
  WGS84: {
    "type": "Point",
    "properties": {
      "hello": "world"
    },
    "coordinates": [
      -1.47019386, 50.9367169, 150
    ]
  }
};

var lineString = {
  OSGB36: {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          371671.97, 134264.41
        ],
        [
          498865.59, 294152.72
        ]
      ]
    }
  },
  WGS84: {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          -2.406005859375, 51.106971055030755
        ],
        [
          -0.5438232421874999, 52.53627304145946
        ]
      ]
    }
  }
};

var featureCollection = {
  OSGB36: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "hello": "world"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            437324.22, 115385.91
          ]
        }
      },
      lineString.OSGB36
    ]
  },
  WGS84: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "hello": "world"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -1.47019386, 50.9367169
          ]
        }
      },
      lineString.WGS84
    ]
  }
};

var featureCollectionWithCrs = {
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "hello": "world"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -1.47019386, 50.9367169
        ]
      }
    }
  ]
}

module.exports = {
  point: point,
  pointWithElevation: pointWithElevation,
  lineString: lineString,
  featureCollection: featureCollection,
  featureCollectionWithCrs: featureCollectionWithCrs,
  emptyFeatureCollection: {
    "type": "FeatureCollection",
    "features": []
  }
}
