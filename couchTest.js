var couch = require('./couch.js');

var connection = couch.connection();

var resHandler = {

   data : function( object, res ) {
      console.log( 'Data: ' + JSON.stringify( object ) );
   }

};

connection.GET( '/', resHandler );

var db = connection.db( 'test' );

db.GET( resHandler );
//db.PUT( resHandler );
//db.GET( resHandler );

var doc = db.doc( 'testDoc' );

doc.PUT( { 'testKey':'testValue' }, resHandler );
doc.GET( resHandler );
