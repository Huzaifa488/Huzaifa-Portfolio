'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Send, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:   z.string().email('Please enter a valid email address'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactSectionProps {
  contactEmail?: string
}

export function ContactSection({ contactEmail }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Something went wrong')
      }

      setSubmitted(true)
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message.')
    }
  }

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
              Contact
            </p>
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle mx-auto">
              Whether you have a job opportunity, collaboration idea, or just want to connect — I&apos;d love to hear from you.
            </p>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 mt-4 text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                <Mail className="w-4 h-4" />
                {contactEmail}
              </a>
            )}
          </div>

          {/* Success state */}
          {submitted ? (
            <div className="card card-padding text-center space-y-4 py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Message Sent!
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Thank you for reaching out. I&apos;ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-ghost"
              >
                Send another message
              </button>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card card-padding space-y-5"
              noValidate
            >
              {/* Name */}
              <div>
                <label htmlFor="name" className="label">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder=""
                  className={cn('input-field', errors.name && 'border-red-400 focus:ring-red-400')}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder=""
                  className={cn('input-field', errors.email && 'border-red-400 focus:ring-red-400')}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="label">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your project, opportunity, or question..."
                  className={cn('input-field resize-none', errors.message && 'border-red-400 focus:ring-red-400')}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-3.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 dark:text-gray-600">
                Your message is stored securely. I typically respond within 24–48 hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
