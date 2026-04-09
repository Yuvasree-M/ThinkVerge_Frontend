import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import clsx from 'clsx'
import {
  LayoutDashboard, BookOpen, Users, GraduationCap,
  ClipboardList, BarChart2, FileText, Upload,
  Settings, LogOut, ChevronRight, Layers
} from 'lucide-react'

const NAV = {
  ADMIN: [
    { to: '/admin',          label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/admin/courses',  label: 'Courses',     icon: BookOpen },
    { to: '/admin/users',    label: 'Users',       icon: Users },
  ],
  INSTRUCTOR: [
    { to: '/instructor',             label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/instructor/courses',     label: 'My Courses',  icon: BookOpen },
    { to: '/instructor/enrollments', label: 'Enrollments', icon: Users },
    { to: '/instructor/assignments', label: 'Assignments', icon: ClipboardList },
    { to: '/instructor/submissions', label: 'Submissions', icon: FileText },
  ],
  STUDENT: [
    { to: '/student',             label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/student/courses',     label: 'Browse',      icon: BookOpen },
    { to: '/student/enrollments', label: 'My Learning', icon: GraduationCap },
    { to: '/student/progress',    label: 'Progress',    icon: BarChart2 },
    { to: '/student/submissions', label: 'Submissions', icon: FileText },
  ],
}

export default function Sidebar({ collapsed, onToggle }) {
  const { role, user, logout } = useAuth()
  const { pathname } = useLocation()
  const items = NAV[role] || []

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-royal-gradient transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
          <Layers size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-white text-base leading-tight">ThinkVerge</p>
            <p className="text-royal-200 text-xs">LMS Platform</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-lg text-royal-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={16} className={clsx('transition-transform', collapsed ? '' : 'rotate-180')} />
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-gold-300 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
            {role}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/admin' && to !== '/instructor' && to !== '/student' && pathname.startsWith(to))
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-royal-200 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400"></span>}
            </Link>
          )
        })}
      </nav>

      {/* User & logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name || user?.email}</p>
              <p className="text-royal-300 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-royal-300 hover:text-white hover:bg-red-500/20 transition-all duration-150"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
