module.exports= function( body, options ){
    
    require( 'jin' ).application( process.env[ '$.jin.persistent:body' ] ? body : supervisor )
    
    function supervisor( $ ){
        var app= null
        var allowRestart= false
        
        function start( ){
            console.info( $['cli-color'].yellow( '$.jin.persistent: Starting application...' ) )
            var env= Object.create( process.env )
            env[ '$.jin.persistent:body' ]= true
            app= $.child_process.fork( process.mainModule.filename, [], { env: env } )
            
            allowRestart= false
            var isStopped= false
            
            app.on( 'exit', function( code ){
                if( code ) console.error( $['cli-color'].redBright( '$.jin.persistent: Application halted (' + code + ')' ) )
                app= null
                if( allowRestart ) start()
            } )
            
            var sleepTimer= setTimeout( function( ){
                allowRestart= true
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
        ,   options || { exclude: [ /(\\|\/|^)[^a-zA-Z]/, 'node_modules' ] }
        ,   $.jin.throttle( 200, function( event ){
                console.info( $['cli-color'].green( '$.jin.persistent: Some files changed!' ) )
                restart()
            } )
        )
        
    }
    
}
