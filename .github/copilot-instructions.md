# InlineJS Element

InlineJS Element is a TypeScript library that extends the InlineJS reactive framework for HTML5. It provides custom HTML elements (`inlinejs-native`, `inlinejs-resource`, `inlinejs-resource-target`) for embedding JavaScript with element context. The library is distributed as both CommonJS and ESM modules, plus browser-ready webpack bundles.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Dependencies and Setup
- Install Node.js v20+ (current: v20.19.5) and npm v10+ (current: v10.8.2)
- `npm install` -- installs dependencies in 12-22 seconds (varies if cached). NEVER CANCEL. Set timeout to 60+ seconds.
- `npm run download` -- updates @benbraide/inlinejs dependency and runs audit (2 seconds)

### Build Process
- `npm run compile` -- TypeScript compilation to lib/common and lib/esm directories (3 seconds). NEVER CANCEL.
- `npm run build` -- webpack bundling to dist/ directory (6.5 seconds). NEVER CANCEL. Set timeout to 60+ seconds.
- `npm run prepublishOnly` -- automatically runs compile before publishing
- Complete clean build: `rm -rf dist/ lib/ && npm run build && npm run compile`

### Testing and Quality
- **NO TESTS EXIST**: The repository has test scripts configured in package.json but no actual test files
- `npm test` -- fails with "No test files found" (expected behavior)
- `npm run ts-test` -- also fails due to no test files
- **NO LINTING**: No ESLint, Prettier, or other code quality tools configured
- **NO CI/CD**: No GitHub Actions or other CI configured

### File Structure
```
/home/runner/work/inlinejs-element/inlinejs-element/
├── src/                    # TypeScript source code
│   ├── components/         # Custom element implementations
│   ├── decorators/         # Property decorators
│   ├── utilities/          # Helper functions
│   ├── types.ts           # Type definitions
│   ├── index.ts           # Main export file
│   ├── entry.ts           # Initialization logic
│   └── inlinejs-element.ts # Browser entry point
├── lib/                    # Compiled TypeScript output
│   ├── common/            # CommonJS modules
│   └── esm/               # ES modules
├── dist/                   # Webpack browser bundles
│   ├── inlinejs-element.js     # Development bundle (490KB)
│   └── inlinejs-element.min.js # Production bundle (122KB)
├── package.json           # Project configuration
├── tsconfig.json          # CommonJS TypeScript config
├── tsconfig.esm.json      # ESM TypeScript config
├── webpack.config.js      # Development webpack config
└── webpack2.config.js     # Production webpack config
```

## Validation

### Manual Testing
- **ALWAYS** test changes by running the complete build process: `npm run compile && npm run build`
- **CANNOT RUN BROWSER TESTS**: Library requires browser environment (HTMLElement) and has no test infrastructure
- Validate TypeScript compilation produces expected output in lib/ directories
- Validate webpack bundling produces expected files in dist/ directory
- **NO FUNCTIONAL TESTING AVAILABLE**: No way to test actual custom element functionality without browser setup

### Essential Validation Workflow
After making any changes, ALWAYS run this validation sequence:
```bash
# Clean and rebuild everything
rm -rf dist/ lib/
npm run compile  # Should complete in ~3 seconds
npm run build    # Should complete in ~7 seconds

# Verify outputs exist
ls -la dist/     # Should show inlinejs-element.js (489KB) and inlinejs-element.min.js (121KB)
ls -la lib/      # Should show common/ and esm/ directories
```

### Specific File Size Validation
Use these file sizes to verify successful builds:
- `dist/inlinejs-element.js`: ~489-501KB (development bundle)
- `dist/inlinejs-element.min.js`: ~121-124KB (production bundle) 
- `dist/inlinejs-element.min.js.LICENSE.txt`: ~188 bytes

### Development Workflow
- Make changes to TypeScript files in src/
- Run `npm run compile` to check TypeScript compilation (timeout: 60 seconds)
- Run `npm run build` to verify webpack bundling works (timeout: 60 seconds)
- Check that lib/ and dist/ directories contain expected output files

## Common Tasks

### Building the Project
```bash
# Full clean build
rm -rf dist/ lib/
npm run compile  # 3 seconds - NEVER CANCEL
npm run build    # 6.8 seconds - NEVER CANCEL

# Quick compilation only
npm run compile  # 3 seconds - NEVER CANCEL
```

