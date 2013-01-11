module.exports= function( module ){
    
    require( 'jin' )( function( $ ){
        var app= null
        var allowRestart= false
        
        function start( ){
            console.info( '$.jin.application:start' )
            app= $.child_process.fork( module )
            
            allowRestart= false
            var isStopped= false
            
            app.on( 'exit', function( code ){
                if( code ) console.info( '$.jin.application:halted(' + code + ')' )
                app= null
                if( allowRestart ) start()
            } )
            
            var sleepTimer= setTimeout( function( ){
                if( !app ) start()
                else allowRestart= true
            }, 1000 )
        }
        
        function restart( ){
            allowRestart= true
            if( app ) app.kill()
            else start()
        }
        
        start()
        
        $['fs-watch-tree'].watchTree
        (   '.'
        ,   {   presistent: false
            }
        ,   function( event ){
                console.info( '$.jin.application:fs-tree-changed' )
                restart()
            }
        )
        
    } )
    
}
