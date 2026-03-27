export interface ResearchInput {
  companyName: string;
  domain: string;
  category: string;
  urls?: string;
  context?: string;
}

export interface ProgressEvent {
  layer: number;
  label: string;
  status: "start" | "done" | "error";
  detail?: string;
}

export interface SlideContent {
  id: string;
  title: string;
  content: string;
}

export interface SynthesisResult {
  overallScore: string;
  categoryScores: string;
  greenFlags: string[];
  redFlags: string[];
  negotiationPoints: string[];
  recommendation: string;
  rationale: string;
  raw: string;
}

export interface PipelineResult {
  slides: SlideContent[];
  synthesis: SynthesisResult;
  cost: number;
  duration: number;
}
