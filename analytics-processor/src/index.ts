/**
 * Code24 Analytics Processor Worker
 * Real-time analytics processing and optimization trigger engine
 */

interface Env {
	DB_ANALYTICS: D1Database;
	DB_MAIN: D1Database;
	ANALYTICS_STORAGE: R2Bucket;
	PLATFORM_NAME: string;
	ENVIRONMENT: string;
}

interface AnalyticsEvent {
	siteId: string;
	eventType: 'page_view' | 'conversion' | 'interaction' | 'form_submit' | 'button_click';
	eventCategory: 'engagement' | 'conversion' | 'navigation';
	goalType?: 'sales' | 'leads' | 'signups' | 'bookings' | 'traffic' | 'awareness';
	conversionValue?: number;
	isConversion?: boolean;
	visitorId: string;
	sessionId: string;
	pageUrl: string;
	userAgent?: string;
	referrer?: string;
	timestamp: number;
	metadata?: Record<string, any>;
}

interface OptimizationTrigger {
	siteId: string;
	triggerType: 'low_conversion' | 'high_bounce' | 'slow_performance' | 'content_refresh';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	suggestedAction: string;
	data: Record<string, any>;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// CORS headers for customer sites
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
				case '/track':
					if (request.method === 'POST') {
						return await handleAnalyticsEvent(request, env, ctx);
					}
					break;

				case '/aggregate':
					if (request.method === 'POST') {
						return await runAnalyticsAggregation(request, env, ctx);
					}
					break;

				case '/insights':
					if (request.method === 'GET') {
						return await getAnalyticsInsights(request, env);
					}
					break;

				case '/health':
					return new Response('Analytics Processor - Healthy', { 
						status: 200,
						headers: corsHeaders 
					});

				default:
					return new Response('Analytics Processor Ready', { 
						status: 200,
						headers: corsHeaders 
					});
			}

			return new Response('Method not allowed', { 
				status: 405,
				headers: corsHeaders 
			});

		} catch (error) {
			console.error('Analytics Processor Error:', error);
			return new Response('Internal Server Error', { 
				status: 500,
				headers: corsHeaders 
			});
		}
	},
};

async function handleAnalyticsEvent(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const event: AnalyticsEvent = await request.json();
		
		// Validate required fields
		if (!event.siteId || !event.eventType || !event.visitorId || !event.sessionId) {
			return new Response('Missing required fields', { status: 400 });
		}

		// Store raw event
		const eventId = crypto.randomUUID();
		await env.DB_ANALYTICS.prepare(`
			INSERT INTO analytics_events (
				id, site_id, event_type, event_category, goal_type,
				conversion_value, is_conversion, visitor_id, session_id,
				page_url, user_agent, referrer, event_data, created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`).bind(
			eventId,
			event.siteId,
			event.eventType,
			event.eventCategory,
			event.goalType || null,
			event.conversionValue || 0,
			event.isConversion || false,
			event.visitorId,
			event.sessionId,
			event.pageUrl,
			event.userAgent || '',
			event.referrer || '',
			JSON.stringify(event.metadata || {}),
			new Date().toISOString()
		).run();

		// Process event for real-time insights
		ctx.waitUntil(processEventForOptimization(event, env));

		return new Response(JSON.stringify({ 
			success: true, 
			eventId: eventId 
		}), {
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});

	} catch (error) {
		console.error('Error processing analytics event:', error);
		return new Response('Failed to process event', { status: 500 });
	}
}

