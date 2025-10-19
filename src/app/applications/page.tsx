'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { candidateService, Application } from '@/lib/api/candidates';

export default function ApplicationsPage() {
  const t = useTranslations();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getApplications();
      // Handle API response in { results: [...] } format
      const appsList: Application[] = Array.isArray(data) ? data : ((data as { results?: Application[] })?.results || []);
      setApplications(appsList);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: number) => {
    if (confirm(t('applications.withdrawConfirm'))) {
      try {
        await candidateService.withdrawApplication(applicationId);
        alert(t('applications.withdrawSuccess'));
        fetchApplications();
      } catch (error) {
        alert(t('applications.withdrawError'));
      }
    }
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter);

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    screening: applications.filter(a => a.status === 'screening').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
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
                <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  {t('nav.jobs')}
                </Link>
                <Link href="/applications" className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
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
            {t('applications.title')}
          </h1>
          <p className="text-gray-600 text-lg">{t('applications.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-blue-100/50 hover:border-blue-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">All Applications</p>
              <p className="text-3xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-amber-100/50 hover:border-amber-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">Screening</p>
              <p className="text-3xl font-bold text-gray-900">{statusCounts.screening}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100/50 hover:border-purple-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">Interviews</p>
              <p className="text-3xl font-bold text-gray-900">{statusCounts.interview}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100/50 hover:border-emerald-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">Offers</p>
              <p className="text-3xl font-bold text-gray-900">{statusCounts.offer}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-10 p-6">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="shadow-md hover:shadow-lg"
            >
              All
            </Button>
            <Button
              variant={filter === 'submitted' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('submitted')}
              className="shadow-md hover:shadow-lg"
            >
              Submitted
            </Button>
            <Button
              variant={filter === 'screening' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('screening')}
              className="shadow-md hover:shadow-lg"
            >
              Screening
            </Button>
            <Button
              variant={filter === 'interview' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('interview')}
              className="shadow-md hover:shadow-lg"
            >
              Interview
            </Button>
            <Button
              variant={filter === 'offer' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('offer')}
              className="shadow-md hover:shadow-lg"
            >
              Offer
            </Button>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-xl animate-pulse"></div>
            </div>
            <p className="mt-6 text-gray-700 font-medium">{t('common.loading')}</p>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="p-6">
                  <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{application.job.title}</h2>
                            <StatusBadge status={application.status} />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {application.job.department}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {application.job.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Applied: {new Date(application.applied_date).toLocaleDateString('en-US')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {application.matching_score && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{t('applications.matchingScore')}</span>
                            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              {Math.round(application.matching_score)}%
                            </span>
                          </div>
                          <div className="relative w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-lg"
                              style={{ width: `${application.matching_score}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {application.cover_letter && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/70 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-800">{t('applications.coverLetter')}</p>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{application.cover_letter}</p>
                        </div>
                      )}

                      {application.notes && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-200/70 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-semibold text-blue-900">Notes from Recruiter</p>
                          </div>
                          <p className="text-sm text-blue-800 leading-relaxed">{application.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2 md:w-40 flex-shrink-0">
                      <Link href={`/applications/${application.id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" size="sm" fullWidth className="shadow-md hover:shadow-lg hover:border-blue-400 hover:text-blue-600 transition-all">
                          {t('applications.viewApplication')}
                        </Button>
                      </Link>
                      <Link href={`/jobs/${application.job.id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" size="sm" fullWidth className="shadow-md hover:shadow-lg hover:border-emerald-400 hover:text-emerald-600 transition-all">
                          View Job
                        </Button>
                      </Link>
                      {(application.status === 'submitted' || application.status === 'screening') && (
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => handleWithdraw(application.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500 shadow-md hover:shadow-lg transition-all"
                        >
                          {t('applications.withdraw')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full -mr-32 -mt-32"></div>
            <div className="relative text-center py-16 px-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
                <svg className="relative w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">
                {filter === 'all' ? t('applications.noApplications') : 'No applications match this filter'}
              </p>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">Start browsing jobs to find your perfect match. Your dream job is waiting!</p>
              <Link href="/jobs">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('applications.browseJobs')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
