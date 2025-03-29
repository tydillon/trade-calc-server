const express = require("express");
const { google } = require('googleapis')
const sheets = google.sheets('v4');
const cors = require('cors');
//only use for local development, comment out for deploy
// require('dotenv').config()

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const spreadsheetId = process.env.SPREADSHEET_ID
const tcSheetName = [{sheetName: "RotoValues", setName: "Roto Values"}, {sheetName: "Points", setName: "Points"}]
const tcRange = "A2:G"
const baRange = "A2:I"
const baSheetName = [{sheetName: "Dynasty", setName: "Dynasty"}, {sheetName: "Prospects", setName: "Prospects"}]

const PORT = process.env.PORT || 3001;

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://dynasty-dugout-trade-calc.herokuapp.com', 'https://www.thedynastydugout.com'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'] // expose the header to the client
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  next();
});

// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://www.thedynastydugout.com");
//   next();
// });

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

//TODO: remove this route from server after change deployed in front end
app.get("/api", async (req, res) => {
  try {
    const token = await getAuthToken()
    const response = await Promise.all(tcSheetName.map(async sheetObj => {
      const resp = await getSpreadSheetValues({spreadsheetId, auth: token, sheetName: sheetObj.sheetName, range: tcRange})
      const data = resp.data
      return {data: data.values, setName: sheetObj.setName}
    }))
    res.json(response)
  } catch (e) {
    console.log(e)
  }
});

app.get("/trade-calculator", async (req, res) => {
  try {
    const token = await getAuthToken()
    const response = await Promise.all(tcSheetName.map(async sheetObj => {
      const resp = await getSpreadSheetValues({spreadsheetId, auth: token, sheetName: sheetObj.sheetName, range: tcRange})
      const data = resp.data
      return {data: data.values, setName: sheetObj.setName}
    }))
    res.json(response)
  } catch (e) {
    console.log(e)
  }
});

app.get("/best-available", async (req, res) => {
  try {
    const token = await getAuthToken()
    const response = await Promise.all(baSheetName.map(async sheetObj => {
      const resp = await getSpreadSheetValues({spreadsheetId, auth: token, sheetName: sheetObj.sheetName, range: baRange})
      const data = resp.data
      return {data: data.values, setName: sheetObj.setName}
    }))
    res.json(response)
  } catch (e) {
    console.log(e)
  }
});

app.get("/", async (req,res) => {
  res.json("Server is healthy")
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  // console.log("Spreadsheet Id: " + spreadsheetId)
});

// https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f


