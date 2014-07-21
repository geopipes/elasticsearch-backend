
// Base Query for Reverse GeoCoding Queries

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    size: opts.size || 1
  }
  
  var query = {
    'query': {
      'filtered': {
        'query': {
          'match_all': {}
        },
        'filter' : {
          'bool': {
            'must': []
          }
        }
      }
    },
    'sort': [{
      '_geo_distance': {
        'center_point': centroid,
        'order': 'asc',
        'unit': 'km'
      }
    }],
    'size': options.size
  }

  return query;
}