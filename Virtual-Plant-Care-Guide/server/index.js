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

app.post("/generate-treatment", async (req, res) => {
    try {
        const { diseaseName, base64Image } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let prompt = diseaseName.startsWith("Healthy")
            ? "Can you recommend tips to protect this healthy plant?"
            : `${diseaseName} detected. Analyze this plant disease and provide step-by-step treatment instructions.`;

        const image = {
            inlineData: {
                data: base64Image.split(",")[1],
                mimeType: "image/png",
            },
        };

        const result = await model.generateContent([prompt, image]);
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate treatment." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
