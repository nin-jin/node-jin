var $= require( 'jin' ).loader()

module.exports= function( module ){
    
    var app= null
    
    function start( ){
        app= $.child_process.fork( module )
        app.on( 'exit', function( code ){
            if( !code ) return
            console.info( 'Application halted (' + code + '). Restart..' )
            start()
        } )
    }
    
    function restart( ){
        app.kill()
        start()
    }
    
    start()
    
    $['fs-watch-tree'].watchTree
    (   '.'
    ,   {   presistent: false
        }
    ,   function( event ){
            console.info( 'Some files changed. Restart application...' )
            restart()
        }
    )
    
}
