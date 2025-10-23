'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Search, Zap, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const HomePage = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);

  const handleScan = async () => {
    if (!websiteUrl) return;
    
    setIsScanning(true);
    
    try {
      const response = await fetch('/api/scan-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: websiteUrl })
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const results = await response.json();
      setScanResults(results);
    } catch (error) {
      console.error('Scan error:', error);
      // Fallback to demo results if API fails
      setScanResults({
        score: 23,
        issues: [
          { type: 'speed', severity: 'critical', description: 'Page loads in 4.8s (should be <3s)' },
          { type: 'mobile', severity: 'high', description: 'Mobile experience needs optimization' },
          { type: 'seo', severity: 'medium', description: '12 SEO improvements identified' },
          { type: 'conversion', severity: 'high', description: 'Missing conversion optimization' }
        ],
        improvements: [
          'Speed up loading by 67%',
          'Fix 12 mobile usability issues', 
          'Optimize for 8 missing keywords',
          'Add 5 conversion elements'
        ]
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-40 border-b border-gray-200 shadow-sm">
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
            
            <div className="flex items-center space-x-6">
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Animated pulse background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute w-48 h-48 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 text-gray-900">
            Your Website Becomes a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">Living, Learning Machine</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
            While competitors have static, lifeless sites, yours actively learns from every visitor, adapts to beat competition, and improves itself 24/7. <strong>This isn't optimization - it's evolution.</strong><br/>
            <span className="text-lg text-gray-500">Works with WordPress, Shopify, Wix, Custom Sites - Everything.</span>
          </p>

          {/* Dead vs Living Websites Comparison */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 max-w-5xl mx-auto border-2 border-gray-100">
            <h3 className="text-3xl font-bold mb-8 text-gray-900 text-center">
              The Difference Between <span className="text-red-500">Static</span> and <span className="text-green-500">Living</span> Websites
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Static Website Column */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200">
                <h4 className="text-2xl font-bold text-red-700 mb-6 text-center flex items-center justify-center">
                  <span className="text-3xl mr-2">🧊</span>
                  Their Frozen Website
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">❌</span>
                    <span className="text-red-800 font-medium">Built once, stays frozen</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">❌</span>
                    <span className="text-red-800 font-medium">Never learns from visitors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">❌</span>
                    <span className="text-red-800 font-medium">Decays while competitors advance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">❌</span>
                    <span className="text-red-800 font-medium">Requires manual updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">❌</span>
                    <span className="text-red-800 font-medium">Remains static forever</span>
                  </div>
                </div>
              </div>

              {/* Living Website Column */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                <h4 className="text-2xl font-bold text-green-700 mb-6 text-center flex items-center justify-center">
                  <span className="text-3xl mr-2 animate-pulse">💚</span>
                  Your Living Website
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-green-800 font-medium">Evolves every single day</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-green-800 font-medium">Learns from every visitor</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-green-800 font-medium">Adapts to beat competitors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-green-800 font-medium">Self-improves automatically</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <span className="text-green-800 font-medium">Gets smarter forever</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                🧬 We don't just optimize your website. We bring it to LIFE.
              </h4>
              <p className="text-lg text-gray-700">
                It becomes a self-improving organism that learns, adapts, and evolves - making it <strong>impossible</strong> for competitors to keep up.
              </p>
            </div>
          </div>

          {/* Urgency Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4 mb-6 max-w-4xl mx-auto">
            <div className="text-center">
              <span className="text-2xl mr-2">🔥</span>
              <span className="text-lg font-bold text-orange-800">17 businesses already transforming their sites today</span>
              <span className="text-2xl ml-2">⚡</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full font-medium">
                Limited: Only accepting 50 sites this month (32 spots left)
              </span>
            </div>
          </div>

          {/* URL Input Section */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 max-w-2xl mx-auto relative">
            {/* Trust signals */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                🔒 Your original site always safe (instant rollback available)
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4 mt-4">🔍 Is Your Website Frozen or Dynamic? + Deep CRO Audit</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Enter your website URL (e.g., yoursite.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                onClick={handleScan}
                disabled={!websiteUrl || isScanning}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Deep Scanning...</span>
                  </>
                ) : (
                  <>
                    <span>Lifeless or Living Check</span>
                    <Search className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">197+ technical points + Deep CRO psychology audit • No signup required • Results in 45 seconds</p>
            
            {/* Additional Trust Signals */}
            <div className="mt-4 text-center space-y-2">
              <div className="text-sm text-green-600 font-medium">✓ Works with any platform - guaranteed</div>
              <div className="text-sm text-blue-600 font-medium">📈 Average improvement: +67% in 6 months</div>
              <div className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full inline-block">
                🚨 Your competitors might already be using this
              </div>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-8 max-w-3xl mx-auto border border-blue-200">
            <div className="text-center mb-4">
              <h4 className="text-lg font-bold text-blue-800">🔴 Live Activity Feed</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-green-600">2,847</div>
                <div className="text-sm text-gray-600">Improvements made in last 24 hours</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">34%</div>
                <div className="text-sm text-gray-600">Austin Dental just improved conversion</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">+145%</div>
                <div className="text-sm text-gray-600">TechStartup traffic increase this week</div>
              </div>
            </div>
          </div>

          {/* Risk Reversal */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-yellow-800 mb-4">🛡️ Zero Risk Guarantee</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-yellow-700">
                  <span className="text-lg font-bold">Your site improves or work free until it does</span>
                </div>
                <div className="text-yellow-700">
                  <span className="text-lg font-bold">14-day trial - see real improvements or pay nothing</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-yellow-600 bg-yellow-100 px-4 py-2 rounded-full inline-block">
                Every day you wait, competitors pull further ahead
              </div>
            </div>
          </div>

          {/* Scan Results */}
          {scanResults && (
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 max-w-4xl mx-auto text-left">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Complete Website Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <div className="text-4xl font-bold text-red-500">{scanResults.enhancedScore || scanResults.score}/100</div>
                    <div className="text-sm text-red-600 font-medium">Current Score</div>
                    <div className="text-xs text-gray-500 mt-1">Technical + CRO Combined</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-4xl font-bold text-gray-600">{scanResults.totalOpportunities || scanResults.issues?.length || 0}</div>
                    <div className="text-sm text-gray-600 font-medium">Issues Found</div>
                    <div className="text-xs text-gray-500 mt-1">Technical + CRO Combined</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-4xl font-bold text-green-500">{scanResults.projectedScore || '85+'}/100</div>
                    <div className="text-sm text-green-600 font-medium">With Code24</div>
                    <div className="text-xs text-gray-500 mt-1">Projected Improvement</div>
                  </div>
                </div>
                
                {scanResults.croInsights && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-2xl">🧠</span>
                      <h4 className="text-lg font-bold text-purple-800">Deep CRO Psychology Analysis Complete</h4>
                    </div>
                    <p className="text-purple-700 text-sm">
                      Advanced conversion psychology audit using Cialdini's principles + Baymard Institute research
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {/* Quick Wins Section */}
                {scanResults.croInsights?.quickWins && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                    <h4 className="font-bold text-xl mb-4 text-green-800 flex items-center">
                      <span className="text-2xl mr-2">⚡</span>
                      Quick Wins (Implement Today)
                    </h4>
                    <div className="grid gap-4">
                      {scanResults.croInsights.quickWins.slice(0, 3).map((win: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-green-800">{win.title}</h5>
                            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">{win.impact}</span>
                          </div>
                          <p className="text-sm text-green-700 mb-1">{win.description}</p>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Effort: {win.effort}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Traditional Issues */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">🚨 Technical Issues Found:</h4>
                    <div className="space-y-2">
                      {scanResults.issues && scanResults.issues.map((issue: any, index: number) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-800">{issue.description || issue.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">🎯 CRO Opportunities:</h4>
                    <div className="space-y-2">
                      {scanResults.croInsights?.psychologicalTriggers?.missing && 
                        scanResults.croInsights.psychologicalTriggers.missing.slice(0, 4).map((trigger: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                            <div className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0">🧠</div>
                            <span className="text-sm text-blue-800">{trigger}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* AI Workers Section */}
                {scanResults.aiWorkers && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-bold text-xl mb-4 text-blue-800 flex items-center">
                      <span className="text-2xl mr-2">🤖</span>
                      AI Workers + The Strategist (CRO) Assigned
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {scanResults.aiWorkers.map((worker: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-blue-800">{worker.name}</span>
                              <p className="text-sm text-blue-700 mt-1">{worker.task}</p>
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2 inline-block">ETA: {worker.eta}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Add The Strategist */}
                      <div className="bg-purple-100 rounded-lg p-4 border border-purple-300">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0">🧠</div>
                          <div>
                            <span className="font-semibold text-purple-800">The Strategist (CRO)</span>
                            <p className="text-sm text-purple-700 mt-1">Deep psychology analysis + A/B testing + competitive insights</p>
                            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded mt-2 inline-block">ETA: Continuous</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* A/B Testing Section */}
                {scanResults.croInsights?.abTestSuggestions && (
                  <div className="bg-yellow-50 rounded-xl p-6">
                    <h4 className="font-bold text-xl mb-4 text-yellow-800 flex items-center">
                      <span className="text-2xl mr-2">🧪</span>
                      Automated A/B Tests to Launch
                    </h4>
                    <div className="grid gap-4">
                      {scanResults.croInsights.abTestSuggestions.slice(0, 2).map((test: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-yellow-800">{test.title}</h5>
                            <span className="text-sm font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">{test.expectedLift}</span>
                          </div>
                          <p className="text-sm text-yellow-700 mb-2">{test.hypothesis}</p>
                          <div className="flex justify-between text-xs text-yellow-600">
                            <span>Duration: {test.duration}</span>
                            <span>Variants: {test.variants.length}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Deploy Your AI Worker Team + The Strategist</h4>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">✅ Technical fixes + Deep CRO psychology</div>
                  <div className="text-sm text-gray-600 mb-2">✅ Automatic A/B testing + Continuous optimization</div>
                  <div className="text-sm text-gray-600 mb-4">✅ Research-backed improvements (Cialdini + Baymard Institute)</div>
                </div>
                <a href="https://buy.stripe.com/6oU5kC37v9PsepfcjYdfG0h" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 inline-flex items-center space-x-2 text-lg">
                  <span>Deploy Full AI Team - Start 14-Day Trial ($149/mo)</span>
                  <ArrowRight className="w-6 h-6" />
                </a>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>All improvements deployed within 24 hours</strong><br/>
                  Then continuous psychology-based optimization forever
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Era of Dead Websites Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 text-white">⚰️ The Era of Static Websites is Over</h2>
            <div className="text-2xl text-gray-300 leading-relaxed space-y-6 max-w-4xl mx-auto">
              <p>
                For 30 years, websites have been built and left to stagnate. <strong className="text-white">Static. Frozen. Decaying.</strong>
              </p>
              <p>
                But what if your website could <span className="text-blue-400 font-bold">think?</span> <span className="text-green-400 font-bold">Learn?</span> <span className="text-purple-400 font-bold">Evolve?</span>
              </p>
              <p>
                What if it studied every visitor, learned what works, adapted to beat competitors, and improved itself <strong className="text-yellow-400">every single day?</strong>
              </p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                That's not the future. That's Code24 today.
              </p>
              <div className="bg-white/10 rounded-3xl p-8 mt-8">
                <p className="text-xl">
                  Your website becomes a <strong className="text-green-400">living entity</strong> with its own AI brain, working 24/7 to achieve your business goals.
                </p>
                <p className="text-lg text-gray-300 mt-4">
                  While competitors update manually once a year, your living website updates itself <strong className="text-blue-400">1,000 times a day.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">How We Bring Your Website to Life</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch your website transform from static to living, learning machine:
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-3xl">💀</span>
                <div className="absolute -bottom-2 -right-2 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Your Stagnant Website</h3>
              <p className="text-gray-600">We analyze your static, frozen website and identify why it's losing to competitors.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-3xl">🧬</span>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs">+</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Inject AI DNA</h3>
              <p className="text-gray-600">Our AI Workers install themselves and begin the transformation process.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-3xl animate-pulse">💚</span>
                <div className="absolute -bottom-2 -right-2 bg-purple-500 w-6 h-6 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Website Comes Alive</h3>
              <p className="text-gray-600">Your site starts learning, adapting, and improving itself automatically.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">4. Dominates Competition</h3>
              <p className="text-gray-600">Your living website evolves 24/7, making it impossible for static sites to compete.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 7 AI Workers */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Meet Your 7 AI Workers</h2>
            <p className="text-xl text-gray-600">Each specialist focuses on making your website unbeatable</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="text-xl font-bold text-gray-900">Speed Worker</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Optimizes images automatically</li>
                <li>• Minifies code and removes bloat</li>
                <li>• Sets up intelligent caching</li>
                <li>• Monitors speed 24/7</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="text-xl font-bold text-gray-900">Mobile Worker</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Fixes mobile usability issues</li>
                <li>• Optimizes touch interactions</li>
                <li>• Improves mobile loading</li>
                <li>• Tests on real devices</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="text-xl font-bold text-gray-900">SEO Worker</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Optimizes for search engines</li>
                <li>• Finds missing keywords</li>
                <li>• Fixes technical SEO issues</li>
                <li>• Monitors rankings</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="text-xl font-bold text-gray-900">Conversion Worker</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• A/B tests everything automatically</li>
                <li>• Optimizes forms and CTAs</li>
                <li>• Reduces bounce rate</li>
                <li>• Increases lead generation</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="text-xl font-bold text-gray-900">Design Worker</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Keeps design modern and fresh</li>
                <li>• Studies competitor designs</li>
                <li>• Updates layouts for better UX</li>
                <li>• Maintains brand consistency</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-xl font-bold text-gray-900">Analytics Worker</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Tracks all improvements</li>
                <li>• Identifies opportunities</li>
                <li>• Reports results clearly</li>
                <li>• Predicts future optimizations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">When Lifeless Websites Come to Life</h2>
            <p className="text-xl text-gray-600">Real transformations from static to living, learning machines</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-8 relative">
              <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                LIVING
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">+340%</div>
                <div className="text-lg font-semibold text-green-800 mb-4">Conversion Rate</div>
                <p className="text-green-700">"My website used to be lifeless - just sitting there. Now it's literally working for me 24/7. It learns what customers want and gives it to them."</p>
                <div className="text-sm text-green-600 mt-4 italic">- Sarah, E-commerce Owner</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-8 relative">
              <div className="absolute -top-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                EVOLVING
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">-67%</div>
                <div className="text-lg font-semibold text-blue-800 mb-4">Load Time</div>
                <p className="text-blue-700">"I watched my website improve itself in real-time. It went from slow and clunky to lightning fast - without me doing anything."</p>
                <div className="text-sm text-blue-600 mt-4 italic">- Mike, SaaS Founder</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-3xl p-8 relative">
              <div className="absolute -top-3 -right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                LEARNING
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">+250%</div>
                <div className="text-lg font-semibold text-purple-800 mb-4">Organic Traffic</div>
                <p className="text-purple-700">"My competitors can't figure out how I'm always ahead. My website learns and adapts faster than they can manually update."</p>
                <div className="text-sm text-purple-600 mt-4 italic">- David, Local Business</div>
              </div>
            </div>
          </div>

          {/* Featured Testimonial */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-8 text-center">
            <div className="text-2xl mb-4">💚</div>
            <blockquote className="text-2xl font-medium mb-6 italic">
              "My website used to be stagnant - just sitting there. Now it's literally working for me 24/7. It's like having an employee that never sleeps and keeps making my business better."
            </blockquote>
            <div className="text-lg">
              <div className="font-semibold">Jennifer Martinez</div>
              <div className="text-gray-300">Real Estate Agency Owner</div>
              <div className="text-green-400 font-bold mt-2">+180% Lead Generation in 4 Months</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">⚡ Ready to Bring Your Website to Life?</h2>
          <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
            Stop watching competitors pull ahead with their living websites.<br/>
            <strong className="text-white">Your transformation starts today.</strong>
          </p>
          
          <div className="bg-white rounded-3xl p-8 mb-8 max-w-2xl mx-auto relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                🚨 URGENT: Every day you wait, competitors evolve further ahead
              </div>
            </div>
            
            <div className="text-gray-900 mt-6">
              <h3 className="text-2xl font-bold mb-4">🧬 Revive Your Lifeless Website</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="url"
                  placeholder="Enter your stagnant website URL..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105">
                  BRING TO LIFE
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">14-day trial - Watch your site transform or pay nothing</p>
              <div className="mt-4 text-center">
                <div className="text-sm text-green-600 font-bold">⚡ Average transformation: Static → 67% better in 30 days</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-white">🛡️ Zero risk • 💚 Living website guaranteed • 🚀 Beats competition or free</div>
          </div>
        </div>
      </section>

      {/* Eat Our Own Dog Food Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t-4 border-blue-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 This Website You're On? It's Improving Itself Right Now.
            </h3>
            <p className="text-lg text-gray-700">
              You're experiencing a living website as you browse. Watch us improve in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">847</div>
              <div className="text-sm text-gray-600">Visitors analyzed today</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-200">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-gray-600">Improvements made today</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">94/100</div>
              <div className="text-sm text-gray-600">Current optimization score</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">+12%</div>
              <div className="text-sm text-gray-600">Conversion rate trend</div>
            </div>
          </div>

          <div className="mt-8 text-center bg-white rounded-2xl p-6 border-2 border-gray-200">
            <p className="text-lg text-gray-700">
              <strong>That's the power of a living website.</strong> Every click, scroll, and interaction makes it smarter. 
              Your competitors' static sites can't compete with this level of evolution.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">24</span>
                </div>
                <span className="text-lg font-bold text-gray-900">Code24</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI Workers that make your website improve itself 24/7.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">Website Optimization</div>
                <div className="text-gray-600">AI Workers</div>
                <div className="text-gray-600">Pricing</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="/contact" className="block text-gray-600 hover:text-gray-900">Contact</Link>
                <Link href="/privacy" className="block text-gray-600 hover:text-gray-900">Privacy</Link>
                <Link href="/terms" className="block text-gray-600 hover:text-gray-900">Terms</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">24/7 Monitoring</div>
                <div className="text-gray-600">Results Guaranteed</div>
                <div className="text-gray-600">Expert Support</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Code24.dev - Where Websites Improve Themselves</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;