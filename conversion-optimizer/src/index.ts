/**
 * Code24 Conversion Optimization Worker
 * Goal-specific conversion rate optimization and funnel analysis
 */

interface Env {
	DB_MAIN: D1Database;
	DB_ANALYTICS: D1Database;
	CONVERSION_STORAGE: R2Bucket;
	AI: Ai;
	PLATFORM_NAME: string;
	ENVIRONMENT: string;
}

interface ConversionAuditRequest {
	siteId: string;
	goalType: 'sales' | 'leads' | 'signups' | 'bookings' | 'traffic' | 'awareness';
	auditType: 'funnel' | 'elements' | 'flow' | 'complete';
	timeframe: '7d' | '30d' | '90d';
}

interface ConversionOpportunity {
	id: string;
	type: 'cta_optimization' | 'form_optimization' | 'flow_improvement' | 'urgency_tactics' | 'social_proof' | 'value_proposition' | 'scarcity_tactics' | 'authority_indicators' | 'reciprocity_triggers' | 'commitment_consistency';
	severity: 'critical' | 'high' | 'medium' | 'low';
	title: string;
	description: string;
	currentState: string;
	proposedSolution: string;
	expectedImpact: string;
	implementationEffort: 'low' | 'medium' | 'high';
	confidence: number;
	priority: number;
	psychologyPrinciple?: string; // The psychology principle being applied
	emotionalTrigger?: string; // Primary emotional trigger (fear, desire, trust, etc.)
	conversionGoalAlignment?: number; // 0-100 score for goal alignment
}

interface ConversionFunnel {
	step: string;
	visitors: number;
	conversions: number;
	conversionRate: number;
	dropoffRate: number;
	averageTime: number;
	issuesIdentified: string[];
}

interface ConversionStrategy {
	id: string;
	siteId: string;
	goalType: string;
	strategyType: string;
	tactics: ConversionTactic[];
	expectedLift: number;
	testDuration: number;
	implementation: 'immediate' | 'ab_test' | 'staged';
	status: 'draft' | 'testing' | 'implemented' | 'paused';
}

interface ConversionTactic {
	id: string;
	name: string;
	description: string;
	element: string;
	originalValue: string;
	optimizedValue: string;
	psychologyPrinciple: string;
	expectedImpact: number;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Server': 'Code24/1.0',
			'X-Powered-By': 'Code24 Conversion Engine'
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			switch (url.pathname) {
				case '/audit':
					if (request.method === 'POST') {
						return await performConversionAudit(request, env, ctx);
					}
					break;

				case '/optimize':
					if (request.method === 'POST') {
						return await createOptimizationStrategy(request, env, ctx);
					}
					break;

				case '/funnel-analysis':
					if (request.method === 'POST') {
						return await analyzeFunnel(request, env);
					}
					break;

				case '/element-optimization':
					if (request.method === 'POST') {
						return await optimizeElements(request, env, ctx);
					}
					break;

				case '/psychology-tactics':
					if (request.method === 'POST') {
						return await applyPsychologyTactics(request, env, ctx);
					}
					break;

				case '/process-triggers':
					if (request.method === 'POST') {
						return await processConversionTriggers(request, env, ctx);
					}
					break;

				case '/opportunities':
					if (request.method === 'GET') {
						return await getConversionOpportunities(request, env);
					}
					break;

				case '/strategies':
					if (request.method === 'GET') {
						return await getOptimizationStrategies(request, env);
					}
					break;

				case '/health':
					return new Response('Conversion Optimizer - Healthy', { 
						status: 200,
						headers: corsHeaders 
					});

				default:
					return new Response('Conversion Optimization Engine Ready', { 
						status: 200,
						headers: corsHeaders 
					});
			}

			return new Response('Method not allowed', { 
				status: 405,
				headers: corsHeaders 
			});

		} catch (error) {
			console.error('Conversion Optimizer Error:', error);
			return new Response('Internal Server Error', { 
				status: 500,
				headers: corsHeaders 
			});
		}
	},
};

