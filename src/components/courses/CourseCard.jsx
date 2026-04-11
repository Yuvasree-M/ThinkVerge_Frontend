import { Clock, BookOpen, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const STATUS_BADGE = {
  APPROVED: 'badge-green',
  PENDING:  'badge-yellow',
  REJECTED: 'badge-red',
}

export default function CourseCard({ course, to, actions, showStatus = false }) {
  const card = (
    <div className="card-hover flex flex-col h-full group">
      {/* Thumbnail */}
      <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-royal-gradient">
        {course.thumbnail? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-hero-pattern">
            <BookOpen size={36} className="text-white/60" />
          </div>
        )}
        {showStatus && course.status && (
          <span className={clsx('badge absolute top-2 right-2', STATUS_BADGE[course.status])}>
            {course.status}
          </span>
        )}
        {/* Category pill */}
        {course.category && (
          <span className="absolute bottom-2 left-2 badge bg-navy-900/70 text-white backdrop-blur-sm">
            {course.category}
          </span>
        )}
      </div>

      <h3 className="font-display font-semibold text-navy-900 text-base mb-1 leading-snug group-hover:text-royal-600 transition-colors line-clamp-2">
        {course.title}
      </h3>

      <p className="text-xs text-slate-lms mb-3 line-clamp-2 flex-1">{course.description}</p>

      <div className="flex items-center gap-4 text-xs text-slate-lms border-t border-royal-50 pt-3">
        {course.durationHours && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> {course.durationHours}h
          </span>
        )}
        {course.instructor && (
          <span className="flex items-center gap-1 truncate">
            <User size={12} /> {course.instructor?.name || course.instructor}
          </span>
        )}
      </div>

      {actions && <div className="flex gap-2 mt-3 pt-3 border-t border-royal-50">{actions}</div>}
    </div>
  )

  if (to) return <Link to={to} className="block">{card}</Link>
  return card
}
