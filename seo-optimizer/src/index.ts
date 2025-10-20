/**
 * Code24 SEO Optimization Worker
 * Automated technical SEO improvements and content optimization
 */

interface Env {
	DB_MAIN: D1Database;
	DB_ANALYTICS: D1Database;
	SEO_STORAGE: R2Bucket;
	AI: Ai;
	PLATFORM_NAME: string;
	ENVIRONMENT: string;
}

interface SEOAuditRequest {
	siteId: string;
	url: string;
	auditType: 'technical' | 'content' | 'performance' | 'full';
	priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface SEOIssue {
	id: string;
	type: 'meta_tags' | 'headings' | 'images' | 'internal_links' | 'schema' | 'performance' | 'content' | 'geo' | 'ai_optimization' | 'brand_mention';
	severity: 'critical' | 'important' | 'moderate' | 'minor';
	title: string;
	description: string;
	currentValue?: string;
	recommendedValue: string;
	impact: string;
	effort: 'low' | 'medium' | 'high';
	estimatedImprovement: string;
	geoRelevance?: number; // 0-100 score for AI answer engine optimization
	brandMentionPotential?: number; // 0-100 score for quotable content
}

interface SEOOptimization {
	id: string;
	siteId: string;
	issueId: string;
	optimizationType: string;
	originalContent: string;
	optimizedContent: string;
	implementation: 'automatic' | 'manual' | 'pending';
	expectedImpact: string;
	actualImpact?: string;
	status: 'pending' | 'implemented' | 'testing' | 'reverted';
	aiEngineOptimized?: boolean; // Optimized for ChatGPT, Claude, etc.
	quotabilityScore?: number; // 0-100 score for brand mention potential
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Server': 'Code24/1.0',
			'X-Powered-By': 'Code24 SEO Engine'
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			switch (url.pathname) {
				case '/audit':
					if (request.method === 'POST') {
						return await performSEOAudit(request, env, ctx);
					}
					break;

				case '/optimize':
					if (request.method === 'POST') {
						return await optimizeSEOIssues(request, env, ctx);
					}
					break;

				case '/process-triggers':
					if (request.method === 'POST') {
						return await processSEOTriggers(request, env, ctx);
					}
					break;

				case '/monitor':
					if (request.method === 'POST') {
						return await monitorSEOPerformance(request, env, ctx);
					}
					break;

				case '/issues':
					if (request.method === 'GET') {
						return await getSEOIssues(request, env);
					}
					break;

				case '/rankings':
					if (request.method === 'GET') {
						return await getKeywordRankings(request, env);
					}
					break;

				case '/health':
					return new Response('SEO Optimizer - Healthy', { 
						status: 200,
						headers: corsHeaders 
					});

				default:
					return new Response('SEO Optimization Engine Ready', { 
						status: 200,
						headers: corsHeaders 
					});
			}

			return new Response('Method not allowed', { 
				status: 405,
				headers: corsHeaders 
			});

		} catch (error) {
			console.error('SEO Optimizer Error:', error);
			return new Response('Internal Server Error', { 
				status: 500,
				headers: corsHeaders 
			});
		}
	},
};

async function performSEOAudit(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const auditRequest: SEOAuditRequest = await request.json();
		
		if (!auditRequest.siteId || !auditRequest.url) {
			return new Response('Missing required fields', { status: 400 });
		}

		// Get site information
		const site = await env.DB_MAIN.prepare(`
			SELECT * FROM sites WHERE id = ?
		`).bind(auditRequest.siteId).first();

		if (!site) {
			return new Response('Site not found', { status: 404 });
		}

		// Create audit job
		const auditId = crypto.randomUUID();
		await env.DB_MAIN.prepare(`
			INSERT INTO seo_audits (
				id, site_id, url, audit_type, priority, status, created_at
			) VALUES (?, ?, ?, ?, ?, 'pending', ?)
		`).bind(
			auditId,
			auditRequest.siteId,
			auditRequest.url,
			auditRequest.auditType,
			auditRequest.priority,
			new Date().toISOString()
		).run();

		// Perform audit asynchronously
		ctx.waitUntil(runSEOAudit(auditId, auditRequest, site, env));

		return new Response(JSON.stringify({
			success: true,
			auditId: auditId,
			status: 'processing'
		}), {
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});

	} catch (error) {
		console.error('Error performing SEO audit:', error);
		return new Response('Failed to perform SEO audit', { status: 500 });
	}
}

