
// Reverse GeoCoding geohash_cell Query

var baseQuery = require('./geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    distance: opts.distance || '50km',
    size: opts.size || 1,
    field: opts.field || 'center_point',
    sort: opts.sort || false
  }

  var query = baseQuery( centroid, options );

  var filter = {
    'geohash_cell': {
      'precision': 12, // @note: setting this higher than 5 causes loads of misses!?
                       // ...and setting it around 5 is very very slow.
      'neighbors': true
    }
  };

  filter.geohash_cell[ options.field ] = centroid;

  // Add geohash_cell specific filter conditions
  query.query.filtered.filter.bool.must.push( filter );

  return query;
}