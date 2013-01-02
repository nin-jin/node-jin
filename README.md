node-jin
========

Harmoy node.js sugar full-async framework

Installation
------------

Type into console:

    npm install jin

Then you need to run your script with --harmony parameter:

    node --harmony myscript.js


Autoloader
----------

Connect autoloader:

    $= require( 'jin' ).loader()

Then use this pattern to work with modules:

    var app= $.connect( $.connect.static( 'public' ) )
    $.http.createServer( app ).listen( 80 )

Instead of:

    var connect= require( 'connect' )
    var http= require( 'http' )
    var app= connect( connect.static( 'public' ) )
    http.createServer( app ).listen( 80 )

You can use customized loaders:

    $my= $.jin.loader( './' )
    $my.init() // loads ./init.js

If module is not installed, $.jin.loader tries to install that by npm. But this feature uses fibers!
Wrap your application to fiber by "sync" module:
    
    $.sync( function( ){
        var app= $.connect( $.connect.static( 'public' ) )
        $.http.createServer( app ).listen( 8080 )
    } )

This code may autoinstall "connect" module if needed and then run the server.
