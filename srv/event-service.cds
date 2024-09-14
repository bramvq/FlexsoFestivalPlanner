using flexso.events as events from '../db/schema';

service EventService {
    entity Artists      as projection on events.Artists;
    entity Events       as projection on events.Events;
    entity Stages       as projection on events.Stages;
    entity Performances as projection on events.Performances;
    action reschedulePerformance(performanceID : UUID, newStartTime : Timestamp, newEndTime : Timestamp) returns Performances;

}
