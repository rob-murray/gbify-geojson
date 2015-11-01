# gbify-geojson

[![Build Status](https://travis-ci.org/rob-murray/gbify-geojson.svg)](https://travis-ci.org/rob-murray/gbify-geojson)
[![npm version](https://badge.fury.io/js/gbify-geojson.svg)](http://badge.fury.io/js/gbify-geojson)

Reproject GeoJSON between OSGB36 GB National Grid and WGS84 CRSs.


## Description

The default reference system used by GeoJSON to describe the geospatial data contained is usually `ESPG:4326`, cartesian coordinates are referenced using the WGS84 datum.

With this library we can reproject to or from the coordinate reference system WGS84 and the projected local coordinate system OSGB36, [EPSG:27700](http://spatialreference.org/ref/epsg/osgb-1936-british-national-grid/), British National Grid. The library will reproject all coordinate data in a GeoJSON object to / from these reference systems.

This library uses `proj4js` to do the tranformation.

An example GeoJSON reprojected;

```json
// WGS84
{
  "type": "Feature",
  "properties": {
    "popupContent": "Golden Square, Soho, London."
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -0.1371467113494873,
      51.511566985991124
    ]
  }
}

// OSGB36
{
  "type": "Feature",
  "properties": {
    "popupContent": "Golden Square, Soho, London."
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      529368.34,
      180826.93
    ]
  }
}
```

### Caveats

In using this project, please note the following points - these may be fixed in future versions.

* We ignore the `CRS` property specified by [GeoJSON spec](http://geojson.org/geojson-spec.html#coordinate-reference-system-objects). This has no impact on tranformation and is removed if present.
* A bounding box member is reprojected, this probably is not correct.


### Web example

This library is used by [gb-geojson](https://github.com/rob-murray/gb-geojson) project that allows you to view, create, edit, transform GeoJSON map data in British National Grid reference system and WGS84. The app reprojects between each CRS when updated, you can try it out [http://rob-murray.github.io/gb-geojson/](http://rob-murray.github.io/gb-geojson/).


## Getting started

You can get hold of the code with npm and it should work fine with [browserify](http://browserify.org/). Or you can just manually import the source.

#### Dependency management

With npm:

```
$ npm install gbify-geojson
```

## Interface

Given the library is loaded

```
> gbify = require('gbify-geojson')
```

#### toOSGB36(geoJson)

Reproject the `geoJson` object to [EPSG:27700](http://spatialreference.org/ref/epsg/27700/).

```node
> var point = {"type":"Feature","properties":{"popupContent":"Golden Square, Soho, London."},"geometry":{"type":"Point","coordinates":[-0.1371467113494873, 51.511566985991124]}}
> gbify.toOSGB36(point)
{ type: 'Feature',
  properties: { popupContent: 'Golden Square, Soho, London.' },
  geometry:
   { type: 'Point',
     coordinates: [ 529368.34, 180826.93 ] } }
```

#### toWGS84(geoJson)

Reproject the `geoJson` object to [EPSG:4326](http://spatialreference.org/ref/epsg/4326/).

```node
> var poly = {"type":"Feature","properties":{"popupContent":"I am SU43."},"geometry":{"type":"Polygon","coordinates":[[[440000,130000],[450000,130000],[450000,140000],[440000,140000],[440000,130000]]]}}
> gbify.toWGS84(poly) // JSON.stringify(gbify.toWGS84(poly))
'{"type":"Feature","properties":{"popupContent":"I am SU43."},"geometry":{"type":"Polygon","coordinates":[[[-1.43051,51.067945],[-1.287804,51.067163],[-1.286421,51.157077],[-1.429404,51.157861],[-1.43051,51.067945]]]}}'
```


## Development

#### Run tests

Run the tests with `mocha` and `expect.js`.

```bash
$ npm test
```


## Alternatives

The excellent [reproject](https://github.com/perliedman/reproject) library was a basis for building this specific OS GB flavour.

GDAL can do this also with something like this to reproject OSGB36 > WGS84.

```bash
$ ogr2ogr -s_srs EPSG:27700 -f "GeoJSON" output.json input.json -t_srs EPSG:4326
```


## Contributions

Please use the GitHub pull-request mechanism to submit contributions.


## License

This project is available for use under the MIT software license.
See LICENSE
