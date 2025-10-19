import apiClient from './client';

// Types
export interface Interview {
  id: number;
  application: number;
  interview_type: string;
  round_number: number;
  scheduled_date: string;
  duration_minutes: number;
  interviewers: number[];
  result: 'pending' | 'passed' | 'failed' | 'on_hold';
  technical_score?: number;
  communication_score?: number;
  cultural_fit_score?: number;
  overall_score?: number;
  notes?: string;
  feedback?: string;
  location?: string;
  meeting_link?: string;
  questions?: InterviewQuestion[];
  answers?: InterviewAnswer[];
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestion {
  id: number;
  interview: number;
  question_text: string;
  question_type: string;
  difficulty: string;
  expected_answer?: string;
  evaluation_criteria?: string;
  order: number;
}

export interface InterviewAnswer {
  id: number;
  interview: number;
  question: number;
  answer_text: string;
  evaluation_score?: number;
  evaluation_notes?: string;
  created_at: string;
}

// Interview Service
class InterviewService {
  async getInterviews(params?: { application?: number; result?: string }) {
    const response = await apiClient.get<Interview[]>('/api/candidates/interviews/', { params });
    return response.data;
  }

  async getInterview(id: number) {
    const response = await apiClient.get<Interview>(`/api/candidates/interviews/${id}/`);
    return response.data;
  }

  async getUpcomingInterviews() {
    const response = await apiClient.get<Interview[]>('/api/candidates/interviews/upcoming/');
    return response.data;
  }

  async submitFeedback(id: number, data: {
    notes?: string;
    feedback?: string;
    technical_score?: number;
    communication_score?: number;
    cultural_fit_score?: number;
    overall_score?: number;
    result?: string;
  }) {
    const response = await apiClient.post<Interview>(
      `/api/candidates/interviews/${id}/submit_feedback/`,
      data
    );
    return response.data;
  }

  async evaluateAnswer(id: number, data: {
    question: string;
    answer: string;
  }) {
    const response = await apiClient.post(
      `/api/candidates/interviews/${id}/evaluate_answer/`,
      data
    );
    return response.data;
  }

  async submitAnswer(interviewId: number, questionId: number, answerText: string) {
    // This endpoint may need to be created in the backend
    const response = await apiClient.post(
      `/api/candidates/interviews/${interviewId}/submit_answer/`,
      {
        question_id: questionId,
        answer_text: answerText
      }
    );
    return response.data;
  }

  async generateQuestions(interviewId: number) {
    const response = await apiClient.get(
      `/api/candidates/interviews/${interviewId}/generate_questions/`
    );
    return response.data;
  }

  async submitAnswers(interviewId: number, data: {
    answers: Record<number, string>;
    questions: InterviewQuestion[];
    session_id?: string;
  }) {
    const response = await apiClient.post(
      `/api/candidates/interviews/${interviewId}/submit_answers/`,
      data
    );
    return response.data;
  }
}

export const interviewService = new InterviewService();
