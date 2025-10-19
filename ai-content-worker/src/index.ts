/**
 * Code24 AI Content Generator Worker
 * AI-powered content optimization and generation for customer sites
 */

interface Env {
	DB_MAIN: D1Database;
	DB_ANALYTICS: D1Database;
	CONTENT_STORAGE: R2Bucket;
	AI: Ai;
	PLATFORM_NAME: string;
	ENVIRONMENT: string;
}

interface ContentOptimizationRequest {
	siteId: string;
	optimizationType: 'headlines' | 'cta_buttons' | 'descriptions' | 'full_page' | 'seo_content';
	currentContent: string;
	businessType: string;
	primaryGoal: string;
	performanceData?: {
		conversionRate: number;
		bounceRate: number;
		avgSessionDuration: number;
	};
	targetAudience?: string;
	brandVoice?: 'professional' | 'friendly' | 'authoritative' | 'casual' | 'technical';
}

interface ContentVariation {
	id: string;
	content: string;
	confidence: number;
	reasoning: string;
	expectedImprovement: string;
}

interface OptimizationJob {
	id: string;
	siteId: string;
	status: 'pending' | 'processing' | 'completed' | 'failed';
	request: ContentOptimizationRequest;
	variations?: ContentVariation[];
	selectedVariation?: string;
	createdAt: string;
	completedAt?: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			switch (url.pathname) {
				case '/optimize':
					if (request.method === 'POST') {
						return await handleContentOptimization(request, env, ctx);
					}
					break;

				case '/process-triggers':
					if (request.method === 'POST') {
						return await processPendingOptimizations(request, env, ctx);
					}
					break;

				case '/jobs':
					if (request.method === 'GET') {
						return await getOptimizationJobs(request, env);
					}
					break;

				case '/health':
					return new Response('AI Content Worker - Healthy', { 
						status: 200,
						headers: corsHeaders 
					});

				default:
					return new Response('AI Content Generator Ready', { 
						status: 200,
						headers: corsHeaders 
					});
			}

			return new Response('Method not allowed', { 
				status: 405,
				headers: corsHeaders 
			});

		} catch (error) {
			console.error('AI Content Worker Error:', error);
			return new Response('Internal Server Error', { 
				status: 500,
				headers: corsHeaders 
			});
		}
	},
};

async function handleContentOptimization(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const optimizationRequest: ContentOptimizationRequest = await request.json();
		
		// Validate request
		if (!optimizationRequest.siteId || !optimizationRequest.currentContent || !optimizationRequest.optimizationType) {
			return new Response('Missing required fields', { status: 400 });
		}

		// Create optimization job
		const jobId = crypto.randomUUID();
		const job: OptimizationJob = {
			id: jobId,
			siteId: optimizationRequest.siteId,
			status: 'pending',
			request: optimizationRequest,
			createdAt: new Date().toISOString()
		};

		// Store job in database
		await env.DB_MAIN.prepare(`
			INSERT INTO content_optimization_jobs (
				id, site_id, optimization_type, current_content, 
				business_type, primary_goal, performance_data,
				target_audience, brand_voice, status, created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`).bind(
			jobId,
			optimizationRequest.siteId,
			optimizationRequest.optimizationType,
			optimizationRequest.currentContent,
			optimizationRequest.businessType,
			optimizationRequest.primaryGoal,
			JSON.stringify(optimizationRequest.performanceData || {}),
			optimizationRequest.targetAudience || '',
			optimizationRequest.brandVoice || 'professional',
			'pending',
			job.createdAt
		).run();

		// Process optimization immediately
		ctx.waitUntil(processOptimizationJob(job, env));

		return new Response(JSON.stringify({ 
			success: true, 
			jobId: jobId,
			status: 'processing'
		}), {
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});

	} catch (error) {
		console.error('Error handling content optimization:', error);
		return new Response('Failed to process optimization request', { status: 500 });
	}
}

