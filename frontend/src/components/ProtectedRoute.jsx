import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function ProtectedRoute({ children, requiredRole }) {
  const { user, token, initialized } = useSelector((s) => s.auth)

  if (!initialized) return (
    <div className="page-loader">
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  )

  if (!token || !user) return <Navigate to="/login" replace />

// user.roles === 'ROLE_CUSTOMER' not user.role
if (requiredRole && user.roles !== requiredRole) {
  return <Navigate to="/login" replace />
}

  return children
}