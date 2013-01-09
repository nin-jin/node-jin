if( typeof Proxy === 'undefined' )
    throw new Error( 'Harmony Proxy is disabled. Use --harmony to enable.' )

var HarmonyProxy=
( typeof Proxy === 'function' )
?   Proxy
:   function( target, handler ){
        return Proxy.createFunction
        (   new function( ){
                
                this.getOwnPropertyDescriptor=
                function( name ){
                    return ( handler.getOwnPropertyDescriptor || Object.getOwnPropertyDescriptor )( target, name )
                }
                
                this.getOwnPropertyNames=
                function( ){
                    return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( target )
                }
                
                this.defineProperty=
                function( name, descriptor ){
                    return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( target, name, descriptor )
                }
                
                this.delete=
                function( name ){
                    return handler.deleteProperty ? handler.deleteProperty( target, name ) : delete target[ name ]
                }
                
                this.fix=
                function( ){
                    throw new Error( '"fix" trap is unsupported for this proxy' )
                }
                
                this.has=
                function( name ){
                    return handler.has ? handler.has( target, name ) : name in target
                }
                
                this.hasOwn=
                function( name ){
                    return handler.hasOwn ? handler.hasOwn( target, name ) : target.hasOwnProperty( name )
                }
                
                this.get=
                function( receiver, name ){
                    return handler.get ? handler.get( target, name, receiver ) : target[ name ]
                }
                
                this.set=
                function( receiver, name, value ){
                    return handler.set ? handler.set( target, name, value, receiver ) : ( ( target[ name ]= value ), ( target[ name ] === value ) )
                }
                
                this.enumerate=
                function( ){
                    if( handler.enumerate ) return handler.enumerate( target )
                    
                    var names= []
                    for( var name in target ) names.push( name )
                    return names
                }
                
                this.keys=
                function( ){
                    return ( handler.keys || Object.keys )( target )
                }
                
            }
        ,   function( ){
                return handler.apply ? handler.apply( target, this, arguments ) : target.apply( this, arguments )
            }
        ,   function( ){
                if( handler.construct ) return handler.construct( target, arguments )
                
                var obj= Object.create( target.prototype )
                var res= target.apply( obj, arguments )
                
                return Object( ( res == null ) ? obj : res )
            }
        )
    }

module.exports= function( handler ){
    return function( target ){
        return HarmonyProxy( target, handler )
    }
}