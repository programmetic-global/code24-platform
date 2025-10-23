'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, Zap, TrendingUp, Shield, Globe, ArrowRight, Check, Play, Mic, Upload, Link2, Search, MessageSquare, Target, Brain, FlaskConical, LineChart, Mail, Wand2, Rocket, Layers, RefreshCw, Activity, Users, BarChart3, Palette, Cpu, ChevronDown } from 'lucide-react';

// Elite Workers API integration for self-learning
const ELITE_WORKERS_API = process.env.NEXT_PUBLIC_ELITE_WORKERS_API || 'https://staging.code24.dev/elite';

interface SelfLearningData {
  conversionRate: number;
  bounceRate: number;
  timeOnSite: number;
  interactions: number;
  optimizations: number;
}

interface EliteWorkerStatus {
  brand: boolean;
  design: boolean;
  develop: boolean;
}

interface MultiLLMStatus {
  orchestrator: boolean;
  anthropic: boolean;
  openai: boolean;
  lastModelSelection?: string;
  activeTasks: number;
}

const Code24Platform = () => {
  const [activeProduct, setActiveProduct] = useState('build');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [selfLearningData, setSelfLearningData] = useState<SelfLearningData>({
    conversionRate: 2.3,
    bounceRate: 67,
    timeOnSite: 45,
    interactions: 1247,
    optimizations: 23
  });
  const [eliteWorkersStatus, setEliteWorkersStatus] = useState<EliteWorkerStatus>({
    brand: false,
    design: false,
    develop: false
  });
  const [multiLLMStatus, setMultiLLMStatus] = useState<MultiLLMStatus>({
    orchestrator: false,
    anthropic: false,
    openai: false,
    lastModelSelection: 'AI Orchestrator',
    activeTasks: 0
  });
  const [isLearning, setIsLearning] = useState(false);

  // Self-learning analytics tracking
  useEffect(() => {
    // Force light theme on load
    setIsDark(false);
    
    // Track page load
    trackInteraction('page_load', { 
      product: activeProduct,
      theme: 'light',
      timestamp: new Date().toISOString()
    });

    // Check Elite Workers status
    checkEliteWorkersStatus();
    
    // Check Multi-LLM orchestrator status
    checkMultiLLMStatus();

    // Simulate self-learning improvements
    const learningInterval = setInterval(() => {
      updateSelfLearningMetrics();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(learningInterval);
  }, []);

  // Track user interactions for self-learning
  useEffect(() => {
    trackInteraction('product_switch', { 
      product: activeProduct,
      timestamp: new Date().toISOString()
    });
  }, [activeProduct]);

  const checkEliteWorkersStatus = async () => {
    try {
      const response = await fetch(`${ELITE_WORKERS_API}/status`);
      if (response.ok) {
        const data = await response.json();
        setEliteWorkersStatus({
          brand: data.workers.brand.status === 'online',
          design: data.workers.design.status === 'online',
          develop: data.workers.develop.status === 'online'
        });
      }
    } catch (error) {
      console.log('Elite Workers status check:', error);
    }
  };

  const checkMultiLLMStatus = async () => {
    try {
      const response = await fetch('https://code24-multi-llm-orchestrator-staging.daniel-e88.workers.dev/health');
      if (response.ok) {
        const data = await response.json();
        setMultiLLMStatus({
          orchestrator: data.status === 'operational',
          anthropic: data.providers?.anthropic === 'healthy',
          openai: data.providers?.openai === 'healthy' || data.providers?.openai === 'monitoring',
          lastModelSelection: data.lastSelection || 'AI Orchestrator',
          activeTasks: data.activeTasks || Math.floor(Math.random() * 5)
        });
      }
    } catch (error) {
      console.log('Multi-LLM status check:', error);
      // Simulate status for demo
      setMultiLLMStatus({
        orchestrator: true,
        anthropic: true,
        openai: true,
        lastModelSelection: 'AI Orchestrator',
        activeTasks: Math.floor(Math.random() * 5)
      });
    }
  };

  const trackInteraction = async (event: string, data: any) => {
    try {
      // Track locally
      const interactions = JSON.parse(localStorage.getItem('code24_interactions') || '[]');
      interactions.push({ event, data, timestamp: new Date().toISOString() });
      localStorage.setItem('code24_interactions', JSON.stringify(interactions.slice(-100))); // Keep last 100

      // Send to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, {
          custom_parameter: JSON.stringify(data)
        });
      }
    } catch (error) {
      console.log('Tracking error:', error);
    }
  };

  const updateSelfLearningMetrics = () => {
    setIsLearning(true);
    
    // Simulate AI learning and optimization
    setSelfLearningData(prev => ({
      conversionRate: Math.min(15, prev.conversionRate + (Math.random() * 0.1)),
      bounceRate: Math.max(20, prev.bounceRate - (Math.random() * 0.5)),
      timeOnSite: Math.min(300, prev.timeOnSite + (Math.random() * 2)),
      interactions: prev.interactions + Math.floor(Math.random() * 10),
      optimizations: prev.optimizations + (Math.random() > 0.7 ? 1 : 0)
    }));

    setTimeout(() => setIsLearning(false), 2000);
  };

  const triggerOptimization = async () => {
    setIsLearning(true);
    trackInteraction('optimization_triggered', { product: activeProduct });
    
    try {
      // Simulate Elite Workers optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      updateSelfLearningMetrics();
      
      // Show improvement notification
      if (typeof window !== 'undefined') {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white p-4 rounded-xl z-50 shadow-lg';
        notification.textContent = '🎯 AI optimization complete! Conversion rate improved.';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
      }
    } catch (error) {
      console.log('Optimization error:', error);
    }
    
    setIsLearning(false);
  };

  const theme = {
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textTertiary: isDark ? 'text-gray-500' : 'text-gray-500',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    cardBgAlt: isDark ? 'bg-gray-800/50' : 'bg-gray-50',
    hoverBg: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    navBg: isDark ? 'bg-gray-900/95' : 'bg-white/95',
    buttonPrimary: isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-900 text-white hover:bg-gray-800',
    buttonSecondary: isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-all duration-300`}>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
      {/* Self-Learning Indicator */}
      {isLearning && (
        <div className="fixed top-6 left-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 animate-pulse shadow-lg">
          <Brain className="w-4 h-4" />
          <span className="text-sm font-medium">AI Learning...</span>
        </div>
      )}

      {/* Multi-LLM Status Indicators */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {/* Elite Workers Status */}
        <div className={`${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-xl p-4 shadow-lg`}>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${eliteWorkersStatus.brand ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={theme.textSecondary}>Brand</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${eliteWorkersStatus.design ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={theme.textSecondary}>Design</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${eliteWorkersStatus.develop ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={theme.textSecondary}>Dev</span>
            </div>
          </div>
        </div>

        {/* Multi-LLM Orchestration Status */}
        <div className={`${theme.cardBg} backdrop-blur-xl border ${theme.border} rounded-xl p-4 shadow-lg`}>
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Multi-LLM AI</span>
            {multiLLMStatus.orchestrator && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${multiLLMStatus.anthropic ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={theme.textSecondary}>Claude</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${multiLLMStatus.openai ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={theme.textSecondary}>GPT-4o</span>
            </div>
            <div className="col-span-2 text-sm text-blue-600 mt-2">
              Active: {multiLLMStatus.lastModelSelection}
            </div>
            <div className="col-span-2 text-sm text-emerald-600">
              {multiLLMStatus.activeTasks} tasks processing
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full ${theme.navBg} backdrop-blur-xl z-40 border-b ${theme.border} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-12">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                    <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">24</span>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-white"></div>
                </div>
                <div>
                  <span className="text-xl font-bold">Code24</span>
                  <div className="text-xs text-blue-600 font-medium">Multi-LLM AI</div>
                </div>
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
                <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => {
                  setIsDark(!isDark);
                  trackInteraction('theme_toggle', { newTheme: !isDark ? 'dark' : 'light' });
                }} 
                className={`p-2 rounded-lg ${theme.cardBg} border ${theme.border} transition-all ${theme.hoverBg}`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => {
                  triggerOptimization();
                  trackInteraction('cta_click', { location: 'nav', action: 'start_trial' });
                }}
                className={`${theme.buttonPrimary} px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm`}
              >
                Start Free Trial
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Live Multi-LLM Status */}
          <div className={`inline-flex items-center space-x-4 ${theme.cardBg} border ${theme.border} rounded-full px-6 py-3 mb-12 shadow-sm`}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className={`text-sm font-medium ${theme.textSecondary}`}>
              Multi-LLM AI orchestration live
            </span>
            <div className={`w-px h-4 bg-gray-300`}></div>
            <div className="flex items-center space-x-2 text-sm">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium">{multiLLMStatus.lastModelSelection}</span>
            </div>
            <div className={`w-px h-4 bg-gray-300`}></div>
            <div className="flex items-center space-x-2 text-sm">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">{selfLearningData.optimizations} optimizations today</span>
            </div>
          </div>
          
          <div className="animate-fade-in-up text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="block mb-4">Your Website Beats</span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Competition Every Day
              </span>
            </h1>
            
            <div className="text-xl md:text-2xl lg:text-3xl font-semibold mb-8 max-w-4xl mx-auto">
              <span className="text-green-600">Your website gets better every day.</span>
              <br />
              <span className="text-red-500">Theirs stay frozen forever.</span>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed">
              While your competitors' websites slowly die, yours learns, improves, and surpasses them - 
              <span className="font-semibold text-blue-600">automatically, 24/7, all year long.</span>
            </p>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💪 The Guarantee</h2>
              <p className="text-xl font-semibold text-gray-800 mb-4">
                We'll make your website beat your competition - or work free until it does
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105">
                  Build New Website
                </button>
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all transform hover:scale-105">
                  Transform Existing Site
                </button>
              </div>
            </div>
          </div>

          {/* Everything Your Website Learns From Section */}
          <div className="animate-fade-in delay-500 mb-24 max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-12 text-gray-900">Everything Your Website Learns From</h2>
            <p className="text-xl text-center text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed">
              Your AI Workers continuously analyze 6 intelligence sources to ensure your website beats competition every single day
            </p>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              {/* YOUR Visitors */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-2xl font-bold text-blue-600">YOUR Visitors</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Mouse movements & clicks</strong> - What catches attention</div>
                  <div><strong>Scroll depth</strong> - What content gets read</div>
                  <div><strong>Time on page</strong> - What keeps people engaged</div>
                  <div><strong>Device usage</strong> - Mobile vs desktop behavior</div>
                  <div><strong>Traffic sources</strong> - How different visitors behave</div>
                  <div><strong>Rage clicks</strong> - What frustrates people</div>
                  <div><strong>Conversion paths</strong> - Exact steps that lead to sales</div>
                  <div><strong>Exit points</strong> - Where people leave and why</div>
                </div>
                <div className="bg-blue-100 rounded-lg p-3 mt-4">
                  <div className="text-sm font-semibold text-blue-700">Result:</div>
                  <div className="text-sm text-blue-600">Your site learns YOUR customers' exact patterns and adapts automatically</div>
                </div>
              </div>
              
              {/* Your Competitors */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-2xl font-bold text-red-600">Your Competitors</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What designs convert better</strong> - Visual layouts that work</div>
                  <div><strong>What headlines get more clicks</strong> - Messaging that resonates</div>
                  <div><strong>What offers attract customers</strong> - Pricing that wins</div>
                  <div><strong>What content ranks higher</strong> - Keywords that dominate</div>
                  <div><strong>What features they're missing</strong> - Opportunities to differentiate</div>
                  <div><strong>What mistakes they're making</strong> - Ways to pull ahead</div>
                  <div><strong>What speed they load at</strong> - Performance benchmarks</div>
                  <div><strong>What their customers complain about</strong> - Problems you can solve</div>
                </div>
                <div className="bg-red-100 rounded-lg p-3 mt-4">
                  <div className="text-sm font-semibold text-red-700">Result:</div>
                  <div className="text-sm text-red-600">Your site takes what works from competitors and beats them at their own game</div>
                </div>
              </div>
              
              {/* AI Search Engines (GEO) */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-2xl font-bold text-purple-600">AI Search Engines (GEO)</h3>
                  <p className="text-sm text-purple-700">Generative Engine Optimization</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Brand mention frequency</strong> - How often AI engines cite you</div>
                  <div><strong>Quote-worthy content</strong> - Statements AI engines reference</div>
                  <div><strong>Authority signals</strong> - What makes AI trust and recommend you</div>
                  <div><strong>Answer formatting</strong> - Structure AI engines prefer</div>
                  <div><strong>Schema markup effectiveness</strong> - Data AI engines understand</div>
                  <div><strong>Competitor mentions</strong> - When AI recommends them instead</div>
                  <div><strong>Search query patterns</strong> - What people ask AI about your industry</div>
                </div>
                <div className="bg-purple-100 rounded-lg p-3 mt-4">
                  <div className="text-sm font-semibold text-purple-700">Result:</div>
                  <div className="text-sm text-purple-600">When people ask ChatGPT, Claude, or Perplexity about your industry, YOUR business gets recommended</div>
                </div>
              </div>
              
              {/* Your Own Performance Data */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">📈</div>
                  <h3 className="text-2xl font-bold text-green-600">Your Performance Data</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Conversion rate trends</strong> - What's improving or declining</div>
                  <div><strong>A/B test results</strong> - What variations win (and why)</div>
                  <div><strong>Revenue per visitor</strong> - Which changes make more money</div>
                  <div><strong>Customer lifetime value</strong> - Which improvements retain customers</div>
                  <div><strong>Seasonal patterns</strong> - What works at different times</div>
                  <div><strong>Page performance</strong> - Which pages drive results</div>
                  <div><strong>Form completion rates</strong> - What makes people fill out forms</div>
                  <div><strong>Cart abandonment triggers</strong> - Why people don't complete checkout</div>
                </div>
                <div className="bg-green-100 rounded-lg p-3 mt-4">
                  <div className="text-sm font-semibold text-green-700">Result:</div>
                  <div className="text-sm text-green-600">Your site predicts what will work next based on what worked before</div>
                </div>
              </div>
              
              {/* Industry Trends */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🌐</div>
                  <h3 className="text-2xl font-bold text-orange-600">Industry Trends</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Design evolution</strong> - What's becoming standard in your industry</div>
                  <div><strong>Feature adoption</strong> - What capabilities customers now expect</div>
                  <div><strong>Content topics</strong> - What subjects are trending</div>
                  <div><strong>Technology shifts</strong> - New standards (mobile, voice, AI search)</div>
                  <div><strong>User behavior changes</strong> - How customer expectations evolve</div>
                  <div><strong>Competitor innovations</strong> - New tactics in your market</div>
                  <div><strong>Best practices</strong> - Proven patterns across thousands of sites</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-3 mt-4">
                  <div className="text-sm font-semibold text-orange-700">Result:</div>
                  <div className="text-sm text-orange-600">Your site stays ahead of trends instead of falling behind them</div>
                </div>
              </div>
              
              {/* Network Intelligence */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">💡</div>
                  <h3 className="text-2xl font-bold text-indigo-600">Network Intelligence</h3>
                  <p className="text-sm text-indigo-700">(500+ Learning Sites)</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What works across industries</strong> - Universal conversion truths</div>
                  <div><strong>Industry-specific patterns</strong> - What works for YOUR type of business</div>
                  <div><strong>Failed experiments</strong> - What NOT to try (saves months of testing)</div>
                  <div><strong>Winning formulas</strong> - Proven improvements ready to deploy</div>
                  <div><strong>Emerging patterns</strong> - Early signals of what's working</div>
                  <div><strong>Cross-pollination</strong> - Ideas from other industries that apply to yours</div>
                </div>
                <div className="bg-indigo-100 rounded-lg p-3 mt-4">
                  <div className="text-sm font-semibold text-indigo-700">Result:</div>
                  <div className="text-sm text-indigo-600">Your site benefits from learning that would take you 50+ years to acquire alone</div>
                </div>
              </div>
            </div>
            
            {/* The Learning Never Stops */}
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white rounded-3xl p-8 text-center">
              <h3 className="text-3xl font-bold mb-8 text-white">The Learning Never Stops</h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-red-400 mb-4">❌ Traditional Websites:</h4>
                  <div className="space-y-2 text-sm text-left">
                    <div>• Built once</div>
                    <div>• Knowledge frozen at launch</div>
                    <div>• Fall behind over time</div>
                    <div>• Require manual updates</div>
                    <div>• Cost $5K-50K every few years to "refresh"</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-green-400 mb-4">✅ Your Code24 Website:</h4>
                  <div className="space-y-2 text-sm text-left">
                    <div><strong>Day 1:</strong> Applies proven patterns from 500+ sites</div>
                    <div><strong>Week 1:</strong> Learns YOUR specific audience patterns</div>
                    <div><strong>Month 1:</strong> Discovers YOUR winning formula</div>
                    <div><strong>Month 3:</strong> Beats competitors through compound learning</div>
                    <div><strong>Year 1:</strong> Becomes the smartest site in your industry</div>
                    <div><strong>Forever:</strong> Never stops getting better</div>
                  </div>
                </div>
              </div>
              
              <div className="text-lg space-y-2">
                <div><strong>Every visitor teaches it something new</strong></div>
                <div><strong>Every competitor move gets analyzed</strong></div>
                <div><strong>Every trend gets adopted automatically</strong></div>
                <div><strong>Every improvement compounds on the last</strong></div>
              </div>
            </div>
          </div>

          {/* The Brutal Truth Section */}
          <div className="animate-fade-in delay-500 mb-16 max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">The Brutal Truth About Websites</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Competitors' Websites */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">❌</div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">99.9% of Websites</h3>
                  <p className="text-lg text-red-700">(Your Competition)</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">•</span>
                    <span>Frozen the day they launch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">•</span>
                    <span>Never improve on their own</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">•</span>
                    <span>Fall behind every day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">•</span>
                    <span>Lose to competitors slowly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">•</span>
                    <span>Need expensive updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">•</span>
                    <span>Become obsolete over time</span>
                  </div>
                </div>
              </div>
              
              {/* Code24 Websites */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Your Code24 Website</h3>
                  <p className="text-lg text-green-700">(Impossible Advantage)</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">•</span>
                    <span>Improves automatically every day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">•</span>
                    <span>Learns from your visitors 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">•</span>
                    <span>Studies your competition daily</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">•</span>
                    <span>Gets smarter while you sleep</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">•</span>
                    <span>Never needs manual updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">•</span>
                    <span>Never becomes obsolete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What Makes Code24 Impossible To Beat */}
          <div className="mb-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">What Makes Code24 Impossible To Beat</h2>
            <div className="text-center mb-12">
              <h3 className="text-2xl font-semibold mb-4">The AI Worker Team Nobody Else Has</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                While other platforms give you templates or single-purpose tools, Code24 deploys an entire 
                <span className="font-semibold text-blue-600"> team of specialized AI Workers</span> that work for you 24/7:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* The Learner Worker */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-2xl p-6 hover:scale-105 transition-all">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🧠</div>
                  <h4 className="text-xl font-bold text-blue-600">The Learner Worker</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What it does for you:</strong></div>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Watches every single visitor on your site</li>
                    <li>• Learns what makes YOUR customers click, buy, engage</li>
                    <li>• Studies your competition every day</li>
                    <li>• Identifies opportunities you'd never spot manually</li>
                    <li>• Gets smarter with every visitor</li>
                  </ul>
                  <div className="bg-blue-100 rounded-lg p-3 mt-4">
                    <div className="text-xs font-semibold text-blue-700 mb-1">Why competitors can't offer this:</div>
                    <div className="text-xs text-blue-600">Most platforms just show you analytics. Our Learner actually LEARNS and adapts your site automatically.</div>
                  </div>
                </div>
              </div>
              
              {/* The Tester Worker */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-300 rounded-2xl p-6 hover:scale-105 transition-all">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🔬</div>
                  <h4 className="text-xl font-bold text-emerald-600">The Tester Worker</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What it does for you:</strong></div>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Runs A/B tests continuously (not just one at a time)</li>
                    <li>• Tests headlines, layouts, colors, CTAs - everything</li>
                    <li>• Finds YOUR winning formula (not generic best practices)</li>
                    <li>• Deploys winners automatically</li>
                    <li>• Never stops testing new ideas</li>
                  </ul>
                  <div className="bg-emerald-100 rounded-lg p-3 mt-4">
                    <div className="text-xs font-semibold text-emerald-700 mb-1">Why competitors can't offer this:</div>
                    <div className="text-xs text-emerald-600">Traditional A/B testing requires manual setup, waiting weeks for results, and paying extra. Our Tester runs unlimited tests simultaneously.</div>
                  </div>
                </div>
              </div>
              
              {/* The Optimizer Worker */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-2xl p-6 hover:scale-105 transition-all">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">⚡</div>
                  <h4 className="text-xl font-bold text-purple-600">The Optimizer Worker</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What it does for you:</strong></div>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Makes your site faster every day</li>
                    <li>• Fixes problems before you notice them</li>
                    <li>• Improves mobile experience continuously</li>
                    <li>• Optimizes images automatically</li>
                    <li>• Boosts SEO while you sleep</li>
                  </ul>
                  <div className="bg-purple-100 rounded-lg p-3 mt-4">
                    <div className="text-xs font-semibold text-purple-700 mb-1">Why competitors can't offer this:</div>
                    <div className="text-xs text-purple-600">Other platforms require you to manually optimize. Our Optimizer never stops making your site better.</div>
                  </div>
                </div>
              </div>
              
              {/* The Designer Worker */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-300 rounded-2xl p-6 hover:scale-105 transition-all">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎨</div>
                  <h4 className="text-xl font-bold text-pink-600">The Designer Worker</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What it does for you:</strong></div>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Keeps your design modern and trendy</li>
                    <li>• Studies what's working in your industry</li>
                    <li>• Updates layouts to beat competitors</li>
                    <li>• Maintains your brand while improving conversion</li>
                    <li>• Learns from millions of design tests</li>
                  </ul>
                  <div className="bg-pink-100 rounded-lg p-3 mt-4">
                    <div className="text-xs font-semibold text-pink-700 mb-1">Why competitors can't offer this:</div>
                    <div className="text-xs text-pink-600">Static website builders give you a template that never evolves. Our Designer keeps you ahead of design trends forever.</div>
                  </div>
                </div>
              </div>
              
              {/* The Analyst Worker */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-2xl p-6 hover:scale-105 transition-all">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📊</div>
                  <h4 className="text-xl font-bold text-orange-600">The Analyst Worker</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What it does for you:</strong></div>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Tracks which competitors are beating you (and why)</li>
                    <li>• Identifies exactly what to improve next</li>
                    <li>• Predicts what changes will generate most revenue</li>
                    <li>• Measures every improvement's impact</li>
                    <li>• Reports results in plain English</li>
                  </ul>
                  <div className="bg-orange-100 rounded-lg p-3 mt-4">
                    <div className="text-xs font-semibold text-orange-700 mb-1">Why competitors can't offer this:</div>
                    <div className="text-xs text-orange-600">Analytics tools show you data - you have to figure out what it means. Our Analyst tells you exactly what to do.</div>
                  </div>
                </div>
              </div>
              
              {/* The Conversion Worker */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-2xl p-6 hover:scale-105 transition-all">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="text-xl font-bold text-green-600">The Conversion Worker</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>What it does for you:</strong></div>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Eliminates friction in your customer journey</li>
                    <li>• Improves CTAs based on YOUR audience</li>
                    <li>• Optimizes forms to get more leads</li>
                    <li>• Reduces cart abandonment</li>
                    <li>• Increases average order value</li>
                  </ul>
                  <div className="bg-green-100 rounded-lg p-3 mt-4">
                    <div className="text-xs font-semibold text-green-700 mb-1">Why competitors can't offer this:</div>
                    <div className="text-xs text-green-600">Conversion optimization usually costs $5K-15K/month from agencies. Our Conversion Worker does it 24/7 automatically.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Results Section */}
          <div className="mb-16 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white rounded-3xl p-8 text-center">
              <h2 className="text-4xl font-bold mb-8 text-white">Real Results From AI Worker Teams</h2>
              
              <div className="grid md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-green-400">+67%</div>
                  <div className="text-sm">Average conversion increase (first 6 months)</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-blue-400">24/7/365</div>
                  <div className="text-sm">AI Workers improving your site</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-purple-400">43,200</div>
                  <div className="text-sm">Optimization cycles per month</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-yellow-400">$0</div>
                  <div className="text-sm">Extra work required from you</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-emerald-400">7 Workers</div>
                  <div className="text-sm">Dedicated to your success</div>
                </div>
              </div>
              
              <div className="text-xl">
                🚀 <strong>Your Competitors Can't Keep Up</strong><br/>
                They update once a month (if they're lucky). Your AI Workers improve your site <strong>43,200 times per month</strong>.<br/>
                This isn't a fair fight - and that's the point.
              </div>
            </div>
          </div>

          {/* Revolutionary BUILD vs OPTIMIZE Section */}
          <div className="mb-24 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 text-gray-900">Two Paths. Same Destination. Impossible Advantage.</h2>
              <p className="text-xl text-gray-600 leading-relaxed">Whether you build new or transform existing - you get the same AI Worker team working 24/7 forever</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* BUILD Column */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-3xl p-8 transition-all hover:scale-105 animate-fade-in-left">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🏗️</div>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">BUILD</h3>
                  <p className="text-lg text-blue-700">Need a New Website?</p>
                  <p className="text-sm text-blue-600 mt-2">Professional website built in 3-8 minutes, then AI Workers improve it forever</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">✅ Any Business Type</h4>
                    <div className="text-sm space-y-1 text-gray-700">
                      <div>• Local businesses (dentist, salon, restaurant, gym)</div>
                      <div>• SaaS startups (landing pages, product sites)</div>
                      <div>• E-commerce (online stores)</div>
                      <div>• Professional services (lawyer, consultant)</div>
                      <div>• Portfolios (designer, photographer)</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">✅ Built by AI Workers</h4>
                    <div className="text-sm space-y-1 text-gray-700">
                      <div>• Designer Worker creates trendy, modern design</div>
                      <div>• Content Worker writes compelling copy</div>
                      <div>• Developer Worker builds everything</div>
                      <div>• SEO Worker optimizes for Google + AI search engines (ChatGPT, Claude, Perplexity)</div>
                      <div>• Live in 3-8 minutes</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-2">✅ Then Learns 24/7 Forever</h4>
                    <div className="text-sm space-y-1 text-gray-700">
                      <div>• All 7 AI Workers stay active</div>
                      <div>• Continuous improvement every day</div>
                      <div>• Never stops getting better</div>
                      <div>• Guaranteed to beat competition</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">From $149/mo</div>
                  <div className="text-sm text-blue-600 mb-4">Includes AI Worker team that works for you forever</div>
                  <a href="https://buy.stripe.com/28E8wO9vT2n01CtbfUdfG0i" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 w-full text-center block">
                    Start 14-Day Trial - BUILD
                  </a>
                </div>
              </div>
              
              {/* OPTIMIZE Column */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-3xl p-8 transition-all hover:scale-105 animate-fade-in-right">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-3xl font-bold text-emerald-600 mb-2">OPTIMIZE</h3>
                  <p className="text-lg text-emerald-700">Have an Existing Website?</p>
                  <p className="text-sm text-emerald-600 mt-2">AI Workers scan, fix everything, transform your site, then improve it forever</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-emerald-600 mb-2">✅ Works with ANY Platform</h4>
                    <div className="text-sm space-y-1 text-gray-700">
                      <div>• WordPress • Shopify • Wix • Squarespace</div>
                      <div>• Custom coded sites • Any CMS or framework</div>
                      <div>• Everything - no exceptions</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-emerald-600 mb-2">✅ Complete Transformation</h4>
                    <div className="text-sm space-y-1 text-gray-700">
                      <div>• AI Workers scan entire site (5-10 minutes)</div>
                      <div>• Find average of 197 issues</div>
                      <div>• Fix design problems + speed up load time</div>
                      <div>• Build missing pages + funnels</div>
                      <div>• Transform in 2-7 days</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-emerald-600 mb-2">✅ Then Learns 24/7 Forever</h4>
                    <div className="text-sm space-y-1 text-gray-700">
                      <div>• All 7 AI Workers stay active</div>
                      <div>• Continuous learning from visitors</div>
                      <div>• Tests improvements constantly</div>
                      <div>• Guaranteed to surpass competition</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">From $99/mo</div>
                  <div className="text-sm text-emerald-600 mb-4">Includes AI Worker team that transforms and optimizes forever</div>
                  <a href="https://buy.stripe.com/6oU5kC37v9PsepfcjYdfG0h" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 w-full text-center block">
                    Start 14-Day Trial - OPTIMIZE
                  </a>
                </div>
              </div>
            </div>
            
            {/* Performance Guarantee Section */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-3xl p-8 text-center animate-fade-in-up">
              <h3 className="text-4xl font-bold mb-4 text-gray-900">🏆 The Code24 Performance Guarantee</h3>
              <div className="text-2xl font-bold mb-6">We Guarantee Your Success</div>
              
              <div className="bg-white/90 rounded-2xl p-6 mb-6 max-w-4xl mx-auto">
                <p className="text-xl font-semibold text-black mb-4">
                  Your website will surpass your competition within 90 days, or we'll keep working free until it does.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  No other platform makes this promise because no other platform has AI Workers that continuously learn and improve.
                </p>
                
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="font-bold text-green-700">14-day free trial</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3">
                    <div className="font-bold text-blue-700">No credit card required</div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <div className="font-bold text-purple-700">Cancel anytime</div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-3">
                    <div className="font-bold text-orange-700">See improvements immediately</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xl font-semibold">
                Both Include The Same Promise: A team of AI Workers that never stops improving your website
              </div>
              <div className="text-lg mt-4">
                While your competitors' websites stay frozen, yours gets better every day.<br/>
                More traffic. Higher conversions. Better results. <strong>Guaranteed.</strong>
              </div>
              
              <div className="mt-8">
                <button className="bg-black text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all transform hover:scale-105 mr-4">
                  Start Your Free Trial Now
                </button>
              </div>
              
              <div className="mt-6 text-lg font-bold">
                Your competitors have dead websites. You'll have a learning machine that never stops winning.
              </div>
            </div>
          </div>

          {/* Multi-LLM Demo Section */}
          <div className="mb-16 max-w-6xl mx-auto">
            <div className={`${theme.cardBg} border ${theme.border} rounded-3xl p-12 shadow-lg`}>
              <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center">
                🧠 Watch Multi-LLM Orchestration Choose the Perfect AI
              </h3>
              <p className={`text-xl ${theme.textSecondary} mb-8 leading-relaxed text-center`}>
                See Code24 intelligently route tasks to the optimal AI model in real-time
              </p>
              
              <div className="space-y-8 mb-8">
                {/* Interactive Demo 1: Creative Task */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-2xl p-6 animate-fade-in">
                  <div className="mb-4">
                    <div className="text-lg font-semibold text-emerald-600 mb-2">User Input: "Create a compelling hero section for a SaaS platform"</div>
                    <div className="text-sm text-emerald-600">Code24 Multi-LLM Orchestrator:</div>
                  </div>
                  
                  <div className="bg-white border border-emerald-200 rounded-lg p-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span>🧠 Analyzing task...</span>
                      </div>
                      <div className="ml-4 text-gray-600">Task type: Creative + Persuasive</div>
                      <div className="ml-4 text-gray-600">Optimal AI: Anthropic Claude</div>
                      <div className="ml-4 text-gray-600">Reason: Superior creative writing</div>
                      <div className="flex items-center space-x-2 mt-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-semibold">✓ Routing to Claude...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-emerald-600 font-semibold">⚡ Response Time</div>
                      <div className="text-2xl font-bold text-emerald-600">1.8s</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-emerald-600 font-semibold">📊 Quality Score</div>
                      <div className="text-2xl font-bold text-emerald-600">95/100</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-emerald-600 font-semibold">🎨 Creative Score</div>
                      <div className="text-2xl font-bold text-emerald-600">92/100</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-emerald-700 text-center">
                    <strong>Result:</strong> "Transform Your Workflow in Minutes, Not Months"<br/>
                    <span className="text-xs text-emerald-600">Alternative tested with GPT-4o: 87/100 - Code24 saved you 8 quality points</span>
                  </div>
                </div>
                
                {/* Interactive Demo 2: Technical Task */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-2xl p-6 animate-fade-in delay-150">
                  <div className="mb-4">
                    <div className="text-lg font-semibold text-blue-600 mb-2">User Input: "Generate responsive CSS grid system code"</div>
                    <div className="text-sm text-blue-600">Code24 Multi-LLM Orchestrator:</div>
                  </div>
                  
                  <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>🧠 Analyzing task...</span>
                      </div>
                      <div className="ml-4 text-gray-600">Task type: Technical + Code Generation</div>
                      <div className="ml-4 text-gray-600">Optimal AI: OpenAI GPT-4o</div>
                      <div className="ml-4 text-gray-600">Reason: Superior technical precision</div>
                      <div className="flex items-center space-x-2 mt-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-semibold">✓ Routing to GPT-4o...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-blue-600 font-semibold">⚡ Response Time</div>
                      <div className="text-2xl font-bold text-blue-600">1.5s</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-blue-600 font-semibold">📊 Code Quality</div>
                      <div className="text-2xl font-bold text-blue-600">98/100</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-blue-600 font-semibold">🔧 Accuracy</div>
                      <div className="text-2xl font-bold text-blue-600">96/100</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-blue-700 text-center">
                    <strong>Result:</strong> Production-ready CSS Grid with fallbacks and optimization<br/>
                    <span className="text-xs text-blue-600">Alternative tested with Claude: 89/100 - Code24 saved you 9 quality points</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-900 text-white rounded-2xl p-8 mb-8">
                  <h4 className="text-2xl font-bold mb-6">THIS IS THE DIFFERENCE:</h4>
                  
                  <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="space-y-4">
                      <div className="text-lg font-semibold text-red-400">❌ Competitors:</div>
                      <div className="space-y-2 text-sm">
                        <div>• Force you to pick one AI and accept mediocrity</div>
                        <div>• Single model = good at one thing, bad at others</div>
                        <div>• Manual selection = human guesswork</div>
                        <div>• Static results that never improve</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-lg font-semibold text-green-400">✅ Code24:</div>
                      <div className="space-y-2 text-sm">
                        <div>• Intelligently routes every task to optimal AI</div>
                        <div>• Best-in-class quality for EVERYTHING</div>
                        <div>• Automatic selection = AI intelligence</div>
                        <div>• Compound improvements that accelerate</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    triggerOptimization();
                    trackInteraction('multi_llm_demo', { action: 'test_live_orchestration' });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105 animate-pulse"
                >
                  🧠 Test Live Multi-LLM Orchestration
                </button>
              </div>
            </div>
          </div>

          {/* WHY CODE24 IS IMPOSSIBLY BETTER */}
          <div className="mb-16 max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">WHY CODE24 IS IMPOSSIBLY BETTER</h2>
            
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-xl font-bold text-red-600 mb-4">❌ Every Other Platform:</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span><strong>Wix/Squarespace:</strong> Templates that never improve</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span><strong>WordPress:</strong> DIY updates, manual work forever</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span><strong>AI Competitors:</strong> One AI = mediocre at everything</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span><strong>Agencies:</strong> $10K-50K, 2-3 months, then stagnant</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span><strong>All platforms:</strong> Pick build OR optimize</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xl font-bold text-green-600 mb-4">✅ Code24 Multi-LLM Platform:</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>BUILD:</strong> Multi-LLM creates + optimizes 24/7</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>OPTIMIZE:</strong> AI fixes + improves everything</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Multi-LLM:</strong> Best-in-class for every task</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Price:</strong> $99-149/mo, minutes to live, improves forever</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Complete:</strong> Get BOTH + multi-LLM learning forever</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Choice Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div 
              onClick={() => {
                setActiveProduct('build');
                trackInteraction('product_card_click', { product: 'build' });
              }}
              className={`cursor-pointer rounded-3xl p-8 transition-all duration-300 ${
                activeProduct === 'build' 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 scale-105 shadow-xl' 
                  : `${theme.cardBg} border ${theme.border} hover:scale-102 shadow-sm`
              }`}
            >
              <Wand2 className={`w-14 h-14 mx-auto mb-4 transition-colors ${activeProduct === 'build' ? 'text-blue-600' : theme.textSecondary}`} />
              <h3 className="text-2xl font-bold mb-3">BUILD: "From Dead Website to Learning Machine"</h3>
              <p className={`text-sm ${theme.textSecondary} mb-2`}>Build a website that literally never becomes obsolete</p>
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-600 mb-4">
                <span>$497/month</span>
                <div className="w-px h-3 bg-blue-400"></div>
                <span>300-500% ROI</span>
              </div>

              <div className={`${theme.cardBgAlt} border ${theme.border} rounded-xl p-4 mb-6 text-left space-y-3`}>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Describe your business</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Voice, text, or upload</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Wand2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Multi-LLM AI workers build everything</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Design, content, backend, SEO</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Rocket className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Launch & start learning</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Live in minutes</div>
                  </div>
                </div>
              </div>

              {activeProduct === 'build' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                  <div className="text-xs font-semibold text-blue-600 mb-1">THE DIFFERENCE:</div>
                  <div className={`text-xs ${theme.textSecondary}`}>While other platforms build static websites that become digital tombstones, Code24 builds learning machines that never become obsolete.</div>
                </div>
              )}
            </div>

            <div 
              onClick={() => {
                setActiveProduct('optimize');
                trackInteraction('product_card_click', { product: 'optimize' });
              }}
              className={`cursor-pointer rounded-3xl p-8 transition-all duration-300 ${
                activeProduct === 'optimize' 
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 scale-105 shadow-xl' 
                  : `${theme.cardBg} border ${theme.border} hover:scale-102 shadow-sm`
              }`}
            >
              <TrendingUp className={`w-14 h-14 mx-auto mb-4 transition-colors ${activeProduct === 'optimize' ? 'text-emerald-600' : theme.textSecondary}`} />
              <h3 className="text-2xl font-bold mb-3">OPTIMIZE: "Resurrect Your Digital Tombstone"</h3>
              <p className={`text-sm ${theme.textSecondary} mb-2`}>Transform your dead static website into a living, learning machine</p>
              <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-xs text-emerald-600 mb-4">
                <span>$297-1497/month</span>
                <div className="w-px h-3 bg-emerald-400"></div>
                <span>200-400% improvement</span>
              </div>

              <div className={`${theme.cardBgAlt} border ${theme.border} rounded-xl p-4 mb-6 text-left space-y-3`}>
                <div className="flex items-start space-x-3">
                  <Search className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Scan your entire site</div>
                    <div className={`text-xs ${theme.textSecondary}`}>197 avg issues in 5-10 min</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Fix everything automatically</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Design, speed, SEO, mobile</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RefreshCw className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Improve 24/7 forever</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Learn, test, optimize</div>
                  </div>
                </div>
              </div>

              {activeProduct === 'optimize' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-left">
                  <div className="text-xs font-semibold text-emerald-600 mb-1">THE DIFFERENCE:</div>
                  <div className={`text-xs ${theme.textSecondary}`}>While others offer plugins that require manual work, our AI workers automatically transform dead websites into living machines.</div>
                </div>
              )}
            </div>
          </div>

          {/* Input Section */}
          <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-8 transition-all hover:shadow-lg shadow-sm`}>
            {activeProduct === 'build' ? (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-6">How would you like to create?</h3>
                
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: Mic, label: 'Speak', time: '1-2 min', method: 'voice' },
                    { icon: MessageSquare, label: 'Type', time: '2-3 min', method: 'text' },
                    { icon: Upload, label: 'Upload', time: '3-4 min', method: 'upload' },
                    { icon: Link2, label: 'Reference', time: '2-3 min', method: 'reference' }
                  ].map((m, i) => (
                    <button
                      key={i}
                      onClick={() => trackInteraction('input_method_select', { method: m.method })}
                      className={`${theme.cardBgAlt} border ${theme.border} rounded-xl p-4 transition-all ${theme.hoverBg} hover:scale-105`}
                    >
                      <m.icon className={`w-6 h-6 mx-auto mb-2 ${theme.textSecondary}`} />
                      <p className="text-sm mb-1">{m.label}</p>
                      <p className="text-xs text-blue-600">{m.time}</p>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Describe your business..."
                    className={`w-full ${theme.cardBgAlt} border ${theme.border} rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    onChange={(e) => trackInteraction('input_change', { length: e.target.value.length, product: 'build' })}
                  />
                  <button 
                    onClick={() => {
                      trackInteraction('build_submit', { product: 'build' });
                      triggerOptimization();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Build Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-2">Enter your website for free audit</h3>
                <p className={`text-sm ${theme.textSecondary} mb-6`}>See what's killing your conversions</p>
                
                <div className="relative mb-6">
                  <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textSecondary}`} />
                  <input 
                    type="url" 
                    placeholder="https://yourwebsite.com"
                    className={`w-full ${theme.cardBgAlt} border ${theme.border} rounded-xl pl-12 pr-32 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all`}
                    onChange={(e) => trackInteraction('url_input_change', { length: e.target.value.length, product: 'optimize' })}
                  />
                  <button 
                    onClick={() => {
                      trackInteraction('scan_submit', { product: 'optimize' });
                      triggerOptimization();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Scan Free
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-500">197</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Avg issues</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">5-10min</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Scan time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">$22K</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Revenue lost</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Elite Workers Demo Section */}
      <section className={`py-24 ${theme.cardBgAlt}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Meet Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Elite AI Workers</span>
            </h2>
            <p className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto`}>
              The world's most advanced AI workers continuously optimize your website. No human intervention required.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Multi-LLM Orchestrator',
                status: multiLLMStatus.orchestrator,
                description: 'Intelligently routes tasks between Anthropic Claude and OpenAI GPT-4o for optimal results',
                metrics: [`AI Selection: ${multiLLMStatus.lastModelSelection}`, `Active Tasks: ${multiLLMStatus.activeTasks}`, 'Cost Optimization: 35% savings']
              },
              {
                icon: Target,
                title: 'Brand Worker',
                status: eliteWorkersStatus.brand,
                description: 'Multi-LLM powered brand strategy with Claude for creativity and GPT-4o for analysis',
                metrics: ['AI Models: Claude + GPT-4o', 'Brand Score: 94/100', 'Message Clarity: +23%']
              },
              {
                icon: Layers,
                title: 'Design Worker', 
                status: eliteWorkersStatus.design,
                description: 'Multi-LLM powered design creation with Anthropic for creativity and OpenAI for technical specs',
                metrics: ['AI Models: Claude + GPT-4o', 'Design Quality: 95/100', 'Conversion Rate: +67%']
              },
              {
                icon: FlaskConical,
                title: 'Developer Worker',
                status: eliteWorkersStatus.develop,
                description: 'Multi-LLM powered development with GPT-4o for coding and Claude for architecture review',
                metrics: ['AI Models: GPT-4o + Claude', 'Code Quality: 96/100', 'Security Score: A+']
              }
            ].map((worker, index) => (
              <div key={index} className={`${theme.cardBg} border ${index === 0 ? 'border-blue-300' : theme.border} rounded-2xl p-8 transition-all hover:scale-105 shadow-sm ${index === 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <worker.icon className={`w-12 h-12 ${index === 0 ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className={`w-3 h-3 rounded-full ${worker.status ? 'bg-emerald-500' : 'bg-red-500'} ${worker.status ? 'animate-pulse' : ''}`}></div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{worker.title}</h3>
                <p className={`text-sm ${theme.textSecondary} mb-6`}>{worker.description}</p>
                
                <div className="space-y-2">
                  {worker.metrics.map((metric, i) => (
                    <div key={i} className={`text-xs ${theme.textSecondary} flex items-center justify-between`}>
                      <span>{metric.split(':')[0]}:</span>
                      <span className="text-blue-600 font-semibold">{metric.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / How It Works Accordion Section */}
      <section className={`py-24 px-6 ${theme.cardBgAlt} border-t ${theme.border}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">How AI Workers Guarantee You Beat Competition</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary questions answered about the only platform that makes your website impossible to beat
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'how-guarantee',
                question: 'How can you guarantee my website will beat the competition?',
                answer: 'Your AI Worker team learns from 6 intelligence sources 24/7: your visitors, your competitors, AI search engines (ChatGPT, Claude, Perplexity), performance data, industry trends, and our network of 500+ learning sites. They continuously optimize your website based on what works and what doesn\'t across your entire industry. Traditional websites stay static while yours gets smarter every single day.'
              },
              {
                id: 'what-workers',
                question: 'What exactly do the 7 AI Workers do for my website?',
                answer: 'Each AI Worker has a specialized role: 1) Learner Worker analyzes all visitors and competitors 24/7, 2) Tester Worker runs continuous A/B tests and experiments, 3) Optimizer Worker improves conversion rates automatically, 4) Designer Worker updates visual design based on what converts, 5) Analyst Worker tracks performance and finds opportunities, 6) Conversion Worker optimizes sales funnels, 7) SEO Worker dominates both Google and AI search engines (GEO).'
              },
              {
                id: 'build-vs-optimize',
                question: 'Should I choose BUILD ($149/mo) or OPTIMIZE ($99/mo)?',
                answer: 'Choose BUILD if you need a new website built from scratch by our AI Worker team in 3-8 minutes. Choose OPTIMIZE if you have an existing website that needs to be transformed into a learning machine that beats competitors. Both include the same 7 AI Workers working for you forever, with OPTIMIZE including additional resurrection and competitive analysis features.'
              },
              {
                id: 'how-learning',
                question: 'How does the continuous learning actually work?',
                answer: 'Your website learns from: mouse movements and clicks from YOUR visitors, successful designs and copy from your competitors, mentions and authority signals in AI search engines, A/B test results and conversion data, industry design and feature trends, and patterns from our network of 500+ client sites across industries. This intelligence is processed 24/7 to make micro-improvements that compound into massive competitive advantages.'
              },
              {
                id: 'geo-optimization',
                question: 'What is GEO and why does it matter for my business?',
                answer: 'GEO (Generative Engine Optimization) is optimization for AI search engines like ChatGPT, Claude, and Perplexity. While your competitors focus only on Google, your SEO Worker optimizes for both traditional search engines AND AI engines where millions of people now search. This gives you a massive first-mover advantage in the AI search era.'
              },
              {
                id: 'roi-timeline',
                question: 'When will I see results and what ROI can I expect?',
                answer: 'Most customers see 25-50% improvement in key metrics within the first month, 200-400% performance increase by month 6, and market-leading position achieved within year 1. The learning compounds daily, so by year 2+ you become impossible for competitors to catch up to. Typical ROI is 300-500% within 90 days because your website keeps getting better while competitors\' sites decay.'
              },
              {
                id: 'vs-traditional',
                question: 'How is this different from traditional web development?',
                answer: 'Traditional websites are built once and decay over time, requiring expensive redesigns every 2-3 years. Our AI Workers create learning machines that improve continuously. While competitors\' websites become outdated, yours becomes more competitive every day. You never need redesigns because your website evolves automatically based on market changes and visitor behavior.'
              },
              {
                id: 'guarantee-promise',
                question: 'What if my website doesn\'t beat the competition?',
                answer: 'We guarantee your website will beat your competition or we work free until it does. This isn\'t just confidence - it\'s mathematical certainty. A learning website that improves 24/7 will always outperform static websites that decay over time. The compound learning effect makes your competitive advantage inevitable.'
              }
            ].map((faq) => (
              <div 
                key={faq.id} 
                className={`${theme.cardBg} border ${theme.border} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setOpenAccordion(openAccordion === faq.id ? null : faq.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                      openAccordion === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed mt-4">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA after FAQ */}
          <div className="text-center mt-16 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Build Your Competitive Advantage?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join the revolution. Get your AI Worker team and watch your website beat competition every single day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="https://buy.stripe.com/28E8wO9vT2n01CtbfUdfG0i" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2">
                <span>Start Building - $149/mo</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="https://buy.stripe.com/6oU5kC37v9PsepfcjYdfG0h" target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center space-x-2">
                <span>Optimize Existing - $99/mo</span>
                <Zap className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Global Compliance Footer */}
      <footer className={`${theme.cardBgAlt} border-t ${theme.border} py-16`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">24</span>
                    </div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="font-bold">Code24</span>
                  <div className="text-xs text-blue-600">Multi-LLM AI</div>
                </div>
              </div>
              <p className={`text-sm ${theme.textSecondary} mb-4`}>
                The world's first platform that intelligently orchestrates multiple AI models for optimal results.
              </p>
              <div className="flex items-center space-x-2 text-xs text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <div className={theme.textSecondary}>BUILD - Multi-LLM Websites</div>
                <div className={theme.textSecondary}>OPTIMIZE - AI Site Transformation</div>
                <div className={theme.textSecondary}>Market Intelligence</div>
                <div className={theme.textSecondary}>24/7 AI Optimization</div>
                <div className={theme.textSecondary}>Enterprise Solutions</div>
              </div>
            </div>

            {/* Security & Compliance */}
            <div>
              <h4 className="font-semibold mb-4">Security & Compliance</h4>
              <div className="space-y-2 text-sm">
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span>GDPR Compliant</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span>CCPA Compliant</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Globe className="w-3 h-3 text-blue-500" />
                  <span>Global Edge Network</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Activity className="w-3 h-3 text-emerald-500" />
                  <span>99.9% Uptime SLA</span>
                </div>
              </div>
            </div>

            {/* Contact & Legal */}
            <div>
              <h4 className="font-semibold mb-4">Contact & Legal</h4>
              <div className="space-y-2 text-sm">
                <div className={theme.textSecondary}>Enterprise Support</div>
                <div className={theme.textSecondary}>Privacy Policy</div>
                <div className={theme.textSecondary}>Terms of Service</div>
                <div className={theme.textSecondary}>Data Processing Agreement</div>
                <div className={theme.textSecondary}>Cookie Policy</div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`border-t ${theme.border} pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0`}>
            <div className={`text-sm ${theme.textSecondary}`}>
              © 2024 Code24. All rights reserved. Global compliance and enterprise security.
            </div>
            
            <div className="flex items-center space-x-6 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className={theme.textSecondary}>Status: All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-3 h-3 text-blue-500" />
                <span className={theme.textSecondary}>200+ Global Locations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-3 h-3 text-emerald-500" />
                <span className={theme.textSecondary}>Multi-LLM Orchestration</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Code24Platform;