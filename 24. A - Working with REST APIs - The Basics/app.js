const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const app = express();

// Parsing incoming JSON data from request bodies (applicaton/json)
app.use(bodyParser.json());

app.use("/feed", feedRoutes);

app.listen(8080);
