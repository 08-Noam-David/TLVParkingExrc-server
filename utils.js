const fs = require("fs/promises");
const { PARKINGS_JSON_PATH } = require("./definitions.js");

async function updateParkings(parkings) {
  await fs.writeFile(PARKINGS_JSON_PATH, JSON.stringify(parkings), { encoding: "utf8" });
}

async function getParkings() {
  return JSON.parse(await fs.readFile(PARKINGS_JSON_PATH, "utf8"));
}

module.exports = {
  updateParkings,
  getParkings,
};
