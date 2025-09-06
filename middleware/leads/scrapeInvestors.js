if(process.env.NODE !=='production'){
    require('dotenv').config({path:"../../.secrets/.env"})

}

const axios = require("axios");
const cheerio = require("cheerio");
const investorDetails = require("../utils/investorDetails")
const csv_parser = require("../utils/csv-parser")

// Facebook page URL
const GLOBAL_INVESTORS = process.env.GLOBAL_INVESTORS_URL; // Replace with actual

module.exports = scrapeInvestors = async ()  => {
  try {
    console.log("Fetching Investor page with Axios & CookieJar...");
    const response = await axios.get(GLOBAL_INVESTORS, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    });

    const html = response.data;

    const $ = cheerio.load(html);

    const pageTitle = $("head > title").text();
    
    // TITLE PAGE
    // BREAK THE CODE IF HTML RESPONSE IS EMPTY.
    if(!pageTitle) console.log("Response is Empty!")

    console.log("Page Title:", pageTitle);

    // fs.writeFileSync(process.env.GLOBAL_INVESTORS_PATH, $.html());
    // console.log("Data has scrapped on following path: " , process.env.INVESTOR)
    
    // INITIALIZE INVESTORS
    let investors = []; 
    const investor_table = $("div.vc_row.wpb_row.td-pb-row:nth-child(4)");  
    const investorContainer = investor_table.find('div > div > div > div.wpb_text_column.wpb_content_element > div > table > tbody > tr > td');
    
    investorContainer.each( async (i,el) => {
      const url = $(el).find('a').attr('href')
      if(!url) return null;
      const investor = await investorDetails(url)
      // console.log(investor)
      if(investor) investors.push(investor)
      // console.log(investors.length)
    })

    setTimeout( async () => {
      // console.log(investors);
      const result = await csv_parser(investors)
      console.log("Result : ", result)

    }, 2000);
   
  } catch (error) {
    console.error("Error:", error.message);
  }
}

scrapeInvestors();