async function performConversionAudit(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const auditRequest: ConversionAuditRequest = await request.json();
		
		if (!auditRequest.siteId || !auditRequest.goalType) {
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
			INSERT INTO conversion_audits (
				id, site_id, goal_type, audit_type, timeframe, status, created_at
			) VALUES (?, ?, ?, ?, ?, 'pending', ?)
		`).bind(
			auditId,
			auditRequest.siteId,
			auditRequest.goalType,
			auditRequest.auditType,
			auditRequest.timeframe,
			new Date().toISOString()
		).run();

		// Run audit asynchronously
		ctx.waitUntil(runConversionAudit(auditId, auditRequest, site, env));

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
		console.error('Error performing conversion audit:', error);
		return new Response('Failed to perform conversion audit', { status: 500 });
	}
}

async function runConversionAudit(auditId: string, auditRequest: ConversionAuditRequest, site: any, env: Env): Promise<void> {
	try {
		// Update audit status
		await env.DB_MAIN.prepare(`
			UPDATE conversion_audits SET status = 'processing' WHERE id = ?
		`).bind(auditId).run();

		// Get conversion data for analysis
		const conversionData = await getConversionData(auditRequest.siteId, auditRequest.timeframe, env);
		
		// Identify optimization opportunities
		const opportunities: ConversionOpportunity[] = [];

		if (auditRequest.auditType === 'funnel' || auditRequest.auditType === 'complete') {
			opportunities.push(...await auditConversionFunnel(conversionData, auditRequest.goalType, site));
		}

		if (auditRequest.auditType === 'elements' || auditRequest.auditType === 'complete') {
			opportunities.push(...await auditConversionElements(conversionData, auditRequest.goalType, site));
		}

		if (auditRequest.auditType === 'flow' || auditRequest.auditType === 'complete') {
			opportunities.push(...await auditUserFlow(conversionData, auditRequest.goalType, site));
		}

		// NEW: Psychology-based conversion optimization
		if (auditRequest.auditType === 'complete') {
			opportunities.push(...await auditPsychologyOptimization(conversionData, auditRequest.goalType, site, env));
		}

		// Store opportunities
		for (const opportunity of opportunities) {
			await env.DB_MAIN.prepare(`
				INSERT INTO conversion_opportunities (
					id, audit_id, site_id, type, severity, title, description,
					current_state, proposed_solution, expected_impact,
					implementation_effort, confidence, priority, status, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'identified', ?)
			`).bind(
				opportunity.id,
				auditId,
				auditRequest.siteId,
				opportunity.type,
				opportunity.severity,
				opportunity.title,
				opportunity.description,
				opportunity.currentState,
				opportunity.proposedSolution,
				opportunity.expectedImpact,
				opportunity.implementationEffort,
				opportunity.confidence,
				opportunity.priority,
				new Date().toISOString()
			).run();
		}

		// Calculate conversion score
		const conversionScore = calculateConversionScore(conversionData, opportunities);

		// Complete audit
		await env.DB_MAIN.prepare(`
			UPDATE conversion_audits 
			SET status = 'completed', opportunities_found = ?, conversion_score = ?, completed_at = ?
			WHERE id = ?
		`).bind(opportunities.length, conversionScore, new Date().toISOString(), auditId).run();

		// Auto-implement critical opportunities
		await autoImplementCriticalOptimizations(opportunities, auditRequest.siteId, env);

	} catch (error) {
		console.error('Error running conversion audit:', error);
		
		await env.DB_MAIN.prepare(`
			UPDATE conversion_audits SET status = 'failed' WHERE id = ?
		`).bind(auditId).run();
	}
}

async function getConversionData(siteId: string, timeframe: string, env: Env): Promise<any> {
	const daysBack = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
	const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

	// Get conversion metrics
	const [overallMetrics, funnelSteps, elementPerformance] = await Promise.all([
		env.DB_ANALYTICS.prepare(`
			SELECT 
				COUNT(*) as total_events,
				COUNT(DISTINCT visitor_id) as unique_visitors,
				COUNT(DISTINCT session_id) as sessions,
				COUNT(CASE WHEN is_conversion = true THEN 1 END) as conversions,
				AVG(CASE WHEN is_conversion = true THEN 1 ELSE 0 END) as conversion_rate,
				AVG(CASE WHEN is_conversion = true THEN conversion_value ELSE 0 END) as avg_conversion_value
			FROM analytics_events 
			WHERE site_id = ? AND created_at > ?
		`).bind(siteId, startDate).first(),

		env.DB_ANALYTICS.prepare(`
			SELECT 
				page_url,
				COUNT(DISTINCT visitor_id) as visitors,
				COUNT(CASE WHEN is_conversion = true THEN 1 END) as conversions,
				AVG(CASE WHEN is_conversion = true THEN 1 ELSE 0 END) as conversion_rate
			FROM analytics_events 
			WHERE site_id = ? AND created_at > ?
			GROUP BY page_url
			ORDER BY visitors DESC
		`).bind(siteId, startDate).all(),

		env.DB_ANALYTICS.prepare(`
			SELECT 
				event_type,
				COUNT(*) as events,
				COUNT(CASE WHEN is_conversion = true THEN 1 END) as conversions,
				AVG(CASE WHEN is_conversion = true THEN 1 ELSE 0 END) as conversion_rate
			FROM analytics_events 
			WHERE site_id = ? AND created_at > ?
			GROUP BY event_type
		`).bind(siteId, startDate).all()
	]);

	return {
		overall: overallMetrics,
		funnel: funnelSteps.results || [],
		elements: elementPerformance.results || []
	};
}

async function auditConversionFunnel(conversionData: any, goalType: string, site: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Analyze funnel dropoff points
	const funnelSteps = conversionData.funnel;
	let previousStepVisitors = 0;

	for (let i = 0; i < funnelSteps.length; i++) {
		const step = funnelSteps[i];
		
		if (i > 0) {
			const dropoffRate = ((previousStepVisitors - step.visitors) / previousStepVisitors) * 100;
			
			// High dropoff rate opportunity
			if (dropoffRate > 70) {
				opportunities.push({
					id: crypto.randomUUID(),
					type: 'flow_improvement',
					severity: 'critical',
					title: `High Dropoff at ${step.page_url}`,
					description: `${dropoffRate.toFixed(1)}% of users drop off at this step in the funnel.`,
					currentState: `${dropoffRate.toFixed(1)}% dropoff rate`,
					proposedSolution: 'Optimize page flow, reduce friction, improve value proposition',
					expectedImpact: `${Math.round(dropoffRate * 0.3)}% conversion improvement`,
					implementationEffort: 'medium',
					confidence: 85,
					priority: dropoffRate > 80 ? 95 : 75
				});
			}
		}
		
		previousStepVisitors = step.visitors;
	}

	// Low conversion rate opportunities
	const overallRate = conversionData.overall?.conversion_rate || 0;
	
	if (overallRate < getIndustryBenchmark(site.business_type, goalType) * 0.7) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'cta_optimization',
			severity: 'high',
			title: 'Below Industry Benchmark Conversion Rate',
			description: `Current conversion rate of ${(overallRate * 100).toFixed(2)}% is below industry average.`,
			currentState: `${(overallRate * 100).toFixed(2)}% conversion rate`,
			proposedSolution: 'Optimize CTAs, headlines, and value propositions',
			expectedImpact: '25-40% conversion improvement',
			implementationEffort: 'medium',
			confidence: 78,
			priority: 85
		});
	}

	return opportunities;
}

async function auditConversionElements(conversionData: any, goalType: string, site: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Analyze element performance
	const elements = conversionData.elements;
	
	// Find underperforming CTAs
	const ctaEvents = elements.filter((e: any) => e.event_type === 'button_click');
	
	ctaEvents.forEach((cta: any) => {
		if (cta.conversion_rate < 0.05) { // Less than 5% conversion
			opportunities.push({
				id: crypto.randomUUID(),
				type: 'cta_optimization',
				severity: 'medium',
				title: 'Low-Performing CTA Button',
				description: `CTA has only ${(cta.conversion_rate * 100).toFixed(1)}% conversion rate.`,
				currentState: `${(cta.conversion_rate * 100).toFixed(1)}% CTA conversion rate`,
				proposedSolution: 'Test different button colors, text, placement, and urgency',
				expectedImpact: '15-30% CTA improvement',
				implementationEffort: 'low',
				confidence: 72,
				priority: 60
			});
		}
	});

	// Form optimization opportunities
	const formEvents = elements.filter((e: any) => e.event_type === 'form_submit');
	
	if (formEvents.length > 0) {
		const avgFormConversion = formEvents.reduce((sum: number, form: any) => 
			sum + form.conversion_rate, 0) / formEvents.length;
		
		if (avgFormConversion < 0.8) { // Less than 80% form completion
			opportunities.push({
				id: crypto.randomUUID(),
				type: 'form_optimization',
				severity: 'high',
				title: 'Low Form Completion Rate',
				description: `Forms have ${(avgFormConversion * 100).toFixed(1)}% completion rate.`,
				currentState: `${(avgFormConversion * 100).toFixed(1)}% form completion`,
				proposedSolution: 'Reduce form fields, improve design, add progress indicators',
				expectedImpact: '20-35% form improvement',
				implementationEffort: 'medium',
				confidence: 82,
				priority: 80
			});
		}
	}

	return opportunities;
}

async function auditUserFlow(conversionData: any, goalType: string, site: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Analyze user flow patterns
	const pages = conversionData.funnel;
	
	// Find pages with no clear next action
	pages.forEach((page: any) => {
		if (page.conversion_rate < 0.02 && page.visitors > 50) {
			opportunities.push({
				id: crypto.randomUUID(),
				type: 'flow_improvement',
				severity: 'medium',
				title: 'Unclear User Journey',
				description: `Page ${page.page_url} has low engagement and unclear next steps.`,
				currentState: `${(page.conversion_rate * 100).toFixed(1)}% page conversion rate`,
				proposedSolution: 'Add clear CTAs, improve navigation, guide user journey',
				expectedImpact: '10-20% flow improvement',
				implementationEffort: 'medium',
				confidence: 65,
				priority: 55
			});
		}
	});

	return opportunities;
}

function getIndustryBenchmark(businessType: string, goalType: string): number {
	const benchmarks: Record<string, Record<string, number>> = {
		ecommerce: { sales: 0.025, traffic: 0.15 },
		lead_gen: { leads: 0.035, traffic: 0.08 },
		saas: { signups: 0.02, traffic: 0.12 },
		service: { leads: 0.03, bookings: 0.025 }
	};

	return benchmarks[businessType]?.[goalType] || 0.02;
}

function calculateConversionScore(conversionData: any, opportunities: ConversionOpportunity[]): number {
	let score = 100;

	// Deduct based on opportunities
	opportunities.forEach(opp => {
		switch (opp.severity) {
			case 'critical':
				score -= 25;
				break;
			case 'high':
				score -= 15;
				break;
			case 'medium':
				score -= 8;
				break;
			case 'low':
				score -= 3;
				break;
		}
	});

	// Bonus for good conversion rate
	const rate = conversionData.overall?.conversion_rate || 0;
	if (rate > 0.05) score += 10;
	if (rate > 0.08) score += 15;

	return Math.max(0, Math.min(100, score));
}

async function autoImplementCriticalOptimizations(opportunities: ConversionOpportunity[], siteId: string, env: Env): Promise<void> {
	const criticalOpportunities = opportunities.filter(opp => 
		opp.severity === 'critical' && 
		opp.implementationEffort === 'low'
	);

	for (const opportunity of criticalOpportunities) {
		try {
			// Create optimization strategy
			const strategyId = crypto.randomUUID();
			
			const strategy: ConversionStrategy = {
				id: strategyId,
				siteId: siteId,
				goalType: 'conversion',
				strategyType: opportunity.type,
				tactics: await generateOptimizationTactics(opportunity, env),
				expectedLift: parseInt(opportunity.expectedImpact) || 15,
				testDuration: 14,
				implementation: 'ab_test',
				status: 'testing'
			};

			await env.DB_MAIN.prepare(`
				INSERT INTO conversion_strategies (
					id, site_id, goal_type, strategy_type, tactics_json,
					expected_lift, test_duration, implementation, status, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).bind(
				strategyId,
				strategy.siteId,
				strategy.goalType,
				strategy.strategyType,
				JSON.stringify(strategy.tactics),
				strategy.expectedLift,
				strategy.testDuration,
				strategy.implementation,
				strategy.status,
				new Date().toISOString()
			).run();

			console.log(`Auto-created optimization strategy for: ${opportunity.title}`);

		} catch (error) {
			console.error('Error auto-implementing optimization:', error);
		}
	}
}