async function runSEOAudit(auditId: string, auditRequest: SEOAuditRequest, site: any, env: Env): Promise<void> {
	try {
		// Update audit status
		await env.DB_MAIN.prepare(`
			UPDATE seo_audits SET status = 'processing' WHERE id = ?
		`).bind(auditId).run();

		// Fetch the page content
		const pageContent = await fetchPageContent(auditRequest.url);
		
		// Run audit checks based on type
		const issues: SEOIssue[] = [];

		if (auditRequest.auditType === 'technical' || auditRequest.auditType === 'full') {
			issues.push(...await auditTechnicalSEO(pageContent, site));
		}

		if (auditRequest.auditType === 'content' || auditRequest.auditType === 'full') {
			issues.push(...await auditContentSEO(pageContent, site, env));
		}

		if (auditRequest.auditType === 'performance' || auditRequest.auditType === 'full') {
			issues.push(...await auditPerformanceSEO(auditRequest.url, pageContent));
		}

		// NEW: Next-gen SEO audits (GEO, AI optimization)
		if (auditRequest.auditType === 'full') {
			issues.push(...await auditGEOOptimization(pageContent, site, env));
			issues.push(...await auditAIAnswerEngines(pageContent, site, env));
			issues.push(...await auditBrandMentionOptimization(pageContent, site));
		}

		// Store issues in database
		for (const issue of issues) {
			await env.DB_MAIN.prepare(`
				INSERT INTO seo_issues (
					id, audit_id, site_id, type, severity, title, description,
					current_value, recommended_value, impact, effort,
					estimated_improvement, status, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'identified', ?)
			`).bind(
				issue.id,
				auditId,
				auditRequest.siteId,
				issue.type,
				issue.severity,
				issue.title,
				issue.description,
				issue.currentValue || '',
				issue.recommendedValue,
				issue.impact,
				issue.effort,
				issue.estimatedImprovement,
				new Date().toISOString()
			).run();
		}

		// Calculate SEO score
		const seoScore = calculateSEOScore(issues);

		// Update audit with completion
		await env.DB_MAIN.prepare(`
			UPDATE seo_audits 
			SET status = 'completed', issues_found = ?, seo_score = ?, completed_at = ?
			WHERE id = ?
		`).bind(issues.length, seoScore, new Date().toISOString(), auditId).run();

		// Auto-fix critical issues
		await autoFixCriticalIssues(issues, auditRequest.siteId, env);

	} catch (error) {
		console.error('Error running SEO audit:', error);
		
		// Mark audit as failed
		await env.DB_MAIN.prepare(`
			UPDATE seo_audits SET status = 'failed' WHERE id = ?
		`).bind(auditId).run();
	}
}

async function fetchPageContent(url: string): Promise<string> {
	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Code24 SEO Bot/1.0'
			}
		});
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		
		return await response.text();
		
	} catch (error) {
		console.error('Error fetching page content:', error);
		return '';
	}
}

