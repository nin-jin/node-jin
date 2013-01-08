$= require( 'jin' ).loader()

module.exports=
function tree( data ){
    return new Tree( data )
}

function Tree( values, name ){
    this.name= name
    this.content= values
}

void function( tree ){
    
    tree.name= null
    tree.content= null
    
    tree.parse= function( ){
        var struct= []
        this.forEach( function( sub ){
            if( typeof sub !== 'string' ){
                struct.push( sub )
                return
            }
            
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
                    
                    var t= new Tree( [], key )
                    s.push( t )
                    s= t.content
                }
                
                stack.unshift( s )
                
                if( value != null ) s.push( value )
            }
            
        } )
        
        return new Tree( struct )
    }
    
    tree.lines= function( ){
        
        var lines= [ ]
        this.forEach( function( value ){
            if( value instanceof Tree ){
                lines= lines.concat( value.lines().content )
            } else {
                lines.push( '=' + value )
            }
        } )
        
        if( this.name ){
            if( this.content.length > 1 ){
                lines= lines.map( function( line ){
                    return '\t' + line
                })
                lines.unshift( this.name )
            } else {
                lines[ 0 ]= this.name + ' ' + lines[ 0 ]
            }
        }
        
        return new Tree( lines )
    }
    
    tree.select= function( path ){
        return treePath( path )( this )
    }
    
    tree.values= function( values ){
        if( arguments.length ){
            var args= [ 0, this.data.length ].concat( values )
            args.splice.apply( this.data, args )
            return this
        }
        
        values= []
        
        this.forEach( function( val ){
            if( val instanceof Tree ) return
            values.push( val )
        } )
        
        return values
    }
    
    tree.forEach= function( proc ){
        this.content.forEach( proc )
        return this
    }
    
    tree.map= function( proc ){
        return this.content.map( proc )
    }
    
    tree.toString= function(){
        return this.values().join( '\n' )
    }
    
    tree.inspect= function( ){
        return String( this.lines() )
    }
    
}( Tree.prototype )

var treePath= $.jin.path( new function( ){
    
    this[ '' ]= function( name ){
        
        return function( tree ){
            var found= []
            tree.content.forEach( function( value ){
                if(!( value instanceof Tree )) return
                if( value.name !== name ) return
                
                found.push( value )
            })
            return new Tree( found )
        }
        
    }
    
    this[ '/' ]= function( name ){
        
        if( !name ) return function( tree ){
            var result= []
            tree.content.forEach( function( value ){
                if(!( value instanceof Tree )) return
                
                result= result.concat( value.content )
            })
            return new Tree( result )
        }
        
        return function( tree ){
            var found= []
            tree.content.forEach( function( value ){
                if(!( value instanceof Tree )) return
                
                value.content.forEach( function( value ){
                    if(!( value instanceof Tree )) return
                    if( value.name !== name ) return
                    
                    found.push( value )
                })
            })
            return new Tree( found )
        }
        
    }
    
} )
