import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { publicApi } from '../../api/services'
import { X, Star, MessageSquare, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CourseFeedbackModal({ course, onClose }) {
  const [rating, setRating]     = useState(0)
  const [hovered, setHovered]   = useState(0)
  const [message, setMessage]   = useState('')
  const [name, setName]         = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: (data) => publicApi.submitFeedback(data),
    onSuccess: () => {
      setSubmitted(true)
    },
    onError: () => {
      toast.error('Failed to submit feedback. Please try again.')
    },
  })

  const handleSubmit = () => {
    if (!message.trim()) return toast.error('Please write your feedback.')
    if (rating === 0)    return toast.error('Please select a rating.')

    mutation.mutate({
      name:       name.trim() || 'Anonymous',
      message:    message.trim(),
      rating,
      courseTitle: course?.title ?? '',
    })
  }

  const stars = [1, 2, 3, 4, 5]
  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Course Feedback</p>
              <h2 className="text-white font-semibold text-sm leading-tight line-clamp-1">
                {course?.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">

          {submitted ? (
            /* Success state */
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Thank you for your feedback!</h3>
              <p className="text-sm text-gray-500">
                Your feedback will appear as a testimonial after admin review.
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              {/* Star rating */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Your Rating *
                </label>
                <div className="flex items-center gap-1">
                  {stars.map(s => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        size={28}
                        className="transition-colors duration-100"
                        fill={(hovered || rating) >= s ? '#f59e0b' : 'none'}
                        stroke={(hovered || rating) >= s ? '#f59e0b' : '#d1d5db'}
                      />
                    </button>
                  ))}
                  {(hovered || rating) > 0 && (
                    <span className="ml-2 text-sm font-medium text-amber-500">
                      {ratingLabels[hovered || rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Priya S."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 transition"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Your Feedback *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What did you love about this course? How did it help you?"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300 resize-none transition"
                />
                <p className="text-xs text-gray-400 text-right">{message.length}/500</p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {mutation.isPending ? 'Submitting…' : 'Submit Feedback'}
              </button>

              <p className="text-center text-xs text-gray-400">
                Feedback is reviewed by admin before appearing as a testimonial.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}