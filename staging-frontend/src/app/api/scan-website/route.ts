import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, includeCRO = true, businessType, industryType } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Perform technical analysis
    const technicalAnalysis = await analyzeWebsite(url);
    
    let croAnalysis = null;
    if (includeCRO) {
      try {
        // Perform Deep CRO Audit in parallel
        const croResponse = await fetch(`${request.nextUrl.origin}/api/cro-audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, businessType, industryType })
        });
        
        if (croResponse.ok) {
          croAnalysis = await croResponse.json();
        }
      } catch (croError) {
        console.error('CRO audit failed:', croError);
        // Continue with technical analysis only
      }
    }

    // Combine results
    const combinedResults = {
      ...technicalAnalysis,
      croInsights: croAnalysis,
      enhancedScore: croAnalysis ? 
        Math.round((technicalAnalysis.score + croAnalysis.overallCROScore) / 2) : 
        technicalAnalysis.score,
      totalOpportunities: technicalAnalysis.issues.length + 
        (croAnalysis ? croAnalysis.quickWins.length + croAnalysis.strategicOpportunities.length : 0)
    };
    
    return NextResponse.json(combinedResults);
  } catch (error) {
    console.error('Website scan error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' }, 
      { status: 500 }
    );
  }
}

async function analyzeWebsite(url: string) {
  const startTime = Date.now();
  
  try {
    // Ensure URL has protocol
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Fetch the website with enhanced headers
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Code24 Website Scanner/1.0 (Website Optimization Tool)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // 15 second timeout for more reliable analysis
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const loadTime = Date.now() - startTime;

    // Analyze the HTML content
    const analysis = performWebsiteAnalysis(html, response, loadTime, targetUrl);
    
    return {
      url: targetUrl,
      ...analysis
    };
  } catch (error) {
    console.error('Website analysis failed:', error);
    // Still attempt to provide useful feedback based on URL
    const analysisError = (error as Error)?.message || 'Unable to analyze website';
    return {
      url,
      timestamp: new Date().toISOString(),
      score: 25,
      loadTime: 0,
      issues: [
        { type: 'accessibility', severity: 'critical', message: `Website analysis failed: ${analysisError}` },
        { type: 'speed', severity: 'high', message: 'Unable to measure loading speed - likely performance issues' },
        { type: 'technical', severity: 'high', message: 'Technical issues preventing proper analysis' }
      ],
      improvements: [
        'Fix website accessibility and loading issues',
        'Ensure website is publicly accessible',
        'Optimize server response time and hosting',
        'Implement proper HTTPS and security headers'
      ],
      aiWorkers: [
        { name: 'Technical Worker', task: 'Diagnose and fix accessibility issues', eta: '1-2 hours' },
        { name: 'Speed Worker', task: 'Server optimization and hosting improvements', eta: '2-4 hours' },
        { name: 'Security Worker', task: 'HTTPS and security implementation', eta: '1-3 hours' }
      ],
      projectedScore: 80,
      note: 'Real-time analysis attempted - contact support if issues persist'
    };
  }
}

function performWebsiteAnalysis(html: string, response: Response, loadTime: number, url: string) {
  const issues = [];
  const improvements = [];
  const aiWorkers = [];
  
  let score = 100;

  // Speed Analysis
  if (loadTime > 3000) {
    score -= 20;
    issues.push({
      type: 'speed',
      severity: 'critical',
      message: `Page loads in ${(loadTime / 1000).toFixed(1)} seconds (target: <3s)`
    });
    improvements.push('Optimize images and reduce file sizes');
    aiWorkers.push({
      name: 'Speed Worker',
      task: 'Image optimization and caching',
      eta: '2-4 hours'
    });
  } else if (loadTime > 2000) {
    score -= 10;
    issues.push({
      type: 'speed',
      severity: 'medium',
      message: `Page loads in ${(loadTime / 1000).toFixed(1)} seconds (good, but can be faster)`
    });
    improvements.push('Fine-tune performance for sub-2 second loading');
  }

  // Mobile Analysis
  const hasMobileViewport = html.includes('viewport') && html.includes('width=device-width');
  if (!hasMobileViewport) {
    score -= 15;
    issues.push({
      type: 'mobile',
      severity: 'high',
      message: 'Missing mobile viewport meta tag'
    });
    improvements.push('Implement mobile-responsive design');
    aiWorkers.push({
      name: 'Mobile Worker',
      task: 'Responsive design implementation',
      eta: '4-6 hours'
    });
  }

  // SEO Analysis
  const hasTitle = html.includes('<title>') && !html.includes('<title></title>');
  const hasMetaDescription = html.includes('name="description"');
  
  if (!hasTitle) {
    score -= 10;
    issues.push({
      type: 'seo',
      severity: 'high',
      message: 'Missing or empty page title'
    });
  }
  
  if (!hasMetaDescription) {
    score -= 10;
    issues.push({
      type: 'seo',
      severity: 'medium',
      message: 'Missing meta description'
    });
  }

  if (!hasTitle || !hasMetaDescription) {
    improvements.push('Add proper meta tags and SEO optimization');
    aiWorkers.push({
      name: 'SEO Worker',
      task: 'Meta tags and content optimization',
      eta: '1-2 hours'
    });
  }

  // Performance Analysis
  const hasMinifiedCSS = !html.includes('/* ') || html.split('\n').length < 50;
  const hasImageOptimization = html.includes('webp') || html.includes('loading="lazy"');
  
  if (!hasMinifiedCSS) {
    score -= 8;
    issues.push({
      type: 'performance',
      severity: 'medium',
      message: 'Unminified CSS detected'
    });
    improvements.push('Compress and minify CSS/JavaScript files');
  }

  if (!hasImageOptimization) {
    score -= 7;
    issues.push({
      type: 'performance',
      severity: 'medium',
      message: 'Images not optimized for web'
    });
    if (!improvements.includes('Optimize images and reduce file sizes')) {
      improvements.push('Optimize images and reduce file sizes');
    }
  }

  // Security Analysis
  const hasHTTPS = url.startsWith('https://');
  if (!hasHTTPS) {
    score -= 15;
    issues.push({
      type: 'security',
      severity: 'critical',
      message: 'Website not using HTTPS - major security risk'
    });
    improvements.push('Implement HTTPS encryption');
    aiWorkers.push({
      name: 'Security Worker',
      task: 'HTTPS implementation and security headers',
      eta: '1-2 hours'
    });
  }

  // Content Analysis
  const wordCount = html.replace(/<[^>]*>/g, '').split(/\s+/).length;
  if (wordCount < 200) {
    score -= 8;
    issues.push({
      type: 'content',
      severity: 'medium',
      message: `Low content volume (${wordCount} words) - may impact SEO`
    });
    improvements.push('Add more valuable content for better SEO');
  }

  // Modern Web Standards
  const hasServiceWorker = html.includes('serviceWorker') || html.includes('sw.js');
  const hasWebfonts = html.includes('fonts.googleapis.com') || html.includes('@font-face');
  
  if (!hasServiceWorker) {
    score -= 5;
    issues.push({
      type: 'modern',
      severity: 'low',
      message: 'No service worker detected - missing offline capabilities'
    });
    improvements.push('Implement service worker for better user experience');
  }

  // Analytics and Tracking
  const hasAnalytics = html.includes('google-analytics') || html.includes('gtag') || html.includes('analytics');
  if (!hasAnalytics) {
    score -= 5;
    issues.push({
      type: 'analytics',
      severity: 'medium',
      message: 'No analytics tracking detected'
    });
    improvements.push('Implement website analytics for data-driven decisions');
  }

  // Ensure minimum score and add realistic projections
  score = Math.max(score, 15);
  const improvementPotential = 100 - score;
  const projectedImprovement = Math.min(improvementPotential * 0.7, 45);

  return {
    score,
    loadTime,
    issues,
    improvements,
    aiWorkers,
    projectedScore: Math.min(score + projectedImprovement, 95),
    metrics: {
      totalIssues: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      highIssues: issues.filter(i => i.severity === 'high').length,
      mediumIssues: issues.filter(i => i.severity === 'medium').length,
      lowIssues: issues.filter(i => i.severity === 'low').length,
      wordCount,
      hasHTTPS,
      hasAnalytics,
      hasMobileOptimization: hasMobileViewport
    },
    analysisType: 'real-time',
    timestamp: new Date().toISOString()
  };
}