if (process.env.NODE !== 'production') {
    require('dotenv').config({ path: "../../.secrets/.env" });
}

const fs = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');

module.exports = csv_parser = async (array) => {
    try {
        const filePath = process.env.GLOBAL_INVESTORS_PATH;
        const fileExists = existsSync(filePath);

        // Map the array of objects to an array of CSV lines
        const csvLines = array.map(investor => {
            return `${Object.values(investor)}\t`
        })

        // Add headers only if the file does not exist
        if (!fileExists) {
            const header = Object.keys(array[0]);
            const content = [header, ...csvLines].join('\n') + '\n';
            await fs.writeFile(filePath, content);
            return 'File has been saved!';
        } else {
            const content = csvLines.join('\n') + '\n';
            await fs.appendFile(filePath, content);
            return 'File has been updated!';
        }

    } catch (error) {
        console.error("Error writing CSV:", error.message);
        throw error; // Re-throw the error for the caller to handle
    }
}
