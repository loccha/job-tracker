INSERT INTO jobs (
    title, company, short_description, description,
    applying_date, interview_date, link,
    cv_url, letter_url, confidence_score, status
)
VALUES
('Frontend Developer', 'TechCorp',
 'Work on React applications',
 'Develop and maintain modern React applications, collaborate with designers and backend teams, optimize performance, and ensure responsive user interfaces across multiple devices.',
 '2026-02-01', NULL, 'http://techcorp.com/jobs/1',
 'http://mycv.com/cv1.pdf', NULL, 85, 'applied'),

('Backend Developer', 'DataSolutions',
 'Develop APIs in Node.js',
 'Design and build scalable REST APIs using Node.js, manage database integrations, implement authentication systems, and ensure high performance and security.',
 '2026-01-25', NULL, 'http://datasolutions.com/jobs/2',
 'http://mycv.com/cv2.pdf', 'http://mycv.com/letter2.pdf', 92, 'declined'),

('UI/UX Intern', 'CreativeLabs',
 'Assist with design implementation',
 'Support the design team by creating wireframes, implementing UI components, conducting usability testing, and helping improve overall user experience.',
 '2026-01-30', NULL, 'http://creativelabs.com/jobs/3',
 'http://mycv.com/cv3.pdf', NULL, 78, 'applied'),

('Fullstack Engineer', 'NextGen',
 'React + Node fullstack work',
 'Develop fullstack features using React and Node.js, design database schemas, integrate APIs, and collaborate closely with cross-functional teams.',
 '2026-01-28', '2026-02-05', 'http://nextgen.com/jobs/4',
 'http://mycv.com/cv4.pdf', 'http://mycv.com/letter4.pdf', 88, 'interview'),

('Data Analyst', 'FinAnalytics',
 'Analyze financial datasets',
 'Collect and analyze financial datasets, create dashboards, generate reports, and support business decision-making through data insights.',
 '2026-01-20', NULL, 'http://finanalytics.com/jobs/5',
 'http://mycv.com/cv5.pdf', 'http://mycv.com/letter5.pdf', 65, 'declined'),

('Mobile Developer', 'AppWorld',
 'Develop iOS and Android apps',
 'Build and maintain mobile applications for iOS and Android, implement new features, fix bugs, and ensure optimal performance across devices.',
 '2026-02-03', NULL, 'http://appworld.com/jobs/6',
 'http://mycv.com/cv6.pdf', NULL, 80, 'applied'),

('QA Tester', 'SecureSoft',
 'Test web applications for bugs',
 'Perform manual and automated testing of web applications, document defects, collaborate with developers, and ensure high product quality.',
 '2026-01-22', NULL, 'http://securesoft.com/jobs/7',
 'http://mycv.com/cv7.pdf', NULL, 70, 'declined'),

('Frontend Intern', 'WebVision',
 'Assist in React development',
 'Support frontend development using React, implement UI components, fix minor bugs, and assist senior developers in daily tasks.',
 '2026-02-05', NULL, 'http://webvision.com/jobs/8',
 'http://mycv.com/cv8.pdf', 'http://mycv.com/letter8.pdf', 95, 'offer'),

('Cloud Engineer', 'SkyNet',
 'Manage cloud infrastructure',
 'Design and manage cloud infrastructure, automate deployments, monitor system performance, and ensure reliability and scalability.',
 '2026-01-18', '2026-01-25', 'http://skynet.com/jobs/9',
 'http://mycv.com/cv9.pdf', 'http://mycv.com/letter9.pdf', 88, 'interview'),

('Product Designer', 'InnovateX',
 'Design new user interfaces',
 'Create innovative user interface designs, conduct user research, develop prototypes, and collaborate with product teams to improve usability.',
 '2026-02-02', NULL, 'http://innovatex.com/jobs/10',
 'http://mycv.com/cv10.pdf', NULL, 69, 'applied');