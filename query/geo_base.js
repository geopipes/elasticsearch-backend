
// Base Query for GeoCoding Queries

module.exports = function( centroid, opts ){

  if( !opts ){ opts = {}; }

  var options = {
    size: opts.size || 1,
    sort: opts.sort || false
  };
  
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
    'size': options.size,
    'sort': [
      "_score"
    ],
    "track_scores": true
  };

  // sort results by distance from input centroid
  if( options.sort && centroid ){
    var sort = [{
      '_geo_distance': {
        'center_point': centroid,
        'order': 'asc',
        'unit': 'km'
      }
    }];

    query.sort = query.sort.concat(sort);
  }

  return query;
}