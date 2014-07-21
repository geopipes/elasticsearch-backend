
var exports = {
  resp: resp,
  message: stderr,
  enabled: false
}

function stderr(){
  if( exports.enabled ){
    console.error.apply( console, arguments );
  }
}

function resp( resp ){
  if( resp && resp.hasOwnProperty('took') ){
    stderr( 'response time:', resp.took + 'ms' );
  }
  stderr( JSON.stringify( resp, null, 2 ) );
}

module.exports = exports;