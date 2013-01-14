var $= require( 'jin' ).loader()

module.exports= function( paths, positive, negative ){
    positive= positive || /./
    negative= negative || /\/\W/
    paths= paths || '.'
    if( typeof paths === 'string' ) paths= [ paths ]
    
    var getStat= $.fs.statSync
    var getChilds= $.fs.readdirSync
    
    var stats= {}
    paths.forEach( function( path ){
        stats[ path ]= getStat( path )
    } )
    
    var files= {}
    while( true ){
        
        var end= true
        var childs= {}
        for( var path in stats ){
            var stat= stats[ path ]
            
            if( stat.isDirectory() ){
                childs[ path ]= getChilds( path )
                end= false
                continue
            }
             
            if( !stat.isFile() ) continue
            
            if( !positive.test( path ) ) continue
            if( negative.test( path ) ) continue
            
            files[ path ]= stat
        }
        if( end ) break
        
        stats= {}
        for( var dir in childs ){
            childs[ dir ].forEach( function( name ){
                var path= dir + '/' + name
                stats[ path ]= getStat( path )
            } )
        }
        
    }
    return files
}
