
// Reverse GeoCoding geo_bounding_box Query
// @ref: http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html

var baseQuery = require('./reverse_geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    top_right: {
      lat: Number( opts.bbox[0] ).toFixed(2), // @note: make filter cachable
      lon: Number( opts.bbox[1] ).toFixed(2)  // precision max ~1.113km off
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
    'geo_bounding_box' : {
      '_cache': true // Speed up duplicate queries. Memory impact?
    }
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

  // Remove sort condition
  query.sort = [];

  return query;
};