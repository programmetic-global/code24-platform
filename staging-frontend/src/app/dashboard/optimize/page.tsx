'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Upload, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function OptimizeProject() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    websiteUrl: '',
    businessType: 'technology',
    primaryGoal: 'conversions',
    description: '',
    accessMethod: 'url'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [workflowId, setWorkflowId] = useState<string | null>(null)

  const businessTypes = [
    { value: 'technology', label: 'Technology/SaaS' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'restaurant', label: 'Restaurant/Food' },
    { value: 'professional', label: 'Professional Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'education', label: 'Education' },
    { value: 'fitness', label: 'Fitness/Wellness' },
    { value: 'other', label: 'Other' }
  ]

  const primaryGoals = [
    { value: 'conversions', label: 'Increase Conversions' },
    { value: 'lead_generation', label: 'Generate More Leads' },
    { value: 'sales', label: 'Drive More Sales' },
    { value: 'engagement', label: 'Boost User Engagement' },
    { value: 'traffic', label: 'Increase Traffic' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Call the OPTIMIZE workflow
      const response = await fetch(process.env.NEXT_PUBLIC_OPTIMIZE_WORKFLOW_URL || '/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: 'demo-user',
          userEmail: 'demo@example.com'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setWorkflowId(result.id)
        
        // Redirect to status page after a moment
        setTimeout(() => {
          router.push(`/dashboard/optimize/${result.id}`)
        }, 2000)
      } else {
        throw new Error('Failed to start OPTIMIZE workflow')
      }
    } catch (error) {
      console.error('Error starting OPTIMIZE workflow:', error)
      alert('Failed to start OPTIMIZE workflow. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (workflowId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">OPTIMIZE Workflow Started!</h1>
          <p className="text-gray-600 mb-6">
            Your AI Worker team is now analyzing and optimizing your website. You'll be redirected to monitor progress.
          </p>
          <div className="text-sm text-blue-600">
            Workflow ID: {workflowId}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Website</h1>
          <p className="text-gray-600">Connect your existing website and our AI Workers will transform it into a learning website</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">OPTIMIZE Workflow</h2>
                <p className="text-emerald-100">AI Workers transform your site into a learning website in 5-12 minutes</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Enter the URL of the website you want to optimize</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Goal
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {primaryGoals.map(goal => (
                    <option key={goal.value} value={goal.value}>{goal.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Tell us about your current challenges, target audience, or specific optimization goals..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-medium">What happens next:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Complete website analysis and competitive research</li>
                  <li>• Learning AI system integration</li>
                  <li>• Performance and conversion optimization</li>
                  <li>• Continuous learning and improvement begins</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Starting Optimization...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span>Start OPTIMIZE Workflow</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Need Help Connecting Your Website?</h3>
              <p className="text-blue-700 text-sm mb-3">
                Our AI Workers can analyze any publicly accessible website. For private or staging sites, you may need additional setup.
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Make sure your website is publicly accessible</li>
                <li>• Remove any password protection temporarily</li>
                <li>• Ensure your site loads properly on desktop and mobile</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}