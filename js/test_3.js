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
    var tooltipMeta = {id: id, type: ei, u: $u};
    var tooltip = tmplEngine.render( tmpl, tooltipMeta );
    $( "body" ).append( tooltip );
    $( "#" + id ).css( {top: n, left: r} ).hide().stop( true, false ).fadeIn( 200 )
}
function q()
{
    $( "#" + id ).stop( true, false ).fadeOut( 200, function ()
    {
        $( this ).remove()
    } )
}
tmplEngine = Mustache;
var r = {};
var tmpl = '<div class="nvTt" id="{{id}}"><span class="nvTt--corner nvTt--{{type}}"></span><p class="nvTt--u">{{#u}}{{.}}<br/>{{/u}}</p></div>';
var ei = "", $u = "", id = "";
$( document ).on( "mouseover mouseout mousedown", ".e", function ( e )
{
    var $this = $( this );
    if ( e.type == "mouseover" )
    {
        var n = e.pageY + 10,
            r = e.pageX + 10;

        w( $this, n, r )
    }
    else
    {
        q()
    }
    $this.on( "remove", function ( e )
    {
        q()
    } )
} );
r.add = function ( e, tooltip, n )
{
    e.addClass( "e" ).attr( {"data-u": tooltip, "data-type": n || ""} )
};
r.destroy = function ( e )
{
    e.removeClass( "e" )
};