async function auditTechnicalSEO(content: string, site: any): Promise<SEOIssue[]> {
	const issues: SEOIssue[] = [];

	// Parse HTML content
	const metaTitleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
	const metaDescMatch = content.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
	const h1Matches = content.match(/<h1[^>]*>([^<]*)<\/h1>/gi);
	const imageMatches = content.match(/<img[^>]*>/gi);

	// Title tag audit
	if (!metaTitleMatch) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'meta_tags',
			severity: 'critical',
			title: 'Missing Title Tag',
			description: 'Page is missing a title tag, which is critical for SEO.',
			recommendedValue: `${site.name} - ${site.business_type} services`,
			impact: 'Critical impact on search engine rankings',
			effort: 'low',
			estimatedImprovement: '15-25% ranking improvement'
		});
	} else {
		const title = metaTitleMatch[1];
		if (title.length < 30) {
			issues.push({
				id: crypto.randomUUID(),
				type: 'meta_tags',
				severity: 'important',
				title: 'Title Tag Too Short',
				description: 'Title tag is shorter than recommended 30-60 characters.',
				currentValue: title,
				recommendedValue: `${title} - ${site.business_type} services`,
				impact: 'Moderate impact on click-through rates',
				effort: 'low',
				estimatedImprovement: '5-15% CTR improvement'
			});
		} else if (title.length > 60) {
			issues.push({
				id: crypto.randomUUID(),
				type: 'meta_tags',
				severity: 'moderate',
				title: 'Title Tag Too Long',
				description: 'Title tag exceeds 60 characters and may be truncated in search results.',
				currentValue: title,
				recommendedValue: title.substring(0, 57) + '...',
				impact: 'May reduce click-through rates',
				effort: 'low',
				estimatedImprovement: '3-8% CTR improvement'
			});
		}
	}

	// Meta description audit
	if (!metaDescMatch) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'meta_tags',
			severity: 'important',
			title: 'Missing Meta Description',
			description: 'Page is missing a meta description tag.',
			recommendedValue: `Professional ${site.business_type} services. Contact us for expert solutions tailored to your needs.`,
			impact: 'Significant impact on click-through rates',
			effort: 'low',
			estimatedImprovement: '10-20% CTR improvement'
		});
	} else {
		const description = metaDescMatch[1];
		if (description.length < 120) {
			issues.push({
				id: crypto.randomUUID(),
				type: 'meta_tags',
				severity: 'moderate',
				title: 'Meta Description Too Short',
				description: 'Meta description is shorter than recommended 120-160 characters.',
				currentValue: description,
				recommendedValue: `${description} Contact us today for professional ${site.business_type} services.`,
				impact: 'Missed opportunity for better CTR',
				effort: 'low',
				estimatedImprovement: '5-10% CTR improvement'
			});
		}
	}

	// H1 audit
	if (!h1Matches || h1Matches.length === 0) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'headings',
			severity: 'important',
			title: 'Missing H1 Tag',
			description: 'Page is missing an H1 heading tag.',
			recommendedValue: `Professional ${site.business_type} Services`,
			impact: 'Important for page structure and SEO',
			effort: 'low',
			estimatedImprovement: '8-15% ranking improvement'
		});
	} else if (h1Matches.length > 1) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'headings',
			severity: 'moderate',
			title: 'Multiple H1 Tags',
			description: 'Page has multiple H1 tags. Should have only one per page.',
			currentValue: `${h1Matches.length} H1 tags found`,
			recommendedValue: 'Single H1 tag with main page topic',
			impact: 'May confuse search engines about page focus',
			effort: 'medium',
			estimatedImprovement: '3-8% ranking improvement'
		});
	}

	// Image alt text audit
	if (imageMatches) {
		let imagesWithoutAlt = 0;
		imageMatches.forEach(img => {
			if (!img.includes('alt=') || img.includes('alt=""')) {
				imagesWithoutAlt++;
			}
		});

		if (imagesWithoutAlt > 0) {
			issues.push({
				id: crypto.randomUUID(),
				type: 'images',
				severity: 'moderate',
				title: 'Missing Image Alt Text',
				description: `${imagesWithoutAlt} images are missing alt text.`,
				currentValue: `${imagesWithoutAlt} images without alt text`,
				recommendedValue: 'Descriptive alt text for all images',
				impact: 'Impacts accessibility and image SEO',
				effort: 'medium',
				estimatedImprovement: '2-5% accessibility score improvement'
			});
		}
	}

	return issues;
}

