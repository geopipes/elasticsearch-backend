
// Base Query for GeoCoding Queries

module.exports = function( opts ){

  if( !opts ){ opts = {}; }

  var options = {
    size: opts.size || 1,
    population: opts.population || 'population'
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
    'size': options.size,
    'sort': [
      "_score",
      {
        "_script": {
          "script": "if (doc.containsKey('"+ options.population + "')) { return doc['" + options.population + "'].value } else { return 0 }",
          "type": "number",
          "order": "desc"
        }
      }
    ],
    "track_scores": true
  }
  // add weights for types as a sorting function

  return query;
}