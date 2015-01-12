
(function()
{
    var tmplBuilder = function( itemObj )
    {
        var currencySymbol = '£';
        //console.log( itemObj.image );
        //console.log( itemObj.family );
        //console.log( itemObj.form );
        //console.log( itemObj.retailers.amazon.link );
        //console.log( itemObj.retailers.amazon.name );
        //console.log( currencySymbol+itemObj.retailers.amazon.price );
        //console.log( itemObj.retailers.bestbuy.price );
        //console.log( itemObj.details );
        //console.log( itemObj.specifications.clockSpeed );
        //console.log( itemObj.specifications.cudaCores );
        //console.log( itemObj.specifications.memory );
        //console.log( itemObj.technologies.physx );
        //console.log( itemObj.technologies.sli );

        var tmpl = '<section data-sli="' + itemObj.technologies.sli + '"><img src="' + itemObj.image + '" alt="' + itemObj.name + '" />' +
            '<h2>' + itemObj.name + '</h2><p><span>' + itemObj.family + '</span> graphics card for' +
            ' your <span>' + itemObj.form + '</span> machine. Buy now from ' +
            '<a href="' + itemObj.retailers.amazon.link + '">' + itemObj.retailers.amazon.name + ' for' +
            ' <span>' + currencySymbol + itemObj.retailers.amazon.price + '</span></a> or ' +
            '<a href="' + itemObj.retailers.bestbuy.link + '">' + itemObj.retailers.bestbuy.name + ' for ' +
            '<span>' + currencySymbol + itemObj.retailers.bestbuy.price + '</span></a>.</p> ' +
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

            console.log( $item.attr( 'data-' + $filter.data('filter') ) );
            console.log( filter + '="false"' );


            if( $item.attr( filter + '="false"' ) )
            {
                $item.hide();
                console.log( $item );
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

            console.info( $filter.data( 'filter' ) );

            filterResults( $filter );
        }
    );

})();