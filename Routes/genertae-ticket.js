const express = require("express");
const QRCode = require('qrcode');
const ticketRoute = express.Router();
const transporter = require("../Util/mailTransporter");
const htmlTemplate = require("../Util/ticket_html_template");
const Event = require("../Model/event");
const User = require("../Model/userModel");
const Tickets = require("../Model/ticket");
const mailTemplate = require("../Util/ticket_body_template");
const pdf = require('html-pdf');
const fs = require('fs');

ticketRoute.post("/", async (req, res) => {
  try{
const {userId, eventId, amountPaid, quantity, email, firstname} = req.body;
if (!userId || !eventId || !quantity ||!email || !firstname) {
 return res.json({status: "FAILED", data: "Incomplete Details"})
}
const event = await Event.findById(eventId);
const ticket = new Tickets({userId, eventId, amountPaid, quantity, email});
await ticket.save();

        const url = `https://localhost:3000/view/${ticket._id}`;
        const qrCodeImage = await QRCode.toDataURL(url);

        const template = htmlTemplate(qrCodeImage, firstname, event, ticket._id);
        const bodyTemplate = mailTemplate(firstname, event, ticket._id)
  pdf.create(template).toFile(`Order_${ticket._id}.pdf`, async (err, res) => {
      if (err) return  res.json({status: "FAILED", data: err});

      let message = {
        from: process.env.AUTH_USER, 
        to: "oluwaseunrobert44@gmail.com",
        subject: 'Eko-Diary: Your Purchase Was Successful!',
        html: bodyTemplate,
        attachments: [
        {
        path: `Order_${ticket._id}.pdf`
        }
      ]
      }
 await transporter.sendMail(message);
 fs.unlink(`Order_${ticket._id}.pdf`, function(err) {
  if(err && err.code == 'ENOENT') {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
  } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
  } else {
      console.info(`removed`);
  }
});
  });
 
          res.json({status: "SUCCESS", data: "Tickets has been sent to user's email."})
    }catch(err){
      console.log(err);
       res.json({status: "FAILED", data: err})
    }
});
module.exports = ticketRoute;