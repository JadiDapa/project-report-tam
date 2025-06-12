export interface CreateDailyReportEvidenceType {
  image: string;
  description?: string;
}

export interface DailyReportEvidenceType extends CreateDailyReportEvidenceType {
  location?: {
    coords: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  date?: string;
}
