/*
 NVIDIA Content Page Scripts
 */

(function ( $ )
{
    /*
     Automatic Pagination and Search Tool
     Call using $('targetDiv').NVPaginator({
     "searchBox"		:	"input parent div"	// optional, if set will add search controls and unhide this box. Will pull whatever text out of the child divs
     "itemsPerPage"	:	12				// by default set to 12
     "method"		:	build/nextPage/previousPage/firstPage/lastPage/reset/search
     "query"			:	string, primarily for search method
     });
     */
    var NVPaginatorStorage = {
        imagePath: '/content/includes/redesign2010/images/redesign10/NVPaginator/'
    };
    $.fn.NVPaginator = function ( options )
    {
        function NVPaginator( options )
        {
            return {
                build: function ( options )
                {
                    $( options.targetDivHash ).children().hide(); // initially hide all boxes
                    try
                    {
                        $( options.targetDivHash ).before( '<div id="NVPaginatorControl"><div class="seeAll">' + options.seeAllText + '</div>&nbsp;&nbsp; <div class="previous"><img src="' + NVPaginatorStorage.imagePath + 'left-disabled.png" alt="" /></div> <div class="page">1/' + Math.ceil( NVPaginatorStorage.itemLength / options.itemsPerPage ) + '</div> <div class="next"><img src="' + NVPaginatorStorage.imagePath + 'right.png" alt="" /></a></div>' );
                        $( '#NVPaginatorControl .previous' ).click( function ( e )
                        {
                            e.preventDefault();
                            $( options.targetDivHash ).NVPaginator( {"method": "previousPage"} );
                        } );
                        $( '#NVPaginatorControl .next' ).click( function ( e )
                        {
                            e.preventDefault();
                            $( options.targetDivHash ).NVPaginator( {"method": "nextPage"} );
                        } );
                        $( '#NVPaginatorControl .seeAll' ).click( function ( e )
                        {
                            e.preventDefault();
                            $( options.targetDivHash ).NVPaginator( {"method": "seeAll"} );
                        } );
                        //$('#NVPaginatorControl-Next').on("click",function(e){alert("hello");});
                        $( options.targetDivHash ).children().slice( 0, options.itemsPerPage ).show(); // show 0-itemsPerPage
                    }
                    catch ( e )
                    {
                        $( options.targetDivHash ).children().show();
                    }
                    ;

                },
                getContents: function ( options )
                {
                    try
                    {
                        var itemContent = new Array;
                        $( options.targetDivHash ).children().each( function ( i )
                        {
                            var contents = $( this ).html();
                            itemContent.push( contents.replace( /<\/?[^>]+>/gi, '' ) );
                        } );
                        return itemContent;
                    }
                    catch ( e )
                    {
                    }
                    ;
                },

                previousPage: function ( options )
                {
                    if ( NVPaginatorStorage.currentPage != 1 )
                    {
                        NVPaginatorStorage.currentPage--;
                        $( options.targetDivHash ).children().hide();
                        $( options.targetDivHash ).children().slice( ((NVPaginatorStorage.currentPage - 1) * options.itemsPerPage),
                            (NVPaginatorStorage.currentPage * options.itemsPerPage) ).show();
                        $( '#NVPaginatorControl .page' ).html( NVPaginatorStorage.currentPage + "/" + Math.ceil( NVPaginatorStorage.itemLength / options.itemsPerPage ) );
                        if ( NVPaginatorStorage.currentPage == 1 )
                        {
                            $( '#NVPaginatorControl .previous img' ).attr( "src",
                                NVPaginatorStorage.imagePath + "left-disabled.png" );
                        }
                        if ( NVPaginatorStorage.currentPage == (Math.ceil( NVPaginatorStorage.itemLength / options.itemsPerPage ) - 1) )
                        {
                            $( '#NVPaginatorControl .next img' ).attr( "src",
                                NVPaginatorStorage.imagePath + "right.png" );
                        }
                    }

                },
                nextPage: function ( options )
                {
                    if ( NVPaginatorStorage.currentPage != Math.ceil( NVPaginatorStorage.itemLength / options.itemsPerPage ) )
                    {
                        NVPaginatorStorage.currentPage++;
                        $( options.targetDivHash ).children().hide();
                        $( options.targetDivHash ).children().slice( ((NVPaginatorStorage.currentPage - 1) * options.itemsPerPage),
                            (NVPaginatorStorage.currentPage * options.itemsPerPage) ).show();
                        $( '#NVPaginatorControl .page' ).html( NVPaginatorStorage.currentPage + "/" + Math.ceil( NVPaginatorStorage.itemLength / options.itemsPerPage ) );
                        if ( NVPaginatorStorage.currentPage == Math.ceil( NVPaginatorStorage.itemLength / options.itemsPerPage ) )
                        {
                            $( '#NVPaginatorControl .next img' ).attr( "src",
                                NVPaginatorStorage.imagePath + "right-disabled.png" );
                        }
                        if ( NVPaginatorStorage.currentPage == 2 )
                        {
                            $( '#NVPaginatorControl .previous img' ).attr( "src",
                                NVPaginatorStorage.imagePath + "left.png" );
                        }
                    }
                },
                seeAll: function ( options )
                {
                    $( '#NVPaginatorControl' ).slideUp( 200 );
                    try
                    {
                        //$(NVPaginatorStorage.searchBox).slideUp(200);
                    }
                    catch ( e )
                    {
                    }
                    ;
                    $( options.targetDivHash ).children().fadeIn( 200 );
                },
                search: function ( options )
                {
                    if ( !options.query )
                    {
                        $( options.targetDivHash ).NVPaginator( {"method": "reset"} );
                        return false;
                    }
                    NVPaginatorStorage.searchResults = new Array;
                    $( NVPaginatorStorage.items ).each( function ( i )
                    {
                        if ( this.toLowerCase().indexOf( options.query.toLowerCase() ) !== -1 )
                        {
                            NVPaginatorStorage.searchResults.push( i );
                        }
                    } );

                    if ( NVPaginatorStorage.searchResults.length > 0 )
                    {
                        $( options.targetDivHash ).children().hide();
                        for ( var i in NVPaginatorStorage.searchResults )
                        {
                            $( options.targetDivHash ).children( ":eq(" + NVPaginatorStorage.searchResults[i] + ")" ).show();
                        }
                        $( NVPaginatorStorage.resetFilter ).show();
                        $( '#NVPaginatorControl' ).hide();
                    }
                    else
                    {
                        alert( NVPaginatorStorage.searchNoItems );
                    }
                },
                reset: function ( options )
                {
                    $( options.targetDivHash ).children().hide().slice( 0, options.itemsPerPage ).show();
                    NVPaginatorStorage.currentPage = 1;
                    $( '#NVPaginatorControl .previous img' ).attr( "src",
                        NVPaginatorStorage.imagePath + "left-disabled.png" );
                    $( '#NVPaginatorControl .right img' ).attr( "src", NVPaginatorStorage.imagePath + "right.png" );
                    $( '#NVPaginatorControl .page' ).html( NVPaginatorStorage.currentPage + "/" + Math.ceil( NVPaginatorStorage.itemLength / options.itemsPerPage ) );
                    $( NVPaginatorStorage.resetFilter ).hide();
                    $( NVPaginatorStorage.searchBox + " input" ).val( NVPaginatorStorage.searchBoxDefault );
                    $( '#NVPaginatorControl' ).show();
                }
            }
        }

        var defaultSettings = {
            'searchBox': false,
            'seeAllText': "See All",
            'searchNoItems': "There were no results for this query",
            'resetFilter': false,
            'itemsPerPage': 12,
            'currentPage': 1,
            'targetDiv': $( this ).attr( "id" ),
            'targetDivHash': '#' + $( this ).attr( "id" ),
            'method': 'build'
        }
        if ( options )
        {
            $.extend( defaultSettings, options );
        }
        var NVPaginator = NVPaginator(); // initialise the NVPaginator object

        switch ( defaultSettings.method )
        {
            case "build":
            case "create":
                NVPaginatorStorage.currentPage = defaultSettings.currentPage;
                NVPaginatorStorage.itemLength = $( defaultSettings.targetDivHash ).children().length;
                NVPaginatorStorage.searchBox = '#' + defaultSettings.searchBox;
                NVPaginatorStorage.resetFilter = '#' + defaultSettings.resetFilter;
                NVPaginatorStorage.searchBoxDefault = $( NVPaginatorStorage.searchBox + " input" ).val();
                NVPaginatorStorage.searchNoItems = defaultSettings.searchNoItems;
                if ( NVPaginatorStorage.itemLength > defaultSettings.itemsPerPage )
                {
                    if ( defaultSettings.searchBox )
                    { // if search box exists then get content for search
                        NVPaginatorStorage.items = NVPaginator.getContents( defaultSettings );
                        $( NVPaginatorStorage.searchBox + ' input' ).click( function ()
                        {
                            $( this ).val( "" );
                        } );
                        $( NVPaginatorStorage.searchBox + ' input' ).keypress( function ( e )
                        {
                            if ( e.which == 13 )
                            {
                                $( defaultSettings.targetDivHash ).NVPaginator( {
                                    "method": "search",
                                    "query": $( this ).val()
                                } );
                            }
                        } );
                        $( NVPaginatorStorage.searchBox ).show();
                        $( NVPaginatorStorage.resetFilter ).click( function ()
                        {
                            NVPaginator.reset( defaultSettings );
                        } ).hide();
                    }
                    NVPaginator.build( defaultSettings );
                }
                else
                {
                    $( NVPaginatorStorage.searchBox ).hide();
                }
                break;
            case "previousPage":
                NVPaginator.previousPage( defaultSettings );
                break;
            case "nextPage":
                NVPaginator.nextPage( defaultSettings );
                break;
            case "seeAll":
                NVPaginator.seeAll( defaultSettings );
                break;
            case "search":
                NVPaginator.search( defaultSettings );
                break;
            case "reset":
                NVPaginator.reset( defaultSettings );
                break;
        }
    };
})( jQuery );

/*
 gTabs - Green Tabs (based on fatTabs code)
 Author: jascott
 Version: 20131028-nvframe-compat
 */
