# InlineJS Element
InlineJS Element is a TypeScript library that extends the InlineJS reactive framework with HTML5 custom elements. It provides components for embedding JavaScript code in HTML using element contexts.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- Bootstrap, build, and test the repository:
  - Node.js v20+ and npm v10+ are required and available
  - `npm install` -- takes 15 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
  - `npm run compile` -- TypeScript compilation takes 5 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
  - `npm run build` -- webpack bundling takes 10 seconds. NEVER CANCEL. Set timeout to 300+ seconds.
- Full build pipeline:
  - `npm install && npm run compile && npm run build` -- takes 30 seconds total. NEVER CANCEL. Set timeout to 600+ seconds.
- Dependency updates:
  - `npm run download` -- updates @benbraide/inlinejs dependency and runs audit fix. Takes 5 seconds.

## Validation
- Always run TypeScript type checking: `npx tsc --noEmit` -- validates without emitting files.
- Test library loading with browser environment: `node -e "require('jsdom-global')(); require('./lib/common/index.js'); console.log('OK');"`
- NO unit tests exist - the project has no test files. The npm test commands will fail with "No test files found".
- npm audit shows 3 moderate vulnerabilities in dev dependencies (mocha-related). These are known and do not affect production builds.
- Always validate both build outputs after making changes:
  - CommonJS: `lib/common/` directory
  - ESM: `lib/esm/` directory  
  - Webpack bundles: `dist/inlinejs-element.js` (490KB) and `dist/inlinejs-element.min.js` (123KB)

## Build System
- Uses TypeScript with two compilation targets:
  - `tsconfig.json` for CommonJS (lib/common/)
  - `tsconfig.esm.json` for ES modules (lib/esm/)
- Uses webpack for browser bundles:
  - `webpack.config.js` for development bundle
  - `webpack2.config.js` for production/minified bundle
- NO linting configuration exists. TypeScript strict mode provides type checking.
- Build artifacts: Always exclude `node_modules/`, `lib/`, `dist/` from commits.

## Project Structure
- Entry points:
  - `src/entry.ts` - Main library initialization
  - `src/inlinejs-element.ts` - Browser bundle entry
  - `src/index.ts` - NPM package exports
- Key components:
  - `src/components/element.ts` - Core CustomElement base class (18KB, most complex)
  - `src/components/native.ts` - Native element wrapper
  - `src/components/resource.ts` - Resource loading component
  - `src/components/resource-target.ts` - Resource target handling
- Decorators: `src/decorators/property.ts` - Property decoration system
- Types: `src/types.ts` - TypeScript interfaces and types

## Dependency Management
- Core dependency: `@benbraide/inlinejs` (reactive framework)
- Dev dependencies: TypeScript, webpack, mocha, jsdom for testing environment
- Browser-only library: Extends HTMLElement, requires DOM environment to function
- Use `npm run download` to update core InlineJS dependency

## Common Tasks
### Building from scratch
```bash
rm -rf lib dist node_modules
npm install
npm run compile
npm run build
```
Takes 45 seconds total. NEVER CANCEL these commands.

### Preparing for publish
```bash
npm run prepublishOnly  # Runs compile automatically
```

### Manual validation
```bash
# Type checking
npx tsc --noEmit

# Library loads in DOM environment
node -e "require('jsdom-global')(); require('./lib/common/index.js'); console.log('Library loads successfully');"

# Check bundle sizes
ls -lh dist/
```

## Repository Root Contents
```
├── .github/               # GitHub configuration
├── .git/                  # Git repository data
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
├── README.md             # Basic project description (minimal)
├── package.json          # NPM configuration and scripts
├── package-lock.json     # NPM dependency lock
├── tsconfig.json         # TypeScript config (CommonJS)
├── tsconfig.esm.json     # TypeScript config (ESM)
├── webpack.config.js     # Webpack dev build
├── webpack2.config.js    # Webpack production build
├── src/                  # TypeScript source code
├── lib/                  # Compiled TypeScript output (gitignored)
└── dist/                 # Webpack bundles (gitignored)
```

## Package.json Scripts Reference
```
npm test          # FAILS - no test files exist
npm run ts-test   # FAILS - no test files exist  
npm run compile   # TypeScript compilation (both CommonJS and ESM)
npm run build     # Webpack bundling (dev and production)
npm run download  # Update @benbraide/inlinejs dependency
npm run upload    # Build and publish to npm (requires auth)
npm run push      # Download deps + upload (full publish workflow)
```

## CRITICAL Timeouts and Warnings
- **NEVER CANCEL**: Build commands may take up to 60 seconds. Always set timeout to 300+ seconds.
- **NEVER CANCEL**: npm install may take up to 30 seconds. Always set timeout to 120+ seconds.
- **TypeScript compilation**: Usually 3-5 seconds, set timeout to 120+ seconds.
- **Webpack bundling**: Usually 7-10 seconds, set timeout to 300+ seconds.
- **Full pipeline**: Up to 60 seconds total, set timeout to 600+ seconds.