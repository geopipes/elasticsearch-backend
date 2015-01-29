
// Base Query for Reverse GeoCoding Queries

var baseQuery = require('./geo_base');

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    size: opts.size || 1
  }
  
  var query = baseQuery( options ); 

  var sort = [{
    '_geo_distance': {
      'center_point': centroid,
      'order': 'asc',
      'unit': 'km'
    }
  }];

  query.sort = sort;

  return query;
}