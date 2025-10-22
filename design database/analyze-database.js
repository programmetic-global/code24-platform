// Pattern Analysis Script
// Analyzes collected design data to identify reusable patterns

import fs from 'fs/promises';
import path from 'path';

const DB_PATH = './design-database';

// Analyze color trends
async function analyzeColorTrends() {
  console.log('🎨 Analyzing color trends...');
  
  const metadataDir = `${DB_PATH}/metadata`;
  const files = await fs.readdir(metadataDir);
  
  const colorFrequency = {};
  const colorCombinations = [];
  
  for (const file of files) {
    if (file.endsWith('.json') && file !== 'index.json') {
      const content = await fs.readFile(`${metadataDir}/${file}`, 'utf-8');
      const design = JSON.parse(content);
      
      if (design.colors) {
        design.colors.forEach(color => {
          colorFrequency[color] = (colorFrequency[color] || 0) + 1;
        });
        
        if (design.colors.length >= 2) {
          colorCombinations.push(design.colors);
        }
      }
    }
  }
  
  // Sort by frequency
  const sortedColors = Object.entries(colorFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);
  
  return {
    topColors: sortedColors,
    commonCombinations: colorCombinations.slice(0, 50)
  };
}

// Analyze typography trends
async function analyzeTypographyTrends() {
  console.log('✍️  Analyzing typography trends...');
  
  const metadataDir = `${DB_PATH}/metadata`;
  const files = await fs.readdir(metadataDir);
  
  const fontFamilies = {};
  const fontPairings = [];
  const sizeRanges = {};
  
  for (const file of files) {
    if (file.endsWith('.json') && file !== 'index.json') {
      const content = await fs.readFile(`${metadataDir}/${file}`, 'utf-8');
      const design = JSON.parse(content);
      
      if (design.typography?.families) {
        design.typography.families.forEach(family => {
          fontFamilies[family] = (fontFamilies[family] || 0) + 1;
        });
        
        if (design.typography.families.length >= 2) {
          fontPairings.push(design.typography.families.slice(0, 2));
        }
      }
      
      if (design.typography?.sizes) {
        design.typography.sizes.forEach(size => {
          sizeRanges[size] = (sizeRanges[size] || 0) + 1;
        });
      }
    }
  }
  
  return {
    popularFonts: Object.entries(fontFamilies)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20),
    commonPairings: fontPairings.slice(0, 30),
    sizeDistribution: sizeRanges
  };
}

// Analyze layout patterns
async function analyzeLayoutPatterns() {
  console.log('📐 Analyzing layout patterns...');
  
  const metadataDir = `${DB_PATH}/metadata`;
  const files = await fs.readdir(metadataDir);
  
  const patterns = {
    hasGrid: 0,
    hasFlex: 0,
    maxWidths: {},
    averageGridUsage: 0,
    averageFlexUsage: 0
  };
  
  let totalDesigns = 0;
  
  for (const file of files) {
    if (file.endsWith('.json') && file !== 'index.json') {
      const content = await fs.readFile(`${metadataDir}/${file}`, 'utf-8');
      const design = JSON.parse(content);
      
      if (design.layout) {
        totalDesigns++;
        
        if (design.layout.hasGrid) patterns.hasGrid++;
        if (design.layout.hasFlex) patterns.hasFlex++;
        
        if (design.layout.maxWidth) {
          patterns.maxWidths[design.layout.maxWidth] = 
            (patterns.maxWidths[design.layout.maxWidth] || 0) + 1;
        }
        
        patterns.averageGridUsage += design.layout.gridCount || 0;
        patterns.averageFlexUsage += design.layout.flexCount || 0;
      }
    }
  }
  
  if (totalDesigns > 0) {
    patterns.averageGridUsage /= totalDesigns;
    patterns.averageFlexUsage /= totalDesigns;
  }
  
  return {
    ...patterns,
    totalAnalyzed: totalDesigns,
    gridPercentage: ((patterns.hasGrid / totalDesigns) * 100).toFixed(1),
    flexPercentage: ((patterns.hasFlex / totalDesigns) * 100).toFixed(1)
  };
}

