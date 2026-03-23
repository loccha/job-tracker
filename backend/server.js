import dotenv from "dotenv";
import express from 'express';

import multer from 'multer';
import path from "path";
import fs from "fs";

import cors from "cors";
import { Pool } from 'pg';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

app.use(cors({
    origin: '*',
}));           // Enable Cross-Origin Resource Sharing

app.use(express.json());    // Parse JSON request bodies


const PORT = process.env.PORT || 3000;
const database = "jobs";

// Database connection pool configuration
// Uses environment variables for secure credential management
/*const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});*/

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("railway") ? { rejectUnauthorized: false } : false
});

// Establish database connection
await pool.connect();

/**
 * GET /api
 * Retrieves all job applications from the database
 * Returns jobs ordered by creation date
 */
app.get('/api', async(req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM ${database} ORDER BY created_at`);
        res.json(result.rows);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// Serve uploaded files statically from the uploads directory
app.use('/uploads', express.static('uploads'));

// File upload configuration using Multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // Generate unique filename using timestamp + pdf extension
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage })


/**
 * POST /api/upsert-file
 * Handles single file upload (CV or cover letter)
 * Returns the generated filename for database reference
 */
app.post('/api/upsert-file', upload.single('file'), async (req, res) => {
    try {
        //delete old file if there is one
        if(req.body.old_url){
            const relativePathUrl = "." + new URL(req.body.old_url).pathname;
            await fs.promises.unlink(relativePathUrl);
        }

        res.json({filename: req.file.filename});
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
});


/**
 * POST /api/jobs
 * Creates a new job application entry
 * Accepts job details including uploaded file references
 * TODO: Implement comprehensive data validation
 */
app.post('/api/jobs', async (req, res) => {
    //console.log(req.body); // debug log request body

    const { title, company, shortDescription, description, applyingDate, interviewDate, screeningCompleted, link, cvUrl, cvOriginalName, letterUrl, letterOriginalName, confidenceScore, status, personnalNotes } = req.body;
    try {
        const safeInterviewDate = interviewDate || null;
        const query = {
            text: `INSERT INTO ${database}(title, company, short_description, description, applying_date, interview_date, screening_completed, link, cv_url, cv_original_name, letter_url, letter_original_name, confidence_score, status, personnal_notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            values: [title, company, shortDescription, description, applyingDate, safeInterviewDate, screeningCompleted, link, cvUrl, cvOriginalName, letterUrl, letterOriginalName, confidenceScore, status, personnalNotes],
        };
        const result = await pool.query(query);
        res.status(201).json(result.rows[0]);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
});


/**
 * PUT /api/jobs/:id
 * Updates an existing job application by ID
 * TODO: Implement comprehensive data validation
 */
app.put('/api/jobs/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { title, company, shortDescription, description, applyingDate, interviewDate, screeningCompleted, link, cvUrl, cvOriginalName, letterUrl, letterOriginalName, confidenceScore, status, personnalNotes } = req.body;
        
        const safeApplyingDate = applyingDate || null;
        const safeInterviewDate = interviewDate || null;

        const query = {
            text: `UPDATE ${database} SET title = $1, company = $2, short_description = $3, description = $4, applying_date = $5, interview_date = $6, screening_completed = $7, link = $8, cv_url = $9, cv_original_name = $10, letter_url = $11, letter_original_name = $12, confidence_score = $13, status = $14, personnal_notes = $15 WHERE id = $16 RETURNING *`,
            values: [title, company, shortDescription, description, safeApplyingDate, safeInterviewDate, screeningCompleted, link, cvUrl, cvOriginalName, letterUrl, letterOriginalName, confidenceScore, status, personnalNotes, id],
        };

        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
});


/**
 * DELETE /api/delete/:id
 * Removes a job application from the database by ID
 */
app.delete('/api/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const urls_query = {
            text: `SELECT cv_url, letter_url from ${database} WHERE id = $1`,
            values: [id],
        };

        const urls_response = await pool.query(urls_query);
        const row = urls_response.rows[0];

        if(row.cv_url){
            const relativePathCvUrl = "." + new URL(row.cv_url).pathname;
            await fs.promises.unlink(relativePathCvUrl);
        }

        if(row.letter_url){
            const relativePathLetterUrl = "." + new URL(row.letter_url).pathname;
            await fs.promises.unlink(relativePathLetterUrl);
        }

        const delete_query = {
            text:`DELETE FROM ${database} WHERE id = $1`,
            values: [id],
        };

        await pool.query(delete_query);

        res.json({ message: "Entry and files successfully deleted" });
        
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});


// Start server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});    

