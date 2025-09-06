if(process.env.NODE !=='production'){
    require('dotenv').config({path:"../../.secrets/.env"})
}


const fs = require("fs");
const axios = require("axios");
const { Parser } = require("json2csv");
const csv_parser = require("../utils/csv-parser")

const ENDPOINT = process.env.WIKIDATA_URL;
const USER_AGENT = process.env.WIKI_USER_AGENT;

const PAGE_SIZE = 500;
const SLEEP_MS = 1000;

const buildQuery = (limit, offset) => `
SELECT ?org ?orgLabel ?orgWebsite ?ceo ?ceoLabel ?orgEmail ?ceoEmail WHERE {
  ?org wdt:P169 ?ceo.
  OPTIONAL { ?org wdt:P856 ?orgWebsite. }
  OPTIONAL { ?org wdt:P968 ?orgEmail. }
  OPTIONAL { ?ceo wdt:P968 ?ceoEmail. }
  FILTER (BOUND(?orgEmail) || BOUND(?ceoEmail))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT ${limit}
OFFSET ${offset}

`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPage(limit, offset) {
  const query = buildQuery(limit, offset);
  const res = await axios.get(ENDPOINT, {
    params: { query, format: "json" },
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/sparql-results+json"
    }
  });
  return res.data;
}

async function run() {
  let offset = 0;
  let totalRows = 0;

  while (true) {
    console.log(`Fetching ${PAGE_SIZE} rows!`);
    const data = await fetchPage(PAGE_SIZE, offset);
    const bindings = data.results.bindings

    if (bindings.length === 0) break;
    
    const ceos = bindings.map((obj) => {
      // obj.email.replace(/^Email:/, "");
      // console.log(obj)
      const ceoEmail = obj.ceoEmail ? obj.ceoEmail.value : "";
      const orgEmail = obj.orgEmail ? obj.orgEmail.value : "";
      let email = ceoEmail || orgEmail
      if (!email) return null; // skip if no email
      // console.log(email)
      email = email.replace(/^mailto:/, "");
      return{
        name : obj.ceoLabel.value,
        email : email,
        website_url : obj.orgWebsite ? obj.orgWebsite.value : ""
      }
    }).filter(Boolean); // Remove null duplicates

    // console.log(ceos)
    const result = await csv_parser(ceos)
    console.log("Result : ", result)

    await sleep(SLEEP_MS);

  }

  console.log(`Done! Exported ${totalRows} rows with emails to ${process.env.GLOBAL_INVESTORS_PATH}`);
}

run();
