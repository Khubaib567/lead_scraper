if(process.env.NODE !=='production'){
    require('dotenv').config({path:"../../.secrets/.env"})

}

const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const cheerio = require("cheerio");
const fs = require("fs");


// Facebook page URL
const FACEBOOK_URL = process.env.FACEBOOK_URL; // Replace with actual

// Your cookies (from browser)
const FACEBOOK_COOKIES = process.env.FACEBOOK_COOKIES;


module.exports = facebookLeads = async ()  => {
  try {
    // Initialize cookie jar and axios wrapper
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));

    // Add cookies to jar
    FACEBOOK_COOKIES.split(";").forEach(cookie => {
      jar.setCookieSync(cookie.trim(), FACEBOOK_URL);
    });

    console.log("Fetching Facebook page with Axios & CookieJar...");

    const response = await client.get(FACEBOOK_URL, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    });

    const html = response.data;

    const $ = cheerio.load(html);
    
    // BREAK THE CODE IF HTML RESPONSE IS EMPTY.
    if(!$("head > title").text()) {
      console.log("Response is Empty!")
      return;
    }

    // fs.writeFileSync(process.env.FACEBOOK_PATH, $.html());
    // console.log("Data has scrapped on following path: " , process.env.FACEBOOK_PATH)
    
    // TITLE PAGE
    const pageTitle = $("head > title").text();
    console.log("Page Title:", pageTitle);

    // COMMENTS
    const comments = $("span.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.xkrqix3.x1sur9pj").first().text()
    console.log("Comments: " , comments)

    // LIKES
    const likes = $('span.xt0b8zv.x1jx94hy.x1kmio9f.x1lbueug').text()
    console.log("Likes:", likes);


  } catch (error) {
    console.error("Error:", error.message);
  }
}

// facebookLeads();