async function processOptimizationJob(job: OptimizationJob, env: Env): Promise<void> {
	try {
		// Update job status to processing
		await env.DB_MAIN.prepare(`
			UPDATE content_optimization_jobs 
			SET status = 'processing' 
			WHERE id = ?
		`).bind(job.id).run();

		// Get site context for better optimization
		const site = await env.DB_MAIN.prepare(`
			SELECT * FROM sites WHERE id = ?
		`).bind(job.siteId).first();

		// Generate content variations using AI
		const variations = await generateContentVariations(job.request, site, env);

		// Store variations
		for (const variation of variations) {
			await env.DB_MAIN.prepare(`
				INSERT INTO content_variations (
					id, job_id, content, confidence, reasoning, 
					expected_improvement, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?)
			`).bind(
				variation.id,
				job.id,
				variation.content,
				variation.confidence,
				variation.reasoning,
				variation.expectedImprovement,
				new Date().toISOString()
			).run();
		}

		// Auto-select the highest confidence variation for testing
		const bestVariation = variations.reduce((best, current) => 
			current.confidence > best.confidence ? current : best
		);

		// Update job as completed
		await env.DB_MAIN.prepare(`
			UPDATE content_optimization_jobs 
			SET status = 'completed', selected_variation = ?, completed_at = ?
			WHERE id = ?
		`).bind(bestVariation.id, new Date().toISOString(), job.id).run();

		// Create A/B test for the optimization
		await createABTestForOptimization(job, bestVariation, env);

	} catch (error) {
		console.error('Error processing optimization job:', error);
		
		// Mark job as failed
		await env.DB_MAIN.prepare(`
			UPDATE content_optimization_jobs 
			SET status = 'failed' 
			WHERE id = ?
		`).bind(job.id).run();
	}
}

async function generateContentVariations(request: ContentOptimizationRequest, site: any, env: Env): Promise<ContentVariation[]> {
	const variations: ContentVariation[] = [];

	// Create AI prompts based on optimization type
	const prompts = createOptimizationPrompts(request, site);

	for (let i = 0; i < prompts.length && i < 3; i++) {
		try {
			const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				messages: [
					{
						role: 'system',
						content: 'You are an expert conversion copywriter and UX optimizer. Generate high-converting content optimized for the specified business goal.'
					},
					{
						role: 'user',
						content: prompts[i]
					}
				],
				max_tokens: 500
			});

			const variation: ContentVariation = {
				id: crypto.randomUUID(),
				content: aiResponse.response.trim(),
				confidence: calculateConfidence(request, aiResponse.response),
				reasoning: `AI-optimized for ${request.primaryGoal} goal using ${request.optimizationType} strategy`,
				expectedImprovement: estimateImprovement(request, aiResponse.response)
			};

			variations.push(variation);

		} catch (error) {
			console.error('Error generating AI variation:', error);
		}
	}

	return variations;
}

function createOptimizationPrompts(request: ContentOptimizationRequest, site: any): string[] {
	const baseContext = `
Business: ${site?.name || 'Business'}
Type: ${request.businessType}
Goal: ${request.primaryGoal}
Current Performance: ${request.performanceData ? 
	`${(request.performanceData.conversionRate * 100).toFixed(2)}% conversion rate, ${(request.performanceData.bounceRate * 100).toFixed(1)}% bounce rate` : 
	'No performance data available'}
Brand Voice: ${request.brandVoice || 'professional'}
Target Audience: ${request.targetAudience || 'general audience'}
`;

	const prompts: string[] = [];

	switch (request.optimizationType) {
		case 'headlines':
			prompts.push(`${baseContext}

Current headline: "${request.currentContent}"

Create 3 high-converting headline variations that:
1. Clearly communicate the value proposition
2. Are optimized for ${request.primaryGoal} 
3. Use psychological triggers appropriate for ${request.businessType}
4. Match the ${request.brandVoice} brand voice

Format as: Headline 1 | Headline 2 | Headline 3`);
			break;

		case 'cta_buttons':
			prompts.push(`${baseContext}

Current CTA: "${request.currentContent}"

Create 3 compelling call-to-action button text variations that:
1. Drive ${request.primaryGoal} actions
2. Create urgency and desire
3. Use action-oriented language
4. Are appropriate for ${request.businessType}

Format as: CTA 1 | CTA 2 | CTA 3`);
			break;

		case 'descriptions':
			prompts.push(`${baseContext}

Current description: "${request.currentContent}"

Write 3 compelling description variations that:
1. Highlight key benefits for ${request.primaryGoal}
2. Address common objections
3. Use persuasive copywriting techniques
4. Maintain ${request.brandVoice} tone

Each description should be 2-3 sentences maximum.`);
			break;

		case 'full_page':
			prompts.push(`${baseContext}

Current content: "${request.currentContent}"

Rewrite this page content to maximize ${request.primaryGoal}:
1. Improve headline and subheadlines
2. Enhance value proposition clarity
3. Add social proof elements
4. Optimize call-to-action placement
5. Improve readability and flow

Keep the same general structure but optimize for conversions.`);
			break;

		case 'seo_content':
			prompts.push(`${baseContext}

Current content: "${request.currentContent}"

Optimize this content for SEO while maintaining conversion focus:
1. Include relevant keywords for ${request.businessType}
2. Improve content structure with headers
3. Add internal linking opportunities
4. Optimize meta descriptions
5. Maintain focus on ${request.primaryGoal}

Balance SEO optimization with conversion optimization.`);
			break;
	}

	return prompts;
}

