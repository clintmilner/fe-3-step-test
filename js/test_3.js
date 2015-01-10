/**
 * nVidia ToolTip Widget
 *
 * Usage: Any element with a class of 'tooltip' will have a listener pointed to this code.
 *        Elements should have a data attribute of 'msg' which is the text of the tooltip,
 *        and a data attribute of 'type' which determine the style of tooltip.
 *
 * Dependencies: jQuery, Template.js
 *
 * Markup Example: <div class="tooltip" data-msg="Here is text for a tooltip" data-type="info">Lorem Ipsum</div>
 */

(function(){

    var tmplEngine = Mustache,
        tmpl =
            '<div class="nvTt" id="{{id}}">' +
                '<span class="nvTt--corner nvTt--{{type}}"></span>' +
                '<p class="nvTt--u">{{#msg}}{{.}}<br/>{{/msg}}</p>' +
            '</div>',
        type, id;

    function buildTooltip( elem, posY, posX )
    {
        var tooltipMeta, output, msg;

        // discover which type of tooltip to show
        if ( elem.attr( "data-type" ) === "warning" )
        {
            type = "warning"
        }
        else if ( elem.attr( "data-type" ) === "error" )
        {
            type = "error"
        }
        else
        {
            type = "info"
        }

        // create randomised id for tooltip element
        id = "tt" + Math.floor( Math.random() * 1e4 );

        // assign the tooltip to the msg variable
        msg = elem.attr( "data-msg" ).split( "<br/>" );

        // build up tooltip object for templating
        tooltipMeta = {id: id, type: type, msg: msg};

        // use Moustache to render tooltip,
        // add it to the DOM,
        // and position the tooltip with CSS
        // before fading it in
        output = tmplEngine.render( tmpl, tooltipMeta );
        $( "body" ).append( output );
        $( "#" + id ).css(
            {
                top: posY,
                left: posX
            })
            .hide()
            .stop( true, false )
            .fadeIn( 200 );
    }
    function removeTooltip()
    {
        // remove the tooltip; fading it out before
        // removing it from the DOM
        $( "#" + id ).stop( true, false )
            .fadeOut( 200,
            function ()
            {
                $( this ).remove();
            });
    }

    $( document ).on( "mouseover mouseout mousedown", ".tooltip", function ( event )
    {
        // Event Listener for elements with a class of 'tooltip'
        // if we're over the element, build up a tooltip,
        // but if not, make sure it's removed

        var $this = $( this );
        if ( event.type === "mouseover" )
        {
            var posY = event.pageY + 10,
                posX = event.pageX + 10;

            buildTooltip( $this, posY, posX );
        }
        else
        {
            removeTooltip();
        }

        $this.on( "remove", function ()
        {
            removeTooltip();
        });
    });
})();
