import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
})

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            My Inventory Project
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...register('email')}
              placeholder="Enter your email"
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                error={errors.password?.message}
                {...register('password')}
                placeholder="Enter your password"
                icon={showPassword ? EyeSlashIcon : EyeIcon}
                onIconClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              Sign in
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 