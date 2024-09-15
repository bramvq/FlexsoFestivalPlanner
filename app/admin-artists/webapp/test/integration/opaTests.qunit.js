sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'adminartists/test/integration/FirstJourney',
		'adminartists/test/integration/pages/ArtistsList',
		'adminartists/test/integration/pages/ArtistsObjectPage'
    ],
    function(JourneyRunner, opaJourney, ArtistsList, ArtistsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('adminartists') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheArtistsList: ArtistsList,
					onTheArtistsObjectPage: ArtistsObjectPage
                }
            },
            opaJourney.run
        );
    }
);