async function generateOptimizationTactics(opportunity: ConversionOpportunity, env: Env): Promise<ConversionTactic[]> {
	const tactics: ConversionTactic[] = [];

	// Generate AI-powered tactics based on opportunity type
	const prompt = `Generate specific conversion optimization tactics for this opportunity:

Type: ${opportunity.type}
Issue: ${opportunity.title}
Current State: ${opportunity.currentState}
Proposed Solution: ${opportunity.proposedSolution}

Generate 3 specific, actionable tactics with:
1. Element to change
2. Original value (current)
3. Optimized value (improved)
4. Psychology principle applied
5. Expected impact percentage

Focus on proven conversion psychology principles like urgency, social proof, scarcity, and clarity.`;

	try {
		const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
			messages: [
				{
					role: 'system',
					content: 'You are a conversion optimization expert. Generate specific, actionable tactics based on proven psychology principles.'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			max_tokens: 400
		});

		// Parse AI response into tactics (simplified for this example)
		const tacticLines = aiResponse.response.split('\n').filter(line => line.trim());
		
		for (let i = 0; i < Math.min(3, tacticLines.length); i++) {
			tactics.push({
				id: crypto.randomUUID(),
				name: `Tactic ${i + 1}`,
				description: tacticLines[i] || 'AI-generated optimization tactic',
				element: getElementFromType(opportunity.type),
				originalValue: 'Current implementation',
				optimizedValue: 'Optimized implementation',
				psychologyPrinciple: getPsychologyPrinciple(opportunity.type),
				expectedImpact: 15 + (i * 5)
			});
		}

	} catch (error) {
		console.error('Error generating tactics:', error);
		
		// Fallback tactics
		tactics.push({
			id: crypto.randomUUID(),
			name: 'Primary Optimization',
			description: opportunity.proposedSolution,
			element: getElementFromType(opportunity.type),
			originalValue: opportunity.currentState,
			optimizedValue: 'Improved implementation',
			psychologyPrinciple: getPsychologyPrinciple(opportunity.type),
			expectedImpact: parseInt(opportunity.expectedImpact) || 15
		});
	}

	return tactics;
}

