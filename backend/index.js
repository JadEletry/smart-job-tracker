const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());


app.post("/api/analyze", async (req, res) => {
    const { jobDescription } = req.body;

    if (!jobDescription) {
        return res.status(400).json({ error: "Missing description" });
    }

    const prompt = `Analyze the following job description. Summarize the role, list the key skills required, and suggest an action the applicant should take.\n\n${jobDescription}`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        console.log("Full Groq API response:", JSON.stringify(data, null, 2));

        // Check if choices exists and has a message
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return res.status(500).json({ error: "Groq returned an unexpected format", raw: data });
        }

        res.json({ result: data.choices[0].message.content });
    } catch (err) {
        console.error("Groq API call failed:", err);
        res.status(500).json({ error: "Groq API error" });
    }
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
