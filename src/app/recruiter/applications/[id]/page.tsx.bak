'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { candidateService, Application } from '@/lib/api/candidates';

export default function RecruiterApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const data = await candidateService.getApplication(parseInt(applicationId));
      setApplication(data);
    } catch (error) {
      console.error('Failed to fetch application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    router.push('/login');
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return;

    try {
      setUpdating(true);
      await candidateService.updateApplication(parseInt(applicationId), { status: newStatus });
      setApplication({ ...application, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending Review',
      reviewing: 'Under Review',
      interview_scheduled: 'Interview Scheduled',
      interviewed: 'Interviewed',
      offer_extended: 'Offer Extended',
      hired: 'Hired',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'from-yellow-100 to-amber-100 text-yellow-700',
      reviewing: 'from-blue-100 to-indigo-100 text-blue-700',
      interview_scheduled: 'from-purple-100 to-pink-100 text-purple-700',
      interviewed: 'from-indigo-100 to-blue-100 text-indigo-700',
      offer_extended: 'from-green-100 to-emerald-100 text-green-700',
      hired: 'from-green-200 to-emerald-200 text-green-800',
      rejected: 'from-red-100 to-rose-100 text-red-700',
      withdrawn: 'from-gray-100 to-slate-100 text-gray-700',
    };
    return colors[status] || 'from-gray-100 to-slate-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-xl animate-pulse"></div>
        </div>
        <p className="mt-6 text-gray-700 font-medium">Loading...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-700 mb-4">Application not found</p>
          <Link href="/recruiter/applications">
            <Button>Back to Applications</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/recruiter/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <span className="text-white font-bold text-lg">HR</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Agent System</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/recruiter/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  Dashboard
                </Link>
                <Link href="/recruiter/jobs" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  Job Management
                </Link>
                <Link href="/recruiter/applications" className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
                  Application Management
                </Link>
                <Link href="/recruiter/candidates" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  Candidate Search
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleLogout} className="shadow-md hover:shadow-lg">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/recruiter/applications" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-2 bg-gradient-to-r ${getStatusColor(application.status)} rounded-full font-bold shadow-md`}>
                  {getStatusLabel(application.status)}
                </span>
                <span className="text-gray-500 font-medium">Application ID: {application.id}</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {application.job.title}
              </h1>
              <p className="text-gray-600 text-lg">{application.job.company}</p>
            </div>
          </div>

          {/* Matching Score */}
          {application.matching_score && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Matching Score</h3>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Application Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Application Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Application Date</p>
                <p className="text-gray-900 font-medium">{new Date(application.applied_date).toLocaleDateString('en-US')}</p>
              </div>
              {application.cover_letter && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Cover Letter</p>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-4">{application.cover_letter}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              Change Status
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('reviewing')}
                disabled={updating}
                className="shadow-md hover:shadow-lg"
              >
                Under Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('interview_scheduled')}
                disabled={updating}
                className="shadow-md hover:shadow-lg"
              >
                Interview Scheduled
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('interviewed')}
                disabled={updating}
                className="shadow-md hover:shadow-lg"
              >
                Interviewed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('offer_extended')}
                disabled={updating}
                className="shadow-md hover:shadow-lg"
              >
                Offer Extended
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('hired')}
                disabled={updating}
                className="shadow-md hover:shadow-lg bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                Hired
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('rejected')}
                disabled={updating}
                className="shadow-md hover:shadow-lg bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                Rejected
              </Button>
            </div>
          </div>
        </div>

        {/* Candidate Link */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 text-center">
          <p className="text-gray-600 mb-4">View candidate details</p>
          <Link href={`/recruiter/candidates/${application.candidate?.id || 'unknown'}`}>
            <Button className="shadow-lg hover:shadow-xl">
              View Candidate Profile
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