(function ( $ )
{

    var activeTabNames = new Array;
    var documentRoot;

    $.fn.gTabs = function ( options )
    {
        function gTabs( divID, tabNumber, removeParentPadding )
        {
            function createTabStructure( divIDObj, data )
            {
                //$(divIDObj.name).empty(); // clear the div for tab insertion
                $( divIDObj.name + " h2" ).remove();
                //$(divIDObj.name).children("div:not('.skip')").remove();
                $( "#gTabs-menuTarget" ).html( "<ul></ul>" );
                $( data ).each( function ( i )
                {
                    if ( this.url !== false )
                    {
                        $( "#gTabs-menuTarget ul" ).append( '<li id="gTabs-tab-' + i + '"><a href="' + this.url + '" target="_blank">' + this.name + '</a></li>' );
                    }
                    else
                    {
                        $( "#gTabs-menuTarget ul" ).append( '<li id="gTabs-tab-' + i + '">' + this.name + '</li>' );
                    }
                    if ( i == 0 )
                    {
                        $( '#gTabs-tab-' + i ).addClass( "selected" );
                    }
                    if ( this.classes == "locked" )
                    {
                        $( '#gTabs-tab-' + divIDObj.nameNoHash + '-' + i ).attr( "class", this.classes );
                    }
                    $title = $( "<h2/>" ).html( this.name );
                    this.ID ? divID = this.ID : divID = "gtabs-" + divIDObj.nameNoHash + "-" + i;
                    $( divIDObj.name ).children( "div" ).eq( i ).addClass( "gtabs-content" ).attr( "id",
                        divID ).prepend( $title );
                    //this.ID ? $(divIDObj.name).append('<div id="'+this.ID+'" class="gtabs-content"><h2>'+this.name+'</h2>'+this.data+'</div>') : $(divIDObj.name).append('<div id="gtabs-'+divIDObj.nameNoHash+'-'+i+'" class="gtabs-content"><h2>'+this.name+'</h2>'+this.data+'</div>');
                    if ( this.hideTitle )
                    {
                        $( ".gtabs-content:last h2" ).hide();
                    }
                    if ( this.url === false )
                    {
                        $( '#gTabs-tab-' + i ).click( function ( event )
                        {
                            event.preventDefault();
                            $( divIDObj.name ).gTabs( {method: 'change', tabNumber: i} );
                        } );
                    }
                } );
                $( "#gTabs-menuTarget" ).addClass( "gtabs-navMenu" );
                activeTabNames.push( divIDObj.nameNoHash );
            }

            return {
                create: function ( divIDObj, tabNumber, tabTitleTag )
                {
                    try
                    {
                        var tabData = new Array();
                        $( divIDObj.name + " " + tabTitleTag ).each( function ()
                        {
                            if ( $( this ).next().get( 0 ).tagName.toLowerCase() == "div" )
                            { // this is a valid tab
                                if ( $( this ).next().html() )
                                {
                                    var thisTabData = new Array();
                                    thisTabData['name'] = $( this ).html();
                                    ($( this ).hasClass( "hideTitle" )) ? thisTabData['hideTitle'] = true : thisTabData['hideTitle'] = false;
                                    //thisTabData['data'] = $(this).next().html();
                                    thisTabData['ID'] = $( this ).next().attr( 'ID' );
                                    thisTabData['classes'] = $( this ).attr( 'class' );
                                    if ( $( this ).attr( "data-url" ) )
                                    {
                                        thisTabData['url'] = $( this ).attr( "data-url" );
                                    }
                                    else
                                    {
                                        thisTabData['url'] = false;
                                    }
                                    tabData.push( thisTabData );
                                }
                                else
                                {
                                    $( this ).remove();
                                    $( this ).next().remove();
                                }
                            }
                            else
                            {
                                if ( !$( this ).next().hasClass( "skip" ) )
                                {
                                    throw "InvalidTabStructure";
                                }
                            }
                        } );
                        createTabStructure( divIDObj, tabData );
                        $( divIDObj + " .gtabs-content:first" ).show();
                    }
                    catch ( err )
                    {
                        switch ( err )
                        {
                            case "InvalidTabStructure":
                                break;
                            default:
                                break;
                        }
                    }
                    ; // void any errors, if a parse failure occurs
                },
                change: function ( divIDObj, tabNumber )
                {
                    if ( !$( divIDObj.name + " .gtabs-content:eq(" + tabNumber + ")" ).is( ":visible" ) && !$( "#gTabs-menuTarget ul li:eq(" + tabNumber + ")" ).hasClass( 'locked' ) )
                    {
                        $( divIDObj.name + " .gtabs-content" ).hide();
                        $( divIDObj.name + " .gtabs-content:eq(" + tabNumber + ")" ).fadeIn( 300 );
                        $( "#gTabs-menuTarget ul li" ).removeClass( "selected" );
                        $( "#gTabs-menuTarget ul li:eq(" + tabNumber + ")" ).addClass( "selected" );
                        window.location.href = documentRoot + '#' + divIDObj.nameNoHash + '=' + tabNumber;
                    }
                }
            }
        }

        /* BEGIN INITIALISER FOR gTabs */

        var defaultSettings = {
            'method': 'create',
            'tabTitleTag': 'h2'
        }
        if ( options )
        {
            $.extend( defaultSettings, options );
        }
        var gTabs = gTabs(); // initialise the gTabs object

        /* END INITIALISER */
        var divIDObj = new Array(); // reinit var
        divIDObj.name = "#" + $( this ).attr( "ID" ); // prepare some data
        divIDObj.nameNoHash = $( this ).attr( "ID" );
        divIDObj.width = $( this ).width();

        switch ( defaultSettings.method )
        {
            case "create":
            default:
                var divIDObj = new Array(); // reinit var
                divIDObj.name = "#" + $( this ).attr( "ID" ); // prepare some data
                divIDObj.nameNoHash = $( this ).attr( "ID" );
                gTabs.create( divIDObj, null, defaultSettings.tabTitleTag );
                break;
            case "change":
                gTabs.change( divIDObj, defaultSettings.tabNumber );
                break;
        }
    }; // end gTabs() plugin

    function runGTabs()
    {
        require( ['FormProcessorLegacy'], function ()
        {
        } );
        try
        {
            if ( (window.location.href.indexOf( '#' ) !== -1) )
            {
                var tabItems = window.location.href.split( "#" );
                documentRoot = tabItems[0];			// store the document root for later
                tabItems = tabItems[1].split( "&" ); 	// splits all potentially multiple tab switchers
                $( tabItems ).each( function ( i )
                {
                    var tabItem = tabItems[i].split( '=' );
                    if ( $.inArray( tabItem[0], activeTabNames ) !== -1 )
                    {
                        $( '#' + tabItem[0] ).gTabs( {method: "change", tabNumber: tabItem[1]} );
                    }
                } );
            }
            else
            {
                documentRoot = window.location.href;
            }
        }
        catch ( err )
        {
        }
        ; // if auto switch fails then void error and do nothing
    }

    //$(document).ready(function(){

    // jascott - patch for nvframe race condition with fp dynamic loader and gtab support
    var locationSplit = window.location.href.split( "#fp=" );
    "1" in locationSplit ? hasCallback = true : hasCallback = false;
    if ( hasCallback == false )
    {
        $( document ).ready( function ()
        {
            runGTabs();
        } );
    }
    else
    {
        if ( typeof nvFrame == "undefined" )
        {
            $( document ).on( 'nvFrame-ready', function ( e, param )
            {
                runGTabs();
            } );
        }
        else
        {
            runGTabs();
        }
    }
})( jQuery );

/*
 Create Video Player Here for NV websites
 Call with $('#targetID').createNVPlayer({
 "width"		:	600,
 "file"		:	"/content/something/video-original.mp4"
 });
 */
