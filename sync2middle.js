var $= require( 'jin' ).loader()

module.exports=
$.jin.proxy( { apply: function( func, self, args ){
    var req= args[ 0 ]
    var res= args[ 1 ]
    var next= args[ 2 ]
    
    var thread= $.jin.sync2async( func )
    
    thread( req, res, function( error, result ){
        if( error ){
            res.writeHead( 500, { 'Content-Type': 'text/plain' } )
            res.end( String( error ) )
        } else {
            res.end( String( result ) )
        }
    } )
    
} } )
