var $= require( 'jin' ).loader()

module.exports= function( func, callback ){
    var proc=
    callback
    ?   function( ){
            try {
                var result= func.apply( this, arguments )
            } catch( err ){
                var error= err
            }
            callback( error, result )
        }
    :   func
    
    var fibers= $.fibers
    return fibers( proc ).run( $ )
}
