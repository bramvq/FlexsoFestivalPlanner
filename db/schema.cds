namespace flexso.events;

entity Artists {
    key ID           : UUID;
        name         : String(100);
        performances : Association to many Performances
                           on performances.artist = $self;
}

entity Events {
    key ID           : UUID;
        name         : String(100);
        startDate    : Timestamp;
        endDate      : Timestamp;
        location     : String(200);
        stages       : Association to many Stages
                           on stages.event = $self;
        performances : Association to many Performances
                           on performances.event = $self;
}

entity Stages { //Voor het beheren van podia.
    key ID           : UUID;
        name         : String(50);
        event        : Association to Events;
        performances : Association to many Performances
                           on performances.stage = $self;
}

entity Performances { //Voor het beheren van optredens.
    key ID        : UUID;
        startTime : Timestamp;
        endTime   : Timestamp;
        artist    : Association to Artists;
        event     : Association to Events;
        stage     : Association to Stages;
}
