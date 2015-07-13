
// Reverse GeoCoding geo_bounding_box Query
// @ref: http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-filter.html

var baseQuery = require('./geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    top   : Number( opts.bbox.top ).toFixed(2),   // @note: make filter cachable
    right : Number( opts.bbox.right ).toFixed(2), // precision max ~1.113km off
    bottom: Number( opts.bbox.bottom ).toFixed(2),
    left  : Number( opts.bbox.left ).toFixed(2),
    size: opts.size || 1,
    field: opts.field || 'center_point',
    sort: opts.sort || false
  };

  var query = baseQuery( centroid, options );

  var filter = {
    'geo_bounding_box' : {
      '_cache': true, // Speed up duplicate queries. Memory impact?
      'type': 'indexed'
    }
  };

  filter.geo_bounding_box[ options.field ] = {
    'top'   : options.top,
    'right' : options.right,
    'bottom': options.bottom,
    'left'  : options.left,
  };

  // Add geo_bounding_box specific filter conditions
  query.query.filtered.filter.bool.must.push( filter );

  return query;
};