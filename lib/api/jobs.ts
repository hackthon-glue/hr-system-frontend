import apiClient from './client';

export interface Job {
  id: number;
  title: string;
  job_code?: string;
  department?: string;
  location: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary';
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead';
  job_description: string;
  requirements?: string;
  responsibilities?: string;
  qualifications?: string;
  skills_required?: string;
  min_salary?: number;
  max_salary?: number;
  benefits?: string;
  work_environment?: string;
  company_culture?: string;
  status: 'draft' | 'published' | 'paused' | 'closed' | 'filled';
  posted_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MatchingResult {
  id: number;
  job: number;
  candidate: number;
  overall_score: number;
  skill_match_score: number;
  experience_match_score: number;
  education_match_score: number;
  culture_fit_score: number;
  matched_skills: string[];
  missing_skills: string[];
  additional_skills: string[];
  ai_summary?: string;
  recommendation_level?: string;
  created_at: string;
}

export const jobService = {
  async getJobs(params?: {
    status?: string;
    employment_type?: string;
    experience_level?: string;
    location?: string;
    page?: number;
    page_size?: number;
  }) {
    const response = await apiClient.get<{ results: Job[]; count: number }>('/jobs/jobs/', { params });
    return response.data;
  },

  async getJobDetail(jobId: number) {
    const response = await apiClient.get<Job>(`/jobs/jobs/${jobId}/`);
    return response.data;
  },

  async trackView(jobId: number) {
    const response = await apiClient.post(`/jobs/jobs/${jobId}/track_view/`);
    return response.data;
  },

  async saveJob(jobId: number) {
    const response = await apiClient.post('/jobs/saved-jobs/', { job: jobId });
    return response.data;
  },

  async getSavedJobs() {
    const response = await apiClient.get('/jobs/saved-jobs/');
    return response.data;
  },

  async removeSavedJob(savedJobId: number) {
    const response = await apiClient.delete(`/jobs/saved-jobs/${savedJobId}/`);
    return response.data;
  },

  async getMatchingResults(candidateId?: number) {
    const params = candidateId ? { candidate: candidateId } : {};
    const response = await apiClient.get<{ results: MatchingResult[] }>('/jobs/matching-results/', { params });
    return response.data;
  },

  async getTopMatches() {
    const response = await apiClient.get<MatchingResult[]>('/jobs/matching-results/top_matches/');
    return response.data;
  },
};