'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, TrendingUp, Shield, Globe, Users, Target, Zap, CheckCircle, ArrowRight, Sparkles, Crown, Rocket } from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      role: "AI Architecture",
      description: "World-class AI engineers who built the Multi-LLM orchestration system",
      achievement: "Created the first AI Worker teams that guarantee competitive advantage"
    },
    {
      role: "Competitive Intelligence",
      description: "Former consultants from top strategy firms who understand market dynamics",
      achievement: "Developed algorithms that predict competitor moves 6 months ahead"
    },
    {
      role: "Learning Systems",
      description: "Machine learning experts who designed the continuous improvement engine",
      achievement: "Built systems that learn from 500+ websites across every industry"
    },
    {
      role: "Platform Engineering",
      description: "Infrastructure experts who ensure 99.9% uptime and global performance",
      achievement: "Deployed on enterprise global edge network for maximum speed"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Problem Identified",
      description: "Realized that static websites decay while dynamic markets evolve, creating an impossible maintenance problem."
    },
    {
      year: "2024", 
      title: "AI Worker Breakthrough",
      description: "Developed the first AI Worker teams that could learn continuously and improve websites automatically."
    },
    {
      year: "2024",
      title: "Multi-LLM Orchestration",
      description: "Created intelligent routing between Anthropic Claude and OpenAI GPT-4o for optimal task performance."
    },
    {
      year: "2024",
      title: "Competitive Intelligence Engine",
      description: "Built systems that monitor competitors 24/7 and automatically adapt strategies for competitive advantage."
    },
    {
      year: "2025",
      title: "Revolutionary Platform Launch",
      description: "Launched the world's first platform that guarantees websites will beat competition through continuous learning."
    }
  ];

  const stats = [
    {
      number: "7",
      label: "AI Workers",
      description: "Specialized AI team members working 24/7 for every customer"
    },
    {
      number: "500+",
      label: "Learning Sites",
      description: "Network of websites contributing intelligence and best practices"
    },
    {
      number: "6",
      label: "Intelligence Sources",
      description: "Comprehensive data streams for continuous learning and optimization"
    },
    {
      number: "99.9%",
      label: "Uptime Guarantee",
      description: "Enterprise-grade reliability on global edge infrastructure"
    },
    {
      number: "300-500%",
      label: "Typical ROI",
      description: "Return on investment within 90 days through competitive advantage"
    },
    {
      number: "24/7/365",
      label: "Continuous Learning",
      description: "Never-ending improvement that compounds into impossible advantages"
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
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
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
            <h1 className="text-6xl font-bold mb-6 text-gray-900">About Code24</h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We solved the impossible problem: websites that never become obsolete. 
              Built by visionaries who believe every business deserves an unfair competitive advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Our Mission</h3>
              <p className="text-gray-600">Make every website impossible to beat through continuous AI-powered learning and optimization.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Our Innovation</h3>
              <p className="text-gray-600">The world's first AI Worker teams that guarantee competitive advantage through 24/7 learning.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Our Promise</h3>
              <p className="text-gray-600">Your website will beat competition or we work free until it does. Guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We Solved */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">The Problem We Solved</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Traditional websites are built once and decay over time. Markets evolve, competitors improve, and static websites fall behind.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-red-600 mb-6">❌ The Old Way (Broken)</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Websites built once, decay forever</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Expensive redesigns every 2-3 years</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>No competitive intelligence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Manual optimization only</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Always falling behind competitors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>No performance guarantees</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-6">✅ The Code24 Way (Revolutionary)</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Websites that learn and improve 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Never need redesigns - evolve automatically</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>24/7 competitive intelligence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>AI Workers optimize continuously</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Always ahead of competitors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Guaranteed to beat competition</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center p-8 bg-blue-50 rounded-3xl border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">The Mathematical Certainty</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              A learning system that improves every day will always outperform static systems that decay over time. 
              This isn't marketing - it's mathematical inevitability. That's why we can guarantee results.
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Our Journey to Revolutionary</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              From identifying the fundamental problem to building the impossible solution.
            </p>
          </div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-2xl font-bold mb-4">{milestone.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">By The Numbers</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The revolutionary platform that's changing how websites work forever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200">
                <div className="text-5xl font-bold text-blue-600 mb-4">{stat.number}</div>
                <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
                <p className="text-gray-600 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Philosophy */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">World-Class Team</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Assembled from the best AI engineers, strategy consultants, and platform architects in the world.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">{member.role}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{member.description}</p>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Key Achievement:</div>
                  <div className="text-sm text-gray-700">{member.achievement}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 p-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl text-white">
            <h3 className="text-2xl font-bold mb-4">Our Philosophy</h3>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              "Every business deserves an unfair competitive advantage. We believe that learning systems will always beat static systems, 
              and we've built the platform to prove it. Your success is our success - that's why we guarantee results."
            </p>
          </div>
        </div>
      </section>

      {/* Technology Leadership */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Technology Leadership</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Built on cutting-edge AI and deployed on enterprise-grade global infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">🧠 AI Innovation</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Multi-LLM Orchestration</div>
                    <div className="text-gray-600">Intelligent routing between Anthropic Claude and OpenAI GPT-4o</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">AI Worker Teams</div>
                    <div className="text-gray-600">7 specialized AI agents working continuously for each customer</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Competitive Intelligence</div>
                    <div className="text-gray-600">Real-time market analysis and competitor monitoring</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">🌐 Enterprise Infrastructure</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Global Edge Network</div>
                    <div className="text-gray-600">200+ locations worldwide for maximum performance</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Enterprise Security</div>
                    <div className="text-gray-600">SOC 2 compliant with enterprise-grade isolation</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">99.9% Uptime SLA</div>
                    <div className="text-gray-600">Enterprise reliability with automatic scaling</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Join the Revolution</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Be part of the future where websites never become obsolete. 
            Get your AI Worker team and start beating competition every day.
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

export default AboutPage;