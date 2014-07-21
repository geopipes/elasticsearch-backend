
var debug = require('./_debug');
// debug.enabled = true;

function putExtractor( cb ){

  // es callback
  var extractor = function( error, resp ){

    // Response logger
    debug.resp( resp );

    // Handle errors from the es client
    if( error ) return cb( error );

    // Handle errors returned in the body
    if( 'object' == typeof resp && resp.hasOwnProperty('error') ) return cb( resp.error );

    // Put operation succeeded
    else if( 'object' == typeof resp && resp.created === true && resp.hasOwnProperty('_id') ){
      var output = {
        _index: resp._index,
        _type: resp._type,
        _id: resp._id
      }
      return cb( undefined, output );
    }

    // Put operation failed
    else return cb( undefined, false );
  }

  return extractor;
}

module.exports = putExtractor;