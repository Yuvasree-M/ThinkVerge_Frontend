import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import ConfirmDialog from "./ConfirmDialog"

export default function LogoutConfirm() {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  // expose globally
  window.showLogoutConfirm = () => setOpen(true)

  return (
    <ConfirmDialog
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => {
        setOpen(false)
        logout()
      }}
      title="Sign out?"
      message="Are you sure you want to logout?"
      confirmLabel="Sign Out"
      danger
    />
  )
}