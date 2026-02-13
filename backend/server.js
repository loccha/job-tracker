import dotenv from "dotenv";
import express from 'express';
import cors from "cors";
import { Pool } from 'pg';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
await pool.connect();

app.get('/api', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY created_at');
        res.json(result.rows);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

async function uploadToCloudinary(file){
    try {
        const result = cloudinary.uploader.upload(file, { 
            use_filename: true
        }).then(
            result=>console.log(result)
        );
        return result
        
    } catch (e) {
            console.error("Erreur upload :", e.message);
    }
}

app.post('/api/upload-file', async(req, res) => {
    try {
        const { file } = req.body
        const result = await uploadToCloudinary(file)

        res.status(201).json(result);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
})

//TODO: data validation
app.post('/api/jobs', async (req, res) => {
    const { title, company, description, applying_date, interview_date, link, cv_url, letter_url, estimated_score, status } = req.body;

    try {
        const query = {
            text: 'INSERT INTO jobs(title, company, description, applying_date, interview_date, link, cv_url, letter_url, estimated_score, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            values: [title, company, description, applying_date, interview_date, link, cv_url, letter_url, estimated_score, status],
        }
        
        const result = await pool.query(query)
        res.status(201).json(result.rows[0]);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
});


//TODO: data validation
app.put('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, company, description, applying_date, interview_date, link, cv_url, letter_url, estimated_score, status } = req.body;

        const query = {
            text: 'UPDATE application SET title = $1, company = $2, description = $3, applying_date = $4, link = $5, cv_url = $6, letter_url = $7, estimated_score = $8, status = $9 WHERE id = $10',
            values: [title, company, description, status, application_deadline, applying_date, link, id],
        }

        const result = await pool.query(query)
        res.json(result.rows[0]);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/api/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {
            text:'DELETE FROM jobs WHERE id = $1',
            values: [id],
        }
        const result = await pool.query(query);
        res.json(result.rows);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
console.log(`Listening on port ${PORT}...`);
});  

