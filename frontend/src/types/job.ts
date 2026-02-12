export type Job = {
      id: number;
      title: string;
      company: string;
      description: string;
      applying_date: string;
      interview_date: string;
      link: string;
      cv_url: string;
      letter_url?: string;
      created_at: string;
      estimated_score: number;
      status: string;
    };