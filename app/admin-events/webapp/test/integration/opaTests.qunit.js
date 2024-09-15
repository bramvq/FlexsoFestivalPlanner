sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'adminevents/adminevents/test/integration/FirstJourney',
		'adminevents/adminevents/test/integration/pages/EventsList',
		'adminevents/adminevents/test/integration/pages/EventsObjectPage'
    ],
    function(JourneyRunner, opaJourney, EventsList, EventsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('adminevents/adminevents') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheEventsList: EventsList,
					onTheEventsObjectPage: EventsObjectPage
                }
            },
            opaJourney.run
        );
    }
);