function calculateConfidence(request: ContentOptimizationRequest, generatedContent: string): number {
	let confidence = 70; // Base confidence

	// Adjust based on content length appropriateness
	if (request.optimizationType === 'headlines') {
		const wordCount = generatedContent.split(' ').length;
		if (wordCount >= 4 && wordCount <= 12) confidence += 10;
	}

	// Adjust based on goal-specific keywords
	const goalKeywords = {
		sales: ['buy', 'purchase', 'order', 'get', 'save', 'discount', 'free'],
		leads: ['contact', 'call', 'email', 'quote', 'consultation', 'free', 'learn'],
		signups: ['join', 'register', 'sign up', 'create', 'start', 'begin', 'free'],
		bookings: ['book', 'schedule', 'reserve', 'appointment', 'call', 'meet'],
		traffic: ['discover', 'explore', 'learn', 'read', 'see', 'find', 'browse']
	};

	const keywords = goalKeywords[request.primaryGoal as keyof typeof goalKeywords] || [];
	const hasGoalKeywords = keywords.some(keyword => 
		generatedContent.toLowerCase().includes(keyword)
	);
	
	if (hasGoalKeywords) confidence += 15;

	// Adjust based on brand voice alignment
	const voiceIndicators = {
		professional: ['professional', 'expert', 'quality', 'trusted'],
		friendly: ['friendly', 'easy', 'simple', 'help', 'support'],
		authoritative: ['leading', 'proven', 'established', 'expert'],
		casual: ['awesome', 'cool', 'great', 'amazing'],
		technical: ['advanced', 'sophisticated', 'precision', 'optimized']
	};

	const voiceWords = voiceIndicators[request.brandVoice as keyof typeof voiceIndicators] || [];
	const hasVoiceAlignment = voiceWords.some(word => 
		generatedContent.toLowerCase().includes(word)
	);
	
	if (hasVoiceAlignment) confidence += 10;

	return Math.min(95, Math.max(50, confidence));
}

function estimateImprovement(request: ContentOptimizationRequest, generatedContent: string): string {
	const currentRate = request.performanceData?.conversionRate || 0.02;
	
	// Estimate improvement based on optimization type and content quality
	let estimatedImprovement = 0;
	
	switch (request.optimizationType) {
		case 'headlines':
			estimatedImprovement = 15; // Headlines typically have high impact
			break;
		case 'cta_buttons':
			estimatedImprovement = 12; // CTAs have significant impact
			break;
		case 'descriptions':
			estimatedImprovement = 8; // Moderate impact
			break;
		case 'full_page':
			estimatedImprovement = 25; // Comprehensive optimization
			break;
		case 'seo_content':
			estimatedImprovement = 10; // Medium-term impact
			break;
	}

	// Adjust based on current performance
	if (currentRate < 0.01) {
		estimatedImprovement *= 1.5; // More room for improvement
	} else if (currentRate > 0.05) {
		estimatedImprovement *= 0.7; // Less room for improvement
	}

	return `${estimatedImprovement.toFixed(0)}% improvement in ${request.primaryGoal}`;
}

async function createABTestForOptimization(job: OptimizationJob, variation: ContentVariation, env: Env): Promise<void> {
	try {
		const testId = crypto.randomUUID();
		
		await env.DB_MAIN.prepare(`
			INSERT INTO ab_tests (
				id, site_id, test_name, test_type, control_content,
				variant_content, traffic_split, start_date, status, 
				created_from_job, expected_improvement
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
		`).bind(
			testId,
			job.siteId,
			`AI Optimization: ${job.request.optimizationType}`,
			job.request.optimizationType,
			job.request.currentContent,
			variation.content,
			JSON.stringify({ control: 50, variant: 50 }),
			new Date().toISOString(),
			job.id,
			variation.expectedImprovement
		).run();

		console.log(`Created A/B test ${testId} for optimization job ${job.id}`);

	} catch (error) {
		console.error('Error creating A/B test:', error);
	}
}

