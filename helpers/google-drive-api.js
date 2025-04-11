const { google } = require("googleapis");
const path = require("path");

const SCOPES = "https://www.googleapis.com/auth/drive";

let oauth2Client = new google.auth.GoogleAuth({
  keyFile: "./googlekey.json",
  scopes: [SCOPES],
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

module.exports = {
  drive,
};
