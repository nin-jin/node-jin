var fibers= require( 'fibers' )
var proxy= require( 'jin/proxy' )

var sync=
function( func, now ){
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
                
                var get= function( ){ 
                    if( !done ){
                        fiber= fibers.current
                        fibers.yield()
                        if( error ) error.stack+= '\n--fiber--\n' + stack
                    }
                    
                    if( error ) throw error
                    return result
                }
                
                return now ? get() : lazy( get )
            }
        }
    )( func )
}

module.exports= sync