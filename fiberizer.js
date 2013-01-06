var fiberize=
module.exports=
function ( base ){
    if( typeof Proxy === 'undefined' )
        throw new Error( 'Harmony Proxy is disabled. Use --harmony to enable.' )
    
    return Proxy.createFunction
    (   new function( ){
            
            this.get=
            function( proxy, name ){
                if( !require( 'fibers' ).current )
                    return base[ name ]
                
                var chunks= /^(.*)Sync$/.exec( name )
                if( !chunks )
                    return base[ name ]
                
                name= chunks[ 1 ]
                
                return /*fiberize*/( require( 'jin/sync' )( base[ name ] ) )
            }
            
            this.getPropertyNames=
            function( ){
                return Object.keys( base )
            }
            
        }
    ,   function( ){
            return base.apply( null, arguments )
        }
    )
}