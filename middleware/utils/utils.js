const fs = require('fs')
const csv = require("csv-parser");
const path = require('path')

if(process.env.NODE !=='production'){
    require('dotenv').config({path:"../../.secrets/.env"})

}

const nodemailer = require("nodemailer");

const getEmailsFromCSV = (filePath) => {
  const route = path.join(__dirname , filePath);
  return new Promise((resolve, reject) => {
    const emails = [];
    fs.createReadStream(route)
      .pipe(csv())
      .on("data", (row) => {
        if (row.email) emails.push(row.email);
      })
      .on("end", () => {
        resolve(emails);
      })
      .on("error", (err) => reject(err));
  });
}

const sendBulkEmails = async (emails , index = 0) => {
   try {

      if (index >= emails.length) {
        console.log("All emails sent successfully.");
        return;
      }

      // Create a transporter (Gmail example)
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SENDER,
          pass: process.env.APP_PASSWORD  // Use App Password, NOT your real password
        }
      });

      const email = emails[index];

      // Email options
      let mailOptions = {
        from: process.env.SENDER,
        to:  email,
        subject: "Greetings From Eric Ton LLC",
        text: "Hello From Eric Ton LLC.",
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
        sendBulkEmails(emails, index + 1);
      });

    
   } catch (error) {
      console.error("Error: ", error)
   }

}


module.exports = {sendBulkEmails , getEmailsFromCSV}