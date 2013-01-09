var fibers= require( 'fibers' )
var proxy= require( 'jin/proxy' )
var lazy= require( 'jin/lazy' )

var sync=
function( func ){
    return proxy
    (   new function( ){
            
            this.apply=
            function( func, self, args ){
                var fiber= null
                var result= null
                var error= null
                var done= false
                
                void [].push.call( args, function( err, res ){
                    
                    result= res
                    error= err
                    done= true
                    
                    if( fiber ){
                        fiber.run( )
                        fiber= null
                    }
                } )
                
                var stack= (new Error).stack
                void func.apply( self, args )
                
                if( done ){
                    if( error ) throw error
                    return result
                }
                
                return lazy( function( ){
                    if( !done ){
                        fiber= fibers.current
                        fibers.yield()
                        if( error ) error.stack+= '\n--fiber--\n' + stack //.replace( /^(?:[^\n]*\n){2}/, '\n' )
                    }
                    
                    if( error ) throw error
                    return result
                } )
            }
        }
    )( func )
}

module.exports= sync