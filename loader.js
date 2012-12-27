module.exports=
function( prefix ){
    if( !prefix ) prefix= ''
    
    return Proxy.create
    (   new function( ){
            
            this.get=
            function( obj, name ){
                var path= prefix + name
                try {
                    require.resolve( path )
                } catch( error ){
                    $.child_process.spawn( 'npm install fiberize' )
                    $.jin.sleep( 5000 )
                }
                console.log( path )
                return require( path )
            }
            
        }
    )
}