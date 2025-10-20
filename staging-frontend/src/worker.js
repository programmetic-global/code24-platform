// Worker to route staging.code24.dev to the Pages deployment
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // If this is staging.code24.dev, route to the Pages deployment
    if (url.hostname === 'staging.code24.dev') {
      // Get the latest Pages deployment URL
      const pagesUrl = 'https://code24-staging-frontend.pages.dev';
      const targetUrl = new URL(url.pathname + url.search, pagesUrl);
      
      // Fetch from Pages and return
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // Clone response and modify headers if needed
      const modifiedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      return modifiedResponse;
    }
    
    // For other domains, return a redirect to staging
    return Response.redirect('https://staging.code24.dev' + url.pathname, 301);
  }
};