# geopipes elasticsearch backend

An Elasticsearch Backend with support for Streaming Bulk Indexing

# Installation

```bash
$ npm install -g geopipes-elasticsearch-backend
$ ciao --help
```

[![NPM](https://nodei.co/npm/geopipes-elasticsearch-backend.png?downloads=true&stars=true)](https://nodei.co/npm/geopipes-elasticsearch-backend)

Note: you will need `node` and `npm` installed first.

The easiest way to install `node.js` is with [nave.sh](https://github.com/isaacs/nave) by executing `[sudo] ./nave.sh usemain stable`

---

# Interface

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

# Basic Usage

```javascript
var esclient = require('pelias-esclient');
var Backend = require('geopipes-elasticsearch-backend');

var elasticsearch = new Backend( esclient, 'myindex', 'mytype' );

elasticsearch.index({
  'id': 'myid',
  'name': 'My POI',
  'center_point': {
    'lat': 50.1,
    'lon': 100.45
  }
}, function( err, res ){
  console.log( err, res );
});

elasticsearch.reverseGeo({
  'lat': 50.1,
  'lon': 100.45
}, function( err, res ){
  console.log( err, res );
});
```

# Streaming Indexing

```javascript
var esclient = require('pelias-esclient');
var Backend = require('geopipes-elasticsearch-backend');

var elasticsearch = new Backend( esclient, 'myindex', 'mytype' );
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

## NPM Module

The `geopipes-elasticsearch-backend` npm module can be found here:
[https://npmjs.org/package/ geopipes-elasticsearch-backend](https://npmjs.org/package/ geopipes-elasticsearch-backend)

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