(function ( $ )
{
    $.fn.createNVPlayer = function ( options )
    {
        try
        {
            switch ( nvGlobals.pageRegion )
            {
                case "en_gb":
                case "en_us":
                case "en_uk":
                case "en_in":
                default:
                    var translationArray = {
                        "var1": "The content in this video requires age verification",
                        "var2": "Please enter your date of birth below:",
                        "var3": "Verify",
                        "var4": "You do not meet the age criteria for this video"
                    }
                    break;

                case "de_de":
                    var translationArray = {
                        "var1": "Der Inhalt dieses Videos erfordert eine AltersÃ¼berprÃ¼fung",
                        "var2": "Bitte Geburtsdatum eingeben:",
                        "var3": "PrÃ¼fung",
                        "var4": "Das Video ist aufgrund der AltersbeschrÃ¤nkung nicht freigegeben"
                    }
                    break;

                case "es_es":
                    var translationArray = {
                        "var1": "Para mostrarte este vÃ­deo, tenemos que comprobar tu edad",
                        "var2": "Introduce tu fecha de nacimiento a continuaciÃ³n:",
                        "var3": "Comprobar",
                        "var4": "No has alcanzado la edad necesaria para ver el vÃ­deo"
                    }
                    break;

                case "fr_fr":
                    var translationArray = {
                        "var1": "Cette vidÃ©o requiert une vÃ©rification d'Ã¢ge",
                        "var2": "Veuillez spÃ©cifier votre date de naissance ci-dessous:",
                        "var3": "VÃ©rifier",
                        "var4": "Vous ne possÃ©dez pas lâ€™Ã¢ge requis pour voir cette vidÃ©o"
                    }
                    break;

                case "it_it":
                    var translationArray = {
                        "var1": "Il contenuto di questo video richiede una verifica dellâ€™etÃ ",
                        "var2": "Inserisci la tua data di nascita qui sotto:",
                        "var3": "Verifica",
                        "var4": "Il video Ã¨ riservato a persone di etÃ  superiore"
                    }
                    break;

                case "pl_pl":
                    var translationArray = {
                        "var1": "TreÅ›Ä‡ tego wideo wymaga weryfikacji wieku.",
                        "var2": "ProszÄ™ podaÄ‡ swojÄ… datÄ™ urodzenia poniÅ¼ej:",
                        "var3": "Zweryfikuj",
                        "var4": "Nie speÅ‚niasz kryteriÃ³w wiekowych dla tego filmu."
                    }
                    break;

                case "ru_ru":
                    var translationArray = {
                        "var1": "ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ ÑÑ‚Ð¾Ð³Ð¾ Ð²Ð¸Ð´ÐµÐ¾ Ñ‚Ñ€ÐµÐ±ÑƒÐµÑ‚ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ñ Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ð°",
                        "var2": "ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ð²Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð½Ð¸Ð¶Ðµ Ð´Ð°Ñ‚Ñƒ ÑÐ²Ð¾ÐµÐ³Ð¾ Ñ€Ð¾Ð¶Ð´ÐµÐ½Ð¸Ñ:",
                        "var3": "ÐŸÐ¾Ð´Ñ‚Ð²ÐµÑ€Ð´Ð¸Ñ‚ÑŒ",
                        "var4": "Ð’Ñ‹ Ð½Ðµ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÐµÑ‚Ðµ Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ð½Ð¾Ð¼Ñƒ ÐºÑ€Ð¸Ñ‚ÐµÑ€Ð¸ÑŽ Ð´Ð»Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° ÑÑ‚Ð¾Ð³Ð¾ Ð²Ð¸Ð´ÐµÐ¾."
                    }
                    break;

                case "tr_tr":
                    var translationArray = {
                        "var1": "Bu videonun iÃ§eriÄŸi yaÅŸ doÄŸrulamasÄ± gerektiriyor",
                        "var2": "LÃ¼tfen aÅŸaÄŸÄ±ya doÄŸum tarihinizi girin",
                        "var3": "DoÄŸrula",
                        "var4": "Bu video iÃ§in yaÅŸ kriterlerini karÅŸÄ±lamÄ±yorsunuz"
                    }
                    break;
            }
            ;
        }
        catch ( e )
        {
            var translationArray = {
                "var1": "The content in this video requires age verification",
                "var2": "Please enter your date of birth below:",
                "var3": "Verify",
                "var4": "You do not meet the age criteria for this video"
            }
        }

        function createPlayer( options )
        {
            options.fileStripped = options.file.split( "-" );
            options.fileStripped.pop();
            options.fileStripped = options.fileStripped.join( "-" );
            if ( options.age !== 0 )
            {
                jwplayer( options.targetID ).setup( {
                    "flashplayer": "/content/includes/redesign2010/js/jwplayer/player.swf",
                    "height": options.height,
                    "width": options.width,
                    "image": options.posterFrame,
                    //'logo.file':'/content/includes/redesign2010/images/redesign10/video-popup/nvlogo.png',
                    //'logo.position':'bottom-right',
                    //'logo.hide':false,
                    "levels": [
                        {bitrate: 30, file: options.fileStripped + "-gprs.mp4", width: options.width},
                        {bitrate: 200, file: options.fileStripped + "-iphone.mp4", width: options.width},
                        {bitrate: 500, file: options.fileStripped + "-med.mp4", width: options.width},
                        {bitrate: 1200, file: options.fileStripped + "-original.mp4", width: options.width}
                    ],
                    "provider": "http", "http.startparam": "starttime",
                    "plugins": {
                        '/content/includes/redesign2010/js/jwplayer/agegate_nvidia/agegate_nvidia.js': {
                            'cookielife': '0',
                            'minage': options.age,
                            'message': options.translations.var4,
                            'header': options.translations.var1,
                            'subheader': options.translations.var2,
                            'verifybutton': options.translations.var3
                        }
                    }
                } );
            }
            else
            {
                jwplayer( options.targetID ).setup( {
                    "flashplayer": "/content/includes/redesign2010/js/jwplayer/player.swf",
                    "height": options.height,
                    "width": options.width,
                    "image": options.posterFrame,
                    //'logo.file':'/content/includes/redesign2010/images/redesign10/video-popup/nvlogo.png',
                    //'logo.position':'bottom-right',
                    //'logo.hide':false,
                    "levels": [
                        {bitrate: 30, file: options.fileStripped + "-gprs.mp4", width: options.width},
                        {bitrate: 200, file: options.fileStripped + "-iphone.mp4", width: options.width},
                        {bitrate: 500, file: options.fileStripped + "-med.mp4", width: options.width},
                        {bitrate: 1200, file: options.fileStripped + "-original.mp4", width: options.width}
                    ],
                    "provider": "http", "http.startparam": "starttime"
                } );
            }
        }

        var defaultSettings = {
            "targetID": $( this ).attr( "id" ),
            "width": 640,
            "height": 360,
            "multiBW": true,
            "posterFrame": "/content/includes/redesign2010/images/redesign10/video-popup/posterframe.png",
            "age": 0,
            "translations": translationArray
        };
        if ( options )
        {
            $.extend( defaultSettings, options );
        }
        else
        { // by default options should be there for file name
            return false;
        }
        try
        {
            createPlayer( defaultSettings );
        }
        catch ( e )
        {
            jQuery.ajax( {
                type: "GET",
                url: "/content/includes/redesign2010/js/jwplayer/jwplayer.js",
                cache: true,
                dataType: "script",
                success: function ()
                {
                    createPlayer( defaultSettings );
                }
            } );
        }
        ;
    };
})( jQuery );

/* 
 NV Popup controllers
 Creates and displays the nvPopup and video modals
 */
function nvVideoController( title, url )
{
    function createPlayer( title, url )
    {
        var isJWplayer = true;
        var url;
        jQuery.ajax( {
            url: url + "-med.mp4",
            type: "HEAD",
            data: {},
            cache: false,
            success: function ( response )
            {
                // use correct jwplayer implementation (this is what we want)
                popupContent = '<div id="videoPlayer"></div>';
                isJWplayer = true;
                jwPlayerType = "mp4";
                createPlayerBox( title, popupContent, isJWplayer, url, jwPlayerType );
            },
            error: function ( response )
            {
                jQuery.ajax( {
                    url: url + ".flv",
                    type: "HEAD",
                    data: {},
                    cache: false,
                    success: function ( response )
                    {
                        // use flv version that is accompanying this old swf loader
                        popupContent = '<div id="videoPlayer"></div>';
                        isJWplayer = true;
                        jwPlayerType = "flv";
                        createPlayerBox( title, popupContent, isJWplayer, url, jwPlayerType );
                    },
                    error: function ( response )
                    {
                        popupContent = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' viewastext='' width='640' height='360' id='videoPlayer' name='videoPlayer'><param name='allowScriptAccess' value='always'><param name='movie' value='" + url + ".swf'><param name='quality' value='high'><param name='loop' value='false'></param><param name='wmode' value='transparent'><param name='embed' value='transparent'><param name='menu' value='false'><embed src='" + url + ".swf' quality='high' loop='false' wmode='transparent' name='videoPlayer' menu='false' embed='transparent' allowscriptaccess='always' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' width='640' height='360' id='videoPlayer' name='videoPlayer'></object>";
                        isJWplayer = false;
                        url = false;
                        jwPlayerType = 0;
                        createPlayerBox( title, popupContent, isJWplayer, url, jwPlayerType );
                    }
                } );
            }
        } );
    }

    return { // create construct options for video playing
        show: function ( title, url )
        {
            createPlayer( title, url );
        },
        close: function ()
        {
            //jwplayer("videoPlayer").remove();
            jQuery( '#popupOuter' ).fadeOut( 200, function ()
            {
                jQuery( '#popupOverlayBox' ).fadeOut( 300, function ()
                {
                    jQuery( this ).remove();
                } );
                jQuery( this ).remove();
            } );
        }
    }
}

function nvPopupController( options )
{
    function createBox( options )
    {
        var boxImgLoc = '/content/includes/redesign2010/images/redesign10/video-popup/';
        var viewPort = jQuery( window ).width() / 2;
        jQuery( 'body' ).prepend( '<div id="popupOverlayBox"></div>' );
        jQuery( '<div id="popupOuter"><div id="popupInner"></div></div>' ).insertAfter( '#popupOverlayBox' );
        if ( isIE6 || !options.title || options.title == "undefined" )
        {
            var title = "";
        }

        switch ( options.type )
        {
            case "popup":
            default:
                options.content = jQuery( '#' + options.divID ).html();
                break;
            case "video":
                options.divID = "videoPlayer";
                options.content = '';
                break;
        }

        jQuery( '#popupInner' ).html( '<table><tr><td class="corner" style="background:url(' + boxImgLoc + 'vpop-tl.png) no-repeat;background-position:right;"></td><td class="horizontal" style="background:url(' + boxImgLoc + 'vpop-top.png) repeat-x;"></td><td class="corner" style="background:url(' + boxImgLoc + 'vpop-tr.png) no-repeat;"></td></tr><tr><td class="vertical" style="background:url(' + boxImgLoc + 'vpop-left.png) repeat-y;background-position:right;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td id="popupContent"><div class="closeButton"><a onclick="javascript:nvPopup.close();"><img src="' + boxImgLoc + 'close.png" alt="" /></a></div><div id="popupContentInner"><div id="' + options.divID + '">' + options.content + '</div></div></td><td class="vertical" style="background:url(' + boxImgLoc + 'vpop-right.png) repeat-y;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr><tr><td class="corner" style="background:url(' + boxImgLoc + 'vpop-bl.png) no-repeat;background-position:right;"></td><td class="horizontal" style="background:url(' + boxImgLoc + 'vpop-bottom.png) repeat-x;text-align:center;">' + title + '</td><td class="corner" style="background:url(' + boxImgLoc + 'vpop-br.png) no-repeat;"></td></tr></table>' );
        if ( isIE6 || navigator.userAgent.match( /iPhone/i ) || navigator.userAgent.match( /iPod/i ) )
        {
            if ( isIE6 )
            {
                jQuery( "#popupInner .corner, #popupInner .horizontal, #popupInner .vertical" ).attr( "style", "" );
            }
            jQuery( "#popupOverlayBox" ).hide();
            jQuery( 'html, body' ).animate( {
                scrollTop: 0
            }, 300 );
        }

        jQuery( "#popupOuter" ).css( {
            display: "block"
        } );

        if ( options.type == "video" )
        {
            jQuery( "#popupContentInner" ).css( {
                width: 640,
                height: 360
            } );
        }

        var thisWidth = jQuery( "#popupInner" ).width();
        var thisHeight = jQuery( "#popupInner" ).height();

        if ( thisWidth > 940 )
        {
            thisWidth = 940;
        }
        if ( thisHeight > jQuery( window ).height() )
        {
            thisHeight = jQuery( window ).height() - 50;
            var thisOverflow = "auto";
        }
        else
        {
            var thisOverflow = "visible";
        }

        var thisLeft = "-" + thisWidth / 2 + "px";
        var thisTop = "-" + thisHeight / 2 + "px";

        jQuery( "#popupInner" ).css( {
            marginLeft: thisLeft,
            marginTop: thisTop,
            width: thisWidth,
            height: thisHeight
        } );
        if ( thisOverflow == "auto" )
        {
            jQuery( "#popupContentInner" ).css( {
                overflow: thisOverflow,
                height: thisHeight - 100
            } );
        }

        jQuery( "#popupOuter" ).removeAttr( "style" );

        if ( options.type == "video" )
        {
            jQuery( "#videoPlayer" ).css( {
                width: 640,
                height: 360
            } );
            options.videoStripped = options.video.split( '-' )
            options.videoStripped.pop();
            options.videoStripped = options.videoStripped.join( '-' ); // get rid of -original
            //options.videoStripped.replace(/,/i,"-"); // fix comma
            if ( !options.isSWF )
            {
                //jQuery('#popupContentInner').append('<p style="text-align:right;color:#999;font-size:11px;">Download: <a href="'+options.videoStripped+'-original.mp4">Computer</a> | <a href="'+options.videoStripped+'-iphone.mp4">Phone</a></p>');
            }
        }

        if ( navigator.userAgent.match( /iPhone/i ) || navigator.userAgent.match( /iPod/i ) )
        {
            jQuery( "#popupInner" ).css( {
                top: 250
            } );
        }

        jQuery( '#popupOverlayBox' ).fadeTo( 300, 0.6, function ()
        {
            jQuery( '#popupOuter' ).fadeIn( 200, function ()
            {
                if ( options.type == "video" )
                {
                    switch ( options.isSWF )
                    {
                        case true:
                            var flashvars = {};
                            var params = {};
                            var attributes = {};
                            attributes.id = "mainPlayer";
                            swfobject.embedSWF( options.video + '.swf', "videoPlayer", "640", "360", "9.0.0", false,
                                flashvars, params, attributes );
                            break;

                        case false:
                        default:
                            //jQuery('#videoPlayer').html('<video id="mainPlayer" poster="http://content.bitsontherun.com/thumbs/uMp5r6eZ-480.jpg" width="640" height="360" controls><source src="http://content.bitsontherun.com/videos/uMp5r6eZ-380099.mp4" type="video/mp4" /></video>');
                            jwplayer( "videoPlayer" ).setup( {
                                flashplayer: "/content/includes/redesign2010/js/jwplayer/player.swf",
                                height: 360,
                                width: 640,
                                image: boxImgLoc + 'posterframe.png',
                                //'logo.file':boxImgLoc+'nvlogo.png',
                                //'logo.position':'bottom-right',
                                //'logo.hide':false,
                                levels: [
                                    {bitrate: 30, file: options.videoStripped + "-gprs.mp4", width: 640},
                                    {bitrate: 200, file: options.videoStripped + "-iphone.mp4", width: 640},
                                    {bitrate: 500, file: options.videoStripped + "-med.mp4", width: 640},
                                    {bitrate: 1200, file: options.videoStripped + "-original.mp4", width: 640}
                                ],
                                provider: "http", "http.startparam": "starttime"
                            } );
                            break;
                    }
                }
            } );
            jQuery( this ).css( {
                width: jQuery( window ).width() + 200,
                height: jQuery( window ).height() + 200
            } );
        } ).click( function ()
        {
            nvPopup.close();
        } );
        return true;
    }

    var defaultSettings = {
        'type': 'popup'
    }
    if ( options )
    {
        $.extend( defaultSettings, options );
    }
    return { // create construct options
        show: function ( options )
        {
            //console.log(options);
            createBox( options );
            //var thisPopUpContent = jQuery("#"+divID).html();
            //createPlayerBox(false,thisPopUpContent,false,false,false,divID);
        },
        close: function ()
        {
            if ( jQuery( '#videoPlayer' ).length != 0 )
            {
                jwplayer( "videoPlayer" ).remove();
            }
            jQuery( '#popupOuter' ).fadeOut( 200, function ()
            {
                jQuery( '#popupOverlayBox' ).fadeOut( 300, function ()
                {
                    jQuery( this ).remove();
                } );
                jQuery( this ).remove();
                jQuery( "body" ).css( "overflow", "auto" );
            } );
        }
    }
}

