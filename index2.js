
const express = require("express");
const { google } = require('googleapis')
const sheets = google.sheets('v4');
const cors = require('cors');
//only use for local development, comment out for deploy
// require('dotenv').config()

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const spreadsheetId = process.env.SPREADSHEET_ID
// const sheetName = [{sheetName: "Sheet1", setName: "12-Team"}, {sheetName: "Sheet2", setName: "15-Team"}, {sheetName: "Sheet3", setName: "20-Team"}, {sheetName: "Sheet4", setName: "12-Team OBP"}, {sheetName: "Sheet5", setName: "15-Team OBP"}, {sheetName: "Sheet6", setName: "20-Team OBP"}]
const sheetName = [{sheetName: "RotoValues", setName: "Roto Values"}, {sheetName: "Points", setName: "Points"}]
const range = "A2:G"

const PORT = process.env.PORT || 3001;

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://dynasty-dugout-trade-calc.herokuapp.com'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'] // expose the header to the client
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOW-FROM https://beehiiv.com");
  next();
});



async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({spreadsheetId, auth}) {
    const res = await sheets.spreadsheets.get({
        spreadsheetId,
        auth,
    });
    return res;
}

    async function getSpreadSheetValues({spreadsheetId, auth, sheetName, range}) {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: `${sheetName}!${range}`
    });
    return res;
}


app.get("/api", async (req, res) => {
  try {
    const token = await getAuthToken()
    const response = await Promise.all(sheetName.map(async sheetObj => {
      const resp = await getSpreadSheetValues({spreadsheetId, auth: token, sheetName: sheetObj.sheetName, range})
      const data = resp.data
      return {data: data.values, setName: sheetObj.setName}
    }))
    res.json(response)
  } catch (e) {
    console.log(e)
  }

  

//  const response = await getAuthToken()
//     .then(auth => getSpreadSheetValues({spreadsheetId, auth, sheetName, range}))
//     .then(res => res.data)
//     .then(data => data.values)
//     // .then(res => console.log({res: JSON.stringify(res.data)}))
//     .catch(err => console.log({err}))
//   console.log({response})
//   res.json(response);
});

app.get("/", async (req,res) => {
  res.json("Server is healthy")
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  // console.log("Spreadsheet Id: " + spreadsheetId)
});

// https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f