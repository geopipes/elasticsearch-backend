
// Reverse GeoCoding geo_distance Query

var baseQuery = require('./reverse_geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    top_right: {
      lat: Number( opts.bbox[0] ).toFixed(2),
      lon: Number( opts.bbox[1] ).toFixed(2)
    },
    bottom_left: {
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
    'top_right' : {
      'lat': options.top_right.lat,
      'lon': options.top_right.lon
    },
    'bottom_left' : {
      'lat': options.bottom_left.lat,
      'lon': options.bottom_left.lon
    }
  };

  // Add geo_distance specific filter conditions
  query.query.filtered.filter.bool.must.push( filter );

  return query;
};