var nvPopup = nvPopupController();
jQuery( document ).ready( function ()
{
    jQuery( 'a[rel*="nvPopup"]' ).click( function ( event )
    {
        event.preventDefault();
        //jQuery("body").css("overflow","hidden");
        var thisPopupID = jQuery( this ).attr( "rel" ).split( "=" );
        nvPopup.show( {
            type: 'popup',
            divID: thisPopupID[1]
        } );
    } );
    jQuery( 'a[href$="swf"],area[href$="swf"],a[href$="mp4"],area[href$="mp4"]' ).click( function ( event )
    {
        event.preventDefault();
        var thisHref = jQuery( this ).attr( "href" );
        if ( thisHref.indexOf( '.swf' ) != -1 )
        {
            var isSWFvar = true
        }
        else
        {
            var isSWFvar = false;
        }
        nvPopup.show( {
            type: 'video',
            isSWF: isSWFvar,
            video: jQuery( this ).attr( 'href' ).slice( 0, -4 ),
            title: jQuery( this ).attr( "title" )
        } );
    } );
} );

(function ( $ )
{
    $( document ).ready( function ()
    {
        /* 
         Share Widget
         At the top of the mountains
         */
        jQuery( '.shareInner' ).click( function ()
        {
            jQuery( '#shareWidget .newsLetter' ).fadeOut( 200 );
            jQuery( '.shareInner' ).fadeOut( 200, function ()
            {
                jQuery( '#shareWidget .shareOverlay' ).fadeIn( 200 );

            } );
        } );
        jQuery( '#shareClose' ).click( function ()
        {
            jQuery( '#shareWidget .shareOverlay' ).fadeOut( 200, function ()
            {
                jQuery( '#shareWidget .shareInner' ).fadeIn( 200 );
                jQuery( '#shareWidget .newsLetter' ).fadeIn( 200 );
            } );
        } );

        /* 
         Rate This Page
         At the bottom of the sea
         */
        jQuery( '#rateThisPage .rtpWidget' ).show();
        jQuery( '#rateThisPage .rtpWidget' ).click( function ()
        {
            jQuery( this ).slideUp( 400, function ()
            {
                jQuery( '#rateThisPage .rtpBox' ).show().animate( {
                    top: -274,
                    height: 230
                }, 700, function ()
                {
                    jQuery( this ).children().show();
                } );
            } );
        } );
        jQuery( '#rtpClose' ).click( function ()
        {
            jQuery( '#rateThisPage .rtpBox' ).animate( {
                top: -44,
                height: 0
            }, 700, function ()
            {
                jQuery( this ).hide();
                jQuery( '#rateThisPage .rtpWidget' ).slideDown( 400 );
            } );
        } );
    } );
})( jQuery );

/* 
 Rater Handler
 Creates nicer 'star based' rating system
 */
jQuery( document ).ready( function ()
{
    jQuery( '.ratesSelector' ).each( function ()
    {
        jQuery( this ).children( 'div' ).bind( {
            mouseenter: function ()
            {
                var currentItems = jQuery( this ).index() + 1;
                jQuery( this ).parent().children( 'div:lt(' + currentItems + ')' ).addClass( 'optionHover' );
            },
            mouseleave: function ()
            {
                jQuery( this ).parent().children( 'div' ).removeClass( 'optionHover' );
            },
            click: function ()
            {
                var currentItems = jQuery( this ).index() + 1;
                var thisRaterID = jQuery( this ).parent().attr( "id" );
                jQuery( 'input[name="' + thisRaterID + '"]' ).val( currentItems );
                jQuery( this ).parent().children( 'div' ).removeClass( 'optionHover' );
                jQuery( this ).parent().children( 'div:lt(' + currentItems + ')' ).addClass( 'optionOn' );
                jQuery( this ).parent().children( 'div:gt(' + jQuery( this ).index() + ')' ).removeClass( 'optionOn' );
            }
        } );
    } );
} );

/*
 NV FatTabs
 Author: jascott
 Version: 20130325
 */
