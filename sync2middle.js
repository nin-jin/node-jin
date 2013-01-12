var $= require( 'jin' ).loader()

module.exports=
$.jin.proxy( { apply: function( func, self, args ){
    var req= args[ 0 ]
    var res= args[ 1 ]
    
    var thread= $.jin.sync2async( func )
    
    thread( req, res, function( error, result ){
        if( error ) res.type( '.txt' ).send( 500, error.stack )
        else res.send( result )
    } )
    
} } )
