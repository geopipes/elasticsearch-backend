
var debug = require('./_debug');
// debug.enabled = true;

function searchExtractor( cb ){

  // es callback
  var extractor = function( error, resp ){

    // Response logger
    debug.resp( resp );

    // Handle errors from the es client
    if( error ) return cb( error );

    // Handle errors returned in the body
    if( 'object' == typeof resp && resp.hasOwnProperty('error') ) return cb( resp.error );

    // Check the response is valid ang contains at least one records
    else if( 'object' == typeof resp && resp.hasOwnProperty('hits') && 
        Array.isArray( resp.hits.hits ) && resp.hits.hits.length ){

      var results = resp.hits.hits.map( function( doc ){
        var source = doc._source;
        source._index = doc._index;
        source._type = doc._type;
        source._id = doc._id;
        return source;
      });

      return cb( undefined, results );
    }

    // The query returned 0 results
    else return cb();
    return cb( 'an unexpected error occured' );
  }

  return extractor;
}

module.exports = searchExtractor;