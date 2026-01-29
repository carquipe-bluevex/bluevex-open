# Component Template

This directory contains component templates for consistent development.

## Usage

1. Copy the template file
2. Rename to your component name
3. Update the interface and implementation
4. Add tests in the `__tests__` directory
5. Export from the index file

## Template Structure

```
component-name/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── index.ts
└── README.md (optional)
```

## Naming Conventions

- Files: PascalCase (ComponentName.tsx)
- Directories: kebab-case (component-name/)
- Interfaces: ComponentNameProps
- Tests: ComponentName.test.tsx