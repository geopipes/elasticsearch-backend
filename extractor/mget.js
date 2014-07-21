
var debug = require('./_debug');
// debug.enabled = true;

function mgetExtractor( cb ){

  // es callback
  var extractor = function( error, resp ){

    // Response logger
    debug.resp( resp );

    // Handle errors from the es client
    if( error ) return cb( error );

    // Handle errors returned in the body
    if( 'object' == typeof resp && resp.hasOwnProperty('error') ) return cb( resp.error );

    // Check the response is valid ang contains at least one records
    else if( 'object' == typeof resp && resp.hasOwnProperty('docs') && 
        Array.isArray( resp.docs ) && resp.docs.length ){

      var invalid = resp.docs.some( function( doc ){
        return !doc.found;
      });

      if( invalid ){
        debug.message( 'mgetExtractor: one or more node ids not found', resp.docs );
        return cb( 'one or more node ids not found' );
      }

      var results = resp.docs.map( function( doc ){
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

module.exports = mgetExtractor;