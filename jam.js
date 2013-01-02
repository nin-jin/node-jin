var $= require( 'jin' ).loader()

module.exports=
function( prefix ){
    if( !prefix ) prefix= __dirname + '/../../'
    
    var glob= { }
    
    var loader= Proxy.create
    (   new function( ){
            
            this.getPropertyDescriptor=
            function( name ){
                console.log( 'Autoload:', name )
                var matches= /^\$([a-zA-Z0-9]+)_([a-zA-Z0-9]+)/.exec( name )
                if( !matches ) return
                
                var pack= matches[ 1 ]
                var mod= matches[ 2 ]
                var path= prefix + pack + '/' + mod + '/' + pack + '_' + mod + '.jam.js'
                path= require.resolve( path )
                
                var source= $.fs.readFileSync( path, 'utf8' )
                $.vm.runInNewContext( source, loader, path )
                console.log(glob)
                return { value: glob[ name ], writable: true, enumerable: true, configurable: true }
            }
            
            this.defineProperty=
            function( name, descriptor ){
                console.log('???')
                return Object.defineProperty( glob, name, descriptor )
            }
            
            this.set=
            function( name, descriptor ){
                console.log('!!!')
                return Object.defineProperty( glob, name, descriptor )
            }
            
        }
    )
    
    return loader
}