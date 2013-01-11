node-jin
========

Harmony node.js sugar full-async framework

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
Wrap your application to fiber:
    
    require( 'jin' )( function( $ ){
        var app= $.connect( $.connect.static( 'public' ) )
        $.http.createServer( app ).listen( 8080 )
    } )

This code may autoinstall "connect" module if needed and then run the server.


SOD
---

SOD - Syncronization On Demand. Use fibers transparent to client code. This is full sync-like api, but with full async backend.

	console.log( $.fs.readFileSync( 'data.tree' ).toString() )

This is really sync code that stops the world until file will be loaded. But inside fiber, this stops only current fiber and only when result really needed! See another example:

	require( 'jin' )( function( $ ){
		
		function get( ){
			return $.request.getSync( "http://example.org/?" + Math.random() )
		}
		
		console.time( 'serial' )
			console.log( get().statusCode )
			console.log( get().statusCode )
		console.timeEnd( 'serial' )
		
		console.time( 'parallel' )
			var resp1= get()
			var resp2= get()
			console.log( resp1.statusCode )
			console.log( resp2.statusCode )
		console.timeEnd( 'parallel' )
		
	} )

This code outputs something like this:

	200
	200
	serial: 2418ms
	200
	200
	parallel: 1189ms

The "request" module is not provide "getSync" method, but this is some magic from $.jin.loader that wrap all modules to $.jin.fiberizer proxy. This proxy traps all [name]Sync methods and returns method [name] wrapped to $.jin.sync. $.jin.sync converts regular async-function to sync-function returns future-proxy that stops current fiber when result of async-task will be accessed. It preserves $.fs.readFileSync sync-api but uses async $.fs.readFile instead.


Application support
-------------------

Use $.jin.application as supervisor for your daemon-applications.

If your application is "app.js", run it by "index.js" with this content:
	
	require( 'jin' ).application( 'app.js' )
	
That will observe the application and will restart it when:

 * Aplication crashes
 * Application stops by process.exit()
 * Some files changes in current folder
 

Tree
----

Tree - new format for representing of tree structures. This is two-dimension format like YAML but collection-oriented like XML. This is very simple and very fast format (i.e. this implementation ~15x faster than "yaml-js", but ~10x slover than native json-parser). 

Basic example (like INI):

	name =Jin
	sex =male
	profession =developer

This is 3 struct-nodes with 1 value-node in each of them.
All symbols after "=" is raw value without any escaping. For multiline text use multiple values:

	about
		=Hello, i am javascript developer.
		=My e-mail is nin-jin@ya.ru.
		=You can use = and any other symbols here.

This is tree with 1 struct-node and 3 value-nodes.

**Important!** You must use only one symbol (tab or space) for each indent.

Let us make more deep tree:

	company
		employee
			programmer
				name =Jin

You can simplify this tree to any of variants like this:

	company employee programmer name =Jin
    
	company employee
		programmer name =Jin
    
    company
		employee programmer
			name =Jin

And then you select programmers by this code:

	companyTree.select(' company / employee / programmer ')

You will get this tree:

	programmer name =Jin

That will be serialized to empty string ( **structure-nodes are igrored!** ).
But if you use "lines" method, that returns tree-object with lines in tree-format:

	=programmer name =Jin

That will be serialized right:

	programmer name =Jin

See the complex example of using tree-objects:

	var treeSource=
	[	'company employee'
	,	' programmer name =Jin'
	,	' programmer name =Nin'
	].join( '\n' )
	
	var company= $.jin.tree([ treeSource ]).parse().select(' company ')
	var programmers= company.select(' / employee / programmer ')
	
	console.log( programmers )
	//programmer name =Jin
	//programmer name =Nin
	
	programmers
	.forEach( function( programmer, index ){
		console.log( String( programmer.select(' name / ') ) )
	} )
	//Jin
	//Nin

