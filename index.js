
var merge                   = require('merge'),
    createBulkIndexStream   = require('./bulkIndexStream'),
    reverseGeoQuery         = require('./query/geo_distance'),
    extractor = {
      fields: require('./extractor/fields'),
      mget:   require('./extractor/mget'),
      search: require('./extractor/search'),
      get:    require('./extractor/get'),
      put:    require('./extractor/put')
    };

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
}

Backend.prototype.mget = function( ids, opts, cb ){
  this.client.mget({
    index: this._index,
    type: this._type,
    body: {
      ids: ids
    }
  }, extractor.mget( cb ) );
}

Backend.prototype.put = function( key, val, opts, cb ){
  this.client.index({
    index: this._index,
    type: this._type,
    id: key,
    body: val
  }, extractor.put( cb ) );
}

Backend.prototype.search = function( query, opts, cb ){
  this._search( query, opts, extractor.search( cb ) );
}

// A private search method which returns the raw result from ES
Backend.prototype._search = function( query, opts, cb ){
  this.client.search({
    index: this._index,
    type: this._type,
    body: query
  }, cb );
}

Backend.prototype.createPullStream = function(){
  return createBulkIndexStream( this.client, this._index, this._type );
}

// Find the nearest document to the supplied centroid
Backend.prototype.reverseGeo = function( centroid, opts, cb ){
  var query = reverseGeoQuery( centroid, merge( { size: 1 }, opts || {} ) );
  this.search( query, opts, cb );
}

// Perform a fields only reverse geocode to retrieve the admin heirachy
Backend.prototype.findAdminHeirachy = function( centroid, opts, cb ){
  var fields = [ 'admin0', 'admin1', 'admin2' ];
  var query = reverseGeoQuery( centroid, merge( { size: 1 }, opts || {} ) );

  // only include documents which contain valid admin values
  query.query.filtered.filter.bool.must.unshift({ exists: { field: fields } });

  // Only return fields related to admin hierarchy in results
  query.fields = fields;

  this._search( query, opts, extractor.fields( fields, cb ) );
}

module.exports = Backend;