async function auditContentSEO(content: string, site: any, env: Env): Promise<SEOIssue[]> {
	const issues: SEOIssue[] = [];

	// Content length audit
	const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	const wordCount = textContent.split(' ').length;

	if (wordCount < 300) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'content',
			severity: 'important',
			title: 'Insufficient Content Length',
			description: 'Page content is too short for effective SEO.',
			currentValue: `${wordCount} words`,
			recommendedValue: 'At least 300-500 words of quality content',
			impact: 'Low content volume hurts search rankings',
			effort: 'high',
			estimatedImprovement: '10-20% ranking improvement'
		});
	}

	// Keyword density analysis (basic)
	const businessKeywords = [
		site.business_type,
		site.primary_goal,
		'services',
		'professional',
		'expert'
	];

	let keywordMentions = 0;
	businessKeywords.forEach(keyword => {
		const regex = new RegExp(keyword, 'gi');
		const matches = textContent.match(regex);
		if (matches) keywordMentions += matches.length;
	});

	const keywordDensity = (keywordMentions / wordCount) * 100;

	if (keywordDensity < 1) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'content',
			severity: 'moderate',
			title: 'Low Keyword Density',
			description: 'Content lacks relevant business keywords.',
			currentValue: `${keywordDensity.toFixed(1)}% keyword density`,
			recommendedValue: '2-3% keyword density for business terms',
			impact: 'Missing keyword relevance signals',
			effort: 'medium',
			estimatedImprovement: '5-12% relevance improvement'
		});
	}

	// Check for schema markup
	if (!content.includes('application/ld+json')) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'schema',
			severity: 'important',
			title: 'Missing Schema Markup',
			description: 'Page lacks structured data markup.',
			recommendedValue: `${site.business_type} business schema with contact info`,
			impact: 'Missing rich snippet opportunities',
			effort: 'medium',
			estimatedImprovement: '8-15% rich snippet visibility'
		});
	}

	return issues;
}

async function auditPerformanceSEO(url: string, content: string): Promise<SEOIssue[]> {
	const issues: SEOIssue[] = [];

	// Basic performance checks
	const contentSize = new Blob([content]).size;
	
	if (contentSize > 500000) { // 500KB
		issues.push({
			id: crypto.randomUUID(),
			type: 'performance',
			severity: 'moderate',
			title: 'Large Page Size',
			description: 'Page size is larger than recommended.',
			currentValue: `${Math.round(contentSize / 1024)}KB`,
			recommendedValue: 'Under 500KB for optimal performance',
			impact: 'Slower loading times affect rankings',
			effort: 'medium',
			estimatedImprovement: '5-10% speed improvement'
		});
	}

	// Check for inline CSS/JS
	const inlineCssMatches = content.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
	const inlineJsMatches = content.match(/<script[^>]*>[\s\S]*?<\/script>/gi);

	if (inlineCssMatches && inlineCssMatches.length > 2) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'performance',
			severity: 'minor',
			title: 'Excessive Inline CSS',
			description: 'Too much inline CSS affects page performance.',
			currentValue: `${inlineCssMatches.length} inline style blocks`,
			recommendedValue: 'External CSS files for better caching',
			impact: 'Minor performance impact',
			effort: 'medium',
			estimatedImprovement: '2-5% loading speed improvement'
		});
	}

	return issues;
}

function calculateSEOScore(issues: SEOIssue[]): number {
	let score = 100;

	issues.forEach(issue => {
		switch (issue.severity) {
			case 'critical':
				score -= 20;
				break;
			case 'important':
				score -= 10;
				break;
			case 'moderate':
				score -= 5;
				break;
			case 'minor':
				score -= 2;
				break;
		}
	});

	return Math.max(0, score);
}

async function autoFixCriticalIssues(issues: SEOIssue[], siteId: string, env: Env): Promise<void> {
	const criticalIssues = issues.filter(issue => 
		issue.severity === 'critical' && 
		['meta_tags', 'headings'].includes(issue.type)
	);

	for (const issue of criticalIssues) {
		try {
			// Create optimization for auto-fixable issues
			const optimizationId = crypto.randomUUID();
			
			await env.DB_MAIN.prepare(`
				INSERT INTO seo_optimizations (
					id, site_id, issue_id, optimization_type, original_content,
					optimized_content, implementation, expected_impact, status, created_at
				) VALUES (?, ?, ?, ?, ?, ?, 'automatic', ?, 'pending', ?)
			`).bind(
				optimizationId,
				siteId,
				issue.id,
				issue.type,
				issue.currentValue || '',
				issue.recommendedValue,
				issue.estimatedImprovement,
				new Date().toISOString()
			).run();

			console.log(`Auto-fix created for critical SEO issue: ${issue.title}`);

		} catch (error) {
			console.error('Error creating auto-fix:', error);
		}
	}
}

