import { Bell, Search, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/admin':                   'Admin Dashboard',
  '/admin/courses':           'Course Management',
  '/admin/users':             'User Management',
  '/instructor':              'Instructor Dashboard',
  '/instructor/courses':      'My Courses',
  '/instructor/enrollments':  'Enrollment Requests',
  '/instructor/assignments':  'Assignments',
  '/instructor/submissions':  'Submissions',
  '/student':                 'Dashboard',
  '/student/courses':         'Browse Courses',
  '/student/enrollments':     'My Learning',
  '/student/progress':        'My Progress',
  '/student/submissions':     'My Submissions',
}

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'ThinkVerge LMS'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="h-16 bg-white border-b border-royal-100 flex items-center gap-4 px-6 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg text-navy-400 hover:text-royal-600 hover:bg-royal-50 transition-colors lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div>
        <h1 className="font-display font-bold text-navy-900 text-lg leading-tight">{title}</h1>
        <p className="text-xs text-slate-lms hidden sm:block">
          {greeting}, {user?.name || user?.email?.split('@')[0] || 'User'} 👋
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-royal-100">
          <Search size={15} className="text-slate-lms" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-navy-800 placeholder-slate-muted w-40 focus:outline-none"
          />
        </div>

        {/* Notifications */}
        <button className="btn-icon relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-500 border-2 border-white"></span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-royal-gradient flex items-center justify-center text-white text-sm font-bold ml-1 shadow-royal">
          {(user?.name || user?.email || 'U')[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}
