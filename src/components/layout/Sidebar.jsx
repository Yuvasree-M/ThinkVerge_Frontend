import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import clsx from 'clsx'
import { useState } from 'react'

import {
  LayoutDashboard, BookOpen, Users, GraduationCap,
  ClipboardList, BarChart2, FileText, Award,
  LogOut, ChevronRight, Layers
} from 'lucide-react'

import ConfirmDialog from '../common/ConfirmDialog'

const NAV = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/users', label: 'Users', icon: Users },
  ],
  INSTRUCTOR: [
    { to: '/instructor', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/instructor/courses', label: 'My Courses', icon: BookOpen },
    { to: '/instructor/enrollments', label: 'Enrollments', icon: Users },
    { to: '/instructor/assignments', label: 'Assignments', icon: ClipboardList },
    { to: '/instructor/submissions', label: 'Submissions', icon: FileText },
  ],
  STUDENT: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/courses', label: 'Browse', icon: BookOpen },
    { to: '/student/enrollments', label: 'My Learning', icon: GraduationCap },
    { to: '/student/progress', label: 'Progress', icon: BarChart2 },
    { to: '/student/submissions', label: 'Submissions', icon: FileText },
    { to: '/student/certificates', label: 'Certificates', icon: Award },
  ],
}

export default function Sidebar({ collapsed, onToggle }) {
  const { role, user, logout } = useAuth()
  const { pathname } = useLocation()

  const [logoutOpen, setLogoutOpen] = useState(false)

  const items = NAV[role] || []

  return (
    <>
      <aside
        className={clsx(
          'flex flex-col h-full bg-royal-gradient transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
<div className="flex items-center px-3 py-4 border-b border-white/10">

  {/* Logo - ALWAYS visible */}
  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
    <img
      src="/logo.png"
      alt="ThinkVerge"
      className="w-full h-full object-contain p-1"
    />
  </div>

  {/* Text - ONLY when expanded */}
  {!collapsed && (
    <div className="ml-3">
      <p className="font-display font-bold text-white text-sm leading-tight">
        ThinkVerge
      </p>
      <p className="text-royal-200 text-xs">LMS Platform</p>
    </div>
  )}

  {/* Toggle button */}
  <button
    onClick={onToggle}
    className="ml-auto p-1 rounded-lg text-royal-300 hover:text-white hover:bg-white/10"
  >
    <ChevronRight
      size={16}
      className={clsx(
        'transition-transform',
        collapsed ? '' : 'rotate-180'
      )}
    />
  </button>

</div>

        {/* Role */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-gold-300 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
              {role}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {items.map(({ to, label, icon: Icon }) => {
            const active =
              pathname === to ||
              (to !== '/admin' &&
                to !== '/instructor' &&
                to !== '/student' &&
                pathname.startsWith(to))

            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-royal-200 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">

          {/* Logout */}
          <button
           onClick={() => window.showLogoutConfirm()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-royal-300 hover:text-white hover:bg-red-500/20 transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

    </>
  )
}