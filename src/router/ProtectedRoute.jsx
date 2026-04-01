import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LoadingScreen from '../components/ui/LoadingScreen'

export default function ProtectedRoute({ children, requiredRole }) {
  const user = useAuthStore(s => s.user)
  const profile = useAuthStore(s => s.profile)
  const loading = useAuthStore(s => s.loading)

  // Attend que l'auth ET le profil soient chargés
  if (loading || (user && !profile)) return <LoadingScreen />

  if (!user) return <Navigate to="/connexion" replace />

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}