async function processEventForOptimization(event: AnalyticsEvent, env: Env): Promise<void> {
	try {
		// Get site information
		const site = await env.DB_MAIN.prepare(`
			SELECT * FROM sites WHERE id = ?
		`).bind(event.siteId).first();

		if (!site) return;

		// Calculate recent performance metrics
		const recentMetrics = await calculateRecentMetrics(event.siteId, env);
		
		// Check for optimization triggers
		const triggers = await identifyOptimizationTriggers(site, recentMetrics, env);
		
		// Store triggers for processing by optimization workers
		for (const trigger of triggers) {
			await env.DB_ANALYTICS.prepare(`
				INSERT INTO optimization_triggers (
					id, site_id, trigger_type, priority, suggested_action, 
					trigger_data, created_at, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
			`).bind(
				crypto.randomUUID(),
				trigger.siteId,
				trigger.triggerType,
				trigger.priority,
				trigger.suggestedAction,
				JSON.stringify(trigger.data),
				new Date().toISOString()
			).run();
		}

	} catch (error) {
		console.error('Error processing optimization triggers:', error);
	}
}

async function calculateRecentMetrics(siteId: string, env: Env): Promise<any> {
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
	
	// Get recent analytics data
	const metrics = await env.DB_ANALYTICS.prepare(`
		SELECT 
			COUNT(*) as total_events,
			COUNT(DISTINCT visitor_id) as unique_visitors,
			COUNT(DISTINCT session_id) as sessions,
			AVG(CASE WHEN is_conversion = true THEN 1 ELSE 0 END) as conversion_rate,
			COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
			COUNT(CASE WHEN is_conversion = true THEN 1 END) as conversions
		FROM analytics_events 
		WHERE site_id = ? AND created_at > ?
	`).bind(siteId, oneDayAgo).first();

	return metrics || {
		total_events: 0,
		unique_visitors: 0,
		sessions: 0,
		conversion_rate: 0,
		page_views: 0,
		conversions: 0
	};
}

async function identifyOptimizationTriggers(site: any, metrics: any, env: Env): Promise<OptimizationTrigger[]> {
	const triggers: OptimizationTrigger[] = [];

	// Low conversion rate trigger
	if (metrics.sessions > 10 && metrics.conversion_rate < 0.02) {
		triggers.push({
			siteId: site.id,
			triggerType: 'low_conversion',
			priority: 'high',
			suggestedAction: 'optimize_conversion_elements',
			data: {
				current_rate: metrics.conversion_rate,
				sessions: metrics.sessions,
				goal_type: site.primary_goal
			}
		});
	}

	// High bounce rate (single page sessions)
	const bounceRate = metrics.sessions > 0 ? 
		(metrics.sessions - metrics.page_views + metrics.sessions) / metrics.sessions : 0;
	
	if (metrics.sessions > 5 && bounceRate > 0.7) {
		triggers.push({
			siteId: site.id,
			triggerType: 'high_bounce',
			priority: 'medium',
			suggestedAction: 'improve_content_engagement',
			data: {
				bounce_rate: bounceRate,
				sessions: metrics.sessions,
				business_type: site.business_type
			}
		});
	}

	// Content refresh needed (low engagement)
	if (metrics.unique_visitors > 20 && metrics.total_events / metrics.unique_visitors < 2) {
		triggers.push({
			siteId: site.id,
			triggerType: 'content_refresh',
			priority: 'medium',
			suggestedAction: 'refresh_content_with_ai',
			data: {
				engagement_ratio: metrics.total_events / metrics.unique_visitors,
				visitors: metrics.unique_visitors,
				business_type: site.business_type
			}
		});
	}

	return triggers;
}

