
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());


app.post("/send-segment", async (req, res) => {
  try {
    const payload = req.body;

    
    const WEBHOOK_URL = "https://webhook.site/e77d1123-1592-47c5-8867-70209ec926c3";

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Data forwarded to webhook:", payload);

    res.status(200).json({ message: "Data sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log(" Backend running on http://localhost:5000"));
