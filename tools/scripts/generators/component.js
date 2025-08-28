#!/usr/bin/env node

/**
 * Component Generator for Enterprise React Starter
 * 
 * Usage: node tools/scripts/generators/component.js ComponentName
 */

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
  console.error('❌ Please provide a component name');
  console.log('Usage: node tools/scripts/generators/component.js ComponentName');
  process.exit(1);
}

const componentDir = path.join(__dirname, '../../../packages/ui/src/components', componentName.toLowerCase());
const componentFile = path.join(componentDir, 'index.tsx');

const template = `import React from 'react';
import { cn } from '../../utils';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;

// Create directory if it doesn't exist
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

// Write component file
fs.writeFileSync(componentFile, template);

// Update index.ts
const indexPath = path.join(__dirname, '../../../packages/ui/src/components/index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');
const newExport = `export { ${componentName} } from './${componentName.toLowerCase()}';`;

if (!indexContent.includes(newExport)) {
  fs.appendFileSync(indexPath, `\n${newExport}`);
}

console.log(`✅ Generated component: ${componentName}`);
console.log(`📁 Location: ${componentFile}`);
console.log(`📦 Added export to index.ts`);