async function optimizeSEOIssues(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const { siteId, issueIds } = await request.json();

		if (!siteId || !issueIds || !Array.isArray(issueIds)) {
			return new Response('Missing required fields', { status: 400 });
		}

		const optimizations = [];

		for (const issueId of issueIds) {
			// Get issue details
			const issue = await env.DB_MAIN.prepare(`
				SELECT * FROM seo_issues WHERE id = ?
			`).bind(issueId).first();

			if (issue) {
				// Create optimization
				const optimization = await createSEOOptimization(issue, env);
				if (optimization) {
					optimizations.push(optimization);
				}
			}
		}

		return new Response(JSON.stringify({
			success: true,
			optimizations: optimizations.length,
			created: optimizations.map(opt => opt.id)
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error optimizing SEO issues:', error);
		return new Response('Failed to optimize SEO issues', { status: 500 });
	}
}

// =================================================================
// NEXT-GENERATION SEO OPTIMIZATION FUNCTIONS (PRD Features)
// =================================================================

async function auditGEOOptimization(content: string, site: any, env: Env): Promise<SEOIssue[]> {
	const issues: SEOIssue[] = [];

	// Check for AI-quotable content structure
	const hasQuotableStatements = content.match(/\b[A-Z][^.!?]*\b(?:pioneered|founded|serves|specializes in|leading)\b[^.!?]*[.!?]/gi);
	
	if (!hasQuotableStatements || hasQuotableStatements.length < 2) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'geo',
			severity: 'important',
			title: 'Missing AI-Quotable Content',
			description: 'Content lacks clear, authoritative statements that AI answer engines can quote.',
			currentValue: hasQuotableStatements ? `${hasQuotableStatements.length} quotable statements` : 'No quotable statements found',
			recommendedValue: 'Add 3-5 clear, authoritative statements about your business',
			impact: 'AI engines like ChatGPT and Claude prefer quotable, specific information',
			effort: 'medium',
			estimatedImprovement: '30-50% improvement in AI answer engine citations',
			geoRelevance: 85
		});
	}

	// Check for FAQ sections (AI engines love these)
	const hasFAQ = content.toLowerCase().includes('frequently asked') || 
	               content.toLowerCase().includes('faq') ||
	               content.match(/\bQ:\s*[^?]+\?/gi);

	if (!hasFAQ) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'geo',
			severity: 'moderate',
			title: 'Missing FAQ Section for AI Optimization',
			description: 'FAQ sections are highly favored by AI answer engines for providing quick answers.',
			currentValue: 'No FAQ section detected',
			recommendedValue: 'Add comprehensive FAQ section with 5-10 common questions',
			impact: 'AI engines frequently excerpt from FAQ sections',
			effort: 'medium',
			estimatedImprovement: '25-40% improvement in featured snippet capture',
			geoRelevance: 90
		});
	}

	// Check for clear business specifications
	const hasSpecifications = content.match(/\b(?:since|established|founded|serving|located|specializing)\s+(?:in\s+)?\d{4}\b/gi) ||
	                          content.match(/\b\d+(?:,\d+)*\+?\s+(?:customers|clients|patients|members)\b/gi);

	if (!hasSpecifications) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'geo',
			severity: 'moderate',
			title: 'Missing Specific Business Credentials',
			description: 'AI engines prefer specific, verifiable information like founding dates and customer counts.',
			currentValue: 'Generic business descriptions',
			recommendedValue: 'Add specific details: founding year, customer count, location, specializations',
			impact: 'Specific information makes content more authoritative and quotable',
			effort: 'low',
			estimatedImprovement: '15-25% improvement in brand mention frequency',
			geoRelevance: 75
		});
	}

	return issues;
}

