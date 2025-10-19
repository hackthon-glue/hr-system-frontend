import apiClient from './client';

// Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AgentResponse {
  status: 'success' | 'error';
  agent: string;
  result: string;
  message?: string;
}

export interface ConciergeRequest {
  query: string;
  context?: {
    candidate_id?: number;
    candidate_info?: unknown;
  };
}

// Agent Service
class AgentService {
  async sendToConcierge(request: ConciergeRequest): Promise<AgentResponse> {
    const response = await apiClient.post<AgentResponse>(
      '/api/agents/concierge/',
      {
        query: request.query,
        context: request.context,
        agent_type: 'concierge'
      }
    );
    return response.data;
  }

  async sendToSkillParser(text: string): Promise<AgentResponse> {
    const response = await apiClient.post<AgentResponse>(
      '/api/agents/skill_parser/',
      {
        query: text,
        agent_type: 'skill_parser'
      }
    );
    return response.data;
  }

  async sendToJobMatcher(candidateProfile: unknown, jobs: unknown[]): Promise<AgentResponse> {
    const response = await apiClient.post<AgentResponse>(
      '/api/agents/job_matcher/',
      {
        query: 'Please analyze job matching',
        context: {
          candidate: candidateProfile,
          jobs: jobs
        },
        agent_type: 'job_matcher'
      }
    );
    return response.data;
  }
}

export const agentService = new AgentService();
