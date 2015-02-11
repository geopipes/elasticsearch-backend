
// Base Query for GeoCoding Queries

module.exports = function( opts ){

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
    'size': options.size
  }

  return query;
}