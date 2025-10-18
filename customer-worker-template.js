/**
 * Code24 Customer Worker Template
 * Deployed via Workers for Platforms to customer subdomains
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Extract customer subdomain
    const subdomain = hostname.split('.')[0];
    
    // Get customer site configuration
    const siteConfig = await getSiteConfig(subdomain);
    
    if (!siteConfig) {
      return new Response('Site not found', { status: 404 });
    }
    
    // Serve customer site with analytics tracking
    return serveSiteWithAnalytics(request, siteConfig);
  }
};

async function getSiteConfig(subdomain) {
  // In production, this would fetch from the main platform's API
  // For demo, return a basic configuration
  return {
    name: `${subdomain} Demo Site`,
    businessType: 'service',
    primaryGoal: 'leads',
    theme: 'modern',
    analytics: {
      enabled: true,
      goalTracking: ['form_submit', 'phone_click', 'email_click']
    }
  };
}

async function serveSiteWithAnalytics(request, config) {
  const url = new URL(request.url);
  
  // Handle analytics tracking
  if (url.pathname === '/api/track' && request.method === 'POST') {
    return handleAnalytics(request, config);
  }
  
  // Serve the main site
  const html = generateSiteHTML(config);
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

function generateSiteHTML(config) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${config.name}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
          line-height: 1.6; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .hero { text-align: center; padding: 80px 0; }
        .hero h1 { font-size: 48px; margin-bottom: 20px; }
        .hero p { font-size: 20px; margin-bottom: 30px; opacity: 0.9; }
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
        .contact { 
          background: rgba(255,255,255,0.1); 
          padding: 40px; 
          border-radius: 15px; 
          margin: 40px 0;
          backdrop-filter: blur(10px);
        }
        .contact input, .contact textarea { 
          width: 100%; 
          padding: 15px; 
          margin: 10px 0; 
          border: none; 
          border-radius: 8px; 
          background: rgba(255,255,255,0.9);
        }
        .powered-by {
          text-align: center;
          padding: 20px;
          opacity: 0.7;
          font-size: 14px;
        }
        .powered-by a { color: #fff; text-decoration: none; }
      </style>
      <script>
        // Analytics tracking
        function track(event, goal = null) {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: event,
              goal: goal,
              timestamp: Date.now(),
              url: window.location.href,
              referrer: document.referrer
            })
          }).catch(console.error);
        }
        
        // Track page view
        window.addEventListener('load', () => track('page_view'));
      </script>
    </head>
    <body>
      <div class="container">
        <div class="hero">
          <h1>${config.name}</h1>
          <p>Professional ${config.businessType} solutions tailored for your success</p>
          <button class="btn" onclick="track('cta_click', '${config.primaryGoal}'); document.getElementById('contact').scrollIntoView();">
            Get Started Today
          </button>
        </div>
        
        <div class="features">
          <div class="feature">
            <h3>🎯 Goal-Oriented Results</h3>
            <p>We focus on delivering measurable outcomes that align with your business objectives and drive real growth.</p>
          </div>
          <div class="feature">
            <h3>📊 Data-Driven Approach</h3>
            <p>Every decision is backed by analytics and insights to ensure optimal performance and continuous improvement.</p>
          </div>
          <div class="feature">
            <h3>🚀 Rapid Implementation</h3>
            <p>Quick deployment and fast results without compromising on quality or attention to detail.</p>
          </div>
        </div>
        
        <div class="contact" id="contact">
          <h2>Contact Us</h2>
          <form onsubmit="track('form_submit', '${config.primaryGoal}'); return false;">
            <input type="text" placeholder="Your Name" required>
            <input type="email" placeholder="Your Email" required>
            <input type="tel" placeholder="Your Phone" required>
            <textarea placeholder="Tell us about your project..." rows="4" required></textarea>
            <button type="submit" class="btn">Send Message</button>
          </form>
        </div>
        
        <div class="powered-by">
          <p>Powered by <a href="https://code24.dev">Code24 Platform</a> - Goal-based website optimization</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function handleAnalytics(request, config) {
  try {
    const data = await request.json();
    
    // Log analytics event
    console.log('Analytics Event:', {
      site: config.name,
      event: data.event,
      goal: data.goal,
      timestamp: data.timestamp
    });
    
    // In production, this would send to analytics database
    return Response.json({ 
      success: true, 
      tracked: data.event 
    });
    
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: 'Invalid request' 
    }, { status: 400 });
  }
}