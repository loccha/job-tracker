export type Job = {
      id: number;
      title: string;
      company: string;
      description: string;
      applyingDate: string;
      interviewDate: string | null;
      link: string;
      cvUrl: string;
      letterUrl?: string;
      createdAt: string;
      confidenceScore: number;
      status: string;
    };