async function processPendingOptimizations(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		// Get pending optimization triggers from analytics processor
		const triggers = await env.DB_ANALYTICS.prepare(`
			SELECT * FROM optimization_triggers 
			WHERE status = 'pending' AND suggested_action IN ('optimize_conversion_elements', 'improve_content_engagement', 'refresh_content_with_ai')
			ORDER BY priority DESC, created_at ASC
			LIMIT 10
		`).all();

		const processedJobs = [];

		for (const trigger of triggers.results) {
			try {
				// Mark trigger as processing
				await env.DB_ANALYTICS.prepare(`
					UPDATE optimization_triggers 
					SET status = 'processing', assigned_worker = 'ai-content-worker'
					WHERE id = ?
				`).bind(trigger.id).run();

				// Create optimization job based on trigger
				const optimizationJob = await createJobFromTrigger(trigger, env);
				
				if (optimizationJob) {
					ctx.waitUntil(processOptimizationJob(optimizationJob, env));
					processedJobs.push(optimizationJob.id);
				}

			} catch (error) {
				console.error('Error processing trigger:', trigger.id, error);
			}
		}

		return new Response(JSON.stringify({
			success: true,
			processed_triggers: triggers.results?.length || 0,
			created_jobs: processedJobs
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error processing pending optimizations:', error);
		return new Response('Failed to process pending optimizations', { status: 500 });
	}
}

async function createJobFromTrigger(trigger: any, env: Env): Promise<OptimizationJob | null> {
	try {
		const site = await env.DB_MAIN.prepare(`
			SELECT * FROM sites WHERE id = ?
		`).bind(trigger.site_id).first();

		if (!site) return null;

		// Determine optimization type based on trigger
		let optimizationType: string;
		let currentContent = 'Default content needs optimization';

		switch (trigger.suggested_action) {
			case 'optimize_conversion_elements':
				optimizationType = 'cta_buttons';
				currentContent = 'Get Started Today'; // Default CTA
				break;
			case 'improve_content_engagement':
				optimizationType = 'headlines';
				currentContent = site.name || 'Welcome to Our Business';
				break;
			case 'refresh_content_with_ai':
				optimizationType = 'descriptions';
				currentContent = site.original_description || 'Learn more about our services';
				break;
			default:
				optimizationType = 'headlines';
		}

		const jobId = crypto.randomUUID();
		const job: OptimizationJob = {
			id: jobId,
			siteId: trigger.site_id,
			status: 'pending',
			request: {
				siteId: trigger.site_id,
				optimizationType: optimizationType as any,
				currentContent: currentContent,
				businessType: site.business_type,
				primaryGoal: site.primary_goal,
				performanceData: trigger.trigger_data
			},
			createdAt: new Date().toISOString()
		};

		// Store job
		await env.DB_MAIN.prepare(`
			INSERT INTO content_optimization_jobs (
				id, site_id, optimization_type, current_content,
				business_type, primary_goal, performance_data,
				status, created_at, created_from_trigger
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`).bind(
			jobId,
			job.siteId,
			optimizationType,
			currentContent,
			site.business_type,
			site.primary_goal,
			JSON.stringify(trigger.trigger_data),
			'pending',
			job.createdAt,
			trigger.id
		).run();

		return job;

	} catch (error) {
		console.error('Error creating job from trigger:', error);
		return null;
	}
}

async function getOptimizationJobs(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const siteId = url.searchParams.get('siteId');
		const status = url.searchParams.get('status');
		const limit = parseInt(url.searchParams.get('limit') || '10');

		let query = `
			SELECT j.*, GROUP_CONCAT(v.content || '|' || v.confidence, ';;;') as variations
			FROM content_optimization_jobs j
			LEFT JOIN content_variations v ON j.id = v.job_id
		`;
		
		const params: any[] = [];
		const conditions: string[] = [];

		if (siteId) {
			conditions.push('j.site_id = ?');
			params.push(siteId);
		}

		if (status) {
			conditions.push('j.status = ?');
			params.push(status);
		}

		if (conditions.length > 0) {
			query += ' WHERE ' + conditions.join(' AND ');
		}

		query += ' GROUP BY j.id ORDER BY j.created_at DESC LIMIT ?';
		params.push(limit);

		const jobs = await env.DB_MAIN.prepare(query).bind(...params).all();

		return new Response(JSON.stringify({
			success: true,
			jobs: jobs.results
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error getting optimization jobs:', error);
		return new Response('Failed to get optimization jobs', { status: 500 });
	}
}