var http = require('http');

exports.connection = function( options ) {
   return new Connection( options );
}

function Connection( options ) {

   var self = this;

   init();

   this.db = function( id ) {
      return new Database( id, self );
   }

   this.GET = function( uri, resHandler ) {
      request( options( 'GET' ), resHandler );
   }

   function options( method ) {
      return {
         host: self.host,
         port: self.port,
         path: self.uri,
         method: method
      }
   }

   function init() {
      if( options ) {
         self.host = options.host;
         self.port = options.port;
      }
      else {
         self.host = '127.0.0.1';
         self.port = 5984;
      }
   }
}

function Database( id, connection ) {

   var self = this;

   this.connection = connection  || new Connection();

   this.uri = '/' + id || '/';

   this.doc = function( id ) {
      return new Document( id, self );
   }

   this.GET = function( resHandler ) {
      request( options( 'GET' ), resHandler );
   }

   this.PUT = function( resHandler ) {
      request( options( 'PUT' ), resHandler );
   }

   function options( method ) {
      return {
         host: self.connection.host,
         port: self.connection.port,
         path: self.uri,
         method: method
      };
   }
}

function Document( id, database ) {

   var self = this;

   this.database = database || new Database();

   this.uri = this.database.uri + '/' + id || "/";

   this.PUT = function( data, resHandler ) {
      request( options( 'PUT' ), resHandler, data );
   }

   function options( method, headers ) {
      return {
         host: self.database.connection.host,
         port: self.database.connection.port,
         path: self.uri,
         method: method,
         headers: headers
      };
   }
}

function request( options, resHandler, data ) {

   var jsonData;
   if( data ) {
      jsonData = JSON.stringify( data );
      options['headers'] = {
         'Content-Length': jsonData.length,
         'Content-Type': 'application/json'
      };
   }

   var request = http.request( options , function( res ) {
      res.on('data', function( chunk ){
         resHandler.data( JSON.parse( chunk ), res );
      });
   });

   request.on('error', function( error ) {
      resHandler.error( error );
   });

   if( jsonData ) {
      request.write( jsonData );
   }

   request.end();
}
