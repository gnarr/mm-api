const express = require("express");
const steam = require("steam-login");
const sqlite = require("sqlite");

const OpenID = require("./OpenID");
const SteamUser = require("./SteamUser");
const Rank = require("./Rank");

const app = express();

const dbPromise = sqlite.open("./database.sqlite", { Promise });

app.use(
  require("express-session")({
    resave: false,
    saveUninitialized: false,
    secret: "le secret"
  })
);
app.use(
  steam.middleware({
    realm: "http://localhost:4000",
    verify: "http://localhost:4000/verify",
    apiKey: process.argv[2]
  })
);

app.get("/", (req, res) => {
  res
    .send(
      req.user == null
        ? "<a href='/authenticate'>not logged in</a>"
        : "hello " + req.user.username
    )
    .end();
});

app.get("/authenticate", steam.authenticate(), (req, res) => {
  res.redirect("/");
});

app.get("/verify", steam.verify(), async (req, res) => {
  console.log(req);
  const openID = new OpenID(req.query);
  const steamUser = new SteamUser(req.user);
  steamUser.save();
  const rank = await Rank.load(steamUser.steamId);
  await rank.save();

  console.log(rank);

  res.send(req.user).end();
});

app.get("/logout", steam.enforceLogin("/"), (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(4000);
console.log("listening");
