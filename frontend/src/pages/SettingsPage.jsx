import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  Cog6ToothIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Card from '../components/Card'
import Badge from '../components/Badge'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'admin'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    outOfStockAlerts: true,
    weeklyReports: false,
    emailNotifications: true
  })

  const [systemSettings, setSystemSettings] = useState({
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'en'
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'System', icon: Cog6ToothIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ]

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Notification settings updated!')
    } catch (error) {
      toast.error('Failed to update notification settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSystemUpdate = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('System settings updated!')
    } catch (error) {
      toast.error('Failed to update system settings')
    } finally {
      setLoading(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                label="Role"
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                options={[
                  { value: 'admin', label: 'Administrator' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'user', label: 'User' }
                ]}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" loading={loading}>
                Update Profile
              </Button>
            </div>
          </form>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Alert Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Low Stock Alerts</p>
                    <p className="text-sm text-gray-500">Get notified when items are running low</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.lowStockAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      lowStockAlerts: e.target.checked
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Out of Stock Alerts</p>
                    <p className="text-sm text-gray-500">Get notified when items are completely out of stock</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.outOfStockAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      outOfStockAlerts: e.target.checked
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weekly Reports</p>
                    <p className="text-sm text-gray-500">Receive weekly inventory summary reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyReports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: e.target.checked
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleNotificationUpdate} loading={loading}>
                Save Preferences
              </Button>
            </div>
          </div>
        )

      case 'system':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                label="Currency"
                value={systemSettings.currency}
                onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                options={[
                  { value: 'USD', label: 'US Dollar ($)' },
                  { value: 'EUR', label: 'Euro (€)' },
                  { value: 'GBP', label: 'British Pound (£)' },
                  { value: 'CAD', label: 'Canadian Dollar (C$)' }
                ]}
              />
              
              <Select
                label="Timezone"
                value={systemSettings.timezone}
                onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'EST', label: 'Eastern Time' },
                  { value: 'PST', label: 'Pacific Time' },
                  { value: 'GMT', label: 'Greenwich Mean Time' }
                ]}
              />
              
              <Select
                label="Date Format"
                value={systemSettings.dateFormat}
                onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                ]}
              />
              
              <Select
                label="Language"
                value={systemSettings.language}
                onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' }
                ]}
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSystemUpdate} loading={loading}>
                Save Settings
              </Button>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Password</h3>
              <p className="text-sm text-gray-500">
                Update your password to keep your account secure.
              </p>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                />
                
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
              />
              
              <Button icon={KeyIcon}>
                Update Password
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add an extra layer of security to your account.
              </p>
              
              <div className="mt-4">
                <Badge variant="warning">Not Enabled</Badge>
                <Button variant="secondary" className="ml-3">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 inline mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <Card>
        {renderTabContent()}
      </Card>
    </div>
  )
}

export default SettingsPage 