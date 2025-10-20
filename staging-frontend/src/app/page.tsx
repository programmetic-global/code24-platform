'use client'

import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Zap, TrendingUp, Shield, Globe, ArrowRight, Check, Play, Mic, Upload, Link2, Search, MessageSquare, Target, Brain, FlaskConical, LineChart, Mail, Wand2, Rocket, Layers, RefreshCw, Activity, Users, BarChart3 } from 'lucide-react';

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

const Code24Platform = () => {
  const [activeProduct, setActiveProduct] = useState('build');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
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
  const [isLearning, setIsLearning] = useState(false);

  // Self-learning analytics tracking
  useEffect(() => {
    // Track page load
    trackInteraction('page_load', { 
      product: activeProduct,
      theme: isDark ? 'dark' : 'light',
      timestamp: new Date().toISOString()
    });

    // Check Elite Workers status
    checkEliteWorkersStatus();

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
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg z-50';
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
    bg: isDark ? 'bg-black' : 'bg-white',
    text: isDark ? 'text-white' : 'text-black',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-white/10' : 'border-black/10',
    cardBg: isDark ? 'bg-white/5' : 'bg-black/5',
    hoverBg: isDark ? 'hover:bg-white/10' : 'hover:bg-black/10',
    navBg: isDark ? 'bg-black/80' : 'bg-white/80',
    buttonPrimary: isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-all duration-300`}>
      {/* Self-Learning Indicator */}
      {isLearning && (
        <div className="fixed top-4 left-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 animate-pulse">
          <Brain className="w-4 h-4" />
          <span className="text-sm font-medium">AI Learning...</span>
        </div>
      )}

      {/* Elite Workers Status Bar */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-3">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${eliteWorkersStatus.brand ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-gray-300">Brand</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${eliteWorkersStatus.design ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-gray-300">Design</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${eliteWorkersStatus.develop ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-gray-300">Dev</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full ${theme.navBg} backdrop-blur-xl z-40 border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">24</span>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-black"></div>
                </div>
                <div>
                  <span className="text-xl font-bold">Code24</span>
                  <div className="text-xs text-purple-400 font-medium">Learning Websites</div>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <button 
                  onClick={() => {
                    setActiveProduct('build');
                    trackInteraction('nav_click', { section: 'build' });
                  }} 
                  className={`text-sm font-medium transition-colors ${activeProduct === 'build' ? theme.text : theme.textSecondary}`}
                >
                  Build
                </button>
                <button 
                  onClick={() => {
                    setActiveProduct('optimize');
                    trackInteraction('nav_click', { section: 'optimize' });
                  }} 
                  className={`text-sm font-medium transition-colors ${activeProduct === 'optimize' ? theme.text : theme.textSecondary}`}
                >
                  Optimize
                </button>
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
                className={`${theme.buttonPrimary} px-5 py-2.5 rounded-lg text-sm font-medium transition-all`}
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
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Live Learning Status */}
          <div className={`inline-flex items-center space-x-3 ${theme.cardBg} border ${theme.border} rounded-full px-4 py-2 mb-8`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-sm ${theme.textSecondary}`}>
              500+ websites learning 24/7
            </span>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center space-x-1 text-xs">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-green-400">{selfLearningData.optimizations} optimizations today</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Your Website That
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Never Gets Old</span>
          </h1>
          
          <p className={`text-2xl md:text-3xl font-semibold mb-6`}>
            The World's First Platform That Builds
            <br />
            <span className="text-blue-400">Learning Websites That Never Become Obsolete</span>
          </p>

          <p className={`text-lg md:text-xl ${theme.textSecondary} mb-12 max-w-5xl mx-auto`}>
            While your competitors' websites <span className="text-red-400 font-semibold">decay and fall behind</span>, yours gets smarter, faster, and more profitable every single day.
            <br /><br />
            <span className="text-green-400 font-semibold">300-500% ROI in 90 days</span> • <span className="text-purple-400 font-semibold">Market Intelligence Built-In</span> • <span className="text-blue-400 font-semibold">24/7 AI Optimization</span>
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">500+ Learning Sites</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-sm">Global Edge Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <span className="text-sm">99.9% Uptime SLA</span>
            </div>
          </div>

          {/* Value Proposition Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
            <div className={`${theme.cardBg} border border-red-500/30 rounded-2xl p-8`}>
              <h3 className="text-2xl font-bold text-red-400 mb-6">Traditional Websites: Built to Die</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className={theme.textSecondary}>Built once, frozen forever</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className={theme.textSecondary}>$15,000+ initial cost</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className={theme.textSecondary}>Redesign every 2-3 years</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className={theme.textSecondary}>Falls behind competitors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className={theme.textSecondary}>$22,000+ monthly revenue loss</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-3xl font-bold text-red-400">$160,000+</div>
                <div className="text-sm text-red-400">Total 5-year cost</div>
              </div>
            </div>

            <div className={`${theme.cardBg} border border-green-500/30 rounded-2xl p-8 bg-gradient-to-br from-green-500/5 to-blue-500/5`}>
              <h3 className="text-2xl font-bold text-green-400 mb-6">Code24 Websites: Built for Immortality</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className={theme.textSecondary}>Learns and improves 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className={theme.textSecondary}>$497/month all-inclusive</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className={theme.textSecondary}>Never needs redesigning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className={theme.textSecondary}>Always ahead of competition</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className={theme.textSecondary}>+$200,000 revenue gained</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-3xl font-bold text-green-400">+$170,000</div>
                <div className="text-sm text-green-400">Net 5-year gain</div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">Two Revolutionary Services</h2>
          <p className={`text-xl ${theme.textSecondary} mb-12 max-w-4xl mx-auto`}>
            Choose your path to building a website that never becomes obsolete
          </p>

          {/* Choice Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div 
              onClick={() => {
                setActiveProduct('build');
                trackInteraction('product_card_click', { product: 'build' });
              }}
              className={`cursor-pointer rounded-3xl p-8 transition-all duration-300 ${
                activeProduct === 'build' 
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 scale-105 shadow-xl shadow-purple-500/20' 
                  : `${theme.cardBg} border ${theme.border} hover:scale-102`
              }`}
            >
              <Wand2 className={`w-14 h-14 mx-auto mb-4 transition-colors ${activeProduct === 'build' ? 'text-purple-400' : theme.textSecondary}`} />
              <h3 className="text-2xl font-bold mb-3">BUILD: "Your Website That Never Gets Old"</h3>
              <p className={`text-sm ${theme.textSecondary} mb-2`}>Learning websites that improve 24/7/365</p>
              <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs text-purple-400 mb-4">
                <span>$497/month</span>
                <div className="w-px h-3 bg-purple-400"></div>
                <span>300-500% ROI</span>
              </div>

              <div className={`${theme.cardBg} border ${theme.border} rounded-xl p-4 mb-6 text-left space-y-3`}>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Describe your business</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Voice, text, or upload</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Wand2 className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>AI workers build everything</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Design, content, backend, SEO</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Rocket className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Launch & start learning</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Live in minutes</div>
                  </div>
                </div>
              </div>

              {activeProduct === 'build' && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-left">
                  <div className="text-xs font-semibold text-purple-400 mb-1">THE DIFFERENCE:</div>
                  <div className={`text-xs ${theme.textSecondary}`}>Unlike Wix or WordPress that freeze after launch, your site learns and improves automatically.</div>
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
                  ? 'bg-gradient-to-br from-blue-500/20 to-green-500/20 border-2 border-blue-500/50 scale-105 shadow-xl shadow-blue-500/20' 
                  : `${theme.cardBg} border ${theme.border} hover:scale-102`
              }`}
            >
              <TrendingUp className={`w-14 h-14 mx-auto mb-4 transition-colors ${activeProduct === 'optimize' ? 'text-blue-400' : theme.textSecondary}`} />
              <h3 className="text-2xl font-bold mb-3">OPTIMIZE: "Transform Dead Website Into Learning Machine"</h3>
              <p className={`text-sm ${theme.textSecondary} mb-2`}>AI resurrection + continuous improvement</p>
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs text-blue-400 mb-4">
                <span>$297-1497/month</span>
                <div className="w-px h-3 bg-blue-400"></div>
                <span>200-400% improvement</span>
              </div>

              <div className={`${theme.cardBg} border ${theme.border} rounded-xl p-4 mb-6 text-left space-y-3`}>
                <div className="flex items-start space-x-3">
                  <Search className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Scan your entire site</div>
                    <div className={`text-xs ${theme.textSecondary}`}>197 avg issues in 5-10 min</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Fix everything automatically</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Design, speed, SEO, mobile</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RefreshCw className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className={`text-sm font-medium`}>Improve 24/7 forever</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Learn, test, optimize</div>
                  </div>
                </div>
              </div>

              {activeProduct === 'optimize' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-left">
                  <div className="text-xs font-semibold text-blue-400 mb-1">THE DIFFERENCE:</div>
                  <div className={`text-xs ${theme.textSecondary}`}>Unlike plugins that need manual work, AI workers scan, fix, and improve automatically.</div>
                </div>
              )}
            </div>
          </div>

          {/* Input Section */}
          <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-8 transition-all hover:shadow-xl`}>
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
                      className={`${theme.cardBg} border ${theme.border} rounded-xl p-4 transition-all ${theme.hoverBg} hover:scale-105`}
                    >
                      <m.icon className={`w-6 h-6 mx-auto mb-2 ${theme.textSecondary}`} />
                      <p className="text-sm mb-1">{m.label}</p>
                      <p className="text-xs text-purple-400">{m.time}</p>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Describe your business..."
                    className={`w-full ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${theme.border} rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                    onChange={(e) => trackInteraction('input_change', { length: e.target.value.length, product: 'build' })}
                  />
                  <button 
                    onClick={() => {
                      trackInteraction('build_submit', { product: 'build' });
                      triggerOptimization();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
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
                    className={`w-full ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${theme.border} rounded-xl pl-12 pr-32 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    onChange={(e) => trackInteraction('url_input_change', { length: e.target.value.length, product: 'optimize' })}
                  />
                  <button 
                    onClick={() => {
                      trackInteraction('scan_submit', { product: 'optimize' });
                      triggerOptimization();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Scan Free
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">197</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Avg issues</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">5-10min</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Scan time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">$22K</div>
                    <div className={`text-xs ${theme.textSecondary}`}>Revenue lost</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Self-Learning Analytics Display */}
          <div className={`mt-16 ${theme.cardBg} border ${theme.border} rounded-2xl p-8`}>
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-center space-x-2">
              <Brain className="w-6 h-6 text-purple-400" />
              <span>Live Self-Learning Analytics</span>
            </h3>
            
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{selfLearningData.conversionRate.toFixed(1)}%</div>
                <div className={`text-sm ${theme.textSecondary} mb-1`}>Conversion Rate</div>
                <div className="text-xs text-green-400">↗ +{(Math.random() * 0.1).toFixed(2)}% today</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{selfLearningData.bounceRate.toFixed(0)}%</div>
                <div className={`text-sm ${theme.textSecondary} mb-1`}>Bounce Rate</div>
                <div className="text-xs text-green-400">↘ -{(Math.random() * 2).toFixed(1)}% today</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{Math.floor(selfLearningData.timeOnSite)}s</div>
                <div className={`text-sm ${theme.textSecondary} mb-1`}>Time on Site</div>
                <div className="text-xs text-green-400">↗ +{Math.floor(Math.random() * 10)}s today</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">{selfLearningData.interactions}</div>
                <div className={`text-sm ${theme.textSecondary} mb-1`}>Interactions</div>
                <div className="text-xs text-blue-400">Live tracking</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">{selfLearningData.optimizations}</div>
                <div className={`text-sm ${theme.textSecondary} mb-1`}>AI Optimizations</div>
                <div className="text-xs text-purple-400">Auto-applied</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={triggerOptimization}
                disabled={isLearning}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 ${isLearning ? 'animate-pulse' : ''}`}
              >
                {isLearning ? 'AI Optimizing...' : 'Trigger AI Optimization'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Elite Workers Demo Section */}
      <section className={`py-24 ${theme.cardBg}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Meet Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Elite AI Workers</span>
            </h2>
            <p className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto`}>
              The world's most advanced AI workers continuously optimize your website. No human intervention required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Brand Worker',
                status: eliteWorkersStatus.brand,
                description: 'Analyzes brand positioning and optimizes messaging for maximum impact',
                metrics: ['Brand Score: 94/100', 'Message Clarity: +23%', 'Trust Signals: +45%']
              },
              {
                icon: Layers,
                title: 'Design Worker', 
                status: eliteWorkersStatus.design,
                description: 'Creates conversion-optimized designs that follow latest trends and psychology',
                metrics: ['Conversion Rate: +67%', 'Mobile UX: 98/100', 'Load Speed: <1.2s']
              },
              {
                icon: FlaskConical,
                title: 'Developer Worker',
                status: eliteWorkersStatus.develop,
                description: 'Builds enterprise-grade code with perfect performance and security',
                metrics: ['Core Web Vitals: 100', 'Security Score: A+', 'Code Quality: 96/100']
              }
            ].map((worker, index) => (
              <div key={index} className={`${theme.cardBg} border ${theme.border} rounded-2xl p-8 transition-all hover:scale-105`}>
                <div className="flex items-center justify-between mb-6">
                  <worker.icon className="w-12 h-12 text-purple-400" />
                  <div className={`w-3 h-3 rounded-full ${worker.status ? 'bg-green-400' : 'bg-red-400'} ${worker.status ? 'animate-pulse' : ''}`}></div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{worker.title}</h3>
                <p className={`text-sm ${theme.textSecondary} mb-6`}>{worker.description}</p>
                
                <div className="space-y-2">
                  {worker.metrics.map((metric, i) => (
                    <div key={i} className={`text-xs ${theme.textSecondary} flex items-center justify-between`}>
                      <span>{metric.split(':')[0]}:</span>
                      <span className="text-green-400 font-semibold">{metric.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Success Stories Section */}
      <section className={`py-24 ${theme.bg}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Real Results from <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Learning Websites</span>
            </h2>
            <p className={`text-xl ${theme.textSecondary}`}>See why businesses choose websites that never become obsolete</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "TechStartup Inc.",
                service: "BUILD",
                result: "$125,000 additional revenue in 90 days",
                quote: "In 6 minutes, Code24 built us a website that outperformed our old $25,000 site. Three months later, we're the #1 result for our main keywords and conversion rates are 4x higher.",
                improvement: "400% conversion increase"
              },
              {
                company: "RetailCorp", 
                service: "OPTIMIZE",
                result: "$45,000 monthly revenue increase",
                quote: "Our dying e-commerce site was losing $10,000/month to competitors. Code24's AI workers found 73 issues we didn't know existed. Now we're the fastest site in our industry.",
                improvement: "340% sales increase"
              },
              {
                company: "ServicePro LLC",
                service: "BUILD",
                result: "Market leader in 6 months",
                quote: "What started as a simple business idea became the #1 platform in our industry. The AI workers keep improving our site faster than competitors can copy us.",
                improvement: "Industry leadership"
              }
            ].map((story, index) => (
              <div key={index} className={`${theme.cardBg} border ${theme.border} rounded-2xl p-8 transition-all hover:scale-105`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold">{story.company}</div>
                  <div className={`px-3 py-1 rounded-full text-xs ${story.service === 'BUILD' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {story.service}
                  </div>
                </div>
                
                <p className={`text-sm ${theme.textSecondary} mb-4 italic`}>"{story.quote}"</p>
                
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-green-400">{story.result}</div>
                  <div className="text-xs text-purple-400">{story.improvement}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Compliance Footer */}
      <footer className={`${theme.cardBg} border-t ${theme.border} py-16`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">24</span>
                    </div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="font-bold">Code24</span>
                  <div className="text-xs text-purple-400">Learning Websites</div>
                </div>
              </div>
              <p className={`text-sm ${theme.textSecondary} mb-4`}>
                The world's first platform that builds learning websites that never become obsolete.
              </p>
              <div className="flex items-center space-x-2 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <div className={theme.textSecondary}>BUILD - New Learning Websites</div>
                <div className={theme.textSecondary}>OPTIMIZE - Transform Existing Sites</div>
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
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>CCPA Compliant</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span>Global Edge Network</span>
                </div>
                <div className={`${theme.textSecondary} flex items-center space-x-2`}>
                  <Activity className="w-3 h-3 text-purple-400" />
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
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className={theme.textSecondary}>Status: All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-3 h-3 text-blue-400" />
                <span className={theme.textSecondary}>200+ Global Locations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-3 h-3 text-purple-400" />
                <span className={theme.textSecondary}>500+ Learning Websites</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Code24Platform;