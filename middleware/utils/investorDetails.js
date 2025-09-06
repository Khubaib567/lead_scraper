const axios = require("axios")
const cheerio = require("cheerio")


module.exports = investorDetails = async (url) => {
    try {
        //  console.log("Investor URL: ",url)
        const response = await axios.get(url, {
            headers: {
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            }
        });

        if(response.status === 403) return null

        // console.log(response.status)
        
        const html = response.data;
        const $ = cheerio.load(html);

        const pageTitle = $("head > title").text();

        if(!pageTitle) console.log("Response is null!")

        const investorName = $("#contacts > main > section.PEIScalableTable_container__S9HHT > section > table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span:nth-child(2)").text()
        const emailString = $("#overview > article > main > aside.OverViewComponent_overview-content-details__fnBou > div:nth-child(4) > span > span").text()
        const website = $("#overview > article > main > aside.OverViewComponent_overview-content-details__fnBou > div:nth-child(3) > span > span").text()
        
        let email = emailString.replace(/^Email:/, "")
        let link = website.replace(/^Website:/, "")

        // BREAK THE CODE IF HTML RESPONSE IS EMPTY.
        if(!investorName && email && !link ) return null;
        
        if(!email) return null;
        // fs.writeFileSync(process.env.INVESTOR_DETAIL_PATH, $.html());
        // console.log("Data has scrapped on following path: " , process.env.INVESTOR_DETAIL_PATH)

        const investor = {
            name : investorName,
            email : email,
            website : link,
           
        }

        // console.log("Page Title:", pageTitle);
        return investor 
    } catch (error) {
        console.error("Fetching Error: " , error.message)
        return null;
    }

}

