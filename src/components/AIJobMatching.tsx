'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/Button';
import { useJobMatching, type RecommendedJob } from '@/hooks/useJobMatching';

interface AIJobMatchingProps {
  candidateId: string;
}

export function AIJobMatching({ candidateId }: AIJobMatchingProps) {
  const t = useTranslations();
  const { matchJobs, isLoading, error, results, reset } = useJobMatching(candidateId);
  const [showResults, setShowResults] = useState(false);

  const handleMatch = async () => {
    const result = await matchJobs();
    if (result) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    reset();
    setShowResults(false);
  };

  // マッチスコアに基づく色を取得
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 75) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-gray-600 bg-gray-100 border-gray-200';
  };

  // プログレスバーの色を取得
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 75) return 'from-blue-500 to-indigo-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    return 'from-gray-500 to-slate-600';
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {t('aiMatching.title')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {results?.is_mock && (
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('aiMatching.testMode')}
                </span>
              )}
              {!results?.is_mock && t('aiMatching.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Initial State - Button */}
        {!showResults && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('aiMatching.findJobsTitle')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('aiMatching.findJobsDescription')}
            </p>
            <Button
              onClick={handleMatch}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all text-white font-semibold px-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {t('aiMatching.findJobsButton')}
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('aiMatching.analyzingTitle')}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('aiMatching.analyzingDescription')}
            </p>
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{t('aiMatching.profileAnalysis')}</span>
                <span>{t('aiMatching.jobMatching')}</span>
                <span>{t('aiMatching.resultGeneration')}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('aiMatching.errorTitle')}</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <Button
              onClick={handleMatch}
              variant="outline"
              className="shadow-md"
            >
              {t('aiMatching.retry')}
            </Button>
          </div>
        )}

        {/* Results State */}
        {showResults && results && results.data && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{results.data.summary}</h4>
                  <p className="text-xs text-gray-600">{t('aiMatching.sessionId')}: {results.session_id}</p>
                </div>
              </div>
            </div>

            {/* Recommended Jobs */}
            {results.data.recommended_jobs && results.data.recommended_jobs.length > 0 ? (
              <div className="space-y-4">
                {results.data.recommended_jobs.map((job: RecommendedJob, index: number) => (
                  <div
                    key={job.job_id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getMatchColor(job.overall_match)}`}>
                            #{index + 1} {t('aiMatching.matchDegree')} {job.overall_match}%
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.job_title}</h3>
                        <p className="text-sm text-gray-600">{t('aiMatching.jobId')}: {job.job_id}</p>
                      </div>
                    </div>

                    {/* Match Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('aiMatching.skillMatch')}</span>
                          <span className="font-semibold">{job.skill_match}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(job.skill_match)} transition-all`}
                            style={{ width: `${job.skill_match}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('aiMatching.experienceMatch')}</span>
                          <span className="font-semibold">{job.experience_match}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(job.experience_match)} transition-all`}
                            style={{ width: `${job.experience_match}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('aiMatching.salaryMatch')}</span>
                          <span className="font-semibold">{job.salary_match}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(job.salary_match)} transition-all`}
                            style={{ width: `${job.salary_match}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Match Reason */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">{t('aiMatching.recommendReason')}</p>
                          <p className="text-sm text-blue-800">{job.match_reason}</p>
                        </div>
                      </div>
                    </div>

                    {/* Concerns */}
                    {job.concerns && job.concerns !== 'なし' && job.concerns !== 'None' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-yellow-900 mb-1">{t('aiMatching.concerns')}</p>
                            <p className="text-sm text-yellow-800">{job.concerns}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">{t('aiMatching.noMatchingJobs')}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                onClick={handleReset}
                variant="outline"
                className="shadow-md"
              >
                {t('aiMatching.close')}
              </Button>
              <Button
                onClick={handleMatch}
                className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('aiMatching.reMatch')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
