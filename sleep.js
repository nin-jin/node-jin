$= require( 'jin' ).loader()

module.exports=
function sleep( ms ){
    var fiber= $.fibers.current
    
    setTimeout
    (   function( ){
            fiber.run()
        }
    ,   ms
    )
    
    $.fibers.yield()
}