function getElementFromType(type: string): string {
	const elements: Record<string, string> = {
		cta_optimization: 'CTA Button',
		form_optimization: 'Form Fields',
		flow_improvement: 'Page Flow',
		urgency_tactics: 'Urgency Elements',
		social_proof: 'Social Proof',
		value_proposition: 'Value Proposition'
	};
	
	return elements[type] || 'Page Element';
}

function getPsychologyPrinciple(type: string): string {
	const principles: Record<string, string> = {
		cta_optimization: 'Action-oriented language and urgency',
		form_optimization: 'Reduced cognitive load',
		flow_improvement: 'Clear progression and guidance',
		urgency_tactics: 'Scarcity and time sensitivity',
		social_proof: 'Social validation and trust',
		value_proposition: 'Clear benefits and value'
	};
	
	return principles[type] || 'Conversion psychology';
}

async function createOptimizationStrategy(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const { siteId, opportunityIds, customTactics } = await request.json();

		if (!siteId || (!opportunityIds && !customTactics)) {
			return new Response('Missing required fields', { status: 400 });
		}

		const strategyId = crypto.randomUUID();
		let tactics: ConversionTactic[] = [];

		// Generate tactics from opportunities
		if (opportunityIds && Array.isArray(opportunityIds)) {
			for (const oppId of opportunityIds) {
				const opportunity = await env.DB_MAIN.prepare(`
					SELECT * FROM conversion_opportunities WHERE id = ?
				`).bind(oppId).first();

				if (opportunity) {
					const oppTactics = await generateOptimizationTactics(opportunity, env);
					tactics.push(...oppTactics);
				}
			}
		}

		// Add custom tactics
		if (customTactics && Array.isArray(customTactics)) {
			tactics.push(...customTactics);
		}

		// Create strategy
		const strategy: ConversionStrategy = {
			id: strategyId,
			siteId: siteId,
			goalType: 'conversion',
			strategyType: 'comprehensive',
			tactics: tactics,
			expectedLift: tactics.reduce((sum, tactic) => sum + tactic.expectedImpact, 0) / tactics.length,
			testDuration: 21,
			implementation: 'ab_test',
			status: 'draft'
		};

		await env.DB_MAIN.prepare(`
			INSERT INTO conversion_strategies (
				id, site_id, goal_type, strategy_type, tactics_json,
				expected_lift, test_duration, implementation, status, created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`).bind(
			strategyId,
			strategy.siteId,
			strategy.goalType,
			strategy.strategyType,
			JSON.stringify(strategy.tactics),
			strategy.expectedLift,
			strategy.testDuration,
			strategy.implementation,
			strategy.status,
			new Date().toISOString()
		).run();

		return new Response(JSON.stringify({
			success: true,
			strategyId: strategyId,
			tactics: tactics.length,
			expectedLift: strategy.expectedLift
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error creating optimization strategy:', error);
		return new Response('Failed to create optimization strategy', { status: 500 });
	}
}

async function processConversionTriggers(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		// Get pending conversion optimization triggers
		const triggers = await env.DB_ANALYTICS.prepare(`
			SELECT * FROM optimization_triggers 
			WHERE status = 'pending' AND suggested_action IN ('optimize_conversion_elements', 'improve_conversion_flow')
			ORDER BY priority DESC, created_at ASC
			LIMIT 10
		`).all();

		const processedTriggers = [];

		for (const trigger of triggers.results || []) {
			try {
				// Mark trigger as processing
				await env.DB_ANALYTICS.prepare(`
					UPDATE optimization_triggers 
					SET status = 'processing', assigned_worker = 'conversion-optimizer'
					WHERE id = ?
				`).bind(trigger.id).run();

				// Create conversion audit
				const auditRequest: ConversionAuditRequest = {
					siteId: trigger.site_id,
					goalType: trigger.trigger_data?.goal_type || 'leads',
					auditType: 'elements',
					timeframe: '30d'
				};

				ctx.waitUntil(performConversionAuditFromTrigger(auditRequest, trigger, env));
				processedTriggers.push(trigger.id);

			} catch (error) {
				console.error('Error processing conversion trigger:', trigger.id, error);
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
		console.error('Error processing conversion triggers:', error);
		return new Response('Failed to process conversion triggers', { status: 500 });
	}
}

async function performConversionAuditFromTrigger(auditRequest: ConversionAuditRequest, trigger: any, env: Env): Promise<void> {
	const site = await env.DB_MAIN.prepare(`
		SELECT * FROM sites WHERE id = ?
	`).bind(auditRequest.siteId).first();

	if (site) {
		await runConversionAudit(crypto.randomUUID(), auditRequest, site, env);
		
		await env.DB_ANALYTICS.prepare(`
			UPDATE optimization_triggers 
			SET status = 'completed'
			WHERE id = ?
		`).bind(trigger.id).run();
	}
}

async function getConversionOpportunities(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const siteId = url.searchParams.get('siteId');
		const severity = url.searchParams.get('severity');
		const status = url.searchParams.get('status') || 'identified';

		if (!siteId) {
			return new Response('Missing siteId parameter', { status: 400 });
		}

		let query = `
			SELECT * FROM conversion_opportunities 
			WHERE site_id = ? AND status = ?
		`;
		const params = [siteId, status];

		if (severity) {
			query += ' AND severity = ?';
			params.push(severity);
		}

		query += ' ORDER BY priority DESC, created_at DESC LIMIT 20';

		const opportunities = await env.DB_MAIN.prepare(query).bind(...params).all();

		return new Response(JSON.stringify({
			success: true,
			opportunities: opportunities.results || []
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error getting conversion opportunities:', error);
		return new Response('Failed to get conversion opportunities', { status: 500 });
	}
}

// =================================================================
// PSYCHOLOGY-BASED CONVERSION OPTIMIZATION (PRD Features)
// =================================================================

async function auditPsychologyOptimization(conversionData: any, goalType: string, site: any, env: Env): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Analyze current site for psychology triggers
	const siteContent = await fetchSiteContent(site.primary_domain);
	
	// 1. URGENCY TACTICS ANALYSIS
	const urgencyOpportunities = await analyzeUrgencyTactics(siteContent, goalType, conversionData);
	opportunities.push(...urgencyOpportunities);

	// 2. SCARCITY TACTICS ANALYSIS  
	const scarcityOpportunities = await analyzeScarcityTactics(siteContent, goalType, conversionData);
	opportunities.push(...scarcityOpportunities);

	// 3. SOCIAL PROOF ANALYSIS
	const socialProofOpportunities = await analyzeSocialProof(siteContent, goalType, conversionData);
	opportunities.push(...socialProofOpportunities);

	// 4. AUTHORITY INDICATORS ANALYSIS
	const authorityOpportunities = await analyzeAuthorityIndicators(siteContent, goalType, site);
	opportunities.push(...authorityOpportunities);

	// 5. RECIPROCITY TRIGGERS ANALYSIS
	const reciprocityOpportunities = await analyzeReciprocityTriggers(siteContent, goalType, conversionData);
	opportunities.push(...reciprocityOpportunities);

	// 6. COMMITMENT & CONSISTENCY ANALYSIS
	const commitmentOpportunities = await analyzeCommitmentConsistency(siteContent, goalType, conversionData);
	opportunities.push(...commitmentOpportunities);

	return opportunities;
}

async function analyzeUrgencyTactics(content: string, goalType: string, conversionData: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Check for existing urgency language
	const urgencyWords = ['limited time', 'expires', 'deadline', 'hurry', 'ending soon', 'act now', 'don\'t wait'];
	const hasUrgency = urgencyWords.some(word => content.toLowerCase().includes(word));

	if (!hasUrgency) {
		const urgencyTactic = getUrgencyTacticForGoal(goalType);
		
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'urgency_tactics',
			severity: 'high',
			title: 'Missing Urgency Triggers',
			description: 'Site lacks urgency language that motivates immediate action',
			currentState: 'No urgency indicators detected',
			proposedSolution: urgencyTactic.solution,
			expectedImpact: urgencyTactic.expectedImpact,
			implementationEffort: 'low',
			confidence: 85,
			priority: 8,
			psychologyPrinciple: 'Loss Aversion & Time Pressure',
			emotionalTrigger: 'Fear of missing out (FOMO)',
			conversionGoalAlignment: 90
		});
	}

	// Check for countdown timers or time-sensitive offers
	const hasCountdown = content.includes('countdown') || content.match(/\d+:\d+:\d+/);
	
	if (!hasCountdown && (goalType === 'sales' || goalType === 'signups')) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'urgency_tactics',
			severity: 'medium',
			title: 'Missing Countdown Elements',
			description: 'Countdown timers create powerful urgency for time-sensitive offers',
			currentState: 'No countdown timers detected',
			proposedSolution: 'Add countdown timer for special offers or limited-time promotions',
			expectedImpact: '15-25% increase in conversion rate during promotional periods',
			implementationEffort: 'medium',
			confidence: 75,
			priority: 6,
			psychologyPrinciple: 'Temporal Motivation Theory',
			emotionalTrigger: 'Time pressure anxiety',
			conversionGoalAlignment: 80
		});
	}

	return opportunities;
}

