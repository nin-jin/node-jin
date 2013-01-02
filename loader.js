module.exports=
function( prefix ){
    if( !prefix ) prefix= ''
    
    if( typeof Proxy === 'undefined' )
        throw new Error( 'Harmony Proxy is disabled. Use --harmony to enable.' )
    
    return Proxy.create
    (   new function( ){
            
            this.get=
            function( obj, name ){
                var path= prefix + name
                
                try {
                    path= require.resolve( path )
                } catch( error ){
                    if( error.code !== 'MODULE_NOT_FOUND' ) throw error
                    
                    $= require( 'jin' ).loader()
                    $.sync
                    
                    try {
                        $.npm.load.sync( $.npm, {} )
                        $.npm.commands.install.sync( $.npm.commands, [ path ] )
                    } catch( error ){
                        console.log( error )
                        throw new Error( 'Can not autoinstall module [' + path + ']' )
                    }
                }
                
                return require( path )
            }
            
        }
    )
}