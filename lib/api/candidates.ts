import apiClient from './client';

export interface Candidate {
  id: number;
  user: number;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  prefecture?: string;
  country?: string;
  current_job_title?: string;
  current_company?: string;
  years_of_experience?: number;
  status: 'active' | 'inactive' | 'hired' | 'withdrawn';
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  candidate: number;
  job: number;
  status: string;
  applied_at: string;
  cover_letter?: string;
  matching_score?: number;
  ai_recommendation?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export const candidateService = {
  async getMyProfile() {
    const response = await apiClient.get('/candidates/candidates/me/');
    return response.data;
  },

  async updateProfile(candidateId: number, data: Partial<Candidate>) {
    const response = await apiClient.patch(`/candidates/candidates/${candidateId}/`, data);
    return response.data;
  },

  async getMyApplications() {
    const response = await apiClient.get<Application[]>('/candidates/applications/my_applications/');
    return response.data;
  },

  async applyForJob(jobId: number, data: { cover_letter?: string }) {
    const response = await apiClient.post('/candidates/applications/', {
      job: jobId,
      ...data,
    });
    return response.data;
  },

  async getSkills() {
    const response = await apiClient.get<Skill[]>('/candidates/skills/');
    return response.data;
  },

  async addSkill(candidateId: number, skillData: { skill_id: number; proficiency: string; years_of_experience?: number }) {
    const response = await apiClient.post(`/candidates/candidates/${candidateId}/add_skill/`, skillData);
    return response.data;
  },

  async getApplicationDetail(applicationId: number) {
    const response = await apiClient.get(`/candidates/applications/${applicationId}/`);
    return response.data;
  },
};