async function analyzeScarcityTactics(content: string, goalType: string, conversionData: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Check for scarcity language
	const scarcityWords = ['limited', 'exclusive', 'only', 'few left', 'running out', 'rare', 'one of a kind'];
	const hasScarcity = scarcityWords.some(word => content.toLowerCase().includes(word));

	if (!hasScarcity) {
		const scarcityTactic = getScarcityTacticForGoal(goalType);
		
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'scarcity_tactics',
			severity: 'high',
			title: 'Missing Scarcity Indicators',
			description: 'Scarcity creates desire and motivates action through perceived rarity',
			currentState: 'No scarcity language detected',
			proposedSolution: scarcityTactic.solution,
			expectedImpact: scarcityTactic.expectedImpact,
			implementationEffort: 'low',
			confidence: 80,
			priority: 7,
			psychologyPrinciple: 'Scarcity Principle',
			emotionalTrigger: 'Desire for exclusive access',
			conversionGoalAlignment: 85
		});
	}

	// Check for inventory or availability indicators
	const hasInventory = content.includes('in stock') || content.includes('available') || content.match(/\d+\s+left/);
	
	if (!hasInventory && goalType === 'sales') {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'scarcity_tactics',
			severity: 'medium',
			title: 'Missing Inventory Indicators',
			description: 'Stock levels create urgency and scarcity for product purchases',
			currentState: 'No inventory status shown',
			proposedSolution: 'Display real-time inventory levels ("Only 3 left in stock")',
			expectedImpact: '10-20% increase in purchase conversion for products',
			implementationEffort: 'medium',
			confidence: 70,
			priority: 5,
			psychologyPrinciple: 'Availability Heuristic',
			emotionalTrigger: 'Fear of unavailability',
			conversionGoalAlignment: 75
		});
	}

	return opportunities;
}

