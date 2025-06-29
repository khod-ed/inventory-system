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
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
})

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()

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
      await signup(data.firstName, data.lastName, data.email, data.password)
      toast.success('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                error={errors.firstName?.message}
                {...register('firstName')}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                error={errors.lastName?.message}
                {...register('lastName')}
                placeholder="Enter your last name"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...register('email')}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              error={errors.password?.message}
              {...register('password')}
              placeholder="Create a password"
              icon={showPassword ? EyeSlashIcon : EyeIcon}
              onIconClick={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              icon={showConfirmPassword ? EyeSlashIcon : EyeIcon}
              onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage 