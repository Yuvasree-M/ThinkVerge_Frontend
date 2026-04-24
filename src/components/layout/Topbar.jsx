import { useState } from 'react'
import { Bell, Search, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import api from '../../api/axios' // ✅ correct import

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
  const { user, setUser } = useAuth()
  const { pathname } = useLocation()
  const [openProfile, setOpenProfile] = useState(false)

  const title = TITLES[pathname] || 'ThinkVerge LMS'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning'
    : hour < 17 ? 'Good afternoon'
    : 'Good evening'

  return (
    <>
      <header className="h-16 bg-white border-b flex items-center gap-4 px-6">

        {/* Menu */}
        <button onClick={onMenuClick}>
          <Menu size={20} />
        </button>

        {/* Title */}
        <div>
          <h1 className="font-bold text-lg">{title}</h1>
          <p className="text-xs text-gray-500">
            {greeting}, {user?.name}
          </p>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">

          <Search size={18} />
          <Bell size={18} />

          {/* Avatar */}
          <button
            onClick={() => setOpenProfile(true)}
            className="w-9 h-9 rounded-full overflow-hidden border"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center">
                {user?.name?.[0]}
              </div>
            )}
          </button>
        </div>
      </header>

      {openProfile && (
        <ProfileModal
          user={user}
          setUser={setUser}
          onClose={() => setOpenProfile(false)}
        />
      )}
    </>
  )
}

/* ───────────────────────────── */
/* PROFILE MODAL */
/* ───────────────────────────── */

function ProfileModal({ user, setUser, onClose }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

const handleUpload = async (file) => {
  if (!file) return

  try {
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    const res = // ✅ CORRECT
await api.post('/users/profile-image', formData) 
    // ✅ NO manual headers!

    const updatedUser = res.data  // ✅ Axios uses .data

    setUser(updatedUser)

  } catch (e) {
    console.error(e)
    alert('Upload failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-xl w-80 relative">

        {/* Close */}
        <button onClick={onClose} className="absolute top-2 right-2">
          <X size={18} />
        </button>

        <div className="flex flex-col items-center">

          {/* Avatar Upload */}
          <label className="cursor-pointer group">

            <div className="w-20 h-20 rounded-full overflow-hidden border">

              {(preview || user?.profileImage) ? (
                <img
                  src={preview || user.profileImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-xl">
                  {user?.name?.[0]}
                </div>
              )}

            </div>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files[0])}
            />

            <p className="text-xs text-center mt-2 text-gray-500">
              {loading ? 'Uploading...' : 'Change Photo'}
            </p>
          </label>

          {/* Info */}
          <h2 className="mt-3 font-bold">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-xs mt-1">{user?.role}</p>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('jwt')
            window.location.href = '/login'
          }}
          className="mt-5 w-full border py-2 text-red-500 hover:bg-red-50 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}