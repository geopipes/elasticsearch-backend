
// Reverse GeoCoding geo_shape Query

var baseQuery = require('./geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    relation: opts.relation || 'intersects',
    size: opts.size || 1,
    field: opts.field || 'boundaries',
    sort: opts.sort || false
  };

  var query = baseQuery( centroid, options );

  var filter = { 'geo_shape' : {} };
  filter.geo_shape[ options.field ] = {
    'relation': options.relation,
    'shape': {
      'type': 'point',
      'coordinates': [ centroid.lon, centroid.lat ]
    }
  };

  // Add geo_shape specific filter conditions
  query.query.filtered.filter.bool.must.push( filter );

  return query;
};