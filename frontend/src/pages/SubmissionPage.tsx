import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTestimonialSchema,
  CreateTestimonialFormData,
} from '../schemas/testimonial.schema';
import { testimonialApi } from '../api/testimonial.api';
import { extractErrorMessage } from '../utils/formatters';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import Avatar from '../components/ui/Avatar';

// ─── Submission Page ──────────────────────────────────────────────────────────

const SubmissionPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTestimonialFormData>({
    resolver: zodResolver(createTestimonialSchema),
    defaultValues: {
      rating: 0,
      consentGiven: false,
    },
  });

  const rating = watch('rating');
  const message = watch('message') ?? '';
  const customerName = watch('customerName') ?? '';

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profileImage', file, { shouldValidate: true });
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (): void => {
    setValue('profileImage', undefined);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: CreateTestimonialFormData): Promise<void> => {
    setSubmitError(null);
    try {
      await testimonialApi.submit(data);
      setIsSubmitted(true);
      reset();
      setImagePreview(null);
    } catch (err) {
      setSubmitError(extractErrorMessage(err));
    }
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Thank You!</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your testimonial has been submitted successfully. It will be reviewed
            and published once approved. We truly appreciate your feedback!
          </p>
          <Button
            variant="secondary"
            onClick={() => setIsSubmitted(false)}
            size="lg"
          >
            Submit Another Testimonial
          </Button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Share Your Experience
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            We&apos;d Love Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Feedback
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Your testimonial helps others discover how we can help them.
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="customerName"
                label="Full Name"
                placeholder="John Doe"
                required
                error={errors.customerName?.message}
                {...register('customerName')}
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Company */}
            <Input
              id="company"
              label="Company"
              placeholder="Acme Inc."
              required
              error={errors.company?.message}
              {...register('company')}
            />

            {/* Rating */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onChange={(val) => setValue('rating', val, { shouldValidate: true })}
                />
                {rating > 0 && (
                  <span className="text-sm text-gray-400">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-xs text-red-400 flex items-center gap-1" role="alert">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">
                Your Testimonial <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                placeholder="Tell us about your experience with our product or service..."
                rows={5}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 transition-colors duration-150 focus:outline-none focus:ring-2 resize-none
                  ${errors.message
                    ? 'border-red-500/60 bg-red-500/5 focus:ring-red-500/30'
                    : 'border-white/10 hover:border-white/20 focus:ring-indigo-500/50 focus:border-indigo-500/50'
                  }`}
                maxLength={1000}
                aria-invalid={errors.message ? 'true' : undefined}
                {...register('message')}
              />
              <div className="flex items-start justify-between">
                {errors.message ? (
                  <p className="text-xs text-red-400 flex items-center gap-1" role="alert">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.message.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className={`text-xs tabular-nums ${message.length > 900 ? 'text-amber-400' : 'text-gray-500'}`}>
                  {message.length}/1000
                </span>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Profile Photo{' '}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>

              {imagePreview ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <Avatar name={customerName || 'Preview'} imageUrl={imagePreview} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">Photo selected</p>
                    <p className="text-xs text-gray-500 mt-0.5">Looking good!</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeImage} type="button">
                    Remove
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="profileImage"
                  className="flex flex-col items-center gap-3 p-6 bg-white/5 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:bg-white/8 hover:border-white/25 transition-colors duration-150 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-300 font-medium">
                      Click to upload a photo
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      JPG, JPEG, PNG up to 20MB
                    </p>
                  </div>
                  <input
                    id="profileImage"
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              )}
              {errors.profileImage && (
                <p className="text-xs text-red-400 flex items-center gap-1" role="alert">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.profileImage.message as string}
                </p>
              )}
            </div>

            {/* Consent */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="consentGiven"
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer"
                  {...register('consentGiven')}
                />
                <span className="text-sm text-gray-400 leading-relaxed">
                  I consent to this testimonial being publicly displayed on the
                  website. I confirm that the information provided is accurate and
                  represents my genuine experience.
                </span>
              </label>
              {errors.consentGiven && (
                <p className="text-xs text-red-400 flex items-center gap-1" role="alert">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.consentGiven.message}
                </p>
              )}
            </div>

            {/* Server error */}
            {submitError && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Your data is secure and will only be used as described above.
        </p>
      </div>
    </div>
  );
};

export default SubmissionPage;
