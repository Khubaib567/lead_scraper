const CDP = require('chrome-remote-interface');

async function getFacebookCookies() {
    let client;
    try {
        client = await CDP();
        const { Network, Page } = client;

        await Network.enable();

        // Optional: Add CORS override headers (for resource loading)
        await Network.setExtraHTTPHeaders({
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }
        });

        await Page.enable();

        // Navigate to Facebook
        const targetUrl = 'https://www.facebook.com';
        console.log(`Navigating to ${targetUrl}...`);
        await Page.navigate({ url: targetUrl });
        await Page.loadEventFired();

        console.log('Page loaded. Fetching cookies...');

        // Get all cookies from the browser context
        const { cookies } = await Network.getAllCookies();

        // Filter cookies for Facebook domain
        const facebookCookies = cookies.filter(cookie =>
            cookie.domain.includes('facebook.com')
        );

        // Convert cookies to header format
        const cookieHeader = facebookCookies.map(c => `${c.name}=${c.value}`).join('; ').split(" ")[0].replace(/;/g, "");

        // console.log('Facebook Cookies:', facebookCookies);
        console.log('Cookie Header:', cookieHeader);
        return cookieHeader;

        // Optional: Save cookies as JSON
        // require('fs').writeFileSync('facebook-cookies.json', JSON.stringify(facebookCookies, null, 2));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

getFacebookCookies();
