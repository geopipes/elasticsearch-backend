
// Reverse GeoCoding geo_shape Query

var baseQuery = require('./reverse_geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    relation: opts.relation || 'intersects',
    size: opts.size || 1,
    field: opts.field || 'boundaries'
  };

  var query = baseQuery( centroid, options );

  var filter = { 'geo_shape' : {} };
  filter.geo_shape[ options.field ] = {
    'relation': options.relation,
    'shape': {
      'type': 'point',
      'coordinates': {
        'lat': Number( centroid.lat ).toFixed(2), // @note: make filter cachable
        'lon': Number( centroid.lon ).toFixed(2)  // precision max ~1.113km off
      }
    }
  };

  // Add geo_shape specific filter conditions
  query.query.filtered.filter.bool.must.push( filter );

  return query;
};