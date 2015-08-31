var expect = require('expect.js'),
  gbgeojsonify = require('../'),
  FIXTURES = require('./fixtures');

// todo fix these
function isValidCoord(coord) {
  return coord && coord.length >= 2 &&
    typeof coord[0] === 'number' &&
      typeof coord[1] === 'number';
}

function closeEnough(actualCoords, expectedCoords, precision) {
  //console.log([actualCoords, expectedCoords, precision])
  return (actualCoords.length >= 2 &&
    Math.abs(actualCoords[0] - expectedCoords[0]) < precision &&
      Math.abs(actualCoords[1] - expectedCoords[1]) < precision
  );
}


function validateFeature(actualFeature, expectedFeature, precision) {
  if (isValidCoord(actualFeature.geometry.coordinates)) {
    expect(
      closeEnough(actualFeature.geometry.coordinates, expectedFeature.geometry.coordinates, precision)
    ).to.be(true);
    return;
  }

  for (var i = 0; i < actualFeature.geometry.coordinates.length; i++) {
    //console.log(actualFeature.geometry.coordinates[i])
    expect(
      closeEnough(actualFeature.geometry.coordinates[i], expectedFeature.geometry.coordinates[i], precision)
    ).to.be(true);
  }
}
// </rubbish code>

describe('toOSGB36', function () {
  describe('single features', function() {
    it('transforms Point', function() {
      var transformed = gbgeojsonify.toOSGB36(FIXTURES.point.WGS84);
      expect(
        closeEnough(transformed.coordinates, FIXTURES.point.OSGB36.coordinates, 0.02)
      ).to.be(true);
    });

    it('transforms Point with elevation value', function() {
      var transformed = gbgeojsonify.toOSGB36(FIXTURES.pointWithElevation.WGS84);
      expect(
        closeEnough(transformed.coordinates, FIXTURES.pointWithElevation.OSGB36.coordinates, 0.02)
      ).to.be(true);
    });

    it('transforms LineString', function() {
      var transformed = gbgeojsonify.toOSGB36(FIXTURES.lineString.WGS84);
      for (var i = 0; i < transformed.geometry.coordinates.length; i++) {
        expect(
          closeEnough(transformed.geometry.coordinates[i], FIXTURES.lineString.OSGB36.geometry.coordinates[i], 0.02)
        ).to.be(true);
      }
    });

    it('maintains properties', function() {
      var transformed = gbgeojsonify.toOSGB36(FIXTURES.point.WGS84);
      expect(transformed.properties).to.eql(FIXTURES.point.OSGB36.properties);
    });
  });

  describe('FeatureCollection', function() {
    it('transforms featureCollection', function() {
      var transformed = gbgeojsonify.toOSGB36(FIXTURES.featureCollection.WGS84);
      for (var i = 0; i < transformed.features.length; i++) {
        validateFeature(
          transformed.features[i], FIXTURES.featureCollection.OSGB36.features[i], 0.02
        );
      }
    });

    it('maintains properties', function() {
      var transformed = gbgeojsonify.toOSGB36(FIXTURES.featureCollection.WGS84);
      for (var i = 0; i < transformed.features.length; i++) {
        expect(transformed.features[i].properties).to.eql(FIXTURES.featureCollection.OSGB36.features[i].properties);
      }
    });

    it('transforms empty featureCollection', function() {
      var transformed = gbgeojsonify.toOSGB36(FIXTURES.emptyFeatureCollection);
      expect(transformed.features).to.be.empty();
    });
  });
});

describe('toWGS84', function () {
  describe('single features', function() {
    it('transforms point', function() {
      var transformed = gbgeojsonify.toWGS84(FIXTURES.point.OSGB36);
      expect(
        closeEnough(transformed.coordinates, FIXTURES.point.WGS84.coordinates, 1e-6)
      ).to.be(true);
    });

    it('transforms point with elevation value', function() {
      var transformed = gbgeojsonify.toWGS84(FIXTURES.pointWithElevation.OSGB36);
      expect(
        closeEnough(transformed.coordinates, FIXTURES.pointWithElevation.WGS84.coordinates, 1e-6)
      ).to.be(true);
    });

    it('transforms LineString', function() {
      var transformed = gbgeojsonify.toWGS84(FIXTURES.lineString.OSGB36);
      for (var i = 0; i < transformed.geometry.coordinates.length; i++) {
        expect(
          closeEnough(transformed.geometry.coordinates[i], FIXTURES.lineString.WGS84.geometry.coordinates[i], 1e-6)
        ).to.be(true);
      }
    });

    it('maintains properties', function() {
      var transformed = gbgeojsonify.toWGS84(FIXTURES.point.OSGB36);
      expect(transformed.properties).to.eql(FIXTURES.point.WGS84.properties);
    });
  });

  describe('FeatureCollection', function() {
    it('transforms featureCollection', function() {
      var transformed = gbgeojsonify.toWGS84(FIXTURES.featureCollection.OSGB36);
      expect(
        closeEnough(transformed.features[0].geometry.coordinates, FIXTURES.featureCollection.WGS84.features[0].geometry.coordinates, 1e-6)
      ).to.be(true);
    });

    it('maintains properties', function() {
      var transformed = gbgeojsonify.toWGS84(FIXTURES.featureCollection.OSGB36);
      for (var i = 0; i < transformed.features.length; i++) {
        expect(transformed.features[i].properties).to.eql(FIXTURES.featureCollection.WGS84.features[i].properties);
      }
    });

    it('transforms empty featureCollection', function() {
      var transformed = gbgeojsonify.toWGS84(FIXTURES.emptyFeatureCollection);
      expect(transformed.features).to.be.empty();
    });
  });
});

describe('crs property', function () {
  it('removes the crs property when present', function() {
    var transformed = gbgeojsonify.toOSGB36(FIXTURES.featureCollectionWithCrs);
    expect(transformed).to.not.have.key('crs');
  });

  it('does not add crs property', function() {
    var transformed = gbgeojsonify.toWGS84(FIXTURES.featureCollection.OSGB36);
    expect(transformed).to.not.have.key('crs');
  });
});
