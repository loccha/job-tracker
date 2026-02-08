import dotenv from "dotenv";
import express from 'express'
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
await pool.connect();

app.get('/', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM application ORDER BY application_deadline');
        res.json(result.rows);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

//TODO: data validation
app.post('/applications', async (req, res) => {
    const { title, company, description, status, application_deadline, applying_date, link } = req.body;

    try {
        const query = {
            text: 'INSERT INTO application(title, company, description, status, application_deadline, applying_date, link) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [title, company, description, status, application_deadline, applying_date, link],
        }
        
        const result = await pool.query(query)
        res.status(201).json(result.rows[0]);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
});

//TODO: data validation
app.put('/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, company, description, status, application_deadline, applying_date, link } = req.body;

        const query = {
            text: 'UPDATE application SET title = $1, company = $2, description = $3, status = $4, application_deadline = $5, applying_date = $6, link = $7 WHERE id = $8',
            values: [title, company, description, status, application_deadline, applying_date, link, id],
        }

        const result = await pool.query(query)
        res.json(result.rows[0]);
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {
            text:'DELETE FROM application WHERE id = $1',
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

