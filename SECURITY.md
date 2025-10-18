# Security Guidelines

## Confidential Infrastructure

This project uses proprietary infrastructure that provides competitive advantage. The following must remain confidential:

### Protected Information
- ✅ All Cloudflare configuration files
- ✅ Database IDs and connection strings  
- ✅ API keys and authentication tokens
- ✅ Workers for Platforms architecture details
- ✅ Dispatch namespace configurations
- ✅ R2 bucket configurations

### Never Commit
- `wrangler.toml` / `wrangler.jsonc` files
- Environment variables with credentials
- Database connection details
- Cloudflare account information

### Safe to Share
- Source code logic and algorithms
- UI components and styling
- Documentation and planning docs
- General architecture patterns (without specific config)

## Development Notes

When adding new workers or infrastructure:
1. Keep all Cloudflare-specific configs in `.gitignore`
2. Use environment variables for sensitive data
3. Document requirements without exposing actual credentials
4. Create template configs with placeholder values

The goal: Share the innovation while protecting the implementation advantage.