### Development Workflow
1. Make changes to TypeScript files in `src/`
2. Run `npm run compile` to check TypeScript compilation
3. Run `npm run build` to verify webpack bundling
4. Check output directories `lib/` and `dist/` for expected files
5. Validate file sizes match expected ranges

### Troubleshooting Common Issues
- **"HTMLElement is not defined"**: Expected behavior when testing in Node.js - library requires browser environment
- **"No test files found"**: Expected behavior - no tests are implemented in this repository  
- **Build failures**: Usually due to TypeScript compilation errors - check src/ files for syntax issues
- **Missing output files**: Ensure both `npm run compile` and `npm run build` complete successfully
- **Dependency issues**: Run `npm run download` to update core InlineJS dependency

### Adding Dependencies
```bash
npm install <package-name>
npm run download  # Update core InlineJS dependency
```

### Publishing Process (for reference)
```bash
npm run upload    # Builds and publishes to npm
npm run push      # Downloads latest deps, builds, and publishes
```

## Common Output Reference

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Root Structure
```
/home/runner/work/inlinejs-element/inlinejs-element/
├── src/                    # TypeScript source code
├── lib/                    # Compiled TypeScript output  
├── dist/                   # Webpack browser bundles
├── node_modules/           # Dependencies
├── package.json           # Project configuration
├── tsconfig.json          # CommonJS TypeScript config
├── tsconfig.esm.json      # ESM TypeScript config
├── webpack.config.js      # Development webpack config
├── webpack2.config.js     # Production webpack config
├── package-lock.json      # Dependency lock file
├── README.md              # Basic project info
├── LICENSE                # MIT License
└── .gitignore             # Git ignore rules
```

### npm scripts summary
```
npm install           # Install dependencies (5-22 seconds)
npm test             # Run tests (fails - no tests exist)
npm run ts-test      # Run TypeScript tests (fails - no tests exist)
npm run compile      # TypeScript compilation (3 seconds)
npm run build        # Webpack bundling (6.8 seconds)
npm run download     # Update InlineJS dependency (2 seconds)
npm run upload       # Build and publish to npm
npm run push         # Download, build, and publish
```

### Expected Build Output Sizes
```
dist/inlinejs-element.js: ~501KB (development bundle)
dist/inlinejs-element.min.js: ~124KB (production bundle)
dist/inlinejs-element.min.js.LICENSE.txt: 188 bytes
lib/common/ directory: CommonJS modules with .d.ts files
lib/esm/ directory: ES modules with .d.ts files
```

## Key Source Files

### Core Components
- `src/components/element.ts` -- Base CustomElement class (18.6KB)
- `src/components/native.ts` -- Native element implementation
- `src/components/resource.ts` -- Resource element implementation  
- `src/components/resource-target.ts` -- Resource target element implementation

### Entry Points
- `src/index.ts` -- Main library exports
- `src/entry.ts` -- Initialization function
- `src/inlinejs-element.ts` -- Browser bundle entry point

### Configuration
- `package.json` -- Contains all npm scripts and dependencies
- `tsconfig.json` -- CommonJS TypeScript compilation settings
- `tsconfig.esm.json` -- ESM TypeScript compilation settings
- `webpack.config.js` -- Development webpack configuration
- `webpack2.config.js` -- Production webpack configuration with minification

## Known Limitations

- **NO TESTS**: Test infrastructure exists in devDependencies but no test files are implemented
- **NO LINTING**: No code quality or formatting tools configured
- **BROWSER-ONLY**: Library depends on HTMLElement and cannot run in Node.js directly
- **NO CI/CD**: No automated build or deployment pipeline
- **DEPENDENCY VULNERABILITIES**: npm audit shows 3 moderate severity vulnerabilities (expected)

## Timing Expectations

- `npm install`: 12-22 seconds (varies if cached) - NEVER CANCEL, set timeout to 60+ seconds
- `npm run compile`: 3 seconds - NEVER CANCEL, set timeout to 60+ seconds
- `npm run build`: 6.8 seconds - NEVER CANCEL, set timeout to 60+ seconds
- `npm run download`: 2 seconds

Always wait for commands to complete. These are fast operations but set appropriate timeouts to avoid premature cancellation.