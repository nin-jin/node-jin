$= require( 'jin' ).loader()

module.exports=
function tree( data ){
    return new Tree( data )
}

function Tree( data ){
    this.data= data
}

void function( tree ){
    
    tree.parse= function( ){
        var struct= []
        for( var k= 0; k < this.data.length; ++k ){
            var sub= this.data[ k ]
            if( typeof sub !== 'string' ){
                struct.push( sub )
            } else {
                var stack= [ struct ]
                var lines= sub.split( '\n' )
                for( var i= 0; i < lines.length; ++i ){
                    var line= lines[ i ]
                    var chunks= /^([ \t]*)([^=]*)(?:=(.*))?$/.exec( line )
                    
                    if( !chunks ) continue
                    
                    var indent= chunks[ 1 ]
                    var key= chunks[ 2 ]
                    var value= chunks[ 3 ]
                    
                    stack.splice( 0, stack.length - indent.length - 1 )
                    
                    var keys= key.split( /\s+/ )
                    var s= stack[ 0 ]
                    for( var j= 0; j < keys.length; ++j ){
                        var key= keys[ j ]
                        if( !key ) continue
                        
                        var val= {}
                        val[ key ]= []
                        s.push( val )
                        s= val[ key ]
                    }
                    stack.unshift( s )
                    
                    if( value != null ) s.push( value )
                }
            }
        }
        return new Tree( struct )
    }
    
    tree.lines= function( prefix ){
        prefix= prefix || ''
        var lines= []
        
        this.data.forEach( function( sub ){
            if( typeof sub === 'string' ){
                lines.push( prefix + '=' + sub )
            } else {
                for( var key in sub ){
                    if( !sub.hasOwnProperty( key ) ) continue
                    if(( sub[ key ].length === 1 )&&( typeof sub[ key ][ 0 ] === 'string' )){
                        lines.push( prefix + key + ' =' + sub[ key ][ 0 ] )
                    } else {
                        lines.push( prefix + key )
                        lines= lines.concat( ( new Tree( sub[ key ] ) ).lines( prefix + '\t' ).values() )
                    }
                }
            }
        } )
        
        return new Tree( lines )
    }
    
    tree.select= function( path ){
        if( typeof path === 'string' ){
            path= path.split( /\s+/ )
        }
        
        var data= this.data
        path.forEach( function( key ){
            if( !key ) return
            var struct= []
            data.forEach( function( sub ){
                if(!( key in sub )) return
                struct= struct.concat( sub[ key ] )
            } )
            data= struct
        } )
        
        return new Tree( data )
    }
    
    tree.values= function(){
        var values= []
        
        this.data.forEach( function( sub ){
            if( typeof sub !== 'string' ) return
            values.push( sub )
        } )
        
        return values
    }
    
    tree.toString= function(){
        return this.values().join( '\n' )
    }
    
}( Tree.prototype )