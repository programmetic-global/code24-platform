'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, FlaskConical, LineChart, Palette, Zap, Target, RefreshCw, Shield, Globe, Cpu, Activity, TrendingUp, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      category: "AI Worker Team",
      icon: <Brain className="w-8 h-8" />,
      items: [
        {
          name: "Learner Worker",
          description: "Analyzes visitor behavior, competitor strategies, and market intelligence 24/7",
          benefits: ["Heat map analysis", "Competitor monitoring", "Market trend detection", "User journey optimization"]
        },
        {
          name: "Tester Worker", 
          description: "Runs continuous A/B tests and performance experiments automatically",
          benefits: ["Automated A/B testing", "Statistical significance tracking", "Performance comparisons", "Conversion optimization"]
        },
        {
          name: "Optimizer Worker",
          description: "Improves conversion rates and user experience in real-time",
          benefits: ["Real-time optimization", "UX improvements", "Form optimization", "Page speed enhancement"]
        },
        {
          name: "Designer Worker",
          description: "Updates visual design based on competitive analysis and conversion data",
          benefits: ["Adaptive visual design", "Trend-based updates", "Brand consistency", "Mobile optimization"]
        },
        {
          name: "Analyst Worker",
          description: "Tracks performance metrics and identifies growth opportunities",
          benefits: ["Advanced analytics", "Growth opportunity detection", "ROI tracking", "Performance reporting"]
        },
        {
          name: "Conversion Worker",
          description: "Optimizes sales funnels and revenue generation pathways",
          benefits: ["Funnel optimization", "Revenue maximization", "Cart abandonment reduction", "Checkout optimization"]
        },
        {
          name: "SEO Worker",
          description: "Dominates both traditional search engines and AI search engines (GEO)",
          benefits: ["Traditional SEO", "AI search optimization", "Content optimization", "Ranking improvements"]
        }
      ]
    },
    {
      category: "Learning Intelligence",
      icon: <Activity className="w-8 h-8" />,
      items: [
        {
          name: "Visitor Intelligence",
          description: "Deep analysis of how YOUR visitors interact with your website",
          benefits: ["Mouse movement tracking", "Click pattern analysis", "Scroll depth measurement", "Session recording insights"]
        },
        {
          name: "Competitive Intelligence",
          description: "24/7 monitoring of competitor strategies and market changes",
          benefits: ["Design trend analysis", "Pricing strategy monitoring", "Feature gap identification", "Marketing message tracking"]
        },
        {
          name: "AI Search Engine Intelligence (GEO)",
          description: "Optimization for ChatGPT, Claude, Perplexity, and other AI engines",
          benefits: ["Brand mention optimization", "Authority signal enhancement", "AI-friendly content structure", "Generative search ranking"]
        },
        {
          name: "Performance Intelligence",
          description: "Comprehensive analysis of website performance and conversion data",
          benefits: ["Conversion trend analysis", "A/B test result processing", "Revenue per visitor tracking", "Performance bottleneck identification"]
        },
        {
          name: "Industry Intelligence",
          description: "Cross-industry analysis of design evolution and feature adoption",
          benefits: ["Design trend forecasting", "Feature adoption tracking", "Technology shift monitoring", "Best practice identification"]
        },
        {
          name: "Network Intelligence",
          description: "Insights from 500+ learning websites across all industries",
          benefits: ["Cross-industry patterns", "Successful strategy identification", "Failed approach avoidance", "Innovation early detection"]
        }
      ]
    },
    {
      category: "Revolutionary Technology",
      icon: <Cpu className="w-8 h-8" />,
      items: [
        {
          name: "Multi-LLM Orchestration",
          description: "Intelligent routing between Anthropic Claude and OpenAI GPT-4o for optimal results",
          benefits: ["Best model selection", "Task optimization", "Quality maximization", "Performance enhancement"]
        },
        {
          name: "Continuous Learning Engine",
          description: "Machine learning algorithms that improve your website every single day",
          benefits: ["Daily improvements", "Compound optimization", "Adaptive algorithms", "Never-ending enhancement"]
        },
        {
          name: "Real-Time Adaptation",
          description: "Instant response to market changes and visitor behavior patterns",
          benefits: ["Live adjustments", "Market responsiveness", "Behavior adaptation", "Instant optimization"]
        },
        {
          name: "Competitive Advantage Engine",
          description: "Automated systems that ensure your website always beats competitors",
          benefits: ["Automatic competitive analysis", "Advantage maintenance", "Market position protection", "Continuous superiority"]
        }
      ]
    },
    {
      category: "Business Transformation",
      icon: <TrendingUp className="w-8 h-8" />,
      items: [
        {
          name: "BUILD Service",
          description: "Complete website creation in 3-8 minutes with lifetime AI optimization",
          benefits: ["Instant deployment", "Professional design", "Market intelligence integration", "Forever optimization"]
        },
        {
          name: "OPTIMIZE Service", 
          description: "Transform existing websites into learning machines that beat competition",
          benefits: ["Existing site enhancement", "Competitive resurrection", "Performance guarantee", "Revolutionary transformation"]
        },
        {
          name: "Performance Guarantee",
          description: "We guarantee your website will beat competition or work free until it does",
          benefits: ["Risk-free investment", "Guaranteed results", "Continuous support", "Mathematical certainty"]
        },
        {
          name: "ROI Guarantee",
          description: "300-500% ROI within 90 days through continuous learning and optimization",
          benefits: ["Measurable results", "Revenue increase", "Cost efficiency", "Profitable growth"]
        }
      ]
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
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
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
            <h1 className="text-6xl font-bold mb-6 text-gray-900">Revolutionary AI Features</h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The complete feature set that makes your website impossible to beat. 
              Every feature designed to give you an unfair competitive advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">7 AI Workers</h3>
              <p className="text-gray-600">Specialized AI team working 24/7 for your competitive advantage</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">6 Intelligence Sources</h3>
              <p className="text-gray-600">Comprehensive learning from visitors, competitors, and market data</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Guaranteed Results</h3>
              <p className="text-gray-600">Beat competition or we work free until you do</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Sections */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-24">
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                    {category.icon}
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">{category.category}</h2>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {category.items.map((feature, featureIndex) => (
                  <div key={featureIndex} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Dominate Your Competition?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Get all these revolutionary features working for your website. 
            Start beating competition every single day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#build" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Building - $99/mo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/#optimize" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Optimize Existing - $149/mo</span>
              <Zap className="w-5 h-5" />
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
                <Link href="/#build" className="block text-gray-600 hover:text-gray-900">BUILD Service</Link>
                <Link href="/#optimize" className="block text-gray-600 hover:text-gray-900">OPTIMIZE Service</Link>
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

export default FeaturesPage;