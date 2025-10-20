// Worker to route staging.code24.dev to the latest Pages deployment
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Route to the latest Pages deployment with our updated platform
    const pagesUrl = 'https://caf588d9.code24-staging-frontend.pages.dev';
    const targetUrl = new URL(url.pathname + url.search, pagesUrl);
    
    // Fetch from Pages
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    // Clone response and add cache headers
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    return modifiedResponse;
  }
};