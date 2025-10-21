'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Server, AlertCircle } from 'lucide-react';

const PrivacyPage = () => {
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
              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Shield className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              How we protect your data while your AI Workers learn and optimize your competitive advantage.
            </p>
            <div className="text-sm text-gray-500 mt-4">Last updated: December 21, 2024</div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Quick Summary */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center space-x-2">
              <Eye className="w-6 h-6" />
              <span>Privacy Quick Summary</span>
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>We don't sell your data.</strong> Your business data stays yours.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>AI Workers learn responsibly.</strong> Data is used only to improve your website performance.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Enterprise-grade security.</strong> SOC 2 compliant with encryption and isolation.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>You control your data.</strong> Request exports or deletion anytime.</span>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Code24.dev ("we," "our," or "us") operates revolutionary AI Worker teams that continuously learn and optimize websites for competitive advantage. This Privacy Policy explains how we collect, use, protect, and handle your information when you use our BUILD and OPTIMIZE services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your trust is fundamental to our mission of making your website beat competition every day. We're committed to protecting your privacy while enabling AI Workers to deliver the competitive advantages you expect.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3 text-gray-900">
                <Server className="w-8 h-8 text-blue-600" />
                <span>Information We Collect</span>
              </h2>
              
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Name, email address, and company information you provide</li>
                <li>Billing information and payment details (processed securely by our payment providers)</li>
                <li>Account preferences and service selections (BUILD vs OPTIMIZE)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Website Data for AI Workers</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Visitor Analytics:</strong> Anonymous visitor behavior, traffic patterns, conversion metrics</li>
                <li><strong>Performance Data:</strong> Page load times, user interactions, technical metrics</li>
                <li><strong>Content Data:</strong> Website text, images, and structure for optimization purposes</li>
                <li><strong>Competitive Intelligence:</strong> Public information about competitors for strategic positioning</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">AI Worker Learning Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>A/B test results and performance experiments</li>
                <li>Optimization recommendations and implementation results</li>
                <li>Industry trends and cross-site performance patterns (anonymized)</li>
                <li>Multi-LLM model performance and selection data</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">How We Use Your Information</h2>
              
              <h3 className="text-xl font-semibold mb-4">Core Service Delivery</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Deploy and manage your 7 AI Workers (Learner, Tester, Optimizer, Designer, Analyst, Conversion, SEO)</li>
                <li>Continuously optimize your website for competitive advantage</li>
                <li>Provide real-time performance monitoring and improvement recommendations</li>
                <li>Generate competitive intelligence reports and market insights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">AI Worker Training & Improvement</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Train AI models to better understand your industry and audience</li>
                <li>Improve Multi-LLM orchestration for optimal task performance</li>
                <li>Enhance competitive analysis algorithms across our network</li>
                <li>Develop better optimization strategies through anonymized pattern analysis</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Platform Operations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Account management and billing</li>
                <li>Customer support and technical assistance</li>
                <li>Platform security and fraud prevention</li>
                <li>Service improvements and new feature development</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Data Sharing & Third Parties</h2>
              
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>We DO NOT Sell Your Data</span>
                </h3>
                <p className="text-gray-700">
                  We never sell, rent, or trade your personal information or business data to third parties for marketing purposes.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4">Limited Sharing for Service Delivery</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>AI Model Providers:</strong> Anthropic (Claude) and OpenAI (GPT-4o) for Multi-LLM orchestration</li>
                <li><strong>Infrastructure Providers:</strong> Enterprise infrastructure for global edge deployment and security</li>
                <li><strong>Payment Processors:</strong> Stripe for secure billing (they never see your website data)</li>
                <li><strong>Analytics Services:</strong> Minimal, privacy-focused analytics for platform improvement</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Legal Requirements</h3>
              <p className="text-gray-700 mb-6">
                We may disclose information when required by law, to protect our rights, or to ensure platform security. We'll notify you unless legally prohibited.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3 text-gray-900">
                <Lock className="w-8 h-8 text-blue-600" />
                <span>Data Security & Protection</span>
              </h2>
              
              <h3 className="text-xl font-semibold mb-4">Enterprise-Grade Security</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>SOC 2 Compliance:</strong> Audited security controls and procedures</li>
                <li><strong>Encryption:</strong> Data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li><strong>Isolation:</strong> Customer data stored in isolated, secure environments</li>
                <li><strong>Access Controls:</strong> Strict employee access controls with audit logging</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Global Edge Infrastructure</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Data protected by enterprise-grade security suite</li>
                <li>DDoS protection and advanced threat detection</li>
                <li>Global edge deployment with 99.9% uptime SLA</li>
                <li>Regular security audits and compliance certifications</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Your Privacy Rights</h2>
              
              <h3 className="text-xl font-semibold mb-4">Data Control</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Access:</strong> Request copies of your personal and business data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Export your data in standard formats</li>
                <li><strong>Restriction:</strong> Limit how we process certain data types</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">AI Worker Controls</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Pause or resume individual AI Workers</li>
                <li>Control which data sources AI Workers can access</li>
                <li>Review and approve optimization recommendations before implementation</li>
                <li>Access detailed logs of AI Worker activities and decisions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">GDPR & CCPA Compliance</h3>
              <p className="text-gray-700 mb-6">
                We comply with GDPR, CCPA, and other privacy regulations. If you're in the EU or California, you have additional rights including the right to opt-out of certain data processing activities.
              </p>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Cookies & Tracking</h2>
              
              <h3 className="text-xl font-semibold mb-4">Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                We use essential cookies for account authentication, security, and basic platform functionality. These cannot be disabled.
              </p>

              <h3 className="text-xl font-semibold mb-4">Analytics Cookies</h3>
              <p className="text-gray-700 mb-4">
                We use privacy-focused analytics to understand platform usage and improve our services. You can opt-out of analytics cookies in your account settings.
              </p>

              <h3 className="text-xl font-semibold mb-4">AI Worker Learning</h3>
              <p className="text-gray-700 mb-6">
                Your AI Workers use cookies and tracking on YOUR website to learn visitor behavior and optimize performance. This data stays within your isolated environment and is used only for your competitive advantage.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Data Retention</h2>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Account Data:</strong> Retained while your account is active, deleted within 30 days of account closure</li>
                <li><strong>Website Optimization Data:</strong> Retained for continuous learning, anonymized after account closure</li>
                <li><strong>Billing Records:</strong> Retained for 7 years for legal and tax requirements</li>
                <li><strong>AI Model Training Data:</strong> Anonymized patterns may be retained to improve our platform</li>
              </ul>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">International Data Transfers</h2>
              
              <p className="text-gray-700 mb-4">
                Code24 operates globally through enterprise edge network. Your data may be processed in multiple countries, but always with the same high level of protection.
              </p>
              
              <h3 className="text-xl font-semibold mb-4">Transfer Safeguards</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
                <li>Adequacy decisions where available</li>
                <li>Global enterprise compliance certifications</li>
                <li>Encryption in transit for all international data movement</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Children's Privacy</h2>
              
              <p className="text-gray-700 mb-6">
                Code24 is a business platform not intended for children under 13. We don't knowingly collect personal information from children under 13. If you believe we've inadvertently collected such information, contact us immediately.
              </p>
            </div>

            {/* Updates */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Policy Updates</h2>
              
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy to reflect service improvements or legal requirements. Material changes will be communicated via:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Email notification to your account email address</li>
                <li>Notice in your Code24 dashboard</li>
                <li>Update on our website with the new effective date</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h2>
              
              <p className="text-gray-700 mb-4">
                Questions about this Privacy Policy or how we handle your data? We're here to help:
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="space-y-3">
                  <div><strong>Privacy Officer:</strong> privacy@code24.dev</div>
                  <div><strong>General Support:</strong> support@code24.dev</div>
                  <div><strong>Data Requests:</strong> data-requests@code24.dev</div>
                  <div><strong>Mail:</strong> Code24.dev Privacy Team, [Address]</div>
                </div>
              </div>

              <p className="text-gray-700 mt-6">
                We respond to privacy inquiries within 48 hours and data requests within 30 days.
              </p>
            </div>

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
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">SOC 2 Compliant</div>
                <div className="text-gray-600">GDPR Compliant</div>
                <div className="text-gray-600">CCPA Compliant</div>
                <div className="text-gray-600">Enterprise Security</div>
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

export default PrivacyPage;