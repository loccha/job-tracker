export type DraftJob = {
    title: string;
    company: string;
    shortDescription: string;
    description: string;
    applyingDate: string;  
    interviewDate: string;
    screeningCompleted: boolean;
    link: string;
    cvUrl: string;
    cvOriginalName: string;
    cvFile: File | null;
    letterUrl: string;
    letterOriginalName: string;
    letterFile: File | null;
    confidenceScore: string;
    status: string;
    personnalNotes: string;
};