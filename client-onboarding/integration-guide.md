# Code24 Integration Guide

## Implementation Methods

### Method 1: Simple Script Integration (Recommended)

Add the Code24 tracking script to your website:

```html
<!-- Place in <head> section -->
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://assets.code24.dev/c24.js';
  script.setAttribute('data-site-id', 'YOUR_SITE_ID');
  script.async = true;
  document.head.appendChild(script);
})();
</script>
```

### Method 2: Google Tag Manager

1. Create a new Custom HTML tag
2. Add the Code24 script
3. Set trigger to "All Pages"
4. Publish your container

```html
<script src="https://assets.code24.dev/c24.js" data-site-id="YOUR_SITE_ID"></script>
```

### Method 3: WordPress Plugin

Install the official Code24 plugin:
1. Download from WordPress repository
2. Upload and activate
3. Enter your Site ID in settings
4. Save configuration

## Goal Configuration

### E-commerce Tracking

```javascript
// Track purchases
Code24.track('purchase', {
  value: 99.99,
  currency: 'USD',
  product_id: 'PROD_123',
  category: 'electronics'
});
```

### Lead Generation

```javascript
// Track form submissions
Code24.track('lead', {
  form_type: 'contact',
  source: 'homepage_cta'
});
```

### SaaS Signups

```javascript
// Track user registrations
Code24.track('signup', {
  plan: 'pro',
  trial: true,
  source: 'pricing_page'
});
```

## Advanced Configuration

### Custom Events

Track business-specific events:

```javascript
Code24.track('custom_event', {
  action: 'video_watched',
  duration: 120,
  video_id: 'intro_video'
});
```

### User Properties

Set user attributes for personalization:

```javascript
Code24.setUser({
  segment: 'premium',
  location: 'US',
  returning: true
});
```

### Page-Specific Optimization

Enable optimization for specific pages:

```javascript
Code24.enableOptimization({
  page_type: 'product',
  optimize: ['headlines', 'cta_buttons'],
  test_duration: 14 // days
});
```

## Testing Your Integration

### 1. Verify Tracking

Check browser developer tools for Code24 requests:
- Network tab should show requests to `insights.code24.dev`
- Console should not show any errors
- Local storage should contain `c24_visitor_id`

### 2. Test Events

Trigger test events and verify in dashboard:

```javascript
// Send test event
Code24.track('test_event', { test: true });
```

### 3. Validate Optimization

Your site will automatically start A/B testing optimizations within 24 hours of integration.

## Troubleshooting

### Common Issues

**Script not loading:**
- Check for ad blockers
- Verify Site ID is correct
- Ensure HTTPS is used

**Events not tracking:**
- Check browser console for errors  
- Verify event names match configuration
- Test with Code24.debug = true

**Optimizations not appearing:**
- Allow 24-48 hours for initial optimization
- Ensure sufficient traffic (minimum 100 visitors/day)
- Check goal configuration

### Debug Mode

Enable detailed logging:

```javascript
// Enable debug mode
Code24.debug = true;

// Check configuration
console.log(Code24.config);
```

## Performance Impact

Code24 is designed for zero performance impact:
- **<5KB** total script size
- **Async loading** - doesn't block page rendering
- **Edge caching** - served from global CDN
- **Lazy optimization** - content updates happen after page load

## Security & Privacy

### Data Collection

Code24 only collects:
- Page views and user interactions
- Conversion events you explicitly track
- Anonymous visitor identifiers
- Performance metrics

### Data Protection

- All data encrypted in transit and at rest
- No personally identifiable information stored
- GDPR and CCPA compliant
- Data retention: 24 months maximum

### Consent Management

For GDPR compliance:

```javascript
// Conditional tracking based on consent
if (userConsent) {
  Code24.enable();
} else {
  Code24.disable();
}
```

## API Reference

### Core Methods

```javascript
// Initialize (automatic with script)
Code24.init('YOUR_SITE_ID');

// Track events
Code24.track(eventName, properties);

// Set user properties
Code24.setUser(properties);

// Enable/disable tracking
Code24.enable();
Code24.disable();

// Get visitor ID
Code24.getVisitorId();
```

### Configuration Options

```javascript
Code24.config({
  api_endpoint: 'https://insights.code24.dev',
  auto_track: true,
  optimize_elements: ['headlines', 'buttons'],
  test_confidence: 95
});
```

## Support

Need help with integration?

- **Documentation**: https://docs.code24.dev
- **Support Portal**: https://support.code24.dev  
- **Email**: integration@code24.dev
- **Live Chat**: Available in dashboard

---

*Code24 Platform - Automated optimization that works while you sleep.*