async function analyzeSocialProof(content: string, goalType: string, conversionData: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Check for testimonials
	const hasTestimonials = content.toLowerCase().includes('testimonial') || 
	                       content.toLowerCase().includes('review') ||
	                       content.match(/"[^"]*" - [A-Z][a-z]+ [A-Z]/);

	if (!hasTestimonials) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'social_proof',
			severity: 'critical',
			title: 'Missing Customer Testimonials',
			description: 'Testimonials provide social validation and build trust with prospects',
			currentState: 'No customer testimonials visible',
			proposedSolution: 'Add 3-5 compelling customer testimonials with names and photos',
			expectedImpact: '25-40% increase in trust and conversion rates',
			implementationEffort: 'medium',
			confidence: 90,
			priority: 9,
			psychologyPrinciple: 'Social Proof',
			emotionalTrigger: 'Trust through peer validation',
			conversionGoalAlignment: 95
		});
	}

	// Check for customer counts or user numbers
	const hasUserCounts = content.match(/\d+(?:,\d+)*\+?\s+(?:customers?|users?|members?|clients?)/i);
	
	if (!hasUserCounts) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'social_proof',
			severity: 'high',
			title: 'Missing Customer Count Indicators',
			description: 'Large customer numbers demonstrate popularity and trustworthiness',
			currentState: 'No customer count displayed',
			proposedSolution: 'Display customer count prominently ("Join 10,000+ satisfied customers")',
			expectedImpact: '15-30% increase in signup/purchase confidence',
			implementationEffort: 'low',
			confidence: 85,
			priority: 7,
			psychologyPrinciple: 'Bandwagon Effect',
			emotionalTrigger: 'Desire to join popular choice',
			conversionGoalAlignment: 80
		});
	}

	// Check for recent activity indicators
	const hasActivityIndicators = content.includes('recently purchased') || 
	                             content.includes('someone just') ||
	                             content.match(/\d+\s+people\s+(viewing|looking|interested)/);

	if (!hasActivityIndicators && (goalType === 'sales' || goalType === 'signups')) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'social_proof',
			severity: 'medium',
			title: 'Missing Live Activity Indicators',
			description: 'Real-time activity creates urgency and social validation',
			currentState: 'No recent activity shown',
			proposedSolution: 'Add live activity feed ("John from NYC just purchased" or "5 people viewing this")',
			expectedImpact: '12-25% increase in conversion through social urgency',
			implementationEffort: 'medium',
			confidence: 75,
			priority: 6,
			psychologyPrinciple: 'Social Proof + Urgency',
			emotionalTrigger: 'FOMO from peer activity',
			conversionGoalAlignment: 85
		});
	}

	return opportunities;
}

