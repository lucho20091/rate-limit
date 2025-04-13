const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 2,
    message: "Too many requests, please try again later."
})

app.get("/", limiter, (req, res) => {
    res.json({ message: "Hello World" })
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

