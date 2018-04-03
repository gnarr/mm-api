const sqlite = require("sqlite");
const dbPromise = sqlite.open("./database.sqlite", { Promise });
const glicko2 = require("glicko2");

const settings = {
  tau: 0.5,
  rating: 1500,
  rd: 200,
  vol: 0.06
};
const ranking = new glicko2.Glicko2(settings);

module.exports = class Rank {
  constructor(steamId, json) {
    this.steamId = steamId;
    this.rank = json
      ? ranking.makePlayer(json.rating, json.deviation, json.volatility)
      : ranking.makePlayer();
  }

  // must be called with await for async access.
  static async load(steamId) {
    try {
      const db = await dbPromise;
      const rank = await db.get(
        `
        SELECT 
          steamId, rating, deviation, volatility
        FROM 
          Ranks 
        WHERE
          steamId = ?`,
        steamId
      );
      const newRank = new Rank(steamId, rank);
      return newRank;
    } catch (err) {
      console.log(err);
    }
  }

  async save() {
    try {
      const db = await dbPromise;
      await db.run(
        `
        INSERT OR REPLACE INTO 
          Ranks 
        (steamId, rating, deviation, volatility)
        VALUES (?, ?, ?, ?)`,
        this.steamId,
        this.rank.getRating(),
        this.rank.getRd(),
        this.rank.getVol()
      );
    } catch (err) {
      console.log(err);
    }
  }
};

/* const glicko2 = require("glicko2");

const settings = {
  tau: 0.5,
  rating: 1500,
  rd: 200,
  vol: 0.06
};

const glicko = new glicko2.Glicko2(settings);

const t1p1 = glicko.makePlayer();
const t1p2 = glicko.makePlayer();
const t1p3 = glicko.makePlayer();
const t1p4 = glicko.makePlayer();
const t1p5 = glicko.makePlayer();

const t2p1 = glicko.makePlayer();
const t2p2 = glicko.makePlayer();
const t2p3 = glicko.makePlayer();
const t2p4 = glicko.makePlayer();
const t2p5 = glicko.makePlayer();

const match1 = glicko.makeRace([
  [t1p1, t1p2, t1p3, t1p4, t1p5],
  [t2p1, t2p2, t2p3, t2p4, t2p5]
]);

glicko.updateRatings(match1);

console.log("t1p1 new rating: " + t1p1.getRating());
console.log("t1p1 new rating deviation: " + t1p1.getRd());
console.log("t1p1 new volatility: " + t1p1.getVol());

console.log("t2p1 new rating: " + t2p1.getRating());
console.log("t2p1 new rating deviation: " + t2p1.getRd());
console.log("t2p1 new volatility: " + t2p1.getVol());

const match2 = glicko.makeRace([
  [t2p1, t2p2, t2p3, t2p4, t2p5],
  [t1p1, t1p2, t1p3, t1p4, t1p5]
]);

glicko.updateRatings(match2);

console.log("t1p1 new rating: " + t1p1.getRating());
console.log("t1p1 new rating deviation: " + t1p1.getRd());
console.log("t1p1 new volatility: " + t1p1.getVol());

console.log("t2p1 new rating: " + t2p1.getRating());
console.log("t2p1 new rating deviation: " + t2p1.getRd());
console.log("t2p1 new volatility: " + t2p1.getVol());

const match3 = glicko.makeRace([
  [t1p1, t1p2, t1p3, t1p4, t1p5],
  [t2p1, t2p2, t2p3, t2p4, t2p5]
]);

glicko.updateRatings(match3);

console.log("t1p1 new rating: " + t1p1.getRating());
console.log("t1p1 new rating deviation: " + t1p1.getRd());
console.log("t1p1 new volatility: " + t1p1.getVol());

console.log("t2p1 new rating: " + t2p1.getRating());
console.log("t2p1 new rating deviation: " + t2p1.getRd());
console.log("t2p1 new volatility: " + t2p1.getVol());
 */
