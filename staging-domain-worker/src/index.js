// Worker to route staging.code24.dev to the latest Pages deployment
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Route to the latest Pages deployment with our updated platform
    const pagesUrl = 'https://15f00f6a.code24-staging-frontend.pages.dev';
    const targetUrl = new URL(url.pathname + url.search, pagesUrl);
    
    // Fetch from Pages
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    // Clone response and force fresh content
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${Date.now()}"`,
        'X-Content-Fresh': 'true'
      }
    });
    
    return modifiedResponse;
  }
};