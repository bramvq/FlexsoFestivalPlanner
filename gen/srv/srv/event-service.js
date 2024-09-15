const cds = require("@sap/cds"); // Importeer cds module voor database operaties

module.exports = async (srv) => {
  //
  // A. EVENTS
  //
  // 1. Valideer start- en einddatum van event
  srv.before("CREATE", "Events", (req) => {
    const { startDate, endDate } = req.data;
    if (new Date(startDate) > new Date(endDate)) {
      req.error(400, "Start datum moet voor eind datum liggen");
    }
  });

  // 2. Bereken de duur van een event
  srv.after("READ", "Events", (each) => {
    if (each.startDate && each.endDate) {
      const start = new Date(each.startDate);
      const end = new Date(each.endDate);
      each.duration = (end - start) / (1000 * 60 * 60 * 24) + 1; // Duur in dagen
    }
  });

  // 3. Voorkom verwijderen van events met performances
  srv.before("DELETE", "Events", async (req) => {
    const eventID = req.data.ID;
    const associatedPerformances = await SELECT.from(
      "flexso.events.Performances"
    ).where({ event_ID: eventID });
    if (associatedPerformances.length > 0) {
      req.error(
        400,
        "Kan event niet verwijderen, er zijn performances aan gekoppeld"
      );
    }
  });

  //
  // B. ARTISTS
  //

  //
  // C. PERFORMANCES
  //

  // 1. Automatisch eindtijd invullen voor performances (anderhalf uur)
  srv.before("CREATE", "Performances", (req) => {
    if (req.data.startTime && !req.data.endTime) {
      const startTime = new Date(req.data.startTime);
      req.data.endTime = new Date(startTime.getTime() + 1.5 * 60 * 60 * 1000); // Default anderhalf uur duur
    }
  });

  // 2. Check of start datum van performance binnen datums van event valt
  srv.before(["CREATE", "UPDATE"], "Performances", async (req) => {
    const { startTime, event_ID } = req.data;

    if (startTime && event_ID) {
      console.log("Event ID:", event_ID);
      // Haal het event op waaraan de performance gekoppeld is
      const event = await SELECT.one
        .from("flexso.events.Events")
        .where({ ID: event_ID });

      if (event) {
        const performanceDate = new Date(startTime);
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);

        // Controleer of de performance datum binnen de start- en einddatum van het event valt
        if (
          performanceDate < eventStartDate ||
          performanceDate > eventEndDate
        ) {
          req.error(400, "Performance datum valt niet binnen de event datums");
        }
      } else {
        req.error(404, "Event niet gevonden");
      }
    }
  });

  // 3. Voorkom overlapping van performances op hetzelfde podium
  srv.before("CREATE", "Performances", async (req) => {
    const { startTime, endTime, stage_ID } = req.data;
    const overlapping = await SELECT.from("flexso.events.Performances")
      .where({ stage_ID: stage_ID })
      .and(`startTime < '${endTime}' and endTime > '${startTime}'`);
    if (overlapping.length > 0) {
      req.error(409, "Dit tijdslot is al bezet");
    }
  });
};
