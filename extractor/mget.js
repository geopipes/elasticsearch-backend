
var DEBUG = false;

function mgetExtractor( cb ){

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
    else if( 'object' == typeof resp && resp.hasOwnProperty('docs') && 
        Array.isArray( resp.docs ) && resp.docs.length ){

      var invalid = resp.docs.some( function( doc ){
        return !doc.found;
      });

      if( invalid ){
        if( DEBUG ){
          console.error( 'mgetExtractor: one or more node ids not found', resp.docs );
        }
        return cb( 'one or more node ids not found' );
      }

      var results = resp.docs.map( function( doc ){
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

module.exports = mgetExtractor;