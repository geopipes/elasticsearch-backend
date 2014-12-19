
// Reverse GeoCoding geo_distance Query

var baseQuery = require('./reverse_geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    top_left: {
      lat: Number( opts.bbox[0] ).toFixed(2),
      lon: Number( opts.bbox[1] ).toFixed(2)
    },
    bottom_right: {
      lat: Number( opts.bbox[2] ).toFixed(2),
      lon: Number( opts.bbox[3] ).toFixed(2)
    },
    size: opts.size || 1,
    field: opts.field || 'center_point'
  };

  var query = baseQuery( centroid, options );

  var filter = {
    'geo_bounding_box' : {}
  };

  filter.geo_bounding_box[ options.field ] = {
    'top_left' : {
      'lat': options.top_left.lat,
      'lon': options.top_left.lon
    },
    'bottom_right' : {
      'lat': options.bottom_right.lat,
      'lon': options.bottom_right.lon
    }
  };

  // Add geo_distance specific filter conditions
  query.query.filtered.filter.bool.must.push( filter );

  return query;
};