import dotenv from "dotenv";
import express from 'express';

import multer from 'multer';
import path, { relative } from "path";
import fs from "fs";

import cors from "cors";
import { Pool } from 'pg';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

app.use(express.json());    // Parse JSON request bodies
app.use(cors());            // Enable Cross-Origin Resource Sharing

const PORT = 3000;

// Database connection pool configuration
// Uses environment variables for secure credential management
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
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
        const result = await pool.query('SELECT * FROM jobs_data ORDER BY created_at');
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
 * POST /api/upload-file
 * Handles single file upload (CV or cover letter)
 * Returns the generated filename for database reference
 */
app.post('/api/upload-file', upload.single('file'), (req, res) => {
    try {
        // return filename so client can reference it later
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
    console.log(req.body); // debug log request body

    const { title, company, shortDescription, description, applyingDate, interviewDate, link, cvUrl, letterUrl, confidenceScore, status } = req.body;
    try {
        const safeInterviewDate = interviewDate || null;
        const query = {
            text: 'INSERT INTO jobs_data(title, company, short_description, description, applying_date, interview_date, link, cv_url, letter_url, confidence_score, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            values: [title, company, shortDescription, description, applyingDate, safeInterviewDate, link, cvUrl, letterUrl, confidenceScore, status],
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
        const { title, company, shortDescription, description, applyingDate, interviewDate, link, cvUrl, letterUrl, confidenceScore, status } = req.body;

        const query = {
            text: 'UPDATE jobs SET title = $1, company = $2, short_description = $3, description = $4, applying_date = $5, interview_date = $6, link = $7, cv_url = $8, letter_url = $9, confidence_score = $10, status = $11 WHERE id = $12',
            values: [title, company, shortDescription, description, applyingDate, interviewDate, link, cvUrl, letterUrl, confidenceScore, status, id],
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
            text: 'SELECT cv_url, letter_url from jobs_data WHERE id = $1',
            values: [id],
        };

        const urls_response = await pool.query(urls_query);
        const relativePathCvUrl = "." + new URL(urls_response.rows[0].cv_url).pathname;

        const relativePathLetterUrl = "";
        if(urls_response.rows[0].letter_url){
            relativePathLetterUrl = "." + new URL(urls_response.rows[0].letter_url).pathname;
        }

        fs.unlink(relativePathCvUrl, (err) =>{
            if(err){
                return res.status(404).json({error : "Unable to find the file."});
            }
            res.json({ message: "File successfully deleted"});
        });

        if(relativePathLetterUrl){
            fs.unlink(relativePathLetterUrl, (err) =>{
                if(err){
                    return res.status(404).json({error : "Unable to find the file."})
                }
            res.json({ message: "File successfully deleted"})
            });
        }
        

        const delete_query = {
            text:'DELETE FROM jobs_data WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(delete_query);
        res.json(result.rows);
        
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});


// Start server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});    

