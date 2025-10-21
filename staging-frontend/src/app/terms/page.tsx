'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, Shield, Zap } from 'lucide-react';

const TermsPage = () => {
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
              <FileText className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              The agreement that governs your use of Code24's revolutionary AI Worker platform.
            </p>
            <div className="text-sm text-gray-500 mt-4">Last updated: December 21, 2024</div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Key Points */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Key Points</span>
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Performance Guarantee:</strong> We guarantee your website will beat competition or work free until it does.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>AI Worker Rights:</strong> You own your data and control your AI Worker team's activities.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Fair Usage:</strong> Use our platform ethically and legally for legitimate business purposes.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Cancel Anytime:</strong> No long-term contracts, but remember - canceling stops your competitive advantage.</span>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("Customer," "you," or "your") and Code24.dev ("Code24," "we," "us," or "our") regarding your use of our revolutionary AI Worker platform.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using Code24's services, including our BUILD and OPTIMIZE offerings, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use our services.
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Important Notice</span>
                </h3>
                <p className="text-gray-700">
                  Code24 provides AI-powered website optimization services. Our AI Workers continuously learn and make improvements to ensure your website beats competition. Understanding this automated nature is crucial to using our platform effectively.
                </p>
              </div>
            </div>

            {/* Service Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">2. Service Description</h2>
              
              <h3 className="text-xl font-semibold mb-4">BUILD Service</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Professional website creation in 3-8 minutes using AI Worker teams</li>
                <li>7 specialized AI Workers (Learner, Tester, Optimizer, Designer, Analyst, Conversion, SEO)</li>
                <li>Continuous learning and optimization to maintain competitive advantage</li>
                <li>Multi-LLM orchestration using Anthropic Claude and OpenAI GPT-4o</li>
                <li>Competitive intelligence monitoring and automatic adaptation</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">OPTIMIZE Service</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Comprehensive 197+ point analysis of existing websites</li>
                <li>Same 7 AI Workers applied to transform existing sites into learning machines</li>
                <li>Gradual optimization while preserving existing functionality</li>
                <li>Integration with existing domains and hosting arrangements</li>
                <li>Performance tracking and competitive positioning improvements</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Enterprise Service</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Custom AI Worker configurations for large organizations</li>
                <li>Multiple website management and white-label solutions</li>
                <li>Advanced integrations and custom development</li>
                <li>Dedicated support and service level agreements</li>
              </ul>
            </div>

            {/* Performance Guarantee */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3 text-gray-900">
                <Shield className="w-8 h-8 text-green-600" />
                <span>3. Performance Guarantee</span>
              </h2>
              
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-600 mb-3">Our Promise to You</h3>
                <p className="text-gray-700 mb-3">
                  <strong>We guarantee your website will beat your competition or we work free until it does.</strong>
                </p>
                <p className="text-gray-700">
                  This guarantee is based on the mathematical certainty that learning systems outperform static systems over time.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4">Guarantee Terms</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Measurement Period:</strong> 90 days minimum for meaningful competitive analysis</li>
                <li><strong>Competitive Metrics:</strong> Conversion rates, engagement metrics, search rankings, and revenue performance</li>
                <li><strong>Baseline Establishment:</strong> We establish competitive benchmarks within the first 30 days</li>
                <li><strong>Remedy:</strong> If you don't achieve competitive superiority, we continue working at no charge until you do</li>
                <li><strong>Good Faith Cooperation:</strong> Requires your cooperation in implementing AI Worker recommendations</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Guarantee Limitations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Does not apply to illegal, unethical, or restricted business types</li>
                <li>Requires accurate competitor identification and access to performance data</li>
                <li>External factors beyond website control (economic conditions, force majeure) may affect timeline</li>
                <li>Customer must maintain active service during guarantee period</li>
              </ul>
            </div>

            {/* User Responsibilities */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">4. User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold mb-4">Account Management</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Provide accurate account information and keep it updated</li>
                <li>Maintain security of your account credentials</li>
                <li>Notify us immediately of any unauthorized account access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Content and Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Ensure you have rights to all content provided to AI Workers</li>
                <li>Comply with applicable laws regarding data collection and privacy</li>
                <li>Not provide illegal, infringing, or harmful content</li>
                <li>Maintain appropriate privacy policies for your website visitors</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Fair Usage</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Use services for legitimate business purposes only</li>
                <li>Not attempt to reverse engineer or interfere with AI Worker operations</li>
                <li>Not use services to harm competitors beyond normal competitive activity</li>
                <li>Cooperate with reasonable AI Worker recommendations for optimal results</li>
              </ul>
            </div>

            {/* Payment Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">5. Payment Terms</h2>
              
              <h3 className="text-xl font-semibold mb-4">Billing</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>BUILD Service:</strong> $99 per month, billed monthly in advance</li>
                <li><strong>OPTIMIZE Service:</strong> $149 per month, billed monthly in advance</li>
                <li><strong>Enterprise Service:</strong> Custom pricing based on requirements</li>
                <li>All prices exclude applicable taxes, which are customer's responsibility</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Payment Processing</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Payments processed securely through Stripe</li>
                <li>Credit card or bank transfer accepted</li>
                <li>Auto-renewal unless canceled before next billing cycle</li>
                <li>No refunds for partial months, but service continues until end of paid period</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Late Payment</h3>
              <p className="text-gray-700 mb-6">
                Failed payments may result in service suspension after 7 days. AI Workers will pause optimization until payment is resolved. Service resumes immediately upon successful payment.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">6. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold mb-4">Your Content Rights</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>You retain all rights to your original content and data</li>
                <li>You grant us license to use your content for service delivery</li>
                <li>AI Worker improvements to your content become your property</li>
                <li>You can request content export or deletion at any time</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Code24 Platform Rights</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Code24 owns all platform technology, AI Workers, and algorithms</li>
                <li>Multi-LLM orchestration system is proprietary to Code24</li>
                <li>Competitive intelligence methodologies are trade secrets</li>
                <li>You receive a limited license to use platform features during subscription</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">AI-Generated Content</h3>
              <p className="text-gray-700 mb-6">
                Content created by AI Workers (copy, designs, optimizations) for your website becomes your property. However, the underlying AI models and training used to create such content remain Code24's intellectual property.
              </p>
            </div>

            {/* Privacy and Data */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">7. Privacy and Data Handling</h2>
              
              <p className="text-gray-700 mb-4">
                Your privacy is fundamental to our service. Our comprehensive <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">Privacy Policy</Link> details how we collect, use, and protect your data.
              </p>

              <h3 className="text-xl font-semibold mb-4">Data Usage for AI Workers</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>AI Workers analyze your website data to provide competitive advantages</li>
                <li>Anonymous usage patterns may improve platform-wide AI performance</li>
                <li>Your specific business data is never shared with competitors</li>
                <li>You maintain control over what data AI Workers can access</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Competitive Intelligence</h3>
              <p className="text-gray-700 mb-6">
                Our AI Workers monitor publicly available information about competitors to inform optimization strategies. This analysis helps position your website for maximum competitive advantage while respecting intellectual property and privacy rights.
              </p>
            </div>

            {/* Service Availability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">8. Service Availability</h2>
              
              <h3 className="text-xl font-semibold mb-4">Uptime Commitment</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Target Uptime:</strong> 99.9% availability</li>
                <li><strong>Infrastructure:</strong> Built on enterprise-grade global edge network</li>
                <li><strong>Monitoring:</strong> 24/7 automated monitoring and alerting</li>
                <li><strong>Maintenance:</strong> Scheduled maintenance with advance notice</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">AI Worker Availability</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>AI Workers operate continuously, even during platform maintenance</li>
                <li>Individual AI Workers may be temporarily paused for updates</li>
                <li>Customer notification for any AI Worker service interruptions</li>
                <li>Automatic resumption of all AI Worker activities post-maintenance</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Force Majeure</h3>
              <p className="text-gray-700 mb-6">
                We're not liable for service interruptions due to circumstances beyond our reasonable control, including natural disasters, government actions, or third-party infrastructure failures.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">9. Termination</h2>
              
              <h3 className="text-xl font-semibold mb-4">Customer Termination</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Cancel anytime through your account dashboard</li>
                <li>Service continues until end of current billing period</li>
                <li>AI Workers stop optimization activities upon cancellation</li>
                <li>Data export available for 30 days post-cancellation</li>
              </ul>

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Important: Competitive Risk</span>
                </h3>
                <p className="text-gray-700">
                  Canceling Code24 means your website stops learning and improving while competitors with learning websites continue advancing. This puts you at increasing competitive disadvantage over time.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4">Code24 Termination</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>We may terminate for material breach after 30-day cure period</li>
                <li>Immediate termination for illegal activities or platform abuse</li>
                <li>Refund of prepaid amounts for Code24-initiated termination</li>
                <li>Data export assistance provided in good faith terminations</li>
              </ul>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">10. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-semibold mb-4">Service Disclaimers</h3>
              <p className="text-gray-700 mb-4">
                While we guarantee competitive advantage, specific business outcomes depend on many factors beyond website performance. AI Workers optimize based on available data and market conditions, but cannot guarantee specific revenue targets or business success metrics.
              </p>

              <h3 className="text-xl font-semibold mb-4">AI Technology Limitations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>AI recommendations require human judgment for implementation</li>
                <li>Market conditions and competitive actions may affect results</li>
                <li>Learning algorithms improve over time but start with baseline performance</li>
                <li>Some optimizations may take time to show measurable results</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Limitation of Liability</h3>
              <p className="text-gray-700 mb-6">
                Our liability is limited to the amount you paid for services in the 12 months preceding any claim. We're not liable for indirect, incidental, or consequential damages, including lost profits or business opportunities.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">11. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold mb-4">Good Faith Resolution</h3>
              <p className="text-gray-700 mb-4">
                We're committed to resolving any issues quickly and fairly. Most concerns can be addressed through our support team at support@code24.dev.
              </p>

              <h3 className="text-xl font-semibold mb-4">Formal Disputes</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Formal disputes subject to binding arbitration</li>
                <li>Arbitration conducted under American Arbitration Association rules</li>
                <li>Individual claims only - no class action waiver</li>
                <li>Arbitration location: [Jurisdiction to be specified]</li>
              </ul>
            </div>

            {/* General Provisions */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">12. General Provisions</h2>
              
              <h3 className="text-xl font-semibold mb-4">Governing Law</h3>
              <p className="text-gray-700 mb-4">
                These Terms are governed by [Jurisdiction] law, without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold mb-4">Updates to Terms</h3>
              <p className="text-gray-700 mb-4">
                We may update these Terms to reflect service improvements or legal requirements. Material changes will be communicated 30 days in advance via email and dashboard notification.
              </p>

              <h3 className="text-xl font-semibold mb-4">Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found unenforceable, the remaining provisions continue in full force and effect.
              </p>

              <h3 className="text-xl font-semibold mb-4">Entire Agreement</h3>
              <p className="text-gray-700 mb-6">
                These Terms, together with our Privacy Policy, constitute the complete agreement between you and Code24 regarding the use of our services.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">13. Contact Information</h2>
              
              <p className="text-gray-700 mb-4">
                Questions about these Terms or need assistance with our services?
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="space-y-3">
                  <div><strong>Legal Questions:</strong> legal@code24.dev</div>
                  <div><strong>Service Support:</strong> support@code24.dev</div>
                  <div><strong>Billing Issues:</strong> billing@code24.dev</div>
                  <div><strong>General Inquiries:</strong> hello@code24.dev</div>
                </div>
              </div>

              <p className="text-gray-700 mt-6">
                We respond to all inquiries within 24 hours.
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
                <div className="text-gray-600">Performance Guarantee</div>
                <div className="text-gray-600">SOC 2 Compliant</div>
                <div className="text-gray-600">Enterprise Security</div>
                <div className="text-gray-600">Fair Usage Policy</div>
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

export default TermsPage;