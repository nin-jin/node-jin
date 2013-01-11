var fibers= require( 'fibers' )
var proxy= require( 'jin/proxy' )
var sync= require( 'jin/sync' )
var lazy= require( 'jin/lazy' )

var fiberize=
module.exports=
function( base ){
    return proxy
    (   new function( ){
            
            this.get=
            function( base, name ){
                if( !fibers.current )
                    return base[ name ]
                
                var chunks= /^(.+)Sync(Now)?$/.exec( name )
                if( !chunks ){
                    if(( base == null )||( typeof base !== 'object' ))
                        return base[ name ]
                    
                    return fiberize( base[ name ] )
                }
                
                name= chunks[ 1 ]
                var now= chunks[ 2 ]
                var value= sync( base[ name ], now )
                
                return value
            }
            
        }
    )
    ( base )
}