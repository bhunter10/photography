# Installation Notes

## Package Versions

This project uses **Payload CMS 3.69.0**, which requires:
- Next.js 15.4.10+
- React 19.x
- Node.js 18+

## Installation

Always use the `--legacy-peer-deps` flag when installing:

```bash
npm install --legacy-peer-deps
```

This is necessary because Payload CMS 3.x has peer dependency requirements that npm's strict resolver flags, but they work correctly in practice.

## Important Changes from Payload 2.x

1. **No Bundler Required**: Payload 3.x doesn't require `@payloadcms/bundler-webpack` - the admin is handled automatically
2. **API Routes**: The API route handler uses `payload.router()` - verify this matches Payload 3.x documentation if you encounter issues
3. **React 19**: The project uses React 19, which may have breaking changes from React 18

## Next Steps After Installation

1. Create `.env` file with database connection
2. Run `npm run generate:types` to generate TypeScript types
3. Start development server: `npm run dev`
4. Create admin user at `/admin`

## Troubleshooting

If you encounter issues:

1. **API Route Errors**: Check Payload 3.x documentation for the correct API route handler pattern
2. **Type Errors**: Run `npm run generate:types` after installation
3. **Build Errors**: Ensure all environment variables are set correctly
4. **Peer Dependency Warnings**: These are expected and can be ignored when using `--legacy-peer-deps`

## Version Summary

- Payload CMS: 3.69.0
- Next.js: 15.4.10
- React: 19.0.0
- TypeScript: 5.3.3
- PostgreSQL adapter: 3.69.0

