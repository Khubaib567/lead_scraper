if (process.env.NODE !== 'production') {
    require('dotenv').config({ path: "../../.secrets/.env" });
}

const express = require('express')
const app = express()
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const port = process.env.PORT

// require("./leads/ceos_with_emails.csv")

app.get('/ceos', (req, res) => {
  const results = [];
  const csvFilePath = path.join(__dirname, process.env.CEO_PATH); // Your CSV file path

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results); // Send JSON response
    });
})


app.get('/investors', (req, res) => {
  const results = [];
  const csvFilePath = path.join(__dirname , process.env.INVESTOR_PATH); // Your CSV file path

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results); // Send JSON response
    });
})

app.listen(port)

module.exports = app;