'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ArrowRight, Zap, Crown, Building, Sparkles, Shield, TrendingUp, Target, RefreshCw } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: "OPTIMIZE",
      price: "$99", 
      period: "per month",
      description: "Transform your existing website into a learning machine that beats competition",
      features: [
        "197+ point comprehensive website audit",
        "7 AI Workers resurrect your existing site",
        "Competitive analysis and positioning",
        "Design and conversion optimization",
        "Content and SEO enhancement", 
        "Performance and speed optimization",
        "Mobile and accessibility improvements",
        "AI search engine optimization (GEO)",
        "24/7 continuous learning and improvement",
        "Performance guarantee or work free",
        "200-400% improvement in 90 days",
        "Existing domain integration",
        "Advanced analytics and reporting",
        "Premium support and consultation"
      ],
      cta: "Start 14-Day Trial",
      badge: "Most Popular",
      color: "indigo",
      icon: <Zap className="w-6 h-6" />,
      stripeUrl: "https://buy.stripe.com/6oU5kC37v9PsepfcjYdfG0h"
    },
    {
      name: "OPTIMIZE PRO",
      price: "$149",
      period: "per month",
      description: "Enhanced psychology-based optimization with deep conversion analysis",
      features: [
        "Everything in OPTIMIZE, plus:",
        "🧠 Deep CRO Psychology Audit (Cialdini's principles)",
        "📊 Baymard Institute UX research integration",
        "🧪 Automated A/B testing with psychological insights",
        "⚡ Quick Win implementations (security badges, urgency)",
        "🎯 Conversion psychology optimization",
        "📈 Trust & credibility analysis and fixes",
        "🔬 UX friction detection and elimination",
        "💡 Strategic psychology recommendations",
        "🆚 Competitive psychology benchmarking",
        "🧠 The Strategist AI Worker (CRO specialist)",
        "📊 Advanced conversion metrics and reporting",
        "🎨 Psychology-driven design improvements",
        "Priority CRO support and consultation"
      ],
      cta: "Start 14-Day Trial",
      badge: "Enhanced Psychology",
      color: "purple",
      icon: <Target className="w-6 h-6" />,
      stripeUrl: "https://buy.stripe.com/28E8wO9vT2n01CtbfUdfG0i"
    },
    {
      name: "ENTERPRISE",
      price: "Custom",
      period: "pricing",
      description: "For organizations that need multiple sites and white-label solutions",
      features: [
        "Unlimited AI Worker teams",
        "Multiple websites and domains",
        "White-label branding options",
        "Advanced market intelligence",
        "Custom AI Worker configurations",
        "Priority feature development",
        "Dedicated account management",
        "Custom integrations and APIs",
        "Advanced security and compliance",
        "SLA guarantees and uptime",
        "Custom reporting and analytics",
        "Team training and onboarding",
        "24/7 enterprise support"
      ],
      cta: "Contact Sales",
      badge: "Enterprise",
      color: "gray",
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const comparison = [
    {
      feature: "Setup Time",
      optimize: "5-10 minutes",
      optimizePro: "5-10 minutes",
      traditional: "2-6 months"
    },
    {
      feature: "AI Workers",
      optimize: "7 specialists",
      optimizePro: "7 specialists + CRO",
      traditional: "0"
    },
    {
      feature: "Continuous Learning",
      optimize: "24/7/365",
      optimizePro: "24/7/365", 
      traditional: "Never"
    },
    {
      feature: "Psychology Analysis",
      optimize: "Basic",
      optimizePro: "Deep CRO + Cialdini",
      traditional: "Manual only"
    },
    {
      feature: "AI Search Optimization (GEO)",
      optimize: "Included",
      optimizePro: "Included + Enhanced",
      traditional: "Not available"
    },
    {
      feature: "Performance Guarantee",
      optimize: "Guaranteed",
      optimizePro: "Guaranteed",
      traditional: "No guarantee"
    },
    {
      feature: "5-Year Total Cost",
      optimize: "$5,940",
      optimizePro: "$8,940",
      traditional: "$160,000+"
    },
    {
      feature: "ROI Potential",
      optimize: "200-400%",
      optimizePro: "300-500%",
      traditional: "Often negative"
    }
  ];

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
                <div className="text-xs text-blue-600 font-medium">AI Workers</div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 text-gray-900">Revolutionary Pricing</h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Choose your path to competitive dominance. Both include the same revolutionary AI Worker team working 24/7 forever.
            </p>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-8 mb-16 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Performance Guarantee</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>We guarantee your website will beat your competition - or we work free until it does.</strong><br/>
                This isn't just confidence - it's mathematical certainty that learning websites always outperform static ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, index) => {
              const colorClasses: { [key: string]: any } = {
                blue: {
                  bg: "from-blue-50 to-blue-100",
                  border: "border-blue-300",
                  badge: "bg-blue-600 text-white",
                  button: "bg-blue-600 hover:bg-blue-700 text-white",
                  accent: "text-blue-600"
                },
                indigo: {
                  bg: "from-indigo-50 to-indigo-100", 
                  border: "border-indigo-300",
                  badge: "bg-indigo-600 text-white",
                  button: "bg-indigo-600 hover:bg-indigo-700 text-white",
                  accent: "text-indigo-600"
                },
                purple: {
                  bg: "from-purple-50 to-purple-100",
                  border: "border-purple-300", 
                  badge: "bg-purple-600 text-white",
                  button: "bg-purple-600 hover:bg-purple-700 text-white",
                  accent: "text-purple-600"
                },
                gray: {
                  bg: "from-gray-50 to-gray-100",
                  border: "border-gray-300", 
                  badge: "bg-gray-600 text-white",
                  button: "bg-gray-600 hover:bg-gray-700 text-white",
                  accent: "text-gray-600"
                }
              };
              
              const colors = colorClasses[plan.color];
              
              return (
                <div key={index} className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-3xl p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 ${index === 0 ? 'lg:scale-105' : ''}`}>
                  {plan.badge && (
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${colors.badge} px-4 py-2 rounded-full text-sm font-semibold`}>
                      {plan.badge}
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-lg text-gray-600">/{plan.period}</span>}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.stripeUrl ? (
                    <a href={plan.stripeUrl} target="_blank" rel="noopener noreferrer" className={`w-full ${colors.button} px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-center`}>
                      <span>{plan.cta}</span>
                      {plan.icon}
                    </a>
                  ) : (
                    <button className={`w-full ${colors.button} px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}>
                      <span>{plan.cta}</span>
                      {plan.icon}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Code24 vs Traditional Web Development</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See why learning websites always beat static websites - mathematically and practically.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left p-6 font-semibold">Feature</th>
                    <th className="text-center p-6 font-semibold">OPTIMIZE ($99/mo)</th>
                    <th className="text-center p-6 font-semibold">OPTIMIZE PRO ($149/mo)</th>
                    <th className="text-center p-6 font-semibold">Traditional Web Dev</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-6 font-medium text-gray-900">{row.feature}</td>
                      <td className="p-6 text-center text-indigo-600 font-semibold">{row.optimize}</td>
                      <td className="p-6 text-center text-purple-600 font-semibold">{row.optimizePro}</td>
                      <td className="p-6 text-center text-red-500 font-semibold">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">5-Year ROI Comparison</h2>
            <p className="text-xl text-gray-600">Traditional websites cost more and deliver less. Learning websites save money and make money.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Cost */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-red-600 mb-6">Traditional 5-Year Costs</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Initial Build:</span>
                  <span className="font-semibold">$15,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Redesign Year 2:</span>
                  <span className="font-semibold">$20,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Updates & Maintenance:</span>
                  <span className="font-semibold">$25,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Lost Revenue (falling behind):</span>
                  <span className="font-semibold">$100,000+</span>
                </div>
                <hr className="border-red-300" />
                <div className="flex justify-between text-xl font-bold text-red-600">
                  <span>TOTAL LOSS:</span>
                  <span>$160,000+</span>
                </div>
              </div>
            </div>

            {/* Code24 Investment */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-6">Code24 5-Year Investment</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>OPTIMIZE Service (60 months):</span>
                  <span className="font-semibold">$5,940</span>
                </div>
                <div className="flex justify-between">
                  <span>Automatic Improvements:</span>
                  <span className="font-semibold">$0 (included)</span>
                </div>
                <div className="flex justify-between">
                  <span>Competitive Intelligence:</span>
                  <span className="font-semibold">$0 (included)</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Gain (typical):</span>
                  <span className="font-semibold">+$200,000</span>
                </div>
                <hr className="border-green-300" />
                <div className="flex justify-between text-xl font-bold text-green-600">
                  <span>TOTAL VALUE:</span>
                  <span>+$194,060 NET GAIN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 p-8 bg-blue-50 rounded-3xl border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">$354,060 Difference</h3>
            <p className="text-lg text-gray-700">
              That's the power of learning websites vs static websites. 
              The math is clear - Code24 doesn't just save money, it makes money.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Pricing Questions Answered</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Why is Code24 so much cheaper than traditional web development?",
                answer: "AI automation eliminates 90% of traditional development costs. Instead of hiring teams of designers, developers, and marketers, you get AI Workers that work 24/7 at a fraction of the cost. The savings are passed directly to you."
              },
              {
                question: "What's included in the monthly price?",
                answer: "Everything. Your entire AI Worker team, hosting, security, updates, optimization, competitive intelligence, and support. No hidden fees, no surprise charges, no additional costs."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, but you won't want to. Your website keeps getting better every day with Code24. Canceling means your website stops learning and improving, while competitors with learning websites will quickly surpass you."
              },
              {
                question: "Do you really guarantee I'll beat the competition?",
                answer: "Absolutely. We guarantee your website will beat your competition or we work free until it does. This isn't marketing - it's mathematical certainty that learning websites outperform static ones."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Start Winning?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Choose your path to competitive dominance. Both plans guarantee you'll beat competition.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#optimize" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Optimizing - $99/mo</span>
              <Zap className="w-5 h-5" />
            </Link>
            <Link href="/#optimize-pro" className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Enhanced Psychology - $149/mo</span>
              <Target className="w-5 h-5" />
            </Link>
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
                Revolutionary AI Workers that make your website beat competition every day.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/features" className="block text-gray-600 hover:text-gray-900">Features</Link>
                <Link href="/pricing" className="block text-gray-600 hover:text-gray-900">Pricing</Link>
                <Link href="/#optimize" className="block text-gray-600 hover:text-gray-900">OPTIMIZE Service</Link>
                <Link href="/#optimize-pro" className="block text-gray-600 hover:text-gray-900">OPTIMIZE PRO Service</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block text-gray-600 hover:text-gray-900">About</Link>
                <Link href="/contact" className="block text-gray-600 hover:text-gray-900">Contact</Link>
                <Link href="/privacy" className="block text-gray-600 hover:text-gray-900">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-600 hover:text-gray-900">Terms of Service</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">Enterprise Support</div>
                <div className="text-gray-600">AI Worker Status</div>
                <div className="text-gray-600">Documentation</div>
                <div className="text-gray-600">API Access</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Code24.dev - Where Websites Beat Competition Every Day</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;