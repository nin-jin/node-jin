var $= require( 'jin' ).loader()

module.exports=
$.jin.proxy( { apply: function( func, self, args ){
    if( args.length > func.length )
    var callback= [].pop.call( args ) 
    
    var proc=
    callback
    ?   function( ){
            try {
                var result= func.apply( self, args )
            } catch( err ){
                var error= err
            }
            callback( error, result )
        }
    :   function( ){
            func.apply( self, args )
        }
    
    var fibers= $.fibers
    fibers( proc ).run()
} } )
