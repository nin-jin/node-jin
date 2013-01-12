var $= require( 'jin' ).loader()
module.exports= function( app, done ){
    app= $.jin.sync2async( app )
    app( $, done )
}