// Analyze design trends
async function analyzeTrends() {
  console.log('🎯 Analyzing design trends...');
  
  const metadataDir = `${DB_PATH}/metadata`;
  const files = await fs.readdir(metadataDir);
  
  const trendCounts = {};
  const trendCombinations = {};
  
  for (const file of files) {
    if (file.endsWith('.json') && file !== 'index.json') {
      const content = await fs.readFile(`${metadataDir}/${file}`, 'utf-8');
      const design = JSON.parse(content);
      
      if (design.trends) {
        design.trends.forEach(trend => {
          trendCounts[trend] = (trendCounts[trend] || 0) + 1;
        });
        
        // Track co-occurring trends
        if (design.trends.length >= 2) {
          design.trends.sort();
          const combo = design.trends.join(' + ');
          trendCombinations[combo] = (trendCombinations[combo] || 0) + 1;
        }
      }
    }
  }
  
  return {
    individualTrends: Object.entries(trendCounts)
      .sort(([,a], [,b]) => b - a),
    trendCombinations: Object.entries(trendCombinations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
  };
}

// Analyze animation usage
async function analyzeAnimations() {
  console.log('✨ Analyzing animation patterns...');
  
  const metadataDir = `${DB_PATH}/metadata`;
  const files = await fs.readdir(metadataDir);
  
  const animationLibraries = {};
  const animationTypes = {};
  
  for (const file of files) {
    if (file.endsWith('.json') && file !== 'index.json') {
      const content = await fs.readFile(`${metadataDir}/${file}`, 'utf-8');
      const design = JSON.parse(content);
      
      if (design.animations) {
        design.animations.forEach(anim => {
          animationLibraries[anim] = (animationLibraries[anim] || 0) + 1;
        });
      }
    }
  }
  
  return {
    popularLibraries: Object.entries(animationLibraries)
      .sort(([,a], [,b]) => b - a),
    totalSitesWithAnimations: Object.values(animationLibraries)
      .reduce((a, b) => a + b, 0)
  };
}

// Generate pattern library
async function generatePatternLibrary() {
  console.log('\n📚 Generating comprehensive pattern library...\n');
  
  const [colors, typography, layouts, trends, animations] = await Promise.all([
    analyzeColorTrends(),
    analyzeTypographyTrends(),
    analyzeLayoutPatterns(),
    analyzeTrends(),
    analyzeAnimations()
  ]);
  
  const patternLibrary = {
    generatedAt: new Date().toISOString(),
    version: '1.0',
    
    colors: {
      description: '2025 trending color palettes',
      topColors: colors.topColors.map(([color, count]) => ({
        hex: color,
        frequency: count,
        uses: 'primary, accent, or background'
      })),
      popularCombinations: colors.commonCombinations.slice(0, 20).map(combo => ({
        palette: combo,
        description: 'Harmonious color combination from award-winning site'
      }))
    },
    
    typography: {
      description: '2025 typography trends and pairings',
      popularFonts: typography.popularFonts.map(([font, count]) => ({
        family: font,
        frequency: count,
        recommended: 'headings, body, or both'
      })),
      successfulPairings: typography.commonPairings.slice(0, 15).map(pair => ({
        heading: pair[0],
        body: pair[1],
        description: 'Proven font pairing from modern sites'
      })),
      sizeScale: Object.entries(typography.sizeDistribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([size, count]) => ({ size, usage: count }))
    },
    
    layouts: {
      description: 'Modern layout patterns',
      stats: {
        gridUsage: `${layouts.gridPercentage}% of sites use CSS Grid`,
        flexUsage: `${layouts.flexPercentage}% of sites use Flexbox`,
        avgGridElements: layouts.averageGridUsage,
        avgFlexElements: layouts.averageFlexUsage
      },
      popularMaxWidths: Object.entries(layouts.maxWidths)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([width, count]) => ({ width, frequency: count })),
      recommendations: [
        'Use CSS Grid for complex layouts',
        'Flexbox for simpler component layouts',
        'Max-width containers for readability',
        'Mobile-first responsive design'
      ]
    },
    
    trends: {
      description: 'Top 2025 design trends',
      topTrends: trends.individualTrends.map(([trend, count]) => ({
        name: trend,
        frequency: count,
        description: getTrendDescription(trend)
      })),
      powerCombinations: trends.trendCombinations.map(([combo, count]) => ({
        combination: combo,
        frequency: count,
        impact: count > 5 ? 'high' : 'medium'
      }))
    },
    
    animations: {
      description: 'Animation implementation trends',
      popularLibraries: animations.popularLibraries.map(([lib, count]) => ({
        library: lib,
        usage: count,
        description: getLibraryDescription(lib)
      })),
      totalImplementations: animations.totalSitesWithAnimations
    },
    
    recommendations: {
      mustHave2025: [
        'Bold, experimental typography',
        'Dark mode option with vibrant accents',
        'Smooth micro-interactions',
        'Mobile-first responsive design',
        'Fast loading (<2s)',
        'Accessibility compliance (WCAG AA)'
      ],
      emerging: [
        'Glassmorphism effects',
        '3D elements with Three.js/WebGL',
        'Organic, fluid shapes',
        'Bento box layouts',
        'Custom illustrations',
        'Parallax scrolling'
      ],
      avoidIn2025: [
        'Overly complex animations',
        'Too many colors (keep 3-5 max)',
        'Generic stock photos',
        'Tiny text on mobile',
        'Auto-playing videos with sound',
        'Intrusive popups'
      ]
    }
  };
  
  // Save pattern library
  const outputPath = `${DB_PATH}/pattern-library-2025.json`;
  await fs.writeFile(
    outputPath,
    JSON.stringify(patternLibrary, null, 2)
  );
  
  console.log('✅ Pattern library generated');
  console.log(`   Saved to: ${outputPath}`);
  
  // Print summary
  console.log('\n📊 Summary:');
  console.log(`   Top colors analyzed: ${colors.topColors.length}`);
  console.log(`   Typography patterns: ${typography.popularFonts.length}`);
  console.log(`   Design trends tracked: ${trends.individualTrends.length}`);
  console.log(`   Animation libraries: ${animations.popularLibraries.length}`);
  
  return patternLibrary;
}

