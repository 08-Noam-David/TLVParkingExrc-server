const fs = require("fs");
const { PARKINGS_JSON_PATH } = require("./definitions.js");

function updateParkings(parkings) {
  fs.writeFileSync(PARKINGS_JSON_PATH, JSON.stringify(parkings), "utf8");

}

function getParkings() {
  return JSON.parse(fs.readFileSync(PARKINGS_JSON_PATH, "utf8"));
}

module.exports = {
  updateParkings,
  getParkings,
};
