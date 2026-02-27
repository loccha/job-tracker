CREATE TYPE job_status AS ENUM (
	'applied', 
	'interview', 
	'offer',
	'declined'
);


CREATE TABLE IF NOT EXISTS jobs_data (
    id SERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	company VARCHAR(100) NOT NULL,
	short_description TEXT,
	description TEXT,
	applying_date DATE NOT NULL,
	interview_date DATE,
	screening_completed BOOLEAN DEFAULT false NOT NULL,
	link TEXT NOT NULL,
	cv_url TEXT,
	cv_original_name VARCHAR(250),
	letter_url TEXT,
	letter_original_name VARCHAR(250),
	created_at TIMESTAMP DEFAULT NOW(),
	confidence_score INT DEFAULT 0,
	status job_status NOT NULL,
	personnal_notes TEXT DEFAULT NULL
);

