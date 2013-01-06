var fibers= require( 'fibers' )

var sync=
function( func ){
    if( typeof Proxy === 'undefined' )
        throw new Error( 'Harmony Proxy is disabled. Use --harmony to enable.' )
    
    return Proxy.createFunction
    (   { }
    ,   function( ){
            var fiber= null
            var result= null
            var error= null
            var done= false
            
            void [].push.call( arguments, function( err, res ){
                
                result= res
                error= err
                done= true
                
                if( fiber ){
                    fiber.run( res )
                    fiber= null
                }
            } )
            
            var stack= (new Error).stack
            void func.apply( this, arguments )
            
            return require( 'jin/lazy' )( function( ){
                if( !done ){
                    fiber= fibers.current
                    fibers.yield()
                    if( error ) error.stack+= '\n--fiber--' + stack //.replace( /^(?:[^\n]*\n){2}/, '\n' )
                }
                
                if( error ) throw err
                return result
            } )
        }
    )
}

module.exports= sync