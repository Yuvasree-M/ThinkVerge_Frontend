import { useState, useEffect, useRef } from 'react'
import { Bell, Search, Menu, User, LogOut, KeyRound, ChevronDown, Trash2, Upload, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import api from '../../api/axios'

const TITLES = {
  '/admin': 'Admin Dashboard',
  '/admin/courses': 'Course Management',
  '/admin/users': 'User Management',
  '/instructor': 'Instructor Dashboard',
  '/instructor/courses': 'My Courses',
  '/instructor/enrollments': 'Enrollment Requests',
  '/instructor/assignments': 'Assignments',
  '/instructor/submissions': 'Submissions',
  '/student': 'Dashboard',
  '/student/courses': 'Browse Courses',
  '/student/enrollments': 'My Learning',
  '/student/progress': 'My Progress',
  '/student/submissions': 'My Submissions',
}

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [openProfile, setOpenProfile] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const title = TITLES[pathname] || 'ThinkVerge LMS'
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning'
    : hour < 17 ? 'Good afternoon'
    : 'Good evening'

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-6 sticky top-0 z-30">

        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-semibold text-gray-900 text-base leading-tight">{title}</h1>
          <p className="text-xs text-gray-400 leading-tight">
            {greeting}, {user?.name}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1">

          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            <Search size={17} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            <Bell size={17} />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenDropdown(prev => !prev)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xs font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-gray-700 leading-tight max-w-[100px] truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.role?.toLowerCase()}</p>
              </div>
              <ChevronDown
                size={13}
                className={`text-gray-400 transition-transform duration-200 ${openDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {openDropdown && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                {/* User card */}
                <div className="px-4 py-3.5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
                      {user?.profileImage ? (
                        <img src={user.profileImage} className="w-full h-full object-cover" alt="avatar" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-sm font-semibold">
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <button
                    onClick={() => { setOpenProfile('info'); setOpenDropdown(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                      <User size={13} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span>Edit profile</span>
                  </button>
                  <button
                    onClick={() => { setOpenProfile('password'); setOpenDropdown(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-purple-50 flex items-center justify-center transition-colors">
                      <KeyRound size={13} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                    </div>
                    <span>Change password</span>
                  </button>
                </div>

                <div className="p-1.5 border-t border-gray-100">
                  <button
                    onClick={() => { setOpenProfile('logout'); setOpenDropdown(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                      <LogOut size={13} className="text-red-400" />
                    </div>
                    <span>Sign out</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile modal */}
      {openProfile && openProfile !== 'logout' && (
        <ProfileModal
          initialTab={openProfile}
          onClose={() => setOpenProfile(false)}
        />
      )}

      {/* Logout confirmation */}
      {openProfile === 'logout' && (
        <LogoutConfirm
          onConfirm={logout}
          onCancel={() => setOpenProfile(false)}
        />
      )}
    </>
  )
}

// ── Logout Confirmation ───────────────────────────────────────────────────────

function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl w-[320px] overflow-hidden shadow-2xl shadow-gray-300/40">

        <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Sign out?</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            You'll be logged out of your account and redirected to the login page.
          </p>
        </div>

        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  )
}

// ── ProfileModal ──────────────────────────────────────────────────────────────

function ProfileModal({ initialTab, onClose }) {
  const { user, setUser } = useAuth()

  const [tab, setTab] = useState(initialTab || 'info')
  const [name, setName] = useState(user?.name || '')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    setName(user?.name || '')
  }, [user?.name])

  const switchTab = (t) => { setTab(t); setMsg(null) }
  const hasImage = !!user?.profileImage

  // ── Upload / replace photo ────────────────────────────────
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgLoading(true)
    setMsg(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = hasImage
        ? await api.put('/users/profile', fd)
        : await api.post('/users/profile-image', fd)
      setUser(res.data)
      setMsg({ type: 'success', text: 'Photo updated!' })
    } catch {
      setMsg({ type: 'error', text: 'Photo upload failed.' })
    } finally {
      setImgLoading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ── Delete photo ──────────────────────────────────────────
  const handlePhotoDelete = async () => {
    setImgLoading(true)
    setMsg(null)
    try {
      const res = await api.delete('/users/profile-image')
      setUser(res.data)
      setMsg({ type: 'success', text: 'Photo removed.' })
    } catch {
      setMsg({ type: 'error', text: 'Failed to remove photo.' })
    } finally {
      setImgLoading(false)
    }
  }

  // ── Save name ─────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!name.trim()) return
    setLoading(true)
    setMsg(null)
    try {
      const fd = new FormData()
      fd.append('name', name.trim())
      const res = await api.put('/users/profile', fd)
      setUser(res.data)
      setMsg({ type: 'success', text: 'Name updated!' })
    } catch {
      setMsg({ type: 'error', text: 'Failed to save name.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Save password ─────────────────────────────────────────
  const handleSavePassword = async () => {
    if (!currentPass) {
      setMsg({ type: 'error', text: 'Enter your current password.' })
      return
    }
    if (!newPass || newPass !== confirmPass) {
      setMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (newPass.length < 8) {
      setMsg({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    if (currentPass === newPass) {
      setMsg({ type: 'error', text: 'New password must differ from current.' })
      return
    }
    setLoading(true)
    setMsg(null)
    try {
      const fd = new FormData()
      fd.append('currentPassword', currentPass)
      fd.append('newPassword', newPass)
      const res = await api.put('/users/profile', fd)
      setUser(res.data)
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
      setMsg({ type: 'success', text: 'Password updated!' })
    } catch (e) {
      const errMsg = e.response?.data?.error || 'Failed to update password.'
      setMsg({ type: 'error', text: errMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl w-[360px] overflow-hidden shadow-2xl shadow-gray-300/40">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">My profile</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-base leading-none"
          >
            ✕
          </button>
        </div>

        {/* Avatar section */}
        <div className="px-5 py-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-md">
                {imgLoading ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Info + buttons */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate mb-1">{user?.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 mb-2.5">
                {user?.role}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={imgLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Upload size={10} />
                  {hasImage ? 'Replace' : 'Upload photo'}
                </button>

                {hasImage && (
                  <button
                    onClick={handlePhotoDelete}
                    disabled={imgLoading}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border border-red-100 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 disabled:opacity-50 transition-all shadow-sm"
                  >
                    <Trash2 size={10} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <input ref={fileRef} type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </div>

          {/* Photo feedback msg */}
          {msg && tab !== 'info' && tab !== 'password' && (
            <p className={`mt-3 text-xs ${msg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {msg.text}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex px-5 border-b border-gray-100 bg-white">
          {['info', 'password'].map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-3 text-xs font-medium border-b-2 transition-all ${
                tab === t
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'info' ? 'Profile info' : 'Password'}
            </button>
          ))}
        </div>

        {/* Tab: Profile info */}
        {tab === 'info' && (
          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">Display name</label>
              <input
                className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-300"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">Email address</label>
              <input
                className="border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                value={user?.email || ''}
                disabled
              />
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-gray-200 inline-flex items-center justify-center text-[8px] text-gray-500">i</span>
                Email cannot be changed
              </span>
            </div>

            {msg && (
              <div className={`px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                msg.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {msg.text}
              </div>
            )}

            <button
              onClick={handleSaveName}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 transition-colors shadow-sm shadow-blue-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save changes'}
            </button>
          </div>
        )}

        {/* Tab: Password */}
        {tab === 'password' && (
          <div className="px-5 py-5 flex flex-col gap-4">
            {[
              { label: 'Current password',     value: currentPass,  setter: setCurrentPass },
              { label: 'New password',         value: newPass,      setter: setNewPass },
              { label: 'Confirm new password', value: confirmPass,  setter: setConfirmPass },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">{label}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  value={value}
                  onChange={e => setter(e.target.value)}
                />
              </div>
            ))}

            {msg && (
              <div className={`px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                msg.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {msg.text}
              </div>
            )}

            <button
              onClick={handleSavePassword}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 transition-colors shadow-sm shadow-blue-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </span>
              ) : 'Update password'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}