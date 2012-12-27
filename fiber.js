$= require( 'jin' ).loader()

module.exports=
function( func ){
    var fibers= $.fibers
    var fiber= fibers( func )
    return fiber.run( fiber )
}
