if (process.env.NODE !== 'production') {
    require('dotenv').config({path: "../../.secrets/.env"})
}


const puppeteer = require('puppeteer');


// Facebook page URL
const LINKEDIN_URL = process.env.LINKEDIN_URL; // Replace with actual
// console.log(LINKEDIN_URL)

// LINKEDIN PASSWORD 
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD
// console.log(LINKEDIN_PASSWORD)

// LINKEDIN EMAIL 
const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL
// console.log(LINKEDIN_EMAIL)


module.exports = linkedinLeads = async () => {
    // console.log(LINKEDIN_URL)
    try {
        //  console.log("Hello")    
        const browser = await puppeteer.launch({
            headless: true, // Set to true for headless mode
            defaultViewport: null
        });

        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(0);
        page.setDefaultTimeout(0);


        // Go to LinkedIn login page
        await page.goto(LINKEDIN_URL, {
            waitUntil: 'networkidle2',
        });

        // Type email
        await page.type('input#username', LINKEDIN_EMAIL , { delay: 100 });

        // console.log(password)
        // Type password
        await page.type('input#password', LINKEDIN_PASSWORD , { delay: 100 });

        // Click the login button
        await page.click('button[type="submit"]');

        // Wait for navigation after login
        await page.waitForNavigation();

        console.log('Logged in successfully!');

        const pathUrl = './leads/linkedin_feed.png'

        // Example: Take a screenshot of the feed page
        await page.screenshot({ path: pathUrl });

        console.log("Screenshot is saved at: ", pathUrl)

        // Example: Scrape some data from the feed page
        const pageTitle = await page.title();
        console.log('Page Title:', pageTitle);

        // Close browser
        await browser.close();

    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Call the function with your credentials
// linkedinLeads(LINKEDIN_EMAIL, LINKEDIN_PASSWORD);
