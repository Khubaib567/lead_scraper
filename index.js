const prompt = require('prompt-sync')();
const linkedinLeads = require("./middleware/leads/scrapelinkedin");
const facebookLeads = require("./middleware/leads/scrapefb")
const {sendBulkEmails , getEmailsFromCSV} = require("../SCRAPING/middleware/utils/utils")
const server = require("../SCRAPING/middleware/utils/server")

if(process.env.NODE !=='production'){
    require('dotenv').config({path:"./.secrets/.env"})
}



console.log(`Welcome to Web Scraper Search Engine
1- Get Linkedln Leads. 
2- Get Facebook Leads (Depreciated).
3- Get TikTok Leads.
4- Get Google Map Leads.
5- Get Yelp Leads.
6- Get Raw CEO(s) Leads.
7- Get Raw Investor(s) Leads.
8- Send Emails in Bulk to CEO(s).
9- Send Emails in Bulk to Investors(s).
`)

const option = parseInt(prompt('Please select the following options: '))

const webScraper = async (option) => {
    if (option === 1) {
    return linkedinLeads()
    }

    if(option === 2) {
        return facebookLeads()
    }

    if(option === 3) {
        return console.log("This Service is Currently Not Available!")
    }

    if(option === 4) {
        return console.log("This Service is Currently Not Available!")
    }

    if(option === 5) {
        return console.log("This Service is Currently Not Available!")
    }

    if(option === 6) {
        const navigatePath = "http://localhost:3000/ceos"
        console.log(`Navigate on ${navigatePath}`)
        return server
    }

    if(option === 7) {
        const navigatePath = "http://localhost:3000/investors"
        console.log(`Navigate on ${navigatePath}`)
        return server
    }

    if (option === 8) {
        const path = process.env.CEO_PATH
        const emails = await getEmailsFromCSV(path)
        if (emails.length === 0) {
        return res.json({ message: "No emails found." });
        }
        return sendBulkEmails(emails)
    }

    if (option === 9) {
        const path = process.env.INVESTOR_PATH
        const emails = await getEmailsFromCSV(path)
        if (emails.length === 0) {
        return res.json({ message: "No emails found." });
        }
        return sendBulkEmails(emails)
    }

    else console.log('System is exited!')
}

webScraper(option)




        