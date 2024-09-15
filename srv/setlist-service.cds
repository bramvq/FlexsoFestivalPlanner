using flexso.events as events from '../db/schema';

service SetlistService {
  entity Artists as projection on events.Artists;
  action searchArtists(searchTerm : String) returns String;
}
