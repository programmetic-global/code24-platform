/**
 * Enhanced Code24 Platform Dispatcher
 * Integrates R2 storage, Workers for Platforms, and goal-based analytics
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Handle subdomain routing for customer sites
    if (hostname.includes('.code24.dev') && hostname !== 'code24.dev') {
      return await handleCustomerSite(request, env, hostname);
    }
    
    // Main platform routes
    if (hostname === 'code24.dev' || hostname.includes('localhost')) {
      return await handleMainPlatform(request, env);
    }
    
    return new Response('Domain not configured', { status: 404 });
  },
};

async function handleCustomerSite(request, env, hostname) {
  try {
    const url = new URL(request.url);
    const subdomain = hostname.split('.')[0];
    
    // Look up the site in the database
    const site = await env.DB_MAIN.prepare(`
      SELECT * FROM sites WHERE subdomain = ? AND status = 'active'
    `).bind(subdomain).first();
    
    if (!site) {
      return createSiteNotFoundResponse(subdomain);
    }
    
    // Try to get customer worker from dispatch namespace
    try {
      const customerWorker = env.DISPATCHER.get('demo-customer');
      if (customerWorker) {
        // Forward request to customer worker
        const response = await customerWorker.fetch(request);
        
        // Track analytics for this site visit
        ctx.waitUntil(trackSiteVisit(env, site.id, request));
        
        return response;
      }
    } catch (error) {
      console.log('Customer worker not found, serving generated site');
    }
    
    // Fallback: Serve generated site from R2 or generate dynamically
    return await serveGeneratedSite(request, env, site);
    
  } catch (error) {
    console.error('Error handling customer site:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function handleMainPlatform(request, env) {
  const url = new URL(request.url);
  
  // API Routes
  if (url.pathname.startsWith('/api/')) {
    return await handlePlatformAPI(request, env, url);
  }
  
  // Site generation interface
  if (url.pathname === '/generate') {
    return serveGenerationInterface();
  }
  
  // Main landing page
  if (url.pathname === '/' || url.pathname === '/dashboard') {
    return serveMainPlatform();
  }
  
  return new Response('Page not found', { status: 404 });
}

async function handlePlatformAPI(request, env, url) {
  const path = url.pathname.replace('/api', '');
  
  switch (true) {
    case path === '/generate' && request.method === 'POST':
      return await generateNewSite(request, env);
      
    case path === '/sites' && request.method === 'GET':
      return await listUserSites(request, env);
      
    case path.startsWith('/sites/') && path.includes('/analytics'):
      return await getSiteAnalytics(request, env);
      
    case path === '/upload' && request.method === 'POST':
      return await handleFileUpload(request, env);
      
    default:
      return Response.json({ error: 'API endpoint not found' }, { status: 404 });
  }
}

async function generateNewSite(request, env) {
  try {
    const body = await request.json();
    const { description, businessType, primaryGoal, name } = body;
    
    // Generate site ID and subdomain
    const siteId = crypto.randomUUID();
    const subdomain = generateSubdomain(name);
    
    // Store in database
    await env.DB_MAIN.prepare(`
      INSERT INTO sites (id, user_id, name, subdomain, business_type, primary_goal, 
                         creation_method, original_description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      siteId, 'demo-user', name, subdomain, businessType, primaryGoal,
      'api', description, 'active'
    ).run();
    
    // Generate site content and store in R2
    const siteHTML = generateSiteHTML(name, businessType, primaryGoal, description);
    const r2Key = `sites/${siteId}/index.html`;
    
    await env.ASSETS.put(r2Key, siteHTML, {
      httpMetadata: {
        contentType: 'text/html',
        cacheControl: 'public, max-age=3600'
      }
    });
    
    // Set up default goals
    await env.DB_MAIN.prepare(`
      INSERT INTO site_goals (id, site_id, goal_type, target_value, target_period, 
                             conversion_events, is_primary, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(), siteId, primaryGoal, 1000, 'monthly',
      JSON.stringify(getConversionEvents(primaryGoal)), true, 1.0
    ).run();
    
    return Response.json({
      success: true,
      siteId,
      subdomain,
      url: `https://${subdomain}.code24.dev`,
      status: 'active'
    });
    
  } catch (error) {
    console.error('Error generating site:', error);
    return Response.json({ 
      error: 'Failed to generate site' 
    }, { status: 500 });
  }
}

async function serveGeneratedSite(request, env, site) {
  const url = new URL(request.url);
  
  // Handle analytics tracking
  if (url.pathname === '/api/track' && request.method === 'POST') {
    return await trackAnalyticsEvent(request, env, site);
  }
  
  // Try to get site content from R2
  const r2Key = `sites/${site.id}/index.html`;
  try {
    const r2Object = await env.ASSETS.get(r2Key);
    if (r2Object) {
      return new Response(await r2Object.text(), {
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }
  } catch (error) {
    console.log('R2 object not found, generating dynamically');
  }
  
  // Fallback: Generate site dynamically
  const html = generateSiteHTML(
    site.name, 
    site.business_type, 
    site.primary_goal, 
    site.original_description
  );
  
  // Track page view
  trackSiteVisit(env, site.id, request);
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

function generateSiteHTML(name, businessType, primaryGoal, description) {
  const goalText = getGoalText(primaryGoal);
  const features = getBusinessFeatures(businessType);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${name}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="${description}">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          line-height: 1.6; 
        }
        .hero { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 100px 20px; 
          text-align: center; 
        }
        .hero h1 { font-size: 3em; margin-bottom: 20px; }
        .hero p { font-size: 1.2em; margin-bottom: 30px; opacity: 0.9; }
        .btn { 
          background: #ff6b6b; 
          color: white; 
          padding: 15px 30px; 
          border: none; 
          border-radius: 25px; 
          font-size: 18px; 
          text-decoration: none; 
          display: inline-block;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
        .features { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 30px; 
        }
        .feature { 
          padding: 30px; 
          border-radius: 10px; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
          text-align: center;
        }
        .contact { 
          background: #f8f9fa; 
          padding: 60px 20px; 
          text-align: center; 
        }
        .contact form { max-width: 500px; margin: 0 auto; }
        .contact input, .contact textarea { 
          width: 100%; 
          padding: 15px; 
          margin: 10px 0; 
          border: 1px solid #ddd; 
          border-radius: 5px; 
        }
        .stats {
          background: #2c3e50;
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          max-width: 800px;
          margin: 0 auto;
        }
        .stat h3 { font-size: 2em; margin-bottom: 10px; }
        .powered-by {
          text-align: center;
          padding: 20px;
          background: #34495e;
          color: white;
        }
        .powered-by a { color: #3498db; text-decoration: none; }
      </style>
      <script>
        // Enhanced Analytics Tracking
        function trackEvent(eventType, goalType = null, value = 0) {
          const data = {
            eventType,
            eventCategory: goalType ? 'conversion' : 'engagement',
            goalType,
            conversionValue: value,
            isConversion: !!goalType,
            pageUrl: window.location.pathname,
            timestamp: Date.now(),
            visitorId: getOrCreateVisitorId(),
            sessionId: getOrCreateSessionId(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
          };
          
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }).catch(console.error);
        }
        
        function getOrCreateVisitorId() {
          let id = localStorage.getItem('autoweb_visitor_id');
          if (!id) {
            id = 'visitor_' + Math.random().toString(36).substr(2, 16);
            localStorage.setItem('autoweb_visitor_id', id);
          }
          return id;
        }
        
        function getOrCreateSessionId() {
          let id = sessionStorage.getItem('autoweb_session_id');
          if (!id) {
            id = 'session_' + Math.random().toString(36).substr(2, 16);
            sessionStorage.setItem('autoweb_session_id', id);
          }
          return id;
        }
        
        // Track page view and scroll depth
        window.addEventListener('load', () => {
          trackEvent('page_view');
          
          let maxScroll = 0;
          window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
              maxScroll = scrollPercent;
              if (maxScroll >= 75) {
                trackEvent('scroll_75_percent');
              } else if (maxScroll >= 50) {
                trackEvent('scroll_50_percent');
              }
            }
          });
        });
      </script>
    </head>
    <body>
      <div class="hero">
        <h1>${name}</h1>
        <p>${goalText}</p>
        <a href="#contact" class="btn" onclick="trackEvent('hero_cta_click', '${primaryGoal}')">
          Get Started Today
        </a>
      </div>
      
      <div class="container">
        <div class="features">
          ${features.map(feature => `
            <div class="feature">
              <h3>${feature.title}</h3>
              <p>${feature.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="stats">
        <h2>Why Choose ${name}?</h2>
        <div class="stats-grid">
          <div class="stat">
            <h3>100%</h3>
            <p>Satisfaction Guaranteed</p>
          </div>
          <div class="stat">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
          <div class="stat">
            <h3>Fast</h3>
            <p>Quick Results</p>
          </div>
        </div>
      </div>
      
      <div class="contact" id="contact">
        <h2>Get In Touch</h2>
        <form onsubmit="trackEvent('form_submit', '${primaryGoal}'); return false;">
          <input type="text" placeholder="Your Name" required>
          <input type="email" placeholder="Your Email" required>
          <input type="tel" placeholder="Your Phone">
          <textarea placeholder="Tell us about your needs..." rows="4" required></textarea>
          <button type="submit" class="btn">Send Message</button>
        </form>
      </div>
      
      <div class="powered-by">
        <p>Powered by <a href="https://code24.dev">Code24 Platform</a> - AI-generated and continuously optimized</p>
      </div>
    </body>
    </html>
  `;
}

// Helper functions
function generateSubdomain(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30) + '-' + Math.random().toString(36).substr(2, 6);
}

function getGoalText(primaryGoal) {
  const goals = {
    sales: "Boost your revenue with our proven solutions",
    leads: "Generate high-quality leads for your business", 
    signups: "Join thousands of satisfied customers",
    bookings: "Book your appointment with ease",
    traffic: "Discover valuable content and insights",
    awareness: "Learn about our mission and values"
  };
  return goals[primaryGoal] || "Welcome to our professional services";
}

function getBusinessFeatures(businessType) {
  const features = {
    ecommerce: [
      { title: "🛍️ Premium Products", description: "Carefully curated selection of high-quality items" },
      { title: "🔒 Secure Checkout", description: "Safe and encrypted payment processing" },
      { title: "🚚 Fast Shipping", description: "Quick delivery to your doorstep" }
    ],
    lead_gen: [
      { title: "💼 Expert Consultation", description: "Professional advice tailored to your needs" },
      { title: "📈 Proven Results", description: "Track record of successful client outcomes" },
      { title: "🆓 Free Assessment", description: "Complimentary evaluation of your situation" }
    ],
    saas: [
      { title: "⚡ Powerful Features", description: "Everything you need to streamline your workflow" },
      { title: "🔗 Easy Integration", description: "Seamlessly connects with your existing tools" },
      { title: "🛟 24/7 Support", description: "Round-the-clock assistance when you need it" }
    ],
    service: [
      { title: "🏆 Professional Service", description: "High-quality workmanship you can trust" },
      { title: "💰 Competitive Pricing", description: "Fair rates for exceptional value" },
      { title: "✅ Satisfaction Guaranteed", description: "We stand behind our work" }
    ]
  };
  return features[businessType] || features.service;
}

function getConversionEvents(primaryGoal) {
  const events = {
    sales: ['purchase', 'add_to_cart', 'checkout_complete'],
    leads: ['form_submit', 'contact_request', 'phone_click'],
    signups: ['user_registration', 'trial_signup', 'newsletter_signup'],
    bookings: ['appointment_request', 'calendar_booking', 'consultation_request'],
    traffic: ['page_view', 'content_engagement', 'social_share']
  };
  return events[primaryGoal] || events.leads;
}

async function trackSiteVisit(env, siteId, request) {
  try {
    const userAgent = request.headers.get('User-Agent') || '';
    const referer = request.headers.get('Referer') || '';
    
    await env.DB_MAIN.prepare(`
      INSERT INTO metrics_events (
        id, site_id, event_type, event_category, page_url, 
        user_agent, referrer, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(), siteId, 'page_view', 'engagement', 
      request.url, userAgent, referer, new Date().toISOString()
    ).run();
    
  } catch (error) {
    console.error('Error tracking site visit:', error);
  }
}

async function trackAnalyticsEvent(request, env, site) {
  try {
    const data = await request.json();
    
    await env.DB_MAIN.prepare(`
      INSERT INTO metrics_events (
        id, site_id, event_type, event_category, goal_type, 
        conversion_value, is_conversion, visitor_id, session_id,
        page_url, event_data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(), site.id, data.eventType, data.eventCategory,
      data.goalType, data.conversionValue || 0, data.isConversion || false,
      data.visitorId, data.sessionId, data.pageUrl,
      JSON.stringify(data), new Date().toISOString()
    ).run();
    
    return Response.json({ success: true });
    
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return Response.json({ error: 'Tracking failed' }, { status: 500 });
  }
}

function createSiteNotFoundResponse(subdomain) {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Site Not Found - Code24</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .container { text-align: center; max-width: 500px; padding: 40px; }
        .logo { font-size: 48px; margin-bottom: 20px; }
        h1 { font-size: 32px; margin-bottom: 20px; }
        p { font-size: 18px; margin-bottom: 30px; opacity: 0.9; }
        .btn { 
          background: #ff6b6b; 
          color: white; 
          padding: 15px 30px; 
          border: none; 
          border-radius: 25px; 
          font-size: 18px; 
          text-decoration: none; 
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🚀</div>
        <h1>Site Not Found</h1>
        <p>The site "${subdomain}" could not be found or is not active.</p>
        <a href="https://code24.dev" class="btn">Create Your Own Site</a>
      </div>
    </body>
    </html>
  `, { 
    status: 404,
    headers: { 'Content-Type': 'text/html' }
  });
}

function serveMainPlatform() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Code24 Platform - From Idea to Self-Optimizing Website in 60 Seconds</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 60px 0; }
        .logo { font-size: 48px; font-weight: bold; margin-bottom: 20px; }
        .tagline { font-size: 24px; margin-bottom: 40px; opacity: 0.9; }
        .btn { 
          background: #ff6b6b; 
          color: white; 
          padding: 15px 30px; 
          border: none; 
          border-radius: 25px; 
          font-size: 18px; 
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .features { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 30px; 
          margin: 60px 0; 
        }
        .feature { 
          background: rgba(255,255,255,0.1); 
          padding: 30px; 
          border-radius: 15px; 
          backdrop-filter: blur(10px);
        }
        .demo { 
          background: rgba(255,255,255,0.1); 
          padding: 40px; 
          border-radius: 15px; 
          margin: 40px 0;
          text-align: center;
        }
        .demo h3 { margin-bottom: 20px; }
        .demo-links a {
          display: inline-block;
          margin: 10px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.2);
          color: white;
          text-decoration: none;
          border-radius: 20px;
          transition: background 0.2s;
        }
        .demo-links a:hover {
          background: rgba(255,255,255,0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 Code24</div>
          <div class="tagline">From Idea to Self-Optimizing Website in 60 Seconds</div>
          <a href="/generate" class="btn">🎤 Build My Website Now</a>
        </div>
        
        <div class="demo">
          <h3>🌟 Live Demo Sites</h3>
          <p>Check out these automatically generated and optimized customer sites:</p>
          <div class="demo-links">
            <a href="https://sweetdreams.code24.dev" target="_blank">Sweet Dreams Bakery</a>
            <a href="https://demo-customer.code24.dev" target="_blank">Demo Customer Site</a>
          </div>
        </div>
        
        <div class="features">
          <div class="feature">
            <h3>🎤 Voice to Website</h3>
            <p>Just speak your business idea and watch AI build your professional website in real-time. No coding, no templates to choose from.</p>
          </div>
          <div class="feature">
            <h3>🎯 Goal-Based Optimization</h3>
            <p>AI automatically optimizes for your specific goals: sales, leads, signups, or traffic. Continuous improvement based on real data.</p>
          </div>
          <div class="feature">
            <h3>📊 Smart Analytics</h3>
            <p>Track what matters for your business type. E-commerce gets sales metrics, lead-gen gets form conversions, SaaS gets trial signups.</p>
          </div>
          <div class="feature">
            <h3>☁️ Powered by Cloudflare</h3>
            <p>Built on Workers for Platforms with R2 storage, D1 databases, and AI integration for enterprise-grade performance.</p>
          </div>
          <div class="feature">
            <h3>🔄 Self-Improving</h3>
            <p>AI runs A/B tests, monitors competitors, and automatically improves your site's performance while you sleep.</p>
          </div>
          <div class="feature">
            <h3>🚀 Deploy Instantly</h3>
            <p>One-click deployment to your custom domain with SSL, CDN, and enterprise-grade infrastructure included.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

function serveGenerationInterface() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Generate Your Website - Code24</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          padding: 20px;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 0; }
        .header { text-align: center; margin-bottom: 40px; }
        .form-container { 
          background: rgba(255,255,255,0.1); 
          padding: 40px; 
          border-radius: 15px; 
          backdrop-filter: blur(10px);
        }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: bold; }
        input, select, textarea { 
          width: 100%; 
          padding: 15px; 
          border: none; 
          border-radius: 8px; 
          font-size: 16px;
        }
        .btn { 
          background: #ff6b6b; 
          color: white; 
          padding: 15px 30px; 
          border: none; 
          border-radius: 25px; 
          font-size: 18px; 
          cursor: pointer;
          width: 100%;
          margin-top: 20px;
        }
        .btn:hover { background: #ff5252; }
        .result { 
          margin-top: 30px; 
          padding: 20px; 
          background: rgba(255,255,255,0.1); 
          border-radius: 10px; 
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Generate Your Website</h1>
          <p>Describe your business and watch AI build your website in 60 seconds</p>
        </div>
        
        <div class="form-container">
          <form id="generateForm">
            <div class="form-group">
              <label for="name">Business Name</label>
              <input type="text" id="name" name="name" placeholder="e.g., Sweet Dreams Bakery" required>
            </div>
            
            <div class="form-group">
              <label for="businessType">Business Type</label>
              <select id="businessType" name="businessType" required>
                <option value="">Select your business type</option>
                <option value="ecommerce">E-commerce Store</option>
                <option value="lead_gen">Lead Generation</option>
                <option value="saas">SaaS/Software</option>
                <option value="service">Service Business</option>
                <option value="content">Content/Blog</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="primaryGoal">Primary Goal</label>
              <select id="primaryGoal" name="primaryGoal" required>
                <option value="">What's your main goal?</option>
                <option value="sales">Generate Sales</option>
                <option value="leads">Capture Leads</option>
                <option value="signups">Get Signups</option>
                <option value="bookings">Book Appointments</option>
                <option value="traffic">Drive Traffic</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="description">Business Description</label>
              <textarea id="description" name="description" rows="4" 
                placeholder="Tell us about your business, what you offer, and who your customers are..." required></textarea>
            </div>
            
            <button type="submit" class="btn">🎯 Generate My Website</button>
          </form>
          
          <div id="result" class="result">
            <h3>🎉 Website Generated Successfully!</h3>
            <p id="resultText"></p>
            <a id="siteLink" href="#" target="_blank" class="btn" style="display: inline-block; margin-top: 20px;">
              🌍 View Your Website
            </a>
          </div>
        </div>
      </div>
      
      <script>
        document.getElementById('generateForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          
          const submitBtn = e.target.querySelector('button');
          submitBtn.textContent = '🚀 Generating...';
          submitBtn.disabled = true;
          
          try {
            const response = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
              document.getElementById('resultText').textContent = 
                \`Your website "\${data.name}" is now live at \${result.url}\`;
              document.getElementById('siteLink').href = result.url;
              document.getElementById('result').style.display = 'block';
            } else {
              alert('Error generating website: ' + (result.error || 'Unknown error'));
            }
          } catch (error) {
            alert('Error: ' + error.message);
          }
          
          submitBtn.textContent = '🎯 Generate My Website';
          submitBtn.disabled = false;
        });
      </script>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}