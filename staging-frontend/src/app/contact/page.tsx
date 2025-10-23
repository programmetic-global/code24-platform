'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Clock, Send, CheckCircle, ArrowRight, Zap, Users, Rocket, Shield } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    service: 'BUILD',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your form handling service
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Start a Conversation",
      description: "Get personalized advice about BUILD vs OPTIMIZE for your specific situation",
      action: "Use the form below",
      color: "blue"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Enterprise Sales",
      description: "Need multiple websites or white-label solutions? Let's discuss custom pricing.",
      action: "enterprise@code24.dev",
      color: "purple"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Technical Support",
      description: "AI Worker questions, platform issues, or integration help",
      action: "support@code24.dev",
      color: "green"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Partnership Opportunities", 
      description: "Agencies, consultants, and reseller partnership programs",
      action: "partners@code24.dev",
      color: "orange"
    }
  ];

  const faqs = [
    {
      question: "How quickly can you get my website live?",
      answer: "BUILD service: 3-8 minutes for a complete professional website. OPTIMIZE service: 5-10 minutes for comprehensive analysis and initial improvements. Both include AI Workers that continue optimizing 24/7 forever."
    },
    {
      question: "Do you really guarantee I'll beat my competition?",
      answer: "Yes, absolutely. We guarantee your website will beat your competition or we work free until it does. This isn't just confidence - it's mathematical certainty that learning websites outperform static ones."
    },
    {
      question: "What if I need help choosing BUILD vs OPTIMIZE?",
      answer: "Contact us with your website URL (if you have one) and business goals. We'll provide personalized recommendations based on your specific situation. Generally: BUILD for new sites, OPTIMIZE for existing ones."
    },
    {
      question: "Can I see examples of websites you've improved?",
      answer: "Due to competitive advantage reasons, we don't share specific customer examples publicly. However, during our consultation, we can discuss case studies relevant to your industry and situation."
    },
    {
      question: "Do you offer custom solutions for large organizations?",
      answer: "Yes! Our Enterprise plan includes unlimited AI Worker teams, multiple websites, white-label options, custom integrations, and dedicated support. Contact our enterprise team for custom pricing."
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
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">About</Link>
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
            <h1 className="text-6xl font-bold mb-6 text-gray-900">Get Your Competitive Advantage</h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Ready to build a website that beats competition every day? Let's discuss your path to digital dominance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">BUILD - New Website</h3>
              <p className="text-gray-600 mb-4">Professional website in 3-8 minutes + AI Workers forever</p>
              <div className="text-2xl font-bold text-blue-600">$149/month</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl border border-blue-200 shadow-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">OPTIMIZE - Existing Site</h3>
              <p className="text-gray-600 mb-4">Transform any website into a learning machine</p>
              <div className="text-2xl font-bold text-indigo-600">$99/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">How Can We Help You Win?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Multiple ways to get started with your AI Worker team and competitive advantage.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const colorClasses: { [key: string]: string } = {
                blue: "from-blue-50 to-blue-100 border-blue-300 text-blue-600",
                purple: "from-purple-50 to-purple-100 border-purple-300 text-purple-600",
                green: "from-green-50 to-green-100 border-green-300 text-green-600",
                orange: "from-orange-50 to-orange-100 border-orange-300 text-orange-600"
              };
              
              return (
                <div key={index} className={`bg-gradient-to-br ${colorClasses[method.color]} border-2 rounded-3xl p-8`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-white rounded-2xl ${method.color === 'blue' ? 'text-blue-600' : method.color === 'purple' ? 'text-purple-600' : method.color === 'green' ? 'text-green-600' : 'text-orange-600'}`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                      <p className="text-gray-700 mb-4 leading-relaxed">{method.description}</p>
                      <div className="font-semibold">{method.action}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Start Your Competitive Advantage</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Tell us about your goals and we'll recommend the perfect path to digital dominance.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="your@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Your company"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Website (if any)
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                  Which Service Interests You? *
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BUILD">BUILD - New Website ($149/mo)</option>
                  <option value="OPTIMIZE">OPTIMIZE - Existing Website ($99/mo)</option>
                  <option value="ENTERPRISE">ENTERPRISE - Custom Solution</option>
                  <option value="CONSULTATION">Just want to learn more</option>
                </select>
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tell Us About Your Goals *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="What are your main business goals? What challenges are you facing with your current website? What does success look like for you?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get My Competitive Advantage</span>
                <Send className="w-5 h-5" />
              </button>

              <p className="text-sm text-gray-600 text-center mt-4">
                We'll respond within 2 hours with personalized recommendations for your situation.
              </p>
            </form>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-green-600 mb-4">Message Sent Successfully!</h3>
              <p className="text-lg text-gray-700 mb-6">
                Thank you for your interest in Code24. We'll analyze your requirements and respond within 2 hours 
                with personalized recommendations for achieving your competitive advantage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#build" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                  <span>Start Building Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/pricing" className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all">
                  View All Pricing
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Questions Before You Start?</h2>
            <p className="text-xl text-gray-600">Common questions from businesses ready to dominate their competition.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-8 bg-blue-50 rounded-3xl border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Still Have Questions?</h3>
            <p className="text-gray-700 mb-6">
              Our team is here to help you understand exactly how Code24 will give you an unfair competitive advantage.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: document.querySelector('form')?.offsetTop || 0, behavior: 'smooth' })}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Ask Your Question
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Never Lose to Competition Again?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join businesses that chose to win with AI Workers. Get your competitive advantage today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#build" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Building - $149/mo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/#optimize" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Optimize Existing - $99/mo</span>
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

export default ContactPage;