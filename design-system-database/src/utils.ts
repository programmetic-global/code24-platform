import { DesignStyle } from './types';

export function generateId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function extractTags(html: string, css: string, existingTags: string[]): string[] {
  const tags = new Set(existingTags.map(tag => tag.toLowerCase()));
  
  // Extract from HTML classes and IDs
  const classMatches = html.match(/class=["']([^"']+)["']/g);
  if (classMatches) {
    classMatches.forEach(match => {
      const classes = match.replace(/class=["']/, '').replace(/["']/, '').split(' ');
      classes.forEach(cls => {
        if (cls.length > 2) tags.add(cls.toLowerCase());
      });
    });
  }

  // Extract from CSS selectors
  const selectorMatches = css.match(/\.[\w-]+|#[\w-]+/g);
  if (selectorMatches) {
    selectorMatches.forEach(selector => {
      const clean = selector.replace(/[.#]/, '');
      if (clean.length > 2) tags.add(clean.toLowerCase());
    });
  }

  // Add semantic tags based on content
  const content = (html + css).toLowerCase();
  
  if (content.includes('gradient')) tags.add('gradient');
  if (content.includes('shadow')) tags.add('shadow');
  if (content.includes('border-radius')) tags.add('rounded');
  if (content.includes('transform')) tags.add('transform');
  if (content.includes('transition')) tags.add('transition');
  if (content.includes('animation')) tags.add('animation');
  if (content.includes('flex')) tags.add('flexbox');
  if (content.includes('grid')) tags.add('grid');
  if (content.includes('hover')) tags.add('hover');
  if (content.includes('responsive')) tags.add('responsive');
  if (content.includes('mobile')) tags.add('mobile');
  if (content.includes('dark')) tags.add('dark-mode');
  if (content.includes('light')) tags.add('light-mode');

  return Array.from(tags).slice(0, 20); // Limit to 20 tags
}

export function analyzeComplexity(html: string, css: string, js?: string): number {
  let complexity = 1;

  // HTML complexity
  const elementCount = (html.match(/<[^>]+>/g) || []).length;
  if (elementCount > 20) complexity += 2;
  else if (elementCount > 10) complexity += 1;

  // CSS complexity
  const cssRules = (css.match(/[^{}]*{[^}]*}/g) || []).length;
  if (cssRules > 15) complexity += 2;
  else if (cssRules > 8) complexity += 1;

  // CSS features
  if (css.includes('@keyframes')) complexity += 1;
  if (css.includes('transform')) complexity += 1;
  if (css.includes('clip-path')) complexity += 1;
  if (css.includes('filter:')) complexity += 1;
  if (css.includes('backdrop-filter')) complexity += 1;

  // JavaScript complexity
  if (js && js.length > 0) {
    complexity += 1;
    if (js.length > 500) complexity += 1;
    if (js.includes('addEventListener')) complexity += 1;
  }

  return Math.min(complexity, 10);
}

export function scoreAesthetics(html: string, css: string): number {
  let score = 50; // Base score

  // Modern CSS features
  if (css.includes('gradient')) score += 8;
  if (css.includes('box-shadow')) score += 6;
  if (css.includes('border-radius')) score += 5;
  if (css.includes('transform')) score += 5;
  if (css.includes('transition')) score += 5;
  if (css.includes('backdrop-filter')) score += 10;
  if (css.includes('filter:')) score += 5;

  // Layout quality
  if (css.includes('flexbox') || css.includes('flex')) score += 8;
  if (css.includes('grid')) score += 10;
  if (css.includes('gap:')) score += 5;

  // Color usage
  const colorMatches = css.match(/#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(/g);
  if (colorMatches && colorMatches.length > 2) score += 5;

  // Typography
  if (css.includes('font-family')) score += 3;
  if (css.includes('font-weight')) score += 2;
  if (css.includes('line-height')) score += 3;
  if (css.includes('letter-spacing')) score += 2;

  // Spacing and alignment
  if (css.includes('margin') || css.includes('padding')) score += 3;
  if (css.includes('text-align')) score += 2;
  if (css.includes('justify-content') || css.includes('align-items')) score += 5;

  // Responsiveness
  if (css.includes('@media')) score += 10;

  // Modern units
  if (css.includes('rem') || css.includes('em')) score += 3;
  if (css.includes('vh') || css.includes('vw')) score += 3;

  // Penalties for poor practices
  if (css.includes('!important')) score -= 5;
  if (css.includes('position: absolute') && !css.includes('position: relative')) score -= 3;

  return Math.min(Math.max(score, 1), 100);
}

export function detectStyle(css: string): DesignStyle {
  const content = css.toLowerCase();

  // Glass morphism
  if (content.includes('backdrop-filter') && content.includes('blur')) {
    return DesignStyle.GLASSMORPHISM;
  }

  // Neumorphism
  if (content.includes('box-shadow') && 
      (content.includes('inset') || content.match(/box-shadow[^;]*,\s*[^;]*box-shadow/))) {
    return DesignStyle.NEUMORPHISM;
  }

  // Gradient
  if (content.includes('gradient')) {
    return DesignStyle.GRADIENT;
  }

  // Dark mode
  if (content.includes('dark') || 
      (content.includes('#000') || content.includes('rgb(0') || content.includes('black'))) {
    return DesignStyle.DARK;
  }

  // Minimal (few colors, simple shapes)
  const colorCount = (content.match(/#[0-9a-f]{3,6}/g) || []).length;
  const shadowCount = (content.match(/box-shadow/g) || []).length;
  if (colorCount <= 2 && shadowCount <= 1) {
    return DesignStyle.MINIMAL;
  }

  // Colorful (many colors)
  if (colorCount > 5) {
    return DesignStyle.COLORFUL;
  }

  // Brutalist (sharp edges, high contrast)
  if (!content.includes('border-radius') && content.includes('border')) {
    return DesignStyle.BRUTALIST;
  }

  return DesignStyle.MODERN; // Default
}

export function calculateSimilarity(component1: any, component2: any): number {
  let similarity = 0;
  let factors = 0;

  // Type similarity
  if (component1.type === component2.type) {
    similarity += 30;
  }
  factors += 30;

  // Category similarity
  if (component1.category === component2.category) {
    similarity += 20;
  }
  factors += 20;

  // Style similarity
  if (component1.style === component2.style) {
    similarity += 15;
  }
  factors += 15;

  // Tag similarity
  const tags1 = new Set(component1.tags || []);
  const tags2 = new Set(component2.tags || []);
  const commonTags = new Set([...tags1].filter(tag => tags2.has(tag)));
  const totalUniqueTags = new Set([...tags1, ...tags2]).size;
  
  if (totalUniqueTags > 0) {
    const tagSimilarity = (commonTags.size / totalUniqueTags) * 25;
    similarity += tagSimilarity;
  }
  factors += 25;

  // Complexity similarity
  const complexityDiff = Math.abs((component1.complexity || 5) - (component2.complexity || 5));
  const complexitySimilarity = Math.max(0, 10 - complexityDiff);
  similarity += complexitySimilarity;
  factors += 10;

  return similarity / factors;
}

export function validateComponent(component: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!component.id) errors.push('Missing component ID');
  if (!component.name) errors.push('Missing component name');
  if (!component.html_code) errors.push('Missing HTML code');
  if (!component.css_code) errors.push('Missing CSS code');
  if (!component.type) errors.push('Missing component type');
  if (!component.category) errors.push('Missing component category');
  if (!component.source) errors.push('Missing component source');

  if (component.complexity && (component.complexity < 1 || component.complexity > 10)) {
    errors.push('Complexity must be between 1 and 10');
  }

  if (component.metrics?.aesthetic_score && 
      (component.metrics.aesthetic_score < 1 || component.metrics.aesthetic_score > 100)) {
    errors.push('Aesthetic score must be between 1 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function cleanCode(code: string): string {
  return code
    .replace(/^\s+|\s+$/gm, '') // Remove leading/trailing whitespace
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .replace(/\t/g, '  ') // Convert tabs to spaces
    .trim();
}

export function extractColorPalette(css: string): string[] {
  const colors: string[] = [];
  
  // Hex colors
  const hexMatches = css.match(/#[0-9a-fA-F]{3,6}/g);
  if (hexMatches) colors.push(...hexMatches);
  
  // RGB colors
  const rgbMatches = css.match(/rgb\([^)]+\)/g);
  if (rgbMatches) colors.push(...rgbMatches);
  
  // HSL colors
  const hslMatches = css.match(/hsl\([^)]+\)/g);
  if (hslMatches) colors.push(...hslMatches);
  
  // Remove duplicates and return
  return Array.from(new Set(colors));
}

export function generateComponentPreview(html: string, css: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .preview-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    ${css}
  </style>
</head>
<body>
  <div class="preview-container">
    ${html}
  </div>
</body>
</html>
  `.trim();
}