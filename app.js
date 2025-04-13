const express = require("express");
const rateLimit = require("express-rate-limit");
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(express.json()); // For parsing JSON body

// Your Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 2,
    message: "Too many requests, please try again later."
});

app.get("/", limiter, (req, res) => {
    console.log(req.ip)
    res.json({ message: "Hello World" })
});

// Route to send SMS
app.post("/send-sms", limiter, async (req, res) => {
    try {
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ 
                error: "Please provide both 'to' phone number and 'message'" 
            });
        }

        const sms = await client.messages.create({
            body: message,
            to: to,  // The recipient's phone number
            from: twilioPhone // Your Twilio phone number
        });

        res.json({ 
            success: true, 
            messageId: sms.sid,
            status: sms.status
        });

    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ 
            error: "Failed to send SMS",
            details: error.message 
        });
    }
});

app.listen(3000, () => {
    console.log("SMS Server is running on port 3000");
});

