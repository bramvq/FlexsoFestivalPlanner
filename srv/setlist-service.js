const cds = require("@sap/cds");
const axios = require("axios");

module.exports = cds.service.impl(async function () {
  const { Artists } = this.entities;

  this.on("searchArtists", async (req) => {
    const searchTerm = req.data.searchTerm;

    // API call 
    try {
      const response = await axios.get(
        `https://api.setlist.fm/rest/1.0/search/artists`,
        {
          headers: {
            "x-api-key": "svzsU9pkrngbT_jcVAMLb4uQN1SUL9Ozzrh3",
            Accept: "application/json",
          },
          params: {
            artistName: searchTerm,
          },
        }
      );

      // Extract artist data
      const artists = response.data.artist.map((artist) => ({
        name: artist.name,
        id: artist.mbid, // MusicBrainz ID
      }));

      return artists;
    } catch (error) {
      console.error("Error fetching artists:", error);
      return { error: "Failed to fetch artists from Setlist.fm API" };
    }
  });
});
