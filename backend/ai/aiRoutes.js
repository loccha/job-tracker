import express from "express";
import { autoFill } from "./aiServices.js"

const router = express.Router();

router.post("/autofill", async(req, res) => {
    try {
        const { link } = req.body;
        const { title, company, shortDescription } = await autoFill(link);
        res.json({ title, company, shortDescription });
    } catch(e){
        res.status(500).json({ error: e.message });
    }
});

export default router;