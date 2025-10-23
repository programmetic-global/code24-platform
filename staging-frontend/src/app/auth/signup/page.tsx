'use client'

import React, { useState } from 'react'
// import { signIn } from 'next-auth/react' // Removed for static build
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Loader2, Check, Zap, TrendingUp } from 'lucide-react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<'build' | 'optimize'>('build')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan') as 'build' | 'optimize' || 'build'

  // Set initial plan from URL parameter
  React.useEffect(() => {
    setSelectedPlan(planParam)
  }, [planParam])

  const plans = {
    build: {
      name: 'BUILD',
      price: '$149',
      description: 'AI Workers build a learning website from scratch',
      stripeUrl: 'https://buy.stripe.com/28E8wO9vT2n01CtbfUdfG0i',
      features: [
        '7 AI Workers build your learning site in 3-8 minutes',
        'Market research and competitive analysis',
        'Professional brand design and development',
        'Self-learning AI that beats competition 24/7',
        '14-day free trial included'
      ],
      icon: <Zap className="w-6 h-6" />
    },
    optimize: {
      name: 'OPTIMIZE', 
      price: '$99',
      description: 'Transform your existing website into a learning website',
      stripeUrl: 'https://buy.stripe.com/6oU5kC37v9PsepfcjYdfG0h',
      features: [
        'Complete website transformation to learning system',
        'Performance, SEO, and conversion optimization',
        'Competitive intelligence and positioning',
        'Continuous learning and A/B testing',
        '14-day free trial included'
      ],
      icon: <TrendingUp className="w-6 h-6" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // For now, redirect directly to Stripe with email as reference
      const currentPlan = plans[selectedPlan]
      const stripeUrl = currentPlan.stripeUrl + `?client_reference_id=${encodeURIComponent(email)}&prefilled_email=${encodeURIComponent(email)}`
      window.location.href = stripeUrl
    } catch (error) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    // For static build, redirect to Stripe directly
    const currentPlan = plans[selectedPlan]
    const stripeUrl = currentPlan.stripeUrl + `?client_reference_id=${encodeURIComponent(email)}&prefilled_email=${encodeURIComponent(email)}`
    window.location.href = stripeUrl
  }

  const currentPlan = plans[selectedPlan]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Plan selection and features */}
            <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
              <Link href="/" className="inline-flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">24</span>
                </div>
                <span className="text-xl font-bold">Code24</span>
              </Link>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Choose Your AI Worker Team</h2>
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setSelectedPlan('build')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      selectedPlan === 'build' 
                        ? 'border-blue-400 bg-blue-600/20' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">BUILD</span>
                    </div>
                    <div className="text-2xl font-bold">{plans.build.price}<span className="text-sm">/mo</span></div>
                  </button>
                  <button
                    onClick={() => setSelectedPlan('optimize')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      selectedPlan === 'optimize' 
                        ? 'border-emerald-400 bg-emerald-600/20' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">OPTIMIZE</span>
                    </div>
                    <div className="text-2xl font-bold">{plans.optimize.price}<span className="text-sm">/mo</span></div>
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  {currentPlan.icon}
                  <span>{currentPlan.name} includes:</span>
                </h3>
                <ul className="space-y-3">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm text-gray-400">
                <p className="mb-2">✨ 14-day free trial • No credit card required</p>
                <p>🚀 Cancel anytime • Full refund guarantee</p>
              </div>
            </div>

            {/* Right side - Registration form */}
            <div className="lg:w-1/2 p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Start your free trial</h1>
                <p className="text-gray-600">Join thousands of businesses using AI Workers</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignUp}
                  className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-6 text-xs text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}