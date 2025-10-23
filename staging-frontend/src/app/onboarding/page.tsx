'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Globe, Search, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const OnboardingPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);

  const handleUrlSubmit = async () => {
    if (!websiteUrl) return;
    
    setIsScanning(true);
    // Simulate comprehensive scan
    setTimeout(() => {
      setScanResults({
        score: 34,
        issues: [
          { type: 'speed', severity: 'critical', description: 'Page loads in 4.8s (should be <3s)', impact: 'High bounce rate' },
          { type: 'mobile', severity: 'high', description: 'Mobile experience needs optimization', impact: 'Lost mobile conversions' },
          { type: 'seo', severity: 'medium', description: '12 SEO improvements needed', impact: 'Lower search rankings' },
          { type: 'conversion', severity: 'high', description: 'Missing conversion elements', impact: 'Lost revenue opportunities' },
          { type: 'accessibility', severity: 'medium', description: '8 accessibility issues found', impact: 'Limited user reach' }
        ],
        aiWorkers: [
          { name: 'Speed Worker', task: 'Optimize images, enable caching, minify code', timeEstimate: '2-4 hours' },
          { name: 'Mobile Worker', task: 'Fix responsive design, improve touch targets', timeEstimate: '1-3 hours' },
          { name: 'SEO Worker', task: 'Add missing meta tags, optimize content', timeEstimate: '4-6 hours' },
          { name: 'Conversion Worker', task: 'Add CTAs, optimize forms, improve UX', timeEstimate: '2-5 hours' },
          { name: 'Analytics Worker', task: 'Set up tracking, create monitoring dashboards', timeEstimate: '1-2 hours' }
        ]
      });
      setIsScanning(false);
      setStep(2);
    }, 3000);
  };

  const handleStartOptimization = () => {
    // This would normally integrate with the backend to start AI Workers
    setStep(3);
    
    // Redirect to dashboard after showing confirmation
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">24</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Code24</span>
                <div className="text-xs text-blue-600 font-medium">Website Optimization</div>
              </div>
            </Link>
            
            <div className="text-sm text-gray-600">
              Step {step} of 3
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Step 1: Website URL Input */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Code24!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Let's start optimizing your website. First, tell us which site you'd like to improve.
            </p>

            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-6">Enter Your Website URL</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleUrlSubmit}
                  disabled={!websiteUrl || isScanning}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Website</span>
                      <Search className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Our AI Workers will perform a comprehensive 197+ point analysis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Works with any website platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No code changes required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Results visible within 24 hours</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Scan Results & AI Worker Assignment */}
        {step === 2 && scanResults && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Analysis Complete!</h1>
              <p className="text-xl text-gray-600">
                Here's what our AI Workers found and how they'll fix it
              </p>
            </div>

            {/* Current Score */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">Current Website Performance</h3>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-red-500 mb-2">{scanResults.score}/100</div>
                    <div className="text-gray-500">Current Score</div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-500 mb-2">85+/100</div>
                    <div className="text-gray-500">Target Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues & Solutions */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Issues Found */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  Issues Found
                </h3>
                <div className="space-y-4">
                  {scanResults.issues.map((issue: any, index: number) => (
                    <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="font-semibold text-gray-900">{issue.description}</div>
                      <div className="text-sm text-gray-600">Impact: {issue.impact}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Workers Assignment */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-green-600 flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  AI Workers Assigned
                </h3>
                <div className="space-y-4">
                  {scanResults.aiWorkers.map((worker: any, index: number) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="font-semibold text-gray-900">{worker.name}</div>
                      <div className="text-sm text-gray-600 mb-1">{worker.task}</div>
                      <div className="text-xs text-gray-500">Est. completion: {worker.timeEstimate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Optimization */}
            <div className="text-center">
              <button
                onClick={handleStartOptimization}
                className="bg-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
              >
                <span>Deploy AI Workers Now</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Your AI Workers will start optimizing immediately. You can monitor progress in your dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🚀</div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">AI Workers Deployed!</h1>
              <p className="text-xl text-gray-600 mb-6">
                Your website optimization is now running 24/7. You'll start seeing improvements within the next few hours.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-3">What happens next:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>AI Workers start analyzing and fixing issues (0-2 hours)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>First improvements deployed (2-6 hours)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Performance metrics improve (6-24 hours)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Continuous learning and optimization (ongoing)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm">
                Redirecting to your dashboard in 3 seconds...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;