async function auditAIAnswerEngines(content: string, site: any, env: Env): Promise<SEOIssue[]> {
	const issues: SEOIssue[] = [];

	// Check for semantic markup that AI can understand
	const hasSchemaMarkup = content.includes('schema.org') || content.includes('application/ld+json');
	
	if (!hasSchemaMarkup) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'ai_optimization',
			severity: 'important',
			title: 'Missing Schema Markup for AI Engines',
			description: 'Schema markup helps AI understand your business structure and services.',
			currentValue: 'No structured data detected',
			recommendedValue: 'Implement LocalBusiness, Organization, or Product schema',
			impact: 'AI engines use structured data for better understanding and attribution',
			effort: 'medium',
			estimatedImprovement: '20-35% improvement in AI engine comprehension',
			geoRelevance: 80
		});
	}

	// Check for clear hierarchical structure
	const headingStructure = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi);
	const hasGoodStructure = headingStructure && headingStructure.length >= 3;

	if (!hasGoodStructure) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'ai_optimization',
			severity: 'moderate',
			title: 'Poor Content Hierarchy for AI Parsing',
			description: 'AI engines need clear content structure to understand topic relationships.',
			currentValue: headingStructure ? `${headingStructure.length} headings` : 'No clear heading structure',
			recommendedValue: 'Use proper H1-H6 hierarchy with descriptive headings',
			impact: 'Clear structure helps AI engines parse and categorize content',
			effort: 'low',
			estimatedImprovement: '10-20% improvement in content categorization',
			geoRelevance: 70
		});
	}

	// Check for answer-ready content format
	const hasAnswerFormat = content.match(/\b(?:how to|what is|why|when|where)\b[^.!?]*[.!?]/gi);
	
	if (!hasAnswerFormat || hasAnswerFormat.length < 3) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'ai_optimization',
			severity: 'moderate',
			title: 'Content Not Optimized for Q&A Format',
			description: 'AI engines prefer content that directly answers common questions.',
			currentValue: hasAnswerFormat ? `${hasAnswerFormat.length} question-answer patterns` : 'No Q&A format detected',
			recommendedValue: 'Structure content to directly answer "how to", "what is", "why" questions',
			impact: 'Direct answers are more likely to be featured in AI responses',
			effort: 'medium',
			estimatedImprovement: '25-40% improvement in direct AI citations',
			geoRelevance: 85
		});
	}

	return issues;
}

async function auditBrandMentionOptimization(content: string, site: any): Promise<SEOIssue[]> {
	const issues: SEOIssue[] = [];

	// Check for distinctive brand positioning
	const businessName = site.business_name || '';
	const hasDistinctivePositioning = content.match(new RegExp(`${businessName}[^.!?]*(?:pioneered|leading|first|only|specializes in|expert in)[^.!?]*[.!?]`, 'gi'));

	if (!hasDistinctivePositioning) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'brand_mention',
			severity: 'important',
			title: 'Weak Brand Differentiation for AI Quotability',
			description: 'Your brand lacks distinctive positioning statements that AI engines can quote.',
			currentValue: 'Generic brand descriptions',
			recommendedValue: `Create unique positioning: "${businessName} pioneered..." or "${businessName} is the only..."`,
			impact: 'Distinctive positioning makes your brand more memorable and quotable',
			effort: 'medium',
			estimatedImprovement: '40-60% improvement in brand mention frequency',
			brandMentionPotential: 90
		});
	}

	// Check for press-ready descriptions
	const hasPressReadyContent = content.match(/\b(?:award-winning|certified|licensed|accredited|recognized)\b/gi);
	
	if (!hasPressReadyContent) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'brand_mention',
			severity: 'moderate',
			title: 'Missing Authority Indicators',
			description: 'Content lacks authority markers that make it quotable by AI and press.',
			currentValue: 'No authority indicators found',
			recommendedValue: 'Add credentials: certifications, awards, recognitions, years of experience',
			impact: 'Authority indicators increase credibility and quotability',
			effort: 'low',
			estimatedImprovement: '15-30% improvement in authoritative mentions',
			brandMentionPotential: 75
		});
	}

	// Check for specific, memorable numbers and facts
	const hasMemorableFacts = content.match(/\b\d+(?:,\d+)*\+?\s+(?:years?|customers?|clients?|patients?|projects?|%)\b/gi);
	
	if (!hasMemorableFacts || hasMemorableFacts.length < 2) {
		issues.push({
			id: crypto.randomUUID(),
			type: 'brand_mention',
			severity: 'moderate',
			title: 'Lacks Memorable Statistics',
			description: 'Specific numbers and statistics make content more quotable and memorable.',
			currentValue: hasMemorableFacts ? `${hasMemorableFacts.length} statistics` : 'No specific statistics',
			recommendedValue: 'Add concrete numbers: years in business, customers served, success rates',
			impact: 'Specific statistics are more likely to be quoted and remembered',
			effort: 'low',
			estimatedImprovement: '20-35% improvement in fact-based citations',
			brandMentionPotential: 80
		});
	}

	return issues;
}

