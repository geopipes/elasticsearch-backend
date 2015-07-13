
// Reverse GeoCoding geo_distance Query

var baseQuery = require('./geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    distance: opts.distance || '50km',
    size: opts.size || 1,
    field: opts.field || 'center_point',
    sort: opts.sort || false
  };
  var query = baseQuery( centroid, options );

  if (centroid) {

    var filter = {
      'geo_distance' : {
        'distance': options.distance,
        'distance_type': 'plane',
        'optimize_bbox': 'indexed',
        '_cache': true // Speed up duplicate queries. Memory impact?
      }
    };

    filter.geo_distance[ options.field ] = {
      'lat': Number( centroid.lat ).toFixed(2), // @note: make filter cachable
      'lon': Number( centroid.lon ).toFixed(2)  // precision max ~1.113km off
    };

    // Add geo_distance specific filter conditions
    query.query.filtered.filter.bool.must.push( filter );
  }

  return query;
};