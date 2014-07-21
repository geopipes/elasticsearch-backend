
var debug = require('./_debug');
// debug.enabled = true;

function getExtractor( cb ){

  // es callback
  var extractor = function( error, resp ){

    // Response logger
    debug.resp( resp );

    // Handle errors from the es client
    if( error ) return cb( error );

    // Handle errors returned in the body
    if( 'object' == typeof resp && resp.hasOwnProperty('error') ) return cb( resp.error );

    // Check the response is valid ang contains at least one records
    else if( 'object' == typeof resp && resp.hasOwnProperty('_source') ){
      var source = resp._source;
      source._index = resp._index;
      source._type = resp._type;
      source._id = resp._id;
      return cb( undefined, source );
    }

    // The query returned 0 results
    else return cb();
    return cb( 'an unexpected error occured' );
  }

  return extractor;
}

module.exports = getExtractor;