async function analyzeAuthorityIndicators(content: string, goalType: string, site: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Check for credentials and certifications
	const authorityWords = ['certified', 'licensed', 'accredited', 'award', 'expert', 'specialist', 'years of experience'];
	const hasAuthority = authorityWords.some(word => content.toLowerCase().includes(word));

	if (!hasAuthority) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'authority_indicators',
			severity: 'high',
			title: 'Missing Authority Credentials',
			description: 'Authority indicators build trust and justify higher prices/commitments',
			currentState: 'No credentials or authority markers visible',
			proposedSolution: 'Display certifications, years of experience, awards, or industry recognition',
			expectedImpact: '20-35% increase in trust and premium positioning',
			implementationEffort: 'low',
			confidence: 85,
			priority: 8,
			psychologyPrinciple: 'Authority Principle',
			emotionalTrigger: 'Trust in expertise',
			conversionGoalAlignment: 90
		});
	}

	// Check for media mentions or press coverage
	const hasMediaMentions = content.toLowerCase().includes('featured in') || 
	                        content.toLowerCase().includes('as seen on') ||
	                        content.includes('press');

	if (!hasMediaMentions) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'authority_indicators',
			severity: 'medium',
			title: 'Missing Media Validation',
			description: 'Media mentions and press coverage significantly boost credibility',
			currentState: 'No media mentions or press coverage displayed',
			proposedSolution: 'Add "As Seen On" section with logos of media outlets or industry publications',
			expectedImpact: '15-25% increase in credibility and conversion rates',
			implementationEffort: 'low',
			confidence: 80,
			priority: 6,
			psychologyPrinciple: 'Authority + Social Proof',
			emotionalTrigger: 'Trust through media validation',
			conversionGoalAlignment: 75
		});
	}

	return opportunities;
}

async function analyzeReciprocityTriggers(content: string, goalType: string, conversionData: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Check for free offers or value-first content
	const hasFreeOffers = content.toLowerCase().includes('free') || 
	                     content.toLowerCase().includes('no cost') ||
	                     content.toLowerCase().includes('complimentary');

	if (!hasFreeOffers && (goalType === 'leads' || goalType === 'signups')) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'reciprocity_triggers',
			severity: 'high',
			title: 'Missing Free Value Offers',
			description: 'Free offers trigger reciprocity - people feel obligated to give back',
			currentState: 'No free offers or value-first content',
			proposedSolution: 'Add free consultation, guide, tool, or assessment before asking for commitment',
			expectedImpact: '30-50% increase in lead generation and email signups',
			implementationEffort: 'medium',
			confidence: 85,
			priority: 8,
			psychologyPrinciple: 'Reciprocity Principle',
			emotionalTrigger: 'Obligation to return favor',
			conversionGoalAlignment: 90
		});
	}

	// Check for helpful content or resources
	const hasHelpfulContent = content.toLowerCase().includes('guide') || 
	                         content.toLowerCase().includes('tips') ||
	                         content.toLowerCase().includes('how to');

	if (!hasHelpfulContent) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'reciprocity_triggers',
			severity: 'medium',
			title: 'Missing Helpful Content',
			description: 'Providing valuable content first builds goodwill and reciprocity',
			currentState: 'No educational or helpful content visible',
			proposedSolution: 'Add helpful guides, tips, or educational content relevant to your audience',
			expectedImpact: '20-30% increase in engagement and trust building',
			implementationEffort: 'high',
			confidence: 75,
			priority: 5,
			psychologyPrinciple: 'Reciprocity + Value Creation',
			emotionalTrigger: 'Gratitude for helpful information',
			conversionGoalAlignment: 80
		});
	}

	return opportunities;
}

