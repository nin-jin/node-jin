if( typeof Proxy === 'undefined' )
    throw new Error( 'Harmony Proxy is disabled. Use --harmony to enable.' )

var HarmonyProxy=
( typeof Proxy === 'function' )
?   Proxy
:   function( target, handler ){
        var valueOf=
        function( ){
            return handler.hasOwnProperty( 'valueOf' ) ? handler.valueOf( target ) : target
        }
        var oldTraps= new function( ){
            
            this.getOwnPropertyDescriptor=
            function( name ){
                return ( handler.getOwnPropertyDescriptor || Object.getOwnPropertyDescriptor )( valueOf(), name )
            }
            
            this.getOwnPropertyNames=
            function( ){
                return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( valueOf() )
            }
            
            this.defineProperty=
            function( name, descriptor ){
                return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( valueOf(), name, descriptor )
            }
            
            this.delete=
            function( name ){
                return handler.deleteProperty ? handler.deleteProperty( valueOf(), name ) : delete valueOf()[ name ]
            }
            
            this.fix=
            function( ){
                throw new Error( '"fix" trap is unsupported for this proxy' )
            }
            
            this.has=
            function( name ){
                return handler.has ? handler.has( valueOf(), name ) : name in valueOf()
            }
            
            this.hasOwn=
            function( name ){
                return handler.hasOwn ? handler.hasOwn( valueOf(), name ) : valueOf().hasOwnProperty( name )
            }
            
            this.get=
            function( receiver, name ){
                if( handler.get ) return handler.get( valueOf(), name, receiver )
                
                if( name === 'valueOf' ) return valueOf
                if( name === 'toString' ) return function(){ return String( valueOf() ) }
                if( name === 'inspect' ) return function(){ return require( 'util' ).inspect( valueOf() ) }
                if( valueOf() == null ) return null
                
                return valueOf()[ name ]
            }
            
            this.set=
            function( receiver, name, value ){
                if( handler.set ) return handler.set( valueOf(), name, value, receiver )
                
                valueOf()[ name ]= value
                return valueOf()[ name ] === value
            }
            
            this.enumerate=
            function( ){
                if( handler.enumerate ) return handler.enumerate( valueOf() )
                
                var names= []
                for( var name in valueOf() ) names.push( name )
                return names
            }
            
            this.keys=
            function( ){
                if( handler.keys ) return handler.keys( valueOf )
                
                return Object.keys( Object( valueOf() ) )
            }
            
            this.valueOf= valueOf
            
        }
        
        return Proxy.createFunction
        (   oldTraps
        ,   function( ){
                return handler.apply ? handler.apply( valueOf(), this, arguments ) : valueOf().apply( this, arguments )
            }
        ,   function( ){
                if( handler.construct ) return handler.construct( valueOf(), arguments )
                
                var obj= Object.create( valueOf().prototype )
                var res= valueOf().apply( obj, arguments )
                
                return Object( ( res == null ) ? obj : res )
            }
        )
    }

module.exports= function( handler ){
    return function( target ){
        return HarmonyProxy( target, handler )
    }
}