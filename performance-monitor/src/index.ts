import { sanitizeResponse } from '../../shared/security-utils';

export interface Env {
  DB_MAIN: D1Database;
  DB_ANALYTICS: D1Database;
  PERFORMANCE_STORAGE: R2Bucket;
  AI: any;
}

interface PerformanceAudit {
  id: string;
  site_id: string;
  audit_type: 'speed' | 'core_vitals' | 'resource' | 'full';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  performance_score: number;
  created_at: string;
  completed_at?: string;
}

interface PerformanceIssue {
  id: string;
  audit_id: string;
  site_id: string;
  type: 'fcp' | 'lcp' | 'cls' | 'fid' | 'ttfb' | 'resource_size' | 'image_optimization' | 'caching' | 'real_time_monitoring' | 'cross_device' | 'progressive_loading';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  current_value: string;
  target_value: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  potential_improvement: string;
  status: 'identified' | 'optimizing' | 'resolved' | 'monitoring';
  alertThreshold?: number; // Real-time monitoring threshold
  deviceSpecific?: boolean; // Cross-device optimization flag
  networkSensitive?: boolean; // Network-dependent optimization
}

interface PerformanceOptimization {
  id: string;
  site_id: string;
  issue_id: string;
  optimization_type: string;
  implementation: 'automatic' | 'manual' | 'cdn' | 'server';
  expected_improvement: string;
  actual_improvement?: string;
  status: 'pending' | 'implemented' | 'testing' | 'reverted';
}

interface CoreWebVitals {
  id: string;
  site_id: string;
  page_url: string;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
  date_measured: string;
}