async function createSEOOptimization(issue: any, env: Env): Promise<any> {
	try {
		const optimizationId = crypto.randomUUID();

		// Generate optimized content based on issue type
		let optimizedContent = issue.recommended_value;

		if (issue.type === 'content') {
			// Use AI to generate optimized content
			optimizedContent = await generateOptimizedContent(issue, env);
		}

		// Store optimization
		await env.DB_MAIN.prepare(`
			INSERT INTO seo_optimizations (
				id, site_id, issue_id, optimization_type, original_content,
				optimized_content, implementation, expected_impact, status, created_at
			) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, 'pending', ?)
		`).bind(
			optimizationId,
			issue.site_id,
			issue.id,
			issue.type,
			issue.current_value || '',
			optimizedContent,
			issue.estimated_improvement,
			new Date().toISOString()
		).run();

		return {
			id: optimizationId,
			type: issue.type,
			optimizedContent
		};

	} catch (error) {
		console.error('Error creating SEO optimization:', error);
		return null;
	}
}

async function generateOptimizedContent(issue: any, env: Env): Promise<string> {
	try {
		const prompt = `Optimize this content for SEO while maintaining readability:

Issue: ${issue.title}
Current: ${issue.current_value || 'No content'}
Goal: ${issue.description}
Business Type: ${issue.business_type || 'general business'}

Generate improved content that addresses the SEO issue while being natural and engaging.`;

		const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
			messages: [
				{
					role: 'system',
					content: 'You are an expert SEO content optimizer. Generate natural, engaging content that improves SEO while maintaining readability.'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			max_tokens: 300
		});

		return aiResponse.response.trim();

	} catch (error) {
		console.error('Error generating optimized content:', error);
		return issue.recommended_value;
	}
}

