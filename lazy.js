var proxy= require( 'jin/proxy' )

module.exports=
function( make ){
    var value
    var maked= false
    
    var get= function( ){
        if( maked ) return value
        value= make()
        maked= true
        return value
    }
    
    return proxy
    (   {   valueOf: function( target ){
                return target()
            }
        }
    )
    ( get )
}