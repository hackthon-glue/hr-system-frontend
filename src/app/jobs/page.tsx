'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { ExperienceBadge } from '@/components/ui/Badge';
import { jobService, Job } from '@/lib/api/jobs';
import { candidateService } from '@/lib/api/candidates';

export default function JobsPage() {
  const router = useRouter();
  const t = useTranslations();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    location: '',
    employment_type: '',
    experience_level: '',
    search: '',
  });

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs(filters);
      // Handle API response in { results: [...] } format
      const jobsList = Array.isArray(data) ? data : (data?.results || []);
      setJobs(jobsList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      const data = await candidateService.getApplications();
      const applications = Array.isArray(data) ? data : ((data as { results?: { job: { id: number } }[] })?.results || []);
      const jobIds = new Set(applications.map(app => app.job.id));
      setAppliedJobIds(jobIds);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, [fetchJobs, fetchAppliedJobs]);

  const handleApply = async (jobId: number) => {
    try {
      await jobService.applyToJob(jobId);
      // Add the job ID to appliedJobIds to update UI immediately
      setAppliedJobIds(prev => new Set([...prev, jobId]));
      alert(t('jobs.applySuccess'));
      router.push('/applications');
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { error?: string } } };
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        alert(err.response?.data?.error || t('jobs.applyError'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <span className="text-white font-bold text-lg">HR</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Agent System</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  {t('nav.dashboard')}
                </Link>
                <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
                  {t('nav.jobs')}
                </Link>
                <Link href="/applications" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  {t('nav.applications')}
                </Link>
                <Link href="/concierge" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  {t('nav.concierge')}
                </Link>
                <Link href="/profile" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  {t('nav.profile')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {t('jobs.title')}
          </h1>
          <p className="text-gray-600 text-lg">{t('jobs.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-blue-100/50 hover:border-blue-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100/50 hover:border-emerald-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">New Today</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-amber-100/50 hover:border-amber-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">Average Salary</p>
              <p className="text-3xl font-bold text-gray-900">¥6.5M</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100/50 hover:border-purple-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">Available</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-900">{t('jobs.searchPlaceholder')}</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder={t('jobs.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                prefix={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <Input
                placeholder={t('jobs.location')}
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                prefix={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <Select
                placeholder={t('jobs.employmentType')}
                value={filters.employment_type}
                onChange={(e) => setFilters({ ...filters, employment_type: e.target.value })}
                options={[
                  { value: '', label: t('jobs.allTypes') },
                  { value: 'full_time', label: t('employmentTypes.full_time') },
                  { value: 'part_time', label: t('employmentTypes.part_time') },
                  { value: 'contract', label: t('employmentTypes.contract') },
                  { value: 'intern', label: t('employmentTypes.internship') },
                ]}
              />
              <Select
                placeholder={t('jobs.experienceLevel')}
                value={filters.experience_level}
                onChange={(e) => setFilters({ ...filters, experience_level: e.target.value })}
                options={[
                  { value: '', label: t('jobs.allLevels') },
                  { value: 'junior', label: t('experienceLevels.junior') },
                  { value: 'mid', label: t('experienceLevels.mid') },
                  { value: 'senior', label: t('experienceLevels.senior') },
                  { value: 'lead', label: t('experienceLevels.lead') },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-xl animate-pulse"></div>
            </div>
            <p className="mt-6 text-gray-700 font-medium">{t('common.loading')}</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="p-6">
                  <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h2>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-200">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {job.department}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-200">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {job.location}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="font-bold px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50 text-amber-700">
                              ¥{job.salary_min.toLocaleString()} - ¥{job.salary_max.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/50">
                          {t(`employmentTypes.${job.employment_type}`)}
                        </span>
                        <ExperienceBadge level={job.experience_level} />
                        {job.deadline && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200/50">
                            Deadline: {new Date(job.deadline).toLocaleDateString('en-US')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-3 md:w-36 flex-shrink-0">
                      <Link href={`/jobs/${job.id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" size="sm" fullWidth className="shadow-md hover:shadow-lg">
                          {t('jobs.viewDetails')}
                        </Button>
                      </Link>
                      {appliedJobIds.has(job.id) ? (
                        <Button
                          size="sm"
                          fullWidth
                          disabled
                          className="shadow-md bg-gray-400 cursor-not-allowed"
                        >
                          {t('jobs.appliedBadge')}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          fullWidth
                          onClick={() => handleApply(job.id)}
                          className="shadow-md hover:shadow-lg"
                        >
                          {t('jobs.applyButton')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">{t('common.noData')}</p>
              <p className="text-gray-600">Please try changing your search criteria</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}