// Helper functions for descriptions
function getTrendDescription(trend) {
  const descriptions = {
    'glassmorphism': 'Frosted glass effect with transparency and blur',
    '3d-elements': 'Interactive 3D graphics using WebGL/Three.js',
    'dark-mode': 'Dark color scheme with high contrast',
    'parallax-scrolling': 'Layered scrolling for depth perception',
    'custom-cursor': 'Unique cursor design matching brand',
    'bold-typography': 'Large, statement-making text',
    'organic-shapes': 'Fluid, natural forms and blobs',
    'micro-interactions': 'Subtle animations on user interaction'
  };
  
  return descriptions[trend] || 'Modern design trend';
}

function getLibraryDescription(library) {
  const descriptions = {
    'gsap': 'Professional-grade JavaScript animation library',
    'framer-motion': 'React animation library with spring physics',
    'aos': 'Animate on scroll library',
    'three.js': '3D graphics and WebGL framework',
    'css-animations': 'Native CSS animation properties'
  };
  
  return descriptions[library] || 'Animation framework';
}

// Generate AI-ready export
async function exportForAI() {
  console.log('\n🤖 Generating AI-ready export...\n');
  
  const patternLibrary = await generatePatternLibrary();
  
  // Create simplified version for AI workers
  const aiExport = {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    
    quickReference: {
      topColors: patternLibrary.colors.topColors.slice(0, 10),
      topFonts: patternLibrary.typography.popularFonts.slice(0, 10),
      mustUseTrends: patternLibrary.trends.topTrends.slice(0, 5),
      recommendedAnimations: patternLibrary.animations.popularLibraries.slice(0, 5)
    },
    
    designPatterns: {
      hero: {
        recommended: ['full-screen', 'video-background', '3d-element'],
        avoid: ['generic-stock-photo', 'text-heavy']
      },
      typography: {
        heading: patternLibrary.typography.successfulPairings[0]?.heading,
        body: patternLibrary.typography.successfulPairings[0]?.body,
        scale: ['48px', '36px', '28px', '20px', '16px']
      },
      colors: {
        primary: patternLibrary.colors.topColors[0]?.hex,
        accent: patternLibrary.colors.topColors[1]?.hex,
        neutral: patternLibrary.colors.topColors[2]?.hex
      },
      layout: {
        maxWidth: '1200px',
        spacing: '8px',
        grid: '12-column',
        approach: 'mobile-first'
      }
    },
    
    rules: {
      mustHave: patternLibrary.recommendations.mustHave2025,
      emerging: patternLibrary.recommendations.emerging,
      avoid: patternLibrary.recommendations.avoidIn2025
    }
  };
  
  const aiPath = `${DB_PATH}/ai-export.json`;
  await fs.writeFile(
    aiPath,
    JSON.stringify(aiExport, null, 2)
  );
  
  console.log('✅ AI export generated');
  console.log(`   Saved to: ${aiPath}`);
  
  return aiExport;
}

// Main execution
async function main() {
  console.log('🔬 Starting Pattern Analysis\n');
  
  try {
    // Generate comprehensive pattern library
    await generatePatternLibrary();
    
    // Generate AI-ready export
    await exportForAI();
    
    console.log('\n✨ Analysis complete!\n');
    console.log('📁 Generated files:');
    console.log('   - pattern-library-2025.json (comprehensive)');
    console.log('   - ai-export.json (AI-ready)');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  analyzeColorTrends,
  analyzeTypographyTrends,
  analyzeLayoutPatterns,
  analyzeTrends,
  analyzeAnimations,
  generatePatternLibrary,
  exportForAI
};
