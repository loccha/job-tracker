# JobTracker

A full-stack Applicant Tracking System (ATS) built to manage job applications, documents, and follow-ups in one centralized dashboard.

🔗 **[Live Demo](https://job-tracker.up.railway.app/)**



## Motivation

As an active job seeker, I found spreadsheets too rigid to keep track of applications, documents, and follow-ups effectively. I built JobTracker to solve that problem — and to challenge myself with a real, end-to-end full-stack project using React, Node.js, and PostgreSQL.

## Features

- **Kanban Board** — Visualize and manage applications by stage: Applied, Interview, Offer, Declined
- **Document Management** — Upload and link CVs and cover letters directly to each application
- **Application Forms** — Add and edit job entries with detailed fields
- **Calendar View** — Track interview dates and upcoming deadlines
- **File Uploads** — Store documents securely on the server with Multer
- **Real-time Updates** — Dashboard reflects changes immediately



## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, CSS Modules, FontAwesome |
| Backend | Node.js, Express.js, Multer |
| Database | PostgreSQL |
| Deployment | Railway |

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── server.js        # Express server & API routes
│   ├── package.json
│   └── uploads/         # Uploaded files
├── db/
│   ├── create_tables.sql
│   ├── data_example.sql
│   └── applications.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── mappers/     # Data transformation
│   │   ├── styles/      # CSS variables and global styles
│   │   └── types/       # TypeScript type definitions
│   ├── package.json
│   └── vite.config.js
├── doc/
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api` | Retrieve all job applications |
| POST | `/api/jobs` | Create a new application |
| PUT | `/api/jobs/:id` | Update an existing application |
| DELETE | `/api/delete/:id` | Delete an application and its files |
| POST | `/api/upsert-file` | Upload a CV or cover letter |

## Future Enhancements
- **AI Match Score** — Compare a job description against the user's CV and display a compatibility score powered by AI
- **AI Short Description Generator** — Automatically summarize a job's long description into a concise summary  using AI
- **Filters & Search** — Sort and filter applications by company, title, status, applied date, alphabetical order, and more