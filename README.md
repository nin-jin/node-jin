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
Wrap your application to fiber:
    
    require( 'jin' )( function( $ ){
        var app= $.connect( $.connect.static( 'public' ) )
        $.http.createServer( app ).listen( 8080 )
    } )

This code may autoinstall "connect" module if needed and then run the server.


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

