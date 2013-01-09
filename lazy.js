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
    (   new function( ){
            
            this.getOwnPropertyDescriptor=
            function( target, name ){
                return Object.getOwnPropertyDescriptor( get(), name )
            }
            
            this.getOwnPropertyNames=
            function( target ){
                return Object.getOwnPropertyNames( get() )
            }
            
            this.defineProperty=
            function( target, name, descriptor ){
                return Object.getOwnPropertyNames( get(), name, descriptor )
            }
            
            this.deleteProperty=
            function( target, name ){
                return delete get()[ name ]
            }
            
            this.has=
            function( target, name ){
                return name in get()
            }
            
            this.hasOwn=
            function( target, name ){
                return get().hasOwnProperty( name )
            }
            
            this.get=
            function( target, name, receiver ){
                var obj= get()
                if( name === 'valueOf' ) return obj.valueOf.bind( obj )
                return obj[ name ]
            }
            
            this.set=
            function( target, name, value, receiver ){
                return ( ( get()[ name ]= value ), ( get()[ name ] === value ) )
            }
            
            this.enumerate=
            function( target ){
                var names= []
                for( var name in get() ) names.push( name )
                return names
            }
            
            this.keys=
            function( target ){
                return Object.keys( Object( get() ) )
            }
            
            this.apply=
            function( target, self, args ){
                return get().apply( self, args )
            }
            
            this.construct=
            function( target, args ){
                var obj= Object.create( get().prototype )
                var res= get().apply( obj, arguments )
                
                return Object( ( res == null ) ? obj : res )
            }
            
        }
    )
    ( null )
}