/**
 * Code24 A/B Testing Engine Worker
 * Automated A/B testing with statistical significance and optimization
 */

interface Env {
	DB_MAIN: D1Database;
	DB_ANALYTICS: D1Database;
	TEST_STORAGE: R2Bucket;
	PLATFORM_NAME: string;
	ENVIRONMENT: string;
}

interface ABTest {
	id: string;
	siteId: string;
	testName: string;
	testType: string;
	controlContent: string;
	variantContent: string;
	trafficSplit: { control: number; variant: number };
	startDate: string;
	endDate?: string;
	status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
	winnerVariant?: 'control' | 'variant';
	confidenceLevel?: number;
	statisticalSignificance?: number;
	controlConversions: number;
	variantConversions: number;
	controlVisitors: number;
	variantVisitors: number;
	improvementPercentage?: number;
}

interface TestResult {
	testId: string;
	variant: 'control' | 'variant';
	visitorId: string;
	sessionId: string;
	converted: boolean;
	conversionValue: number;
	timestamp: string;
}

interface StatisticalAnalysis {
	testId: string;
	controlRate: number;
	variantRate: number;
	improvementPercentage: number;
	confidenceLevel: number;
	statisticalSignificance: number;
	sampleSize: number;
	isSignificant: boolean;
	recommendedAction: 'continue' | 'declare_winner' | 'stop_test';
	minSampleSize: number;
	daysToSignificance?: number;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			switch (url.pathname) {
				case '/create-test':
					if (request.method === 'POST') {
						return await createABTest(request, env);
					}
					break;

				case '/record-result':
					if (request.method === 'POST') {
						return await recordTestResult(request, env);
					}
					break;

				case '/analyze-tests':
					if (request.method === 'POST') {
						return await analyzeActiveTests(request, env, ctx);
					}
					break;

				case '/get-variant':
					if (request.method === 'POST') {
						return await getTestVariant(request, env);
					}
					break;

				case '/test-results':
					if (request.method === 'GET') {
						return await getTestResults(request, env);
					}
					break;

				case '/pause-test':
					if (request.method === 'PUT') {
						return await pauseTest(request, env);
					}
					break;

				case '/health':
					return new Response('A/B Testing Engine - Healthy', { 
						status: 200,
						headers: corsHeaders 
					});

				default:
					return new Response('A/B Testing Engine Ready', { 
						status: 200,
						headers: corsHeaders 
					});
			}

			return new Response('Method not allowed', { 
				status: 405,
				headers: corsHeaders 
			});

		} catch (error) {
			console.error('A/B Test Worker Error:', error);
			return new Response('Internal Server Error', { 
				status: 500,
				headers: corsHeaders 
			});
		}
	},
};

async function createABTest(request: Request, env: Env): Promise<Response> {
	try {
		const testData = await request.json();
		
		// Validate required fields
		if (!testData.siteId || !testData.testName || !testData.controlContent || !testData.variantContent) {
			return new Response('Missing required fields', { status: 400 });
		}

		const testId = crypto.randomUUID();
		const trafficSplit = testData.trafficSplit || { control: 50, variant: 50 };

		// Create A/B test
		await env.DB_MAIN.prepare(`
			INSERT INTO ab_tests (
				id, site_id, test_name, test_type, control_content, variant_content,
				traffic_split, start_date, status, control_conversions, variant_conversions,
				control_visitors, variant_visitors, created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, 0, 0, 0, ?)
		`).bind(
			testId,
			testData.siteId,
			testData.testName,
			testData.testType || 'content',
			testData.controlContent,
			testData.variantContent,
			JSON.stringify(trafficSplit),
			new Date().toISOString(),
			new Date().toISOString()
		).run();

		return new Response(JSON.stringify({
			success: true,
			testId: testId,
			status: 'active',
			trafficSplit: trafficSplit
		}), {
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});

	} catch (error) {
		console.error('Error creating A/B test:', error);
		return new Response('Failed to create A/B test', { status: 500 });
	}
}

