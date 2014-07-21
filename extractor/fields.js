
var DEBUG = false;

function fieldsExtractor( fields, cb ){

  if( !Array.isArray( fields ) || !fields.length ){
    return function( error, resp ){
      return cb( 'invalid fields supplied' );
    };
  }

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

      var results = [];

      // iterate through results
      resp.hits.hits.forEach( function( hit ){

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
          var output = {};
          for( var field in hitFields ){
            output[field] = hitFields[field][0];
          }
          if( Object.keys( output ).length ){
            results.push( output );
          }
        }
      });

      return cb( undefined, results );
    }

    // The query returned 0 results
    else return cb();
    return cb( 'an unexpected error occured' );
  }

  return extractor;
}

module.exports = fieldsExtractor;