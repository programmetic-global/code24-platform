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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/dashboard/build"
            className="flex-1 bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Start BUILD Project</h3>
                <p className="text-blue-100">AI Workers build a new website from scratch</p>
              </div>
              <Plus className="w-6 h-6 ml-auto group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            href="/dashboard/optimize"
            className="flex-1 bg-emerald-600 text-white rounded-lg p-6 hover:bg-emerald-700 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Start OPTIMIZE Project</h3>
                <p className="text-emerald-100">AI Workers transform your existing website</p>
              </div>
              <Plus className="w-6 h-6 ml-auto group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          </div>
          
          <div className="divide-y">
            {projects.map((project) => (
              <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{project.type}</span>
                          <span>•</span>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Performance Score</div>
                      <div className="text-lg font-semibold text-gray-900">{project.metrics.score}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Visitors</div>
                      <div className="text-lg font-semibold text-gray-900">{project.metrics.visitors.toLocaleString()}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Conversions</div>
                      <div className="text-lg font-semibold text-gray-900">{project.metrics.conversions}</div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
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