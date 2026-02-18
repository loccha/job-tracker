import { Job } from "../types/job";

export const mapJobFromApi = (job: any): Job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    applyingDate: job.applying_date,
    interviewDate: job.interview_date,
    link: job.link,
    cvUrl: job.cv_url,
    letterUrl: job.letter_url,
    createdAt: job.created_at,
    confidenceScore: job.confidence_score,
    status: job.status
});




