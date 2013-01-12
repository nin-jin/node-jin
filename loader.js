var fiberizer= require( 'jin/fiberizer' )
var proxy= require( 'jin/proxy' )

var loader=
module.exports=
proxy( { get: function( prefix, name ){
    var path= ( prefix || '' ) + name
    
    try {
        path= require.resolve( path )
    } catch( error ){
        if( error.code !== 'MODULE_NOT_FOUND' ) throw error
        if( name === 'constructor' ) return function(){ return function(){} }
        
        if( name === 'valueOf' ) return function(){ return 'y' }
        if( name === 'inspect' ) return function(){ return '$.jin.loader( "' + prefix + '" )' }
        
        console.log( '$.jin.loader: Autoinstall( ' + path + ' )')
        
        var $= loader()
        $.npm.loadSyncNow( {} )
        $.npm.commands.installSyncNow([ path ])
    }
    
    return fiberizer( require( path ) )
} } )
