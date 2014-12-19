
var merge                   = require('merge'),
    createBulkIndexStream   = require('./bulkIndexStream'),
    queries = {
      distance: require('./query/geo_distance'),
      bbox:     require('./query/geo_bbox'),
      envelope: require('./query/geo_shape_envelope'),
      point:    require('./query/geo_shape_point')
    },
    extractor = {
      fields: require('./extractor/fields'),
      mget:   require('./extractor/mget'),
      search: require('./extractor/search'),
      get:    require('./extractor/get'),
      put:    require('./extractor/put')
    };

var bun = require('bun');

function Backend( client, index, type ){
  this.client = client;
  this._index = index;
  this._type = type;
}

Backend.prototype.get = function( key, opts, cb ){
  this.client.get({
    index: this._index,
    type: this._type,
    id: key
  }, extractor.get( cb ) );
};

Backend.prototype.mget = function( ids, opts, cb ){
  this.client.mget({
    index: this._index,
    type: this._type,
    body: {
      ids: ids
    }
  }, extractor.mget( cb ) );
};

Backend.prototype.put = function( key, val, opts, cb ){
  this.client.index({
    index: this._index,
    type: this._type,
    id: key,
    body: val
  }, extractor.put( cb ) );
};

Backend.prototype.search = function( query, opts, cb ){
  this._search( query, opts, extractor.search( cb ) );
};

// A private search method which returns the raw result from ES
Backend.prototype._search = function( query, opts, cb ){
  this.client.search({
    index: this._index,
    type: this._type,
    body: query
  }, cb );
};

Backend.prototype.createPullStream = function(){
  var stream = createBulkIndexStream( this._index, this._type );
  return bun([ stream, this.client.stream ]);
};

// Find the nearest document to the supplied centroid
Backend.prototype.reverseGeo = function( centroid, opts, cb ){
  var query = queries.distance( centroid, merge( { size: 1 }, opts || {} ) );
  this.search( query, opts, cb );
};

// Perform a fields only reverse geocode to retrieve the admin heirachy
Backend.prototype.findAdminHeirachy = function( coords, opts, cb ){

  // default options
  if( !opts || 'object' !== typeof opts ){ opts = {}; }
  if( !Array.isArray( opts.fields ) ){ opts.fields = [ 'admin0', 'admin1', 'admin2' ]; }
  if( 'string' !== typeof opts.type ){ opts.type = 'distance'; }
  if( 'boolean' !== typeof opts.strict ){ opts.strict = true; }

  var query;

  // distance query (the default)
  if( opts.type === 'distance' ){
    query = queries.distance( coords, merge( { size: 1 }, opts ) );
  }
  else if( opts.type === 'shape-point' ){
    query = queries.point( coords, merge( { size: 1 }, opts ) );
  }
  else if( opts.type === 'shape-envelope' ){
    query = queries.envelope( coords, merge( { size: 1 }, opts ) );
  }
  else return cb( 'invalid type' );

  // only include documents which contain valid admin values
  if( opts.strict === true ){
    query.query.filtered.filter.bool.must.unshift({ exists: { field: opts.fields } });
  }

  // Only return fields related to admin hierarchy in results
  query.fields = opts.fields;

  this._search( query, opts, extractor.fields( opts.fields, cb ) );
};

// export useful internals
Backend.queries = queries;
Backend.extractor = extractor;

module.exports = Backend;