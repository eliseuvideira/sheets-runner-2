import { google } from "googleapis";

export const sheets = google.sheets({
  version: "v4",
  auth: new google.auth.JWT(
    process.env.GOOGLE_AUTH_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_AUTH_PRIVATE_KEY,
    ["https://www.googleapis.com/auth/spreadsheets"],
  ),
});