async function analyzeCommitmentConsistency(content: string, goalType: string, conversionData: any): Promise<ConversionOpportunity[]> {
	const opportunities: ConversionOpportunity[] = [];

	// Check for small commitment requests before big asks
	const hasProgressiveCommitment = content.includes('step 1') || 
	                                content.includes('first') ||
	                                content.match(/\d+\s+step/);

	if (!hasProgressiveCommitment && (goalType === 'sales' || goalType === 'signups')) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'commitment_consistency',
			severity: 'medium',
			title: 'Missing Progressive Commitment Strategy',
			description: 'Small commitments lead to larger ones through consistency principle',
			currentState: 'Large commitment requested immediately',
			proposedSolution: 'Break conversion into smaller steps: email → demo → trial → purchase',
			expectedImpact: '25-40% increase in completion rates through micro-commitments',
			implementationEffort: 'high',
			confidence: 80,
			priority: 7,
			psychologyPrinciple: 'Commitment & Consistency',
			emotionalTrigger: 'Desire to be consistent with previous actions',
			conversionGoalAlignment: 85
		});
	}

	// Check for identity-based messaging
	const hasIdentityMessaging = content.includes('people like you') || 
	                           content.includes('professionals who') ||
	                           content.match(/for\s+\w+\s+who\s+want/);

	if (!hasIdentityMessaging) {
		opportunities.push({
			id: crypto.randomUUID(),
			type: 'commitment_consistency',
			severity: 'medium',
			title: 'Missing Identity-Based Messaging',
			description: 'People act consistently with how they see themselves',
			currentState: 'Generic messaging not tied to identity',
			proposedSolution: 'Use identity-based copy: "For professionals who value excellence" or "Smart business owners choose..."',
			expectedImpact: '15-25% increase in conversion through identity alignment',
			implementationEffort: 'low',
			confidence: 75,
			priority: 6,
			psychologyPrinciple: 'Identity Consistency',
			emotionalTrigger: 'Desire to maintain self-image',
			conversionGoalAlignment: 80
		});
	}

	return opportunities;
}

// Helper functions for psychology tactics
function getUrgencyTacticForGoal(goalType: string): { solution: string; expectedImpact: string } {
	const tactics = {
		sales: {
			solution: 'Add "Limited time offer - Sale ends in 48 hours" to product pages',
			expectedImpact: '20-35% increase in purchase conversion during promotional periods'
		},
		leads: {
			solution: 'Add "Free consultation spots filling up - Book yours today" to contact forms',
			expectedImpact: '25-40% increase in consultation requests'
		},
		signups: {
			solution: 'Add "Join now - Early access ends soon" to signup forms',
			expectedImpact: '30-45% increase in signup conversion rates'
		},
		bookings: {
			solution: 'Add "Book today - Limited availability this month" to booking widgets',
			expectedImpact: '35-50% increase in booking completion rates'
		},
		default: {
			solution: 'Add time-sensitive language to primary call-to-action areas',
			expectedImpact: '20-30% increase in conversion rates'
		}
	};
	
	return tactics[goalType] || tactics.default;
}

function getScarcityTacticForGoal(goalType: string): { solution: string; expectedImpact: string } {
	const tactics = {
		sales: {
			solution: 'Display "Only 3 left in stock" or "Limited edition" on product pages',
			expectedImpact: '15-30% increase in purchase urgency and conversion'
		},
		leads: {
			solution: 'Add "Exclusive consultation - Limited to 10 clients per month"',
			expectedImpact: '20-35% increase in perceived value and inquiries'
		},
		signups: {
			solution: 'Add "Exclusive access - Limited to first 100 members"',
			expectedImpact: '25-40% increase in signup rates through exclusivity'
		},
		bookings: {
			solution: 'Show "Only 2 appointments available this week"',
			expectedImpact: '30-45% increase in immediate booking actions'
		},
		default: {
			solution: 'Add scarcity language to create perceived rarity and value',
			expectedImpact: '20-30% increase in conversion rates'
		}
	};
	
	return tactics[goalType] || tactics.default;
}

async function fetchSiteContent(domain: string): Promise<string> {
	try {
		const response = await fetch(`https://${domain}`, {
			headers: { 'User-Agent': 'Code24-ConversionBot/1.0' }
		});
		return await response.text();
	} catch (error) {
		console.error('Error fetching site content:', error);
		return '';
	}
}

async function getOptimizationStrategies(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const siteId = url.searchParams.get('siteId');
		const status = url.searchParams.get('status');

		if (!siteId) {
			return new Response('Missing siteId parameter', { status: 400 });
		}

		let query = `SELECT * FROM conversion_strategies WHERE site_id = ?`;
		const params = [siteId];

		if (status) {
			query += ' AND status = ?';
			params.push(status);
		}

		query += ' ORDER BY created_at DESC LIMIT 10';

		const strategies = await env.DB_MAIN.prepare(query).bind(...params).all();

		return new Response(JSON.stringify({
			success: true,
			strategies: strategies.results || []
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error getting optimization strategies:', error);
		return new Response('Failed to get optimization strategies', { status: 500 });
	}
}

// Placeholder implementations for remaining endpoints
async function analyzeFunnel(request: Request, env: Env): Promise<Response> {
	return new Response(JSON.stringify({ success: true, message: 'Funnel analysis endpoint' }), {
		headers: { 'Content-Type': 'application/json' }
	});
}

async function optimizeElements(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	return new Response(JSON.stringify({ success: true, message: 'Element optimization endpoint' }), {
		headers: { 'Content-Type': 'application/json' }
	});
}

async function applyPsychologyTactics(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	return new Response(JSON.stringify({ success: true, message: 'Psychology tactics endpoint' }), {
		headers: { 'Content-Type': 'application/json' }
	});
}