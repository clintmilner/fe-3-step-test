function w( e, n, r )
{
    if ( e.attr( "data-type" ) == "warning" )
    {
        ei = "warning"
    }
    else if ( e.attr( "data-type" ) == "error" )
    {
        ei = "error"
    }
    else
    {
        ei = "info"
    }
    id = "tt" + Math.floor( Math.random() * 1e4 );
    $u = e.attr( "data-u" ).split( "<br/>" );
    var i = {id: id, type: ei, u: $u};
    var s = y.render( t, i );
    $( "body" ).append( s );
    $( "#" + id ).css( {top: n, left: r} ).hide().stop( true, false ).fadeIn( 200 )
}
function q()
{
    $( "#" + id ).stop( true, false ).fadeOut( 200, function ()
    {
        $( this ).remove()
    } )
}
y = Mustache;
var r = {};
var t = '<div class="nvTt" id="{{id}}"><span class="nvTt--corner nvTt--{{type}}"></span><p class="nvTt--u">{{#u}}{{.}}<br/>{{/u}}</p></div>';
var ei = "", $u = "", id = "";
$( document ).on( "mouseover mouseout mousedown", ".e", function ( e )
{
    var t = $( this );
    if ( e.type == "mouseover" )
    {
        var n = e.pageY + 10, r = e.pageX + 10;
        w( t, n, r )
    }
    else
    {
        q()
    }
    t.on( "remove", function ( e )
    {
        q()
    } )
} );
r.add = function ( e, t, n )
{
    e.addClass( "e" ).attr( {"data-u": t, "data-type": n || ""} )
};
r.destroy = function ( e )
{
    e.removeClass( "e" )
};