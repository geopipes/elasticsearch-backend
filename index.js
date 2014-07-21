
var createBulkIndexStream = require('./bulkIndexStream'),
    reverseGeoQuery = require('./query/geo_distance'),
    fieldsExtractor = require('./extractor/fields');

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
  }, function(err, res) {
    // reduce response/error to a common format
    return cb(err, res);
  });
}

Backend.prototype.mget = function( ids, opts, cb ){
  this.client.mget({
    index: this._index,
    type: this._type,
    body: {
      ids: ids
    } 
  }, function(err, res) {
    // reduce response/error to a common format
    return cb(err, res);
  });
}

Backend.prototype.put = function( key, val, opts, cb ){
  this.client.index({
    index: this._index,
    type: this._type,
    id: key,
    body: val
  }, function(err, res) {
    // reduce response/error to a common format
    return cb(err, res);
  });
}

Backend.prototype.search = function( query, opts, cb ){
  this._search( query, opts, function(err, res) {
    // reduce response/error to a common format
    return cb(err, res);
  });
}

// Search which returns the body as returned by es
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

// Backend.prototype.reverseGeo = function( centroid, cb ){
//   var query = reverseGeoQuery( centroid );
//   this.search( query, cb );
// }

Backend.prototype.findAdminHeirachy = function( centroid, opts, cb ){
  var fields = [ 'admin0', 'admin1', 'admin2' ];
  var query = reverseGeoQuery( centroid, { size: 1 } );
  query.fields = fields; // Only return fields related to admin hierarchy
  this._search( query, opts, fieldsExtractor( fields, cb ) );
}

module.exports = Backend;