async function generateId(): Promise<string> {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function auditPagePerformance(url: string, site: any): Promise<{issues: PerformanceIssue[], score: number, vitals: any}> {
  const issues: PerformanceIssue[] = [];
  const auditId = await generateId();
  
  try {
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Code24-PerformanceBot/1.0' },
      cf: { cacheTtl: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const content = await response.text();
    const responseTime = response.headers.get('cf-ray') ? 200 : 500;
    
    // Simulate Core Web Vitals analysis
    const vitals = {
      fcp: responseTime * 0.6,
      lcp: responseTime * 1.2,
      cls: Math.random() * 0.3,
      fid: Math.random() * 300,
      ttfb: responseTime * 0.3
    };

    // Analyze First Contentful Paint
    if (vitals.fcp > 1800) {
      issues.push({
        id: await generateId(),
        audit_id: auditId,
        site_id: site.id,
        type: 'fcp',
        severity: vitals.fcp > 3000 ? 'critical' : 'high',
        title: 'Slow First Contentful Paint',
        description: `First Contentful Paint is ${Math.round(vitals.fcp)}ms, which is slower than the recommended 1.8s`,
        current_value: `${Math.round(vitals.fcp)}ms`,
        target_value: '< 1800ms',
        impact: 'Users see content slower, affecting perceived performance',
        effort: 'medium',
        potential_improvement: 'Reduce by 30-50% with resource optimization',
        status: 'identified'
      });
    }

    // Analyze Largest Contentful Paint
    if (vitals.lcp > 2500) {
      issues.push({
        id: await generateId(),
        audit_id: auditId,
        site_id: site.id,
        type: 'lcp',
        severity: vitals.lcp > 4000 ? 'critical' : 'high',
        title: 'Poor Largest Contentful Paint',
        description: `Largest Contentful Paint is ${Math.round(vitals.lcp)}ms, exceeding the 2.5s good threshold`,
        current_value: `${Math.round(vitals.lcp)}ms`,
        target_value: '< 2500ms',
        impact: 'Main content loads slowly, hurting user experience',
        effort: 'high',
        potential_improvement: 'Optimize images and critical resources',
        status: 'identified'
      });
    }

    // Analyze Cumulative Layout Shift
    if (vitals.cls > 0.1) {
      issues.push({
        id: await generateId(),
        audit_id: auditId,
        site_id: site.id,
        type: 'cls',
        severity: vitals.cls > 0.25 ? 'critical' : 'medium',
        title: 'High Cumulative Layout Shift',
        description: `CLS score of ${vitals.cls.toFixed(3)} indicates unexpected layout shifts`,
        current_value: vitals.cls.toFixed(3),
        target_value: '< 0.1',
        impact: 'Content jumps around as page loads, frustrating users',
        effort: 'medium',
        potential_improvement: 'Reserve space for images and dynamic content',
        status: 'identified'
      });
    }

    // Analyze Time to First Byte
    if (vitals.ttfb > 600) {
      issues.push({
        id: await generateId(),
        audit_id: auditId,
        site_id: site.id,
        type: 'ttfb',
        severity: vitals.ttfb > 1000 ? 'high' : 'medium',
        title: 'Slow Server Response Time',
        description: `Time to First Byte is ${Math.round(vitals.ttfb)}ms, slower than optimal`,
        current_value: `${Math.round(vitals.ttfb)}ms`,
        target_value: '< 600ms',
        impact: 'Server processing delays page start, affecting all metrics',
        effort: 'high',
        potential_improvement: 'Server optimization and CDN implementation',
        status: 'identified'
      });
    }

    // Analyze resource sizes from content
    const imageMatches = content.match(/<img[^>]+>/g) || [];
    const unoptimizedImages = imageMatches.filter(img => 
      !img.includes('loading="lazy"') || !img.includes('width=') || !img.includes('height=')
    );

    if (unoptimizedImages.length > 0) {
      issues.push({
        id: await generateId(),
        audit_id: auditId,
        site_id: site.id,
        type: 'image_optimization',
        severity: unoptimizedImages.length > 5 ? 'high' : 'medium',
        title: 'Unoptimized Images',
        description: `${unoptimizedImages.length} images lack proper optimization attributes`,
        current_value: `${unoptimizedImages.length} unoptimized images`,
        target_value: 'All images optimized with lazy loading and dimensions',
        impact: 'Large images slow page load and cause layout shifts',
        effort: 'low',
        potential_improvement: 'Add lazy loading and explicit dimensions',
        status: 'identified'
      });
    }

    // Check for caching headers
    const cacheControl = response.headers.get('cache-control');
    if (!cacheControl || !cacheControl.includes('max-age')) {
      issues.push({
        id: await generateId(),
        audit_id: auditId,
        site_id: site.id,
        type: 'caching',
        severity: 'medium',
        title: 'Missing Cache Headers',
        description: 'Resources lack proper caching directives',
        current_value: cacheControl || 'No cache-control header',
        target_value: 'Cache-Control with appropriate max-age',
        impact: 'Resources re-downloaded on each visit, slowing repeat visits',
        effort: 'low',
        potential_improvement: 'Implement proper caching strategy',
        status: 'identified'
      });
    }

    // NEW: Real-time monitoring analysis
    const realTimeIssues = await analyzeRealTimeMonitoring(url, site, vitals);
    issues.push(...realTimeIssues);

    // NEW: Cross-device performance analysis
    const crossDeviceIssues = await analyzeCrossDevicePerformance(url, site, vitals);
    issues.push(...crossDeviceIssues);

    // Calculate performance score (0-100)
    let score = 100;
    score -= vitals.fcp > 1800 ? (vitals.fcp > 3000 ? 25 : 15) : 0;
    score -= vitals.lcp > 2500 ? (vitals.lcp > 4000 ? 25 : 15) : 0;
    score -= vitals.cls > 0.1 ? (vitals.cls > 0.25 ? 20 : 10) : 0;
    score -= vitals.ttfb > 600 ? (vitals.ttfb > 1000 ? 15 : 10) : 0;
    score -= unoptimizedImages.length > 0 ? Math.min(unoptimizedImages.length * 2, 15) : 0;
    score -= !cacheControl ? 10 : 0;

    return {
      issues,
      score: Math.max(0, Math.round(score)),
      vitals
    };

  } catch (error) {
    console.error('Performance audit failed:', error);
    return {
      issues: [{
        id: await generateId(),
        audit_id: auditId,
        site_id: site.id,
        type: 'ttfb',
        severity: 'critical',
        title: 'Site Unreachable',
        description: `Failed to load ${url}: ${(error as Error).message}`,
        current_value: 'Error',
        target_value: 'Successful response',
        impact: 'Site cannot be analyzed or accessed by users',
        effort: 'high',
        potential_improvement: 'Fix server or DNS issues',
        status: 'identified'
      }],
      score: 0,
      vitals: { fcp: 0, lcp: 0, cls: 0, fid: 0, ttfb: 0 }
    };
  }
}

async function generateOptimizations(issues: PerformanceIssue[], site: any, env: Env): Promise<PerformanceOptimization[]> {
  const optimizations: PerformanceOptimization[] = [];

  for (const issue of issues) {
    let optimizationStrategy = '';
    let implementation: 'automatic' | 'manual' | 'cdn' | 'server' = 'manual';

    switch (issue.type) {
      case 'image_optimization':
        optimizationStrategy = 'Implement lazy loading and WebP format conversion';
        implementation = 'automatic';
        break;
      case 'caching':
        optimizationStrategy = 'Configure browser and CDN caching headers';
        implementation = 'server';
        break;
      case 'fcp':
        optimizationStrategy = 'Optimize critical rendering path and reduce blocking resources';
        implementation = 'manual';
        break;
      case 'lcp':
        optimizationStrategy = 'Optimize largest content element and preload critical resources';
        implementation = 'manual';
        break;
      case 'cls':
        optimizationStrategy = 'Reserve layout space and avoid dynamic content insertion';
        implementation = 'manual';
        break;
      case 'ttfb':
        optimizationStrategy = 'Optimize server response time and implement CDN';
        implementation = 'server';
        break;
      default:
        optimizationStrategy = 'Apply performance best practices';
    }

    optimizations.push({
      id: await generateId(),
      site_id: site.id,
      issue_id: issue.id,
      optimization_type: optimizationStrategy,
      implementation,
      expected_improvement: issue.potential_improvement,
      status: 'pending'
    });
  }

  return optimizations;
}

async function trackCoreWebVitals(url: string, siteId: string, vitals: any, env: Env): Promise<void> {
  const id = await generateId();
  const now = new Date().toISOString();

  await env.DB_ANALYTICS.prepare(`
    INSERT INTO core_web_vitals 
    (id, site_id, page_url, fcp, lcp, cls, fid, ttfb, date_measured, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, siteId, url, vitals.fcp, vitals.lcp, vitals.cls, vitals.fid, vitals.ttfb,
    now.split('T')[0], now
  ).run();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      if (request.method === 'POST' && url.pathname === '/audit') {
        const { site_id, audit_type = 'full', urls } = await request.json();
        
        if (!site_id || !urls || !Array.isArray(urls)) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Get site info
        const site = await env.DB_MAIN.prepare(
          'SELECT * FROM sites WHERE id = ?'
        ).bind(site_id).first();

        if (!site) {
          return new Response(JSON.stringify({ error: 'Site not found' }), { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Create audit record
        const auditId = await generateId();
        const now = new Date().toISOString();

        await env.DB_ANALYTICS.prepare(`
          INSERT INTO performance_audits (id, site_id, audit_type, status, created_at)
          VALUES (?, ?, ?, ?, ?)
        `).bind(auditId, site_id, audit_type, 'processing', now).run();

        // Process each URL
        let totalScore = 0;
        let totalIssues = 0;

        for (const pageUrl of urls) {
          const { issues, score, vitals } = await auditPagePerformance(pageUrl, site);
          
          // Store issues
          for (const issue of issues) {
            await env.DB_ANALYTICS.prepare(`
              INSERT INTO performance_issues 
              (id, audit_id, site_id, type, severity, title, description, current_value, target_value, impact, effort, potential_improvement, status, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              issue.id, auditId, site_id, issue.type, issue.severity, issue.title,
              issue.description, issue.current_value, issue.target_value, issue.impact,
              issue.effort, issue.potential_improvement, issue.status, now
            ).run();
          }

          // Generate and store optimizations
          const optimizations = await generateOptimizations(issues, site, env);
          for (const optimization of optimizations) {
            await env.DB_ANALYTICS.prepare(`
              INSERT INTO performance_optimizations 
              (id, site_id, issue_id, optimization_type, implementation, expected_improvement, status, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              optimization.id, site_id, optimization.issue_id, optimization.optimization_type,
              optimization.implementation, optimization.expected_improvement, optimization.status, now
            ).run();
          }

          // Track Core Web Vitals
          await trackCoreWebVitals(pageUrl, site_id, vitals, env);

          totalScore += score;
          totalIssues += issues.length;
        }

        const averageScore = Math.round(totalScore / urls.length);

        // Update audit with results
        await env.DB_ANALYTICS.prepare(`
          UPDATE performance_audits 
          SET status = ?, issues_found = ?, performance_score = ?, completed_at = ?
          WHERE id = ?
        `).bind('completed', totalIssues, averageScore, new Date().toISOString(), auditId).run();

        const result = {
          audit_id: auditId,
          status: 'completed',
          performance_score: averageScore,
          issues_found: totalIssues,
          urls_analyzed: urls.length
        };

        return sanitizeResponse(new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'GET' && url.pathname === '/vitals') {
        const site_id = url.searchParams.get('site_id');
        const days = parseInt(url.searchParams.get('days') || '7');

        if (!site_id) {
          return new Response(JSON.stringify({ error: 'site_id required' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const vitals = await env.DB_ANALYTICS.prepare(`
          SELECT page_url, fcp, lcp, cls, fid, ttfb, date_measured
          FROM core_web_vitals 
          WHERE site_id = ? AND date_measured >= date('now', '-' || ? || ' days')
          ORDER BY date_measured DESC, page_url
        `).bind(site_id, days).all();

        return sanitizeResponse(new Response(JSON.stringify(vitals.results), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'GET' && url.pathname === '/issues') {
        const site_id = url.searchParams.get('site_id');
        const severity = url.searchParams.get('severity');

        if (!site_id) {
          return new Response(JSON.stringify({ error: 'site_id required' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        let query = `
          SELECT * FROM performance_issues 
          WHERE site_id = ? AND status != 'resolved'
        `;
        const params: any[] = [site_id];

        if (severity) {
          query += ` AND severity = ?`;
          params.push(severity);
        }

        query += ` ORDER BY severity DESC, created_at DESC`;

        const issues = await env.DB_ANALYTICS.prepare(query).bind(...params).all();

        return sanitizeResponse(new Response(JSON.stringify(issues.results), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      if (request.method === 'POST' && url.pathname === '/optimize') {
        const { optimization_id, status } = await request.json();

        if (!optimization_id || !status) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const now = new Date().toISOString();
        await env.DB_ANALYTICS.prepare(`
          UPDATE performance_optimizations 
          SET status = ?, updated_at = ?
          WHERE id = ?
        `).bind(status, now, optimization_id).run();

        return sanitizeResponse(new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }

      return new Response('Performance Monitor Worker - Ready', { status: 200 });

    } catch (error) {
      console.error('Performance monitor error:', error);
      return sanitizeResponse(new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: (error as Error).message 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  }
};

// =================================================================
// REAL-TIME MONITORING & CROSS-DEVICE OPTIMIZATION (PRD Features)
// =================================================================

async function analyzeRealTimeMonitoring(url: string, site: any, vitals: any): Promise<PerformanceIssue[]> {
  const issues: PerformanceIssue[] = [];

  // Check if real-time monitoring is set up
  const hasMonitoringSetup = await checkExistingMonitoring(site.id);
  
  if (!hasMonitoringSetup) {
    issues.push({
      id: await generateId(),
      audit_id: await generateId(),
      site_id: site.id,
      type: 'real_time_monitoring',
      severity: 'high',
      title: 'Missing Real-Time Performance Monitoring',
      description: 'Site lacks continuous performance monitoring for instant issue detection',
      current_value: 'No real-time monitoring active',
      target_value: 'Continuous monitoring with instant alerts',
      impact: 'Performance issues go undetected, affecting user experience',
      effort: 'medium',
      potential_improvement: 'Detect and resolve performance issues 80% faster',
      status: 'identified',
      alertThreshold: 3000, // Alert if any metric exceeds 3s
      deviceSpecific: false,
      networkSensitive: true
    });
  }

  // Analyze for performance degradation patterns
  if (vitals.lcp > 2500 || vitals.fcp > 1800) {
    issues.push({
      id: await generateId(),
      audit_id: await generateId(),
      site_id: site.id,
      type: 'real_time_monitoring',
      severity: 'critical',
      title: 'Performance Degradation Alert Setup',
      description: 'Current performance metrics indicate need for immediate monitoring',
      current_value: `LCP: ${Math.round(vitals.lcp)}ms, FCP: ${Math.round(vitals.fcp)}ms`,
      target_value: 'LCP < 2500ms, FCP < 1800ms with real-time alerts',
      impact: 'Slow performance directly impacts conversion rates and SEO',
      effort: 'low',
      potential_improvement: 'Immediate alerts when performance drops below thresholds',
      status: 'identified',
      alertThreshold: Math.min(vitals.lcp * 0.9, 2500), // Alert at 90% of current or 2.5s
      deviceSpecific: true,
      networkSensitive: true
    });
  }

  // Check for progressive loading implementation
  const hasProgressiveLoading = await analyzeProgressiveLoading(url);
  if (!hasProgressiveLoading) {
    issues.push({
      id: await generateId(),
      audit_id: await generateId(),
      site_id: site.id,
      type: 'progressive_loading',
      severity: 'medium',
      title: 'Missing Progressive Loading Strategy',
      description: 'Site loads all content at once instead of progressively',
      current_value: 'Blocking resource loading',
      target_value: 'Progressive loading with critical path prioritization',
      impact: 'Users wait longer for initial content, increasing bounce rate',
      effort: 'high',
      potential_improvement: '40-60% improvement in perceived loading speed',
      status: 'identified',
      alertThreshold: 1800, // Monitor FCP specifically
      deviceSpecific: true,
      networkSensitive: true
    });
  }

  return issues;
}

async function analyzeCrossDevicePerformance(url: string, site: any, vitals: any): Promise<PerformanceIssue[]> {
  const issues: PerformanceIssue[] = [];

  // Simulate cross-device analysis (in real implementation, would test multiple devices)
  const devicePerformanceGaps = await simulateDevicePerformance(vitals);

  if (devicePerformanceGaps.mobilePenalty > 30) {
    issues.push({
      id: await generateId(),
      audit_id: await generateId(),
      site_id: site.id,
      type: 'cross_device',
      severity: 'high',
      title: 'Poor Mobile Performance',
      description: `Mobile performance is ${devicePerformanceGaps.mobilePenalty}% slower than desktop`,
      current_value: `Mobile LCP: ${Math.round(vitals.lcp * (1 + devicePerformanceGaps.mobilePenalty / 100))}ms`,
      target_value: 'Mobile performance within 20% of desktop',
      impact: 'Mobile users experience significantly slower loading',
      effort: 'medium',
      potential_improvement: 'Optimize for mobile-specific performance bottlenecks',
      status: 'identified',
      alertThreshold: vitals.lcp * 1.2, // Alert if mobile exceeds 20% penalty
      deviceSpecific: true,
      networkSensitive: true
    });
  }

  if (devicePerformanceGaps.networkSensitivity > 50) {
    issues.push({
      id: await generateId(),
      audit_id: await generateId(),
      site_id: site.id,
      type: 'cross_device',
      severity: 'medium',
      title: 'High Network Sensitivity',
      description: 'Performance varies dramatically across network conditions',
      current_value: `${devicePerformanceGaps.networkSensitivity}% performance variance`,
      target_value: 'Consistent performance across network conditions',
      impact: 'Users on slower networks have poor experience',
      effort: 'medium',
      potential_improvement: 'Implement adaptive loading based on connection speed',
      status: 'identified',
      alertThreshold: vitals.lcp * 1.5, // Alert for slow network performance
      deviceSpecific: false,
      networkSensitive: true
    });
  }

  // Check for adaptive loading strategies
  const hasAdaptiveLoading = await analyzeAdaptiveLoading(url);
  if (!hasAdaptiveLoading) {
    issues.push({
      id: await generateId(),
      audit_id: await generateId(),
      site_id: site.id,
      type: 'cross_device',
      severity: 'medium',
      title: 'Missing Adaptive Loading Strategy',
      description: 'Site serves same resources regardless of device/network capabilities',
      current_value: 'Static resource delivery',
      target_value: 'Device and network-aware resource optimization',
      impact: 'Suboptimal experience across different devices and connections',
      effort: 'high',
      potential_improvement: '25-40% improvement in perceived performance on varied devices',
      status: 'identified',
      alertThreshold: 0, // Monitor continuously
      deviceSpecific: true,
      networkSensitive: true
    });
  }

  return issues;
}

// Helper functions for real-time monitoring
async function checkExistingMonitoring(siteId: string): Promise<boolean> {
  // In real implementation, check if monitoring is already set up
  // For now, assume no monitoring exists
  return false;
}

async function analyzeProgressiveLoading(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Code24-PerformanceBot/1.0' }
    });
    const content = await response.text();
    
    // Check for progressive loading indicators
    const hasLazyLoading = content.includes('loading="lazy"');
    const hasAsyncScripts = content.includes('async') || content.includes('defer');
    const hasCriticalCSS = content.includes('critical') || content.match(/<style[^>]*>.*?<\/style>/s);
    
    return hasLazyLoading && hasAsyncScripts && hasCriticalCSS;
  } catch (error) {
    return false;
  }
}

async function simulateDevicePerformance(vitals: any): Promise<{mobilePenalty: number, networkSensitivity: number}> {
  // Simulate mobile performance penalty (typically 20-50% slower)
  const mobilePenalty = Math.random() * 30 + 20; // 20-50% penalty
  
  // Simulate network sensitivity (how much performance varies by connection)
  const networkSensitivity = Math.random() * 40 + 30; // 30-70% variance
  
  return { mobilePenalty, networkSensitivity };
}

async function analyzeAdaptiveLoading(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Code24-PerformanceBot/1.0' }
    });
    const content = await response.text();
    
    // Check for adaptive loading indicators
    const hasResponsiveImages = content.includes('srcset') || content.includes('sizes');
    const hasServiceWorker = content.includes('serviceWorker') || content.includes('sw.js');
    const hasNetworkDetection = content.includes('connection') || content.includes('effectiveType');
    
    return hasResponsiveImages || hasServiceWorker || hasNetworkDetection;
  } catch (error) {
    return false;
  }
}

// Real-time alert endpoint
async function setupRealTimeAlerts(request: Request, env: Env): Promise<Response> {
  try {
    const { site_id, alert_thresholds } = await request.json();
    
    if (!site_id || !alert_thresholds) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Store alert configuration
    const alertId = await generateId();
    await env.DB_ANALYTICS.prepare(`
      INSERT INTO performance_alerts 
      (id, site_id, lcp_threshold, fcp_threshold, cls_threshold, ttfb_threshold, enabled, created_at)
      VALUES (?, ?, ?, ?, ?, ?, true, ?)
    `).bind(
      alertId, site_id, 
      alert_thresholds.lcp || 2500,
      alert_thresholds.fcp || 1800,
      alert_thresholds.cls || 0.1,
      alert_thresholds.ttfb || 600,
      new Date().toISOString()
    ).run();

    return sanitizeResponse(new Response(JSON.stringify({ 
      success: true,
      alert_id: alertId,
      message: 'Real-time performance monitoring enabled'
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));

  } catch (error) {
    console.error('Error setting up real-time alerts:', error);
    return sanitizeResponse(new Response(JSON.stringify({ 
      error: 'Failed to setup alerts',
      message: (error as Error).message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
}