async function processSEOTriggers(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		// Get pending SEO optimization triggers from analytics
		const triggers = await env.DB_ANALYTICS.prepare(`
			SELECT * FROM optimization_triggers 
			WHERE status = 'pending' AND suggested_action LIKE '%seo%'
			ORDER BY priority DESC, created_at ASC
			LIMIT 10
		`).all();

		const processedTriggers = [];

		for (const trigger of triggers.results || []) {
			try {
				// Mark trigger as processing
				await env.DB_ANALYTICS.prepare(`
					UPDATE optimization_triggers 
					SET status = 'processing', assigned_worker = 'seo-optimizer'
					WHERE id = ?
				`).bind(trigger.id).run();

				// Create SEO audit based on trigger
				const auditRequest: SEOAuditRequest = {
					siteId: trigger.site_id,
					url: `https://${trigger.site_id}.code24.dev`, // Construct URL
					auditType: 'technical',
					priority: trigger.priority
				};

				ctx.waitUntil(performSEOAuditFromTrigger(auditRequest, trigger, env));
				processedTriggers.push(trigger.id);

			} catch (error) {
				console.error('Error processing SEO trigger:', trigger.id, error);
			}
		}

		return new Response(JSON.stringify({
			success: true,
			processed_triggers: processedTriggers.length,
			trigger_ids: processedTriggers
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error processing SEO triggers:', error);
		return new Response('Failed to process SEO triggers', { status: 500 });
	}
}

async function performSEOAuditFromTrigger(auditRequest: SEOAuditRequest, trigger: any, env: Env): Promise<void> {
	// Get site info
	const site = await env.DB_MAIN.prepare(`
		SELECT * FROM sites WHERE id = ?
	`).bind(auditRequest.siteId).first();

	if (site) {
		// Run simplified audit for trigger
		await runSEOAudit(crypto.randomUUID(), auditRequest, site, env);
		
		// Mark trigger as completed
		await env.DB_ANALYTICS.prepare(`
			UPDATE optimization_triggers 
			SET status = 'completed'
			WHERE id = ?
		`).bind(trigger.id).run();
	}
}

async function monitorSEOPerformance(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const { siteId, timeframe = '30d' } = await request.json();

		// Get SEO performance metrics
		const metrics = await calculateSEOMetrics(siteId, timeframe, env);

		return new Response(JSON.stringify({
			success: true,
			siteId,
			timeframe,
			metrics
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error monitoring SEO performance:', error);
		return new Response('Failed to monitor SEO performance', { status: 500 });
	}
}

async function calculateSEOMetrics(siteId: string, timeframe: string, env: Env): Promise<any> {
	const daysBack = timeframe === '30d' ? 30 : timeframe === '7d' ? 7 : 1;
	const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

	// Get recent audits and optimizations
	const [audits, optimizations, issues] = await Promise.all([
		env.DB_MAIN.prepare(`
			SELECT COUNT(*) as count, AVG(seo_score) as avg_score
			FROM seo_audits 
			WHERE site_id = ? AND created_at > ?
		`).bind(siteId, startDate).first(),

		env.DB_MAIN.prepare(`
			SELECT COUNT(*) as count, 
				   COUNT(CASE WHEN status = 'implemented' THEN 1 END) as implemented
			FROM seo_optimizations 
			WHERE site_id = ? AND created_at > ?
		`).bind(siteId, startDate).first(),

		env.DB_MAIN.prepare(`
			SELECT COUNT(*) as total,
				   COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
				   COUNT(CASE WHEN severity = 'important' THEN 1 END) as important
			FROM seo_issues 
			WHERE site_id = ? AND created_at > ?
		`).bind(siteId, startDate).first()
	]);

	return {
		audits_performed: audits?.count || 0,
		average_seo_score: audits?.avg_score || 0,
		optimizations_created: optimizations?.count || 0,
		optimizations_implemented: optimizations?.implemented || 0,
		total_issues: issues?.total || 0,
		critical_issues: issues?.critical || 0,
		important_issues: issues?.important || 0,
		improvement_rate: optimizations?.count > 0 ? 
			(optimizations?.implemented / optimizations?.count) * 100 : 0
	};
}

async function getSEOIssues(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const siteId = url.searchParams.get('siteId');
		const severity = url.searchParams.get('severity');
		const status = url.searchParams.get('status') || 'identified';

		if (!siteId) {
			return new Response('Missing siteId parameter', { status: 400 });
		}

		let query = `
			SELECT i.*, a.seo_score, a.created_at as audit_date
			FROM seo_issues i
			LEFT JOIN seo_audits a ON i.audit_id = a.id
			WHERE i.site_id = ? AND i.status = ?
		`;
		const params = [siteId, status];

		if (severity) {
			query += ' AND i.severity = ?';
			params.push(severity);
		}

		query += ' ORDER BY i.severity DESC, i.created_at DESC LIMIT 50';

		const issues = await env.DB_MAIN.prepare(query).bind(...params).all();

		return new Response(JSON.stringify({
			success: true,
			issues: issues.results || []
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error getting SEO issues:', error);
		return new Response('Failed to get SEO issues', { status: 500 });
	}
}

async function getKeywordRankings(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const siteId = url.searchParams.get('siteId');

		if (!siteId) {
			return new Response('Missing siteId parameter', { status: 400 });
		}

		// Get keyword rankings (would integrate with SEO APIs in production)
		const rankings = await env.DB_MAIN.prepare(`
			SELECT * FROM keyword_rankings 
			WHERE site_id = ? 
			ORDER BY created_at DESC 
			LIMIT 20
		`).bind(siteId).all();

		return new Response(JSON.stringify({
			success: true,
			rankings: rankings.results || []
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error getting keyword rankings:', error);
		return new Response('Failed to get keyword rankings', { status: 500 });
	}
}