module.exports=
function( make ){
    if( typeof Proxy === 'undefined' )
        throw new Error( 'Harmony Proxy is disabled. Use --harmony to enable.' )
    
    var value
    var maked= false
    
    var get= function( ){
        if( maked ) return value
        value= make()
        maked= true
        return value
    }
    
    return Proxy.createFunction
    (   new function( ){
            
            this.get=
            function( proxy, name ){
                var val= get()[ name ]
                if( typeof val === 'function' ) val= val.bind( get() )
                
                return val
            }
            
            //this.getOwnPropertyNames=
            //function( ){
            //    return Object.getOwnPropertyNames( get() )
            //}
            
            this.getPropertyNames=
            function( ){
                return Object.keys( get() )
            }
            
            //this.getOwnPropertyDescriptor=
            //function( name ){
            //    return Object.getOwnPropertyDescriptor( get(), name )
            //}
            
        }
    ,   function( ){
            return get().apply( this, arguments )
        }
    )
}