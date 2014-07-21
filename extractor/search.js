
var DEBUG = false;

function searchExtractor( cb ){

  // es callback
  var extractor = function( error, resp ){

    // Response logger
    if( DEBUG ){
      if( resp && resp.hasOwnProperty('took') ){
        console.error( 'response time:', resp.took + 'ms' );
      }
      console.error( JSON.stringify( resp, null, 2 ) );
    }

    // Handle errors from the es client
    if( error ) return cb( error );

    // Check the response is valid ang contains at least one records
    else if( 'object' == typeof resp && resp.hasOwnProperty('hits') && 
        Array.isArray( resp.hits.hits ) && resp.hits.hits.length ){

      var results = resp.hits.hits.map( function( doc ){
        return doc._source;
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