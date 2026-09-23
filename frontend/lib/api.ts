export interface SourceMetadata {
  name: string;
  url: string;
  title?: string;
  protocol_id?: string;
}

export interface LatencyMetrics {
  baseline_retrieval_ms: number | null;
  moss_retrieval_ms: number | null;
  llm_formatting_ms: number | null;
  backend_total_ms: number;
}

export interface EmergencyRequest {
  query: string;
  language?: string;
  use_moss?: boolean;
  use_llm?: boolean;
}

export interface EmergencyResponse {
  guidance: string;
  protocol_category: string;
  source: SourceMetadata;
  safety_status: "validated" | "fallback";
  retrieval_engine: "baseline" | "moss" | "fallback";
  validation_reason: string;
  interaction_type: "emergency" | "clarification" | "guidance" | "fallback";
  clarifying_questions: string[];
  warning_signs_detected: string[];
  metrics: LatencyMetrics;
  emergency_reminder: string;
  safety_notice: string;
}

export interface StatusResponse {
  baseline_available: boolean;
  moss_configured: boolean;
  moss_available: boolean;
  llm_configured: boolean;
  supported_categories: string[];
  environment: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}

const rawApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchStatus(): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/status`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Status fetch failed with status ${res.status}`);
  }
  return res.json();
}

export async function submitEmergencyQuery(payload: EmergencyRequest): Promise<EmergencyResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/emergency`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: payload.query,
      language: payload.language || "en",
      use_moss: payload.use_moss ?? true,
      use_llm: payload.use_llm ?? false,
    }),
  });

  if (!res.ok) {
    let errorDetail = "Failed to communicate with guidance service.";
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        if (Array.isArray(errJson.detail)) {
          errorDetail = errJson.detail.map((e: { msg?: string }) => e.msg || "").join(", ");
        } else {
          errorDetail = String(errJson.detail);
        }
      }
    } catch {
      // Use generic fallback
    }
    throw new Error(errorDetail);
  }

  return res.json();
}
