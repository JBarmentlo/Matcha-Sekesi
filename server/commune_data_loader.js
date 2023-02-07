const fs = require("fs");
const { parse } = require("csv-parse");
const db       = require("./src/db/sql.conn");
const cliProgress       = require('cli-progress');
const bar1              = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);



async function insert_city(postal, lat, long, name) {
  try {
    return await db.query(`
    INSERT INTO VILLEPOSTAL
      (code_postal, latitude, longitude, nom_commune)
      VALUES (?, ?, ?, ?)`,
      [postal, lat, long, name])
  } 
  catch (e) {
    console.log(name,postal, lat, long)
    console.log(e)
  }
}
cities = []
function do_the_thing() {
  total = 39202
  done = 0
	bar1.start(total, 0);
  fs.createReadStream("./communes-departement-region.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {
    if (row[2] != '' && row[5] != '' && row[6] != '' && row[9] != '') {
      cities.push((row[2], row[5], row[6], row[9]))
      await insert_city(row[2], row[5], row[6], row[9])
      done += 1
			bar1.update(done)
    }
  })
  .on("error", function (error) {
    console.log(error.message);
  });
}
do_the_thing()
console.log(cities)