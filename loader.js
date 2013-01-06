var fiberizer= require( 'jin/fiberizer' )

var loader=
module.exports=
function( prefix ){
    if( !prefix ) prefix= ''
    
    if( typeof Proxy === 'undefined' )
        throw new Error( 'Harmony Proxy is disabled. Use --harmony to enable.' )
    
    return Proxy.createFunction
    (   new function( ){
            
            this.get=
            function( obj, name ){
                var path= prefix + name
                
                try {
                    path= require.resolve( path )
                } catch( error ){
                    if( error.code !== 'MODULE_NOT_FOUND' ) throw error
                    
                    var $= require( 'jin' ).loader()
                    
                    try {
                        $.npm.loadSync( {} ).valueOf()
                        $.sync
                        $.npm.commands.install.sync( $.npm.commands, [ path ] )
                    } catch( error ){
                        console.log( error.stack )
                        throw new Error( 'Can not autoinstall module [' + path + ']' )
                    }
                }
                
                return fiberizer( require( path ) )
            }
            
        }
    ,   function( func ){
            var $= loader()
            return $.fibers( func ).run( $ )
        }
    )
}