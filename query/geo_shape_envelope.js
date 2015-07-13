
// Reverse GeoCoding geo_shape Query

var baseQuery = require('./geo_base');

module.exports = function( coords, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    relation: opts.relation || 'intersects',
    size: opts.size || 1,
    field: opts.field || 'boundaries'
  };

  var query = baseQuery( null, options );

  var filter = { 'geo_shape' : {} };
  filter.geo_shape[ options.field ] = {
    'relation': options.relation,
    'shape': {
      'type': 'envelope',
      'coordinates': coords
    }
  };

  // Add geo_shape specific filter conditions
  query.query.filtered.filter.bool.must.push( filter );

  return query;
};