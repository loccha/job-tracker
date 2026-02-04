CREATE TYPE application_status AS ENUM (
	'To Apply', 
	'Pending', 
	'Interview', 
	'Declined'
);


CREATE TABLE IF NOT EXISTS application (
    id SERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	company VARCHAR(100) NOT NULL,
	description TEXT,
	status application_status NOT NULL,
	application_deadline DATE,
	applying_date DATE,
	link VARCHAR(100) NOT NULL
);

