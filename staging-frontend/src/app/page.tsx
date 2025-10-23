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
    // Simulate scan delay
    setTimeout(() => {
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
      setIsScanning(false);
    }, 3000);
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
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-gray-900">
            Your Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Improves Itself</span> 24/7
          </h1>
          <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
            Connect any existing site. AI Workers find problems, fix them, then optimize forever.<br/>
            <span className="text-lg text-gray-500">Works with WordPress, Shopify, Wix, Custom Sites - Everything.</span>
          </p>

          {/* URL Input Section */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Get Your Free Website Scan</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Enter your website URL (e.g., yoursite.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <span>Free Scan</span>
                    <Search className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">197+ point analysis • No signup required • Results in 30 seconds</p>
          </div>

          {/* Scan Results */}
          {scanResults && (
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 max-w-3xl mx-auto text-left">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Scan Complete!</h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">{scanResults.score}/100</div>
                    <div className="text-sm text-gray-500">Current Score</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">85+/100</div>
                    <div className="text-sm text-gray-500">With Code24</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">🚨 Issues Found:</h4>
                  <div className="space-y-2">
                    {scanResults.issues.map((issue: any, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-red-800">{issue.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-green-600">✅ AI Workers Will Fix:</h4>
                  <div className="space-y-2">
                    {scanResults.improvements.map((improvement: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-800">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a href="https://buy.stripe.com/6oU5kC37v9PsepfcjYdfG0h" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105 inline-flex items-center space-x-2">
                  <span>Fix Everything - Start 14-Day Trial ($99/mo)</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-sm text-gray-500 mt-2">All fixes applied within 24 hours • Then improves continuously forever</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Your Website Gets Better Every Day</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While your competitors' sites get outdated, yours gets smarter. Here's how:
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Connect Your Site</h3>
              <p className="text-gray-600">Works with any website. WordPress, Shopify, custom builds - everything.</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. AI Scans Everything</h3>
              <p className="text-gray-600">197+ point analysis finds every issue hurting your performance.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Workers Fix Issues</h3>
              <p className="text-gray-600">7 AI Workers automatically fix speed, mobile, SEO, and conversion issues.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">4. Continuous Improvement</h3>
              <p className="text-gray-600">Your site learns from visitors and beats competitors 24/7.</p>
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
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Real Results from Real Websites</h2>
            <p className="text-xl text-gray-600">See what happens when your website improves itself</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">+340%</div>
                <div className="text-lg font-semibold text-green-800 mb-4">Conversion Rate</div>
                <p className="text-green-700">E-commerce site that was getting 2% conversions now getting 8.8% after 3 months</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">-67%</div>
                <div className="text-lg font-semibold text-blue-800 mb-4">Load Time</div>
                <p className="text-blue-700">SaaS website went from 4.8s to 1.6s loading time, improving user experience</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-3xl p-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">+250%</div>
                <div className="text-lg font-semibold text-purple-800 mb-4">Organic Traffic</div>
                <p className="text-purple-700">Local business tripled their search engine visibility in 6 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Stop Falling Behind?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            While your competitors' websites get outdated, yours will get better every single day.
          </p>
          
          <div className="bg-white rounded-3xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="text-gray-900">
              <h3 className="text-xl font-semibold mb-4">Start Your Free Website Scan</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="url"
                  placeholder="Enter your website URL"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                  Free Scan
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Then start 14-day trial for just $99/mo</p>
            </div>
          </div>

          <div className="text-center text-gray-400">
            <div className="text-sm">✅ 14-day free trial • ✅ Cancel anytime • ✅ Results guaranteed</div>
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