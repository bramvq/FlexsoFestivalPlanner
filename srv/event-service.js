const cds = require("@sap/cds"); // Importeer cds module voor database operaties

module.exports = async (srv) => {
  // 1. Valideer start- en einddatum
  srv.before("CREATE", "Events", (req) => {
    const { startDate, endDate } = req.data;
    if (new Date(startDate) > new Date(endDate)) {
      req.error(400, "Start datum moet voor eind datum liggen");
    }
  });

  //TODO: errors.
  // // 2. Voorkom overlapping van performances op hetzelfde podium
  // srv.before("CREATE", "Performances", async (req) => {
  //   const { startTime, endTime, stage_ID } = req.data;
  //   const overlapping = await SELECT.from("Performances")
  //     .where({ stage_ID: stage_ID })
  //     .and(`startTime < '${endTime}' and endTime > '${startTime}'`);

  //   if (overlapping.length > 0) {
  //     req.error(409, "Dit tijdslot is al bezet");
  //   }
  // });

  // 3. Bereken de duur van een event
  srv.after("READ", "Events", (each) => {
    if (each.startDate && each.endDate) {
      const start = new Date(each.startDate);
      const end = new Date(each.endDate);
      each.duration = (end - start) / (1000 * 60 * 60 * 24) + 1; // Duur in dagen
    }
  });

  // // 4. Automatisch eindtijd invullen voor performances
  // srv.before("CREATE", "Performances", (req) => {
  //   if (req.data.startTime && !req.data.endTime) {
  //     const startTime = new Date(req.data.startTime);
  //     req.data.endTime = new Date(startTime.getTime() + 1.5 * 60 * 60 * 1000); // Default anderhalf uur duur
  //   }
  // });

  // // 5. Voorkom verwijderen van events met performances
  // srv.before("DELETE", "Events", async (req) => {
  //   const eventID = req.data.ID;
  //   const associatedPerformances = await SELECT.from("Performances").where({
  //     event_ID: eventID,
  //   });
  //   if (associatedPerformances.length > 0) {
  //     req.error(
  //       400,
  //       "Kan event niet verwijderen, er zijn performances aan gekoppeld"
  //     );
  //   }
  // });

  // // 6. Custom actie om performance te verplaatsen
  // srv.on("reschedulePerformance", async (req) => {
  //   const { performanceID, newStartTime, newEndTime } = req.data;
  //   await UPDATE("Performances")
  //     .set({ startTime: newStartTime, endTime: newEndTime })
  //     .where({ ID: performanceID });
  //   return SELECT.one.from("Performances").where({ ID: performanceID });
  // });

  // // 7. Check of start datum van performance binnen datums van event valt
  // srv.before(["CREATE", "UPDATE"], "Performances", async (req) => {
  //   const { startTime, event_ID } = req.data;

  //   if (startTime && event_ID) {
  //     const event = await SELECT.one.from("Events").where({ ID: event_ID });

  //     if (event) {
  //       const performanceDate = new Date(startTime);
  //       const eventStartDate = new Date(event.startDate);
  //       const eventEndDate = new Date(event.endDate);

  //       if (
  //         performanceDate < eventStartDate ||
  //         performanceDate > eventEndDate
  //       ) {
  //         req.error(400, "Performance datum valt niet binnen event datums");
  //       }
  //     } else {
  //       req.error(404, "Event niet gevonden");
  //     }
  //   }
  // });
};
