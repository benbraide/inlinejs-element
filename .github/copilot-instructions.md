# GitHub Copilot Instructions for InlineJS Element

## Project Overview

InlineJS Element is a TypeScript library that extends the [InlineJS reactive framework](https://github.com/benbraide/inlinejs) to provide custom HTML elements with reactive capabilities. The library allows developers to embed JavaScript code directly in HTML using custom elements as context.

## Architecture & Key Concepts

### Core Components

1. **CustomElement** (`src/components/element.ts`): Base class for all custom elements
   - Extends HTMLElement with reactive capabilities
   - Manages element scope, properties, and attribute handling
   - Handles resource management and lifecycle events

2. **NativeElement** (`src/components/native.ts`): Template-based custom elements
   - Used for creating reusable HTML templates
   - Hidden by default (`display: none`)
   - Stores original attributes for template rendering

3. **ResourceElement** & **ResourceTargetElement**: Resource management components
   - Handle dynamic loading and management of external resources
   - Support for mixed resource types (scripts, styles, etc.)

### Decorators

The project extensively uses TypeScript decorators for property definitions:

```typescript
@Property({ type: 'string', update: true })
public myProperty: string = '';
```

Key decorator features:
- **@Property**: Defines reactive properties with type checking
- **@Register**: Registers custom elements automatically
- Properties support type conversion, initial values, and update handling

### Build System

- **TypeScript**: ES2015 target with experimental decorators
- **Webpack**: Dual build system for CommonJS and ESM modules
- **Output**: `lib/common/` (CommonJS) and `lib/esm/` (ESM)

## Coding Conventions

### File Organization

```
src/
├── components/          # Custom element implementations
├── decorators/         # Property and registration decorators
├── utilities/          # Helper functions and utilities
├── types.ts           # TypeScript type definitions
├── entry.ts           # Main entry point
└── index.ts           # Public API exports
```

### Naming Conventions

- **Classes**: PascalCase (e.g., `CustomElement`, `NativeElement`)
- **Methods**: camelCase with optional trailing underscore for protected/private (e.g., `HandleElementScopeCreatedPrefix_`)
- **Properties**: camelCase with trailing underscore for private fields (e.g., `attributes_`, `options_`)
- **Interfaces**: PascalCase with 'I' prefix (e.g., `ICustomElement`, `IProperty`)
- **Types**: PascalCase (e.g., `CustomElementResourceType`)

### TypeScript Patterns

1. **Strict typing**: Always define proper types for parameters and return values
2. **Interface segregation**: Use specific interfaces for different concerns
3. **Generics**: Use generics for reusable components, especially with InlineJS integration
4. **Decorators**: Use property decorators for reactive property definitions

### Error Handling

- Use `JournalTry` from InlineJS for error logging
- Implement graceful fallbacks for missing dependencies
- Validate inputs and provide meaningful error messages

### InlineJS Integration

The project heavily integrates with InlineJS utilities:

```typescript
import { 
    GetGlobal, 
    FindAncestor, 
    BootstrapAndAttach,
    EvaluateLater 
} from "@benbraide/inlinejs";
```

Common patterns:
- Use `WaitForGlobal()` to ensure InlineJS is loaded
- Use `FindAncestor` for component hierarchy navigation
- Use `BootstrapAndAttach` for element initialization
- Use `EvaluateLater` for deferred expression evaluation

## Development Guidelines

### Adding New Components

1. Extend `CustomElement` base class
2. Implement required interfaces (`ICustomElement`, etc.)
3. Use property decorators for reactive properties
4. Register using `RegisterCustomElement` utility
5. Follow the lifecycle pattern: constructor → properties → element scope creation

### Adding New Properties

```typescript
@Property({ 
    type: 'string',      // Type validation
    update: true,        // Trigger updates
    initial: '',         // Default value
    checkStoredObject: false // Storage integration
})
public myProperty: string = '';
```

### Testing

- Unit tests should be placed alongside source files with `.spec.ts` extension
- Use JSDOM for DOM testing
- Test both property reactivity and element lifecycle
- Mock InlineJS dependencies when needed

### Building & Distribution

- Run `npm run compile` for TypeScript compilation
- Run `npm run build` for webpack bundling
- Both CommonJS and ESM builds are generated automatically
- Ensure backward compatibility with ES2015 target

## Common Patterns

### Resource Management

```typescript
// Adding resources dynamically
AddResource(info: IResourceMixedItemInfo): void

// Resource type checking
const type = ResolveResourceType(url);
```

### Element Registration

```typescript
// Automatic registration with decorator
@Register('my-element')
export class MyElement extends CustomElement {}

// Manual registration
RegisterCustomElement('my-element', MyElement);
```

### Property Handling

```typescript
// Reactive property with custom handler
@Property({ 
    type: 'object',
    handler: (value, context) => {
        // Custom property change logic
    }
})
public data: any = {};
```

### Attribute Processing

```typescript
// Handling boolean attributes
protected IsBooleanAttribute(name: string): boolean

// Handling native attributes
protected HandleNativeAttribute(name: string, value: string): boolean
```

## Dependencies

- **@benbraide/inlinejs**: Core reactive framework dependency
- **TypeScript**: Development dependency for compilation
- **Webpack**: Build tool for bundling
- **Mocha + Chai**: Testing framework (when tests are present)

## Best Practices

1. **Always import from @benbraide/inlinejs** for framework utilities
2. **Use decorators** for property definitions instead of manual setup
3. **Follow the lifecycle pattern** for custom elements
4. **Implement proper cleanup** in disconnectedCallback
5. **Use snake-case** for HTML attributes and element names
6. **Provide TypeScript definitions** for all public APIs
7. **Test across both CommonJS and ESM builds**
8. **Maintain backward compatibility** with existing element definitions

## Anti-Patterns to Avoid

- Don't manually manipulate DOM in property setters (use reactive patterns)
- Don't skip type definitions for public APIs
- Don't break the element lifecycle pattern
- Don't hardcode element names (use registration utilities)
- Don't ignore InlineJS integration patterns
- Don't mix CommonJS and ESM imports in the same file