const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

// Replace with your Google API Key
const genAI = new GoogleGenerativeAI("####AIzaSyCy2tz5NP3XoKrqLAp_RcYXTwTYIuiFjy8####");

//Remove #### from API key before running the server

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));