async function getTestVariant(request: Request, env: Env): Promise<Response> {
	try {
		const { siteId, visitorId, testType } = await request.json();
		
		if (!siteId || !visitorId) {
			return new Response('Missing required fields', { status: 400 });
		}

		// Get active tests for this site
		const activeTests = await env.DB_MAIN.prepare(`
			SELECT * FROM ab_tests 
			WHERE site_id = ? AND status = 'active'
			${testType ? 'AND test_type = ?' : ''}
			ORDER BY created_at DESC
		`).bind(siteId, ...(testType ? [testType] : [])).all();

		if (!activeTests.results || activeTests.results.length === 0) {
			return new Response(JSON.stringify({
				variant: 'control',
				content: null,
				testId: null
			}), {
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Use first active test (most recent)
		const test = activeTests.results[0] as any;
		const trafficSplit = JSON.parse(test.traffic_split);

		// Determine variant based on visitor ID hash
		const variant = getVariantForVisitor(visitorId, trafficSplit);
		const content = variant === 'control' ? test.control_content : test.variant_content;

		// Record visitor assignment
		await recordVisitorAssignment(test.id, visitorId, variant, env);

		return new Response(JSON.stringify({
			variant: variant,
			content: content,
			testId: test.id,
			testName: test.test_name
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error getting test variant:', error);
		return new Response('Failed to get test variant', { status: 500 });
	}
}

function getVariantForVisitor(visitorId: string, trafficSplit: { control: number; variant: number }): 'control' | 'variant' {
	// Create deterministic hash of visitor ID
	let hash = 0;
	for (let i = 0; i < visitorId.length; i++) {
		const char = visitorId.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	
	// Convert to positive number between 0-100
	const percentage = Math.abs(hash) % 100;
	
	// Assign variant based on traffic split
	return percentage < trafficSplit.control ? 'control' : 'variant';
}

async function recordVisitorAssignment(testId: string, visitorId: string, variant: 'control' | 'variant', env: Env): Promise<void> {
	try {
		// Check if visitor already assigned to this test
		const existing = await env.DB_MAIN.prepare(`
			SELECT id FROM test_assignments 
			WHERE test_id = ? AND visitor_id = ?
		`).bind(testId, visitorId).first();

		if (!existing) {
			// Record new assignment
			await env.DB_MAIN.prepare(`
				INSERT INTO test_assignments (
					id, test_id, visitor_id, variant, assigned_at
				) VALUES (?, ?, ?, ?, ?)
			`).bind(
				crypto.randomUUID(),
				testId,
				visitorId,
				variant,
				new Date().toISOString()
			).run();

			// Update visitor count
			const field = variant === 'control' ? 'control_visitors' : 'variant_visitors';
			await env.DB_MAIN.prepare(`
				UPDATE ab_tests 
				SET ${field} = ${field} + 1, updated_at = ?
				WHERE id = ?
			`).bind(new Date().toISOString(), testId).run();
		}

	} catch (error) {
		console.error('Error recording visitor assignment:', error);
	}
}

async function recordTestResult(request: Request, env: Env): Promise<Response> {
	try {
		const resultData: TestResult = await request.json();
		
		if (!resultData.testId || !resultData.visitorId || !resultData.variant) {
			return new Response('Missing required fields', { status: 400 });
		}

		// Record the result
		await env.DB_MAIN.prepare(`
			INSERT INTO test_results (
				id, test_id, visitor_id, session_id, variant, 
				converted, conversion_value, created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`).bind(
			crypto.randomUUID(),
			resultData.testId,
			resultData.visitorId,
			resultData.sessionId,
			resultData.variant,
			resultData.converted,
			resultData.conversionValue || 0,
			new Date().toISOString()
		).run();

		// Update conversion count if this was a conversion
		if (resultData.converted) {
			const field = resultData.variant === 'control' ? 'control_conversions' : 'variant_conversions';
			await env.DB_MAIN.prepare(`
				UPDATE ab_tests 
				SET ${field} = ${field} + 1, updated_at = ?
				WHERE id = ?
			`).bind(new Date().toISOString(), resultData.testId).run();
		}

		return new Response(JSON.stringify({
			success: true,
			recorded: true
		}), {
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});

	} catch (error) {
		console.error('Error recording test result:', error);
		return new Response('Failed to record test result', { status: 500 });
	}
}

async function analyzeActiveTests(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	try {
		const { siteId } = await request.json();

		// Get all active tests
		const query = siteId 
			? 'SELECT * FROM ab_tests WHERE status = "active" AND site_id = ?'
			: 'SELECT * FROM ab_tests WHERE status = "active"';
		
		const params = siteId ? [siteId] : [];
		const activeTests = await env.DB_MAIN.prepare(query).bind(...params).all();

		const analyses: StatisticalAnalysis[] = [];

		for (const test of activeTests.results || []) {
			const analysis = await performStatisticalAnalysis(test as any, env);
			analyses.push(analysis);

			// Auto-complete tests that reach significance
			if (analysis.isSignificant && analysis.recommendedAction === 'declare_winner') {
				ctx.waitUntil(completeTest(test as any, analysis, env));
			}
		}

		return new Response(JSON.stringify({
			success: true,
			analyses: analyses,
			total_tests: activeTests.results?.length || 0
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error analyzing tests:', error);
		return new Response('Failed to analyze tests', { status: 500 });
	}
}

async function performStatisticalAnalysis(test: ABTest, env: Env): Promise<StatisticalAnalysis> {
	const controlRate = test.controlVisitors > 0 ? test.controlConversions / test.controlVisitors : 0;
	const variantRate = test.variantVisitors > 0 ? test.variantConversions / test.variantVisitors : 0;
	
	const improvementPercentage = controlRate > 0 ? 
		((variantRate - controlRate) / controlRate) * 100 : 0;

	// Calculate statistical significance using two-proportion z-test
	const { zScore, pValue } = calculateZTest(
		test.controlConversions, test.controlVisitors,
		test.variantConversions, test.variantVisitors
	);

	const confidenceLevel = (1 - pValue) * 100;
	const isSignificant = pValue < 0.05 && Math.max(test.controlVisitors, test.variantVisitors) >= 100;

	// Calculate minimum sample size needed
	const minSampleSize = calculateMinimumSampleSize(controlRate, 0.2, 0.8, 0.05);
	const currentSampleSize = Math.max(test.controlVisitors, test.variantVisitors);

	let recommendedAction: 'continue' | 'declare_winner' | 'stop_test' = 'continue';
	
	if (isSignificant && currentSampleSize >= minSampleSize) {
		recommendedAction = 'declare_winner';
	} else if (currentSampleSize >= minSampleSize * 2 && !isSignificant) {
		recommendedAction = 'stop_test';
	}

	// Estimate days to significance if test continues at current rate
	const daysRunning = Math.ceil((Date.now() - new Date(test.startDate).getTime()) / (1000 * 60 * 60 * 24));
	const visitorsPerDay = daysRunning > 0 ? currentSampleSize / daysRunning : 0;
	const daysToSignificance = visitorsPerDay > 0 ? 
		Math.ceil((minSampleSize - currentSampleSize) / visitorsPerDay) : undefined;

	return {
		testId: test.id,
		controlRate,
		variantRate,
		improvementPercentage,
		confidenceLevel,
		statisticalSignificance: pValue,
		sampleSize: currentSampleSize,
		isSignificant,
		recommendedAction,
		minSampleSize,
		daysToSignificance: daysToSignificance && daysToSignificance > 0 ? daysToSignificance : undefined
	};
}

function calculateZTest(controlConversions: number, controlVisitors: number, 
					   variantConversions: number, variantVisitors: number): { zScore: number; pValue: number } {
	if (controlVisitors === 0 || variantVisitors === 0) {
		return { zScore: 0, pValue: 1 };
	}

	const p1 = controlConversions / controlVisitors;
	const p2 = variantConversions / variantVisitors;
	
	const pooledProportion = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
	const standardError = Math.sqrt(pooledProportion * (1 - pooledProportion) * (1/controlVisitors + 1/variantVisitors));
	
	const zScore = standardError > 0 ? (p2 - p1) / standardError : 0;
	const pValue = 2 * (1 - normalCDF(Math.abs(zScore))); // Two-tailed test

	return { zScore, pValue };
}

function normalCDF(x: number): number {
	// Approximation of the cumulative distribution function for standard normal
	const t = 1 / (1 + 0.2316419 * Math.abs(x));
	const d = 0.3989423 * Math.exp(-x * x / 2);
	const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
	
	return x > 0 ? 1 - prob : prob;
}

function calculateMinimumSampleSize(baselineRate: number, effectSize: number, power: number, alpha: number): number {
	// Simplified sample size calculation for A/B tests
	// This is a basic approximation - in production, you'd use more sophisticated methods
	
	if (baselineRate <= 0) baselineRate = 0.05; // Default baseline if no data
	
	const p1 = baselineRate;
	const p2 = baselineRate * (1 + effectSize);
	
	const pooledP = (p1 + p2) / 2;
	const effect = Math.abs(p2 - p1);
	
	// Z-scores for alpha and power
	const zAlpha = 1.96; // For alpha = 0.05 (95% confidence)
	const zBeta = 0.84;  // For power = 0.8 (80% power)
	
	const numerator = Math.pow(zAlpha + zBeta, 2) * 2 * pooledP * (1 - pooledP);
	const denominator = Math.pow(effect, 2);
	
	return Math.ceil(numerator / denominator);
}

async function completeTest(test: ABTest, analysis: StatisticalAnalysis, env: Env): Promise<void> {
	try {
		const winner = analysis.variantRate > analysis.controlRate ? 'variant' : 'control';
		
		await env.DB_MAIN.prepare(`
			UPDATE ab_tests 
			SET status = 'completed', 
				winner_variant = ?, 
				confidence_level = ?,
				statistical_significance = ?,
				improvement_percentage = ?,
				end_date = ?,
				updated_at = ?
			WHERE id = ?
		`).bind(
			winner,
			analysis.confidenceLevel,
			analysis.statisticalSignificance,
			analysis.improvementPercentage,
			new Date().toISOString(),
			new Date().toISOString(),
			test.id
		).run();

		// If variant won, apply the optimization
		if (winner === 'variant' && analysis.improvementPercentage > 5) {
			await applyWinningVariant(test, env);
		}

		console.log(`Completed A/B test ${test.id} - Winner: ${winner} (${analysis.improvementPercentage.toFixed(1)}% improvement)`);

	} catch (error) {
		console.error('Error completing test:', error);
	}
}

async function applyWinningVariant(test: ABTest, env: Env): Promise<void> {
	try {
		// Store the winning content as the new default
		await env.DB_MAIN.prepare(`
			INSERT INTO applied_optimizations (
				id, site_id, optimization_type, original_content, 
				optimized_content, improvement_percentage, test_id,
				applied_at, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
		`).bind(
			crypto.randomUUID(),
			test.siteId,
			test.testType,
			test.controlContent,
			test.variantContent,
			test.improvementPercentage || 0,
			test.id,
			new Date().toISOString()
		).run();

		console.log(`Applied winning variant for test ${test.id} to site ${test.siteId}`);

	} catch (error) {
		console.error('Error applying winning variant:', error);
	}
}

async function getTestResults(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const testId = url.searchParams.get('testId');
		const siteId = url.searchParams.get('siteId');

		if (!testId && !siteId) {
			return new Response('Missing testId or siteId parameter', { status: 400 });
		}

		let query: string;
		let params: any[];

		if (testId) {
			query = `
				SELECT t.*, 
					   (SELECT COUNT(*) FROM test_results r WHERE r.test_id = t.id AND r.variant = 'control' AND r.converted = true) as detailed_control_conversions,
					   (SELECT COUNT(*) FROM test_results r WHERE r.test_id = t.id AND r.variant = 'variant' AND r.converted = true) as detailed_variant_conversions
				FROM ab_tests t 
				WHERE t.id = ?
			`;
			params = [testId];
		} else {
			query = `
				SELECT t.*,
					   (SELECT COUNT(*) FROM test_results r WHERE r.test_id = t.id AND r.variant = 'control' AND r.converted = true) as detailed_control_conversions,
					   (SELECT COUNT(*) FROM test_results r WHERE r.test_id = t.id AND r.variant = 'variant' AND r.converted = true) as detailed_variant_conversions
				FROM ab_tests t 
				WHERE t.site_id = ? 
				ORDER BY t.created_at DESC
			`;
			params = [siteId];
		}

		const results = await env.DB_MAIN.prepare(query).bind(...params).all();

		// Calculate analysis for each test
		const testsWithAnalysis = await Promise.all(
			(results.results || []).map(async (test: any) => {
				const analysis = await performStatisticalAnalysis(test, env);
				return {
					...test,
					analysis
				};
			})
		);

		return new Response(JSON.stringify({
			success: true,
			tests: testsWithAnalysis
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error getting test results:', error);
		return new Response('Failed to get test results', { status: 500 });
	}
}

async function pauseTest(request: Request, env: Env): Promise<Response> {
	try {
		const { testId, action } = await request.json();
		
		if (!testId || !action) {
			return new Response('Missing testId or action', { status: 400 });
		}

		const validActions = ['pause', 'resume', 'cancel', 'complete'];
		if (!validActions.includes(action)) {
			return new Response('Invalid action', { status: 400 });
		}

		const status = action === 'resume' ? 'active' : action === 'complete' ? 'completed' : action;

		await env.DB_MAIN.prepare(`
			UPDATE ab_tests 
			SET status = ?, updated_at = ?
			WHERE id = ?
		`).bind(status, new Date().toISOString(), testId).run();

		return new Response(JSON.stringify({
			success: true,
			testId: testId,
			newStatus: status
		}), {
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Error updating test status:', error);
		return new Response('Failed to update test status', { status: 500 });
	}
}