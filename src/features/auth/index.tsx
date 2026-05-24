import { useNavigate } from 'react-router'
import { LoginForm } from './components/LoginForm'

export const AuthLoginFeature = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold">Đăng nhập</h1>
        <LoginForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  )
}
