const sqlite = require("sqlite");
const dbPromise = sqlite.open("./database.sqlite", { Promise });

module.exports = class SteamUser {
  constructor(steamUser) {
    if (steamUser) {
      const json = steamUser._json;
      if (json) {
        this.fromJson(json);
      }
    }
  }

  async fromJson(json) {
    this.steamId = json.steamid || json.steamId;
    this.communityVisibilityState =
      json.communityvisibilitystate || json.communityVisibilityState;
    this.profileState = json.profilestate || json.profileState;
    this.personaName = json.personaname || json.personaName;
    this.lastLogoff = json.lastlogoff || json.lastLogoff;
    this.profileUrl = json.profileurl || json.profileUrl;
    this.avatar = json.avatar;
    this.avatarMedium = json.avatarmedium || json.avatarMedium;
    this.avatarFull = json.avatarfull || json.avatarFull;
    this.personaState = json.personastate || json.personaState;
    this.realName = json.realname || json.realName;
    this.primaryClanID = json.primaryclanid || json.primaryClanID;
    this.timeCreated = json.timecreated || json.timeCreated;
    this.personaStateFlags = json.personastateflags || json.personaStateFlags;
    this.locCountryCode = json.loccountrycode || json.locCountryCode;
    this.locStateCode = json.locstatecode || json.locStateCode;
    this.locCityId = json.loccityid || json.locCityId;
  }

  // must be called with await for async access.
  async load(steamId) {
    try {
      const db = await dbPromise;
      const user = await db.get(
        `
        SELECT 
          steamId, communityVisibilityState, profileState, personaName, 
          lastLogoff, profileUrl, avatar, avatarMedium, avatarFull, 
          personaState, realName, primaryClanID, timeCreated, personaStateFlags,
          locCountryCode, locStateCode, locCityId
        FROM 
          SteamUsers 
        WHERE
          steamId = ?`,
        steamId
      );
      await this.fromJson(user);
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
          SteamUsers 
        (steamId, communityVisibilityState, profileState, personaName, 
          lastLogoff, profileUrl, avatar, avatarMedium, avatarFull, 
          personaState, realName, primaryClanID, timeCreated, personaStateFlags,
          locCountryCode, locStateCode, locCityId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        this.steamId,
        this.communityVisibilityState,
        this.profileState,
        this.personaName,
        this.lastLogoff,
        this.profileUrl,
        this.avatar,
        this.avatarMedium,
        this.avatarFull,
        this.personaState,
        this.realName,
        this.primaryClanID,
        this.timeCreated,
        this.personaStateFlags,
        this.locCountryCode,
        this.locStateCode,
        this.locCityId
      );
    } catch (err) {
      console.log(err);
    }
  }
};
