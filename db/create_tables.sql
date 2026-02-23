CREATE TYPE job_status AS ENUM (
	'Applied', 
	'Interview', 
	'Declined'
);


CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	company VARCHAR(100) NOT NULL,
	short_description TEXT,
	description TEXT,
	applying_date DATE NOT NULL,
	interview_date DATE,
	link TEXT NOT NULL,
	cv_url TEXT,
	letter_url TEXT,
	created_at TIMESTAMP DEFAULT NOW(),
	estimated_score INT DEFAULT 0,
	status job_status NOT NULL
);

