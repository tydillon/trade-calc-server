const express = require("express");
// const { google } = require('googleapis')
// const sheets = google.sheets('v4');

// export GOOGLE_APPLICATION_CREDENTIALS=./keys.json
// export GCLOUD_PROJECT=tactile-cinema-384614

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const spreadsheetId = process.env.SPREADSHEET_ID
const sheetName = "Sheet1"
const range = "A2:G"

const PORT = process.env.PORT || 3001;

const app = express();


// async function getAuthToken() {
//   const auth = new google.auth.GoogleAuth({
//     scopes: SCOPES
//   });
//   const authToken = await auth.getClient();
//   return authToken;
// }

// async function getSpreadSheet({spreadsheetId, auth}) {
//     const res = await sheets.spreadsheets.get({
//         spreadsheetId,
//         auth,
//     });
//     return res;
// }

//     async function getSpreadSheetValues({spreadsheetId, auth, sheetName, range}) {
//     const res = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         auth,
//         range: `${sheetName}!${range}`
//     });
//     return res;
// }


// app.get("/api", async (req, res) => {
//  const response = await getAuthToken()
//     .then(auth => getSpreadSheetValues({spreadsheetId, auth, sheetName, range}))
//     .then(res => res.data)
//     .then(data => data.values)
//     // .then(res => console.log({res: JSON.stringify(res.data)}))
//     .catch(err => console.log({err}))
//   console.log({response})
//   res.json(response);
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log("Spreadsheet Id: " + spreadsheetId)
});

// https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f
