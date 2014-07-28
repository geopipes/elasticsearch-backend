
var debug = require('./_debug');
// debug.enabled = true;

function fieldsExtractor( fields, cb ){

  if( !Array.isArray( fields ) || !fields.length ){
    throw new Error( 'invalid fields supplied' );
  }

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

      var results = [];

      // iterate through results
      for( var x=0; x<resp.hits.hits.length; x++ ){

        var hit = resp.hits.hits[x];

        // We only need the document fields
        var hitFields = hit.fields;

        // This should never happen but was reported in the wild
        // please report this bug if you see it again
        if( !hitFields ){
          console.error( 'fieldsExtractor: invalid fields returned' );
          console.error( JSON.stringify( resp, null, 2 ) );
          return cb( 'invalid fields returned' );
        }

        // Return field data
        else {
          var output = {
            _index: hit._index,
            _type: hit._type,
            _id: hit._id
          }
          for( var field in hitFields ){
            output[field] = hitFields[field][0];
          }
          if( Object.keys( output ).length > 3 ){
            results.push( output );
          }
        }
      }

      return cb( undefined, results );
    }

    // The query returned 0 results
    else return cb();
    return cb( 'an unexpected error occured' );
  }

  return extractor;
}

module.exports = fieldsExtractor;