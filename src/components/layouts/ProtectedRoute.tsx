import { Navigate, Outlet } from 'react-router'

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // TODO: Replace with actual auth logic from your store (e.g. Zustand)
  const isAuthenticated = !!localStorage.getItem('access_token')
  const userRole = 'user' // Define role checking logic here

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Render child route screens within the parent layout
  return <Outlet />
}
