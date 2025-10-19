'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { candidateService, Application, Interview } from '@/lib/api/candidates';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true);
      const id = parseInt(params.id as string);
      const [appData, interviewsData] = await Promise.all([
        candidateService.getApplication(id),
        candidateService.getApplicationInterviews(id).catch(() => [])
      ]);
      setApplication(appData);
      setInterviews(interviewsData);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch application information');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleWithdraw = async () => {
    if (!application) return;

    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await candidateService.withdrawApplication(application.id);
      router.push('/applications');
    } catch (err) {
      alert('Failed to withdraw application: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-xl animate-pulse"></div>
        </div>
        <p className="ml-4 text-gray-700 font-medium">Loading...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Application not found'}</p>
          <Link href="/applications">
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
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <span className="text-white font-bold text-lg">HR</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Agent System</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  Dashboard
                </Link>
                <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  Job Search
                </Link>
                <Link href="/applications" className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
                  Applications
                </Link>
                <Link href="/concierge" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  Concierge
                </Link>
                <Link href="/profile" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/applications" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Application Details
          </h1>
        </div>

        {/* Application Details */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Job Info */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{application.job.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {application.job.department}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {application.job.location}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    {application.job.job_code}
                  </span>
                </div>
              </div>
              <StatusBadge status={application.status} />
            </div>
          </div>

          {/* Application Info */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Information</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(application.applied_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">#{application.id}</dd>
                </div>
                {application.matching_score !== undefined && application.matching_score !== null && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Matching Score</dt>
                    <dd className="mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">{application.matching_score}%</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                            style={{ width: `${application.matching_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {application.cover_letter && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.cover_letter}</p>
                </div>
              </div>
            )}

            {application.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                </div>
              </div>
            )}

            {/* Interviews Section */}
            {interviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Interview Schedule</h3>
                <div className="space-y-4">
                  {interviews.map((interview) => {
                    const isUpcoming = interview.result === 'pending' && new Date(interview.scheduled_date) > new Date();

                    return (
                      <div key={interview.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Interview Round {interview.round_number}</p>
                              <p className="text-sm text-gray-600">{interview.interview_type_display}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            interview.result === 'passed' || interview.result === 'pass'
                              ? 'bg-green-100 text-green-700'
                              : interview.result === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : interview.result === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : interview.result === 'on_hold'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {interview.result_display}
                          </span>
                        </div>

                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <dt className="font-medium text-gray-600">Date & Time</dt>
                          <dd className="text-gray-900">
                            {new Date(interview.scheduled_date).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-600">Duration</dt>
                          <dd className="text-gray-900">{interview.duration_minutes} minutes</dd>
                        </div>
                        {interview.interviewers && interview.interviewers.length > 0 && (
                          <div className="md:col-span-2">
                            <dt className="font-medium text-gray-600 mb-1">Interviewers</dt>
                            <dd className="text-gray-900">
                              {interview.interviewers.map((interviewer, idx) => (
                                <span key={interviewer.id}>
                                  {interviewer.full_name}
                                  {idx < interview.interviewers.length - 1 && ', '}
                                </span>
                              ))}
                            </dd>
                          </div>
                        )}
                      </dl>

                      {/* Candidate Answers */}
                      {interview.candidate_answers && interview.candidate_answers.questions && (
                        <div className="mt-3 pt-3 border-t border-indigo-200">
                          <p className="text-sm font-medium text-gray-600 mb-2">📝 Submitted Answers</p>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {interview.candidate_answers.questions.map((question, idx) => {
                              const answer = interview.candidate_answers?.answers[idx.toString()] || '';
                              return (
                                <div key={idx} className="bg-white/50 rounded-md p-3">
                                  <p className="text-xs font-semibold text-indigo-600 mb-1">Question {idx + 1}</p>
                                  <p className="text-sm text-gray-700 mb-2 font-medium">{question.question_text}</p>
                                  <div className="bg-gray-50 rounded p-2 mt-2">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">Answer:</p>
                                    <p className="text-sm text-gray-800">{answer}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Submitted at: {new Date(interview.candidate_answers.submitted_at).toLocaleString('en-US')}
                          </p>
                        </div>
                      )}

                      {/* AI評価フィードバック */}
                      {interview.feedback && (() => {
                        // Try to parse feedback as JSON
                        let evaluationReport = null;
                        try {
                          const parsed = JSON.parse(interview.feedback);
                          evaluationReport = parsed.evaluation_report || parsed;
                        } catch {
                          // If parsing fails, display as plain text
                          evaluationReport = null;
                        }

                        if (evaluationReport && typeof evaluationReport === 'object') {
                          // Structured evaluation report
                          const { overall_score, strengths, areas_for_improvement, recommendation, comment } = evaluationReport;

                          // Determine recommendation color
                          const getRecommendationColor = (rec: string) => {
                            if (!rec) return 'gray';
                            const lowerRec = rec.toLowerCase();
                            if (lowerRec.includes('合格') && !lowerRec.includes('不')) return 'green';
                            if (lowerRec.includes('不合格') || lowerRec.includes('失敗')) return 'red';
                            return 'yellow';
                          };

                          const recColor = getRecommendationColor(recommendation);

                          return (
                            <div className="mt-3 pt-3 border-t border-indigo-200">
                              <p className="text-sm font-medium text-gray-600 mb-3">🤖 AI Evaluation Report</p>

                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 space-y-4">
                                {/* Overall Score and Recommendation */}
                                <div className="flex items-center justify-between bg-white/70 rounded-lg p-4 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-gray-700">Overall Score:</span>
                                      <span className="text-3xl font-bold text-indigo-600">{overall_score}</span>
                                      <span className="text-lg text-gray-500">/10</span>
                                    </div>
                                  </div>
                                  {recommendation && (
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                                      recColor === 'green'
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : recColor === 'red'
                                        ? 'bg-red-100 text-red-700 border border-red-300'
                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                    }`}>
                                      {recommendation}
                                    </span>
                                  )}
                                </div>

                                {/* Strengths */}
                                {strengths && strengths.length > 0 && (
                                  <div className="bg-white/70 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      Strengths
                                    </h4>
                                    <ul className="space-y-2">
                                      {strengths.map((strength: string, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                                          <span className="text-green-600 mt-0.5">✓</span>
                                          <span className="flex-1">{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Areas for Improvement */}
                                {areas_for_improvement && areas_for_improvement.length > 0 && (
                                  <div className="bg-white/70 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                      Areas for Improvement
                                    </h4>
                                    <ul className="space-y-2">
                                      {areas_for_improvement.map((area: string, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                                          <span className="text-orange-600 mt-0.5">→</span>
                                          <span className="flex-1">{area}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Comment */}
                                {comment && (
                                  <div className="bg-white/70 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                      </svg>
                                      Detailed Comments
                                    </h4>
                                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{comment}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else {
                          // Fallback to plain text display
                          return (
                            <div className="mt-3 pt-3 border-t border-indigo-200">
                              <p className="text-sm font-medium text-gray-600 mb-2">🤖 AI Evaluation Report</p>
                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-md p-4">
                                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{interview.feedback}</p>
                              </div>
                              {interview.overall_score && (
                                <div className="mt-3 flex items-center gap-2 bg-white/70 rounded-md p-2">
                                  <span className="text-sm font-medium text-gray-600">Overall Score:</span>
                                  <span className="text-2xl font-bold text-indigo-600">{interview.overall_score}</span>
                                  <span className="text-sm text-gray-500">/10</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                      })()}

                      {/* Start AI Interview Button */}
                      {isUpcoming && interview.result === 'pending' && (
                        <div className="mt-4 pt-4 border-t border-indigo-200">
                          <Link href={`/interviews/${interview.id}`}>
                            <Button
                              fullWidth
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Start AI Interview
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200/50 bg-gray-50/50 flex gap-3">
            <Link href={`/jobs/${application.job.id}`} className="flex-1">
              <Button variant="outline" fullWidth>
                View Job Details
              </Button>
            </Link>
            {application.status !== 'withdrawn' && application.status !== 'rejected' && (
              <Button
                variant="outline"
                onClick={handleWithdraw}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Withdraw Application
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