async function runAnalyticsAggregation(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const { siteId, period = 'daily' } = await request.json();

		// Run aggregation for the specified period
		const aggregationResult = await performAggregation(siteId, period, env);

		return new Response(JSON.stringify({
			success: true,
			period: period,
			siteId: siteId,
			metrics: aggregationResult
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error running aggregation:', error);
		return new Response('Aggregation failed', { status: 500 });
	}
}

async function performAggregation(siteId: string, period: string, env: Env): Promise<any> {
	const startDate = getStartDateForPeriod(period);
	
	const aggregation = await env.DB_ANALYTICS.prepare(`
		SELECT 
			DATE(created_at) as date,
			COUNT(*) as total_events,
			COUNT(DISTINCT visitor_id) as unique_visitors,
			COUNT(DISTINCT session_id) as sessions,
			COUNT(CASE WHEN is_conversion = true THEN 1 END) as conversions,
			AVG(CASE WHEN is_conversion = true THEN conversion_value ELSE 0 END) as avg_conversion_value,
			COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views
		FROM analytics_events 
		WHERE site_id = ? AND created_at > ?
		GROUP BY DATE(created_at)
		ORDER BY date DESC
	`).bind(siteId, startDate).all();

	return aggregation.results;
}

function getStartDateForPeriod(period: string): string {
	const now = new Date();
	switch (period) {
		case 'hourly':
			return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
		case 'daily':
			return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
		case 'weekly':
			return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
		case 'monthly':
			return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
		default:
			return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
	}
}

async function getAnalyticsInsights(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const siteId = url.searchParams.get('siteId');
		
		if (!siteId) {
			return new Response('Missing siteId parameter', { status: 400 });
		}

		// Get current insights and optimization opportunities
		const insights = await generateInsights(siteId, env);

		return new Response(JSON.stringify(insights), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error generating insights:', error);
		return new Response('Failed to generate insights', { status: 500 });
	}
}

async function generateInsights(siteId: string, env: Env): Promise<any> {
	const recentMetrics = await calculateRecentMetrics(siteId, env);
	
	// Get pending optimization triggers
	const triggers = await env.DB_ANALYTICS.prepare(`
		SELECT * FROM optimization_triggers 
		WHERE site_id = ? AND status = 'pending'
		ORDER BY created_at DESC LIMIT 10
	`).bind(siteId).all();

	// Calculate performance trends
	const trends = await calculateTrends(siteId, env);

	return {
		siteId: siteId,
		current_metrics: recentMetrics,
		optimization_opportunities: triggers.results,
		performance_trends: trends,
		health_score: calculateHealthScore(recentMetrics, triggers.results),
		generated_at: new Date().toISOString()
	};
}

async function calculateTrends(siteId: string, env: Env): Promise<any> {
	// Calculate week-over-week trends
	const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
	const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

	const [currentWeek, previousWeek] = await Promise.all([
		env.DB_ANALYTICS.prepare(`
			SELECT COUNT(*) as events, COUNT(DISTINCT visitor_id) as visitors, 
			       AVG(CASE WHEN is_conversion = true THEN 1 ELSE 0 END) as conversion_rate
			FROM analytics_events 
			WHERE site_id = ? AND created_at > ?
		`).bind(siteId, oneWeekAgo).first(),
		
		env.DB_ANALYTICS.prepare(`
			SELECT COUNT(*) as events, COUNT(DISTINCT visitor_id) as visitors,
			       AVG(CASE WHEN is_conversion = true THEN 1 ELSE 0 END) as conversion_rate
			FROM analytics_events 
			WHERE site_id = ? AND created_at BETWEEN ? AND ?
		`).bind(siteId, twoWeeksAgo, oneWeekAgo).first()
	]);

	return {
		visitors_change: calculatePercentChange(currentWeek?.visitors || 0, previousWeek?.visitors || 0),
		events_change: calculatePercentChange(currentWeek?.events || 0, previousWeek?.events || 0),
		conversion_change: calculatePercentChange(currentWeek?.conversion_rate || 0, previousWeek?.conversion_rate || 0)
	};
}

function calculatePercentChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

function calculateHealthScore(metrics: any, triggers: any[]): number {
	let score = 100;
	
	// Deduct points for low conversion rate
	if (metrics.conversion_rate < 0.01) score -= 30;
	else if (metrics.conversion_rate < 0.02) score -= 15;
	
	// Deduct points for high priority triggers
	const highPriorityTriggers = triggers.filter(t => t.priority === 'high' || t.priority === 'urgent');
	score -= highPriorityTriggers.length * 10;
	
	// Deduct points for low engagement
	const engagementRatio = metrics.sessions > 0 ? metrics.total_events / metrics.sessions : 0;
	if (engagementRatio < 2) score -= 20;
	else if (engagementRatio < 3) score -= 10;
	
	return Math.max(0, Math.min(100, score));
}