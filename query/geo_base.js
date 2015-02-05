
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
    'size': options.size,
    'sort': [
      "_score",
      {
        "_script": {
          "script": "if (doc.containsKey('multiplier')) { return doc['multiplier'].value } else { return 0 }",
          "type": "number",
          "order": "desc"
        }
      }
    ],
    "track_scores": true
  }

  return query;
}