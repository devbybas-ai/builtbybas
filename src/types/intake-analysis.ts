import type { IntakeFormData } from "./intake";

export interface IntakeAnalysis {
  id: string;
  submittedAt: string;
  formData: IntakeFormData;
  clientProfile: ClientProfile;
  serviceRecommendations: ServiceRecommendation[];
  complexityScore: ComplexityScore;
  pathsForward: PathForward[];
  flags: AnalysisFlag[];
  summary: AnalysisSummary;
}

export interface ClientProfile {
  businessMaturity: ScoredDimension;
  projectReadiness: ScoredDimension;
  engagementLevel: ScoredDimension;
  scopeClarity: ScoredDimension;
  budgetAlignment: ScoredDimension;
}

export interface ScoredDimension {
  score: number;
  label: "Low" | "Medium" | "High" | "Very High";
  signals: string[];
}

export interface ServiceRecommendation {
  serviceId: string;
  serviceTitle: string;
  fitScore: number;
  fitLabel: "Strong Fit" | "Good Fit" | "Partial Fit" | "Not Recommended";
  reasons: string[];
  estimatedRange: string;
  isPrimary: boolean;
}

export interface ComplexityScore {
  overall: number;
  label: "Simple" | "Moderate" | "Complex" | "Enterprise";
  factors: ComplexityFactor[];
}

export interface ComplexityFactor {
  name: string;
  impact: "low" | "medium" | "high";
  detail: string;
}

export interface PathForward {
  name: string;
  description: string;
  phases: PathPhase[];
  estimatedTimeline: string;
  estimatedInvestment: string;
  recommended: boolean;
}

export interface PathPhase {
  order: number;
  title: string;
  services: string[];
  duration: string;
  description: string;
}

export interface AnalysisFlag {
  type: "warning" | "opportunity" | "info";
  message: string;
}

export interface AnalysisSummary {
  projectType: string;
  clientType: string;
  headline: string;
  estimatedTotalInvestment: string;
  estimatedTotalTimeline: string;
}
