'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { jobService } from '@/lib/api/jobs';

export default function EditJobPage() {
  const t = useTranslations();

  const jobSchema = z.object({
    title: z.string().min(1, t('recruiter.jobs.titleRequired')),
    company: z.string().min(1, t('recruiter.jobs.companyRequired')),
    description: z.string().min(1, t('recruiter.jobs.descriptionRequired')),
    location: z.string().min(1, t('recruiter.jobs.locationRequired')),
    employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship']),
    experience_level: z.enum(['entry', 'junior', 'mid', 'senior', 'lead']),
    salary_min: z.string().min(1, t('recruiter.jobs.salaryMinRequired')),
    salary_max: z.string().min(1, t('recruiter.jobs.salaryMaxRequired')),
    requirements: z.string().optional(),
    benefits: z.string().optional(),
    application_deadline: z.string().optional(),
  });

  type JobFormData = z.infer<typeof jobSchema>;
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const job = await jobService.getJob(parseInt(jobId));
      reset({
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        employment_type: job.employment_type as any,
        experience_level: job.experience_level as any,
        salary_min: job.salary_min?.toString() || '',
        salary_max: job.salary_max?.toString() || '',
        requirements: '',
        benefits: '',
        application_deadline: job.application_deadline || '',
      });
    } catch (err) {
      setError(t('recruiter.jobs.fetchError'));
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data: JobFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const jobData = {
        title: data.title,
        company: data.company,
        description: data.description,
        location: data.location,
        employment_type: data.employment_type,
        experience_level: data.experience_level,
        salary_min: parseInt(data.salary_min),
        salary_max: parseInt(data.salary_max),
        ...(data.benefits && { benefits: data.benefits }),
        ...(data.application_deadline && { application_deadline: data.application_deadline }),
      };

      await jobService.updateJob(parseInt(jobId), jobData as any);
      router.push(`/recruiter/jobs/${jobId}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || t('recruiter.jobs.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    router.push('/login');
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-xl animate-pulse"></div>
        </div>
        <p className="mt-6 text-gray-700 font-medium">{t('common.loading')}</p>
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
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleLogout} className="shadow-md hover:shadow-lg">
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/recruiter/jobs/${jobId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('recruiter.jobs.backToJobDetail')}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">{t('recruiter.jobs.editJobTitle')}</h1>
          <p className="text-gray-600 text-lg">{t('recruiter.jobs.editJobSubtitle')}</p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200/50 p-4">
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            )}

            <Input
              {...register('title')}
              label={`${t('recruiter.jobs.jobTitleLabel')} *`}
              error={errors.title?.message}
              placeholder={t('recruiter.jobs.jobTitlePlaceholder')}
            />

            <Input
              {...register('company')}
              label={`${t('recruiter.jobs.companyLabel')} *`}
              error={errors.company?.message}
              placeholder={t('recruiter.jobs.companyPlaceholder')}
            />

            <Textarea
              {...register('description')}
              label={`${t('recruiter.jobs.descriptionLabel')} *`}
              error={errors.description?.message}
              placeholder={t('recruiter.jobs.descriptionPlaceholder')}
              rows={6}
            />

            <Input
              {...register('location')}
              label={`${t('recruiter.jobs.locationLabel')} *`}
              error={errors.location?.message}
              placeholder={t('recruiter.jobs.locationPlaceholder')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                {...register('employment_type')}
                label={`${t('recruiter.jobs.employmentTypeLabel')} *`}
                error={errors.employment_type?.message}
                options={[
                  { value: 'full_time', label: t('employmentTypes.full_time') },
                  { value: 'part_time', label: t('employmentTypes.part_time') },
                  { value: 'contract', label: t('employmentTypes.contract') },
                  { value: 'internship', label: t('employmentTypes.internship') },
                ]}
              />

              <Select
                {...register('experience_level')}
                label={`${t('recruiter.jobs.experienceLevelLabel')} *`}
                error={errors.experience_level?.message}
                options={[
                  { value: 'entry', label: t('experienceLevels.entry') },
                  { value: 'junior', label: t('experienceLevels.junior') },
                  { value: 'mid', label: t('experienceLevels.mid') },
                  { value: 'senior', label: t('experienceLevels.senior') },
                  { value: 'expert', label: t('experienceLevels.expert') },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('salary_min')}
                type="number"
                label={`${t('recruiter.jobs.salaryMinLabel')} *`}
                error={errors.salary_min?.message}
                placeholder={t('recruiter.jobs.salaryMinPlaceholder')}
              />

              <Input
                {...register('salary_max')}
                type="number"
                label={`${t('recruiter.jobs.salaryMaxLabel')} *`}
                error={errors.salary_max?.message}
                placeholder={t('recruiter.jobs.salaryMaxPlaceholder')}
              />
            </div>

            <Textarea
              {...register('requirements')}
              label={t('recruiter.jobs.requirementsLabel')}
              error={errors.requirements?.message}
              placeholder={t('recruiter.jobs.requirementsPlaceholder')}
              rows={4}
            />

            <Textarea
              {...register('benefits')}
              label={t('recruiter.jobs.benefitsLabel')}
              error={errors.benefits?.message}
              placeholder={t('recruiter.jobs.benefitsPlaceholder')}
              rows={4}
            />

            <Input
              {...register('application_deadline')}
              type="date"
              label={t('recruiter.jobs.applicationDeadlineLabel')}
              error={errors.application_deadline?.message}
            />

            <div className="flex justify-end gap-4 pt-6">
              <Link href={`/recruiter/jobs/${jobId}`}>
                <Button type="button" variant="outline" className="shadow-md hover:shadow-lg">
                  {t('recruiter.jobs.cancel')}
                </Button>
              </Link>
              <Button type="submit" loading={isLoading} className="shadow-lg hover:shadow-xl">
                {isLoading ? t('recruiter.jobs.updating') : t('recruiter.jobs.updateJob')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
