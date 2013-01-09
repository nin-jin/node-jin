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
                var value= base[ name ]
                
                if( !fibers.current )
                    return value
                
                var chunks= /^(.*)Sync$/.exec( name )
                if( !chunks ){
                    if(( base == null )||( typeof base !== 'object' ))
                        return value
                    
                    return fiberize( value )
                }
                
                value= base[ chunks[ 1 ] ]
                
                return sync( value )
            }
            
        }
    )
    ( base )
}