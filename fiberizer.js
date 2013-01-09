var fibers= require( 'fibers' )
var proxy= require( 'jin/proxy' )
var sync= require( 'jin/sync' )

var fiberize=
module.exports=
function( base ){
    return proxy
    (   new function( ){
            
            this.get=
            function( base, name ){
                if( !fibers.current )
                    return base[ name ]
                
                var chunks= /^(.*)Sync$/.exec( name )
                if( !chunks )
                    return fiberize( base[ name ] )
                
                name= chunks[ 1 ]
                
                return sync( base[ name ] )
            }
            
        }
    )
    ( base )
}