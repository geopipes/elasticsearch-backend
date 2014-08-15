
var through = require('through2');

module.exports = function( index, type ){

  var stream = through.obj( function( item, enc, done ) {

    var id = item.id;
    delete item.id;

    // allow override of the default type
    // by setting ._type on the item.
    var estype = type;
    if( item.hasOwnProperty('_type') ) {
      estype = item._type;
      delete item._type;
    }

    this.push({
      _index: index, _type: estype, _id: id,
      data: item
    });

    done();

  });

  return stream;
}