(function ( $ )
{
    var activeTabNames = new Array;
    var documentRoot;

    $.fn.fatTabs = function ( options )
    {
        function fatTab( divID, tabNumber, removeParentPadding )
        {
            function createTabStructure( divIDObj, data )
            {
                var fatTabDivID = '#fatTabs-' + divIDObj.nameNoHash;
                $( divIDObj.name ).empty().html( '<div id="fatTabs-' + divIDObj.nameNoHash + '" class="fatTabs"><div class="tabBar"></div><div class="tabContent"></div></div>' ); // clear the div for tab insertion
                divIDObj.tabWidths = Math.floor( (divIDObj.width / data.length) );
                divIDObj.tabDifference = divIDObj.width - (divIDObj.tabWidths * data.length);
                divIDObj.tabWidths = divIDObj.tabWidths - 2;
                divIDObj.tabDivision = Math.floor( divIDObj.tabDifference / data.length );
                divIDObj.tabDifference < data.length ? divIDObj.tabWidthOne = divIDObj.tabWidths + divIDObj.tabDifference : divIDObj.tabWidths = divIDObj.tabWidths + divIDObj.tabDivision;
                $( data ).each( function ( i )
                {
                    $( fatTabDivID + " .tabBar" ).append( '<div class="tabs border"><h2 id="fatTabs-tab-' + divIDObj.nameNoHash + '-' + i + '">' + this.name + '</h2></div>' );
                    if ( this.classes == "locked" )
                    {
                        $( '#fatTabs-tab-' + divIDObj.nameNoHash + '-' + i ).attr( "class", this.classes );
                    }
                    this.ID ? $( fatTabDivID + " .tabContent" ).append( '<div id="' + this.ID + '" class="fatTabContent">' + this.data + '</div>' ) : $( fatTabDivID + " .tabContent" ).append( '<div id="fatTabs-' + divIDObj.nameNoHash + '-' + i + '" class="fatTabContent">' + this.data + '</div>' );
                    //$('#fatTabs-tab-'+divIDObj.nameNoHash+'-'+i).bind('click', function(){
                    $( '#fatTabs-tab-' + divIDObj.nameNoHash + '-' + i ).on( 'click', function ( event )
                    {
                        event.preventDefault();
                        $( divIDObj.name ).fatTabs( {method: 'change', tabNumber: i} );
                    } );
                } );
                $( fatTabDivID + " .tabBar .tabs" ).width( divIDObj.tabWidths );
                if ( divIDObj.tabWidthOne > 0 )
                {
                    $( fatTabDivID + " .tabBar .tabs:first" ).css( {"width": divIDObj.tabWidthOne} );
                }
                isIE6 ? $( fatTabDivID + " .tabBar .tabs:last" ).css( {
                    "width": divIDObj.tabWidths + 3,
                    "border-right": 0
                } ) : $( fatTabDivID + " .tabBar .tabs:last" ).css( {"width": divIDObj.tabWidths, "border-right": 0} );
                /*if(isIE7){
                 $(fatTabDivID+" .tabBar .tabs:last").css({"width" : divIDObj.tabWidths,"border-right" : 0});
                 }*/
                activeTabNames.push( divIDObj.nameNoHash );
            }

            return {
                create: function ( divIDObj, tabNumber, removeParentPadding, tabTitleTag )
                {
                    try
                    {
                        var tabData = new Array();
                        $( divIDObj.name + " " + tabTitleTag ).each( function ()
                        {
                            if ( $( this ).next().get( 0 ).tagName.toLowerCase() == "div" )
                            { // this is a valid tab
                                if ( $( this ).next().html() )
                                {
                                    var thisTabData = new Array();
                                    thisTabData['name'] = $( this ).html();
                                    thisTabData['data'] = $( this ).next().html();
                                    thisTabData['ID'] = $( this ).next().attr( 'ID' );
                                    thisTabData['classes'] = $( this ).attr( 'class' );
                                    tabData.push( thisTabData );
                                    //console.log(tabData);
                                }
                                else
                                {
                                    $( this ).remove();
                                    $( this ).next().remove();
                                    //throw "NoDataInTab";
                                }
                            }
                            else
                            {
                                throw "InvalidTabStructure";
                            }
                        } );
                        createTabStructure( divIDObj, tabData );
                        $( divIDObj + " .tabContent .fatTabContent:first" ).show();
                        $( divIDObj + " .tabBar .tabs:first" ).addClass( "active" );
                    }
                    catch ( err )
                    {
                        switch ( err )
                        {
                            case "InvalidTabStructure":
                                if ( removeParentPadding )
                                { // revert padding structure
                                    $( divIDObj.name ).css( "padding", divIDObj.originalPadding );
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    ; // void any errors, if a parse failure occurs
                },
                change: function ( divIDObj, tabNumber )
                {
                    if ( !$( divIDObj.name + " .tabContent .fatTabContent:eq(" + tabNumber + ")" ).is( ":visible" ) && !$( divIDObj.name + " .tabBar .tabs:eq(" + tabNumber + ") h2" ).hasClass( 'locked' ) )
                    {
                        $( divIDObj.name + " .tabContent .fatTabContent" ).hide();
                        $( divIDObj.name + " .tabContent .fatTabContent:eq(" + tabNumber + ")" ).fadeIn( 300 );
                        $( divIDObj.name + " .tabBar .tabs" ).removeClass( "active" );
                        $( divIDObj.name + " .tabBar .tabs:eq(" + tabNumber + ")" ).addClass( "active" );
                        //window.location.href = documentRoot+'#'+divIDObj.nameNoHash+'='+$(divIDObj.name+" .tabBar .tabs:eq("+tabNumber+")").children().html().replace(/ /gi,"-");

                        try
                        {
                            var tabItems = window.location.href.split( "#" ); // rebuild the url
                            var urlItems = new Array;
                            documentRoot = tabItems[0];
                            tabItems = tabItems[1].split( "&" );
                            if ( tabItems.length > 1 )
                            {
                                $( tabItems ).each( function ( i )
                                {
                                    var tabItem = tabItems[i].split( '=' );
                                    if ( tabItem[0] != divIDObj.nameNoHash )
                                    {
                                        urlItems.push( tabItem[0] + "=" + tabItem[1] );
                                    }
                                } );
                                urlItems = urlItems.join( "&" );
                            }
                            else
                            {
                                throw "ONETABFOUND"; // not really an exception, but we'll abuse it
                            }
                            window.location.href = documentRoot + '#' + urlItems + "&" + divIDObj.nameNoHash + '=' + tabNumber;
                        }
                        catch ( e )
                        { // if all else fails, just output the tab change to the url
                            window.location.href = documentRoot + '#' + divIDObj.nameNoHash + '=' + tabNumber;
                        }

                    }
                },
                remove2: function ( divIDObj, tabNumber )
                {
                    try
                    {
                        var oneTabWidth = parseInt( $( divIDObj.name + " .tabBar .tabs:eq(" + tabNumber + ")" ).css( "width" ).replace( "px",
                            "" ) );
                        var oneTabDisperse = oneTabWidth / ($( divIDObj.name + " .tabBar .tabs" ).length - 1);
                        $( divIDObj.name + " .tabBar .tabs:eq(" + tabNumber + ")" ).fadeOut( 600, function ()
                        {
                            $( this ).remove();
                            $( divIDObj.name + " .tabBar .tabs:not(:eq(" + tabNumber + "))" ).animate( {
                                width: (oneTabWidth + oneTabDisperse) - 1
                            }, 700, function ()
                            {
                                if ( tabNumber == $( divIDObj.name + " .tabBar .tabs" ).length )
                                { // removing the last tab, so modify widths
                                    //divIDObj.tabWidths = (divIDObj.width / $(divIDObj.name+" .tabBar .tabs").length) - 1;			// first calculate whole width
                                    var dataLength = $( divIDObj.name + " .tabBar .tabs" ).length;
                                    divIDObj.tabWidths = Math.floor( (divIDObj.width / dataLength) );
                                    divIDObj.tabDifference = divIDObj.width - (divIDObj.tabWidths * dataLength);
                                    divIDObj.tabWidths = divIDObj.tabWidths - 2;
                                    divIDObj.tabDivision = Math.floor( divIDObj.tabDifference / dataLength );
                                    divIDObj.tabDifference < dataLength ? divIDObj.tabWidthOne = divIDObj.tabWidths + divIDObj.tabDifference + 1 : divIDObj.tabWidths = divIDObj.tabWidths + divIDObj.tabDivision;
                                    $( divIDObj.name + " .tabBar .tabs" ).width( divIDObj.tabWidths );
                                    if ( divIDObj.tabWidthOne > 0 )
                                    {
                                        $( divIDObj.name + " .tabBar .tabs:first" ).css( {"width": divIDObj.tabWidthOne} );
                                    }
                                    /* $(this).css({
                                     "width" : divIDObj.tabWidths
                                     }); */
                                }
                            } );
                        } );

                        if ( tabNumber == $( divIDObj.name + " .tabBar .tabs" ).length - 1 )
                        { // removing the last tab, so remove borderRight on tab before
                            $( divIDObj.name + " .tabBar .tabs:eq(" + (tabNumber - 1) + ")" ).css( {
                                "borderRight": 0
                            } );
                        }
                    }
                    catch ( err )
                    {
                    }
                },
                activate: function ( divIDObj, tabNumber )
                {
                    $( divIDObj.name + " .tabBar .tabs:eq(" + tabNumber + ") h2" ).removeClass( 'locked' );
                },
                deactivate: function ( divIDObj, tabNumber )
                {
                    $( divIDObj.name + " .tabBar .tabs:eq(" + tabNumber + ") h2" ).addClass( 'locked' );
                }
            }
        }

        /* BEGIN INITIALISER FOR FATTABS */

        var defaultSettings = {
            'method': 'create',
            'removePadding': true,
            'tabTitleTag': 'h2'
        }
        if ( options )
        {
            $.extend( defaultSettings, options );
        }
        var fatTab = fatTab(); // initialise the fatTabs object

        /* END INITIALISER */
        var divIDObj = new Array(); // reinit var
        divIDObj.name = "#" + $( this ).attr( "ID" ); // prepare some data
        divIDObj.nameNoHash = $( this ).attr( "ID" );
        divIDObj.width = $( this ).width();

        switch ( defaultSettings.method )
        {
            case "create":
            default:
                var divIDObj = new Array(); // reinit var
                divIDObj.name = "#" + $( this ).attr( "ID" ); // prepare some data
                divIDObj.nameNoHash = $( this ).attr( "ID" );
                try
                {
                    if ( defaultSettings.removePadding )
                    {
                        //divIDObj.originalPadding = $(this).css("padding");
                        $( this ).css( {padding: "0"} );
                    }
                }
                catch ( err )
                {
                }
                ;
                divIDObj.width = $( this ).width(); // replace width with corrected width if padding is removed
                fatTab.create( divIDObj, null, defaultSettings.removePadding, defaultSettings.tabTitleTag );
                break;
            case "change":
                fatTab.change( divIDObj, defaultSettings.tabNumber );
                break;
            case "remove":
                fatTab.remove2( divIDObj, defaultSettings.tabNumber );
                break;
            case "activate":
                fatTab.activate( divIDObj, defaultSettings.tabNumber );
                break;
            case "deactivate":
                fatTab.deactivate( divIDObj, defaultSettings.tabNumber );
                break;
        }
    }; // end fatTabs() plugin

    $( document ).ready( function ()
    {
        $( '.createFatTabs' ).each( function ()
        { // loop through all css forced fatTabs and initialise
            $( this ).fatTabs();
        } );
        $( ".fatTabs" ).each( function ()
        {
            $( this ).find( ".fatTabContent:first" ).show(); // direct way to force all tabs to load tab 1 on show
            $( this ).find( ".tabs:first" ).addClass( "active" );
        } );
        try
        {
            if ( (window.location.href.indexOf( '#' ) !== -1) )
            { // we'll condense this into one function later - for now...
                var tabItems = window.location.href.split( "#" );
                documentRoot = tabItems[0];			// store the document root for later
                tabItems = tabItems[1].split( "&" ); 	// splits all potentially multiple tab switchers
                $( tabItems ).each( function ( i )
                {
                    var tabItem = tabItems[i].split( '=' );
                    if ( $.inArray( tabItem[0], activeTabNames ) !== -1 )
                    {
                        $( '#' + tabItem[0] ).fatTabs( {method: "change", tabNumber: tabItem[1]} );
                    }
                } );
            }
            else
            {
                documentRoot = window.location.href;
            }
            $( window ).hashchange( function ()
            {
                var tabItems = window.location.href.split( "#" );
                documentRoot = tabItems[0];			// store the document root for later
                tabItems = tabItems[1].split( "&" ); 	// splits all potentially multiple tab switchers
                $( tabItems ).each( function ( i )
                {
                    var tabItem = tabItems[i].split( '=' );
                    if ( $.inArray( tabItem[0], activeTabNames ) !== -1 )
                    {
                        $( '#' + tabItem[0] ).fatTabs( {method: "change", tabNumber: tabItem[1]} );
                    }
                } );
            } );
        }
        catch ( err )
        {
        }
        ; // if auto switch fails then void error and do nothing
    } );
})( jQuery );

/*
 Active Buttons
 Makes image buttons 'active' i.e. gives them hover and click states
 */
(function ( $ )
{
    var buttonCache = [];

    function preloadImg( obj )
    {
        var buttonCacheImg = document.createElement( 'img' );
        buttonCacheImg.src = $( obj ).attr( "src" ).replace( ".png", "" ) + "_hover.png";
        buttonCache.push( buttonCacheImg );
        var buttonCacheImg = document.createElement( 'img' );
        buttonCacheImg.src = $( obj ).attr( "src" ).replace( ".png", "" ) + "_click.png";
        buttonCache.push( buttonCacheImg );
    }

    try
    {
        $( document ).on( 'mouseenter mouseleave mousedown mouseup load', '.activeButton', function ( event )
        {
            var buttonName = $( this ).attr( 'src' ).replace( ".png", "" ).replace( "_hover", "" ).replace( "_click",
                "" );
            switch ( event.type )
            {
                case 'mouseenter':
                case 'mouseover':
                    $( this ).attr( {src: buttonName + '_hover.png'} );
                    break;
                case 'mouseleave':
                case 'mouseout':
                    $( this ).attr( {src: buttonName + '.png'} );
                    break;
                case 'mousedown':
                    $( this ).attr( {src: buttonName + '_click.png'} );
                    break;
                case 'mouseup':
                    $( this ).attr( {src: buttonName + '_hover.png'} );
                    break;
                case 'load':
                    preloadImg( this );
                    break;
            }
        } );
    }
    catch ( e )
    {
    }
    ;

    $( '.activeButton' ).each( function ()
    {
        preloadImg( this );
    } );
})( jQuery );

/*
 DEPRECATED FUNCTIONS
 The following functions are here for legacy reasons. They have been replaced or removed.
 */


/*
 Cookie Controller (DEPRECATED)
 Creates and handles cookie creation, modifications, and consumption
 */
function createCookie( name, value, days )
{
    if ( days )
    {
        var date = new Date();
        date.setTime( date.getTime() + (days * 24 * 60 * 60 * 1000) );
        var expires = "; expires=" + date.toGMTString();
    }
    else
    {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookie( name )
{
    var nameEQ = name + "=";
    var ca = document.cookie.split( ';' );
    for ( var i = 0; i < ca.length; i++ )
    {
        var c = ca[i];
        while ( c.charAt( 0 ) == ' ' )
        {
            c = c.substring( 1, c.length );
        }
        if ( c.indexOf( nameEQ ) == 0 )
        {
            return c.substring( nameEQ.length, c.length );
        }
    }
    return null;
}
function eraseCookie( name )
{
    createCookie( name, "", -1 );
}

/* 
 Silver Bar Tabbing (DEPRECATED, use FatTabs)
 Automates creation of silverBar Tabs
 */
function changeTab( tabBlockName, tabNumber )
{
    jQuery( '#' + tabBlockName ).children( 'h3' ).each( function ()
    {
        jQuery( this ).removeClass( "selected" );
    } );
    jQuery( '#' + tabBlockName ).children( '.tab' ).each( function ()
    {
        jQuery( this ).removeClass( "visible" );
    } );
    jQuery( '#' + tabBlockName + ' h3:nth-child(' + tabNumber + ')' ).addClass( "selected" );
    jQuery( '#' + tabBlockName + '_tab' + tabNumber ).addClass( "visible" );
}

jQuery( document ).ready( function ()
{
    function tabContent()
    {
        jQuery( '.createTabbedContent' ).each( function ( i )
        {
            if ( jQuery( this ).attr( 'id' ) )
            {
                var tabBlockName = jQuery( this ).attr( 'id' );
            }
            else
            {
                var tabBlockName = "tabBlock" + i;
                jQuery( this ).attr( "id", tabBlockName );
            }
            var tabHeader = new Array();
            var tabContent = new Array();
            var tabCount = jQuery( this ).children( 'h3' ).length;
            var counter = 1;
            jQuery( this ).children( 'h3' ).each( function ()
            {
                tabHeader[counter] = jQuery( this ).html();
                counter++;
            } );
            counter = 1; // reset counter
            jQuery( this ).children( 'div' ).each( function ()
            {
                tabContent[counter] = jQuery( this ).html();
                counter++;
            } );
            // Rewrite the content within createTabbedContent so it's in the correct order for tabbing purposes
            var newTabbedHeaders;
            var newTabbedContent;
            for ( counter = 1; counter < tabHeader.length; counter++ )
            {
                if ( counter == 1 )
                {
                    newTabbedHeaders = '<h3 onclick="changeTab(\'' + tabBlockName + '\',' + counter + ');">' + tabHeader[counter] + '</h3>';
                }
                else
                {
                    newTabbedHeaders += '<h3 onclick="changeTab(\'' + tabBlockName + '\',' + counter + ');">' + tabHeader[counter] + '</h3>';
                }
            }
            for ( counter = 1; counter < tabContent.length; counter++ )
            {
                if ( counter == 1 )
                {
                    newTabbedContent = '<div class="tab" id="' + tabBlockName + '_tab' + counter + '">' + tabContent[counter] + '</div>';
                }
                else
                {
                    newTabbedContent += '<div class="tab" id="' + tabBlockName + '_tab' + counter + '">' + tabContent[counter] + '</div>';
                }
            }
            jQuery( this ).html( newTabbedHeaders + newTabbedContent );
            // End rewrite, now we can turn this into tabs!
            jQuery( this ).removeClass( "createTabbedContent" );
            jQuery( this ).addClass( "tabbedContent" );

            var tabBlockWidth = jQuery( this ).width();
            var tabWidth = Math.round( tabBlockWidth / tabCount ); // minus 1 is border width
            jQuery( this ).children( 'h3' ).css( 'width', tabWidth ); // adjust h3
            jQuery( this ).children( 'h3:first' ).css( 'border-left', '0' );
            jQuery( this ).children( '.tab:first' ).addClass( 'visible' );
            jQuery( this ).children( 'h3:first' ).addClass( 'selected' );
            var tabOverFill = ((tabWidth * tabCount) + (tabCount) - tabBlockWidth); // calculate over/underfill
            if ( tabOverFill != 0 )
            { // the tabs will most likely not extend the whole way or by too much, so do something with this overfill
                if ( tabOverFill > 0 )
                {
                    jQuery( this ).children( 'h3:last' ).css( 'width', (tabWidth - tabOverFill + 1) );
                }
                else
                {
                    jQuery( this ).children( 'h3:last' ).css( 'width', (tabWidth + tabOverFill + 3) );
                }
            }
        } );
    }

    tabContent();
} );

/*
 Dynamic Script Loader (DEPRECATED)
 Runs calls to get js/css whenever the page requires.
 */
jQuery( document ).ready( function ()
{
    jQuery( 'a[rel="_blank"]' ).attr( 'target', '_blank' ); // rewrites rel="_blank" to target="_blank"

    var position = 20;

    function moduleLoader( moduleName )
    {
        jQuery.ajax( {
            type: "GET",
            url: '/content/includes/redesign2010/js/module-' + moduleName + '.js',
            dataType: 'script',
            cache: true,
            success: function ()
            {
                //jQuery('<div style="position:fixed; top:'+position+'px; left:20px; height:20px; width:200px; background-color:#76b900; color:#000;">'+moduleName+' module</div>').appendTo("body");
                //position=position+30; // just for debug (top position change of notifiction box)
            }
        } );
    }

    function cssLoaderAndModule( cssName, moduleName )
    {
        jQuery.ajax( {
            type: "GET",
            url: '/content/includes/redesign2010/css/' + cssName + '.css',
            success: function ( cssTemplate )
            {
                jQuery( '<style type="text/css">' + cssTemplate + '</style>' ).appendTo( "head" );
                moduleLoader( moduleName );
                //jQuery('<div style="position:fixed; top:'+position+'px; left:20px; height:20px; width:200px; background-color:#ccc; color:#000;">'+cssName+' CSS</div>').appendTo("body");
                //position=position+30; // just for debug (top position change of notifiction box)
            }
        } );
    }

    // INITIATE - START: jwPlayer Initialiser for Video Controls
    if ( jQuery( 'a[href$="swf"]' ).length > 0 || jQuery( 'a[href$="mp4"]' ).length > 0 )
    {
        jQuery.ajax( {
            type: "GET",
            url: "/content/includes/redesign2010/js/jwplayer/jwplayer.js",
            dataType: "script",
            success: function ()
            {
                //console.log("INITIALISED: jwplayer");
            }
        } );
    }

    if ( jQuery( 'form' ).length > 0 )
    {
        //moduleLoader('form-formprocessor');
    }
} );

/* Anonymous functions that fire false for anything that uses old scripts (primarily backports from gfcom) */
function initDropDowns()
{
    return false;
}
function ActivateButton()
{
    return false;
}

/* Begin Plugins */
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> */
var swfobject = function ()
{
    var D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = false, U = [h], o = [], N = [], I = [], l, Q, E, B, J = false, a = false, n, G, m = true, M = function ()
    {
        var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D, ah = t.userAgent.toLowerCase(), Y = t.platform.toLowerCase(), ae = Y ? /win/.test( Y ) : /win/.test( ah ), ac = Y ? /mac/.test( Y ) : /mac/.test( ah ), af = /webkit/.test( ah ) ? parseFloat( ah.replace( /^.*webkit\/(\d+(\.\d+)?).*$/,
            "$1" ) ) : false, X = !+"\v1", ag = [
            0,
            0,
            0
        ], ab = null;
        if ( typeof t.plugins != D && typeof t.plugins[S] == r )
        {
            ab = t.plugins[S].description;
            if ( ab && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin) )
            {
                T = true;
                X = false;
                ab = ab.replace( /^.*\s+(\S+\s+\S+$)/, "$1" );
                ag[0] = parseInt( ab.replace( /^(.*)\..*$/, "$1" ), 10 );
                ag[1] = parseInt( ab.replace( /^.*\.(.*)\s.*$/, "$1" ), 10 );
                ag[2] = /[a-zA-Z]/.test( ab ) ? parseInt( ab.replace( /^.*[a-zA-Z]+(.*)$/, "$1" ), 10 ) : 0
            }
        }
        else
        {
            if ( typeof O.ActiveXObject != D )
            {
                try
                {
                    var ad = new ActiveXObject( W );
                    if ( ad )
                    {
                        ab = ad.GetVariable( "$version" );
                        if ( ab )
                        {
                            X = true;
                            ab = ab.split( " " )[1].split( "," );
                            ag = [
                                parseInt( ab[0], 10 ),
                                parseInt( ab[1], 10 ),
                                parseInt( ab[2], 10 )
                            ]
                        }
                    }
                }
                catch ( Z )
                {
                }
            }
        }
        return {w3: aa, pv: ag, wk: af, ie: X, win: ae, mac: ac}
    }(), k = function ()
    {
        if ( !M.w3 )
        {
            return
        }
        if ( (typeof j.readyState != D && j.readyState == "complete") || (typeof j.readyState == D && (j.getElementsByTagName( "body" )[0] || j.body)) )
        {
            f()
        }
        if ( !J )
        {
            if ( typeof j.addEventListener != D )
            {
                j.addEventListener( "DOMContentLoaded", f, false )
            }
            if ( M.ie && M.win )
            {
                j.attachEvent( x, function ()
                {
                    if ( j.readyState == "complete" )
                    {
                        j.detachEvent( x, arguments.callee );
                        f()
                    }
                } );
                if ( O == top )
                {
                    (function ()
                    {
                        if ( J )
                        {
                            return
                        }
                        try
                        {
                            j.documentElement.doScroll( "left" )
                        }
                        catch ( X )
                        {
                            setTimeout( arguments.callee, 0 );
                            return
                        }
                        f()
                    })()
                }
            }
            if ( M.wk )
            {
                (function ()
                {
                    if ( J )
                    {
                        return
                    }
                    if ( !/loaded|complete/.test( j.readyState ) )
                    {
                        setTimeout( arguments.callee, 0 );
                        return
                    }
                    f()
                })()
            }
            s( f )
        }
    }();

    function f()
    {
        if ( J )
        {
            return
        }
        try
        {
            var Z = j.getElementsByTagName( "body" )[0].appendChild( C( "span" ) );
            Z.parentNode.removeChild( Z )
        }
        catch ( aa )
        {
            return
        }
        J = true;
        var X = U.length;
        for ( var Y = 0; Y < X; Y++ )
        {
            U[Y]()
        }
    }

    function K( X )
    {
        if ( J )
        {
            X()
        }
        else
        {
            U[U.length] = X
        }
    }

    function s( Y )
    {
        if ( typeof O.addEventListener != D )
        {
            O.addEventListener( "load", Y, false )
        }
        else
        {
            if ( typeof j.addEventListener != D )
            {
                j.addEventListener( "load", Y, false )
            }
            else
            {
                if ( typeof O.attachEvent != D )
                {
                    i( O, "onload", Y )
                }
                else
                {
                    if ( typeof O.onload == "function" )
                    {
                        var X = O.onload;
                        O.onload = function ()
                        {
                            X();
                            Y()
                        }
                    }
                    else
                    {
                        O.onload = Y
                    }
                }
            }
        }
    }

    function h()
    {
        if ( T )
        {
            V()
        }
        else
        {
            H()
        }
    }

    function V()
    {
        var X = j.getElementsByTagName( "body" )[0];
        var aa = C( r );
        aa.setAttribute( "type", q );
        var Z = X.appendChild( aa );
        if ( Z )
        {
            var Y = 0;
            (function ()
            {
                if ( typeof Z.GetVariable != D )
                {
                    var ab = Z.GetVariable( "$version" );
                    if ( ab )
                    {
                        ab = ab.split( " " )[1].split( "," );
                        M.pv = [
                            parseInt( ab[0], 10 ),
                            parseInt( ab[1], 10 ),
                            parseInt( ab[2], 10 )
                        ]
                    }
                }
                else
                {
                    if ( Y < 10 )
                    {
                        Y++;
                        setTimeout( arguments.callee, 10 );
                        return
                    }
                }
                X.removeChild( aa );
                Z = null;
                H()
            })()
        }
        else
        {
            H()
        }
    }

    function H()
    {
        var ag = o.length;
        if ( ag > 0 )
        {
            for ( var af = 0; af < ag; af++ )
            {
                var Y = o[af].id;
                var ab = o[af].callbackFn;
                var aa = {success: false, id: Y};
                if ( M.pv[0] > 0 )
                {
                    var ae = c( Y );
                    if ( ae )
                    {
                        if ( F( o[af].swfVersion ) && !(M.wk && M.wk < 312) )
                        {
                            w( Y, true );
                            if ( ab )
                            {
                                aa.success = true;
                                aa.ref = z( Y );
                                ab( aa )
                            }
                        }
                        else
                        {
                            if ( o[af].expressInstall && A() )
                            {
                                var ai = {};
                                ai.data = o[af].expressInstall;
                                ai.width = ae.getAttribute( "width" ) || "0";
                                ai.height = ae.getAttribute( "height" ) || "0";
                                if ( ae.getAttribute( "class" ) )
                                {
                                    ai.styleclass = ae.getAttribute( "class" )
                                }
                                if ( ae.getAttribute( "align" ) )
                                {
                                    ai.align = ae.getAttribute( "align" )
                                }
                                var ah = {};
                                var X = ae.getElementsByTagName( "param" );
                                var ac = X.length;
                                for ( var ad = 0; ad < ac; ad++ )
                                {
                                    if ( X[ad].getAttribute( "name" ).toLowerCase() != "movie" )
                                    {
                                        ah[X[ad].getAttribute( "name" )] = X[ad].getAttribute( "value" )
                                    }
                                }
                                P( ai, ah, Y, ab )
                            }
                            else
                            {
                                p( ae );
                                if ( ab )
                                {
                                    ab( aa )
                                }
                            }
                        }
                    }
                }
                else
                {
                    w( Y, true );
                    if ( ab )
                    {
                        var Z = z( Y );
                        if ( Z && typeof Z.SetVariable != D )
                        {
                            aa.success = true;
                            aa.ref = Z
                        }
                        ab( aa )
                    }
                }
            }
        }
    }

    function z( aa )
    {
        var X = null;
        var Y = c( aa );
        if ( Y && Y.nodeName == "OBJECT" )
        {
            if ( typeof Y.SetVariable != D )
            {
                X = Y
            }
            else
            {
                var Z = Y.getElementsByTagName( r )[0];
                if ( Z )
                {
                    X = Z
                }
            }
        }
        return X
    }

    function A()
    {
        return !a && F( "6.0.65" ) && (M.win || M.mac) && !(M.wk && M.wk < 312)
    }

    function P( aa, ab, X, Z )
    {
        a = true;
        E = Z || null;
        B = {success: false, id: X};
        var ae = c( X );
        if ( ae )
        {
            if ( ae.nodeName == "OBJECT" )
            {
                l = g( ae );
                Q = null
            }
            else
            {
                l = ae;
                Q = X
            }
            aa.id = R;
            if ( typeof aa.width == D || (!/%$/.test( aa.width ) && parseInt( aa.width, 10 ) < 310) )
            {
                aa.width = "310"
            }
            if ( typeof aa.height == D || (!/%$/.test( aa.height ) && parseInt( aa.height, 10 ) < 137) )
            {
                aa.height = "137"
            }
            j.title = j.title.slice( 0, 47 ) + " - Flash Player Installation";
            var ad = M.ie && M.win ? "ActiveX" : "PlugIn", ac = "MMredirectURL=" + O.location.toString().replace( /&/g,
                    "%26" ) + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
            if ( typeof ab.flashvars != D )
            {
                ab.flashvars += "&" + ac
            }
            else
            {
                ab.flashvars = ac
            }
            if ( M.ie && M.win && ae.readyState != 4 )
            {
                var Y = C( "div" );
                X += "SWFObjectNew";
                Y.setAttribute( "id", X );
                ae.parentNode.insertBefore( Y, ae );
                ae.style.display = "none";
                (function ()
                {
                    if ( ae.readyState == 4 )
                    {
                        ae.parentNode.removeChild( ae )
                    }
                    else
                    {
                        setTimeout( arguments.callee, 10 )
                    }
                })()
            }
            u( aa, ab, X )
        }
    }

    function p( Y )
    {
        if ( M.ie && M.win && Y.readyState != 4 )
        {
            var X = C( "div" );
            Y.parentNode.insertBefore( X, Y );
            X.parentNode.replaceChild( g( Y ), X );
            Y.style.display = "none";
            (function ()
            {
                if ( Y.readyState == 4 )
                {
                    Y.parentNode.removeChild( Y )
                }
                else
                {
                    setTimeout( arguments.callee, 10 )
                }
            })()
        }
        else
        {
            Y.parentNode.replaceChild( g( Y ), Y )
        }
    }

    function g( ab )
    {
        var aa = C( "div" );
        if ( M.win && M.ie )
        {
            aa.innerHTML = ab.innerHTML
        }
        else
        {
            var Y = ab.getElementsByTagName( r )[0];
            if ( Y )
            {
                var ad = Y.childNodes;
                if ( ad )
                {
                    var X = ad.length;
                    for ( var Z = 0; Z < X; Z++ )
                    {
                        if ( !(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8) )
                        {
                            aa.appendChild( ad[Z].cloneNode( true ) )
                        }
                    }
                }
            }
        }
        return aa
    }

    function u( ai, ag, Y )
    {
        var X, aa = c( Y );
        if ( M.wk && M.wk < 312 )
        {
            return X
        }
        if ( aa )
        {
            if ( typeof ai.id == D )
            {
                ai.id = Y
            }
            if ( M.ie && M.win )
            {
                var ah = "";
                for ( var ae in ai )
                {
                    if ( ai[ae] != Object.prototype[ae] )
                    {
                        if ( ae.toLowerCase() == "data" )
                        {
                            ag.movie = ai[ae]
                        }
                        else
                        {
                            if ( ae.toLowerCase() == "styleclass" )
                            {
                                ah += ' class="' + ai[ae] + '"'
                            }
                            else
                            {
                                if ( ae.toLowerCase() != "classid" )
                                {
                                    ah += " " + ae + '="' + ai[ae] + '"'
                                }
                            }
                        }
                    }
                }
                var af = "";
                for ( var ad in ag )
                {
                    if ( ag[ad] != Object.prototype[ad] )
                    {
                        af += '<param name="' + ad + '" value="' + ag[ad] + '" />'
                    }
                }
                aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>";
                N[N.length] = ai.id;
                X = c( ai.id )
            }
            else
            {
                var Z = C( r );
                Z.setAttribute( "type", q );
                for ( var ac in ai )
                {
                    if ( ai[ac] != Object.prototype[ac] )
                    {
                        if ( ac.toLowerCase() == "styleclass" )
                        {
                            Z.setAttribute( "class", ai[ac] )
                        }
                        else
                        {
                            if ( ac.toLowerCase() != "classid" )
                            {
                                Z.setAttribute( ac, ai[ac] )
                            }
                        }
                    }
                }
                for ( var ab in ag )
                {
                    if ( ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie" )
                    {
                        e( Z, ab, ag[ab] )
                    }
                }
                aa.parentNode.replaceChild( Z, aa );
                X = Z
            }
        }
        return X
    }

    function e( Z, X, Y )
    {
        var aa = C( "param" );
        aa.setAttribute( "name", X );
        aa.setAttribute( "value", Y );
        Z.appendChild( aa )
    }

    function y( Y )
    {
        var X = c( Y );
        if ( X && X.nodeName == "OBJECT" )
        {
            if ( M.ie && M.win )
            {
                X.style.display = "none";
                (function ()
                {
                    if ( X.readyState == 4 )
                    {
                        b( Y )
                    }
                    else
                    {
                        setTimeout( arguments.callee, 10 )
                    }
                })()
            }
            else
            {
                X.parentNode.removeChild( X )
            }
        }
    }

    function b( Z )
    {
        var Y = c( Z );
        if ( Y )
        {
            for ( var X in Y )
            {
                if ( typeof Y[X] == "function" )
                {
                    Y[X] = null
                }
            }
            Y.parentNode.removeChild( Y )
        }
    }

    function c( Z )
    {
        var X = null;
        try
        {
            X = j.getElementById( Z )
        }
        catch ( Y )
        {
        }
        return X
    }

    function C( X )
    {
        return j.createElement( X )
    }

    function i( Z, X, Y )
    {
        Z.attachEvent( X, Y );
        I[I.length] = [
            Z,
            X,
            Y
        ]
    }

    function F( Z )
    {
        var Y = M.pv, X = Z.split( "." );
        X[0] = parseInt( X[0], 10 );
        X[1] = parseInt( X[1], 10 ) || 0;
        X[2] = parseInt( X[2], 10 ) || 0;
        return (Y[0] > X[0] || (Y[0] == X[0] && Y[1] > X[1]) || (Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2])) ? true : false
    }

    function v( ac, Y, ad, ab )
    {
        if ( M.ie && M.mac )
        {
            return
        }
        var aa = j.getElementsByTagName( "head" )[0];
        if ( !aa )
        {
            return
        }
        var X = (ad && typeof ad == "string") ? ad : "screen";
        if ( ab )
        {
            n = null;
            G = null
        }
        if ( !n || G != X )
        {
            var Z = C( "style" );
            Z.setAttribute( "type", "text/css" );
            Z.setAttribute( "media", X );
            n = aa.appendChild( Z );
            if ( M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0 )
            {
                n = j.styleSheets[j.styleSheets.length - 1]
            }
            G = X
        }
        if ( M.ie && M.win )
        {
            if ( n && typeof n.addRule == r )
            {
                n.addRule( ac, Y )
            }
        }
        else
        {
            if ( n && typeof j.createTextNode != D )
            {
                n.appendChild( j.createTextNode( ac + " {" + Y + "}" ) )
            }
        }
    }

    function w( Z, X )
    {
        if ( !m )
        {
            return
        }
        var Y = X ? "visible" : "hidden";
        if ( J && c( Z ) )
        {
            c( Z ).style.visibility = Y
        }
        else
        {
            v( "#" + Z, "visibility:" + Y )
        }
    }

    function L( Y )
    {
        var Z = /[\\\"<>\.;]/;
        var X = Z.exec( Y ) != null;
        return X && typeof encodeURIComponent != D ? encodeURIComponent( Y ) : Y
    }

    var d = function ()
    {
        if ( M.ie && M.win )
        {
            window.attachEvent( "onunload", function ()
            {
                var ac = I.length;
                for ( var ab = 0; ab < ac; ab++ )
                {
                    I[ab][0].detachEvent( I[ab][1], I[ab][2] )
                }
                var Z = N.length;
                for ( var aa = 0; aa < Z; aa++ )
                {
                    y( N[aa] )
                }
                for ( var Y in M )
                {
                    M[Y] = null
                }
                M = null;
                for ( var X in swfobject )
                {
                    swfobject[X] = null
                }
                swfobject = null
            } )
        }
    }();
    return {
        registerObject: function ( ab, X, aa, Z )
        {
            if ( M.w3 && ab && X )
            {
                var Y = {};
                Y.id = ab;
                Y.swfVersion = X;
                Y.expressInstall = aa;
                Y.callbackFn = Z;
                o[o.length] = Y;
                w( ab, false )
            }
            else
            {
                if ( Z )
                {
                    Z( {success: false, id: ab} )
                }
            }
        }, getObjectById: function ( X )
        {
            if ( M.w3 )
            {
                return z( X )
            }
        }, embedSWF: function ( ab, ah, ae, ag, Y, aa, Z, ad, af, ac )
        {
            var X = {success: false, id: ah};
            if ( M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y )
            {
                w( ah, false );
                K( function ()
                {
                    ae += "";
                    ag += "";
                    var aj = {};
                    if ( af && typeof af === r )
                    {
                        for ( var al in af )
                        {
                            aj[al] = af[al]
                        }
                    }
                    aj.data = ab;
                    aj.width = ae;
                    aj.height = ag;
                    var am = {};
                    if ( ad && typeof ad === r )
                    {
                        for ( var ak in ad )
                        {
                            am[ak] = ad[ak]
                        }
                    }
                    if ( Z && typeof Z === r )
                    {
                        for ( var ai in Z )
                        {
                            if ( typeof am.flashvars != D )
                            {
                                am.flashvars += "&" + ai + "=" + Z[ai]
                            }
                            else
                            {
                                am.flashvars = ai + "=" + Z[ai]
                            }
                        }
                    }
                    if ( F( Y ) )
                    {
                        var an = u( aj, am, ah );
                        if ( aj.id == ah )
                        {
                            w( ah, true )
                        }
                        X.success = true;
                        X.ref = an
                    }
                    else
                    {
                        if ( aa && A() )
                        {
                            aj.data = aa;
                            P( aj, am, ah, ac );
                            return
                        }
                        else
                        {
                            w( ah, true )
                        }
                    }
                    if ( ac )
                    {
                        ac( X )
                    }
                } )
            }
            else
            {
                if ( ac )
                {
                    ac( X )
                }
            }
        }, switchOffAutoHideShow: function ()
        {
            m = false
        }, ua: M, getFlashPlayerVersion: function ()
        {
            return {major: M.pv[0], minor: M.pv[1], release: M.pv[2]}
        }, hasFlashPlayerVersion: F, createSWF: function ( Z, Y, X )
        {
            if ( M.w3 )
            {
                return u( Z, Y, X )
            }
            else
            {
                return undefined
            }
        }, showExpressInstall: function ( Z, aa, X, Y )
        {
            if ( M.w3 && A() )
            {
                P( Z, aa, X, Y )
            }
        }, removeSWF: function ( X )
        {
            if ( M.w3 )
            {
                y( X )
            }
        }, createCSS: function ( aa, Z, Y, X )
        {
            if ( M.w3 )
            {
                v( aa, Z, Y, X )
            }
        }, addDomLoadEvent: K, addLoadEvent: s, getQueryParamValue: function ( aa )
        {
            var Z = j.location.search || j.location.hash;
            if ( Z )
            {
                if ( /\?/.test( Z ) )
                {
                    Z = Z.split( "?" )[1]
                }
                if ( aa == null )
                {
                    return L( Z )
                }
                var Y = Z.split( "&" );
                for ( var X = 0; X < Y.length; X++ )
                {
                    if ( Y[X].substring( 0, Y[X].indexOf( "=" ) ) == aa )
                    {
                        return L( Y[X].substring( (Y[X].indexOf( "=" ) + 1) ) )
                    }
                }
            }
            return ""
        }, expressInstallCallback: function ()
        {
            if ( a )
            {
                var X = c( R );
                if ( X && l )
                {
                    X.parentNode.replaceChild( l, X );
                    if ( Q )
                    {
                        w( Q, true );
                        if ( M.ie && M.win )
                        {
                            l.style.display = "block"
                        }
                    }
                    if ( E )
                    {
                        E( B )
                    }
                }
                a = false
            }
        }
    }
}();
/* jQuery hashchange event - v1.3 - 7/21/2010 http://benalman.com/projects/jquery-hashchange-plugin/ Copyright (c) 2010 "Cowboy" Ben Alman Dual licensed under the MIT and GPL licenses. http://benalman.com/about/license/ */
(function ( $, e, b )
{
    var c = "hashchange", h = document, f, g = $.event.special, i = h.documentMode, d = "on" + c in e && (i === b || i > 7);

    function a( j )
    {
        j = j || location.href;
        return "#" + j.replace( /^[^#]*#?(.*)$/, "$1" )
    }

    $.fn[c] = function ( j )
    {
        return j ? this.bind( c, j ) : this.trigger( c )
    };
    $.fn[c].delay = 50;
    g[c] = $.extend( g[c], {
        setup: function ()
        {
            if ( d )
            {
                return false
            }
            $( f.start )
        }, teardown: function ()
        {
            if ( d )
            {
                return false
            }
            $( f.stop )
        }
    } );
    f = (function ()
    {
        var j = {}, p, m = a(), k = function ( q )
        {
            return q
        }, l = k, o = k;
        j.start = function ()
        {
            p || n()
        };
        j.stop = function ()
        {
            p && clearTimeout( p );
            p = b
        };
        function n()
        {
            var r = a(), q = o( m );
            if ( r !== m )
            {
                l( m = r, q );
                $( e ).trigger( c )
            }
            else
            {
                if ( q !== m )
                {
                    location.href = location.href.replace( /#.*/, "" ) + q
                }
            }
            p = setTimeout( n, $.fn[c].delay )
        }

        $.browser.msie && !d && (function ()
        {
            var q, r;
            j.start = function ()
            {
                if ( !q )
                {
                    r = $.fn[c].src;
                    r = r && r + a();
                    q = $( '<iframe tabindex="-1" title="empty"/>' ).hide().one( "load", function ()
                    {
                        r || l( a() );
                        n()
                    } ).attr( "src", r || "javascript:0" ).insertAfter( "body" )[0].contentWindow;
                    h.onpropertychange = function ()
                    {
                        try
                        {
                            if ( event.propertyName === "title" )
                            {
                                q.document.title = h.title
                            }
                        }
                        catch ( s )
                        {
                        }
                    }
                }
            };
            j.stop = k;
            o = function ()
            {
                return a( q.location.href )
            };
            l = function ( v, s )
            {
                var u = q.document, t = $.fn[c].domain;
                if ( v !== s )
                {
                    u.title = h.title;
                    u.open();
                    t && u.write( '<script>document.domain="' + t + '"<\/script>' );
                    u.close();
                    q.location.hash = v
                }
            }
        })();
        return j
    })()
})( jQuery, this );
/* End Plugins */