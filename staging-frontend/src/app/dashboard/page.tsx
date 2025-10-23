'use client'

import React, { useState, useEffect } from 'react'
// import { useSession, signOut } from 'next-auth/react' // Removed for static build
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Zap, TrendingUp, BarChart3, Settings, LogOut, Plus, 
  Clock, CheckCircle, AlertCircle, ExternalLink, 
  Sparkles, Activity, Users, Target
} from 'lucide-react'

export default function Dashboard() {
  // const { data: session, status } = useSession() // Removed for static build
  const router = useRouter()
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'TechFlow Solutions',
      type: 'build',
      status: 'completed',
      createdAt: '2025-10-21T10:00:00Z',
      url: 'https://techflow-demo.code24.dev',
      metrics: { score: 92, visitors: 1247, conversions: 84 }
    },
    {
      id: '2', 
      name: 'example.com',
      type: 'optimize',
      status: 'in_progress',
      createdAt: '2025-10-21T14:30:00Z',
      url: 'https://example.com',
      metrics: { score: 67, visitors: 892, conversions: 23 }
    }
  ])

  // Mock user session for static demo
  const session = {
    user: {
      name: 'Demo User',
      email: 'demo@example.com'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">24</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Code24</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user.name || session.user.email}</span>
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your AI Worker projects and monitor performance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((sum, p) => sum + p.metrics.visitors, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((sum, p) => sum + p.metrics.conversions, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(projects.reduce((sum, p) => sum + p.metrics.score, 0) / projects.length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Link
            href="/dashboard/optimize"
            className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl p-6 hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 group shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <div className="text-2xl">🧠</div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Start OPTIMIZE Project</h3>
                <p className="text-emerald-100 text-sm mb-2">AI Workers + The Strategist (CRO) transform your existing website</p>
                <div className="flex space-x-2 text-xs text-emerald-200">
                  <span>✓ Technical fixes</span>
                  <span>✓ CRO psychology</span>
                  <span>✓ A/B testing</span>
                </div>
              </div>
              <Plus className="w-6 h-6 ml-auto group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-dashed border-blue-300 rounded-xl p-6 opacity-75">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-200 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-800 mb-1">BUILD Project</h3>
                <p className="text-blue-600 text-sm mb-2">AI Workers build new websites from scratch</p>
                <div className="text-xs text-blue-500">
                  <span className="bg-blue-200 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List with CRO Insights */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Active Optimization Projects</h2>
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <span className="text-lg">🧠</span>
                <span className="font-medium">Deep CRO Analysis Active</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y">
            {projects.map((project) => (
              <div key={project.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="space-y-4">
                  {/* Project Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(project.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                              {project.type === 'optimize' ? 'OPTIMIZE + CRO' : project.type}
                            </span>
                            <span>•</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm font-medium">View Site</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">Performance Score</div>
                      <div className="text-lg font-bold text-gray-900">{project.metrics.score}/100</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-blue-600 mb-1">Visitors</div>
                      <div className="text-lg font-bold text-blue-900">{project.metrics.visitors.toLocaleString()}</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-green-600 mb-1">Conversions</div>
                      <div className="text-lg font-bold text-green-900">{project.metrics.conversions}</div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-purple-600 mb-1">CRO Score</div>
                      <div className="text-lg font-bold text-purple-900">{project.type === 'optimize' ? '42' : 'N/A'}</div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-yellow-600 mb-1">Active Tests</div>
                      <div className="text-lg font-bold text-yellow-900">{project.type === 'optimize' ? '3' : '0'}</div>
                    </div>
                  </div>

                  {/* CRO Insights for Optimize Projects */}
                  {project.type === 'optimize' && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">🧠</span>
                        Active CRO Optimizations
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="font-medium text-green-800 mb-1">Quick Win Active</div>
                          <div className="text-green-700">Added security badges → +12% conversion</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-yellow-200">
                          <div className="font-medium text-yellow-800 mb-1">A/B Test Running</div>
                          <div className="text-yellow-700">CTA color test → Orange winning +8%</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <div className="font-medium text-blue-800 mb-1">Psychology Analysis</div>
                          <div className="text-blue-700">Missing urgency triggers detected</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status === 'in_progress' ? 'AI Workers Active' : project.status.replace('_', ' ')}
                    </span>
                    
                    {project.type === 'optimize' && (
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>🔄 The Strategist monitoring</span>
                        <span>•</span>
                        <span>📊 Cialdini principles applied</span>
                        <span>•</span>
                        <span>🧪 Baymard research active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trial Status */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Free Trial Active</h3>
              <p className="text-gray-600">12 days remaining • Upgrade anytime to continue after trial</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Billing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}