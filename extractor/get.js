
var DEBUG = false;

function getExtractor( cb ){

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
    else if( 'object' == typeof resp && resp.hasOwnProperty('_source') ){
      return cb( undefined, resp._source );
    }

    // The query returned 0 results
    else return cb();
    return cb( 'an unexpected error occured' );
  }

  return extractor;
}

module.exports = getExtractor;