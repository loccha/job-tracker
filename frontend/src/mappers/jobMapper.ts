import { Job } from "../types/job";

export const mapJobFromApi = (job: any): Job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    shortDescription: job.short_description,
    description:job.description,
    applyingDate: new Date(job.applying_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    }),
    interviewDate: job.interview_date 
        ? new Date(job.interview_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
            })
        :null,
    screeningCompleted: job.screening_completed,
    link: job.link,
    cvUrl: job.cv_url,
    cvOriginalName: job.cv_original_name,
    letterUrl: job.letter_url,
    letterOriginalName: job.letter_original_name,
    createdAt: job.created_at,
    confidenceScore: job.confidence_score,
    status: job.status,
    personnalNotes: job.personnal_notes
});




