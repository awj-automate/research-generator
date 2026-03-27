export interface ResearchInput {
  companyName: string;
  domain: string;
  context?: string;
  sections: string[];
}

export interface ProgressEvent {
  layer: number;
  label: string;
  status: "start" | "done" | "error";
  detail?: string;
}

export interface SectionContent {
  id: string;
  title: string;
  content: string;
}

export interface PainPoints {
  points: string[];
  raw: string;
}

export interface PipelineResult {
  sections: SectionContent[];
  painPoints: PainPoints | null;
  cost: number;
  duration: number;
}
