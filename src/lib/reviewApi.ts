import type {
  ClassificationData,
  ContractSummary,
  ReviewResult,
  RiskItem,
  SuggestionItem,
} from '../types/review'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

interface SectionResult {
  success?: boolean
  response?: unknown
}

const DEFAULT_CLASSIFICATION: ClassificationData = {
  documentType: 'Not available',
  language: 'Not available',
  jurisdiction: 'Not available',
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asString(value: unknown, fallback = 'Not available'): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : []
}

function maybeParse(value: unknown): unknown {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function unwrapSection<T>(raw: unknown, label: string, warnings: string[]): T | null {
  const section = asRecord(raw) as SectionResult
  const response = asRecord(maybeParse(section.response))

  if (section.success === false) {
    warnings.push(`${label} failed.`)
    return null
  }

  if (response.success === false) {
    warnings.push(`${label}: ${asString(response.error, 'The backend did not return usable data.')}`)
    return null
  }

  const data = response.data ?? response
  if (!data || typeof data !== 'object') {
    warnings.push(`${label} data was missing.`)
    return null
  }

  return data as T
}

function normalizeClassification(data: unknown): ClassificationData {
  const record = asRecord(data)
  return {
    documentType: asString(record.document_type ?? record.documentType),
    language: asString(record.language),
    jurisdiction: asString(record.jurisdiction),
  }
}

function normalizeSummary(data: unknown): ContractSummary | null {
  const rawSummary = asRecord(data).contract_summary ?? asRecord(data).contractSummary
  const summary = asRecord(rawSummary)
  if (!Object.keys(summary).length) return null

  const keyTerms = asRecord(summary.key_terms ?? summary.keyTerms)

  return {
    documentType: asString(summary.document_type ?? summary.documentType),
    purpose: asString(summary.purpose),
    parties: Array.isArray(summary.parties) ? summary.parties.map((party) => {
      const record = asRecord(party)
      return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, String(value)]))
    }) : [],
    effectiveDate: asString(summary.effective_date ?? summary.effectiveDate),
    duration: asString(summary.duration),
    governingLaw: asString(summary.governing_law ?? summary.governingLaw),
    jurisdiction: asString(summary.jurisdiction),
    keyTerms: Object.fromEntries(Object.entries(keyTerms).map(([key, value]) => [key, String(value)])),
    majorObligations: asStringArray(summary.major_obligations ?? summary.majorObligations),
    importantClauses: asStringArray(summary.important_clauses ?? summary.importantClauses),
    missingOrUnclearSections: asStringArray(summary.missing_or_unclear_sections ?? summary.missingOrUnclearSections),
    summary: asString(summary.summary),
  }
}

function normalizeRisks(data: unknown): {
  risks: RiskItem[]
  missingProtections: string[]
  analysisNotes: string[]
  overallRiskLevel: string
} {
  const record = asRecord(data)
  const risks = Array.isArray(record.risk_analysis ?? record.riskAnalysis)
    ? (record.risk_analysis ?? record.riskAnalysis) as unknown[]
    : []

  return {
    risks: risks.map((risk, index) => {
      const item = asRecord(risk)
      return {
        riskId: asString(item.risk_id ?? item.riskId, `Risk-${index + 1}`),
        clause: asString(item.clause),
        severity: asString(item.severity, 'medium'),
        issue: asString(item.issue),
        legalImpact: asString(item.legal_impact ?? item.legalImpact),
        plainEnglishExplanation: asString(item.plain_english_explanation ?? item.plainEnglishExplanation),
      }
    }),
    missingProtections: asStringArray(record.missing_protections ?? record.missingProtections),
    analysisNotes: asStringArray(record.analysis_notes ?? record.analysisNotes),
    overallRiskLevel: asString(record.overall_risk_level ?? record.overallRiskLevel, 'Not available'),
  }
}

function normalizeSuggestions(data: unknown): {
  suggestions: SuggestionItem[]
  priorityRecommendations: string[]
  overallRecommendationSummary: string
} {
  const record = asRecord(data)
  const suggestions = Array.isArray(record.suggestions) ? record.suggestions : []

  return {
    suggestions: suggestions.map((suggestion) => {
      const item = asRecord(suggestion)
      return {
        relatedClause: asString(item.related_clause ?? item.relatedClause),
        recommendation: asString(item.recommendation),
        reason: asString(item.reason),
        implementationExample: asString(item.implementation_example ?? item.implementationExample, ''),
      }
    }),
    priorityRecommendations: asStringArray(record.priority_recommendations ?? record.priorityRecommendations),
    overallRecommendationSummary: asString(record.overall_recommendation_summary ?? record.overallRecommendationSummary, ''),
  }
}

export function normalizeAnalyzeResponse(raw: unknown): ReviewResult {
  const payload = asRecord(raw)
  const warnings: string[] = []

  if (payload.success === false) {
    warnings.push('Analyze request failed.')
  }

  const classificationData = unwrapSection<unknown>(payload.classification, 'Classification', warnings)
  const summaryData = unwrapSection<unknown>(payload.summary, 'Summary', warnings)
  const riskData = unwrapSection<unknown>(payload.riskAnalysis ?? payload.risk_analysis, 'Risk analysis', warnings)
  const suggestionsData = unwrapSection<unknown>(payload.suggestions, 'Suggestions', warnings)

  const riskResult = normalizeRisks(riskData)
  const suggestionResult = normalizeSuggestions(suggestionsData)

  return {
    documentTextPreview: asString(payload.document_text_preview ?? payload.documentTextPreview, ''),
    classification: classificationData ? normalizeClassification(classificationData) : DEFAULT_CLASSIFICATION,
    summary: normalizeSummary(summaryData),
    risks: riskResult.risks,
    missingProtections: riskResult.missingProtections,
    analysisNotes: riskResult.analysisNotes,
    overallRiskLevel: riskResult.overallRiskLevel,
    suggestions: suggestionResult.suggestions,
    priorityRecommendations: suggestionResult.priorityRecommendations,
    overallRecommendationSummary: suggestionResult.overallRecommendationSummary,
    warnings,
  }
}

export async function analyzeContract(file: File): Promise<ReviewResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let detail = `Backend returned ${response.status}`
    try {
      const errorPayload = await response.json()
      detail = asString(asRecord(errorPayload).detail, detail)
    } catch {
      // Keep the status-based fallback.
    }
    throw new Error(detail)
  }

  return normalizeAnalyzeResponse(await response.json())
}
