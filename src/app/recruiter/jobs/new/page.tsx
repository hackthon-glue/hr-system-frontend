'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import apiClient from '@/lib/api/client';

const jobSchema = z.object({
  title: z.string().min(1, 'Please enter job title'),
  department: z.string().min(1, 'Please enter department name'),
  description: z.string().min(1, 'Please enter job description'),
  responsibilities: z.string().min(1, 'Please enter main responsibilities'),
  qualifications: z.string().min(1, 'Please enter required qualifications'),
  location: z.string().min(1, 'Please enter location'),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'temporary']),
  experience_level: z.enum(['entry', 'junior', 'mid', 'senior', 'lead']),
  salary_min: z.string().min(1, 'Please enter minimum salary'),
  salary_max: z.string().min(1, 'Please enter maximum salary'),
  preferred_qualifications: z.string().optional(),
  benefits: z.string().optional(),
  remote_work_option: z.string().optional(),
  deadline: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      employment_type: 'full_time',
      experience_level: 'mid',
    },
  });

  const onSubmit = async (data: JobFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const jobData = {
        ...data,
        salary_min: parseInt(data.salary_min),
        salary_max: parseInt(data.salary_max),
        status: 'draft',
      };

      await apiClient.post('/api/jobs/', jobData);
      router.push('/recruiter/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create job posting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/recruiter/dashboard" className="text-blue-600 hover:text-blue-900">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Create New Job</h1>
          <p className="mt-2 text-gray-600">Enter job information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Input
              {...register('title')}
              label="Job Title *"
              error={errors.title?.message}
              placeholder="e.g. Senior Frontend Engineer"
            />

            <Input
              {...register('department')}
              label="Department *"
              error={errors.department?.message}
              placeholder="e.g. Engineering"
            />

            <Textarea
              {...register('description')}
              label="Job Description *"
              error={errors.description?.message}
              placeholder="Describe the job responsibilities in detail"
              rows={5}
            />

            <Textarea
              {...register('responsibilities')}
              label="Main Responsibilities *"
              error={errors.responsibilities?.message}
              placeholder="List the main duties and areas of responsibility"
              rows={4}
            />

            <Textarea
              {...register('qualifications')}
              label="Required Qualifications *"
              error={errors.qualifications?.message}
              placeholder="List required qualifications (e.g. 3+ years React experience, TypeScript proficiency, etc.)"
              rows={4}
            />

            <Input
              {...register('location')}
              label="Location *"
              error={errors.location?.message}
              placeholder="e.g. Shibuya, Tokyo"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                {...register('employment_type')}
                label="Employment Type *"
                error={errors.employment_type?.message}
                options={[
                  { value: 'full_time', label: 'Full-time' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'part_time', label: 'Part-time' },
                  { value: 'internship', label: 'Internship' },
                  { value: 'temporary', label: 'Temporary' },
                ]}
              />

              <Select
                {...register('experience_level')}
                label="Experience Level *"
                error={errors.experience_level?.message}
                options={[
                  { value: 'entry', label: 'Entry Level / New Graduate' },
                  { value: 'junior', label: 'Junior (1-3 years)' },
                  { value: 'mid', label: 'Mid-level (3-7 years)' },
                  { value: 'senior', label: 'Senior (7+ years)' },
                  { value: 'lead', label: 'Lead / Manager' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('salary_min')}
                type="number"
                label="Minimum Salary (Annual) *"
                error={errors.salary_min?.message}
                placeholder="4000000"
              />

              <Input
                {...register('salary_max')}
                type="number"
                label="Maximum Salary (Annual) *"
                error={errors.salary_max?.message}
                placeholder="8000000"
              />
            </div>

            <Textarea
              {...register('preferred_qualifications')}
              label="Preferred Qualifications"
              error={errors.preferred_qualifications?.message}
              placeholder="List preferred qualifications, skills, and experience (e.g. AWS certification, Agile development experience, etc.)"
              rows={4}
            />

            <Textarea
              {...register('benefits')}
              label="Benefits"
              error={errors.benefits?.message}
              placeholder="Describe benefits and perks"
              rows={4}
            />

            <Input
              {...register('remote_work_option')}
              label="Remote Work"
              error={errors.remote_work_option?.message}
              placeholder="e.g. Fully remote, 2 days/week remote, etc."
            />

            <Input
              {...register('deadline')}
              type="date"
              label="Application Deadline"
              error={errors.deadline?.message}
            />

            <div className="flex justify-end space-x-4">
              <Link href="/recruiter/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={isLoading}>
                {isLoading ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
