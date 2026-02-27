export type Job = {
      id: number;
      title: string;
      company: string;
      shortDescription: string;
      description: string;
      applyingDate: string;
      interviewDate: string | null;
      screeningCompleted: boolean;
      link: string;
      cvUrl: string;
      cvOriginalName: string;
      letterUrl?: string;
      letterOriginalName?: string;
      createdAt: string;
      confidenceScore: number;
      status: string;
      personnalNotes: string;
    };