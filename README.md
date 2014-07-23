## Installation

```bash
$ npm install geopipes-elasticsearch-backend
```

[![NPM](https://nodei.co/npm/geopipes-elasticsearch-backend.png?downloads=true&stars=true)](https://nodei.co/npm/geopipes-elasticsearch-backend)

Note: you will need `node` and `npm` installed first.

The easiest way to install `node.js` is with [nave.sh](https://github.com/isaacs/nave) by executing `[sudo] ./nave.sh usemain stable`

## Interface

```javascript
// Get a single record from elasticsearch
Backend.prototype.get = function( String key, Object opts, Function cb )

// Get a multiple records from elasticsearch
Backend.prototype.mget = function( Array ids, Object opts, Function cb )

// Index a new document in elasticsearch
Backend.prototype.put = function( String key, Object val, Object opts, Function cb )

// Perform an arbitrary search against elasticsearch
Backend.prototype.search = function( Object query, Object opts, Function cb )

// Create a bulk indexing stream which you can pipe index operations to
Backend.prototype.createPullStream = function()

// Find the nearest document to the supplied centroid
Backend.prototype.reverseGeo = function( Object centroid, Object opts, Function cb )

// Perform a fields only reverse geocode to retrieve the admin heirachy
Backend.prototype.findAdminHeirachy = function( Object centroid, Object opts, Function cb )
```

## Basic Usage

You will need a little knowledge of elasticsearch schemas to build more advanced indexers; however this example should be enough to get you started.

```javascript
var esclient = require('pelias-esclient')();
var Backend = require('geopipes-elasticsearch-backend');

var elasticsearch = new Backend( esclient, 'example1', 'type1' );

// Create a basic geo schema
var schema = {
  mappings: {
    type1: {
      properties: {
        name: { type : 'string' },
        center_point: { type: 'geo_point', lat_lon: true }
      }
    }
  }
}

// Create the schema
esclient.indices.create( { index: 'example1', body: schema }, function( err, res ){

  var opts = null;
  var centroid = {
    'lat': 50.1,
    'lon': 100.45
  };
  var doc = {
    'name': 'My POI',
    'center_point': centroid
  };

  elasticsearch.put( 'myid', doc, opts, function( err, res ){
    console.log( 'put', err, res );
    elasticsearch.reverseGeo( centroid, opts, function( err, res ){
      console.log( 'reverse geosearch', err, res );
    });
  });

});
```

You can view the indexed document here: [http://localhost:9200/example1/type1/myid](http://localhost:9200/example1/type1/myid)

## Streaming Indexing

Note: the streaming library flushes in batches so you may need to wait
a few seconds for the batch to be flushed.

```javascript
var esclient = require('pelias-esclient')();
var Backend = require('geopipes-elasticsearch-backend');

var elasticsearch = new Backend( esclient, 'example2', 'type1' );
var stream = elasticsearch.createPullStream();

stream.write({
  'id': 'myid',
  'name': 'My POI',
  'center_point': {
    'lat': 50.1,
    'lon': 100.45
  }
});
```

You can view the indexed document here: [http://localhost:9200/example2/type1/myid](http://localhost:9200/example2/type1/myid)

## NPM Module

The `geopipes-elasticsearch-backend` npm module can be found here:

[https://npmjs.org/package/geopipes-elasticsearch-backend](https://npmjs.org/package/geopipes-elasticsearch-backend)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` and `test/fixtures` directories.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every release against node version `0.10`

[![Build Status](https://travis-ci.org/geopipes/elasticsearch-backend.png?branch=master)](https://travis-ci.org/geopipes/elasticsearch-backend)