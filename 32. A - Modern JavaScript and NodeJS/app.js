// **** Common JS import ****
// const express = require("express");

// const resHandler = require("./response-handler"); // Common JS import

// const app = express();

// app.get("/", resHandler); // Registering the resHandler function on the GET Middleware

// app.listen(3000);

// **** ES modules import: ****
import express from "express"; //

// import resHandler from "./response-handler.js"; // ES modules import when exported as default: Needs suffix!
import { resHandler } from "./response-handler.js"; // ES modules import when exported as single function: Needs suffix!

const app = express();

app.get("/", resHandler); // Registering the resHandler function on the GET Middleware

app.listen(3000);
