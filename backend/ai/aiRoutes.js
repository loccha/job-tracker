import express from "express";
import { generateScore } from "./aiServices.js"

const router = express.Router();

router.post("/generate-score", async(req, res) => {
    try {
        const { description, cv_text } = req.body;
        const { score } = await generateScore(description, cv_text);
        res.json({ score });
    } catch(e){
        res.status(500).json({ error: e.message });
    }
});

export default router;