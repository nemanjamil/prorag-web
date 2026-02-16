export interface EvaluationScores {
  faithfulness: number;
  relevance: number;
  completeness: number;
  overallScore: number;
  evaluatedAt: string;
  evaluatorModel: string;
}

export interface EvaluationReasoning {
  faithfulness: string;
  relevance: string;
  completeness: string;
}

export interface EvaluationDetail {
  queryLogId: number;
  queryText: string;
  answerText: string;
  scores: EvaluationScores;
  reasoning: EvaluationReasoning;
}

export interface EvaluatedQueryLog {
  id: number;
  queryText: string;
  answerText: string | null;
  llmModel: string;
  evaluationScores: EvaluationScores & { reasoning: EvaluationReasoning };
  totalMs: number | null;
  estimatedCostUsd: number;
  createdAt: string;
}

export interface PaginatedEvaluatedLogs {
  data: EvaluatedQueryLog[];
  total: number;
  page: number;
  limit: number;
}
