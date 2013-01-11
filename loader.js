var fiberizer= require( 'jin/fiberizer' )
var proxy= require( 'jin/proxy' )

var loader=
module.exports=
function( prefix ){
    if( !prefix ) prefix= ''
    return proxy( new function( ){
            
        this.get=
        function( target, name ){
            var path= prefix + name
            
            try {
                path= require.resolve( path )
            } catch( error ){
                if( error.code !== 'MODULE_NOT_FOUND' ) throw error
                
                try {
                    var $= loader()
                    $.npm.loadSyncNow( {} )
                    $.npm.commands.installSyncNow([ path ])
                } catch( error ){
                    console.log( error.stack )
                    throw new Error( 'Can not autoinstall module [' + path + ']' )
                }
            }
            
            return fiberizer( require( path ) )
        }
        
        this.apply=
        function( target, self, args ){
            var func= args[ 0 ]
            var callback= args[ 1 ]
            var $= loader()
            
            var proc=
            callback
            ?   function( ){
                    try {
                        var result= func.apply( this, arguments )
                    } catch( err ){
                        var error= err
                    }
                    callback( error, result )
                }
            :   func
            
            var fibers= $.fibers
            return fibers( proc ).run( $ )
        }
        
    } )( {} )
}