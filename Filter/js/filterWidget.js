/**
 *
 * FilterWidget
 *
 * Status: Incomplete
 *
 * Due to time restraints, I wasn't able to finish this part of the test. The templating engine is functional,
 * and can parse out an HTML string using the data from the JSONP call and some static HTML. I'm not using
 * any external libraries, but ideally, I would have used Moustache or Underscore for templating.
 * I would have liked more time to get the filters working, as well as adding CSS polish, but the filters
 * are responsive, and the skeleton is there for the rest of the Javascript functionality.
 *
 */
(function()
{
    var tmplBuilder = function( itemObj )
    {
        var currencySymbol = '£';

        var tmpl =
            '<section data-sli="' + itemObj.technologies.sli + '">' +
            '<img src="' + itemObj.image + '" alt="' + itemObj.name + '" />' +
            '<h2>' + itemObj.name + '</h2>' +
            '<p>' + itemObj.family + ' graphics card for your ' + itemObj.form + ' machine. ' +
            'Buy now from <a href="' + itemObj.retailers.amazon.link + '">' + itemObj.retailers.amazon.name + ' for ' +
            currencySymbol + itemObj.retailers.amazon.price + '</a> or <a href="' + itemObj.retailers.bestbuy.link + '">' +
            itemObj.retailers.bestbuy.name + ' for ' + currencySymbol + itemObj.retailers.bestbuy.price + '</a>.</p> ' +
            '<p class="viewMore"><a href="'+ itemObj.details + '">View Full Details</a></p>' +
            '<div class="stats"><ul><li>Clock Speed: <span>' + itemObj.specifications.clockSpeed + '</span></li>' +
            '<li>Cuda Cores: <span>' + itemObj.specifications.cudaCores + '</span></li>' +
            '<li>Memory: <span>' + itemObj.specifications.memory + '</span></li>' +
            '<li>Physx: <span>' + itemObj.technologies.physx + '</span></li>' +
            '<li>SLI: <span>' + itemObj.technologies.sli + '</span></li>' +
            '</ul></div></section>';

        return tmpl
    };
    var filterResults = function( $filter )
    {
        var galleryItems = $( 'section' );
        for( var i = 0; i < galleryItems.length; i++ )
        {
            var $item = $( galleryItems[i] ),
                filter = 'data-' + $filter.data( 'filter' );

            if( $item.attr( filter + '="false"' ) )
            {
                $item.hide();
            }
        }

    };

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        url: 'https://www.nvidia.eu/developer-test/buy.php',
        dataType: 'jsonp',
        success: function (data, textStatus, jqXHR) {
            if( data.length > 0 )
            {
                var gallery = '',
                    $galleryContainer = $( '#listings' );

                for( var i = 0; i < data.length; i++ )
                {
                    var itemObj = data[i];
                    gallery += tmplBuilder( itemObj );
                }

                $galleryContainer.append( gallery );
            }
            else
            {
                // no results
                var noResults = '<h2>No search results</h2><p>Please refine your query.</p>',
                    $galleryContainer = $( '#listings' );

                $galleryContainer.append( noResults );
            }
        },
        error: function (xr, msg, e) {
            console.warn('Msg: ' + msg + ', error: ' + e + 'xr: ' + xr.toString());
        }
    });



    $(document.body)
        .on( 'click', '.filter', function( e )
        {
            if( e !== undefined ){ e.preventDefault(); }
            var $filter = $( e.target );

            filterResults( $filter );
        }
    );

})();